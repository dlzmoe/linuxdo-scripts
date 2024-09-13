<template>
  <div>
    <div
      class="el-button"
      style="font-size: 18px"
      @click="openai"
      type="primary"
      title="AI对话"
    >
      AI
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    openai() {
      window.open("https://shared.oaifree.com/?temporary-chat=true", "_blank");
    },
  },
};
</script>
<style lang="less">
.linuxdoscripts-aidialog {
  position: fixed;
  top: 0;
  left: -100%;
  width: 500px;
  height: 100vh;
  background: #fff;
  box-shadow: 1px 2px 5px #0000003d;
  z-index: 999;
  padding-top: 60px;
  transition: all 0.1s linear;
  opacity: 0;
  visibility: hidden;
  overflow: hidden;

  &.act {
    left: 0;
    opacity: 1;
    visibility: inherit;
    overflow: inherit;
  }
}
</style>
