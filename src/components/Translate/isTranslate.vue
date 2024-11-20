<template>
  <div class="item">
    <div class="tit">{{ sort }}. 是否屏蔽拼音/翻译显示</div>
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
     $('head').append(`<style>
     .topic-body .cooked ruby>rt{display:none!important}
     </style>`)
    }
  },
};
</script>
