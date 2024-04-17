import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // server: {
  //   proxy: {
  //     '/testHost': {
  //       target: 'https://indekkusu.azurewebsites.net', // 目标接口的域名
  //       changeOrigin: true, // 必须设置为true，才能避免host不一致导致的问题
  //       rewrite: (path) => path.replace(/^\/testHost/, '') // 重写接口路径，去掉/testHost
  //     }
  //   }
  // }
})


