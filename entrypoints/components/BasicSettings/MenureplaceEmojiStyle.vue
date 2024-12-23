<template>
  <div class="item">
    <div class="tit">
      {{ sort }}. 切换论坛表情风格
      <select v-model="value2">
        <option v-for="item in options" :value="item.value" :key="item.value">
          {{ item.label }}
        </option>
      </select>
    </div>
    <input type="checkbox" v-model="value1" @change="handleChange" />
  </div>
</template>

<script>
import $ from "jquery";
export default {
  props: ["modelValue", "sort"],
  emits: ["update:modelValue"],
  data() {
    return {
      options: [
        { value: "twitter", label: "twitter" },
        { value: "facebook_messenger", label: "facebook_messenger" },
        { value: "google", label: "google" },
        { value: "google_classic", label: "google_classic" },
        { value: "win10", label: "win10" },
      ],
    };
  },
  computed: {
    value1: {
      get() {
        return this.modelValue.value1;
      },
      set(newValue) {
        this.$emit("update:modelValue", { ...this.modelValue, value1: newValue });
      },
    },
    value2: {
      get() {
        return this.modelValue.value2;
      },
      set(newValue) {
        this.$emit("update:modelValue", { ...this.modelValue, value2: newValue });
      },
    },
  },
  methods: {
    handleChange() {
      this.toggleEmojiStyle(); // 在切换时调用
    },
    toggleEmojiStyle() {
      if (this.value1) {
        // 开启替换表情风格
        this.replaceEmojiStyle();
        this.initObserver();
      } else {
        // 停止表情替换
        this.observer && this.observer.disconnect();
      }
    },
    replaceEmojiStyle() {
      const imgs = document.querySelectorAll("img");
      imgs.forEach(this.updateImageSrc);
    },
    updateImageSrc(img) {
      const applePath = "images/emoji/apple";
      if (img.src.includes(applePath)) {
        // 可以替换成其他表情风格
        img.src = img.src.replace(applePath, `images/emoji/${this.value2}`);
      }
    },
    processMutations(mutations) {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            if (node.tagName === "IMG") {
              this.updateImageSrc(node);
            } else if (node.querySelectorAll) {
              node.querySelectorAll("img").forEach(this.updateImageSrc);
            }
          }
        });

        if (mutation.type === "attributes" && mutation.target.tagName === "IMG") {
          this.updateImageSrc(mutation.target);
        }
      });
    },
    initObserver() {
      // 初始化 MutationObserver
      this.observer = new MutationObserver(this.processMutations);
      this.observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["src"],
      });
    },
  },
  mounted() {
    // 页面加载时根据 value1 判断是否开启功能
    if (this.value1) {
      this.toggleEmojiStyle();
    }
  },
  beforeDestroy() {
    // 组件销毁时断开 observer
    this.observer && this.observer.disconnect();
  },
};
</script>

<style scoped lang="less">
.item {
  select {
    height: 28px;
    border: 1px solid #b6b6b6;
    border-radius: 4px;
    width: 180px;
    margin-left: 10px;
    cursor: pointer;
  }
}
</style>
