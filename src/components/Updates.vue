<template>
  <div class="item">
    <div class="tit">
      当前版本：{{ version }}
      <a href="https://github.com/dlzmoe/linuxdo-scripts" target="_blank">Github 源码</a>
      <a href="https://linuxdo-scripts-docs.netlify.app/" target="_blank">使用文档</a>
    </div>
  </div>
</template>

<script>
import packageJson from "../../package.json"; // 根据路径调整
export default {
  data() {
    return {
      version: packageJson.version,
    };
  },
};
</script>
<style lang="less" scoped>
a {
  margin-left: 10px;
}
a:hover {
  text-decoration: underline;
}
</style>
