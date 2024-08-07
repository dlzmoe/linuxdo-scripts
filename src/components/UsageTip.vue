<template>
  <dialog open class="UsageTip" v-if="open">
    <div class="title">友情提示</div>
    <div>佬友你好，你已经成功安装 linuxdo 增强插件啦！</div>
    <div>设置按钮在左下角切换主题的旁边哦~有个小齿轮，点击它开始配置功能！！</div>
    <br />
    <el-button type="info" @click="hide">点击我，该提示永远不会出现啦</el-button>
  </dialog>
</template>

<script>
export default {
  data() {
    return {
      open: true,
    };
  },
  methods: {
    hide() {
      this.open = false;
      localStorage.setItem("isShowplugininstallationprompts", true);
    },
  },
  created() {
    const isShowplugininstallationprompts = localStorage.getItem(
      "isShowplugininstallationprompts"
    );
    if (isShowplugininstallationprompts) {
      this.open = false;
    }
  },
};
</script>

<style lang="less" scoped>
.UsageTip {
  z-index: 9999;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  line-height: 2;
}
</style>
