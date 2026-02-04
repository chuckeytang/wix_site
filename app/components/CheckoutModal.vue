<template>
  <div class="modal-overlay" v-if="isVisible">
    <div class="modal-card">
      <div class="modal-header">
        <h2 class="modal-title">Order Payment</h2>
      </div>

      <div class="modal-body">
        <div v-if="loading" class="loading-message">
          <div class="spinner"></div>
          Processing, please wait...
        </div>

        <div v-if="error" class="error-message">{{ error }}</div>

        <div v-if="showAddressStep && !loading" class="address-step">
          <p class="step-hint">
            To comply with local tax regulations, please verify your billing
            location.
          </p>
          <div class="form-group">
            <label>Country</label>
            <select v-model="addressForm.countryCode" class="custom-input">
              <option value="">Select Country</option>
              <option value="US">United States</option>
              <option value="GB">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="AU">Australia</option>
              <option value="JP">Japan</option>
            </select>
          </div>
          <div class="form-group">
            <label>Postal Code / Zip</label>
            <input
              type="text"
              v-model="addressForm.postalCode"
              placeholder="e.g. 98101"
              class="custom-input"
            />
          </div>
          <button
            @click="handleApplyTax"
            :disabled="!addressForm.countryCode || !addressForm.postalCode"
            class="submit-button primary-action mt-20"
          >
            Calculate Tax & Continue
          </button>
        </div>

        <div
          v-show="localClientSecret && !showAddressStep"
          id="payment-element"
          class="payment-element-container"
        ></div>
      </div>

      <div class="terms-container" v-if="localClientSecret && !showAddressStep">
        <label class="checkbox-label">
          <input
            type="checkbox"
            v-model="isAgreementChecked"
            class="terms-checkbox"
          />
          <span class="checkbox-text">
            I have read and agree to the terms of the
            <span class="link-text" @click.stop="openAgreement"
              >Verscape License Agreement</span
            >.
          </span>
        </label>
      </div>

      <div class="modal-footer">
        <button
          v-if="localClientSecret && !showAddressStep"
          @click="handleSubmit"
          :disabled="!isStripeReady || loading || !isAgreementChecked"
          class="submit-button primary-action"
        >
          <span v-if="loading">Processing...</span>
          <span v-else>Pay {{ formattedAmount }}</span>
        </button>

        <button
          @click="handleClose"
          class="submit-button secondary-action"
          :disabled="loading"
        >
          {{ localClientSecret ? "Cancel & Back" : "Close" }}
        </button>
      </div>
    </div>

    <LicenseAgreementModal
      :is-visible="showAgreementModal"
      @close="showAgreementModal = false"
      @confirm="handleAgreementConfirmed"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onUnmounted, nextTick } from "vue";
import type { Stripe, StripeElements } from "@stripe/stripe-js";
import { useRoute, useRouter } from "vue-router";
import { useCartStore } from "~/stores/cart";
import { usersApi } from "~/api/users"; // [+] 引入用户接口
import { stripeApi } from "~/api/stripe"; // [+] 引入支付接口
import LicenseAgreementModal from "~/components/LicenseAgreementModal.vue";
import type { StripePaymentElementOptions } from "@stripe/stripe-js";

const router = useRouter();

// 1. Props: 移除了 clientSecret，由内部获取
const props = defineProps<{
  isVisible: boolean;
  orderId: number | null;
  returnPath: string | null;
  amount: number;
  currency: string;
}>();

// 2. Emits
const emit = defineEmits(["close", "success"]);

// 3. 注入和内部状态
const nuxtApp = useNuxtApp();
const stripeInstance = nuxtApp.$stripe as Stripe | null;

const loading = ref(false);
const error = ref<string | null>(null);
const isStripeReady = ref(false);
const cartStore = useCartStore();
const paymentElementRef = ref<any | null>(null);
const elementsRef = ref<StripeElements | null>(null);

const localClientSecret = ref<string | null>(null); // [*] 内部维护密钥
const showAddressStep = ref(false); // [*] 控制是否需要补全地址
const isAgreementChecked = ref(false);
const showAgreementModal = ref(false);

const addressForm = ref({ countryCode: "", postalCode: "" });

const formattedAmount = computed(() => {
  if (!props.amount || !props.currency) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: props.currency.toUpperCase(),
  }).format(props.amount);
});

/**
 * [*] 核心流程控制：打开模态框时触发
 */
watch(
  () => props.isVisible,
  async (newVal) => {
    if (newVal) {
      isAgreementChecked.value = false;
      error.value = null;
      await checkUserAndInitialize();
    } else {
      cleanupElements();
      resetInternalState();
    }
  },
);

// 监听密钥变化后初始化 Stripe
watch(localClientSecret, async (newSecret) => {
  if (newSecret) {
    await nextTick();
    await initializeStripe(newSecret);
  }
});

/**
 * [*] 步骤 A: 检查用户信息并决定下一步
 */
