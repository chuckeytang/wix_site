<template>
  <div class="blank-layout">
    <slot />
  </div>
</template>

<script setup>
// 不需要导入 Header/Footer
</script>

<style>
/* 确保空白布局占据整个屏幕，并设置你想要的主题背景 */
.blank-layout {
  min-height: 100vh;
  margin: 0;
  padding: 0;
  /* 统一应用深色背景，覆盖全局 body 样式 */
  background-color: rgba(13, 13, 26, 1);
}
</style>
