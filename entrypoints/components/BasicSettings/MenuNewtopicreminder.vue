<template>
  <div class="item">
    <div class="tit">{{ sort }}. 是否开启新话题提醒</div>
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
      newTopicReminderIntervalId: null // 添加变量存储定时器ID
    };
  },
  methods: {
    init() {
      if ($("#list-area .show-more").length > 0) {
        $("head title").html("【有新话题赶紧来水！！】");
      }
    },
  },
  created() {
    if (this.modelValue) {
      this.newTopicReminderIntervalId = setInterval(() => {
        this.init();
      }, 1000);
    }
  },
  beforeUnmount() {
    // 清除定时器
    if (this.newTopicReminderIntervalId) {
      clearInterval(this.newTopicReminderIntervalId);
    }
  },
  // Vue 2 兼容性
  beforeDestroy() {
    // 清除定时器
    if (this.newTopicReminderIntervalId) {
      clearInterval(this.newTopicReminderIntervalId);
    }
  }
};
</script>
