// ==================================================================================================================
//    Authentication & Authorization Middleware
//    Secures routes and enforces RBAC based on JWT tokens.
// ==================================================================================================================
const { verifyToken } = require('../utils/jwt');

const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
        }
        return res.status(401).json({ success: false, message: 'Invalid authentication token.' });
    }
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.roles) {
            return res.status(403).json({ success: false, message: 'You do not have permission to access the Master Dashboard.' });
        }

        // Check if user has at least one of the required roles
        const hasRole = req.user.roles.some(role => roles.includes(role));
        
        if (!hasRole) {
            return res.status(403).json({ success: false, message: 'You do not have permission to access the Master Dashboard.' });
        }
        
        next();
    };
};

module.exports = {
    authenticate,
    authorizeRoles
};
