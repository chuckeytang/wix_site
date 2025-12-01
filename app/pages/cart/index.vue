<template>
  <div class="cart-page-wrapper">
    <template v-if="cartStore.isEmpty && !showCheckoutModal && !loading">
      <CartEmptyState />
    </template>

    <template v-else>
      <CartFilledState @requestCheckout="handleOpenCheckout" />
    </template>

    <CheckoutModal
      :isVisible="showCheckoutModal"
      :clientSecret="checkoutClientSecret"
      :orderId="checkoutOrderId"
      :returnPath="checkoutReturnPath"
      :amount="checkoutAmount"
      :currency="checkoutCurrency"
      @close="handleCloseCheckout"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useCartStore } from "~/stores/cart";
import { useRouter, useRoute } from "vue-router";

import CartFilledState from "~/components/cart/CartFilledState.vue";
import CartEmptyState from "~/components/cart/CartEmptyState.vue";
import CheckoutModal from "~/components/CheckoutModal.vue";

const cartStore = useCartStore();
const loading = ref(true); // 初始设置为加载中
const router = useRouter();
const route = useRoute();

const showCheckoutModal = ref(false);
const checkoutClientSecret = ref(null);
const checkoutOrderId = ref(null);
const checkoutReturnPath = ref("/cart");
const checkoutAmount = ref(0);
const checkoutCurrency = ref("usd");

// 页面挂载时，加载后端购物车数据
onMounted(async () => {
  await cartStore.loadCart();
  loading.value = false;
});

// 处理 CartFilledState 发出的结算请求
const handleOpenCheckout = (data) => {
  // 设置模态框所需的数据
  checkoutClientSecret.value = data.clientSecret;
  checkoutOrderId.value = data.orderId;
  checkoutAmount.value = data.amount; // 接收 CartFilledState 传递的金额
  checkoutCurrency.value = data.currency;

  // 显示模态框
  showCheckoutModal.value = true;
};

// 处理模态框关闭事件
const handleCloseCheckout = () => {
  showCheckoutModal.value = false;
};
</script>

<style scoped>
/* 统一的页面背景和 Header 间距 */
.cart-page-wrapper {
  background-color: #12121e;
  min-height: 100vh;
  padding-top: 80px; /* 留出 header 空间 */
}
.loading-state {
  color: #fff;
  text-align: center;
  padding-top: 200px;
  font-size: 1.5em;
}
.test-success-button {
  position: fixed; /* 固定在屏幕上 */
  bottom: 150px; /* 放在播放器上面一点 */
  left: 20px;
  z-index: 9999;
  background-color: #ff8c62; /* 你的主题色 */
  color: #0d0d1a;
  padding: 10px 15px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.3s;
}

.test-success-button:hover {
  opacity: 1;
}
</style>
