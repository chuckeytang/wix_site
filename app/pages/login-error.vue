<template>
  <div class="error-page-full">
    <div class="error-card">
      <h1 class="main-title text-primary-color">Authorization Failed</h1>

      <div class="state-content">
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
        <h2 class="state-title text-red">Login Error</h2>

        <p class="state-description error-message">
          {{ decodedErrorMessage }}
        </p>

        <p class="error-hint">
          Please try logging in again or register a new account.
        </p>

        <NuxtLink
          to="/"
          class="go-home-link text-secondary-color"
          @click="closeLoginDialog"
        >
          Return to Login
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

// 1. 使用 blank 布局，不显示 Header/Footer
definePageMeta({
  layout: "blank",
});

const route = useRoute();

// 2. 解码并获取错误信息
// 错误信息通过 URL query 参数传递，可能包含 URL 编码
const errorMessageFromUrl = computed(() => {
  return route.query.msg || "An unknown authorization error occurred.";
});

const decodedErrorMessage = computed(() => {
  try {
    return decodeURIComponent(errorMessageFromUrl.value);
  } catch (e) {
    return errorMessageFromUrl.value;
  }
});

// 3. 定义一个函数，用于关闭对话框并跳转回主页
const closeLoginDialog = () => {
  // 假设你有一个方法可以触发打开/关闭登录对话框
  // 这里的逻辑是回到主页，可以根据需要调整为打开登录对话框
  // 由于我们在一个独立页面上，最好的做法是直接跳转
  // 如果登录对话框是组件，这里可以保持跳转到首页
  // router.push('/');
};

// 确保将此页面用于错误重定向，用户点击链接会回到登录入口
</script>

<style scoped>
/* ---------------------------------------------------- */
/* 样式复用自 verify.vue，确保主题统一 */
/* ---------------------------------------------------- */
:root {
  --primary-color: #ff8c62;
  --secondary-color: #f39c12;
  --text-color: #ffffff;
  --dark-bg: rgba(13, 13, 26, 1);
  --card-bg: #1c1b1b;
  --error-color: var(--primary-color);
  --success-color: #2ecc71;
  --link-color: var(--secondary-color);
  --light-gray: #a0a0a0;
  --shadow-color: rgba(0, 0, 0, 0.5);
}

.error-page-full {
  height: 100vh;
  width: 100vw;
  background-color: var(--dark-bg);
  color: var(--text-color);
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 0;
  box-sizing: border-box;
}

.error-card {
  max-width: 500px;
  width: 90%;
  background-color: var(--card-bg);
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 5px 20px var(--shadow-color);
  text-align: center;
}

.main-title {
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 25px;
  color: var(--primary-color);
}

.state-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

/* 图标样式 */
.status-icon {
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
}
.error-icon {
  color: var(--error-color) !important;
}

/* 状态标题 */
.state-title {
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 5px;
  color: var(--error-color);
}

/* 错误信息 */
.state-description {
  font-size: 1em;
  line-height: 1.5;
  color: var(--light-gray);
  margin-bottom: 10px;
}
.error-message {
  color: var(--light-gray);
  font-weight: normal;
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
