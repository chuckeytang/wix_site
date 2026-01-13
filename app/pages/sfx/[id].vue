<template>
  <div class="page-container">
    <TheHeader />
    <div class="search-bar-container">
      <SearchBar @search="handleSearch" />
    </div>

    <div class="main-content-container">
      <nav class="breadcrumb">
        <span>Sound Effects</span>
        <span class="separator">&gt;</span>
        <a href="#" class="artist-link">{{ sfx?.artist || "..." }}</a>
        <span class="separator">&gt;</span>
        <span class="track-title-breadcrumb">{{ sfx?.title || "..." }}</span>
      </nav>

      <section class="track-details-section">
        <div class="left-column">
          <button class="play-button" @click="togglePlayAndSetSfx">
            <svg
              v-if="!localIsPlaying"
              xmlns="http://www.w3.org/2000/svg"
              width="60"
              height="60"
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
              width="60"
              height="60"
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
        <div class="right-column">
          <h1 class="track-title">{{ sfx?.title || "Loading..." }}</h1>
          <p class="track-artist">By {{ sfx?.artist || "..." }}</p>
        </div>
      </section>

      <section class="meta-section">
        <p class="track-description">
          {{ sfx?.description || "No description provided." }}
        </p>

        <div class="action-buttons">
          <button class="download-button" @click="handleDownload">
            Download
          </button>
        </div>

        <div class="user-actions">
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
            Favorite
          </button>
          <button class="action-btn" @click="handleAddToCart">
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
            Add to Cart
          </button>
          <!-- <button class="action-btn" @click="handleShowLicenseModal">
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
            </svg>
            View License Terms
          </button> -->
        </div>
      </section>
    </div>

    <MusicPlayerPanel />

    <CheckoutModal
      :isVisible="showCheckoutModal"
      :clientSecret="checkoutClientSecret"
      :orderId="checkoutOrderId"
      :returnPath="checkoutReturnPath"
      :amount="checkoutAmount"
      :currency="checkoutCurrency"
      @close="showCheckoutModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { cartsApi } from "~/api/carts";
import type { Sfx } from "~/types/sfx";
import { useMusicPlayerStore } from "~/stores/musicPlayer";
import TheHeader from "~/components/TheHeader.vue";
import SearchBar from "~/components/SearchBar.vue";
import MusicPlayerPanel from "~/components/MusicPlayerPanel.vue";
import { useAuthStore } from "~/stores/auth";
import CheckoutModal from "~/components/CheckoutModal.vue";
import { useDownloadMedia } from "~/composables/useDownloadMedia";
import { sfxApi } from "~/api/sfx";

const route = useRoute();
const sfxId = Number(route.params.id);
const router = useRouter();
const authStore = useAuthStore();

const sfx = ref<Sfx | null>(null);
const loading = ref(true);
const error = ref(false);

const showCheckoutModal = ref(false);
const checkoutClientSecret = ref<string | null>(null);
const checkoutOrderId = ref<number | null>(null);
const checkoutReturnPath = ref<string | null>(null);
const checkoutAmount = ref(0);
const checkoutCurrency = ref("usd");
const config = useRuntimeConfig();
const { handleDownload: handleDownloadCheckAndExecute } = useDownloadMedia();

const musicPlayerStore = useMusicPlayerStore();
const { showToast } = useToast();
const localIsPlaying = computed(() => {
  // 仅在当前媒体类型为 sfx 时进行比较，并断言类型
  return (
    (musicPlayerStore.currentTrack as Sfx)?.sfxId === sfx.value?.sfxId &&
    musicPlayerStore.mediaType === "sfx" &&
    musicPlayerStore.isPlaying
  );
});

const handleShowLicenseModal = () => {
  if (sfx.value) {
    authStore.openLicenseModal(sfx.value.sfxId!, sfx.value.title, "sfx");
  }
};

const handleSearch = (query: string) => {
  if (query) {
    router.push({ path: "/search", query: { q: query } });
  }
};

