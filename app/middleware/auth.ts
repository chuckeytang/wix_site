// middleware/auth.ts
import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware((to, from) => {
    if (process.server) {
        return; 
    }
    
    const authStore = useAuthStore();
    
    // 在客户端，如果 store 中没有 token，尝试从 localStorage 加载
    // 注意：这一步是为了检查 isAuthenticated，保持不变
    if (process.client && !authStore.getToken) {
        authStore.loadToken();
    }
    
    // 检查认证状态
    if (authStore.isAuthenticated) {
        console.log("--- [标准方式] 已登录，允许访问。");
        return; // 允许导航
    }
    
    // --- 未登录 ---
    console.log("--- [标准方式] 未登录，重定向到首页并携带指令。");
    
    // 关键修改：
    // 1. 移除 authStore.openPromptLogin()，因为状态会丢失。
    // 2. 在重定向到首页时，带上查询参数作为指令。

    // 避免无限重定向循环
    // 如果目标路径已经是首页且带有我们设置的指令参数，则停止。
    // 这样可以避免在首页和首页/?promptLogin=true 之间循环。
    if (to.path === '/' && to.query.promptLogin === 'true') {
        return; 
    }
    
    // 构建新的重定向路径：首页 + 指令参数
    const redirectPath = '/?promptLogin=true';

    // 返回重定向
    return navigateTo(redirectPath, { replace: true });
});