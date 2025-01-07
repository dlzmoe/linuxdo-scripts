<template>
  <div style="margin: 10px 0">手动导入导出数据：</div>
  <ManualBackup />
</template>

<script>
import $ from "jquery";
import ManualBackup from "./ManualBackup.vue";

export default {
  components: {
    ManualBackup,
  },
  data() {
    return {};
  },
};
</script>