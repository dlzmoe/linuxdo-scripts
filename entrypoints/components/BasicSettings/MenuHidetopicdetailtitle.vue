<template>
  <div class="item">
    <div class="tit">{{ sort }}. 隐藏话题详情顶部大标题</div>
    <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)" />
  </div>
</template>

<script>
import $ from "jquery";
export default {
  props: ["modelValue", "sort"],
  emits: ["update:modelValue"],
  created() {
    if (this.modelValue) {
      $("head").append(`<style>.header-title{display:none!important}</style>`);
    }
  },
};
</script>
