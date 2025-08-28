<template>
  <transition name="slide-up">
    <div v-if="playerStore.currentTrack" class="music-player-panel">
      <div class="panel-content">
        <div class="waveform-row">
          <WaveformPlayer
            :audio-url="playerStore.currentTrack?.audioFileUrl"
            :is-playing="playerStore.isPlaying"
            @update-progress="handleUpdateProgress"
            @ready="handleReady"
            ref="waveformPlayerRef"
          />
        </div>

        <div class="controls-row">
          <div class="control-group">
            <button class="control-btn prev-btn">
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
                class="feather feather-skip-back"
              >
                <polygon points="19 20 9 12 19 4 19 20"></polygon>
                <line x1="5" y1="19" x2="5" y2="5"></line>
              </svg>
            </button>
            <button
              class="control-btn play-btn"
              @click="playerStore.togglePlayPause()"
            >
              <svg
                v-if="!playerStore.isPlaying"
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-play-circle"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="10 8 16 12 10 16 10 8"></polygon>
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-pause-circle"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="10" y1="15" x2="10" y2="9"></line>
                <line x1="14" y1="15" x2="14" y2="9"></line>
              </svg>
            </button>
            <button class="control-btn next-btn">
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
                class="feather feather-skip-forward"
              >
                <polygon points="5 4 15 12 5 20 5 4"></polygon>
                <line x1="19" y1="5" x2="19" y2="19"></line>
              </svg>
            </button>
          </div>

          <div class="track-info-group">
            <span class="track-title">{{
              playerStore.currentTrack?.title
            }}</span>
            <span class="track-artist"
              >by {{ playerStore.currentTrack?.artist }}</span
            >
          </div>

          <div class="segment-group">
            <button
              v-for="seg in segments"
              :key="seg.value"
              :class="{ active: currentSegment === seg.value }"
              @click="handleSegmentChange(seg.value)"
            >
              {{ seg.label }}
            </button>
          </div>

          <div class="time-bpm-group">
            <div class="time-info">
              <span class="current-time">{{
                formatDuration(currentTime)
              }}</span>
              /
              <span class="total-duration">{{ formatDuration(duration) }}</span>
            </div>
            <span class="bpm-info"
              >{{ playerStore.currentTrack?.bpm }} BPM</span
            >
          </div>

          <div class="action-buttons-group">
            <div class="volume-control">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-volume-2"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path
                  d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"
                ></path>
              </svg>
              <input
                type="range"
                class="volume-slider"
                min="0"
                max="100"
                v-model="volume"
                @input="handleVolumeChange"
              />
            </div>
            <button class="action-btn">
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
                class="feather feather-heart"
              >
                <path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                ></path>
              </svg>
            </button>
            <button class="action-btn">
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
                class="feather feather-plus-circle"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </button>
          </div>

          <div class="preview-download-group">
            <button class="preview-btn">Preview</button>
            <button
              class="download-btn"
              @click="handleDownload(playerStore.currentTrack!)"
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useMusicPlayerStore } from "~/stores/musicPlayer";
import WaveformPlayer from "~/components/WaveformPlayer.vue";
import { tracksApi } from "~/api";
import type { Tracks } from "~/types/tracks";

const playerStore = useMusicPlayerStore();
const waveformPlayerRef = ref<InstanceType<typeof WaveformPlayer> | null>(null);

const currentTime = ref(0);
const duration = ref(0);
const volume = ref(70);
const currentSegment = ref("full");
const segments = [
  { value: "full", label: "Full" },
  { value: "15s", label: "15s" },
  { value: "30s", label: "30s" },
  { value: "60s", label: "60s" },
];

// 监听全局分段状态，并同步到本地 UI 和 WaveformPlayer
watch(
  () => playerStore.currentSegment,
  (newSegment) => {
    // 同步到本地状态，用于更新按钮样式
    currentSegment.value = newSegment;
    // 调用 WaveformPlayer 的 setSegment 方法
    if (waveformPlayerRef.value) {
      waveformPlayerRef.value.setSegment(newSegment);
    }
  }
);

// 这个监听器将处理所有来自 store 的播放/暂停指令
watch(
  () => playerStore.isPlaying,
  (newVal, oldVal) => {
    // 避免首次加载时的不必要触发
    if (newVal === oldVal) return;

    if (waveformPlayerRef.value) {
      if (newVal) {
        // 播放前，先将 Wavesurfer seek 到当前进度
        const relativeProgress = playerStore.currentTime / playerStore.duration;
        waveformPlayerRef.value.seekTo(relativeProgress);
        waveformPlayerRef.value.play();
      } else {
        waveformPlayerRef.value.pause();
      }
    }
  }
);

// 监听 seekToProgress 状态，控制波形图进度同步
watch(
  () => playerStore.seekToProgress,
  (newProgress) => {
    if (newProgress !== null && waveformPlayerRef.value) {
      // 调用 Wavesurfer 的 seekTo 方法
      waveformPlayerRef.value.seekTo(newProgress);
      // 同步完成后，立即重置 store 中的状态，避免重复触发
      playerStore.clearSeekToProgress();
    }
  }
);

