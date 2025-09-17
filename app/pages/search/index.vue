<template>
  <div class="page-container">
    <div class="header-and-search-wrapper">
      <TheHeader />
      <div class="search-bar-container">
        <SearchBar @search="handleSearch" :placeholderText="searchQuery" />
      </div>
    </div>

    <div class="main-content-container">
      <section class="prompt-section">
        <div class="container_2 prompt-flex-wrapper">
          <p class="prompt-text">
            <span class="prompt-emoji">💡 </span>
            tips:try adjusting your search with clearer mood, reference, or musical detail to get more precise results.
          </p>
          <!-- 视图切换控件移动到这里 -->
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
      </section>

      <!-- 移除 filters-and-sorts-section -->

      <section class="music-list-section" v-if="currentView === 'list'">
        <div v-if="tracksLoading" class="loading-state">Loading tracks...</div>
        <div v-else-if="tracksError" class="error-state">
          Failed to load tracks.
        </div>
        <div v-else-if="tracks.length === 0" class="no-results-state">
          no music related to “{{ searchQuery }}” was found.
        </div>
        <template v-else>
          <MusicCard
            v-for="track in tracks"
            :key="track.trackId"
            :track="track"
            @click.native="handleTrackCardClick(track)"
          />
        </template>
      </section>

      <section class="music-grid-section" v-else>
        <div v-if="tracksLoading" class="loading-state">Loading tracks...</div>
        <div v-else-if="tracksError" class="error-state">
          Failed to load tracks.
        </div>
        <div v-else-if="tracks.length === 0" class="no-results-state">
          没有找到与“{{ searchQuery }}”相关的音乐。
        </div>
        <template v-else>
          <div class="music-grid-container">
            <MusicGridCard
              v-for="track in tracks"
              :key="track.trackId"
              :track="track"
              @click.native="handleTrackCardClick(track)"
            />
          </div>
        </template>
      </section>

      <Pagination
        v-if="!tracksLoading && !tracksError && tracks.length > 0"
        :total-pages="totalPages"
        :current-page="currentPage"
        @update:currentPage="handlePageChange"
      />
    </div>

    <MusicPlayerPanel />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import TheHeader from "~/components/TheHeader.vue";
import SearchBar from "~/components/SearchBar.vue";
import MusicCard from "~/components/MusicCard.vue";
import MusicGridCard from "~/components/MusicGridCard.vue";
import Pagination from "~/components/Pagination.vue";
import MusicPlayerPanel from "~/components/MusicPlayerPanel.vue";

// 导入 API 和类型
import { tracksApi } from "~/api";
import type { Tracks } from "~/types/tracks";

// 导入 Pinia store
import { useMusicPlayerStore } from "~/stores/musicPlayer";
const musicPlayerStore = useMusicPlayerStore();

// Vue Router
const route = useRoute();
const router = useRouter();

// 状态
// 移除 isDropdownOpen
const currentView = ref<string>("list");
// 移除 sortOptions, currentSort
// const sortOptions = [ /* ... */ ];
// const currentSort = ref(sortOptions[0]);

// 搜索和数据状态
const searchQuery = ref<string>((route.query.q as string) || "");
const tracks = ref<Tracks[]>([]);
const tracksLoading = ref<boolean>(true);
const tracksError = ref<boolean>(false);
const currentPage = ref<number>(1);
const pageSize = ref<number>(20);
const totalTracks = ref<number>(0);

const totalPages = computed(() => {
  return Math.ceil(totalTracks.value / pageSize.value);
});

// 过滤器和排序操作 (只保留 setView)
const setView = (viewType: string) => {
  currentView.value = viewType;
};

// 移除 toggleSortDropdown, selectSortOption
// const toggleSortDropdown = () => { /* ... */ };
// const selectSortOption = (option: { value: string; label: string }) => { /* ... */ };

// 异步数据获取
const fetchTracks = async () => {
  tracksLoading.value = true;
  tracksError.value = false;
  try {
    const response = await tracksApi.getTracksList({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      title: searchQuery.value, // 传入搜索词
    });
    console.log("fetchTracks with query:", response);
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

// 处理 SearchBar 发出的搜索事件
const handleSearch = (query: string) => {
  searchQuery.value = query;
  currentPage.value = 1; // 每次新搜索都回到第一页
  // 更新路由，以便用户刷新页面时保留搜索结果
  router.push({ path: "/search", query: { q: query } });
  fetchTracks();
};

// 处理分页
const handlePageChange = (newPage: number) => {
  currentPage.value = newPage;
  fetchTracks();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// 处理 MusicCard 和 MusicGridCard 的点击事件
const handleTrackCardClick = (track: Tracks) => {
  musicPlayerStore.setPlaylist(tracks.value, track);
};

// 页面挂载时，从路由参数中获取搜索词并执行搜索
onMounted(() => {
  fetchTracks();
});
</script>

<style scoped>
/* 容器和布局 */
.page-container {
  background-color: #0d0d1a;
  color: #fff;
  padding-top: 150px; /* 为固定定位的 Header 和 SearchBar 留出空间 */
  padding-bottom: 100px;
}

.header-and-search-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: #0d0d1a;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.search-bar-container {
  width: 100%;
  margin: 0 auto;
  padding-top: 80px;
  background-color: transparent;
}

.main-content-container {
  max-width: 1800px;
  padding-top: 40px;
  margin: 0 auto;
}

/* 提示文字样式 */
.prompt-section {
  background-color: #262529;
  padding: 15px 0;
  border-bottom: 1px solid #333;
}

/* ⭐ 修改：使提示部分成为 flex 容器以并排对齐文本和视图切换 */
.prompt-flex-wrapper {
  display: flex;
  justify-content: space-between; /* 文本和按钮组两端对齐 */
  align-items: center; /* 垂直居中 */
  flex-wrap: wrap; /* 小屏幕时允许换行 */
  gap: 15px; /* 间距 */
}

.prompt-text {
  color: #ccc;
  font-size: 1em;
  font-style: italic;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  margin-left: 140px;
}

.prompt-emoji {
  font-size: 1.2em;
}

.no-results-state {
  text-align: center;
  padding: 50px;
  color: #888;
  font-size: 1.2em;
}

/* 移除 .filters-and-sorts-section 及其所有相关样式 */
/* .filters-and-sorts-section {
  background-color: #0d0d1a;
  padding: 20px 0;
  color: #fff;
} */

/* 移除 .header-content-wrapper */
/* .header-content-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
} */

/* ⭐ 调整 view-toggle 的间距，因为现在它直接在 prompt-section 里 */
.view-toggle {
  display: flex;
  border: 1px solid #444;
  border-radius: 5px;
  overflow: hidden;
  /* ⭐ 新增：确保它不会被文本挤压，并可以位于右侧 */
  flex-shrink: 0;
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

/* 移除所有 .sort-dropdown 相关样式 */
/* .sort-dropdown { /* ... */
/* .dropdown-header { /* ... */
/* .current-sort { /* ... */
/* .dropdown-header svg { /* ... */
/* .dropdown-options { /* ... */
/* .dropdown-options li { /* ... */

.music-grid-container {
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.music-list-section,
.music-grid-section {
  background-color: #0d0d1a;
  padding: 20px;
}

.container_2 {
  max-width: 95%;
  margin: 0 auto;
  padding: 0 20px;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 50px;
  font-size: 1.2em;
  color: #ff8c62;
}
</style>
