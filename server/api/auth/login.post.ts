import { db } from '../../utils/db';
import { admins } from '../../database/schema';
import { verifyPassword } from '../../utils/password';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { email, password } = body;

    if (!email || !password) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Email and password are required',
        });
    }

    try {
        // Find admin by email
        const [admin] = await db.select().from(admins).where(eq(admins.email, email)).limit(1);

        if (!admin) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Invalid email or password',
            });
        }

        // Verify password
        const isValid = await verifyPassword(password, admin.passwordHash);
        if (!isValid) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Invalid email or password',
            });
        }

        // Set auth cookie with admin ID
        setCookie(event, 'admin-session', String(admin.id), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/'
        });

        // Return admin info (without password hash)
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
            statusMessage: 'Login failed',
        });
    }
});
