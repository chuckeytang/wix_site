// api/carts.ts

import request from "./http";
import type { CartItems } from "../types/cartItems";
import type { Carts } from "../types/carts";
import type { AjaxResult } from "~/types/ajax";

/**
 * 购物车和购物车项目相关的 API 接口
 */
export const cartsApi = {
  /**
   * [前台] 查询当前用户的购物车详情
   * @returns 包含购物车 Carts 对象（内含 items 列表）的 Promise
   */
  getUserCart(): Promise<AjaxResult<Carts>> {
    return request.get("/site/carts/user/current");
  },

  /**
   * 添加或更新购物车项目
   * @param item 购物车项目数据 (CartItems)，至少需要 productType, productId, licenseOption, quantity
   * @returns 添加结果的 Promise
   */
  addItemToCart(item: Partial<CartItems>): Promise<AjaxResult<CartItems>> {
    return request.post("/site/cart-items/add", item);
  },

  /**
   * [前台] 删除购物车中的项目
   * @param cartItemId 购物车项目ID
   * @returns 删除结果的 Promise
   */
  deleteItemFromCart(cartItemId: number): Promise<AjaxResult<any>> {
    return request.delete(`/site/cart-items/${cartItemId}`);
  },

  /**
   * [前台] 提交购物车，创建订单
   * @returns 包含新创建订单详情的 Promise
   */
  submitCartToOrder(): Promise<AjaxResult<any>> {
    return request.post("/site/orders/submit");
  },

  /**
   * 为订单创建支付意图
   * @param orderId 订单ID
   * @returns 包含 { clientSecret: string } 的 Promise
   */
  createPaymentIntent(
    orderId: number
  ): Promise<AjaxResult<{ clientSecret: string }>> {
    // 假设后端接口接收 JSON Body { orderId: 123 }
    return request.post("/site/payment/create-intent", { orderId });
  },

  /**
   * 单品立即购买，创建订单
   * @param data 包含 productType, productId, licenseOption
   * @returns 包含新创建订单详情的 Promise
   */
  instantBuy(data: {
    productType: string;
    productId: number;
    licenseOption: string;
  }): Promise<AjaxResult<any>> {
    return request.post("/site/orders/instant-buy", data);
  },
};
