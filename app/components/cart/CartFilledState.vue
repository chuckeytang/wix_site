<template>
  <div class="cart-filled-state container">
    <section class="cart-list-section">
      <h1 class="cart-title">
        In your shopping cart.({{ cartStore.totalItems }})
        <span class="info-icon">ⓘ</span>
      </h1>

      <div class="item-list">
        <CartItem
          v-for="item in cartStore.items"
          :key="item.cartItemId"
          :item="item"
        />
      </div>

      <h2 class="recommend-title">Recommended for You</h2>
      <div v-if="loadingRecommendations" class="loading-message">
        Loading recommendations...
      </div>
      <div v-else class="recommend-list">
        <div
          v-for="track in recommendedTracks"
          :key="track.trackId"
          class="recommend-item"
        >
          <span class="rec-name">{{ track.title }}</span>
          <button class="add-btn" @click="handleRecommendationAddToCart(track)">
            Add
          </button>
        </div>
      </div>
    </section>

    <aside class="cart-summary-section">
      <CartSummary
        :subtotal="cartStore.subtotal"
        :total-items="cartStore.totalItems"
        @startCheckout="handleCartCheckout"
      />
    </aside>

    <CheckoutModal
      :isVisible="showCheckoutModal"
      :clientSecret="checkoutClientSecret"
      :orderId="checkoutOrderId"
      :returnPath="checkoutReturnPath"
      @close="showCheckoutModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCartStore } from "~/stores/cart";
import CartItem from "~/components/cart/CartItem.vue";
import CartSummary from "~/components/cart/CartSummary.vue";
import CheckoutModal from "~/components/CheckoutModal.vue";
import { tracksApi } from "~/api";

const cartStore = useCartStore();

const showCheckoutModal = ref(false);
const checkoutClientSecret = ref(null);
const checkoutOrderId = ref(null);
const checkoutReturnPath = ref("/cart");

// 模拟推荐数据（实际应从 API 获取）
const recommendedTracks = ref([]);
const loadingRecommendations = ref(true);

// ----------------------------------------------------
// Action: 获取推荐数据
// ----------------------------------------------------
const fetchRecommendations = async () => {
  loadingRecommendations.value = true;
  try {
    // 假设我们调用 Tracks API 来获取一个简短的列表
    // 实际中您可能需要一个专门的推荐 API，这里先用 tracks/list 模拟
    const response = await tracksApi.getTracksList({
      pageNum: 1,
      pageSize: 3,
      orderByColumn: "download_count",
      isAsc: "desc",
    });

    if (response.code === 200) {
      // 假设 rows 包含了 Tracks 类型的对象
      recommendedTracks.value = response.rows;
    }
  } catch (error) {
    console.error("Failed to fetch recommendations:", error);
  } finally {
    loadingRecommendations.value = false;
  }
};

onMounted(() => {
  // 1. 确保购物车数据被加载
  if (cartStore.items.length === 0) {
    cartStore.loadCart();
  }

  // 2. 加载推荐数据
  fetchRecommendations();
});

// ----------------------------------------------------
// Action: 处理从 CartSummary 接收到的结算事件
// ----------------------------------------------------
const handleCartCheckout = (data) => {
  // 设置模态框所需的数据
  checkoutClientSecret.value = data.clientSecret;
  checkoutOrderId.value = data.orderId;

  // returnPath 已经默认设置为 /cart

  // 显示模态框
  showCheckoutModal.value = true;
};

// ----------------------------------------------------
// Action: 处理推荐商品的添加
// ----------------------------------------------------
const handleRecommendationAddToCart = (track) => {
  if (!track.trackId || !track.standardPrice) {
    alert("Cannot add recommended item: Price information missing.");
    return;
  }

  // 构造 addItem 所需的结构，并调用 Store 的 addItemAndRefresh
  cartStore.addItem({
    productId: track.trackId,
    productType: "track",
    licenseOption: "standard", // 默认为标准许可
    priceAtAddition: track.standardPrice, // 假设价格字段名为 standardPrice
  });
};
</script>

<style scoped>
/* 左右分栏布局，暗色主题样式 */
.cart-filled-state {
  display: flex; /* 启用 Flexbox 布局 */
  max-width: 1200px;
  margin: 0 auto;
  gap: 30px; /* 左右栏之间的间距 */
  padding: 30px 20px;
  color: #ffffff; /* 确保文字是白色 */
}

/* 左栏：商品列表 */
.cart-list-section {
  flex: 2; /* 左栏占据 2 份，约 66.6% */
  min-width: 0; /* 允许内容缩小 */
}

.cart-title {
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 25px;
}

.info-icon {
  font-size: 0.7em;
  color: #ff8c62;
  margin-left: 10px;
  cursor: pointer;
}

/* 右栏：购买摘要 */
.cart-summary-section {
  flex: 1; /* 右栏占据 1 份，约 33.3% */
  /* 保持右侧面板在滚动时固定（可选功能，可以后续添加） */
}

/* 推荐区域样式 */
.recommend-title {
  font-size: 1.3em;
  margin-top: 40px;
  margin-bottom: 15px;
  color: #ffffff;
  border-bottom: 1px solid #444; /* 分隔线 */
  padding-bottom: 10px;
}

.recommend-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.recommend-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #222;
}

.rec-name {
  font-size: 1em;
  color: #ccc;
}

.add-btn {
  background-color: transparent;
  border: 1px solid #ff8c62;
  color: #ff8c62;
  padding: 6px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease;
}

.add-btn:hover {
  background-color: #ff8c62;
  color: #1a1a1a;
}
</style>
