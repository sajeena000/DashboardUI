import { db } from '../../utils/db';
import { notifications } from '../../database/schema';

export default defineEventHandler(async (event) => {
  try {
    await db
      .update(notifications)
      .set({ isRead: true });

    return { success: true };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to mark all notifications as read',
    });
  }
});
