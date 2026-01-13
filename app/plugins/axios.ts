// plugins/axios.ts
import axios from "axios";
import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
} from "axios";
import { useAuthStore } from "~/stores/auth";

const { showToast } = useToast();
interface Toast {
  error(message: string): void;
}

// 声明 NuxtApp 接口，以便 TypeScript 知道 $http 属性的存在
declare module "#app" {
  interface NuxtApp {
    $toast: Toast;
    $http: AxiosInstance;
  }
}
// 声明 ComponentCustomProperties 接口，以便在 Options API 组件中使用 this.$http
declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $toast: Toast;
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  type NuxtAppWithToast = typeof nuxtApp & { $toast?: Toast };
  const app: NuxtAppWithToast = nuxtApp;
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
      const res = response.data;
      const config = response.config;

      if (res && typeof res === "object" && "code" in res && res.code !== 200) {
        const authStore = useAuthStore();

        // 1. 获取请求路径（去掉 baseURL 部分）
        const url = config.url || "";

        // 2. 更加严谨的白名单校验
        const authWhiteList = [
          "/site/auth/login",
          "/site/auth/register",
          "/site/auth/verifyEmail",
          "/site/auth/resendVerification", // 确保这里和后端匹配
        ];

        // 检查当前 URL 是否包含在白名单中
        const isAuthApi = authWhiteList.some((path) => url.includes(path));

        // 3. 只有【非白名单】且【确认为401】时，才强制弹窗登出
        if (
          !isAuthApi &&
          (res.code === 401 || (res.msg && res.msg.includes("认证失败")))
        ) {
          console.error("API 响应错误: 认证失败，强制登出...");
          // ... 原有的 Toast 和 logout 逻辑 ...
          return Promise.reject(
            new Error(res.msg || "Authentication required.")
          );
        }

        // 4. 如果是白名单接口返回的 401（说明后端没配置好）或其他错误，
        // 我们只抛出普通错误，让组件(LoginDialog)内部去显示错误消息，而不是全局弹窗 B。
        const customError = new Error(res.msg || "Error");
        (customError as any).responseCode = res.code;
        return Promise.reject(customError);
      }
      return response;
    },
    (error: any) => {
      console.error("响应拦截器错误:", error.message);

      const authStore = useAuthStore();
      const status = error.response?.status;

      // HTTP 状态码 401 (Unauthorized) 统一处理
      if (status === 401) {
        // 确认是 401 错误，进行全局处理
        console.error("HTTP 401 Unauthorized，全局处理中...");

        // 提示用户
        // 假设我们有一个全局的 $toast 或 $alert 服务
        if (app.$toast) {
          app.$toast.error("Your login has expired. Please log in again.");
        } else {
          showToast("Your login has expired. Please log in again.");
        }

        authStore.logout();
        authStore.openLoginDialog();

        // 阻止 Promise 链继续执行
        // 返回一个被拒绝的 Promise，这样在 MusicCard.vue 中就不会进入 .catch 块
        return Promise.reject(new Error("Authentication required."));
      }

      // 对于其他错误 (如 403, 500, 网络错误)，原样抛出，让业务代码自行处理
      return Promise.reject(error);
    }
  );

  // 将配置好的 Axios 实例注入到 Nuxt 应用上下文中
  // 这样在任何地方都可以通过 useNuxtApp().$http 或 this.$http (在 Options API 组件中) 访问
  nuxtApp.provide("http", service);
});
