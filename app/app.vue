<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
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
