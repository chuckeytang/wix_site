// app/stores/cart.ts

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { CartItem } from '~/types/cart'; // 从类型文件导入

// ------------------------------------------------
// 辅助函数：模拟后端 API 延迟
// ------------------------------------------------
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useCartStore = defineStore('cart', () => {
    
    // ------------------------------------------------
    // 状态 (State)
    // ------------------------------------------------
    const items = ref<CartItem[]>([]);
    
    // ------------------------------------------------
    // Getters (计算属性)
    // ------------------------------------------------

    // 检查购物车是否为空
    const isEmpty = computed(() => items.value.length === 0);
    
    // 计算购物车中的总商品项数
    const totalItems = computed(() => items.value.length); 

    // 计算购物车中所有商品的总价（小计）
    const subtotal = computed(() => {
        return items.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
    });

    // ------------------------------------------------
    // Actions (方法)
    // ------------------------------------------------

    /**
     * 异步加载购物车数据 (与后端同步)
     */
    async function loadCart() {
        console.log("Cart Store: Calling Backend API: GET /cart...");
        await delay(500); // 模拟网络延迟
        
        // ⚠️ 实际应用中：
        // 1. const response = await cartApi.getCart();
        // 2. items.value = response.data; 
        
        // 模拟加载两项数据，用于填充 UI
        items.value = [
            { id: 'wix_p_1', trackId: 101, title: 'Clean Success', price: 59.00, quantity: 1, licenseType: 'Standard' },
            { id: 'wix_p_2', trackId: 102, title: 'Volume Up', price: 59.00, quantity: 1, licenseType: 'Standard' },
        ] as CartItem[];
        
        console.log(`Cart Store: 购物车数据加载完成，共 ${items.value.length} 项。`);
    }


    /**
     * 将商品添加到购物车 (异步操作，同步前后端)
     */
    async function addItem(
        track: { id: string, trackId: number, title: string, price: number }, 
        licenseType: string = 'Standard'
    ) {
        const existingItem = items.value.find(item => item.id === track.id);
        
        if (existingItem) {
             console.warn(`曲目 ${track.title} 已经存在于购物车中，跳过添加。`);
             return;
        }
        
        const newItem: CartItem = {
            id: track.id,
            trackId: track.trackId,
            title: track.title,
            price: track.price,
            quantity: 1,
            licenseType: licenseType,
        };
        
        // 1. (乐观更新) 立即在前端显示，优化用户体验
        items.value.push(newItem);

        try {
            // 2. 模拟调用后端 API 写入数据库
            console.log(`Cart Store: Calling Backend API: POST /cart/add Item: ${track.id}`);
            await delay(300); 
            // ⚠️ 实际代码中：await cartApi.addItem({ ... });
            
        } catch (error) {
            console.error("Cart Store: ⚠️ 添加商品到后端失败，回滚前端状态！", error);
            // 3. 错误处理：如果后端失败，从前端列表移除该项
            items.value = items.value.filter(item => item.id !== track.id);
            alert("添加商品失败，请检查网络或登录状态。");
        }
    }

    /**
     * 从购物车中移除指定的商品项 (异步操作，同步前后端)
     * @param itemId 商品项的ID (对应 CartItem.id)
     */
    async function removeItem(itemId: string) {
        const originalItems = items.value; // 备份原始数据
        
        // 1. (乐观更新) 立即从前端移除
        items.value = items.value.filter(item => item.id !== itemId);
        
        try {
            // 2. 模拟调用后端 API，让后端更新数据库
            console.log(`Cart Store: Calling Backend API: DELETE /cart/${itemId}...`);
            await delay(300); 
            // ⚠️ 实际代码中：await cartApi.removeItem(itemId);
            
        } catch (error) {
            console.error(`Cart Store: ⚠️ 移除商品 ${itemId} 失败，恢复前端状态！`, error);
            // 3. 错误处理：如果后端失败，恢复原始数据
            items.value = originalItems; 
            alert("移除商品失败，请重试！");
        }
    }

    // ------------------------------------------------
    // 导出 Store 的所有成员
    // ------------------------------------------------
    return {
        items,
        isEmpty,
        totalItems,
        subtotal,
        // 动作
        loadCart,
        addItem,
        removeItem,
    };
});