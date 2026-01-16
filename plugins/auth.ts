import { useAppStore } from '~/stores/appStore'

export default defineNuxtPlugin((nuxtApp) => {
  const store = useAppStore()
  store.initStore()
})