<template>
  <div
    class="verify-page flex items-center justify-center min-h-screen bg-gray-900 text-white"
  >
    <div
      class="verify-card p-10 rounded-lg shadow-2xl bg-gray-800 text-center max-w-md w-full"
    >
      <h1 class="text-3xl font-bold mb-6 text-primary-color">
        Email Verification
      </h1>

      <div v-if="loading">
        <svg
          class="animate-spin h-8 w-8 text-secondary-color mx-auto mb-4"
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
        <p class="text-lg">Verifying your email address...</p>
      </div>

      <div v-else-if="success">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-12 w-12 text-green-500 mx-auto mb-4"
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
        <h2 class="text-2xl font-semibold mb-4 text-green-400">
          Verification Successful!
        </h2>
        <p class="mb-6">
          You have successfully verified your email. Redirecting you to the home
          page now.
        </p>
        <NuxtLink to="/" class="text-secondary-color hover:underline">
          Go to Home Page
        </NuxtLink>
      </div>

      <div v-else>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-12 w-12 text-red-500 mx-auto mb-4"
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
        <h2 class="text-2xl font-semibold mb-4 text-red-400">
          Verification Failed
        </h2>
        <p class="mb-6 text-red-300">{{ errorMessage }}</p>
        <p
          v-if="errorMessage.includes('过期') || errorMessage.includes('无效')"
          class="mb-6 text-gray-400"
        >
          您的验证链接可能已过期或无效。请尝试重新注册。
        </p>
        <NuxtLink to="/" class="text-secondary-color hover:underline">
          Go back to Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { authApi } from "~/api/auth";
import { useAuthStore } from "~/stores/auth";

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
      setTimeout(() => {
        router.push("/");
      }, 3000); // 3秒后自动跳转
    } else {
      // 验证失败，显示后端返回的错误信息
      errorMessage.value = response.msg || "Email verification failed.";
      success.value = false;
    }
  } catch (error) {
    console.error("Verification API error:", error);
    errorMessage.value =
      error.response?.data?.msg ||
      "Network error occurred during verification.";
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
/* 可以在这里添加一些样式 */
.verify-card {
  /* 使用你项目的主色调，例如 primary-color 和 secondary-color */
  min-width: 400px;
}
.text-primary-color {
  color: var(--primary-color, #f39c12); /* 假设 primary-color */
}
.text-secondary-color {
  color: var(--secondary-color, #e96d47); /* 假设 secondary-color */
}
</style>
