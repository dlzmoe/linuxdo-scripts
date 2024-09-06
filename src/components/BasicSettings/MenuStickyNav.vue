<template>
  <div class="item">
    <div class="tit">{{ sort }}. 开启列表页导航栏浮动</div>
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
      $(window).on("scroll", function () {
        if ($(window).scrollTop() >= 250) {
          $(".navigation-container").addClass("is-active");
        } else {
          $(".navigation-container").removeClass("is-active");
        }
      });
    }
  },
};
</script>
