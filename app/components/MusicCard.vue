<template>
  <div class="music-card-list">
    <div class="left-section">
      <button class="play-button" @click="handlePlayButtonClick()">
        <svg viewBox="0 0 36 36" class="circular-progress-bar">
          <path
            class="circle-bg"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            class="circle"
            :stroke-dasharray="`${progress}, 100`"
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
      <div class="track-info">
        <NuxtLink :to="`/music/${track.trackId}`" class="track-title">
          {{ track.title }}
        </NuxtLink>
        <span class="track-artist">{{ track.artist }}</span>
      </div>
    </div>

    <WaveformPlayer
      :audio-url="track.audioFileUrl"
      :is-playing="localIsPlaying"
      @ready="handleReady"
      @waveform-click="handleWaveformClick"
      @play="handlePlay"
      @pause="handlePause"
      :can-control="false"
      ref="waveformPlayerRef"
    />

    <div class="track-meta-info">
      <div class="duration-bpm">
        <span class="duration">{{ formatDuration(track.duration) }}</span>
        <span v-if="track.bpm" class="bpm">{{ track.bpm + "  BPM" }}</span>
      </div>
    </div>

    <!-- <div class="category-tags">
      <span v-for="(tag, index) in track.tags" :key="index" class="tag">{{
        tag
      }}</span>
    </div> -->

    <div class="right-column-group">
      <div class="action-buttons">
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
      </div>

      <div class="right-column-group">
        <button class="download-button" @click="handleDownload">
          download
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, watch } from "vue";
import { useMusicPlayerStore } from "~/stores/musicPlayer";
import { useAuthStore } from "~/stores/auth";
import { cartsApi } from "~/api/carts";
import { tracksApi } from "~/api";
import WaveformPlayer from "./WaveformPlayer.vue";
import type { Tracks } from "~/types/tracks";

const props = defineProps({
  track: {
    // Specify the correct type for the prop
    type: Object as () => Tracks,
    required: true,
  },
});

const musicPlayerStore = useMusicPlayerStore();
const authStore = useAuthStore();
const progress = ref(0);
const waveformPlayerRef = ref<InstanceType<typeof WaveformPlayer> | null>(null);
const router = useRouter();

// 监听认证状态
const isAuthenticated = computed(() => authStore.isAuthenticated);

// 使用 computed 属性来同步本地播放状态和全局状态
const localIsPlaying = computed(() => {
  const isPlayingTrack =
    musicPlayerStore.mediaType === "track" &&
    (musicPlayerStore.currentTrack as Tracks)?.trackId === props.track.trackId;

  return isPlayingTrack && musicPlayerStore.isPlaying;
});

// 使用 computed 属性来同步本地进度和全局进度
const globalProgress = computed(() => {
  // 确保是当前播放的音乐曲目
  if (
    musicPlayerStore.mediaType === "track" &&
    (musicPlayerStore.currentTrack as Tracks)?.trackId === props.track.trackId
  ) {
    return (musicPlayerStore.currentTime / musicPlayerStore.duration) * 100;
  }
  return 0;
});

