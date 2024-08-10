<template>
  <!-- 是否显示等级查询按钮 -->
  <div class="item">
    <div class="tit">16. 是否显示等级查询按钮</div>
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
