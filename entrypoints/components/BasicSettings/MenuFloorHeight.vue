<template>
  <div class="item">
    <div class="tit">{{ sort }}. 智能限制楼层高度</div>
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
      $("head").append(`<style>
      .topic-body .cooked{max-height:600px!important;overflow-y:auto!important;}
      </style>`);
    }
  },
};
</script>
