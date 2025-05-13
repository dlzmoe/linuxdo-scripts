<template>
  <div class="item">
    <div class="tit">{{ sort }}. 是否开启收藏功能</div>
    <input
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
  </div>
  <div class="item" v-if="modelValue">
    <div class="tit">&nbsp;&nbsp;{{ sort }}.1 无感收藏(不跳转收藏页)</div>
    <input type="checkbox" :checked="silentBookmark" @change="toggleSilentBookmark" />
  </div>
</template>

<script>
import $ from "jquery";
export default {
  props: ["modelValue", "sort"],
  emits: ["update:modelValue"],
  data() {
    return {
      silentBookmark: false,
    }
  },
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
    // 切换无感收藏设置
    toggleSilentBookmark(event) {
      this.silentBookmark = event.target.checked
      localStorage.setItem('linuxdoSilentBookmark', this.silentBookmark)
    }
  },
  created() {
    // 获取无感收藏设置
    const silentBookmarkSetting = localStorage.getItem('linuxdoSilentBookmark')
    if (silentBookmarkSetting !== null) {
      this.silentBookmark = silentBookmarkSetting === 'true'
    }
    
    if (this.modelValue) {
      const vm = this;
      setInterval(() => {
        if ($(".linxudoscripts-bookmark").length < 1) {
          const btn = $(
            `<button class="btn btn-icon-text linxudoscripts-bookmark" type="button"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"  fill="none"  stroke="currentColor" stroke-width="2" stroke-linecap="round"  stroke-linejoin="round" class="d-icon icon icon-tabler icons-tabler-outline icon-tabler-bookmark-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 17l-6 4v-14a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v5" /><path d="M16 19h6" /><path d="M19 16v6" /></svg><span class="d-button-label">收藏</span></button>`
          );

          $(".linxudoscripts-btn").append(btn);

          $(".linxudoscripts-bookmark").click(function () {
            if ($(".header-title .topic-link").text().trim() == "") {
              vm.messageToast("请将页面往下滑动一点点，再点击收藏！");
              return false;
            }
            var bookmarkDatatitle = $(".header-title .topic-link").text().trim();
            var bookmarkDatacate = $(
              ".categories-wrapper .badge-category__wrapper:nth-child(1) .badge-category__name"
            )
              .text()
              .trim();
            var bookmarkDatatags = $("#topic-title .discourse-tags .discourse-tag.box")
              .map(function () {
                return $(this).text().trim();
              })
              .get();
            var bookmarkDataurl =
              "https://linux.do" + $(".header-title .topic-link").attr("href");

            var data = {
              url: bookmarkDataurl,
              title: bookmarkDatatitle,
              cate: bookmarkDatacate,
              tags: bookmarkDatatags,
            };

            const browserAPI = typeof browser !== "undefined" ? browser : chrome;
            browserAPI.storage.local.set({ bookmarkData: data }, () => {
              vm.messageToast("收藏成功" + (vm.silentBookmark ? "" : "，请前往收藏夹查看。"));
            });

            // 只有在非无感收藏模式下才跳转到收藏页面
            if (!vm.silentBookmark) {
              // 发送消息到后台脚本
              browserAPI.runtime.sendMessage({ action: "open_bookmark_page" });
            }
          });
        }
      }, 1000);
    }
  },
};
</script>
