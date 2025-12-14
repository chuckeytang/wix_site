// api/orders.ts

import request from "./http";
import type { OrderDetails, PaginationResult } from "~/types/orders";
import type { AjaxResult } from "~/types/ajax";

interface OrderStatusResult {
  status: "PAID" | "PENDING" | "FAILED" | "CANCELLED"; // 假设的状态枚举
  // 可以在这里增加其他需要的信息，例如 totalAmount, currency 等
}

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

  /**
   * 查询特定订单的当前状态
   * 对应后端 GET /site/orders/{orderId}/status (假设新增此接口)
   * @param orderId 订单ID
   * @returns 包含订单状态的 Promise
   */
  getOrderStatus(orderId: string): Promise<AjaxResult<OrderStatusResult>> {
    // 注意：这里 orderId 接收 string 类型，以匹配前端 URL query 参数
    return request.get(`/site/orders/${orderId}/status`);
  },

  /**
   * 新增订单详情
   * @param data 订单详情数据
   * @returns 新增结果的 Promise
   */
  addOrder(data: OrderDetails): Promise<AjaxResult<any>> {
    return request.post("/site/details", data);
  },

  /**
   * 修改订单详情
   * @param data 订单详情数据
   * @returns 修改结果的 Promise
   */
  updateOrder(data: OrderDetails): Promise<AjaxResult<any>> {
    return request.put("/site/details", data);
  },

  /**
   * 删除订单详情
   * @param orderIds 订单详情ID数组
   * @returns 删除结果的 Promise
   */
  deleteOrders(orderIds: number[]): Promise<AjaxResult<any>> {
    return request.delete(`/site/details/${orderIds.join(",")}`);
  },

  /**
   * 导出订单详情列表
   * @param query 查询参数
   * @returns 无返回值，直接触发文件下载
   */
  exportOrders(query: any): Promise<void> {
    return request.post("/site/details/export", query, {
      responseType: "blob", // 响应类型为 Blob，用于下载
    });
  },
};
