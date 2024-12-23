<template></template>

<script>
import $ from "jquery";
export default {
  created() {
    setTimeout(() => {
      const isShowplugininstallationprompts = localStorage.getItem(
        "isShowplugininstallationprompts"
      );
      if (isShowplugininstallationprompts == "true") {
      } else {
        if ($(".UsageTip").length < 1) {
          $(".sidebar-footer-container").before(`
            <dialog open class="UsageTip">
              <div class="title">友情提示</div>
              <div>
                佬友你好，你已经成功安装 linuxdo 增强插件啦！<a
                  href="https://linuxdo-scripts-docs.netlify.app/"
                  target="_blank">
                  使用文档
                  </a>
              </div>
              <div style="color:#e00">
                设置按钮在下方切换主题的旁边哦~ 有个小齿轮，点击它开始配置插件！
              </div>
              <div>如果可以的话欢迎点个 star 支持一下~</div>
              <div>
                <a href="https://github.com/dlzmoe/linuxdo-scripts/" target="_blank">
                  <img
                    src="https://img.shields.io/github/stars/dlzmoe%2Flinuxdo-scripts?style=for-the-badge&labelColor=%235D5D5D&color=%23E97435"
                    alt="icon"
                  />
                </a>
              </div>
              <button class="clicktohide">点击我，该提示永远不会出现啦</button>
            </dialog>
           `);

          $(".clicktohide").click(function () {
            localStorage.setItem("isShowplugininstallationprompts", true);
            $(".UsageTip").remove();
          });
        }
      }
    }, 100);
  },
};
</script>

<style lang="less">
.UsageTip {
  position: static;
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  background: var(--d-sidebar-background);
  color: var(--primary-medium);

  & > div {
    margin: 10px 0;
  }
  button {
    padding: 8px 10px;
    margin-bottom: 10px;
    border: none;
    outline: none;
    border-radius: 4px;
  }
}

</style>
