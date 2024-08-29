import Vue from 'vue';
import App from './app.vue';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import "./style/app.less";

const root = document.createElement('div')
root.id = 'linuxdoscripts'
document.body.appendChild(root)
const vm = new Vue({
  el: '#linuxdoscripts',
  render: (h) => h(App),
})