import { createApp } from 'vue';
import App from './App.vue';

import ArcoVue from '@arco-design/web-vue';
import '@arco-themes/vue-indigo-sky/css/arco.css'; // 自定义主题 vue-indigo-sky

import './style.less';

const app = createApp(App);
app.use(ArcoVue);
app.mount('#app');
