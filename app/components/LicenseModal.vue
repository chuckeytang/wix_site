<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      <header class="modal-header">
        <h2 class="modal-title">Licensing for {{ trackTitle }}</h2>
        <button class="close-button" @click="emit('close')">×</button>
      </header>
      <div class="modal-body">
        <h3 class="section-title">Single Track License Options</h3>

        <div class="license-option standard">
          <div class="details">
            <h4 class="option-title">Standard License</h4>
            <p class="option-description">
              1 Track Download · Commercial Work · Customer-facing content · 5
              Monetized Social Channels
            </p>
          </div>
          <div class="price">
            <div><span class="price-value">CA$1.99</span>/track</div>
            <button
              class="add-to-cart-button"
              @click="handleLicenseAddToCart('standard', 1.99)"
            >
              Add to Cart
            </button>
          </div>
        </div>

        <div class="license-option premium">
          <div class="details">
            <h4 class="option-title">Premium License</h4>
            <p class="option-description small-font">
              1 Track Download · TV & Radio, VOD/OTT · Apps, Games & Films ·
              Industrial Use · Unlimited Monetized Social Channels
            </p>
          </div>
          <div class="price">
            <div><span class="price-value">CA$3.99</span>/track</div>
            <button
              class="add-to-cart-button"
              @click="handleLicenseAddToCart('premium', 3.99)"
            >
              Add to Cart
            </button>
          </div>
        </div>

        <div class="license-option commercial">
          <div class="details">
            <h4 class="option-title">Commercial License</h4>
            <p class="option-description">
              1 Track Download · Extended Pro Content including all Premium
              features · Unlimited Monetized Social Channels
            </p>
          </div>
          <div class="price">
            <div><span class="price-value">CA$5.99</span>/track</div>
            <button
              class="add-to-cart-button"
              @click="handleLicenseAddToCart('commercial', 5.99)"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cartsApi } from "~/api/carts";
import type { CartItems } from "~/types/cartItems";
import { useRouter } from "vue-router";
import { useCartStore } from "~/stores/cart";

const props = defineProps<{
  isVisible: boolean;
  trackTitle: string;
  trackId: number;
  productType: "track" | "sfx" | "plan";
}>();

const emit = defineEmits(["close"]);
const router = useRouter();
const cartStore = useCartStore();

/**
 * 处理从许可模态框中添加到购物车
 * @param licenseOption 授权类型 (e.g., 'standard')
 * @param price 价格 (用于前端显示反馈，后端仍会查价)
 */
const handleLicenseAddToCart = async (licenseOption: string, price: number) => {
  if (licenseOption !== "standard") {
    // 弹出英文提示，说明该功能暂未开放
    alert(
      `The ${licenseOption} license is currently not available for purchase. Please select the Standard License.`
    );
    return;
  }

  // 1. 构建请求体 (保持不变)
  const itemToAdd: Partial<CartItems> = {
    productType: props.productType,
    productId: props.trackId,
    licenseOption: licenseOption,
    quantity: 1,
  };

  try {
    const result = await cartsApi.addItemToCart(itemToAdd);

    if (result.code === 200) {
      // ----------------------------------------------------
      // 刷新购物车状态
      // ----------------------------------------------------
      console.log(`Successfully added to cart. Syncing state...`);
      await cartStore.loadCart(); // 调用 Store 中的 Action 来刷新数据

      // 提示用户并设置延迟
      alert(`Track added to cart!`);

      emit("close");
    } else {
      alert(`Failed to add to cart: ${result.msg || "Unknown error"}`);
    }
  } catch (error) {
    console.error("Add to cart request failed:", error);
    // 假设错误是网络或登录问题
    alert(`Add to cart request failed: ${error}`);
  }
};
</script>

<style scoped>
/* 模态框背景层 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* 模态框主体内容 */
.modal-content {
  background-color: #212121;
  color: #fff;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #333;
}

.modal-title {
  font-size: 1.5em;
  font-weight: bold;
}

.close-button {
  background: none;
  border: none;
  color: #fff;
  font-size: 2em;
  cursor: pointer;
  line-height: 1;
  padding: 0;
}

.modal-body {
  padding: 20px;
}

.section-title {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 20px;
}

.license-option {
  background-color: #2c2c2c;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.3s;
}

.license-option:hover {
  background-color: #383838;
}

.option-title {
  font-size: 1.1em;
  font-weight: bold;
  margin: 0;
}

/* 描述文本的样式，新添加 */
.option-description {
  font-size: 0.9em;
  color: #ccc;
  margin: 5px 0 0;
}

/* 特定描述的字号调整 */
.option-description.small-font {
  font-size: 0.7em; /* 0.9em 减小 2 号，大约是 0.7em */
}

.price {
  text-align: right;
  flex-shrink: 0;
  /* 调整 flexbox 布局以垂直对齐价格和按钮 */
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* 右对齐 */
  gap: 10px;
}

.price-value {
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 8px; /* 在价格和按钮之间增加间距 */
}

.add-to-cart-button {
  background-color: #ff8c62;
  color: #0d0d1a;
  border: none;
  border-radius: 50px;
  padding: 10px 20px;
  font-size: 0.9em;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  /* margin-top: 10px; 原有的已移除，因为父容器是flex-direction: column */
}

.add-to-cart-button:hover {
  background-color: #e67a54;
}
</style>
