<template>
  <nav class="account-sub-nav">
    <NuxtLink
      v-for="item in navItems"
      :key="item.path"
      :to="item.path"
      class="nav-item"
      :class="{ 'router-link-active': isLinkActive(item.path) }"
    >
      {{ item.label }}
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"; // 导入 Nuxt/Vue Router 的路由对象

const route = useRoute(); // 获取当前的路由对象

// 定义导航项的数据结构
const navItems = [
  // { label: "Membership program", path: "/account/plan" },
  { label: "Order", path: "/account/orders" },
  // { label: "Contact Information", path: "/account/contact" },
  // { label: "Setting", path: "/account/settings" },
  // { label: "Activity History", path: "/account/history" },
];

/**
 * 检查给定路径是否与当前路由匹配（用于高亮显示）
 * @param path 要检查的导航路径
 */
const isLinkActive = (path: string): boolean => {
  // 使用 route.path 来判断当前路径是否与导航项的路径一致
  // 例如：当前在 /account/orders，则 /account/orders 链接会被激活
  return route.path === path;
};
</script>

<style scoped>
/* 样式用于您的二级导航栏 */
.account-sub-nav {
  display: flex;
  gap: 40px; /* 导航项之间的间距 */
  padding: 15px 0; /* 垂直内边距 */
  margin-bottom: 40px; /* 导航和主体内容之间的间距 */
  border-bottom: 1px solid #d1d1d1; /* 浅灰色底部边框 */
}

/* 导航项的通用样式 */
.nav-item {
  text-decoration: none;
  color: #d1d1d1; /* 非激活状态颜色 */
  padding-bottom: 5px;
  transition: all 0.2s;
  font-size: 1.1rem;
}

/* 激活状态的样式 (对应您图片中的橙色高亮) */
.nav-item.router-link-active {
  font-weight: 600;
  color: #ff8c62; /* 橙色高亮 */
  position: relative;
}

/* 激活状态的下划线 (对应图片中的短横线) */
.nav-item.router-link-active::after {
  content: "";
  display: block;
  width: 30px; /* 控制下划线长度 */
  height: 3px; /* 控制下划线粗细 */
  background-color: #ff8c62; /* 橙色 */
  position: absolute;
  bottom: -1px; /* 稍微向上调整，确保它在 border-bottom 上方 */
  left: 50%;
  transform: translateX(-50%); /* 居中对齐 */
}
</style>
