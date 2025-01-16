<template>
  <div class="item">
    <div class="tit">{{ sort }}. 是否开启话题转为图片进行分享</div>
    <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)" />
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  props: ['modelValue', 'sort'],
  emits: ['update:modelValue'],
  created() {
    if (this.modelValue) {
      setInterval(() => {
        if ($('.linxudoscripts-share').length < 1) {
          $('.topic-map__contents').after(
            '<button class="btn btn-icon-text linxudoscripts-share" type="button"><svg xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="d-icon icon icon-tabler icons-tabler-outline icon-tabler-photo-share"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 8h.01" /><path d="M12 21h-6a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v7" /><path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l3 3" /><path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0" /><path d="M16 22l5 -5" /><path d="M21 21.5v-4.5h-4.5" /></svg><span class="d-button-label">分享图片</span></button>'
          )

          $('.linxudoscripts-share').click(function () {
            let id = $('#topic-title h1').attr('data-topic-id');
            const browserAPI = (typeof browser !== 'undefined' ? browser : chrome);
            browserAPI.storage.local.set({ shareID: id })

            // 发送消息到后台脚本
            browserAPI.runtime.sendMessage({ action: 'open_share_page' })
          })
        }
      }, 1000)
    }
  },
}
</script>
