import './app.less';
import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

export default defineContentScript({
  matches: ['https://linux.do/'],
  cssInjectionMode: 'ui',

  async main(ctx) {
    // 3. Define your UI
    const ui = await createShadowRootUi(ctx, {
      name: 'linuxdo-script-ui',
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        const app = createApp(App);
        app.use(ElementPlus);
        app.mount(container);
      },
      onRemove: (app) => {
        app?.unmount();
      }
    });
    ui.mount();
  }
});
