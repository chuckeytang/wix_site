// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: [
    "@nuxt/image",
    "@nuxt/scripts",
    "@vueuse/nuxt",
    "@element-plus/nuxt",
    "@pinia/nuxt",
  ],
  build: {
    transpile: ["element-plus"], // 确保 Element Plus 可以被正确编译
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
  runtimeConfig: {
    public: {
      appBaseApi: process.env.NUXT_PUBLIC_APP_BASE_API,
    },
  },
  elementPlus: {
    importStyle: "scss", // 使用 scss 样式
  },
  devServer: {
    port: parseInt(process.env.NUXT_PUBLIC_PORT || "3000"),
    host: "0.0.0.0", // 允许外部访问
  },
    app: {
    head: {
      link: [
        { 
          rel: 'stylesheet', 
          href: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;700;900&display=swap' 
        }
      ]
    }
  },
});
