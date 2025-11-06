<template>
    <div class = "cart-filled-state container">
        <section class = "cart-list-section">
            <h1 class = "cart-title">
                In your shopping cart.({{ cartStore.totalItems }})
                <span class="info-icon">ⓘ</span>
            </h1>

            <div class = "item-list">
                <CartItem 
                    v-for="item in cartStore.items"
                    :key="item.id"
                    :item="item"
                    />
            </div>
        </section>

        <aside class="cart-summary-section">
            <CartSummary 
                :subtotal="cartStore.subtotal"
                :total-items="cartStore.totalItems"
            />
        </aside>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCartStore } from '~/stores/cart';

const cartStore = useCartStore();

// 模拟推荐数据（实际应从 API 获取）
const recommendedTracks = ref([
    { id: 'rec_1', name: 'Summertime Spritz', price: 59 },
    { id: 'rec_2', name: 'Design in Motion', price: 49 },
    { id: 'rec_3', name: 'Nowhere to Go', price: 39 },
]);

onMounted(() => {
    // 💡 确保在进入页面时，购物车数据被加载 (尽管 index.vue 已经处理，这里冗余确保)
    if (cartStore.items.length === 0) {
        cartStore.loadCart();
    }
});
</script>

<style scoped>
/* 左右分栏布局，暗色主题样式 */
.cart-filled-state {
    display: flex; /* 启用 Flexbox 布局 */
    max-width: 1200px;
    margin: 0 auto;
    gap: 30px; /* 左右栏之间的间距 */
    padding: 30px 20px;
    color: #ffffff; /* 确保文字是白色 */
}

/* 左栏：商品列表 */
.cart-list-section {
    flex: 2; /* 左栏占据 2 份，约 66.6% */
    min-width: 0; /* 允许内容缩小 */
}

.cart-title {
    font-size: 2em;
    font-weight: bold;
    margin-bottom: 25px;
}

.info-icon {
    font-size: 0.7em;
    color: #ff9900;
    margin-left: 10px;
    cursor: pointer;
}

/* 右栏：购买摘要 */
.cart-summary-section {
    flex: 1; /* 右栏占据 1 份，约 33.3% */
    /* 保持右侧面板在滚动时固定（可选功能，可以后续添加） */
}

/* 推荐区域样式 */
.recommend-title {
    font-size: 1.3em;
    margin-top: 40px;
    margin-bottom: 15px;
    color: #ffffff; 
    border-bottom: 1px solid #444; /* 分隔线 */
    padding-bottom: 10px;
}

.recommend-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.recommend-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #222;
}

.rec-name {
    font-size: 1em;
    color: #ccc;
}

.add-btn {
    background-color: transparent;
    border: 1px solid #ff9900; 
    color: #ff9900;
    padding: 6px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.2s ease;
}

.add-btn:hover {
    background-color: #ff9900;
    color: #1a1a1a;
}
</style>