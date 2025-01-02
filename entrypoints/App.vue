<template>
  <div class="linuxdoscripts-setting-wrap">
    <button class="linuxdoscripts-setting" title="设置" type="button" @click="setting">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon icon-tabler icons-tabler-outline icon-tabler-settings"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path
        d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"
      />
      <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
    </svg>
    </button>
  </div>
  <div id="linuxdoscripts">
    <div class="linuxdoscripts-opacity" v-show="opacity"></div>
    <div class="setting-btn">
      <BackToTop v-show="showbacktotop" />
      <!-- 返回顶部按钮 -->
      <ReplyBtn v-show="showreplybtn" />
      <!-- 显示回复按钮 -->
      <LookOP v-show="showlookop" />
      <!-- 只看楼主 -->
      <LevelDiglog v-show="showlevelsearch" />
      <!-- 查询等级功能 -->
      <HotRankingList v-show="showhotranking" />
      <!-- 最热排行榜 -->
    </div>

    <dialog open id="menu_suspendedball" v-show="showdialog">
      <div class="menu-header">
        <div class="title">LinuxDo Scripts 扩展设置</div>
        <div class="close" @click="closedialog">+</div>
      </div>
      <div class="menu-flex">
        <ul class="menu-nav">
          <li @click="showItem(0)" :class="{ act : activeIndex == 0 }"><Setting1 />通用设置</li>
          <li @click="showItem(1)" :class="{ act : activeIndex == 1 }"><Setting2 />自定义</li>
          <li @click="showItem(2)" :class="{ act : activeIndex == 2 }"><Setting3 />用户标签</li>
          <li @click="showItem(3)" :class="{ act : activeIndex == 3 }"><Setting4 />AI 配置</li>
          <li @click="showItem(4)" :class="{ act : activeIndex == 4 }"><Setting5 />主题风格</li>
          <li @click="showItem(5)" :class="{ act : activeIndex == 5 }"><Setting6 />数据同步</li>
          <Updates />
        </ul>
        <div class="menu-body">
          <div class="menu-body-item" v-show="activeIndex == 0">
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
            <!-- 切换论坛表情风格 -->
            <MenureplaceEmojiStyle :sort="16" v-model="settingData.checked17" />
            <!-- 编辑器切换 ja 字体 -->
            <MenuEditorJa :sort="17" v-model="settingData.checked19" />
            <!-- 开启列表页导航栏浮动 -->
            <MenuStickyNav :sort="18" v-model="settingData.checked20" />
            <!-- 禁用选中文字分享功能 -->
            <MenuSelectedShare :sort="20" v-model="settingData.checked23" />
            <!-- 禁用视频自动播放 -->
            <MenuDisableAutoplay :sort="21" v-model="settingData.checked24" />
            <!-- 回复悬浮按钮 -->
            <MenuShowRepltBtn :sort="22" v-model="settingData.checked25" />
            <!-- 列表快速免打扰帖子 -->
            <MenuDonotTopic :sort="23" v-model="settingData.checked26" />
            <!-- 自动切换黑夜模式 -->
            <MenuAutoDark :sort="24" v-model="settingData.checked27" />
            <!-- 是否隐藏输入框提示文字 -->
            <MenuHiddenPlaceholder :sort="25" v-model="settingData.checked28" />
            <!-- 是否禁用浏览帖子时 URL 更新楼层数 -->
            <MenuDisableReplaceState :sort="26" v-model="settingData.checked29" />
            <!-- 是否移除话题上的头像 (减少网络请求) -->
            <MenuRemovePostAvatar :sort="27" v-model="settingData.removePostavatarData" />
            <!-- 是否显示最热帖子排行榜 -->
            <MenuHotRankingList :sort="28" v-model="settingData.checked33" />
            <!-- 是否显示返回顶部按钮 -->
            <MenuBackToTop :sort="29" v-model="settingData.checked34" />
            <!-- 是否显示快捷点赞主题按钮 -->
            <MenuQuickLikeTopic :sort="30" v-model="settingData.checked35" />
            <!-- 隐藏新消息小蓝点（除帖子未读小蓝点） -->
            <MenuHideNewBluedot :sort="32" v-model="settingData.checked37" />
            <!-- gif 头像转静态图片 -->
            <MenuGifToPng :sort="33" v-model="settingData.checked38" />
            <!-- 新增是否隐藏首页 banner 区域 -->
            <MenuHideHomeBanner :sort="34" v-model="settingData.checked39" />
            <!-- 是否开启收藏功能 -->
            <MenuBookmark :sort="35" v-model="settingData.checked40" />
          </div>
          <div class="menu-body-item" v-show="activeIndex == 1">
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
          <div class="menu-body-item" v-show="activeIndex == 2">
            <UserTags v-model:value="settingData.usertags" />
          </div>
          <div class="menu-body-item" v-show="activeIndex == 3">
            <GPTconfig v-model:value="settingData.gptdata" />
          </div>
          <div class="menu-body-item" v-show="activeIndex == 4">
            <Themes v-model="settingData.themes" />
          </div>
          <div class="menu-body-item" v-show="activeIndex == 5">
            <SyncBackup v-model:value="settingData.syncbackup" />
          </div>
        </div>
      </div>
      <div class="menu-footer">
        <button class="save" @click="save">保存</button>
        <button class="saveload" @click="saveload">保存并刷新</button>
        <button class="floorlottery" @click="openFloorlottery">楼层抽奖</button>
      </div>
    </dialog>

    <!-- 楼层抽奖 -->
    <dialog v-show="showFloorLottery" id="floorlotteryDialog" open>
      <div class="menu-header">
        <div class="title">楼层抽奖</div>
      </div>
      <div class="menu-body" style="margin-top: 10px">
        <div class="inner">
          <label>总楼层数：</label>
          <input type="text" v-model="floorlotteryval1" />
        </div>
        <div class="inner">
          <label>抽奖数量：</label>
          <input type="text" v-model="floorlotteryval2" />
        </div>
        <button class="btn save" @click="drawRandomNumbers">开始抽奖</button>
        <button class="btn" style="background: #979797" plain @click="closelotter">
          关闭弹窗
        </button>
        <div style="height: 20px"></div>
        <div v-if="floorlotterloading">正在抽奖...</div>
        <div v-if="floorlotterresult" title="抽奖结果" type="success">
          抽奖结果：恭喜 {{ floorlotterresult }} 楼中奖！
        </div>
      </div>
    </dialog>
    <!-- 使用提示 -->
    <UsageTip />
    <!-- 回复弹窗显示贴吧表情 -->
    <ReplyTBEnjoy />
    <!-- 修复小尾巴裂图 -->
    <Signature />
  </div>
  <div id="messageToast"></div>
