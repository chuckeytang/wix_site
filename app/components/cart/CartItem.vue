<template>
  <div class="cart-item-row">
    <div class="item-details">
      <button
          class="play-icon-btn"
          @click="handlePlayClick"
          :disabled="isLoadingDetails" 
        >
          <svg
            v-if="isLoadingDetails"
            class="spinner"
            width="24"
            height="24"
            viewBox="0 0 50 50"
          >
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke-width="5"
            ></circle>
          </svg>

          <svg
            v-else-if="localIsPlaying"
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
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>

          <svg
            v-else
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
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        </button>

      <span class="track-name">{{ productTitle }}</span>
    </div>

    <div class="item-meta">
      <div class="license-type">
        <span class="type-label">{{
          item.licenseOption || "Standard License"
        }}</span>
        <span class="price-info">Usable for Commercial Work</span>
      </div>

      <span class="item-price">US$ {{ displayPrice.toFixed(2) }}</span>
    </div>

    <div class="item-actions">
      <button class="remove-btn" @click="handleRemove">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed, ref } from "vue";
import { useCartStore } from "~/stores/cart";
import { useMusicPlayerStore } from "~/stores/musicPlayer";
import { tracksApi, sfxApi } from "~/api";
import type { CartItems } from "~/types/cartItems";
import type { Tracks } from "~/types/tracks";
import type { Sfx } from "~/types/sfx";

// ----------------------------------------------------
// Props：接收单个购物车商品数据
// ----------------------------------------------------
const props = defineProps({
  item: {
    type: Object as () => CartItems, // 使用 Pinia Store 中定义的 CartItem 接口
    required: true,
  },
});

console.log("购物车项目数据:", props.item);

const localIsPlaying = computed(() => {
  // 核心修复：Store 中只有一个 currentTrack 属性，无需 || currentSfx
  const currentMedia = musicPlayerStore.currentTrack; 

  // 1. 检查全局播放器是否正在播放
  if (!musicPlayerStore.isPlaying || !currentMedia) {
    return false;
  }

  // 2. 检查播放的媒体类型是否与当前项目匹配
  const isCorrectType = musicPlayerStore.mediaType === props.item.productType;
  if (!isCorrectType) {
    return false;
  }

  // 3. 检查播放的媒体ID是否与当前项目的ID匹配
  let currentMediaId: number | undefined;

  if (musicPlayerStore.mediaType === 'track') {
    // 强制转换为 Tracks 类型以访问 trackId
    currentMediaId = (currentMedia as Tracks).trackId;
  } else if (musicPlayerStore.mediaType === 'sfx') {
    // 强制转换为 Sfx 类型以访问 sfxId
    currentMediaId = (currentMedia as Sfx).sfxId;
  }
  
  const itemProductId = props.item.productId;

  // 这里的比较是安全的，因为我们已经通过 mediaType 确定了 ID 的来源。
  return currentMediaId === itemProductId;
});

const cartStore = useCartStore();
const musicPlayerStore = useMusicPlayerStore(); // 假设播放器Store
const isLoadingDetails = ref(false);

/**
 * 获取曲目或音效的标题
 * @returns {string}
 */
const productTitle = computed(() => {
  // 检查 track 或 sfx 关联对象是否存在并返回其标题
  return props.item.track?.title || props.item.sfx?.title || "Unknown Product";
});

/**
 * 获取价格 (价格字段名已变)
 * @returns {number}
 */
const displayPrice = computed(() => {
  // 使用 priceAtAddition，并处理 potential null/undefined
  return props.item.priceAtAddition || 0;
});

// ----------------------------------------------------
// Actions：处理用户交互
// ----------------------------------------------------

