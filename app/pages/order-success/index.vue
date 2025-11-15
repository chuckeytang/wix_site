<template>
    <div class="order-success-page">
        <div class="success-card">
            <template v-if="orders">
                <h1 class="title success-title">Order successful!</h1>
                <p class="order-id">Order-ID:{{ orders.id }}</p>

                <div class="items-list">
                    <div
                        v-for="item in orders.items"
                        :key="item.productId"
                        class="item-row"
                    >
                        <span class="item-title">{{ item.title }}</span>
                            <button
                                class="download-button"
                                @click="handleDownload(item.productId)"
                                :disabled="downloadingId === item.productId"
                                >
                                <span
                                    v-if="downloadingId === item.productId"
                                    class="spinner-small"
                                ></span>
                                <span v-else>Download</span>
                            </button>
                    </div>
                </div>
                <div class="total-summary">
                <span>Total</span>
                <span class="total-price"
                    >US$ {{ orders.totalAmount.toFixed(2) }}</span
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

const route = useRoute();
const router = useRouter();
definePageMeta({
  layout: "blank",
});

const returnPath = ref(route.query.returnPath || "/");
const handleDownload = (productId:any) => {
  if (downloadingId.value) return;
  downloadingId.value = productId;
  setTimeout(() => {
    downloadingId.value = null;
  }, 2000);
};

const orders = ref({
  id: "MOCK-12345",
  totalAmount: 39.98,
  items: [
    {
      productId: 101,
      productType: "track",
      title: "Epic Cinematic Journey",
    },
    {
      productId: 102,
      productType: "track",
      title: "Happy Upbeat Corporate Pop",
    },
    {
      productId: 505,
      productType: "sfx",
      title: "Big Explosion Sound",
    },
  ],
});
const downloadingId = ref<number | null>(null); // 保留这个来测试按钮 UI

const handleReturn = () => {
  router.push(returnPath.value);
};
const returnPathName = computed(() => {
  if (returnPath.value === "/cart") return "Back to Cart";
  if (returnPath.value === "/") return "Back to Homepage";
  return "Continue Browsing"; // 一个通用的名字
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
</style>