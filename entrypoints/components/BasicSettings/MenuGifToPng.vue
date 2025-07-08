<template>
  <div class="item">
    <div class="tit">{{ sort }}. gif 头像转静态图片（不喜花里胡哨的佬友可以开启）</div>
    <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)" />
  </div>
</template>

<script>
import $ from "jquery";
export default {
  props: ["modelValue", "sort"],
  emits: ["update:modelValue"],
  data() {
    return {
      gifToPngIntervalId: null // 添加变量存储定时器ID
    };
  },
  created() {
    if (this.modelValue) {
      this.gifToPngIntervalId = setInterval(() => {
        $(".post-avatar .avatar").each(function () {
          const currentSrc = $(this).attr("src");
          if (currentSrc.endsWith(".gif")) {
            $(this).attr("src", currentSrc.replace(".gif", ".png"));
          }
        });
      }, 1000);
    }
  },
  beforeUnmount() {
    // 清除定时器
    if (this.gifToPngIntervalId) {
      clearInterval(this.gifToPngIntervalId);
    }
  },
  // Vue 2 兼容性
  beforeDestroy() {
    // 清除定时器
    if (this.gifToPngIntervalId) {
      clearInterval(this.gifToPngIntervalId);
    }
  }
};
</script>
