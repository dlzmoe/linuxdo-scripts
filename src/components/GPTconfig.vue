<template>
  <!-- 生成话题总结 -->
  <div>
    <div class="item">
      <div class="tit">是否开启 gpt 生成话题总结</div>
      <template>
        <el-checkbox v-model="localChecked.value1" @change="handleChange"></el-checkbox>
      </template>
    </div>
    <el-input v-model="localChecked.apikey" placeholder="sk-xxxxxxxx"></el-input>
    <el-input
      v-model="localChecked.baseurl"
      placeholder="https://api.openai.com"
    ></el-input>
    <el-input v-model="localChecked.model" placeholder="模型，如：gpt-4o-mini"></el-input>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: {
        value1: false,
        apikey: "",
        baseurl: "https://api.openai.com",
        model: "gpt-4o-mini",
      },
    },
  },
  data() {
    return {
      localChecked: this.value,
    };
  },
  watch: {
    value(newValue) {
      this.localChecked = newValue;
    },
  },
  methods: {
    handleChange() {
      this.$emit("input", this.localChecked);
    },
    getTopicUrl(url) {
      const regex = /^(https:\/\/linux\.do\/t\/topic\/\d+)(\/\d+)?$/;
      const match = url.match(regex);
      return match ? match[1] : url;
    },
    // 获取帖子内容
    async getPostContent() {
      $(".post-stream").before('<div class="gpt-summary"></div>');
      let topicUrl = this.getTopicUrl(window.location.href);
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "GET",
          url: topicUrl + "/1.json",
          headers: {
            accept: "application/json, text/javascript, */*; q=0.01",
            "accept-language": "zh-CN,zh;q=0.9",
            "x-requested-with": "XMLHttpRequest",
          },
          onload: async function (response) {
            const config = JSON.parse(localStorage.getItem("linxudoscriptssetting"))
              .gptdata;
            if (response.status === 200) {
              try {
                const data = JSON.parse(response.responseText);
                const str = data.post_stream.posts[0].cooked;

                const prompt = `
  根据以下帖子内容进行总结，请使用 text 文本返回回答，字数限制 200 字以内，越精炼越好，语言要求返回简体中文，不管原文是什么语言。

  帖子内容如下：
  ${str}
            `;

                const gptResponse = await fetch(`${config.baseurl}/v1/chat/completions`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${config.apikey}`,
                  },
                  body: JSON.stringify({
                    model: config.model,
                    messages: [
                      {
                        role: "user",
                        content: prompt,
                      },
                    ],
                    temperature: 0.7,
                  }),
                });

                const gptData = await gptResponse.json();
                console.log(gptData.choices[0].message.content);
                $(".gpt-summary").html(`AI 总结：${gptData.choices[0].message.content}`);
              } catch (error) {
                $(".gpt-summary").html(`生成失败，请检查配置是否正确并刷新重试！`);
                reject(error);
              }
            } else {
              $(".gpt-summary").html(`生成失败，请检查配置是否正确并刷新重试！`);
            }
          },
          onerror: function (error) {
            reject(error);
          },
        });
      });
    },

    // 使用 GPT 总结帖子
    classifyPost(postContent) {
      console.log(postContent);
    },
  },
  created() {
    if (this.localChecked.value1) {
      setInterval(() => {
        if ($(".post-stream").length > 0) {
          if ($(".gpt-summary").length < 1) {
            this.getPostContent();
          }
        }
      }, 1000);
    }
  },
};
</script>
<style scoped>
.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: none;
}
</style>
