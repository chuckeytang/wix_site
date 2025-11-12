<template>
    <div class="order-list-container">
      <p class="summary-text">recent {{ orders.length }} orders:</p>
      
      <table class="orders-table">
        <thead>
          <tr>
            <th>order ID</th>
            <th>data</th>
            <th>total</th>
            <th>state</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>#{{ order.id }}</td>
            <td>{{ order.date }}</td>
            <td>${{ order.total.toFixed(2) }}</td>
            <td>{{ order.status || 'done' }}</td>
          </tr>
          <tr v-if="orders.length === 0">
              <td colspan="4" class="no-data-row">no orders</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup lang="ts">
  // 定义组件接收的 props 类型
  interface Order {
    id: number;
    title: string;
    date: string;
    total: number;
    status?: string;
  }
  
  // 接收父组件传递过来的订单数组
  const props = defineProps<{
    orders: Order[];
  }>();
  </script>
  
  <style scoped>
  .order-list-container {
    padding: 20px;
  }
  
  .summary-text {
    margin-bottom: 20px;
    font-size: 1.1rem;
    font-weight: 500;
    color: #eee;
  }
  
  .orders-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    color: #fff;
  }
  
  .orders-table th, .orders-table td {
    padding: 15px 0;
    border-bottom: 1px solid #fff;
  }
  
  .orders-table th {
    color: #fff;
    font-weight: 400;
    font-size: 0.9rem;
    text-transform: uppercase;
  }
  
  .orders-table tbody tr:last-child td {
    border-bottom: none;
  }
  .no-data-row {
    text-align: center;
    color: #fff;
    font-style: italic;
  }
  </style>