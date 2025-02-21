<template>
  <div class="item">
    <div class="tit">{{ sort }}. 是否开启超长显示器宽度优化</div>
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
body.has-sidebar-page .wrap{max-width:90vw !important}
body.has-sidebar-page .wrap .topic-body{flex:1}
body.has-sidebar-page .wrap .container.posts{grid-template-columns:auto 200px}
body.has-sidebar-page .wrap .container.posts .topic-area{max-width:1300px;margin-inline:auto}
      </style>`);
    }
  },
};
</script>
