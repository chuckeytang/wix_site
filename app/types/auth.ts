// types/auth.d.ts
/**
 * 用户登录请求数据结构（邮箱/密码）
 */
export interface LoginData {
  email: string;
  password: string;
}

/**
 * 用户注册请求数据结构（邮箱/昵称/密码）
 */
export interface RegisterData {
  email: string;
  nickname: string;
  password: string;
}
