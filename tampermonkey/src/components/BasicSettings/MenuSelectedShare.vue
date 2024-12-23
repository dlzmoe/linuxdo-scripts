<template>
  <div class="item">
    <div class="tit">{{ sort }}. 禁用选中文字分享功能</div>
    <input
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
  </div>
</template>

<script>
export default {
  props: ["modelValue", "sort"],
  emits: ["update:modelValue"],
  created() {
    if (this.modelValue) {
      $("head").append(`<style>
       .quote-button .quote-sharing{display:none!important}
      </style>`);
    }
  },
};
</script>
