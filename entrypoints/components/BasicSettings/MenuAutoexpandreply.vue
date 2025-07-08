<template>
  <div class="item">
    <div class="tit">{{ sort }}. 是否自动展开回复</div>
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
      autoExpandIntervalId: null // 添加变量存储定时器ID
    };
  },
  methods: {
    init() {
      $("nav.post-controls .show-replies").each(function () {
        $(this).click();
      });
    },
  },
  created() {
    if (this.modelValue) {
      let pollinglength2 = 0;
      this.autoExpandIntervalId = setInterval(() => {
        if (pollinglength2 != $(".post-stream .topic-post").length) {
          pollinglength2 = $(".post-stream .topic-post").length;
          this.init();
        }
      }, 1000);
    }
  },
  beforeUnmount() {
    // 清除定时器
    if (this.autoExpandIntervalId) {
      clearInterval(this.autoExpandIntervalId);
    }
  },
  // Vue 2 兼容性
  beforeDestroy() {
    // 清除定时器
    if (this.autoExpandIntervalId) {
      clearInterval(this.autoExpandIntervalId);
    }
  }
};
</script>
