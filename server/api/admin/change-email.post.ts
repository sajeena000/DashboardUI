import { db } from '../../utils/db';
import { admins } from '../../database/schema';
import { verifyPassword } from '../../utils/password';
import { eq, and, ne } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    const sessionId = getCookie(event, 'admin-session');

    if (!sessionId) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Not authenticated',
        });
    }

    const body = await readBody(event);
    const { newEmail, currentPassword } = body;

    if (!newEmail || !currentPassword) {
        throw createError({
            statusCode: 400,
            statusMessage: 'New email and current password are required',
        });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid email format',
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

        // Check if email is already taken by another admin
        const [existingAdmin] = await db.select()
            .from(admins)
            .where(and(eq(admins.email, newEmail), ne(admins.id, admin.id)))
            .limit(1);

        if (existingAdmin) {
            throw createError({
                statusCode: 409,
                statusMessage: 'Email is already in use',
            });
        }

        // Update email
        const [updatedAdmin] = await db.update(admins)
            .set({
                email: newEmail,
                updatedAt: new Date()
            })
            .where(eq(admins.id, parseInt(sessionId)))
            .returning();

        return {
            id: updatedAdmin.id,
            name: updatedAdmin.name,
            email: updatedAdmin.email,
            isPrimary: updatedAdmin.isPrimary,
            allowRegistration: updatedAdmin.allowRegistration
        };
    } catch (error: any) {
        if (error.statusCode) throw error;
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to update email',
        });
    }
});
