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
            You have successfully verified your email. Redirecting you to the
            home page now.
          </p>
          <NuxtLink to="/" class="go-home-link text-secondary-color">
            Go to Home Page
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
          <p
            v-if="
              errorMessage.includes('过期') || errorMessage.includes('无效')
            "
            class="error-hint"
          >
            您的验证链接可能已过期或无效。请尝试重新注册。
          </p>
          <NuxtLink to="/" class="go-home-link text-secondary-color">
            Go back to Home
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { authApi } from "~/api/auth";
import { useAuthStore } from "~/stores/auth";

definePageMeta({
  layout: "blank",
});

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const loading = ref(true);
const success = ref(false);
const errorMessage = ref("An unexpected error occurred.");

const verifyEmail = async () => {
  const token = route.query.token;
  const email = route.query.email;

  if (!token || !email) {
    loading.value = false;
    errorMessage.value = "Missing verification parameters (token or email).";
    return;
  }

  try {
    const response = await authApi.verifyEmail({
      email: email,
      code: token,
    });

    if (response.code === 200 && response.data) {
      // 1. 验证成功
      success.value = true;

      // 2. 存储 JWT Token
      const jwtToken = response.data; // 假设 response.data 直接是 JWT token 字符串
      authStore.setToken(jwtToken);

      // 3. 重定向用户
      // setTimeout(() => {
      //   router.push("/");
      // }, 3000); // 3秒后自动跳转
    } else {
      // 验证失败，显示后端返回的错误信息
      errorMessage.value = response.msg || "Email verification failed.";
      success.value = false;
    }
  } catch (error) {
    console.error("Verification API error:", error);

    let userFriendlyMessage =
      "Network error occurred during verification. Please check your connection.";

    // **优先级 1: 尝试从 error.response 中提取若依的 {msg: "..."} 结构**
    if (error.response && error.response.data && error.response.data.msg) {
      userFriendlyMessage = error.response.data.msg;
    }
    // **优先级 2: 从 error.message 中提取**
    // 你的日志显示：error.message 就是 "Verification link is invalid or expired. Please register again."
    else if (error.message) {
      // 如果 error.message 包含了后端抛出的友好信息，直接使用它
      userFriendlyMessage = error.message;
    }

    errorMessage.value = userFriendlyMessage;
    success.value = false;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  verifyEmail();
});
</script>

<style scoped>
/* ---------------------------------------------------- */
/* 定义核心主题变量 (参考登录页) */
/* ---------------------------------------------------- */
:root {
  --primary-color: #ff8c62; /* 假设的主色：橙色系 */
  --secondary-color: #f39c12; /* 辅助色 */
  --text-color: #ffffff;
  --dark-bg: rgba(13, 13, 26, 1); /* 背景色 */
  --card-bg: #1c1b1b; /* 卡片背景色 */
  --error-color: var(--primary-color);
  --success-color: #2ecc71;
  --link-color: var(--secondary-color);
  --light-gray: #a0a0a0;
}

/* ---------------------------------------------------- */
/* 布局：全屏居中 */
/* ---------------------------------------------------- */

.verify-page-full {
  /* 强制应用空白布局的背景和高度 */
  height: 100vh;
  width: 100vw;
  background-color: var(--dark-bg);
  color: var(--text-color);
  margin: 0;
  padding: 0;
  box-sizing: border-box;

  /* 居中卡片容器 */
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
}

.verify-card-container {
  /* 限制卡片的最大宽度 */
  max-width: 500px;
  width: 90%; /* 允许在小屏幕上自适应 */
  box-sizing: border-box;
}

/* ---------------------------------------------------- */
/* 卡片和内容样式 */
/* ---------------------------------------------------- */

.verify-card {
  background-color: var(--card-bg);
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
  text-align: center; /* 内部元素居中 */
}

.main-title {
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 25px;
  text-align: center;
}

.text-primary-color {
  color: var(--primary-color);
}
.text-secondary-color {
  color: var(--secondary-color);
}

/* ---------------------------------------------------- */
/* 状态内容 (居中图标和文字) */
/* ---------------------------------------------------- */

.state-content {
  display: flex;
  flex-direction: column;
  align-items: center; /* 图标和文字居中 */
  justify-content: center;
  gap: 15px; /* 元素间距 */
}

/* 图标样式：进一步缩小到合理范围 */
.status-icon,
.spinner-icon {
  width: 50px; /* 图标尺寸，覆盖 h-12 w-12 */
  height: 50px;
  margin-bottom: 10px; /* 底部间距 */
}

/* 状态标题 */
.state-title {
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 5px;
}

/* 成功和失败颜色 */
.success-icon,
.text-green {
  color: var(--success-color) !important;
}
.error-icon,
.text-red {
  color: var(--error-color) !important;
}

/* 状态描述和错误信息 */
.state-text,
.state-description {
  font-size: 1em;
  line-height: 1.5;
  color: var(--light-gray);
  margin-bottom: 10px;
}
.error-message {
  color: #ef4444;
  font-weight: bold;
}
.error-hint {
  color: var(--light-gray);
  font-size: 0.9em;
  margin-top: -10px;
}

.go-home-link {
  color: var(--link-color);
  text-decoration: none;
  font-weight: bold;
  margin-top: 15px;
  display: block;
}
.go-home-link:hover {
  text-decoration: underline;
}
</style>
