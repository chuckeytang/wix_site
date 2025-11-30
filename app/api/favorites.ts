// api/favorites.ts
import request from "./http";
import type { AjaxResult } from "~/types/ajax";

export const favoritesApi = {
  /**
   * 切换收藏状态 (Track)
   * @param trackId 音乐ID
   */
  toggleFavorite(trackId: number): Promise<AjaxResult<boolean>> {
    return request.post(`/site/favorites/toggle/${trackId}`);
  },

  /**
   * 检查收藏状态 (Track)
   * @param trackId 音乐ID
   */
  checkFavoriteStatus(trackId: number): Promise<AjaxResult<boolean>> {
    return request.get(`/site/favorites/check/${trackId}`);
  },

  // 如果后端实现了 SFX 的收藏接口，可以在这里扩展
  // toggleFavoriteSfx(sfxId: number) ...
};