const handleDownload = async () => {
  if (!sfx.value) {
    console.error("SFX details are not loaded.");
    return;
  }

  // 调用 Composable，传入 sfx 对象和媒体类型 'sfx'
  await handleDownloadCheckAndExecute(sfx.value, "sfx");
};

const fetchSfxDetails = async () => {
  if (isNaN(sfxId)) {
    console.error("Invalid SFX ID provided.");
    error.value = true;
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = false;
  try {
    const response = await sfxApi.getSfxDetail(sfxId);
    if (response.data) {
      sfx.value = response.data;
    } else {
      sfx.value = null;
      error.value = true;
    }
  } catch (e) {
    error.value = true;
    console.error("Failed to fetch SFX details:", e);
  } finally {
    loading.value = false;
  }
};

const togglePlayAndSetSfx = () => {
  if (!sfx.value) return;

  if (
    // 仅在当前媒体类型为 sfx 时进行比较，并断言类型
    (musicPlayerStore.currentTrack as Sfx)?.sfxId === sfx.value.sfxId &&
    musicPlayerStore.mediaType === "sfx"
  ) {
    musicPlayerStore.togglePlayPause();
  } else {
    musicPlayerStore.setSfx(sfx.value);
  }
};

onMounted(() => {
  fetchSfxDetails();
});

/**
 * 处理添加到购物车 (仅弹出许可模态框)
 */
const handleAddToCart = () => {
  // 音效页和音乐页统一，点击 Add to Cart 弹出许可模态框
  handleShowLicenseModal();
};
</script>

<style scoped>
/* 使用与 music/[id].vue 一致的样式 */
.page-container {
  min-height: 100vh;
  background-color: #0d0d1a;
  color: #fff;
  padding-top: 80px;
  padding-bottom: 100px;
}

.search-bar-container {
  width: 100%;
  margin: 0 auto;
  background-color: transparent;
}

.main-content-container {
  max-width: 80%;
  margin: 0 auto;
  padding: 40px 20px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  font-size: 0.9em;
  color: #888;
  margin-bottom: 30px;
}

.breadcrumb .separator {
  margin: 0 8px;
  color: #555;
}

.breadcrumb .artist-link {
  color: #ccc;
  text-decoration: none;
  transition: color 0.3s;
}

.breadcrumb .artist-link:hover {
  color: #ff8c62;
  text-decoration: underline;
}

.track-details-section {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 40px;
}

.left-column {
  flex-shrink: 0;
}

.play-button {
  background-color: transparent;
  border: 1px solid #ff8c62;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    background-color 0.3s,
    transform 0.3s;
}

.play-button:hover {
  background-color: #ff8c62;
  transform: scale(1.05);
}

.play-button svg {
  color: #ff8c62;
  transition: color 0.3s;
}

.play-button:hover svg {
  color: #0d0d1a;
}

.right-column {
  flex-grow: 1;
}

.track-title {
  font-size: 3em;
  font-weight: bold;
  color: #fff;
  margin: 0 0 10px 0;
}

.track-artist {
  font-size: 1.2em;
  color: #ccc;
  margin: 0;
}

.meta-section {
  padding: 20px 0;
}

.track-description {
  font-size: 1em;
  line-height: 1.6;
  color: #ccc;
  margin-bottom: 40px;
}

.action-buttons {
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
}

.download-button,
.more-button {
  padding: 15px 30px;
  font-size: 1.1em;
  font-weight: bold;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.download-button {
  background-color: #ff8c62;
  color: #0d0d1a;
}

.download-button:hover {
  background-color: #e67a54;
}

.more-button {
  background-color: #333;
  color: #fff;
}

.more-button:hover {
  background-color: #555;
}

.user-actions {
  display: flex;
  gap: 30px;
}

.action-btn {
  background-color: transparent;
  border: none;
  color: #ccc;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: color 0.3s;
}

.action-btn:hover {
  color: #ff8c62;
}

.action-btn svg {
  color: #ccc;
  transition: color 0.3s;
}

.action-btn:hover svg {
  color: #ff8c62;
}
</style>
