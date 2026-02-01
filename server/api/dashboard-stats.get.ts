import { db } from '../utils/db'
import { projects, contactSubmissions, clients, teamMembers } from '../database/schema'
import { eq, sql, inArray } from 'drizzle-orm'

interface RevenueTrendPoint {
  month: string
  value: number
}

export default defineEventHandler(async () => {
  // 1. Total Projects
  const [projectsResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(projects)

  // 2. Active Customers (distinct clients with projects)
  // We count clients who have at least one project
  const [customersResult] = await db
    .select({ count: sql<number>`count(distinct ${projects.clientId})` })
    .from(projects)
    .where(eq(projects.status, 'active'))

  // 3. Total Revenue (sum of value from active + completed projects)
  const [revenueResult] = await db
    .select({ total: sql<number>`coalesce(sum(${projects.value}), 0)` })
    .from(projects)
    .where(inArray(projects.status, ['active', 'completed']))

  // 4. New Leads (Contact Submissions)
  const [contactsResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(contactSubmissions)
    .where(eq(contactSubmissions.status, 'new'))

  // 5. Total Team Members
  const [teamResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(teamMembers)

  // 6. Revenue Trends (Last 12 Months) 
  const revenueTrendsData = await db
    .select({
      month: sql<string>`TO_CHAR(${projects.startDate}, 'YYYY-MM')`,
      value: sql<number>`SUM(${projects.value})`
    })
    .from(projects)
    .where(inArray(projects.status, ['active', 'completed']))
    .groupBy(sql`TO_CHAR(${projects.startDate}, 'YYYY-MM')`)
    .orderBy(sql`TO_CHAR(${projects.startDate}, 'YYYY-MM')`)

  const now = new Date()
  const monthlyTrends: RevenueTrendPoint[] = []

  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    const found = revenueTrendsData.find(r => r.month === monthKey)

    monthlyTrends.push({
      month: monthName,
      value: Number(found?.value || 0)
    })
  }

  // Normalize for chart (0-100)
  const maxRevenue = Math.max(...monthlyTrends.map(t => t.value), 1)
  const chartData = monthlyTrends.map(t => Math.round((t.value / maxRevenue) * 100))

  return {
    totalProjects: Number(projectsResult?.count || 0),
    activeCustomers: Number(customersResult?.count || 0),
    totalRevenue: Number(revenueResult?.total || 0),
    newContacts: Number(contactsResult?.count || 0),
    totalTeamMembers: Number(teamResult?.count || 0),
    chartData,
    revenueTrends: monthlyTrends
  }
})
