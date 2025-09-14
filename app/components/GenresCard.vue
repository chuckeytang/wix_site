<template>
  <div class="genres-card" @click="handleCardClick()">
    <div class="card-image-container">
      <div class="play-button-overlay">
        <button class="play-button" @click.stop="handlePlayGenre()">
          <svg viewBox="0 0 36 36" class="circular-progress-bar">
            <path
              class="circle-bg"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              class="circle"
              :stroke-dasharray="`${currentProgress}, 100`"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <svg
            v-if="!localIsPlaying"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>
        </button>
      </div>
      <img :src="genreslist.coverImageUrl" :alt="genreslist.name" />
    </div>
    <div class="card-content">
      <h3 class="card-title">{{ genreslist.name }}</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch, computed } from "vue";
import type { Genres } from "~/types/genres";
import { useMusicPlayerStore } from "~/stores/musicPlayer";
import type { Tracks } from "~/types/tracks";

const props = defineProps({
  genreslist: {
    type: Object as () => Genres,
    required: true,
  },
});

const emit = defineEmits(["select-card", "play-genre"]);

const musicPlayerStore = useMusicPlayerStore();

// 监听全局播放状态，更新此卡片的 UI
const localIsPlaying = computed(() => {
  return (
    musicPlayerStore.currentSourceId === props.genreslist.genreId &&
    musicPlayerStore.isPlaying
  );
});

const currentProgress = computed(() => {
  // 如果当前正在播放这个流派，则返回全局进度
  if (localIsPlaying.value) {
    return musicPlayerStore.currentProgress;
  }
  // 否则，进度为0
  return 0;
});

const handleCardClick = () => {
  emit("select-card", props.genreslist.genreId);
};

const handlePlayGenre = () => {
  if (localIsPlaying.value) {
    // 如果已经在播放，则暂停
    musicPlayerStore.togglePlayPause();
  } else {
    // 如果不在播放，则通知父组件播放此流派
    emit("play-genre", props.genreslist.genreId);
  }
};
</script>

<style scoped>
.genres-card {
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

/* 覆盖层和播放按钮容器 */
.card-image-container {
  width: 100%;
  padding-bottom: 100%;
  position: relative;
}

.card-image-container img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: filter 0.3s ease-in-out;
}

.card-content {
  background-color: rgba(255, 255, 255, 0.05);
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.card-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
}

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

.genres-card:hover .play-button-overlay {
  opacity: 1;
}

.genres-card:hover .card-image-container img {
  filter: brightness(70%);
}

/* 播放按钮样式 */
.play-button {
  background-color: transparent; /* 背景透明 */
  color: #fff; /* 图标颜色白色 */
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
  position: relative; /* 用于定位进度条 */
}

/* 播放按钮悬停效果 */
.play-button:hover {
  transform: scale(1.1);
}

/* 播放按钮内部 SVG 图标 */
.play-button svg:not(.circular-progress-bar) {
  width: 24px;
  height: 24px;
  fill: currentColor;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 进度条样式，与 musicCard.vue 保持一致 */
.circular-progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: rotate(0deg); /* 旋转以使进度条从顶部开始 */
}

.circle-bg {
  fill: none;
  stroke: #fff; /* 进度条背景色，保持白色 */
  stroke-width: 2.5;
  opacity: 0.3; /* 背景透明度降低 */
}

.circle {
  fill: none;
  stroke: #ff8c62; /* 进度条填充色 */
  stroke-width: 2.5;
  transition: stroke-dasharray 0.3s;
}
</style>
