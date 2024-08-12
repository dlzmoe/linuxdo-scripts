<template>
  <div class="item">
    <div class="tit">
      当前版本：{{ devversion }}
      <el-link href="https://github.com/dlzmoe/linuxdo-scripts" target="_blank">
        Github 源码
      </el-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      devversion: "v0.1.15",
    };
  },
};
</script>
