<template>
  <div id="linuxdoscripts">
    <div class="linuxdoscripts-opacity"></div>
    <div class="setting-btn">
      <BackToTop v-show="showbacktotop" />
      <!-- 返回顶部按钮 -->
      <ReplyBtn v-show="showreplybtn" />
      <!-- 显示回复按钮 -->
      <LookOP v-show="showlookop" />
      <!-- 只看楼主 -->
      <AIDialog v-show="showaidialog" />
      <!-- 显示 AI 对话网站 -->
      <LevelDiglog v-show="showlevelsearch" />
      <!-- 查询等级功能 -->
      <HotRankingList v-show="showhotranking" />
      <!-- 最热排行榜 -->
    </div>

    <dialog open id="menu_suspendedball">
      <div class="menu-header">
        <div class="title">linuxdo 增强插件设置</div>
        <div class="close" @click="closedialog">+</div>
      </div>
      <div class="menu-flex">
        <ul class="menu-nav">
          <li class="act"><Setting1 />通用设置</li>
          <li><Setting2 />自定义</li>
          <li><Setting3 />用户标签</li>
          <li><Setting4 />AI 配置</li>
          <li><Setting5 />主题风格</li>
          <li><Setting6 />数据同步</li>
          <Updates />
        </ul>
        <div class="menu-body">
          <div class="menu-body-item act">
            <div class="menu-about">
              <p>请注意，该设置面板数据全部保存在本地浏览器缓存中，注意备份。</p>
              <p class="hint">
                如果感觉哪里不太对劲，点我
                <span class="initialization" @click="initialization">初始化设置</span>
                ，会清除所有的设置数据并初始化！！
              </p>
            </div>

            <!-- 新标签页打开 -->
            <MenuOpenpostblank :sort="1" v-model="settingData.checked1" />
            <!-- 新话题提醒 -->
            <MenuNewtopicreminder :sort="2" v-model="settingData.checked2" />
            <!-- 自动展开回复 -->
            <MenuAutoexpandreply :sort="3" v-model="settingData.checked3" />
            <!-- <MenuAutoexpandreply1 :sort="3.1" v-model="settingData.checked31" /> -->
            <!-- 话题列表显示创建时间 -->
            <MenuShowcreatetime :sort="4" v-model="settingData.checked4" />
            <MenuShowcreatetime1 :sort="4.1" v-model="settingData.checked41" />
            <!-- 显示楼层数 -->
            <MenuShowfloors :sort="5" v-model="settingData.checked5" />
            <!-- 隐藏话题详情顶部大标题 -->
            <MenuHidetopicdetailtitle :sort="6" v-model="settingData.checked6" />
            <!-- 话题预览功能 -->
            <MenuTopicpreview :sort="7" v-model="settingData.checked7" />
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
            <!-- 开启快速打开下一个帖子 -->
            <MenuNextPosts :sort="21" v-model="settingData.checked22" />
            <!-- 禁用选中文字分享功能 -->
            <MenuSelectedShare :sort="22" v-model="settingData.checked23" />
            <!-- 禁用视频自动播放 -->
            <MenuDisableAutoplay :sort="23" v-model="settingData.checked24" />
            <!-- 回复悬浮按钮 -->
            <MenuShowRepltBtn :sort="24" v-model="settingData.checked25" />
            <!-- 列表快速免打扰帖子 -->
            <MenuDonotTopic :sort="25" v-model="settingData.checked26" />
            <!-- 自动切换黑夜模式 -->
            <MenuAutoDark :sort="26" v-model="settingData.checked27" />
            <!-- 是否隐藏输入框提示文字 -->
            <MenuHiddenPlaceholder :sort="27" v-model="settingData.checked28" />
            <!-- 是否禁用浏览帖子时 URL 更新楼层数 -->
            <MenuDisableReplaceState :sort="28" v-model="settingData.checked29" />
            <!-- 是否移除话题上的头像 (减少网络请求) -->
            <MenuRemovePostAvatar :sort="29" v-model="settingData.removePostavatarData" />
            <!-- 是否显示最热帖子排行榜 -->
            <MenuHotRankingList :sort="30" v-model="settingData.checked33" />
            <!-- 是否显示返回顶部按钮 -->
            <MenuBackToTop :sort="31" v-model="settingData.checked34" />
            <!-- 是否显示快捷点赞主题按钮 -->
            <MenuQuickLikeTopic :sort="32" v-model="settingData.checked35" />
            <!-- 隐藏新消息小蓝点（除帖子未读小蓝点） -->
            <MenuHideNewBluedot :sort="34" v-model="settingData.checked37" />
            <!-- gif 头像转静态图片 -->
            <MenuGifToPng :sort="35" v-model="settingData.checked38" />
            <!-- 新增是否隐藏首页 banner 区域 -->
            <MenuHideHomeBanner :sort="36" v-model="settingData.checked39" />
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
            <!-- 屏蔽指定分类的多少天前的帖子 -->
            <MenuShieldPosts :sort="5" v-model:value="settingData.checked21" />
            <!-- 自定义 CSS -->
            <MenuOtherCss :sort="6" v-model:value="settingData.othercss" />
          </div>
          <div class="menu-body-item">
            <UserTags v-model:value="settingData.usertags" />
          </div>
          <div class="menu-body-item">
            <GPTconfig v-model:value="settingData.gptdata" />
          </div>
          <div class="menu-body-item">
            <Themes v-model="settingData.themes" />
          </div>
          <div class="menu-body-item">
            <SyncBackup v-model:value="settingData.syncbackup" />
          </div>
        </div>
      </div>
      <div class="menu-footer">
        <button class="save" @click="save">保存</button>
        <button class="saveload" @click="saveload">保存并刷新</button>
        <button class="floorlottery" @click="openFloorlottery">楼层抽奖</button>
        <!-- <a target="_blank" href="https://greasyfork.org/scripts/501827"> -->
        <button style="margin-left: 8px" class="detection" @click="checkversion">
          检测新版本
        </button>
        <!-- </a> -->
      </div>
    </dialog>

    <!-- 楼层抽奖 -->
    <FloorLottery />

    <!-- 使用提示 -->
    <UsageTip />
    <!-- 回复弹窗显示贴吧表情 -->
    <ReplyTBEnjoy />
    <!-- 修复小尾巴裂图 -->
    <Signature />

  </div>
