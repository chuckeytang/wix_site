// api/playlists.ts

import request from "./http";
import type { Playlists, PaginationResult } from "~/types/playlists";
import type { AjaxResult } from "~/types/ajax";
import type { Tracks } from "~/types/tracks";

/**
 * 播放列表相关的 API 接口
 */
export const playlistsApi = {
  /**
   * 查询播放列表列表
   * @param query 查询参数，例如 { pageNum: 1, pageSize: 10, title: '...' }
   * @returns 包含播放列表列表和总数的 Promise
   */
  getPlaylistsList(query: any): Promise<PaginationResult<Playlists>> {
    return request.get("/site/playlists/list", { params: query });
  },

  /**
   * 获取当前登录用户的播放列表
   * (用于“加入播放列表”弹窗)
   */
  getMyPlaylists(): Promise<PaginationResult<Playlists>> {
    return request.get("/site/playlists/my-list");
  },

  /**
   * 创建新的播放列表 (别名 addPlaylist，为了兼容某些组件调用习惯)
   */
  createPlaylist(data: {
    title: string;
    description?: string;
  }): Promise<AjaxResult<any>> {
    return request.post("/site/playlists", data);
  },

  /**
   * 添加音乐到播放列表
   */
  addTrackToPlaylist(
    playlistId: number,
    trackId: number
  ): Promise<AjaxResult<any>> {
    return request.post(`/site/playlists/${playlistId}/tracks/${trackId}`);
  },

  /**
   * 添加音效到播放列表
   */
  addSfxToPlaylist(
    playlistId: number,
    sfxId: number
  ): Promise<AjaxResult<any>> {
    return request.post(`/site/playlists/${playlistId}/sfx/${sfxId}`);
  },

  /**
   * 获取播放列表详细信息
   * @param playlistId 播放列表ID
   * @returns 包含单个播放列表详细信息的 Promise
   */
  getPlaylistDetail(playlistId: number): Promise<AjaxResult<Playlists>> {
    return request.get(`/site/playlists/${playlistId}`);
  },

  /**
   * 新增播放列表
   * @param data 播放列表数据
   * @returns 新增结果的 Promise
   */
  addPlaylist(data: Playlists): Promise<AjaxResult<any>> {
    return request.post("/site/playlists", data);
  },

  /**
   * 修改播放列表
   * @param data 播放列表数据
   * @returns 修改结果的 Promise
   */
  updatePlaylist(data: Playlists): Promise<AjaxResult<any>> {
    return request.put("/site/playlists", data);
  },

  /**
   * 删除播放列表
   * @param playlistIds 播放列表ID数组
   * @returns 删除结果的 Promise
   */
  deletePlaylists(playlistIds: number[]): Promise<AjaxResult<any>> {
    return request.delete(`/site/playlists/${playlistIds.join(",")}`);
  },

  /**
   * 导出播放列表列表
   * @param query 查询参数
   * @returns 无返回值，直接触发文件下载
   */
  exportPlaylists(query: any): Promise<void> {
    return request.post("/site/playlists/export", query, {
      responseType: "blob", // 响应类型为 Blob，用于下载
    });
  },

  /**
   * 根据播放列表ID查询其下的音乐曲目列表
   * @param playlistId 播放列表ID
   * @param query 查询参数
   * @returns 包含音乐曲目列表和总数的 Promise
   */
  getPlaylistMusic(
    playlistId: number,
    query: any
  ): Promise<PaginationResult<Tracks>> {
    return request.get(`/site/playlists/${playlistId}/tracks`, {
      params: query,
    });
  },
};
