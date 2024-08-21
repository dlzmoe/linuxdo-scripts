<template>
  <div id="linuxdoscripts">
    <div class="linuxdoscripts-opacity"></div>
    <div class="setting-btn">
      <AIDialog v-show="showaidialog" /> <!-- 显示 AI 对话网站 -->
      <LevelDiglog v-show="showlevelsearch" /> <!-- 查询等级功能 -->
      <AutoRead v-show="showautoread" /> <!-- 自动阅读按钮 -->
      <LookOP v-show="showlookop" /> <!-- 只看楼主 -->
    </div>

    <dialog open id="menu_suspendedball">
      <div class="title">linuxdo 增强插件设置</div>
      <div class="close" @click="closedialog">+</div>
      <ul class="menu-nav">
        <li class="act">基础设置</li>
        <li>自定义文字</li>
        <li>用户标签</li>
      </ul>
      <div class="menu-body">
        <div class="menu-body-item act">
          <div class="menu-about">
            <p>请注意，该设置面板数据全部保存在本地浏览器缓存中，注意备份。</p>
            <p class="hint">
              如果感觉哪里不太对劲，点我<span
                class="initialization"
                @click="initialization"
                >初始化设置</span
              >，会清除全部所有的设置数据并初始化，慎重使用！
            </p>
          </div>

          <!-- 新标签页打开 -->
          <MenuOpenpostblank :sort="1" v-model="settingData.checked1" />
          <!-- 新话题提醒 -->
          <MenuNewtopicreminder :sort="2" v-model="settingData.checked2" />
          <!-- 自动展开回复 -->
          <MenuAutoexpandreply :sort="3" v-model="settingData.checked3" />
          <!-- 话题列表显示创建时间 -->
          <MenuShowcreatetime :sort="4" v-model="settingData.checked4" />
          <MenuShowcreatetime1 :sort="4.1" v-model="settingData.checked41" />
          <!-- 显示楼层数 -->
          <MenuShowfloors :sort="5" v-model="settingData.checked5" />
          <!-- 隐藏话题详情顶部大标题 -->
          <MenuHidetopicdetailtitle :sort="6" v-model="settingData.checked6" />
          <!-- 话题预览功能 -->
          <MenuTopicpreview :sort="7" v-model="settingData.checked7" />
          <!-- 显示自动阅读按钮 -->
          <MenuAutoRead :sort="8" v-model="settingData.checked8" />
          <!-- 只看楼主按钮 -->
          <MenuLookOP :sort="9" v-model="settingData.checked9" />
          <!-- 智能限制楼层高度 -->
          <MenuFloorHeight :sort="10" v-model="settingData.checked10" />
          <!-- 中英文混排优化显示 -->
          <MenuPangu :sort="11" v-model="settingData.checked11" />
          <!-- 是否显示等级查询按钮 -->
          <MenuLevelSearch :sort="12" v-model="settingData.checked12" />
          <!-- 消息通知仅显示未读 -->
          <MenuShowUnread :sort="13" v-model="settingData.checked13" />
          <!-- 是否屏蔽模糊文字 -->
          <MenuFilterText :sort="14" v-model="settingData.checked14" />
          <!-- 只看自己签名 -->
          <MenuLookmeSign :sort="15" v-model="settingData.checked15" />
          <!-- 开启左侧快速访问 -->
          <MenuQuickAccess :sort="16" v-model="settingData.checked16" />
          <!-- 切换论坛表情风格 -->
          <MenureplaceEmojiStyle :sort="17" v-model="settingData.checked17" />
          <!-- 显示 AI 对话网站 -->
          <MenuShowAI :sort="18" v-model="settingData.checked18" />
          <!-- 检测更新 -->
          <Updates />
        </div>
        <div class="menu-body-item">
          <!-- 自定义论坛 logo -->
          <MenuLogoUrl :sort="1" v-model="settingData.logourl" />
          <!-- 自定义快捷回复 -->
          <MenuCreatereply :sort="2" v-model="settingData.QuickReply" />
          <!-- 屏蔽指定用户 -->
          <MenuBlockuserlist :sort="3" v-model="settingData.blockList" />
          <!-- 自定义 CSS -->
          <MenuOtherCss :sort="4" v-model="settingData.othercss" />
        </div>
        <div class="menu-body-item">
          <UserTags />
        </div>
      </div>

      <div class="menu-footer">
        <input
          type="file"
          id="fileInput"
          ref="fileInput"
          style="display: none"
          accept=".json"
          @change="handleFileUpload"
        />

        <button class="btn save" @click="save">保存</button>
        <button class="btn saveload" @click="saveload">保存并刷新</button>
        <button class="btn floorlottery" @click="openFloorlottery">楼层抽奖</button>

        <button class="btn import" @click="triggerFileInput">导入</button>
        <button class="btn export" @click="exportData">导出</button>
      </div>
    </dialog>

    <!-- 楼层抽奖 -->
    <dialog open v-show="floorlotteryDialog">
      <div class="title">楼层抽奖</div>
      <div class="menu-body">
        <el-input v-model="floorlotteryval1" placeholder="请输入总数"></el-input>
        <el-input v-model="floorlotteryval2" placeholder="请输入抽取的数量"></el-input>
        <el-button type="primary" @click="drawRandomNumbers">开始抽奖</el-button>
        <el-button type="primary" plain @click="closelotter">关闭弹窗</el-button>
        <div style="height: 20px"></div>
        <div v-if="floorlotterloading">正在抽奖...</div>
        <el-alert v-if="floorlotterresult" title="抽奖结果" type="success">
          {{ floorlotterresult }}
        </el-alert>
      </div>
    </dialog>

    <!-- 使用提示 -->
    <UsageTip />
    <!-- 回复弹窗显示贴吧表情 -->
    <ReplyTBEnjoy />
    <!-- 帖子生成分享图 -->
    <!-- <ShareImages /> -->
  </div>
