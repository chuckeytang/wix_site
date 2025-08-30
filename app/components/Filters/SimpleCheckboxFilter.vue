<template>
  <div>
    <p v-if="description" class="filter-description">{{ description }}</p>
    <ul class="checkbox-list">
      <li v-for="item in items" :key="item.id">
        <label>
          <input type="checkbox" :value="item.id" v-model="selectedValues" />
          {{ item.name }}
          <span class="item-count">{{ item.count }}</span>
        </label>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from "vue";

console.log("SimpleCheckboxFilter.vue setup 被调用");
const props = defineProps(["items", "modelValue", "description"]);
const emit = defineEmits(["update:modelValue"]);

const selectedValues = computed({
  get: () => props.modelValue,
  set: (newValue) => emit("update:modelValue", newValue),
});
</script>

<style scoped>
.filter-description {
  color: #aaa;
  font-size: 0.9rem;
  margin-top: -10px;
  margin-bottom: 15px;
}
.checkbox-list {
  list-style: none;
  padding: 0;
}
.checkbox-list > li {
  margin-bottom: 10px;
}
label {
  display: flex;
  align-items: center;
  cursor: pointer;
}
input[type="checkbox"] {
  margin-right: 10px;
}
.item-count {
  margin-left: auto;
  color: #888;
  font-size: 0.9em;
}
</style>
