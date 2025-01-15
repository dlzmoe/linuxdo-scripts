import { createApp} from 'vue';
import App from './App.vue';

import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';

import './github-markdown.css';
import './style.less';

const app = createApp(App);
app.use(ArcoVue);
app.mount('#app');