import { db } from '../../utils/db'
import { contactSubmissions } from '../../database/schema'
import { desc, count, eq, ilike, or, and } from 'drizzle-orm'
import { getPaginationParams, paginateResize } from '../../utils/pagination'

export default defineEventHandler(async (event) => {
  const { page, limit, offset } = getPaginationParams(event)
  const query = getQuery(event)
  const status = query.status as string
  const search = query.search as string

  const conditions = []

  // Filter by status
  if (status && status !== 'all') {
    conditions.push(eq(contactSubmissions.status, status as any))
  }

  // Search by name, email, or subject
  if (search) {
    const searchPattern = `%${search}%`
    conditions.push(or(
      ilike(contactSubmissions.name, searchPattern),
      ilike(contactSubmissions.email, searchPattern),
      ilike(contactSubmissions.subject, searchPattern)
    ))
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

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

