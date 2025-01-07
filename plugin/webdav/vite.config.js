import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import monkey, { cdn } from 'vite-plugin-monkey';
import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    monkey({
      entry: 'src/main.js',
      userscript: {
        icon: 'https://imgurl.zishu.me/2024/12/1736258705840.webp',
        name: "LinuxDo Scripts WWebdav Sync",
        namespace: 'https://github.com/dlzmoe/linuxdo-scripts',
        description: "给 LinuxDo Scripts 扩展添加 webdav 同步补丁的油猴脚本。",
        version: pkg.version,
        match: [
          '*://chat.oaipro.com/*',
          '*://chat-preview.lobehub.com/*'
        ],
      },
      build: {
        externalGlobals: {
          // require 引入
          vue: cdn.unpkg('Vue', 'dist/vue.global.prod.js'),
        },
        minify: false, // 不混淆
      },
    }),
  ],
});
