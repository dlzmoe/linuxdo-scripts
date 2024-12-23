<template>
  <div class="el-button" :class="{ act: status }" @click="autoread" title="自动阅读">
    <svg
      v-if="status == false"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path
        d="M12.088 4.82a10 10 0 0 1 9.412 .314a1 1 0 0 1 .493 .748l.007 .118v13a1 1 0 0 1 -1.5 .866a8 8 0 0 0 -8 0a1 1 0 0 1 -1 0a8 8 0 0 0 -7.733 -.148l-.327 .18l-.103 .044l-.049 .016l-.11 .026l-.061 .01l-.117 .006h-.042l-.11 -.012l-.077 -.014l-.108 -.032l-.126 -.056l-.095 -.056l-.089 -.067l-.06 -.056l-.073 -.082l-.064 -.089l-.022 -.036l-.032 -.06l-.044 -.103l-.016 -.049l-.026 -.11l-.01 -.061l-.004 -.049l-.002 -.068v-13a1 1 0 0 1 .5 -.866a10 10 0 0 1 9.412 -.314l.088 .044l.088 -.044z"
      />
    </svg>
    <svg
      v-if="status == true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon icon-tabler icons-tabler-outline icon-tabler-loader"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 6l0 -3" />
      <path d="M16.25 7.75l2.15 -2.15" />
      <path d="M18 12l3 0" />
      <path d="M16.25 16.25l2.15 2.15" />
      <path d="M12 18l0 3" />
      <path d="M7.75 16.25l-2.15 2.15" />
      <path d="M6 12l-3 0" />
      <path d="M7.75 7.75l-2.15 -2.15" />
    </svg>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  data() {
    return {
      num: 10, // 滚动速度
      isScrolling: false,
      scrollInterval: null,

      status: false,
    };
  },
  methods: {
    scrollToBottomSlowly(distancePerStep = this.num, delayPerStep = 50) {
      if (this.scrollInterval !== null) {
        clearInterval(this.scrollInterval);
      }
      this.scrollInterval = setInterval(() => {
        // 获取当前页面的高度
        const documentHeight = document.body.scrollHeight;
        const windowHeight = window.innerHeight;
        const scrollPosition = window.scrollY;

        // 检查是否已经到达页面底部
        if (scrollPosition + windowHeight >= documentHeight - 1) {
          clearInterval(this.scrollInterval);
          this.scrollInterval = null;
          this.isScrolling = false;
          this.status = false;
        } else {
          window.scrollBy(0, distancePerStep);
        }
      }, delayPerStep);
    },
    autoread() {
      if (this.isScrolling) {
        clearInterval(this.scrollInterval);
        this.scrollInterval = null;
        this.isScrolling = false; // 停止滚动，更新状态
        this.status = false;
      } else {
        this.scrollToBottomSlowly();
        this.isScrolling = true; // 开始滚动，更新状态
        this.status = true;
      }
    },
  },
  created() {
    let linxudoscriptssetting = localStorage.getItem("linxudoscriptssetting");
    if (linxudoscriptssetting) {
      linxudoscriptssetting = JSON.parse(linxudoscriptssetting);
      this.num = Number(linxudoscriptssetting.checked8.value2);
    }
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

    svg {
      animation: spin 3s linear infinite;
    }
  }
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
