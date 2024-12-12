<template>
  <div class="item">
    <div class="tit">{{ sort }}. gif 头像转静态图片（不喜花里胡哨的佬友可以开启）</div>
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
      setInterval(() => {
        $(".post-avatar .avatar").each(function () {
          const currentSrc = $(this).attr("src");
          if (currentSrc.endsWith(".gif")) {
            $(this).attr("src", currentSrc.replace(".gif", ".png"));
          }
        });
      }, 1000);
    }
  },
};
</script>
