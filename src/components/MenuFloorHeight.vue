<template>
  <!-- 自动展开回复 -->
  <div class="item">
    <div class="tit">{{ sort }}. 智能限制楼层高度</div>
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
      $("head").append(`<style>
      .topic-body .cooked{max-height:600px!important;overflow-y:auto!important;}
      </style>`);
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