const checkUserAndInitialize = async () => {
  loading.value = true;
  try {
    const res = await usersApi.getMe();
    const user = res.data;

    // 判定是否存在且不为空字符串
    const hasAddress = user?.countryCode?.trim() && user?.postalCode?.trim();

    if (!hasAddress) {
      showAddressStep.value = true;
      loading.value = false;
    } else {
      await fetchPaymentIntent();
    }
  } catch (e) {
    error.value = "Unable to load user profile. Please try again.";
    loading.value = false;
  }
};

/**
 * [*] 步骤 B: 用户提交地址表单
 */
const handleApplyTax = async () => {
  loading.value = true;
  error.value = null;
  try {
    await usersApi.updateTaxInfo(addressForm.value);
    showAddressStep.value = false;
    await fetchPaymentIntent();
  } catch (e: any) {
    error.value = e.message || "Failed to update location information.";
    loading.value = false;
  }
};

/**
 * [*] 步骤 C: 获取 Stripe Client Secret
 */
const fetchPaymentIntent = async () => {
  if (!props.orderId) return;
  loading.value = true;
  try {
    const res = await stripeApi.createPaymentIntent(props.orderId);
    if (res.code === 200) {
      localClientSecret.value = res.data!.clientSecret;
    } else {
      // 如果后端返回 400 (通常是因为地址缺失)，强制开启地址步骤
      error.value = res.msg || "Failed to initialize payment.";
      if (res.code === 400) {
        showAddressStep.value = true;
      }
      loading.value = false;
    }
  } catch (e) {
    error.value = "Stripe service unavailable.";
    loading.value = false;
  }
};

const initializeStripe = async (secret: string) => {
  if (!stripeInstance) return;
  loading.value = true;
  cleanupElements();

  try {
    elementsRef.value = stripeInstance.elements({
      clientSecret: secret,
      appearance: {
        theme: "night",
        variables: {
          colorPrimary: "#ff8c62",
          borderRadius: "4px",
          fontSizeBase: "15px",
        },
      },
    });

    // 定义符合 StripePaymentElementOptions 规范的配置对象
    const paymentElementOptions: StripePaymentElementOptions = {
      layout: {
        type: "tabs",
        defaultCollapsed: false,
      },
      fields: {
        billingDetails: {
          // 'auto' 表示 Stripe 自动决定，'never' 表示隐藏
          // 如果你希望强制显示，某些版本支持 'always'，但根据你提供的 FieldOption 类型，
          // 这里建议使用符合定义的配置：
          address: "auto",
          email: "auto",
        },
      },
    };

    // 使用 (elementsRef.value as any) 绕过复杂的重载推断
    // 或者使用 (elementsRef.value!).create("payment", paymentElementOptions);
    const paymentElement = (elementsRef.value as any).create(
      "payment",
      paymentElementOptions,
    );

    paymentElementRef.value = paymentElement;
    paymentElement.mount("#payment-element");

    isStripeReady.value = true;
  } catch (e) {
    error.value = "Failed to initialize payment form.";
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  if (!isAgreementChecked.value || !stripeInstance || !elementsRef.value)
    return;
  loading.value = true;
  error.value = null;

  const returnUrl = `${window.location.origin}/payment-status?orderId=${props.orderId}&returnPath=${encodeURIComponent(props.returnPath || "/")}`;

  const { error: stripeError, paymentIntent } =
    await stripeInstance.confirmPayment({
      elements: elementsRef.value,
      confirmParams: { return_url: returnUrl },
      redirect: "if_required",
    });

  if (stripeError) {
    error.value = stripeError.message || "Payment failed.";
    loading.value = false;
  } else if (paymentIntent && paymentIntent.status === "succeeded") {
    try {
      await cartStore.clearCart();
    } catch (e) {}
    window.location.href = returnUrl;
  }
};

const resetInternalState = () => {
  localClientSecret.value = null;
  showAddressStep.value = false;
  isStripeReady.value = false;
  loading.value = false;
  addressForm.value = { countryCode: "", postalCode: "" };
};

const cleanupElements = () => {
  if (paymentElementRef.value) {
    paymentElementRef.value.destroy();
    paymentElementRef.value = null;
  }
  elementsRef.value = null;
};

const handleClose = () => {
  cleanupElements();
  emit("close");
};

const openAgreement = () => {
  showAgreementModal.value = true;
};
const handleAgreementConfirmed = () => {
  isAgreementChecked.value = true;
  showAgreementModal.value = false;
};

onUnmounted(() => cleanupElements());
</script>

<style scoped>
/* 保持原有样式，并确保 spinner 效果 */
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 140, 98, 0.3);
  border-top-color: #ff8c62;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
  margin-right: 10px;
  vertical-align: middle;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 地址表单样式补充 */
.address-step {
  padding: 10px 0 20px 0;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 其余原有样式保持... */
.modal-overlay {
  /* ... */
}
.modal-card {
  /* ... */
}
.custom-input {
  background-color: #0d0d1a;
  border: 1px solid #444;
  color: #fff;
  padding: 12px;
  border-radius: 6px;
  width: 100%;
  box-sizing: border-box;
}
</style>
