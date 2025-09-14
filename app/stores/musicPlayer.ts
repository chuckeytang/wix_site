// stores/musicPlayer.js
import { defineStore } from "pinia";
import type { Tracks } from "~/types/tracks";
import type { Sfx } from "~/types/sfx";

export const useMusicPlayerStore = defineStore("musicPlayer", {
  state: () => ({
    /**
     * 当前播放歌曲的ID，用于控制列表中的唯一播放状态。
     */
    currentPlayingId: undefined as number | undefined,

    /**
     * 当前正在播放的完整歌曲对象，包含所有详细信息，用于面板展示。
     */
    currentTrack: null as Tracks | Sfx | null,

    /**
     * 当前播放媒体的类型。
     */
    mediaType: "track" as "track" | "sfx",

    /**
     * 当前播放列表的来源ID（流派ID, 情绪ID, 歌单ID）。
     */
    currentSourceId: undefined as number | undefined,

    /**
     * 当前播放列表（通常是来自列表页面的 tracks 数组）。
     */
    currentPlaylist: [] as Tracks[],

    /**
     * 当前播放歌曲在 currentPlaylist 中的索引。
     */
    currentTrackIndex: -1 as number,

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

    // 用于在波形图点击时同步进度的状态
    seekToProgress: null as number | null,

    // 当前选择的分段状态
    currentSegment: "full" as string,
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
     * 设置当前播放列表，并可指定初始播放的歌曲。
     * @param playlist 歌曲列表
     * @param track 初始播放的歌曲对象 (可选)
     */
    setPlaylist(playlist: Tracks[], track?: Tracks, sourceId?: number) {
      this.currentPlaylist = playlist;
      this.currentSourceId = sourceId;
      if (track) {
        this.setTrack(track);
      }
    },

    /**
     * 设置当前正在播放的完整歌曲对象。
     * 这会触发播放面板的显示。
     * @param track 完整的歌曲对象
     */
    setTrack(track: Tracks) {
      // 检查新歌曲是否在当前列表中，并更新索引
      const index = this.currentPlaylist.findIndex(
        (t) => t.trackId === track.trackId
      );
      if (index !== -1) {
        this.currentTrackIndex = index;
      } else {
        // 如果新歌曲不在列表中，则重置索引
        this.currentTrackIndex = -1;
      }

      if (
        this.currentPlayingId !== track.trackId ||
        this.mediaType !== "track"
      ) {
        this.currentTrack = track;
        this.currentPlayingId = track.trackId!;
        this.mediaType = "track"; // 设置媒体类型
        this.currentTime = 0;
        this.duration = track.duration;
        this.currentSegment = "full";
      }
      this.isPlaying = true;
    },

    /**
     * 设置当前正在播放的完整音效对象。
     * @param sfx 完整的音效对象
     */
    setSfx(sfx: Sfx) {
      // 检查是否重复点击，避免不必要的重新加载
      if (this.currentPlayingId !== sfx.sfxId || this.mediaType !== "sfx") {
        this.currentTrack = sfx;
        this.currentPlayingId = sfx.sfxId!;
        this.mediaType = "sfx"; // 设置媒体类型
        this.currentTime = 0;
        this.duration = sfx.duration;
        this.currentSegment = "full"; // 音效没有分段，默认为 full
      }
      this.isPlaying = true;
    },

    /**
     * 播放上一首歌曲。
     */
    playPrevTrack() {
      if (this.currentPlaylist.length === 0 || this.currentTrackIndex <= 0) {
        // 没有上一首，可以循环回到最后一首或停止
        return;
      }
      const prevTrack = this.currentPlaylist[this.currentTrackIndex - 1];
      this.setTrack(prevTrack!);
    },

    /**
     * 播放下一首歌曲。
     */
    playNextTrack() {
      if (
        this.currentPlaylist.length === 0 ||
        this.currentTrackIndex >= this.currentPlaylist.length - 1
      ) {
        // 没有下一首，可以循环回到第一首或停止
        return;
      }
      const nextTrack = this.currentPlaylist[this.currentTrackIndex + 1];
      this.setTrack(nextTrack!);
    },

    /**
     * 切换播放和暂停状态。
     */
    togglePlayPause() {
      if (this.currentTrack) {
        this.isPlaying = !this.isPlaying;
      }
    },

    /**
     * 显式设置播放状态。
     * @param state true为播放，false为暂停
     */
    setIsPlaying(state: boolean) {
      if (this.currentTrack) {
        this.isPlaying = state;
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

    /**
     * 设置播放进度。
     * @param progress 0到1之间的相对进度
     */
    seekTo(progress: number) {
      if (this.currentTrack) {
        this.currentTime = this.duration * progress;
        this.seekToProgress = progress;
      }
    },

    /**
     * 重置 seekToProgress 状态，防止重复触发
     */
    clearSeekToProgress() {
      this.seekToProgress = null;
    },

    /**
     * 设置segment
     */
    setSegment(segment: string) {
      this.currentSegment = segment;
    },
  },
  getters: {
    // 检查是否有歌曲在播放
    isGloballyPlaying: (state) => !!state.currentPlayingId && state.isPlaying,
    currentProgress(): number {
      if (this.duration > 0) {
        return (this.currentTime / this.duration) * 100;
      }
      return 0;
    },
  },
});
