<template>
  <div class="modal-overlay" v-if="isVisible" @click.self="handleClose">
    <div class="modal-card">
      <button class="close-x" @click="handleClose">×</button>

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
          <div class="form-group mt-15">
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

        <div v-if="localClientSecret && !showAddressStep" class="order-summary">
          <div class="summary-item">
            <span>Subtotal</span>
            <span>{{
              formatCurrency(serverOriginAmount || props.amount)
            }}</span>
          </div>
          <div class="summary-item tax-line">
            <span>Estimated Tax</span>
            <span>{{ formatCurrency(serverTaxAmount || 0) }}</span>
          </div>
          <div class="summary-item total-line">
            <span>Total</span>
            <span>{{ formatCurrency(serverFinalAmount || props.amount) }}</span>
          </div>
        </div>

        <div
          v-show="localClientSecret && !showAddressStep"
          id="payment-element"
          class="payment-element-container"
        ></div>
      </div>

      <div v-if="localClientSecret && !showAddressStep">
        <div class="terms-container">
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
            @click="handleSubmit"
            :disabled="!isStripeReady || loading || !isAgreementChecked"
            class="submit-button primary-action"
          >
            <span v-if="loading" class="spinner small"></span>
            <span v-else>Pay {{ displayAmount }}</span>
          </button>

          <button
            @click="handleClose"
            class="submit-button secondary-action"
            :disabled="loading"
          >
            Cancel
          </button>
        </div>
      </div>

      <div v-else-if="!loading" class="modal-footer">
        <button @click="handleClose" class="submit-button secondary-action">
          Close
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
import { loadStripe } from "@stripe/stripe-js";
import type { Stripe, StripeElements } from "@stripe/stripe-js";
import { useCartStore } from "~/stores/cart";
import { usersApi } from "~/api/users";
import { stripeApi } from "~/api/stripe";
import LicenseAgreementModal from "~/components/LicenseAgreementModal.vue";

const props = defineProps<{
  isVisible: boolean;
  orderId: number | null;
  returnPath: string | null;
  amount: number;
  currency: string;
}>();

const emit = defineEmits(["close", "success"]);

const nuxtApp = useNuxtApp();
const stripeInstance = nuxtApp.$stripe as Stripe | null;
const runtimeConfig = useRuntimeConfig();
const router = useRouter();

const loading = ref(false);
const error = ref<string | null>(null);
const isStripeReady = ref(false);
const cartStore = useCartStore();
const paymentElementRef = ref<any | null>(null);
const elementsRef = ref<StripeElements | null>(null);

const localClientSecret = ref<string | null>(null);
const serverFinalAmount = ref<number | null>(null);
const serverTaxAmount = ref<number | null>(null);
const serverOriginAmount = ref<number | null>(null);
const showAddressStep = ref(false);
const isAgreementChecked = ref(false);
const showAgreementModal = ref(false);
const addressForm = ref({ countryCode: "", postalCode: "" });
const isFetching = ref(false);
const fallbackStripeInstance = ref<Stripe | null>(null);
const stripeReadyTimer = ref<ReturnType<typeof setTimeout> | null>(null);

// 格式化货币的辅助函数（抽出来复用）
const formatCurrency = (val: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: props.currency.toUpperCase(),
  }).format(val);
};

const displayAmount = computed(() => {
  const targetAmount = serverFinalAmount.value || props.amount;
  if (!targetAmount || !props.currency) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: props.currency.toUpperCase(),
  }).format(targetAmount);
});

watch(
  () => props.isVisible,
  async (newVal) => {
    if (newVal) {
      cleanupElements();
      resetInternalState();
      await checkUserAndInitialize();
    } else {
      cleanupElements();
      resetInternalState();
    }
  },
);

const clearStripeReadyTimer = () => {
  if (stripeReadyTimer.value !== null) {
    clearTimeout(stripeReadyTimer.value);
    stripeReadyTimer.value = null;
  }
};

