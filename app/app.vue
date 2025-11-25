<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    
    <Toast />

  </div>
</template>

<script setup lang="ts">
import Toast from '@/components/Toast.vue';
useHead({
  script: [
    // 引入 Stripe.js SDK
    {
      src: "https://js.stripe.com/v3/",
      tagPosition: "head",
    },
  ],
});
</script>
