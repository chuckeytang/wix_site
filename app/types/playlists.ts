// types/playlists.ts

/**
 * 播放列表类型定义
 */
export interface Playlists {
  playlistId?: number; // 播放列表ID
  title: string; // 播放列表标题
  description?: string; // 播放列表描述
  imageUrl?: string; // 封面图片URL
  imageAltText?: string; // 封面图片替代文本
  slug: string; // 用于URL的友好名称
  owner: number; // 播放列表创建者
  createdAt?: string; // 记录创建时间
  updatedAt?: string; // 记录更新时间
  trackCount?: number;
}

export interface PlaylistCreateRequest {
  title: string;
  description?: string;
  isPublic?: boolean; // 可选，预留
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
