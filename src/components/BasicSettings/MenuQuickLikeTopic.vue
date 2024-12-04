<template>
    <div class="item">
      <div class="tit">{{ sort }}. 是否开启快捷给主题点赞(快捷键: <kbd>Q</kbd>)</div>
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
      window.addEventListener('keydown', this.handleKeyDown);
    }
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  },
  methods: {
    handleKeyDown(event) {
      if (event.key === 'q') {
        // 构建父元素的选择器
        const parentSelector = `post_1`;

        // 查找该 div 下第一个符合条件的按钮并点击
        const button = document.getElementById(parentSelector).getElementsByClassName("btn-toggle-reaction-like")[0]
        if (button) {
            button.click();
        } else {
            console.log("按钮未找到");
        }

      }
    }
  }
};
</script>