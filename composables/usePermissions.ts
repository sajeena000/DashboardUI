import { useAppStore } from '~/stores/appStore'

export const usePermissions = () => {
  const store = useAppStore()

  // All authenticated users are admins, so all permissions are granted
  const canAddMembers = computed(() => true)
  const canEditMembers = computed(() => true)
  const canRemoveMembers = computed(() => true)
  const canEditSettings = computed(() => true)

  // Only primary admin can change certain settings
  const isPrimaryAdmin = computed(() => store.userProfile.isPrimary ?? false)

  return {
    canAddMembers,
    canEditMembers,
    canRemoveMembers,
    canEditSettings,
    isPrimaryAdmin
  }
}
