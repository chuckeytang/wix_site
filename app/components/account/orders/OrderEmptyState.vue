<template>
    <div class="empty-state">
        <h2 class="empty-title">not orders</h2>
        <p class="empty-text">Browse our extensive selection of royalty-free music</p>
        <NuxtLink to="/music" class="browse-button">
            Browse music
        </NuxtLink>
        <div class="help-link">
            Have questions about your order?
            <NuxtLink to="/contact" class="contact-link">chat with us</NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
const goToStore = () => {
  // 在这里使用 Nuxt 的导航功能
  console.log('导航至音乐浏览页面...'); 
  // 例如：navigateTo('/music')
};
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 100px 20px;
}

.empty-title {
  font-size: 2rem;
  font-weight: 500;
  margin-bottom: 10px;
  color: #f0f0f0;
}

.empty-text {
  color: #aaa;
  margin-bottom: 30px;
}

.browse-button {
  padding: 12px 30px;
  background-color: #ff8c62; 
  color: #333;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
}

.browse-button:hover {
  background-color: #ff8c62dc;
}

.help-link {
  margin-top: 50px;
  color: #aaa;
}

.contact-link {
  color: #ff8c62;
  text-decoration: none;
  margin-left: 5px;
}
</style>