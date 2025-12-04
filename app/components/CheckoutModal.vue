<template>
  <div class="modal-overlay" v-if="isVisible">
    <div class="modal-card">
      <div class="modal-header">
        <h2 class="modal-title">Order Payment</h2>
        <button class="close-button" @click="handleClose">&times;</button>
      </div>

      <div class="modal-body">
        <div v-if="loading" class="loading-message">
          Loading payment information...
        </div>
        <div v-if="error" class="error-message">{{ error }}</div>

        <div id="payment-element" class="payment-element-container"></div>
      </div>

      <div class="terms-container">
        <label class="checkbox-label">
          <input
            type="checkbox"
            v-model="isAgreementChecked"
            class="terms-checkbox"
          />
          <span class="checkbox-text">
            I have read and agree to the terms of the
            <span class="link-text" @click.stop="openAgreement"
              >Verscape License Agreement</span
            >.
          </span>
        </label>
      </div>

      <div class="modal-footer">
        <button
          @click="handleSubmit"
          :disabled="!isStripeReady || loading || !isAgreementChecked"
          class="submit-button"
        >
          <span v-if="loading">Processing...</span>
          <span v-else>Pay {{ formattedAmount }}</span>
        </button>
      </div>
    </div>

    <LicenseAgreementModal
      :is-visible="showAgreementModal"
      @close="showAgreementModal = false"
      @confirm="handleAgreementConfirmed"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onUnmounted, nextTick } from "vue";
import type { Stripe, StripeElements } from "@stripe/stripe-js";
import { useRoute, useRouter } from "vue-router";
import { useCartStore } from "~/stores/cart";
import LicenseAgreementModal from "~/components/LicenseAgreementModal.vue";

const router = useRouter();
const route = useRoute();
// 1. Props: 接收父组件传递的控制参数
const props = defineProps<{
  isVisible: boolean;
  clientSecret: string | null;
  orderId: number | null;
  returnPath: string | null;
  amount: number;
  currency: string;
}>();

// 2. Emits: 定义事件，通知父组件关闭
const emit = defineEmits(["close", "paymentInitiated"]);

// 3. 注入和状态
const nuxtApp = useNuxtApp();
const stripeInstance = nuxtApp.$stripe as Stripe | null;

const loading = ref(false);
const error = ref<string | null>(null);
const isStripeReady = ref(false);
let elements: any | null = null; // Stripe Elements 实例
const cartStore = useCartStore();
const paymentElementRef = ref<any | null>(null);
const elementsRef = ref<StripeElements | null>(null);

const isAgreementChecked = ref(false);
const showAgreementModal = ref(false);

const formattedAmount = computed(() => {
  if (!props.amount || !props.currency) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: props.currency.toUpperCase(),
  }).format(props.amount);
});

// 监听 isVisible 属性，并使用 nextTick
watch(
  () => props.isVisible,
  async (newVal) => {
    if (newVal && props.clientSecret) {
      isAgreementChecked.value = false; // 每次打开重置
      if (props.clientSecret) {
        await nextTick();
        await initializeStripe(props.clientSecret);
      }
    } else if (!newVal) {
      // 🚀 当模态框关闭时，执行清理
      cleanupElements();
    }
  }
);

/**
 * 🚀 清理 Stripe Elements 实例
 */
const cleanupElements = () => {
  if (paymentElementRef.value) {
    paymentElementRef.value.destroy();
    paymentElementRef.value = null;
  }
  // 清理 Elements 实例 (不可销毁，但可置空引用)
  elementsRef.value = null;
};

const initializeStripe = async (secret: string) => {
  if (!stripeInstance) {
    error.value = "Stripe SDK not fully loaded. Please refresh.";
    return;
  }

  error.value = null; // 清除之前的错误
  isStripeReady.value = false;
  loading.value = true;

  cleanupElements();

  try {
    elementsRef.value = stripeInstance.elements({
      clientSecret: secret,
      appearance: {
        theme: "night",
        variables: {
          colorPrimary: "#ff8c62",
          borderRadius: "4px",
          // 可以在这里微调字体大小
          fontSizeBase: "15px",
        },
        rules: {
          ".Input": {
            border: "1px solid #444", // 让输入框边框更明显
          },
        },
      },
    }); // elements 被设置为 any
    // 确保目标元素存在 (在 nextTick 中调用后，这里应该安全了)
    const targetElement = document.querySelector("#payment-element");
    if (!targetElement) {
      throw new Error("Payment Element target not found in DOM.");
    }

    // 2. 创建 Payment Element 并挂载
    const paymentElement = elementsRef.value!.create("payment");
    paymentElementRef.value = paymentElement;
    paymentElement.mount("#payment-element");

    isStripeReady.value = true;
  } catch (e) {
    error.value = "Failed to initialize payment form. Please try again.";
    console.error("Stripe Elements initialization error:", e);
  } finally {
    loading.value = false;
  }
};

