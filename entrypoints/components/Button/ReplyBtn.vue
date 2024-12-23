<template>
  <div class="replaybtn">
    <div
      class="el-button"
      style="font-size: 18px"
      @click="replaybtn"
      type="primary"
      title="回复"
    >
      <svg
        class="fa d-icon d-icon-reply svg-icon svg-string"
        xmlns="http://www.w3.org/2000/svg"
      >
        <use href="#reply"></use>
      </svg>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  methods: {
    replaybtn() {
      $('button[title="开始撰写此话题的回复"]')[0].click();
    },
  },
};
</script>
