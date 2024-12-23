<template>
  <div class="item">
    <div class="tit">{{ sort }}. 是否隐藏首页 banner 区域</div>
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
      .search-banner{display:none!important;}
      #main-outlet{padding-top:1.5em!important;}
      </style>`);
    }
  },
};
</script>
