<template>
  <div class="item">
    <div class="tit">{{ sort }}. 是否开启中英文混排优化显示</div>
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
      let scriptpangu = document.createElement("script");
      scriptpangu.src = "https://cdn.jsdelivr.net/npm/pangu@4.0.7/dist/browser/pangu.min.js";
      document.body.appendChild(scriptpangu);
      setInterval(() => {
        pangu.spacingElementByClassName("cooked");
        pangu.spacingElementByTagName("h1");
        document.addEventListener("DOMContentLoaded", () => {
          pangu.autoSpacingPage();
        });

        if ($(".pangutext").length < 1) {
          $(".save-or-cancel .cancel").before(`<span class="pangutext">混排优化</span>`);
          $(".pangutext").click(function () {
            const editorstr = $(".d-editor-input").val();
            const text = pangu.spacing(editorstr);
            $(".d-editor-input").val(text);
          });
        }
      }, 1000);
    }
  },
};
</script>
