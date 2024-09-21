<template>
  <dialog id="floorlotteryDialog">
    <div class="menu-header">
      <div class="title">楼层抽奖</div>
    </div>
    <div class="menu-body" style="margin-top: 10px">
      <div class="inner">
        <label>总楼层数：</label>
        <input type="text" v-model="floorlotteryval1" />
      </div>
      <div class="inner">
        <label>抽奖数量：</label>
        <input type="text" v-model="floorlotteryval2" />
      </div>
      <button class="btn save" @click="drawRandomNumbers">开始抽奖</button>
      <button class="btn" style="background: #979797" plain @click="closelotter">
        关闭弹窗
      </button>
      <div style="height: 20px"></div>
      <div v-if="floorlotterloading">正在抽奖...</div>
      <div v-if="floorlotterresult" title="抽奖结果" type="success">
        抽奖结果：恭喜 {{ floorlotterresult }} 楼中奖！
      </div>
    </div>
  </dialog>
</template>

<script>
export default {
  data() {
    return {
      floorlotteryval1: "",
      floorlotteryval2: "",
      floorlotterloading: false,
      floorlotterresult: "",
    };
  },
  methods: {
    // 开始抽奖
    drawRandomNumbers() {
      if (this.floorlotteryval1 === "" || this.floorlotteryval2 === "") {
        this.messageToast("请输入有效的数字");
        return false;
      }

      const total = parseInt(this.floorlotteryval1);
      const count = parseInt(this.floorlotteryval2);

      if (isNaN(total) || isNaN(count) || total <= 0 || count <= 0 || count > total) {
        this.messageToast("请输入有效的数字");
        return false;
      }

      this.floorlotterloading = true;
      this.floorlotterresult = "";

      setTimeout(() => {
        const result = this.getRandomNumbers(total, count);
        this.floorlotterresult = result.join(", ");
        this.floorlotterloading = false;
      }, 1000); // 模拟异步操作
    },
    getRandomNumbers(total, count) {
      const numbers = Array.from({ length: total }, (_, i) => i + 1);
      const result = [];

      for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * numbers.length);
        result.push(numbers[randomIndex]);
        numbers.splice(randomIndex, 1);
      }

      return result;
    },
    closelotter() {
      $("#floorlotteryDialog").hide();
      $(".linuxdoscripts-opacity").hide();
    },
  },
};
</script>
<style lang="less" scoped>
.menu-body {
  padding: 0 15px;
}
.inner {
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  label {
    width: 70px;
    font-weight: 400;
  }

  input {
    flex: 1;
    margin: 0;
    max-width: 300px;
  }
}
</style>
