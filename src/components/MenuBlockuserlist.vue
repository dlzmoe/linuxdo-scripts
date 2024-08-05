<template>
  <!-- 屏蔽指定用户 -->
  <div class="item">
    <div class="tit">9. 屏蔽指定用户（使用英文,分隔）</div>
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
