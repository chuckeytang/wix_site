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
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";

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
const regions = ref(null);

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

  // 获取 Regions 插件实例
  const regionsPluginInstance = RegionsPlugin.create();
  regions.value = regionsPluginInstance;

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
    plugins: [regionsPluginInstance],
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

  wavesurfer.value.on("interaction", (time) => {
    console.log("Interaction:", time);
    // 检查是否有分段区域存在
    if (regions.value?.getRegions()?.length > 0) {
      const mainRegion = regions.value.getRegions()[0];

      // 如果点击在区域外，将播放头跳转回区域起始点
      if (time < mainRegion.start || time > mainRegion.end) {
        wavesurfer.value.seekTo(
          mainRegion.end / wavesurfer.value.getDuration()
        );
      } else {
        console.log(
          "Click within region.",
          time / wavesurfer.value.getDuration()
        );
        // 如果点击在区域内，跳转到点击位置
        wavesurfer.value.seekTo(time / wavesurfer.value.getDuration());
        emits("waveform-click", time / wavesurfer.value.getDuration());
      }
    } else {
      // 如果没有分段区域，直接跳转到点击位置
      wavesurfer.value.seekTo(time / wavesurfer.value.getDuration());
      wavesurfer.value.play();
      emits("waveform-click", time / wavesurfer.value.getDuration());
    }
  });

  // regions插件的事件监听器
  regions.value.on("region-clicked", (region, e) => {
    console.log(`region-in`);
    wavesurfer.value.play();
    emits("play");
  });

  regions.value.on("region-out", (region) => {
    console.log(`region-out`);
    wavesurfer.value.pause();
    emits("pause");
  });
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

const setSegment = (segment) => {
  if (!wavesurfer.value || !regions.value) {
    console.error("Wavesurfer 或 Regions 实例未初始化！");
    return;
  }
  // 移除所有旧的区域
  regions.value.clearRegions();

  let start = 0;
  let end = wavesurfer.value.getDuration();

  if (segment === "15s" && wavesurfer.value.getDuration() > 15) {
    end = 15;
  } else if (segment === "30s" && wavesurfer.value.getDuration() > 30) {
    end = 30;
  } else if (segment === "60s" && wavesurfer.value.getDuration() > 60) {
    end = 60;
  } else if (segment === "full") {
    return;
  }

  // 创建一个新区域
  const region = regions.value.addRegion({
    start,
    end,
    color: "rgba(255, 140, 98, 0.3)",
    drag: false, // 禁止拖动
    resize: false, // 禁止改变大小
  });
};

defineExpose({
  play,
  pause,
  seekTo,
  setVolume,
  getDuration,
  setSegment,
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
