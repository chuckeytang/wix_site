<template>
  <div class="payment-status-page">
    <div class="message-card">
      <template v-if="status === 'succeeded'">
        <h1 class="title success-title">🎉 Payment Successful!</h1>
        <p class="status-message">
          Your purchase is complete. Authorization is synchronized.
        </p>
        <p class="detail-text">
          Redirecting to {{ redirectPath ? "previous page" : "homepage" }} in
          {{ countdown }}s...
        </p>
        <button
          class="action-button primary-button"
          @click="router.push(redirectPath || '/')"
        >
          Continue
        </button>
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
        <button class="action-button primary-button" @click="goToOrderDetail">
          View Order Detail
        </button>
      </template>

      <template v-else>
        <h1 class="title processing-title">
          <span v-if="status === 'processing'">⏳ Processing...</span>
          <span v-else>Unknown Status...</span>
        </h1>
        <div class="loading-indicator">
          <div class="spinner"></div>
          <span>Checking status with backend...</span>
        </div>

        <p class="status-message">{{ statusMessage }}</p>
        <p class="detail-text">Please check your order history later.</p>
        <button class="action-button primary-button" @click="goToOrderDetail">
          View Order Detail
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ordersApi } from "~/api/orders";
import { useAuthStore } from "~/stores/auth";

// 1. 使用 blank 布局
definePageMeta({
  layout: "blank",
});

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const orderId = route.query.orderId as string | undefined;
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
const countdown = ref(3);
let pollingTimer: NodeJS.Timeout | null = null;
let failedRedirectTimer: NodeJS.Timeout | null = null;

// --- 路由方法 ---
const goToHome = () => router.push("/");
const goToOrderHistory = () => router.push("/account/orders");
const goToOrderDetail = () => {
  if (!orderId) {
    goToOrderHistory();
    return;
  }
  router.push(`/account/orders/${orderId}`);
};
const redirectToOrderDetailWithDelay = (delay = 1200) => {
  if (failedRedirectTimer) clearTimeout(failedRedirectTimer);
  failedRedirectTimer = setTimeout(() => {
    goToOrderDetail();
  }, delay);
};

/**
 * 查询后端订单状态的 API 模拟/占位符
 */
const checkOrderStatus = async () => {
  if (!orderId) {
    status.value = "failed";
    statusMessage.value = "Order ID missing.";
    if (pollingTimer) clearInterval(pollingTimer);
    return;
  }

  if (!authStore.accessToken) {
    console.warn("Token not ready yet, skipping poll...");
    // 尝试重新从 Cookie/Storage 加载一次（视您的 authStore 实现而定）
    // await authStore.loadToken();
    return;
  }

  try {
    // 假设后端 API 结构为：GET /api/orders/{id}/status 返回 { status: 'PAID' | 'PENDING' | 'FAILED' }
    const response = await ordersApi.getOrderStatus(orderId);
    const backendStatus = response.data?.status; // 假设后端返回 'PAID', 'PENDING' 等

    if (backendStatus === "PAID") {
      handleSuccess();
    } else if (
      backendStatus === "PENDING" ||
      backendStatus === "PENDING_PAYMENT"
    ) {
      status.value = "processing";
      statusMessage.value = `Payment is still being verified. Last checked: ${new Date().toLocaleTimeString()}`;
    } else if (backendStatus === "FAILED" || backendStatus === "CANCELLED") {
      status.value = "failed";
      statusMessage.value =
        "The order has failed or been cancelled by the system.";
      if (pollingTimer) clearInterval(pollingTimer);
      redirectToOrderDetailWithDelay();
    }
  } catch (error: any) {
    console.error("Polling failed:", error);
    if (error.response && error.response.status === 401) {
      if (pollingTimer) clearInterval(pollingTimer);
      statusMessage.value = "Authentication expired. Please log in again.";
      // 可选：跳转去登录页
      authStore.logout();
    }
  }
};

/**
 * 处理支付成功逻辑
 */
const handleSuccess = () => {
  if (pollingTimer) clearInterval(pollingTimer); // 停止轮询
  status.value = "succeeded";
  statusMessage.value = "Your purchase is complete.";

  // 启动倒计时跳转
  const timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
      const path = redirectPath.value || "/";
      router.push(path);
    }
  }, 1000);
};

// --- 组件挂载 ---
onMounted(async () => {
  // 简单的等待策略：如果 token 为空，稍微等一下（给 Pinia 插件一点时间 hydration）
  if (!authStore.accessToken) {
    console.log("Token missing, attempting to load from storage...");
    await authStore.loadToken(); // 强制等待 Token 加载完成
  }

  // 再次检查，如果还是没 Token，可能是真没登录，或者是跳转逻辑丢失了状态
  if (!authStore.accessToken) {
    console.error("No token found after reload. Authentication Failed.");
    status.value = "failed";
    // 匹配截图中的错误信息
    statusMessage.value =
      "Authentication check failed. Please view order history.";
    return;
  }

  const redirectStatus = route.query.redirect_status as string | undefined;

  if (redirectStatus === "succeeded") {
    // 状态明确成功，直接处理
    handleSuccess();
    return; // 不启动轮询
  }

  // 处理其他明确状态或未知状态
  if (redirectStatus === "processing") {
    status.value = "processing";
    statusMessage.value =
      "Transaction is pending verification. Starting status check...";
  } else if (
    redirectStatus === "requires_payment_method" ||
    redirectStatus === "canceled"
  ) {
    status.value = "failed";
    statusMessage.value =
      "Payment was declined or cancelled. Please try again.";
    redirectToOrderDetailWithDelay();
    return; // 不启动轮询
  } else {
    // 默认未知状态，需要轮询
    status.value = "processing";
    statusMessage.value = "Unknown status. Starting status check...";
  }

  // 启动轮询：立即检查一次，然后每 5 秒检查一次
  await checkOrderStatus();
  pollingTimer = setInterval(checkOrderStatus, 3000);
});

// 组件卸载时清除计时器，防止内存泄漏
onUnmounted(() => {
  if (pollingTimer) {
    clearInterval(pollingTimer);
  }
  if (failedRedirectTimer) {
    clearTimeout(failedRedirectTimer);
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
