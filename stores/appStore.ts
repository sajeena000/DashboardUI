import { defineStore } from 'pinia'

interface Activity {
  id: number
  text: string
  type: 'info' | 'success' | 'warning' | 'error' | null
  time: string
}

interface Notification {
  id: number
  text: string
  type: 'info' | 'success' | 'warning' | 'error' | null
  color: string | null
  isRead: boolean | null
  time: string
}

interface TeamMember {
  id: number
  name: string
  email: string
  role: string
  tags: string[] | null
  online: boolean | null
  avatarUrl: string | null
  createdAt: string | null
  linkedinUrl?: string | null
  bio?: string | null
  jobTitle?: string | null
  imageUrl?: string | null
  isPublic?: boolean | null
}

interface AdminProfile {
  id?: number
  name: string
  email: string
  isPrimary?: boolean | null
  allowRegistration?: boolean | null
}

export const useAppStore = defineStore('app', {
  state: () => ({
    isAuthenticated: false,
    searchQuery: '',
    userProfile: {
      id: undefined,
      name: 'Admin',
      email: 'admin@dashboard.com',
      isPrimary: false,
      allowRegistration: false
    } as AdminProfile,
    activities: [] as Activity[],
    team: [] as TeamMember[],
    notifications: [] as Notification[]
  }),

  getters: {
    totalTeamCount: (state) => state.team.length,
    onlineCount: (state) => state.team.filter(m => m.online).length,
    unreadNotifications: (state) => state.notifications.filter(n => !n.isRead).length
  },

  actions: {
    async logActivity(text: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
      try {
        const newActivity = await $fetch('/api/activities', {
          method: 'POST',
          body: { text, type }
        })
        this.activities.unshift(newActivity)

        if (this.activities.length > 20) this.activities.pop()
      } catch (e) {
        console.error('Failed to log activity', e)
      }
    },

    async initStore() {
      if (import.meta.client) {
        const auth = localStorage.getItem('is-auth')
        this.isAuthenticated = auth === 'true'
      }

      // Try to get authenticated user info
      if (this.isAuthenticated) {
        try {
          const me = await $fetch('/api/auth/me')
          this.userProfile = {
            id: me.id,
            name: me.name,
            email: me.email,
            isPrimary: me.isPrimary,
            allowRegistration: me.allowRegistration
          }
        } catch (e) {
          // Session invalid, clear auth state
          this.isAuthenticated = false
          localStorage.removeItem('is-auth')
        }
      }

      try {
        const [teamData, activityData, notificationsData] = await Promise.all([
          $fetch('/api/team'),
          $fetch('/api/activities'),
          $fetch('/api/notifications')
        ])
        // Handle paginated response for team
        this.team = (teamData as any).data ? (teamData as any).data : teamData
        this.activities = activityData
        this.notifications = notificationsData
      } catch (e) {
        console.error("Failed to load data", e)
      }
    },

    async login(userData: AdminProfile) {
      this.isAuthenticated = true
      this.userProfile = userData
      localStorage.setItem('is-auth', 'true')
      await this.initStore()
    },

    async logout() {
      try {
        await $fetch('/api/auth/logout', { method: 'POST' })
      } catch (e) {
        console.error('Logout API failed', e)
      }
      this.isAuthenticated = false
      localStorage.removeItem('is-auth')
      this.team = []
      this.userProfile = {
        id: undefined,
        name: 'Admin',
        email: 'admin@dashboard.com',
        isPrimary: false,
        allowRegistration: false
      }
    },

    async addTeamMember(member: any) {
      try {
        const newMember = await $fetch('/api/team', {
          method: 'POST',
          body: member
        })
        this.team.unshift(newMember!)
        this.logActivity(`New member added: ${member.name}`, 'success')
        this.createNotification(`New member joined: ${member.name}`, 'success', 'bg-emerald-500')
      } catch (e) {
        this.logActivity('Failed to add member', 'error')
        throw e
      }
    },

    async editTeamMember(updatedMember: any) {
      try {
        const res = await $fetch(`/api/team/${updatedMember.id}`, {
          method: 'PUT',
          body: updatedMember
        })

        const index = this.team.findIndex(m => m.id === updatedMember.id)
        if (index !== -1 && res) {
          this.team[index] = res
        }
        this.logActivity(`Member updated: ${updatedMember.name}`, 'info')
      } catch (e) {
        this.logActivity('Failed to update member', 'error')
        throw e
      }
    },

    async removeTeamMember(id: number) {
      const member = this.team.find(m => m.id === id)
      try {
        await $fetch(`/api/team/${id}`, { method: 'DELETE' })

        this.team = this.team.filter(m => m.id !== id)
        this.logActivity(`Member removed`, 'warning')
        this.createNotification(`Team member removed${member ? `: ${member.name}` : ''}`, 'warning', 'bg-rose-500')
      } catch (e) {
        this.logActivity('Failed to remove member', 'error')
        throw e
      }
    },

    async createNotification(text: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', color: string = 'bg-indigo-500') {
      try {
        const newNotification = await $fetch('/api/notifications', {
          method: 'POST',
          body: { text, type, color }
        })
        this.notifications.unshift(newNotification)
        if (this.notifications.length > 20) this.notifications.pop()
      } catch (e) {
        console.error('Failed to create notification', e)
      }
    },

    async markNotificationAsRead(id: number) {
      try {
        await $fetch(`/api/notifications/${id}`, { method: 'PATCH' })
        const notif = this.notifications.find(n => n.id === id)
        if (notif) notif.isRead = true
      } catch (e) {
        console.error('Failed to mark notification as read', e)
      }
    },

    async markAllNotificationsAsRead() {
      try {
        await $fetch('/api/notifications/read-all', { method: 'POST' })
        this.notifications.forEach(n => n.isRead = true)
      } catch (e) {
        console.error('Failed to mark all notifications as read', e)
      }
    }
  }
})