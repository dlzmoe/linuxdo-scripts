<template>
  <!-- 是否显示自动阅读按钮 -->
  <div class="item">
    <div class="tit">
      {{ sort }}. 是否显示自动阅读按钮，可调节速度默认 10
      <input v-model="localChecked.value2" placeholder="默认速度 10" />
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
    sort: {
      type: Number,
      required: true,
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

    input {
      margin-left: 20px;
      width: 90px;
      height: 20px !important;
      outline: none;
      border: 1px solid #7f7f7f;
      border-radius: 3px;
    }
  }
}
</style>
