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
        const [admin] = await db.select().from(admins).where(eq(admins.id, parseInt(sessionId))).limit(1);

        if (!admin) {
            // Clear invalid session
            deleteCookie(event, 'admin-session', { path: '/' });
            throw createError({
                statusCode: 401,
                statusMessage: 'Session invalid',
            });
        }

        return {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            isPrimary: admin.isPrimary,
            allowRegistration: admin.allowRegistration
        };
    } catch (error: any) {
        if (error.statusCode) throw error;
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to get user info',
        });
    }
});
