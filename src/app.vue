<template>
  <div id="linuxdoscripts">
    <div class="linuxdoscripts-opacity"></div>
    <div class="setting-btn">
      <AIDialog v-show="showaidialog" />
      <!-- 显示 AI 对话网站 -->
      <LevelDiglog v-show="showlevelsearch" />
      <!-- 查询等级功能 -->
      <AutoRead v-show="showautoread" />
      <!-- 自动阅读按钮 -->
      <LookOP v-show="showlookop" />
      <!-- 只看楼主 -->
    </div>

    <dialog open id="menu_suspendedball">
      <div class="menu-header">
        <div class="title">linuxdo 增强插件设置</div>
        <div class="close" @click="closedialog">+</div>
      </div>
      <div class="menu-flex">
        <ul class="menu-nav">
          <li class="act"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" class="icon-sm"><path fill="currentColor" fill-rule="evenodd" d="M11.568 3.5a1 1 0 0 0-.863.494l-.811 1.381A3 3 0 0 1 7.33 6.856l-1.596.013a1 1 0 0 0-.858.501l-.44.761a1 1 0 0 0-.003.992l.792 1.4a3 3 0 0 1 0 2.954l-.792 1.4a1 1 0 0 0 .004.992l.439.76a1 1 0 0 0 .858.502l1.596.013a3 3 0 0 1 2.564 1.48l.811 1.382a1 1 0 0 0 .863.494h.87a1 1 0 0 0 .862-.494l.812-1.381a3 3 0 0 1 2.563-1.481l1.596-.013a1 1 0 0 0 .859-.501l.439-.761a1 1 0 0 0 .004-.992l-.793-1.4a3 3 0 0 1 0-2.953l.793-1.401a1 1 0 0 0-.004-.992l-.439-.76a1 1 0 0 0-.859-.502l-1.596-.013a3 3 0 0 1-2.563-1.48L13.3 3.993a1 1 0 0 0-.862-.494zM8.98 2.981A3 3 0 0 1 11.568 1.5h.87a3 3 0 0 1 2.588 1.481l.81 1.382a1 1 0 0 0 .855.494l1.597.013a3 3 0 0 1 2.575 1.502l.44.76a3 3 0 0 1 .011 2.975l-.792 1.4a1 1 0 0 0 0 .985l.792 1.401a3 3 0 0 1-.012 2.974l-.439.761a3 3 0 0 1-2.575 1.503l-1.597.012a1 1 0 0 0-.854.494l-.811 1.382a3 3 0 0 1-2.588 1.481h-.87a3 3 0 0 1-2.588-1.481l-.811-1.382a1 1 0 0 0-.855-.494l-1.596-.012a3 3 0 0 1-2.576-1.503l-.439-.76a3 3 0 0 1-.012-2.975l.793-1.4a1 1 0 0 0 0-.985l-.793-1.4a3 3 0 0 1 .012-2.975l.44-.761A3 3 0 0 1 5.717 4.87l1.596-.013a1 1 0 0 0 .855-.494z" clip-rule="evenodd"></path><path fill="currentColor" fill-rule="evenodd" d="M12.003 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M8.502 12a3.5 3.5 0 1 1 7 .001 3.5 3.5 0 0 1-7-.001" clip-rule="evenodd"></path></svg>通用设置</li>
          <li><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" class="icon-sm"><path fill="currentColor" fill-rule="evenodd" d="M12 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6M7 7a5 5 0 1 1 10 0A5 5 0 0 1 7 7m12.028 8.626c-.342-.061-.834.027-1.346.557a1 1 0 0 1-1.438 0c-.512-.53-1.003-.618-1.345-.557-.36.064-.681.312-.837.702-.257.643-.16 2.334 2.901 4.134 3.062-1.8 3.159-3.49 2.901-4.134a1.11 1.11 0 0 0-.836-.702m2.693-.041c.854 2.134-.456 4.844-4.284 6.904a1 1 0 0 1-.948 0c-3.828-2.06-5.137-4.77-4.284-6.904a3.11 3.11 0 0 1 2.343-1.929c.809-.144 1.655.035 2.415.536.76-.5 1.607-.68 2.415-.536a3.11 3.11 0 0 1 2.343 1.929m-11.795-1.38a1 1 0 0 1-.548 1.303C7.06 16.453 5.5 18.581 5.5 21a1 1 0 1 1-2 0c0-3.322 2.141-6.128 5.122-7.344a1 1 0 0 1 1.304.549" clip-rule="evenodd"></path></svg>自定义文字</li>
          <li><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" class="icon-sm"><path fill="currentColor" fill-rule="evenodd" d="M12.4 3.767a1 1 0 0 0-.8 0l-6 2.625a1 1 0 0 0-.6.916V13c0 1.714.616 3.283 1.638 4.5A6.99 6.99 0 0 1 12 15c2.153 0 4.078.972 5.362 2.5A6.97 6.97 0 0 0 19 13V7.308a1 1 0 0 0-.6-.916zm3.47 15.067A4.99 4.99 0 0 0 12 17a4.99 4.99 0 0 0-3.87 1.834A6.97 6.97 0 0 0 12 20c1.43 0 2.762-.43 3.87-1.166m-5.072-16.9a3 3 0 0 1 2.405 0l6 2.626A3 3 0 0 1 21 7.308V13a9 9 0 1 1-18 0V7.308A3 3 0 0 1 4.798 4.56zM12 8.5a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5m-3.75 1.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0" clip-rule="evenodd"></path></svg>用户标签</li>
          <li><svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-brand-openai"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M11.217 19.384a3.501 3.501 0 0 0 6.783 -1.217v-5.167l-6 -3.35" /><path d="M5.214 15.014a3.501 3.501 0 0 0 4.446 5.266l4.34 -2.534v-6.946" /><path d="M6 7.63c-1.391 -.236 -2.787 .395 -3.534 1.689a3.474 3.474 0 0 0 1.271 4.745l4.263 2.514l6 -3.348" /><path d="M12.783 4.616a3.501 3.501 0 0 0 -6.783 1.217v5.067l6 3.45" /><path d="M18.786 8.986a3.501 3.501 0 0 0 -4.446 -5.266l-4.34 2.534v6.946" /><path d="M18 16.302c1.391 .236 2.787 -.395 3.534 -1.689a3.474 3.474 0 0 0 -1.271 -4.745l-4.308 -2.514l-5.955 3.42" /></svg>AI 配置</li>
          <li><svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-refresh"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" /></svg>数据备份同步</li>
          <Updates />
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
                >，会清除所有的设置数据并初始化！！
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
            <!-- 编辑器切换 ja 字体 -->
            <MenuEditorJa :sort="19" v-model="settingData.checked19" />
            <!-- 开启列表页导航栏浮动 -->
            <MenuStickyNav :sort="20" v-model="settingData.checked20" />
            
          </div>
          <div class="menu-body-item">
            <!-- 自定义论坛 logo -->
            <MenuLogoUrl :sort="1" v-model:value="settingData.logourl" />
            <!-- 自定义快捷回复 -->
            <MenuCreatereply :sort="2" v-model:value="settingData.QuickReply" />
            <!-- 关键词屏蔽功能 -->
            <MenuBlockKeyword :sort="3" v-model:value="settingData.blockkeywrod" />
            <!-- 屏蔽指定用户 -->
            <MenuBlockuserlist :sort="4" v-model:value="settingData.blockList" />
            <!-- 自定义 CSS -->
            <MenuOtherCss :sort="5" v-model:value="settingData.othercss" />
          </div>
          <div class="menu-body-item">
            <UserTags v-model:value="settingData.usertags" />
          </div>
          <div class="menu-body-item">
            <GPTconfig v-model:value="settingData.gptdata" />
          </div>
          <div class="menu-body-item">
            <SyncBackup />
          </div>
        </div>
      </div>
      <div class="menu-footer">
        <button class="save" @click="save">保存</button>
        <button class="saveload" @click="saveload">保存并刷新</button>
        <button class="floorlottery" @click="openFloorlottery">楼层抽奖</button>

        <a
          style="margin-left:8px"
          target="_blank"
          href="https://greasyfork.org/scripts/501827"
        >
          <button class="detection">检测新版本</button>
        </a>
       
      </div>
    </dialog>

    <!-- 楼层抽奖 -->
    <dialog open v-show="floorlotteryDialog">
      <div class="menu-header">
        <div class="title">楼层抽奖</div>
      </div>
      <div class="menu-body" style="margin-top:10px">
        <input type="text" v-model="floorlotteryval1" placeholder="请输入总数" />
        <input type="text" v-model="floorlotteryval2" placeholder="请输入抽取的数量" />
        <button class="btn save" @click="drawRandomNumbers">开始抽奖</button>
        <button class="btn" style="background: #979797" plain @click="closelotter">关闭弹窗</button>
        <div style="height: 20px"></div>
        <div v-if="floorlotterloading">正在抽奖...</div>
        <div v-if="floorlotterresult" title="抽奖结果" type="success">
          抽奖结果：{{ floorlotterresult }}
        </div>
      </div>
    </dialog>

    <!-- 使用提示 -->
    <UsageTip />
    <!-- 回复弹窗显示贴吧表情 -->
    <ReplyTBEnjoy />
  </div>
