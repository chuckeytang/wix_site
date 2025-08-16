// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@element-plus/nuxt',
    '@nuxt/fonts',
  ],
  build: {
    transpile: ['element-plus'], // 确保 Element Plus 可以被正确编译
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/styles/element/index.scss" as element;`, // 引入 Element Plus 的样式
        },
      },
    },
  },
  elementPlus: {
    importStyle: 'scss', // 使用 scss 样式
  },
  fonts: {
    provider: 'bunny'
  }
})