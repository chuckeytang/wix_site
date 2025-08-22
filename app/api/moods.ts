// api/moods.ts

import request from "./http";
import type { Moods, PaginationResult } from "~/types/moods";
import type { AjaxResult } from "~/types/ajax";

/**
 * 音乐情绪相关的 API 接口
 */
export const moodsApi = {
  /**
   * 查询音乐情绪列表
   * @param query 查询参数，例如 { pageNum: 1, pageSize: 10 }
   * @returns 包含音乐情绪列表和总数的 Promise
   */
  getMoodsList(query?: any): Promise<PaginationResult<Moods>> {
    return request.get("/site/moods/list", { params: query });
  },

  /**
   * 获取音乐情绪详细信息
   * @param moodId 音乐情绪ID
   * @returns 包含单个音乐情绪详细信息的 Promise
   */
  getMoodDetail(moodId: number): Promise<AjaxResult<Moods>> {
    return request.get(`/site/moods/${moodId}`);
  },

  /**
   * 新增音乐情绪
   * @param data 音乐情绪数据
   * @returns 新增结果的 Promise
   */
  addMood(data: Moods): Promise<AjaxResult<any>> {
    return request.post("/site/moods", data);
  },

  /**
   * 修改音乐情绪
   * @param data 音乐情绪数据
   * @returns 修改结果的 Promise
   */
  updateMood(data: Moods): Promise<AjaxResult<any>> {
    return request.put("/site/moods", data);
  },

  /**
   * 删除音乐情绪
   * @param moodIds 音乐情绪ID数组
   * @returns 删除结果的 Promise
   */
  deleteMoods(moodIds: number[]): Promise<AjaxResult<any>> {
    return request.delete(`/site/moods/${moodIds.join(",")}`);
  },

  /**
   * 导出音乐情绪列表
   * @param query 查询参数
   * @returns 无返回值，直接触发文件下载
   */
  exportMoods(query: any): Promise<void> {
    return request.post("/site/moods/export", query, {
      responseType: "blob", // 响应类型为 Blob，用于下载
    });
  },
};
