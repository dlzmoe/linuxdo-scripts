<template>
  <div>
    <p>
      <a style="color: #e00" href="https://linuxdo-scripts-docs.zishu.me/guide/3-ai/ai-summary.html" target="_blank">查看
        AI 使用文档！</a>
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
    <div class="item">
      <div class="tit">6. 配置信息</div>
    </div>
    <input type="text" v-model="localChecked.apikey" placeholder="sk-xxxxxxxx" />
    <div class="flex">
      <input style="width:33%" type="text" v-model="localChecked.baseurl" placeholder="https://api.openai.com" />
      <input style="width:32%;margin-left:1%" type="text" v-model="localChecked.full_url"
        placeholder="/v1/chat/completions" />
      <input style="width:32%;margin-left:1%" type="text" v-model="localChecked.model" placeholder="模型，如：gpt-4o-mini" />
    </div>
    <div class="item temperature">
      <div class="tit">
        <label>是否开启温度（temperature）{{ localChecked.temperature }}</label>
        <input type="range" :title="localChecked.temperature" v-model="localChecked.temperature" min="0" max="2"
          step="0.1" placeholder="0.7" />
      </div>
      <input type="checkbox" v-model="localChecked.isTemPer" @change="handleChange" />
    </div>
    <div class="item">注意：请按照指定格式填写参数；不支持 http，请使用 https。</div>
    <div class="item">6. AI 总结主贴 prompt:</div>
    <textarea v-model="localChecked.prompt"></textarea>
    <div class="item">6. AI 总结全部回帖 prompt:</div>
    <textarea v-model="localChecked.prompt3"></textarea>
    <div class="item">7. AI 生成回复 prompt:</div>
    <textarea v-model="localChecked.prompt1"></textarea>
    <div class="item">8. AI 生成标题 prompt:</div>
    <textarea v-model="localChecked.prompt2"></textarea>
  </div>
</template>

