// plugins/stripe.client.ts

import { loadStripe } from "@stripe/stripe-js";
import type { Stripe } from "@stripe/stripe-js";

// 声明全局变量，用于存储 Stripe 实例
let stripeInstance: Stripe | null = null;

export default defineNuxtPlugin({
  name: "stripe-plugin",
  enforce: "pre",
  async setup(nuxtApp) {
    const config = useRuntimeConfig();
    const publishableKey = config.public.stripePk as string;
    const appBaseApi = config.public.appBaseApi as string;

    console.log("publishableKey:", publishableKey); // Log 1: 检查密钥是否拿到
    console.log("appBaseApi:", appBaseApi);

    if (!publishableKey) {
      console.error("Stripe Publishable Key 未配置！");
    }

    // 只有当实例未加载且公钥存在时，才进行异步加载
    if (stripeInstance === null && publishableKey) {
      try {
        console.log("Stripe SDK 异步加载中..."); // Log 2: 确认进入加载阶段

        // 核心加载步骤
        stripeInstance = await loadStripe(publishableKey);

        console.log("Stripe SDK 加载完成。"); // Log 3: 确认加载成功

        // 检查加载结果，如果失败，可能是 key 不正确
        if (!stripeInstance) {
          console.error("Stripe SDK 加载失败，loadStripe 返回 null。");
        }
      } catch (error) {
        console.error("Stripe SDK 加载发生异常:", error);
      }
    }

    // 将 Stripe 实例注入到全局，组件中可通过 useNuxtApp().$stripe 访问
    return {
      provide: {
        stripe: stripeInstance as Stripe | null, // 明确类型断言
      },
    };
  },
});
