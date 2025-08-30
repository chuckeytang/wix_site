<template>
  <div class="filter-section" :class="{ 'is-open': isOpen }">
    <div class="section-header" @click="toggle">
      <h4 class="section-title">{{ title }}</h4>

      <span class="toggle-icon">{{ isOpen ? "-" : "+" }}</span>
    </div>
    <div v-show="isOpen" class="section-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  title: { type: String, required: true },
  startOpen: { type: Boolean, default: false },
});

const isOpen = ref(props.startOpen);

const toggle = () => {
  isOpen.value = !isOpen.value;
};
</script>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  cursor: pointer;
  border-bottom: 1px solid #333;
  user-select: none;
}
.section-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}
.toggle-icon {
  font-size: 1.8rem;
  font-weight: 300;
  line-height: 1;
}
.section-content {
  padding: 20px 0;
}
</style>
