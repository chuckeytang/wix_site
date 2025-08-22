// api/tracks.ts

import request from "./http";
import type { Tracks, PaginationResult } from "~/types/tracks";
import type { AjaxResult } from "~/types/ajax";

/**
 * 音乐曲目相关的 API 接口
 */
export const tracksApi = {
  /**
   * 查询音乐曲目列表
   * @param query 查询参数，例如 { pageNum: 1, pageSize: 10, title: '...' }
   * @returns 包含音乐曲目列表和总数的 Promise
   */
  getTracksList(query: any): Promise<PaginationResult<Tracks>> {
    return request.get("/site/tracks/list", { params: query });
  },

  /**
   * 获取音乐曲目详细信息
   * @param trackId 音乐曲目ID
   * @returns 包含单个音乐曲目详细信息的 Promise
   */
  getTrackDetail(trackId: number): Promise<AjaxResult<Tracks>> {
    return request.get(`/site/tracks/${trackId}`);
  },

  /**
   * 新增音乐曲目
   * @param data 音乐曲目数据
   * @returns 新增结果的 Promise
   */
  addTrack(data: Tracks): Promise<AjaxResult<any>> {
    return request.post("/site/tracks", data);
  },

  /**
   * 修改音乐曲目
   * @param data 音乐曲目数据
   * @returns 修改结果的 Promise
   */
  updateTrack(data: Tracks): Promise<AjaxResult<any>> {
    return request.put("/site/tracks", data);
  },

  /**
   * 删除音乐曲目
   * @param trackIds 音乐曲目ID数组
   * @returns 删除结果的 Promise
   */
  deleteTracks(trackIds: number[]): Promise<AjaxResult<any>> {
    return request.delete(`/site/tracks/${trackIds.join(",")}`);
  },

  /**
   * 导出音乐曲目列表
   * @param query 查询参数
   * @returns 无返回值，直接触发文件下载
   */
  exportTracks(query: any): Promise<void> {
    return request.post("/site/tracks/export", query, {
      responseType: "blob", // 响应类型为 Blob，用于下载
    });
  },
};
