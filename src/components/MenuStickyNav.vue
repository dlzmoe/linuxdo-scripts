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

      $("head").append(`<style>
.navigation-container.is-active{position:fixed;top:65px;background:#fff!important;z-index:9;box-shadow:1px 3px 7px 0 rgba(0,0,0,.2);margin-left:-30px;padding-left:30px;border-radius:5px;padding-top:10px;padding-right:20px;min-width:1000px;width:auto}
.dark-theme .navigation-container.is-active{background:#333!important}
        </style>`);
    }
  },
};
</script>
