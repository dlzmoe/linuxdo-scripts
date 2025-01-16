<template>
  <ul class="nav">
    <li :class="{ act: activeTab === 'hot' }" @click="changeTab('hot')">最热</li>
    <li :class="{ act: activeTab === 'news' }" @click="changeTab('news')">最新</li>
    <li :class="{ act: activeTab === 'menu' }" @click="changeTab('menu')">菜单</li>
  </ul>
  <div class="refresh" @click="refresh"><svg xmlns="http://www.w3.org/2000/svg" width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-refresh"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" /></svg></div>
  <div class="container">
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

export default {
  data() {
    return {
      activeTab: "news",
      hotlist: [], // 热门列表
      newslist: [], // 最新列表
    };
  },
  components: {
    HotPosts,
    NewsPosts,
    SettingMenu,
  },
  methods: {
    changeTab(tab) {
      this.activeTab = tab;
    },
    // 获取热门列表
    async getHotPosts() {
      this.hotlist = [];
      fetch("https://linux.do/top.json")
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
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
          console.log(data);
          this.newslist = data.topic_list.topics;
          localStorage.setItem('newslist', JSON.stringify(this.newslist));
        })
        .catch((error) => {});
    },

    // 刷新
    refresh() {
      this.getHotPosts();
      this.getNewsPosts();
      localStorage.setItem('Timestamp', Date.now());
      this.$message({
        message: "已刷新~",
        type: "success",
        duration: 1000,
      });
    }
  },
  created() {
    const Timestamp = localStorage.getItem('Timestamp', Date.now());
    if (Timestamp) {
      const timeDiff = new Date() - Timestamp;
      if (timeDiff > 300000) { // 五分钟
        localStorage.removeItem('hotlist');
        localStorage.removeItem('newslist');
        localStorage.removeItem('Timestamp');
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

  }
};
</script>
