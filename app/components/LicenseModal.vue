<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      <header class="modal-header">
        <div class="header-text">
          <h2 class="modal-title">Verscape Music & SFX Licenses</h2>
          <p class="modal-subtitle">
            One-time purchase, perpetual use. Pick the license that matches your
            project size.
          </p>
        </div>
        <button class="close-button" @click="emit('close')">×</button>
      </header>

      <div class="modal-body">
        <div class="license-grid">
          <div class="license-card popular">
            <div class="badge">Current Best Value</div>
            <div class="card-header">
              <h3 class="tier-name">Creator</h3>
              <span class="tier-sub">(Personal)</span>
              <div class="price">
                $0.01 <span class="per-track">/ track</span>
              </div>
            </div>
            <ul class="features-list">
              <li class="feature-item">
                <span class="check">✔</span> 1 Project covered
              </li>
              <li class="feature-item">
                <span class="cross">✘</span> No Client work
              </li>
              <li class="feature-item">
                <span class="check">✔</span> Web & Social (YouTube, TikTok,
                Bilibili)
              </li>
              <li class="feature-item">
                <span class="cross">✘</span> No Games/Apps
              </li>
              <li class="feature-item">
                <span class="cross">✘</span> No Broadcast TV/Radio
              </li>
            </ul>
            <button
              class="select-btn primary"
              @click="handleLicenseAddToCart('creator', 0.01)"
            >
              Add to Cart
            </button>
          </div>

          <div class="license-card coming-soon">
            <div class="card-header">
              <h3 class="tier-name">Standard</h3>
              <span class="tier-sub">(Freelance)</span>
              <div class="price">
                $6.99 <span class="per-track">/ track</span>
              </div>
            </div>
            <ul class="features-list disabled-text">
              <li class="feature-item">
                <span class="check">✔</span> 1 Project covered
              </li>
              <li class="feature-item">
                <span class="check">✔</span> Client work allowed
              </li>
              <li class="feature-item">
                <span class="check">✔</span> Web & Social
              </li>
              <li class="feature-item">
                <span class="cross">✘</span> No Games/Apps
              </li>
              <li class="feature-item">
                <span class="cross">✘</span> No Broadcast TV/Radio
              </li>
            </ul>
            <button class="select-btn disabled" disabled>Coming Soon</button>
          </div>

          <div class="license-card coming-soon">
            <div class="card-header">
              <h3 class="tier-name">Business</h3>
              <span class="tier-sub">(Studio)</span>
              <div class="price">
                $21.99 <span class="per-track">/ track</span>
              </div>
            </div>
            <ul class="features-list disabled-text">
              <li class="feature-item">
                <span class="check">✔</span> 1 Project covered
              </li>
              <li class="feature-item">
                <span class="check">✔</span> Client work allowed
              </li>
              <li class="feature-item">
                <span class="check">✔</span> Web & Social
              </li>
              <li class="feature-item">
                <span class="check">✔</span> Indie / Mid-size Games
              </li>
              <li class="feature-item">
                <span class="check">✔</span> Regional TV / Radio
              </li>
            </ul>
            <button class="select-btn disabled" disabled>Coming Soon</button>
          </div>

          <div class="license-card enterprise">
            <div class="card-header">
              <h3 class="tier-name">Enterprise</h3>
              <span class="tier-sub">(Custom)</span>
              <div class="price">Contact us</div>
            </div>
            <ul class="features-list">
              <li class="feature-item">
                <span class="check">✔</span> Unlimited Projects
              </li>
              <li class="feature-item">
                <span class="check">✔</span> Client work allowed
              </li>
              <li class="feature-item">
                <span class="check">✔</span> Web & Social
              </li>
              <li class="feature-item">
                <span class="check">✔</span> Large / Global Games
              </li>
              <li class="feature-item">
                <span class="check">✔</span> Worldwide Broadcast
              </li>
            </ul>
            <button class="select-btn outline" @click="handleContactUs">
              Contact Us
            </button>
          </div>
        </div>

        <div class="legal-footer">
          <p>
            All licenses are one-time purchase and perpetual for approved uses.
          </p>
          <p>
            Raw audio cannot be resold, redistributed, or used to train AI
            models.
          </p>
          <p>
            See the
            <a href="#" @click.prevent="openFullTerms"
              >Verscape License Agreement</a
            >
            for full legal terms.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cartsApi } from "~/api/carts";
import type { CartItems } from "~/types/cartItems";
import { useRouter } from "vue-router";
import { useCartStore } from "~/stores/cart";
import { useAuthStore } from "~/stores/auth";
import { useToast } from "~/composables/useToast";

const props = defineProps<{
  isVisible: boolean;
  trackTitle: string;
  trackId: number;
  productType: "track" | "sfx" | "plan";
}>();

const emit = defineEmits(["close"]);
const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();
const { showToast } = useToast();

/**
 * 处理添加到购物车
 */
const handleLicenseAddToCart = async (licenseOption: string, price: number) => {
  // 1. 强制检查是否选择了 Creator (唯一可用)
  if (licenseOption !== "creator") {
    console.warn(`Only 'creator' license is currently available.`);
    return;
  }

  if (!authStore.isAuthenticated) {
    authStore.closeLicenseModal();
    authStore.openLoginDialog();
    return;
  }

  // 3. 构建请求体 (使用 'creator' 作为 licenseOption)
  const itemToAdd: Partial<CartItems> = {
    productType: props.productType,
    productId: props.trackId,
    licenseOption: "creator",
    quantity: 1,
  };

  try {
    const result = await cartsApi.addItemToCart(itemToAdd);

    if (result.code === 200) {
      await cartStore.loadCart();
      showToast(`Added ${licenseOption} license to cart!`);
      emit("close");
    } else {
      showToast(`Failed to add: ${result.msg || "Unknown error"}`);
    }
  } catch (error) {
    console.error("Add to cart error:", error);
    showToast("Network error, please try again.");
  }
};

