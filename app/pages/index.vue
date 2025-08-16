<template>
  <div class="home-page">
    <section class="hero-section">
      <div class="hero-content">
        <h1>VERSCAPE</h1>
        <h2>Bring Your Story to Life<br>with Sound</h2>
        <p>Unlimited access to royalty-free music and SFX for all your creative projects. <br>Start with a single track or unlock more with our affordable subscription plans.</p>
        <div class="hero-actions">
          <span class="browse-text">BROWSE OUR COLLECTION</span>
          <button class="explore-button">Explore Plans</button>
        </div>
      </div>
    </section>
    
    <section class="playlists-section">
      <div class="container">
        <div class="playlist-grid">
          <div v-for="playlist in playlists" :key="playlist.id" class="playlist-card">
            <div class="card-overlay">
              <span class="track-count">{{ playlist.tracks }} Tracks</span>
            </div>
            <img :src="playlist.image" :alt="playlist.title" class="card-image">
            <div class="card-content">
              <h3>{{ playlist.title }}</h3>
              <p>{{ playlist.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// 模拟数据
const playlists = [
  {
    id: 1,
    tracks: 15,
    title: 'Dynamic Beats',
    description: 'High-energy songs to get you moving.',
    image: '/images/dynamic-beats.jpg'
  },
  {
    id: 2,
    tracks: 15,
    title: 'July Editorial Picks',
    description: 'The best music handpicked by our team last month.',
    image: '/images/editorial-picks.jpg'
  },
  {
    id: 3,
    tracks: 15,
    title: 'Viral Anthems',
    description: 'Catchy songs from internet ads and memes.',
    image: '/images/viral-anthems.jpg'
  },
  {
    id: 4,
    tracks: 15,
    title: 'Deep Cuts',
    description: 'Forgotten gems and hidden finds from the archives.',
    image: '/images/deep-cuts.jpg'
  },
  {
    id: 5,
    tracks: 15,
    title: 'Summer Breeze',
    description: 'Laid-back tunes for those perfect long summer days.',
    image: '/images/summer-breeze.jpg'
  },
  {
    id: 6,
    tracks: 15,
    title: 'Trending Now',
    description: 'The sounds that are currently shaping the music world.',
    image: '/images/trending-now.jpg'
  }
];
</script>

<style scoped>
.home-page {
  background-color: #0d0d1a;
  color: #fff;
}

.hero-section {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 150px 20px 100px;
  background-image: url('/images/hero-bg.jpg'); /* 你需要一个背景图 */
  background-size: cover;
  background-position: center;
  position: relative;
  /* 添加一个半透明的深色遮罩来改善文本可读性 */
  z-index: 1;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: -1;
}

.hero-content {
  max-width: 800px;
}

.hero-content h1 {
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 10px;
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
  max-width: 1200px;
  margin: 0 auto;
}

.playlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.playlist-card {
  position: relative;
  background-color: #1a1a1a;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.playlist-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.card-image {
  width: 100%;
  height: 200px; /* 根据需要调整 */
  object-fit: cover;
  display: block;
}

.card-overlay {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.8rem;
}

.card-content {
  padding: 20px;
}

.card-content h3 {
  font-size: 1.2rem;
  margin-bottom: 5px;
  font-weight: bold;
}

.card-content p {
  font-size: 0.9rem;
  color: #ccc;
  margin: 0;
}
</style>