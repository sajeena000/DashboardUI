import { db } from '../../utils/db';
import { notifications } from '../../database/schema';
import { desc } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  try {
    const notifs = await db
      .select()
      .from(notifications)
      .orderBy(desc(notifications.createdAt))
      .limit(20);

    return notifs.map(n => ({
      id: n.id,
      text: n.text,
      type: n.type,
      color: n.color,
      isRead: n.isRead,
      time: n.createdAt 
        ? formatRelativeTime(new Date(n.createdAt))
        : 'Unknown'
    }));
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch notifications',
    });
  }
});

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
}
