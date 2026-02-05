<template>
  <div class="orders-page-bg">
    <div class="orders-page">
      <AccountSubNav />
      <header class="orders-header">
        <h1 class="page-title">Orders</h1>
        <div class="search-box-wrapper">
          <input
            type="text"
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            placeholder="Search orders by product name..."
            class="order-search-input"
          />
          <svg
            @click="handleSearch"
            class="search-icon clickable"
            viewBox="0 0 24 24"
            width="20"
            height="20"
          >
            <path
              fill="currentColor"
              d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
            />
          </svg>
        </div>
      </header>
      <div class="orders-main-content">
        <div v-if="isLoading" class="loading-state">Loading...</div>
        <OrderEmptyState v-else-if="orders.length === 0" />
        <OrderList
          v-else
          :orders="orders"
          :loading-id="payingOrderId"
          @pay="handlePay"
        />
      </div>
    </div>
    <CheckoutModal
      :isVisible="showCheckoutModal"
      :clientSecret="checkoutClientSecret"
      :orderId="checkoutOrderId"
      :amount="checkoutAmount"
      :currency="checkoutCurrency"
      :returnPath="'/account/orders'"
      @close="closeCheckoutModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ordersApi } from "~/api/orders";
import { cartsApi } from "~/api/carts"; // 用于创建 payment intent
import type { OrderDetails } from "~/types/orders";
import OrderEmptyState from "~/components/account/orders/OrderEmptyState.vue";
import OrderList from "~/components/account/orders/OrderList.vue";
import AccountSubNav from "~/components/AccountSubNav.vue";
import CheckoutModal from "~/components/CheckoutModal.vue";

definePageMeta({
  middleware: "auth",
});

const { showToast } = useToast();

const orders = ref<OrderDetails[]>([]);
const isLoading = ref(true);
const payingOrderId = ref<number | null>(null);
const searchQuery = ref("");

// 支付弹窗状态
const showCheckoutModal = ref(false);
const checkoutClientSecret = ref<string | null>(null);
const checkoutOrderId = ref<number | null>(null);
const checkoutAmount = ref<number>(0);
const checkoutCurrency = ref<string>("usd");

// 加载订单数据
const fetchOrders = async () => {
  isLoading.value = true;
  try {
    // 🚀 传递 itemTitle 参数
    const params = {
      pageNum: 1,
      pageSize: 20,
      itemTitle: searchQuery.value, // 传给后端
    };

    const res = await ordersApi.getUserOrders(params);
    if (res.code === 200) {
      orders.value = res.rows;
    }
  } catch (error) {
    console.error("Failed to load orders", error);
  } finally {
    isLoading.value = false;
  }
};

// 搜索处理函数
const handleSearch = () => {
  fetchOrders();
};

// 处理点击支付按钮
const handlePay = async (order: OrderDetails) => {
  // 1. 设置基础信息
  checkoutOrderId.value = order.orderId;
  checkoutAmount.value = order.totalAmount;
  checkoutCurrency.value = order.currency || "usd";

  // 2. 清空之前的 secret（确保模态框触发内部的 checkUserAndInitialize 逻辑）
  checkoutClientSecret.value = null;

  // 3. 直接打开模态框
  // 模态框内部 watch(isVisible) 会触发 checkUserAndInitialize()
  // 从而实现：检查地址 -> (若无)显示地址表单 -> (若有)获取 PaymentIntent
  showCheckoutModal.value = true;
};

const closeCheckoutModal = () => {
  showCheckoutModal.value = false;
  // 支付关闭后刷新列表，查看状态是否变更 (如果支付成功)
  fetchOrders();
};

onMounted(() => {
  fetchOrders();
});
</script>

<style scoped>
.orders-page-bg {
  width: 100%;
  background-color: #12121e;
  min-height: 100vh;
}

.orders-page {
  padding-top: 80px;
  padding-bottom: 40px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #12121e;
  padding-left: 20px;
  padding-right: 20px;
}

/* --- 头部和搜索 --- */
.orders-header {
  display: flex;
  justify-content: space-between; /* 使标题和搜索框分布在两端 */
  align-items: center;
  margin-bottom: 50px;
}

/* .page-title { ... } */
.page-title {
  font-size: 2.5rem;
  font-weight: 600;
  color: #ff8c62; /* 标题颜色 */
}

/* .search-box-wrapper { ... } */
.search-box-wrapper {
  position: relative; /* 关键：使搜索图标可以相对于它定位 */
  display: flex;
  align-items: center;
}

/* .order-search-input { ... } */
.order-search-input {
  padding: 10px 15px 10px 40px; /* 增加左侧内边距 (40px) 给搜索图标留位置 */
  border: 1px solid #727272;
  border-radius: 20px; /* 圆角 */
  width: 250px;
  font-size: 1rem;
  background-color: #0a0a10;
  color: #f0f0f0;
}

/* .search-icon { ... } */
.search-icon {
  position: absolute; /* 关键：相对于 .search-box-wrapper 定位 */
  left: 10px; /* 距离左边缘 10px */
  color: #888;
}

/* 增加鼠标手势 */
.search-icon.clickable {
  cursor: pointer;
  transition: color 0.2s;
}
.search-icon.clickable:hover {
  color: #ff8c62;
}
</style>
