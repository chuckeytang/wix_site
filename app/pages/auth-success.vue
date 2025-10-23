<template>
  <div class="auth-page-success">
    <div class="message-card">
      <h1 class="title">Logging you in...</h1>
      <p class="status">Securing your session and redirecting.</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";

// 1. 使用 blank 布局，移除 Header/Footer
definePageMeta({
  layout: "blank",
});

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
  const token = route.query.token;

  if (token) {
    // 2. 存储 JWT Token
    authStore.setToken(token);

    // 3. 重定向到主页 (或你想让用户去的地方)
    router.push("/");
  } else {
    // 如果没有 token，跳转到错误页
    router.push("/login-error?msg=Authentication token missing.");
  }
});
</script>

<style scoped>
/* 确保这些变量和样式在你的项目中是可用的 */
.auth-page-success {
  height: 100vh;
  background-color: rgba(13, 13, 26, 1); /* 假设你的 --dark-bg */
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
.message-card {
  padding: 40px;
  background-color: rgba(44, 44, 58, 1);
  border-radius: 8px;
  text-align: center;
}
.title {
  font-size: 1.5rem;
  color: #ff8c62;
}
.status {
  margin-top: 10px;
}
</style>
