<template>
  <footer class="main-footer">
    <div class="container">
      <div class="footer-bottom">
        <div class="copyright">
          <img src="/images/logo.png" alt="Verscape Logo" class="footer-logo" />
          <span>© 2023 VERSCAPE TECHNOLOGY LTD. All rights reserved.</span>
        </div>
        <div class="contact-info">
          <span
            >Contact Us:
            <a href="mailto:info@verscapetech.com"
              >info@verscapetech.com</a
            ></span
          >
        </div>
        <div class="social-links">
          <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
          <a href="#" aria-label="Facebook"
            ><i class="fab fa-facebook-f"></i
          ></a>
          <a href="#" aria-label="Instagram"
            ><i class="fab fa-instagram"></i
          ></a>
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

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 0.9em;
}
</style>
