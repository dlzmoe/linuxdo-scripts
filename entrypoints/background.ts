export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'sendData') {
    // 查询所有打开的标签页
    chrome.tabs.query({ url: '*://linux.do/*' }, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          action: 'setData',
          data: request.data
        });
      });
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'open_bookmark_page') {
    const extensionID = chrome.runtime.id;
    const extensionURL = `chrome-extension://${extensionID}/bookmark.html`;

    chrome.tabs.create({ url: extensionURL });
  }
});