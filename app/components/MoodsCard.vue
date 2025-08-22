<template>
  <div class="moods-card">
    <div class="card-image-container">
      <div class="play-button-overlay">
        <button class="play-button">▶</button>
      </div>
      <img :src="moodlist.coverImageUrl" :alt="moodlist.name" />
    </div>
    <div class="card-content">
      <h3 class="card-title">{{ moodlist.name }}</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import type { Moods } from "~/types/moods";

defineProps({
  moodlist: {
    type: Object as () => Moods,
    required: true,
  },
});
</script>

<style scoped>
/* 使用 moods-card 作为最外层容器，避免与 genres-card 冲突 */
.moods-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition:
    transform 0.3s ease-in-out,
    box-shadow 0.3s ease-in-out;
  cursor: pointer;
}

.moods-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.card-image-container {
  width: 100%;
  /* 关键：使用 padding-bottom 实现正方形宽高比 (1:1) */
  padding-bottom: 100%;
  position: relative;
  transition: filter 0.3s ease-in-out;
}

.card-image-container img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* 确保图片完全覆盖，并裁剪多余部分 */
  object-fit: cover;
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

/* 悬停时的播放按钮覆盖层 */
.play-button-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  z-index: 10;
}

.moods-card:hover .play-button-overlay {
  opacity: 1;
}

.moods-card:hover .card-image-container img {
  filter: brightness(70%);
}

.play-button {
  background-color: #fff; /* 按钮背景色 */
  color: #1a1a1a;
  border: none;
  border-radius: 50%;
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
  transform: scale(1.1);
}
</style>
