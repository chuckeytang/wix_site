// plugins/axios.ts
import axios from "axios";
import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
} from "axios";
import { useAuthStore } from "~/stores/auth";

// 声明 NuxtApp 接口，以便 TypeScript 知道 $http 属性的存在
declare module "#app" {
  interface NuxtApp {
    $http: AxiosInstance;
  }
}

// 声明 ComponentCustomProperties 接口，以便在 Options API 组件中使用 this.$http
declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $http: AxiosInstance;
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  // 在 Nuxt 插件中调用 useRuntimeConfig 是安全的
  const config = useRuntimeConfig();
  const baseURL = config.public.appBaseApi; // 使用运行时配置中的基础 URL

  // 创建 Axios 实例 (集成您 http.ts 中的创建逻辑)
  const service: AxiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 30000, // 请求超时时间
    headers: {
      "Content-Type": "application/json",
    },
  });

  // 请求拦截器 (集成您 http.ts 中的逻辑)
  service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // 可以在这里添加认证 token
      // Nuxt 3 中推荐使用 useCookie 或 useStorage
      // 获取 authStore 实例
      const authStore = useAuthStore();
      const token = authStore.accessToken; // 从 Pinia store 中获取 token

      // 如果 token 存在，添加到请求头中
      if (token) {
        // 检查 headers 是否存在，以确保类型安全
        if (!config.headers) {
          config.headers = {} as AxiosRequestHeaders;
        }
        // 添加 Authorization 请求头
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error: any) => {
      // 对请求错误做些什么
      console.error("请求拦截器错误:", error);
      return Promise.reject(error);
    }
  );

  // 响应拦截器 (集成您 http.ts 中的逻辑，但调整返回完整响应)
  service.interceptors.response.use(
    (response: AxiosResponse) => {
      const res = response.data; // 获取响应的 data 部分
      // 进行应用层错误码检查 (例如您的 res.code !== 200)
      if (res && typeof res === "object" && "code" in res && res.code !== 200) {
        console.error("API 响应错误:", res.msg);
        return Promise.reject(new Error(res.msg || "Error"));
      } else {
        // 这里返回完整的 response 对象，而不是 response.data
        // 数据的提取将由 http.ts 中的代理方法来处理
        return response;
      }
    },
    (error: any) => {
      console.error("响应拦截器错误:", error.message);
      return Promise.reject(error);
    }
  );

  // 将配置好的 Axios 实例注入到 Nuxt 应用上下文中
  // 这样在任何地方都可以通过 useNuxtApp().$http 或 this.$http (在 Options API 组件中) 访问
  nuxtApp.provide("http", service);
});
