'use strict';

/**
 * Role-Based Access Control middleware factory.
 * Usage: requireRole('super_admin') or requireRole(['super_admin','tenant_admin'])
 */
const requireRole = (...allowedRoles) => {
    const roles = allowedRoles.flat();
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Authentication required.' });
        }
        const userRole = req.user.role;
        if (!roles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required role: [${roles.join(', ')}]. Your role: ${userRole}`,
            });
        }
        next();
    };
};

/**
 * Tenant isolation middleware.
 * Ensures non-super_admin users can only access their own tenant's data.
 */
const tenantIsolation = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required for isolation.' });
    }
    
    if (req.user.role === 'super_admin') {
        return next();
    }

    if (!req.user.tenant_id) {
        return res.status(403).json({ success: false, message: 'Access denied. Account not associated with a tenant.' });
    }

    req.tenantId = req.user.tenant_id;
    next();
};

module.exports = { requireRole, tenantIsolation };
