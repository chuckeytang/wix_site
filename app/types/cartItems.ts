// types/cartItems.ts

import type { Sfx } from "./sfx";
import type { Tracks } from "./tracks";
// import type { Sfx } from "./sfx"; // 如果您有 Sfx 类型，也需要导入

/**
 * 购物车项目类型定义
 * 对应后端 CartItems 实体
 */
export interface CartItems {
  cartItemId?: number; // 购物车项目ID
  cartId: number; // 外键，关联 carts 表
  productType: "track" | "sfx" | "plan"; // 产品类型 ('track' 或 'sfx')
  productId: number; // 音乐(track_id)或音效(sfx_id) ID
  licenseOption: string; // 购买的授权类型/版本 (例如: 'standard', 'premium')
  quantity: number; // 数量
  priceAtAddition: number; // 加入购物车时的价格 (使用 number 代替 BigDecimal)
  addedAt?: string; // 加入购物车时间

  // --- 关联对象 (用于购物车详情展示) ---
  track?: Tracks; // 关联的音乐曲目信息
  sfx?: Sfx; // 关联的音效信息
}
