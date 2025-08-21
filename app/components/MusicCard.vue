<template>
  <div class="music-card-list">
    <div class="left-section">
      <button class="play-button" @click="togglePlay">
        <svg viewBox="0 0 36 36" class="circular-progress-bar">
          <path
            class="circle-bg"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            class="circle"
            :stroke-dasharray="`${progress}, 100`"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <svg
          v-if="!isPlaying"
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
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        <svg
          v-else
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
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
      </button>
      <div class="track-info">
        <span class="track-title">{{ track.Title }}</span>
        <span class="track-artist">{{ track.Artist }}</span>
      </div>
    </div>

    <WaveformPlayer
      :audio-url="mockAudioUrl"
      :is-playing="isPlaying"
      @play="handlePlay"
      @pause="handlePause"
      @update-progress="handleUpdateProgress"
      ref="waveformPlayerRef"
    />

    <div class="track-meta-info">
      <div class="duration-bpm">
        <span class="duration">{{ track.Duration }}</span>
        <span class="bpm">{{ track.BPM + "  BPM" }}</span>
      </div>
    </div>

    <div class="category-tags">
      <span v-for="(tag, index) in track.Categories" :key="index" class="tag">{{
        tag
      }}</span>
    </div>

    <div class="right-column-group">
      <div class="action-buttons">
        <button class="action-btn">
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
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            ></path>
          </svg>
        </button>
        <button class="action-btn">
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
            <path
              d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8z"
            ></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </button>
      </div>

      <button class="download-button">download</button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, watch } from "vue";
import { useMusicPlayerStore } from "~/stores/musicPlayer.js";
import WaveformPlayer from "./WaveformPlayer.vue"; // 确保路径正确

const props = defineProps({
  track: {
    type: Object,
    required: true,
  },
});

const musicPlayerStore = useMusicPlayerStore();
const isPlaying = ref(false);
const progress = ref(0);
const waveformPlayerRef = ref(null);

const mockAudioUrl =
  "https://music.wixstatic.com/mp3/69f695_c5c7728f296849e19848b540ebd81491.mp3";

// 播放/暂停的逻辑现在调用子组件的方法
const togglePlay = () => {
  if (isPlaying.value) {
    waveformPlayerRef.value?.pause();
  } else {
    musicPlayerStore.setCurrentPlayingId(props.track.ID);
    waveformPlayerRef.value?.play();
  }
};

// 监听子组件发出的事件
const handlePlay = () => {
  isPlaying.value = true;
  musicPlayerStore.setCurrentPlayingId(props.track.ID);
};

const handlePause = () => {
  isPlaying.value = false;
  if (musicPlayerStore.currentPlayingId === props.track.ID) {
    musicPlayerStore.setCurrentPlayingId(null);
  }
};

const handleUpdateProgress = (newProgress) => {
  progress.value = newProgress;
};

// 监听全局状态变化，控制波形图暂停
watch(
  () => musicPlayerStore.currentPlayingId,
  (newId) => {
    if (newId !== null && newId !== props.track.ID) {
      if (isPlaying.value) {
        waveformPlayerRef.value?.pause();
      }
    }
  }
);
</script>

<style scoped>
.music-card-list {
  display: grid;
  grid-template-columns: 250px 750px 100px 220px auto;
  align-items: center;
  gap: 20px; /* 控制列之间的间距 */

  /* 保持原有的样式 */
  padding: 15px 20px;
  border-bottom: 1px solid #222;
  transition: background-color 0.3s;
}

