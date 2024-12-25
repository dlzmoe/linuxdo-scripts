<template>
  <div class="item">
    <div class="tit">{{ sort }}. 是否开启快捷给主题点赞 (快捷键：<kbd>Q</kbd>)</div>
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
      isFocusedOnInput: false, // 标记当前是否聚焦在输入框上
    };
  },
  created() {
    if (this.modelValue) {
      window.addEventListener("keydown", this.handleKeyDown);
      window.addEventListener("focus", this.handleFocus, true); // 捕获阶段，监听输入框聚焦
      window.addEventListener("blur", this.handleBlur, true); // 捕获阶段，监听输入框失焦
    }
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("focus", this.handleFocus, true);
    window.removeEventListener("blur", this.handleBlur, true);
  },
  watch: {
    modelValue(newValue) {
      if (newValue) {
        window.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener("focus", this.handleFocus, true);
        window.addEventListener("blur", this.handleBlur, true);
      } else {
        window.removeEventListener("keydown", this.handleKeyDown);
        window.removeEventListener("focus", this.handleFocus, true);
        window.removeEventListener("blur", this.handleBlur, true);
      }
    },
  },
  methods: {
    // 提示组件
    messageToast(message) {
      const messageElement = document.createElement("div");
      messageElement.className = "messageToast-text";
      messageElement.innerText = message;
      document.getElementById("messageToast").appendChild(messageElement);
      setTimeout(() => {
        messageElement.remove();
      }, 3000);
    },
    handleKeyDown(event) {
      if (this.isFocusedOnInput) return; // 聚焦输入框时不触发

      if (event.key === "q") {
        // 处理大小写
        const parentSelector = "#post_1"; // 静态的 postId
        const button = document.querySelector(
          `${parentSelector} .btn-toggle-reaction-like[title="点赞此帖子"]`
        );
        if (button) {
          button.click();
          this.messageToast("已点赞！");
        } else {
          console.log("按钮未找到");
        }
      }
    },
    handleFocus(event) {
      if (
        event.target.tagName === "input" ||
        event.target.tagName === "textarea"
      ) {
        this.isFocusedOnInput = true; // 当聚焦在输入框时
      }
    },
    handleBlur(event) {
      if (
        event.target.tagName === "input" ||
        event.target.tagName === "textarea"
      ) {
        this.isFocusedOnInput = false; // 当失去焦点时
      }
    },
  },
};
</script>