</template>

<script>
import MenuOpenpostblank from "./components/MenuOpenpostblank.vue";
import MenuNewtopicreminder from "./components/MenuNewtopicreminder.vue";
import MenuAutoexpandreply from "./components/MenuAutoexpandreply.vue";
import MenuShowcreatetime from "./components/MenuShowcreatetime.vue";
import MenuShowcreatetime1 from "./components/MenuShowcreatetime1.vue";
import MenuShowfloors from "./components/MenuShowfloors.vue";
import MenuHidetopicdetailtitle from "./components/MenuHidetopicdetailtitle.vue";
import MenuTopicpreview from "./components/MenuTopicpreview.vue";
import MenuCreatereply from "./components/MenuCreatereply.vue";
import MenuBlockuserlist from "./components/MenuBlockuserlist.vue";
import MenuAutoRead from "./components/MenuAutoRead.vue";
import AutoRead from "./components/AutoRead.vue";
import Updates from "./components/Updates.vue";
import MenuLookOP from "./components/MenuLookOP.vue";
import LookOP from "./components/LookOP.vue";
import LevelDiglog from "./components/LevelDiglog.vue";
import UsageTip from "./components/UsageTip.vue";
import MenuFloorHeight from "./components/MenuFloorHeight.vue";
import UserTags from "./components/UserTags.vue";
import MenuOtherCss from "./components/MenuOtherCss.vue";
import MenuLogoUrl from "./components/MenuLogoUrl.vue";
import ReplyTBEnjoy from "./components/ReplyTBEnjoy.vue";
import MenuPangu from "./components/MenuPangu.vue";
import MenuLevelSearch from "./components/MenuLevelSearch.vue";
import MenuShowUnread from "./components/MenuShowUnread.vue";
import MenuFilterText from "./components/MenuFilterText.vue";
import MenuLookmeSign from "./components/MenuLookmeSign.vue";
import ShareImages from "./components/ShareImages.vue";
import MenuQuickAccess from "./components/MenuQuickAccess.vue";
import MenureplaceEmojiStyle from "./components/MenureplaceEmojiStyle.vue";
import MenuShowAI from "./components/MenuShowAI.vue";
import AIDialog from "./components/AIDialog.vue";

