<template>
  <h2>欢迎使用 Linxudo Scripts 扩展！</h2>
  <h3>
    鼠标移动到浏览器最左侧后点击设置按钮，<a
      href="https://linuxdo-scripts-docs.zishu.me/"
      target="_blank"
      >使用教程！</a
    >
  </h3>
  <div class="flex">
    <button @click="openSetting">收藏夹</button>
    <button @click="goGithub">Github</button>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    openSetting() {
      const browserAPI = typeof browser !== 'undefined' ? browser : chrome
      browserAPI.tabs.create({
        url: browserAPI.runtime.getURL('bookmark.html'),
      })
    },
    goGithub() {
      window.open('https://github.com/dlzmoe/linuxdo-scripts', '_blank')
    },
  },
}
</script>

<style lang="less">
body {
  min-width: 360px;
  padding: 0 10px;
  text-align: center;
  color: #000000;
  padding-bottom: 20px;
}
.flex {
  display: flex;
  align-items: center;
  justify-content: center;
}
a {
  color: inherit;
  text-decoration: underline;
}
button {
  margin: 5px;
  cursor: pointer;
  outline: none;
  border: none;
  background: #333;
  color: #fff;
  min-width: 60px;
  height: 34px;
  padding: 0 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  transition: all 0.1s linear;
  &:hover {
    background: #222;
  }
}
</style>
