<template>
  <div class="dialog-overlay" @click.self="close">
    <div class="dialog-content">
      <button class="close-button" @click="close">&times;</button>

      <h2 class="dialog-title">{{ isLoginMode ? "登录" : "注册" }}</h2>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">电子邮件或用户名</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="dialog-input"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">密码</label>
          <div class="password-input-wrapper">
            <input
              id="password"
              v-model="password"
              :type="passwordVisible ? 'text' : 'password'"
              class="dialog-input"
              required
            />
            <button
              type="button"
              class="password-toggle"
              @click="togglePasswordVisibility"
            >
              <span class="material-icons">
                {{ passwordVisible ? "visibility" : "visibility_off" }}
              </span>
            </button>
          </div>
        </div>

        <div v-if="!isLoginMode" class="form-group accept-terms">
          <input
            id="accept-terms"
            type="checkbox"
            v-model="acceptTerms"
            required
          />
          <label for="accept-terms"
            >获取整个图片：请将趋势、优惠和通知信息通过电子邮件发送给我。</label
          >
        </div>

        <div v-if="isLoginMode" class="form-actions">
          <a
            href="#"
            class="forgot-password"
            @click.prevent="handleForgotPassword"
            >忘记密码?</a
          >
        </div>

        <button type="submit" class="submit-button">
          {{ isLoginMode ? "登录" : "开始使用" }}
        </button>
      </form>

      <div class="divider">
        <span class="or-text">或</span>
      </div>

      <div class="social-login-options">
        <button class="social-button google">
          <img src="/icons/google-icon.svg" alt="Google" />
          通过 Google 继续
        </button>
        <button class="social-button facebook">
          <img src="/icons/facebook-icon.svg" alt="Facebook" />
          通过 Facebook 继续
        </button>
        <button class="social-button apple">
          <img src="/icons/apple-icon.svg" alt="Apple" />
          通过 Apple 继续
        </button>
      </div>

      <div class="mode-switch">
        <span v-if="isLoginMode">没有免费账户?</span>
        <span v-else>已有账户?</span>
        <button class="switch-button" @click="toggleMode">
          {{ isLoginMode ? "创建账户" : "登录" }}
        </button>
      </div>

      <div v-if="!isLoginMode" class="terms-statement">
        创建账户即表示我同意 Shutterstock
        <a href="#" class="link">网站条款</a>、
        <a href="#" class="link">隐私政策</a>和
        <a href="#" class="link">许可条款</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { authApi } from "~/api/auth"; // 导入 authApi
import { useAuthStore } from "~/stores/auth";

const isLoginMode = ref(true);
const email = ref("");
const password = ref("");
const passwordVisible = ref(false);
const acceptTerms = ref(false);
const loading = ref(false);
const errorMessage = ref("");

const emit = defineEmits(["close"]);
const authStore = useAuthStore();

const close = () => {
  emit("close");
};

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value;
  // 切换模式时清空表单
  email.value = "";
  password.value = "";
  acceptTerms.value = false;
  errorMessage.value = "";
};

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

const handleSubmit = async () => {
  if (loading.value) return; // 防止重复提交

  loading.value = true;
  errorMessage.value = "";

  try {
    if (isLoginMode.value) {
      // 执行登录逻辑
      const response = await authApi.login({
        email: email.value,
        password: password.value,
      });

      if (response.code === 200) {
        // 登录成功
        console.log("登录成功，用户信息:", response.data);
        // 调用 Pinia store 的方法存储用户信息和 token
        authStore.setToken(response.data.accessToken);
        authStore.setUser(response.data.user); // 假设返回了用户信息

        emit("loginSuccess");
        close();
      } else {
        // 登录失败
        errorMessage.value =
          response.msg || "登录失败，请检查您的用户名和密码。";
      }
    } else {
      // 执行注册逻辑
      const response = await authApi.register({
        email: email.value,
        password: password.value,
      });

      if (response.code === 200) {
        // 注册成功后，可以自动登录或提示用户登录
        console.log("注册成功，请登录。");
        toggleMode(); // 切换到登录模式
      } else {
        // 注册失败
        errorMessage.value = response.msg || "注册失败，请稍后重试。";
      }
    }
  } catch (error) {
    console.error("API 调用失败:", error);
    errorMessage.value = "网络错误，请稍后重试。";
  } finally {
    loading.value = false;
  }
};

