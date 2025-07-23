// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/image', 'nuxt-auth-utils'],
  future: {
    compatibilityVersion: 4
  },
  nitro: {
    storage: {
      db: {
        driver: 'fs',
        base: './.data'
      }
    }
  },
  routeRules: {
    '/': {
      prerender: true
    }
  }
});