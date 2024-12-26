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
  created() {
    if (this.modelValue) {
      setInterval(() => {
        if ($(".linxudoscripts-bookmark").length < 1) {
          $(".topic-map__contents").after(
            '<button class="btn btn-icon-text linxudoscripts-bookmark" type="button"><svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-bookmark-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 17l-6 4v-14a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v5" /><path d="M16 19h6" /><path d="M19 16v6" /></svg><span class="d-button-label">收藏</span></button>'
          );

          $(".linxudoscripts-bookmark").click(function () {
            const url = "https://linux.do" + $("#topic-title h1 a").attr("href");
            const title = "https://linux.do" + $("#topic-title h1 a").text().trim();

            console.log(url, title);

            const data = { url: url, title: title };

            chrome.storage.local.set({ bookmarkData: data }, function () {
              console.log("Data is stored.");

              window.location.href =
                "chrome-extension://pogbablcilijeecbofdmojlocebdffbc/bookmark.html";
            });
          });
        }
      }, 1000);
    }
  },
};
</script>
