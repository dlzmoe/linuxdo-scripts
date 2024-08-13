<template>
  <div class="item">
    <div class="tit">
      当前版本：{{ version }}
      <el-link href="https://github.com/dlzmoe/linuxdo-scripts" target="_blank">
        Github 源码
      </el-link>
    </div>
  </div>
</template>

<script>
import packageJson from '../../package.json';  // 根据路径调整
export default {
  data() {
    return {
      version: packageJson.version,
    };
  },
  created() {
    
  },
};
</script>
