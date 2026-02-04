// app/api/stripe.ts
import request from "./http";
import type { AjaxResult } from "~/types/ajax";

export const stripeApi = {
  /**
   * 根据订单 ID 创建支付意图并获取 Client Secret
   * 对应后端：POST /site/stripe/createPaymentIntent/{orderId}
   */
  createPaymentIntent(
    orderId: number,
  ): Promise<AjaxResult<{ clientSecret: string }>> {
    return request.post(`/site/stripe/createPaymentIntent/${orderId}`);
  },
};
