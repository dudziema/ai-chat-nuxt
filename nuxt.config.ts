// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/ui'],
  future: {
    compatibilityVersion: 4
  },
  css: ['~/assets/css/main.css'],
})