import { db } from '../../utils/db'
import { projects, clients } from '../../database/schema'
import { desc, eq, count, sql, ilike, or, and } from 'drizzle-orm'
import { getPaginationParams, paginateResize } from '../../utils/pagination'

export default defineEventHandler(async (event) => {
  const { page, limit, offset } = getPaginationParams(event)
  const query = getQuery(event)
  const status = query.status as string
  const type = query.type as string
  const search = query.search as string

  const conditions = []

  // Filter by status
  if (status && status !== 'all') {
    conditions.push(eq(projects.status, status as any))
  }

  // Filter by project type
  if (type && type !== 'all') {
    conditions.push(eq(projects.projectType, type as any))
  }

  // Search by project name or client name
  if (search) {
    const searchPattern = `%${search}%`
    conditions.push(or(
      ilike(projects.name, searchPattern),
      ilike(clients.name, searchPattern)
    ))
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  // Count with join for search to work on client name
  const [total] = await db
    .select({ count: count() })
    .from(projects)
    .leftJoin(clients, eq(projects.clientId, clients.id))
    .where(whereClause)

  // Stats (unfiltered for dashboard display)
  const [stats] = await db.select({
      totalValue: sql<number>`sum(${projects.value})`,
      active: sql<number>`count(*) filter (where ${projects.status} = 'active')`,
      pending: sql<number>`count(*) filter (where ${projects.status} = 'pending')`,
      completed: sql<number>`count(*) filter (where ${projects.status} = 'completed')`
  }).from(projects)

  // Join with clients to get client name for display
  const projectsList = await db
    .select({
      id: projects.id,
      name: projects.name,
      clientId: projects.clientId,
      clientName: clients.name,
      clientAvatar: clients.avatar,
      projectType: projects.projectType,
      pricingPackage: projects.pricingPackage,
      value: projects.value,
      status: projects.status,
      description: projects.description,
      startDate: projects.startDate,
      createdAt: projects.createdAt
    })
    .from(projects)
    .leftJoin(clients, eq(projects.clientId, clients.id))
    .where(whereClause)
    .orderBy(desc(projects.createdAt))
    .limit(limit)
    .offset(offset)

  const result = paginateResize(projectsList, Number(total?.count || 0), page, limit)
  // @ts-ignore
  result.meta.stats = {
      totalValue: Number(stats?.totalValue || 0),
      active: Number(stats?.active || 0),
      pending: Number(stats?.pending || 0),
      completed: Number(stats?.completed || 0)
  }

  return result
})

