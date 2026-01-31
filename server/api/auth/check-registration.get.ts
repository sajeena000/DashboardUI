import { db } from '../../utils/db';
import { admins } from '../../database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async () => {
    try {
        // Check if registration is enabled (by primary admin)
        const [primaryAdmin] = await db.select().from(admins).where(eq(admins.isPrimary, true)).limit(1);

        return {
            registrationEnabled: primaryAdmin?.allowRegistration ?? false
        };
    } catch (error) {
        return {
            registrationEnabled: false
        };
    }
});
