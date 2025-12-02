// api/favorites.ts
import request from "./http";
import type { AjaxResult } from "~/types/ajax";

export const favoritesApi = {
  /**
   * 切换收藏状态 (通用接口: 支持 Track 和 Sfx)
   * URL: /site/favorites/toggle/{type}/{id}
   * @param id 媒体ID (trackId 或 sfxId)
   * @param type 媒体类型 ('track' 或 'sfx')
   */
  toggleFavorite(id: number, type: MediaType): Promise<AjaxResult<boolean>> {
    // 后端 UserFavoritesController 应该接收 /toggle/{type}/{id} 这样的路由
    return request.post(`/site/favorites/toggle/${type}/${id}`);
  },

  /**
   * 检查收藏状态 (通用接口: 支持 Track 和 Sfx)
   * URL: /site/favorites/check/{type}/{id}
   * @param id 媒体ID
   * @param type 媒体类型
   */
  checkFavoriteStatus(
    id: number,
    type: MediaType
  ): Promise<AjaxResult<boolean>> {
    // 后端 UserFavoritesController 应该接收 /check/{type}/{id} 这样的路由
    return request.get(`/site/favorites/check/${type}/${id}`);
  },
};
