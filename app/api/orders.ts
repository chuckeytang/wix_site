// api/orders.ts

import request from "./http";
import type { OrderDetails, PaginationResult } from "~/types/orders";
import type { AjaxResult } from "~/types/ajax";

/**
 * 订单详情相关的 API 接口
 */
export const ordersApi = {
  /**
   * 查询订单详情列表
   * @param query 查询参数，例如 { pageNum: 1, pageSize: 10 }
   * @returns 包含订单详情列表和总数的 Promise
   */
  getOrdersList(query?: any): Promise<PaginationResult<OrderDetails>> {
    return request.get("/site/details/list", { params: query });
  },

  /**
   * 获取订单详情详细信息
   * @param orderId 订单ID
   * @returns 包含单个订单详情详细信息的 Promise
   */
  getOrderDetail(orderId: number): Promise<AjaxResult<OrderDetails>> {
    return request.get(`/site/details/${orderId}`);
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
