import 'webext-dynamic-content-scripts';
import addPermissionToggle from 'webext-permission-toggle';

export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });
  addPermissionToggle();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'fetchData') {
    fetch(message.url, {
      method: 'GET',
      headers: {
        Authorization:
          'Basic ' + btoa(`${message.username}:${message.password}`)
      }
    })
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error(`Request failed with status: ${response.status}`);
        }
      })
      .then((data) => sendResponse({ success: true, data }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true; // 表示异步响应
  }
});
