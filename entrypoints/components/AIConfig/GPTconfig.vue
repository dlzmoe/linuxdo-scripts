<template>
  <div>
    <div class="item">
      <div class="tit">1. 是否开启 AI 生成话题总结</div>
      <input type="checkbox" v-model="localChecked.value1" @change="handleChange" />
    </div>
    <div class="item">
      <div class="tit">2. 是否显示手动总结按钮</div>
      <input type="checkbox" v-model="localChecked.btn" @change="handleChange" />
    </div>
    <div class="item">
      <div class="tit">3. 是否开启 AI 生成回复推荐</div>
      <input type="checkbox" v-model="localChecked.value2" @change="handleChange" />
    </div>
    <div class="item">
      <div class="tit">4. 新建话题使用 AI 生成标题</div>
      <input type="checkbox" v-model="localChecked.title" @change="handleChange" />
    </div>
    <div class="item">
      <div class="tit">5. 配置信息</div>
    </div>
    <input type="text" v-model="localChecked.apikey" placeholder="sk-xxxxxxxx" />
    <div class="flex">
      <input
        style="width: 33%"
        type="text"
        v-model="localChecked.baseurl"
        placeholder="https://api.openai.com"
      />
      <input
        style="width: 32%; margin-left: 1%"
        type="text"
        v-model="localChecked.full_url"
        placeholder="/v1/chat/completions"
      />
      <input
        style="width: 32%; margin-left: 1%"
        type="text"
        v-model="localChecked.model"
        placeholder="模型，如：gpt-4o-mini"
      />
    </div>
    <div class="item">6. AI 总结帖子 prompt:</div>
    <textarea v-model="localChecked.prompt"></textarea>
    <div class="item">7. AI 生成回复 prompt:</div>
    <textarea v-model="localChecked.prompt1"></textarea>
    <div class="item">8. AI 生成标题 prompt:</div>
    <textarea v-model="localChecked.prompt2"></textarea>
    <div class="item" style="margin-top: 10px">
      注意：请按照指定格式填写参数；不支持 http，请使用 https。
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import { marked } from "marked";
export default {
  props: {
    value: {
      type: Object,
      default: {
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
      this.$emit("update:value", this.localChecked);
    },
    getTopicUrl(url) {
      const regex = /^(https:\/\/linux\.do\/t\/topic\/\d+)(\/\d+)?$/;
      const match = url.match(regex);
      return match ? match[1] : url;
    },
    // 是否开启手动生成
    setCreatedBtn() {
      if (this.localChecked.btn) {
        $("head").append("<style>.aicreated-btn{display:inline-flex!important}</style>");
      }
    },
    // 获取帖子内容并生成总结
    async getPostContent() {
      $(".post-stream").before(
        `<div class="gpt-summary-wrap">
         <div class="gpt-summary">AI 总结：正在使用 AI 总结内容中，请稍后...</div>
          </div>`
      );

      const config = JSON.parse(localStorage.getItem("linxudoscriptssettingDMI")).gptdata;

      return new Promise((resolve, reject) => {
        const str = $("#topic-title h1 a").text() + $("#post_1 .cooked").text();
        const prompt = `${config.prompt}
帖子内容如下：
${str}`;
        fetch(`${config.baseurl}${config.full_url}`, {
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
        })
          .then((response) => {
            if (!response.ok) {
              reject(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((gptData) => {
            $(".gpt-summary").html(`${marked.parse(gptData.choices[0].message.content)}`);

            let summaryCache = JSON.parse(localStorage.getItem("summaryCacheData")) || [];
            const regex = /^(https:\/\/linux\.do\/t\/topic\/\d+)(\/\d+)?$/;
            const match = window.location.href.match(regex)[1];
            let existingObject = summaryCache.find((item) => item.name == match);

            let newObject = {
              name: match,
              value: gptData.choices[0].message.content,
            };
            if (existingObject) {
              // 旧数据覆盖
              existingObject.value = newObject.value;
            } else {
              summaryCache.push(newObject);
            }
            // 将帖子总结的数据缓存
            localStorage.setItem("summaryCacheData", JSON.stringify(summaryCache));

            resolve();
          })
          .catch((error) => {
            $(".gpt-summary").html(`生成失败，请检查配置是否正确并刷新重试！`);
            console.log(error);
          });
      });
    },
    // 生成 AI 回复
    async setAIRelpy() {
      $(".aireply-popup").show();
      $(".aireply-popup-text").html("AI 推荐回复正在生成中，请稍后。。。");
      const config = JSON.parse(localStorage.getItem("linxudoscriptssettingDMI")).gptdata;

      return new Promise((resolve, reject) => {
        const str = $("#topic-title h1 a").text() + $("#post_1 .cooked").text();
        const prompt = `${config.prompt1}
帖子内容如下：
${str}`;

        fetch(`${config.baseurl}${config.full_url}`, {
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
        })
          .then((response) => {
            if (!response.ok) {
              reject(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((gptData) => {
            this.AIReplyPopup(gptData.choices[0].message.content);
            resolve();
          })
          .catch((error) => {
            console.log(error);
          });
      });
    },

    // 推荐回复弹窗
    AIReplyPopup(text) {
      $(".aireply-popup-text").html(text);
    },
    // AI 根据新建话题内容生成标题
    async getCreateNewTopicTitle() {
      return new Promise((resolve, reject) => {
        const topic_contentdata = $(".d-editor-preview").html();
        const config = JSON.parse(localStorage.getItem("linxudoscriptssettingDMI"))
          .gptdata;
        const prompt = `${config.prompt2}
帖子内容如下：
${topic_contentdata}`;

        fetch(`${config.baseurl}${config.full_url}`, {
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
        })
          .then((response) => {
            if (!response.ok) {
              reject(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((gptData) => {
            $("#reply-title").val(gptData.choices[0].message.content);
            resolve();
          })
          .catch((error) => {
            console.log(error);

            $("#reply-title").val(`抱歉生成失败，请检查配置或者反馈给开发者！`);
          });
      });
    },
  },
  async created() {
    if (this.localChecked.value2) {
      $("body").append(`
        <div class="aireply-popup">
          <textarea class="aireply-popup-text"></textarea>
          <button class="aireply-popup-close">关闭</button>
        </div>
      `);

      setInterval(() => {
        if ($(".gpt-summary-wrap").length < 1 && $(".aireplay-btn").length < 1) {
          $("#topic-title").after(
            `<button class="aireplay-btn" type="button">AI 回复</button>`
          );
          $(".aireplay-btn").click(() => {
            this.setAIRelpy();
          });
          $(".aireply-popup-close").click(() => {
            $(".aireply-popup").hide();
            $(".aireply-popup-text").html("AI 推荐回复正在生成中，请稍后。。。");
          });
        }
      }, 1000);
    }
    if (this.localChecked.value1) {
      setInterval(() => {
        if ($(".gpt-summary-wrap").length < 1 && $(".aicreated-btn").length < 1) {
          $("#topic-title").after(
            `<button class="aicreated-btn" type="button">AI 总结</button>`
          );
          $(".aicreated-btn").click(() => {
            $(".gpt-summary-wrap").remove();
            this.getPostContent();
          });
        }
      }, 1000);

      this.setCreatedBtn();
      setInterval(() => {
        if ($(".post-stream").length > 0) {
          // 从 localStorage 获取缓存数据
          if ($(".gpt-summary-wrap").length < 1) {
            let summaryCache = JSON.parse(localStorage.getItem("summaryCacheData")) || [];
            const regex = /^(https:\/\/linux\.do\/t\/topic\/\d+)(\/\d+)?$/;
            const match = window.location.href.match(regex)[1];

            let existingObject = summaryCache.find((item) => item.name === match);

            if (existingObject) {
              $(".post-stream").before(
                `<div class="gpt-summary-wrap">
<div class="gpt-summary">${marked.parse(existingObject.value)}</div>
</div>`
              );
            }
          }

          if (!this.localChecked.btn) {
            if ($(".gpt-summary-wrap").length < 1) {
              this.getPostContent();
            }
          }
          $(".topic-list .main-link a.title").click(() => {
            $(".gpt-summary-wrap").remove();
          });
        }
      }, 1000);
    }

    if (this.localChecked.title) {
      setInterval(() => {
        if ($(".action-title").length > 0) {
          if ($(".action-title").html().includes("创建新话题")) {
            if ($(".aicreatenewtopictitle").length < 1) {
              $(".action-title").append(
                '<span class="aicreatenewtopictitle">AI 生成标题</span>'
              );

              $(".aicreatenewtopictitle").click(() => {
                $("#reply-title").val("正在生成中，请稍后...");
                this.getCreateNewTopicTitle();
              });
            }
          }
        }
      }, 1000);

      // 判断 AI 总结的缓存记录，只保留最近 20 个
      let summaryCacheData = JSON.parse(localStorage.getItem("summaryCacheData")) || [];
      if (summaryCacheData.length > 20) {
        summaryCacheData = summaryCacheData.slice(-20);
      }
      localStorage.setItem("summaryCacheData", JSON.stringify(summaryCacheData));
    }
  },
};
</script>

<style lang="less" scoped>
.item {
  border: none !important;
  padding-bottom: 5px !important;
}
.flex {
  display: flex;
  margin-top: 10px;

  input {
    flex: 1;
  }
}
</style>
