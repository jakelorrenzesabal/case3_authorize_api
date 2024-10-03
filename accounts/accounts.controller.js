
const express = require('express');
const router = express. Router();
const Joi= require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const accountService = require('./account.service');

router.post('/authenticate', authenticateSchema, authenticate);
router.post('/refresh-token', refreshToken);
router.post('/revoke-token', authorize(), revokeTokenSchema, revokeToken); 
router.post('/register', registerSchema, register);
router.post('/verify-email', verifyEmailSchema, verifyEmail);
router.post('/forgot-password', forgotPasswordSchema, forgotPassword);
router.post('/validate-reset-token', validateResetTokenSchema, validateResetToken);
router.post('/reset-password', resetPasswordSchema, resetPassword);
router.get('/', authorize (Role.Admin), getAll);
router.get('/:id', authorize(), getById);
router.post('/', authorize (Role.Admin), createSchema, create); 
router.put('/:id', authorize(), updateSchema, update); 
router.delete('/:id', authorize(), _delete);

module.exports = router;


function authenticateSchema(req, res, next) { const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
 });
 validateRequest(req, next, schema);
}
function authenticate(req, res, next) {
     const { email, password } = req.body;
     const ipAddress = req.ip;
        accountService.authenticate({ email, password, ipAddress })
        .then(({refreshToken, ...account }) => {
             setTokenCookie(res, refreshToken);
            res.json(account);
    })
      .catch(next);

}
function refreshToken (req, res, next) {
    const token = req.cookies.refreshToken;
    const ipAddress = req.ip;
       accountService.refreshToken({ token, ipAddress })
       .then(({refreshToken, ...account }) => {

        setTokenCookie(res, refreshToken); 
         res.json(account);
        })
         .catch(next);
}


function revokeTokenSchema(req, res, next) { 
    const schema = Joi.object({
        token: Joi.string().empty('')
    });
    validateRequest(req, next, schema);
}
function revokeToken (req, res, next) {
     // accept token from request body or cookie
     const token = req.body.token || req.cookies.refreshToken; 
     const ipAddress = req.ip;

     if (!token) return res.status(400).json({ message: 'Token is required' });
// users can revoke their own tokens and admins can revoke any tokens
     if (!req.user.ownsToken (token) && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
     }

   accountService.revokeToken({ token, ipAddress })
      .then(() => res.json({ message: 'Token revoked' }))
      .catch(next);
}


function registerSchema(req, res, next) { 
    const schema = Joi.object({
      title: Joi.string().required(),
      firstName: Joi.string().required(), LastName: Joi.string().required(),
      email: Joi.string().enail().required(),
      password: Joi.string().min(6).required(),
      confirmPassword: Joi.string().valid(Joi.ref('password')).required(), 
      acceptTerms: Joi.boolean().valid(true).required()
  });
    validateRequest(req, next, schema);
}

