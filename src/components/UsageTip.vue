<template>
  <dialog open class="UsageTip">
    <div class="title">友情提示</div>
    <br />
    <div>佬友你好，你已经成功安装 linuxdo 增强插件啦！</div>
    <div style="text-decoration: underline">
      设置按钮在左下角切换主题的旁边哦~ 有个小齿轮，点击它开始配置功能！！
    </div>
    <div>如果可以的话欢迎点个 star 支持一下~ </div>
    <div>
      <a href="https://github.com/dlzmoe/linuxdo-scripts/" target="_blank">
        <img src="https://img.shields.io/github/stars/dlzmoe%2Flinuxdo-scripts?style=for-the-badge&labelColor=%235D5D5D&color=%23E97435" alt="icon">
      </a>
    </div>
    <br />
    <el-button type="info" class="clicktohide">
      点击我，该提示永远不会出现啦
      <span v-if="countdownVisible">（{{ countdown }}秒）</span>
    </el-button>
  </dialog>
</template>

<script>
export default {
  data() {
    return {
      countdown: 5,
      countdownInterval: null,
      countdownVisible: false,
    };
  },
  methods: {
    startCountdown() {
      this.countdownVisible = true; // 显示倒计时
      this.countdown = 5; // 重置倒计时
      this.countdownInterval = setInterval(() => {
        this.countdown--;
        if (this.countdown < 0) {
          clearInterval(this.countdownInterval);
          this.countdownVisible = false; // 隐藏倒计时
          this.hide(); // 倒计时结束后调用hide方法
        }
      }, 1000);
    },
    hide() {
      $(".clicktohide").click(function () {
        $(".UsageTip").hide();
        localStorage.setItem("isShowplugininstallationprompts", true);
        $(".linuxdoscripts-opacity").hide();
      });
    },
  },
  beforeDestroy() {
    // 清理定时器
    clearInterval(this.countdownInterval);
  },
  created() {
    setTimeout(() => {
      const isShowplugininstallationprompts = localStorage.getItem(
        "isShowplugininstallationprompts"
      );
      if (isShowplugininstallationprompts == "true") {
        $(".UsageTip").hide();
      } else {
        $(".UsageTip").show();
        $(".linuxdoscripts-opacity").show();
        this.startCountdown(); // 开始倒计时
      }
    }, 100);
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
  display: none;
}
</style>
