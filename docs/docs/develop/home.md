# 开发文档

```shell
node: v18.17.0
```

功能以组件形式展开，每次新增一个功能，注册一个新的组件避免冲突。

安装本仓库并下载依赖，运行代码。

```shell
git clone https://github.com/dlzmoe/linuxdo-scripts
yarn # 安装依赖
yarn dev # 本地运行
yarn build # 打包构建
```

启动后，打开本地 `.output` 文件夹，把 `chrome-mv3` 拖拽到 `chrome://extensions/` 中即可开发。
