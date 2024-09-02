<template>
  <div class="el-button" @click="lookop" title="只看楼主">楼主</div>
</template>

<script>
export default {
  data() {
    return {};
  },
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
