// app/types/orders.ts

// 简化的 Track/Sfx 类型，仅用于订单显示
export interface OrderItemProduct {
  title: string;
  artist?: string;
  type?: string;
  genres?: string;
}

export interface OrderItems {
  orderItemId: number;
  productType: "track" | "sfx" | "plan";
  purchasePrice: number;
  licenseOption?: string;
  // 对应后端关联查询出来的对象
  track?: OrderItemProduct;
  sfx?: OrderItemProduct;
}

/**
 * 订单实体类型定义
 */
export interface OrderDetails {
  orderId: number; // 订单ID

  // 核心字段，匹配后端 JSON
  status: "PENDING_PAYMENT" | "PAID" | "CANCELLED" | string; // 订单状态
  totalAmount: number; // 订单总金额
  createdAt: string; // 记录创建时间

  currency?: string; // 货币类型
  // 包含 items 数组
  items: OrderItems[];
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
