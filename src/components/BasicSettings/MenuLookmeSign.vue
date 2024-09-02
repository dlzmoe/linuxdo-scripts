<template>
  <div class="item">
    <div class="tit">{{ sort }}. 只看自己签名尾巴</div>
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
      $("head").append(`<style>
        .topic-post .cooked+hr,
        .topic-post .signature-img,
        .topic-post .signature-p{display:none}

        .topic-post.current-user-post .cooked+hr,
        .topic-post.current-user-post .signature-img,
        .topic-post.current-user-post .signature-p{display:block}
      </style>`);
    }
  },
};
</script>
