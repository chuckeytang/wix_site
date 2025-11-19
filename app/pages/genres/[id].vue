<template>
  <div class="page-wrapper" :class="{ 'sidebar-open': isSidebarOpen }">
    <aside class="sidebar" :class="{ 'is-open': isSidebarOpen }">
      <div class="sidebar-content">
        <Sidebar :config="filterConfig" @update:filters="handleFilterChange" />
      </div>
    </aside>

    <main class="main-content">
      <div class="page-header">
        <SearchBar @search="handleSearch" />
      </div>
      <div v-if="loading" class="loading-state">
        <span>Loading details...</span>
      </div>
      <div v-else-if="error" class="error-state">
        <span>Failed to load content. Please check the URL and try again.</span>
      </div>
      <template v-else-if="genresDetail">
        <div class="breadcrumb-container">
          <div class="container">
            <span class="breadcrumb-item">
              <NuxtLink to="/music" class="breadcrumb-link"
                >Royalty-free music</NuxtLink
              >
            </span>
            <span>></span>
            <span class="breadcrumb-item">
              <NuxtLink to="/genres" class="breadcrumb-link">genres</NuxtLink>
            </span>
            <span>></span>
            <span class="breadcrumb-item current">{{ genresDetail.name }}</span>
          </div>
        </div>

        <div class="mood-intro-section">
          <div class="mood-intro-text">
            <h2>
              {{ genresDetail.name }}
              <button class="play-all-btn" @click="playAllTracks">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
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
              </button>
            </h2>
            <p class="description">
              {{ genresDetail.description || "No description available." }}
            </p>
            <p class="track-count">
              {{ totalTracks }} Royalty-Free Music Tracks
            </p>
          </div>
          <div class="mood-intro-image-container">
            <img
              :src="genresDetail.coverImageUrl"
              :alt="genresDetail.name"
              class="mood-intro-image"
            />
          </div>
        </div>

        <section class="filters-and-sorts-section">
          <div class="container_2">
            <div class="header-content-wrapper">
              <button class="filter-button" @click="toggleSidebar">
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
                  class="feather feather-sliders"
                >
                  <line x1="4" y1="21" x2="4" y2="14"></line>
                  <line x1="4" y1="10" x2="4" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12" y2="3"></line>
                  <line x1="20" y1="21" x2="20" y2="16"></line>
                  <line x1="20" y1="12" x2="20" y2="3"></line>
                  <line x1="1" y1="14" x2="7" y2="14"></line>
                  <line x1="9" y1="8" x2="15" y2="8"></line>
                  <line x1="17" y1="16" x2="23" y2="16"></line>
                </svg>
                {{ isSidebarOpen ? "Hide Filters" : "Show Filters" }}
              </button>

              <div class="sort-and-view-options">
                <div class="sort-dropdown" ref="dropdownRef">
                  <div class="dropdown-header" @click.stop="toggleSortDropdown">
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
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { debounce } from "lodash-es";

// 导入所有需要的组件和库
import SearchBar from "~/components/SearchBar.vue";
import MusicCard from "~/components/MusicCard.vue";
import MusicGridCard from "~/components/MusicGridCard.vue";
import Pagination from "~/components/Pagination.vue";
import MusicPlayerPanel from "~/components/MusicPlayerPanel.vue";
import Sidebar from "~/components/Sidebar.vue";

// 导入 API 和 Pinia Store
import { tracksApi } from "~/api";
import { genresApi } from "~/api/genres";
import { useMusicPlayerStore } from "~/stores/musicPlayer";

// 导入类型
import type { Genres } from "~/types/genres";
import type { Tracks, PaginationResult } from "~/types/tracks";
import { useSort, type SortOption } from "~/composables/useSort";

const route = useRoute();
const router = useRouter();
const musicPlayerStore = useMusicPlayerStore();
const genresId = ref(route.params.id);

const genresDetail = ref<Genres | null>(null);
const loading = ref(true);
const error = ref(false);

const isSidebarOpen = ref<boolean>(false);
const currentView = ref<string>("list");

