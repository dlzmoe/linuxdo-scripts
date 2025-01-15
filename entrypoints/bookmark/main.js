import { createApp } from 'vue';
import App from './App.vue';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import './element-variables.scss';

import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';

import './style.less';

// 创建 Vue 应用实例
const app = createApp(App);
app.use(ElementPlus);
app.use(ArcoVue);
app.mount('#app');
