<template>
  <div class="item">
    <div class="tit">{{ sort }}. 是否隐藏输入框提示文字</div>
    <input
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
  </div>
</template>

<script>
import $ from "jquery";
export default {
  props: ["modelValue", "sort"],
  emits: ["update:modelValue"],
  created() {
    if (this.modelValue) {
      $("head").append(`<style>
      .d-editor-input::placeholder{opacity:0;}
      </style>`);
    }
  },
};
</script>
