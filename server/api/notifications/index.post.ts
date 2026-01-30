import { db } from '../../utils/db';
import { notifications } from '../../database/schema';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    const [newNotification] = await db.insert(notifications).values({
      text: body.text,
      type: body.type || 'info',
      color: body.color || 'bg-indigo-500',
    }).returning();

    return {
      id: newNotification.id,
      text: newNotification.text,
      type: newNotification.type,
      color: newNotification.color,
      isRead: newNotification.isRead,
      time: 'Just now'
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create notification',
    });
  }
});
