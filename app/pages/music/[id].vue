<template>
  <div class="page-container">
    <TheHeader />
    <div class="search-bar-container">
      <SearchBar @search="handleSearch" />
    </div>

    <div class="main-content-container">
      <nav class="breadcrumb">
        <span>Royalty-Free Music</span>
        <span class="separator">&gt;</span>
        <a href="#" class="artist-link">{{ track?.artist || "..." }}</a>
        <span class="separator">&gt;</span>
        <span class="track-title-breadcrumb">{{ track?.title || "..." }}</span>
      </nav>

      <section class="track-details-section">
        <div class="left-column">
          <button class="play-button" @click="togglePlayAndSetTrack">
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
          <h1 class="track-title">{{ track?.title || "Loading..." }}</h1>
          <p class="track-artist">By {{ track?.artist || "..." }}</p>
        </div>
      </section>

      <section class="meta-section">
        <div class="license-info">
          <span class="license-label">Any license comes with:</span>
          <div class="license-options">
            <span
              class="option"
              :class="{ active: activeSegment === 'full' }"
              @click="selectSegmentOption('full')"
            >
              Full Track
            </span>
            <span
              class="option"
              :class="{ active: activeSegment === '15s' }"
              @click="selectSegmentOption('15s')"
            >
              15
            </span>
            <span
              class="option"
              :class="{ active: activeSegment === '30s' }"
              @click="selectSegmentOption('30s')"
            >
              30
            </span>
            <span
              class="option"
              :class="{ active: activeSegment === '60s' }"
              @click="selectSegmentOption('60s')"
            >
              60
            </span>
          </div>
        </div>

        <p class="track-description">
          {{ track?.description || "No description provided." }}
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
          <button
            class="action-btn"
            @click="handleShowLicenseModal('add_to_cart')"
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
          <!-- <button
            class="action-btn"
            @click="handleShowLicenseModal('view_terms')"
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
      @close="handleCloseCheckout"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { cartsApi } from "~/api/carts";
import type { Tracks } from "~/types/tracks";
import { useMusicPlayerStore } from "~/stores/musicPlayer";
import TheHeader from "~/components/TheHeader.vue";
import SearchBar from "~/components/SearchBar.vue";
import MusicPlayerPanel from "~/components/MusicPlayerPanel.vue";
import { useAuthStore } from "~/stores/auth";
import CheckoutModal from "~/components/CheckoutModal.vue";
import { useDownloadMedia } from "~/composables/useDownloadMedia";
import { tracksApi } from "~/api/tracks";

// 路由信息
const route = useRoute();
const trackId = Number(route.params.id);
const router = useRouter();
const authStore = useAuthStore();

const showCheckoutModal = ref(false);
const checkoutClientSecret = ref<string | null>(null);
const checkoutOrderId = ref<number | null>(null);
const checkoutReturnPath = ref<string | null>(null);
const checkoutAmount = ref(0);
const checkoutCurrency = ref("usd");

// 状态管理
const track = ref<Tracks | null>(null);
const loading = ref(true);
const error = ref(false);
const config = useRuntimeConfig();
const { showToast } = useToast();
const publishableKey = config.public.stripePk as string;

const musicPlayerStore = useMusicPlayerStore();
const { handleDownload: handleDownloadCheckAndExecute } = useDownloadMedia();
const localIsPlaying = computed(() => {
  if (!musicPlayerStore.currentTrack || !musicPlayerStore.isPlaying) {
    return false;
  }

  // 根据媒体类型来判断
  if (musicPlayerStore.mediaType === "track") {
    // 使用类型断言明确告诉编译器，这里的 currentTrack 是 Tracks 类型
    const currentTrackAsTracks = musicPlayerStore.currentTrack as Tracks;
    return currentTrackAsTracks.trackId === track.value?.trackId;
  }

  return false;
});

const handleShowLicenseModal = (action: "add_to_cart" | "view_terms") => {
  console.log("handleShowLicenseModal");
  // 传递完整的授权信息
  if (track.value) {
    authStore.openLicenseModal(
      track.value.trackId!,
      track.value.title,
      "track",
    );
  }
};

const handleSearch = (query: string) => {
  if (query) {
    router.push({ path: "/search", query: { q: query } });
  }
};

const handleDownload = async () => {
  if (!track.value) {
    console.error("Track details are not loaded.");
    return;
  }

  // 调用 Composable，传入 track 对象和媒体类型 'track'
  await handleDownloadCheckAndExecute(track.value, "track");
};

