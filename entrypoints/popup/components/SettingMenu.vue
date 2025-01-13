<template>
  <p>欢迎使用 Linxudo Scripts 扩展！</p>
  <p>
    鼠标移动到浏览器最左侧后点击设置按钮，
    <a href="https://linuxdo-scripts-docs.zishu.me/" target="_blank"> 使用教程！ </a>
  </p>
  <el-button type="primary" @click="openBookmark">收藏夹</el-button>
  <el-button type="primary" @click="openShare">分享话题图片</el-button>
  <el-button type="primary" @click="goGithub">Github</el-button>
  <p>【分享话题图片】是实验性功能，敬请期待！</p>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    // 收藏夹
    openBookmark() {
      const browserAPI = typeof browser !== "undefined" ? browser : chrome;
      browserAPI.tabs.create({
        url: browserAPI.runtime.getURL("bookmark.html"),
      });
    },
    // 分享话题
    openShare() {
      const browserAPI = typeof browser !== "undefined" ? browser : chrome;
      browserAPI.tabs.create({
        url: browserAPI.runtime.getURL("share.html"),
      });
    },
    goGithub() {
      window.open("https://github.com/dlzmoe/linuxdo-scripts", "_blank");
    },
  },
  created() {},
};
</script>

<style lang="less" scoped>
.el-button {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>