import { createApp } from 'vue';
import App from './app.vue';
const app = createApp(App);

import "./assets/app.less";

app.mount(
  (() => {
    const appDiv = document.createElement('div');
    document.body.append(appDiv);
    return appDiv;
  })(),
);