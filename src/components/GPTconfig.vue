<template>
  <!-- 生成话题总结 -->
  <div>
    <div class="item">
      <div class="tit">是否开启 gpt 生成话题总结</div>
      <input type="checkbox" v-model="localChecked.value1" @change="handleChange" />
    </div>
    <div class="item">
      <div class="tit">是否开启手动总结按钮，默认自动总结</div>
      <input type="checkbox" v-model="localChecked.btn" @change="handleChange" />
    </div>
    <div class="item">
      <div class="tit">是否关闭重新生成按钮</div>
      <input type="checkbox" v-model="localChecked.value2" @change="handleChange" />
    </div>
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
        btn: false,
        apikey: "",
        baseurl: "https://api.openai.com",
        model: "gpt-4o-mini",
        prompt:
          "根据以下帖子内容进行总结，请使用 text 文本返回回答，字数限制 200 字以内，越精炼越好，语言要求返回简体中文，并且进行中英文混排优化。",
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
    // 获取帖子内容
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
            const config = JSON.parse(localStorage.getItem("linxudoscriptssetting"))
              .gptdata;
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
                $(".gpt-summary").html(`AI 总结：${marked.parse(gptData.choices[0].message.content)}`);
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
