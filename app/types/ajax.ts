// types/ajax.ts

/**
 * 若依框架统一返回结果类型定义
 */
export interface AjaxResult<T> {
  code: number; // 状态码，通常 200 表示成功
  msg: string; // 提示信息
  data?: T; // 业务数据
}