const tracks = ref<Tracks[]>([]);
const tracksLoading = ref<boolean>(false);
const tracksError = ref<boolean>(false);
const currentPage = ref<number>(1);
const pageSize = ref<number>(20);
const totalTracks = ref<number>(0);

const totalPages = computed(() => {
  return Math.ceil(totalTracks.value / pageSize.value);
});

// 定义筛选器配置和状态
interface FilterItem {
  id: string;
  title: string;
  componentType: string;
  props: {
    min?: number;
    max?: number;
    unit?: string;
    items?: { id: string; name: string; count: number }[];
  };
}

type FiltersState = {
  genres: string[];
  moods: string[];
  bpmRange: [number, number];
  durationRange: [number, number];
  author: string[];
};

const filterConfig = ref<FilterItem[]>([]);
const filters = reactive<FiltersState>({
  genres: [],
  moods: [],
  bpmRange: [0, 250],
  durationRange: [0, 600],
  author: [],
});

const handleSearch = (query: string) => {
  if (query) {
    router.push({ path: "/search", query: { q: query } });
  }
};

const debouncedFetchTracks = debounce(() => {
  currentPage.value = 1;
  fetchTracks();
}, 300);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const playAllTracks = () => {
  if (tracks.value && tracks.value.length > 0) {
    musicPlayerStore.setPlaylist(tracks.value, tracks.value[0]);
  }
};

const setView = (viewType: string) => {
  currentView.value = viewType;
};

