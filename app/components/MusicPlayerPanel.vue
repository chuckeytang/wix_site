<template>
  <transition name="slide-up">
    <div v-if="playerStore.currentTrack" class="music-player-panel">
      <div class="panel-content">
        <div class="waveform-row">
          <WaveformPlayer
            :audio-url="audioUrl"
            :is-playing="playerStore.isPlaying"
            @update-progress="handleUpdateProgress"
            @ready="handleReady"
            @waveform-click="handleWaveformClick"
            :can-control="true"
            ref="waveformPlayerRef"
          />
        </div>

        <div class="controls-row">
          <div class="control-group">
            <button
              class="control-btn prev-btn"
              :disabled="isSfx"
              :class="{ disabled: isSfx }"
              @click="handlePrevButton()"
            >
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
            <button
              class="control-btn next-btn"
              :disabled="isSfx"
              :class="{ disabled: isSfx }"
              @click="playerStore.playNextTrack()"
            >
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

          <div class="segment-group" v-if="playerStore.mediaType === 'track'">
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
            <span class="bpm-info" v-if="isMusicTrack"
              >{{ (playerStore.currentTrack as Tracks)?.bpm }} BPM</span
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
            <button class="action-btn" @click="handleToggleFavorite">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                :fill="isFavorited ? '#ff8c62' : 'none'"
                :stroke="isFavorited ? '#ff8c62' : 'currentColor'"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                ></path>
              </svg>
            </button>
            <button class="action-btn" @click="handleAddToPlaylist">
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
                  d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8z"
                ></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </button>

            <button
              class="action-btn"
              @click="handleQuickAddToCart"
              :disabled="isCartLoading"
            >
              <svg
                v-if="!isCartLoading"
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
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path
                  d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
                ></path>
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
                class="spin"
              >
                <line x1="12" y1="2" x2="12" y2="6"></line>
                <line x1="12" y1="18" x2="12" y2="22"></line>
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                <line x1="2" y1="12" x2="6" y2="12"></line>
                <line x1="18" y1="12" x2="22" y2="12"></line>
                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
              </svg>
            </button>
          </div>

          <div class="preview-download-group">
            <button
              class="preview-btn"
              @click="handleDownloadPreview"
              :disabled="!isMusicTrack"
              :class="{ disabled: !isMusicTrack }"
            >
              Preview
            </button>
            <button class="download-btn" @click="handleDownload()">
              Download
            </button>
          </div>
        </div>
      </div>
      <button class="panel-toggle-btn" @click="handleHidePanel">
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
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed, onBeforeUnmount } from "vue";
import { useMusicPlayerStore } from "~/stores/musicPlayer";
import WaveformPlayer from "~/components/WaveformPlayer.vue";
import type { Tracks } from "~/types/tracks";
import type { Sfx } from "~/types/sfx";
import {
  useDownloadMedia,
  type MediaType,
} from "~/composables/useDownloadMedia";
import { useAuthStore } from "~/stores/auth";
import { usePlaylistModalStore } from "~/stores/playlistModal";
import { useAddToCart } from "~/composables/useAddToCart";
import { useToast } from "~/composables/useToast";
import { favoritesApi } from "~/api/favorites";
import { tracksApi } from "~/api/tracks";

const playerStore = useMusicPlayerStore();
const waveformPlayerRef = ref<InstanceType<typeof WaveformPlayer> | null>(null);
const authStore = useAuthStore();
const playlistModalStore = usePlaylistModalStore();
const { handleDownload: handleDownloadCheckAndExecute } = useDownloadMedia();
const { isLoading: isCartLoading, handleAddToCart } = useAddToCart();
const { showToast } = useToast();

const currentTime = ref(0);
const duration = ref(0);
const volume = ref(70);
const currentSegment = ref("full");
const isFavorited = ref(false);
const QUICK_LICENSE_OPTION = "standard";
const segments = [
  { value: "full", label: "Full" },
  { value: "15s", label: "15s" },
  { value: "30s", label: "30s" },
  { value: "60s", label: "60s" },
];

