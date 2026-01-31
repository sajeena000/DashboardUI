import { useAppStore } from '~/stores/appStore'

const publicRoutes = [
  '/',
  '/about/company',
  '/about/team',
  '/services',
  '/gallery',
  '/news/blog',
  '/news/events',
  '/contact',
  '/admin/login',
  '/admin/register'
]

export default defineNuxtRouteMiddleware((to, from) => {
  const store = useAppStore()

  const isPublicRoute = publicRoutes.some(route =>
    to.path === route || to.path.startsWith('/news/blog/')
  )

  if (isPublicRoute) {
    return
  }

  if (to.path === '/admin/login' && store.isAuthenticated) {
    return navigateTo('/admin')
  }

  if (to.path.startsWith('/admin') && !store.isAuthenticated) {
    return navigateTo('/admin/login')
  }
})