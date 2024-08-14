<template>
  <div class="linuxdoscripts-sharebox-wrap">
    <button id="download">Download as Image</button>
    <div id="capture" class="linuxdoscripts-sharebox"></div>
  </div>
</template>

<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    init() {
      if ($("#post_1").length > 0) {
        $(".topic-category").after(`
          <button class="widget-button btn-flat linuxdoscripts-share"><span class="d-button-label">分享</span></button>
        `);

        $(".linuxdoscripts-share").click(function () {
          const id = $("#post_1").attr("data-topic-id");
          $(".linuxdoscripts-opacity").show();
          $(".linuxdoscripts-sharebox-wrap").show();
          let previewData = {};
          fetch(`https://linux.do/t/${id}.json`)
            .then((response) => response.json())
            .then((data) => {
              previewData = data;
              console.log(previewData);

              // 定义一个转化的时间的方法
              function formatDate(isoString) {
                const date = new Date(isoString);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从 0 开始，所以要加 1
                const day = String(date.getDate()).padStart(2, "0");
                const hours = String(date.getHours()).padStart(2, "0");
                const minutes = String(date.getMinutes()).padStart(2, "0");
                const seconds = String(date.getSeconds()).padStart(2, "0");
                return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
              }

              $(".linuxdoscripts-sharebox").html(`
                <div class="title">${previewData.title}</div>
                <div class="flex">
                  <div class="name">${previewData.post_stream.posts[0].username}</div>
                  <div class="date">
                    发帖时间：${formatDate(previewData.created_at)}
                  </div>
                </div>
                <div class="content">
                  ${previewData.post_stream.posts[0].cooked} 
                </div>
              
              `);
            });
        });

        $(".linuxdoscripts-opacity").click(function () {
          $(".linuxdoscripts-opacity").hide();
          $(".linuxdoscripts-sharebox-wrap").hide();
        });

        $("#download").click(function () {
          console.log(this);
          
          var div = document.getElementById("capture");

          // 使用 html2canvas 进行捕获
          html2canvas(div).then(function (canvas) {
            // 将 canvas 转换为图片
            var imgData = canvas.toDataURL("image/png");

            // 创建一个下载链接
            var link = document.createElement("a");
            link.href = imgData;
            link.download = "div_image.png";

            // 触发下载
            link.click();
          });
        });
      }
    },
  },
  created() {
    setInterval(() => {
      if ($(".linuxdoscripts-share").length < 1) {
        this.init();
      }
    }, 1000);
  },
};
</script>

<style lang="less">
.linuxdoscripts-sharebox-wrap {
  display: none;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 9999999999;
}

.linuxdoscripts-sharebox {
  position: absolute;
  left: 50%;
  top: 100px;
  transform: translateX(-50%);
  width: 360px;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  padding: 20px;

  .flex {
    display: flex;
    justify-content: space-between;
    align-content: center;
    padding-top: 10px;
  }

  .title {
    font-size: 20px !important;
    line-height: 1.4;
    border: none !important;
    text-align: left !important;
  }

  .name {
    color: #444;
  }

  .date {
    font-size: 14px;
    color: #888;
  }

  .content {
    border-top: 1px solid #ccc;
    margin-top: 10px;

    code {
      white-space: pre-wrap;
      word-break: break-all;
      max-height: 100%;
    }

    img {
      max-width: 100%;
      height: auto;
      vertical-align: bottom;
    }
  }
}
</style>