</template>

<script>
// 基础设置
import packageJson from "../package.json";
import MenuOpenpostblank from "./components/BasicSettings/MenuOpenpostblank.vue";
import MenuNewtopicreminder from "./components/BasicSettings/MenuNewtopicreminder.vue";
import MenuAutoexpandreply from "./components/BasicSettings/MenuAutoexpandreply.vue";
import MenuShowcreatetime from "./components/BasicSettings/MenuShowcreatetime.vue";
import MenuShowcreatetime1 from "./components/BasicSettings/MenuShowcreatetime1.vue";
import MenuShowfloors from "./components/BasicSettings/MenuShowfloors.vue";
import MenuHidetopicdetailtitle from "./components/BasicSettings/MenuHidetopicdetailtitle.vue";
import MenuTopicpreview from "./components/BasicSettings/MenuTopicpreview.vue";
import MenuAutoRead from "./components/BasicSettings/MenuAutoRead.vue";
import MenuLookOP from "./components/BasicSettings/MenuLookOP.vue";
import MenuFloorHeight from "./components/BasicSettings/MenuFloorHeight.vue";
import ReplyTBEnjoy from "./components/BasicSettings/ReplyTBEnjoy.vue";
import MenuPangu from "./components/BasicSettings/MenuPangu.vue";
import MenuLevelSearch from "./components/BasicSettings/MenuLevelSearch.vue";
import MenuShowUnread from "./components/BasicSettings/MenuShowUnread.vue";
import MenuFilterText from "./components/BasicSettings/MenuFilterText.vue";
import MenuLookmeSign from "./components/BasicSettings/MenuLookmeSign.vue";
import MenuQuickAccess from "./components/BasicSettings/MenuQuickAccess.vue";
import MenureplaceEmojiStyle from "./components/BasicSettings/MenureplaceEmojiStyle.vue";
import MenuShowAI from "./components/BasicSettings/MenuShowAI.vue";
import MenuEditorJa from "./components/BasicSettings/MenuEditorJa.vue";
import MenuCreatedOrder from "./components/BasicSettings/MenuCreatedOrder.vue";
import MenuStickyNav from "./components/BasicSettings/MenuStickyNav.vue";

