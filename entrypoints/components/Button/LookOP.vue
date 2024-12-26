<template>
  <div class="lookopbtn">
    <div class="el-button" :class="{ act: status }" @click="lookop" title="只看楼主">
      楼主
    </div>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  data() {
    return {
      status: false,
    };
  },
  methods: {
    lookop() {
      this.status = !this.status;
      $(".post-stream").toggleClass("lookopwrapactive");
    },
  },
  created() {
    $("head").append(`<style>
.post-stream.lookopwrapactive .topic-post{display:none !important;}
.post-stream.lookopwrapactive .topic-post.topic-owner{display: block !important;}
    </style>`);
  },
};
</script>

<style lang="less" scoped>
.el-button {
  &.act {
    background: linear-gradient(
      to right,
      var(--tertiary-low),
      var(--tertiary-high)
    ) !important;
  }
}
</style>