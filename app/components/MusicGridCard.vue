<template>
    <div class = "music-grid-card">
        <div class = "card-header">
            <h3 class = "track-title">{{ track.title }}</h3>
            <p class = "track-artist">{{ track.artist }}</p>
        </div>

        <div class = "player-section">
            <button class = "play-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
            </button>
            <div class = "waveform-container">
                <img v-if="track.waveformUrl" :src="track.waveformUrl" alt="Waveform" class="waveform-image" />
                <div v-else class="placeholder-text">Waveform</div>
            </div>
        </div>

        <div class = "card-footer">
            <button class = "action-btn icon-heart">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
            </button>
            <button class = "action-btn icon-more">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <circle cx="12" cy="12" r="2"></circle>
                    <circle cx="19" cy="12" r="2"></circle>
                    <circle cx="5" cy="12" r="2"></circle>
                </svg>
            </button>
            <button class = "download-button">download</button>
        </div>
    </div>
</template>

<script setup>
import {defineProps} from 'vue';

const props = defineProps({
    track: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.music-grid-card {
  background-color: #0d0d1a;
  border: 1px solid #444;
  border-radius: 12px;
  padding: 20px;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 15px; /* 控制各区域之间的垂直间距 */
  transition: border-color 0.3s, box-shadow 0.3s;
}

.music-grid-card:hover {
    border-color: #ffc93c; /* 示例高亮颜色 */
    box-shadow: 0 0 15px rgba(255, 201, 60, 0.2);
}

.card-header {
  text-align: left;
}

.track-title {
  font-size: 1.5em;
  font-weight: bold;
  color: #ffc93c; /* 示例高亮颜色 */
  margin: 0 0 5px 0;
}

.track-artist {
  font-size: 1em;
  color: #aaa;
  margin: 0;
}

.player-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.play-button {
  background-color: transparent;
  border: 1px solid #fff;
  color: #fff;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
  flex-shrink: 0;
}

.play-button:hover {
  background-color: #ffc93c;
  border-color: #ffc93c;
  color: #0d0d1a;
}

.waveform-container {
  flex-grow: 1;
  height: 50px;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.waveform-image {
  width: 100%;
  height: 100%;
  object-fit: contain; /* 保持波形图比例 */
  filter: invert(1); /* 将黑色波形图反色为白色 */
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 10px;
}

.action-btn {
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  padding: 5px;
  transition: color 0.3s;
}

.action-btn:hover {
  color: #fff;
}

.download-button {
  background-color: transparent;
  border: 1px solid #aaa;
  color: #fff;
  font-weight: bold;
  padding: 8px 20px;
  border-radius: 50px;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
  margin-left: auto; /* 让下载按钮自动推到最右边 */
}

.download-button:hover {
  background-color: #fff;
  border-color: #fff;
  color: #0d0d1a;
}
</style>