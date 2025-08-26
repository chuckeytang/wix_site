// stores/musicPlayer.js
import { defineStore } from "pinia";
import type { Tracks } from "~/types/tracks";

export const useMusicPlayerStore = defineStore("musicPlayer", {
  state: () => ({
    /**
     * 当前播放歌曲的ID，用于控制列表中的唯一播放状态。
     */
    currentPlayingId: undefined as number | undefined,

    /**
     * 当前正在播放的完整歌曲对象，包含所有详细信息，用于面板展示。
     */
    currentTrack: null as Tracks | null,

    /**
     * 播放状态，true为播放，false为暂停。
     */
    isPlaying: false,

    /**
     * 当前播放时间（秒）。
     */
    currentTime: 0,

    /**
     * 歌曲总时长（秒）。
     */
    duration: 0,
  }),
  actions: {
    /**
     * 设置当前播放的歌曲ID。
     * @param id 歌曲ID
     */
    setCurrentPlayingId(id: number | undefined) {
      this.currentPlayingId = id;
    },

    /**
     * 设置当前正在播放的完整歌曲对象。
     * 这会触发播放面板的显示。
     * @param track 完整的歌曲对象
     */
    setTrack(track: Tracks) {
      this.currentTrack = track;
      this.currentPlayingId = track.trackId!; // 同步更新ID
      this.isPlaying = true;
    },

    /**
     * 切换播放和暂停状态。
     */
    togglePlayPause() {
      if (this.currentTrack) {
        this.isPlaying = !this.isPlaying;
        if (!this.isPlaying) {
          this.currentPlayingId = undefined;
          this.currentTrack = null;
        }
      }
    },

    /**
     * 显式设置播放状态。
     * @param state true为播放，false为暂停
     */
    setIsPlaying(state: boolean) {
      if (this.currentTrack) {
        this.isPlaying = state;
        if (!state) {
          this.currentPlayingId = undefined;
          this.currentTrack = null;
        }
      }
    },

    /**
     * 更新当前播放时间。
     * @param time 当前时间（秒）
     */
    updateTime(time: number) {
      this.currentTime = time;
    },

    /**
     * 设置歌曲总时长。
     * @param totalDuration 总时长（秒）
     */
    setDuration(totalDuration: number) {
      this.duration = totalDuration;
    },
  },
  getters: {
    // 检查是否有歌曲在播放
    isGloballyPlaying: (state) => !!state.currentPlayingId && state.isPlaying,
  },
});
