import { db } from '../../utils/db'
import { contactSubmissions } from '../../database/schema'
import { desc, count, eq } from 'drizzle-orm'
import { getPaginationParams, paginateResize } from '../../utils/pagination'

export default defineEventHandler(async (event) => {
  const { page, limit, offset } = getPaginationParams(event)
  const query = getQuery(event)
  const status = query.status as string

  let whereClause = undefined
  if (status && status !== 'all') {
    whereClause = eq(contactSubmissions.status, status as any)
  }

  const [total] = await db.select({ count: count() }).from(contactSubmissions).where(whereClause)

  const contacts = await db
    .select()
    .from(contactSubmissions)
    .where(whereClause)
    .orderBy(desc(contactSubmissions.createdAt))
    .limit(limit)
    .offset(offset)
  
  return paginateResize(contacts, Number(total?.count || 0), page, limit)
})
