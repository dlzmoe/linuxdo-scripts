<template>
  <div class="item">
    <div class="tit">{{ sort }}. 是否在楼主名字后显示楼主标识</div>
    <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)" />
  </div>
</template>

<script>
import $ from "jquery";
export default {
  props: ["modelValue", "sort"],
  emits: ["update:modelValue"],
  created() {
    if (this.modelValue) {
      // 添加楼主标识样式
      $("head").append(`<style>
/* 楼主标识基本样式 */
.topic-owner-badge {
  /* 基础布局属性 */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  /* 尺寸与间距 */
  min-width: 36px;
  height: 22px; /* 增加高度确保文字完整显示 */
  line-height: 20px; /* 确保文字垂直居中 */
  padding: 0px 8px;
  margin-left: 8px;
  vertical-align: middle;
  
  /* 文字样式 */
  color: rgba(255, 255, 255, 0.95);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.3px;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
  
  /* 背景样式 */
  background-color: var(--tertiary, #0088cc);
  background-image: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 50%,
    rgba(0, 0, 0, 0.05) 51%,
    rgba(0, 0, 0, 0.1) 100%
  );
  
  /* 边框与圆角 */
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  box-sizing: border-box;
  
  /* 阴影效果 */
  box-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  
  /* 动画过渡效果 */
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  /* 其他装饰性效果 */
  overflow: hidden;
  z-index: 1;
}

/* 鼠标悬停状态 */
.topic-owner-badge:hover {
  /* 悬停时稍微放大 */
  transform: translateY(-1px) scale(1.03);
  
  /* 增强阴影效果 */
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
  
  /* 调整文字颜色 */
  color: rgba(255, 255, 255, 1);
  
  /* 调整背景 */
  background-image: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0.08) 50%,
    rgba(0, 0, 0, 0.08) 51%,
    rgba(0, 0, 0, 0.15) 100%
  );
}

/* 添加伪元素装饰 */
.topic-owner-badge::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.12) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  z-index: -1;
}

/* 添加伪元素闪光效果 */
.topic-owner-badge::after {
  content: "";
  position: absolute;
  top: -50%;
  left: -100%;
  width: 40%;
  height: 200%;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: rotate(25deg);
  z-index: 2;
  opacity: 0;
  transition: all 1.2s ease-in-out;
}

/* 鼠标悬停时触发闪光动画 */
.topic-owner-badge:hover::after {
  left: 200%;
  opacity: 0.8;
}

/* 深色主题适配 */
@media (prefers-color-scheme: dark) {
  .topic-owner-badge {
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
    box-shadow: 
      0 1px 3px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
}

/* 在页面加载时添加淡入效果 */
@keyframes badgeFadeIn {
  from {
    opacity: 0;
    transform: translateY(2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 应用页面加载动画 */
.topic-post:not(.seen-owner-badge) .topic-owner-badge {
  animation: badgeFadeIn 0.3s ease-out forwards;
}

/* 标记已经显示过徽章的帖子 */
.topic-post.seen-owner-badge .topic-owner-badge {
  /* 已经展示过的徽章不重复动画 */
  animation: none;
}
}
</style>`);
      
      // 监听帖子内容变化并添加楼主标识
      let pollinglength = 0;
      setInterval(() => {
        if (pollinglength != $(".post-stream .topic-post").length) {
          pollinglength = $(".post-stream .topic-post").length;
          this.addTopicOwnerBadge();
        }
      }, 1000);
    }
  },
  methods: {
    addTopicOwnerBadge() {
      // 为每个楼主帖子添加楼主标识
      $(".post-stream .topic-post.topic-owner").each(function() {
        // 检查是否已经添加了楼主标识
        if ($(this).find(".topic-owner-badge").length < 1) {
          $(this).find(".names").append(`<span class="topic-owner-badge">楼主</span>`);
        }
      });
    }
  }
};
</script> 