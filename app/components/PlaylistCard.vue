<template>
  <div class="playlist-card" @click="handleCardClick()">
    <div class="card-image-container">
      <img :src="playlist.imageUrl" :alt="playlist.title" class="card-image" />

      <div class="play-button-overlay">
        <button class="play-button" @click.stop="handlePlayPlaylist()">
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

      <div class="card-content-overlay">
        <div class="track-info">
          <span class="music-icon">🎧</span>
          <span class="track-count">{{ "?" }} Tracks</span>
        </div>
        <h3 class="playlist-title">{{ playlist.title }}</h3>
        <p class="playlist-description">{{ playlist.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from "vue";
import type { Playlists } from "~/types/playlists";
import { useMusicPlayerStore } from "~/stores/musicPlayer";
import type { Tracks } from "~/types/tracks";

const props = defineProps({
  playlist: {
    type: Object as () => Playlists,
    required: true,
  },
});

const emit = defineEmits(["select-card", "play-playlist"]);

const musicPlayerStore = useMusicPlayerStore();

// 监听全局播放状态，更新此卡片的 UI
const localIsPlaying = computed(() => {
  return (
    musicPlayerStore.currentSourceId === props.playlist.playlistId &&
    musicPlayerStore.isPlaying
  );
});

// 计算当前播放进度
const currentProgress = computed(() => {
  if (localIsPlaying.value) {
    return musicPlayerStore.currentProgress;
  }
  return 0;
});

const handleCardClick = () => {
  emit("select-card", props.playlist.playlistId);
};

const handlePlayPlaylist = () => {
  if (localIsPlaying.value) {
    musicPlayerStore.togglePlayPause();
  } else {
    emit("play-playlist", props.playlist.playlistId);
  }
};
</script>

<style scoped>
/* 保持原有样式，并添加播放按钮和进度条的样式 */
.playlist-card {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  cursor: pointer;
}
.playlist-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.card-image-container {
  width: 100%;
  position: relative;
  /* 使用固定的高度来确保比例一致 */
  height: 250px;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: filter 0.3s ease-in-out;
}

.card-content-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0) 100%
  );
  z-index: 10;
}

/* 新增：播放按钮覆盖层 */
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
  z-index: 20; /* 确保它高于 card-content-overlay */
}

.playlist-card:hover .play-button-overlay {
  opacity: 1;
}

/* 新增：播放按钮样式 */
.play-button {
  background-color: transparent;
  color: #fff;
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
  position: relative;
}

.play-button:hover {
  transform: scale(1.1);
}

.play-button svg:not(.circular-progress-bar) {
  width: 24px;
  height: 24px;
  fill: currentColor;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 新增：进度条样式 */
.circular-progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: rotate(0deg);
}

.circle-bg {
  fill: none;
  stroke: #fff;
  stroke-width: 2.5;
  opacity: 0.3;
}

.circle {
  fill: none;
  stroke: #ff8c62;
  stroke-width: 2.5;
  transition: stroke-dasharray 0.3s;
}

.card-content-overlay:hover .card-image {
  filter: brightness(70%);
}

.track-info {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.1rem;
  color: #fff;
  margin-bottom: 10px;
  z-index: 20; /* 确保信息在播放按钮之上 */
}

.music-icon {
  font-size: 1.5rem;
}
.track-count {
  font-weight: 700;
}
.playlist-title {
  font-size: 2rem;
  font-weight: bold;
  margin: 0 0 10px 0;
  line-height: 1.2;
  z-index: 20;
}
.playlist-description {
  font-size: 1rem;
  color: #ccc;
  margin: 0;
  line-height: 1.4;
  z-index: 20;
}
</style>
