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
            @select-card="handleCardClick"
            @play-playlist="handlePlayPlaylist"
          />
        </div>
      </div>
    </section>
    <MusicPlayerPanel />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import PlaylistCard from "~/components/PlaylistCard.vue";
import { playlistsApi } from "~/api";
import type { Playlists } from "~/types/playlists";
import { useRouter } from "vue-router";
import { useMusicPlayerStore } from "~/stores/musicPlayer";
import type { Tracks } from "~/types/tracks";

const playlists = ref<Playlists[]>([]);
const loading = ref(true);
const error = ref(false);

const router = useRouter();
const musicPlayerStore = useMusicPlayerStore();

const fetchPlaylists = async () => {
  loading.value = true;
  error.value = false;
  try {
    const response = await playlistsApi.getPlaylistsList({});
    playlists.value = response.rows;
  } catch (err) {
    console.error("Failed to fetch playlists:", err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

const handleCardClick = (playlistId: number) => {
  router.push({
    path: `/playlists/${playlistId}`,
  });
};

const handlePlayPlaylist = async (playlistId: number) => {
  try {
    const response = await playlistsApi.getPlaylistMusic(playlistId, {
      pageNum: 1,
      pageSize: 100,
    });
    const tracksInPlaylist = response.rows;

    if (tracksInPlaylist && tracksInPlaylist.length > 0) {
      const randomIndex = Math.floor(Math.random() * tracksInPlaylist.length);
      const randomTrack = tracksInPlaylist[randomIndex];

      musicPlayerStore.setPlaylist(tracksInPlaylist, randomTrack, playlistId);
    }
  } catch (e) {
    console.error("Failed to play playlist:", e);
  }
};

onMounted(() => {
  fetchPlaylists();
});
</script>

<style scoped>
/* 样式代码保持不变 */
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
  height: 120px;
}
</style>
