<template>
  <!-- 话题预览功能 -->
  <div class="item">
    <div class="tit">7. 是否开启话题预览功能</div>
    <template>
      <el-checkbox v-model="localChecked" @change="handleChange"></el-checkbox>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      localChecked: this.value,
    };
  },
  watch: {
    value(newValue) {
      this.localChecked = newValue;
    },
  },
  methods: {
    handleChange() {
      this.$emit("input", this.localChecked);
    },
    paramsUrl() {
      var currentUrl = window.location.search;
      if (currentUrl == "?type=preview") {
        $("body").addClass("body-preview");
      }
    },
    init() {
      this.paramsUrl();

      if ($(".topicpreview").length < 1) {
        $("body").append(`<div class="topicpreview">
          <div class="topicpreview-opacity"></div>
          <div class="topicpreview-container">
            <p style="text-align: center">正在加载中...</p>  
          </div>
          </div>`);
      }

      $(".topic-list .main-link a.title").each(function () {
        const id = $(this).attr("data-topic-id");
        if ($(this).parents(".link-top-line").find(".topicpreview-btn").length < 1) {
          $(this)
            .parents(".link-top-line")
            .append(
              `<button class="btn btn-icon-text btn-default topicpreview-btn" data-id="${id}">预览</button>`
            );
        }
      });

      // 打开预览
      $(".topicpreview-btn").click(function () {
        $(".topicpreview").show();
        let previewData = {};
        let previewurl = $(this).attr("data-id");
        fetch(`https://linux.do/t/${previewurl}.json`)
          .then((response) => response.json())
          .then((data) => {
            previewData = data;

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

            const isoString = "2024-08-08T08:59:46.264Z";
            const formattedDate = formatDate(isoString);

            console.log(formattedDate); // 输出：2024-08-08 08:59:46

            $(".topicpreview-container").html(`
                <div class="topicpreview-container">
                  <div class="topicpreview-title">${previewData.title}</div>
                  <p class="topicpreview-date">发帖时间：${formatDate(
                    previewData.created_at
                  )}</p>
                  <div class="topicpreview-content"></div>
                  <p style="text-align: center;">仅显示前 20 条，<a href="/t/topic/${previewurl}/">查看更多</a></p>
                </div>
              `);

            $.each(previewData.post_stream.posts, function (index, post) {
              $(".topicpreview .topicpreview-content").append(`
            <div class="item">
              <span class="itemfloor">${index + 1}楼</span>
              <div class="itempost">
                <div class="itemname">
                  ${post.display_username} 
                  <span>${post.username}</span>
                  <div class="itemdate">${formatDate(post.created_at)}</div>
                </div>
                ${post.cooked}
                </div>
            </div>
          `);
            });
          });
      });

      // 关闭弹窗
      $(".topicpreview-opacity").click(function () {
        $(".topicpreview").hide();
        $(".topicpreview-container").html("");
      });
    },
  },
  created() {
    if (this.localChecked) {
      let pollinglength1 = 0;
      let pollinglength2 = 0;
      setInterval(() => {
        if (pollinglength1 != $(".topic-list-body tr").length) {
          pollinglength1 = $(".topic-list-body tr").length;
          this.init();
        }
        if (pollinglength2 != $(".post-stream .topic-post").length) {
          pollinglength2 = $(".post-stream .topic-post").length;
          this.init();
        }
      }, 1000);
    }
  },
};
</script>
<style scoped>
.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
