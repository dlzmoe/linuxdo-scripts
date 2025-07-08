<template>
  <div class="item">
    <div class="tit">{{ sort }}. 是否显示楼层数</div>
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
      showFloorsIntervalId: null // 添加变量存储定时器ID
    };
  },
  methods: {
    init() {
      $(".topic-post").each(function () {
        const num = $(this)
          .find("article")
          .attr("id")
          .replace(/^post_/, "");
        if ($(this).find(".linuxfloor").length < 1) {
          $(this).find(".post-infos").append(`<span class="linuxfloor">#${num}</span>`);
        }
      });
    },
  },
  created() {
    if (this.modelValue) {
      let pollinglength2 = 0;
      this.showFloorsIntervalId = setInterval(() => {
        if (pollinglength2 != $(".post-stream .topic-post").length) {
          pollinglength2 = $(".post-stream .topic-post").length;
          this.init();
        }
      }, 1000);
    }
  },
  beforeUnmount() {
    // 清除定时器
    if (this.showFloorsIntervalId) {
      clearInterval(this.showFloorsIntervalId);
    }
  },
  // Vue 2 兼容性
  beforeDestroy() {
    // 清除定时器
    if (this.showFloorsIntervalId) {
      clearInterval(this.showFloorsIntervalId);
    }
  },
  watch: {
    // 监听属性变化，动态处理定时器
    modelValue(newVal) {
      if (newVal) {
        // 如果已存在定时器先清除
        if (this.showFloorsIntervalId) {
          clearInterval(this.showFloorsIntervalId);
        }
        
        // 重新设置定时器
        let pollinglength2 = 0;
        this.showFloorsIntervalId = setInterval(() => {
          if (pollinglength2 != $(".post-stream .topic-post").length) {
            pollinglength2 = $(".post-stream .topic-post").length;
            this.init();
          }
        }, 1000);
      } else {
        // 关闭功能时清除定时器
        if (this.showFloorsIntervalId) {
          clearInterval(this.showFloorsIntervalId);
          this.showFloorsIntervalId = null;
        }
      }
    }
  }
};
</script>
