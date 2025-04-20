<template>
  <div class="item">
    <div class="tit">{{ sort }}. 显示直达一楼按钮</div>
    <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)" />
  </div>
</template>

<script>
export default {
  props: ["modelValue", "sort"],
  emits: ["update:modelValue"],
};
</script>
