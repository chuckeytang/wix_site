<template>
  <div class="orders-page-bg">
    <div class="orders-page">
      <AccountSubNav />

      <header class="order-header">
        <h1 class="page-title">Order #{{ orderIdDisplay }}</h1>
        <button class="back-btn" @click="goToOrderHistory">Back to Orders</button>
      </header>

      <div v-if="isLoading" class="loading-state">Loading order details...</div>

      <div v-else-if="errorMessage" class="error-state">
        <p>{{ errorMessage }}</p>
        <button class="back-btn" @click="goToOrderHistory">Back to Orders</button>
      </div>

      <div v-else-if="order" class="order-detail-content">
        <section class="order-summary-card">
          <div class="summary-row">
            <span class="label">Status</span>
            <span class="value" :class="statusClass(order.status)">
              {{ formatStatus(order.status) }}
            </span>
          </div>
          <div class="summary-row">
            <span class="label">Created</span>
            <span class="value">{{ formatDateTime(order.createdAt) }}</span>
          </div>
          <div class="summary-row">
            <span class="label">Subtotal</span>
            <span class="value">{{
              formatCurrency(subtotalAmount, order.currency || "USD")
            }}</span>
          </div>
          <div class="summary-row">
            <span class="label">Tax</span>
            <span class="value">{{
              formatCurrency(taxAmount, order.currency || "USD")
            }}</span>
          </div>
          <div class="summary-row total-row">
            <span class="label">Total</span>
            <span class="value amount-value">{{
              formatCurrency(order.totalAmount, order.currency || "USD")
            }}</span>
          </div>
        </section>

        <section class="order-items-card">
          <h2 class="section-title">Purchased Items</h2>
          <div v-if="!order.items || order.items.length === 0" class="empty-items">
            No items found in this order.
          </div>
          <div v-else class="items-list">
            <div
              v-for="item in order.items"
              :key="item.orderItemId"
              class="item-row"
            >
              <div class="item-info">
                <div class="item-title">{{ getItemTitle(item) }}</div>
                <div class="item-meta">
                  <span class="meta-label">Type:</span>
                  {{ (item.productType || "item").toUpperCase() }}
                </div>
                <div class="item-meta">
                  <span class="meta-label">Author:</span>
                  {{ getItemAuthor(item) }}
                </div>
                <div class="item-meta">
                  <span class="meta-label">Style:</span>
                  {{ getItemStyle(item) }}
                </div>
                <div class="item-meta">
                  <span class="meta-label">License:</span>
                  {{ item.licenseOption || "standard" }}
                </div>
              </div>
              <div class="item-price">
                {{
                  formatCurrency(
                    Number(item.purchasePrice || 0),
                    order.currency || "USD",
                  )
                }}
              </div>
            </div>
          </div>
        </section>

        <div class="actions">
          <button
            v-if="canRetryPayment"
            class="pay-btn"
            @click="handlePayNow"
          >
            Pay This Order
          </button>
          <button v-else class="pay-btn disabled" disabled>Payment Completed</button>
        </div>
      </div>
    </div>

    <CheckoutModal
      :isVisible="showCheckoutModal"
      :orderId="checkoutOrderId"
      :returnPath="`/account/orders/${checkoutOrderId || ''}`"
      :amount="checkoutAmount"
      :currency="checkoutCurrency"
      @close="handleCloseCheckout"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ordersApi } from "~/api/orders";
import type { OrderDetails, OrderItems } from "~/types/orders";
import AccountSubNav from "~/components/AccountSubNav.vue";
import CheckoutModal from "~/components/CheckoutModal.vue";

definePageMeta({
  middleware: "auth",
});

const route = useRoute();
const router = useRouter();
const { showToast } = useToast();

const isLoading = ref(true);
const errorMessage = ref<string | null>(null);
const order = ref<OrderDetails | null>(null);

const showCheckoutModal = ref(false);
const checkoutOrderId = ref<number | null>(null);
const checkoutAmount = ref<number>(0);
const checkoutCurrency = ref<string>("usd");

const orderId = computed(() => Number(route.params.orderId));
const orderIdDisplay = computed(() =>
  Number.isFinite(orderId.value) ? orderId.value : "-",
);

const canRetryPayment = computed(() => {
  if (!order.value) return false;
  return ["PENDING_PAYMENT", "FAILED", "CANCELLED"].includes(order.value.status);
});

const subtotalAmount = computed(() => {
  if (!order.value?.items?.length) return 0;
  return order.value.items.reduce((sum, item) => {
    return sum + Number(item.purchasePrice || 0);
  }, 0);
});

const taxAmount = computed(() => {
  if (!order.value) return 0;
  const raw = Number(order.value.totalAmount || 0) - subtotalAmount.value;
  return raw > 0 ? raw : 0;
});

const formatStatus = (status: string) => {
  if (status === "PAID") return "Paid";
  if (status === "PENDING_PAYMENT") return "Pending Payment";
  if (status === "FAILED") return "Payment Failed";
  if (status === "CANCELLED") return "Cancelled";
  return status || "Unknown";
};

