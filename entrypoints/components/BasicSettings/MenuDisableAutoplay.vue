<template>
  <div class="item">
    <div class="tit">{{ sort }}. 禁用视频自动播放</div>
    <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)" />
  </div>
</template>

<script>
import $ from "jquery";
export default {
  props: ["modelValue", "sort"],
  emits: ["update:modelValue"],
  created() {
    if (this.modelValue) {
      setInterval(() => {
        $(".cooked iframe, .cooked video").each(function () {
          const $element = $(this);
          let src = $element.attr("src");

          // 检查 src 是否存在
          if (src) {
            // 检查是否已有 autoplay=false
            if (!src.includes("autoplay=false")) {
              // 检查是否已有 autoplay 参数
              if (src.includes("autoplay=")) {
                // 如果存在，替换为 autoplay=false
                src = src.replace(/autoplay=[^&]*/, "autoplay=false");
              } else {
                // 如果不存在，添加 autoplay=false
                const separator = src.includes("?") ? "&" : "?";
                src += `${separator}autoplay=false`;
              }

              // 更新 src 属性
              $element.attr("src", src);
            }
          }
        });
      }, 1000);
    }
  },
};
</script>
