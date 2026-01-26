export default defineNuxtConfig({
   ssr: false,
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@pinia/nuxt'
  ],
  googleFonts: {
    families: {
      'Space+Grotesk': [300, 500, 700],
      'Inter': [400, 500, 600], 
    },
    display: 'swap'
  },
  app: {
    baseURL: '/dashboard-ui/',
    head: {
      title: 'The Dashboard',
      bodyAttrs: {
        class: 'bg-slate-950 text-slate-200 antialiased'
      }
    }
  },
  nitro: {
    preset: 'github-pages'
  }
})