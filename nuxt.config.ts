// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css", "~/assets/styles/global.scss"],
  modules: [
    "@nuxt/image",
    "@nuxt/scripts",
    "@vueuse/nuxt",
    "@element-plus/nuxt",
    "@pinia/nuxt",
  ],
  nitro: {
    routeRules: {
      "/": { headers: { "Cache-Control": "no-cache" } },
    },
  },
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
      stripePk: process.env.NUXT_PUBLIC_STRIPE_PK,
      appBaseApi: process.env.NUXT_PUBLIC_APP_BASE_API,

      // Google OAuth 配置
      googleOauth: {
        // 你的 Google Client ID，从环境变量或直接赋值获取
        clientId:
          process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID ||
          "757481063169-ro4ei1tahlafdccmmshjh78tvpbueim1.apps.googleusercontent.com",

        // 你的后端回调地址 (必须和 GCP 配置的一致)
        // 假设你的后端地址是你的主 API 地址
        redirectUri:
          (process.env.NUXT_PUBLIC_API_DOMAIN ||
            "https://api.verscape-tech.com") + "/site/auth/google/callback",

        // 请求的权限范围
        scope: "email profile",
      },
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
      viewport:
        "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;700;900&display=swap",
        },
      ],
    },
  },
});
