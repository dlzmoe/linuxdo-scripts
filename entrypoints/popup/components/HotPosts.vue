<template>
  <div class="refresh" @click="getHotPosts"><svg xmlns="http://www.w3.org/2000/svg" width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-refresh"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" /></svg></div>
  <ul class="list" v-if="this.list.length>0">
    <li v-for="item in list" :key="item.id">
      <a :href="'https://linux.do/t/topic/' + item.id" target="_blank">
        {{ item.title }}
      </a>
    </li>
  </ul>
  <div class="nodata" v-else>暂无最热话题</div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
    };
  },
  methods: {
    // 获取热门列表
    async getHotPosts() {
      this.list = [];
      fetch("https://linux.do/top.json")
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          this.list = data.topic_list.topics.slice(0, 20);
          localStorage.setItem('hotlist', JSON.stringify(this.list));
        })
        .catch((error) => {});
    },
  },
  created() {
    const hotlist = localStorage.getItem('hotlist');
    if (hotlist) {
      this.list = JSON.parse(hotlist);
    } else {
      this.getHotPosts(); // 获取热门列表
    }
  },
};
</script>
