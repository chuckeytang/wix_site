<template>
  <div class="payment-status-page">
    <div class="message-card">
      <template v-if="status === 'succeeded'">
        <h1 class="title success-title">🎉 Payment Successful!</h1>
        <p class="status-message">
          Your purchase is complete. Authorization is synchronized.
        </p>

        <p class="detail-text">
          Redirecting to track page in {{ countdown }}s...
        </p>
      </template>

      <template
        v-else-if="
          status === 'failed' ||
          status === 'requires_payment_method' ||
          status === 'canceled'
        "
      >
        <h1 class="title fail-title">❌ Payment Failed</h1>
        <p class="status-message">{{ statusMessage }}</p>
        <p class="detail-text">The transaction could not be completed.</p>
        <button class="action-button primary-button" @click="goToHome">
          Return to Homepage
        </button>
      </template>

      <template v-else>
        <h1 class="title processing-title">⏳ Processing...</h1>
        <p class="status-message">{{ statusMessage }}</p>
        <p class="detail-text">Please check your order history later.</p>
        <button class="action-button primary-button" @click="goToOrderHistory">
          View Order History
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
// 导入 Tracks API，用于调用下载代理接口
import { tracksApi } from "~/api";

// 1. 使用 blank 布局
definePageMeta({
  layout: "blank",
});

const route = useRoute();
const router = useRouter();
const orderTrackId = route.query.trackId as string | undefined;
const redirectPath = ref(
  route.query.returnPath
    ? decodeURIComponent(route.query.returnPath as string)
    : null
);

const status = ref<
  | "loading"
  | "succeeded"
  | "processing"
  | "failed"
  | "canceled"
  | "requires_payment_method"
>("loading");
const statusMessage = ref("Verifying transaction status...");
const downloading = ref(false);
const trackTitle = ref("your track");
const countdown = ref(2);

// --- 核心下载和跳转逻辑 ---
const startAutoDownloadAndRedirect = async (trackId: number) => {
  downloading.value = true;

  // 1. 触发下载代理 API
  try {
    const blob = await tracksApi.downloadTrackProxy(trackId);

    // 2. 触发浏览器下载
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    // 假设您在后端或前端能获取到音乐名称，这里使用通用名称
    link.setAttribute("download", `purchased_track_${trackId}.mp3`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    console.log("Download started successfully.");
    downloading.value = false;
  } catch (error) {
    console.error("Auto download failed:", error);
    statusMessage.value =
      "Download failed. Please check your purchase history.";
    downloading.value = false;
  }

  // 3. 倒计时跳转
  setTimeout(() => {
    if (redirectPath.value) {
      router.push(redirectPath.value);
    } else {
      // 否则，回退到音乐详情页
      router.push(`/music/${trackId}`);
    }
  }, 2000);

  // 4. 倒计时显示
  const timer = setInterval(() => {
    countdown.value -= 1;
    if (countdown.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
};

// --- 路由方法 ---
const goToHome = () => router.push("/");
const goToOrderHistory = () => router.push("/profile/orders");

// --- 组件挂载 ---
onMounted(async () => {
  const redirectStatus = route.query.redirect_status as string | undefined;

  if (redirectStatus === "succeeded") {
    status.value = "succeeded";

    if (orderTrackId) {
      // 立即开始下载和跳转
      await startAutoDownloadAndRedirect(Number(orderTrackId));
    } else {
      statusMessage.value =
        "Success! No track ID found for automatic download. Redirecting to home.";
      setTimeout(goToHome, 3000);
    }
  } else if (redirectStatus === "processing") {
    status.value = "processing";
    statusMessage.value =
      "Transaction is pending verification. Please check order history later.";
  } else if (
    redirectStatus === "requires_payment_method" ||
    redirectStatus === "canceled"
  ) {
    status.value = "failed";
    statusMessage.value =
      "Payment was declined or cancelled. Please try again.";
  } else {
    status.value = "processing"; // 默认未知状态
    statusMessage.value = "Unknown status. Please check your order history.";
  }
});
</script>

<style scoped>
/* 样式参考 auth-page-success 和 网站整体深色调 */
.payment-status-page {
  height: 100vh;
  background-color: #0d0d1a;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
}
.message-card {
  padding: 60px 80px;
  max-width: 500px;
  background-color: #1a1a2e;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}
.title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 20px;
}
.success-title {
  color: #ff8c62; /* 网站主色调 */
}
.fail-title {
  color: #e67a54;
}
.processing-title {
  color: #ccc;
}
.status-message {
  font-size: 1.1rem;
  line-height: 1.5;
  color: #ccc;
  margin-bottom: 30px;
}
.detail-text {
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 5px;
}
.action-button {
  display: inline-block;
  margin-top: 30px;
  padding: 15px 35px;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    transform 0.3s;
}
.primary-button {
  background-color: #ff8c62;
  color: #0d0d1a;
}
.primary-button:hover {
  background-color: #e67a54;
  transform: translateY(-2px);
}

/* 简单的加载指示器样式 */
.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
  font-size: 1.1rem;
}
.spinner {
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 3px solid #ff8c62;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
