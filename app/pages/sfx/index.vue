<template>
  <div class="page-wrapper">
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
import MusicPlayerPanel from "~/components/MusicPlayerPanel.vue"; // 引入 MusicPlayerPanel 组件
import { sfxApi } from "~/api";
import type { Sfx } from "~/types/sfx";

const sfxList = ref<Sfx[]>([]);
const loading = ref(true);
const error = ref(false);

const handleSearch = (query: string) => {
  if (query) {
    // 根据需要调整，比如跳转到通用搜索页
  }
};

const fetchSfx = async () => {
  loading.value = true;
  error.value = false;
  try {
    const response = await sfxApi.getSfxList({});
    sfxList.value = response.rows;
  } catch (err) {
    console.error("Failed to fetch sound effects:", err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchSfx();
});
</script>

<style scoped>
/* 确保样式与 Music/index.vue 保持一致，以复用布局 */
.page-wrapper {
  background-color: #0d0d1a;
  color: #fff;
  padding-bottom: 120px; /* 添加底部内边距以避免内容被播放器遮挡 */
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
