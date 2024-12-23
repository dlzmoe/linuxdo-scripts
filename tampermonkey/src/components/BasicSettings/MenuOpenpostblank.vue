<template>
  <div class="item">
    <div class="tit">{{ sort }}. 是否新标签页打开话题</div>
    <input
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
  </div>
</template>

<script>
export default {
  props: ["modelValue", "sort"],
  emits: ["update:modelValue"],
  data() {
    return {
      eventListeners: [],
    };
  },
  methods: {
    createSuperLabel(url, id) {
      let a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("target", "_blank");
      a.setAttribute("id", id);
      // 防止反复添加
      if (!document.getElementById(id)) {
        document.body.appendChild(a);
      }
      a.click();
    },
    init() {
      // 移除之前的事件监听器
      this.removeEventListeners();
      // 添加新的事件监听器
      $(".topic-list a.title,.topic .search-link").each((index, element) => {
        const listener = (event) => {
          event.preventDefault();
          var url = $(element).attr("href");
          // window.open(url, "_blank");
          this.createSuperLabel(url, url);
        };
        $(element).on("click", listener);
        this.eventListeners.push({ element, listener });
      });
    },
    removeEventListeners() {
      this.eventListeners.forEach(({ element, listener }) => {
        $(element).off("click", listener);
      });
      this.eventListeners = [];
    },
  },
  created() {
    if (this.modelValue) {
      let pollinglength1 = 0;
      let pollinglength2 = 0;
      setInterval(() => {
        if (pollinglength1 != $(".topic-list-body tr").length) {
          pollinglength1 = $(".topic-list-body tr").length;
          this.init();
        }
        if (pollinglength2 != $(".post-stream .topic-post").length) {
          pollinglength2 = $(".post-stream .topic-post").length;
          this.init();
        }
      }, 1000);
    }
  },
  beforeDestroy() {
    // 组件销毁前移除所有事件监听器
    this.removeEventListeners();
  },
};
</script>
