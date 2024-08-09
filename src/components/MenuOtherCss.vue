<template>
  <!-- 自定义 CSS -->
  <div class="item">
    <div class="tit">13. 自定义 CSS（支持 import 引入第三方样式文件）</div>
    <template>
      <textarea
        v-model="textarea"
        @input="handleChange"
        placeholder="body{font-size:16px;}"
      ></textarea>
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
  },
  created() {
    if (this.textarea) {
      $('body').prepend(`<style>${this.textarea}</style>`);
    }
  },
};
</script>