const statusClass = (status: string) => {
  if (status === "PAID") return "status-paid";
  if (status === "PENDING_PAYMENT") return "status-pending";
  if (status === "FAILED") return "status-failed";
  if (status === "CANCELLED") return "status-cancelled";
  return "";
};

const formatDateTime = (dateStr?: string) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(Number(amount || 0));
};

const getItemTitle = (item: OrderItems) => {
  if (item.productType === "track") return item.track?.title || "Unknown Track";
  if (item.productType === "sfx") return item.sfx?.title || "Unknown SFX";
  return "Unknown Item";
};

const getItemAuthor = (item: OrderItems) => {
  if (item.productType === "track") return item.track?.artist || "Unknown Artist";
  if (item.productType === "sfx") return item.sfx?.artist || "Unknown Artist";
  return "N/A";
};

const getItemStyle = (item: OrderItems) => {
  if (item.productType === "track") {
    return item.track?.genres || item.track?.type || "Unknown Style";
  }
  if (item.productType === "sfx") {
    return item.sfx?.genres || item.sfx?.type || "Unknown Style";
  }
  return "N/A";
};

const fetchOrderDetail = async () => {
  if (!Number.isFinite(orderId.value) || orderId.value <= 0) {
    isLoading.value = false;
    errorMessage.value = "Invalid order ID.";
    return;
  }

  isLoading.value = true;
  errorMessage.value = null;
  try {
    const res = await ordersApi.getOrderDetail(orderId.value);
    if (res.code !== 200 || !res.data) {
      throw new Error(res.msg || "Order not found.");
    }
    order.value = res.data;
  } catch (error: any) {
    errorMessage.value = error.message || "Failed to load order details.";
  } finally {
    isLoading.value = false;
  }
};

const handlePayNow = () => {
  if (!order.value) return;
  checkoutOrderId.value = order.value.orderId;
  checkoutAmount.value = Number(order.value.totalAmount || 0);
  checkoutCurrency.value = (order.value.currency || "USD").toLowerCase();
  showCheckoutModal.value = true;
};

const handleCloseCheckout = () => {
  showCheckoutModal.value = false;
  fetchOrderDetail();
};

const goToOrderHistory = () => {
  router.push("/account/orders");
};

watch(
  () => route.query.checkout,
  (checkoutStatus) => {
    if (checkoutStatus === "failed") {
      showToast("Payment failed. You can retry payment for this order.");
    } else if (checkoutStatus === "cancelled") {
      showToast("Payment cancelled. You can retry payment for this order.");
    }
  },
  { immediate: true },
);

onMounted(() => {
  fetchOrderDetail();
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
  max-width: 1000px;
  margin: 0 auto;
  background-color: #12121e;
  padding-left: 20px;
  padding-right: 20px;
}

.order-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.page-title {
  font-size: 2rem;
  font-weight: 600;
  color: #ff8c62;
  margin: 0;
}

.back-btn {
  border: 1px solid #444;
  background: transparent;
  color: #ddd;
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
}

.back-btn:hover {
  border-color: #ff8c62;
  color: #ff8c62;
}

.loading-state,
.error-state,
.empty-items {
  color: #bbb;
  background: #1a1a24;
  border: 1px solid #2a2a35;
  border-radius: 12px;
  padding: 18px;
}

.order-detail-content {
  display: grid;
  gap: 16px;
}

.order-summary-card,
.order-items-card {
  background: #1a1a24;
  border: 1px solid #2a2a35;
  border-radius: 12px;
  padding: 18px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.summary-row:last-child {
  margin-bottom: 0;
}

.total-row {
  border-top: 1px solid #2d2d3a;
  padding-top: 12px;
}

.label {
  color: #9a9aac;
}

.value {
  color: #f2f2f5;
  font-weight: 500;
}

.amount-value {
  font-size: 1.1rem;
  color: #ff8c62;
}

.status-paid {
  color: #6dd59c;
}

.status-pending {
  color: #ffc46a;
}

.status-failed {
  color: #ff7f7f;
}

.status-cancelled {
  color: #b0b0c6;
}

.section-title {
  margin: 0 0 14px 0;
  font-size: 1.1rem;
  color: #f2f2f5;
}

.items-list {
  display: grid;
  gap: 10px;
}

.item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background: #141420;
  border: 1px solid #2a2a35;
}

.item-title {
  color: #ececf1;
  font-weight: 500;
}

.item-meta {
  margin-top: 4px;
  color: #8f8fa5;
  font-size: 0.82rem;
}

.meta-label {
  color: #a7a7ba;
  margin-right: 6px;
}

.item-price {
  color: #ff8c62;
  font-weight: 600;
}

.actions {
  display: flex;
  justify-content: flex-end;
}

.pay-btn {
  border: none;
  border-radius: 8px;
  background: #ff8c62;
  color: #12121e;
  font-weight: 600;
  padding: 10px 16px;
  cursor: pointer;
}

.pay-btn.disabled {
  background: #555;
  color: #ccc;
  cursor: not-allowed;
}
</style>
