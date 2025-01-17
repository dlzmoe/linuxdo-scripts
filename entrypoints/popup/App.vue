<template>
  <div class="nav-wrap">
    <ul class="nav">
      <li :class="{ act: activeTab === 'hot' }" @click="changeTab('hot')">最热</li>
      <li :class="{ act: activeTab === 'news' }" @click="changeTab('news')">最新</li>
      <li :class="{ act: activeTab === 'menu' }" @click="changeTab('menu')">菜单</li>
    </ul>
    <div class="fixed-icon">
      <div class="item" title="10分钟自动刷新一次" @click="refresh">
        <Refresh />
      </div>
    </div>
  </div>

  <div class="container" ref="container">
    <div class="content" :class="{ act: activeTab === 'hot' }">
      <HotPosts :list="hotlist" />
    </div>
    <div class="content" :class="{ act: activeTab === 'news' }">
      <NewsPosts :list="newslist" />
    </div>
    <div class="content" :class="{ act: activeTab === 'menu' }">
      <SettingMenu />
    </div>
  </div>
</template>

<script>
import HotPosts from "./components/HotPosts.vue";
import NewsPosts from "./components/NewsPosts.vue";
import SettingMenu from "./components/SettingMenu.vue";
import Refresh from "./components/SVG/Refresh.vue";

export default {
  data() {
    return {
      activeTab: "news",
      hotlist: [], // 热门列表
      newslist: [], // 最新列表

      lastScrollPosition: 0, // 存储滚动位置
    };
  },
  components: {
    HotPosts,
    NewsPosts,
    SettingMenu,
    Refresh,
  },
  methods: {
    // 平滑滚动到顶部
    scrollToTop() {
      const container = this.$refs.container;
      if (container) {
        container.scrollTo({
          top: 0,
          behavior: 'smooth' // 平滑滚动
        });
      }
    },
    // 切换菜单
    changeTab(tab) {
      this.activeTab = tab;
      this.scrollToTop();
      localStorage.setItem('activeTab', this.activeTab);
    },
    // 获取热门列表
    async getHotPosts() {
      this.hotlist = [];
      fetch("https://linux.do/top.json")
        .then((response) => response.json())
        .then((data) => {
          this.hotlist = data.topic_list.topics;
          localStorage.setItem('hotlist', JSON.stringify(this.hotlist));
        })
        .catch((error) => { });
    },
    // 获取最新列表
    async getNewsPosts() {
      this.newslist = [];
      fetch("https://linux.do/new.json")
        .then((response) => response.json())
        .then((data) => {
          this.newslist = data.topic_list.topics;
          localStorage.setItem('newslist', JSON.stringify(this.newslist));
        })
        .catch((error) => { });
    },

    // 刷新
    refresh() {
      this.getHotPosts();
      this.getNewsPosts();
      localStorage.setItem('Timestamp', Date.now());
    },

    // 当容器滚动时，记录当前位置
    recordScroll() {
      const container = this.$refs.container;
      if (container) {
        this.lastScrollPosition = container.scrollTop; // 保存滚动位置
        localStorage.setItem('lastScrollPosition', this.lastScrollPosition);
      }
    },

    // 恢复到之前保存的位置
    restoreScrollPosition() {
      const container = this.$refs.container;
      if (container) {
        container.scrollTo({
          top: this.lastScrollPosition, // 恢复上次保存的位置
          // behavior: "smooth", // 平滑滚动
        });
      }
    },
  },
  created() {

    /* 找到上次打开的位置 */
    const activeTab = localStorage.getItem('activeTab');
    if (activeTab) {
      this.activeTab = activeTab;
    }
    const lastScrollPosition = localStorage.getItem('lastScrollPosition');
    if (lastScrollPosition) {
      this.lastScrollPosition = Number(lastScrollPosition); // 转换为数字

      // 滚动到之前保存的位置
      setTimeout(() => {
        this.restoreScrollPosition();
      }, 1);
    }
    this.recordScroll();
    /* 找到上次打开的位置 */

    const Timestamp = localStorage.getItem('Timestamp', Date.now());
    if (Timestamp) {
      const timeDiff = new Date() - Timestamp;
      if (timeDiff > 600000) { // 超过 10 分钟
        localStorage.removeItem('hotlist');
        localStorage.removeItem('newslist');
        localStorage.removeItem('Timestamp');
        localStorage.removeItem('activeTab');
        localStorage.setItem('Timestamp', Date.now());
      }
    } else {
      localStorage.setItem('Timestamp', Date.now());
    }

    const hotlist = localStorage.getItem('hotlist');
    if (hotlist) {
      this.hotlist = JSON.parse(hotlist);
    } else {
      this.getHotPosts(); // 获取热门列表
    }

    const newslist = localStorage.getItem('newslist');
    if (newslist) {
      this.newslist = JSON.parse(newslist);
    } else {
      this.getNewsPosts(); // 获取最新列表
    }

  },
  // 绑定滚动事件，自动记录滚动位置
  mounted() {
    const container = this.$refs.container;
    if (container) {
      container.addEventListener("scroll", this.recordScroll); // 监听滚动事件
    }
  },
  // 解绑事件，防止内存泄漏
  beforeDestroy() {
    const container = this.$refs.container;
    if (container) {
      container.removeEventListener("scroll", this.recordScroll);
    }
  },
};
</script>
