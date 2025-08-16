<template>
  <header class="main-header">
    <div class="container">
      <div class="logo">
        <img src="/images/logo.png" alt="Verscape Logo" />
      </div>
      <nav class="main-nav">
        <ul>
          <li><NuxtLink to="/">HOME</NuxtLink></li>
          <li><NuxtLink to="/music">MUSIC</NuxtLink></li>
          <li><NuxtLink to="/genres">GENRES</NuxtLink></li>
          <li><NuxtLink to="/moods">MOODS</NuxtLink></li>
          <li><NuxtLink to="/playlists">PLAYLISTS</NuxtLink></li>
          <li><NuxtLink to="/checkout">CHECKOUT</NuxtLink></li>
        </ul>
      </nav>
      <div class="user-actions">
        <button @click="handleLogin">Login</button>
        <button @click="handleCart">
          <span class="cart-icon">🛒</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
const handleLogin = () => {
  // Redirect to Wix login URL
  console.log('Redirecting to Wix login...');
};

const handleCart = () => {
  // Redirect to Wix cart/checkout page
  console.log('Redirecting to Wix cart...');
};
</script>

<style scoped>
.main-header {
  background-color: #1a1a1a;
  color: #fff;
  padding: 15px 0;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.logo img {
  height: 40px; /* Adjust logo size */
}

.main-nav ul {
  list-style: none;
  display: flex;
  gap: 30px;
  margin: 0;
  padding: 0;
}

.main-nav a {
  color: #fff;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s;
}

.main-nav a:hover {
  color: #ff9900; /* Example hover color */
}

.user-actions {
  display: flex;
  gap: 15px;
}

.user-actions button {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.cart-icon {
  font-size: 24px;
}
</style>