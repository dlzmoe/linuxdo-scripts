<template>
  <div class="item">
    <div class="tit">{{ sort }}. 是否新标签页打开话题</div>
    <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)" />
  </div>
</template>

<script>
export default {
  props: ["modelValue", "sort"],
  emits: ["update:modelValue"],
  created() {
    if (this.modelValue) {

      // 处理链接点击
      function handleLinkClick(e) {
        e.preventDefault();
        e.stopPropagation(); // 阻止事件冒泡
        window.open(this.href, '_blank', 'noopener,noreferrer');
      }

      // 主要功能
      function processLinks() {
        // 查找所有帖子标题链接
        const links = document.querySelectorAll('.link-top-line a.title:not([data-processed])');

        links.forEach(link => {
          // 标记该链接已处理
          link.setAttribute('data-processed', 'true');
          // 添加事件监听器
          link.addEventListener('click', handleLinkClick);
        });
      }

      // 监听 DOM 变化，处理动态加载的内容
      const observer = new MutationObserver((mutations) => {
        const hasNewLinks = mutations.some(mutation => {
          return Array.from(mutation.addedNodes).some(node => {
            return node.nodeType === 1 && (
              node.classList.contains('link-top-line') ||
              node.querySelector('.link-top-line')
            );
          });
        });

        if (hasNewLinks) {
          processLinks();
        }
      });

      // 开始观察
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      // 初始处理
      processLinks();

    }
  },

};
</script>
