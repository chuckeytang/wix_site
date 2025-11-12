<template>
    <div class="orders-page-bg">
        <div class="orders-page">
            <AccountSubNav />
            <header class="orders-header">
                <h1 class="page-title">orders</h1>
                <div class="search-box-wrapper">
                    <input type="text" placeholder="search for orders" class="order-search-input"></input>
                    <svg class="search-icon" viewBox="0 0 24 24" width="20" height="20">
                        <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                </div>
            </header>
            <div class="orders-main-content">
                <OrderEmptyState v-if="orders.length === 0" />
                <OrderList v-else :orders="orders" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import OrderEmptyState from '~/components/account/orders/OrderEmptyState.vue';
import OrderList from '~/components/account/orders/OrderList.vue';

//const orders = ref([]); 
const orders = ref([
   { id: 101, title: 'Item 1', date: '2025-10-01', total: 49.99 },
   { id: 102, title: 'Item 2', date: '2025-10-15', total: 99.99 },
]);
</script>

<style scoped>
.orders-page-bg {
    width: 100%;
    background-color: #12121e; 
    min-height: 100vh;
}

.orders-page {
  padding-top: 80px; /* 页面内部垂直间距 */
  padding-bottom: 40px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #12121e;
}

/* --- 头部和搜索 --- */
.orders-header {
  display: flex;
  justify-content: space-between; /* 使标题和搜索框分布在两端 */
  align-items: center;
  margin-bottom: 50px;
}

/* .page-title { ... } */
.page-title {
  font-size: 2.5rem;
  font-weight: 600;
  color: #ff8c62; /* 标题颜色 */
}

/* .search-box-wrapper { ... } */
.search-box-wrapper {
  position: relative; /* 关键：使搜索图标可以相对于它定位 */
  display: flex;
  align-items: center;
}

/* .order-search-input { ... } */
.order-search-input {
  padding: 10px 15px 10px 40px; /* 增加左侧内边距 (40px) 给搜索图标留位置 */
  border: 1px solid #727272;
  border-radius: 20px; /* 圆角 */
  width: 250px;
  font-size: 1rem;
  background-color: #0a0a10;
  color: #f0f0f0;
}

/* .search-icon { ... } */
.search-icon {
  position: absolute; /* 关键：相对于 .search-box-wrapper 定位 */
  left: 10px; /* 距离左边缘 10px */
  color: #888;
}
</style>