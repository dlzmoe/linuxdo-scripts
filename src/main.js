import { createApp } from 'vue';
import App from './app.vue';
import "./assets/app.less";
import $ from "jquery";
import pangu from 'pangu';
import { marked } from "marked";
import { pinyin } from "pinyin-pro";

// 创建并配置 Vue 应用
const app = createApp(App);

// 自定义提示
$('body').append('<div id="messageToast"></div>');

app.config.globalProperties.$messageToast = function (message) {
  const messageElement = document.createElement('div');
  messageElement.className = 'messageToast-text';
  messageElement.innerText = message;
  document.getElementById('messageToast').appendChild(messageElement);
  setTimeout(() => {
    messageElement.remove();
  }, 3000);
};

// 挂载 Vue 应用
app.mount(
  (() => {
    const appDiv = document.createElement('div');
    document.body.append(appDiv);
    return appDiv;
  })()
);
