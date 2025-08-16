// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/image',
    '@nuxt/scripts',
    '@vueuse/nuxt',
    '@element-plus/nuxt',
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
  }
})