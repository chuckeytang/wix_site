<template>
  <div>
    <h2>支付结果确认</h2>
    <p v-if="statusMessage">{{ statusMessage }}</p>
    <p v-if="orderId">订单 ID: {{ orderId }}</p>
    <p v-if="paymentIntentId">支付意图 ID: {{ paymentIntentId }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
// 假设您需要一个 API 来查询订单状态
// import { orderApi } from '~/api/orders';

const route = useRoute();
const orderId = route.query.orderId;
const statusMessage = ref("正在验证订单状态，请稍候...");
const paymentIntentId = ref(route.query.payment_intent as string | null);

onMounted(async () => {
  // 实际业务中：
  // 1. **前端轮询/查询：** 调用后端 API，传入 orderId 或 paymentIntentId。
  // 2. **后端验证：** 后端服务查询 OrderDetails 状态（此时应已被 Webhook 更新为 'PAID'）。
  // 3. **返回结果：** 后端返回最终状态。

  // 简单模拟
  if (route.query.redirect_status === "succeeded") {
    statusMessage.value = "🎉 支付成功！您的购买已完成，正在授权下载权限。";
  } else if (route.query.redirect_status === "processing") {
    statusMessage.value = "⏳ 支付正在处理中，请稍后查看您的订单历史。";
  } else if (route.query.redirect_status === "requires_payment_method") {
    statusMessage.value = "❌ 支付失败，请尝试其他支付方式。";
  }
});
</script>
