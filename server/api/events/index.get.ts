import { db } from '../../utils/db'
import { events } from '../../database/schema'
import { desc, count } from 'drizzle-orm'
import { getPaginationParams, paginateResize } from '../../utils/pagination'

export default defineEventHandler(async (event) => {
  const { page, limit, offset } = getPaginationParams(event)

  const [total] = await db.select({ count: count() }).from(events)

  const eventsList = await db
    .select()
    .from(events)
    .orderBy(desc(events.eventDate))
    .limit(limit)
    .offset(offset)
  
  return paginateResize(eventsList, Number(total?.count || 0), page, limit)
})
