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
          <!-- <li @click="showItem(5)" :class="{ act : activeIndex == 5 }"><Setting6 />数据同步</li> -->
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
            <!-- 开启快速打开下一个帖子 -->
            <MenuNextPosts :sort="19" v-model="settingData.checked22" />
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
            <!-- 是否支持将文本快捷复制为图片 -->
            <MenuCopyTextAsImage :sort="31" v-model="settingData.checked36" />
            <!-- 隐藏新消息小蓝点（除帖子未读小蓝点） -->
            <MenuHideNewBluedot :sort="32" v-model="settingData.checked37" />
            <!-- gif 头像转静态图片 -->
            <MenuGifToPng :sort="33" v-model="settingData.checked38" />
            <!-- 新增是否隐藏首页 banner 区域 -->
            <MenuHideHomeBanner :sort="34" v-model="settingData.checked39" />
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
import MenuCopyTextAsImage from "./components/BasicSettings/MenuCopyTextAsImage.vue";
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
    MenuNextPosts,
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
    MenuCopyTextAsImage,
    MenuHideNewBluedot,
    MenuGifToPng,
    MenuHideHomeBanner,
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
        checked36: false,
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
      localStorage.setItem("linxudoscriptssetting", JSON.stringify(this.settingData));

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
      localStorage.removeItem("linxudoscriptssetting");
      this.messageToast("初始化设置成功，即将自动刷新！");
      setTimeout(() => {
        location.reload();
      }, 1000);
    },
  },
  created() {
    $("body").append('<div id="messageToast"></div>');
    console.log(
      `%c linuxdo 增强插件 %c 已开启 `,
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
  },
};
</script>
