<template>
    <div class="playlists-page-container">
      <section class="top-spacer"></section>
      <section class="playlists-section">
        <div class="container">
          <div class="playlist-grid">
            <PlaylistCard
              v-for="playlist in playlists"
              :key="playlist.ID"
              :playlist="playlist"
            />
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script setup>
  import PlaylistCard from "~/components/PlaylistCard.vue";
  
  // 使用您提供的数据
  const playlists = [
    {
      Title: "Dynamic Beats",
      Description: "High-energy songs to get you moving.",
      Image: "https://static.wixstatic.com/media/49d671_1f25c1d366fe4f5085fcbcc5d3170990~mv2.png",
      ID: "62fa014c-4731-4033-82e4-4bed757eddf5",
      Tracks_playlists: "15",
    },
    {
      Title: "Trending Now",
      Description: "The sounds that are currently shaping the music world.",
      Image: "https://static.wixstatic.com/media/49d671_b6178c0bc4ae46ea84b96db29ea99328~mv2.png",
      ID: "6c9e4e34-4c74-4805-81ea-4cafcec4539b",
      Tracks_playlists: "15",
    },
    {
      Title: "Deep Cuts",
      Description: "Forgotten gems and hidden finds from the archives.",
      Image: "https://static.wixstatic.com/media/49d671_d4d2a5131128447197f3a0d735fc9a30~mv2.png",
      ID: "9d5bab62-dc02-41f6-894c-a3c8b047d0a1",
      Tracks_playlists: "15",
    },
    {
      Title: "Weekly Top 50",
      Description: "The most popular tracks, curated by our editors.",
      Image: "https://static.wixstatic.com/media/49d671_af26ba40aff54a0bb135b03bcb883c1f~mv2.png",
      ID: "b1634484-83ca-44b5-8ef1-b6b15bcdfc95",
      Tracks_playlists: "50",
    },
    {
      Title: "Viral Anthems",
      Description: "Catchy songs from internet ads and memes.",
      Image: "https://static.wixstatic.com/media/49d671_86f6547da50f4198914264ba474d8899~mv2.png",
      ID: "c953d058-e010-46cf-912d-e139a6298229",
      Tracks_playlists: "15",
    },
    {
      Title: "Summer Breeze",
      Description: "Laid-back tunes for those perfect long summer days.",
      Image: "https://static.wixstatic.com/media/49d671_98f950ea3c684a84bfceb2d29d44941f~mv2.png",
      ID: "cd86c202-17dc-413e-84eb-0df735a5a507",
      Tracks_playlists: "15",
    },
    {
      Title: "August Spotlight",
      Description: "The freshest new songs for this month. Wonderful!!",
      Image: "https://static.wixstatic.com/media/49d671_d077decb4d9e48f88e388c678559f890~mv2.png",
      ID: "f02dd718-021d-4742-b62c-6c38ba07e752",
      Tracks_playlists: "15",
    },
    {
      Title: "July Editorial Picks",
      Description: "The best music handpicked by our team last month.",
      Image: "https://static.wixstatic.com/media/49d671_e7d486fd460c4ac186644f4148412e25~mv2.png",
      ID: "fa963306-304b-4334-a8e0-edeedc6c4031",
      Tracks_playlists: "15",
    },
  ];
  </script>
  
  <style scoped>
  .playlists-page-container {
    background-color: #000;
    color: #fff;
    min-height: 100vh;
  }
  
  .page-header {
    text-align: center;
    padding: 70px 20px 30px;
  }
  
  .main-title {
    font-size: 3rem;
    font-weight: bold;
    margin: 0 0 10px;
  }
  
  .description {
    font-size: 1.2rem;
    color: #ccc;
    margin: 0;
  }
  
  .playlists-section {
    padding: 0 20px 80px;
  }
  
  .container {
    max-width: 1300px;
    margin: 0 auto;
  }
  
  .playlist-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
  
  /* 响应式设计 */
  @media (max-width: 1200px) {
    .playlist-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  
  @media (max-width: 768px) {
    .playlist-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }
    .page-header {
      padding-top: 50px;
    }
  }
  
  @media (max-width: 480px) {
    .playlist-grid {
      grid-template-columns: 1fr;
      gap: 10px;
    }
    .main-title {
      font-size: 2rem;
    }
    .description {
      font-size: 1rem;
    }
  }

  .top-spacer {
  /* 设置一个固定高度 */
  height: 120px; 
  /* 或者设置 padding */
  /* padding-top: 150px; */
  }
  </style>