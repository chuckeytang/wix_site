<template>
  <div class="verify-page-full">
    <div class="verify-card-container">
      <div class="verify-card">
        <h1 class="main-title text-primary-color">Email Verification</h1>

        <div v-if="loading" class="state-content">
          <svg
            class="spinner-icon text-secondary-color"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p class="state-text">Verifying your email address...</p>
        </div>

        <div v-else-if="success" class="state-content">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="status-icon success-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 class="state-title text-green">Verification Successful!</h2>
          <p class="state-description">
            You have successfully verified your email. <br />
            Redirecting you to the home page...
          </p>
          <NuxtLink to="/" class="go-home-link text-secondary-color">
            Go to Home Page Now
          </NuxtLink>
        </div>

        <div v-else class="state-content">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="status-icon error-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <h2 class="state-title text-red">Verification Failed</h2>

          <p class="state-description error-message">{{ errorMessage }}</p>

          <div v-if="isInvalidLink">
            <p class="error-hint">
              Redirecting to home page in {{ redirectCountdown }} seconds...
            </p>
          </div>

          <div v-else class="action-area">
            <p class="state-description">
              The link may be expired. You can request a new one.
            </p>

            <button
              class="resend-button"
              @click="handleResend"
              :disabled="resendCooldown > 0 || resendLoading"
            >
              <span v-if="resendLoading">SENDING...</span>
              <span v-else-if="resendCooldown > 0"
                >RESEND IN {{ resendCooldown }}s</span
              >
              <span v-else>RESEND VERIFICATION EMAIL</span>
            </button>
          </div>

          <NuxtLink to="/" class="go-home-link text-secondary-color">
            {{ isInvalidLink ? "Go to Home Page" : "Cancel & Return Home" }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { authApi } from "~/api/auth";
import { useAuthStore } from "~/stores/auth";

definePageMeta({
  layout: "blank",
});

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// 状态控制
const loading = ref(true);
const success = ref(false);
const errorMessage = ref("An unexpected error occurred.");
const isInvalidLink = ref(false); // 标记是否为格式错误的链接

// 倒计时相关
const redirectCountdown = ref(3); // 无效链接自动跳转倒计时
const resendCooldown = ref(0); // 重发邮件冷却
const resendLoading = ref(false); // 重发加载状态
let timer = null;

// 从 URL 获取参数
const token = route.query.token;
const email = route.query.email;

// 核心验证逻辑
const verifyEmail = async () => {
  // 1. 检查链接完整性
  if (!token || !email) {
    loading.value = false;
    isInvalidLink.value = true;
    errorMessage.value = "Invalid verification link (missing parameters).";
    startRedirectTimer(); // 启动自动跳转
    return;
  }

  try {
    const response = await authApi.verifyEmail({
      email: String(email),
      code: String(token),
    });

    if (response.code === 200 && response.data) {
      // 成功
      success.value = true;
      authStore.setToken(response.data);
      // 成功后也可以延迟跳转
      setTimeout(() => router.push("/"), 3000);
    } else {
      // 业务失败
      handleError(response.msg || "Email verification failed.");
    }
  } catch (error) {
    console.error("Verification API error:", error);
    let msg = "Network error occurred.";
    if (error.response?.data?.msg) {
      msg = error.response.data.msg;
    } else if (error.message) {
      msg = error.message;
    }
    handleError(msg);
  } finally {
    loading.value = false;
  }
};

// 统一错误处理
const handleError = (msg) => {
  success.value = false;
  errorMessage.value = msg;
  // 如果参数完整，允许用户尝试重发
  isInvalidLink.value = false;
};

// 处理重发邮件
const handleResend = async () => {
  if (!email || resendCooldown.value > 0 || resendLoading.value) return;

  resendLoading.value = true;
  try {
    const res = await authApi.resendVerificationEmail(String(email));
    if (res.code === 200) {
      alert("A new verification email has been sent!");
      startResendCooldown();
    } else {
      alert(res.msg || "Failed to resend email.");
    }
  } catch (error) {
    alert("Network error, please try again.");
  } finally {
    resendLoading.value = false;
  }
};

// 重发按钮冷却倒计时
const startResendCooldown = () => {
  resendCooldown.value = 60;
  const interval = setInterval(() => {
    resendCooldown.value--;
    if (resendCooldown.value <= 0) {
      clearInterval(interval);
    }
  }, 1000);
};

// 无效链接自动跳转倒计时
const startRedirectTimer = () => {
  timer = setInterval(() => {
    redirectCountdown.value--;
    if (redirectCountdown.value <= 0) {
      clearInterval(timer);
      router.push("/");
    }
  }, 1000);
};

onMounted(() => {
  verifyEmail();
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
/* 保持原有基础变量 */
:root {
  --primary-color: #ff8c62; /* 您的主色：橙色系 */
  --secondary-color: #f39c12; /* 辅助色：用于链接/强调 */
  --text-color: #ffffff;
  --dark-bg: rgba(13, 13, 26, 1);
  --card-bg: #1c1b1b;
  --error-color: #ef4444; /* 您的警示色：红色 */
  --success-color: #2ecc71; /* 保持成功色为绿色 */
  --link-color: var(--secondary-color);
  --light-gray: #a0a0a0;
  --border-color: rgba(255, 255, 255, 0.1);
}

/* 布局和卡片样式 (保持不变) */
.verify-page-full {
  height: 100vh;
  width: 100vw;
  background-color: var(--dark-bg);
  color: var(--text-color);
  display: flex;
  align-items: center;
  justify-content: center;
}

.verify-card-container {
  max-width: 500px;
  width: 90%;
}

.verify-card {
  background-color: rgba(255, 255, 255, 0.05); /* 采用轻微透明的玻璃卡片背景 */
  backdrop-filter: blur(15px); /* 增加模糊效果 */
  border: 1px solid var(--border-color); /* 增加边框 */
  padding: 40px;
  border-radius: 12px; /* 略微圆润 */
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.7);
  text-align: center;
}

.main-title {
  color: var(--primary-color); /* 标题使用主题色 */
  font-size: 2.5rem; /* 略微放大 */
  text-transform: uppercase;
  margin-bottom: 30px;
}

.text-primary-color {
  color: var(--primary-color);
}
.text-secondary-color {
  color: var(--secondary-color);
}
.text-green {
  color: var(--success-color);
}
.text-red {
  color: var(--error-color);
}

.state-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.status-icon,
.spinner-icon {
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
}
.success-icon {
  color: var(--success-color) !important;
  box-shadow: 0 0 10px rgba(46, 204, 113, 0.7);
  border-radius: 50%;
}

/* 失败图标：使用警示色，增加柔和阴影 */
.error-icon {
  color: var(--error-color) !important;
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.7);
  border-radius: 50%;
}

.state-title {
  font-size: 1.8em;
  margin-top: 10px;
}

/* 状态描述和错误信息 */
.state-description {
  color: var(--light-gray);
  font-size: 1.1em;
  margin-bottom: 20px;
}

.error-message {
  color: var(--error-color);
  font-weight: bold;
  /* 失败提示：使用警示色背景的柔和版本 */
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid var(--error-color);
  padding: 12px;
  border-radius: 8px;
  width: 100%;
  margin-bottom: 15px;
}

/* 无效链接自动跳转提示 */
.error-hint {
  color: var(--secondary-color); /* 使用辅助色来强调倒计时 */
  font-weight: bold;
  font-size: 1em;
  margin-top: 5px;
}

.go-home-link {
  color: var(--secondary-color);
  font-weight: bold;
  margin-top: 30px;
  font-size: 1em;
}
.go-home-link:hover {
  text-decoration: underline;
}

/* --- 新增：Resend 按钮样式 --- */
.action-area {
  width: 100%;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.resend-button {
  background-color: var(--primary-color); /* 使用主题色 */
  color: #000; /* 按钮文字使用深色，更清晰 */
  border: none;
  padding: 14px 28px;
  border-radius: 6px;
  font-size: 1.05rem;
  font-weight: bold;
  cursor: pointer;
  transition:
    background-color 0.3s,
    opacity 0.3s;
  width: 100%;
  max-width: 320px;
}

.resend-button:hover:not(:disabled) {
  background-color: #f77341; /* 略微变浅的主题色 */
}

.resend-button:disabled {
  background-color: #444444; /* 冷却状态的深灰色 */
  color: #aaaaaa;
  cursor: not-allowed;
  opacity: 1;
}
</style>
