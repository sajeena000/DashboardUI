import { db } from '../../utils/db';
import { settings } from '../../database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  try {
    const existing = await db.select().from(settings).limit(1);

    let result;
    if (existing.length > 0) {
        result = await db.update(settings)
            .set({
                name: body.name,
                email: body.email,
                notifications: body.notifications,
                userRole: body.userRole,
                updatedAt: new Date()
            })
            .where(eq(settings.id, existing[0].id))
            .returning();
    } else {
        result = await db.insert(settings).values({
            name: body.name,
            email: body.email,
            notifications: body.notifications,
            userRole: body.userRole ?? 'admin'
        }).returning();
    }

    return result[0];
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to update settings',
    });
  }
});
