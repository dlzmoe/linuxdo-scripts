<template>
  <!-- 自定义 CSS -->
  <div class="item">
    <div class="tit">
      {{ sort }}. 自定义回复文字小尾巴（留空自动关闭，连续点击三次回车触发）
    </div>
    <template>
      <textarea v-model="textarea" @input="handleChange"></textarea>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: "",
    },
    sort: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      textarea: this.value,
    };
  },
  watch: {
    value(newValue) {
      this.textarea = newValue;
    },
  },
  methods: {
    handleChange() {
      this.$emit("input", this.textarea);
    },
    init() {
      let enterCount = 0;
      let enterTimeout;

      // 先移除之前的事件绑定，避免重复绑定
      $('#reply-control .reply-area[aria-label="回复话题"] .d-editor-input').off("keydown");

      $('#reply-control .reply-area[aria-label="回复话题"] .d-editor-input').on(
        "keydown",
        (event) => {
          if (event.key === "Enter") {
            enterCount++;

            if (enterCount === 3) {
              this.triggerEvent();
              enterCount = 0;
            } else {
              clearTimeout(enterTimeout);
              enterTimeout = setTimeout(() => {
                enterCount = 0;
              }, 1000);
            }
          }
        }
      );
    },
    triggerEvent() {
      let currentContent = $(
        '#reply-control .reply-area[aria-label="回复话题"] .d-editor-input'
      ).val();
      let newContent = `\n<hr><div style="text-align:center" dir="auto"><span style="font-size:80%">${this.textarea}</span></div>`;
      $('#reply-control .reply-area[aria-label="回复话题"] .d-editor-input').val(
        currentContent + newContent
      );

      $("#checkturned").remove();
    },
  },
  created() {
    if (this.textarea !== "") {
      this.init(); // 初始化事件监听器
      setInterval(() => {
        if ($(".d-editor-input").length > 0) {
          this.init(); // 重新初始化时，确保只绑定一次事件
        }
      }, 1000);
    }
  },
};
</script>
