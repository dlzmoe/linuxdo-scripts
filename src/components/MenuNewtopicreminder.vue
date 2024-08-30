<template>
  <!-- 新话题提醒 -->
  <div class="item">
    <div class="tit">{{ sort }}. 是否开启新话题提醒</div>
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
      if ($("#list-area .show-more").length > 0) {
        $("head title").html("【有新话题赶紧来水！！】");
      }
    },
  },
  created() {
    if (this.localChecked) {
      setInterval(() => {
        this.init();
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