const activeSegment = computed(() => {
  // 如果当前详情页的歌曲不是全局播放器正在播放的歌曲，则默认显示“全曲”
  // 在访问 trackId 之前，进行类型断言
  if (
    (musicPlayerStore.currentTrack as Tracks)?.trackId !==
      track.value?.trackId ||
    musicPlayerStore.mediaType === "sfx" // 增加判断，如果当前播放的是音效，则也默认显示“全曲”
  ) {
    return "full";
  }
  // 否则，与全局播放器的分段状态同步
  return musicPlayerStore.currentSegment;
});

// 异步数据获取
const fetchTrackDetails = async () => {
  if (!trackId) {
    console.error("Track ID is missing from the route parameters.");
    error.value = true;
    return;
  }

  loading.value = true;
  error.value = false;
  try {
    const response = await tracksApi.getTrackDetail(trackId);
    // 在赋值之前，先检查 response.data 是否存在
    if (response.data) {
      track.value = response.data;
    } else {
      // 如果没有数据，将 track.value 设为 null
      track.value = null;
      error.value = true;
    }
  } catch (e) {
    error.value = true;
    console.error("Failed to fetch track details:", e);
  } finally {
    loading.value = false;
  }
};

// 播放/暂停逻辑
const togglePlayAndSetTrack = () => {
  if (!track.value) return;

  // 在访问 trackId 之前，进行类型断言
  if (
    (musicPlayerStore.currentTrack as Tracks)?.trackId ===
      track.value.trackId &&
    musicPlayerStore.mediaType === "track" // 增加判断，确保类型一致
  ) {
    musicPlayerStore.togglePlayPause();
  } else {
    musicPlayerStore.setTrack(track.value);
  }
};

// 选择分段的逻辑
const selectSegmentOption = (segment: string) => {
  if (!track.value) return;

  // 1. 设置当前播放歌曲为详情页歌曲，并确保播放
  // 在访问 trackId 之前，进行类型断言
  if (
    (musicPlayerStore.currentTrack as Tracks)?.trackId !==
      track.value.trackId ||
    musicPlayerStore.mediaType === "sfx" || // 增加判断，如果当前播放的是音效，则需要切换
    !musicPlayerStore.isPlaying
  ) {
    musicPlayerStore.setTrack(track.value);
  }

  // 2. 更新全局播放器的分段状态
  musicPlayerStore.setSegment(segment);
};

/**
 * [+] 处理支付唤起逻辑
 * 假设你以后在详情页增加“立即购买”功能
 */
const handleDirectPay = async (orderId: number, amount: number) => {
  console.log("[Detail Parent] Triggering payment for order:", orderId);

  // 1. 设置基础订单数据
  checkoutOrderId.value = orderId;
  checkoutAmount.value = amount;
  checkoutCurrency.value = "usd";

  // 2. 关键：强制设为 null 以触发模态框的“自驱动”流程
  // 模态框打开后会执行：getMe -> (无地址)显表单 -> (有地址)fetchSecret
  checkoutClientSecret.value = null;

  // 3. 显示模态框
  showCheckoutModal.value = true;
};

/**
 * [+] 处理模态框关闭
 */
const handleCloseCheckout = () => {
  showCheckoutModal.value = false;
  // 重置内部状态防止下次打开干扰
  checkoutClientSecret.value = null;
};

onMounted(() => {
  // 在调用 API 之前检查 ID 是否有效
  if (isNaN(trackId)) {
    console.error("Invalid track ID provided.");
    error.value = true;
    loading.value = false;
    return;
  }
  fetchTrackDetails();
});
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #0d0d1a;
  color: #fff;
  padding-top: 80px; /* 留出顶部 Header 的空间 */
  padding-bottom: 100px; /* 留出底部播放器面板的空间 */
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

.license-info {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.license-label {
  font-weight: bold;
  font-size: 1.1em;
}

.license-options {
  display: flex;
  gap: 10px;
}

.option {
  padding: 8px 15px;
  border: 1px solid #444;
  border-radius: 50px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    border-color 0.3s;
}

.option:hover {
  border-color: #ff8c62;
}

.option.active {
  background-color: #ff8c62;
  color: #0d0d1a;
  border-color: #ff8c62;
  font-weight: bold;
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

.action-btn.primary-action {
  background-color: #ff8c62; /* 使用主题色 */
  color: #0d0d1a;
  padding: 10px 15px;
  border-radius: 8px;
  font-weight: bold;
}
.action-btn.primary-action:hover {
  background-color: #e67a54;
}
.action-btn.primary-action svg {
  color: #0d0d1a !important;
}
</style>
