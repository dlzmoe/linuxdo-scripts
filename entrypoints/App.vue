<template>
  <div class="linuxdoscripts-setting-wrap" v-show="!isShow">
    <button class="linuxdoscripts-setting" title="设置" type="button" @click="setting">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        class="icon icon-tabler icons-tabler-outline icon-tabler-settings">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path
          d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
        <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
      </svg>
    </button>
  </div>
  <div id="linuxdoscripts">
    <div class="linuxdoscripts-opacity" v-show="opacity"></div>
    <div class="setting-btn">
      <BackToTop v-show="showbacktotop" />
      <!-- 返回顶部按钮 -->
      <BackToOneFloor v-show="showbacktoonefloor" />
      <!-- 直达一楼按钮 -->
      <ReplyBtn v-show="showreplybtn" />
      <!-- 显示回复按钮 -->
      <LookOP v-show="showlookop" />
      <!-- 只看楼主 -->
      <LevelDiglog v-show="showlevelsearch" />
      <!-- 查询等级功能 -->
    </div>

    <dialog open id="menu_suspendedball" v-show="showdialog">
      <div class="menu-header">
        <div class="title">LinuxDo Scripts 扩展设置</div>
        <div class="close" @click="closedialog">+</div>
      </div>
      <div class="menu-flex">
        <ul class="menu-nav">
          <li @click="showItem(0)" :class="{ act: activeIndex == 0 }">
            <Setting1 />通用设置
          </li>
          <li @click="showItem(1)" :class="{ act: activeIndex == 1 }">
            <Setting2 />自定义
          </li>
          <li @click="showItem(2)" :class="{ act: activeIndex == 2 }">
            <Setting3 />用户标签
          </li>
          <li @click="showItem(3)" :class="{ act: activeIndex == 3 }">
            <Setting4 />AI 配置
          </li>
          <li @click="showItem(4)" :class="{ act: activeIndex == 4 }">
            <Setting5 />主题风格
          </li>
          <li @click="showItem(5)" :class="{ act: activeIndex == 5 }">
            <Setting6 />数据备份
          </li>
          <Updates />
        </ul>
        <div class="menu-body">
          <div class="menu-body-item" v-show="activeIndex == 0">
            <div class="menu-about">
              <p>请注意，该设置面板数据全部保存在本地浏览器缓存中，注意备份。</p>

              <!-- 添加设置搜索框 -->
              <div class="settings-search" style="margin: 10px 0;">
                <input
                  type="text"
                  v-model="settingsSearchQuery"
                  @keydown="handleKeyDown"
                  placeholder="搜索设置项..."
                  style="padding: 6px 10px; border-radius: 4px; width: 80%; font-size: 13px;"
                />
              </div>

              <p class="hint">
                如果感觉哪里不太对劲，点我
                <span class="initialization" @click="initialization">初始化设置</span>
                ，会清除所有的设置数据并初始化！！
              </p>
            </div>

            <div class="group-line">外观设置</div>
            <!-- 简洁模式 -->
            <MenuSimpleMode :sort="1" v-model="settingData.checked0" v-show="matchesSearch('简洁模式')" />
            <!-- 智能限制楼层高度 -->
            <MenuFloorHeight :sort="2" v-model="settingData.checked10" v-show="matchesSearch('智能限制楼层高度')" />
            <!-- 中英文混排优化显示 -->
            <MenuPangu :sort="3" v-model="settingData.checked11" v-show="matchesSearch('中英文混排优化显示')" />
            <!-- 隐藏话题详情顶部大标题 -->
            <MenuHidetopicdetailtitle :sort="4" v-model="settingData.checked6" v-show="matchesSearch('隐藏话题详情顶部大标题')" />
            <!-- 只看自己签名 -->
            <MenuLookmeSign :sort="5" v-model="settingData.checked15" v-show="matchesSearch('只看自己签名')" />
            <!-- 切换论坛表情风格 -->
            <MenureplaceEmojiStyle :sort="6" v-model="settingData.checked17" v-show="matchesSearch('切换论坛表情风格')" />
            <!-- 开启列表页导航栏浮动 -->
            <MenuStickyNav :sort="7" v-model="settingData.checked20" v-show="matchesSearch('列表页导航栏浮动')" />
            <!-- 自动切换黑夜模式 -->
            <MenuAutoDark :sort="8" v-model="settingData.checked27" v-show="matchesSearch('自动切换黑夜模式')" />
            <!-- 是否移除话题上的头像 (减少网络请求) -->
            <MenuRemovePostAvatar :sort="9" v-model="settingData.removePostavatarData" v-show="matchesSearch('移除话题上的头像')" />
            <!-- 隐藏新消息小蓝点（除帖子未读小蓝点） -->
            <MenuHideNewBluedot :sort="10" v-model="settingData.checked37" v-show="matchesSearch('隐藏新消息小蓝点')" />
            <!-- gif 头像转静态图片 -->
            <MenuGifToPng :sort="11" v-model="settingData.checked38" v-show="matchesSearch('gif 头像转静态图片')" />
            <!-- 新增是否隐藏首页 banner 区域 -->
            <MenuHideHomeBanner :sort="12" v-model="settingData.checked39" v-show="matchesSearch('隐藏首页 banner 区域')" />
            <!-- 是否美化过长的昵称 -->
            <MenuUsernameLength :sort="13" v-model="settingData.checked45" v-show="matchesSearch('美化过长的昵称')" />
            <!-- 是否开启超长显示器宽度优化 -->
            <MenuMonitorWidthOptimization :sort="14" v-model="settingData.checked46" v-show="matchesSearch('超长显示器宽度优化')" />
            <!-- 类别页优化 banner 显示 -->
            <MenuCatePageOptimizeBanner :sort="15" v-model="settingData.checked47" v-show="matchesSearch('类别页优化 banner 显示')" />
            <!-- 是否自动隐藏"福利羊毛"中已领完的帖子 -->
            <MenuHideWelfareDone :sort="16" v-model="settingData.checked42" v-show="matchesSearch('隐藏福利羊毛中已领完的帖子')" />


            <div class="group-line">功能点设置</div>
            <!-- 新标签页打开 -->
            <MenuOpenpostblank :sort="1" v-model="settingData.checked1" v-show="matchesSearch('新标签页打开')" />
            <!-- 话题列表显示创建时间 -->
            <MenuShowcreatetime :sort="2" v-model="settingData.checked4" v-show="matchesSearch('话题列表显示创建时间')" />
            <MenuShowcreatetime1 :sort="3" v-model="settingData.checked41" v-show="matchesSearch('话题列表显示创建时间')" />
            <!-- 显示楼层数 -->
            <MenuShowfloors :sort="4" v-model="settingData.checked5" v-show="matchesSearch('显示楼层数')" />
            <!-- 新话题提醒 -->
            <MenuNewtopicreminder :sort="5" v-model="settingData.checked2" v-show="matchesSearch('新话题提醒')" />
            <!-- 自动展开回复 -->
            <MenuAutoexpandreply :sort="6" v-model="settingData.checked3" v-show="matchesSearch('自动展开回复')" />
            <!-- 禁用视频自动播放 -->
            <MenuDisableAutoplay :sort="7" v-model="settingData.checked24" v-show="matchesSearch('禁用视频自动播放')" />
            <!-- 是否显示快捷点赞主题按钮 -->
            <MenuQuickLikeTopic :sort="8" v-model="settingData.checked35" v-show="matchesSearch('快捷点赞主题按钮')" />
            <!-- 是否开启收藏功能 -->
            <MenuBookmark :sort="9" v-model="settingData.checked40" v-show="matchesSearch('收藏功能')" />
            <!-- 楼主头衔显示 -->
            <MenuTopicOwnerBadge :sort="10" v-model="settingData.checked49" v-show="matchesSearch('楼主头衔显示')" />
            <!-- 话题始终打开 1 楼 -->
            <MenuAlwaysFirstPost :sort="11" v-model="settingData.checked50" v-show="matchesSearch('话题始终打开1楼')" />
            <!-- 消息通知仅显示未读 -->
            <MenuShowUnread :sort="12" v-model="settingData.checked13" v-show="matchesSearch('消息通知仅显示未读')" />
            <!-- 是否屏蔽模糊文字 -->
            <MenuFilterText :sort="13" v-model="settingData.checked14" v-show="matchesSearch('屏蔽模糊文字')" />
            <!-- 禁用选中文字分享功能 -->
            <MenuSelectedShare :sort="14" v-model="settingData.checked23" v-show="matchesSearch('禁用选中文字分享功能')" />
            <!-- 查看话题内自己回复的楼层数（抽奖贴适用） -->
            <MenuViewOwnReply :sort="15" v-model="settingData.checked44" v-show="matchesSearch('查看话题内自己回复的楼层数')" />


            <div class="group-line">编辑器设置</div>
            <!-- 编辑器切换 ja 字体 -->
            <MenuEditorJa :sort="1" v-model="settingData.checked19" v-show="matchesSearch('编辑器切换 ja 字体')" />
            <!-- 是否隐藏输入框提示文字 -->
            <MenuHiddenPlaceholder :sort="2" v-model="settingData.checked28" v-show="matchesSearch('隐藏输入框提示文字')" />
            <!-- 插入删除线 -->
            <MenuInsertStrikethrough :sort="3" v-model="settingData.checked51" v-show="matchesSearch('插入删除线')" />


            <div class="group-line">外置按钮</div>
            <!-- 列表快速免打扰帖子 -->
            <MenuDonotTopic :sort="1" v-model="settingData.checked26" v-show="matchesSearch('列表快速免打扰帖子')" />
            <!-- 话题预览功能 -->
            <MenuTopicpreview1 :sort="2" v-model="settingData.checked7" v-show="matchesSearch('话题预览功能')" />
            <MenuTopicpreview2 :sort="2.1" v-model="settingData.checked7_1" v-show="matchesSearch('话题预览功能')" />
            <!-- 回复悬浮按钮 -->
            <MenuShowRepltBtn :sort="3" v-model="settingData.checked25" v-show="matchesSearch('回复悬浮按钮')" />
            <!-- 只看楼主按钮 -->
            <MenuLookOP :sort="4" v-model="settingData.checked9" v-show="matchesSearch('只看楼主按钮')" />
            <!-- 是否显示等级查询按钮 -->
            <MenuLevelSearch :sort="5" v-model="settingData.checked12" v-show="matchesSearch('等级查询按钮')" />
            <!-- 是否显示返回顶部按钮 -->
            <MenuBackToTop :sort="6" v-model="settingData.checked34" v-show="matchesSearch('返回顶部按钮')" />
            <!-- 添加直达一楼按钮 -->
            <MenuBackToOneFloor :sort="6.1" v-model="settingData.checked48" v-show="matchesSearch('直达一楼按钮')" />
            <!-- 是否开启话题转为图片进行分享 -->
            <MenuTopicToImages :sort="7" v-model="settingData.checked43" v-show="matchesSearch('话题转为图片进行分享')" />
            <!-- 是否开启论坛文章导出功能 -->
            <MenuExportArticle :sort="8" v-model="settingData.checkedExportArticle" v-show="matchesSearch('论坛文章导出')" />

          </div>
          <div class="menu-body-item" v-show="activeIndex == 1">
            <!-- 自定义论坛 logo -->
            <MenuLogoUrl :sort="1" v-model:value="settingData.logourl" />
            <!-- 自定义论坛标签页 icon 和 title -->
            <MenuIconTitle :sort="2" v-model:value="settingData.IconTitle" />
            <!-- 自定义快捷回复 -->
            <MenuCreatereply :sort="3" v-model:value="settingData.QuickReply" />
            <!-- 关键词屏蔽功能 -->
            <MenuBlockKeyword :sort="4" v-model:value="settingData.blockkeywrod" />
            <!-- 标签屏蔽功能 -->
            <MenuBlockTags :sort="6" v-model:value="settingData.blocktags" />
            <!-- 屏蔽用户功能 -->
            <MenuBlockuserlist :sort="5" v-model:value="settingData.blockList" />
            <!-- 屏蔽指定分类的多少天前的帖子 -->
            <MenuShieldPosts :sort="7" v-model:value="settingData.checked21" />
            <!-- 自定义 CSS -->
            <MenuOtherCss :sort="8" v-model:value="settingData.othercss" />
          </div>
          <div class="menu-body-item" v-show="activeIndex == 2">
            <!-- 是否开启用户标签 -->
            <MenuUserTags v-model="settingData.isUserTags" />
            <UserTags v-model:value="settingData.usertags" />
          </div>
          <div class="menu-body-item" v-show="activeIndex == 3">
            <GPTconfig v-model:value="settingData.gptdata" />
          </div>
          <div class="menu-body-item" v-show="activeIndex == 4">
            <Themes v-model="settingData.themes" />
          </div>
          <div class="menu-body-item" v-show="activeIndex == 5">
            <SyncBackup />
          </div>
        </div>
      </div>
      <div class="menu-footer">
        <button class="save" @click="save">保存</button>
        <button class="saveload" @click="saveload">保存并刷新</button>
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
import "./style.css";

