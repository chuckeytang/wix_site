<template>
    <div class = "main-content">
        <div>
            <section class = "title-section">
                <div class = "container">
                    <div class = "title-flex-wrapper">
                            <h2 class = "main-title">Music That Matches Your Mood</h2>
                            <p class = "description">
                                From happy to dramatic, find tracks by mood and make your content resonate.
                            </p>
                    </div>
                </div>
            </section>
            <section class = "card-content">
                <MoodsCard
                v-for="moodlist in moodlist"
                :key="moodlist.mood_id"
                :moodlist="moodlist"
                />
            </section>
        </div>
    </div>
</template>

<script setup>
import MoodsCard from '~/components/MoodsCard.vue';

const moodlist = [
    {
        name: 'Hip Hop',
        cover_image_url: 'https://static.wixstatic.com/media/49d671_2a6be018ead64492b9d0d46647803d6a~mv2.png',
        mood_id: '1',
    },
    {
        name: 'R&B',
        cover_image_url: 'https://static.wixstatic.com/media/49d671_0e3b215cfa984a79bb4fd3bb78e601a0~mv2.png',
        mood_id: '2',
    },
    {
        name: 'Rock',
        cover_image_url: 'https://static.wixstatic.com/media/49d671_75ab88610f684f23affb6cb3ed5afc28~mv2.png',
        mood_id: '3',
    },
    {
        name: 'Electronic',
        cover_image_url: 'https://static.wixstatic.com/media/49d671_ceafb6916c5642dc80aba706fba32dbd~mv2.png',
        mood_id: '4',
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