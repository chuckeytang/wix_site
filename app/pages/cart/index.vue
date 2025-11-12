<template>
  <div class="cart-page-wrapper">
    <template v-if="cartStore.isEmpty">
      <CartEmptyState />
    </template>

    <template v-else>
      <CartFilledState />
    </template>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useCartStore } from "~/stores/cart";

const cartStore = useCartStore();
const loading = ref(true); // 初始设置为加载中

// 页面挂载时，加载后端购物车数据
onMounted(async () => {
  await cartStore.loadCart();
  loading.value = false;
});
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
</style>
