// api/sfx.ts

import request from "./http";
import type { Sfx, PaginationResult } from "~/types/sfx";
import type { AjaxResult } from "~/types/ajax";
import axios from "axios"; // 引入 axios

/**
 * 音效相关的 API 接口
 */
export const sfxApi = {
  /**
   * 查询音效列表
   * @param query 查询参数
   * @returns 包含音效列表和总数的 Promise
   */
  getSfxList(query: any): Promise<PaginationResult<Sfx>> {
    return request.post("/site/sfx/list", query);
  },

  /**
   * 获取筛选器选项
   * @returns 包含所有筛选选项的 Promise
   */
  getFilterOptions(): Promise<AjaxResult<any>> {
    return request.get("/site/sfx/filter-options");
  },

  /**
   * 获取音效详细信息
   * @param sfxId 音效ID
   * @returns 包含单个音效详细信息的 Promise
   */
  getSfxDetail(sfxId: number): Promise<AjaxResult<Sfx>> {
    return request.get(`/site/sfx/${sfxId}`);
  },

  /**
   * 新增音效
   * @param data 音效数据
   * @returns 新增结果的 Promise
   */
  addSfx(data: Sfx): Promise<AjaxResult<any>> {
    return request.post("/site/sfx", data);
  },

  /**
   * 修改音效
   * @param data 音效数据
   * @returns 修改结果的 Promise
   */
  updateSfx(data: Sfx): Promise<AjaxResult<any>> {
    return request.put("/site/sfx", data);
  },

  /**
   * 删除音效
   * @param sfxIds 音效ID数组
   * @returns 删除结果的 Promise
   */
  deleteSfx(sfxIds: number[]): Promise<AjaxResult<any>> {
    return request.delete(`/site/sfx/${sfxIds.join(",")}`);
  },

  /**
   * 导出音效列表
   * @param query 查询参数
   * @returns 无返回值，直接触发文件下载
   */
  exportSfx(query: any): Promise<void> {
    return request.post("/site/sfx/export", query, {
      responseType: "blob", // 响应类型为 Blob，用于下载
    });
  },

  /**
   * 下载音效文件（推荐直接下载，无需代理）
   * @param audioFileUrl 音频文件的完整URL
   * @returns 返回一个包含 Blob 数据的 Promise
   */
  downloadSfxFile(audioFileUrl: string): Promise<Blob> {
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
   * 通过后端代理下载音效文件
   * @param sfxId 音效ID
   * @returns 返回一个包含 Blob 数据的 Promise
   */
  async downloadSfxProxy(sfxId: number): Promise<Blob> {
    try {
      // 在方法内部获取运行时配置
      const config = useRuntimeConfig();

      // 获取后端 API 基础 URL
      const baseURL = config.public.appBaseApi;

      // 直接使用 axios 实例，不经过 http.ts 的响应拦截器
      const response = await axios.get(
        `${baseURL}/site/sfx/download/${sfxId}`,
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
