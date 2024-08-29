<template>
  <!-- 切换论坛表情风格 -->
  <div class="item">
    <div class="tit">
      {{ sort }}. 切换论坛表情风格

      <select v-model="localChecked.value2">
        <option v-for="item in options" :value="item.value" :key="item.value">
          {{ item.label }}
        </option>
      </select>
    </div>
    <el-checkbox v-model="localChecked.value1" @change="handleChange"></el-checkbox>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
    },
    sort: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      localChecked: this.value,
      options: [
        {
          value: "twitter",
          label: "twitter",
        },
        {
          value: "facebook_messenger",
          label: "facebook_messenger",
        },
        {
          value: "google",
          label: "google",
        },
        {
          value: "google_classic",
          label: "google_classic",
        },
        {
          value: "win10",
          label: "win10",
        },
      ],
    };
  },
  watch: {
    value(newValue) {
      this.localChecked = newValue;
      this.toggleEmojiStyle(); // 动态控制
    },
  },
  methods: {
    handleChange() {
      this.$emit("input", this.localChecked);
      this.toggleEmojiStyle(); // 在切换时调用
    },
    toggleEmojiStyle() {
      if (this.localChecked) {
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
        img.src = img.src.replace(applePath, `images/emoji/${this.localChecked.value2}`);
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
    // 页面加载时根据 localChecked 判断是否开启功能
    if (this.localChecked.value1) {
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
  display: flex;
  align-items: center;
  justify-content: space-between;

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
