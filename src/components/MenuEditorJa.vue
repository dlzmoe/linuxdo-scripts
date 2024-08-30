<template>
  <!-- 编辑器切换 ja 字体 -->
  <div class="item">
    <div class="tit">{{ sort }}. 编辑器切换 ja 字体</div>
    <input type="checkbox" v-model="localChecked" @change="handleChange">
  </div>
</template>

<script>
export default {
  props: {
    value: {
 type: Boolean,
      default: false,
    },
    sort: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      localChecked: this.value,
    };
  },
  watch: {
    value(newValue) {
      this.localChecked = newValue;
    },
  },
  methods: {
    handleChange() {
      this.$emit("update:value", this.localChecked);
    },
  },
  created() {
    if (this.localChecked) {
      setInterval(() => {
        if ($(".replyja").length < 1) {
          $("#reply-control .save-or-cancel .create").after(
            `<button class="btn btn-default replyja" style="margin-left:15px;" type="button">ja 字体</button>`
          );
          $(".replyja").click(function () {
            let $textarea = $(".d-editor-textarea-wrapper textarea");
            let text = `<span lang="ja">

${$(".d-editor-input").val()}

</span>`;

            $(".d-editor-textarea-wrapper textarea").val("");
            $textarea.focus(); // 聚焦到 textarea

            for (let i = 0; i < text.length; i++) {
              let char = text[i];

              // 更新 textarea 的值
              $textarea.val($textarea.val() + char);

              // 创建并派发 input 事件
              let inputEvent = new Event("input", {
                bubbles: true,
                cancelable: true,
              });
              $textarea[0].dispatchEvent(inputEvent);

              // 创建并派发 keydown 事件
              let keyEvent = new KeyboardEvent("keydown", {
                key: char,
                char: char,
                keyCode: char.charCodeAt(0),
                which: char.charCodeAt(0),
                bubbles: true,
              });
              $textarea[0].dispatchEvent(keyEvent);
            }
          });
        }
      }, 1000);
    }
  },
};
</script>
<style scoped>
.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
