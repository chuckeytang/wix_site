<template>
    <div class = "range-slider-wrapper">
        <Slider v-model = "value" :min = "min" :max = "max" :step="step" class = "slider-custom"/>
        <div class = "range-values">
            <span>{{ value[0] }}</span>
            <span>{{ value[1] >= max ? `${max}+` : value[1] }}</span>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import Slider from '@vueform/slider';
import '@vueform/slider/themes/default.css';

const props = defineProps({
  modelValue: { type: Array, required: true },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 250 },
  step: { type: Number, default: 1 },
});

const emit = defineEmits(['update:modelValue']);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emit('update:modelValue', newValue);
  }
});
</script>

<style scoped>
.filter-search-input { width: 100%; padding: 8px; margin-bottom: 15px; background-color: #333; border: 1px solid #555; color: #fff; border-radius: 4px; }
.checkbox-list, .checkbox-sub-list { list-style: none; padding: 0; }
.checkbox-sub-list { padding-left: 20px; margin-top: 10px; }
.checkbox-list > li { margin-bottom: 15px; }
.checkbox-sub-list > li { margin-bottom: 10px; }
label { display: flex; align-items: center; cursor: pointer; }
input[type="checkbox"] { margin-right: 10px; }
.item-count { margin-left: auto; color: #888; font-size: 0.9em; }
</style>