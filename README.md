> [!NOTE]
> 特别活动：【L 站 2024 年度总结】脚本 - [源码](./plugin/summary.user.js) / [直接安装](https://raw.githubusercontent.com/dlzmoe/linuxdo-scripts/refs/heads/main/plugin/summary.user.js)

<h2 align="center">LinuxDo Scripts 扩展（原名：linuxdo-scripts 增强插件）</h2>
<p align="center">持续更新，欢迎提出 Issues，提交 Pr ~</p>

[中文简体](https://github.com/dlzmoe/linuxdo-scripts/blob/main/README.md) | [English](https://github.com/dlzmoe/linuxdo-scripts/blob/main/README_EN.md)

<p align="center">
<img src="https://img.shields.io/github/v/release/dlzmoe/linuxdo-scripts?style=flat-square&label=LinuxDo Scripts 扩展&labelColor=%235D5D5D&color=%23E97435">
<img src="https://img.shields.io/github/last-commit/dlzmoe/linuxdo-scripts?style=flat-square&">
<img src="https://img.shields.io/github/stars/dlzmoe/linuxdo-scripts?style=flat-square&label=Github%20Stars">
<img src="https://img.shields.io/chrome-web-store/users/fbgblmjbeebanackldpbmpacppflgmlj?style=flat-square&label=Chrome%20Web%20Store">
<img src="https://img.shields.io/github/license/dlzmoe/linuxdo-scripts?style=flat-square&">
</p>

LinuxDo Scripts 扩展，话题列表显示创建时间，显示楼层数，新标签页打开话题，强制 block（拉黑屏蔽）某人的话题，话题快捷回复（支持自定义），优化签名图显示防止图裂，在话题列表可直接预览详情及评论，功能设置面板导入导出，楼层抽奖，用户自定义标签，只看楼主，自动滚动阅读，支持自定义 css 样式，中英文混排优化，等级信息查询，AI 总结话题功能、智能生成回复，支持 webdav 同步，切换论坛主题皮肤等，更多功能请查看设置列表，功能持续更新，欢迎提出新想法！

[Github 仓库](https://github.com/dlzmoe/linuxdo-scripts) |
[Chrome 商店](https://chromewebstore.google.com/detail/fbgblmjbeebanackldpbmpacppflgmlj) |
[Firefox 商店](https://addons.mozilla.org/zh-CN/firefox/addon/linux_do-scripts/) |
~~[Greasyfork 商店安装](https://greasyfork.org/scripts/501827)~~   
[Bug 反馈及功能请求](https://github.com/dlzmoe/linuxdo-scripts/issues/new/choose) |
[使用和开发文档](https://linuxdo-scripts-docs.netlify.app/) |
[Discord 社区](https://discord.gg/n2pErsD7Kg)

## 安装使用

- Chrome、Edge、Arc 用户请在 [Chrome 商店中安装](https://chromewebstore.google.com/detail/fbgblmjbeebanackldpbmpacppflgmlj)
- Firefox 用户请在 [Firefox 商店中安装](https://addons.mozilla.org/zh-CN/firefox/addon/linux_do-scripts/)

![image](https://github.com/user-attachments/assets/1553917a-1b3b-44f4-b624-2ca2a1616e4f)

## 功能特性

<details>
<summary>功能列表：</summary>

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
- [x] 切换论坛表情风格
- [x] AI 总结话题功能、智能生成回复
- [x] 支持 webdav 同步
- [x] 切换论坛主题皮肤
- [x] 更多功能请查看设置列表

</details>

<details>
<summary>部分截图演示：</summary>

| ![image](https://github.com/user-attachments/assets/f3fb854f-e6fd-4da4-9a9c-377b6537fab7) | ![image](https://github.com/user-attachments/assets/3b2a9e63-3939-4dbc-a00f-c713ca2c7f33) |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| ![image](https://github.com/user-attachments/assets/2c67ab9f-2359-4ab5-b0dd-0f257560b98b) | ![image](https://github.com/user-attachments/assets/ed4f925c-e26c-43ce-a886-fa764ac341b5) |
| ![image](https://github.com/user-attachments/assets/c6ba9abb-43aa-40ce-a4a1-b9cdae229a2d) | ![image](https://github.com/user-attachments/assets/399c1645-36e1-4fe2-a671-ae40685e87ca) |

</details>

## 开发说明

```
node: v22.12.0
```

功能以组件形式展开，每次新增一个功能，注册一个新的组件避免冲突。

安装本仓库并下载依赖，运行代码。

```shell
git clone https://github.com/dlzmoe/linuxdo-scripts
yarn # 安装依赖
yarn dev # 本地运行
```

无需构建，PR 代码后我将会审核，没有太大问题都会在最短时间内合并。

## 更新日志

[version-log.md](https://github.com/dlzmoe/linuxdo-scripts/blob/main/version-log.md)

## 贡献历史

![Contributor](https://contrib.rocks/image?repo=dlzmoe/linuxdo-scripts)

[![Stargazers over time](https://starchart.cc/dlzmoe/linuxdo-scripts.svg?variant=adaptive)](https://starchart.cc/dlzmoe/linuxdo-scripts)

## 免责声明

本脚本中提供的所有功能均仅在浏览器中运行，所使用的源代码公开透明可见，且本脚本仅学习研究使用，不使用任何盈利方案或参与任何盈利组织，因使用本脚本引起的或与本脚本有关的任何争议，各方应友好协商解决，本脚本对使用本脚本所提供的软件时可能对用户自己或他人造成的任何形式的损失和伤害不承担任何责任。如用户下载、安装和使用本产品中所提供的软件，即表明用户信任本作者及其相关协议和免责声明。

## 版权协议

[MIT license](https://github.com/dlzmoe/linuxdo-scripts/blob/main/LICENSE)
