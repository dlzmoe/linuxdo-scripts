<template>
  <div class="item">
    <div class="tit">{{ sort }}. 是否自动展开回复父帖子</div>
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
      $(".topic-body .reply-to-tab").each(function () {
        $(this).click();
      });
    },
  },
  created() {
    if (this.modelValue) {
      this.init();
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
