import { db } from '../../utils/db';
import { notifications } from '../../database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(event.context.params?.id as string);
    
    const [updated] = await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id))
      .returning();

    return updated;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update notification',
    });
  }
});
