<template>
    <div class = "main-content">
        <div>
            <section class = "title-section">
                <div class = "container">
                    <div class = "title-flex-wrapper">
                            <h2 class = "main-title">Music That Matches Your Genres</h2>
                            <p class = "description">
                                Explore curated royalty-free tracks by genre — from classical to electronic.
                            </p>
                    </div>
                </div>
            </section>
            <section class = "card-content">
                <GenresCard
                v-for="genreslist in genreslist"
                :key="genreslist.genre_id"
                :genreslist="genreslist"
                />
            </section>
        </div>
    </div>
</template>

<script setup>
import GenresCard from '~/components/GenresCard.vue';

const genreslist = [
    {
        name: 'Hip Hop',
        cover_image_url: 'https://static.wixstatic.com/media/49d671_a0e8fa6e1ab546788b4a5961314feaae~mv2.png',
        genre_id: '1',
    },
    {
        name: 'R&B',
        cover_image_url: 'https://static.wixstatic.com/media/49d671_16dff356031242098f7bdb77b7837568~mv2.png',
        genre_id: '2',
    },
    {
        name: 'Rock',
        cover_image_url: 'https://static.wixstatic.com/media/49d671_719976ef717645c5a305edfc57adcca5~mv2.png',
        genre_id: '3',
    },
    {
        name: 'Electronic',
        cover_image_url: 'https://static.wixstatic.com/media/49d671_01cbf4e858a44d07b36bde1240b8003a~mv2.png',
        genre_id: '4',
    },
];
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