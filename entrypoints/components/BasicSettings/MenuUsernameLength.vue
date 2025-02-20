<template>
  <div class="item">
    <div class="tit">{{ sort }}. 是否美化过长的昵称</div>
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
     .names>span a,.topic-body .reply-to-tab span{max-width:200px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}
     </style>`);
    }
  },
};
</script>
