<template>
  <div class="playlists-page-container">
    <section class="top-spacer"></section>
    <section class="playlists-section">
      <div class="container">
        <h2 class="main-title">All Playlists</h2>
        <p class="description">
          Browse our full collection of curated music playlists.
        </p>
        <div v-if="loading" class="loading-state">
          <span>Loading playlists...</span>
        </div>
        <div v-else-if="error" class="error-state">
          <span>Failed to load playlists. Please try again later.</span>
        </div>
        <div v-else class="playlist-grid">
          <PlaylistCard
            v-for="playlist in playlists"
            :key="playlist.playlistId"
            :playlist="playlist"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import PlaylistCard from "~/components/PlaylistCard.vue";
import { playlistsApi } from "~/api";
import type { Playlists } from "~/types/playlists";

const playlists = ref<Playlists[]>([]);
const loading = ref(true);
const error = ref(false);

const fetchPlaylists = async () => {
  loading.value = true;
  error.value = false;
  try {
    // 请求所有播放列表，若后端分页，这里可能需要调整 pageSize
    const response = await playlistsApi.getPlaylistsList({});
    playlists.value = response.rows;
  } catch (err) {
    console.error("Failed to fetch playlists:", err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchPlaylists();
});
</script>

<style scoped>
.playlists-page-container {
  background-color: #000;
  color: #fff;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  padding: 70px 20px 30px;
}

.main-title {
  font-size: 3rem;
  font-weight: bold;
  margin: 0 0 10px;
}

.description {
  font-size: 1.2rem;
  color: #ccc;
  margin: 0;
}

.playlists-section {
  padding: 0 20px 80px;
}

.container {
  max-width: 1300px;
  margin: 0 auto;
}

.playlist-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .playlist-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .playlist-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  .page-header {
    padding-top: 50px;
  }
}

@media (max-width: 480px) {
  .playlist-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .main-title {
    font-size: 2rem;
  }
  .description {
    font-size: 1rem;
  }
}

.top-spacer {
  /* 设置一个固定高度 */
  height: 120px;
  /* 或者设置 padding */
  /* padding-top: 150px; */
}
</style>
