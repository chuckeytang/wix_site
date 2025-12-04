<template>
  <div class="page-wrapper" :class="{ 'sidebar-open': isSidebarOpen }">
    <aside class="sidebar" :class="{ 'is-open': isSidebarOpen }">
      <div class="sidebar-content">
        <Sidebar :config="filterConfig" @update:filters="handleFilterChange" />
      </div>
    </aside>
    <div class="main-content">
      <div class="search-bar-container">
        <SearchBar @search="handleSearch" />
      </div>
      <section class="title-section">
        <div class="container">
          <h2 class="main-title">All Sound Effects</h2>
          <p class="description">
            Browse our full collection of sound effects.
          </p>
        </div>
      </section>

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
          </div>
        </div>
      </section>

      <section class="sfx-list-section">
        <div v-if="loading" class="loading-state">
          <span>Loading sound effects...</span>
        </div>
        <div v-else-if="error" class="error-state">
          <span>Failed to load sound effects. Please try again later.</span>
        </div>
        <div v-else>
          <SfxCard v-for="sfx in sfxList" :key="sfx.sfxId" :sfx="sfx" />
        </div>
      </section>
    </div>
    <MusicPlayerPanel />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import SfxCard from "~/components/SfxCard.vue";
import SearchBar from "~/components/SearchBar.vue";
import MusicPlayerPanel from "~/components/MusicPlayerPanel.vue";
import Sidebar from "~/components/Sidebar.vue";
import { sfxApi } from "~/api";
import type { Sfx } from "~/types/sfx";
import { debounce } from "lodash-es";

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
// SFX 的筛选状态，不需要 BPM
type FiltersState = {
  genres: string[];
  moods: string[];
  durationRange: [number, number];
  author: string[];
};

const sfxList = ref<Sfx[]>([]);
const loading = ref(true);
const error = ref(false);
const searchQuery = ref("");
const isSidebarOpen = ref<boolean>(false);

const filterConfig = ref<FilterItem[]>([]);
const filters = reactive<FiltersState>({
  genres: [],
  moods: [],
  durationRange: [0, 600], // 默认时长范围
  author: [],
});

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const handleSearch = (query: string) => {
  searchQuery.value = query; // 更新关键词
  debouncedFetchSfx(); // 触发搜索
};

const handleFilterChange = (newFilters: FiltersState) => {
  // 处理侧边栏传来的筛选条件
  Object.assign(filters, newFilters);
  debouncedFetchSfx();
};

// 避免频繁请求，使用 debounce
const debouncedFetchSfx = debounce(() => {
  fetchSfx();
}, 300);

const fetchSfx = async () => {
  loading.value = true;
  error.value = false;
  try {
    const queryParams = {
      title: searchQuery.value || undefined, // 搜索
      // 筛选器参数
      genres: filters.genres.length > 0 ? filters.genres.join(",") : undefined,
      moods: filters.moods.length > 0 ? filters.moods.join(",") : undefined,
      author: filters.author.length > 0 ? filters.author.join(",") : undefined,
      minDuration: filters.durationRange[0],
      maxDuration: filters.durationRange[1],
    };

    // 将构建的参数对象传入 API 调用
    const response = await sfxApi.getSfxList(queryParams);

    sfxList.value = response.rows;
  } catch (err) {
    console.error("Failed to fetch sound effects:", err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

const fetchAndSetFilterConfig = async () => {
  try {
    const response = await sfxApi.getFilterOptions(); // 假设 sfxApi 存在此方法
    if (response.code === 200 && response.data) {
      const options = response.data;
      const newConfig: FilterItem[] = [];

      // 构建流派（Genres）配置
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

      // 构建情绪（Moods）配置
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

      // 构建持续时间（Duration）配置 (使用后端返回的 Min/Max，但这里使用默认值)
      const minDuration =
        options.minDuration !== undefined ? options.minDuration : 0;
      const maxDuration =
        options.maxDuration !== undefined ? options.maxDuration : 600;

      newConfig.push({
        id: "durationRange",
        title: "Duration",
        componentType: "RangeSliderFilter",
        props: {
          min: minDuration,
          max: maxDuration,
          unit: "秒",
        },
      });
      filters.durationRange = [minDuration, maxDuration]; // 同步默认值到 filters state

      // 构建音乐家（Author）配置
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
  fetchAndSetFilterConfig();
  fetchSfx();
});
</script>

<style scoped>
/* 确保样式与 Music/index.vue 保持一致，以复用布局 */
.page-wrapper {
  transition: transform 0.3s ease-in-out;
  overflow: hidden;
  background-color: #0d0d1a;
  color: #fff;
  padding-bottom: 120px; /* 底部内边距 */
}

/* 侧边栏基础样式 */
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

/* 侧边栏内容容器，用于内边距 */
.sidebar-content {
  padding: 0 15px;
}

/* 侧边栏打开时的样式 */
.sidebar.is-open {
  transform: translateX(0);
}

/* 主内容区 */
.main-content {
  flex-grow: 1;
  transition: transform 0.3s ease-in-out;
  padding-top: 80px;
}

/* 当侧边栏打开时，主内容区向右平移 */
.page-wrapper.sidebar-open .main-content {
  transform: translateX(300px);
}

/* 标题区样式 */
.title-section {
  padding: 50px 0;
}
.container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 20px;
}
.main-title {
  font-size: 2.5em;
  font-weight: bold;
}
.description {
  font-size: 1.1em;
  color: #ccc;
}

/* 筛选器和排序区 */
.filters-and-sorts-section {
  background-color: #0d0d1a;
  padding: 20px 0;
  color: #fff;
}
.container_2 {
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 20px;
}
.header-content-wrapper {
  display: flex;
  justify-content: flex-start; /* 只保留 filter 按钮 */
  align-items: center;
}

/* 筛选按钮的样式 (从 music/index.vue 复制) */
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

.main-content {
  padding-top: 80px; /* 顶部间距 */
}
.search-bar-container {
  padding-top: 40px;
}

.title-section {
  padding: 50px 0;
}
.container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 20px;
}
.main-title {
  font-size: 2.5em;
  font-weight: bold;
}
.description {
  font-size: 1.1em;
  color: #ccc;
}
.sfx-list-section {
  padding: 20px 0;
  max-width: 1300px;
  margin: 0 auto;
}
</style>