// 监听歌曲变化，加载新波形图
watch(
  () => playerStore.currentTrack,
  (newTrack, oldTrack) => {
    if (newTrack && newTrack.trackId !== oldTrack?.trackId) {
      if (waveformPlayerRef.value) {
        waveformPlayerRef.value.loadAudio(newTrack.audioFileUrl);
      }
    }
  }
);

// 进度更新事件处理
const handleUpdateProgress = (progress: number) => {
  // 根据总时长和进度计算当前时间
  if (playerStore.duration > 0) {
    // 直接使用来自 store 的 duration
    currentTime.value = (progress / 100) * playerStore.duration;
    playerStore.updateTime(currentTime.value);
  }
};

// 只有当 WaveformPlayer 准备好时，才开始播放
const handleReady = () => {
  if (waveformPlayerRef.value) {
    if (playerStore.isPlaying && playerStore.duration > 0) {
      console.log("Waveform ready, starting playback.");
      const relativeProgress = playerStore.currentTime / playerStore.duration;
      waveformPlayerRef.value.seekTo(relativeProgress);
      waveformPlayerRef.value.play();

      // 在 ready 时，根据当前选中的分段，重新设置波形图
      waveformPlayerRef.value.setSegment(currentSegment.value);
    }
  }
};

// 时长格式化
const formatDuration = (seconds: number): string => {
  if (isNaN(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

// 时长分段切换
const handleSegmentChange = (segment: string) => {
  playerStore.setSegment(segment); // 更新全局分段状态
  currentSegment.value = segment;
  if (waveformPlayerRef.value) {
    waveformPlayerRef.value.setSegment(segment);
  }
};

// 音量控制
const handleVolumeChange = () => {
  if (waveformPlayerRef.value) {
    waveformPlayerRef.value.setVolume(volume.value / 100);
  }
};

// 下载
const handleDownload = async (track: Tracks) => {
  if (!track.audioFileUrl) {
    console.error("Audio file URL is not available.");
    return;
  }
  try {
    const blob = await tracksApi.downloadTrackProxy(track.trackId!);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${track.title}.mp3`);
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
/* 面板的容器 */
.music-player-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 120px;
  background-color: #0d0d1a;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.5);
  z-index: 2000;
  padding: 10px 40px;
  box-sizing: border-box;
}

/* 面板显示时的动画 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.4s ease-in-out;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
.slide-up-enter-to,
.slide-up-leave-from {
  transform: translateY(0);
}

.panel-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: transform 0.4s ease-in-out;
}

.panel-content.is-hidden {
  transform: translateY(100%);
}

.waveform-row {
  height: 50px;
  width: 100%;
  margin-bottom: 10px;
}

/* 控制按钮行 */
.controls-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  color: #fff;
  height: 50px;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 15px;
}

.control-btn {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  transition: color 0.3s;
}

.control-btn:hover {
  color: #ff8c62;
}

.play-btn svg {
  color: #ff8c62;
}

.track-info-group {
  display: flex;
  flex-direction: column;
  min-width: 150px;
}
.track-title {
  font-weight: bold;
}
.track-artist {
  font-size: 0.8em;
  color: #ccc;
}

.segment-group {
  display: flex;
  gap: 5px;
}
.segment-group button {
  background: #333;
  color: #fff;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.3s;
}
.segment-group button:hover {
  background: #555;
}
.segment-group button.active {
  background: #ff8c62;
  color: #0d0d1a;
  font-weight: bold;
}

.time-bpm-group {
  display: flex;
  flex-direction: column;
  font-size: 0.9em;
}

.time-info {
  color: #ccc;
}
.bpm-info {
  color: #999;
  font-size: 0.8em;
}

.action-buttons-group {
  display: flex;
  align-items: center;
  gap: 15px;
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 5px;
}
.volume-slider {
  width: 80px;
  -webkit-appearance: none;
  background: #555;
  height: 5px;
  border-radius: 5px;
}
.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 15px;
  height: 15px;
  background: #ff8c62;
  border-radius: 50%;
  cursor: pointer;
}

.action-btn {
  background: none;
  border: none;
  color: #ccc;
  cursor: pointer;
}
.action-btn:hover {
  color: #ff8c62;
}

.preview-download-group {
  display: flex;
  gap: 10px;
}
.preview-btn,
.download-btn {
  background: #333;
  color: #fff;
  border: none;
  padding: 8px 15px;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.download-btn {
  background: #ff8c62;
  color: #0d0d1a;
  font-weight: bold;
}

.panel-toggle-btn {
  position: absolute;
  top: -20px;
  right: 20px;
  background: #0d0d1a;
  color: #ff8c62;
  border: 1px solid #1a1a1a;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.3);
  z-index: 2001;
}
</style>
