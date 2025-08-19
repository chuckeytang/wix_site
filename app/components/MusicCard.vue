<template>
    <div class = "music-card-list">
        <div class = "left-section">
            <button class = "play-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
            </button>
            <div class = "track-info">
                <span class = "track-title">{{ track.Title }}</span>
                <span class = "track-artist">{{ track.Artist }}</span>
            </div>
        </div>

        <div class = "waveform-placeholder">
            <img :src="track.WaveformImage" alt="Waveform" class="waveform-image" v-if="track.WaveformImage" />
            <div class="placeholder-text" v-else>波形图占位</div>
        </div>

        <div class="track-meta-info">
                <div class = "duration-bpm">
                    <span class = "duration">{{ track.Duration }}</span>
                    <span class = "bpm">{{ track.BPM + '  BPM'}}</span>
                </div>
        </div>

        <div class = "category-tags">
            <span v-for="(tag, index) in track.Categories" :key="index" class="tag">{{ tag }}</span>
        </div>

        <div class="right-column-group">
            <div class = "action-buttons">
                <button class = "action-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
                <button class = "action-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                </button>
            </div>

            <button class="download-button">download</button>
        </div>
    </div>
</template>

<script setup>
import {defineProps} from 'vue';

const props = defineProps({
    track: {
        type: Object,
        required: true,
    },
});
</script>

<style scoped>
/* 父容器：使用 Grid 布局，定义三列
  1. 左侧内容，固定宽度 250px
  2. 波形图，占据所有剩余空间 (1fr)
  3. 右侧所有元素，宽度由内容决定 (auto)
*/
.music-card-list {
    display: grid;
    grid-template-columns: 250px 750px 100px 220px auto;
    align-items: center;
    gap: 20px; /* 控制列之间的间距 */
    
    /* 保持原有的样式 */
    padding: 15px 20px;
    border-bottom: 1px solid #222;
    transition: background-color 0.3s;
}

.music-card-list:hover {
    background-color: #1a1a1a;
}

/* 左侧部分
  - 移除 flex-basis/flex-grow，因为 Grid 布局已经控制了它的宽度
  - 内部使用 Flexbox 来对齐播放按钮和歌曲信息
*/
.left-section {
    display: flex;
    align-items: center;
    gap: 20px;
}

/* 歌曲信息 */
.track-info {
    display: flex;
    flex-direction: column;
}

.track-title {
    font-weight: bold;
    font-size: 1.1em;
}

.track-artist {
    font-size: 0.9em;
    color: #aaa;
}

/* 波形图占位符
  - 移除 flex-grow: 1，因为它在 Grid 布局中已经通过 1fr 占据了剩余空间
*/
.waveform-placeholder {
    height: 50px;
    background-color: #222;
    border-radius: 5px;
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.waveform-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.placeholder-text {
    color: #666;
    font-size: 0.9em;
}

/* 右侧元素组合容器
  - 使用 Flexbox 来管理内部元素的排列
  - gap 属性控制其内部元素之间的间距
*/
.right-column-group {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-direction: row; 
}

/* 时长和BPM */
.duration-bpm {
    display: flex;
    flex-direction: column;
    /* 调整为 flex-start，使其左对齐 */
    align-items: flex-start;
    font-size: 0.9em;
    color: #ccc;
    flex-shrink: 0;
}

.duration {
    font-weight: bold;
}

.bpm {
    font-size: 0.8em;
    color: #888;
}

/* 分类标签 */
.category-tags {
    display: flex;
    gap: 5px;
    flex-shrink: 0;
    flex-wrap: wrap;
}

.tag {
    background-color: #444;
    color: #fff;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.7em;
    white-space: nowrap;
}

/* 操作按钮 */
.action-buttons {
    display: flex;
    gap: 5px;
    flex-shrink: 0;
}

.action-btn {
    background-color: transparent;
    border: none;
    color: #0a0a0a;
    cursor: pointer;
    padding: 5px;
}

/* 下载按钮 */
.download-button {
    background-color: #ff8c62;
    color: #0d0d1a;
    font-weight: bold;
    padding: 10px 20px;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    transition: background-color 0.3s;
    flex-shrink: 0;
}

.download-button:hover {
    background-color: #e67a54;
}

/* 播放按钮 */
.play-button {
    background-color: transparent;
    border: none;
    color: #fff;
    cursor: pointer;
    padding: 5px;
}

.music-list-section {
    background-color: #0d0d1a;
    padding: 20px 0;
    color: #fff;
}

.track-meta-info {
    display: flex;
    flex-direction: column; /* 让内部元素垂直排列 */
    align-items: flex-start; /* 左对齐 */
    gap: 8px; /* 在时长和标签之间添加一些垂直间距 */
    min-width: 150px; /* (可选) 给一个最小宽度，防止标签过多时被压缩 */
}

.music-card-list > :last-child {
    justify-self: end;
}
</style>