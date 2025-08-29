// app/api/http.ts

import { useNuxtApp } from "#app";
// 导入 AxiosInstance 和 AxiosRequestConfig 类型
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// 用于获取 Nuxt 应用上下文中的 $http 实例的函数
const getHttpClient = (): AxiosInstance => {
  const nuxtApp = useNuxtApp();
  // 确保 $http 已经通过插件注入
  if (!nuxtApp.$http) {
    throw new Error(
      "Axios instance ($http) not available in Nuxt context. Is the axios plugin registered correctly?"
    );
  }
  return nuxtApp.$http;
};

// 定义一个自定义接口来明确我们希望 request 对象的方法返回 Promise<T> (即数据本身)
interface CustomHttpClient {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  // 如果原始 service 有其他方法，请在这里添加并类似处理
  // 例如：request<T = any>(config: AxiosRequestConfig): Promise<T>;
}

// 将 request 对象明确类型化为 CustomHttpClient
// 在这里，我们链式调用 .then(response => response.data) 来提取数据
const request: CustomHttpClient = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => {
    // 调用底层的 Axios 实例的 get 方法，它现在返回 Promise<AxiosResponse<T>>
    // 然后，显式地提取 response.data 来符合 CustomHttpClient 接口的返回类型
    return getHttpClient()
      .get<T>(url, config)
      .then((response: AxiosResponse<T>) => response.data);
  },
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return getHttpClient()
      .post<T>(url, data, config)
      .then((response: AxiosResponse<T>) => response.data);
  },
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return getHttpClient()
      .put<T>(url, data, config)
      .then((response: AxiosResponse<T>) => response.data);
  },
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => {
    return getHttpClient()
      .delete<T>(url, config)
      .then((response: AxiosResponse<T>) => response.data);
  },
  // 如果原始 service 有 request 方法，可以这样添加
  // request: <T = any>(config: AxiosRequestConfig) => {
  //   return getHttpClient().request<T>(config).then((response: AxiosResponse<T>) => response.data);
  // },
};

export default request;
