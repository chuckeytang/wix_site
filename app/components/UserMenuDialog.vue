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
              您的会员计划
              <span class="chevron">></span>
            </NuxtLink>
          </li>
          <li @click="close">
            <NuxtLink to="/account/orders" class="menu-item">
              订单
              <span class="chevron">></span>
            </NuxtLink>
          </li>
          <li @click="close">
            <NuxtLink to="/account/contact" class="menu-item">
              联系信息
              <span class="chevron">></span>
            </NuxtLink>
          </li>
          <li @click="close">
            <NuxtLink to="/account/settings" class="menu-item">
              设置
              <span class="chevron">></span>
            </NuxtLink>
          </li>
          <li @click="close">
            <NuxtLink to="/account/history" class="menu-item">
              活动历史记录
              <span class="chevron">></span>
            </NuxtLink>
          </li>
        </ul>
  
        <div class="logout-wrapper">
          <button class="logout-button" @click="handleLogout">
            登出
          </button>
        </div>
  
        <button class="chat-button">💬</button>
        
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useAuthStore } from '~/stores/auth'; // 假设您的 Pinia Store 路径
  
  const emit = defineEmits(['close', 'logout']);
  const authStore = useAuthStore();
  

  const userName = computed(() => {
    return authStore.user?.nickname || authStore.user?.name || '用户'; 
  });
  
  const close = () => {
    emit('close'); // 通知父组件关闭侧边栏
  };
  
  const handleLogout = () => {
    emit('logout'); 
  };
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
  
  /* ---------------------------------------------------- */
  /* 用户菜单特有样式 */
  /* ---------------------------------------------------- */
  
  .user-info-header {
    padding: 0 0 30px; 
    margin-bottom: 20px; /* 姓名下方与菜单的间距 */
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
    padding: 18px 0; /* 增加上下间距 */
    text-decoration: none;
    color: var(--text-color);
    font-size: 1.1em;
    font-weight: 400;
    border-top: 1px solid var(--border-color); /* 顶部线条 */
    transition: color 0.2s;
  }
  /* 列表最后一个元素取消底部边框，但这里用 border-top 更好处理 */
  
  .menu-item:hover {
    color: var(--primary-color);
  }
  
  .chevron {
    font-weight: bold;
    color: var(--light-gray);
  }
  
  /* 登出按钮样式 */
  .logout-wrapper {
    /* 调整位置，使其靠近底部但不是绝对底部 */
    margin-top: 60px; 
    padding: 20px 0;
    text-align: center;
  }
  
  .logout-button {
    width: 100%;
    padding: 14px;
    background-color: rgba(255, 255, 255, 0.1); /* 浅灰色背景 */
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
  
  /* 浮动聊天按钮 */
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