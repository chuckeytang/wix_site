// types/sfx.ts

import type { Tags } from "./tags";
/**
 * 音效类型定义
 */
export interface Sfx {
  sfxId?: number; // 唯一标识音效的ID
  wixProductId?: string; // Wix产品ID
  title: string; // 音效标题
  description?: string; // 音效描述
  imageUrl?: string; // 音效封面图片的URL地址
  imageAltText?: string; // 封面图片的替代文本
  artist: string; // 艺术家/作者名称
  audioFileUrl: string; // 音频文件的URL地址
  duration: number; // 音效时长，单位：秒
  type?: string; // 音效类型
  licenseType?: string; // 授权类型
  downloadCount?: number; // 下载次数
  isFeatured?: number; // 是否为精选音效（0否，1是）
  isActive?: number; // 是否启用/可用（0否，1是）
  createdAt?: string; // 记录创建时间
  updatedAt?: string; // 记录更新时间
  tags?: Tags[]; // 音效标签
  hasLicense?: boolean; // 当前用户是否已购买
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
