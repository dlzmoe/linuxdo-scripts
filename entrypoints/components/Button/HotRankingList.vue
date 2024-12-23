<template>
  <div>
    <div class="hotranking">
      <div class="el-button" @click="hotranking" title="只看楼主">热门</div>
    </div>
    <div class="hotranking-container" v-show="showhot">
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
import $ from "jquery";
export default {
  data() {
    return {
      showhot: false,
      list: [],
    };
  },
  methods: {
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
    hotranking() {
      this.showhot = !this.showhot;
    },
    query() {
      this.list = [];
      this.init();
      this.messageToast("刷新成功！");
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

<style lang="less" scoped>
ol {
  padding: 0 0 0 20px;
}
</style>
