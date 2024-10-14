<template>
  <div class="item">
    <div class="tit">{{ sort }}. 是否自动切换黑夜模式</div>
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
      setTimeout(() => {
        var svgElement = $('button[title="切换颜色主题"]').find("svg");

        var currentTime = new Date();
        var currentHour = currentTime.getHours();

        // 判断是否在晚上 6 点到第二天早上 6 点之间
        if (currentHour >= 18 || currentHour < 6) {
          console.log("现在是夜里");
          if (svgElement.hasClass("d-icon-moon")) {
            $('button[title="切换颜色主题"]')[0].click();
          }
        } else {
          console.log("现在不是夜里");
          if (svgElement.hasClass("d-icon-sun")) {
            $('button[title="切换颜色主题"]')[0].click();
          }
        }
      }, 1000);
    }
  },
};
</script>
