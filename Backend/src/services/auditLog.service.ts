import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuditLogPayload {
    tenantId?: string;
    userId?: string;
    action: string;
    ipAddress?: string;
    oldValue?: any;
    newValue?: any;
}

/**
 * Service to immmutably log all critical actions across the system.
 */
export const createAuditLog = async (payload: AuditLogPayload) => {
    try {
        await prisma.auditLog.create({
            data: {
                tenantId: payload.tenantId,
                userId: payload.userId,
                action: payload.action,
                ipAddress: payload.ipAddress,
                oldValue: payload.oldValue ? JSON.parse(JSON.stringify(payload.oldValue)) : null,
                newValue: payload.newValue ? JSON.parse(JSON.stringify(payload.newValue)) : null,
                timestamp: new Date()
            }
        });
    } catch (error) {
        console.error('Failed to create audit log. Critical Failure:', error);
        // Depending on strictness, we might throw an error here to prevent the action 
        // from succeeding if logging fails.
    }
};
