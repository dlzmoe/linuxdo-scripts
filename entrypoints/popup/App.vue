<template>
  <h2>欢迎使用 Linxudo Scripts 扩展</h2>
  <h3>鼠标移动到页面最左侧可触发设置！</h3>
  <button @click="openSetting">收藏夹</button>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    openSetting() {
      const extensionID = chrome.runtime.id;
      console.log(extensionID);
      window.open("chrome-extension://" + extensionID + "/bookmark.html", "_blank");
    },
  },
  created() {},
};
</script>

<style>
body {
  width: 300px;
  text-align: center;
  color: #000000;
}
</style>