const resolveStripeInstance = async (): Promise<Stripe | null> => {
  if (stripeInstance) {
    return stripeInstance;
  }
  if (fallbackStripeInstance.value) {
    return fallbackStripeInstance.value;
  }
  const publishableKey = (runtimeConfig.public.stripePk as string | undefined)
    ?.trim();
  if (!publishableKey) {
    return null;
  }
  fallbackStripeInstance.value = await loadStripe(publishableKey);
  return fallbackStripeInstance.value;
};

const checkUserAndInitialize = async () => {
  if (isFetching.value) {
    return;
  }
  loading.value = true;
  error.value = null;
  try {
    const res = await usersApi.getMe();
    const user = res.data;
    const hasAddress = user?.countryCode?.trim() && user?.postalCode?.trim();
    if (!hasAddress) {
      showAddressStep.value = true;
      loading.value = false;
    } else {
      await fetchPaymentIntent();
    }
  } catch (e) {
    error.value = "Unable to load profile.";
    loading.value = false;
  }
};

const handleApplyTax = async () => {
  if (isFetching.value) {
    return;
  }
  loading.value = true;
  error.value = null;
  try {
    await usersApi.updateTaxInfo(addressForm.value);
    showAddressStep.value = false;
    await fetchPaymentIntent();
  } catch (e: any) {
    error.value = e.message || "Update failed.";
    loading.value = false;
  }
};

const fetchPaymentIntent = async () => {
  if (!props.orderId || isFetching.value) return;

  isFetching.value = true;
  loading.value = true;
  error.value = null;

  try {
    const res = await stripeApi.createPaymentIntent(props.orderId);
    const clientSecret = res.data?.clientSecret;
    if (!clientSecret) {
      throw new Error("Missing payment token from server.");
    }

    localClientSecret.value = clientSecret;

    if (res.data?.finalAmount) {
      serverFinalAmount.value = parseFloat(res.data.finalAmount);
      serverTaxAmount.value = parseFloat(res.data.taxAmount || "0");
      serverOriginAmount.value = parseFloat(res.data.originAmount || "0");
    }

    await nextTick();
    await initializeStripe(clientSecret);
  } catch (e: any) {
    if (e.responseCode === 400) {
      showAddressStep.value = true;
    }
    error.value = e.message || "Failed to start payment.";
    loading.value = false;
  } finally {
    isFetching.value = false;
  }
};

const initializeStripe = async (secret: string) => {
  clearStripeReadyTimer();

  try {
    const activeStripe = await resolveStripeInstance();
    if (!activeStripe) {
      error.value =
        "Stripe is unavailable now. Please refresh and try again.";
      isStripeReady.value = false;
      loading.value = false;
      return;
    }

    cleanupElements();
    elementsRef.value = activeStripe.elements({
      clientSecret: secret,
      appearance: { theme: "night", variables: { colorPrimary: "#ff8c62" } },
    });
    const paymentElement = (elementsRef.value as any).create("payment", {
      layout: "tabs",
    });
    paymentElementRef.value = paymentElement;
    paymentElement.mount("#payment-element");

    isStripeReady.value = false;
    paymentElement.on("ready", () => {
      isStripeReady.value = true;
      loading.value = false;
      clearStripeReadyTimer();
    });

    paymentElement.on("loaderror", () => {
      error.value = "Failed to load payment form.";
      isStripeReady.value = false;
      loading.value = false;
      clearStripeReadyTimer();
    });

    stripeReadyTimer.value = setTimeout(() => {
      if (!isStripeReady.value && loading.value) {
        error.value =
          "Payment form loading timed out. Please refresh and try again.";
        loading.value = false;
      }
    }, 10000);
  } catch (e) {
    error.value = "Failed to load payment form.";
    isStripeReady.value = false;
    loading.value = false;
    clearStripeReadyTimer();
  }
};