</template>

<script>
import $ from "jquery";

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
import MenureplaceEmojiStyle from "./components/BasicSettings/MenureplaceEmojiStyle.vue";
import MenuEditorJa from "./components/BasicSettings/MenuEditorJa.vue";
import MenuCreatedOrder from "./components/BasicSettings/MenuCreatedOrder.vue";
import MenuStickyNav from "./components/BasicSettings/MenuStickyNav.vue";
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
import MenuBookmark from "./components/BasicSettings/MenuBookmark.vue";

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
import ReplyBtn from "./components/Button/ReplyBtn.vue";
import HotRankingList from "./components/Button/HotRankingList.vue";
import BackToTop from "./components/Button/BackToTop.vue";

// 其他组件
import Updates from "./components/Other/Updates.vue";
import UsageTip from "./components/Other/UsageTip.vue";
import Signature from "./components/Other/Signature.vue";

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
    MenureplaceEmojiStyle,
    MenuEditorJa,
    MenuCreatedOrder,
    GPTconfig,
    MenuStickyNav,
    MenuBlockKeyword,
    SyncBackup,
    MenuShieldPosts,
    Themes,
    Signature,
    MenuSelectedShare,
    MenuDisableAutoplay,
    MenuShowRepltBtn,
    ReplyBtn,
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
    MenuBookmark,
  },
  data() {
    return {
      opacity: false,
      showdialog: false,
      showFloorLottery: false,

      activeIndex: 0, // 当前激活的索引

      // 楼层抽奖
      floorlotteryval1: "",
      floorlotteryval2: "",
      floorlotterloading: false,
      floorlotterresult: "",

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
        checked17: {
          value1: true,
          value2: "twitter",
        },
        checked19: false,
        checked20: false,
        checked21: {
          value1: false,
          cate: "搞七捻三",
          days: "5",
        },
        checked23: false,
        checked24: true,
        checked25: true,
        checked26: true,
        checked27: false,
        checked28: false,
        checked29: false,
        checked33: false,
        checked34: true,
        checked35: false,
        checked37: false,
        checked38: false,
        checked39: false,
        checked40: false,
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
      showreplybtn: false,
      showhotranking: false,
      showbacktotop: false,
    };
  },
  methods: {
    // 开始抽奖
    drawRandomNumbers() {
      if (this.floorlotteryval1 === "" || this.floorlotteryval2 === "") {
        this.messageToast("请输入有效的数字");
        return false;
      }

      const total = parseInt(this.floorlotteryval1);
      const count = parseInt(this.floorlotteryval2);

      if (isNaN(total) || isNaN(count) || total <= 0 || count <= 0 || count > total) {
        this.messageToast("请输入有效的数字");
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
      this.showFloorLottery = false;
      this.opacity = false;
    },
    // 提示组件
    messageToast(message) {
      const messageElement = document.createElement("div");
      messageElement.className = "messageToast-text";
      messageElement.innerText = message;
      document.getElementById("messageToast").appendChild(messageElement);
      setTimeout(() => {
        messageElement.remove();
      }, 3000);
    },
    // 打开设置
    setting() {
      this.showdialog = true;
      this.opacity = true;
    },
    // 关闭弹窗
    closedialog() {
      this.showdialog = false;
      this.opacity = false;
    },
    // 保存设置
    save() {
      localStorage.setItem("linxudoscriptssettingDMI", JSON.stringify(this.settingData));

      this.messageToast("保存成功！");
      this.showdialog = false;
      this.opacity = false;
    },
    // 保存并刷新
    saveload() {
      this.save();
      location.reload();
    },

    // 打开抽奖弹窗
    openFloorlottery() {
      this.showdialog = false;
      (this.opacity = true), (this.showFloorLottery = true);
    },
    showItem(index) {
      // 更新激活索引
      this.activeIndex = index;
    },
    // 初始化设置
    initialization() {
      localStorage.removeItem("linxudoscriptssettingDMI");
      this.messageToast("初始化设置成功，即将自动刷新！");
      setTimeout(() => {
        location.reload();
      }, 1000);
    },
  },
  created() {
    $("body").append('<div id="messageToast"></div>');
    console.log(
      `%c linuxdo 增强插件 v${packageJson.version} %c 已开启 `,
      "padding: 2px 1px; color: #fff; background: #606060;",
      "padding: 2px 1px; color: #fff; background: #42c02e;"
    );
    // setInterval(() => {
    //   if ($(".linuxdoscripts-setting").length < 1) {
    //     $(".sidebar-footer-actions").prepend(`
    //       <button class="btn no-text btn-icon color-scheme-toggler btn-flat linuxdoscripts-setting" title="设置" type="button">
    //       <svg class="fa d-icon d-icon-gear svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#gear"></use></svg></button>`);
    //   }
    // }, 1000);

    const linxudoscriptssettingDMI = localStorage.getItem("linxudoscriptssettingDMI");
    if (linxudoscriptssettingDMI) {
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
      let existingData = JSON.parse(localStorage.getItem("linxudoscriptssettingDMI"));
      this.settingData = deepMerge(this.settingData, existingData);
      localStorage.setItem("linxudoscriptssettingDMI", JSON.stringify(this.settingData));

      this.showlookop = this.settingData.checked9;
      this.showlevelsearch = this.settingData.checked12;
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
      localStorage.setItem("linxudoscriptssettingDMI", JSON.stringify(this.settingData));
    }

    $('head').append(`<style>.linuxdoscripts-setting-wrap{position:fixed;left:0;bottom:0;width:60px;height:100vh;z-index:9;display:flex;flex-direction:column;justify-content:flex-end;padding:10px;box-sizing:border-box}.linuxdoscripts-setting-wrap>button{opacity:0;margin-left:-50px;transition:all .2s linear}.linuxdoscripts-setting-wrap:hover>button{opacity:1;margin-left:0}@media (max-width:768px){.linuxdoscripts-setting-wrap{height:auto;position:fixed}.linuxdoscripts-setting-wrap>button{opacity:1;margin-left:0}}.linuxdoscripts-setting{display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;outline:0;background:#000;color:#fff;width:40px;height:40px;border-radius:5px;box-shadow:1px 2px 5px rgba(0,0,0,.6)}.timeline-container .topic-timeline .timeline-scrollarea{max-width:100px!important}#linuxdoscripts{font-size:14px}#linuxdoscripts input[type=text]{width:100%;background:var(--d-input-bg-color)}#linuxdoscripts input[type=checkbox]{width:auto;transform:scale(1.2)}#linuxdoscripts input[type=radio]{width:auto}#linuxdoscripts img{vertical-align:bottom;max-width:100%;height:auto}#linuxdoscripts .close{position:absolute;right:10px;top:45%;cursor:pointer;font-size:34px;color:#999;transform:translateY(-50%) rotate(45deg)}#linuxdoscripts .setting-btn{z-index:199;position:fixed;bottom:20px;right:20px}#linuxdoscripts .setting-btn .el-button{margin:0;margin-top:15px;width:50px;height:50px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--tertiary-low);font-size:14px;cursor:pointer;border:none}#linuxdoscripts .setting-btn .el-button svg{margin:0}#linuxdoscripts .setting-btn .el-button:hover{opacity:.9}#linuxdoscripts .hint{margin-top:5px;color:#d94f4f;font-size:14px}#linuxdoscripts dialog{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:700px;max-width:100vw;background:var(--header_background);color:var(--primary);box-shadow:0 8px 32px rgba(0,0,0,.1);border-radius:16px;padding:15px;z-index:99999;overflow-x:hidden;box-sizing:border-box;margin:0;border:none;outline:0}#linuxdoscripts dialog .menu-about{padding:5px 0;line-height:2}#linuxdoscripts dialog .menu-about .initialization{color:#999;border-bottom:1px dashed #999;cursor:pointer}#linuxdoscripts dialog .menu-about .initialization:hover{color:#333;border-color:#333}#linuxdoscripts dialog p{margin:0;font-size:14px}#linuxdoscripts .menu-header{padding:.5rem .5rem 1rem;border-bottom:1px solid #eee;position:relative}#linuxdoscripts .title{font-size:18px;font-weight:600;display:flex;align-items:center}#linuxdoscripts .title img{margin-left:10px}#linuxdoscripts button{padding:10px 16px;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;transition:all .2s ease;border:none;display:inline-flex;align-items:center;justify-content:center;background-color:var(--primary-low)}#linuxdoscripts button+button{margin-left:8px}#linuxdoscripts button.saveload{background:#000;color:#fff}#linuxdoscripts button:hover{opacity:.9}#linuxdoscripts .menu-flex{display:flex;justify-content:space-between;align-items:flex-start}#linuxdoscripts .menu-nav{width:140px;display:flex;flex-direction:column;padding:0;margin:0;padding-top:15px;margin-right:20px}#linuxdoscripts .menu-nav li{border-radius:4px;height:32px;width:100%;margin-bottom:5px;box-sizing:border-box;padding:0 10px;display:inline-flex;align-items:center;justify-content:flex-start;font-size:14px;cursor:pointer;line-height:1}#linuxdoscripts .menu-nav li svg{width:16px;margin-right:5px}#linuxdoscripts .menu-nav li.act{background:var(--d-selected)}#linuxdoscripts .menu-body{flex:1;height:480px;overflow-y:auto;box-sizing:border-box}#linuxdoscripts .menu-body::-webkit-scrollbar{height:8px;width:8px}#linuxdoscripts .menu-body::-webkit-scrollbar-corner{background:0 0}#linuxdoscripts .menu-body::-webkit-scrollbar-thumb{background:#dee0e1;border-radius:8px}#linuxdoscripts .menu-footer{display:flex;margin-top:10px;padding-top:6px}#linuxdoscripts .import{margin-left:auto!important}#linuxdoscripts .export,#linuxdoscripts .import{background:#d1f0ff;color:#559095}#linuxdoscripts .floorlottery{background:#ffb003;color:#fff}#linuxdoscripts .menu-body-item{padding-bottom:30px}#linuxdoscripts .menu-body-item .item{border-bottom:1px solid rgba(0,0,0,.05);padding:15px 0;display:flex;align-items:center;justify-content:space-between}#linuxdoscripts .menu-body-item .item .tit{height:100%;display:flex;align-items:center}#linuxdoscripts .menu-body-item .item input{margin-top:0;margin-bottom:0}#linuxdoscripts .menu-body-item .item select{margin-top:0;margin-bottom:0}#linuxdoscripts .menu-body-item .item input[type=checkbox]{width:30px;height:16px;position:relative;background-color:#dcdfe6;box-shadow:#dfdfdf 0 0 0 0 inset;border-radius:20px;background-clip:content-box;display:inline-block;appearance:none;-webkit-appearance:none;-moz-appearance:none;user-select:none;outline:0;padding:0}#linuxdoscripts .menu-body-item .item input[type=checkbox]::before{content:"";position:absolute;width:12px;height:12px;background-color:#fff;border-radius:50%;left:2px;top:0;bottom:0;margin:auto;transition:.3s}#linuxdoscripts .menu-body-item .item input[type=checkbox]:checked{background-color:var(--tertiary);transition:.6s}#linuxdoscripts .menu-body-item .item input[type=checkbox]:checked::before{left:14px;transition:.3s}#linuxdoscripts input{font-family:inherit;width:100%;border:1px solid #999;outline:0;padding:5px;font-size:14px;margin:0;resize:none;border-radius:0;color:var(--d-input-text-color);background:var(--d-input-bg-color)}#linuxdoscripts input:focus{border-color:var(--tertiary);outline:2px solid var(--tertiary);outline-offset:-2px}#linuxdoscripts textarea{font-family:inherit;width:100%;min-height:100px!important;border:1px solid #999;outline:0;padding:5px;font-size:14px;margin:0;resize:none;border-radius:0;color:var(--d-input-text-color);background:var(--d-input-bg-color)}#linuxdoscripts textarea:focus{border-color:var(--tertiary);outline:2px solid var(--tertiary);outline-offset:-2px}#linuxdoscripts #floorlotterloading img{width:50px;height:50px}#linuxdoscripts .floorlotterywrap{display:none;width:400px;height:300px;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);margin:0;z-index:999}#linuxdoscripts .floorlotterywrap{width:400px;height:300px}#linuxdoscripts .el-checkbox__inner{border:1px solid #979797}#linuxdoscripts label{margin:0}.linuxdoscripts-opacity{position:fixed;left:0;top:0;width:100vw;height:100vh;background:rgba(0,0,0,.5);z-index:9999}.linuxlevel.four{background:linear-gradient(to right,red,#00f);-webkit-background-clip:text;color:transparent}.topic-post{position:relative}.linuxfloor{display:flex;color:var(--tertiary);width:30px;height:30px;align-items:center;justify-content:center;border-radius:6px;font-size:16px;margin-left:10px}.signature-p{color:#279a36;font-size:14px;word-break:break-word}.topic-list .views{font-weight:400!important;white-space:nowrap!important}.createreply{display:flex;flex-direction:column;max-width:300px}.createreply button{margin-bottom:10px;justify-content:flex-start;text-align:left}.donottopic-btn,.topicpreview-btn{padding:4px 12px!important;font-size:14px!important;opacity:0!important;margin-right:5px!important}.topic-list-item:hover .donottopic-btn,.topic-list-item:hover .topicpreview-btn{opacity:1!important}.topicpreview{position:fixed;top:0;left:0;z-index:99999;width:100vw;height:100vh;display:flex;justify-content:center;align-items:center;display:none}.topicpreview .topicpreview-container{padding:30px 0;border-radius:5px;width:100%;max-width:800px;overflow-y:auto;height:80vh;z-index:10;background:var(--header_background);position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)}.topicpreview .topicpreview-container .topicpreview-title{font-size:22px;font-weight:600;padding:0 30px}.topicpreview .topicpreview-container .topicpreview-date{padding:0 30px;color:#666}.topicpreview .topicpreview-container .topicpreview-content>.item{display:flex;align-items:flex-start;padding:20px 30px}.topicpreview .topicpreview-container .topicpreview-content>.item .itemfloor{width:50px;text-align:left;font-size:16px;padding-top:15px;color:#25b4cf}.topicpreview .topicpreview-container .topicpreview-content>.item .itempost{flex:1;background:var(--tertiary-low);padding:15px 15px;border-radius:10px;font-size:15px;word-break:break-all}.topicpreview .topicpreview-container .topicpreview-content>.item .itempost pre code{max-width:620px}.topicpreview .topicpreview-container .topicpreview-content>.item .itempost img{max-width:100%;max-height:100%;height:auto}.topicpreview .topicpreview-container .topicpreview-content>.item .itempost .itemname{font-size:16px;color:#8f3a3a;display:flex;justify-content:space-between;align-items:center}.topicpreview .topicpreview-container .topicpreview-content>.item .itempost .itemname span{color:#9e9e9e;margin-left:20px}.topicpreview .topicpreview-container .topicpreview-content>.item .itempost .itemdate{color:#b9b9b9;font-size:16px;margin-left:auto}.topicpreview-opacity{position:absolute;top:0;left:0;width:100%;height:100%;opacity:1;background:rgba(0,0,0,.6);z-index:9}.body-preview .sidebar-wrapper{display:none!important}body.body-preview #main-outlet-wrapper{display:block!important;padding-left:50px!important}.body-preview .d-header-wrap{display:none!important}.body-preview .menu_suspendedball{display:none!important}.post-activity{white-space:nowrap;display:inline-block;width:100%;text-align:left}.d-header img{height:var(--d-logo-height);width:auto;max-width:100%;object-fit:contain}.aicreated-btn,.aireplay-btn{outline:0;border:none;background:var(--tertiary-low);display:inline-flex;align-items:center;justify-content:center;line-height:1;font-size:14px;padding:4px 10px;border-radius:3px;margin-bottom:10px;margin-right:10px}.aicreated-btn{display:none}.gpt-summary-wrap{background:var(--tertiary-low);border-radius:5px;padding:10px;font-size:14px;margin:0 0 10px 0;line-height:1.6}.gpt-summary-wrap .airegenerate{display:none;margin-top:6px;outline:0;border:1px solid #eee;background:#ffe27d;color:#626262;padding:4px 10px;cursor:pointer;border-radius:3px}.aicreatenewtopictitle{margin-left:20px}.aicreatenewtopictitle:hover{text-decoration:underline;cursor:pointer}.aireply-popup{z-index:999999;position:fixed;top:10%;left:50%;transform:translateX(-50%);width:500px;padding:20px;background:var(--tertiary-low);color:#333;box-shadow:transparent 0 0 0 0,transparent 0 0 0 0,rgba(0,0,0,.1) 0 20px 25px -5px,rgba(0,0,0,.1) 0 8px 10px -6px;border-radius:10px;display:none}.aireply-popup .aireply-popup-text{width:100%;height:120px}.aireply-popup .aireply-popup-close{outline:0;min-width:80px;height:32px;border:none;background-color:var(--header_background);text-shadow:0 -1px 0 rgba(0,0,0,.12);box-shadow:0 2px 0 rgba(0,0,0,.045);border-radius:4px;padding:0 10px;box-sizing:border-box;transition:all .1s linear}#messageToast{z-index:9999999;position:fixed;left:50%;transform:translateX(-50%);top:10%;width:100%;display:flex;flex-direction:column;align-items:center}#messageToast .messageToast-text{background:#4caf50;color:#fff;border-radius:6px;width:auto;display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;text-align:center;line-height:1;height:40px;min-width:240px;font-size:16px;padding:0 30px;box-sizing:border-box;margin-bottom:10px;opacity:0;animation:messageToast .2s forwards;padding:12px 24px;color:#fff;border-radius:4px;font-size:14px;z-index:9999;box-shadow:0 2px 5px rgba(0,0,0,.2)}@keyframes messageToast{0%{transform:translateY(10px);opacity:0}100%{transform:translateY(0);opacity:1}}.pangutext{cursor:pointer;margin-left:20px}.pangutext:hover{color:#279a36}.navigation-container.is-active{position:fixed;top:65px;background:var(--header_background);z-index:9;box-shadow:1px 3px 7px 0 rgba(0,0,0,.2);margin-left:-30px;padding-left:30px;border-radius:5px;padding-top:10px;padding-right:20px;min-width:1000px;width:auto}.topic-body.clearfix.highlighted{background-color:var(--tertiary-low)!important}.hotranking-container{position:fixed;right:100px;bottom:20px;background:#fff;box-shadow:1px 10px 20px rgba(0,0,0,.2);border-radius:10px;width:400px;min-height:380px;padding:20px;box-sizing:border-box;z-index:999}.hotranking-container .flex{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem}.hotranking-container ol li,.hotranking-container ul li{padding:2px 0}.hotranking-container ol li a:hover,.hotranking-container ul li a:hover{text-decoration:underline}.menu-body{padding:0 15px}.inner{display:flex;align-items:center;margin-bottom:10px}.inner label{width:70px;font-weight:400}.inner input{flex:1;margin:0;max-width:300px}.linxudoscripts-tag{background:#29a6a9;color:#fff;font-size:14px!important;padding:0 10px;height:26px;text-align:center;display:inline-flex!important;align-items:center;justify-content:center;border-radius:5px}.menu-table{width:100%}.menu-table td,.menu-table th{padding:10px;font-size:14px}.menu-table .span{cursor:pointer}.menu-table .span+.span{margin-left:10px}.emojiPicker{top:0;left:100%;position:absolute;display:grid;grid-template-columns:repeat(12,1fr);gap:10px;height:100%;overflow:auto;background-color:rgba(0,0,0,.8);padding:10px;border-radius:5px;z-index:9}.emojiPicker img{cursor:pointer;width:30px;height:30px}.UsageTip{position:static;margin:0;font-size:14px;line-height:1.6;background:var(--d-sidebar-background);color:var(--primary-medium)}.UsageTip>div{margin:10px 0}.UsageTip button{padding:8px 10px;margin-bottom:10px;border:none;outline:0;border-radius:4px}.linuxtime img{margin-right:5px}</style>`)
  },
};
</script>