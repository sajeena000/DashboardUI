import { db } from '../../utils/db';
import { admins } from '../../database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    const sessionId = getCookie(event, 'admin-session');

    if (!sessionId) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Not authenticated',
        });
    }

    try {
        // Get current admin
        const [admin] = await db.select().from(admins).where(eq(admins.id, parseInt(sessionId))).limit(1);

        if (!admin) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Admin not found',
            });
        }

        // Only primary admin can toggle registration
        if (!admin.isPrimary) {
            throw createError({
                statusCode: 403,
                statusMessage: 'Only the primary admin can change registration settings',
            });
        }

        // Toggle registration
        const [updatedAdmin] = await db.update(admins)
            .set({
                allowRegistration: !admin.allowRegistration,
                updatedAt: new Date()
            })
            .where(eq(admins.id, parseInt(sessionId)))
            .returning();

        return {
            allowRegistration: updatedAdmin.allowRegistration,
            message: updatedAdmin.allowRegistration ? 'Registration enabled' : 'Registration disabled'
        };
    } catch (error: any) {
        if (error.statusCode) throw error;
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to toggle registration',
        });
    }
});