export default {
  components: {
    MenuOpenpostblank,
    MenuNewtopicreminder,
    MenuAutoexpandreply,
    MenuShowcreatetime,
    MenuShowcreatetime1,
    MenuShowfloors,
    MenuHidetopicdetailtitle,
    MenuTopicpreview,
    MenuCreatereply,
    MenuBlockuserlist,
    MenuAutoRead,
    AutoRead,
    Updates,
    MenuLookOP,
    LookOP,
    LevelDiglog,
    UsageTip,
    MenuFloorHeight,
    UserTags,
    MenuOtherCss,
    MenuLogoUrl,
    ReplyTBEnjoy,
    MenuPangu,
    MenuLevelSearch,
    MenuShowUnread,
    MenuFilterText,
    MenuLookmeSign,
    ShareImages,
    MenuQuickAccess,
    MenureplaceEmojiStyle,
    MenuShowAI,
    AIDialog,
  },
  data() {
    return {
      opacity: false,
      open: false,

      floorlotteryDialog: false,
      floorlotteryval1: "",
      floorlotteryval2: "",
      floorlotterloading: false,
      floorlotterresult: "",

      // 设置数据
      settingData: {
        checked1: false,
        checked2: false,
        checked3: false,
        checked4: false,
        checked41: false,
        checked5: false,
        checked6: false,
        checked7: false,
        checked8: {
          value1: false,
          value2: "10",
        },
        checked9: false,
        QuickReply: "前排围观支持一下\n感谢分享大佬厉害啊\n有点厉害支持~~",
        blockList: "",
        checked10: false,
        othercss: "",
        logourl: "",
        checked11: false,
        checked12: false,
        checked13: false,
        checked14: false,
        checked15: false,
        checked16: false,
        checked17: {
          value1: false,
          value2: "twitter",
        },
        checked18: false,
        checked19: false,
      },

      showautoread: false,
      showlookop: false,
      showlevelsearch: false,
      showaidialog: false,
    };
  },
  methods: {
    // 关闭弹窗
    closedialog() {
      $(".linuxdoscripts-opacity").hide();
      $("#menu_suspendedball").hide();
    },
    // 保存设置
    save() {
      console.log(this.settingData);
      localStorage.setItem("linxudoscriptssetting", JSON.stringify(this.settingData));

      this.$message.success("保存成功！");
      $(".linuxdoscripts-opacity").hide();
      $("#menu_suspendedball").hide();
    },
    saveload() {
      this.save();
      location.reload();
    },
    // 导入数据
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file && file.type === "application/json") {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const jsonData = JSON.parse(e.target.result);
            this.importData(jsonData);
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        };
        reader.readAsText(file);
      } else {
        console.error("Please select a valid JSON file.");
      }
    },
    importData(data) {
      // 处理导入的数据
      this.$message.success("导入成功！");
      console.log(data);
      this.settingData = data;
    },
    // 导出数据
    exportData() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const formattedDate = year + month + day;

      const dataStr = JSON.stringify(this.settingData, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `linuxdo-script-data-${formattedDate}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      this.$message.success("导出成功！");
    },
    // 打开抽奖弹窗
    openFloorlottery() {
      $("#menu_suspendedball").hide();
      this.floorlotteryDialog = true;
    },
    // 开始抽奖
    drawRandomNumbers() {
      if (this.floorlotteryval1 === "" || this.floorlotteryval2 === "") {
        this.$message.warning("请输入有效的数字");
        return false;
      }

      const total = parseInt(this.floorlotteryval1);
      const count = parseInt(this.floorlotteryval2);

      if (isNaN(total) || isNaN(count) || total <= 0 || count <= 0 || count > total) {
        this.$message.warning("请输入有效的数字");
        return false;
      }

      this.floorlotterloading = true;
      this.floorlotterresult = "";

      setTimeout(() => {
        const result = this.getRandomNumbers(total, count);
        this.floorlotterresult = result.join(", ");
        this.floorlotterloading = false;
      }, 1000); // 模拟异步操作
    },
    getRandomNumbers(total, count) {
      const numbers = Array.from({ length: total }, (_, i) => i + 1);
      const result = [];

      for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * numbers.length);
        result.push(numbers[randomIndex]);
        numbers.splice(randomIndex, 1);
      }

      return result;
    },
    closelotter() {
      this.floorlotteryDialog = false;
      $(".linuxdoscripts-opacity").hide();
    },
    // 默认运行脚本
    runscripts() {
      $(".linuxdoscripts-setting").click(function () {
        $(".linuxdoscripts-opacity").show();
        $("#menu_suspendedball").show();
      });

      const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (isDarkMode) {
        $("body").addClass("dark-theme");
      } else {
        $("body").removeClass("dark-theme");
      }

      const discourse_color_scheme_override = localStorage.getItem(
        "discourse_color_scheme_override"
      );
      if (discourse_color_scheme_override) {
        if (discourse_color_scheme_override == "dark") {
          $("body").addClass("dark-theme");
        } else {
          $("body").removeClass("dark-theme");
        }
      }

      $(".signature-img").each(function () {
        var self = $(this);
        if (self.siblings(".signature-p").length < 1) {
          var url = self.attr("src");

          // 先判断是否带 http
          if (url.indexOf("http") < 0) {
            self.after(
              `<p class="signature-p">${url}（该用户签名非图片格式，已自动转文字）</p>`
            );
            self.hide();
          } else {
            // 在带 http 的链接中判断是否是域名，大几率是博客域名
            var str = url.replace(/\/+$/, "");
            var domainPattern = /\.(com|org|net|edu|gov|co|cn|io|info|biz|me|us|uk|au|de|fr|jp|ru|ch|it|nl|se|no|es|mil|int|arpa|asia|museum|name|pro|coop|aero|cat|jobs|mobi|travel|xxx|idv|tv|cc|ws|bz|nu|tk|fm|ag|am|at|be|bg|cd|cf|cg|ch|cl|cm|cz|dk|dm|ec|ee|es|eu|fi|ga|gd|gf|gg|gl|gp|gr|hm|hr|ht|hu|im|io|is|je|ke|kg|ki|kr|kz|la|lc|li|lt|lu|lv|ma|mc|md|ms|mt|mu|mx|my|nf|ng|nl|no|nz|pa|pe|pf|pg|pl|pm|pn|pr|pt|pw|re|ro|rs|sa|sb|sc|sg|sh|si|sk|sm|sn|so|st|su|sx|tc|tf|tk|tl|tm|to|tr|tt|tw|ua|ug|uy|uz|vc|ve|vg|vn|vu|wf|xyz|yt|za|zm|zw)$/i;

            if (domainPattern.test(url)) {
              self.after(
                `<p class="signature-p">${url}（该用户签名非图片格式，已自动转文字）</p>`
              );
              self.hide();
            } else if (url.indexOf("photos.google.com") !== -1) {
              // 判断是否是 google photo
              self.after(
                `<p class="signature-p">${url}（该用户签名非图片格式，已自动转文字）</p>`
              );
              self.hide();
            }
          }
        }
      });

      if ($(".menu-nav").length > 0) {
        $(".menu-nav li").each(function () {
          $(this).click(function () {
            const num = $(this).index();
            $(".menu-nav li").removeClass("act");
            $(this).addClass("act");
            $(".menu-body-item").removeClass("act");
            $(".menu-body-item").eq(num).addClass("act");

            if (num == 2) {
              $(".menu-footer").addClass("hides");
            } else {
              $(".menu-footer").removeClass("hides");
            }
          });
        });
      }
    },
    // 初始化设置
    initialization() {
      localStorage.removeItem("linxudoscriptssetting");
      this.$message.success("初始化设置成功，即将自动刷新！");
      setTimeout(() => {
        location.reload();
      }, 1000);
    },
  },
  created() {
    setInterval(() => {
      if ($(".linuxdoscripts-setting").length < 1) {
        $(".sidebar-footer-actions")
          .prepend(`<button class="btn no-text btn-icon color-scheme-toggler btn-flat linuxdoscripts-setting" title="设置" type="button">
        <svg
          class="fa d-icon d-icon-cog svg-icon svg-string"
          xmlns="http://www.w3.org/2000/svg"
        >
          <use href="#cog"></use>
        </svg>
    </button>`);
      }
    }, 1000);

    const linxudoscriptssetting = localStorage.getItem("linxudoscriptssetting");
    if (linxudoscriptssetting) {
      this.settingData = JSON.parse(linxudoscriptssetting);
      this.showautoread = this.settingData.checked8.value1;
      this.showlookop = this.settingData.checked9;
      this.showlevelsearch = this.settingData.checked12;
      this.showaidialog = this.settingData.checked18;
    } else {
      localStorage.setItem("linxudoscriptssetting", JSON.stringify(this.settingData));
    }
    setInterval(() => {
      this.runscripts();
    }, 1000);
  },
};
</script>
