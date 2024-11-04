const { expressjwt: jwt } = require('express-jwt');
const { secret } = require('config.json');
const db = require('_helpers/db');

module.exports = authorize;

function authorize(roles = []) {
    // Convert single role to array if string is provided
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        // Authenticate JWT token and attach decoded token to request as req.auth
        jwt({ 
            secret, 
            algorithms: ['HS256'],
            requestProperty: 'auth'
        }),

        // Authorize based on user role
        async (req, res, next) => {
            try {
                const account = await db.Account.findByPk(req.auth.id);

                if (!account) {
                    return res.status(401).json({ 
                        success: false,
                        message: 'Account no longer exists' 
                    });
                }

                if (!account.isVerified) {
                    return res.status(401).json({
                        success: false,
                        message: 'Account is not verified'
                    });
                }

                // Attach basic user info to request
                req.user = {
                    id: account.id,
                    role: account.role,
                    email: account.email
                };

                // For routes with :id parameter, implement access control
                if (req.params.id) {
                    const requestedId = parseInt(req.params.id);
                    const isAdmin = account.role === 'Admin';
                    const isSelfAccess = requestedId === account.id;

                    // Admin can access all records
                    if (isAdmin) {
                        next();
                        return;
                    }

                    // Non-admin users can only access their own records
                    if (!isSelfAccess) {
                        return res.status(403).json({
                            success: false,
                            message: 'Access denied - You can only access your own records'
                        });
                    }
                }

                // Check role-based authorization if roles are specified
                if (roles.length && !roles.includes(account.role)) {
                    return res.status(403).json({
                        success: false,
                        message: 'Access denied - Insufficient role permissions'
                    });
                }

                // Add method to check if user owns a refresh token
                const refreshTokens = await account.getRefreshTokens();
                req.user.ownsToken = token => !!refreshTokens.find(x => x.token === token);

                // Log authorization attempt
                console.log(`Authorization successful for user ${account.email} with role ${account.role}`);

                next();
            } catch (error) {
                console.error('Authorization error:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Internal server error during authorization'
                });
            }
        }
    ];
}