import { db } from '../../utils/db'
import { teamMembers, projects, clients, blogPosts, events, contactSubmissions } from '../../database/schema'
import { ilike, or, desc, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const q = query.q as string
    const type = query.type as string || 'all'

    if (!q) {
        return []
    }

    const searchTerm = `%${q}%`
    const results = []

    // Helper to push results
    const pushResult = (item: any, type: string, titleParams: any, subtitle: string, url: string, icon: string) => {
        results.push({
            id: item.id,
            type,
            title: titleParams,
            subtitle,
            url,
            icon
        })
    }

    // 1. Team Members
    if (type === 'all' || type === 'team') {
        const teamResults = await db.select().from(teamMembers).where(
            or(
                ilike(teamMembers.name, searchTerm),
                ilike(teamMembers.email, searchTerm),
                ilike(teamMembers.role, searchTerm)
            )
        ).limit(5)

        teamResults.forEach(member => {
            pushResult(member, 'Team', member.name, member.role, '/admin/team', 'User')
        })
    }

    // 2. Projects
    if (type === 'all' || type === 'projects') {
        const projectResults = await db.select().from(projects).where(
            or(
                ilike(projects.name, searchTerm),
                ilike(projects.description, searchTerm),
                ilike(projects.projectType, searchTerm)
            )
        ).limit(5)

        projectResults.forEach(project => {
            pushResult(project, 'Projects', project.name, project.projectType, '/admin/projects', 'Briefcase')
        })
    }

    // 3. Clients
    // Mapped to /admin/projects as requested
    if (type === 'all' || type === 'clients') {
        const clientResults = await db.select().from(clients).where(
            or(
                ilike(clients.name, searchTerm),
                ilike(clients.email, searchTerm)
            )
        ).limit(5)

        clientResults.forEach(client => {
            pushResult(client, 'Clients', client.name, client.email, '/admin/projects', 'Building')
        })
    }

    // 4. Blogs
    if (type === 'all' || type === 'blogs') {
        const blogResults = await db.select().from(blogPosts).where(
            or(
                ilike(blogPosts.title, searchTerm),
                ilike(blogPosts.content, searchTerm)
            )
        ).limit(5)

        blogResults.forEach(post => {
            pushResult(post, 'Blogs', post.title, 'Blog Post', '/admin/blogs', 'FileText')
        })
    }

    // 5. Events
    if (type === 'all' || type === 'events') {
        const eventResults = await db.select().from(events).where(
            or(
                ilike(events.title, searchTerm),
                ilike(events.description, searchTerm),
                ilike(events.location, searchTerm)
            )
        ).limit(5)

        eventResults.forEach(event => {
            pushResult(event, 'Events', event.title, event.location || 'No location', '/admin/events', 'Calendar')
        })
    }

    // 6. Contact Submissions
    if (type === 'all' || type === 'contacts') {
        const contactResults = await db.select().from(contactSubmissions).where(
            or(
                ilike(contactSubmissions.name, searchTerm),
                ilike(contactSubmissions.email, searchTerm),
                ilike(contactSubmissions.subject, searchTerm),
                ilike(contactSubmissions.message, searchTerm)
            )
        ).limit(5)

        contactResults.forEach(contact => {
            pushResult(contact, 'Contacts', contact.name, contact.subject || 'No subject', '/admin/contacts', 'MessageSquare')
        })
    }

    // 7. Analytics Hardcoded Match
    if (type === 'all' || type === 'analytics') {
        const analyticsKeywords = ['revenue', 'analytics', 'stats', 'growth', 'money', 'profit']
        if (analyticsKeywords.some(k => q.toLowerCase().includes(k))) {
            results.push({
                id: 'analytics-page',
                type: 'Analytics',
                title: 'Dashboard Analytics',
                subtitle: 'View revenue and growth stats',
                url: '/admin/analytics',
                icon: 'BarChart'
            })
        }
    }

    return results
})
