<template>
  <div class="music-grid-card">
    <div class="card-header">
      <NuxtLink :to="`/music/${track.trackId}`">
        <h3 class="track-title">{{ track.title }}</h3>
      </NuxtLink>
      <p class="track-artist">{{ track.artist }}</p>
    </div>

    <div class="player-section">
      <button class="play-button" @click="handlePlayButtonClick()">
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
          @play="handlePlay"
          @pause="handlePause"
          :can-control="false"
          ref="waveformPlayerRef"
        />
      </div>
    </div>

    <div class="card-footer">
      <button class="action-btn icon-heart" @click.stop="handleToggleFavorite">
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
      <div class="more-options-wrapper" ref="moreOptionsRef">
        <button class="action-btn icon-more" @click.stop="toggleMenu">
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
            <div
              v-if="!track.hasLicense"
              class="menu-item"
              @click.stop="handleMenuAction('cart')"
            >
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
            <div v-else class="menu-item disabled">
              <span>Purchased</span>
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
      <button
        class="download-button"
        :class="{ 'download-button--locked': !track.hasLicense }"
        @click="handleDownload"
      >
        {{ track.hasLicense ? "Download" : "Download" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useMusicPlayerStore } from "~/stores/musicPlayer.js";
import WaveformPlayer from "./WaveformPlayer.vue";
import type { Tracks } from "~/types/tracks";
import { useAddToCart } from "~/composables/useAddToCart";
import { useToast } from "~/composables/useToast";
import { useDownloadMedia } from "~/composables/useDownloadMedia";
import { useAuthStore } from "~/stores/auth";
import { favoritesApi } from "~/api/favorites";
import { tracksApi } from "~/api/tracks";

const props = defineProps({
  track: {
    type: Object as () => Tracks,
    required: true,
  },
});

const musicPlayerStore = useMusicPlayerStore();
const waveformPlayerRef = ref<InstanceType<typeof WaveformPlayer> | null>(null);

const { isLoading: isCartLoading, handleAddToCart } = useAddToCart();
const QUICK_LICENSE_OPTION = "standard";
const { showToast } = useToast();
const { handleDownload: handleDownloadCheckAndExecute } = useDownloadMedia(); // 重命名以避免冲突
const authStore = useAuthStore();
const isFavorited = ref(false);
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

onMounted(async () => {
  document.addEventListener("click", handleClickOutside, true);
  // 初始化检查收藏状态
  if (authStore.isAuthenticated && props.track.trackId) {
    try {
      const res = await favoritesApi.checkFavoriteStatus(
        props.track.trackId,
        "track",
      );
      isFavorited.value = res.data!;
    } catch (e) {
      // ignore error
    }
  }
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside, true);
});

// 菜单动作处理
const handleMenuAction = async (action: "cart" | "preview") => {
  // 先关闭菜单
  isMenuOpen.value = false;

  if (action === "cart") {
    await handleQuickAddToCart();
  } else if (action === "preview") {
    await handleDownloadPreview();
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
    showToast("Failed to download preview.");
  }
};

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

// 监听全局歌曲ID，如果不是当前歌曲则暂停
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
  },
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
  },
);

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
      "track",
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

.download-button--locked {
  background-color: transparent;
  border: 1px solid #e67a54;
  color: #e67a54;
}

.download-button--locked:hover {
  background-color: #24120c;
  border-color: #e67a54;
  color: #e67a54;
}

.waveform-wrapper {
  flex-grow: 1; /* 让它占据所有可用空间 */
  height: 50px; /* 保持与播放按钮一致的高度 */
}

.more-options-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.dropdown-menu {
  position: absolute;
  bottom: 100%; /* 在按钮正上方弹出，避免被遮挡 */
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 10px;
  background-color: #222;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 8px 0;
  min-width: 180px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  z-index: 100;
}

/* 小三角指向下方 */
.dropdown-menu::after {
  content: "";
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #333;
}

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

.menu-item.disabled {
  cursor: default;
  color: #6dd59c;
}

.menu-item.disabled:hover {
  background-color: transparent;
}

.menu-icon {
  width: 18px;
  height: 18px;
  color: #ccc;
}

.cart-icon {
  color: #ffd700;
}

.menu-item:hover .menu-icon {
  color: #fff;
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px); /* 动画方向改为向上 */
}
</style>
