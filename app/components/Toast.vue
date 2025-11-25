<template>
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isVisible" class="toast-container">
          {{ message }}
        </div>
      </Transition>
    </Teleport>
  </template>
  
  <script setup lang="ts">
  import { useToast } from '@/composables/useToast';
  
  // 引入刚才定义的全局状态
  const { isVisible, message } = useToast();
  </script>
  
  <style scoped>
  .toast-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); /* 完美居中 */
    
    /* 半透明黑色背景 */
    background-color: rgba(0, 0, 0, 0.7);
    color: #fff;
    
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 16px;
    z-index: 9999;
    pointer-events: none; /* 让鼠标点击穿透，不影响下面操作 */
    text-align: center;
  }
  
  /* Vue Transition 动画样式 */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  </style>