// 5. 提交支付
const handleSubmit = async () => {
  if (!isAgreementChecked.value) return;
  if (!stripeInstance || !elementsRef.value) return;
  loading.value = true;
  error.value = null;

  const returnUrl = `${window.location.origin}/payment-status?orderId=${props.orderId}&returnPath=${encodeURIComponent(props.returnPath || "/")}`;

  // 提交支付
  const { error: stripeError, paymentIntent } =
    await stripeInstance.confirmPayment({
      // 🚀 传递 elementsRef.value
      elements: elementsRef.value,
      confirmParams: {
        return_url: returnUrl,
      },
      redirect: "if_required",
    });

  if (stripeError) {
    // 如果必填项（如地址）为空，Stripe 会在这里报错，并在 UI 上显示红色提示
    error.value = stripeError.message || "Payment failed.";
    loading.value = false;
  } else if (paymentIntent && paymentIntent.status === "succeeded") {
    // 支付成功
    try {
      await cartStore.clearCart();
    } catch (e) {
      console.error("Failed to refresh cart", e);
    }
    window.location.href = returnUrl;
  }
};

const handleClose = () => {
  // 1. 清理本地状态和 Stripe
  error.value = null;
  loading.value = false;
  isStripeReady.value = false;
  cleanupElements(); // 确保销毁实例

  // 2. 检查是否在购物车页面
  const currentPath = route.path;

  if (currentPath === "/cart" || currentPath === "/cart/index") {
    cartStore.clearCart();
    router.push("/account/orders");
  } else {
    // 3. 否则，通知父组件关闭
    emit("close");
  }
};

const openAgreement = () => {
  showAgreementModal.value = true;
};

const handleAgreementConfirmed = () => {
  isAgreementChecked.value = true;
  showAgreementModal.value = false;
};

// 确保在组件销毁时清理 elements
onUnmounted(() => {
  cleanupElements();
});
</script>

<style scoped>
/* ------------------------------------------------------------- */
/* 统一网站风格的样式 */
/* ------------------------------------------------------------- */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* 深色半透明背景，与网站 #0d0d1a 主题匹配 */
  background-color: rgba(13, 13, 26, 0.95);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 5vh;
  z-index: 1000; /* 确保在所有元素之上 */
}

.modal-card {
  width: 90%;
  max-width: 550px;
  /* 模态框背景色，略浅于背景 */
  background-color: #1a1a2e;
  border-radius: 10px;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 30px;
  transition: transform 0.3s ease-out;
  max-height: 90vh; /* 确保模态框不会超过视窗高度 */
  overflow: hidden; /* 隐藏模态框本身的滚动条，控制到 body 里面 */
  display: flex;
  flex-direction: column;
}

.modal-body {
  flex-grow: 1;
  overflow-y: auto;
  /* 调整高度计算，给条款留空间 */
  max-height: calc(90vh - 220px);
  padding: 10px 0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #333;
  padding-bottom: 15px;
  margin-bottom: 25px;
}

.modal-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #ff8c62; /* 网站主色调 */
}

.order-summary {
  background-color: rgba(255, 140, 98, 0.1); /* 淡淡的主色背景 */
  border: 1px solid rgba(255, 140, 98, 0.3);
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;
}

.summary-label {
  color: #ccc;
}

.summary-amount {
  font-weight: bold;
  color: #fff;
  font-size: 1.4rem;
}

.close-button {
  background: none;
  border: none;
  color: #ccc;
  font-size: 2rem;
  cursor: pointer;
  line-height: 1;
  transition: color 0.3s;
}

.close-button:hover {
  color: #ff8c62;
}

.modal-body {
  /* 关键：让 body 区域可以滚动 */
  flex-grow: 1; /* 允许 body 占据可用空间 */
  overflow-y: auto; /* 当内容溢出时，启用垂直滚动条 */
  /* 减去 header/footer 的高度，以确保内容区可滚动 */
  max-height: calc(
    90vh - 180px
  ); /* 90vh 减去 header/footer/padding 的大致高度 */
  padding: 10px 0;
}

.payment-element-container {
  /* Stripe Element 容器的样式 */
  padding: 15px 0;
}

.modal-footer {
  padding-top: 20px;
  text-align: center;
  border-top: 1px solid #333;
}

.submit-button {
  padding: 12px 30px;
  background-color: #ff8c62;
  color: #0d0d1a;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition:
    background-color 0.3s,
    opacity 0.3s;
}

.submit-button:hover:not(:disabled) {
  background-color: #e67a54;
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-message,
.error-message {
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 4px;
}

.loading-message {
  color: #ff8c62;
}

.error-message {
  background-color: #581515;
  color: #ff4747;
}

.terms-container {
  padding: 15px 0 0 0;
  border-top: 1px solid #333;
  margin-top: 10px;
}

.checkbox-label {
  display: flex;
  align-items: flex-start; /* 顶部对齐，应对多行文字 */
  gap: 10px;
  cursor: pointer;
  font-size: 0.95rem;
  color: #ccc;
  line-height: 1.4;
}

.terms-checkbox {
  margin-top: 3px; /* 微调对齐 */
  accent-color: #ff8c62; /* 浏览器支持的原生着色 */
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.link-text {
  color: #ff8c62;
  text-decoration: underline;
  cursor: pointer;
  font-weight: bold;
}

.link-text:hover {
  color: #e67a54;
}

.modal-footer {
  padding-top: 20px;
  text-align: center;
  border-top: none; /* 移除原来的 border，因为上面 terms-container 有了 */
}

/* Submit button disabled state styling already exists, ensuring logic works */
.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #555;
}
</style>
