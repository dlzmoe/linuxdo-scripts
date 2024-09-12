<template></template>

<script>
export default {
  methods: {
    init() {
      $(".signature-img").each(function () {
        var self = $(this);

        // 检查是否已经处理过
        if (self.data("processed")) {
          return; // 如果已经处理过，跳过当前元素
        }

        var url = self.attr("src");
        var img = new Image();
        img.src = url;

        // 标记为已处理
        self.data("processed", true);

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
