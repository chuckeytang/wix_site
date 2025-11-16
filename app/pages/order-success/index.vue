<template>
  <div class="order-success-page">
    <div class="success-card">
      
      <template v-if="loading">
        <h1 class="title">⏳ Loading Order...</h1>
        <p class="status-message">Fetching your purchase details...</p>
        <div class="spinner-large"></div>
      </template>

      <template v-else-if="error">
        <h1 class="title fail-title">❌ Error Loading Order</h1>
        <p class="status-message">{{ error }}</p>
        <button class="action-button primary-button" @click="handleReturn">
          Go to Homepage
        </button>
      </template>

      <template v-else-if="order">
        <h1 class="title success-title">Order successful!</h1>
        
        <p class="order-id">Order-ID: {{ order.orderId }}</p>

        <div class="items-list">
          <p class="item-title">(... 订单项目列表将显示在这里 ...)</p>
        </div>

        <div class="total-summary">
          <span>Total</span>
          <span class="total-price"
            >US$ {{ order.totalAmount.toFixed(2) }}</span
          >
        </div>

        <button class="action-button primary-button" @click="handleReturn">
          {{ returnPathName }}
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted, computed } from "vue";
import { ordersApi } from '~/api/orders'; // [保留] 导入真实 API
import type { OrderDetails } from '~/types/orders'; // [保留] 导入真实类型

const route = useRoute();
const router = useRouter();
const loading = ref(true); // [保留] 真实的状态
const error = ref<string | null>(null); // [保留] 真实的状态
const order = ref<OrderDetails | null>(null); // [保留] 真实的状态

definePageMeta({
  layout: "blank",
});

// [删除] 假数据 const orders = ref(...) 已被删除
// [删除] 假下载 handleDownload 和 downloadingId 已被删除

const returnPath = ref(route.query.returnPath as any|| "/");

// --- (返回按钮的逻辑) ---
const handleReturn = () => {
  router.push(returnPath.value);
};
const returnPathName = computed(() => {
  if (returnPath.value === "/cart") return "Back to Cart";
  if (returnPath.value === "/") return "Back to Homepage";
  return "Continue Browsing";
});

// --- [保留] 真实的 onMounted API 调用 ---
onMounted(async () => {
  const orderId = route.query.orderId as string | undefined;

  if (!orderId) {
    error.value = "No Order ID provided.";
    loading.value = false;
    return;
  }

  try {
    // [关键] 我们调用了你 api/orders.ts 中的 getOrderDetail 函数
    const response = await ordersApi.getOrderDetail(Number(orderId));

    if (response.code === 200 && response.data) {
      order.value = response.data; // [关键] 填充了 'order' (单数) 变量
    } else {
      throw new Error(response.msg || "Failed to fetch order details");
    }
  } catch (err: any) {
    error.value = err.message || "An unknown error occurred";
  } finally {
    loading.value = false; // 停止加载
  }
});
</script>

<style scoped>
/* (所有样式都保持不变，因为我们正在构建布局) */
.order-success-page {
  height: 100vh;
  background-color: #0d0d1a;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  padding: 20px;
}
.success-card {
  width: 100%;
  padding: 40px 50px;
  max-width: 600px;
  background-color: #1a1a2e;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}
.title {
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 20px;
}
.success-title {
  color: #ff8c62;
}
.order-id {
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 30px;
  margin-top: -20px;
}
.items-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
  text-align: left;
  border-top: 1px solid #333;
  border-bottom: 1px solid #333;
  padding: 20px 0;
}
.item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.item-title {
  font-size: 1.1rem;
  font-weight: bold;
}
.download-button {
  background-color: #ff8c62;
  color: #0d0d1a;
  border: none;
  padding: 8px 15px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
  min-width: 100px;
}
.download-button:hover:not(:disabled) {
  background-color: #e67a54;
}
.download-button:disabled {
  background-color: #555;
  cursor: not-allowed;
}
.total-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.3rem;
  font-weight: bold;
  color: #fff;
  padding: 20px 0;
}
.countdown-text {
  font-size: 0.9rem;
  color: #888;
  margin-top: 20px;
}
.spinner-small {
  display: inline-block;
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  border-top: 2px solid #0d0d1a;
  width: 14px;
  height: 14px;
  animation: spin 1s linear infinite;
  vertical-align: middle;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.action-button {
  display: inline-block;
  margin-top: 30px;
  padding: 15px 35px;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    transform 0.3s;
}
.primary-button {
  background-color: #ff8c62;
  color: #0d0d1a;
}
.primary-button:hover {
  background-color: #e67a54;
  transform: translateY(-2px);
}

.spinner-large {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid #ff8c62;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 20px auto;
}
</style>