import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

export enum Roles {
    SUPER_ADMIN = 'SUPER_ADMIN',
    CISO = 'CISO',
    TENANT_ADMIN = 'TENANT_ADMIN',
    CONTENT_CREATOR = 'CONTENT_CREATOR',
    MANAGER = 'MANAGER',
    EMPLOYEE = 'EMPLOYEE',
    NGO_ADMIN = 'NGO_ADMIN'
}

/**
 * Middleware to strictly check allowed roles before accessing specific route logic.
 */
export const authorizeRoles = (...roles: Roles[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ error: 'Not authorized' });
        }

        if (!roles.includes(req.user.role as Roles)) {
            return res.status(403).json({
                error: `Role ${req.user.role} is not permitted to access this resource`
            });
        }

        next();
    };
};
