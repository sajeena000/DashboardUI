import { db } from '../../utils/db'
import { events } from '../../database/schema'
import { desc, count, ilike, or, gte, lt, and } from 'drizzle-orm'
import { getPaginationParams, paginateResize } from '../../utils/pagination'

export default defineEventHandler(async (event) => {
  const { page, limit, offset } = getPaginationParams(event)
  const query = getQuery(event)
  const status = query.status as string
  const search = query.search as string

  const conditions = []
  const now = new Date()

  // Filter by timing
  if (status === 'upcoming') {
    conditions.push(gte(events.eventDate, now))
  } else if (status === 'past') {
    conditions.push(lt(events.eventDate, now))
  }

  // Search by title or location
  if (search) {
    const searchPattern = `%${search}%`
    conditions.push(or(
      ilike(events.title, searchPattern),
      ilike(events.location, searchPattern)
    ))
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  const [total] = await db.select({ count: count() }).from(events).where(whereClause)

  const eventsList = await db
    .select()
    .from(events)
    .where(whereClause)
    .orderBy(desc(events.eventDate))
    .limit(limit)
    .offset(offset)
  
  return paginateResize(eventsList, Number(total?.count || 0), page, limit)
})