const handleSubmit = async () => {
  if (!isAgreementChecked.value || !elementsRef.value)
    return;

  const activeStripe = await resolveStripeInstance();
  if (!activeStripe) {
    error.value = "Stripe is unavailable now. Please refresh and try again.";
    return;
  }

  loading.value = true;
  const returnUrl = `${window.location.origin}/payment-status?orderId=${props.orderId}`;
  const { error: stripeError } = await activeStripe.confirmPayment({
    elements: elementsRef.value,
    confirmParams: { return_url: returnUrl },
    redirect: "if_required",
  });
  if (stripeError) {
    error.value = stripeError.message || "Payment failed.";
    loading.value = false;
    await redirectToOrderDetail("failed");
  } else {
    await cartStore.clearCart();
    window.location.href = returnUrl;
  }
};

const resetInternalState = () => {
  localClientSecret.value = null;
  serverFinalAmount.value = null;
  serverTaxAmount.value = null;
  serverOriginAmount.value = null;
  showAddressStep.value = false;
  isStripeReady.value = false;
  isAgreementChecked.value = false;
  isFetching.value = false;
  error.value = null;
  clearStripeReadyTimer();
  loading.value = false;
};

const cleanupElements = () => {
  if (paymentElementRef.value) paymentElementRef.value.destroy();
  paymentElementRef.value = null;
  elementsRef.value = null;
  clearStripeReadyTimer();
};

const redirectToOrderDetail = async (reason: "failed" | "cancelled") => {
  emit("close");
  if (!props.orderId) return;

  const target = {
    path: `/account/orders/${props.orderId}`,
    query: {
      checkout: reason,
      at: Date.now().toString(),
    },
  };

  if (router.currentRoute.value.path === target.path) {
    await router.replace(target);
    return;
  }
  await router.push(target);
};

onUnmounted(() => {
  cleanupElements();
  clearStripeReadyTimer();
});

const handleClose = async () => {
  await redirectToOrderDetail("cancelled");
};
const openAgreement = () => {
  showAgreementModal.value = true;
};
const handleAgreementConfirmed = () => {
  isAgreementChecked.value = true;
  showAgreementModal.value = false;
};
</script>

<style scoped>
/* [+] 核心弹出框样式修复 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85); /* 深色半透明遮罩 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000; /* 确保在最上层 */
  backdrop-filter: blur(4px);
}

.modal-card {
  background: #1a1a2e;
  width: 100%;
  max-width: 500px;
  border-radius: 12px;
  padding: 30px;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  border: 1px solid #333;
}

.close-x {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: #888;
  font-size: 24px;
  cursor: pointer;
}

.modal-title {
  margin: 0 0 20px 0;
  color: #fff;
  text-align: center;
  font-size: 1.5rem;
}

.order-summary {
  background: #111122;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px dashed #444;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: #ccc;
}

.tax-line {
  border-bottom: 1px solid #333;
  padding-bottom: 8px;
  color: #ff8c62; /* 让税费稍微显眼一点 */
}

.total-line {
  margin-top: 10px;
  margin-bottom: 0;
  font-weight: bold;
  font-size: 16px;
  color: #fff;
}

/* 之前已有的支付容器微调 */
.payment-element-container {
  margin: 10px 0 20px 0; /* 减少间距，因为上方有了 summary */
}

.custom-input {
  background: #0d0d1a;
  border: 1px solid #444;
  color: #fff;
  padding: 12px;
  border-radius: 6px;
  width: 100%;
  margin-top: 5px;
}

.submit-button {
  width: 100%;
  padding: 14px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.primary-action {
  background: #ff8c62;
  color: #fff;
}

.primary-action:disabled {
  background: #555;
  cursor: not-allowed;
}

.secondary-action {
  background: transparent;
  color: #aaa;
  margin-top: 10px;
}

.error-message {
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
  font-size: 14px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 140, 98, 0.2);
  border-top-color: #ff8c62;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.mt-15 {
  margin-top: 15px;
}
.mt-20 {
  margin-top: 20px;
}
</style>