const handlePageChange = (newPage: number) => {
  currentPage.value = newPage;
  fetchTracks();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const handleFilterChange = (newFilters: FiltersState) => {
  Object.assign(filters, newFilters);
  debouncedFetchTracks();
};

// 使用组合式函数封装排序逻辑
const handleSortChange = () => {
  currentPage.value = 1; // 排序变化时重置到第一页
  fetchTracks();
};

const {
  isDropdownOpen,
  currentSort,
  sortOptions,
  toggleSortDropdown,
  selectSortOption,
  dropdownRef,
} = useSort(handleSortChange);

const fetchData = async () => {
  const id = Number(genresId.value);
  if (isNaN(id)) {
    console.error("无效的情绪ID，无法获取数据。");
    error.value = true;
    loading.value = false;
    return;
  }
  loading.value = true;
  error.value = false;
  try {
    const genresResponse = await genresApi.getGenreDetail(id);
    if (genresResponse.code === 200 && genresResponse.data) {
      genresDetail.value = genresResponse.data as Genres;
    } else {
      throw new Error("Failed to fetch mood details.");
    }
  } catch (err) {
    console.error("获取数据失败:", err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

const fetchTracks = async () => {
  tracksLoading.value = true;
  tracksError.value = false;
  const id = Number(genresId.value);
  if (isNaN(id)) {
    tracksError.value = true;
    tracksLoading.value = false;
    return;
  }
  try {
    const query = {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      genres: filters.genres.length > 0 ? filters.genres.join(",") : undefined,
      moods: filters.moods.length > 0 ? filters.moods.join(",") : undefined,
      minBpm: filters.bpmRange[0],
      maxBpm: filters.bpmRange[1],
      minDuration: filters.durationRange[0],
      maxDuration: filters.durationRange[1],
      artist: filters.author.length > 0 ? filters.author.join(",") : undefined,
      orderByColumn: currentSort.value?.orderByColumn,
      isAsc: currentSort.value?.isAsc,
    };
    const response: PaginationResult<Tracks> = await genresApi.getGenresMusic(
      id,
      query
    );
    tracks.value = response.rows;
    totalTracks.value = response.total;
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

const fetchAndSetFilterConfig = async () => {
  try {
    const response = await tracksApi.getFilterOptions();
    if (response.code === 200 && response.data) {
      const options = response.data;
      const newConfig: FilterItem[] = [];
      if (options.genres && options.genres.length > 0) {
        newConfig.push({
          id: "genres",
          title: "Genres",
          componentType: "SimpleCheckboxFilter",
          props: {
            items: options.genres.map((g: { name: string; count: number }) => ({
              id: g.name,
              name: g.name,
              count: g.count,
            })),
          },
        });
      }
      if (options.moods && options.moods.length > 0) {
        newConfig.push({
          id: "moods",
          title: "Moods",
          componentType: "SimpleCheckboxFilter",
          props: {
            items: options.moods.map((m: { name: string; count: number }) => ({
              id: m.name,
              name: m.name,
              count: m.count,
            })),
          },
        });
      }
      if (options.minBpm !== undefined && options.maxBpm !== undefined) {
        newConfig.push({
          id: "bpmRange",
          title: "BPM",
          componentType: "RangeSliderFilter",
          props: { min: options.minBpm, max: options.maxBpm },
        });
      }
      if (
        options.minDuration !== undefined &&
        options.maxDuration !== undefined
      ) {
        newConfig.push({
          id: "durationRange",
          title: "Duration",
          componentType: "RangeSliderFilter",
          props: {
            min: options.minDuration,
            max: options.maxDuration,
            unit: "秒",
          },
        });
      }
      if (options.artists && options.artists.length > 0) {
        newConfig.push({
          id: "author",
          title: "Author",
          componentType: "SimpleCheckboxFilter",
          props: {
            items: options.artists.map(
              (a: { artist: string; count: number }) => ({
                id: a.artist,
                name: a.artist,
                count: a.count,
              })
            ),
          },
        });
      }
      filterConfig.value = newConfig;
    }
  } catch (error) {
    console.error("Failed to fetch filter options:", error);
  }
};

onMounted(() => {
  fetchData();
  fetchAndSetFilterConfig();
  fetchTracks();
});
</script>

<style scoped>
.page-wrapper {
  transition: transform 0.3s ease-in-out;
  overflow: hidden;
  background-color: #0d0d1a;
  color: #fff;
  min-height: 100vh;
}

.page-wrapper.sidebar-open .main-content {
  transform: translateX(300px);
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 300px;
  height: 100%;
  background-color: #1c1b1b;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
  z-index: 1000;
  padding: 20px 0;
  box-sizing: border-box;
  overflow-y: auto;
}

.sidebar.is-open {
  transform: translateX(0);
}

.sidebar-content {
  padding: 0 15px;
}

.main-content {
  flex-grow: 1;
  transition: transform 0.3s ease-in-out;
  width: 100%;
  box-sizing: border-box;
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

.breadcrumb-container {
  padding: 20px 0;
  color: #888;
}
.breadcrumb-item {
  margin: 0 5px;
}
.breadcrumb-link {
  color: #fff;
  text-decoration: none;
  transition: color 0.2s ease;
}
.breadcrumb-link:hover {
  color: #ff8c62;
}
.breadcrumb-item.current {
  color: #ff8c62;
}

.play-all-btn {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  margin-left: 20px;
  transition: color 0.3s;
}
.play-all-btn:hover {
  color: #ff8c62;
}

.track-count {
  font-size: 1em;
  color: #ccc;
  margin-top: 10px;
}

.filter-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: #ff8c62;
  color: #0d0d1a;
  font-weight: bold;
  font-size: 1em;
  padding: 12px 20px;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  transition:
    background-color 0.3s,
    transform 0.3s;
  min-width: 170px;
  text-align: center;
}

.filter-button:hover {
  background-color: #e67a54;
  transform: translateY(-2px);
}

.filter-button svg {
  width: 20px;
  height: 20px;
  color: #0d0d1a;
}

.mood-intro-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1a1a1a;
  border-radius: 8px;
  padding: 40px;
  gap: 40px;
  flex-wrap: wrap;
}

.mood-intro-text {
  flex: 1;
}

.mood-intro-text h2 {
  font-size: 3em;
  margin-bottom: 10px;
  font-weight: bold;
}

.mood-intro-text .description {
  font-size: 1.2em;
  color: #ccc;
  line-height: 1.6;
}

.mood-intro-image-container {
  flex: 0 0 auto;
}

.mood-intro-image {
  width: auto;
  height: 40vh;
  border-radius: 8px;
  display: block;
  object-fit: contain;
}

.filters-and-sorts-section {
  background-color: #0d0d1a;
  padding: 20px 0;
  color: #fff;
}

.header-content-wrapper {
  display: flex;
  justify-content: space-between;
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
