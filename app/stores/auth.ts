import { defineStore } from "pinia";
import type { Users } from "~/types/users";
import { usersApi } from "~/api/users";

const TOKEN_HEADER = "Authorization";
const TOKEN_STORAGE_KEY = "accessToken";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as Users | null,
    accessToken: null as string | null,
    showLoginDialog: false as boolean,
    showLicenseModal: false as boolean, // 控制 License Modal 是否显示
    trackIdForLicense: null as number | null, // 存储需要授权的 trackId
    trackTitleForLicense: null as string | null, // 存储需要授权的 trackTitle
    productTypeForLicense: null as "track" | "sfx" | "plan" | null,
    promptLogin: false as boolean,
  }),
  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    getToken: (state) => state.accessToken,
    // 获取完整的 Token 字符串，包括 Bearer 前缀
    getAuthHeader: (state) =>
      state.accessToken ? `Bearer ${state.accessToken}` : null,
    getNickname: (state) => state.user?.nickname || "Guest",
  },
  actions: {
    openLoginDialog() {
      this.showLoginDialog = true;
    },
    closeLoginDialog() {
      this.showLoginDialog = false;
    },
    openLicenseModal(
      trackId: number,
      trackTitle: string,
      productType: "track" | "sfx" | "plan"
    ) {
      this.trackIdForLicense = trackId;
      this.trackTitleForLicense = trackTitle;
      this.productTypeForLicense = productType;
      this.showLicenseModal = true;
    },
    closeLicenseModal() {
      this.showLicenseModal = false;
      this.trackIdForLicense = null;
    },
    async fetchUserInfo() {
      if (!this.isAuthenticated) {
        this.user = null;
        return;
      }
      try {
        const response = await usersApi.getMe();
        if (response.code === 200 && response.data) {
          this.user = response.data as Users;
        } else {
          // 接口返回错误，可能是 Token 无效，执行登出
          this.logout();
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        // 网络错误或 401 错误，执行登出
        this.logout();
      }
    },
    // 设置 token 和用户信息
    setToken(token: string) {
      this.accessToken = token;
      if (process.client) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
      }
      this.fetchUserInfo();
    },
    // 从 localStorage 加载 token (仅在客户端运行)
    async loadToken() {
      if (process.client) {
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);
        if (token) {
          this.accessToken = token;
          await this.fetchUserInfo();
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
      this.closeLoginDialog();
    },
    //打开提示窗
    openPromptLogin() {
      this.promptLogin = true;
    },
    //关闭提示窗
    closePromptLogin() {
      this.promptLogin = false;
    },
  },
});
