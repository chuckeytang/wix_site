<template>
  <div class="page-wrapper" :class="{ 'sidebar-open': isSidebarOpen }">
    <aside class="sidebar" :class="{ 'is-open': isSidebarOpen }">
      <div class="sidebar-content">
        <h3 class="sidebar-title">type</h3>
      </div>
    </aside>

    <div class="main-content">
      <div>
        <section class="hero-section"></section>
        <SearchBar />
        <section class="title-section">
          <div class="container">
            <div class="right-aligned-header">
              <a href="/all-playlists" class="view-all-button"
                >View All Playlists</a
              >
            </div>
            <div class="title-flex-wrapper">
              <div class="left-side-content">
                <h2 class="main-title">
                  Create Freely with Royalty-Free & Public Domain Music
                </h2>
                <p class="description">
                  Access a growing library of handpicked tracks from CC0 and
                  public domain sources — no fees, no limits. Search by mood,
                  genre, or BPM, then preview and license instantly for your
                  videos, games, and creative projects. Your perfect soundtrack
                  is just one click away.
                </p>
              </div>
              <div class="right-side-content">
                <PlaylistCard
                  v-for="playlist in playlists"
                  :key="playlist.playlistId"
                  :playlist="playlist"
                />
              </div>
            </div>
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
              <div class="sort-and-view-options">
                <div class="sort-dropdown">
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
        <section class="music-list-section" v-if="currentView === 'list'">
          <div v-if="tracksLoading" class="loading-state">
            Loading tracks...
          </div>
          <div v-else-if="tracksError" class="error-state">
            Failed to load tracks.
          </div>
          <template v-else>
            <MusicCard
              v-for="track in tracks"
              :key="track.trackId"
              :track="track"
            />
          </template>
        </section>
        <section class="music-grid-section" v-else>
          <div v-if="tracksLoading" class="loading-state">
            Loading tracks...
          </div>
          <div v-else-if="tracksError" class="error-state">
            Failed to load tracks.
          </div>
          <template v-else>
            <MusicGridCard
              v-for="track in tracks"
              :key="track.trackId"
              :track="track"
            />
          </template>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import SearchBar from "~/components/SearchBar.vue";
import PlaylistCard from "~/components/PlaylistCard.vue";
import MusicCard from "~/components/MusicCard.vue";
import MusicGridCard from "~/components/MusicGridCard.vue";

// 导入 API 和类型
import { tracksApi, playlistsApi } from "~/api";
import type { Tracks } from "~/types/tracks";
import type { Playlists } from "~/types/playlists";

// 状态
const isSidebarOpen = ref<boolean>(false);
const isDropdownOpen = ref<boolean>(false);
const currentView = ref<string>("list");

const sortOptions = [
  { value: "popular", label: "popular" },
  { value: "newest", label: "newest" },
  { value: "oldest", label: "oldest" },
];
const currentSort = ref(sortOptions[0]);

// 数据状态
const playlists = ref<Playlists[]>([]);
const playlistsLoading = ref<boolean>(true);
const playlistsError = ref<boolean>(false);

