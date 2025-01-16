<template>
  <div class="item">
    <div class="tit">{{ sort }}. 是否开启中英文混排优化显示</div>
    <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)" />
  </div>
</template>

<script>
import $ from "jquery";
import pangu from "pangu";
export default {
  props: ["modelValue", "sort"],
  emits: ["update:modelValue"],
  created() {
    if (this.modelValue) {
      setInterval(() => {
        pangu.spacingElementByClassName("cooked");
        pangu.spacingElementByTagName("h1");
        document.addEventListener("DOMContentLoaded", () => {
          pangu.autoSpacingPage();
        });

        if ($(".pangutext").length < 1) {
          $(".save-or-cancel .cancel").before(`<span class="pangutext">混排优化</span>`);
          $(".pangutext").click(function () {
            const $textarea = $(".d-editor-input");
            let text = pangu.spacing($textarea.val());
            $textarea.focus();
            $textarea.val("");
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
          });
        }
      }, 1000);
    }
  },
};
</script>
