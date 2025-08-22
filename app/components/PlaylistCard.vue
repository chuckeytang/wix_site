<template>
  <div class="playlist-card">
    <img :src="playlist.imageUrl" :alt="playlist.title" class="card-image" />

    <div class="card-content-overlay">
      <div class="track-info">
        <span class="music-icon">🎧</span>
        <span class="track-count">? Tracks</span>
      </div>

      <h3 class="playlist-title">{{ playlist.title }}</h3>

      <p class="playlist-description">{{ playlist.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import type { Playlists } from "~/types/playlists"; // Import the new Playlist type

// Define the component props using the correct type
defineProps({
  playlist: {
    type: Object as () => Playlists, // Use a type assertion for type-safety
    required: true,
  },
});
</script>

<style scoped>
/* Keep existing styles */
.playlist-card {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  cursor: pointer;
}
.playlist-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}
.card-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
  display: block;
}
.card-content-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0) 100%
  );
}
.track-info {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.1rem;
  color: #fff;
  margin-bottom: 10px;
}
.music-icon {
  font-size: 1.5rem;
}
.track-count {
  font-weight: 700;
}
.playlist-title {
  font-size: 2rem;
  font-weight: bold;
  margin: 0 0 10px 0;
  line-height: 1.2;
}
.playlist-description {
  font-size: 1rem;
  color: #ccc;
  margin: 0;
  line-height: 1.4;
}
</style>
