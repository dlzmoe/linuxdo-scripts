<template>
  <!-- 是否显示自动阅读按钮 -->
  <div class="item">
    <div class="tit">
      {{ sort }}. 是否显示自动阅读按钮，可调节速度默认 10
      <input v-model="localChecked.value2" placeholder="默认速度 10" />
    </div>
    <input type="checkbox" v-model="localChecked.value1" @change="handleChange">
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: {
        value1: false,
        value2: 10,
      }
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
      this.$emit("update:value", this.localChecked);
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
