// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxtjs/mdc'],
  future: {
    compatibilityVersion: 4
  },
  css: ['~/assets/css/main.css'],
  mdc: {
    highlight: {
      theme: 'material-theme-palenight',
      langs: ['html', 'markdown', 'vue', 'typescript', 'javascript']
    }
  }
});
