import { db } from '../../utils/db'
import { blogPosts } from '../../database/schema'
import { desc, count, ilike, or, isNotNull, isNull, and } from 'drizzle-orm'
import { getPaginationParams, paginateResize } from '../../utils/pagination'

export default defineEventHandler(async (event) => {
  const { page, limit, offset } = getPaginationParams(event)
  const query = getQuery(event)
  const status = query.status as string
  const search = query.search as string

  const conditions = []

  // Filter by publish status
  if (status === 'published') {
    conditions.push(isNotNull(blogPosts.publishedAt))
  } else if (status === 'draft') {
    conditions.push(isNull(blogPosts.publishedAt))
  }

  // Search by title or slug
  if (search) {
    const searchPattern = `%${search}%`
    conditions.push(or(
      ilike(blogPosts.title, searchPattern),
      ilike(blogPosts.slug, searchPattern)
    ))
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  const [total] = await db.select({ count: count() }).from(blogPosts).where(whereClause)
  
  const blogs = await db
    .select()
    .from(blogPosts)
    .where(whereClause)
    .orderBy(desc(blogPosts.createdAt))
    .limit(limit)
    .offset(offset)
  
  return paginateResize(blogs, Number(total?.count || 0), page, limit)
})

