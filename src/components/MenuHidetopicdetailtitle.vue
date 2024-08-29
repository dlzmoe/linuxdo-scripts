<template>
  <!-- 隐藏话题详情顶部大标题 -->
  <div class="item">
    <div class="tit">{{ sort }}. 隐藏话题详情顶部大标题</div>
    <input type="checkbox" v-model="localChecked" @change="handleChange">
  </div>
</template>

<script>
export default {
  props: {
    value: {
     type: Object,
      default: {
        value: false,
      },
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
  },
  created() {
    if (this.localChecked) {
      $("head").append(`<style>.header-title{display:none!important}</style>`);
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
