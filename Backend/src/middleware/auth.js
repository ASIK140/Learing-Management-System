'use strict';
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    try {
        let token;
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else if (req.query.token) {
            token = req.query.token;
        }

        if (!token) {
            return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cybershield_dev_secret');
        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token expired.' });
        }
        return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Forbidden. You lack the required permissions.' });
        }
        next();
    };
};

module.exports = { authenticate, authorizeRoles };
