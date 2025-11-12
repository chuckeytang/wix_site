<template>
  <div class="cart-summary">
    <div class="purchase-options-card">
      <label class="option-row">
        <input
          type="radio"
          name="purchase-type"
          value="one-time"
          v-model="selectedPurchaseType"
          checked
        />
        <div class="option-details">
          <span class="type-title">One-time purchase</span>
          <span class="price-display" v-if="false"
            >US$ {{ subtotal.toFixed(2) }}</span
          >
        </div>
      </label>

      <!--
      <label class="option-row subscription-option">
        <input
          type="radio"
          name="purchase-type"
          value="subscription"
          v-model="selectedPurchaseType"
        />
        <div class="option-details">
          <span class="type-title">Subscription for unlimited downloads</span>
          <span class="price-display sub-price">US$24.99 /month</span>
          <span class="annual-note">Billed annually at US$299.88</span>
        </div>
      </label>
      -->

      <button
        class="checkout-button"
        @click="handleCheckout"
        :disabled="totalItems === 0"
      >
        proceed to checkout
      </button>
    </div>

    <div class="price-details">
      <div class="detail-row">
        <span>Subtotal of Goods ({{ totalItems }} items)</span>
        <span>US$ {{ subtotal.toFixed(2) }}</span>
      </div>
      <div class="detail-row total-row">
        <span>Total</span>
        <span>US$ {{ subtotal.toFixed(2) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from "vue";
import { useRouter } from "vue-router";
import { cartsApi } from "~/api/carts";
import { useCartStore } from "~/stores/cart";

// ----------------------------------------------------
// Props：接收父组件 (CartFilledState.vue) 传递的数据
// ----------------------------------------------------
const props = defineProps({
  subtotal: {
    type: Number,
    required: true,
    default: 0,
  },
  totalItems: {
    type: Number,
    required: true,
    default: 0,
  },
});

const router = useRouter();
const cartStore = useCartStore();

// 状态：用于控制用户选择了哪种购买方式（一次性或订阅）
const selectedPurchaseType = ref("one-time");
// 声明一个事件，用于通知父组件开始结算
const emit = defineEmits(["startCheckout"]);

// ----------------------------------------------------
// Actions：处理结算逻辑
// ----------------------------------------------------
const handleCheckout = async () => {
  if (props.totalItems === 0) {
    console.error("Cart is empty, cannot proceed to checkout.");
    return;
  }

  // 1. **订阅/单次购买逻辑分支（未来扩展）**
  if (selectedPurchaseType.value === "subscription") {
    alert(
      "Subscription checkout is not yet implemented. Please choose One-time purchase."
    );
    return;
  }

  // 2. **一次性购买：从购物车创建订单**
  try {
    // 💡 购物车结算不需要传递购买商品信息，因为它在后端直接读取用户的购物车内容
    const orderResult = await cartsApi.submitCartToOrder();

    if (orderResult.code !== 200 || !orderResult.data) {
      alert(`Checkout failed: ${orderResult.msg || "Failed to create order."}`);
      return;
    }
    const newOrder = orderResult.data;

    // 3. **创建 Payment Intent**
    const paymentIntentResult = await cartsApi.createPaymentIntent(
      newOrder.orderId
    );

    if (
      paymentIntentResult.code !== 200 ||
      !paymentIntentResult.data?.clientSecret
    ) {
      alert(
        `Payment failed: ${paymentIntentResult.msg || "Failed to create payment intent."}`
      );
      return;
    }
    const clientSecret = paymentIntentResult.data.clientSecret;
    // 3. 通知父组件，并传递支付所需数据
    emit("startCheckout", {
      orderId: newOrder.orderId,
      clientSecret: clientSecret,
    });
  } catch (error) {
    console.error("Checkout process failed:", error);
    alert(`Checkout process failed. Please check network and login state.`);
  }
};
</script>

<style scoped>
/* 侧边栏容器，与左侧内容保持间距 */
.cart-summary {
  position: sticky; /* 尝试固定在侧边栏 */
  top: 100px;
  padding: 10px 0;
}

/* 购买选项卡片：浅色背景，在深色背景中突出 */
.purchase-options-card {
  background-color: #f7f7f7; /* 浅米白色 */
  color: #1a1a1a;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  margin-bottom: 25px;
}

.option-row {
  display: flex;
  align-items: flex-start;
  padding: 15px 0;
  cursor: pointer;
  border-bottom: 1px solid #ddd;
}
.option-row:last-of-type {
  border-bottom: none;
}

/* 单选按钮样式 */
.option-row input[type="radio"] {
  margin-right: 15px;
  margin-top: 3px;
  accent-color: #ff9900; /* 使用品牌橙色作为单选框的颜色 */
}

.option-details {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.type-title {
  font-weight: bold;
  font-size: 1em;
}

.price-display {
  font-weight: bold;
  font-size: 1.1em;
  align-self: flex-end; /* 价格靠右对齐 */
  margin-left: auto;
}

.subscription-option .type-title {
  font-weight: normal;
  font-size: 0.9em;
}

.sub-price {
  color: #ff9900; /* 订阅价格使用重点色 */
}

.annual-note {
  font-size: 0.7em;
  color: #888;
  align-self: flex-end;
}

/* 结算按钮 */
.checkout-button {
  width: 100%;
  background-color: #ff8c62;
  color: #1a1a1a;
  font-weight: bold;
  padding: 15px 0;
  margin-top: 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1em;
  transition: background-color 0.3s;
}

.checkout-button:hover:not(:disabled) {
  background-color: #ff8c62;
}

.checkout-button:disabled {
  background-color: #aaaaaa;
  cursor: not-allowed;
}

/* 价格详情 (卡片下方) */
.price-details {
  padding: 15px;
  background-color: #333333; /* 略浅的深色 */
  border-radius: 8px;
  color: #ffffff;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  font-size: 0.9em;
  border-bottom: 1px dashed #444;
}

.total-row {
  padding-top: 10px;
  font-size: 1.1em;
  font-weight: bold;
  border-bottom: none;
}
</style>
