<template>
  <div class="item">
    <div class="tit">
      {{ sort }}. 关键词屏蔽功能（使用英文，分隔）屏蔽包含关键字的话题和回复
    </div>
  </div>
  <textarea v-model="textarea" @input="handleChange"> </textarea>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: "",
    },
    sort: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      textarea: this.value,
    };
  },
  watch: {
    value(newValue) {
      this.textarea = newValue;
    },
  },
  methods: {
    handleChange() {
      this.$emit("update:value", this.textarea);
    },
    init() {
      this.list = this.textarea.split(",") || [];
      var self = this;

      // 检查话题标题
      $(".topic-list .main-link .raw-topic-link>*")
        .filter((index, element) => {
          var text = $(element).text();
          return self.list.some((item) => text.includes(item));
        })
        .parents("tr.topic-list-item")
        .remove();

      // 检测评论回复
      $(".topic-body .cooked")
        .filter((index, element) => {
          var text = $(element).text();

          return self.list.some((item) => text.includes(item));
        })
        .parents(".topic-post")
        .remove();
    },
  },
  created() {
    if (this.textarea) {
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
<style lang="less" scoped>
.item {
  border: none !important;
}
</style>
