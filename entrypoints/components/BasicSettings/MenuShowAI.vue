<template>
  <div class="item">
    <div class="tit">{{ sort }}. 快速打开 Shared（需提前解锁 Shared）</div>
    <input
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
  </div>
</template>

<script>
import $ from "jquery";
export default {
  props: ["modelValue", "sort"],
  emits: ["update:modelValue"],
};
</script>
