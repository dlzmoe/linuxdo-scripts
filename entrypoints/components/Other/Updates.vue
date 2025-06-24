<template>
  <div class="item-foot">
    <span>
      <a href="https://github.com/ezyshu/linuxdo-scripts" target="_blank">
        <img alt="GitHub Repo stars"
          src="https://img.shields.io/github/stars/ezyshu/linuxdo-scripts?style=flat&logoColor=%237F5801&label=Github&labelColor=%230E0E0F">
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

  span {
    margin-bottom: 2px;
  }
}
</style>