import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import monkey, { cdn } from 'vite-plugin-monkey';
import pkg from './package.json'; // Import package.json

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    monkey({
      entry: 'src/main.js',
      userscript: {
        icon: 'https://cdn.linux.do/uploads/default/optimized/3X/9/d/9dd49731091ce8656e94433a26a3ef36062b3994_2_32x32.png',
        name: "linuxdo 增强插件",
        namespace: 'https://github.com/dlzmoe/linuxdo-scripts',
        version: pkg.version,
        match: ['*://*.linux.do/*'],
      },
      build: {
        externalGlobals: {
          vue: cdn.unpkg('Vue', 'dist/vue.global.prod.js'),
          'element-plus': cdn.unpkg('ElementPlus', 'dist/index.full.min.js'),
        },
        externalResource: {
          'element-plus/dist/index.css': cdn.unpkg(),
        },
        minify: false, // 不混淆
      },
    }),
  ],
});