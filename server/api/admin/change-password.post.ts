import { db } from '../../utils/db';
import { admins } from '../../database/schema';
import { verifyPassword, hashPassword } from '../../utils/password';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    const sessionId = getCookie(event, 'admin-session');

    if (!sessionId) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Not authenticated',
        });
    }

    const body = await readBody(event);
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || !newPassword || !confirmPassword) {
        throw createError({
            statusCode: 400,
            statusMessage: 'All password fields are required',
        });
    }

    if (newPassword !== confirmPassword) {
        throw createError({
            statusCode: 400,
            statusMessage: 'New passwords do not match',
        });
    }

    if (newPassword.length < 6) {
        throw createError({
            statusCode: 400,
            statusMessage: 'New password must be at least 6 characters',
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

        // Verify current password
        const isValid = await verifyPassword(currentPassword, admin.passwordHash);
        if (!isValid) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Current password is incorrect',
            });
        }

        // Hash new password and update
        const newPasswordHash = await hashPassword(newPassword);
        await db.update(admins)
            .set({
                passwordHash: newPasswordHash,
                updatedAt: new Date()
            })
            .where(eq(admins.id, parseInt(sessionId)));

        return {
            message: 'Password changed successfully'
        };
    } catch (error: any) {
        if (error.statusCode) throw error;
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to change password',
        });
    }
});
