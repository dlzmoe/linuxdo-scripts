<template>
  <p>欢迎使用 Linxudo Scripts 扩展！</p>
  <p>
    鼠标移动到浏览器最左侧后点击设置按钮，
    <a href="https://linuxdo-scripts-docs.zishu.me/" target="_blank"> 使用教程！ </a>
  </p>

  <a-divider />

  <a-space>
    <a-button type="primary" @click="openBookmark">收藏夹</a-button>
    <a-button type="primary" @click="openShare">分享话题图片</a-button>
    <a-button type="outline" @click="goGithub">Github</a-button>
  </a-space>

  <a-divider />

  <div class="item">
    <label>开启该设置时，会关闭论坛中的设置按钮。</label>
    <a-switch v-model="isShow" @change="ShowSettingConfig" />
  </div>

</template>

<script>
export default {
  data() {
    return {
      isShow: false,
    };
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
    // 设置
    goSetting() {
      const browserAPI = typeof browser !== "undefined" ? browser : chrome;
      browserAPI.tabs.create({
        url: browserAPI.runtime.getURL("options.html"),
      });
    },

    goGithub() {
      window.open("https://github.com/dlzmoe/linuxdo-scripts", "_blank");
    },

    // 是否隐藏设置按钮
    ShowSettingConfig() {
      localStorage.setItem("isShowSettingConfig", this.isShow);
      const browserAPI = typeof browser !== "undefined" ? browser : chrome;
      const data = { isShowSettingConfig: this.isShow };
      browserAPI.storage.local.set({ transferData: data }, () => {
        // 获取当前标签页并发送消息
        browserAPI.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          browserAPI.tabs.sendMessage(tabs[0].id, { action: "getData" });
        });

        this.$message.success('切换成功！')
      });
    }
  },
  created() {
    const isShowSettingConfig = localStorage.getItem("isShowSettingConfig");

    if (JSON.parse(isShowSettingConfig)) {
      this.isShow = JSON.parse(isShowSettingConfig);
    }
  },
};
</script>

<style lang="less" scoped>
.el-button {
  margin-top: 10px;
  margin-bottom: 10px;
}

.item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  label {
    flex: 1;
    color: #333;
    font-size: 14px;
    margin-right: 10px;
  }
}
</style>