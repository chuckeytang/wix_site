import request from "./http";
import type { AjaxResult } from "~/types/ajax";
import type { LoginData, RegisterData } from "~/types/auth"; // 假设你更新了这些类型，特别是 RegisterData 需要包含 nickname

/**
 * 认证和用户相关的 API 接口
 * 路径从 /site/wix/member/ 更改为 /site/auth/
 */
export const authApi = {
  /**
   * 用户登录接口 (邮箱 + 密码)
   */
  login(data: LoginData): Promise<AjaxResult<string>> {
    // 这里的 data.email 现在是正确的，因为它在 LoginData 中直接定义了
    return request.post("/site/auth/login", {
      email: data.email,
      password: data.password,
    });
  },

  /**
   * 用户注册接口 (邮箱/昵称 + 密码)
   * @param data 包含邮箱、昵称和密码的注册数据
   * @returns 注册结果的 Promise
   */
  register(data: RegisterData): Promise<AjaxResult<any>> {
    // 假设 RegisterData 包含 email, nickname, password
    return request.post("/site/auth/register", data);
  },

  /**
   * Email verification API
   * @param data Contains the email and verification code/token
   * @returns 成功时返回 string 类型的 token
   */
  verifyEmail(data: {
    email: string;
    code: string;
  }): Promise<AjaxResult<string>> {
    return request.post("/site/auth/verifyEmail", data);
  },
};
