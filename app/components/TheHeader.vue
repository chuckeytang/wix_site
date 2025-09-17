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
          <li><NuxtLink to="/checkout">CHECKOUT</NuxtLink></li>
          <li><NuxtLink to="/sfx">SFX</NuxtLink></li>
        </ul>
      </nav>
      <div class="user-actions">
        <button @click="handleLogin">Login</button>
        <button @click="handleCart">
          <span class="cart-icon">🛒</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { NuxtLink } from "#components";
import { ref, onMounted, onUnmounted } from "vue";

const isHidden = ref(false);
let lastScrollY = 0;

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
  window.addEventListener("scroll", handleScroll);
});

// 在组件卸载时移除事件监听，防止内存泄漏
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

const handleLogin = () => {
  // Redirect to Wix login URL
  console.log("Redirecting to Wix login...");
};

const handleCart = () => {
  // Redirect to Wix cart/checkout page
  console.log("Redirecting to Wix cart...");
};
</script>

<style scoped>
.main-header {
  background-color: #991a1a1a;
  color: #fff;
  padding: 15px 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  position: fixed; /* 将元素固定在视口中 */
  top: 0; /* 距离视口顶部 0px */
  left: 0; /* 距离视口左侧 0px */
  width: 100%; /* 宽度占满整个视口 */
  z-index: 1000; /* 确保它位于其他内容之上 */

  transition: transform 0.3s ease-in-out;
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

.main-nav{
  margin-right: 50px;
}
</style>
