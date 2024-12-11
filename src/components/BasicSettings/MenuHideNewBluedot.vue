<template>
  <div class="item">
    <div class="tit">{{ sort }}. 隐藏新消息小蓝点（除帖子未读小蓝点）</div>
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
      .sidebar-section-link-suffix.icon.unread,
      .topic-post-badges{display:none !important}
      </style>`);
    }
  },
};
</script>
