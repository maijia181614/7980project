// src/stores/auth.js
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null,  // 初始化时尝试从 localStorage 读取 token
    }),
    actions: {
        setToken(newToken) {
            this.token = newToken;
            localStorage.setItem('token', newToken);  // 存储 token 到 localStorage
        },
        clearToken() {
            this.token = null;
            localStorage.removeItem('token');  // 从 localStorage 移除 token
        }
    }
});
