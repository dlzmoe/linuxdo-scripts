export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });
});
const browserAPI = (typeof browser !== 'undefined' ? browser : chrome);
browserAPI.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'sendData') {
    // 查询所有打开的标签页
    browserAPI.tabs.query({ url: '*://linux.do/*' }, (tabs) => {
      tabs.forEach((tab) => {
        browserAPI.tabs.sendMessage(tab.id, {
          action: 'setData',
          data: request.data
        });
      });
    });
  }
});

browserAPI.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'open_bookmark_page') {
    const extensionURL = browserAPI.runtime.getURL('bookmark.html');
    browserAPI.tabs.create({ url: extensionURL });
  }
});