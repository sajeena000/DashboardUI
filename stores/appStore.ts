import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    isAuthenticated: false, 
    searchQuery: '',
    userProfile: {
      name: 'Intern Developer',
      email: 'dev@dashboard.com',
      notifications: true
    },
    team: [
      { id: 1, name: 'Tom Holland', role: 'Frontend Lead', email: 'tom@dashboard.com', online: true, tags: ['Vue', 'Design'] },
      { id: 2, name: 'Sajeena Malla', role: 'Backend Dev', email: 'sajeena@dashboard.com', online: false, tags: ['Node', 'SQL'] },
      { id: 3, name: 'Chris Hemsworth', role: 'Product Designer', email: 'hemsworth@dashboard.com', online: true, tags: ['Figma', 'UX'] },
      { id: 4, name: 'Nishant Malla', role: 'DevOps Engineer', email: 'nishant@dashboard.com', online: false, tags: ['AWS', 'CI/CD'] },
      { id: 5, name: 'Ryan Gosling', role: 'Intern', email: 'ryan@dashboard.com', online: true, tags: ['Learning'] },
    ]
  }),
  
  getters: {
    totalTeamCount: (state) => state.team.length,
    onlineCount: (state) => state.team.filter(m => m.online).length
  },

  actions: {
    initStore() {
      if (import.meta.client) { 
        const savedState = localStorage.getItem('dashboard-state')
        if (savedState) {
          const parsed = JSON.parse(savedState)
          this.userProfile = parsed.userProfile
          this.team = parsed.team
          this.isAuthenticated = parsed.isAuthenticated
        }
      }
    },
    
    saveState() {
      if (import.meta.client) {
        localStorage.setItem('dashboard-state', JSON.stringify({
          userProfile: this.userProfile,
          team: this.team,
          isAuthenticated: this.isAuthenticated
        }))
      }
    },

    login() {
      this.isAuthenticated = true
      this.saveState()
    },

    logout() {
      this.isAuthenticated = false
      this.saveState()
    },

    addTeamMember(member: any) {
      this.team.unshift({
        id: Date.now(),
        online: false,
        tags: ['New'],
        ...member
      })
      this.saveState() 
    },

    editTeamMember(updatedMember: any) {
      const index = this.team.findIndex(m => m.id === updatedMember.id)
      if (index !== -1) {
        this.team[index] = { ...this.team[index], ...updatedMember }
        this.saveState()
      }
    },

    removeTeamMember(email: string) {
      this.team = this.team.filter(m => m.email !== email)
      this.saveState() 
    },

    updateSettings(payload: any) {
      this.userProfile = { ...this.userProfile, ...payload }
      this.saveState() 
    }
  }
})