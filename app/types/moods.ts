// types/moods.ts

/**
 * 音乐情绪类型定义
 */
export interface Moods {
  moodId?: number; // 情绪ID
  name: string; // 情绪名称
  slug: string; // 用于URL的友好名称
  coverImageUrl?: string; // 情绪封面图片URL
  description?: string; // 情绪描述
  createdAt?: string; // 记录创建时间
  updatedAt?: string; // 记录更新时间
  owner?: string; // 创建者
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
