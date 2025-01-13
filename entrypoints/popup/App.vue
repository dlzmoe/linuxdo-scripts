<template>
  <h2>欢迎使用 Linxudo Scripts 扩展！</h2>
  <h3>
    鼠标移动到浏览器最左侧后点击设置按钮，
    <a href="https://linuxdo-scripts-docs.zishu.me/" target="_blank">
      使用教程！
    </a>
  </h3>
  <div class="flex">
    <button @click="openBookmark">收藏夹</button>
    <!-- <button @click="openShare">分享话题</button> -->
    <button @click="goGithub">Github</button>
  </div>
</template>

<script>
export default {
  methods: {
    // 收藏夹
    openBookmark() {
      const browserAPI = typeof browser !== 'undefined' ? browser : chrome
      browserAPI.tabs.create({
        url: browserAPI.runtime.getURL('bookmark.html'),
      })
    },
    // 分享话题
    openShare() {
      const browserAPI = typeof browser !== 'undefined' ? browser : chrome
      browserAPI.tabs.create({
        url: browserAPI.runtime.getURL('share.html'),
      })
    },
    goGithub() {
      window.open('https://github.com/dlzmoe/linuxdo-scripts', '_blank')
    },
  },
}
</script>