</template>

<script>
// 基础设置
import packageJson from "../package.json";
import MenuOpenpostblank from "./components/BasicSettings/MenuOpenpostblank.vue";
import MenuNewtopicreminder from "./components/BasicSettings/MenuNewtopicreminder.vue";
import MenuAutoexpandreply from "./components/BasicSettings/MenuAutoexpandreply.vue";
import MenuAutoexpandreply1 from "./components/BasicSettings/MenuAutoexpandreply1.vue";
import MenuShowcreatetime from "./components/BasicSettings/MenuShowcreatetime.vue";
import MenuShowcreatetime1 from "./components/BasicSettings/MenuShowcreatetime1.vue";
import MenuShowfloors from "./components/BasicSettings/MenuShowfloors.vue";
import MenuHidetopicdetailtitle from "./components/BasicSettings/MenuHidetopicdetailtitle.vue";
import MenuTopicpreview from "./components/BasicSettings/MenuTopicpreview.vue";
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
import MenuNextPosts from "./components/BasicSettings/MenuNextPosts.vue";
import MenuSelectedShare from "./components/BasicSettings/MenuSelectedShare.vue";
import MenuDisableAutoplay from "./components/BasicSettings/MenuDisableAutoplay.vue";
import MenuShowRepltBtn from "./components/BasicSettings/MenuShowRepltBtn.vue";
import MenuDonotTopic from "./components/BasicSettings/MenuDonotTopic.vue";
import MenuAutoDark from "./components/BasicSettings/MenuAutoDark.vue";
import MenuHiddenPlaceholder from "./components/BasicSettings/MenuHiddenPlaceholder.vue";
import MenuDisableReplaceState from "./components/BasicSettings/MenuDisableReplaceState.vue";
import MenuRemovePostAvatar from "./components/BasicSettings/MenuRemovePostAvatar.vue";
import MenuHotRankingList from "./components/BasicSettings/MenuHotRankingList.vue";
import MenuBackToTop from "./components/BasicSettings/MenuBackToTop.vue";
import MenuQuickLikeTopic from "./components/BasicSettings/MenuQuickLikeTopic.vue";
import MenuHideNewBluedot from "./components/BasicSettings/MenuHideNewBluedot.vue";
import MenuGifToPng from "./components/BasicSettings/MenuGifToPng.vue";
import MenuHideHomeBanner from "./components/BasicSettings/MenuHideHomeBanner.vue";

