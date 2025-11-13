// app/types/orders.ts

/**
 * 订单实体类型定义 (对应后端实际返回的 OrderDetails 字段)
 */
export interface OrderDetails {
  orderId: number; // 订单ID
  userId?: number; // 下单用户ID (假设该字段可能存在)

  // 核心字段，匹配后端 JSON
  status: "PENDING_PAYMENT" | "PAID" | "CANCELLED" | string; // 订单状态 (后端返回的是 status)
  totalAmount: number; // 订单总金额 (后端返回的是 totalAmount)
  createdAt: string; // 记录创建时间 (后端返回的是 createdAt)

  paymentTime?: string; // 支付时间
  currency?: string; // 货币类型
  paymentIntentId?: string; // 支付意图ID
  // ... 其他字段，如 createBy, updateTime, remark, items
}

/**
 * 分页查询结果类型定义 (若依框架标准)
 */
export interface PaginationResult<T> {
  total: number; // 总条数
  rows: T[]; // 数据列表
  code: number; // 状态码
  msg: string; // 提示信息
}