// 基础设置
import packageJson from "../package.json";

import MenuSimpleMode from "./components/BasicSettings/MenuSimpleMode.vue";
import MenuOpenpostblank from "./components/BasicSettings/MenuOpenpostblank.vue";
import MenuNewtopicreminder from "./components/BasicSettings/MenuNewtopicreminder.vue";
import MenuAutoexpandreply from "./components/BasicSettings/MenuAutoexpandreply.vue";
import MenuAutoexpandreply1 from "./components/BasicSettings/MenuAutoexpandreply1.vue";
import MenuShowcreatetime from "./components/BasicSettings/MenuShowcreatetime.vue";
import MenuShowcreatetime1 from "./components/BasicSettings/MenuShowcreatetime1.vue";
import MenuShowfloors from "./components/BasicSettings/MenuShowfloors.vue";
import MenuHidetopicdetailtitle from "./components/BasicSettings/MenuHidetopicdetailtitle.vue";
import MenuTopicpreview1 from "./components/BasicSettings/MenuTopicpreview1.vue";
import MenuTopicpreview2 from "./components/BasicSettings/MenuTopicpreview2.vue";
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
import MenuRemovePostAvatar from "./components/BasicSettings/MenuRemovePostAvatar.vue";
import MenuBackToTop from "./components/BasicSettings/MenuBackToTop.vue";
import MenuBackToOneFloor from "./components/BasicSettings/MenuBackToOneFloor.vue";
import MenuQuickLikeTopic from "./components/BasicSettings/MenuQuickLikeTopic.vue";
import MenuHideNewBluedot from "./components/BasicSettings/MenuHideNewBluedot.vue";
import MenuGifToPng from "./components/BasicSettings/MenuGifToPng.vue";
import MenuHideHomeBanner from "./components/BasicSettings/MenuHideHomeBanner.vue";
import MenuBookmark from "./components/BasicSettings/MenuBookmark.vue";
import MenuHideWelfareDone from "./components/BasicSettings/MenuHideWelfareDone.vue";
import MenuTopicToImages from "./components/BasicSettings/MenuTopicToImages.vue";
import MenuViewOwnReply from "./components/BasicSettings/MenuViewOwnReply.vue";
import MenuUsernameLength from "./components/BasicSettings/MenuUsernameLength.vue";
import MenuMonitorWidthOptimization from "./components/BasicSettings/MenuMonitorWidthOptimization.vue";
import MenuCatePageOptimizeBanner from "./components/BasicSettings/MenuCatePageOptimizeBanner.vue";
import MenuExportArticle from "./components/BasicSettings/MenuExportArticle.vue";
import MenuTopicOwnerBadge from "./components/BasicSettings/MenuTopicOwnerBadge.vue";
import MenuAlwaysFirstPost from "./components/BasicSettings/MenuAlwaysFirstPost.vue";
import MenuInsertStrikethrough from "./components/BasicSettings/MenuInsertStrikethrough.vue";

