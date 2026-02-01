import { db } from '../../utils/db';
import { teamMembers } from '../../database/schema';
import { desc, count, ilike, or, eq, and } from 'drizzle-orm';
import { getPaginationParams, paginateResize } from '../../utils/pagination';

export default defineEventHandler(async (event) => {
  try {
    const { page, limit, offset } = getPaginationParams(event);
    const query = getQuery(event);
    const search = query.search as string;
    const status = query.status as string;

    const conditions = [];

    if (search) {
      const searchPattern = `%${search}%`;
      conditions.push(or(
        ilike(teamMembers.name, searchPattern),
        ilike(teamMembers.email, searchPattern),
        ilike(teamMembers.role, searchPattern)
      ));
    }

    if (status === 'online') {
      conditions.push(eq(teamMembers.online, true));
    } else if (status === 'offline') {
      conditions.push(eq(teamMembers.online, false));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [total] = await db.select({ count: count() }).from(teamMembers).where(whereClause);

    // Select all members, ordered by newest first
    const members = await db.select().from(teamMembers).where(whereClause).orderBy(desc(teamMembers.createdAt)).limit(limit).offset(offset);
    return paginateResize(members, Number(total?.count || 0), page, limit);
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch team members',
    });
  }
});