// types/auth.d.ts
export interface LoginData {
  email?: string;
  password?: string;
}

export interface RegisterData {
  email?: string;
  password?: string;
  // 其他字段...
}

export interface WixTokenResponse {
  accessToken: string;
  refreshToken: string;
  // 其他字段...
}
