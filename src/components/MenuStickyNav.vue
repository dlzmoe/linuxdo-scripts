<template>
  <div class="item">
    <div class="tit">{{ sort }}. 开启列表页导航栏浮动</div>
    <input type="checkbox" v-model="localChecked" @change="handleChange" />
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
  },
  created() {
    if (this.localChecked) {
      $(window).on("scroll", function () {
        if ($(window).scrollTop() >= 250) {
          $(".navigation-container").addClass("is-active");
        } else {
          $(".navigation-container").removeClass("is-active");
        }
      });

      $("head").append(`<style>
        .navigation-container.is-active{position:fixed;top:65px;background:#fff!important;z-index:9;box-shadow:1px 3px 7px 0 rgba(0,0,0,.2);margin-left:-30px;padding-left:30px;border-radius:5px;padding-top:10px;padding-right:20px;min-width:1000px;width:auto}
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
