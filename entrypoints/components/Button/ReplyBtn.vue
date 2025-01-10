<template>
  <div class="replaybtn">
    <div class="el-button" @click="replaybtn" type="primary" title="回复">
      回复
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  methods: {
    replaybtn() {
      $('button[title="开始撰写此话题的回复"]')[0].click()
    },
  },
}
</script>
