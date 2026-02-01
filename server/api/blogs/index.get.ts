import { db } from '../../utils/db'
import { blogPosts } from '../../database/schema'
import { desc, count } from 'drizzle-orm'
import { getPaginationParams, paginateResize } from '../../utils/pagination'

export default defineEventHandler(async (event) => {
  const { page, limit, offset } = getPaginationParams(event)

  const [total] = await db.select({ count: count() }).from(blogPosts)
  
  const blogs = await db
    .select()
    .from(blogPosts)
    .orderBy(desc(blogPosts.createdAt))
    .limit(limit)
    .offset(offset)
  
  return paginateResize(blogs, Number(total?.count || 0), page, limit)
})