const handleForgotPassword = () => {
  // TODO: Implement this
  console.log("Redirecting to forgot password page/dialog...");
};

// 监听 isLoginMode 变化，同步更新相关文本
watch(isLoginMode, (newVal) => {
  console.log(`Switched to ${newVal ? "Login" : "Registration"} mode`);
});
</script>

<style scoped>
/* 使用主页的配色方案 */
:root {
  --primary-color: #ff9900; /* 主色调，来自菜单激活状态 */
  --secondary-color: #ff8c62; /* 辅助色，来自按钮 */
  --background-color: #0d0d1a; /* 背景色 */
  --text-color: #fff; /* 白色文字 */
  --light-gray: #ccc; /* 浅灰色文字 */
  --dark-gray: #333; /* 深灰色 */
  --border-color: #333;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(5px);
}

.dialog-content {
  background-color: var(--background-color);
  color: var(--text-color);
  padding: 40px;
  border-radius: 10px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  position: relative;
}

.close-button {
  position: absolute;
  top: 15px;
  right: 20px;
  background: none;
  border: none;
  color: var(--light-gray);
  font-size: 2rem;
  cursor: pointer;
  transition: color 0.3s;
}
.close-button:hover {
  color: var(--primary-color);
}

.dialog-title {
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 25px;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 1rem;
  margin-bottom: 8px;
  color: var(--light-gray);
}

.dialog-input {
  width: 100%;
  padding: 12px 15px;
  background-color: var(--dark-gray);
  border: 1px solid var(--border-color);
  border-radius: 5px;
  color: var(--text-color);
  font-size: 1rem;
}

.password-input-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--light-gray);
  cursor: pointer;
}
.password-toggle .material-icons {
  font-size: 1.2rem;
}

.forgot-password {
  color: var(--light-gray);
  font-size: 0.9rem;
  text-decoration: none;
  transition: color 0.3s;
  display: block;
  text-align: right;
  margin-top: -10px;
}
.forgot-password:hover {
  color: var(--primary-color);
}

.submit-button {
  width: 100%;
  padding: 15px;
  background-color: var(--secondary-color);
  color: var(--text-color);
  border: none;
  border-radius: 5px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
}
.submit-button:hover {
  background-color: #e67a54;
}

.divider {
  text-align: center;
  margin: 30px 0;
  position: relative;
}
.divider::before,
.divider::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background-color: var(--border-color);
}
.divider::before {
  left: 0;
}
.divider::after {
  right: 0;
}
.or-text {
  background-color: var(--background-color);
  padding: 0 10px;
  font-size: 0.9rem;
  color: var(--light-gray);
}

.social-login-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}
.social-button {
  width: 100%;
  padding: 12px;
  background-color: var(--dark-gray);
  border: 1px solid var(--border-color);
  border-radius: 5px;
  color: var(--light-gray);
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: background-color 0.3s;
}
.social-button:hover {
  background-color: #444;
}
.social-button img {
  height: 20px;
}

.mode-switch {
  text-align: center;
  font-size: 0.9rem;
  color: var(--light-gray);
  margin-top: 20px;
}
.switch-button {
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-left: 5px;
}

.terms-statement {
  font-size: 0.8rem;
  color: var(--light-gray);
  text-align: center;
  margin-top: 20px;
}

.link {
  color: var(--primary-color);
  text-decoration: none;
}

.accept-terms {
  display: flex;
  align-items: center;
}

.accept-terms label {
  display: inline;
  margin-bottom: 0;
  margin-left: 10px;
  font-size: 0.9rem;
}
</style>
