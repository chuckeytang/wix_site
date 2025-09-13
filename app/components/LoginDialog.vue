<template>
  <div class="dialog-overlay" @click.self="close">
    <div class="dialog-content">
      <button class="close-button" @click="close">&times;</button>

      <h2 class="dialog-title">{{ isLoginMode ? "LOGIN" : "SIGN UP" }}</h2>

      <!-- 授权加载状态 -->
      <div v-if="showAuthLoader" class="text-center p-8">
        <p class="text-lg font-semibold text-white mb-4">
          <span v-if="isLoginMode">Logging in...</span>
          <span v-else>Signing up...</span>
        </p>
        <p class="text-sm text-gray-400">
          Redirecting securely to Wix for final authorization.
        </p>
        <!-- 您可以在这里添加一个加载动画 -->
        <div class="loader mx-auto my-4"></div>
      </div>

      <!-- 邮箱验证对话框 -->
      <div v-else-if="showVerificationDialog">
        <p class="dialog-text">
          A verification code has been sent to your email. Please enter it
          below.
        </p>
        <div class="form-group">
          <input
            id="verificationCode"
            v-model="verificationCode"
            type="text"
            class="dialog-input"
            required
            placeholder="Verification Code"
          />
        </div>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <button type="button" @click="handleVerifyCode" class="submit-button">
          VERIFY
        </button>
      </div>

      <!-- 登录/注册表单 -->
      <form v-else @submit.prevent="handleSubmit">
        <!-- 表单内容保持不变 -->
        <div class="form-group">
          <input
            id="email"
            v-model="email"
            type="email"
            class="dialog-input"
            required
            placeholder="Email or Username"
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
        <button type="submit" class="submit-button">
          {{ isLoginMode ? "LOGIN" : "GET STARTED" }}
        </button>
      </form>
      <!-- 其他 UI 元素保持不变 -->
      <div class="divider">
        <span class="or-text">OR</span>
      </div>
      <div class="social-login-options">
        <button class="social-button google">
          <img src="/icons/google-icon.svg" alt="Google" />
          CONTINUE WITH GOOGLE
        </button>
        <button class="social-button facebook">
          <img src="/icons/facebook-icon.svg" alt="Facebook" />
          CONTINUE WITH FACEBOOK
        </button>
        <button class="social-button apple">
          <img src="/icons/apple-icon.svg" alt="Apple" />
          CONTINUE WITH APPLE
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
            GET TRENDS, OFFERS AND NOTIFICATIONS SENT TO ME BY EMAIL.
          </label>
        </div>
      </div>
      <div v-if="!isLoginMode" class="terms-statement">
        <p>
          BY CREATING AN ACCOUNT I AGREE TO THE WIX
          <a href="#" class="link">TERMS OF USE</a>,
          <a href="#" class="link">PRIVACY POLICY</a> AND
          <a href="#" class="link">LICENSE AGREEMENT</a>.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { authApi } from "~/api/auth";
import { useAuthStore } from "~/stores/auth";

const isLoginMode = ref(true);
const email = ref("");
const password = ref("");
const passwordVisible = ref(false);
const acceptTerms = ref(false);
const loading = ref(false);
const errorMessage = ref("");
const showVerificationDialog = ref(false);
const verificationCode = ref("");
const stateToken = ref("");
const showAuthLoader = ref(false); // 新增：显示授权加载状态
const wixUserId = ref(""); // 新增：存储Wix用户ID

const emit = defineEmits(["close"]);
const authStore = useAuthStore();

const close = () => {
  emit("close");
};

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value;
  email.value = "";
  password.value = "";
  acceptTerms.value = false;
  errorMessage.value = "";
  showVerificationDialog.value = false;
};

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

// iframe回调处理器
const handleIframeMessage = async (event) => {
  // 验证消息来源，防止跨站脚本攻击
  if (
    event.origin !== "https://www.wix.com" &&
    !event.origin.includes("wixapis.com")
  ) {
    return;
  }

  // 检查消息数据类型
  const { type, payload } = event.data;
  if (type === "authorizationCode" && payload.code) {
    try {
      showAuthLoader.value = false;
      loading.value = true;
      errorMessage.value = "";

      // 调用后端回调接口，发送授权码以获取最终JWT
      const response = await authApi.handleWixCallback({
        code: payload.code,
        state: payload.state,
        wixUserId: wixUserId.value, // 将之前存储的Wix用户ID也发送过去
      });

      if (response.code === 200) {
        console.log("Final login successful:", response.data);
        authStore.setToken(response.data.token);
        // authStore.setUser(response.data.user); // 假设后端返回了用户信息
        close();
      } else {
        errorMessage.value = response.msg || "Authorization failed.";
      }
    } catch (error) {
      console.error("API call failed:", error);
      errorMessage.value = "An error occurred during authorization.";
    } finally {
      loading.value = false;
    }
  }
};

