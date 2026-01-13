<template>
  <div class="price-page-single-column">
    <div class="main-title-container">
      <h1 class="page-main-title">Pay as you go. No commitments.</h1>
    </div>

    <div class="content-wrapper">
      <section class="pricing-info-section">
        <span class="price-value-highlight">$0.01</span>
        <span class="mode-description">per track or sound effect</span>
      </section>

      <section class="benefits-section">
        <ul class="benefits-list">
          <li class="benefit-item">
            <span class="check-icon">✓</span>Commercial Use
          </li>
          <li class="benefit-item">
            <span class="check-icon">✓</span>High Quality
          </li>
          <li class="benefit-item">
            <span class="check-icon">✓</span>Instant Download
          </li>
        </ul>
      </section>

      <section class="example-section">
        <p>Want 5 sounds? Total: $9.95 – No subscription needed.</p>
      </section>

      <section class="cta-section">
        <NuxtLink to="/music" class="cta-button music-cta"
          >Browse Tracks</NuxtLink
        >
        <NuxtLink to="/sfx" class="cta-button sfx-cta"
          >Browse Sound Effects</NuxtLink
        >
      </section>

      <section class="disclaimer-section">
        <p class="supplemental-note">
          Need multiple items? Add them to cart and pay once.
        </p>
        <p class="legal-note">Once paid, the license is valid for life.</p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { NuxtLink } from "#components";
</script>

<style scoped>
.price-page-single-column {
  background-color: #0d0d1a; /* 对标的深色背景 */
  color: #fff;
  font-family: "Open Sans", sans-serif; /* 对标的字体 */

  /* 解决 Header 遮挡和底部留白问题 */
  padding-top: 80px;
  min-height: 100vh;
  padding-bottom: 200px;
}

/* 2. 标题和容器样式 */
.main-title-container {
  padding: 100px 0;
  width: 100%;
  background-color: #0d0d1a;
}
.page-main-title {
  font-size: 3rem;
  color: #fff;
  text-align: center;
  font-weight: 700; /* 匹配对标的粗体 */
  margin: 0;
}

/* 内容区域容器 */
.content-wrapper {
  max-width: 650px;
  margin: 80px auto; /* 增大与标题的间距 */
  padding: 0 20px;
  text-align: center;
}

/* 3. 价格信息：同行显示的关键 */
.pricing-info-section {
  /* 逻辑技术：Flexbox 确保价格同行 */
  display: flex;
  justify-content: center;
  align-items: baseline; /* 确保价格和描述文本底部对齐 */
  margin-bottom: 40px;
}

.price-value-highlight {
  /* 意义：作为页面的视觉焦点 */
  font-size: 4.5em;
  font-weight: 900; /* 极粗，突出价格 */
  color: #fff;
  margin-right: 15px;
  line-height: 1;
}

.mode-description {
  font-size: 1.8em;
  font-weight: 400; /* 描述文本使用常规字重 */
  color: #ccc;
  margin: 0;
}

/* 4. 优势列表 */
.benefits-list {
  list-style: none;
  padding: 0;
  margin: 40px auto;
  max-width: 400px;
}
.benefit-item {
  text-align: left;
  margin: 18px 0;
  font-size: 1.2rem;
  font-weight: 400;
}
.check-icon {
  /* 采用对标风格的高亮色 */
  color: #ff8c62;
  margin-right: 10px;
  font-weight: 700;
}

/* 5. 示例文字 */
.example-text {
  font-size: 1.2rem;
  color: #ccc;
  margin-top: 30px;
}

/* 6. CTA 按钮组 */
.cta-section {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin: 60px 0;
}
.cta-button {
  /* 采用对标的 explore-button 样式 */
  background-color: #ff8c62;
  color: #fff;
  text-decoration: none;
  padding: 18px 40px;
  border-radius: 5px;
  font-weight: 700;
  font-size: 1.1rem;
  transition: background-color 0.3s;
  letter-spacing: 1px;
}
.cta-button:hover {
  background-color: #e67a54; /* 对标的悬停效果 */
}

/* 7. 底部说明 */
.disclaimer-section {
  font-size: 1rem;
  color: #aaa;
  margin-top: 40px;
  line-height: 1.8;
}
</style>
