<template>
  <div>
    <!-- 引入并使用 TheHeader 组件 -->
    <TheHeader />
    <!-- slot 用于插入当前页面的内容 (由 NuxtPage 渲染) -->
    <slot />
    <!-- 引入并使用 TheFooter 组件 -->
    <TheFooter />

    <ClientOnly>
      <LoginPromptModal />
    </ClientOnly>
    <ClientOnly>
      <Transition name="slide-right">
        <component
          :is="modalComponent"
          v-if="authStore.showLoginDialog"
          @close="authStore.closeLoginDialog"
          @logout="handleLogout"
        />
      </Transition>
    </ClientOnly>

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
import { computed, onMounted} from "vue";
import { useRouter,useRoute } from "vue-router";
import { useAuthStore } from "~/stores/auth";
// 从 components 目录导入 TheHeader 和 TheFooter
import TheHeader from "@/components/TheHeader.vue";
import TheFooter from "@/components/TheFooter.vue";
import LoginDialog from "@/components/LoginDialog.vue";
import UserMenuDialog from "@/components/UserMenuDialog.vue";
import LicenseModal from "@/components/LicenseModal.vue";
import LoginPromptModal from "~/components/auth/LoginPromptModal.vue";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

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

onMounted(() => {
  // 1. 确保在客户端挂载时加载 Token
  authStore.loadToken();

  // 2. 检查 URL 中是否有 'promptLogin=true' 指令
  if (route.query.promptLogin === 'true') {
    
    // 确保用户仍然未登录，我们才弹出提示
    if (!authStore.isAuthenticated) {
      console.log("客户端接收到指令，弹出 LoginPromptModal");
      authStore.openPromptLogin();
    }
    
    // 3. 清除 URL 中的指令参数，保持地址栏干净
    // 必须使用 router.replace 替换历史记录，而不是 push
    const newQuery = { ...route.query };
    delete newQuery.promptLogin;
    
    // 使用 replace 方法更新 URL，不改变路由历史记录
    router.replace({ query: newQuery });
  }
});
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
