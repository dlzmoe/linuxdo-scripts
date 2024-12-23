<template>
  <div class="item">
    <div class="tit">{{ sort }}. 是否禁用浏览帖子时 URL 更新楼层数</div>
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
      try {
        require("discourse/routes/topic").default.disableReplaceState = true;
        console.log("disableReplaceState 已成功设置为 true");
      } catch (e) {
        console.error("设置 disableReplaceState 失败：", e);
      }
    }
  },
};
</script>
