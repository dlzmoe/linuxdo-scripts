<template>
  <div class="lookopbtn">
    <div class="el-button" @click="lookop" title="只看楼主">楼主</div>
  </div>
</template>

<script>
export default {
  methods: {
    lookop() {
      $(".post-stream").toggleClass("lookopwrapactive");
    },
  },
};
</script>
<style lang="less">
.post-stream {
  &.lookopwrapactive {
    .topic-post {
      display: none !important;

      &.topic-owner {
        display: block !important;
      }
    }
  }
}
</style>
