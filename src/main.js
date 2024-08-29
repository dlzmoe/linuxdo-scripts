import { createApp } from 'vue';
import App from './App.vue';
const app = createApp(App);

// import ElementPlus from 'element-plus';
// import 'element-plus/dist/index.css';
// app.use(ElementPlus);

import "./assets/app.less";

app.mount(
  (() => {
    const appDiv = document.createElement('div');
    document.body.append(appDiv);
    return appDiv;
  })(),
);