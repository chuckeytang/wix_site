<template>
  <div class="purchased-page-bg">
    <div class="purchased-page">
      <AccountSubNav />

      <header class="purchased-header">
        <h1 class="page-title">Purchased Library</h1>
        <p class="subtitle">
          View and download all tracks and sound effects you have purchased.
        </p>
      </header>

      <section class="tab-section">
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'track' }"
          @click="activeTab = 'track'"
        >
          Tracks ({{ purchasedTracks.length }})
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'sfx' }"
          @click="activeTab = 'sfx'"
        >
          SFX ({{ purchasedSfx.length }})
        </button>
      </section>

      <div v-if="loading" class="state-card">Loading purchased items...</div>
      <div v-else-if="errorMessage" class="state-card error">{{ errorMessage }}</div>

      <template v-else>
        <section v-if="activeTab === 'track'" class="list-section">
          <div v-if="purchasedTracks.length === 0" class="state-card">
            You haven't purchased any tracks yet.
          </div>
          <MusicCard
            v-else
            v-for="track in purchasedTracks"
            :key="track.trackId"
            :track="track"
          />
        </section>

        <section v-else class="list-section">
          <div v-if="purchasedSfx.length === 0" class="state-card">
            You haven't purchased any sound effects yet.
          </div>
          <SfxCard
            v-else
            v-for="item in purchasedSfx"
            :key="item.sfxId"
            :sfx="item"
          />
        </section>
      </template>
    </div>
    <MusicPlayerPanel />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { usersApi } from "~/api/users";
import type { Tracks } from "~/types/tracks";
import type { Sfx } from "~/types/sfx";
import AccountSubNav from "~/components/AccountSubNav.vue";
import MusicCard from "~/components/MusicCard.vue";
import SfxCard from "~/components/SfxCard.vue";
import MusicPlayerPanel from "~/components/MusicPlayerPanel.vue";

definePageMeta({
  middleware: "auth",
});

const activeTab = ref<"track" | "sfx">("track");
const loading = ref(true);
const errorMessage = ref<string | null>(null);
const purchasedTracks = ref<Tracks[]>([]);
const purchasedSfx = ref<Sfx[]>([]);

const fetchPurchasedMedia = async () => {
  loading.value = true;
  errorMessage.value = null;
  try {
    const res = await usersApi.getMyPurchases();
    if (res.code !== 200 || !res.data) {
      throw new Error(res.msg || "Failed to load purchased items.");
    }

    purchasedTracks.value = (res.data.tracks || []).map((item) => ({
      ...item,
      hasLicense: true,
    }));
    purchasedSfx.value = (res.data.sfx || []).map((item) => ({
      ...item,
      hasLicense: true,
    }));
  } catch (error: any) {
    errorMessage.value = error.message || "Failed to load purchased items.";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchPurchasedMedia();
});
</script>

<style scoped>
.purchased-page-bg {
  width: 100%;
  background-color: #12121e;
  min-height: 100vh;
}

.purchased-page {
  padding-top: 80px;
  padding-bottom: 120px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #12121e;
  padding-left: 20px;
  padding-right: 20px;
}

.purchased-header {
  margin-bottom: 20px;
}

.page-title {
  margin: 0;
  font-size: 2.2rem;
  color: #ff8c62;
}

.subtitle {
  margin: 8px 0 0 0;
  color: #a8a8bb;
  font-size: 0.95rem;
}

.tab-section {
  display: flex;
  gap: 10px;
  margin-bottom: 18px;
}

.tab-btn {
  border: 1px solid #343446;
  background: #181825;
  color: #ddd;
  border-radius: 999px;
  padding: 8px 14px;
  cursor: pointer;
}

.tab-btn.active {
  border-color: #ff8c62;
  color: #ff8c62;
}

.list-section {
  display: grid;
  gap: 14px;
}

.state-card {
  border: 1px solid #2a2a3a;
  background: #171723;
  color: #b8b8cc;
  border-radius: 10px;
  padding: 18px;
}

.state-card.error {
  border-color: #5a2e2e;
  color: #ff9f9f;
}
</style>
