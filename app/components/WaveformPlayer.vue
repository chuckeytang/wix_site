<template>
  <div
    class="waveform-placeholder"
    @mousemove="handleHover"
    @mouseenter="handleHoverEnter"
    @mouseleave="handleHoverLeave"
    @click="handleWaveformClick"
  >
    <div class="wavesurfer-container" ref="waveformRef"></div>
    <div
      class="hover-progress-overlay"
      :style="{ width: hoverProgress + '%' }"
    ></div>
    <div class="hover-playhead" :style="{ left: hoverProgress + '%' }"></div>
  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  onUnmounted,
  watch,
  defineProps,
  defineEmits,
} from "vue";
import WaveSurfer from "wavesurfer.js";

const props = defineProps({
  audioUrl: {
    type: String,
    required: true,
  },
  isPlaying: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits([
  "play",
  "pause",
  "update-progress",
  "ready",
  "waveform-click",
]);

const waveformRef = ref(null);
const wavesurfer = ref(null);
const hoverProgress = ref(0);
const totalDuration = ref(0);

// 监听 isPlaying 属性变化，控制播放/暂停
watch(
  () => props.isPlaying,
  (newVal) => {
    if (!wavesurfer.value) {
      console.warn("[WaveformPlayer] wavesurfer 实例未初始化!");
      return;
    }

    if (newVal) {
      // 避免重复播放
      if (!wavesurfer.value.isPlaying()) {
        wavesurfer.value.play();
        console.log(`[WaveformPlayer] 开始播放，歌曲 ID: ${props.audioUrl}`);
      }
    } else {
      // 避免重复暂停
      if (wavesurfer.value.isPlaying()) {
        wavesurfer.value.pause();
        console.log(`[WaveformPlayer] 暂停播放，歌曲 ID: ${props.audioUrl}`);
      }
    }
  }
);

// 创建 Wavesurfer 实例的函数
const createWavesurfer = () => {
  if (wavesurfer.value) {
    wavesurfer.value.destroy();
  }

  // 1. 创建渐变色
  const containerWidth = waveformRef.value.offsetWidth;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, containerWidth, 0);

  gradient.addColorStop(0, "#ff7857");
  gradient.addColorStop(0.5, "#ffb38a");
  gradient.addColorStop(1, "#ffd08a");

  // 2. 实例化 Wavesurfer
  wavesurfer.value = WaveSurfer.create({
    container: waveformRef.value,
    waveColor: "#666",
    progressColor: gradient,
    cursorColor: "#ffe178",
    cursorWidth: 2,
    barWidth: 2,
    barGap: 1,
    height: 50,
    responsive: true,
    hideScrollbar: true,
  });

  if (props.audioUrl) {
    wavesurfer.value.load(props.audioUrl);
  }

  // 4. 监听事件
  wavesurfer.value.on("play", () => emits("play"));
  wavesurfer.value.on("pause", () => emits("pause"));
  wavesurfer.value.on("finish", () => {
    wavesurfer.value.seekTo(0);
    emits("pause");
    emits("update-progress", 0);
  });
  wavesurfer.value.on("audioprocess", () => {
    if (wavesurfer.value) {
      const progress =
        (wavesurfer.value.getCurrentTime() / wavesurfer.value.getDuration()) *
        100;
      emits("update-progress", progress);
    }
  });
  wavesurfer.value.on("ready", () => {
    totalDuration.value = wavesurfer.value.getDuration();
    emits("ready");
    if (props.isPlaying) {
      wavesurfer.value.play();
    }
  });
};

onMounted(() => {
  createWavesurfer();
});

onUnmounted(() => {
  if (wavesurfer.value) {
    wavesurfer.value.destroy();
  }
});

// 处理波形图点击和悬停
const handleWaveformClick = (event) => {
  if (!waveformRef.value) return;
  const rect = waveformRef.value.getBoundingClientRect();
  const relativeX = (event.clientX - rect.left) / rect.width;
  // 向父组件传递点击位置的相对进度
  emits("waveform-click", relativeX);
};

const handleHover = (event) => {
  if (!waveformRef.value) return;
  const rect = waveformRef.value.getBoundingClientRect();
  const x = event.clientX - rect.left;
  hoverProgress.value = (x / rect.width) * 100;
};
const handleHoverEnter = () => {};
const handleHoverLeave = () => {
  hoverProgress.value = 0;
};

// 暴露给父组件的方法
const play = () => wavesurfer.value?.play();
const pause = () => wavesurfer.value?.pause();
const seekTo = (progress) => wavesurfer.value?.seekTo(progress);
const setVolume = (volume) => wavesurfer.value?.setVolume(volume);
const getDuration = () => totalDuration.value;

const setSegment = (segment) => {
  let start = 0;
  let end = totalDuration.value;
  if (segment === "15s" && totalDuration.value > 15) {
    end = 15;
  } else if (segment === "30s" && totalDuration.value > 30) {
    end = 30;
  } else if (segment === "60s" && totalDuration.value > 60) {
    end = 60;
  }
  wavesurfer.value.seekTo(0);
  wavesurfer.value.play(start, end);
};

defineExpose({
  play,
  pause,
  seekTo,
  setVolume,
  getDuration,
  setSegment,
});
</script>

<style scoped>
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
.hover-progress-overlay {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 140, 98, 0.2),
    rgba(255, 179, 138, 0.2)
  );
  z-index: 10;
  pointer-events: none;
}
.hover-playhead {
  position: absolute;
  top: 0;
  height: 100%;
  width: 2px;
  background-color: rgba(255, 140, 98, 0.5);
  z-index: 11;
  transform: translateX(-50%);
  pointer-events: none;
}
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
