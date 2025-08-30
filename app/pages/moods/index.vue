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
            @select-card="handleCardClick"
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
import { useRouter } from "vue-router";

const moodslist = ref<Moods[]>([]);
const loading = ref(true);
const error = ref(false);

const router = useRouter();

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

const handleCardClick = (moodId: number) => {
  console.log('Card clicked with ID:', moodId); // 可选：调试信息
  // 使用编程式导航跳转到详情页
  router.push({
    path: `/moods/${moodId}`, // 使用动态路径
  });
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
  background-color: #000;
  display: grid;
  grid-template-columns: repeat(6, 1fr); /* 确保固定为6列 */
  gap: 30px;
  padding: 40px 60px;
  max-width: none;
  margin: 0 auto;
}
</style>
