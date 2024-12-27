<template>
  <div class="item">
    <div class="tit">{{ sort }}. 是否开启收藏功能</div>
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
      setInterval(() => {
        if ($(".linxudoscripts-bookmark").length < 1) {
          $(".topic-map__contents").after(
            '<button class="btn btn-icon-text linxudoscripts-bookmark" type="button"><svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-bookmark-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 17l-6 4v-14a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v5" /><path d="M16 19h6" /><path d="M19 16v6" /></svg><span class="d-button-label">收藏</span></button>'
          );

          $(".linxudoscripts-bookmark").click(function () {
            var title = $(".header-title .topic-link").text().trim();
            var cate = $(
              ".categories-wrapper .badge-category__wrapper .badge-category__name"
            )
              .text()
              .trim();
            var tags = $("#topic-title .discourse-tags .discourse-tag.box")
              .map(function () {
                return $(this).text().trim();
              })
              .get();
            var url = "https://linux.do" + $(".header-title .topic-link").attr("href");

            var data = {
              url: url,
              title: title,
              cate: cate,
              tags: tags,
            };

            console.log(data);

            chrome.storage.local.set({ bookmarkData: data }, () => {
              vm.messageToast("收藏成功，请前往收藏夹查看。");
            });

            // 发送消息到后台脚本
            chrome.runtime.sendMessage({ action: "open_bookmark_page" });
          });
        }
      }, 1000);
    }
  },
};
</script>
