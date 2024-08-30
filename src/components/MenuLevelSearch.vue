<template>
  <!-- 是否显示等级查询按钮 -->
  <div class="item">
    <div class="tit">{{ sort }}. 是否显示等级查询按钮</div>
    <input type="checkbox" v-model="localChecked" @change="handleChange">
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
      this.$emit("update:value", this.localChecked);
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
