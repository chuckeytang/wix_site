<template>
  <div class="music-grid-card">
    <div class="card-header">
      <h3 class="track-title">{{ track.title }}</h3>
      <p class="track-artist">{{ track.artist }}</p>
    </div>

    <div class="player-section">
      <button class="play-button" @click="togglePlayAndSetTrack">
        <svg
          v-if="!localIsPlaying"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="none"
        >
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="none"
        >
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
      </button>
      <div class="waveform-wrapper">
        <WaveformPlayer
          :audio-url="track.audioFileUrl"
          :is-playing="localIsPlaying"
          @ready="handleReady"
          @waveform-click="handleWaveformClick"
          ref="waveformPlayerRef"
        />
      </div>
    </div>

    <div class="card-footer">
      <button class="action-btn icon-heart">
        <svg
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
          <path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          ></path>
        </svg>
      </button>
      <button class="action-btn icon-more">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="none"
        >
          <circle cx="12" cy="12" r="2"></circle>
          <circle cx="19" cy="12" r="2"></circle>
          <circle cx="5" cy="12" r="2"></circle>
        </svg>
      </button>
      <button class="download-button" @click="handleDownload">download</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, watch, computed } from "vue";
import { useMusicPlayerStore } from "~/stores/musicPlayer.js";
import { tracksApi } from "~/api";
import WaveformPlayer from "./WaveformPlayer.vue";
import type { Tracks } from "~/types/tracks";

const props = defineProps({
  track: {
    type: Object as () => Tracks,
    required: true,
  },
});

const musicPlayerStore = useMusicPlayerStore();
const waveformPlayerRef = ref<InstanceType<typeof WaveformPlayer> | null>(null);

// 使用 computed 属性来同步本地播放状态和全局状态
const localIsPlaying = computed(() => {
  const result =
    musicPlayerStore.currentTrack?.trackId === props.track.trackId &&
    musicPlayerStore.isPlaying;
  return result;
});

// 使用 computed 属性来同步本地进度和全局进度
const globalProgress = computed(() => {
  if (musicPlayerStore.currentTrack?.trackId === props.track.trackId) {
    return (musicPlayerStore.currentTime / musicPlayerStore.duration) * 100;
  }
  return 0;
});

// 核心改动：监听全局分段状态，并同步到当前播放歌曲的 WaveformPlayer
watch(
  () => musicPlayerStore.currentSegment,
  (newSegment) => {
    if (!waveformPlayerRef.value) return;
    if (musicPlayerStore.currentTrack?.trackId === props.track.trackId) {
      waveformPlayerRef.value.setSegment(newSegment);
    } else {
      waveformPlayerRef.value.setSegment("full");
    }
  }
);

// 监听全局歌曲ID，如果不是当前歌曲则暂停
watch(
  () => musicPlayerStore.currentPlayingId,
  (newId) => {
    if (newId !== null && newId !== props.track.trackId) {
      if (waveformPlayerRef.value) {
        waveformPlayerRef.value.pause();
      }
    }
  }
);

// 监听全局进度变化，更新 musicCard 的波形图
watch(
  () => globalProgress.value,
  (newProgress) => {
    if (localIsPlaying.value && waveformPlayerRef.value) {
      waveformPlayerRef.value.seekTo(newProgress / 100);
    }
  }
);

// 播放/暂停的逻辑，首先设置全局 Store
const togglePlayAndSetTrack = () => {
  if (musicPlayerStore.currentTrack?.trackId === props.track.trackId) {
    musicPlayerStore.togglePlayPause();
  } else {
    musicPlayerStore.setTrack(props.track);
  }
};

// 处理波形图点击
const handleWaveformClick = (relativePosition: number) => {
  musicPlayerStore.setTrack(props.track);
  musicPlayerStore.seekTo(relativePosition);
};

const handleReady = () => {
  if (waveformPlayerRef.value) {
    musicPlayerStore.setDuration(waveformPlayerRef.value.getDuration());
  }
};

// 处理下载逻辑
const handleDownload = async () => {
  if (!props.track.audioFileUrl) {
    console.error("Audio file URL is not available.");
    return;
  }
  try {
    const blob = await tracksApi.downloadTrackProxy(props.track.trackId!);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${props.track.title}.mp3`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    console.log("Download started successfully.");
  } catch (error) {
    console.error("Failed to download the audio file:", error);
  }
};
</script>

<style scoped>
.music-grid-card {
  background-color: #0d0d1a;
  border: 1px solid #444;
  border-radius: 12px;
  padding: 20px;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 15px; /* 控制各区域之间的垂直间距 */

  max-width: 400px;

  transition:
    border-color 0.3s,
    box-shadow 0.3s;
}

.music-grid-card:hover {
  border-color: #ffc93c; /* 示例高亮颜色 */
  box-shadow: 0 0 15px rgba(255, 201, 60, 0.2);
}

.card-header {
  text-align: left;
}

.track-title {
  font-size: 1.5em;
  font-weight: bold;
  color: #ffc93c; /* 示例高亮颜色 */
  margin: 0 0 5px 0;
}

.track-artist {
  font-size: 1em;
  color: #aaa;
  margin: 0;
}

.player-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.play-button {
  background-color: transparent;
  border: 1px solid #fff;
  color: #fff;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    background-color 0.3s,
    border-color 0.3s;
  flex-shrink: 0;
}

.play-button:hover {
  background-color: #ffc93c;
  border-color: #ffc93c;
  color: #0d0d1a;
}

.waveform-container {
  flex-grow: 1;
  height: 50px;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.waveform-image {
  width: 100%;
  height: 100%;
  object-fit: contain; /* 保持波形图比例 */
  filter: invert(1); /* 将黑色波形图反色为白色 */
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 10px;
}

.action-btn {
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  padding: 5px;
  transition: color 0.3s;
}

.action-btn:hover {
  color: #fff;
}

.download-button {
  background-color: transparent;
  border: 1px solid #aaa;
  color: #fff;
  font-weight: bold;
  padding: 8px 20px;
  border-radius: 50px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    border-color 0.3s;
  margin-left: auto; /* 让下载按钮自动推到最右边 */
}

.download-button:hover {
  background-color: #fff;
  border-color: #fff;
  color: #0d0d1a;
}

.waveform-wrapper {
  flex-grow: 1; /* 让它占据所有可用空间 */
  height: 50px; /* 保持与播放按钮一致的高度 */
}
</style>
