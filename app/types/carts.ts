// types/carts.ts

import type { CartItems } from "./cartItems";

/**
 * 购物车类型定义
 * 对应后端 Carts 实体
 */
export interface Carts {
  cartId?: number; // 购物车ID
  userId: number; // 外键，关联 users 表
  createdAt?: string; // 创建时间
  updatedAt?: string; // 更新时间

  // --- 关联的购物车项目列表 ---
  items?: CartItems[]; // 关联的购物车项目列表

  // 可以在此添加计算字段，例如总价
  totalPrice?: number; // 购物车总金额 (通常由后端返回或前端计算)
  itemCount?: number; // 购物车项目总数量 (通常由后端返回或前端计算)
}