// 自定义文字
import MenuOtherCss from "./components/CustomText/MenuOtherCss.vue";
import MenuLogoUrl from "./components/CustomText/MenuLogoUrl.vue";
import MenuCreatereply from "./components/CustomText/MenuCreatereply.vue";
import MenuBlockuserlist from "./components/CustomText/MenuBlockuserlist.vue";
import MenuBlockKeyword from "./components/CustomText/MenuBlockKeyword.vue";
import MenuShieldPosts from "./components/CustomText/MenuShieldPosts.vue";

// 用户标签
import UserTags from "./components/UserTags/UserTags.vue";

// AI 配置
import GPTconfig from "./components/AIConfig/GPTconfig.vue";

// 主题风格
import Themes from "./components/Themes/index.vue";

// 数据同步备份
import SyncBackup from "./components/Sync/SyncBackup.vue";

// 按钮
import LookOP from "./components/Button/LookOP.vue";
import LevelDiglog from "./components/Button/LevelDiglog.vue";
import AIDialog from "./components/Button/AIDialog.vue";
import ReplyBtn from "./components/Button/ReplyBtn.vue";
import HotRankingList from "./components/Button/HotRankingList.vue";
import BackToTop from "./components/Button/BackToTop.vue";

// 其他组件
import Updates from "./components/Other/Updates.vue";
import UsageTip from "./components/Other/UsageTip.vue";
import Signature from "./components/Other/Signature.vue";
import FloorLottery from "./components/Other/FloorLottery.vue";

// svg 图标
import Setting1 from "./components/Svg/Setting1.vue";
import Setting2 from "./components/Svg/Setting2.vue";
import Setting3 from "./components/Svg/Setting3.vue";
import Setting4 from "./components/Svg/Setting4.vue";
import Setting5 from "./components/Svg/Setting5.vue";
import Setting6 from "./components/Svg/Setting6.vue";
import Setting7 from "./components/Svg/Setting7.vue";

