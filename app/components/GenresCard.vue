<template>
  <div class="genres-card">
    <div class="card-image-container">
      <div class="play-button-overlay">
        <button class="play-button">▶</button>
      </div>
      <img :src="genreslist.coverImageUrl" :alt="genreslist.name" />
    </div>
    <div class="card-content">
      <h3 class="card-title">{{ genreslist.name }}</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import type { Genres } from "~/types/genres";

defineProps({
  genreslist: {
    // 使用类型断言明确指定 prop 的类型
    type: Object as () => Genres,
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
  transition:
    transform 0.3s ease-in-out,
    box-shadow 0.3s ease-in-out;
  cursor: pointer;
}

.genres-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.card-image-container {
  width: 100%;
  /* 关键：使用 padding-bottom 实现正方形宽高比 (1:1) */
  padding-bottom: 100%;
  position: relative;
}

.card-image-container img {
  /* 图片绝对定位到容器内，并覆盖 */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: filter 0.3s ease-in-out;
}

/* 底部标题内容区 */
.card-content {
  background-color: rgba(255, 255, 255, 0.05); /* 淡雅的半透明白色背景 */
  padding: 10px;
  /* 居中对齐 */
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.card-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff; /* 确保标题颜色清晰可见 */
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
  align-items: center; /* 垂直居中 */
  opacity: 0; /* 默认隐藏 */
  transition: opacity 0.3s ease-in-out;
  z-index: 10; /* 确保在图片上方 */
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
  background-color: #fff;
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
