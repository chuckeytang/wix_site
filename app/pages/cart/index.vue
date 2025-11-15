<template>
  <div class="cart-page-wrapper">
    <template v-if="cartStore.isEmpty">
      <CartEmptyState />
    </template>

    <template v-else>
      <CartFilledState />
    </template>

    <button 
      v-if="!loading"
      @click="simulateSuccessfulPayment"
      class="test-success-button"
    >
    (TEST)模拟支付成功
    </button>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useCartStore } from "~/stores/cart";
import { useRouter ,useRoute} from "vue-router";

const cartStore = useCartStore();
const loading = ref(true); // 初始设置为加载中
const router = useRouter();
const route = useRoute();

// 页面挂载时，加载后端购物车数据
onMounted(async () => {
  await cartStore.loadCart();
  loading.value = false;
});

const simulateSuccessfulPayment = () =>{
  const currentPath = route.fullPath;
  router.push({
    path:"/payment-status",
    query:{
      redirect_status:"succeeded",
      orderId:"TEST-ORDER-123",
      returnPath:currentPath,
    },
  });
}
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
