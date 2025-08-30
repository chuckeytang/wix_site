<template>
  <div class="sidebar-container">
    <FilterSection
      v-for="config in filterConfig"
      :key="config.id"
      :title="config.title"
      :start-open="config.id === 'genres'"
    >
      <component
        :is="componentMap[config.componentType]"
        v-if="componentMap[config.componentType]"
        v-model="filters[config.id]"
        v-bind="config.props"
      />
    </FilterSection>
  </div>
</template>

<script setup>
import { reactive, watch, defineProps, defineEmits } from "vue";

// 导入所有需要的“零件”组件
import FilterSection from "./Filters/FilterSection.vue";
import SearchableCheckboxFilter from "./Filters/SearchableCheckboxFilter.vue";
import SimpleCheckboxFilter from "./Filters/SimpleCheckboxFilter.vue";
import RangeSliderFilter from "./Filters/RangeSliderFilter.vue";

// 创建一个“组件地图”
const componentMap = {
  SearchableCheckboxFilter,
  SimpleCheckboxFilter,
  RangeSliderFilter,
};

// 1. 核心改动：定义 props 来接收父组件传入的配置
const props = defineProps({
  config: {
    type: Array,
    required: true,
  },
});

// 2. 定义 emit
const emit = defineEmits(["update:filters"]);

// 核心改动 1: 将 filterConfig 声明为响应式变量
const filterConfig = ref([]);
const filters = reactive({});

const initializeFilters = (config) => {
  const initialData = {};
  config.forEach((c) => {
    if (c.componentType === "RangeSliderFilter") {
      initialData[c.id] = [c.props.min, c.props.max];
    } else if (c.props.items) {
      initialData[c.id] = [];
    } else {
      initialData[c.id] = null;
    }
  });
  Object.assign(filters, initialData);
};

// 监听 props.config 的变化，并在变化后更新本地的 filterConfig
watch(
  () => props.config,
  (newConfig) => {
    if (newConfig && newConfig.length > 0) {
      filterConfig.value = newConfig;
      initializeFilters(newConfig);
    }
  },
  { immediate: true, deep: true }
);

// 监听 filters 状态的变化，并同步给父组件
watch(
  filters,
  (newFilters) => {
    emit("update:filters", newFilters);
  },
  { deep: true }
);
</script>

<style scoped>
/* 核心改动：样式调整以匹配 Premium Beat 风格 */
.sidebar-container {
  padding: 0 20px 20px 20px;
  background-color: #1c1b1b; /* 更深的背景色 */
  color: #fff;
  border-right: 1px solid #333; /* 模拟 Premium Beat 的边框 */
}
</style>
