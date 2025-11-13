// app/api/users.ts

import request from "./http";
import type { Users, PaginationResult } from "~/types/users";
import type { AjaxResult } from "~/types/ajax";
// import axios from "axios"; // 如果用户相关的API没有涉及文件上传/下载，可以不用引入 axios

/**
 * 用户相关的 API 接口
 * 对应的后端路径前缀为 /site/users
 */
export const usersApi = {
  /**
   * 查询用户列表 (管理后台使用)
   * @param query 查询参数，例如 { pageNum: 1, pageSize: 10, nickname: '...' }
   * @returns 包含用户列表和总数的 Promise
   */
  getUsersList(query: any): Promise<PaginationResult<Users>> {
    // 对应后端 GET /site/users/list
    return request.get("/site/users/list", { params: query });
  },

  /**
   * 获取用户详细信息
   * @param userId 站点用户ID
   * @returns 包含单个用户详细信息的 Promise
   */
  getUserDetail(userId: number): Promise<AjaxResult<Users>> {
    // 对应后端 GET /site/users/{userId}
    return request.get(`/site/users/${userId}`);
  },

  /**
   * 获取当前登录用户的详细信息 (常用接口)
   * 假设后端提供了一个不带 ID 的特殊接口，或者我们通过 auth/getInfo 获取
   * 如果后端是通过 /site/users/{userId} 获取，前端需要知道当前用户 ID
   * 这里我们假设后端有一个获取自身信息的接口 /site/users/me
   * **注意：请根据后端实际接口进行调整。如果后端没有 `/me` 接口，应使用 `authApi` 或传入当前用户 ID。**
   */
  getMe(): Promise<AjaxResult<Users>> {
    // 这是一个常见的 RESTful 补充接口，用于获取当前登录用户自身信息
    // 假设它存在，如果不存在，请使用 `getUserDetail(authStore.userId)`
    return request.get("/site/users/me");
  },

  /**
   * 新增用户 (管理后台使用)
   * @param data 用户数据
   * @returns 新增结果的 Promise
   */
  addUser(data: Users): Promise<AjaxResult<any>> {
    // 对应后端 POST /site/users
    return request.post("/site/users", data);
  },

  /**
   * 修改用户
   * @param data 用户数据
   * @returns 修改结果的 Promise
   */
  updateUser(data: Users): Promise<AjaxResult<any>> {
    // 对应后端 PUT /site/users
    return request.put("/site/users", data);
  },

  /**
   * 删除用户 (管理后台使用)
   * @param userIds 用户ID数组
   * @returns 删除结果的 Promise
   */
  deleteUsers(userIds: number[]): Promise<AjaxResult<any>> {
    // 对应后端 DELETE /site/users/{userIds}
    return request.delete(`/site/users/${userIds.join(",")}`);
  },

  /**
   * 导出用户列表 (管理后台使用)
   * @param query 查询参数
   * @returns 无返回值，直接触发文件下载
   */
  exportUsers(query: any): Promise<void> {
    // 对应后端 POST /site/users/export
    return request.post("/site/users/export", query, {
      responseType: "blob", // 响应类型为 Blob，用于下载
    });
  },
};
