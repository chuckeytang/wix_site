// types/orders.ts

/**
 * 订单详情类型定义
 */
export interface OrderDetails {
  orderId?: number; // 订单ID
  wixOrderId: string; // Wix订单ID
  createdAt?: string; // 记录创建时间
  updatedAt?: string; // 记录更新时间
}

/**
 * 分页查询结果类型定义
 * 若依框架分页返回的数据格式
 */
export interface PaginationResult<T> {
  total: number; // 总条数
  rows: T[]; // 数据列表
  code: number; // 状态码
  msg: string; // 提示信息
}
