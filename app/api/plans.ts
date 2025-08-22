// api/plans.ts

import request from "./http";
import type { Plans, PaginationResult } from "~/types/plans";
import type { AjaxResult } from "~/types/ajax";

/**
 * 订阅计划相关的 API 接口
 */
export const plansApi = {
  /**
   * 查询订阅计划列表
   * @param query 查询参数，例如 { pageNum: 1, pageSize: 10 }
   * @returns 包含订阅计划列表和总数的 Promise
   */
  getPlansList(query?: any): Promise<PaginationResult<Plans>> {
    return request.get("/site/plans/list", { params: query });
  },

  /**
   * 获取订阅计划详细信息
   * @param planId 订阅计划ID
   * @returns 包含单个订阅计划详细信息的 Promise
   */
  getPlanDetail(planId: number): Promise<AjaxResult<Plans>> {
    return request.get(`/site/plans/${planId}`);
  },

  /**
   * 新增订阅计划
   * @param data 订阅计划数据
   * @returns 新增结果的 Promise
   */
  addPlan(data: Plans): Promise<AjaxResult<any>> {
    return request.post("/site/plans", data);
  },

  /**
   * 修改订阅计划
   * @param data 订阅计划数据
   * @returns 修改结果的 Promise
   */
  updatePlan(data: Plans): Promise<AjaxResult<any>> {
    return request.put("/site/plans", data);
  },

  /**
   * 删除订阅计划
   * @param planIds 订阅计划ID数组
   * @returns 删除结果的 Promise
   */
  deletePlans(planIds: number[]): Promise<AjaxResult<any>> {
    return request.delete(`/site/plans/${planIds.join(",")}`);
  },

  /**
   * 导出订阅计划列表
   * @param query 查询参数
   * @returns 无返回值，直接触发文件下载
   */
  exportPlans(query: any): Promise<void> {
    return request.post("/site/plans/export", query, {
      responseType: "blob", // 响应类型为 Blob，用于下载
    });
  },
};