// 自定义文字
import MenuOtherCss from "./components/CustomText/MenuOtherCss.vue";
import MenuLogoUrl from "./components/CustomText/MenuLogoUrl.vue";
import MenuIconTitle from "./components/CustomText/MenuIconTitle.vue";
import MenuCreatereply from "./components/CustomText/MenuCreatereply.vue";
import MenuBlockuserlist from "./components/CustomText/MenuBlockuserlist.vue";
import MenuBlockKeyword from "./components/CustomText/MenuBlockKeyword.vue";
import MenuShieldPosts from "./components/CustomText/MenuShieldPosts.vue";
import MenuBlockTags from "./components/CustomText/MenuBlockTags.vue";

// 用户标签
import UserTags from "./components/UserTags/UserTags.vue";
import MenuUserTags from "./components/UserTags/MenuUserTags.vue";

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
import BackToTop from "./components/Button/BackToTop.vue";
import BackToOneFloor from "./components/Button/BackToOneFloor.vue";

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
    MenuSimpleMode,
    MenuOpenpostblank,
    MenuNewtopicreminder,
    MenuAutoexpandreply,
    MenuAutoexpandreply1,
    MenuShowcreatetime,
    MenuShowcreatetime1,
    MenuShowfloors,
    MenuHidetopicdetailtitle,
    MenuTopicpreview1,
    MenuTopicpreview2,
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
    MenuRemovePostAvatar,
    MenuBackToTop,
    MenuBackToOneFloor,
    BackToTop,
    BackToOneFloor,
    MenuQuickLikeTopic,
    MenuHideNewBluedot,
    MenuGifToPng,
    MenuHideHomeBanner,
    MenuBookmark,
    MenuHideWelfareDone,
    MenuTopicToImages,
    MenuViewOwnReply,
    MenuUsernameLength,
    MenuMonitorWidthOptimization,
    MenuIconTitle,
    MenuCatePageOptimizeBanner,
    MenuUserTags,
    MenuExportArticle,
    MenuTopicOwnerBadge,
    MenuAlwaysFirstPost,
    MenuBlockTags,
    MenuInsertStrikethrough,
  },
  data() {
    return {
      isShow: false,

      opacity: false,
      showdialog: false,

      activeIndex: 0, // 当前激活的索引

      version: packageJson.version,
      opacity: false,
      open: false,

      // 设置数据
      settingData: {
        checked0: false,
        checked1: false,
        checked2: false,
        checked3: false,
        checked31: false,
        checked4: false,
        checked41: true,
        checked5: true,
        checked6: false,
        checked7: false,
        checked7_1: false,
        checked9: true,
        QuickReply: "",
        blockList: "",
        blockkeywrod: "",
        blocktags: "",
        checked10: false,
        othercss: "",
        logourl: "",
        IconTitle: {
          iconurl: "",
          title: "",
        },
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
        checked34: true,
        checked35: false,
        checked37: false,
        checked38: false,
        checked39: false,
        checked40: false,
        checked42: false,
        checked43: false,
        checked44: false,
        checked45: false,
        checked46: false,
        checked47: false,
        checked48: false,
        checked49: false,
        checked50: false,
        removePostavatarData: {
          enable: false,
          showAuthor: false,
        },
        isUserTags: true,
        usertags: [],
        gptdata: {
          value1: false,
          value2: false,
          title: false,
          summaryAll: false,
          btn: true,
          provider: 'openai',
          apikey: '',
          api_url: 'https://api.openai.com/v1/chat/completions',
          model: 'gpt-4o-mini',
          isTemPer: true,
          temperature: 0.7,
          prompt: '根据以下帖子内容进行总结，请使用 markdown 格式返回回答，没有字数限制，但要求文字精炼，简介准确，语言要求返回简体中文，并且进行中英文混排优化。可以通过编号列表（1，2，3）列出核心要点。注意不要输出标题，例如：核心要点总结，帖子总结等，直接输出文本段落。',
          prompt1: '根据以下帖子内容，帮我给作者写一条回复，简短，表明我的观点，用口语回复，不需要很正式。您可以通过讨论的方式进行回复，这将有助于引导其他用户或作者进行互动。',
          prompt2: '根据以下帖子内容，生成一个合适的标题用于社交论坛发布使用，格式要求：不要书名号或其他符号，只需要一句纯文本。尽量精简到 15 字以内，如果字数不够表达主题，可以适当多生成几个字。',
          prompt3: '我会输入一论坛的主贴及所有回复，你需要输出：1.主贴总结：简要概括主贴核心内容 (2-3 句)，2. 讨论分析：主要观点倾向和共识/分歧点，讨论氛围评估 3.代表性回复：引用几条有代表性的回复 (附用户名)，简述每条回复的代表性和价值 4.争议点标记：标记格式：⚠️ [用户名]: "引用内容"，简析争议原因和各方立场 5.简要评估：评估讨论的整体氛围（如：友善、学术性、对抗性等）注意：保持客观公正，注重实质内容分析，区分事实与观点',
        },
        themes: 0,
        checkedExportArticle: false,
      },

      showlookop: false,
      showlevelsearch: false,
      showreplybtn: false,
      showbacktotop: false,
      showbacktoonefloor: false,
      settingsSearchQuery: '', // 添加搜索查询字段
    };
  },
  methods: {
    handleKeyDown(e) {
      if (e.altKey && e.key === '-') {
        e.preventDefault();
        e.stopPropagation();

        const el = e.target;
        const start = el.selectionStart;
        const end = el.selectionEnd;

        // 获取当前值
        const currentValue = el.value;
        // 创建新值
        const newValue = currentValue.substring(0, start) + '-' + currentValue.substring(end);

        // 手动修改输入框的值
        el.value = newValue;

        // 触发 input 事件来更新 v-model 绑定的数据
        el.dispatchEvent(new Event('input', { bubbles: true }));

        // 设置光标位置
        this.$nextTick(() => {
          el.selectionStart = el.selectionEnd = start + 1;
        });
      }
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
    // 搜索设置项
    matchesSearch(settingName) {
      if (!this.settingsSearchQuery) return true;

      const query = this.settingsSearchQuery.toLowerCase();
      return settingName.toLowerCase().includes(query);
    },
  },
  created() {
    setInterval(() => {
      if($('.linxudoscripts-btn').length<1) {
        $(".topic-map__contents").before(`<div class="linxudoscripts-btn"></div>`);
      }
    }, 1000);
    const browserAPI = typeof browser !== "undefined" ? browser : chrome;
    $("body").append('<div id="messageToast"></div>');
    console.log(
      `%c LinuxDo Scripts 扩展 v${packageJson.version} %c 已开启 `,
      "padding: 2px 1px; color: #fff; background: #606060;",
      "padding: 2px 1px; color: #fff; background: #42c02e;"
    );

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
      this.showbacktotop = this.settingData.checked34;
      this.showbacktoonefloor = this.settingData.checked48;

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

    browserAPI.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === "getData") {
        browserAPI.storage.local.get(["transferData"], (result) => {
          if (result.transferData) {
            // 处理收到的设置数据
            localStorage.setItem("isShowSettingConfig", result.transferData.isShowSettingConfig);

            // 处理完成后删除数据
            browserAPI.storage.local.remove("transferData");
          }
        });
      }
    });

    // 判断是否设置隐藏按钮
    const isShowSettingConfig = localStorage.getItem("isShowSettingConfig");

    if (isShowSettingConfig) {
      this.isShow = JSON.parse(isShowSettingConfig);
    }

  },
};
</script>