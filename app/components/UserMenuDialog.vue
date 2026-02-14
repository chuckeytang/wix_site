<template>
  <div class="dialog-overlay" @click.self="close">
    <div class="dialog-content">
      <button class="close-button" @click="close">&times;</button>

      <div class="user-info-header">
        <h2 class="user-name">Hello, {{ userName }}</h2>
      </div>

      <ul class="menu-list">
        <!-- TODO: 未来功能
          <li @click="close">
            <NuxtLink to="/account/plan" class="menu-item">
              Membership program
              <span class="chevron">></span>
            </NuxtLink>
          </li>
          -->
        <li @click="close">
          <NuxtLink to="/account/orders" class="menu-item">
            Order
            <span class="chevron">></span>
          </NuxtLink>
        </li>
        <li @click="close">
          <NuxtLink to="/account/purchases" class="menu-item">
            Purchased
            <span class="chevron">></span>
          </NuxtLink>
        </li>
        <!-- TODO: 未来功能
          <li @click="close">
            <NuxtLink to="/account/contact" class="menu-item">
              contact information
              <span class="chevron">></span>
            </NuxtLink>
          </li>
          <li @click="close">
            <NuxtLink to="/account/settings" class="menu-item">
              Setting
              <span class="chevron">></span>
            </NuxtLink>
          </li>
          <li @click="close">
            <NuxtLink to="/account/history" class="menu-item">
              Activity History
              <span class="chevron">></span>
            </NuxtLink>
          </li>
        -->
      </ul>

      <div class="logout-wrapper">
        <button class="logout-button" @click="handleLogout" :disabled="loading">
          {{ loading ? "Processing..." : "logout" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "~/stores/auth";
import { authApi } from "~/api/auth";

const emit = defineEmits(["close", "logout"]);
const authStore = useAuthStore();
const loading = ref(false);

const userName = computed(() => {
  return authStore.user?.nickname || authStore.user?.name || "user";
});

const userEmail = computed(() => {
  return authStore.user?.email || "";
});

const close = () => {
  emit("close");
};

const handleLogout = () => {
  emit("logout");
};

// 异步加载用户数据的逻辑
const fetchUserData = async () => {
  if (!authStore.isAuthenticated) {
    console.warn("User is not authenticated.");
    return;
  }

  loading.value = true;
  try {
    // 核心修改：调用 authApi.getInfo
    const response = await authApi.getInfo();

    if (response.code === 200 && response.data) {
      // 将获取到的最新用户数据更新到 Pinia Store
      authStore.setUser(response.data);
      console.log("User data updated successfully:", response.data.nickname);
    } else {
      console.error("Failed to fetch user data:", response.msg);
    }
  } catch (error) {
    console.error("API call error during user data fetch:", error);
  } finally {
    loading.value = false;
  }
};

// 在组件挂载后获取数据
onMounted(() => {
  fetchUserData();
});
</script>

<style scoped>
:root {
  --sidebar-width: 450px;
  --primary-color: #ff8c62; /* 主题橙色 */
  --secondary-color: #e96d47; /* 按钮橙色 */
  --text-color: #ffffff; /* 白色文字 */
  --card-bg: rgba(13, 13, 26, 1); /* 对话框背景色 */
  --light-gray: #a0a0a0; /* 浅灰色 */
  --border-color: #444444; /* 边框颜色 */
  --dark-gray: rgba(44, 44, 58, 1);
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: flex-end; /* 使对话框靠右 */
  align-items: flex-start;
  z-index: 2000;
  backdrop-filter: blur(5px);
}

.dialog-content {
  width: var(--sidebar-width);
  height: 100%;
  padding: 40px;
  border-radius: 0;
  background-color: transparent;
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: -5px 0 30px rgba(0, 0, 0, 0.3);
  position: relative;
  text-align: center;
  box-sizing: border-box;
  transform: translateX(0);
  transition: transform 0.3s ease-out;
  overflow-y: auto;
}

.close-button {
  position: absolute;
  top: 15px;
  right: 20px;
  background: none;
  border: none;
  color: var(--light-gray);
  font-size: 2rem;
  cursor: pointer;
  z-index: 10;
  transition: color 0.3s;
}
.close-button:hover {
  color: var(--primary-color);
}

.user-info-header {
  padding: 0 0 30px;
  margin-bottom: 20px;
  text-align: left;
}

.user-name {
  font-size: 2.2rem;
  font-weight: bold;
  color: var(--text-color);
  margin: 0;
  text-align: left;
}

.user-email {
  font-size: 0.95rem;
  color: var(--light-gray);
  margin-top: 5px;
  text-align: left;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-list li {
  width: 100%;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 0;
  margin: 0;
  text-decoration: none;
  color: var(--text-color);
  font-size: 1.1em;
  font-weight: 400;
  border-top: 1px solid var(--border-color);
  transition: color 0.2s;
  width: 100%;
}

.menu-item:hover {
  color: var(--primary-color);
}

.chevron {
  font-weight: bold;
  color: var(--light-gray);
}

.logout-wrapper {
  margin-top: 60px;
  padding: 0;
  text-align: center;
}

.logout-button {
  width: 100%;
  padding: 15px;
  background-color: var(--secondary-color); /* 使用主题按钮色 */
  color: var(--text-color);
  border: none;
  border-radius: 5px; /* 使用统一的圆角 */
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-button:hover {
  background-color: #e67a54;
}

.logout-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
