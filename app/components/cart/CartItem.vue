<template>
  <div class="cart-item-row">
    <div class="item-details">
      <button class="play-icon-btn" @click="handlePlayClick(item)">
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
import { defineProps, computed } from "vue";
import { useCartStore } from "~/stores/cart";
import { useMusicPlayerStore } from "~/stores/musicPlayer";
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
const handlePlayClick = (item: CartItems) => {
  // 1. 如果当前项目正在播放，则切换为暂停
  if (localIsPlaying.value) {
    musicPlayerStore.togglePlayPause();
    return;
  }

  // 2. 否则，检查是否是当前暂停的媒体，如果是则恢复播放
  // 优化判断逻辑：使用 currentPlayingId 检查是否是当前媒体
  if (
    !musicPlayerStore.isPlaying &&
    musicPlayerStore.mediaType === item.productType &&
    musicPlayerStore.currentPlayingId === item.productId
  ) {
    musicPlayerStore.togglePlayPause();
    return;
  }
  
  // 3. 否则，设置新曲目并播放
  if (item.productType === 'track' && item.track) {
    // 直接调用 setTrack，Store 会处理类型
    musicPlayerStore.setTrack(item.track as Tracks); 
  } else if (item.productType === 'sfx' && item.sfx) {
    // 直接调用 setSfx
    musicPlayerStore.setSfx(item.sfx as Sfx);
  } else {
    console.error("无法播放此项目：产品类型或数据缺失", item);
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
</style>
