//const jwt = require('express-jwt');
const { expressjwt: jwt } = require('express-jwt');
const { secret } = require('config.json');
const db = require('_helpers/db');

module.exports = authorize;

function authorize(roles = [], allowSelfAccess = true) {
    // roles param can be a single role string (e.g Role.User or 'User')
    // or an array of roles (e.g [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        // authenticate JWT token and attach decoded token to request as req.auth
        jwt({ 
            secret, 
            algorithms: ['HS256'],
            requestProperty: 'auth' // this specifies where the decoded token will be attached
        }),

        // authorize based on user role
        async (req, res, next) => {
            try {
                const account = await db.Account.findByPk(req.auth.id);

                if (!account) {
                    return res.status(401).json({ message: 'Account no longer exists' });
                }

                // Check for role-based authorization
                if (roles.length && !roles.includes(account.role)) {
                    // If self-access is allowed, check if the requested ID matches the authenticated user's ID
                    if (allowSelfAccess && req.params.id && parseInt(req.params.id) === account.id) {
                        // Allow access if it's the user's own record
                    } else {
                        return res.status(403).json({ message: 'Unauthorized - Insufficient role permissions' });
                    }
                }

                // authentication and authorization successful
                // attach user and role to request object
                req.user = {
                    ...req.auth,
                    role: account.role
                };

                // add method to check if user owns a refresh token
                const refreshTokens = await account.getRefreshTokens();
                req.user.ownsToken = token => !!refreshTokens.find(x => x.token === token);

                // If self-access is allowed, ensure the user can only access their own data
                if (allowSelfAccess && req.params.id) {
                    if (parseInt(req.params.id) !== account.id && !roles.includes(account.role)) {
                        return res.status(403).json({ message: 'Access to other user\'s data is forbidden' });
                    }
                }

                next();
            } catch (error) {
                next(error);
            }
        }
    ];
}