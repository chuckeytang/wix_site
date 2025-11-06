<template>
  <div class="checkout-container">
    <h2>订单支付</h2>
    <div v-if="loading">正在加载支付信息...</div>
    <div v-if="error" class="error-message">{{ error }}</div>

    <div id="payment-element" class="payment-element-container"></div>

    <button @click="handleSubmit" :disabled="!isStripeReady">确认并支付</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Stripe, StripeElements } from "@stripe/stripe-js";

// 假设我们通过插件注入了 $stripe 实例
const nuxtApp = useNuxtApp();
// 假设 $stripe 已经被注入并且是 Stripe 类型
const stripeInstance = nuxtApp.$stripe as Stripe | null;
let elements: StripeElements | null = null;
const route = useRoute();
const router = useRouter();

// 从路由获取关键参数
const clientSecret = ref(route.query.clientSecret as string | null);
const orderId = ref(route.query.orderId as string | null);

const loading = ref(false);
const error = ref<string | null>(null);
const isStripeReady = ref(false);

onMounted(async () => {
  if (!stripeInstance || !clientSecret.value) {
    error.value = "支付信息不完整或 Stripe SDK 未加载。";
    return;
  }

  isStripeReady.value = true;

  // 1. 初始化 Elements (现在 TypeScript 应该知道 stripeInstance 有 elements 方法)
  elements = stripeInstance.elements({ clientSecret: clientSecret.value });
  // 2. 创建 Payment Element 并挂载
  const paymentElement = elements.create("payment");
  paymentElement.mount("#payment-element");
});

const handleSubmit = async () => {
  if (!stripeInstance || !elements) {
    error.value = "Stripe 未初始化。";
    return;
  }

  loading.value = true;
  error.value = null;

  // 3. 确认支付
  // 当 confirmPayment 调用时，Stripe.js 会尝试用 Elements 中的信息完成支付
  const { error: stripeError } = await stripeInstance.confirmPayment({
    elements,
    confirmParams: {
      // 支付完成后，Stripe 会自动重定向到这个 URL
      return_url: `${window.location.origin}/payment-status?orderId=${orderId.value}`,
    },
  });

  if (stripeError) {
    // 在此处向用户显示任何错误或失败消息
    error.value = stripeError.message || "支付过程中发生错误。";
    loading.value = false;
  } else {
    // 支付成功 (通常在重定向到 return_url 后处理)
    // 这里的代码可能不会执行，因为 confirmPayment 会导致重定向
  }
};
</script>

<style scoped>
.checkout-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  background-color: #1a1a2e;
  border-radius: 8px;
  color: white;
}
.payment-element-container {
  padding: 10px;
  border: 1px solid #333;
  border-radius: 4px;
  margin-bottom: 20px;
  background-color: #0d0d1a;
}
.error-message {
  color: red;
  margin-bottom: 15px;
}
button {
  padding: 10px 20px;
  background-color: #ff8c62;
  color: #0d0d1a;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
