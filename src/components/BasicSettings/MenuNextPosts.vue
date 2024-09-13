<template>
  <div class="item">
    <div class="tit">{{ sort }}. 开启快速打开下一个帖子（快捷键：双击 <kbd>→</kbd>）</div>
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
  methods: {
    messageToast(message) {
      const messageElement = $(`<div class="messageToast-text">${message}</div>`);
      $("#messageToast").append(messageElement);
      setTimeout(() => {
        messageElement.remove();
      }, 3000);
    },
    async init() {
      const id = $(".post-stream .topic-post:last-child")
        .find("article")
        .attr("data-topic-id");

      let currentId = parseInt(id) + 1;
      const maxAttempts = 10;

      const checkPageExists = async (idToCheck) => {
        const newUrl = `/t/topic/${idToCheck}`;
        try {
          const response = await fetch(newUrl);
          if (response.ok) {
            this.messageToast("正在跳转下一个帖子！");
            window.location.href = newUrl;
            return true;
          } else {
            return false;
          }
        } catch (error) {
          console.error("请求出错：", error);
          this.messageToast("请求出错，请稍后再试。");
          return false;
        }
      };

      for (let attempts = 0; attempts < maxAttempts; attempts++) {
        const exists = await checkPageExists(currentId);
        if (exists) {
          break;
        }
        currentId++;
      }
      if (currentId === parseInt(id) + 1 + maxAttempts) {
        this.messageToast("已是最新帖子！");
      }
    },
  },
  created() {
    if (this.modelValue) {
      let lastKeyTime = 0; // 上一次按键的时间
      const doubleClickTime = 300; // 双击的时间间隔（毫秒）

      document.addEventListener("keydown", (event) => {
        // 检查是否按下右箭头键
        if (event.key === "ArrowRight") {
          const currentTime = Date.now();

          // 检查时间间隔
          if (currentTime - lastKeyTime <= doubleClickTime) {
            this.init();
          }

          // 更新上一次按键的时间
          lastKeyTime = currentTime;
        }
      });
    }
  },
};
</script>
