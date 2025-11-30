<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="store.isVisible"
        class="modal-overlay"
        @click.self="handleClose"
      >
        <div class="modal-container">
          <button class="close-btn" @click="handleClose">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div v-if="viewMode === 'select'" class="modal-content select-mode">
            <div class="modal-header">
              <h2 class="title">Add to Playlist</h2>
              <p class="subtitle" v-if="store.targetTitle">
                {{ store.targetTitle }}
              </p>
            </div>

            <div class="actions-bar">
              <button class="create-new-btn" @click="switchMode('create')">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                New Playlist
              </button>
            </div>

            <div class="playlist-list" v-if="!isLoading">
              <div
                v-for="playlist in playlists"
                :key="playlist.playlistId"
                class="playlist-item"
                @click="addToPlaylist(playlist.playlistId!)"
              >
                <div class="playlist-info">
                  <span class="playlist-name">{{ playlist.title }}</span>
                  <span
                    class="track-count"
                    v-if="playlist.trackCount !== undefined"
                    >({{ playlist.trackCount }})</span
                  >
                </div>
              </div>

              <div v-if="playlists.length === 0" class="empty-state">
                No playlists found. Create one!
              </div>
            </div>
            <div v-else class="loading-state">Loading...</div>
          </div>

          <div v-if="viewMode === 'create'" class="modal-content create-mode">
            <div class="modal-header">
              <h2 class="title">New Playlist</h2>
            </div>

            <form @submit.prevent="handleCreatePlaylist" class="create-form">
              <div class="form-group">
                <label for="pl-title"
                  >Playlist Name <span class="required">*</span></label
                >
                <input
                  id="pl-title"
                  v-model="newPlaylistForm.title"
                  type="text"
                  placeholder="Enter playlist name"
                  class="form-input"
                  :class="{ 'has-error': formErrors.title }"
                  @input="formErrors.title = false"
                />
                <span class="error-msg" v-if="formErrors.title"
                  >This field is required</span
                >
              </div>

              <div class="form-group">
                <label for="pl-desc">Description (Optional)</label>
                <input
                  id="pl-desc"
                  v-model="newPlaylistForm.description"
                  type="text"
                  placeholder="Enter description"
                  class="form-input"
                />
              </div>

              <div class="form-actions">
                <button
                  type="submit"
                  class="submit-btn"
                  :disabled="isSubmitting"
                >
                  {{ isSubmitting ? "Creating..." : "Create" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from "vue";
import { usePlaylistModalStore } from "~/stores/playlistModal";
import { playlistsApi } from "~/api/playlists";
import type { Playlists } from "~/types/playlists";
import { useToast } from "~/composables/useToast";

const store = usePlaylistModalStore();
const { showToast } = useToast();

const viewMode = ref<"select" | "create">("select");
const playlists = ref<Playlists[]>([]);
const isLoading = ref(false);
const isSubmitting = ref(false);

// 新建表单状态
const newPlaylistForm = reactive({
  title: "",
  description: "",
});
const formErrors = reactive({
  title: false,
});

// 监听模态框打开
watch(
  () => store.isVisible,
  (val) => {
    if (val) {
      viewMode.value = "select";
      fetchMyPlaylists();
      // 重置表单
      newPlaylistForm.title = "";
      newPlaylistForm.description = "";
      formErrors.title = false;
    }
  }
);

const handleClose = () => {
  store.closeModal();
};

const switchMode = (mode: "select" | "create") => {
  viewMode.value = mode;
};

// 获取我的播放列表
const fetchMyPlaylists = async () => {
  isLoading.value = true;
  try {
    const res = await playlistsApi.getMyPlaylists();
    playlists.value = res.rows;
  } catch (error) {
    console.error("Failed to load playlists", error);
  } finally {
    isLoading.value = false;
  }
};

// 添加到现有播放列表
const addToPlaylist = async (playlistId: number) => {
  if (!store.targetId) return;

  try {
    let res;
    if (store.targetType === "track") {
      res = await playlistsApi.addTrackToPlaylist(playlistId, store.targetId);
    } else {
      res = await playlistsApi.addSfxToPlaylist(playlistId, store.targetId);
    }

    if (res.code === 200) {
      showToast("Added to playlist successfully");
      handleClose();
    } else {
      showToast(res.msg || "Failed to add to playlist");
    }
  } catch (error) {
    showToast("An error occurred");
  }
};

// 创建新播放列表并自动添加
const handleCreatePlaylist = async () => {
  if (!newPlaylistForm.title.trim()) {
    formErrors.title = true;
    return;
  }

  isSubmitting.value = true;
  try {
    // 1. 创建播放列表
    const createRes = await playlistsApi.createPlaylist({
      title: newPlaylistForm.title,
      description: newPlaylistForm.description,
    });

    if (createRes.code === 200) {
      // 假设后端返回了新创建的 ID，通常在 createRes.data 中 (可能是 id 本身或者对象)
      // 若依通常返回 AjaxResult，如果是 insert 操作，可能只返回 rows count。
      // **重要**: 这里需要后端返回创建的 ID。
      // 假设后端调整为: return success(playlistId); 或 return AjaxResult.success(playlist);

      // 如果后端只返回 rows (int)，我们无法得知 ID，这会导致无法自动添加。
      // 建议后端 Controller insert 后: playlists.getPlaylistId() 并返回。

      const newPlaylistId = createRes.data;

      if (newPlaylistId) {
        // 2. 自动将当前音乐添加进去
        await addToPlaylist(newPlaylistId);
      } else {
        // 如果无法获取 ID，退回到选择列表并刷新
        showToast("Playlist created. Please select it from the list.");
        viewMode.value = "select";
        fetchMyPlaylists();
      }
    } else {
      showToast(createRes.msg || "Failed to create playlist");
    }
  } catch (error) {
    showToast("Failed to create playlist");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* 模态框动画 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* 遮罩层 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(5px);
}

/* 容器 */
.modal-container {
  background-color: #e6e6e6; /* 对应截图中的浅灰色背景 */
  width: 90%;
  max-width: 600px;
  border-radius: 4px;
  position: relative;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  color: #333; /* 文字颜色深色 */
  overflow: hidden;
}

/* 关闭按钮 */
.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  z-index: 10;
  transition: color 0.2s;
}
.close-btn:hover {
  color: #000;
}

/* 内容区域 */
.modal-content {
  padding: 40px 50px;
}

.modal-header {
  margin-bottom: 30px;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
  color: #1a1a1a;
}

.subtitle {
  font-size: 1rem;
  color: #666;
  margin-top: 5px;
  text-align: right; /* 根据截图风格 */
}

/* Select Mode 样式 */
.actions-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  color: #666;
  font-size: 0.9rem;
}

.create-new-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  color: #666;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  transition: color 0.2s;
}

