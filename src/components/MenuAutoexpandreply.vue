<template>
  <!-- 自动展开回复 -->
  <div class="item">
    <div class="tit">{{ sort }}. 是否自动展开回复</div>
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
      $("nav.post-controls .show-replies").each(function () {
        $(this).click();
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
