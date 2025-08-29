<template>
  <section class="search-section">
    <div class="container search-container">
      <div class="search-input-wrapper" :class="{ 'is-focused': isFocused }">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="placeholderText"
          class="search-input"
          @focus="handleFocus"
          @blur="handleBlur"
          @keyup.enter="handleSearch"
        />
        <button class="search-button" @click="handleSearch">
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
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  placeholderText: {
    type: String,
    default: "Search by genre, mood, purpose or instrument",
  },
});

const searchQuery = ref("");
const isFocused = ref(false);

// 监听 props.placeholderText，用于在搜索结果页更新输入框内容
watch(
  () => props.placeholderText,
  (newVal) => {
    // 只有当传入的不是默认值时才更新 searchQuery
    if (newVal !== "Search by genre, mood, purpose or instrument") {
      searchQuery.value = newVal;
    }
  },
  { immediate: true }
);

// 处理输入框聚焦事件
const handleFocus = () => {
  isFocused.value = true;
  // 如果当前值等于默认提示，则清空
  if (searchQuery.value === props.placeholderText) {
    searchQuery.value = "";
  }
};

// 处理输入框失焦事件
const handleBlur = () => {
  isFocused.value = false;
  // 如果输入框为空，则恢复默认提示
  if (searchQuery.value === "") {
    searchQuery.value = props.placeholderText;
  }
};

const emit = defineEmits(["search"]);

const handleSearch = () => {
  emit("search", searchQuery.value);
};
</script>

<style scoped>
.search-section {
  background-color: transparent;
  padding: 20px 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.search-container {
  display: flex;
  justify-content: center;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 800px;
  background-color: #000;
  border-radius: 5px;
  padding: 10px 15px;
  position: relative; /* 用于伪元素定位 */
  transition: box-shadow 0.3s ease-in-out;
  border: 1px solid transparent; /* 初始边框透明 */
}

/* 渐变淡光效果 */
.search-input-wrapper::before {
  content: "";
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  background: linear-gradient(
    180deg,
    #6e3520,
    /* 主题色 */ #3d1b60 /* 荧光蓝 */
  );
  border-radius: 8px; /* 略大于父元素以覆盖角落 */
  z-index: -1;
  opacity: 0; /* 默认隐藏 */
  transition: opacity 0.3s ease-in-out;
}

/* 聚焦时显示淡光 */
.search-input-wrapper.is-focused::before {
  opacity: 1;
}

.search-input {
  flex-grow: 1;
  border: none;
  background: transparent;
  color: #888;
  font-size: 16px;
  outline: none;
}

.search-input::placeholder {
  color: #888;
}

.search-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #ccc;
  padding: 5px;
}

.search-button svg {
  width: 20px;
  height: 20px;
}
</style>
