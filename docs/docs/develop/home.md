# 开发文档

```
node: v16.15.1
```

功能以组件形式展开，每次新增一个功能，注册一个新的组件避免冲突。

安装本仓库并下载依赖，运行代码。

```shell
git clone https://github.com/dlzmoe/linuxdo-scripts
yarn # 安装依赖
yarn dev # 本地运行
yarn build # 打包构建
```

程序会自动触发本地测试。

> 关于自动构建 Release 包，需要修改 `package.json` 中的 `version` 版本号，并且在 `CHANGELOG.md` 中写入当前版本更新日志。
