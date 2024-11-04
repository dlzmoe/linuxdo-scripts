<template>
  <div class="item">
    <div class="tit">{{ sort }}. 是否移除话题列表上的头像 (减少网络请求)</div>
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
        .topic-list-data.posters,
        .topic-list-avatar.pull-left{display:none!important}
        
        .topic-list-content.right{margin-left:0!important}
      </style>`);
    }
  },
};
</script>
