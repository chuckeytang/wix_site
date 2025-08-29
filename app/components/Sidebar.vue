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
import { reactive, watch } from 'vue';

// 1. 导入所有需要的“零件”组件
import FilterSection from './Filters/FilterSection.vue';
import SearchableCheckboxFilter from './Filters/SearchableCheckboxFilter.vue';
import SimpleCheckboxFilter from './Filters/SimpleCheckboxFilter.vue';
import RangeSliderFilter from './Filters/RangeSliderFilter.vue';

// 2. 创建一个“组件地图”，将字符串名字映射到真实的组件上
const componentMap = {
  SearchableCheckboxFilter,
  SimpleCheckboxFilter,
  RangeSliderFilter,
};

// 3. 这是我们的核心“配置清单”
// 在真实应用中，这个数组可以由父组件通过 props 传入，甚至直接从 API 获取！
const filterConfig = reactive([
  {
    id: 'genres',
    title: '类型',
    componentType: 'SearchableCheckboxFilter',
    props: {
      items: [
        { id: 'hip-hop', name: 'Hip Hop', count: 3150, children: [{ id: 'trap', name: '陷阱音乐', count: 784 }] },
        { id: 'rnb', name: 'R&B', count: 2888, children: [{ id: 'rnb-pop', name: 'R&B 流行乐', count: 751 }] },
      ]
    }
  },
  {
    id: 'vocals',
    title: '声乐',
    componentType: 'SimpleCheckboxFilter',
    props: {
      items: [
        { id: 'lead-vocals', name: '主唱声乐', count: 2471 },
        { id: 'choir', name: '合唱/组合', count: 2734 },
      ],
      description: "大多数声乐歌曲都包含伴奏版本"
    }
  },
  {
    id: 'bpmRange',
    title: 'BPM',
    componentType: 'RangeSliderFilter',
    props: { min: 0, max: 250 }
  }
]);

// 4. 定义 emit 和 filters 状态，与之前相同
const emit = defineEmits(['update:filters']);

const filters = reactive({
  genres: [],
  vocals: [],
  bpmRange: [0, 250],
});

// 5. watch 逻辑也保持不变
watch(filters, (newFilters) => {
  emit('update:filters', newFilters);
});
</script>

<style scoped>
.sidebar-container {
  padding: 0 20px 20px 20px;
  color: #fff;
}
</style>