const handleContactUs = () => {
  window.location.href =
    "mailto:sales@verscape.com?subject=Enterprise License Inquiry";
};

const openFullTerms = () => {
  window.open("/license-agreement", "_blank");
};
</script>

<style scoped>
.license-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}
@media (max-width: 900px) {
  .license-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 600px) {
  .license-grid {
    grid-template-columns: 1fr;
  }
}

/* --- 卡片样式 --- */
.license-card {
  background-color: #1e1e2d;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  transition:
    transform 0.2s,
    border-color 0.2s,
    opacity 0.3s;
}

/* 🚀 新增：禁用和敬请期待样式 */
.license-card.coming-soon {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none; /* 禁用所有鼠标事件 */
}

.license-card.coming-soon:hover {
  transform: none; /* 禁用 hover 效果 */
  border-color: #333;
}

.disabled-text {
  color: #888;
}
.disabled-text .check,
.disabled-text .cross {
  opacity: 0.8;
}

/* 原有的 popular 样式保留给 Creator */
.license-card.popular {
  border: 1px solid #ff8c62;
  background-color: #252535;
  box-shadow: 0 0 15px rgba(255, 140, 98, 0.1);
  pointer-events: auto; /* 确保它能被点击 */
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  width: 95%;
  max-width: 1100px; /* 加宽以容纳4列 */
  background-color: #12121e; /* 深色背景 */
  border: 1px solid #333;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
  color: #fff;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  overflow: hidden;
}

.modal-header {
  padding: 20px 30px;
  border-bottom: 1px solid #333;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background-color: #1a1a2e;
}

.modal-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #fff;
  margin: 0 0 5px 0;
}

.modal-subtitle {
  font-size: 0.95rem;
  color: #aaa;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  color: #888;
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
  padding: 0;
}
.close-button:hover {
  color: #fff;
}

.modal-body {
  padding: 30px;
  overflow-y: auto;
}

/* --- 布局核心 --- */
.license-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4列等宽 */
  gap: 20px;
  margin-bottom: 30px;
}

/* 响应式：小屏幕变2列或1列 */
@media (max-width: 900px) {
  .license-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 600px) {
  .license-grid {
    grid-template-columns: 1fr;
  }
}

/* --- 卡片样式 --- */
.license-card {
  background-color: #1e1e2d;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  transition:
    transform 0.2s,
    border-color 0.2s;
}

.license-card:hover {
  transform: translateY(-5px);
  border-color: #555;
}

/* 高亮 Popular 卡片 */
.license-card.popular {
  border: 1px solid #ff8c62;
  background-color: #252535;
  box-shadow: 0 0 15px rgba(255, 140, 98, 0.1);
}

.badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #ff8c62;
  color: #0d0d1a;
  font-size: 0.6rem;
  font-weight: bold;
  padding: 4px 12px;
  border-radius: 12px;
  text-transform: uppercase;
}

.card-header {
  text-align: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #333;
  padding-bottom: 15px;
}

.tier-name {
  font-size: 1.4rem;
  font-weight: bold;
  margin: 0;
  color: #fff;
}

.tier-sub {
  font-size: 0.9rem;
  color: #888;
  display: block;
  margin-bottom: 10px;
}

.price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ff8c62;
}

.per-track {
  font-size: 0.9rem;
  color: #888;
  font-weight: normal;
}

/* --- 特性列表 --- */
.features-list {
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
  flex-grow: 1; /* 让列表占据剩余空间，对齐按钮 */
}

.feature-item {
  font-size: 0.9rem;
  color: #ccc;
  margin-bottom: 10px;
  display: flex;
  align-items: flex-start;
  line-height: 1.4;
}

.check {
  color: #4caf50; /* 绿色对勾 */
  margin-right: 8px;
  font-weight: bold;
}

.cross {
  color: #f44336; /* 红色叉叉 */
  margin-right: 8px;
  font-weight: bold;
}

strong {
  color: #fff;
  font-weight: 600;
}

/* --- 按钮 --- */
.select-btn {
  width: 100%;
  padding: 12px;
  border-radius: 6px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  background-color: #333;
  color: #fff;
  transition: background-color 0.2s;
}

.select-btn:hover {
  background-color: #444;
}

.select-btn.primary {
  background-color: #ff8c62;
  color: #0d0d1a;
}

.select-btn.primary:hover {
  background-color: #e67a54;
}

.select-btn.outline {
  background-color: transparent;
  border: 1px solid #ff8c62;
  color: #ff8c62;
}

.select-btn.outline:hover {
  background-color: rgba(255, 140, 98, 0.1);
}

/* 禁用按钮样式 */
.select-btn.disabled {
  background-color: #444;
  color: #888;
  cursor: not-allowed;
  box-shadow: none;
}

/* --- 底部文字 --- */
.legal-footer {
  text-align: center;
  color: #777;
  font-size: 0.85rem;
  border-top: 1px solid #333;
  padding-top: 20px;
}

.legal-footer p {
  margin: 5px 0;
}

.legal-footer a {
  color: #ff8c62;
  text-decoration: none;
}
.legal-footer a:hover {
  text-decoration: underline;
}
</style>
