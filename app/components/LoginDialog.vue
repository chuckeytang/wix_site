<template>
  <div class="dialog-overlay" @click.self="close">
    <div class="dialog-content">
      <button class="close-button" @click="close">&times;</button>

      <h2 class="dialog-title">{{ isLoginMode ? "LOGIN" : "SIGN UP" }}</h2>

      <div v-if="showVerificationDialog">
        <p class="dialog-text text-white mb-4">
          A verification email has been sent to
          <span class="font-bold text-primary-color">{{
            emailForVerification
          }}</span
          >. Please check your inbox and follow the link to complete sign up.
        </p>
        <p class="dialog-text text-gray-400 mb-6">
          （由于你要求使用 **验证码/验证链接**
          回跳，这里假设是**验证链接**，用户点击后会跳转页面并携带 token
          完成验证。如果需要输入验证码，请自行调整表单。）
        </p>
      </div>

      <form v-else @submit.prevent="handleSubmit">
        <div class="form-group">
          <input
            id="email"
            v-model="email"
            type="text"
            class="dialog-input"
            required
            :placeholder="isLoginMode ? 'Email or Nickname' : 'Email Address'"
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

        <div
          v-if="errorMessage"
          class="error-message text-red-500 mb-4 text-sm text-left"
        >
          {{ errorMessage }}
        </div>

        <button type="submit" class="submit-button" :disabled="loading">
          <span v-if="loading">LOADING...</span>
          <span v-else>{{ isLoginMode ? "LOGIN" : "GET STARTED" }}</span>
        </button>
      </form>

      <div class="divider">
        <span class="or-text">OR</span>
      </div>
      <div class="social-login-options">
        <button class="social-button google" @click="handleGoogleLogin">
          <img src="/icons/google-icon.svg" alt="Google" />
          CONTINUE WITH GOOGLE
        </button>
      </div>
      <div class="mode-switch"></div>
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

  loading.value = true;
  errorMessage.value = "";

  try {
    let response;

    if (isLoginMode.value) {
      // 登录模式：邮箱/昵称 + 密码
      response = await authApi.login({
        email: email.value,
        password: password.value,
      });

      if (response.code === 200) {
        // 登录成功，假设后端返回的是 token 字符串
        const token = response.data;
        authStore.setToken(token); // 存储 token
        close();
      } else {
        errorMessage.value =
          response.msg || "Login failed. Please check your credentials.";
      }
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

      if (response.code === 200) {
        // 注册成功，提示用户检查邮箱进行验证
        emailForVerification.value = email.value; // 记录邮箱
        showVerificationDialog.value = true;
        // 清空密码和昵称，保持邮箱
        password.value = "";
        nickname.value = "";
        errorMessage.value = "";
      } else {
        errorMessage.value =
          response.msg ||
          "Registration failed. This email or nickname might be taken.";
      }
    }
  } catch (error) {
    console.error("API call failed:", error);
    errorMessage.value = "Network error, please try again later.";
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
</script>
