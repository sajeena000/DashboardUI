import { db } from '../../utils/db';
import { admins } from '../../database/schema';
import { hashPassword } from '../../utils/password';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { name, email, password, confirmPassword } = body;

    // Validate required fields
    if (!name || !email || !password || !confirmPassword) {
        throw createError({
            statusCode: 400,
            statusMessage: 'All fields are required',
        });
    }

    if (password !== confirmPassword) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Passwords do not match',
        });
    }

    if (password.length < 6) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Password must be at least 6 characters',
        });
    }

    try {
        // Check if registration is enabled (only primary admin can enable this)
        const [primaryAdmin] = await db.select().from(admins).where(eq(admins.isPrimary, true)).limit(1);

        if (!primaryAdmin || !primaryAdmin.allowRegistration) {
            throw createError({
                statusCode: 403,
                statusMessage: 'Registration is currently disabled',
            });
        }

        // Check if email already exists
        const [existingAdmin] = await db.select().from(admins).where(eq(admins.email, email)).limit(1);
        if (existingAdmin) {
            throw createError({
                statusCode: 409,
                statusMessage: 'An account with this email already exists',
            });
        }

        // Hash password and create new admin
        const passwordHash = await hashPassword(password);
        const [newAdmin] = await db.insert(admins).values({
            name,
            email,
            passwordHash,
            isPrimary: false,
            allowRegistration: false
        }).returning();

        return {
            message: 'Account created successfully',
            admin: {
                id: newAdmin.id,
                name: newAdmin.name,
                email: newAdmin.email
            }
        };
    } catch (error: any) {
        if (error.statusCode) throw error;
        throw createError({
            statusCode: 500,
            statusMessage: 'Registration failed',
        });
    }
});
