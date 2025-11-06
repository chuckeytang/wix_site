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
            <span class="price-display" v-if="false">US$ {{ subtotal.toFixed(2) }}</span>
          </div>
        </label>
  
        <label class="option-row subscription-option">
          <input 
            type="radio" 
            name="purchase-type" 
            value="subscription" 
            v-model="selectedPurchaseType" 
          />
          <div class="option-details">
            <span class="type-title">订阅可以获取无限制的下载权限</span>
            <span class="price-display sub-price">US$24.99 /月</span>
            <span class="annual-note">年费折合 US$299.88</span>
          </div>
        </label>
  
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
          <span>total</span>
          <span>US$ {{ subtotal.toFixed(2) }}</span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps } from 'vue';
  import { useRouter } from 'vue-router';
  
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
  
  // 状态：用于控制用户选择了哪种购买方式（一次性或订阅）
  const selectedPurchaseType = ref('one-time');
  
  // ----------------------------------------------------
  // Actions：处理结算逻辑
  // ----------------------------------------------------
  const handleCheckout = () => {
    if (props.totalItems === 0) {
      console.error("Cart is empty, cannot proceed to checkout.");
      return;
    }
    
    const type = selectedPurchaseType.value === 'one-time' ? '一次性购买' : '订阅';
    console.log(`准备以 [${type}] 方式进行结算...`);
    
    // 💡 在实际应用中，这里应该：
    // 1. 调用后端 API 生成订单 (Create Order)
    // 2. 根据后端返回的支付 URL，重定向到 Wix 或 Stripe 等支付网关
    
    // 示例：重定向到 Wix/外部支付页面
    // window.location.href = 'YOUR_WIX_CHECKOUT_URL';
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
      background-color: #ff9900;
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
      background-color: #e68a00;
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