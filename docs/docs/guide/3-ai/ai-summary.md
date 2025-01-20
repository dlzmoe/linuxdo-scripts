# AI 总结

需要在设置中预先配置好 API key 等信息，不支持 http 网址。

可选择自动或者手动。

如果在使用中报错，请先确认第三方 API 连通无误，并且支持你指定的模型。

在以上信息无误的情况下，再提交反馈 Issues.

## 使用说明

要按照指定格式填写，暂不支持官方标准的 Gemini 格式，如果转为 OpenAI 格式的接口也能用。

### 1. OpenAI

```shell
sk-xxxxxxxxxxxxxxxxxx # 密钥 api key
https://api.openai.com # api url （不加 / 后缀）
/v1/chat/completions # 接口
gpt-4o-mini # model 模型
```

### 2. DeepSeek

`deepseek-chat` 模型已全面升级为 `DeepSeek-V3`，接口不变。通过指定 `model='deepseek-chat'` 即可调用 `DeepSeek-V3`。

```shell
sk-xxxxxxxxxxxxxxxxxx # 密钥 api key
https://api.deepseek.com # api url （不加 / 后缀）
/v1/chat/completions # 接口
deepseek-chat # model 模型
```

## 温度 temperature

`temperature` 参数默认为 0.7，比较适合总结。当然你也可以设置 0-2 其他温度，但并不保证总结的效果。

特殊情况下可选择取消温度请求，比如模型为 `deepseek-reasoner`，不支持该参数。


## 提示词 Prompt 

1. AI 总结帖子：
> 根据以下帖子内容进行总结，请使用 markdown 格式返回回答，没有字数限制，但要求文字精炼，简介准确，语言要求返回简体中文，并且进行中英文混排优化。可以通过编号列表（1，2，3）列出核心要点。注意不要输出标题，例如：核心要点总结，帖子总结等，直接输出文本段落。

2. AI 生成回复：
> 根据以下帖子内容，帮我给作者写一条回复，简短，表明我的观点，用口语回复，不需要很正式。您可以通过讨论的方式进行回复，这将有助于引导其他用户或作者进行互动。

3. AI 生成标题：
> 根据以下帖子内容，生成一个合适的标题用于社交论坛发布使用，格式要求：不要书名号或其他符号，只需要一句纯文本。尽量精简到 15 字以内，如果字数不够表达主题，可以适当多生成几个字。
