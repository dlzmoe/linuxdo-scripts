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
        description: "linux.do 增强插件，话题列表显示创建时间，显示楼层数，新标签页打开话题，强制 block（拉黑屏蔽）某人的话题，话题快捷回复（支持自定义），优化签名图显示防止图裂，在话题列表可直接预览详情及评论，功能设置面板导入导出，楼层抽奖，用户自定义标签，只看楼主，自动滚动阅读，支持自定义 css 样式，中英文混排优化，等级信息查询，AI 总结话题功能等，功能持续更新，欢迎提出新想法！",
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
