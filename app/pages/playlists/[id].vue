<template>
  <div class="playlists-detail-page">
    <div class="page-header">
      <SearchBar />
    </div>
    <main class="main-content">
      <div v-if="loading" class="loading-state">
        <span>Loading details...</span>
      </div>
      <div v-else-if="error" class="error-state">
        <span>Failed to load content. Please check the URL and try again.</span>
      </div>
      <template v-else-if="playlistDetail">
        <div class="playlist-intro-section">
          <div class="playlist-intro-text">
            <h2>{{ playlistDetail.title }}</h2>
            <p class="description">
              {{ playlistDetail.description || "No description available." }}
            </p>
          </div>
          <div class="playlist-intro-image-container">
            <img
              :src="playlistDetail.imageUrl"
              :alt="playlistDetail.imageAltText || playlistDetail.title"
              class="playlist-intro-image"
            />
          </div>
        </div>

        <section class="filters-and-sorts-section">
          <div class="container_2">
            <div class="header-content-wrapper">
              <div class="sort-dropdown" @click.stop="toggleSortDropdown">
                <div class="dropdown-header">
                  <span class="current-sort">{{ currentSort?.label }}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="feather feather-chevron-down"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
                <ul class="dropdown-options" v-if="isDropdownOpen">
                  <li
                    v-for="option in sortOptions"
                    :key="option.value"
                    @click="selectSortOption(option)"
                    :class="{
                      'is-active': currentSort?.value === option.value,
                    }"
                  >
                    {{ option.label }}
                  </li>
                </ul>
              </div>
              <div class="view-toggle">
                <button
                  class="view-list"
                  @click="setView('list')"
                  :class="{ active: currentView === 'list' }"
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
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                  </svg>
                </button>
                <button
                  class="view-grid"
                  @click="setView('grid')"
                  :class="{ active: currentView === 'grid' }"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="none"
                  >
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section class="music-list-section">
          <div v-if="tracksLoading" class="loading-state">
            Loading tracks...
          </div>
          <div v-else-if="tracksError" class="error-state">
            Failed to load tracks.
          </div>
          <template v-else-if="currentView === 'list'">
            <MusicCard
              v-for="track in tracks"
              :key="track.trackId"
              :track="track"
            />
          </template>
          <template v-else-if="currentView === 'grid'">
            <div class="music-grid-container">
              <MusicGridCard
                v-for="track in tracks"
                :key="track.trackId"
                :track="track"
              />
            </div>
          </template>
        </section>

        <Pagination
          v-if="!tracksLoading && !tracksError"
          :total-pages="totalPages"
          :current-page="currentPage"
          @update:currentPage="handlePageChange"
        />
      </template>
    </main>
    <MusicPlayerPanel />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";

import SearchBar from "~/components/SearchBar.vue";
import MusicCard from "~/components/MusicCard.vue";
import MusicGridCard from "~/components/MusicGridCard.vue";
import Pagination from "~/components/Pagination.vue";
import MusicPlayerPanel from "~/components/MusicPlayerPanel.vue";

import { playlistsApi } from "~/api/playlists";
import { useMusicPlayerStore } from "~/stores/musicPlayer";
import type { Playlists, PaginationResult } from "~/types/playlists";
import type { Tracks } from "~/types/tracks";

const route = useRoute();
const musicPlayerStore = useMusicPlayerStore();
const playlistId = ref(route.params.id);

const playlistDetail = ref<Playlists | null>(null);
const loading = ref(true);
const error = ref(false);

const isDropdownOpen = ref<boolean>(false);
const currentView = ref<string>("list");
const sortOptions = [
  { value: "popular", label: "popular" },
  { value: "newest", label: "newest" },
  { value: "oldest", label: "oldest" },
];
const currentSort = ref(sortOptions[0]);

const tracks = ref<Tracks[]>([]);
const tracksLoading = ref<boolean>(false);
const tracksError = ref<boolean>(false);
const currentPage = ref<number>(1);
const pageSize = ref<number>(20);
const totalTracks = ref<number>(0);

const totalPages = computed(() => {
  return Math.ceil(totalTracks.value / pageSize.value);
});

const setView = (viewType: string) => {
  currentView.value = viewType;
};

const toggleSortDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const selectSortOption = (option: { value: string; label: string }) => {
  currentSort.value = option;
  isDropdownOpen.value = false;
  currentPage.value = 1;
  fetchTracks();
};

