<template>
    <div v-if="authStore.promptLogin" class="modal-overlay">
      <div class="modal-content">
        <h3 class="modal-title">Access Restricted</h3>
        <p class="modal-message">You need to log in to access this page.</p>
        
        <div class="modal-actions">
          <button class="btn-confirm" @click="handleConfirm">ok</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useAuthStore } from '~/stores/auth';
  
  const authStore = useAuthStore();
  
  /**
   * 响应用户点击“确定登录”按钮
   */
  const handleConfirm = () => {
    // 1. 关闭提示弹窗 (清空 promptLogin 状态)
    authStore.closePromptLogin();
    
    // 2. 拉出侧边栏登录框 (设置 showLoginDialog 状态)
    authStore.openLoginDialog(); 
  };
  </script>
  
  <style scoped>
  /* 定义颜色变量，以匹配您之前提供的样式 */
  :root {
    --primary-color: #ff8c62; /* 主题橙色 */
    --text-color: #ffffff; /* 白色文字 */
    --card-bg: rgba(13, 13, 26, 0.95); /* 模态框背景色 */
    --dark-bg: #12121e;
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7); /* 半透明黑色背景 */
    backdrop-filter: blur(4px); /* 略微模糊背景 */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 3000; /* 确保它在所有内容之上 */
  }
  
  .modal-content {
    background: var(--dark-bg);
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
    color: var(--text-color);
    text-align: center;
    width: 90%;
    max-width: 400px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .modal-title {
    font-size: 1.8rem;
    font-weight: bold;
    color: var(--primary-color);
    margin-bottom: 15px;
  }
  
  .modal-message {
    font-size: 1.05rem;
    color: #ccc;
    margin-bottom: 30px;
    line-height: 1.6;
  }
  
  .modal-actions {
    display: flex;
    justify-content: center;
    gap: 20px;
  }
  
  .btn-confirm,
  .btn-cancel {
    padding: 12px 25px;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
    transition: opacity 0.3s, transform 0.1s;
  }
  
  .btn-confirm {
    background-color: var(--primary-color);
    color: white;
  }
  
  .btn-confirm:hover {
    opacity: 0.9;
  }
  
  .btn-cancel {
    background-color: #444;
    color: white;
  }
  
  .btn-cancel:hover {
    background-color: #555;
  }
  </style>