<template>
  <div>
    <div class="item">
      <div class="tit">1. 是否开启 AI 生成话题总结</div>
      <input type="checkbox" v-model="localChecked.value1" @change="handleChange" />
    </div>
    <div class="item">
      <div class="tit">2. 是否手动总结（默认自动总结）</div>
      <input type="checkbox" v-model="localChecked.btn" @change="handleChange" />
    </div>
    <div class="item">
      <div class="tit">3. 是否关闭重新生成按钮（默认显示重新生成）</div>
      <input type="checkbox" v-model="localChecked.value2" @change="handleChange" />
    </div>
    <div class="item">
      <div class="tit">4. 新建话题使用 AI 生成标题</div>
      <input type="checkbox" v-model="localChecked.title" @change="handleChange" />
    </div>
    <hr />
    <input type="text" v-model="localChecked.apikey" placeholder="sk-xxxxxxxx" />
    <input
      type="text"
      v-model="localChecked.baseurl"
      placeholder="https://api.openai.com"
    />
    <input type="text" v-model="localChecked.model" placeholder="模型，如：gpt-4o-mini" />
    <textarea v-model="localChecked.prompt" placeholder="提示词 prompt"></textarea>
    <div style="margin-top: 10px">注意：baseurl 不带后缀和 '/'</div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: {
        value1: false,
        value2: false,
        title: false,
        btn: false,
        apikey: "",
        baseurl: "https://api.openai.com",
        model: "gpt-4o-mini",
        prompt: `根据以下帖子内容进行总结，请使用 markdown 格式返回回答，没有字数限制，但要求文字精炼，简介准确，语言要求返回简体中文，并且进行中英文混排优化。可以通过编号列表（1，2，3）列出核心要点。
注意不要输出标题，例如：核心要点总结，帖子总结等，直接输出文本段落。`,
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
        // 开启
        setInterval(() => {
          if ($(".gpt-summary-wrap").length < 1 && $(".aicreated-btn").length < 1) {
            $("#topic-title").after(
              `<button class="aicreated-btn" type="button">AI 总结</button>`
            );
            $(".aicreated-btn").click(() => {
              $(".aicreated-btn").remove();
              $(".gpt-summary-wrap").remove();
              this.getPostContent();
            });
          }
        }, 1000);
      }
    },
    // 获取帖子内容并生成
    async getPostContent() {
      $(".post-stream").before(
        `<div class="gpt-summary-wrap">
         <div class="gpt-summary">AI 总结：正在使用 AI 总结内容中，请稍后...</div>
         <button type="button" class="airegenerate" style="display:none">重新生成</button>
          </div>`
      );
      $(".airegenerate").click(() => {
        $(".gpt-summary-wrap").remove();
        this.getPostContent();
      });

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
            const config = JSON.parse(localStorage.getItem("linxudoscriptssetting")).gptdata;
            if (response.status === 200) {
              try {
                const data = JSON.parse(response.responseText);
                const str = data.post_stream.posts[0].cooked;
                const prompt = `${config.prompt}
帖子内容如下：
${str}`;
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
                $(".gpt-summary").html(
                  `AI 总结：${marked.parse(gptData.choices[0].message.content)}`
                );
                $(".airegenerate").show();

                let summaryCache =
                  JSON.parse(localStorage.getItem("summaryCacheData")) || [];
                const regex = /^(https:\/\/linux\.do\/t\/topic\/\d+)(\/\d+)?$/;
                const match = window.location.href.match(regex)[0];
                let existingObject = summaryCache.find((item) => item.name == match);

                let newObject = {
                  name: topicUrl,
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
              } catch (error) {
                $(".gpt-summary").html(`生成失败，请检查配置是否正确并刷新重试！`);
                $(".airegenerate").show();
                reject(error);
              }
            } else {
              $(".gpt-summary").html(`生成失败，请检查配置是否正确并刷新重试！`);
              $(".airegenerate").show();
            }
          },
          onerror: function (error) {
            reject(error);
          },
        });
      });
    },
    // AI 根据新建话题内容生成标题
    async getCreateNewTopicTitle() {
      return new Promise((resolve, reject) => {
        const topic_contentdata = $(".d-editor-preview").html();
        const config = JSON.parse(localStorage.getItem("linxudoscriptssetting")).gptdata;
        const prompt = `根据以下帖子内容，生成一个合适的标题用于社交论坛发布使用，格式要求：不要书名号或其他符号，只需要一句纯文本。尽量精简到15字以内，如果字数不够表达主题，可以适当多生成几个字。
帖子内容如下：
${topic_contentdata}`;

        fetch(`${config.baseurl}/v1/chat/completions`, {
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
            console.log(gptData.choices[0].message.content);
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
  created() {
    if (this.localChecked.value1) {
      let script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
      document.body.appendChild(script);

      this.setCreatedBtn();
      setInterval(() => {
        if ($(".post-stream").length > 0) {
          // 从 localStorage 获取缓存数据
          if ($(".gpt-summary-wrap").length < 1) {
            let summaryCache = JSON.parse(localStorage.getItem("summaryCacheData")) || [];
            const regex = /^(https:\/\/linux\.do\/t\/topic\/\d+)(\/\d+)?$/;
            const match = window.location.href.match(regex)[0];

            let existingObject = summaryCache.find((item) => item.name === match);

            if (existingObject) {
              $(".post-stream").before(
                `<div class="gpt-summary-wrap">
<div class="gpt-summary">AI 总结：${marked.parse(existingObject.value)}</div>
<button type="button" class="airegenerate" style="display:none">重新生成</button>
</div>`
              );

              $(".airegenerate").click(() => {
                $(".gpt-summary-wrap").remove();
                this.getPostContent();
              });
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
    if (this.localChecked.value2) {
      $("body").append("<style>.airegenerate{display:none!important;}</style>");
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
    }
  },
};
</script>
<style scoped>
.item {
  border: none;
}
</style>
