<template>
  <header class="main-header" :class="{ 'is-hidden': isHidden }">
    <div class="container">
      <div class="logo">
        <img src="/images/logo.png" alt="Verscape Logo" />
      </div>
      <nav class="main-nav">
        <ul>
          <li><NuxtLink to="/">HOME</NuxtLink></li>
          <li><NuxtLink to="/music">MUSIC</NuxtLink></li>
          <li><NuxtLink to="/genres">GENRES</NuxtLink></li>
          <li><NuxtLink to="/moods">MOODS</NuxtLink></li>
          <li><NuxtLink to="/playlists">PLAYLISTS</NuxtLink></li>
          <li><NuxtLink to="/sfx">SFX</NuxtLink></li>
          <li><NuxtLink to="/price">PRICE</NuxtLink></li>
        </ul>
      </nav>
      <div class="user-actions">
        <button @click="handleCart" class="cart-button-wrapper">
          <span class="cart-icon">🛒</span>
          <Transition name="cart-badge">
            <span v-if="cartStore.badgeCount > 0" class="cart-badge">
              {{ cartStore.badgeCount }}
            </span>
          </Transition>
        </button>
        <button @click="authStore.openLoginDialog()">
          <img
            src="/icons/user.svg"
            :alt="isAuthenticated ? 'User Menu' : 'User Login'"
            class="user-svg-icon"
          />
        </button>

        <button class="mobile-menu-btn" @click="drawerVisible = true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>

    <client-only>
      <el-drawer
        v-model="drawerVisible"
        title="MENU"
        direction="rtl"
        size="70%"
        class="mobile-nav-drawer"
        :append-to-body="true"
      >
        <nav class="mobile-nav-list">
          <NuxtLink to="/" @click="drawerVisible = false">HOME</NuxtLink>
          <NuxtLink to="/music" @click="drawerVisible = false">MUSIC</NuxtLink>
          <NuxtLink to="/genres" @click="drawerVisible = false"
            >GENRES</NuxtLink
          >
          <NuxtLink to="/moods" @click="drawerVisible = false">MOODS</NuxtLink>
          <NuxtLink to="/playlists" @click="drawerVisible = false"
            >PLAYLISTS</NuxtLink
          >
          <NuxtLink to="/sfx" @click="drawerVisible = false">SFX</NuxtLink>
          <NuxtLink to="/price" @click="drawerVisible = false">PRICE</NuxtLink>
        </nav>
      </el-drawer>
    </client-only>
  </header>
</template>

<script setup>
import { NuxtLink } from "#components";
import { ref, onMounted, onUnmounted, Transition } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import { useCartStore } from "~/stores/cart";

const isHidden = ref(false);
const drawerVisible = ref(false);
let lastScrollY = 0;

// 控制登录对话框显示的状态
const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();

// 监听认证状态
const isAuthenticated = computed(() => authStore.isAuthenticated);

const handleScroll = () => {
  const currentScrollY = window.scrollY;

  // 如果页面在顶部，始终显示 Header
  if (currentScrollY <= 0) {
    isHidden.value = false;
    return;
  }

  // 向下滚动，隐藏 Header
  if (currentScrollY > lastScrollY) {
    isHidden.value = true;
  }
  // 向上滚动，显示 Header
  else if (currentScrollY < lastScrollY) {
    isHidden.value = false;
  }

  // 更新上一次的滚动位置
  lastScrollY = currentScrollY;
};

// 在组件挂载时添加滚动事件监听
onMounted(() => {
  authStore.loadToken();
  if (authStore.isAuthenticated) {
    cartStore.loadCart(); // 只有登录用户才加载购物车
  }
  window.addEventListener("scroll", handleScroll);
});

// 在组件卸载时移除事件监听，防止内存泄漏
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

const handleCart = () => {
  console.log("/cart");
  router.push("/cart");
};
</script>

<style scoped>
.main-header {
  background-color: #991a1a1a;
  color: #fff;
  padding: 15px 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  transition: transform 0.3s ease-in-out;
  backdrop-filter: blur(10px);
}

.main-header.is-hidden {
  transform: translateY(-100%);
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.logo img {
  height: 32px; /* Adjust logo size */
}

.main-nav ul {
  list-style: none;
  display: flex;
  gap: 50px;
  margin: 0;
  padding: 0;
  align-items: center;
  column-gap: 60px;
}

.main-nav a {
  color: #fff;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.1em;
  transition: color 0.3s;
  padding: 10px 10px;
  display: block;
}

.main-nav a:hover {
  color: #fff;
  background-color: #ff9900;
}

.main-nav .router-link-exact-active {
  color: #ff9900; /* 文字变为 ff9900 */
  /* 如果你不希望当前页面有 hover 效果，可以添加以下样式 */
  background-color: transparent;
  border-bottom: none;
}

/* 确保当前页面的 hover 效果不会覆盖其激活状态的颜色 */
.main-nav .router-link-exact-active:hover {
  background-color: transparent;
  color: #ff9900;
}

.main-nav .router-link-exact-active {
  color: #ff9900;
  border-bottom: 2px solid #ff9900;
}

.user-actions {
  display: flex;
  gap: 15px;
}

.user-actions button {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.cart-icon {
  font-size: 32px;
}

.user-svg-icon {
  height: 32px;
  width: auto;
  position: relative;
  top: 6px;
}

.main-nav {
  margin-right: 50px;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease-in-out;
}

.slide-right-enter-from .dialog-content,
.slide-right-leave-to .dialog-content {
  /* 让内容向右侧移动侧边栏自身的宽度，使其滑出视口 */
  transform: translateX(var(--sidebar-width));
}

.slide-right-enter-from,
.slide-right-leave-to {
  opacity: 0;
}

.cart-button-wrapper {
  position: relative; /* 用于定位角标 */
  padding: 0;
  background: none;
  border: none;
}

.cart-badge {
  position: absolute;
  top: 0px; /* 调整位置 */
  right: -10px; /* 调整位置 */
  background-color: #ff8c62; /* 使用主题色 */
  color: #0d0d1a;
  border-radius: 50%;
  font-size: 14px;
  font-weight: bold;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  padding: 2px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

.cart-icon {
  font-size: 32px;
}

/* 购物车角标过渡动画 */
.cart-badge-enter-active,
.cart-badge-leave-active {
  transition: all 0.3s ease;
}

.cart-badge-enter-from,
.cart-badge-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

/* --- 移动端适配样式 --- */
.mobile-menu-btn {
  display: none; /* 默认隐藏 */
}

/* 移动端菜单列表样式 */
.mobile-nav-list {
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
}

.mobile-nav-list a {
  font-size: 1.2em;
  font-weight: bold;
  color: #333;
  text-decoration: none;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.mobile-nav-list a.router-link-active {
  color: #ff8c62;
}

@media (max-width: 768px) {
  /* 隐藏桌面导航 */
  .desktop-only {
    display: none !important;
  }

  /* 显示汉堡菜单 */
  .mobile-menu-btn {
    display: block !important;
  }

  /* 调整 logo 大小防止溢出 */
  .logo img {
    height: 28px;
  }
}
</style>
