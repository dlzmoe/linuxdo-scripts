<template>
  <div class="item">
    <div class="tit">{{ sort }}. 是否在楼主名字后显示楼主标识</div>
    <input
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
  </div>
</template>

<script>
import $ from "jquery";
export default {
  props: ["modelValue", "sort"],
  emits: ["update:modelValue"],
  data() {
    return {
      ownerBadgeIntervalId: null // 添加变量存储定时器ID
    };
  },
  methods: {
    addTopicOwnerBadge() {
      // 为每个楼主帖子添加楼主标识
      $(".post-stream .topic-post.topic-owner").each(function () {
        // 检查是否已经添加了楼主标识
        if ($(this).find(".topic-owner-badge").length < 1) {
          $(this).find(".names").append(`<span class="topic-owner-badge">楼主</span>`);
        }
      });
    },
    // 初始化楼主标识功能
    initOwnerBadge() {
      // 添加楼主标识样式
      $("head").append(`<style>
.topic-owner-badge{display:inline-flex;align-items:center;justify-content:center;position:relative;min-width:36px;height:22px;line-height:20px;padding:0 8px;margin-left:8px;vertical-align:middle;color:rgba(255,255,255,.95);font-size:14px!important;font-weight:600;letter-spacing:.3px;text-shadow:0 1px 1px rgba(0,0,0,.15);background-color:var(--tertiary,#08c);background-image:linear-gradient(135deg,rgba(255,255,255,.1) 0,rgba(255,255,255,.05) 50%,rgba(0,0,0,.05) 51%,rgba(0,0,0,.1) 100%);border-radius:3px;border:1px solid rgba(0,0,0,.12);box-sizing:border-box;box-shadow:0 1px 2px rgba(0,0,0,.08),inset 0 1px 0 rgba(255,255,255,.15);transition:all .2s cubic-bezier(.25,.46,.45,.94);overflow:hidden;z-index:1}
.topic-owner-badge:hover{transform:translateY(-1px) scale(1.03);box-shadow:0 2px 4px rgba(0,0,0,.12),inset 0 1px 0 rgba(255,255,255,.25);color:#fff;background-image:linear-gradient(135deg,rgba(255,255,255,.15) 0,rgba(255,255,255,.08) 50%,rgba(0,0,0,.08) 51%,rgba(0,0,0,.15) 100%)}
.topic-owner-badge::before{content:"";position:absolute;top:0;left:0;width:100%;height:50%;background:linear-gradient(to bottom,rgba(255,255,255,.12) 0,rgba(255,255,255,0) 100%);z-index:-1}
.topic-owner-badge::after{content:"";position:absolute;top:-50%;left:-100%;width:40%;height:200%;background:linear-gradient(to right,rgba(255,255,255,0) 0,rgba(255,255,255,.3) 50%,rgba(255,255,255,0) 100%);transform:rotate(25deg);z-index:2;opacity:0;transition:all 1.2s ease-in-out}
.topic-owner-badge:hover::after{left:200%;opacity:.8}
@media (prefers-color-scheme:dark){.topic-owner-badge{text-shadow:0 1px 2px rgba(0,0,0,.25);box-shadow:0 1px 3px rgba(0,0,0,.15),inset 0 1px 0 rgba(255,255,255,.1)}
}
@keyframes badgeFadeIn{from{opacity:0;transform:translateY(2px)}
to{opacity:1;transform:translateY(0)}
}
.topic-post:not(.seen-owner-badge) .topic-owner-badge{animation:badgeFadeIn .3s ease-out forwards}
.topic-post.seen-owner-badge .topic-owner-badge{animation:none}

</style>`);

      // 监听帖子内容变化并添加楼主标识
      this.ownerBadgeIntervalId = setInterval(() => {
        this.addTopicOwnerBadge();
      }, 1000);
    },
    // 清除定时器
    clearOwnerBadgeInterval() {
      if (this.ownerBadgeIntervalId) {
        clearInterval(this.ownerBadgeIntervalId);
        this.ownerBadgeIntervalId = null;
      }
    }
  },
  created() {
    if (this.modelValue) {
      this.initOwnerBadge();
    }
  },
  beforeUnmount() {
    // 清除定时器
    this.clearOwnerBadgeInterval();
  },
  // Vue 2 兼容性
  beforeDestroy() {
    // 清除定时器
    this.clearOwnerBadgeInterval();
  },
  watch: {
    // 监听属性变化，动态处理定时器
    modelValue(newVal) {
      if (newVal) {
        this.initOwnerBadge();
      } else {
        this.clearOwnerBadgeInterval();
      }
    }
  }
};
</script>
