<template>
  <div class="item">
    <div class="tit">{{ sort }}. 是否显示最热帖子排行榜</div>
    <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)" />
  </div>
</template>

<script>
import $ from "jquery";
export default {
  props: ["modelValue", "sort"],
  emits: ["update:modelValue"],
};
</script>