// 自定义文字
import MenuOtherCss from "./components/CustomText/MenuOtherCss.vue";
import MenuLogoUrl from "./components/CustomText/MenuLogoUrl.vue";
import MenuCreatereply from "./components/CustomText/MenuCreatereply.vue";
import MenuBlockuserlist from "./components/CustomText/MenuBlockuserlist.vue";
import MenuBlockKeyword from "./components/CustomText/MenuBlockKeyword.vue";

// 用户标签
import UserTags from "./components/UserTags/UserTags.vue";

// AI 配置
import GPTconfig from "./components/AIConfig/GPTconfig.vue";

// 数据同步备份
import SyncBackup from "./components/Sync/SyncBackup.vue";

// 按钮
import LookOP from "./components/Button/LookOP.vue";
import LevelDiglog from "./components/Button/LevelDiglog.vue";
import AutoRead from "./components/Button/AutoRead.vue";
import AIDialog from "./components/Button/AIDialog.vue";

// 其他组件
import Updates from "./components/Other/Updates.vue";
import UsageTip from "./components/Other/UsageTip.vue";

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
    MenuQuickAccess,
    MenureplaceEmojiStyle,
    MenuShowAI,
    AIDialog,
    MenuEditorJa,
    MenuCreatedOrder,
    GPTconfig,
    MenuStickyNav,
    MenuBlockKeyword,
    SyncBackup,
  },
  data() {
    return {
      version: packageJson.version,
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
        checked41: true,
        checked5: true,
        checked6: false,
        checked7: false,
        checked8: {
          value1: true,
          value2: 10,
        },
        checked9: true,
        QuickReply: "前排围观支持一下\n感谢分享大佬厉害啊\n有点厉害支持~~",
        blockList: "",
        blockkeywrod: "",
        checked10: false,
        othercss: "",
        logourl: "",
        checked11: true,
        checked12: true,
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
        checked20: true,
        usertags: [],
        gptdata: {
          value1: false,
          value2: false,
          title: false,
          btn: true,
          apikey: "",
          baseurl: "https://api.openai.com",
          model: "gpt-4o-mini",
          prompt: "根据以下帖子内容进行总结，请使用 markdown 格式返回回答，没有字数限制，但要求文字精炼，简介准确，语言要求返回简体中文，并且进行中英文混排优化。可以通过编号列表（1，2，3）列出核心要点。注意不要输出标题，例如：核心要点总结，帖子总结等，直接输出文本段落。",
          prompt1: "根据以下帖子内容，帮我给作者写一条回复，简短，表明我的观点，用口语回复，不需要很正式。您可以通过讨论的方式进行回复，这将有助于引导其他用户或作者进行互动。",
          prompt2: "根据以下帖子内容，生成一个合适的标题用于社交论坛发布使用，格式要求：不要书名号或其他符号，只需要一句纯文本。尽量精简到 15 字以内，如果字数不够表达主题，可以适当多生成几个字。",
        },
        syncbackup: {
          webdavUrl: "",
          webdavUsername: "",
          webdavPassword: "",
        }
      },

      showautoread: false,
      showlookop: false,
      showlevelsearch: false,
      showaidialog: false,
    };
  },
  methods: {
    messageToast(message) {
      const messageElement = $(`<div class="messageToast-text">${message}</div>`);
      $('#messageToast').append(messageElement);
      setTimeout(() => {
        messageElement.remove();
      }, 3000);
    },
    // 关闭弹窗
    closedialog() {
      $(".linuxdoscripts-opacity").hide();
      $("#menu_suspendedball").hide();
    },
    // 保存设置
    save() {
      localStorage.setItem("linxudoscriptssetting", JSON.stringify(this.settingData));

      this.messageToast("保存成功！");
      $(".linuxdoscripts-opacity").hide();
      $("#menu_suspendedball").hide();
    },
    // 保存并刷新
    saveload() {
      this.save();
      location.reload();
    },

    // 打开抽奖弹窗
    openFloorlottery() {
      $("#menu_suspendedball").hide();
      this.floorlotteryDialog = true;
    },
    // 开始抽奖
    drawRandomNumbers() {
      if (this.floorlotteryval1 === "" || this.floorlotteryval2 === "") {
        this.messageToast("请输入有效的数字")
        return false;
      }

      const total = parseInt(this.floorlotteryval1);
      const count = parseInt(this.floorlotteryval2);

      if (isNaN(total) || isNaN(count) || total <= 0 || count <= 0 || count > total) {
        this.messageToast("请输入有效的数字")
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
          });
        });
      }
    },
    // 初始化设置
    initialization() {
      localStorage.removeItem("linxudoscriptssetting");
      this.messageToast("初始化设置成功，即将自动刷新！")
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
      console.log(this.settingData);

      // 从 localStorage 获取现有的设置数据
      let existingData = JSON.parse(localStorage.getItem("linxudoscriptssetting"));
      this.settingData = { ...this.settingData, ...existingData };
      localStorage.setItem("linxudoscriptssetting", JSON.stringify(this.settingData));
      console.log(this.settingData);
      
      
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
