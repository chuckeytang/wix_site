// api/genres.ts

import request from "./http";
import type { Genres, PaginationResult } from "~/types/genres";
import type { AjaxResult } from "~/types/ajax";
import type { Tracks } from "~/types/tracks";

/**
 * 音乐流派相关的 API 接口
 */
export const genresApi = {
  /**
   * 查询音乐流派列表
   * @param query 查询参数，例如 { pageNum: 1, pageSize: 10 }
   * @returns 包含音乐流派列表和总数的 Promise
   */
  getGenresList(query?: any): Promise<PaginationResult<Genres>> {
    return request.get("/site/genres/list", { params: query });
  },

  /**
   * 根据流派ID查询其下的音乐曲目列表
   * @param genreId 流派ID
   * @param query 查询参数
   * @returns 包含音乐曲目列表和总数的 Promise
   */
  getGenresMusic(
    genreId: number,
    query: any
  ): Promise<PaginationResult<Tracks>> {
    // 使用 GET 请求，将 genreId 放入路径，将分页和排序参数放入 query
    return request.get(`/site/genres/${genreId}/tracks`, { params: query });
  },

  /**
   * 获取音乐流派详细信息
   * @param genreId 音乐流派ID
   * @returns 包含单个音乐流派详细信息的 Promise
   */
  getGenreDetail(genreId: number): Promise<AjaxResult<Genres>> {
    return request.get(`/site/genres/${genreId}`);
  },

  /**
   * 新增音乐流派
   * @param data 音乐流派数据
   * @returns 新增结果的 Promise
   */
  addGenre(data: Genres): Promise<AjaxResult<any>> {
    return request.post("/site/genres", data);
  },

  /**
   * 修改音乐流派
   * @param data 音乐流派数据
   * @returns 修改结果的 Promise
   */
  updateGenre(data: Genres): Promise<AjaxResult<any>> {
    return request.put("/site/genres", data);
  },

  /**
   * 删除音乐流派
   * @param genreIds 音乐流派ID数组
   * @returns 删除结果的 Promise
   */
  deleteGenres(genreIds: number[]): Promise<AjaxResult<any>> {
    return request.delete(`/site/genres/${genreIds.join(",")}`);
  },

  /**
   * 导出音乐流派列表
   * @param query 查询参数
   * @returns 无返回值，直接触发文件下载
   */
  exportGenres(query: any): Promise<void> {
    return request.post("/site/genres/export", query, {
      responseType: "blob", // 响应类型为 Blob，用于下载
    });
  },
};
