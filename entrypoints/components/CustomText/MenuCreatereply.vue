<template>
  <div class="item">
    <div class="tit">{{ sort }}. 自定义快捷回复（换行分隔）</div>
  </div>
  <textarea
    v-model="textarea"
    @input="handleChange"
    placeholder="前排围观支持一下\n感谢分享大佬厉害啊\n有点厉害支持~~"
  >
  </textarea>
</template>

<script>
import $ from "jquery";
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
      this.$emit("update:value", this.textarea);
    },
    init() {
      this.list = this.textarea.split(/\r?\n/) || [];

      // setInterval(() => {
      if ($(".createreply").length < 1) {
        $(".timeline-container .topic-timeline").append(
          `<div class="createreply" style="margin-top:6.4rem;"></div>`
        );

        this.list.forEach(function (item) {
          var $li = $(
            '<button class="btn btn-default create reply-to-post no-text btn-icon" type="button"></button>'
          ).text(item);
          $(".createreply").append($li);
        });

        $(".createreply button").click(function () {
          if ($(".timeline-footer-controls button.create").length != 0) {
            $(".timeline-footer-controls button.create")[0].click();
          }
          if (
            $("#topic-footer-buttons .topic-footer-main-buttons button.create").length !=
            0
          ) {
            $(
              "#topic-footer-buttons .topic-footer-main-buttons button.create"
            )[0].click();
          }

          setTimeout(() => {
            let $textarea = $(".d-editor-textarea-wrapper textarea");
            let text = $(this).html();
            $textarea.focus();
            for (let i = 0; i < text.length; i++) {
              let char = text[i];
              $textarea.val($textarea.val() + char);
              let inputEvent = new Event("input", {
                bubbles: true,
                cancelable: true,
              });
              $textarea[0].dispatchEvent(inputEvent);
              let keyEvent = new KeyboardEvent("keydown", {
                key: char,
                char: char,
                keyCode: char.charCodeAt(0),
                which: char.charCodeAt(0),
                bubbles: true,
              });
              $textarea[0].dispatchEvent(keyEvent);
            }
          }, 1000);
        });
      }

      // }, 1000);
    },
  },
  created() {
    if (this.textarea) {
      setInterval(() => {
        this.init();
      }, 1000);
    }
  },
};
</script>

<style lang="less" scoped>
.item {
  border: none !important;
}
</style>
