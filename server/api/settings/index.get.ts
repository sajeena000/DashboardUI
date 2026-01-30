import { db } from '../../utils/db';
import { settings } from '../../database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  try {
    const result = await db.select().from(settings).limit(1);

    if (result.length > 0) {
      return result[0];
    } else {
      return {
        name: 'Intern Developer',
        email: 'dev@dashboard.com',
        notifications: true,
        userRole: 'admin'
      };
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch settings',
    });
  }
});