.music-card-list:hover {
  background-color: #1a1a1a;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* 歌曲信息 */
.track-info {
  display: flex;
  flex-direction: column;
}

.track-title {
  font-weight: bold;
  font-size: 1.1em;
  color: #edebeb;
}

.track-artist {
  font-size: 0.9em;
  color: #edebeb;
}

/* 波形图占位符
  - 移除 flex-grow: 1，因为它在 Grid 布局中已经通过 1fr 占据了剩余空间
*/
.waveform-placeholder {
  position: relative;
  transition: background-color 0.3s ease;
  height: 50px;
  background-color: #222;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.waveform-placeholder::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  pointer-events: none;
  z-index: 5;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.waveform-placeholder:hover::before {
  opacity: 1;
  background: linear-gradient(
    90deg,
    rgba(70, 34, 21, 0.1),
    rgba(81, 62, 23, 0.1)
  );
}

.hover-progress-overlay {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  /* 从左到右的渐变色，透明度更低 */
  background: linear-gradient(
    90deg,
    rgba(255, 140, 98, 0.2),
    rgba(255, 179, 138, 0.2)
  );
  z-index: 10; /* 确保在 Wavesurfer canvas 上方 */
  pointer-events: none; /* 确保不影响鼠标事件 */
}

.hover-playhead {
  position: absolute;
  top: 0;
  height: 100%;
  width: 2px;
  background-color: rgba(255, 140, 98, 0.5); /* 橙色，更低的透明度 */
  z-index: 11;
  transform: translateX(-50%);
  pointer-events: none;
}

.waveform-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.waveform-progress-overlay {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 140, 98, 0.5),
    rgba(255, 140, 98, 0.5)
  ); /* 播放后的彩色层 */
  z-index: 2;
  transition: width 0.1s linear; /* 平滑过渡效果 */
}

.waveform-playhead {
  position: absolute;
  top: 0;
  height: 100%;
  width: 2px;
  background-color: #ff8c62; /* 竖线颜色 */
  z-index: 3;
  transform: translateX(-50%); /* 确保竖线中心对齐进度 */
  cursor: grab;
}

/* 鼠标悬停效果 */
.waveform-placeholder:hover::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 140, 98, 0.2); /* 浅色半透明背景 */
  z-index: 0; /* 确保在波形图下方 */
  pointer-events: none; /* 确保不影响点击事件 */
}

.placeholder-text {
  color: #666;
  font-size: 0.9em;
}

/* 右侧元素组合容器
  - 使用 Flexbox 来管理内部元素的排列
  - gap 属性控制其内部元素之间的间距
*/
.right-column-group {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-direction: row;
}

/* 时长和BPM */
.duration-bpm {
  display: flex;
  flex-direction: column;
  /* 调整为 flex-start，使其左对齐 */
  align-items: flex-start;
  font-size: 0.9em;
  color: #ccc;
  flex-shrink: 0;
}

.duration {
  font-weight: bold;
}

.bpm {
  font-size: 0.8em;
  color: #888;
}

/* 分类标签 */
.category-tags {
  display: flex;
  gap: 5px;
  flex-shrink: 0;
  flex-wrap: wrap;
}

.tag {
  background-color: #444;
  color: #fff;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7em;
  white-space: nowrap;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 5px;
  flex-shrink: 0;
}

.action-btn {
  background-color: transparent;
  border: none;
  color: #ccc;
  cursor: pointer;
  padding: 5px;
  transition: color 0.3s;
}

/* 下载按钮 */
.download-button {
  background-color: #ff8c62;
  color: #0d0d1a;
  font-weight: bold;
  padding: 10px 20px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: background-color 0.3s;
  flex-shrink: 0;
}

.download-button:hover {
  background-color: #e67a54;
}

/* 播放按钮 */
.play-button {
  position: relative; /* 用于定位圆形进度条 */
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 5px;
  color: #1a1a1a;
  transition: color 0.3s ease;
}

.play-button svg:not(.circular-progress-bar) {
  color: #888;
  transition: color 0.3s ease;
}

.music-card-list:hover .play-button svg {
  color: white;
}

.circular-progress-bar {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
}

.circle-bg {
  fill: none;
  stroke: #333; /* 进度条背景色 */
  stroke-width: 2.5;
}

.circle {
  fill: none;
  stroke: #ff8c62; /* 进度条填充色 */
  stroke-width: 2.5;
  transition: stroke-dasharray 0.3s;
}

.play-button svg:not(.circular-progress-bar) {
  z-index: 1; /* 确保图标在进度条上方 */
}

.waveform-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.music-list-section {
  background-color: #0d0d1a;
  padding: 20px 0;
  color: #fff;
}

.track-meta-info {
  display: flex;
  flex-direction: column; /* 让内部元素垂直排列 */
  align-items: flex-start; /* 左对齐 */
  gap: 8px; /* 在时长和标签之间添加一些垂直间距 */
  min-width: 150px; /* (可选) 给一个最小宽度，防止标签过多时被压缩 */
}

.music-card-list > :last-child {
  justify-self: end;
}

/* 添加新的样式 */
.wavesurfer-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.wavesurfer-container::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 50%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2));
  pointer-events: none;
  z-index: 10;
}
</style>