watch(
  () => musicPlayerStore.currentPlayingId,
  (newId) => {
    // 如果全局播放ID存在，并且不是当前卡片的ID
    if (newId && newId !== props.track.trackId) {
      // 强制暂停此卡片的播放
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
    // 只有当是当前播放歌曲时才同步波形图
    if (localIsPlaying.value && waveformPlayerRef.value) {
      if (!isNaN(newProgress)) {
        waveformPlayerRef.value.seekTo(newProgress / 100);
      }
    }
  }
);

// Utility function to format duration from seconds to MM:SS
const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

// 统一处理播放按钮点击事件
const handlePlayButtonClick = () => {
  // 确保是当前播放的音乐曲目
  if (
    musicPlayerStore.mediaType === "track" &&
    (musicPlayerStore.currentTrack as Tracks)?.trackId === props.track.trackId
  ) {
    musicPlayerStore.togglePlayPause();
  } else {
    musicPlayerStore.setTrack(props.track);
  }
};

// 处理波形图点击，仅将事件传递给 store
const handleWaveformClick = (relativePosition: number) => {
  // 确保是当前播放的音乐曲目
  if (
    musicPlayerStore.mediaType === "track" &&
    (musicPlayerStore.currentTrack as Tracks)?.trackId === props.track.trackId
  ) {
    musicPlayerStore.seekTo(relativePosition);
  } else {
    musicPlayerStore.setTrack(props.track);
    setTimeout(() => {
      musicPlayerStore.seekTo(relativePosition);
    }, 20);
  }
};

// 监听 waveform 发出的 play 事件，并更新 store 状态
const handlePlay = () => {
  // 确保不是在播放音效，并且不是同一首歌曲
  const isDifferentTrack =
    musicPlayerStore.mediaType !== "track" ||
    (musicPlayerStore.currentTrack as Tracks)?.trackId !== props.track.trackId;

  if (isDifferentTrack) {
    musicPlayerStore.setTrack(props.track);
  }
  musicPlayerStore.setIsPlaying(true);
};

// 监听 waveform 发出的 pause 事件，并更新 store 状态
const handlePause = () => {
  musicPlayerStore.setIsPlaying(false);
};

// 处理下载逻辑
const handleDownload = async () => {
  const trackId = props.track.trackId;
  if (!trackId) {
    console.error("Track ID is not available.");
    return;
  }

  // 1. 检查是否登录
  if (!isAuthenticated.value) {
    // 未登录：弹出登录对话框
    authStore.openLoginDialog();
    return;
  }

  // 2. 已登录：检查授权 (通过调用后端 API)
  try {
    // 💡 注意：前端需要一个新的 API 来检查授权。
    // 我们假设 tracksApi 中有一个 checkLicense 接口，返回 { hasLicense: boolean }
    // 如果没有，我们复用 cartsApi 中的一个请求来判断权限。

    // 假设后端有一个接口 `/site/tracks/check-license/{trackId}` 返回权限状态
    const licenseCheckResponse = await tracksApi.checkTrackLicense(trackId);

    if (licenseCheckResponse.hasLicense) {
      // 2a. 有授权：执行下载
      await executeDownload(trackId);
    } else {
      // 2b. 无授权：弹出 LicenseModal (这里需要通知 MusicList 或父组件)
      // ⚠️ MusicCard 无法直接弹出 LicenseModal，需要通过 emit 或全局 store/event bus 通知父组件
      alert("License not found. Please purchase the track.");
      // 假设我们在这里重定向到详情页，让用户点击购买
      router.push(`/music/${trackId}`);
    }
  } catch (error: any) {
    // 如果后端返回 403 Forbidden，也可以捕获并跳转/提示购买
    if (error.response && error.response.status === 403) {
      alert("You do not have a license for this track.");
      router.push(`/music/${trackId}`);
    } else {
      console.error("Download check failed:", error);
      alert("Download verification failed. Please try again.");
    }
  }
};

// 实际下载执行函数 (原 handleDownload 逻辑)
const executeDownload = async (trackId: number) => {
  // 获取当前组件的 track 对象
  const track = props.track;

  try {
    const blob = await tracksApi.downloadTrackProxy(trackId);

    // 创建临时 URL 并触发下载
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
    alert("Failed to start download. Check if you have purchased this item.");
  }
};

const handleReady = () => {
  if (waveformPlayerRef.value) {
    musicPlayerStore.setDuration(waveformPlayerRef.value.getDuration());
  }
};
</script>

<style scoped>
.music-card-list {
  display: grid;
  grid-template-columns:
    minmax(150px, 2fr) minmax(300px, 8fr) minmax(80px, 1fr)
    minmax(150px, 2fr) auto;
  align-items: center;
  gap: 20px; /* 控制列之间的间距 */

  /* 保持原有的样式 */
  padding: 15px 20px;
  border-bottom: 1px solid #222;
  transition: background-color 0.3s;
}

.music-card-list:hover {
  background-color: #1a1a1a;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* 歌曲信息 */
.track-info {
  display: flex;
  flex-direction: column;
}

.track-title {
  font-weight: bold;
  font-size: 1.1em;
  color: #edebeb;
}

.track-artist {
  font-size: 0.9em;
  color: #edebeb;
}

/* 波形图占位符
  - 移除 flex-grow: 1，因为它在 Grid 布局中已经通过 1fr 占据了剩余空间
*/
.waveform-placeholder {
  position: relative;
  transition: background-color 0.3s ease;
  height: 50px;
  background-color: #222;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.waveform-placeholder::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  pointer-events: none;
  z-index: 5;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.waveform-placeholder:hover::before {
  opacity: 1;
  background: linear-gradient(
    90deg,
    rgba(70, 34, 21, 0.1),
    rgba(81, 62, 23, 0.1)
  );
}

.hover-progress-overlay {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  /* 从左到右的渐变色，透明度更低 */
  background: linear-gradient(
    90deg,
    rgba(255, 140, 98, 0.2),
    rgba(255, 179, 138, 0.2)
  );
  z-index: 10; /* 确保在 Wavesurfer canvas 上方 */
  pointer-events: none; /* 确保不影响鼠标事件 */
}

.hover-playhead {
  position: absolute;
  top: 0;
  height: 100%;
  width: 2px;
  background-color: rgba(255, 140, 98, 0.5); /* 橙色，更低的透明度 */
  z-index: 11;
  transform: translateX(-50%);
  pointer-events: none;
}

.waveform-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.waveform-progress-overlay {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 140, 98, 0.5),
    rgba(255, 140, 98, 0.5)
  ); /* 播放后的彩色层 */
  z-index: 2;
  transition: width 0.1s linear; /* 平滑过渡效果 */
}

.waveform-playhead {
  position: absolute;
  top: 0;
  height: 100%;
  width: 2px;
  background-color: #ff8c62; /* 竖线颜色 */
  z-index: 3;
  transform: translateX(-50%); /* 确保竖线中心对齐进度 */
  cursor: grab;
}

/* 鼠标悬停效果 */
.waveform-placeholder:hover::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 140, 98, 0.2); /* 浅色半透明背景 */
  z-index: 0; /* 确保在波形图下方 */
  pointer-events: none; /* 确保不影响点击事件 */
}

