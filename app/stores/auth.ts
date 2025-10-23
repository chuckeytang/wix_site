import { defineStore } from "pinia";

const TOKEN_HEADER = "Authorization";
const TOKEN_STORAGE_KEY = "accessToken";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    accessToken: null as string | null,
    // refresh token 可以在后端或前端管理
    // 但出于安全考虑，通常只将 access token 存储在前端
  }),
  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    getToken: (state) => state.accessToken,
    // 获取完整的 Token 字符串，包括 Bearer 前缀
    getAuthHeader: (state) =>
      state.accessToken ? `Bearer ${state.accessToken}` : null,
  },
  actions: {
    // 设置 token 和用户信息
    setToken(token: string) {
      this.accessToken = token;
      if (process.client) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
      }
    },
    // 从 localStorage 加载 token (仅在客户端运行)
    loadToken() {
      if (process.client) {
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);
        if (token) {
          this.accessToken = token;
        }
      }
    },
    setUser(userData: any) {
      this.user = userData;
    },
    // 登出
    logout() {
      this.accessToken = null;
      this.user = null;
      if (process.client) {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    },
  },
});
