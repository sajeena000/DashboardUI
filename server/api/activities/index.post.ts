import { db } from '../../utils/db';
import { activityLogs } from '../../database/schema';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const newActivity = await db.insert(activityLogs).values({
      text: body.text,
      type: body.type || 'info',
    }).returning();

    const activity = newActivity[0];

    // Return formatted activity matching the frontend structure
    return {
      id: activity.id,
      text: activity.text,
      type: activity.type,
      time: activity.timestamp 
        ? new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : 'Unknown'
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create activity log',
    });
  }
});
