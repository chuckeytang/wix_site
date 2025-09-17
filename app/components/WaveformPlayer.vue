<template>
  <div
    class="waveform-placeholder"
    @mousemove="handleHover"
    @mouseenter="handleHoverEnter"
    @mouseleave="handleHoverLeave"
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
  canControl: {
    type: Boolean,
    default: true,
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

// 监听 audioUrl 变化，重新加载音频
watch(
  () => props.audioUrl,
  (newUrl, oldUrl) => {
    if (newUrl && newUrl !== oldUrl) {
      loadAudio(newUrl);
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
  });

  if (props.canControl) {
    // 简化 interaction 监听器
    wavesurfer.value.on("interaction", (time) => {
      // 直接跳转到点击位置
      wavesurfer.value.seekTo(time / wavesurfer.value.getDuration());
      emits("waveform-click", time / wavesurfer.value.getDuration());
    });
  } else {
    // 简化 interaction 监听器
    wavesurfer.value.on("interaction", (time) => {
      emits("waveform-click", time / wavesurfer.value.getDuration());
    });
  }
};

onMounted(() => {
  createWavesurfer();
});

onBeforeUnmount(() => {
  if (wavesurfer.value) {
    console.log("销毁 WaveSurfer 实例...");
    wavesurfer.value.destroy();
  }
});

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
const play = () => {
  wavesurfer.value?.play();
};
const pause = () => {
  wavesurfer.value?.pause();
};
const seekTo = (progress) => wavesurfer.value?.seekTo(progress);
const setVolume = (volume) => wavesurfer.value?.setVolume(volume);
const getDuration = () => totalDuration.value;
const loadAudio = (url) => {
  if (wavesurfer.value) {
    wavesurfer.value.load(url);
  }
};

defineExpose({
  play,
  pause,
  seekTo,
  setVolume,
  getDuration,
  loadAudio,
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
