// app/stores/cart.ts

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { cartsApi } from "~/api/carts";
import type { CartItems } from "~/types/cartItems";
import type { Carts } from "~/types/carts";

// ------------------------------------------------
// 辅助函数：模拟后端 API 延迟
// ------------------------------------------------
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const { showToast } = useToast();

export const useCartStore = defineStore("cart", () => {
  // ------------------------------------------------
  // 状态 (State)
  // ------------------------------------------------
  const items = ref<CartItems[]>([]);
  const cart = ref<Carts | null>(null);

  // ------------------------------------------------
  // Getters (计算属性)
  // ------------------------------------------------

  // 检查购物车是否为空
  const isEmpty = computed(() => items.value.length === 0);

  // 计算购物车中的总商品项数
  const totalItems = computed(() => items.value.length);

  // 计算购物车中所有商品的总价（小计）
  const subtotal = computed(() => {
    return items.value.reduce(
      (sum, item) => sum + (item.priceAtAddition || 0) * (item.quantity || 1),
      0
    );
  });

  // ------------------------------------------------
  // Actions (方法)
  // ------------------------------------------------

  /**
   * 异步加载购物车数据 (与后端同步)
   */
  async function loadCart() {
    try {
      console.log(
        "Cart Store: Calling Backend API: GET /site/carts/user/current..."
      );
      const response = await cartsApi.getUserCart(); // 调用查询购物车 API

      if (response.code === 200 && response.data) {
        cart.value = response.data;
        items.value = response.data.items || []; // items 列表
        console.log(
          `Cart Store: Shopping cart data loaded, totaling ${items.value.length} items.`
        );
      } else if (response.code === 200 && !response.data) {
        // 后端返回成功，但没有购物车对象（可能是新用户，后端已创建空购物车）
        cart.value = null;
        items.value = [];
      } else {
        console.error("Cart Store: Failed to load cart data:", response.msg);
      }
    } catch (error) {
      console.error("Cart Store: Failed to fetch cart data:", error);
    }
  }

  /**
   * 将商品添加到购物车 (异步操作，调用后端并刷新)
   */
  async function addItemAndRefresh(itemData: {
    productId: number;
    productType: "track" | "sfx" | "plan";
    licenseOption: string;
  }) {
    try {
      console.log(`Cart Store: Calling Backend API: POST /cart-items/add...`);
      // 1. 调用后端 API 添加项目 (后端会处理价格、创建/查找购物车等)
      const response = await cartsApi.addItemToCart(itemData);

      if (response.code === 200) {
        // 2. 添加成功后，刷新整个购物车状态
        await loadCart();
        return true;
      } else {
        showToast(`Adding product failed: ${response.msg}`);
        return false;
      }
    } catch (error) {
      console.error("Cart Store: Failed to add product!", error);
      showToast(
        "Adding a product failed. Please check your network or login status."
      );
      return false;
    }
  }

  /**
   * 从购物车中移除指定的商品项 (异步操作，同步前后端)
   * @param cartItemId 购物车项目ID (对应 CartItems.cartItemId)
   */
  async function removeItem(cartItemId: number) {
    // 接收 number 类型的 cartItemId
    const originalItems = items.value; // 备份原始数据

    // 1. (乐观更新) 立即从前端移除
    items.value = items.value.filter((item) => item.cartItemId !== cartItemId);

    try {
      // 2. 调用后端 API
      console.log(
        `Cart Store: Calling Backend API: DELETE /site/cart-items/${cartItemId}...`
      );
      await cartsApi.deleteItemFromCart(cartItemId); // 调用删除 API

      console.log(`Cart Item ${cartItemId} successfully removed from backend.`);
    } catch (error) {
      console.error(
        `Cart Store: Removing item ${cartItemId} failed, restore front-end state!`,
        error
      );
      // 3. 错误处理：如果后端失败，恢复原始数据
      items.value = originalItems;
      showToast("Product removal failed, please try again!");
    }
  }

  /**
   * 清空购物车中的所有商品项
   */
  async function clearCart() {
    // 1. 调用后端 API 清空购物车（如果需要，一般由支付成功后的 Webhook 处理）
    // 为了前端视觉效果，我们首先修改本地状态
    items.value = [];
    cart.value = null; // 重置购物车对象

    // 可以在这里调用后端 API。但标准流程是在支付成功后通过 Webhook/Success Page处理。
    console.log("Cart Store: Frontend shopping cart cleared.");
  }

  // ------------------------------------------------
  // 导出 Store 的所有成员
  // ------------------------------------------------
  return {
    items,
    cart,
    isEmpty,
    totalItems,
    subtotal,
    // 动作
    loadCart,
    addItem: addItemAndRefresh,
    removeItem,
    clearCart,
  };
});
