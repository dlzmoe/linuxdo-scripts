<template>
  <ul class="nav">
    <li :class="{ act: activeTab === 'hot' }" @click="changeTab('hot')">最热</li>
    <li :class="{ act: activeTab === 'news' }" @click="changeTab('news')">最新</li>
    <li :class="{ act: activeTab === 'menu' }" @click="changeTab('menu')">菜单</li>
  </ul>
  <div class="container">
    <div class="content" :class="{ act: activeTab === 'hot' }">
      <HotPosts />
    </div>
    <div class="content" :class="{ act: activeTab === 'news' }">
      <NewsPosts />
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
      activeTab: "hot", // 默认显示最热内容
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
  },
};
</script>
