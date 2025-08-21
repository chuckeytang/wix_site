<template>
    <div class = "genres-card">
        <div class="card-image-container">
            <div class="play-button-overlay">
                <button class="play-button">▶</button>
            </div>
            <img :src="moodlist.cover_image_url" :alt="moodlist.name">
        </div>
        <div class = "genres-card-content">
            <h3 class = "card-title">{{ moodlist.name }}</h3>
        </div>
    </div>
</template>

<script setup>
  import { defineProps } from 'vue';
  
  defineProps({
    moodlist: {
      type: Object,
      required: true,
    },
  });
</script>

<style scoped>
.genres-card {
    /* 移除 position: relative; */
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    cursor: pointer;
}

.genres-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.card-image-container {
    /* 移除 position: absolute; 和 top/left 等，让它在文档流中 */
    width: 100%;
    /* 使用 padding-bottom 实现 4:3 的宽高比 */
    padding-bottom: 75%;
    position: relative; /* 为子元素 img 提供定位参考 */
    transition: filter 0.3s ease-in-out;
}

.card-image-container img {
    /* 图片绝对定位到容器内，并覆盖 */
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.card-content-banner {
    background-color: #dcd5d5; /* 根据图片颜色调整 */
    color: #fff;
    padding: 15px;
    text-align: left; /* 文字左对齐 */
}

.card-title {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 700;
    color: #dcd5d5;
}

.play-button-overlay {
    position: absolute; /* 绝对定位，覆盖在图片上 */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* 半透明黑色背景 */
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center;     /* 垂直居中 */
    opacity: 0;              /* 默认隐藏 */
    transition: opacity 0.3s ease-in-out;
    z-index: 10;             /* 确保在图片上方 */
}

.genres-card:hover .play-button-overlay {
    opacity: 1;
}

/* 鼠标悬停时，图片变暗 */
.genres-card:hover .card-image-container img {
    filter: brightness(70%);
}

/* 播放按钮样式 */
.play-button {
    background-color: #dcd5d5;
    color: #1a1a1a;
    border: none;
    border-radius: 50%; /* 圆形按钮 */
    width: 60px;
    height: 60px;
    font-size: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: transform 0.2s ease-in-out;
}

.play-button:hover {
    transform: scale(1.1); /* 悬停时放大 */
}
</style>