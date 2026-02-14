<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isVisible" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-card">
          <header class="modal-header">
            <h3 class="modal-title">License Comparison</h3>
            <button class="close-button" @click="$emit('close')">×</button>
          </header>

          <div class="modal-body">
            <p class="intro-text">
              One-time purchase, perpetual use. Pick the license that matches
              your project size.
            </p>

            <div class="table-container">
              <table class="word-style-table">
                <thead>
                  <tr>
                    <th class="feature-col">Features</th>
                    <th>
                      Creator<br />
                      <span class="sub-text">(Personal)</span>
                      <div class="price-tag">$0.50</div>
                    </th>
                    <th>
                      Standard<br />
                      <span class="sub-text">(Freelance)</span>
                      <div class="price-tag">$6.99</div>
                    </th>
                    <th>
                      Business<br />
                      <span class="sub-text">(Studio)</span>
                      <div class="price-tag">$21.99</div>
                    </th>
                    <th>
                      Enterprise<br />
                      <span class="sub-text">(Custom)</span>
                      <div class="price-tag">Contact</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="feature-name">Projects covered</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>Unlimited</td>
                  </tr>
                  <tr>
                    <td class="feature-name">Client work allowed</td>
                    <td class="cross">✘</td>
                    <td class="check">✔</td>
                    <td class="check">✔</td>
                    <td class="check">✔</td>
                  </tr>
                  <tr>
                    <td class="feature-name">
                      Web & Social<br /><span class="desc"
                        >(YouTube, TikTok, Bilibili)</span
                      >
                    </td>
                    <td class="check">✔</td>
                    <td class="check">✔</td>
                    <td class="check">✔</td>
                    <td class="check">✔</td>
                  </tr>
                  <tr>
                    <td class="feature-name">Games & Apps</td>
                    <td class="cross">✘</td>
                    <td class="cross">✘</td>
                    <td>Indie / mid-size</td>
                    <td>Large / global</td>
                  </tr>
                  <tr>
                    <td class="feature-name">TV / Radio / Ad</td>
                    <td class="cross">✘</td>
                    <td class="cross">✘</td>
                    <td>Regional only</td>
                    <td>Worldwide</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="footer-note">
              <p>
                All licenses are one-time purchase and perpetual for approved
                uses.
              </p>
              <p>
                Raw audio cannot be resold, redistributed, or used to train AI
                models.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  isVisible: boolean;
}>();

defineEmits(["close"]);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(3px);
}

.modal-card {
  background-color: #fff; /* 使用白色背景模拟 Word 文档感觉 */
  color: #333;
  width: 90%;
  max-width: 900px;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.modal-header {
  padding: 15px 25px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9f9;
}

.modal-title {
  font-size: 1.4rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 2rem;
  line-height: 1;
  color: #999;
  cursor: pointer;
}
.close-button:hover {
  color: #333;
}

.modal-body {
  padding: 30px;
  overflow-y: auto;
}

.intro-text {
  text-align: center;
  margin-bottom: 20px;
  color: #666;
}

/* --- Word 表格风格 --- */
.table-container {
  overflow-x: auto;
}

.word-style-table {
  width: 100%;
  border-collapse: collapse; /* 边框合并，像 Word 一样 */
  font-family: Arial, sans-serif;
  font-size: 0.95rem;
}

.word-style-table th,
.word-style-table td {
  border: 1px solid #333; /* 黑色实线边框 */
  padding: 12px 10px;
  text-align: center;
  vertical-align: middle;
}

.word-style-table th {
  background-color: #f2f2f2; /* 浅灰表头 */
  font-weight: bold;
  vertical-align: top;
}

.feature-col {
  text-align: left;
  background-color: #fff; /* 第一列背景可以保持白色 */
  width: 25%;
}

.feature-name {
  text-align: left;
  font-weight: bold;
  background-color: #fafafa;
}

.sub-text {
  font-weight: normal;
  font-size: 0.85em;
  display: block;
  color: #555;
  margin-top: 4px;
}

.price-tag {
  margin-top: 8px;
  color: #d35400; /* 深橙色突出价格 */
  font-size: 1.1em;
}

.desc {
  display: block;
  font-weight: normal;
  font-size: 0.8em;
  color: #777;
  margin-top: 4px;
}

.check {
  font-weight: bold;
  font-size: 1.2em;
  color: #27ae60; /* 绿色 */
}

.cross {
  font-weight: bold;
  font-size: 1.1em;
  color: #c0392b; /* 红色 */
  font-family: sans-serif;
}

.footer-note {
  margin-top: 20px;
  font-size: 0.85em;
  color: #777;
  text-align: center;
  border-top: 1px dashed #ccc;
  padding-top: 15px;
}

.footer-note p {
  margin: 5px 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
