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
      eventListeners: [],
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
      // 移除之前的事件监听器
      this.removeEventListeners();

      // 添加新的事件监听器
      $(".topic-list a.title").each((index, element) => {
        const listener = (event) => {
          event.preventDefault();
          var url = $(element).attr("href");
          window.open(url, "_blank");
        };
        $(element).on("click", listener);
        this.eventListeners.push({ element, listener });
      });
    },
    removeEventListeners() {
      this.eventListeners.forEach(({ element, listener }) => {
        $(element).off("click", listener);
      });
      this.eventListeners = [];
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
  beforeDestroy() {
    // 组件销毁前移除所有事件监听器
    this.removeEventListeners();
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
