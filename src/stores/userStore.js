// src/stores/userStore.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        username: localStorage.getItem('username') || null ,
        isAdmin: localStorage.getItem('isAdmin') || null
    }),
    getters: {
        isUsernameAvailable: (state) => state.username !== null,
        isAdminAvailable: (state) => state.isAdmin == "true",
    },
    actions: {
        setUser(username) {
            this.username = username;
            localStorage.setItem('username', username);  // 存储 username 到 localStorage
        },
        clearUser() {
            this.username = null;
            localStorage.removeItem('username');  // 从 localStorage 移除 username
        },
        setAdmin(isAdmin) {
            this.isAdmin = isAdmin;
            localStorage.setItem('isAdmin', isAdmin);
        },
        clearAdmin() {
            this.isAdmin = false;
            localStorage.setItem('isAdmin', false);
        }
    }
});
