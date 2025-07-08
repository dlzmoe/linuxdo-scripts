<template>
  <div class="item">
    <div class="tit">{{ sort }}. 是否开启话题预览功能 (模态预览；与 7 互斥)</div>
    <input
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
  </div>
</template>

<script>
import $ from "jquery";
export default {
  props: ["modelValue", "sort"],
  emits: ["update:modelValue"],
  data() {
    return {
      checked1: false,
      initTimer: null,
      observer: null,
      keydownHandler: null,
      wheelHandler: null,
    };
  },
  methods: {
    init() {
      $(".topic-list .main-link a.title").each(function () {
        const id = $(this).attr("data-topic-id");
        if ($(this).parents(".link-top-line").find(".topicpreview-btn").length < 1) {
          $(this)
            .parents(".link-top-line")
            .append(
              `<button class="btn btn-icon-text btn-default topicpreview-btn" data-id="${id}">预览</button>`
            );
        }
      });
    },
    clearAllTimers() {
      if (this.initTimer) {
        clearInterval(this.initTimer);
        this.initTimer = null;
      }
      
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
      
      // 移除事件监听器
      if (this.keydownHandler) {
        $(document).off("keydown", this.keydownHandler);
      }
      
      if (this.wheelHandler) {
        $(window).off("wheel touchmove", this.wheelHandler);
      }
    }
  },
  created() {
    if (this.modelValue) {
      $("head").append(`<style>
.modal-overlay{display:none;position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,.75);z-index:9999;overflow:hidden;cursor:pointer}
.modal-content{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;padding:0;border-radius:12px;width:90%;max-width:1400px;height:90%;z-index:10000;display:flex;flex-direction:column;box-shadow:0 5px 15px rgba(0,0,0,.3);overflow:hidden;cursor:default}
.modal-body{flex:1;width:100%;height:100%;position:relative;overflow:hidden}
.modal-iframe{width:100%;height:100%;border:none}
body.modal-open{overflow:hidden!important;padding-right:17px}
html.modal-open-html{overflow:hidden!important}
      </style>`);

      this.initTimer = setInterval(() => {
        if (window.location.href != "https://linux.do/latest?state=muted") {
          this.init();
        }
      }, 1000);

      // 创建模态窗口 HTML
      const modalHTML = `
        <div class="modal-overlay">
          <div class="modal-content">
            <div class="modal-body">
              <iframe class="modal-iframe" frameborder="0"></iframe>
            </div>
          </div>
        </div>
    `;

      // 添加模态窗口到页面
      $("body").append(modalHTML);

      let scrollPosition = 0;

      // 替换所有帖子链接的点击事件
      function handleTopicLinks() {
        $(".topicpreview-btn").each(function () {
          const $link = $(this);
          const originalHref = `/t/topic/${$(this).attr("data-id")}`;

          // 添加自定义点击事件
          $link.click(function (e) {
            e.preventDefault();
            e.stopPropagation();

            const $modalOverlay = $(".modal-overlay");
            const $iframe = $(".modal-iframe");

            // 保存当前滚动位置
            scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

            $iframe.attr("src", originalHref);
            $modalOverlay.fadeIn();

            // 先添加样式
            $("html").addClass("modal-open-html");
            $("body").addClass("modal-open");

            // 设置 body 的 top 值来保持视觉位置
            $("body").css({
              position: "fixed",
              top: -scrollPosition + "px",
              width: "100%",
            });

            return false;
          });
        });
      }

      // 初始执行一次
      handleTopicLinks();

      // 监听 DOM 变化，处理动态加载的链接
      this.observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          if (mutation.addedNodes.length) {
            handleTopicLinks();
          }
        });
      });

      this.observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // 关闭模态窗口
      function closeModal() {
        $(".modal-overlay").fadeOut();

        // 移除 body 的 fixed 定位
        $("body").css({
          position: "",
          top: "",
          width: "",
        });

        // 移除类
        $("html").removeClass("modal-open-html");
        $("body").removeClass("modal-open");

        // 恢复滚动位置
        window.scrollTo(0, scrollPosition);

        // 清空 iframe
        $(".modal-iframe").attr("src", "");
      }

      $(".modal-overlay").click(function (e) {
        if (!$(e.target).closest(".modal-content").length) {
          closeModal();
        }
      });

      // ESC 键关闭模态窗口
      this.keydownHandler = function(e) {
        if (e.keyCode === 27) {
          closeModal();
        }
      };
      $(document).keydown(this.keydownHandler);

      // 禁用外部滚动
      this.wheelHandler = function(e) {
        if ($("body").hasClass("modal-open")) {
          e.preventDefault();
          e.stopPropagation();
        }
      };
      $(window).on("wheel touchmove", this.wheelHandler);
    }
  },
  beforeUnmount() {
    this.clearAllTimers();
  },
  beforeDestroy() {
    this.clearAllTimers();
  },
};
</script>
