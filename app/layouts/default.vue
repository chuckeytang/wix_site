<template>
  <div>
    <!-- 引入并使用 TheHeader 组件 -->
    <TheHeader />
    <!-- slot 用于插入当前页面的内容 (由 NuxtPage 渲染) -->
    <slot />
    <!-- 引入并使用 TheFooter 组件 -->
    <TheFooter />

    <Transition name="slide-right">
      <component
        :is="modalComponent"
        v-if="authStore.showLoginDialog"
        @close="authStore.closeLoginDialog"
        @logout="handleLogout"
      />
    </Transition>

    <LicenseModal
      v-if="authStore.isAuthenticated && authStore.showLicenseModal"
      :is-visible="authStore.showLicenseModal"
      :track-id="authStore.trackIdForLicense!"
      :track-title="authStore.trackTitleForLicense!"
      :product-type="authStore.productTypeForLicense!"
      @close="authStore.closeLicenseModal"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";
// 从 components 目录导入 TheHeader 和 TheFooter
import TheHeader from "@/components/TheHeader.vue";
import TheFooter from "@/components/TheFooter.vue";
import LoginDialog from "@/components/LoginDialog.vue";
import UserMenuDialog from "@/components/UserMenuDialog.vue";
import LicenseModal from "@/components/LicenseModal.vue";

const authStore = useAuthStore();
const router = useRouter();

// 动态选择要渲染的模态框组件 (LoginDialog 或 UserMenuDialog)
const modalComponent = computed(() => {
  return authStore.isAuthenticated ? UserMenuDialog : LoginDialog;
});

// 处理全局登出逻辑 (与原 TheHeader.vue 保持一致)
const handleLogout = () => {
  authStore.logout();
  // 登出后刷新当前页面，或跳转到首页
  router.go(0); // 刷新页面
};
</script>

<style>
/* 这里可以放置全局样式，例如设置 body 的背景色或字体 */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f4f4; /* 示例背景色 */
  color: #333;
}

main {
  padding-top: 60px; /* 根据你的 header 高度进行调整 */
}

/* 必须在全局或 layout 样式中定义过渡类 */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease-out;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>
