<template></template>

<script>
export default {
  methods: {
    init() {
      $(".signature-img").each(function () {
        var self = $(this);
        var url = self.attr("src");

        var img = new Image();
        img.src = url;

        // 图片不可访问
        img.onerror = function () {
          if (self.siblings(".signature-p").length < 1) {
            self.after(
              `<p class="signature-p">${url}（该用户签名不可访问，已自动转文字）</p>`
            );
            self.hide();
          }
        };
      });
    },
  },
  created() {
    setInterval(() => {
      this.init();
    }, 1000);
  },
};
</script>
