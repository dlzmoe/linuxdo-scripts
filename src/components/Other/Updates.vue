<template>
  <div class="item-foot">
    <span>
      <a href="https://github.com/dlzmoe/linuxdo-scripts" target="_blank">
        Github 源码
      </a>
    </span>
    <span>当前版本：{{ version }}</span>
  </div>
</template>

<script>
import packageJson from "../../../package.json"; // 根据路径调整
export default {
  data() {
    return {
      version: packageJson.version,
    };
  },
};
</script>
<style lang="less" scoped>
a:hover {
  text-decoration: underline;
}
.item-foot {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: absolute;
  bottom: 70px;
  left: 22px;
  line-height: 2;

  img {
    width: auto !important;
    height: 20px !important;
  }
}
</style>
