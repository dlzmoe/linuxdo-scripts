<template>
  <!-- 显示楼层数 -->
  <div class="item">
    <div class="tit">{{ sort }}. 是否显示楼层数</div>
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
  methods: {
    init() {
      $(".topic-post").each(function () {
        const num = $(this)
          .find("article")
          .attr("id")
          .replace(/^post_/, "");
        if ($(this).find(".linuxfloor").length < 1) {
          $(this).find(".post-infos").append(`<span class="linuxfloor">#${num}</span>`);
        }
      });
    },
  },
  created() {
    if (this.modelValue) {
      let pollinglength2 = 0;
      setInterval(() => {
        if (pollinglength2 != $(".post-stream .topic-post").length) {
          pollinglength2 = $(".post-stream .topic-post").length;
          this.init();
        }
      }, 1000);
    }
  },
};
</script>
