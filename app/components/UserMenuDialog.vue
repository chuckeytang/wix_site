<template>
    <div class="dialog-overlay" @click.self="close">
      <div class="dialog-content user-menu-content">
        <button class="close-button" @click="close">&times;</button>
  
        <div class="user-info-header">
          <h2 class="user-name">Hello, {{ userName }}</h2> 
        </div>
        
        <ul class="menu-list">
          <li @click="close">
            <NuxtLink to="/account/plan" class="menu-item">
              Membership program
              <span class="chevron">></span>
            </NuxtLink>
          </li>
          <li @click="close">
            <NuxtLink to="/account/orders" class="menu-item">
              Order
              <span class="chevron">></span>
            </NuxtLink>
          </li>
          <li @click="close">
            <NuxtLink to="/account/contact" class="menu-item">
              contact information
              <span class="chevron">></span>
            </NuxtLink>
          </li>
          <li @click="close">
            <NuxtLink to="/account/settings" class="menu-item">
              setting
              <span class="chevron">></span>
            </NuxtLink>
          </li>
          <li @click="close">
            <NuxtLink to="/account/history" class="menu-item">
              Activity History
              <span class="chevron">></span>
            </NuxtLink>
          </li>
        </ul>
  
        <div class="logout-wrapper">
          <button class="logout-button" @click="handleLogout">
            logout
          </button>
        </div>
        
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useAuthStore } from '~/stores/auth';
  
  const emit = defineEmits(['close', 'logout']);
  const authStore = useAuthStore();
  

  const userName = computed(() => {
    return authStore.user?.nickname || authStore.user?.name || 'user'; 
  });
  
  const close = () => {
    emit('close');
  };
  
  const handleLogout = () => {
    emit('logout'); 
  };
  </script>
  
  <style scoped>

  :root {
    --sidebar-width: 660px;
    --primary-color: #ff8c62; /* 主题橙色 */
    --secondary-color: #e96d47; /* 按钮橙色 */
    --text-color: #ffffff; /* 白色文字 */
    --card-bg: rgba(13, 13, 26, 1); /* 对话框背景色 */
    --light-gray: #a0a0a0; /* 浅灰色 */
    --border-color: #444444; /* 边框颜色 */
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
    background-color: var(--card-bg);
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.5);
    position: relative;
    box-sizing: border-box;
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
  }
  
  .user-info-header {
    padding: 0 0 30px; 
    margin-bottom: 20px;
    text-align: left;
  }
  
  .user-name {
    font-size: 1.8rem;
    font-weight: 600;
    color: var(--text-color);
    margin: 0;
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
    margin: 0 18px;
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
    padding: 20px 0;
    text-align: center;
  }
  
  .logout-button {
    width: 100%;
    padding: 14px;
    background-color: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 30px; 
    color: var(--text-color);
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .logout-button:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  .chat-button {
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: var(--primary-color);
    color: white;
    border: none;
    font-size: 1.5rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  </style>