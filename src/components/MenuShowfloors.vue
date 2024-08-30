<template>
  <!-- 显示楼层数 -->
  <div class="item">
    <div class="tit">{{ sort }}. 是否显示楼层数</div>
    <input type="checkbox" v-model="localChecked" @change="handleChange">
  </div>
</template>

<script>
export default {
  props: {
    value: {
 type: Boolean,
      default: false,
    },
    sort: {
      type: Number,
      required: true,
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
      this.$emit("update:value", this.localChecked);
    },
    init() {
      $(".topic-post").each(function () {
        const num = $(this)
          .find("article")
          .attr("id")
          .replace(/^post_/, "");
        if ($(this).find(".linuxfloor").length < 1) {
          $(this).find(".post-infos").append(`<span class="linuxfloor">#${num}</span>`);
        }
      });
    },
  },
  created() {
    if (this.localChecked) {
      let pollinglength2 = 0;
      setInterval(() => {
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
