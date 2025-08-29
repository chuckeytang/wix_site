<template>
    <div class="searchable-checkbox-filter">
      <input type="text" v-model="searchText" placeholder="搜索" class="filter-search-input"/>
        <ul class="checkbox-list">
            <li v-for="item in filteredList" :key="item.id">
                <label>
                    <input type="checkbox" :value="item.id" v-model="selectedValues" />
                    {{ item.name }}
                    <span class="item-count">{{ item.count }}</span>
                </label>
                <ul v-if="item.children && item.children.length" class="checkbox-sub-list">
                    <li v-for="child in item.children" :key="child.id">
                    <label>
                        <input type="checkbox" :value="child.id" v-model="selectedValues" />
                        {{ child.name }}
                        <span class="item-count">{{ child.count }}</span>
                    </label>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  items: { type: Array, required: true },
  modelValue: { type: Array, required: true },
});

const emit = defineEmits(['update:modelValue']);

const searchText = ref('');

const selectedValues = computed({
  get: () => props.modelValue,
  set: (newValue) => emit('update:modelValue', newValue),
});

const filteredList = computed(() => {
  if (!searchText.value) return props.items;
  const lowerCaseSearch = searchText.value.toLowerCase();
  const filterItems = (items) => items.reduce((acc, item) => {
    const selfMatch = item.name.toLowerCase().includes(lowerCaseSearch);
    let childrenMatch = [];
    if (item.children) childrenMatch = filterItems(item.children);
    if (selfMatch || childrenMatch.length > 0) acc.push({ ...item, children: childrenMatch });
    return acc;
  }, []);
  return filterItems(props.items);
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