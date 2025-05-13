<template>
  <div class="item">
    <div class="tit">{{ sort }}. 话题始终打开1楼</div>
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
      processingUrl: false,
      originalUrl: null,
      intervalId: null,
    };
  },
  created() {
    if (this.modelValue) {
      this.$nextTick(() => {
        this.originalUrl = window.location.href;
        
        // 处理当前URL
        this.redirectToFirstPost();
        
        // 开始链接监控
        this.startLinkMonitoring();
        
        // 监听浏览器前进后退
        window.addEventListener('popstate', this.handlePopState);
      });
    }
  },
  methods: {
    /**
     * 开始监控页面上的所有链接
     */
    startLinkMonitoring() {
      // 清除可能已有的监控
      this.stopLinkMonitoring();
      
      // 立即处理一次
      this.modifyTopicLinks();
      
      // 设置定时监控，处理动态加载的内容
      this.intervalId = setInterval(() => {
        this.modifyTopicLinks();
      }, 1000);
    },
    
    /**
     * 停止链接监控
     */
    stopLinkMonitoring() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    },
    
    /**
     * 修改页面上所有带楼层参数的链接
     */
    modifyTopicLinks() {
      // 处理所有站内链接
      $("a").each((_, element) => {
        const $el = $(element);
        const href = $el.attr("href");
        
        if (!href) return;
        
        // 匹配带楼层参数的话题链接
        const pattern = /\/t\/topic\/(\d+)\/\d+/;
        const match = href.match(pattern);
        
        if (match) {
          // 找到话题ID
          const topicId = match[1];
          
          // 构建不带楼层参数的URL
          if (href.startsWith('http')) {
            // 完整URL
            const urlObj = new URL(href);
            const baseUrl = `${urlObj.protocol}//${urlObj.host}`;
            const newUrl = `${baseUrl}/t/topic/${topicId}/`;
            $el.attr("href", newUrl);
          } else {
            // 相对URL
            const newUrl = `/t/topic/${topicId}/`;
            $el.attr("href", newUrl);
          }
        }
      });
    },
    
    /**
     * 处理popstate事件（浏览器前进/后退按钮）
     */
    handlePopState() {
      if (!this.processingUrl) {
        this.redirectToFirstPost();
      }
    },
    
    /**
     * 修改当前页面URL，移除楼层参数
     */
    redirectToFirstPost() {
      // 防止处理循环
      if (this.processingUrl) return;
      this.processingUrl = true;
      
      try {
        // 检查当前URL是否是帖子页面，并且包含楼层参数
        const currentUrl = window.location.href;
        const topicRegex = /\/t\/topic\/(\d+)\/(\d+)/;
        const match = currentUrl.match(topicRegex);
        
        if (match) {
          const topicId = match[1];
          
          // 构建指向1楼的URL
          const baseUrl = window.location.origin;
          const pathWithoutFloor = `/t/topic/${topicId}/`;
          const newUrl = `${baseUrl}${pathWithoutFloor}`;
          
          // 只在URL不同时才执行替换
          if (currentUrl !== newUrl) {
            // 使用replaceState修改URL，不刷新页面
            window.history.replaceState(
              history.state, 
              document.title, 
              pathWithoutFloor
            );
          }
        }
      } finally {
        // 释放处理锁
        setTimeout(() => {
          this.processingUrl = false;
        }, 100);
      }
    }
  },
  beforeUnmount() {
    // 清理资源
    this.stopLinkMonitoring();
    window.removeEventListener('popstate', this.handlePopState);
  },
  watch: {
    modelValue(newVal) {
      if (newVal) {
        this.redirectToFirstPost();
        this.startLinkMonitoring();
        window.addEventListener('popstate', this.handlePopState);
      } else {
        this.stopLinkMonitoring();
        window.removeEventListener('popstate', this.handlePopState);
      }
    }
  }
};
</script> 