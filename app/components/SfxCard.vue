<template>
  <div class="sfx-card-list">
    <div class="left-section">
      <button class="play-button" @click="handlePlayButtonClick()">
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
      <div class="sfx-info">
        <NuxtLink :to="`/sfx/${sfx.sfxId}`" class="sfx-title">
          {{ sfx.title }}
        </NuxtLink>
        <span class="sfx-artist">{{ sfx.artist }}</span>
      </div>
    </div>

    <div class="waveform-container">
      <WaveformPlayer
        :audio-url="sfx.audioFileUrl"
        :is-playing="localIsPlaying"
        @ready="handleReady"
        @waveform-click="handleWaveformClick"
        @play="handlePlay"
        @pause="handlePause"
        :can-control="false"
        ref="waveformPlayerRef"
      />
    </div>

    <div class="sfx-meta-info">
      <div class="duration-group">
        <span class="duration">{{ formatDuration(sfx.duration) }}</span>
      </div>
    </div>

    <div class="right-column-group">
      <div class="action-buttons">
        <button class="action-btn" @click.stop="handleAddToPlaylist">
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

      <div class="download-group">
        <button class="download-button" @click.stop="handleDownload">
          download
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, computed, watch } from "vue";
import { useMusicPlayerStore } from "~/stores/musicPlayer";
import type { Sfx } from "~/types/sfx";
import WaveformPlayer from "./WaveformPlayer.vue";
import { useDownloadMedia } from "~/composables/useDownloadMedia";
import { useAuthStore } from "~/stores/auth";
import { usePlaylistModalStore } from "~/stores/playlistModal";
import { useToast } from "~/composables/useToast";
import { favoritesApi } from "~/api/favorites";

const props = defineProps({
  sfx: {
    type: Object as () => Sfx,
    required: true,
  },
});

const musicPlayerStore = useMusicPlayerStore();
const waveformPlayerRef = ref<InstanceType<typeof WaveformPlayer> | null>(null);
const { handleDownload: handleDownloadCheckAndExecute } = useDownloadMedia();
const authStore = useAuthStore();
const playlistModalStore = usePlaylistModalStore();
const { showToast } = useToast();

const isFavoritedSfx = ref(false);

// 初始化时检查 SFX 收藏状态 (假设 favoritesApi 提供了 checkFavoriteSfxStatus)
onMounted(async () => {
  if (authStore.isAuthenticated && props.sfx.sfxId) {
    try {
      const res = await favoritesApi.checkFavoriteStatus(props.sfx.sfxId);
      isFavoritedSfx.value = res.data!;
    } catch (e) {
      // 未登录或接口错误，默认为未收藏
      isFavoritedSfx.value = false;
    }
  }
});

const handleToggleFavoriteSfx = async () => {
  if (!authStore.isAuthenticated) {
    authStore.openLoginDialog();
    return;
  }

  const previousState = isFavoritedSfx.value;
  // 乐观更新 UI
  isFavoritedSfx.value = !previousState;

  try {
    // 假设 API 接口为 toggleFavoriteSfx
    const res = await favoritesApi.toggleFavorite(props.sfx.sfxId!);
    if (res.data !== undefined) {
      isFavoritedSfx.value = res.data;
      showToast(res.data ? "Added to favorites" : "Removed from favorites");
    }
  } catch (error) {
    // 失败回滚
    isFavoritedSfx.value = previousState;
    showToast("Failed to update favorite status");
  }
};

const localIsPlaying = computed(() => {
  return (
    (musicPlayerStore.currentTrack as Sfx)?.sfxId === props.sfx.sfxId &&
    musicPlayerStore.mediaType === "sfx" &&
    musicPlayerStore.isPlaying
  );
});

const handleAddToPlaylist = () => {
  if (!authStore.isAuthenticated) {
    authStore.openLoginDialog(); // 假设您有这个
    return;
  }

  playlistModalStore.openModal(props.sfx.sfxId!, "sfx", props.sfx.title);
};

// 监听全局播放ID变化，如果当前不是此卡片的ID，则暂停
watch(
  () => musicPlayerStore.currentPlayingId,
  (newId) => {
    if (newId && newId !== props.sfx.sfxId) {
      if (waveformPlayerRef.value) {
        waveformPlayerRef.value.pause();
      }
    }
  }
);

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

const handlePlayButtonClick = () => {
  if (
    (musicPlayerStore.currentTrack as Sfx)?.sfxId === props.sfx.sfxId &&
    musicPlayerStore.mediaType === "sfx"
  ) {
    musicPlayerStore.togglePlayPause();
  } else {
    musicPlayerStore.setSfx(props.sfx);
  }
};

const handleWaveformClick = (relativePosition: number) => {
  if (
    (musicPlayerStore.currentTrack as Sfx)?.sfxId === props.sfx.sfxId &&
    musicPlayerStore.mediaType === "sfx"
  ) {
    musicPlayerStore.seekTo(relativePosition);
  } else {
    musicPlayerStore.setSfx(props.sfx);
    setTimeout(() => {
      musicPlayerStore.seekTo(relativePosition);
    }, 20);
  }
};

const handlePlay = () => {
  const isDifferentSfx =
    musicPlayerStore.mediaType !== "sfx" ||
    (musicPlayerStore.currentTrack as Sfx)?.sfxId !== props.sfx.sfxId;

  if (isDifferentSfx) {
    musicPlayerStore.setSfx(props.sfx);
  }
  musicPlayerStore.setIsPlaying(true);
};

const handlePause = () => {
  musicPlayerStore.setIsPlaying(false);
};

const handleReady = () => {
  if (waveformPlayerRef.value) {
    musicPlayerStore.setDuration(waveformPlayerRef.value.getDuration());
  }
};

const handleDownload = async () => {
  if (!props.sfx.audioFileUrl) {
    console.error("Audio file URL is not available.");
    return;
  }
  // 调用 Composable，传入媒体对象和类型
  await handleDownloadCheckAndExecute(props.sfx, "sfx");
};
</script>

<style scoped>
.sfx-card-list {
  display: grid;
  grid-template-columns:
    minmax(150px, 2fr) minmax(300px, 8fr) minmax(80px, 1fr)
    auto;
  align-items: center;
  gap: 20px;
  padding: 15px 20px;
  border-bottom: 1px solid #222;
  transition: background-color 0.3s;
}

.sfx-card-list:hover {
  background-color: #1a1a1a;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* 歌曲信息 */
.sfx-info {
  display: flex;
  flex-direction: column;
}

.sfx-title {
  font-weight: bold;
  font-size: 1.1em;
  color: #edebeb;
  text-decoration: none;
  transition: color 0.2s ease-in-out;
}

.sfx-title:hover {
  color: #ff8c62;
}

.sfx-artist {
  font-size: 0.9em;
  color: #edebeb;
}

.waveform-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.sfx-meta-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 0.9em;
  color: #ccc;
  flex-shrink: 0;
  min-width: 80px;
}

.duration-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.duration {
  font-weight: bold;
}

.right-column-group {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
}

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

.action-btn:hover {
  color: #ff8c62;
}

.download-group {
  display: flex;
  align-items: center;
}

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

.play-button {
  position: relative;
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

.play-button svg {
  color: #888;
  transition: color 0.3s ease;
}

.sfx-card-list:hover .play-button svg {
  color: white;
}
</style>
