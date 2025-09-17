<template>
  <div class="moods-card" @click="handleCardClick()">
    <div class="card-image-container">
      <div class="play-button-overlay">
        <button class="play-button" @click.stop="handlePlayMood()">
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
      <img :src="moodlist.coverImageUrl" :alt="moodlist.name" />
    </div>
    <div class="card-content">
      <h3 class="card-title">{{ moodlist.name }}</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from "vue";
import type { Moods } from "~/types/moods";
import { useMusicPlayerStore } from "~/stores/musicPlayer";
import type { Tracks } from "~/types/tracks";

const props = defineProps({
  moodlist: {
    type: Object as () => Moods,
    required: true,
  },
});

const emit = defineEmits(["select-card", "play-mood"]);

const musicPlayerStore = useMusicPlayerStore();

// 监听全局播放状态，更新此卡片的 UI
const localIsPlaying = computed(() => {
  return (
    musicPlayerStore.currentSourceId === props.moodlist.moodId &&
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
  emit("select-card", props.moodlist.moodId);
};

const handlePlayMood = () => {
  if (localIsPlaying.value) {
    // 如果已经在播放，则暂停
    musicPlayerStore.togglePlayPause();
  } else {
    // 如果不在播放，则通知父组件播放此情绪
    emit("play-mood", props.moodlist.moodId);
  }
};
</script>

<style scoped>
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
  object-fit: cover;
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

.moods-card:hover .play-button-overlay {
  opacity: 1;
}

.moods-card:hover .card-image-container img {
  filter: brightness(70%);
}

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
</style>
