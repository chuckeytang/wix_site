<template>
  <div>
    <!-- 引入并使用 TheHeader 组件 -->
    <TheHeader />
    <!-- slot 用于插入当前页面的内容 (由 NuxtPage 渲染) -->
    <slot /> 
    <!-- 引入并使用 TheFooter 组件 -->
    <TheFooter />
  </div>
</template>

<script setup>
// 从 components 目录导入 TheHeader 和 TheFooter
import TheHeader from '@/components/TheHeader.vue';
import TheFooter from '@/components/TheFooter.vue';
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
</style>
