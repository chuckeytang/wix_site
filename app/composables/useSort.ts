// composables/useSort.ts
import { ref, onMounted, onUnmounted } from "vue"; // ✨ 导入 onMounted 和 onUnmounted

// 定义排序选项的类型
export interface SortOption {
  value: string;
  label: string;
  orderByColumn: string;
  isAsc: string;
}

// 定义排序选项
export const sortOptions: SortOption[] = [
  {
    value: "popular",
    label: "Most Popular",
    orderByColumn: "download_count",
    isAsc: "desc",
  },
  {
    value: "newest",
    label: "Newest",
    orderByColumn: "production_year",
    isAsc: "desc",
  },
  {
    value: "oldest",
    label: "Oldest",
    orderByColumn: "production_year",
    isAsc: "asc",
  },
];

/**
 * 封装排序逻辑的组合式函数
 * @param onSortChange 排序选项改变时的回调函数
 * @returns 包含排序状态和方法的对象
 */
export function useSort(onSortChange: (option: SortOption) => void) {
  const isDropdownOpen = ref<boolean>(false);
  const currentSort = ref<SortOption>(sortOptions[0]!);

  // 创建一个 ref 来绑定到下拉菜单的 DOM 元素
  const dropdownRef = ref<HTMLElement | null>(null);

  const toggleSortDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
  };

  const selectSortOption = (option: SortOption) => {
    currentSort.value = option;
    isDropdownOpen.value = false;
    onSortChange(option);
  };

  onMounted(() => {
    document.addEventListener("click", handleClickOutside);
  });

  onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
  });

  const handleClickOutside = (event: MouseEvent) => {
    // 检查点击事件是否发生在下拉菜单内部
    if (
      dropdownRef.value &&
      !dropdownRef.value.contains(event.target as Node)
    ) {
      isDropdownOpen.value = false;
    }
  };

  return {
    isDropdownOpen,
    currentSort,
    sortOptions,
    toggleSortDropdown,
    selectSortOption,
    dropdownRef,
  };
}
