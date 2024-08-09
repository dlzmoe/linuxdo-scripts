<template>
  <!-- 自定义快捷回复 -->
  <div class="item">
    <div class="tit">14. 自定义论坛 logo</div>
    <template>
      <el-input
        v-model="textarea"
        @input="handleChange"
        placeholder="输入图片链接"
      ></el-input>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      textarea: this.value,
    };
  },
  watch: {
    value(newValue) {
      this.textarea = newValue;
    },
  },
  methods: {
    handleChange() {
      this.$emit("input", this.textarea);
    },
    init() {
      $(".d-header .title a").html(`<img src="${this.textarea}">`);
    },
  },
  created() {
    if (this.textarea && this.textarea != "") {
      this.init();
    }
  },
};
</script>
<style scoped>
.el-input {
  margin-top: 10px;
}
</style>
