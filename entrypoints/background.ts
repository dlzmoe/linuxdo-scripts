async function handleWebDAVRequest(auth, method, url, data = null) {
  const headers = {
    'Authorization': 'Basic ' + btoa(`${auth.username}:${auth.password}`)
  };

  if (method === 'PUT') {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(url, {
      method: method,
      headers: headers,
      body: method === 'PUT' ? data : null
    });

    const responseData = await response.text();
    return { status: response.status, statusText: response.statusText, data: responseData };
  } catch (error) {
    return { status: error.response ? error.response.status : 500, statusText: error.message };
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { action, url, auth, method, data } = message;
  if (action === 'webdavRequest') {
    handleWebDAVRequest(auth, method, url, data)
      .then(response => sendResponse(response))
      .catch(error => sendResponse({ status: 500, statusText: error.message }));
    return true;  // Will respond asynchronously
  }
});


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
