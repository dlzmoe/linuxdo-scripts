<h2 align="center">linuxdo 增强插件（linuxdo-scripts）</h2>
<p align="center">脚本持续更新，欢迎提出 issues，提交 pr ~</p>

<p align="center">
<img src="https://img.shields.io/github/v/release/dlzmoe/linuxdo-scripts?label=linuxdo%20%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6&labelColor=%235D5D5D&color=%23E97435">
<img src="https://img.shields.io/github/last-commit/dlzmoe/linuxdo-scripts">
<img src="https://img.shields.io/github/stars/dlzmoe%2Flinuxdo-scripts?style=flat">
<img src="https://img.shields.io/github/license/dlzmoe/linuxdo-scripts">
</p>

linux.do 增强插件，话题列表显示创建时间，显示楼层数，新标签页打开话题，强制 block（拉黑屏蔽）某人的话题，话题快捷回复（支持自定义），优化签名图显示防止图裂，在话题列表可直接预览详情及评论，功能设置面板导入导出，楼层抽奖，用户自定义标签，只看楼主，自动滚动阅读，支持自定义 css 样式等，中英文混排优化，等级信息查询，功能持续更新，欢迎提出新想法！

[Github 仓库](https://github.com/dlzmoe/linuxdo-scripts) | [开发计划](https://github.com/users/dlzmoe/projects/2) | [bug 反馈](https://github.com/dlzmoe/linuxdo-scripts/issues) | [问题讨论区](https://github.com/dlzmoe/linuxdo-scripts/discussions) | [使用方法](https://github.com/dlzmoe/linuxdo-scripts?tab=readme-ov-file#%E4%BD%BF%E7%94%A8%E6%96%B9%E6%B3%95) | [使用和开发文档](https://linuxdo-scripts-docs.netlify.app/)

> [快速安装脚本](https://raw.githubusercontent.com/dlzmoe/linuxdo-scripts/main/linuxdo-scripts.user.js)

---

开发环境为 windows / chrome / 暴力猴，使用其他油猴管理器如果报错或者不生效，可以尝试使用暴力猴（我目前正在使用的，兼容性比较好）。

目前已知不兼容的有：篡改猴测试版、脚本猫，暂时没计划兼容这两个管理器，如果有想法开发，欢迎提交代码 ~


## 功能特性

- [x] 话题列表显示创建时间
- [x] 显示楼层数
- [x] 新标签页打开话题
- [x] 强制 block（拉黑屏蔽）某人的话题
- [x] 话题快捷回复（支持自定义）
- [x] 优化签名图显示防止图裂
- [x] 功能设置面板导入导出
- [x] 楼层抽奖
- [x] 只看楼主切换功能
- [x] 自动滚动阅读
- [x] 黑夜模式
- [x] 用户标签功能
- [x] 在话题列表可直接预览详情及评论
- [x] 评论框表情优化
- [x] 支持自定义 css 样式
- [x] 中英文混排优化显示
- [x] 新增等级信息查询

**部分截图演示：**

| ![image](https://github.com/user-attachments/assets/c70edbe9-ead1-4a6b-b268-7fc956d3f72f) | ![image](https://github.com/user-attachments/assets/bde3b652-4948-4f00-a825-5f235ebf4d78) |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| ![image](https://github.com/user-attachments/assets/05b6510e-0e61-4977-a958-cd8459aaff84) | ![image](https://github.com/user-attachments/assets/4e22e692-85a1-424a-96cc-f39c24b94516) |
| ![image](https://github.com/user-attachments/assets/b9c8626d-03af-4a55-8a92-1f1ebd9a02bf) |                                                                                           |


## 使用方法

以下两种方式推荐第一种。

1. 点击此链接将会自动触发油猴脚本安装程序，后续也可以触发更新。  
   https://raw.githubusercontent.com/dlzmoe/linuxdo-scripts/main/linuxdo-scripts.user.js

2. 使用第三方 js 代码，会自动引入我的最新版本 js，不会触发更新，因为文件代码始终是最新的。

```js
// ==UserScript==
// @name         linuxdo 增强插件
// @namespace    https://github.com/dlzmoe/linuxdo-scripts
// @version      0.0.0
// @description  linux.do 增强插件，功能持续更新，欢迎提出新想法！查看更新日志：https://github.com/dlzmoe/linuxdo-scripts/blob/main/version-log.md
// @author       dlzmoe
// @match        *://linux.do/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @icon         https://cdn.linux.do/uploads/default/optimized/3X/9/d/9dd49731091ce8656e94433a26a3ef36062b3994_2_32x32.png
// @license      Apache-2.0 license
// ==/UserScript==

(function () {
  'use strict';
  window.addEventListener('load', function () {

    var script = document.createElement('script');
    script.src = 'https://linuxdo-scripts.zishu.me/app.bundle.js';
    document.body.appendChild(script);

  });
})();
```

```shell
# 可使用链接，欢迎提供访问速度快的外链
https://linuxdo-scripts.zishu.me/app.bundle.js
https://linuxo-scripts.netlify.app/app.bundle.js
https://fastly.jsdelivr.net/gh/dlzmoe/linuxdo-scripts@main/dist/app.bundle.js
```


## 开发说明

```
node: v16.15.1
```

功能以组件形式展开，每次新增一个功能，注册一个新的组件避免冲突。

1. 安装本仓库并下载依赖，执行运行代码

```shell
git clone https://github.com/dlzmoe/linuxdo-scripts
npm i # 安装依赖
npm run dev # 本地运行
npm run build # 打包构建
```

2. 将 `tampermonkey.js` 代码复制到油猴管理器中。
3. 启用脚本后前往 `linux.do`，刷新页面。

> 关于自动构建 Release 包，需要修改 `package.json` 中的 `version` 版本号，并且在 `version-log.md` 中写入更新日志。


## 更新日志

[version-log.md](./version-log.md)


## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=dlzmoe/linuxdo-scripts&type=Date)](https://star-history.com/#dlzmoe/linuxdo-scripts&Date)


## 免责声明

本脚本中提供的所有功能均仅在浏览器中运行，所使用的源代码公开透明可见，且本脚本仅学习研究使用，不使用任何盈利方案或参与任何盈利组织，因使用本脚本引起的或与本脚本有关的任何争议，各方应友好协商解决，本脚本对使用本脚本所提供的软件时可能对用户自己或他人造成的任何形式的损失和伤害不承担任何责任。如用户下载、安装和使用本产品中所提供的软件，即表明用户信任本作者及其相关协议和免责声明。


## License

[Apache-2.0 license](./LICENSE)
