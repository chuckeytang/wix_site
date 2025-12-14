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

    <div class="right-column-group">
      <div class="action-buttons">
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
            class="favorite-icon"
          >
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            ></path>
          </svg>
        </button>
        <button class="action-btn" @click.stop="handleAddToPlaylistClick">
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

        <div class="more-options-wrapper" ref="moreOptionsRef">
          <button class="action-btn" @click.stop="toggleMenu">
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
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="12" cy="5" r="1"></circle>
              <circle cx="12" cy="19" r="1"></circle>
            </svg>
          </button>

          <transition name="fade">
            <div v-if="isMenuOpen" class="dropdown-menu">
              <div class="menu-item" @click.stop="handleMenuAction('cart')">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="menu-icon cart-icon"
                >
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path
                    d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
                  ></path>
                </svg>
                <span>Add to cart</span>
              </div>

              <!-- <div class="menu-item" @click.stop="handleMenuAction('preview')">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="menu-icon"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span>Download preview</span>
              </div> -->
            </div>
          </transition>
        </div>
      </div>

      <div class="right-column-group">
        <button class="download-button" @click="handleDownload">
          Download
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useMusicPlayerStore } from "~/stores/musicPlayer";
import WaveformPlayer from "./WaveformPlayer.vue";
import type { Tracks } from "~/types/tracks";
import { useAddToCart } from "~/composables/useAddToCart";
import { useToast } from "~/composables/useToast";
import { useAuthStore } from "~/stores/auth";
import { favoritesApi } from "~/api/favorites";
import { useDownloadMedia } from "../composables/useDownloadMedia";
import { usePlaylistModalStore } from "~/stores/playlistModal";
import { tracksApi } from "~/api";

const props = defineProps({
  track: {
    // Specify the correct type for the prop
    type: Object as () => Tracks,
    required: true,
  },
});

const musicPlayerStore = useMusicPlayerStore();
const progress = ref(0);
const waveformPlayerRef = ref<InstanceType<typeof WaveformPlayer> | null>(null);
const router = useRouter();
const { isLoading: isCartLoading, handleAddToCart } = useAddToCart();
const { showToast } = useToast();
const { handleDownload: handleDownloadCheckAndExecute } = useDownloadMedia();
const authStore = useAuthStore();
const isFavorited = ref(false);
const playlistModalStore = usePlaylistModalStore();

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

const QUICK_LICENSE_OPTION = "standard";

const isMenuOpen = ref(false);
const moreOptionsRef = ref<HTMLElement | null>(null);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// 点击外部关闭菜单
const handleClickOutside = (event: MouseEvent) => {
  if (
    moreOptionsRef.value &&
    !moreOptionsRef.value.contains(event.target as Node)
  ) {
    isMenuOpen.value = false;
  }
};

// --- 初始化检查收藏状态 ---
onMounted(async () => {
  if (authStore.isAuthenticated && props.track.trackId) {
    try {
      const res = await favoritesApi.checkFavoriteStatus(
        props.track.trackId,
        "track"
      );
      isFavorited.value = res.data!;
    } catch (e) {
      console.error("Failed to check favorite status", e);
    }
  }
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

// 菜单动作处理
const handleMenuAction = async (action: "cart" | "preview") => {
  // 先关闭菜单
  isMenuOpen.value = false;

  if (action === "cart") {
    // 调用现有的加入购物车逻辑
    await handleQuickAddToCart();
  } else if (action === "preview") {
    // 调用下载预览逻辑
    await handleDownloadPreview();
  }
};

/**
 * 处理“更多选项”按钮，实现快捷添加到购物车功能
 */
const handleQuickAddToCart = async () => {
  const trackId = props.track.trackId;
  if (!trackId) {
    console.error("Track ID is not available for cart.");
    return;
  }

  // 调用封装的组合式函数来执行添加到购物车逻辑
  const success = await handleAddToCart({
    productId: trackId,
    productType: "track",
    licenseOption: QUICK_LICENSE_OPTION,
    trackTitle: props.track.title,
  });

  if (success) {
    //console.log(`Quick add to cart successful for: ${props.track.title}`);
    showToast(`"${props.track.title}" has been added to your cart.`);
  }
};

// 下载预览 (无需登录)
const handleDownloadPreview = async () => {
  if (!props.track.trackId) return;

  try {
    const blob = await tracksApi.downloadPreviewProxy(props.track.trackId);

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${props.track.title}_preview.mp3`);

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    console.log("Preview download started.");
  } catch (error) {
    console.error("Failed to download preview:", error);
    // 这里可以使用 showToast 提示用户
  }
};

// --- 处理点击收藏 ---
const handleToggleFavorite = async () => {
  if (!authStore.isAuthenticated) {
    authStore.openLoginDialog();
    return;
  }

  const previousState = isFavorited.value;
  isFavorited.value = !previousState;

  try {
    const res = await favoritesApi.toggleFavorite(
      props.track.trackId!,
      "track"
    );
    // 后端返回 data 为 true(已收藏) 或 false(未收藏)
    if (res.data !== undefined) {
      isFavorited.value = res.data;
      showToast(res.data ? "Added to favorites" : "Removed from favorites");
    }
  } catch (error) {
    // 失败回滚
    isFavorited.value = previousState;
    showToast("Failed to update favorite status");
  }
};

// --- 处理点击加入播放列表 ---
// 注意：这通常需要触发一个全局 Modal，让用户选择 Playlist
// 这里我假设你有一个 emit 或者 store action 来打开这个 Modal
const emit = defineEmits(["add-to-playlist"]); // 如果你在父组件处理

const handleAddToPlaylistClick = () => {
  if (!authStore.isAuthenticated) {
    authStore.openLoginDialog();
    return;
  }

  // 使用 Store Action 打开全局模态框
  playlistModalStore.openModal(
    props.track.trackId!,
    "track",
    props.track.title
  );
};

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
  await handleDownloadCheckAndExecute(props.track, "track");
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

/* 包装器用于定位下拉菜单 */
.more-options-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

/* 下拉菜单容器 */
.dropdown-menu {
  position: absolute;
  top: 100%; /* 在按钮正下方 */
  left: 50%;
  transform: translateX(-50%); /* 水平居中 */
  margin-top: 10px;
  background-color: #222; /* 深色背景 */
  border: 1px solid #333;
  border-radius: 8px;
  padding: 8px 0;
  min-width: 180px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  z-index: 100; /* 确保在最上层 */

  /* 添加一个小三角指向按钮 (可选) */
}

.dropdown-menu::before {
  content: "";
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid #333; /* 与边框颜色一致 */
}

/* 菜单项 */
.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 0.9em;
  white-space: nowrap;
}

.menu-item:hover {
  background-color: #333;
}

/* 菜单图标 */
.menu-icon {
  width: 18px;
  height: 18px;
  color: #ccc;
}
.cart-icon {
  color: #ffd700; /* 给购物车加点黄色，类似截图中的颜色 */
}

.menu-item:hover .menu-icon {
  color: #fff;
}

/* 简单的淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -10px); /* 出现时稍微向下移动 */
}
</style>
