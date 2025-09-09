<template>
  <div class="range-slider-wrapper">
    <Slider
      v-model="value"
      :min="min"
      :max="max"
      :step="step"
      class="slider-custom"
    />
    <div class="range-values">
      <span>{{ value[0] }} {{ unit }}</span>
      <span>{{ value[1] >= max ? `${max}+` : `${value[1]} ${unit}` }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import Slider from "@vueform/slider";
import "@vueform/slider/themes/default.css";

const props = defineProps({
  modelValue: { type: Array, required: true },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 250 },
  step: { type: Number, default: 1 },
  unit: { type: String, default: "" }, // 新增单位 prop
});

const emit = defineEmits(["update:modelValue"]);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emit("update:modelValue", newValue);
  },
});
</script>

<style>
/* 全局修改 Slider 样式，需要去掉 scoped */
.slider-custom {
  --slider-bg: #3c3c3c; /* 滑条背景颜色 */
  --slider-connect-bg: #ff8c62; /* 选中区域颜色 */
  --slider-tooltip-bg: #ff8c62; /* tooltip 背景色 */
  --slider-handle-bg: #fff; /* 滑块背景色 */
  --slider-handle-ring-color: #ff8c62; /* 滑块外圈颜色 */
  --slider-handle-ring-width: 3px;
  --slider-handle-shadow: none; /* 移除阴影 */
  --slider-height: 4px;
  --slider-handle-width: 16px;
  --slider-handle-height: 16px;
}
</style>

<style scoped>
.range-slider-wrapper {
  padding: 15px 0;
}
.range-values {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  color: #a0a0a0;
  font-size: 0.9rem;
}
</style>