const handlePageChange = (newPage: number) => {
  currentPage.value = newPage;
  fetchTracks();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const fetchPlaylistDetail = async () => {
  const id = Number(playlistId.value);
  if (isNaN(id)) {
    console.error("无效的播放列表ID，无法获取数据。");
    error.value = true;
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = false;

  try {
    const playlistResponse = await playlistsApi.getPlaylistDetail(id);
    if (playlistResponse.code === 200 && playlistResponse.data) {
      playlistDetail.value = playlistResponse.data as Playlists;
    } else {
      throw new Error("Failed to fetch playlist details.");
    }
  } catch (err) {
    console.error("获取播放列表详情失败:", err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

const fetchTracks = async () => {
  tracksLoading.value = true;
  tracksError.value = false;
  const id = Number(playlistId.value);
  if (isNaN(id)) {
    tracksError.value = true;
    tracksLoading.value = false;
    return;
  }
  try {
    const response: PaginationResult<Tracks> =
      await playlistsApi.getPlaylistMusic(id, {
        pageNum: currentPage.value,
        pageSize: pageSize.value,
        sortValue: currentSort.value?.value,
        sortLabel: currentSort.value?.label,
      });
    tracks.value = response.rows;
    totalTracks.value = response.total;
    // 核心改动：设置播放列表
    musicPlayerStore.setPlaylist(tracks.value);
  } catch (e) {
    tracksError.value = true;
    console.error("Failed to fetch tracks:", e);
  } finally {
    tracksLoading.value = false;
  }
};

const handleTrackCardClick = (track: Tracks) => {
  musicPlayerStore.setPlaylist(tracks.value, track);
};

onMounted(() => {
  fetchPlaylistDetail();
  fetchTracks();
});
</script>

<style scoped>
.playlists-detail-page {
  background-color: #000;
  color: #fff;
  padding: 40px 0px;
  min-height: 100vh;
}

.loading-state,
.error-state,
.no-music-state {
  text-align: center;
  font-size: 1.5em;
  padding: 50px 0;
}

.page-header {
  padding: 40px;
}

.playlist-intro-section {
  display: flex;
  /* 文本和图片之间保持空间 */
  justify-content: space-between;
  /* 垂直居中对齐 */
  align-items: center;
  background-color: #1a1a1a;
  border-radius: 8px;
  /* 增加内边距以提供呼吸空间 */
  padding: 40px;
  /* 元素之间的间距 */
  gap: 40px;
  /* 允许在小屏幕上换行 */
  flex-wrap: wrap;
}

.playlist-intro-text {
  /* 让文本区域占据剩余的大部分空间 */
  flex: 1;
}

.playlist-intro-text h2 {
  font-size: 3em;
  margin-bottom: 10px;
  font-weight: bold;
}

.playlist-intro-text .description {
  font-size: 1.2em;
  color: #ccc;
  line-height: 1.6;
}

.playlist-intro-image-container {
  /* 固定图片容器的尺寸，防止其过度伸展 */
  flex: 0 0 auto;
}

.playlist-intro-image {
  width: auto;
  height: 40vh;
  border-radius: 8px;
  display: block;
  object-fit: contain;
}

/* ====================================================================== */
/* 排序、视图切换区域样式 */
/* ====================================================================== */
.filters-and-sorts-section {
  background-color: #0d0d1a;
  padding: 20px 0;
  color: #fff;
}

.header-content-wrapper {
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.sort-and-view-options {
  display: flex;
  align-items: center;
  gap: 20px;
}

.view-toggle {
  display: flex;
  border: 1px solid #444;
  border-radius: 5px;
  overflow: hidden;
}

.view-toggle button {
  background-color: transparent;
  border: none;
  color: #888;
  padding: 8px 12px;
  cursor: pointer;
  transition:
    color 0.3s,
    background-color 0.3s;
}

.view-toggle button.active {
  background-color: #555;
  color: #fff;
}

.view-toggle button:hover {
  background-color: #555;
  color: #fff;
}

.view-toggle button svg {
  width: 20px;
  height: 20px;
}

.sort-dropdown {
  position: relative;
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #333;
  color: #fff;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  user-select: none;
}

.dropdown-header:hover {
  background-color: #555;
}

.current-sort {
  font-weight: bold;
}

.dropdown-header svg {
  color: #fff;
  transition: transform 0.3s;
}

.sort-dropdown.is-open .dropdown-header svg {
  transform: rotate(180deg);
}

.dropdown-options {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  min-width: max-content;
  margin-top: 5px;
  background-color: #333;
  border-radius: 5px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  list-style: none;
  padding: 5px 0;
  z-index: 50;
}

.dropdown-options li {
  padding: 8px 12px;
  color: #1c1b1b;
  cursor: pointer;
  transition:
    background-color 0.3s,
    color 0.3s;
}

.dropdown-options li:hover {
  background-color: #555;
  color: #fff;
}

.dropdown-options li.is-active {
  background-color: #ff8c62;
  color: #0d0d1a;
  font-weight: bold;
}

/* ====================================================================== */
/* 音乐列表和网格样式 */
/* ====================================================================== */
.music-list-section,
.music-grid-section {
  background-color: #0d0d1a;
  padding: 20px 0;
}

.music-grid-container {
  max-width: 1800px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 400px));
  gap: 20px;
}
</style>
