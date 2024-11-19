<template>
  <div>
    <div class="hotranking">
      <div class="el-button" @click="hotranking" title="只看楼主">热门</div>
    </div>
    <div class="hotranking-container" v-show="show">
      <div class="flex">
        <div class="title">今日最热帖子</div>
        <button @click="query">刷新</button>
      </div>
      <ol>
        <li v-for="item in list" :key="item.id">
          <a :href="'https://linux.do/t/topic/' + item.id" target="_blank">
            {{ item.title }}
          </a>
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      list: [],
    };
  },
  methods: {
    hotranking() {
      this.show = !this.show;
    },
    query() {
      this.list = [];
      this.init();
    },
    init() {
      fetch("/top.json")
        .then((response) => response.json())
        .then((data) => {
          this.list = data.topic_list.topics.slice(0, 10);
        })
        .catch((error) => {});
    },
  },
  created() {
    this.init();
  },
};
</script>