const tracks = ref<Tracks[]>([]);
const tracksLoading = ref<boolean>(true);
const tracksError = ref<boolean>(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const setView = (viewType: string) => {
  currentView.value = viewType;
  console.log("当前视图模式:", currentView.value);
};

const toggleSortDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const selectSortOption = (option: { value: string; label: string }) => {
  currentSort.value = option;
  isDropdownOpen.value = false;
  // TODO: 根据排序选项重新获取音乐列表
};

// 异步数据获取
const fetchPlaylists = async () => {
  playlistsLoading.value = true;
  playlistsError.value = false;
  try {
    const response = await playlistsApi.getPlaylistsList({
      pageNum: 1,
      pageSize: 4,
    }); // 假设只显示4个
    console.log("fetchPlaylists:", response);
    playlists.value = response.rows;
  } catch (e) {
    playlistsError.value = true;
    console.error("Failed to fetch playlists:", e);
  } finally {
    playlistsLoading.value = false;
  }
};

const fetchTracks = async () => {
  tracksLoading.value = true;
  tracksError.value = false;
  try {
    const response = await tracksApi.getTracksList({
      pageNum: 1,
      pageSize: 10,
    }); // 假设默认每页10个
    console.log("fetchTracks:", response);
    tracks.value = response.rows;
  } catch (e) {
    tracksError.value = true;
    console.error("Failed to fetch tracks:", e);
  } finally {
    tracksLoading.value = false;
  }
};

onMounted(() => {
  fetchPlaylists();
  fetchTracks();
});
</script>

<style scoped>
.container {
  max-width: 80%;
  margin: 0 auto;
  padding: 0 20px;
}

.container_2 {
  max-width: 95%;
  margin: 0 auto;
  padding: 0 20px;
}

.title-section {
  background-color: #000;
  color: #fff;
  padding: 50px 0;
}

/* Flexbox 布局，用于实现左右两栏 */
.title-flex-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

/* 左侧内容容器 */
.left-side-content {
  flex: none; /* 占据剩余空间 */
  min-width: 0;
  width: 30%;
}

/* 右侧占位符容器 */
.right-side-content {
  flex-grow: 1; /* 占据剩余所有空间 */
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 两列布局 */
  gap: 20px; /* 卡片之间的间距 */
}

/* 标题和描述文字样式 */
.main-title {
  font-size: 2.5em;
  font-weight: bold;
  margin-bottom: 20px;
}

.description {
  font-size: 1.1em;
  line-height: 1.6;
  color: #ccc;
}

.right-aligned-header {
  display: flex;
  justify-content: flex-end; /* 将子元素推到容器的最右侧 */
  margin-bottom: 20px; /* 在按钮和下面的内容之间添加一些间距 */
}

.view-all-button {
  font-size: 1.1em;
  font-weight: bold;
  color: #ff8c62; /* 按钮文字颜色，与你的主题色保持一致 */
  text-decoration: none; /* 去掉下划线 */
  transition: color 0.3s;
}

.view-all-button:hover {
  color: #e67a54; /* 悬停时颜色变深 */
  text-decoration: underline; /* 悬停时添加下划线，提供视觉反馈 */
}

.filters-and-sorts-section {
  background-color: #0d0d1a;
  padding: 20px 0; /* 根据需要调整上下内边距 */
  color: #fff;
}

.header-content-wrapper {
  display: flex;
  justify-content: space-between; /* 将子元素分散对齐，一个在最左，一个在最右 */
  align-items: center; /* 垂直居中对齐 */
}

/* 筛选按钮的样式 */
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

/* 页面最外层容器 */
.page-wrapper {
  display: flex;
  transition: transform 0.3s ease-in-out;
  overflow: hidden;
}

/* 侧边栏基础样式 */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 300px; /* 侧边栏宽度 */
  height: 100%;
  background-color: #1a1a1a;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
  z-index: 1000;
}

/* 侧边栏打开时的样式 */
.sidebar.is-open {
  transform: translateX(0);
}

/* 主内容区 */
.main-content {
  flex-grow: 1;
  transition: transform 0.3s ease-in-out;
}

/* 当侧边栏打开时，主内容区向右平移 */
.page-wrapper.sidebar-open .main-content {
  transform: translateX(300px); /* 移动与侧边栏宽度相同的距离 */
}

/* 右侧的排序和视图切换容器 */
.sort-and-view-options {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* 视图切换器容器 */
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

/* 排序下拉框容器 */
.sort-dropdown {
  position: relative;
}

/* 下拉菜单头部样式 */
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
  user-select: none; /* 防止文本被选中 */
}

.dropdown-header:hover {
  background-color: #555;
}

/* 排序标签和当前选项的样式 */
.sort-label {
  color: #999;
}

.current-sort {
  font-weight: bold;
}

/* 下拉箭头 SVG 的样式 */
.dropdown-header svg {
  color: #fff;
  transition: transform 0.3s;
}

/* 下拉菜单打开时，箭头旋转 */
.sort-dropdown.is-open .dropdown-header svg {
  transform: rotate(180deg);
}

/* 下拉菜单选项列表的样式 */
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
  z-index: 50; /* 确保它在其他内容之上 */
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

.music-grid-container {
  max-width: 1800px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 10px;
}

.music-list-section,
.music-grid-section {
  background-color: #0d0d1a;
  padding: 20px 0;
}
</style>
