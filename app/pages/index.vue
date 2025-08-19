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
        <div class="playlist-grid">
          <PlaylistCard
            v-for="playlist in limitedPlaylists"
            :key="playlist.ID"
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

<script setup>
import { ref, computed, onMounted } from "vue";
import PlaylistCard from "~/components/PlaylistCard.vue"; // 导入新组件

// 使用你提供的数据作为模拟数据
const playlists = [
  {
    Title: "Dynamic Beats",
    Description: "High-energy songs to get you moving.",
    Image:
      "https://static.wixstatic.com/media/49d671_1f25c1d366fe4f5085fcbcc5d3170990~mv2.png",
    ID: "62fa014c-4731-4033-82e4-4bed757eddf5",
    Tracks_playlists: "15",
  },
  {
    Title: "Trending Now",
    Description: "The sounds that are currently shaping the music world.",
    Image:
      "https://static.wixstatic.com/media/49d671_b6178c0bc4ae46ea84b96db29ea99328~mv2.png",
    ID: "6c9e4e34-4c74-4805-81ea-4cafcec4539b",
    Tracks_playlists: "15",
  },
  {
    Title: "Deep Cuts",
    Description: "Forgotten gems and hidden finds from the archives.",
    Image:
      "https://static.wixstatic.com/media/49d671_d4d2a5131128447197f3a0d735fc9a30~mv2.png",
    ID: "9d5bab62-dc02-41f6-894c-a3c8b047d0a1",
    Tracks_playlists: "15",
  },
  {
    Title: "Weekly Top 50",
    Description: "The most popular tracks, curated by our editors.",
    Image:
      "https://static.wixstatic.com/media/49d671_af26ba40aff54a0bb135b03bcb883c1f~mv2.png",
    ID: "b1634484-83ca-44b5-8ef1-b6b15bcdfc95",
    Tracks_playlists: "50",
  },
  {
    Title: "Viral Anthems",
    Description: "Catchy songs from internet ads and memes.",
    Image:
      "https://static.wixstatic.com/media/49d671_86f6547da50f4198914264ba474d8899~mv2.png",
    ID: "c953d058-e010-46cf-912d-e139a6298229",
    Tracks_playlists: "15",
  },
  {
    Title: "Summer Breeze",
    Description: "Laid-back tunes for those perfect long summer days.",
    Image:
      "https://static.wixstatic.com/media/49d671_98f950ea3c684a84bfceb2d29d44941f~mv2.png",
    ID: "cd86c202-17dc-413e-84eb-0df735a5a507",
    Tracks_playlists: "15",
  },
  {
    Title: "August Spotlight",
    Description: "The freshest new songs for this month. Wonderful!!",
    Image:
      "https://static.wixstatic.com/media/49d671_d077decb4d9e48f88e388c678559f890~mv2.png",
    ID: "f02dd718-021d-4742-b62c-6c38ba07e752",
    Tracks_playlists: "15",
  },
  {
    Title: "July Editorial Picks",
    Description: "The best music handpicked by our team last month.",
    Image:
      "https://static.wixstatic.com/media/49d671_e7d486fd460c4ac186644f4148412e25~mv2.png",
    ID: "fa963306-304b-4334-a8e0-edeedc6c4031",
    Tracks_playlists: "15",
  },
];

// 使用 computed 属性来截取前6个播放列表
const limitedPlaylists = computed(() => {
  return playlists.slice(0, 6);
});

// 处理视频正反向播放的逻辑
const videoElement = ref(null);
let isReversing = false;

// 监听视频结束事件
const handleVideoEnd = (event) => {
  const video = event.target;
  isReversing = !isReversing;
  if (isReversing) {
    video.playbackRate = -0.5; // 设置为负值实现反向播放
    video.currentTime = video.duration; // 跳转到末尾
  } else {
    video.playbackRate = 0.5; // 设置为正值实现正向播放
    video.currentTime = 0; // 跳转到开头
  }
  video.play();
};

// 在组件挂载后获取视频元素并设置初始属性
onMounted(() => {
  const video = document.querySelector(".hero-video");
  if (video) {
    video.playbackRate = 0.5; // 设置初始播放速度
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
  position: relative; /* 必须是 relative 来定位绝对定位的子元素 */
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
