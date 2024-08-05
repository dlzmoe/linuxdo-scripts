<template>
  <!-- 自定义快捷回复 -->
  <div class="item">
    <div class="tit">8. 自定义快捷回复（换行分隔）</div>
    <template>
      <textarea v-model="localChecked" @input="handleChange"></textarea>
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
