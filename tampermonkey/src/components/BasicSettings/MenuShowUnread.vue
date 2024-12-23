<template>
  <div class="item">
    <div class="tit">{{ sort }}. 消息通知仅显示未读</div>
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
     .user-menu-dropdown-wrapper .notification.read{display:none!important;}
     .user-menu-dropdown-wrapper .notification.unread{display:list-item!important;}
     </style>`);
    }
  },
};
</script>
