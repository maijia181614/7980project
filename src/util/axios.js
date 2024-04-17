// src/utils/axios.js
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';


// 创建 axios 实例
const instance = axios.create({
  baseURL: 'https://indekkusu.azurewebsites.net', // 你的 API 基础链接
  timeout: 10000, // 请求超时时间
  headers: {'Content-Type': 'application/json'} 
});

// 请求拦截器
instance.interceptors.request.use(
  config => {
    const auth = useAuthStore();
    // 如果 token 存在，每个请求的头部都携带 token
    if (auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
  },
  error => {
    // 请求错误处理
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  response => {
    // 根据实际情况调整，处理从服务器返回的数据
    return response.data;
  },
  error => {
    // 处理错误响应
    if (error.response.status === 401) {
      console.log("未授权或 token 过期");
    }
    return Promise.reject(error);
  }
);

export default instance;
