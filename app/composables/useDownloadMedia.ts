import { computed } from "vue";
import { useAuthStore } from "~/stores/auth";
import { tracksApi, sfxApi } from "~/api"; // 引入 SFX API
import type { Tracks } from "~/types/tracks";
import type { Sfx } from "~/types/sfx";

// 媒体类型联合类型
export type DownloadableMedia = Tracks | Sfx;
export type MediaType = "track" | "sfx";

/**
 * 封装音乐和音效下载的校验和执行逻辑。
 * 包括：检查登录、检查授权、触发下载或弹出相应模态框。
 */
export function useDownloadMedia() {
  const authStore = useAuthStore();
  const { showToast } = useToast();

  // 监听认证状态
  const isAuthenticated = computed(() => authStore.isAuthenticated);

  /**
   * 实际执行下载的函数。
   */
  const executeDownload = async (media: DownloadableMedia, type: MediaType) => {
    const id =
      type === "track" ? (media as Tracks).trackId : (media as Sfx).sfxId;
    const title = media.title;

    if (!id) return false;

    try {
      let blob: Blob;

      if (type === "track") {
        // 调用音乐曲目下载 API
        blob = await tracksApi.downloadTrackProxy(id);
      } else {
        // 调用音效下载 API
        blob = await sfxApi.downloadSfxProxy(id);
      }

      // 创建临时 URL 并触发下载
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${title}.mp3`);

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log(`Download started successfully for ${type} ID: ${id}`);
      return true;
    } catch (error) {
      console.error("Failed to execute download:", error);
      showToast(
        "Failed to start download. Check if you have purchased this item."
      );
      return false;
    }
  };

  /**
   * 处理下载按钮点击事件，执行完整的校验流程。
   */
  const handleDownload = async (media: DownloadableMedia, type: MediaType) => {
    const id =
      type === "track" ? (media as Tracks).trackId : (media as Sfx).sfxId;
    const title = media.title;

    if (!id) {
      console.error(`${type} ID is not available for download.`);
      return;
    }

    // 1. 检查是否登录
    if (!isAuthenticated.value) {
      authStore.openLoginDialog();
      return;
    }

    // 2. 检查授权 (通过调用后端 API)
    try {
      let licenseCheckResponse: any;
      if (type === "track") {
        licenseCheckResponse = await tracksApi.checkTrackLicense(id);
      } else {
        // 假设您有一个相似的音效授权检查接口
        licenseCheckResponse = await sfxApi.checkSfxLicense(id);
      }

      const hasLicense = licenseCheckResponse.data?.hasLicense ?? false;

      if (hasLicense) {
        // 2a. 有授权：执行下载
        await executeDownload(media, type);
      } else {
        // 2b. 无授权：弹出 LicenseModal
        authStore.openLicenseModal(id, title, type);
        console.log(`User needs license for ${type} ID: ${id}`);
      }
    } catch (error: any) {
      console.warn("Download check failed:", error);

      const isLicenseMissing =
        (error as any).responseCode === 403 || error.response?.status === 403;

      if (isLicenseMissing) {
        authStore.openLicenseModal(id, title, type);
        console.log(
          `User is logged in but missing license for ${type}. Opening license modal.`
        );
        return;
      }

      console.log("Download verification failed. Please try again.");
    }
  };

  return {
    handleDownload,
  };
}
