<template>
  <!-- 开启左侧快速访问 -->
  <div class="item">
    <div class="tit">{{ sort }}. 开启左侧快速访问</div>
    <template>
      <el-checkbox v-model="localChecked" @change="handleChange"></el-checkbox>
    </template>
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
      this.$emit("input", this.localChecked);
    },
    init() {
      $(".sidebar-custom-sections>div:nth-child(1)").after(`
        <div data-section-name="快速访问" class=" sidebar-section-wrapper sidebar-section--expanded">
          <div class="sidebar-section-header-wrapper sidebar-row" id="MenuQuickAccess">
            <button class="btn no-text sidebar-section-header sidebar-section-header-collapsable btn-transparent">
              <span class="sidebar-section-header-caret">
                <svg class="fa d-icon d-icon-angle-down svg-icon svg-string" xmlns="http://www.w3.org/2000/svg">
                  <use href="#angle-down"></use>
                </svg>
              </span>
              <span class="sidebar-section-header-text">快速访问</span>
            </button>
          </div>
          <ul class="sidebar-section-content">

            <li class="sidebar-section-link-wrapper">
              <a href="/bookmarks" class="sidebar-section-link sidebar-row">
                <span class="sidebar-section-link-prefix icon">
                  <svg class="fa d-icon d-icon-bookmark svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#bookmark"></use></svg>
                </span>
                <span class="sidebar-section-link-content-text">我的书签</span>
              </a>
            </li>

          </ul>
        </div>
      `);

      $("#MenuQuickAccess").click(function () {
        $(this).find(".sidebar-section-header-caret").toggleClass("right");
        $(this).siblings(".sidebar-section-content").slideToggle();
      });
    },
  },
  created() {
    if (this.localChecked) {
      setInterval(() => {
        if ($("#MenuQuickAccess").length < 1) {
          this.init();
        }
      }, 1000);
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
<style>
.sidebar-section-header-caret.right {
  transform: rotate(-90deg);
}
</style>
