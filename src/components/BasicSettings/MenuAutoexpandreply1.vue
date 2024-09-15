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
      // 遍历所有 aria-expanded 为 false 的按钮
      $(".topic-body .reply-to-tab[aria-expanded='false']").each(function () {
        // 检查按钮是否已经被点击过
        if (!$(this).data("clicked")) {
          // 点击按钮
          $(this).click();

          // 设置标识为已点击
          $(this).data("clicked", true);
        }
      });
    },
  },

  created() {
    if (this.modelValue) {
      setInterval(() => {
        // 检查是否存在按钮
        if ($(".topic-body .reply-to-tab").length > 0) {
          this.init();
        }
      }, 1000);
    }
  },
};
</script>
