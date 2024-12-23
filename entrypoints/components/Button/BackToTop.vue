<template>
  <div class="backtotop">
    <div
      class="el-button"
      style="font-size: 18px"
      @click="scrollToTop"
      type="primary"
      title="返回顶部"
    >
      <svg
        class="fa d-icon d-icon-arrow-up svg-icon svg-string"
        xmlns="http://www.w3.org/2000/svg"
      >
        <use href="#arrow-up"></use>
      </svg>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  methods: {
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }
}
</script>
