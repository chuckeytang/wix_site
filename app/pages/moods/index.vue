<template>
  <div class="main-content">
    <div>
      <section class="title-section">
        <div class="container">
          <div class="title-flex-wrapper">
            <h2 class="main-title">Music That Matches Your Mood</h2>
            <p class="description">
              From happy to dramatic, find tracks by mood and make your content
              resonate.
            </p>
          </div>
        </div>
      </section>
      <section class="card-content">
        <div v-if="loading" class="loading-state">
          <span>Loading moods...</span>
        </div>
        <div v-else-if="error" class="error-state">
          <span>Failed to load moods. Please try again later.</span>
        </div>
        <template v-else>
          <MoodsCard
            v-for="mood in moodslist"
            :key="mood.moodId"
            :moodlist="mood"
          />
        </template>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import MoodsCard from "~/components/MoodsCard.vue";
import { moodsApi } from "~/api";
import type { Moods } from "~/types/moods";

const moodslist = ref<Moods[]>([]);
const loading = ref(true);
const error = ref(false);

const fetchMoods = async () => {
  loading.value = true;
  error.value = false;
  try {
    const response = await moodsApi.getMoodsList();
    moodslist.value = response.rows;
  } catch (err) {
    console.error("Failed to fetch moods:", err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchMoods();
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