.placeholder-text {
  color: #666;
  font-size: 0.9em;
}

/* 右侧元素组合容器
  - 使用 Flexbox 来管理内部元素的排列
  - gap 属性控制其内部元素之间的间距
*/
.right-column-group {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-direction: row;
}

/* 时长和BPM */
.duration-bpm {
  display: flex;
  flex-direction: column;
  /* 调整为 flex-start，使其左对齐 */
  align-items: flex-start;
  font-size: 0.9em;
  color: #ccc;
  flex-shrink: 0;
}

.duration {
  font-weight: bold;
}

.bpm {
  font-size: 0.8em;
  color: #888;
}

/* 分类标签 */
.category-tags {
  display: flex;
  gap: 5px;
  flex-shrink: 0;
  flex-wrap: wrap;
}

.tag {
  background-color: #444;
  color: #fff;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7em;
  white-space: nowrap;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 5px;
  flex-shrink: 0;
}

.action-btn {
  background-color: transparent;
  border: none;
  color: #ccc;
  cursor: pointer;
  padding: 5px;
  transition: color 0.3s;
}

/* 下载按钮 */
.download-button {
  background-color: #ff8c62;
  color: #0d0d1a;
  font-weight: bold;
  padding: 10px 20px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: background-color 0.3s;
  flex-shrink: 0;
}

.download-button:hover {
  background-color: #e67a54;
}

/* 播放按钮 */
.play-button {
  position: relative; /* 用于定位圆形进度条 */
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 5px;
  color: #1a1a1a;
  transition: color 0.3s ease;
}

.play-button svg:not(.circular-progress-bar) {
  color: #888;
  transition: color 0.3s ease;
}

.music-card-list:hover .play-button svg {
  color: white;
}

.circular-progress-bar {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
}

.circle-bg {
  fill: none;
  stroke: #333; /* 进度条背景色 */
  stroke-width: 2.5;
}

.circle {
  fill: none;
  stroke: #ff8c62; /* 进度条填充色 */
  stroke-width: 2.5;
  transition: stroke-dasharray 0.3s;
}

.play-button svg:not(.circular-progress-bar) {
  z-index: 1; /* 确保图标在进度条上方 */
}

.waveform-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.music-list-section {
  background-color: #0d0d1a;
  padding: 20px 0;
  color: #fff;
}

.track-meta-info {
  display: flex;
  flex-direction: column; /* 让内部元素垂直排列 */
  align-items: flex-start; /* 左对齐 */
  gap: 8px; /* 在时长和标签之间添加一些垂直间距 */
  min-width: 150px; /* (可选) 给一个最小宽度，防止标签过多时被压缩 */
}

.music-card-list > :last-child {
  justify-self: end;
}

/* 添加新的样式 */
.wavesurfer-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.wavesurfer-container::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 50%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2));
  pointer-events: none;
  z-index: 10;
}

.track-title {
  font-weight: bold;
  font-size: 1.1em;
  color: #edebeb; /* 保持与原有 span 相同的颜色 */
  text-decoration: none; /* 移除下划线 */
  transition: color 0.2s ease-in-out;
}

.track-title:hover {
  color: #ff8c62; /* 悬停时改变颜色，提供视觉反馈 */
}
</style>
