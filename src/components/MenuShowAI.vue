<template>
  <!-- 显示 AI 对话网站 -->
  <div class="item">
    <div class="tit">{{ sort }}. 快速打开 Shared（需提前解锁 Shared）</div>
    <template>
      <el-checkbox v-model="localChecked" @change="handleChange"></el-checkbox>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
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
<style scoped>
.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
