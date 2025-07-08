<template>
  <div>
    <p>
      <a
        style="color:#e00"
        href="https://linuxdo-scripts-docs.zishu.me/guide/3-ai/ai-summary.html"
        target="_blank"
        >查看 AI 使用文档！</a>
    </p>
    <div class="item">
      <div class="tit">1. 是否开启 AI 主贴总结</div>
      <input type="checkbox" v-model="localChecked.value1" @change="handleChange" />
    </div>
    <div class="item">
      <div class="tit">2. 是否开启 AI 生成所有已加载回帖总结 (手动，注意 token 消耗)</div>
      <input type="checkbox" v-model="localChecked.summaryAll" @change="handleChange" />
    </div>
    <div class="item">
      <div class="tit">3. 是否显示手动总结按钮</div>
      <input type="checkbox" v-model="localChecked.btn" @change="handleChange" />
    </div>
    <div class="item">
      <div class="tit">4. 是否开启 AI 生成回复推荐</div>
      <input type="checkbox" v-model="localChecked.value2" @change="handleChange" />
    </div>
    <div class="item">
      <div class="tit">5. 新建话题使用 AI 生成标题</div>
      <input type="checkbox" v-model="localChecked.title" @change="handleChange" />
    </div>

    <!-- 配置信息卡片 -->
    <div class="config-card">
      <div class="config-title">配置信息</div>

      <div class="item">
        <div class="label">选择服务商：</div>
        <div class="info">
          <select v-model="localChecked.provider" @change="handleProviderChange">
            <option value="openai">OpenAI</option>
            <!-- <option value="gemini">Gemini(暂不可用测试中)</option> -->
            <option value="deepseek">DeepSeek</option>
          </select>
        </div>
      </div>

      <div class="item">
        <div class="label">API Key:</div>
        <div class="info">
          <input
            type="text"
            v-model="localChecked.apikey"
            @keydown="handleKeyDown"
            :placeholder="getApiKeyPlaceholder()"
          />
        </div>
      </div>

      <div class="item">
        <div class="label">API URL:</div>
        <div class="info">
          <input
            type="text"
            v-model="localChecked.api_url"
            @keydown="handleKeyDown"
            :placeholder="getApiUrlPlaceholder()"
          />
        </div>
      </div>

      <div class="item">
        <div class="label">模型名称：</div>
        <div class="info">
          <input
            type="text"
            v-model="localChecked.model"
            @keydown="handleKeyDown"
            :placeholder="getModelPlaceholder()"
          />
        </div>
      </div>

      <div class="item">
        <div class="temperature">
          <label>温度（temperature）：{{ localChecked.temperature }}</label>
          <input
            type="range"
            :title="localChecked.temperature"
            v-model="localChecked.temperature"
            min="0"
            max="2"
            step="0.1"
            placeholder="0.7"
          />
        </div>
        <input type="checkbox" v-model="localChecked.isTemPer" @change="handleChange" />
      </div>

      <div class="item" style="font-style: italic; color: #666; font-size: 14px">
        注意：请按照指定格式填写参数；不支持 http，请使用 https。
      </div>
      <button @click="testConnection" class="test-btn">测试连通性</button>
      <div v-if="connectionStatus" :class="['connection-status', connectionStatus.type]">
        {{ connectionStatus.message }}
      </div>
    </div>

    <div class="prompt">
      <div class="item">
        <div class="tit">6. 提示词配置</div>
      </div>

      <div class="item">
        <div class="tit">AI 总结主贴 prompt:</div>
        <textarea v-model="localChecked.prompt" @keydown="handleKeyDown"></textarea>
      </div>

      <div class="item">
        <div class="tit">AI 总结全部回帖 prompt:</div>
        <textarea v-model="localChecked.prompt3" @keydown="handleKeyDown"></textarea>
      </div>

      <div class="item">
        <div class="tit">AI 生成回复 prompt:</div>
        <textarea v-model="localChecked.prompt1" @keydown="handleKeyDown"></textarea>
      </div>

      <div class="item">
        <div class="tit">AI 生成标题 prompt:</div>
        <textarea v-model="localChecked.prompt2" @keydown="handleKeyDown"></textarea>
      </div>
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
        summaryAll: false,
        btn: true,
        provider: "openai",
        apikey: "",
        api_url: "https://api.openai.com/v1/chat/completions",
        model: "gpt-4o-mini",
        isTemPer: true,
        temperature: 0.7,
        prompt:
          "根据以下帖子内容进行总结，请使用 markdown 格式返回回答，没有字数限制，但要求文字精炼，简介准确，语言要求返回简体中文，并且进行中英文混排优化。可以通过编号列表（1，2，3）列出核心要点。注意不要输出标题，例如：核心要点总结，帖子总结等，直接输出文本段落。",
        prompt1:
          "根据以下帖子内容，帮我给作者写一条回复，简短，表明我的观点，用口语回复，不需要很正式。您可以通过讨论的方式进行回复，这将有助于引导其他用户或作者进行互动。",
        prompt2:
          "根据以下帖子内容，生成一个合适的标题用于社交论坛发布使用，格式要求：不要书名号或其他符号，只需要一句纯文本。尽量精简到 15 字以内，如果字数不够表达主题，可以适当多生成几个字。",
        prompt3:
          '我会输入一论坛的主贴及所有回复，你需要输出：1.主贴总结：简要概括主贴核心内容 (2-3 句)，2. 讨论分析：主要观点倾向和共识/分歧点，讨论氛围评估 3.代表性回复：引用几条有代表性的回复 (附用户名)，简述每条回复的代表性和价值 4.争议点标记：标记格式：⚠️ [用户名]: "引用内容"，简析争议原因和各方立场 5.简要评估：评估讨论的整体氛围（如：友善、学术性、对抗性等）注意：保持客观公正，注重实质内容分析，区分事实与观点',
      },
    },
  },
  data() {
    return {
      localChecked: this.value,
      connectionStatus: null,
      checkIntervalId: null, // 添加变量存储定时器ID
      mainPostSummaryIntervalId: null, // 主贴总结按钮定时器
      summaryIntervalId: null, // 检查缓存和自动总结定时器
      allPostsSummaryIntervalId: null, // 回帖总结按钮定时器
      titleGenerationIntervalId: null, // 标题生成定时器
      observer: null,
    };
  },
  watch: {
    value(newValue) {
      this.localChecked = newValue;
    },
  },
  methods: {
    handleKeyDown(e) {
      if (e.altKey && e.key === '-') {
        e.preventDefault();
        e.stopPropagation();
        
        const el = e.target;
        const start = el.selectionStart;
        const end = el.selectionEnd;
        
        // 获取当前值
        const currentValue = el.value;
        // 创建新值
        const newValue = currentValue.substring(0, start) + '-' + currentValue.substring(end);
        
        // 手动修改输入框的值
        el.value = newValue;
        
        // 触发 input 事件来更新 v-model 绑定的数据
        el.dispatchEvent(new Event('input', { bubbles: true }));
        
        // 设置光标位置
        this.$nextTick(() => {
          el.selectionStart = el.selectionEnd = start + 1;
        });
      }
    },
    handleChange() {
      this.$emit("update:value", this.localChecked);
    },
    handleProviderChange() {
      // 根据服务商更新默认配置
      const defaultConfigs = {
        openai: {
          api_url: "https://api.openai.com/v1/chat/completions",
          model: "gpt-4o-mini",
        },
        gemini: {
          api_url:
            "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent",
          model: "gemini-1.5-flash",
        },
        deepseek: {
          api_url: "https://api.deepseek.com/v1/chat/completions",
          model: "deepseek-chat",
        },
      };

      const config = defaultConfigs[this.localChecked.provider];
      if (config) {
        this.localChecked.api_url = config.api_url;
        this.localChecked.model = config.model;
      }

      this.handleChange();
    },
    getApiKeyPlaceholder() {
      const placeholders = {
        openai: "sk-xxxxxxxx",
        gemini: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        deepseek: "sk-xxxxxxxx",
      };
      return placeholders[this.localChecked.provider] || "Enter API Key";
    },
    getApiUrlPlaceholder() {
      const placeholders = {
        openai: "https://api.openai.com/v1/chat/completions",
        gemini:
          "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent",
        deepseek: "https://api.deepseek.com/v1/chat/completions",
      };
      return placeholders[this.localChecked.provider] || "Enter API URL";
    },
    getModelPlaceholder() {
      const placeholders = {
        openai: "模型，如：gpt-4o-mini",
        gemini: "模型，如：gemini-1.5-flash",
        deepseek: "模型，如：deepseek-chat",
      };
      return placeholders[this.localChecked.provider] || "Enter Model Name";
    },
    getTopicUrl(url) {
      const regex = /^(https:\/\/linux\.do\/t\/topic\/\d+)(\/\d+)?$/;
      const match = url.match(regex);
      return match ? match[1] : url;
    },
    // 是否开启手动生成
    setCreatedBtn() {
      // 主贴总结按钮受"是否显示手动总结按钮"控制
      if (this.localChecked.btn && this.localChecked.value1) {
        $("head").append("<style>.aicreated-btn{display:inline-flex!important}</style>");
      }
      // 回帖总结按钮不受"是否显示手动总结按钮"控制
      if (this.localChecked.summaryAll) {
        $("head").append(
          "<style>.aicreated-all-btn{display:inline-flex!important}</style>"
        );
      }
    },
    // 获取帖子内容并生成总结
    async getPostContent(isSummaryAll = null) {
      $(".post-stream").before(
        `<div class="gpt-summary-wrap">
          <div class="gpt-summary">AI 总结：正在使用 AI 总结内容中，请稍后...</div>
         </div>`
      );

      const config = JSON.parse(localStorage.getItem("linxudoscriptssettingDMI")).gptdata;

      return new Promise((resolve, reject) => {
        let str = $("#topic-title h1 a").text();

        // 如果传入了参数，则使用参数值；否则使用配置值
        const summaryAll =
          isSummaryAll !== null ? isSummaryAll : this.localChecked.summaryAll;

        if (summaryAll) {
          // 收集所有帖子的内容
          $(".topic-post").each((index, element) => {
            str += `||${$(element).find(".first").text()} ：${$(element)
              .find(".cooked")
              .text()}`;
          });
          str = `${config.prompt3}\n帖子内容如下：\n${str}`;
        } else {
          // 只收集主贴内容
          str += $("#post_1 .cooked").text();
          str = `${config.prompt}\n帖子内容如下：\n${str}`;
        }

        // 构建请求头
        const headers = {
          "Content-Type": "application/json",
        };

        // 根据不同服务商设置认证头
        let apiUrl = config.api_url;
        switch (config.provider) {
          case "openai":
          case "deepseek":
            headers.Authorization = `Bearer ${config.apikey}`;
            break;
          case "gemini":
            apiUrl += `?key=${config.apikey}`;
            break;
        }

        // 构建请求体
        let requestBody;
        switch (config.provider) {
          case "openai":
          case "deepseek":
            requestBody = {
              model: config.model,
              messages: [{ role: "user", content: str }],
              stream: true,
              ...(config.isTemPer ? { temperature: Number(config.temperature) } : {}),
            };
            break;
          case "gemini":
            requestBody = {
              contents: [{ parts: [{ text: str }] }],
              generationConfig: {
                ...(config.isTemPer ? { temperature: Number(config.temperature) } : {}),
              },
            };
            break;
        }

        fetch(apiUrl, {
          method: "POST",
          headers,
          body: JSON.stringify(requestBody),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullContent = "";

            function processStream({ done, value }) {
              if (done) {
                // 流结束时保存到 localStorage
                let summaryCache =
                  JSON.parse(localStorage.getItem("summaryCacheData")) || [];
                const regex = /^(https:\/\/linux\.do\/t\/topic\/\d+)(\/\d+)?$/;
                const match = window.location.href.match(regex)[1];

                let existingObject = summaryCache.find((item) => item.name == match);
                let newObject = {
                  name: match,
                  value: fullContent,
                };

                if (existingObject) {
                  existingObject.value = newObject.value;
                } else {
                  summaryCache.push(newObject);
                }

                localStorage.setItem("summaryCacheData", JSON.stringify(summaryCache));
                return resolve();
              }

              // 解码收到的数据
              const chunk = decoder.decode(value, { stream: true });
              const lines = chunk.split("\n");

              // 处理每一行数据
              lines.forEach((line) => {
                if (line.startsWith("data: ") && line !== "data: [DONE]") {
                  try {
                    const jsonData = JSON.parse(line.slice(6));
                    if (jsonData.choices[0].delta.content) {
                      const content = jsonData.choices[0].delta.content;
                      fullContent += content;
                      // 使用 marked 实时渲染 markdown
                      $(".gpt-summary").html(marked.parse(fullContent));
                    }
                  } catch (error) {
                    console.log("Parse chunk error:", error);
                  }
                }
              });

              // 继续读取下一个数据块
              return reader.read().then(processStream);
            }

            return reader.read().then(processStream);
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

        fetch(config.api_url, {
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
            ...(config.isTemPer ? { temperature: Number(config.temperature) } : {}),
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

    // 测试 API 连通性
    async testConnection() {
      this.connectionStatus = {
        type: "info",
        message: "正在测试连接...",
      };
      try {
        const headers = {
          "Content-Type": "application/json",
        };

        // 根据不同服务商设置不同的认证头
        switch (this.localChecked.provider) {
          case "openai":
          case "deepseek":
            headers.Authorization = `Bearer ${this.localChecked.apikey}`;
            break;
          case "gemini":
            // Gemini 使用 URL 参数传递 key
            this.localChecked.api_url += `?key=${this.localChecked.apikey}`;
            break;
        }

        // 构建请求体
        let requestBody;
        switch (this.localChecked.provider) {
          case "openai":
          case "deepseek":
            requestBody = {
              model: this.localChecked.model,
              messages: [{ role: "user", content: "你好！" }],
            };
            break;
          case "gemini":
            requestBody = {
              contents: [{ parts: [{ text: "你好！" }] }],
            };
            break;
        }

        const response = await fetch(this.localChecked.api_url, {
          method: "POST",
          headers,
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          this.connectionStatus = {
            type: "success",
            message: "连接成功！API 配置正确。",
          };
        } else {
          const error = await response.json();
          this.connectionStatus = {
            type: "error",
            message: `连接失败：${error.error?.message || error.message || "未知错误"}`,
          };
        }
      } catch (error) {
        this.connectionStatus = {
          type: "error",
          message: `连接失败：${error.message || "网络错误"}`,
        };
      }
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

        fetch(config.api_url, {
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
            ...(config.isTemPer ? { temperature: Number(config.temperature) } : {}),
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
    refreshAISummary() {
      setTimeout(() => {
        $(".gpt-summary-wrap").remove();

        // 如果开启了主贴总结功能，重新获取缓存
        if (this.localChecked.value1 && $(".post-stream").length > 0) {
          let summaryCache = JSON.parse(localStorage.getItem("summaryCacheData")) || [];
          const regex = /^(https:\/\/linux\.do\/t\/topic\/\d+)(\/\d+)?$/;

          if (window.location.href.match(regex)) {
            const match = window.location.href.match(regex)[1];

            let existingObject = summaryCache.find((item) => item.name === match);

            if (existingObject) {
              $(".post-stream").before(
                `<div class="gpt-summary-wrap">
<div class="gpt-summary">${marked.parse(existingObject.value)}</div>
</div>`
              );
            } else if (!this.localChecked.btn) {
              // 如果没有缓存且设置为自动总结，则生成新的总结
              this.getPostContent(false);
            }
          }
        }
      }, 500);
    },
  },
  async created() {
    // 先调用 setCreatedBtn 确保样式正确应用
    this.setCreatedBtn();

    this.boundRefreshAISummary = this.refreshAISummary.bind(this);

    // 监听浏览器前进/后退事件
    window.addEventListener("popstate", this.boundRefreshAISummary);

    const originalPushState = history.pushState;
    history.pushState = function () {
      const result = originalPushState.apply(this, arguments);
      window.dispatchEvent(new Event("pushstate"));
      return result;
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function () {
      const result = originalReplaceState.apply(this, arguments);
      window.dispatchEvent(new Event("replacestate"));
      return result;
    };

    // 监听 pushstate 和 replacestate 事件
    window.addEventListener("pushstate", this.boundRefreshAISummary);

    window.addEventListener("replacestate", this.boundRefreshAISummary);

    // 初始页面
    if (window.location.href.includes("/topic/")) {
      this.refreshAISummary();
    }

    this.handleLinkClick = () => {
      $(".gpt-summary-wrap").remove();
    };
    $(document).on(
      "click",
      '.topic-list .main-link a.title, a[href*="/t/topic/"]',
      this.handleLinkClick
    );

    let lastUrl = window.location.href;
    this.observer = new MutationObserver(() => {
      if (lastUrl !== window.location.href) {
        lastUrl = window.location.href;
        setTimeout(() => {
          if (window.location.href.includes("/topic/")) {
            this.refreshAISummary();
          } else {
            $(".gpt-summary-wrap").remove();
          }
        }, 500);
      }
    });

    // 配置观察器
    this.observer.observe(document, {
      subtree: true,
      childList: true,
    });

    if (this.localChecked.value2) {
      $("body").append(`
        <div class="aireply-popup">
          <textarea class="aireply-popup-text"></textarea>
          <button class="aireply-popup-close">关闭</button>
        </div>
      `);

      // 将setInterval的返回值保存到data中
      this.checkIntervalId = setInterval(() => {
        if ($(".aireplay-btn").length < 1) {
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

    // 主贴总结功能
    if (this.localChecked.value1) {
      this.mainPostSummaryIntervalId = setInterval(() => {
        if (
          $(".aicreated-btn").length < 1 &&
          this.localChecked.btn // 只有当开启手动按钮时才显示
        ) {
          $("#topic-title").after(
            `<button class="aicreated-btn" type="button">AI 总结主贴</button>`
          );
          $(".aicreated-btn").click(() => {
            $(".gpt-summary-wrap").remove();
            // 使用参数 false 表示只总结主贴
            this.getPostContent(false);
          });
        }
      }, 1000);

      this.summaryIntervalId = setInterval(() => {
        if ($(".post-stream").length > 0) {
          // 从 localStorage 获取缓存数据
          if ($(".gpt-summary-wrap").length < 1) {
            let summaryCache = JSON.parse(localStorage.getItem("summaryCacheData")) || [];
            const regex = /^(https:\/\/linux\.do\/t\/topic\/\d+)(\/\d+)?$/;

            // 确保 URL 匹配正确的格式
            if (window.location.href.match(regex)) {
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
          }

          if (!this.localChecked.btn) {
            if ($(".gpt-summary-wrap").length < 1) {
              // 使用参数 false 表示只总结主贴
              this.getPostContent(false);
            }
          }
        }
      }, 1000);
    }

    // 回帖总结功能
    if (this.localChecked.summaryAll) {
      this.allPostsSummaryIntervalId = setInterval(() => {
        if ($(".aicreated-all-btn").length < 1) {
          $("#topic-title").after(
            `<button class="aicreated-all-btn" type="button">AI 总结全部回帖</button>`
          );
          $(".aicreated-all-btn").click(() => {
            $(".gpt-summary-wrap").remove();
            // 使用参数 true 表示总结所有帖子
            this.getPostContent(true);
          });
        }
      }, 1000);
    }

    if (this.localChecked.title) {
      this.titleGenerationIntervalId = setInterval(() => {
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
  beforeUnmount() {
    // 清理 MutationObserver
    if (this.observer) {
      this.observer.disconnect();
    }

    // 移除事件监听器
    window.removeEventListener("popstate", this.boundRefreshAISummary);
    window.removeEventListener("pushstate", this.boundRefreshAISummary);
    window.removeEventListener("replacestate", this.boundRefreshAISummary);

    // 移除点击事件监听
    $(document).off(
      "click",
      '.topic-list .main-link a.title, a[href*="/t/topic/"]',
      this.handleLinkClick
    );

    // 清除所有定时器
    if (this.checkIntervalId) {
      clearInterval(this.checkIntervalId);
    }
    if (this.mainPostSummaryIntervalId) {
      clearInterval(this.mainPostSummaryIntervalId);
    }
    if (this.summaryIntervalId) {
      clearInterval(this.summaryIntervalId);
    }
    if (this.allPostsSummaryIntervalId) {
      clearInterval(this.allPostsSummaryIntervalId);
    }
    if (this.titleGenerationIntervalId) {
      clearInterval(this.titleGenerationIntervalId);
    }
  },
  // Vue 2 兼容性
  beforeDestroy() {
    // 清除所有定时器
    if (this.checkIntervalId) {
      clearInterval(this.checkIntervalId);
    }
    if (this.mainPostSummaryIntervalId) {
      clearInterval(this.mainPostSummaryIntervalId);
    }
    if (this.summaryIntervalId) {
      clearInterval(this.summaryIntervalId);
    }
    if (this.allPostsSummaryIntervalId) {
      clearInterval(this.allPostsSummaryIntervalId);
    }
    if (this.titleGenerationIntervalId) {
      clearInterval(this.titleGenerationIntervalId);
    }
  },
};
</script>

<style lang="less" scoped>
.item {
  border: none !important;
  padding-bottom: 0 !important;

  select {
    height: 30px;
    border-radius: 4px;
    border: 1px solid #ddd;
    padding: 0 8px;
  }

  .info {
    flex: 1;
  }

  .label {
    width: 80px;
    text-align: right;
    white-space: nowrap;
    margin-right: 10px;
  }
}

.flex {
  display: flex;
  gap: 8px;

  input {
    flex: 1;
  }
}

.config-card {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  margin: 15px 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.config-title {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 15px;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

input[type="text"],
input[type="range"],
textarea,
select {
  border: 1px solid #ddd !important;
  border-radius: 4px !important;
  padding: 8px;
  width: 100%;
  height: 36px;
  margin-bottom: 8px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

input[type="text"]:focus,
textarea:focus,
select:focus {
  border-color: #2684ff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(38, 132, 255, 0.2);
}

.temperature {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .tit {
    display: flex;
    align-items: center;
    flex: 1;
  }

  label {
    margin-right: 10px !important;
    min-width: 200px;
  }

  input[type="range"] {
    flex: 1;
    width: auto !important;
    margin: 0 10px;
  }
}

.connection-status {
  margin-top: 8px;
  padding: 8px;
  border-radius: 4px;

  &.success {
    background: #e6f4ea;
    color: #1e8e3e;
  }

  &.error {
    background: #fce8e6;
    color: #d93025;
  }

  &.info {
    background: #e8f0fe;
    color: #1a73e8;
  }
}

textarea {
  min-height: 80px;
  resize: vertical;
}

.prompt .item {
  flex-direction: column;
  align-items: flex-start !important;
}
</style>
