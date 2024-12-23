<template></template>

<script>
export default {
  methods: {
    init() {
      $(".signature-img").each(function () {
        var self1 = $(this);

        // 检查是否已经处理过
        // if (self1.data("processed")) {
        //   return; // 如果已经处理过，跳过当前元素
        // }

        var url1 = self1.attr("src");
        var img1 = new Image();
        img1.src = url1;

        // 标记为已处理
        // self1.data("processed", true);

        // 图片不可访问
        img1.onerror = function () {
          if (self1.siblings(".signature-p").length < 1) {
            self1.after(
              `<p class="signature-p">${url1}（该用户签名不可访问，已自动转文字）</p>`
            );
            self1.hide();
          }
        };
      });
    },
  },
  created() {
    // let pollinglength1 = 0;
    let pollinglength2 = 0;
    setInterval(() => {
      // if (pollinglength1 != $(".topic-list-body tr").length) {
      //   pollinglength1 = $(".topic-list-body tr").length;
      //   this.init();
      // }
      if (pollinglength2 != $(".post-stream .topic-post").length) {
        pollinglength2 = $(".post-stream .topic-post").length;
        this.init();
      }
    }, 1000);
  },
};
</script>
