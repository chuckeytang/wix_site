<template>
  <div class="dialog-overlay" @click.self="close">
    <div class="dialog-content">
      <button class="close-button" @click="close">&times;</button>

      <h2 class="dialog-title">{{ isLoginMode ? "LOGIN" : "SIGN UP" }}</h2>

      <div v-if="showVerificationDialog" class="verification-container">
        <div class="mail-icon-wrapper">
          <img src="/icons/mail-sent.svg" alt="Email Sent" class="mail-icon" />
        </div>

        <h2 class="dialog-title">Verify your email</h2>

        <p class="dialog-text">
          Thanks for signing up! We just need to verify your email address to
          finish setting up your account.
        </p>

        <p class="dialog-text sub-text">
          A verification email has been sent to:<br />
          <span class="font-bold text-primary-color">{{
            emailForVerification
          }}</span>
        </p>

        <div class="action-buttons">
          <button
            class="submit-button resend-btn"
            @click="handleResendEmail"
            :disabled="resendCooldown > 0 || resendLoading"
          >
            <span v-if="resendLoading">SENDING...</span>
            <span v-else-if="resendCooldown > 0"
              >RESEND IN {{ resendCooldown }}s</span
            >
            <span v-else>RESEND VERIFICATION EMAIL</span>
          </button>
        </div>

        <div class="footer-link">
          <span class="text-gray">Not ready to continue? </span>
          <a href="#" @click.prevent="close" class="link">Log Out</a>
        </div>
      </div>

      <form v-else @submit.prevent="handleSubmit">
        <div class="form-group">
          <input
            id="email"
            v-model="email"
            type="text"
            class="dialog-input"
            required
            :placeholder="isLoginMode ? 'Email' : 'Email Address'"
          />
        </div>

        <div v-if="!isLoginMode" class="form-group">
          <input
            id="nickname"
            v-model="nickname"
            type="text"
            class="dialog-input"
            required
            placeholder="Nickname"
          />
        </div>

        <div class="form-group">
          <div class="password-input-wrapper">
            <input
              id="password"
              v-model="password"
              :type="passwordVisible ? 'text' : 'password'"
              class="dialog-input"
              required
              placeholder="Password"
            />
            <button
              type="button"
              class="password-toggle"
              @click="togglePasswordVisibility"
            >
              <img
                :src="
                  passwordVisible
                    ? '/icons/visibility_off.svg'
                    : '/icons/visibility.svg'
                "
                :alt="passwordVisible ? 'hide password' : 'show password'"
                class="password-icon"
              />
            </button>
          </div>
        </div>

        <div v-if="isLoginMode" class="form-actions">
          <a
            href="#"
            class="forgot-password"
            @click.prevent="handleForgotPassword"
            >Forgot Password?</a
          >
        </div>

        <div v-if="errorMessage" class="error-message-box">
          {{ errorMessage }}
        </div>

        <button type="submit" class="submit-button" :disabled="loading">
          <span v-if="loading">LOADING...</span>
          <span v-else>{{ isLoginMode ? "LOGIN" : "GET STARTED" }}</span>
        </button>
      </form>

      <div v-if="!showVerificationDialog">
        <div class="divider">
          <span class="or-text">OR</span>
        </div>
      </div>

      <div class="social-login-options">
        <button class="social-button google" @click="handleGoogleLogin">
          <img src="/icons/google-icon.svg" alt="Google" />
          CONTINUE WITH GOOGLE
        </button>
      </div>
      <div class="mode-switch">
        <span v-if="isLoginMode">NO FREE ACCOUNT?</span>
        <span v-else>HAVE AN ACCOUNT?</span>
        <button class="switch-button" @click="toggleMode">
          {{ isLoginMode ? "CREATE ACCOUNT" : "LOG IN" }}
        </button>
      </div>

      <div v-if="!isLoginMode" class="terms-statement">
        <div class="accept-terms">
          <input
            id="accept-terms"
            type="checkbox"
            v-model="acceptTerms"
            required
          />
          <label for="accept-terms">
            I AGREE TO RECEIVE EMAIL NOTIFICATIONS.
          </label>
        </div>
      </div>
      <div v-if="!isLoginMode" class="terms-statement">
        <p>
          BY CREATING AN ACCOUNT I AGREE TO THE VERSCAPE
          <a href="#" class="link">TERMS OF USE</a> AND
          <a href="#" class="link">PRIVACY POLICY</a>.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { authApi } from "~/api/auth";
import { useAuthStore } from "~/stores/auth";

const config = useRuntimeConfig();
const isLoginMode = ref(true);
const email = ref("");
const nickname = ref("");
const password = ref("");
const passwordVisible = ref(false);
const acceptTerms = ref(false);
const loading = ref(false);
const errorMessage = ref("");
const showVerificationDialog = ref(false);
const emailForVerification = ref("");
const resendLoading = ref(false);
const resendCooldown = ref(0);
let timer = null;

const emit = defineEmits(["close"]);
const authStore = useAuthStore();

