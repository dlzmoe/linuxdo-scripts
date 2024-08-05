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
      var currentUrl = window.location.href;
      var url = new URL(currentUrl);
      var params = new URLSearchParams(url.search);
      if (params.has("type")) {
        $("body").addClass("body-preview");
      }
    },
    init() {
      this.paramsUrl();

      if ($(".topicpreview").length < 1) {
        $("body").append(
          '<div class="topicpreview"><div class="topicpreview-opacity"></div><iframe src></iframe></div>'
        );
      }

      $(".topic-list .main-link a.title").each(function () {
        const id = $(this).attr("href");
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
        const url = $(this).attr("data-id") + "?type=preview";
        $(".topicpreview iframe").attr("src", url);
      });

      // 关闭弹窗
      $(".topicpreview-opacity").click(function () {
        $(".topicpreview").hide();
        $(".topicpreview iframe").attr("src", "");
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
