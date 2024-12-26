import './app.less';
import { createApp } from 'vue';
import App from './App.vue';

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === 'setData') {
//     localStorage.setItem('myKey', request.data);
//   }
// });


export default defineContentScript({
  matches: ['https://linux.do/*'],
  cssInjectionMode: 'ui',

  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: 'linuxdo-scripts-ui',
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        const app = createApp(App);
        app.mount(container);
      },
      onRemove: (app) => {
        app?.unmount();
      }
    });
    ui.mount();
  }
});
