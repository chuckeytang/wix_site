// types/plans.ts

/**
 * 订阅计划类型定义
 */
export interface Plans {
  planId?: number; // 订阅计划ID
  wixPlanId: string; // Wix订阅计划ID
  title: string; // 计划名称
  description?: string; // 计划描述
  imageUrl?: string; // 计划图片URL
  annualPrice?: number; // 年度价格
  monthlyPrice?: number; // 月度价格
  isRecommended?: number; // 是否为推荐计划（0否，1是）
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
