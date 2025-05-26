<template>
  <div class="backtotop">
    <div
      class="el-button"
      @click="scrollToOne"
      type="primary"
      title="直达一楼"
    >
      <span>一楼</span>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  methods: {
    scrollToOne() {
      if ($("#topic-title h1 a").length < 1) {
        const regex = /^(https:\/\/linux\.do\/t\/topic\/\d+)(\/\d+)?(\?.*)?$/;
        const match = window.location.href.match(regex)[1];
        console.log("Redirecting to:", match);
        window.location.href = match;
      } else {
        $("#topic-title h1 a")[0].click();
      }
    },
  },
};
</script>
