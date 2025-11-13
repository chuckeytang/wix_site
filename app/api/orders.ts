// api/orders.ts

import request from "./http";
import type { OrderDetails, PaginationResult } from "~/types/orders";
import type { AjaxResult } from "~/types/ajax";

/**
 * 订单相关的 API 接口 (路径从 /site/details 统一为 /site/orders)
 */
export const ordersApi = {
  /**
   * 查询订单列表 (后台管理接口)
   * @param query 查询参数，例如 { pageNum: 1, pageSize: 10 }
   * @returns 包含订单列表和总数的 Promise
   */
  getOrdersList(query?: any): Promise<PaginationResult<OrderDetails>> {
    // 对应后端 GET /site/orders/list (假设已统一为 orders)
    return request.get("/site/orders/list", { params: query });
  },

  /**
   * 查询当前用户的订单列表 (前台用户接口)
   * 对应后端 GET /site/orders/user/my-orders
   * @param query 分页参数 { pageNum: 1, pageSize: 10 }
   * @returns 包含订单列表和总数的 Promise
   */
  getUserOrders(query?: any): Promise<PaginationResult<OrderDetails>> {
    return request.get("/site/orders/user/my-orders", { params: query });
  },

  /**
   * 获取订单详细信息
   * @param orderId 订单ID
   * @returns 包含单个订单详细信息的 Promise
   */
  getOrderDetail(orderId: number): Promise<AjaxResult<OrderDetails>> {
    // 对应后端 GET /site/orders/{orderId} (假设已统一为 orders)
    return request.get(`/site/orders/${orderId}`);
  },

  // ... (addOrder, updateOrder, deleteOrders, exportOrders 接口的路径也应相应修改)
  // 如果这些接口在前台不使用，可以暂时忽略。这里仅列出前台需要的部分。
};
