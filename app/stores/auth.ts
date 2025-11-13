import { defineStore } from "pinia";

const TOKEN_HEADER = "Authorization";
const TOKEN_STORAGE_KEY = "accessToken";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    accessToken: null as string | null,
    showLoginDialog: false as boolean,
    showLicenseModal: false as boolean, // 控制 License Modal 是否显示
    trackIdForLicense: null as number | null, // 存储需要授权的 trackId
    trackTitleForLicense: null as string | null, // 存储需要授权的 trackTitle
    productTypeForLicense: null as "track" | "sfx" | "plan" | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    getToken: (state) => state.accessToken,
    // 获取完整的 Token 字符串，包括 Bearer 前缀
    getAuthHeader: (state) =>
      state.accessToken ? `Bearer ${state.accessToken}` : null,
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
      this.closeLoginDialog();
    },
  },
});
