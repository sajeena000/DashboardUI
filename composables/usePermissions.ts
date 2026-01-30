import { useAppStore } from '~/stores/appStore'

export type UserRole = 'admin' | 'manager' | 'member'

export const usePermissions = () => {
  const store = useAppStore()

  const currentRole = computed<UserRole>(() => store.userProfile.userRole || 'member')

  const canAddMembers = computed(() => {
    return ['admin', 'manager'].includes(currentRole.value)
  })

  const canEditMembers = computed(() => {
    return ['admin', 'manager'].includes(currentRole.value)
  })

  const canRemoveMembers = computed(() => {
    return currentRole.value === 'admin'
  })

  const canEditSettings = computed(() => {
    return ['admin', 'manager'].includes(currentRole.value)
  })

  const canChangeRoles = computed(() => {
    return currentRole.value === 'admin'
  })

  return {
    currentRole,
    canAddMembers,
    canEditMembers,
    canRemoveMembers,
    canEditSettings,
    canChangeRoles
  }
}
