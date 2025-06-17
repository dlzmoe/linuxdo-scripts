<template>
  <div class="item">
    <div class="tit">{{ sort }}. 编辑器【插入删除线】设置</div>
    <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)" />
  </div>
</template>

<script>
import $ from "jquery";
export default {
  props: ["modelValue", "sort"],
  emits: ["update:modelValue"],
  created() {
    if (this.modelValue) {
      if($('.strikethrough').length<1){
        $('.d-editor-button-bar .dropdown-select-box').after(`
          <button class="btn no-text btn-icon strikethrough" title="插入删除线"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon d-icon icon-tabler icons-tabler-outline icon-tabler-route-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 17l4 4" /><path d="M7 17l-4 4" /><path d="M17 3l4 4" /><path d="M21 3l-4 4" /><path d="M11 19h5.5a3.5 3.5 0 0 0 0 -7h-8a3.5 3.5 0 0 1 0 -7h4.5" /></svg></button>
        `)

        $('.strikethrough').click(function(){
          const textarea = $('.d-editor-input').get(0);
          if (!textarea) return;
          
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          
          if (start !== end) {
            const selectedText = textarea.value.substring(start, end);
            const newText = `~~${selectedText}~~`;
            
            const beforeText = textarea.value.substring(0, start);
            const afterText = textarea.value.substring(end);
            
            textarea.value = beforeText + newText + afterText;
            
            // 更新光标位置到删除线后面
            textarea.selectionStart = textarea.selectionEnd = start + newText.length;
            
            // 触发input事件让Vue知道值已更改
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
          }
        })
      }
    }
  },
};
</script>
