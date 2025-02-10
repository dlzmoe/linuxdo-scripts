<template>
  <div class="item">
    <div class="tit">{{ sort }}. 新建话题时自动切换到【搞七捻三】类别（暂不可自定义）</div>
    <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)" />
  </div>
</template>

<script>
import $ from "jquery";
export default {
  props: ["modelValue", "sort"],
  emits: ["update:modelValue"],
  methods: {
    // 提示组件
    messageToast(message) {
      const messageElement = document.createElement("div");
      messageElement.className = "messageToast-text";
      messageElement.innerText = message;
      document.getElementById("messageToast").appendChild(messageElement);
      setTimeout(() => {
        messageElement.remove();
      }, 3000);
    },
  },
  created() {
    if (this.modelValue) {
      const vm = this;
      let clickHandler = null;

      setInterval(() => {
        // 如果存在之前的事件处理器，先移除它
        if (clickHandler) {
          $('#create-topic').off('click', clickHandler);
        }

        // 定义新的事件处理器
        clickHandler = function () {
          setTimeout(() => {
            $('#reply-control .category-input .category-chooser .select-kit-header').click();
            $('.category-row[data-guid="ember126"]').click();
            vm.messageToast('已切换【搞七捻三】类别！');
          }, 1000);
        };

        // 绑定新的事件处理器
        $('#create-topic').on('click', clickHandler);
      }, 1000);
    }
  }
};
</script>
