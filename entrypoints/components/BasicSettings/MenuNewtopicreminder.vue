<template>
  <div class="item">
    <div class="tit">{{ sort }}. 是否开启新话题提醒</div>
    <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)" />
  </div>
</template>

<script>
import $ from "jquery";
export default {
  props: ["modelValue", "sort"],
  emits: ["update:modelValue"],
  methods: {
    init() {
      if ($("#list-area .show-more").length > 0) {
        $("head title").html("【有新话题赶紧来水！！】");
      }
    },
  },
  created() {
    if (this.modelValue) {
      setInterval(() => {
        this.init();
      }, 1000);
    }
  },
};
</script>
