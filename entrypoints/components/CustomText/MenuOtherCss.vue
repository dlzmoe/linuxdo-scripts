<template>
  <div class="item">
    <div class="tit">
      {{ sort }}. 自定义 CSS（支持 import 引入第三方样式文件）
    </div>
  </div>
  <textarea v-model="textarea" @input="handleChange" placeholder="body{font-size:16px;}">
  </textarea>
</template>

<script>
import $ from "jquery";
export default {
  props: {
    value: {
      type: String,
      default: "",
    },
    sort: {
      type: Number,
      required: true,
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
      this.$emit("update:value", this.textarea);
    },
  },
  created() {
    if (this.textarea) {
      $("body").after(`<style>${this.textarea}</style>`);
    }
  },
};
</script>

<style lang="less" scoped>
.item {
  border: none !important;

  a:hover {
    text-decoration: underline;
  }
}
</style>
