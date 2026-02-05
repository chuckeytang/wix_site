// app/api/stripe.ts
import request from "./http";
import type { AjaxResult } from "~/types/ajax";

export const stripeApi = {
  createPaymentIntent(orderId: number): Promise<
    AjaxResult<{
      clientSecret: string;
      finalAmount?: string;
      taxAmount?: string;
      originAmount?: string;
    }>
  > {
    return request.post(`/site/stripe/createPaymentIntent/${orderId}`);
  },
};
