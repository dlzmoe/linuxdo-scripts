<template>
  <div class="item">
    <div class="tit">{{ sort }}. 是否新标签页打开话题</div>
    <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)" />
  </div>
</template>
<script>
import $ from "jquery";
export default {
  props: ["modelValue", "sort"],
  emits: ["update:modelValue"],
  data() {
    return {
      eventListeners: [],
      lastHtml: "", // 用于存储上一次的 HTML
    };
  },
  methods: {
    createSuperLabel(url, id) {
      let a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("target", "_blank");
      a.setAttribute("id", id);
      if (!document.getElementById(id)) {
        document.body.appendChild(a);
      }
      a.click();
    },
    init() {
      this.removeEventListeners();
      $("a").each((index, element) => {
        const url = $(element).attr("href");
        if (url && url.includes('/t/topic/')) {
          const listener = (event) => {
            event.preventDefault();
            this.createSuperLabel(url, url);
          };
          $(element).on("click", listener);
          this.eventListeners.push({ element, listener });
        }
      });
    },
    removeEventListeners() {
      this.eventListeners.forEach(({ element, listener }) => {
        $(element).off("click", listener);
      });
      this.eventListeners = [];
    },
  },
  watch: {
    modelValue(newVal) {
      if (newVal) {
        this.init();
        // 初始存储 HTML
        this.lastHtml = document.body.innerHTML;
        setInterval(() => {
          const currentHtml = document.body.innerHTML;
          if (currentHtml !== this.lastHtml) {
            this.lastHtml = currentHtml;
            this.init();
          }
        }, 1000);
      } else {
        this.removeEventListeners();
      }
    }
  },
  mounted() {
    if (this.modelValue) {
      this.init();
      // 初始存储 HTML
      this.lastHtml = document.body.innerHTML;
      setInterval(() => {
        const currentHtml = document.body.innerHTML;
        if (currentHtml !== this.lastHtml) {
          this.lastHtml = currentHtml;
          this.init();
        }
      }, 1000);
    }
  },
  beforeDestroy() {
    this.removeEventListeners();
  },
};
</script>