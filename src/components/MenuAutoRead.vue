<template>
  <!-- 是否显示自动阅读按钮 -->
  <div class="item">
    <div class="tit">
      8. 是否显示自动阅读按钮，可调节速度默认 10
      <el-input v-model="localChecked.value2"></el-input>
    </div>
    <template>
      <el-checkbox v-model="localChecked.value1" @change="handleChange"></el-checkbox>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
    },
  },
  data() {
    return {
      localChecked: this.value,
    };
  },
  watch: {
    value(newValue) {
      this.localChecked = newValue;
    },
  },
  methods: {
    handleChange() {
      this.$emit("input", this.localChecked);
    },
  },
};
</script>
<style scoped lang="less">
.item {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .tit {
    display: inline-flex;
    align-items: center;
    white-space: nowrap;

    .el-input {
      margin-left: 10px;
      width: 70px;

      input {
        height: 30px !important;
      }
    }
  }
}
</style>