// 处理播放按钮点击 (假设：点击后在全局播放器中播放此曲目)
// 处理播放按钮点击
const handlePlayClick = async () => {
  // 1. 如果当前项目正在播放，则切换为暂停 (这部分逻辑保留)
  if (localIsPlaying.value) {
    musicPlayerStore.togglePlayPause();
    return;
  }

  // 2. 否则，开始获取数据并播放
  isLoadingDetails.value = true;
  try {
    const { productType, productId } = props.item;

    if (productType === "track") {
      // 2a. 获取【完整】音乐详情
      const response = await tracksApi.getTrackDetail(productId);
      if (response.data) {
        musicPlayerStore.setTrack(response.data); // 调用全局播放
      } else {
        throw new Error("Track data not found");
      }
    } else if (productType === "sfx") {
      // 2b. 获取【完整】音效详情
      // (假设你有一个 sfxApi.getSfxDetail 接口)
      const response = await sfxApi.getSfxDetail(productId); 
      if (response.data) {
        musicPlayerStore.setSfx(response.data); // 调用全局播放
      } else {
        throw new Error("SFX data not found");
      }
    }
  } catch (error) {
    console.error("无法播放此项目:", error);
  } finally {
    // 3. 无论成功与否，结束加载状态
    isLoadingDetails.value = false;
  }
};

// 处理删除按钮点击
const handleRemove = () => {
  // 逻辑：调用 Pinia Store 的 removeItem 并传入后端 ID
  if (props.item.cartItemId !== undefined) {
    cartStore.removeItem(props.item.cartItemId); // 调用 removeItem 并传入 cartItemId
    // 移除 log 中的模板字符串，避免在 log 编译时报错
    console.log(`Item removed: ${productTitle.value}`);
  } else {
    console.error("Cannot remove item: cartItemId is missing.");
  }
};
</script>

<style scoped>
.cart-item-row {
  display: grid;
  /* 1. 播放/曲名 2. 授权/价格 3. 删除按钮 */
  grid-template-columns: minmax(300px, 2fr) minmax(150px, 1fr) auto;
  align-items: center;
  gap: 20px;
  padding: 15px 0;
  border-bottom: 1px solid #222; /* 分隔线 */
  transition: background-color 0.2s;
}

.cart-item-row:hover {
  background-color: #1f1f1f; /* 悬停时颜色略深 */
}

/* 1. 播放和曲目信息 */
.item-details {
  display: flex;
  align-items: center;
  gap: 15px;
}

.play-icon-btn {
  background: none;
  border: none;
  color: #ccc;
  cursor: pointer;
  padding: 5px;
  transition: color 0.2s;
}
.play-icon-btn:hover {
  color: #ff9900; /* 悬停时使用重点色 */
}

.track-name {
  font-weight: bold;
  color: #fff;
}

/* 2. 授权和价格信息 */
.item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.license-type {
  display: flex;
  flex-direction: column;
  font-size: 0.9em;
  color: #ccc;
  /* 这里的样式可以进一步美化为下拉框 */
}

.type-label {
  font-weight: bold;
}

.price-info {
  font-size: 0.8em;
  color: #888;
}

.item-price {
  font-weight: bold;
  color: #fff;
  white-space: nowrap; /* 防止价格换行 */
}

/* 3. 删除按钮 */
.item-actions {
  justify-self: end; /* 靠右对齐 */
}

.remove-btn {
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 5px;
  transition: color 0.2s;
}

.remove-btn:hover {
  color: #ff0000; /* 悬停时使用红色 */
}

/* 修复：防止图标切换时按钮大小变化导致页面跳动 */
.play-icon-btn {
  /* 你的 padding 是 5px, 图标是 24px, 总宽/高 = 24 + 5*2 = 34px */
  width: 34px; 
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 禁用时的样式 */
.play-icon-btn:disabled {
  color: #555; /* 灰色 */
  cursor: not-allowed;
}

/* 修复：悬停时，仅在未禁用时变色 */
.play-icon-btn:hover:not(:disabled) {
  color: #ff9900;
}

/* 加载中 Spinner 动画 */
.spinner {
  animation: rotate 2s linear infinite;
}
.spinner circle {
  stroke: #ff9900; /* 使用你的悬停色 */
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}
@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}
@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
</style>
