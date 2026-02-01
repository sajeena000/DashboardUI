import { db } from '../../utils/db'
import { projects, clients } from '../../database/schema'
import { desc, eq, count, sql } from 'drizzle-orm'
import { getPaginationParams, paginateResize } from '../../utils/pagination'

export default defineEventHandler(async (event) => {
  const { page, limit, offset } = getPaginationParams(event)

  const [total] = await db.select({ count: count() }).from(projects)

  // Stats
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
