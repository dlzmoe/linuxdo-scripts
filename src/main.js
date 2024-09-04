import { createApp } from 'vue';
import App from './App.vue';
const app = createApp(App);

import "./assets/app.less";
import $ from "jquery";

$('body').append('<div id="messageToast"></div>');

app.mount(
  (() => {
    const appDiv = document.createElement('div');
    document.body.append(appDiv);
    return appDiv;
  })(),
);