onMounted(() => {
  // 挂载时添加监听器
  window.addEventListener("message", handleIframeMessage);
});

onBeforeUnmount(() => {
  // 组件卸载时移除监听器
  window.removeEventListener("message", handleIframeMessage);
});

const handleSubmit = async () => {
  if (loading.value) return;

  loading.value = true;
  errorMessage.value = "";

  try {
    const apiCall = isLoginMode.value
      ? authApi.login({
          loginId: { email: email.value },
          password: password.value,
        })
      : authApi.register({
          loginId: { email: email.value },
          password: password.value,
        });

    const response = await apiCall;

    if (response.code === 200) {
      if (response.data.authUrl) {
        wixUserId.value = response.data.wixUserId; // 存储Wix用户ID
        showAuthLoader.value = true; // 显示加载状态

        // 拼接完整的 iframe 回调 URL
        // 您需要将 'https://www.verscape.com/auth/callback' 替换为您的实际回调页面URL
        const redirectUrl = `https://www.verscape.com/auth/callback`;
        const finalAuthUrl = `${response.data.authUrl}&redirectUrl=${encodeURIComponent(redirectUrl)}`;

        // 动态创建隐藏的iframe并加载最终授权URL
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = finalAuthUrl;
        document.body.appendChild(iframe);
      } else if (response.msg === "注册成功，请检查邮箱进行验证") {
        showVerificationDialog.value = true;
        stateToken.value = response.data;
        errorMessage.value = "";
      } else {
        console.log("Success, please log in.");
        toggleMode();
      }
    } else {
      errorMessage.value = response.msg || "Operation failed.";
    }
  } catch (error) {
    console.error("API call failed:", error);
    if (error.response && error.response.data && error.response.data.msg) {
      errorMessage.value = error.response.data.msg;
    } else if (error.message) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "Network error, please try again later.";
    }
  } finally {
    loading.value = false;
  }
};

const handleVerifyCode = async () => {
  if (!verificationCode.value) {
    errorMessage.value = "Please enter the verification code.";
    return;
  }

  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await authApi.verifyEmail({
      code: verificationCode.value,
      stateToken: stateToken.value,
    });

    if (response.code === 200) {
      if (response.data.authUrl) {
        wixUserId.value = response.data.wixUserId;
        showAuthLoader.value = true;

        // 拼接完整的 iframe 回调 URL
        const redirectUrl = `https://www.verscape.com/auth/callback`;
        const finalAuthUrl = `${response.data.authUrl}&redirectUrl=${encodeURIComponent(redirectUrl)}`;

        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = finalAuthUrl;
        document.body.appendChild(iframe);
      } else {
        errorMessage.value =
          "Verification successful, but authorization URL was not received.";
      }
    } else {
      errorMessage.value =
        response.msg || "Verification failed, please try again.";
    }
  } catch (error) {
    console.error("Verification API call failed:", error);
    errorMessage.value =
      "An error occurred during verification. Please try again.";
  } finally {
    loading.value = false;
  }
};

const handleForgotPassword = () => {
  // 可以根据Wix官方的重置密码流程来处理
  console.log("Redirecting to forgot password page...");
};

watch(isLoginMode, (newVal) => {
  console.log(`Switched to ${newVal ? "Login" : "Registration"} mode`);
});
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* 调整背景色，使其更透明，以便能看到后面的模糊内容 */
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(5px);
}

.dialog-content {
  background-color: rgba(13, 13, 26, 0.6); /* 使用半透明背景色 */
  color: var(--text-color);
  padding: 40px;
  border-radius: 10px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  position: relative;
  text-align: center; /* 居中所有内容 */
  box-sizing: border-box;
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
  text-align: center; /* 输入文字居中 */
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
</style>
