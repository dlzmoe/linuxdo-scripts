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
    <input
      style="width: 49%"
      type="text"
      v-model="localChecked.baseurl"
      placeholder="https://api.openai.com"
    />
    <input
      style="width: 49%; margin-left: 2%"
      type="text"
      v-model="localChecked.full_url"
      placeholder="/v1/chat/completions"
    />
    <input type="text" v-model="localChecked.model" placeholder="模型，如：gpt-4o-mini" />
    <div>6. AI 总结帖子 prompt:</div>
    <textarea v-model="localChecked.prompt"></textarea>
    <div>7. AI 生成回复 prompt:</div>
    <textarea v-model="localChecked.prompt1"></textarea>
    <div>8. AI 生成标题 prompt:</div>
    <textarea v-model="localChecked.prompt2"></textarea>
    <div style="margin-top: 10px">
      注意：请按照指定格式填写参数；不支持 http，请使用 https。
    </div>
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
  },
};
</script>

<style scoped>
.item {
  border: none;
}
</style>
