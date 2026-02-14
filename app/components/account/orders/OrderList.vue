<template>
  <div class="order-list-container">
    <div v-if="orders.length === 0">
      <slot name="empty">
        <div class="no-data">No orders found.</div>
      </slot>
    </div>

    <div v-else>
      <div class="header-summary">
        <h2 class="recent-title">Order History</h2>
        <span class="count-badge">{{ orders.length }} items</span>
      </div>

      <table class="orders-table">
        <thead>
          <tr>
            <th class="col-content">Product / Description</th>
            <th class="col-date">Date</th>
            <th class="col-total">Total</th>
            <th class="col-status">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="order in orders"
            :key="order.orderId"
            class="order-row clickable-row"
            @click="$emit('view', order.orderId)"
          >
            <td class="col-content">
              <div class="content-wrapper">
                <div class="icon-placeholder">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M9 18V5l12-2v13"></path>
                    <circle cx="6" cy="18" r="3"></circle>
                    <circle cx="18" cy="16" r="3"></circle>
                  </svg>
                </div>
                <span :title="getOrderContentFull(order)" class="content-text">
                  {{ getOrderContentDisplay(order) }}
                </span>
                <button class="detail-link" @click.stop="$emit('view', order.orderId)">
                  View
                </button>
              </div>
            </td>

            <td class="col-date">
              <span class="date-text">{{
                formatDateTime(order.createdAt)
              }}</span>
            </td>

            <td class="col-total">
              <span class="amount-text"
                >${{ order.totalAmount?.toFixed(2) || "0.00" }}</span
              >
            </td>

            <td class="col-status">
              <div
                v-if="canPay(order.status)"
                class="action-cell"
              >
                <span class="status-text pending">{{ formatStatus(order.status) }}</span>
                <button
                  class="pay-btn"
                  @click.stop="$emit('pay', order)"
                  :disabled="loadingId === order.orderId"
                >
                  <span
                    v-if="loadingId === order.orderId"
                    class="spinner"
                  ></span>
                  <span v-else>{{ payButtonText(order.status) }}</span>
                </button>
              </div>
              <div v-else class="status-badge-wrapper">
                <span
                  class="status-badge"
                  :class="getStatusClass(order.status)"
                >
                  <span class="status-dot"></span>
                  {{ formatStatus(order.status) }}
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OrderDetails } from "~/types/orders";

const props = defineProps({
  orders: {
    type: Array as () => OrderDetails[],
    required: true,
    default: () => [],
  },
  loadingId: {
    type: Number as () => number | null,
    default: null,
  },
});

const emit = defineEmits(["pay", "view"]);

const getOrderContentFull = (order: OrderDetails) => {
  if (!order.items || order.items.length === 0) return "Unknown Items";
  const names = order.items.map((item) => {
    if (item.productType === "track")
      return item.track?.title || "Unknown Track";
    if (item.productType === "sfx") return item.sfx?.title || "Unknown SFX";
    return "Unknown Item";
  });
  return names.join(", ");
};

const getOrderContentDisplay = (order: OrderDetails) => {
  const fullText = getOrderContentFull(order);
  // 稍微放宽截断长度，视觉上更好看
  const maxLength = 25;
  if (fullText.length > maxLength) {
    return fullText.substring(0, maxLength) + "...";
  }
  return fullText;
};

const formatDateTime = (dateStr: string | undefined): string => {
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

const formatStatus = (status: string | undefined): string => {
  if (!status) return "Unknown";
  switch (status) {
    case "PAID":
      return "Completed";
    case "PENDING_PAYMENT":
      return "Pending";
    case "FAILED":
      return "Failed";
    case "CANCELLED":
      return "Cancelled";
    default:
      return status;
  }
};

const canPay = (status: string | undefined) => {
  return status === "PENDING_PAYMENT" || status === "FAILED" || status === "CANCELLED";
};

const payButtonText = (status: string | undefined) => {
  return status === "PENDING_PAYMENT" ? "Pay Now" : "Retry Pay";
};

const getStatusClass = (status: string | undefined) => {
  if (!status) return "";
  return status.toLowerCase();
};
</script>

<style scoped>
.order-list-container {
  padding: 0;
}

/* 顶部统计 */
.header-summary {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.recent-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.count-badge {
  background-color: #333;
  color: #aaa;
  font-size: 0.8rem;
  padding: 2px 8px;
  border-radius: 12px;
}

/* 表格整体 */
.orders-table {
  width: 100%;
  border-collapse: separate; /* 关键：允许行间距 */
  border-spacing: 0 8px; /* 垂直间距，实现卡片感 */
  text-align: left;
  color: #fff;
}

.orders-table th {
  padding: 10px 20px;
  color: #666;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  border: none;
}

/* 行样式：交替颜色与圆角 */
.order-row {
  background-color: #1a1a24; /* 默认深色背景 */
  transition:
    transform 0.2s,
    background-color 0.2s,
    box-shadow 0.2s;
}

.clickable-row {
  cursor: pointer;
}

/* 斑马纹：偶数行颜色稍微不同 */
.order-row:nth-child(even) {
  background-color: #15151e;
}

/* 悬停效果：提亮并微弱阴影 */
.order-row:hover {
  background-color: #232330;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* 单元格圆角处理 (为了让整行看起来是圆角的) */
.order-row td:first-child {
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}
.order-row td:last-child {
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}

.orders-table td {
  padding: 18px 20px;
  border: none; /* 移除默认边框 */
  vertical-align: middle;
}

/* 第一列：内容 */
.col-content {
  width: 40%;
}
.content-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}
.icon-placeholder {
  width: 32px;
  height: 32px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff8c62;
}
.content-text {
  font-weight: 500;
  color: #eee;
  cursor: help;
}

.detail-link {
  border: none;
  background: transparent;
  color: #ff8c62;
  cursor: pointer;
  font-size: 0.82rem;
}

/* 第二列：日期 */
.col-date {
  width: 25%;
}
.date-text {
  color: #888;
  font-size: 0.9rem;
  font-family: monospace; /* 稍微等宽一点的字体适合数字 */
}

/* 第三列：金额 */
.col-total {
  width: 15%;
}
.amount-text {
  color: #fff;
  font-weight: bold;
  font-size: 1rem;
}

/* 第四列：状态 */
.col-status {
  width: 20%;
  text-align: right;
}

/* 支付按钮 */
.action-cell {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}
.status-text.pending {
  font-size: 0.8rem;
  color: #aaa;
  font-style: italic;
}

.pay-btn {
  background: linear-gradient(135deg, #ff8c62 0%, #ff6b3d 100%);
  color: #fff;
  border: none;
  padding: 6px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(255, 140, 98, 0.3);
  transition: all 0.2s;
  min-width: 85px;
}

.pay-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(255, 140, 98, 0.4);
  filter: brightness(1.1);
}

.pay-btn:disabled {
  background: #444;
  color: #888;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

/* 状态 Badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: currentColor;
}

/* 状态颜色 */
.status-badge.paid {
  color: #69db7c;
  background-color: rgba(105, 219, 124, 0.1);
}
.status-badge.cancelled {
  color: #ff8787;
  background-color: rgba(255, 135, 135, 0.1);
}

/* Spinner */
.spinner {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