const isMusicTrack = computed(
  () => playerStore.mediaType === "track" && playerStore.currentTrack
);
const isSfx = computed(
  () => !!(playerStore.mediaType === "sfx" && playerStore.currentTrack)
);

// 监听当前歌曲变化，检查收藏状态
watch(
  () => playerStore.currentPlayingId,
  async (newId) => {
    if (!newId || !authStore.isAuthenticated) {
      isFavorited.value = false;
      return;
    }
    try {
      const type = playerStore.mediaType as MediaType;
      const res = await favoritesApi.checkFavoriteStatus(newId, type);
      isFavorited.value = res.data!;
    } catch (e) {
      isFavorited.value = false;
    }
  },
  { immediate: true }
);

// --- 1. 收藏功能 ---
const handleToggleFavorite = async () => {
  if (!playerStore.currentPlayingId) return;
  if (!authStore.isAuthenticated) {
    authStore.openLoginDialog();
    return;
  }

  const previousState = isFavorited.value;
  isFavorited.value = !previousState;

  try {
    const type = playerStore.mediaType as MediaType;
    const res = await favoritesApi.toggleFavorite(
      playerStore.currentPlayingId,
      type
    );
    if (res.data !== undefined) {
      isFavorited.value = res.data;
      showToast(res.data ? "Added to favorites" : "Removed from favorites");
    }
  } catch (error) {
    isFavorited.value = previousState;
    showToast("Failed to update favorite status");
  }
};

// --- 2. 加入播放列表功能 ---
const handleAddToPlaylist = () => {
  if (!playerStore.currentTrack) return;
  if (!authStore.isAuthenticated) {
    authStore.openLoginDialog();
    return;
  }

  const type = playerStore.mediaType as MediaType;
  const title = playerStore.currentTrack.title;
  playlistModalStore.openModal(playerStore.currentPlayingId!, type, title);
};

// --- 3. 加入购物车功能 ---
const handleQuickAddToCart = async () => {
  if (!playerStore.currentTrack) return;

  const type = playerStore.mediaType as "track" | "sfx";
  const title = playerStore.currentTrack.title;

  const success = await handleAddToCart({
    productId: playerStore.currentPlayingId!,
    productType: type,
    licenseOption: QUICK_LICENSE_OPTION,
    trackTitle: title,
  });

  if (success) {
    showToast(`"${title}" has been added to your cart.`);
  }
};

