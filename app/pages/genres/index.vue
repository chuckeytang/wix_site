<template>
  <div class="main-content">
    <div>
      <section class="title-section">
        <div class="container">
          <div class="title-flex-wrapper">
            <h2 class="main-title">Music That Matches Your Genres</h2>
            <p class="description">
              Explore curated royalty-free tracks by genre — from classical to
              electronic.
            </p>
          </div>
        </div>
      </section>
      <section class="card-content">
        <div v-if="loading" class="loading-state">
          <span>Loading genres...</span>
        </div>
        <div v-else-if="error" class="error-state">
          <span>Failed to load genres. Please try again later.</span>
        </div>
        <template v-else>
          <GenresCard
            v-for="genre in genreslist"
            :key="genre.genreId"
            :genreslist="genre"
            @select-card="handleCardClick"
            @play-genre="handlePlayGenre"
          />
        </template>
      </section>
    </div>
    <MusicPlayerPanel />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import GenresCard from "~/components/GenresCard.vue";
import { genresApi } from "~/api";
import type { Genres } from "~/types/genres";
import { useRouter } from "vue-router";
import { useMusicPlayerStore } from "~/stores/musicPlayer";
import type { Tracks } from "~/types/tracks";

const genreslist = ref<Genres[]>([]);
const loading = ref(true);
const error = ref(false);

const router = useRouter();
const musicPlayerStore = useMusicPlayerStore();

const fetchGenres = async () => {
  loading.value = true;
  error.value = false;
  try {
    const response = await genresApi.getGenresList();
    genreslist.value = response.rows;
  } catch (err) {
    console.error("Failed to fetch genres:", err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

const handleCardClick = (genreId: number) => {
  // 使用编程式导航跳转到详情页
  router.push({
    path: `/genres/${genreId}`, // 使用动态路径
  });
};

const handlePlayGenre = async (genreId: number) => {
  try {
    // 1. 获取该流派下的所有音乐
    const response = await genresApi.getGenresMusic(genreId, {
      pageNum: 1,
      pageSize: 100,
    });
    const tracksInGenre = response.rows;

    if (tracksInGenre && tracksInGenre.length > 0) {
      // 2. 随机选择一首音乐
      const randomIndex = Math.floor(Math.random() * tracksInGenre.length);
      const randomTrack = tracksInGenre[randomIndex];

      // 3. 设置播放列表，并开始播放
      musicPlayerStore.setPlaylist(tracksInGenre, randomTrack, genreId);

      // 4. 设置当前播放的曲目，并将流派ID作为sourceId传入
      musicPlayerStore.setTrack(randomTrack!);
    }
  } catch (e) {
    console.error("Failed to play genre:", e);
  }
};

onMounted(() => {
  fetchGenres();
});
</script>

<style scoped>
.container {
  max-width: 80%;
  margin: 0 auto;
  padding: 0 20px;
}

.title-section {
  background-color: #000;
  color: #fff;
  padding: 70px 0;
}

.main-title {
  font-size: 2.5em;
  font-weight: bold;
  margin-bottom: 20px;
}

.card-content {
  background-color: #000;
  display: grid;
  grid-template-columns: repeat(6, 1fr); /* 确保固定为6列 */
  gap: 30px;
  padding: 40px 60px;
  max-width: none;
  margin: 0 auto;
}

.loading-state,
.error-state {
  text-align: center;
  font-size: 1.5em;
  color: #ccc;
  grid-column: 1 / -1;
}
</style>
