// types/genres.ts

/**
 * 音乐流派类型定义
 */
export interface Genres {
  genreId?: number; // 流派ID
  name: string; // 流派名称
  slug: string; // 用于URL的友好名称
  coverImageUrl?: string; // 流派封面图片URL
  description?: string; // 流派描述
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