// --- 4. 预览下载功能 ---
const handleDownloadPreview = async () => {
  // 只允许 Track 下载预览，SFX 不支持
  if (!isMusicTrack.value || !playerStore.currentTrack) return;

  try {
    const trackId = playerStore.currentPlayingId!;
    const title = playerStore.currentTrack.title;

    const blob = await tracksApi.downloadPreviewProxy(trackId);

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${title}_preview.mp3`);

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    console.log("Preview download started.");
  } catch (error) {
    console.error("Failed to download preview:", error);
    showToast("Failed to download preview.");
  }
};

const handleHidePanel = () => {
  // 它只做一件事：调用我们在 store 中创建的那个 action
  playerStore.stopAndHidePlayer();
};
// 动态获取当前播放的音频 URL
const audioUrl = computed(() => {
  if (!playerStore.currentTrack) return "";
  // 仅在音乐曲目类型时，才处理分段预览
  if (playerStore.mediaType === "track") {
    const track = playerStore.currentTrack as Tracks;
    console.log("segemnt", playerStore.currentSegment, track);
    switch (playerStore.currentSegment) {
      case "15s":
        return track.previewUrl15s;
      case "30s":
        return track.previewUrl30s;
      case "60s":
        return track.previewUrl60s;
      case "full":
      default:
        // 如果是 full 或其他情况，返回完整音频 URL
        return track.audioFileUrl;
    }
  } else {
    // 如果是音效（sfx），直接返回 audioFileUrl
    return (playerStore.currentTrack as Sfx).audioFileUrl;
  }
});

const route = useRoute();
const isDetailPage = computed(() => {
  return route.path.startsWith("/music/");
});

watch(
  [() => playerStore.currentPlayingId, () => playerStore.currentSegment],
  ([newId, newSegment], [oldId, oldSegment]) => {
    // 只有当歌曲或分段变化时才重新加载音频
    if (newId !== oldId || newSegment !== oldSegment) {
      if (waveformPlayerRef.value && playerStore.currentTrack) {
        const urlToLoad = audioUrl.value;
        if (urlToLoad) {
          console.log(`Loading new audio: ${urlToLoad}`);
          // 先暂停并重置进度，再加载新的音频
          waveformPlayerRef.value.pause();
          waveformPlayerRef.value.loadAudio(urlToLoad);
        }
      }
    }
  },
  { immediate: true }
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
        if (!isNaN(relativeProgress)) {
          waveformPlayerRef.value.seekTo(relativeProgress);
          waveformPlayerRef.value.play();
        }
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
      if (!isNaN(newProgress)) {
        waveformPlayerRef.value.seekTo(newProgress);
        // 同步完成后，立即重置 store 中的状态，避免重复触发
        playerStore.clearSeekToProgress();
      }
    }
  }
);

const handleWaveformClick = (relativePosition: number) => {
  playerStore.seekTo(relativePosition);
};

// 进度更新事件处理
const handleUpdateProgress = (progress: number) => {
  // 根据总时长和进度计算当前时间
  if (playerStore.duration > 0) {
    // 直接使用来自 store 的 duration
    currentTime.value = (progress / 100) * playerStore.duration;
    playerStore.updateTime(currentTime.value);
  }
};

// 唯一的播放触发点：当 Wavesurfer 准备好时，根据全局状态决定是否播放
const handleReady = () => {
  if (waveformPlayerRef.value) {
    // 1. 同步 Wavesurfer 报告的总时长到全局状态
    playerStore.setDuration(waveformPlayerRef.value.getDuration());

    // 2. 检查全局播放状态，如果为 true，则开始播放
    if (playerStore.isPlaying) {
      console.log("Waveform ready, starting playback.");
      // 播放前，先将 Wavesurfer seek 到全局进度
      const relativeProgress = playerStore.currentTime / playerStore.duration;
      console.log("relativeProgress", relativeProgress);
      // 真正开始播放
      if (!isNaN(relativeProgress)) {
        waveformPlayerRef.value.seekTo(relativeProgress);
        waveformPlayerRef.value.play();
      }
    }
  }
};

// 时长格式化
const formatDuration = (seconds: number): string => {
  if (isNaN(seconds) || seconds === null) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

// 时长分段切换
const handleSegmentChange = (segment: string) => {
  playerStore.setSegment(segment); // 更新全局分段状态
  currentSegment.value = segment;
};

// 音量控制
const handleVolumeChange = () => {
  if (waveformPlayerRef.value) {
    waveformPlayerRef.value.setVolume(volume.value / 100);
  }
};

// 下载
const handleDownload = async () => {
  if (!playerStore.currentTrack) {
    console.error("No track or sfx is currently playing.");
    return;
  }

  const media = playerStore.currentTrack;
  const type = playerStore.mediaType as MediaType; // 假设 mediaType 始终是 'track' 或 'sfx'

  // 调用 Composable，传入当前媒体对象和类型
  await handleDownloadCheckAndExecute(media, type);
};

// 处理上一首按钮的点击事件
const handlePrevButton = () => {
  if (isDetailPage.value) {
    // 详情页，重新播放当前歌曲
    playerStore.setTrack(playerStore.currentTrack as Tracks); // 这一步会触发 watch 重新加载音频
    playerStore.setIsPlaying(true);
  } else {
    playerStore.playPrevTrack();
  }
};

onMounted(() => {
  // 从 store 初始化本地状态
  currentTime.value = playerStore.currentTime;
  duration.value = playerStore.duration;
  currentSegment.value = playerStore.currentSegment;
});

// 在组件卸载时，将本地状态同步回 store
onBeforeUnmount(() => {
  playerStore.updateTime(currentTime.value);
});
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

/* 禁用按钮的样式 */
.control-btn.disabled {
  color: #555; /* 将图标颜色变灰 */
  cursor: not-allowed;
  pointer-events: none; /* 确保它不能被点击 */
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

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 禁用按钮样式 */
.preview-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