<script>
import $ from 'jquery';
import { marked } from 'marked';
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
        apikey: '',
        baseurl: 'https://api.openai.com',
        full_url: '/v1/chat/completions',
        model: 'gpt-4o-mini',
        isTemPer: true,
        temperature: 0.7,
        prompt: '根据以下帖子内容进行总结，请使用 markdown 格式返回回答，没有字数限制，但要求文字精炼，简介准确，语言要求返回简体中文，并且进行中英文混排优化。可以通过编号列表（1，2，3）列出核心要点。注意不要输出标题，例如：核心要点总结，帖子总结等，直接输出文本段落。',
        prompt1: '根据以下帖子内容，帮我给作者写一条回复，简短，表明我的观点，用口语回复，不需要很正式。您可以通过讨论的方式进行回复，这将有助于引导其他用户或作者进行互动。',
        prompt2: '根据以下帖子内容，生成一个合适的标题用于社交论坛发布使用，格式要求：不要书名号或其他符号，只需要一句纯文本。尽量精简到 15 字以内，如果字数不够表达主题，可以适当多生成几个字。',
        prompt3: '我会输入一论坛的主贴及所有回复，你需要输出：1.主贴总结：简要概括主贴核心内容 (2-3 句)，2. 讨论分析：主要观点倾向和共识/分歧点，讨论氛围评估 3.代表性回复：引用几条有代表性的回复 (附用户名)，简述每条回复的代表性和价值 4.争议点标记：标记格式：⚠️ [用户名]: "引用内容"，简析争议原因和各方立场 5.简要评估：评估讨论的整体氛围（如：友善、学术性、对抗性等）注意：保持客观公正，注重实质内容分析，区分事实与观点',
      },
    },
  },
  data() {
    return {
      localChecked: this.value,
    }
  },
  watch: {
    value(newValue) {
      this.localChecked = newValue
    },
  },
  methods: {
    handleChange() {
      this.$emit('update:value', this.localChecked)
    },
    getTopicUrl(url) {
      const regex = /^(https:\/\/linux\.do\/t\/topic\/\d+)(\/\d+)?$/
      const match = url.match(regex)
      return match ? match[1] : url
    },
    // 是否开启手动生成
    setCreatedBtn() {
      // 主贴总结按钮受"是否显示手动总结按钮"控制
      if (this.localChecked.btn && this.localChecked.value1) {
        $('head').append('<style>.aicreated-btn{display:inline-flex!important}</style>')
      }
      // 回帖总结按钮不受"是否显示手动总结按钮"控制
      if (this.localChecked.summaryAll) {
        $('head').append('<style>.aicreated-all-btn{display:inline-flex!important}</style>')
      }
    },
    // 获取帖子内容并生成总结
    async getPostContent(isSummaryAll = null) {
      $('.post-stream').before(
        `<div class="gpt-summary-wrap">
          <div class="gpt-summary">AI 总结：正在使用 AI 总结内容中，请稍后...</div>
         </div>`
      )

      const config = JSON.parse(localStorage.getItem('linxudoscriptssettingDMI')).gptdata;

      return new Promise((resolve, reject) => {
        let str = $('#topic-title h1 a').text();
        
        // 如果传入了参数，则使用参数值；否则使用配置值
        const summaryAll = isSummaryAll !== null ? isSummaryAll : this.localChecked.summaryAll;
        
        if (summaryAll) {
          // 收集所有帖子的内容
          $('.topic-post').each((index, element) => {
            str += `||${$(element).find('.first').text()} ：${$(element).find('.cooked').text()}`;
          });
          str = `${config.prompt3}\n帖子内容如下：\n${str}`;
        } else {
          // 只收集主贴内容
          str += $('#post_1 .cooked').text();
          str = `${config.prompt}\n帖子内容如下：\n${str}`;
        }

        fetch(`${config.baseurl}${config.full_url}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.apikey}`,
          },
          body: JSON.stringify({
            model: config.model,
            messages: [
              {
                role: 'user',
                content: str,
              },
            ],
            stream: true, // 开启流式输出
            ...(config.isTemPer ? { temperature: Number(config.temperature) } : {}),
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullContent = '';

            function processStream({ done, value }) {
              if (done) {
                // 流结束时保存到 localStorage
                let summaryCache = JSON.parse(localStorage.getItem('summaryCacheData')) || [];
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

                localStorage.setItem('summaryCacheData', JSON.stringify(summaryCache));
                return resolve();
              }

              // 解码收到的数据
              const chunk = decoder.decode(value, { stream: true });
              const lines = chunk.split('\n');

              // 处理每一行数据
              lines.forEach(line => {
                if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                  try {
                    const jsonData = JSON.parse(line.slice(6));
                    if (jsonData.choices[0].delta.content) {
                      const content = jsonData.choices[0].delta.content;
                      fullContent += content;
                      // 使用 marked 实时渲染 markdown
                      $('.gpt-summary').html(marked.parse(fullContent));
                    }
                  } catch (error) {
                    console.log('Parse chunk error:', error);
                  }
                }
              });

              // 继续读取下一个数据块
              return reader.read().then(processStream);
            }

            return reader.read().then(processStream);
          })
          .catch((error) => {
            $('.gpt-summary').html(`生成失败，请检查配置是否正确并刷新重试！`);
            console.log(error);
          });

      })
    },

    // 生成 AI 回复
    async setAIRelpy() {
      $('.aireply-popup').show()
      $('.aireply-popup-text').html('AI 推荐回复正在生成中，请稍后。。。')
      const config = JSON.parse(localStorage.getItem('linxudoscriptssettingDMI')).gptdata

      return new Promise((resolve, reject) => {
        const str = $('#topic-title h1 a').text() + $('#post_1 .cooked').text()
        const prompt = `${config.prompt1}
帖子内容如下：
${str}`

        fetch(`${config.baseurl}${config.full_url}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.apikey}`,
          },
          body: JSON.stringify({
            model: config.model,
            messages: [
              {
                role: 'user',
                content: prompt,
              },
            ],
            ...(config.isTemPer ? { temperature: Number(config.temperature) } : {}),
          }),
        })
          .then((response) => {
            if (!response.ok) {
              reject(`HTTP error! status: ${response.status}`)
            }
            return response.json()
          })
          .then((gptData) => {
            this.AIReplyPopup(gptData.choices[0].message.content)
            resolve()
          })
          .catch((error) => {
            console.log(error)
          })
      })
    },

    // 推荐回复弹窗
    AIReplyPopup(text) {
      $('.aireply-popup-text').html(text)
    },
    // AI 根据新建话题内容生成标题
    async getCreateNewTopicTitle() {
      return new Promise((resolve, reject) => {
        const topic_contentdata = $('.d-editor-preview').html()
        const config = JSON.parse(localStorage.getItem('linxudoscriptssettingDMI')).gptdata
        const prompt = `${config.prompt2}
帖子内容如下：
${topic_contentdata}`

        fetch(`${config.baseurl}${config.full_url}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.apikey}`,
          },
          body: JSON.stringify({
            model: config.model,
            messages: [
              {
                role: 'user',
                content: prompt,
              },
            ],
            ...(config.isTemPer ? { temperature: Number(config.temperature) } : {}),
          }),
        })
          .then((response) => {
            if (!response.ok) {
              reject(`HTTP error! status: ${response.status}`)
            }
            return response.json()
          })
          .then((gptData) => {
            $('#reply-title').val(gptData.choices[0].message.content)
            resolve()
          })
          .catch((error) => {
            console.log(error)
            $('#reply-title').val(`抱歉生成失败，请检查配置或者反馈给开发者！`)
          })
      })
    },
  },
  async created() {
    // 先调用 setCreatedBtn 确保样式正确应用
    this.setCreatedBtn()
    
    if (this.localChecked.value2) {
      $('body').append(`
        <div class="aireply-popup">
          <textarea class="aireply-popup-text"></textarea>
          <button class="aireply-popup-close">关闭</button>
        </div>
      `)

      setInterval(() => {
        if ($('.gpt-summary-wrap').length < 1 && $('.aireplay-btn').length < 1) {
          $('#topic-title').after(`<button class="aireplay-btn" type="button">AI 回复</button>`)
          $('.aireplay-btn').click(() => { this.setAIRelpy() })
          $('.aireply-popup-close').click(() => {
            $('.aireply-popup').hide()
            $('.aireply-popup-text').html('AI 推荐回复正在生成中，请稍后。。。')
          })
        }
      }, 1000)
    }

    // 主贴总结功能
    if (this.localChecked.value1) {
      setInterval(() => {
        if (
          $('.gpt-summary-wrap').length < 1 &&
          $('.aicreated-btn').length < 1 &&
          this.localChecked.btn // 只有当开启手动按钮时才显示
        ) {
          $('#topic-title').after(
            `<button class="aicreated-btn" type="button">AI 总结主贴</button>`
          )
          $('.aicreated-btn').click(() => {
            $('.gpt-summary-wrap').remove()
            // 使用参数 false 表示只总结主贴
            this.getPostContent(false);
          })
        }
      }, 1000)

      setInterval(() => {
        if ($('.post-stream').length > 0) {
          // 从 localStorage 获取缓存数据
          if ($('.gpt-summary-wrap').length < 1) {
            let summaryCache =
              JSON.parse(localStorage.getItem('summaryCacheData')) || []
            const regex = /^(https:\/\/linux\.do\/t\/topic\/\d+)(\/\d+)?$/
            const match = window.location.href.match(regex)[1]

            let existingObject = summaryCache.find(
              (item) => item.name === match
            )

            if (existingObject) {
              $('.post-stream').before(
                `<div class="gpt-summary-wrap">
<div class="gpt-summary">${marked.parse(existingObject.value)}</div>
</div>`
              )
            }
          }

          if (!this.localChecked.btn) {
            if ($('.gpt-summary-wrap').length < 1) {
              // 使用参数 false 表示只总结主贴
              this.getPostContent(false);
            }
          }
          $('.topic-list .main-link a.title').click(() => {
            $('.gpt-summary-wrap').remove()
          })
        }
      }, 1000)
    }

    // 回帖总结功能
    if (this.localChecked.summaryAll) {
      setInterval(() => {
        if ($('.aicreated-all-btn').length < 1) {
          $('#topic-title').after(
            `<button class="aicreated-all-btn" type="button">AI 总结全部回帖</button>`
          )
          $('.aicreated-all-btn').click(() => {
            $('.gpt-summary-wrap').remove()
            // 使用参数 true 表示总结所有帖子
            this.getPostContent(true);
          })
        }
      }, 1000)
    }

    if (this.localChecked.title) {
      setInterval(() => {
        if ($('.action-title').length > 0) {
          if ($('.action-title').html().includes('创建新话题')) {
            if ($('.aicreatenewtopictitle').length < 1) {
              $('.action-title').append(
                '<span class="aicreatenewtopictitle">AI 生成标题</span>'
              )

              $('.aicreatenewtopictitle').click(() => {
                $('#reply-title').val('正在生成中，请稍后...')
                this.getCreateNewTopicTitle()
              })
            }
          }
        }
      }, 1000)

      // 判断 AI 总结的缓存记录，只保留最近 20 个
      let summaryCacheData =
        JSON.parse(localStorage.getItem('summaryCacheData')) || []
      if (summaryCacheData.length > 20) {
        summaryCacheData = summaryCacheData.slice(-20)
      }
      localStorage.setItem('summaryCacheData', JSON.stringify(summaryCacheData))
    }
  },
}
</script>

<style lang="less" scoped>
.item {
  border: none !important;
  padding-bottom: 5px !important;
}

.flex {
  display: flex;
  margin-top: 8px;

  input {
    flex: 1;
  }
}

.item.temperature {

  label {
    margin-right: 10px !important;
  }

  input[type="range"] {
    flex: 1;
    width: auto !important;
  }
}
</style>