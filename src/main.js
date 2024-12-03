import { createApp } from 'vue';
import App from './app.vue';
const app = createApp(App);

import "./assets/app.less";
import $ from "jquery";
import pangu from 'pangu';
import { marked } from "marked";
import { pinyin } from "pinyin-pro";

// 自定义提示
$('body').append('<div id="messageToast"></div>');

// import "./styles/moyu.less";

app.mount(
  (() => {
    const appDiv = document.createElement('div');
    document.body.append(appDiv);
    return appDiv;
  })(),
);