const close = () => {
  emit("close");
};

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value;
  email.value = "";
  nickname.value = "";
  password.value = "";
  acceptTerms.value = false;
  errorMessage.value = "";
  showVerificationDialog.value = false;
};

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

const handleSubmit = async () => {
  if (loading.value) return;

  errorMessage.value = ""; // 清空之前的错误信息

  if (!isLoginMode.value && !acceptTerms.value) {
    errorMessage.value =
      "Please agree to receive email notifications to continue.";
    acceptTerms.value = true; // 自动帮用户勾选
    return;
  }

  if (!isLoginMode.value && !nickname.value) {
    errorMessage.value = "Nickname is required for registration.";
    return;
  }

  // --- 请求阶段：通过校验，正式开始加载 ---
  loading.value = true;

  try {
    let response;

    // 1. 构造 API 调用
    if (isLoginMode.value) {
      // 登录模式：邮箱 + 密码
      response = await authApi.login({
        email: email.value,
        password: password.value,
      });
    } else {
      // 注册模式：邮箱 + 昵称 + 密码
      if (!nickname.value) {
        errorMessage.value = "Nickname is required for registration.";
        loading.value = false;
        return;
      }
      response = await authApi.register({
        email: email.value,
        nickname: nickname.value,
        password: password.value,
      });
    }

    // 2. 处理成功响应 (response.code === 200)
    if (response.code === 200) {
      if (isLoginMode.value) {
        // 登录成功
        const token = response.data;
        authStore.setToken(token);
        close();
      } else {
        // 注册成功，提示用户检查邮箱进行验证
        emailForVerification.value = email.value;
        showVerificationDialog.value = true;
        password.value = "";
        nickname.value = "";
        errorMessage.value = "";
      }
    } else {
      // 3. 处理后端返回的非 200 状态码 (AjaxResult.error)
      errorMessage.value =
        response.msg || "Operation failed. Please check the details.";
    }
  } catch (error) {
    console.error("API call failed:", error);

    // 4. 核心修复：增强错误捕获逻辑
    let userFriendlyMessage = "Network error, please try again later.";

    // 优先从 error.response 中提取后端 AjaxResult 的 msg 字段
    if (error.response && error.response.data) {
      // 检查是否有后端返回的 { msg: '...' } 结构
      if (error.response.data.msg) {
        userFriendlyMessage = error.response.data.msg;
      } else {
        // 如果没有 msg 字段，但有状态码，显示通用错误
        userFriendlyMessage = `Server error (${error.response.status}).`;
      }
    } else if (error.message) {
      // 如果没有 response 对象 (如 CORS/网络错误)，尝试使用 error.message
      userFriendlyMessage = error.message;
    }

    errorMessage.value = userFriendlyMessage;
  } finally {
    loading.value = false;
  }
};

const handleForgotPassword = () => {
  // TODO: 实现密码找回流程
  console.log("Redirecting to forgot password page...");
};

const handleGoogleLogin = () => {
  if (loading.value) return;

  try {
    // 从 Nuxt Runtime Config 中安全获取 Google 配置
    const googleConfig = config.public.googleOauth;

    if (!googleConfig || !googleConfig.clientId || !googleConfig.redirectUri) {
      errorMessage.value = "Google OAuth configuration missing.";
      console.error("Missing Google OAuth Config", googleConfig);
      return;
    }

    // 假设你在 Nuxt Config 中暴露了以下公共配置
    const { clientId, redirectUri, scope } = googleConfig;

    // 调用 auth.ts 中的辅助函数进行重定向
    authApi.startGoogleLogin({
      clientId: clientId,
      redirectUri: redirectUri,
      // 这里的 scope 应该是 'email profile' 或你在 Nuxt Config 中设置的值
      scope: scope || "email profile",
    });

    // 注意：重定向发生后，这个对话框组件会卸载，流程控制权交给 Google。
  } catch (error) {
    console.error("Error starting Google login:", error);
    errorMessage.value = "Failed to initiate Google login.";
  }
};

watch(isLoginMode, (newVal) => {
  console.log(`Switched to ${newVal ? "Login" : "Registration"} mode`);
});

// 处理重发邮件
const handleResendEmail = async () => {
  if (resendCooldown.value > 0 || resendLoading.value) return;

  resendLoading.value = true;
  try {
    const res = await authApi.resendVerificationEmail(
      emailForVerification.value
    );
    if (res.code === 200) {
      // 开始倒计时
      startCooldown();
      // 可以加一个简单的提示
      errorMessage.value = ""; // 清空错误
      alert("Email sent successfully!");
    } else {
      errorMessage.value = res.msg || "Failed to resend email.";
    }
  } catch (error) {
    errorMessage.value = "Network error, please try again.";
  } finally {
    resendLoading.value = false;
  }
};

