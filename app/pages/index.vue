<template>
  <div class="home-page">
    <section class="hero-section">
      <video
        class="hero-video"
        autoplay
        loop
        muted
        playsinline
        :playbackrate="0.5"
        @ended="handleVideoEnd"
      >
        <source src="/videos/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div class="hero-content">
        <h1>VERSCAPE</h1>
        <h2>Bring Your Story to Life<br />with Sound</h2>
        <p>
          Unlimited access to royalty-free music and SFX for all your creative
          projects. <br />Start with a single track or unlock more with our
          affordable subscription plans.
        </p>
        <div class="hero-actions">
          <span class="browse-text">BROWSE OUR COLLECTION</span>
          <button class="explore-button">Explore Plans</button>
        </div>
      </div>
    </section>

    <section class="playlists-section">
      <div class="container">
        <div v-if="loading" class="loading-message">
          <span>Loading playlists...</span>
        </div>
        <div v-else-if="error" class="error-message">
          <span>Failed to load playlists. Please try again later.</span>
        </div>
        <div v-else class="playlist-grid">
          <PlaylistCard
            v-for="playlist in limitedPlaylists"
            :key="playlist.playlistId"
            :playlist="playlist"
          />
        </div>
      </div>
    </section>

    <section class="menu-section">
      <div class="footer-columns">
        <div class="footer-column">
          <h4>Music Categories</h4>
          <ul>
            <li><NuxtLink to="/music">Music</NuxtLink></li>
            <li><NuxtLink to="/genres">Genres</NuxtLink></li>
            <li><NuxtLink to="/moods">Moods</NuxtLink></li>
            <li><NuxtLink to="/playlists">Playlists</NuxtLink></li>
            <li><NuxtLink to="/sfx">SFX</NuxtLink></li>
          </ul>
        </div>
        <div class="footer-column">
          <h4>Company</h4>
          <ul>
            <li><NuxtLink to="/about">About Us</NuxtLink></li>
            <li><NuxtLink to="/blog">Blog</NuxtLink></li>
            <li><NuxtLink to="/pricing">Pricing</NuxtLink></li>
            <li><NuxtLink to="/terms">Terms of Use</NuxtLink></li>
            <li><NuxtLink to="/privacy">Privacy Policy</NuxtLink></li>
          </ul>
        </div>
        <div class="footer-column">
          <h4>Support</h4>
          <ul>
            <li><NuxtLink to="/faq">FAQ</NuxtLink></li>
            <li><NuxtLink to="/contact">Contact Us</NuxtLink></li>
            <li><NuxtLink to="/submit">Submit Music</NuxtLink></li>
            <li><NuxtLink to="/terms">Terms of Use</NuxtLink></li>
            <li><NuxtLink to="/privacy">Privacy Policy</NuxtLink></li>
          </ul>
        </div>
        <div class="footer-column">
          <h4>Account</h4>
          <ul>
            <li><NuxtLink to="/subscribe">Subscribe</NuxtLink></li>
            <li><NuxtLink to="/my-playlists">My Playlists</NuxtLink></li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import PlaylistCard from "~/components/PlaylistCard.vue";
import { playlistsApi } from "~/api";
import type { Playlists } from "~/types/playlists";

// 播放列表数据状态
const playlists = ref<Playlists[]>([]);
const loading = ref(true);
const error = ref(false);

// 使用 computed 属性来截取前6个播放列表
const limitedPlaylists = computed(() => {
  return playlists.value.slice(0, 6);
});

// 获取播放列表数据
const fetchPlaylists = async () => {
  loading.value = true;
  error.value = false;
  try {
    const response = await playlistsApi.getPlaylistsList({
      pageNum: 1,
      pageSize: 6,
    });
    // 后端返回的数据在 rows 字段中
    playlists.value = response.rows;
  } catch (err) {
    console.error("Failed to fetch playlists:", err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

// 监听视频结束事件
const handleVideoEnd = (event: Event) => {
  const video = event.target as HTMLVideoElement;
  // 此处逻辑可能需要调整，因为 playbackRate 负值并非所有浏览器都支持
  // 更常见的是使用 video.currentTime 和 requestAnimationFrame 实现
  video.playbackRate *= -1;
  if (video.playbackRate < 0) {
    video.currentTime = video.duration;
  } else {
    video.currentTime = 0;
  }
  video.play();
};

// 在组件挂载后获取视频元素并设置初始属性
onMounted(() => {
  fetchPlaylists();
  // 保持原有的视频逻辑
  const video = document.querySelector(".hero-video");
  if (video) {
    (video as HTMLVideoElement).playbackRate = 0.5;
  }
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap");

.home-page {
  font-family: "Open Sans", sans-serif;
  background-color: #0d0d1a;
  color: #fff;
}

.hero-section {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 80px 20px 100px;
  overflow: hidden; /* 防止视频溢出 */
}

/* 视频背景样式 */
.hero-video {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  object-fit: cover; /* 确保视频覆盖整个容器 */
  transform: translate(-50%, -50%); /* 居中 */
}

.hero-content {
  position: relative; /* 确保内容在视频之上 */
  z-index: 1;
  max-width: 800px;
  padding: 40px;
  border-radius: 10px;
}

.hero-content h1 {
  font-size: 6rem;
  font-weight: bold;
  margin-bottom: 30px;
  color: #fff;
}
.hero-content h2 {
  font-size: 3rem;
  font-style: italic;
  font-weight: normal;
  line-height: 1.2;
  margin-bottom: 20px;
  color: #fff;
}
.hero-content p {
  font-size: 1.2rem;
  line-height: 1.5;
  color: #ccc;
  margin-bottom: 40px;
}
.hero-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}
.browse-text {
  font-size: 1.5rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #fff;
}
.explore-button {
  background-color: #ff8c62;
  color: #fff;
  border: none;
  padding: 15px 30px;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.explore-button:hover {
  background-color: #e67a54;
}

.playlists-section {
  padding: 80px 20px;
}
.container {
  max-width: 1400px;
  margin: 0 auto;
}
.playlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 30px;
}

.menu-section {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-columns {
  display: flex;
  justify-content: space-between;
  gap: 30px;
  flex-wrap: wrap;
  border-bottom: 1px solid #333;
  padding-bottom: 30px;
}

.footer-column {
  flex: 1;
  min-width: 100px;
}

.footer-column h4 {
  color: #ff9900;
  font-size: 1.1em;
  margin-bottom: 15px;
}

.footer-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-column li {
  margin-bottom: 10px;
}

.footer-column a {
  color: #ccc;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-column a:hover {
  color: #fff;
}
</style>
