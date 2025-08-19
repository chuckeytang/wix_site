// stores/musicPlayer.js
import { defineStore } from "pinia";

export const useMusicPlayerStore = defineStore("musicPlayer", {
  state: () => ({
    currentPlayingId: null,
  }),
  actions: {
    setCurrentPlayingId(id) {
      this.currentPlayingId = id;
    },
  },
  // 可以添加 getters
  getters: {
    // isPlaying: (state) => !!state.currentPlayingId
  },
});