const startCooldown = () => {
  resendCooldown.value = 60; // 60秒冷却
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    resendCooldown.value--;
    if (resendCooldown.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
};

// 组件销毁时清除定时器
onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
:root {
  --sidebar-width: 450px;
  --primary-color: #ff8c62; /* 主题橙色 */
  --secondary-color: #e96d47; /* 按钮橙色，比 primary 更深一点，用于行动按钮 */
  --text-color: #ffffff;
  --dark-gray: rgba(44, 44, 58, 1);
  --card-bg: rgba(13, 13, 26, 1);
  --light-gray: #a0a0a0;
  --border-color: rgba(255, 255, 255, 0.1); /* 浅色半透明边框 */
  --error-color: #ef4444; /* 红色错误提示 */
  --shadow-color: rgba(0, 0, 0, 0.5);
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* 调整背景色，使其更透明，以便能看到后面的模糊内容 */
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  z-index: 2000;
  backdrop-filter: blur(5px);
  transition: opacity 0.3s ease;
}

.dialog-content {
  width: var(--sidebar-width);
  height: 100%;
  padding: 40px;
  border-radius: 0;
  background-color: transparent;
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: -5px 0 30px rgba(0, 0, 0, 0.3);
  position: relative;
  text-align: center;
  box-sizing: border-box;
  transform: translateX(0);
  transition: transform 0.3s ease-out;
  overflow-y: auto;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  z-index: 2000;
  backdrop-filter: blur(5px);
  transition: opacity 0.3s ease;
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
  z-index: 10;
}
.close-button:hover {
  color: var(--primary-color);
}

.dialog-title {
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 25px;
  text-align: center;
  color: var(--text-color); /* 确保标题文字为白色 */
}

.form-group {
  margin-bottom: 20px;
}

.dialog-input {
  width: 100%;
  padding: 12px 15px;
  /* 调整背景为透明，以露出背景图片模糊效果 */
  background-color: transparent;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  color: var(--text-color); /* 确保输入框文字为白色 */
  font-size: 1rem;
  text-align: left; /* 输入文字居中 */
}

/* 调整 placeholder 样式 */
.dialog-input::placeholder {
  color: var(--light-gray); /* 使用浅灰色 */
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
  cursor: pointer;
}
.password-icon {
  width: 24px; /* 设置图标大小 */
  height: 24px;
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
  background-color: transparent; /* 更改背景为透明 */
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
  justify-content: center;
  text-align: left;
}
.accept-terms label {
  display: inline;
  margin-bottom: 0;
  margin-left: 10px;
  font-size: 0.9rem;
}
.terms-statement p {
  line-height: 1.5;
}
.text-primary-color {
  color: var(--primary-color, #f39c12); /* 假设 primary-color */
}

.error-message-box {
  color: #ef4444; /* text-red-500 */
  margin-bottom: 1rem; /* mb-4 */
  font-size: 0.875rem; /* text-sm */
  text-align: left; /* text-left */
}

.verification-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* 顶部对齐 */
  height: 100%;
  padding-top: 20px;
  text-align: center;
}

.mail-icon-wrapper {
  margin-bottom: 30px;
}

/* 假设 mail-icon.svg 是白色的，我们给它一个橙色光晕或背景 */
.mail-icon {
  width: 65px;
  height: 65px;
  /* 增加一个柔和的背景或光晕，模拟图标被主题色包围 */
  padding: 15px;
  border-radius: 50%;
  background-color: rgba(255, 140, 98, 0.1); /* Primary Color 的 10% 透明度 */
  box-shadow: 0 0 15px rgba(255, 140, 98, 0.5); /* 柔和光晕 */
  opacity: 1;
}

.dialog-title {
  /* 确保标题文字清晰 */
  color: var(--text-color);
  font-size: 2.2rem;
  margin-bottom: 20px;
}

.dialog-text {
  color: var(--light-gray); /* 主体文字使用浅灰 */
  line-height: 1.6;
  margin-bottom: 20px;
}

.sub-text {
  font-size: 1rem;
  /* 采用暗色系玻璃质感背景 */
  background: rgba(255, 255, 255, 0.05); /* 更薄的玻璃效果 */
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  margin-bottom: 30px;
  border: 1px solid var(--border-color); /* 增加边框 */
  color: var(--text-color); /* 邮箱地址周围文字用白色 */
}
/* 邮箱地址高亮 */
.text-primary-color {
  color: var(--primary-color);
}

.action-buttons {
  width: 100%;
  margin-top: 10px;
}

.resend-btn {
  width: 100%;
  padding: 15px;
  /* 使用 secondary-color 作为主要行动色 */
  background-color: var(--secondary-color);
  color: var(--text-color);
  border: none;
  border-radius: 5px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-bottom: 20px;
}
.resend-btn:hover:not(:disabled) {
  background-color: #e67a54; /* 更深的橙色 */
}

.resend-btn:disabled {
  background-color: #555555; /* 深灰色，明显不可用 */
  cursor: not-allowed;
  color: #cccccc;
}

.footer-link {
  margin-top: 40px;
  font-size: 0.9rem;
  width: 100%; /* 确保对齐 */
  text-align: center;
}

.text-gray {
  color: var(--light-gray);
}
.link {
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.3s;
}
.link:hover {
  color: var(--text-color);
}

.error-message-box {
  animation: shake 0.4s ease-in-out;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

/* 强调勾选框的样式（当出错时） */
.accept-terms input:invalid {
  outline: 2px solid var(--error-color);
}
</style>
