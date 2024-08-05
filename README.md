<h2 align="center">linuxdo 增强插件（linuxdo-scripts）</h2>
<p align="center">脚本持续更新，欢迎提出 issues，提交 pr ~</p>
<p align="center">

[油猴安装地址](https://greasyfork.org/zh-CN/scripts/501827-linuxdo-%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6)

[交流贴](https://linux.do/t/topic/160343)

[开发计划](https://github.com/users/dlzmoe/projects/2)

</p>

<p align="center">
<img src="https://img.shields.io/greasyfork/v/501827-linuxdo-%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6?label=GreasyFork">
<img src="https://img.shields.io/github/last-commit/dlzmoe/linuxdo-scripts">
<img src="https://img.shields.io/github/commit-activity/t/dlzmoe/linuxdo-scripts">
<img src="https://img.shields.io/github/forks/dlzmoe/linuxdo-scripts?style=flat">
<img src="https://img.shields.io/github/stars/dlzmoe/linuxdo-scripts?style=flat">
<img src="https://img.shields.io/github/license/dlzmoe/linuxdo-scripts">
</p>

linux.do 增强插件，显示创建时间或将浏览器替换为时间，显示楼层数，新标签页打开话题，强制 block（拉黑屏蔽）某人的话题，话题快捷回复（支持自定义），优化签名图显示防止图裂，功能设置面板导入导出，楼层抽奖等，功能持续更新，欢迎提出。

---

## 1. 功能特性

- [x] 显示创建时间或将浏览器替换为时间
- [x] 显示楼层数
- [x] 新标签页打开话题
- [x] 强制 block（拉黑屏蔽）某人的话题
- [x] 话题快捷回复（支持自定义）
- [x] 优化签名图显示防止图裂
- [x] 功能设置面板导入导出
- [x] 楼层抽奖

## 1. 更新日志

[版本更新说明](./log.md)

## 2. 开发说明

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

