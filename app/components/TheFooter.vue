<template>
  <footer class="main-footer">
    <div class="container">
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
      <div class="footer-bottom">
        <div class="copyright">
          <img src="/images/logo.png" alt="Verscape Logo" class="footer-logo"/>
          <span>© 2023 VERSCAPE TECHNOLOGY LTD. All rights reserved.</span>
        </div>
        <div class="contact-info">
          <span>Contact Us: <a href="mailto:info@verscapetech.com">info@verscapetech.com</a></span>
        </div>
        <div class="social-links">
          <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
          <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
          <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
          <a href="#" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// No script logic needed for this component
</script>

<style scoped>
.main-footer {
  background-color: #0d0d1a; /* Dark background color from the image */
  color: #ccc;
  padding: 50px 20px;
}

.container {
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
  margin-bottom: 20px;
}

.footer-column {
  flex: 1;
  min-width: 150px;
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

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 0.9em;
}

.copyright {
  display: flex;
  align-items: center;
  gap: 10px;
}

.footer-logo {
  height: 25px; /* Adjust logo size */
}

.contact-info a {
  color: #ccc;
  text-decoration: none;
}

.social-links {
  display: flex;
  gap: 15px;
}

.social-links a {
  color: #ccc;
  font-size: 1.2em;
}
</style>