// app/types/users.ts

import type { Tags } from "./tags"; // 假设 tags.ts 存在

/**
 * 站点用户类型定义 (对应后端 Users 实体)
 */
export interface Users {
  userId?: number; // 站点用户ID (原若依系统用户ID)
  email: string; // 邮箱地址
  nickname: string; // 用户昵称
  avatar?: string; // 用户头像URL
  subscriptionStatus?: "inactive" | "active" | "expired" | string; // 订阅状态
  currentPlanId?: number; // 当前激活的订阅计划ID
  lastLoginAt?: string; // 最后登录时间 (格式: yyyy-MM-dd HH:mm:ss)
  createdAt?: string; // 记录创建时间
  updatedAt?: string; // 记录更新时间
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
