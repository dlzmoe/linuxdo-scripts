<template>
  <div class="item">
    <div class="tit">{{ sort }}. 是否自动隐藏"福利羊毛"中已领完的帖子</div>
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
      hideWelfareDoneIntervalId: null // 添加变量存储定时器ID
    };
  },
  methods: {
    init() {
      const keywords = ["领完", "已无", "已出", "已送", "完结", "已开奖", "已领取完", "已关闭", "已用完", "已领光", "已结束", "已领奖", "抽完了", "已毕", "已完成"];

      // 首先检查分类名称是否为"福利羊毛"
      $(".topic-list tr.topic-list-item").each((index, row) => {
        const categoryName = $(row).find('.badge-category__wrapper .badge-category__name').text().trim();

        if (categoryName.includes("福利羊毛")) {
          const topicTitle = $(row).find('.main-link .raw-topic-link').text();

          // 如果标题包含关键词则移除该行
          if (keywords.some(keyword => topicTitle.includes(keyword))) {
            $(row).remove();
          }
        }
      });
    }
  },
  created() {
    if (this.modelValue) {
      this.hideWelfareDoneIntervalId = setInterval(() => {
        this.init();
      }, 1000);
    }
  },
  beforeUnmount() {
    // 清除定时器
    if (this.hideWelfareDoneIntervalId) {
      clearInterval(this.hideWelfareDoneIntervalId);
    }
  },
  // Vue 2 兼容性
  beforeDestroy() {
    // 清除定时器
    if (this.hideWelfareDoneIntervalId) {
      clearInterval(this.hideWelfareDoneIntervalId);
    }
  }
};
</script>
