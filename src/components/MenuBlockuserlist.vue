<template>
  <!-- 屏蔽指定用户 -->
  <div class="item">
    <div class="tit">{{ sort }}. 屏蔽指定用户（使用英文，分隔）</div>
    <template>
      <textarea
        v-model="textarea"
        @input="handleChange"
        placeholder="user1,user2,user3"
      ></textarea>
    </template>
  </div>
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
      this.$emit("input", this.textarea);
    },
    init() {
      this.list = this.textarea.split(",") || [];
      var self = this; // 保存外部上下文
      $(".topic-list .topic-list-data.posters>a:nth-child(1)")
        .filter((index, element) => {
          var user = $(element).attr("data-user-card");
          return self.list.indexOf(user) !== -1;
        })
        .parents("tr.topic-list-item")
        .remove();

      $(".topic-post .full-name a")
        .filter((index, element) => {
          var user = $(element).attr("data-user-card");
          return self.list.indexOf(user) !== -1;
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
