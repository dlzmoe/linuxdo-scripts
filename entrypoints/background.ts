// background.ts
async function handleWebDAVRequest(auth, method, url, data = null) {
  try {
    const headers = new Headers({
      Authorization: 'Basic ' + btoa(`${auth.username}:${auth.password}`),
      Depth: method === 'PROPFIND' ? '1' : '0'
    });

    if (method === 'PUT') {
      headers.append('Content-Type', 'application/json');
    }

    if (method === 'PROPFIND') {
      headers.append('Content-Type', 'application/xml');
    }

    const requestOptions = {
      method: method,
      headers: headers
      // 移除 credentials 和 mode 设置，让浏览器自动处理
    };

    if (data && (method === 'PUT' || method === 'POST')) {
      requestOptions['body'] = data;
    }

    // 添加超时处理
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 30000); // 30 秒超时
    });

    const fetchPromise = fetch(url, requestOptions);
    const response = await Promise.race([fetchPromise, timeoutPromise]);

    if (!response.ok && response.status !== 207) {
      // 207 是 WebDAV Multi-Status 响应
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 根据不同的请求方法处理响应
    switch (method) {
      case 'PROPFIND':
        const xmlText = await response.text();
        return {
          status: response.status,
          statusText: response.statusText,
          data: xmlText
        };

      case 'GET':
        const responseData = await response.text();
        return {
          status: response.status,
          statusText: response.statusText,
          data: responseData
        };

      default:
        return {
          status: response.status,
          statusText: response.statusText
        };
    }
  } catch (error) {
    console.error('WebDAV Request Error:', error);

    // 更详细的错误信息
    let errorMessage = error.message;
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      errorMessage =
        '无法连接到 WebDAV 服务器。请检查：\n1. URL 是否正确\n2. 网络连接\n3. WebDAV 服务器是否在线';
    }

    return {
      status: 500,
      statusText: errorMessage,
      error: true,
      details: error.stack
    };
  }
}

// 确保在 manifest.json 中添加必要的权限
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'webdavRequest') {
    const { auth, method, url, data } = message;

    // 验证 URL 格式
    try {
      new URL(url);
    } catch (e) {
      sendResponse({
        status: 400,
        statusText: '无效的 URL 格式',
        error: true
      });
      return true;
    }

    // 验证必要参数
    if (!auth?.username || !auth?.password) {
      sendResponse({
        status: 400,
        statusText: '缺少认证信息',
        error: true
      });
      return true;
    }

    handleWebDAVRequest(auth, method, url, data)
      .then((response) => {
        console.log('WebDAV Response:', response); // 调试日志
        sendResponse(response);
      })
      .catch((error) => {
        console.error('WebDAV Error:', error); // 调试日志
        sendResponse({
          status: 500,
          statusText: error.message || '内部错误',
          error: true,
          details: error.stack
        });
      });

    return true;
  }
});

export default defineBackground(() => {
  console.log('WebDAV Sync Background Service Started:', {
    id: browser.runtime.id
  });
});
