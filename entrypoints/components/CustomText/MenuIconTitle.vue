<template>
  <div class="item">
    <div class="tit">{{ sort }}. 自定义论坛标签页 icon 和 title</div>
  </div>
  <input type="text" v-model="localChecked.iconurl" @input="handleChange"
    placeholder="输入图片链接，如: https://xxx.com/images.png" />

  <input type="text" v-model="localChecked.title" @input="handleChange" placeholder="输入文字，如：谷歌文档" />
</template>

<script>
export default {
  props: {
    sort: {
      type: Number,
      required: true,
    },
    value: {
      type: Object,
      default: {
        iconurl: '',
        title: '',
      },
    },
  },
  data() {
    return {
      localChecked: this.value
    }
  },
  watch: {
    value(newValue) {
      this.localChecked = newValue
    },
  },
  methods: {
    handleChange() {
      this.$emit('update:value', this.localChecked)
    },

    updateFavicon() {
      if (this.localChecked.iconurl && this.localChecked.iconurl !== '') {
        const favicon = document.querySelector('head link[rel="icon"]');
        if (favicon && favicon.getAttribute('href') !== this.localChecked.iconurl) {
          favicon.setAttribute('href', this.localChecked.iconurl);
        }
      }
    },

    updateTitle() {
      if (this.localChecked.title && this.localChecked.title !== '') {
        const title = document.querySelector('head title');
        if (title && title.innerHTML !== this.localChecked.title) {
          title.innerHTML = this.localChecked.title;
        }
      }
    }
  },
  created() {
    const observer = new MutationObserver((mutations) => {
      this.updateFavicon();
      this.updateTitle();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });

    document.addEventListener('DOMContentLoaded', () => {
      this.updateFavicon();
      this.updateTitle();
    });

  },
}
</script>

<style lang="less" scoped>
.item {
  border: none !important;
}
</style>