.create-new-btn:hover {
  color: #ff8c62;
}

.sort-info {
  display: flex;
  align-items: center;
  gap: 5px;
}

.playlist-list {
  max-height: 400px;
  overflow-y: auto;
  border-top: 1px solid #ccc;
}

.playlist-item {
  padding: 15px 0;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
}

.playlist-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
  padding-left: 10px; /* 简单的 hover 动效 */
}

.playlist-name {
  font-weight: bold;
  font-size: 1.1rem;
  color: #333;
}

.track-count {
  margin-left: 5px;
  color: #888;
  font-weight: normal;
}

/* Create Mode 样式 */
.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  font-size: 1.1rem;
  color: #999;
  margin-bottom: 8px;
}

.required {
  color: #ff8c62;
}

.form-input {
  width: 100%;
  border: none;
  border-bottom: 1px solid #999;
  background: transparent;
  padding: 10px 0;
  font-size: 1rem;
  color: #333;
  outline: none;
  transition: border-color 0.3s;
}

.form-input:focus {
  border-bottom-color: #ff8c62;
}

.form-input.has-error {
  border-bottom-color: #ff4d4f;
}

.error-msg {
  color: #ff4d4f;
  font-size: 0.85rem;
  margin-top: 5px;
  display: block;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.submit-btn {
  background-color: #ffb341; /* 截图中的金色/黄色 */
  color: #000;
  border: none;
  padding: 12px 40px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition:
    background-color 0.3s,
    transform 0.2s;
}

.submit-btn:hover {
  background-color: #c38933;
  transform: translateY(-2px);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.empty-state {
  text-align: center;
  padding: 30px;
  color: #888;
}

/* 响应式调整 */
@media (max-width: 600px) {
  .modal-container {
    width: 95%;
  }
  .modal-content {
    padding: 30px 20px;
  }
}
</style>
