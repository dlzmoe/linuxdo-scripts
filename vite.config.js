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
        icon: 'https://cdn.linux.do/uploads/default/optimized/3X/9/d/9dd49731091ce8656e94433a26a3ef36062b3994_2_32x32.png',
        name: "linuxdo 增强插件",
        namespace: 'https://github.com/dlzmoe/linuxdo-scripts',
        description: "linux.do 增强插件，功能持续更新，欢迎提出新想法！",
        version: pkg.version,
        match: ['*://linux.do/*'],
      },
      build: {
        externalGlobals: {
          // require 引入
          vue: cdn.unpkg('Vue', 'dist/vue.global.prod.js'),
          jquery: cdn.unpkg("jQuery", "dist/jquery.min.js"),
          pangu: cdn.unpkg("pangu", "dist/browser/pangu.js"),
          marked: cdn.unpkg("marked", "marked.min.js"),
          "pinyin-pro": cdn.unpkg("pinyin-pro", "/dist/index.js"),
        },
        minify: false, // 是否混淆
      },
    }),
  ],
});
