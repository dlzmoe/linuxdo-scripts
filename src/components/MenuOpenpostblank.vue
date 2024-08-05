<template>
  <!-- 新标签页打开话题 -->
  <div class="item">
    <div class="tit">1. 是否新标签页打开话题</div>
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
    init() {
      $(".topic-list a.title").click(function (event) {
        event.preventDefault();
        var url = $(this).attr("href");
        window.open(url, "_blank");
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
