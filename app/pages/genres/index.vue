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
          />
        </template>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import GenresCard from "~/components/GenresCard.vue";
import { genresApi } from "~/api";
import type { Genres } from "~/types/genres";

const genreslist = ref<Genres[]>([]);
const loading = ref(true);
const error = ref(false);

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
  background-color: #1a1a1a; /* 设置整个卡片区域的深色背景 */
  display: grid;
  grid-template-columns: repeat(6, 1fr); /* 确保固定为6列 */
  gap: 30px;
  padding: 80px 20px;
  max-width: none;
  margin: 0 auto;
}
</style>
