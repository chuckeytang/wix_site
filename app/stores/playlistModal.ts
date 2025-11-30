// stores/playlistModal.ts
import { defineStore } from "pinia";
import { ref } from "vue";

export type MediaType = "track" | "sfx";

export const usePlaylistModalStore = defineStore("playlistModal", () => {
  const isVisible = ref(false);
  const targetId = ref<number | null>(null);
  const targetType = ref<MediaType>("track");
  const targetTitle = ref<string>(""); // 用于在 Modal 标题显示 "Add to Playlist: Song Name"

  /**
   * 打开模态框
   * @param id 媒体ID (trackId 或 sfxId)
   * @param type 媒体类型
   * @param title 媒体标题（可选，用于展示）
   */
  const openModal = (id: number, type: MediaType, title: string = "") => {
    targetId.value = id;
    targetType.value = type;
    targetTitle.value = title;
    isVisible.value = true;
  };

  const closeModal = () => {
    isVisible.value = false;
    // 稍微延迟清理数据，避免动画时内容突然消失
    setTimeout(() => {
      targetId.value = null;
      targetTitle.value = "";
    }, 300);
  };

  return {
    isVisible,
    targetId,
    targetType,
    targetTitle,
    openModal,
    closeModal,
  };
});
