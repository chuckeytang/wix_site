<template>
  <div class="wix-callback-page">
    <p class="text-white text-center p-8">Processing login, please wait...</p>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { authApi } from "~/api/auth";
import { useAuthStore } from "~/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const handleIframeMessage = async (event) => {
  // 验证消息来源，防止跨站脚本攻击
  if (event.origin !== "https://www.wix.com") {
    return;
  }

  const { type, payload } = event.data;
  if (type === "authorizationCode" && payload.code) {
    try {
      const response = await authApi.handleWixCallback({
        code: payload.code,
        state: payload.state,
        wixUserId: payload.wixUserId, // 假设Wix在iframe回调中返回了wixUserId，但更稳妥的方法是您自己管理
      });

      if (response.code === 200 && response.data.token) {
        authStore.setToken(response.data.token);
        await router.push("/");
      } else {
        console.error("Authorization failed:", response.msg);
        await router.push("/login?error=Authorization failed");
      }
    } catch (error) {
      console.error("API call failed:", error);
      await router.push("/login?error=Network error");
    }
  }
};

onMounted(() => {
  window.addEventListener("message", handleIframeMessage);
});

onUnmounted(() => {
  window.removeEventListener("message", handleIframeMessage);
});
</script>
