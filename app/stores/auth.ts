import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    accessToken: null as string | null,
    // refresh token 可以在后端或前端管理
    // 但出于安全考虑，通常只将 access token 存储在前端
  }),
  getters: {
    isAuthenticated: (state) => !!state.accessToken,
  },
  actions: {
    // 设置 token 和用户信息
    setToken(token: string) {
      this.accessToken = token;
      // 可以在这里将 token 存储到 localStorage 或 cookie
      localStorage.setItem("accessToken", token);
    },
    setUser(userData: any) {
      this.user = userData;
    },
    // 登出
    logout() {
      this.accessToken = null;
      this.user = null;
      localStorage.removeItem("accessToken");
    },
    // 从 localStorage 加载 token
    loadToken() {
      const token = localStorage.getItem("accessToken");
      if (token) {
        this.accessToken = token;
      }
    },
  },
});
