import request from "./http";
import type { AjaxResult } from "~/types/ajax";
import type { LoginData, RegisterData, WixTokenResponse } from "~/types/auth";

/**
 * 认证和用户相关的 API 接口
 */
export const authApi = {
  /**
   * 用户登录接口 (邮箱/密码)
   * @param data 包含邮箱和密码的登录数据
   * @returns 登录结果的 Promise，通常包含 token 信息
   */
  login(data: LoginData): Promise<AjaxResult<any>> {
    // 这里的 '/site/wix/auth/login' 是一个假设的登录接口
    // 您需要确保若依后端有对应的处理方法
    return request.post("/site/wix/auth/login", data);
  },

  /**
   * 用户注册接口
   * @param data 包含邮箱和密码的注册数据
   * @returns 注册结果的 Promise
   */
  register(data: RegisterData): Promise<AjaxResult<any>> {
    // 这里的 '/site/wix/auth/register' 是一个假设的注册接口
    // 您需要确保若依后端有对应的处理方法
    return request.post("/site/wix/auth/register", data);
  },

  /**
   * 获取访客令牌接口
   * @returns 包含访客 token 的 Promise
   */
  getVisitorToken(): Promise<AjaxResult<WixTokenResponse>> {
    return request.get("/site/wix/auth/getVisitorToken");
  },

  /**
   * 刷新访客令牌接口
   * @param refreshToken 访客刷新令牌
   * @returns 包含新 token 的 Promise
   */
  refreshVisitorToken(
    refreshToken: string
  ): Promise<AjaxResult<WixTokenResponse>> {
    return request.post(
      `/site/wix/auth/refreshVisitorToken?refreshToken=${refreshToken}`
    );
  },
};
