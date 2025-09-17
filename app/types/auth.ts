// types/auth.d.ts
export interface LoginData {
  loginId?: {
    email?: string;
  };
  password?: string;
}

export interface RegisterData {
  loginId?: {
    email?: string;
  };
  password?: string;
}

export interface WixTokenResponse {
  accessToken: string;
  refreshToken: string;
  // 其他字段...
}
