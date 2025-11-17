// /src/composables/useAddToCart.ts

import { ref } from 'vue'; // 引入 ref 用于状态管理
import { cartsApi } from '~/api/carts'; // 假设 API 路径
import { useCartStore } from '~/stores/cart'; // 假设 Pinia Store 路径
import { useAuthStore } from '~/stores/auth'; // 假设 Pinia Store 路径
import type { CartItems } from '~/types/cartItems'; // 假设购物车项的类型定义

// ---------------------------------------------
// 1. 类型定义
// ---------------------------------------------

/**
 * 传入 addToCart 函数的参数接口
 */
interface AddToCartParams {
  productId: number;
  productType: 'track' | 'sfx' | 'plan';
  licenseOption: string; // 例如 'standard', 'premium'
  quantity?: number; // 默认为 1
  trackTitle?: string; // 用于前端提示信息
}

// ---------------------------------------------
// 2. 组合式函数
// ---------------------------------------------

export function useAddToCart() {
  const cartStore = useCartStore();
  const authStore = useAuthStore();
  
  // 状态管理：用于在按钮上显示“加载中”或“错误”
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * 将产品添加到购物车的核心方法
   */
  const handleAddToCart = async ({ 
    productId, 
    productType, 
    licenseOption, 
    quantity = 1,
    trackTitle = '此曲目' 
  }: AddToCartParams): Promise<boolean> => {
    isLoading.value = true;
    error.value = null; // 重置错误状态

    // 1. 登录检查
    if (!authStore.isAuthenticated) {
      alert("请先登录才能购买授权！");
      // 触发登录对话框并返回
      authStore.openLoginDialog(); 
      isLoading.value = false;
      return false;
    }

    // 2. 构建请求体
    const itemToAdd: Partial<CartItems> = {
      productType,
      productId,
      licenseOption,
      quantity,
    };

    try {
      // 3. 调用后端 API
      const result = await cartsApi.addItemToCart(itemToAdd);

      if (result.code === 200) {
        // 4. 刷新购物车状态
        console.log(`Successfully added track ${productId}. Syncing cart...`);
        await cartStore.loadCart();
        
        // 5. 成功提示
        alert(`${trackTitle} 已成功添加到购物车！`);
        return true;
      } else {
        // 6. 业务错误处理
        const errMsg = result.msg || "未知错误，请重试。";
        error.value = errMsg;
        alert(`添加购物车失败: ${errMsg}`);
        return false;
      }
    } catch (err) {
      // 7. 网络或系统错误处理
      console.error("Add to cart request failed:", err);
      error.value = "网络请求失败，请检查您的网络连接。";
      alert("网络请求失败，请检查您的网络连接。");
      return false;
    } finally {
      // 无论成功或失败，都结束加载状态
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    error,
    handleAddToCart,
  };
}