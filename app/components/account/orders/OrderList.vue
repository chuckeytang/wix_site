<template>
  <div class="order-list-container">
    <div v-if="loading" class="loading-message">
      <p>Loading orders...</p>
    </div>
    <div v-else-if="error" class="error-message">
      <p>Failed to load orders. Please try again.</p>
    </div>
    <div v-else>
      <p class="summary-text">recent {{ orders.length }} orders:</p>

      <table class="orders-table">
        <thead>
          <tr>
            <th>order ID</th>
            <th>data</th>
            <th>total</th>
            <th>state</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.orderId">
            <td>#{{ order.orderId }}</td>
            <td>{{ formatOrderDate(order.createdAt) }}</td>
            <td>
              ${{
                order.totalAmount !== undefined && order.totalAmount !== null
                  ? order.totalAmount.toFixed(2)
                  : "0.00"
              }}
            </td>
            <td>{{ formatStatus(order.status) }}</td>
          </tr>
          <tr v-if="orders.length === 0">
            <td colspan="4" class="no-data-row">no orders</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ordersApi } from "~/api/orders";
// 引入订单类型定义，与后端字段保持一致
// 假设 types/orders.ts 中的 OrderDetails 包含了 orderId, totalAmount, status, createdAt
import type { OrderDetails } from "~/types/orders";

const orders = ref<OrderDetails[]>([]);
const loading = ref(false);
const error = ref(false);
const pageSize = 10; // 每页显示数量

/**
 * 格式化订单状态显示
 */
const formatStatus = (status: string | undefined): string => {
  if (!status) return "Unknown";

  // 将后端大写/下划线格式转换为前端友好格式
  const normalizedStatus = status.toUpperCase();

  switch (normalizedStatus) {
    case "PAID":
      return "Paid";
    case "PENDING_PAYMENT":
      return "Pending";
    case "SHIPPED":
      return "Shipped";
    case "CANCELLED":
      return "Cancelled";
    default:
      return "Done";
  }
};

/**
 * 格式化订单日期显示
 * @param dateString 后端返回的日期字符串，如 "2025-11-07"
 */
const formatOrderDate = (dateString: string | undefined): string => {
  if (!dateString) return "N/A";

  try {
    // 后端返回的格式是 YYYY-MM-DD
    // 尝试将其解析为日期对象
    // 注意：某些浏览器可能需要 YYYY/MM/DD 格式，这里统一处理
    const parts = dateString.split("-");
    if (parts.length === 3) {
      // 构造 YYYY/MM/DD 格式
      return `${parts[0]}/${parts[1]}/${parts[2]}`;
    }

    // 如果无法解析，返回原字符串
    return dateString;
  } catch (e) {
    return "N/A";
  }
};

/**
 * 获取用户的订单列表
 */
const fetchUserOrders = async () => {
  loading.value = true;
  error.value = false;
  try {
    const response = await ordersApi.getUserOrders({
      pageNum: 1,
      pageSize: pageSize,
    });

    if (response.code === 200) {
      // 确保 rows 存在且是数组
      orders.value = Array.isArray(response.rows) ? response.rows : [];
    } else {
      error.value = true;
      console.error("Failed to fetch user orders:", response.msg);
    }
  } catch (e) {
    // 这里的错误可能是认证过期 (已在 axios.ts 中处理) 或网络错误
    error.value = true;
    console.error("API call error during order fetch:", e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUserOrders();
});
</script>
<style scoped>
.order-list-container {
  padding: 20px;
}

.summary-text {
  margin-bottom: 20px;
  font-size: 1.1rem;
  font-weight: 500;
  color: #eee;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  color: #fff;
}

.orders-table th,
.orders-table td {
  padding: 15px 0;
  border-bottom: 1px solid #fff;
}

.orders-table th {
  color: #fff;
  font-weight: 400;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.orders-table tbody tr:last-child td {
  border-bottom: none;
}
.no-data-row {
  text-align: center;
  color: #fff;
  font-style: italic;
}

.loading-message,
.error-message {
  text-align: center;
  padding: 30px;
  color: #a0a0a0;
}
</style>
