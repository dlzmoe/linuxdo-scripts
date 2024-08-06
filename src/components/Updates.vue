<template>
  <div class="item">
    <div class="tit">
      当前版本：{{ devversion }}

      <el-link
        type="danger"
        href="https://github.com/dlzmoe/linuxdo-scripts/releases"
        target="_blank"
        v-show="show"
      >
        有新版本
      </el-link>
      <el-link v-show="show1">无新版本</el-link>
      <span class="start" @click="checkupload" v-loading="loading" v-show="btn">
        点击检测
      </span>
      <a href="https://github.com/dlzmoe/linuxdo-scripts" target="_blank">Github 源码</a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      show: false,
      show1: false,
      btn: true,
      version: "",
      devversion: "v0.1.3",
    };
  },
  methods: {
    checkupload() {
      this.loading = true;
      fetch("https://api.github.com/repos/dlzmoe/linuxdo-scripts/releases")
        .then((response) => response.json())
        .then((data) => {
          this.version = data[0].name;
          if (this.version !== this.devversion) {
            this.show = true;
            this.btn = false;
          } else {
            this.show1 = true;
            this.btn = false;
          }
        });
      this.loading = false;
    },
  },
};
</script>

<style scoped>
.start {
  cursor: pointer;
  color: #38a321;
}
</style>
