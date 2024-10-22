//const jwt = require('express-jwt');
const { expressjwt: jwt } = require('express-jwt');
const { secret } = require('config.json');
const db = require('_helpers/db');

module.exports = authorize;

function authorize(roles = []) {
    // roles param can be a single role string (e.g., 'Admin') or an array of roles (e.g., ['Admin', 'Manager'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        // Authenticate JWT tokens and attach user to request object {req.user}
        jwt({ secret, algorithms: ['HS256'] }),

        // Authorize based on user role
        async (req, res, next) => {
            try {
                const account = await db.Account.findByPk(req.user.id);
                
                if (!account || (roles.length && !roles.includes(account.role))) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }

                // Authentication and authorization successful
                req.user.role = account.role;
                const refreshTokens = await account.getRefreshTokens();
                req.user.ownsToken = token => !!refreshTokens.find(x => x.token === token);
                next();
            } catch (error) {
                return next(error);
            }
        }
    ];
}