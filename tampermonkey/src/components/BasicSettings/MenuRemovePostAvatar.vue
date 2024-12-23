<template>
  <div class="item">
    <div class="tit">
      <!-- 是否保留发帖人仅 PC 端 类主站样式有效，移动端默认只有发帖人 -->
      {{ sort }}. 是否移除话题列表上的头像（是否保留发帖人
      <input
        type="checkbox"
        :checked="modelValue.showAuthor"
        @change="
          $emit('update:modelValue', {
            enable: modelValue.enable,
            showAuthor: $event.target.checked,
          })
        "
      />
      ）
    </div>
    <input
      type="checkbox"
      :checked="modelValue.enable"
      @change="
        $emit('update:modelValue', {
          enable: $event.target.checked,
          showAuthor: modelValue.showAuthor,
        })
      "
    />
  </div>
</template>

<script>
export default {
  props: ["modelValue", "sort"],
  emits: ["update:modelValue"],
  created() {
    if (this.modelValue.enable) {
      $("head").append(`<style>
        .topic-list-data.posters { width: max-content !important; }
        .topic-list-content.right { margin-left:0 !important; }

        .topic-list-data.posters ${
          this.modelValue.showAuthor ? "> *:not(:first-child)" : ""
        },
        .topic-list-avatar.pull-left  { display:none !important }
      </style>`);
    }
  },
};
</script>
