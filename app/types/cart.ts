import type { Tracks } from './tracks'; // 导入曲目接口

// 定义单个购物车商品项的接口
export interface CartItem {
    id: string; // 使用 WIX Product ID 作为唯一标识更安全
    trackId: number; // 原始曲目ID，方便后端查询
    title: string; // 曲目名称，方便展示
    
    // 价格和授权信息
    price: number; // 最终价格 (由授权决定)
    licenseType: string; // 已选择的授权类型
    
    // 购买数量 (通常为 1，但保留)
    quantity: number; 
}