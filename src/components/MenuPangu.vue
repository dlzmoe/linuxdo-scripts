<template>
  <!-- 中英文混排优化显示 -->
  <div class="item">
    <div class="tit">{{ sort }}. 是否开启中英文混排优化显示</div>
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
      type: String,
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
  created() {
    if (this.localChecked) {
      let script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/pangu@4.0.7/dist/browser/pangu.min.js";
      document.body.appendChild(script);
      setInterval(() => {
        pangu.spacingElementByTagName("p");
        document.addEventListener("DOMContentLoaded", () => {
          pangu.autoSpacingPage();
        });
      }, 1000);
    }
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
