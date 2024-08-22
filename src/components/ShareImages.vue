<template>
  <div class="linuxdoscripts-sharebox-wrap">
    <div class="shareimages-meta">
      <button id="shareimagesdownload">下载图片</button>
      <button id="shareimagescopy">复制图片</button>
    </div>
    <div id="shareimagescapture" class="linuxdoscripts-sharebox"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    init() {
      // 先解绑旧的事件处理程序
      $(".linuxdoscripts-share").off("click");
      $("#shareimagesdownload").off("click");
      $("#shareimagescopy").off("click");
      $(".linuxdoscripts-opacity").off("click");

      if ($("#post_1").length > 0) {
        $("#post_1 .actions").append(`
        <button class="btn btn-default linuxdoscripts-share"><span class="d-button-label">分享</span></button>
      `);

        $(".linuxdoscripts-share").click(function () {
          const id = $("#post_1").attr("data-topic-id");
          $("html").css("overflow", "hidden");
          $(".linuxdoscripts-opacity").show();
          $(".linuxdoscripts-sharebox-wrap").show();
          let previewData = {};
          fetch(`https://linux.do/t/${id}.json`)
            .then((response) => response.json())
            .then((data) => {
              previewData = data;

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
                <div class="date">${formatDate(previewData.created_at)}</div>
              </div>
              <div class="content">${previewData.post_stream.posts[0].cooked} </div>
            `);
            });
        });

        $(".linuxdoscripts-opacity").click(function () {
          $("html").css("overflow", "inherit");
          $(".linuxdoscripts-opacity").hide();
          $(".linuxdoscripts-sharebox-wrap").hide();
        });

        // 下载图片
        document
          .getElementById("shareimagesdownload")
          .addEventListener("click", function () {
            var element = document.getElementById("shareimagescapture");
            html2canvas(element).then(function (canvas) {
              var link = document.createElement("a");
              link.download = "linuxdo.png";
              link.href = canvas.toDataURL();
              link.click();
              alert("图片下载成功！");
            });
          });

        // 复制到剪切板
        document.getElementById("shareimagescopy").addEventListener("click", function () {
          var element = document.getElementById("shareimagescapture");

          html2canvas(element).then(function (canvas) {
            canvas.toBlob(function (blob) {
              if (navigator.clipboard) {
                const item = new ClipboardItem({ "image/png": blob });

                navigator.clipboard
                  .write([item])
                  .then(function () {
                    alert("复制到剪切板成功！");
                  })
                  .catch(function (error) {
                    alert("复制图像失败。确保文档已聚焦并重试！");
                  });
              } else {
                alert("此浏览器不支持剪贴板");
              }
            }, "image/png");
          });
        });
      }
    },
  },
  created() {
    let script = document.createElement("script");
    script.src = "https://html2canvas.hertzen.com/dist/html2canvas.min.js";
    document.body.appendChild(script);

    setInterval(() => {
      if ($(".linuxdoscripts-share").length < 1) {
        this.init(); // 在每次调用 init 之前解绑旧的事件处理程序
      }
    }, 1000);
  },
};
</script>

<style lang="less">
.shareimages-meta {
  position: fixed;
  top: 20px;
  left: 40%;
  z-index: 99999;

  button {
    background: #fff;
    padding: 6px 12px;
    color: #000;
    border-radius: 5px;
    transition: all 0.1s linear;
    border-radius: 5px;
    outline: none;
    border: none;
    font-size: 15px;

    &:hover {
      background: #eee;
    }
  }
}

.linuxdoscripts-sharebox-wrap {
  display: none;
}

.linuxdoscripts-sharebox {
  z-index: 9999999999;
  position: fixed;
  top: 100px;
  left: 40%;
  width: 360px;
  min-height: 300px;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  padding: 50px 20px;
  box-sizing: border-box;

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
    line-height: 1.8;
    word-break: break-all;
    
    code {
      white-space: pre-wrap;
      word-break: break-all;
      max-height: 100%;
      background: #d4d4d4;
    }

    img {
      max-width: 100%;
      height: auto;
      vertical-align: bottom;
    }
  }
}
</style>
