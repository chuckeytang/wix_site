// api/http.ts

import axios from "axios";
import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
} from "axios";

const config = useRuntimeConfig();
// 定义 API 基础 URL
const baseURL = config.public.appBaseApi;

// 创建 Axios 实例
const service: AxiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 10000, // 请求超时时间
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 可以在这里添加认证 token
    // Nuxt 3 中推荐使用 useCookie 或 useStorage
    const token = null; // 假设从某个地方获取 token
    if (token) {
      // 检查 headers 是否存在，以确保类型安全
      if (!config.headers) {
        config.headers = {} as AxiosRequestHeaders;
      }
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

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;
    if (res.code !== 200) {
      console.error("API 响应错误:", res.msg);
      return Promise.reject(new Error(res.msg || "Error"));
    } else {
      return res;
    }
  },
  (error: any) => {
    console.error("响应拦截器错误:", error.message);
    return Promise.reject(error);
  }
);

export default service;
