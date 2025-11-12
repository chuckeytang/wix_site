<template>
    <div class="cart-page">
      <div class="empty-cart-container">
        
        <div class="cart-icon-wrapper">
          <svg
            class="cart-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </div>
        
        <h1 class="title">Your cart is empty.</h1>
        
        <p class="description">
          Dive into our playlists, and find the perfect song that suits you.
        </p>
  
        <NuxtLink to="/music" class="browse-button">
          BROWSE MUSIC
        </NuxtLink>
      </div>
    </div>
  </template>
  
  <script setup>
  // 购物车为空时，不需要复杂的逻辑，只需 NuxtLink 即可。
  import { NuxtLink } from "#components";
  </script>
  
  <style scoped>
  /* 整个页面的深色背景和白色文字 (参考暗色系图片) */
  .cart-page {
    /* 假设背景色是深色 (如 #1a1a1a 或类似) */
    background-color: #12121e; 
    color: #ffffff;
    min-height: calc(100vh - var(--header-height) - var(--footer-height, 0px)); /* 确保至少占满屏幕高度 */
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    /* 留出固定 header 的空间 */
    padding-top: 80px; 
  }
  
  .empty-cart-container {
    max-width: 400px;
    padding: 40px;
  }
  
  /* 购物车图标样式 */
  .cart-icon-wrapper {
    margin-bottom: 20px;
    color: #ff8c62; /* 使用暗色系图片中的橙色作为点缀色 */
  }
  
  .cart-icon {
    width: 60px;
    height: 60px;
    stroke: currentColor; /* 使用父元素的颜色 */
  }
  
  /* 标题样式 */
  .title {
    font-size: 2em;
    font-weight: bold;
    margin-bottom: 15px;
  }
  
  /* 描述样式 */
  .description {
    font-size: 1.1em;
    color: #aaaaaa; /* 稍浅的灰色，增加对比度 */
    margin-bottom: 30px;
  }
  
  /* 按钮样式 (参考暗色系图片的下载按钮，使用橙色) */
  .browse-button {
    display: inline-block;
    background-color: #ff8c62; /* 主色调橙色 */
    color: #1a1a1a; /* 按钮内部的深色文字 */
    text-decoration: none;
    font-weight: bold;
    padding: 12px 30px;
    border-radius: 4px;
    transition: background-color 0.3s ease;
    letter-spacing: 1px;
  }
  
  .browse-button:hover {
    background-color: #ff8c62cc; /* 鼠标悬停时稍微变深 */
  }
  </style>