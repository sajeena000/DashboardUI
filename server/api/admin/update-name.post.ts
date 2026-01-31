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

    const body = await readBody(event);
    const { name } = body;

    if (!name || name.trim().length === 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Name is required',
        });
    }

    try {
        const [updatedAdmin] = await db.update(admins)
            .set({
                name: name.trim(),
                updatedAt: new Date()
            })
            .where(eq(admins.id, parseInt(sessionId)))
            .returning();

        if (!updatedAdmin) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Admin not found',
            });
        }

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
            statusMessage: 'Failed to update name',
        });
    }
});