export default {
  components: {
    Setting1,
    Setting2,
    Setting3,
    Setting4,
    Setting5,
    Setting6,
    Setting7,
    MenuOpenpostblank,
    MenuNewtopicreminder,
    MenuAutoexpandreply,
    MenuAutoexpandreply1,
    MenuShowcreatetime,
    MenuShowcreatetime1,
    MenuShowfloors,
    MenuHidetopicdetailtitle,
    MenuTopicpreview,
    MenuCreatereply,
    MenuBlockuserlist,
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
    MenuShieldPosts,
    Themes,
    Signature,
    MenuNextPosts,
    MenuSelectedShare,
    MenuDisableAutoplay,
    MenuShowRepltBtn,
    ReplyBtn,
    FloorLottery,
    MenuDonotTopic,
    MenuAutoDark,
    MenuHiddenPlaceholder,
    MenuDisableReplaceState,
    MenuRemovePostAvatar,
    MenuHotRankingList,
    HotRankingList,
    MenuBackToTop,
    BackToTop,
    MenuQuickLikeTopic,
    MenuHideNewBluedot,
    MenuGifToPng,
    MenuHideHomeBanner,
  },
  data() {
    return {
      version: packageJson.version,
      opacity: false,
      open: false,

      // 设置数据
      settingData: {
        checked1: false,
        checked2: false,
        checked3: false,
        checked31: false,
        checked4: false,
        checked41: true,
        checked5: true,
        checked6: false,
        checked7: false,
        checked9: true,
        QuickReply: "",
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
          value1: true,
          value2: "twitter",
        },
        checked18: false,
        checked19: false,
        checked20: true,
        checked21: {
          value1: false,
          cate: "搞七捻三",
          days: "5",
        },
        checked22: true,
        checked23: false,
        checked24: true,
        checked25: true,
        checked26: true,
        checked27: false,
        checked28: false,
        checked29: false,
        checked33: false,
        checked34: false,
        checked35: false,
        checked37: false,
        checked38: false,
        checked39: false,
        removePostavatarData: {
          enable: false,
          showAuthor: false,
        },
        usertags: [],
        gptdata: {
          value1: false,
          value2: false,
          title: false,
          btn: true,
          apikey: "",
          baseurl: "https://api.openai.com",
          full_url: "/v1/chat/completions",
          model: "gpt-4o-mini",
          prompt:
            "根据以下帖子内容进行总结，请使用 markdown 格式返回回答，没有字数限制，但要求文字精炼，简介准确，语言要求返回简体中文，并且进行中英文混排优化。可以通过编号列表（1，2，3）列出核心要点。注意不要输出标题，例如：核心要点总结，帖子总结等，直接输出文本段落。",
          prompt1:
            "根据以下帖子内容，帮我给作者写一条回复，简短，表明我的观点，用口语回复，不需要很正式。您可以通过讨论的方式进行回复，这将有助于引导其他用户或作者进行互动。",
          prompt2:
            "根据以下帖子内容，生成一个合适的标题用于社交论坛发布使用，格式要求：不要书名号或其他符号，只需要一句纯文本。尽量精简到 15 字以内，如果字数不够表达主题，可以适当多生成几个字。",
        },
        syncbackup: {
          webdavUrl: "",
          webdavUsername: "",
          webdavPassword: "",
        },
        themes: 0,
      },

      showlookop: false,
      showlevelsearch: false,
      showaidialog: false,
      showreplybtn: false,
      showhotranking: false,
      showbacktotop: false,
    };
  },
  methods: {
    // 检测新版本
    checkversion() {
      this.$messageToast("正在检测新版本...");
      fetch("https://api.github.com/repos/dlzmoe/linuxdo-scripts/releases/latest")
        .then((response) => response.json())
        .then((data) => {
          if (this.version != data.tag_name) {
            this.$messageToast("有新版本可用，即将前往更新！");
            setTimeout(() => {
              window.open("https://greasyfork.org/scripts/501827", "_blank");
            }, 1000);
          } else {
            this.$messageToast("当前已是最新版本！");
          }
        })
        .catch((error) => {
          this.$messageToast("检测出错，请刷新后重试！");
        });
    },
    // 关闭弹窗
    closedialog() {
      $(".linuxdoscripts-opacity").hide();
      $("#menu_suspendedball").hide();
    },
    // 保存设置
    save() {
      localStorage.setItem("linxudoscriptssetting", JSON.stringify(this.settingData));

      this.$messageToast("保存成功！");
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
      $("#floorlotteryDialog").show();
    },
    // 默认运行脚本
    runscripts() {
      $(".linuxdoscripts-setting").click(function () {
        $(".linuxdoscripts-opacity").show();
        $("#menu_suspendedball").show();
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
      this.$messageToast("初始化设置成功，即将自动刷新！");
      setTimeout(() => {
        location.reload();
      }, 1000);
    },
  },
  created() {
    console.log(
      `%c linuxdo 增强插件 %c 已开启 `,
      "padding: 2px 1px; color: #fff; background: #606060;",
      "padding: 2px 1px; color: #fff; background: #42c02e;"
    );
    setInterval(() => {
      if ($(".linuxdoscripts-setting").length < 1) {
        $(".sidebar-footer-actions").prepend(`
          <button class="btn no-text btn-icon color-scheme-toggler btn-flat linuxdoscripts-setting" title="设置" type="button">
          <svg class="fa d-icon d-icon-gear svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#gear"></use></svg></button>`);
      }
    }, 1000);

    const linxudoscriptssetting = localStorage.getItem("linxudoscriptssetting");
    if (linxudoscriptssetting) {
      function deepMerge(target, source) {
        for (const key in source) {
          if (source[key] instanceof Object && key in target) {
            target[key] = deepMerge(target[key], source[key]);
          } else {
            target[key] = source[key];
          }
        }
        return target;
      }
      let existingData = JSON.parse(localStorage.getItem("linxudoscriptssetting"));
      this.settingData = deepMerge(this.settingData, existingData);
      localStorage.setItem("linxudoscriptssetting", JSON.stringify(this.settingData));

      this.showlookop = this.settingData.checked9;
      this.showlevelsearch = this.settingData.checked12;
      this.showaidialog = this.settingData.checked18;
      this.showreplybtn = this.settingData.checked25;
      this.showhotranking = this.settingData.checked33;
      this.showbacktotop = this.settingData.checked34;
      if (this.showreplybtn) {
        setInterval(() => {
          if (window.location.href.includes("/topic/")) {
            $(".replaybtn").show();
            $(".lookopbtn").show();
          } else {
            $(".replaybtn").hide();
            $(".lookopbtn").hide();
          }
        }, 1000);
      }
    } else {
      localStorage.setItem("linxudoscriptssetting", JSON.stringify(this.settingData));
    }
    setInterval(() => {
      this.runscripts();
    }, 1000);
  },
};
</script>
