// api/tracks.ts

import request from "./http";
import type { Tracks, PaginationResult } from "~/types/tracks";
import type { AjaxResult } from "~/types/ajax";
import axios from "axios"; // 引入 axios

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
    return request.post("/site/tracks/list", query);
  },

  /**
   * 获取筛选器选项
   * @returns 包含所有筛选选项的 Promise
   */
  getFilterOptions(): Promise<AjaxResult<any>> {
    return request.get("/site/tracks/filter-options");
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

  /**
   * 下载音乐文件（推荐直接下载，无需代理）
   * @param audioFileUrl 音频文件的完整URL
   * @returns 返回一个包含 Blob 数据的 Promise
   */
  downloadTrackFile(audioFileUrl: string): Promise<Blob> {
    return axios
      .get(audioFileUrl, {
        responseType: "blob",
      })
      .then((response) => response.data as Blob)
      .catch((error) => {
        console.error("下载文件失败:", error);
        return Promise.reject(error);
      });
  },

  /**
   * 通过后端代理下载音乐文件
   * @param trackId 音乐曲目ID
   * @returns 返回一个包含 Blob 数据的 Promise
   */
  async downloadTrackProxy(trackId: number): Promise<Blob> {
    try {
      // 在方法内部获取运行时配置
      const config = useRuntimeConfig();

      // 获取后端 API 基础 URL
      const baseURL = config.public.appBaseApi;

      // 直接使用 axios 实例，不经过 http.ts 的响应拦截器
      const response = await axios.get(
        `${baseURL}/site/tracks/download/${trackId}`,
        {
          responseType: "blob",
        }
      );

      return response.data as Blob;
    } catch (error) {
      console.error("通过代理下载文件失败:", error);
      // 根据你的需求决定如何处理错误
      return Promise.reject(error);
    }
  },
};
