import { db } from '../../utils/db';
import { activityLogs } from '../../database/schema';
import { desc } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  try {
    // Select all activity logs, ordered by newest first, limited to 20
    const activities = await db
      .select()
      .from(activityLogs)
      .orderBy(desc(activityLogs.timestamp))
      .limit(20);

    // Format the timestamp as a readable time string
    return activities.map(activity => ({
      id: activity.id,
      text: activity.text,
      type: activity.type,
      time: activity.timestamp 
        ? new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : 'Unknown'
    }));
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch activity logs',
    });
  }
});
