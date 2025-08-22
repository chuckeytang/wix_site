<template>
  <div class="pagination-container">
    <button
      class="pagination-button"
      :class="{ 'is-disabled': currentPage === 1 }"
      @click="goToPage(currentPage - 1)"
      :disabled="currentPage === 1"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    </button>

    <div class="page-numbers">
      <button
        v-for="page in pagesToShow"
        :key="page"
        class="page-number"
        :class="{ active: page === currentPage }"
        @click="goToPage(page)"
      >
        {{ page === "..." ? "..." : page }}
      </button>
    </div>

    <button
      class="pagination-button"
      :class="{ 'is-disabled': currentPage === totalPages }"
      @click="goToPage(currentPage + 1)"
      :disabled="currentPage === totalPages"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineProps, defineEmits } from "vue";

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  visiblePages: {
    type: Number,
    default: 5,
  },
});

const emit = defineEmits(["update:currentPage"]);

const goToPage = (page: number | string) => {
  if (typeof page === "number" && page >= 1 && page <= props.totalPages) {
    emit("update:currentPage", page);
  }
};

const pagesToShow = computed(() => {
  const { totalPages, currentPage, visiblePages } = props;
  const result: (number | string)[] = [];

  // 如果总页数小于或等于可见页数，直接显示所有页码
  if (totalPages <= visiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      result.push(i);
    }
    return result;
  }

  // 否则，处理页码省略
  const start = Math.max(2, currentPage - Math.floor(visiblePages / 2) + 1);
  const end = Math.min(
    totalPages - 1,
    currentPage + Math.floor(visiblePages / 2)
  );

  // 始终显示第一页
  result.push(1);
  if (start > 2) {
    result.push("...");
  }

  // 显示中间页码
  for (let i = start; i <= end; i++) {
    result.push(i);
  }

  if (end < totalPages - 1) {
    result.push("...");
  }

  // 始终显示最后一页
  result.push(totalPages);

  // 确保没有重复的省略号
  if (
    result[result.length - 2] === "..." &&
    result[result.length - 1] === "..."
  ) {
    result.pop();
  }

  // 过滤相邻的重复页码
  const uniqueResult = result.filter((item, index, arr) => {
    return index === 0 || item !== arr[index - 1] || item === "...";
  });

  return uniqueResult;
});
</script>

<style scoped>
.pagination-container {
  background-color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding-top: 40px;
  padding-bottom: 40px;
}

.pagination-button {
  background-color: transparent;
  border: 1px solid #444;
  color: #fff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    background-color 0.3s,
    border-color 0.3s;
}

.pagination-button:hover {
  background-color: #555;
  border-color: #fff;
}

.pagination-button.is-disabled {
  border-color: #222;
  color: #333;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 8px;
}

.page-number {
  background-color: transparent;
  color: #fff;
  font-weight: bold;
  padding: 8px 14px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.page-number:hover:not(.active) {
  background-color: #333;
}

.page-number.active {
  background-color: #fff;
  color: #0d0d1a;
}
</style>
