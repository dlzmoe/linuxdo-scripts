// ==UserScript==
// @name        导出所有书签，搭配 1.0.19 版本及以后使用
// @namespace   https://github.com/ezyshu/linuxdo-scripts
// @match       https://linux.do/*
// @grant       none
// @version     1.3
// @author      ezyshu
// ==/UserScript==
(function () {
  'use strict';

  // 创建导出按钮
  function createExportButton() {
    const exportButton = document.createElement('button');
    exportButton.textContent = '导出书签';
    exportButton.style.margin = '10px';
    exportButton.style.padding = '5px 10px';
    exportButton.style.backgroundColor = '#0078d7';
    exportButton.style.color = 'white';
    exportButton.style.border = 'none';
    exportButton.style.borderRadius = '3px';
    exportButton.style.cursor = 'pointer';

    // 鼠标悬停效果
    exportButton.addEventListener('mouseover', function () {
      this.style.backgroundColor = '#006cc1';
    });

    exportButton.addEventListener('mouseout', function () {
      this.style.backgroundColor = '#0078d7';
    });

    // 添加点击事件
    exportButton.addEventListener('click', exportBookmarks);

    // 将按钮添加到页面合适的位置
    const userMenu = document.querySelector('.user-menu, .user-main');
    if (userMenu) {
      userMenu.prepend(exportButton);
    } else {
      // 如果找不到合适的位置，添加到页面顶部
      const header = document.querySelector('.d-header');
      if (header) {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '70px';
        container.style.right = '20px';
        container.style.zIndex = '1000';
        container.appendChild(exportButton);
        document.body.appendChild(container);
      }
    }
  }

  // 导出书签的函数
  async function exportBookmarks() {
    try {
      const myusernameStr = $('.d-header-icons .icon img.avatar').attr('src');
      // 使用 indexOf 和 substring 方法提取用户名
      const start = myusernameStr.indexOf('/user_avatar/linux.do/') + '/user_avatar/linux.do/'.length;
      const end = myusernameStr.indexOf('/', start);
      const myusername = myusernameStr.substring(start, end);

      const categoryMap = {
        4: "开发调优",
        14: "资源荟萃",
        42: "文档共建",
        10: "跳蚤市场",
        27: "非我莫属",
        32: "读书成诗",
        46: "扬帆起航",
        34: "前沿快讯",
        36: "福利羊毛",
        11: "搞七捻三",
        2: "运营反馈",
        45: "深海幽域"
      };

      // 显示加载提示
      const loadingMsg = document.createElement('div');
      loadingMsg.textContent = '正在导出书签，请稍候...';
      loadingMsg.style.position = 'fixed';
      loadingMsg.style.top = '50%';
      loadingMsg.style.left = '50%';
      loadingMsg.style.transform = 'translate(-50%, -50%)';
      loadingMsg.style.padding = '15px';
      loadingMsg.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      loadingMsg.style.color = 'white';
      loadingMsg.style.borderRadius = '5px';
      loadingMsg.style.zIndex = '10000';
      document.body.appendChild(loadingMsg);

      let allBookmarks = [];
      let page = 0;
      let hasMore = true;

      while (hasMore) {
        const response = await fetch(`https://linux.do/u/${myusername}/bookmarks.json?page=${page}`, {
          headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'User-Agent': navigator.userAgent,
            'Referer': `https://linux.do/u/${myusername}/bookmarks`,
            'Origin': 'https://linux.do'
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.user_bookmark_list?.bookmarks?.length) {
          hasMore = false;
        } else {
          allBookmarks = allBookmarks.concat(data.user_bookmark_list.bookmarks);
          loadingMsg.textContent = `已加载 ${allBookmarks.length} 个书签...`;
          page++;
          // 添加延迟避免请求过快
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      let formattedData = [{
        id: 0,
        name: "默认",
        list: allBookmarks.map(item => ({
          cate: categoryMap[item.category_id] || "未分类",
          tags: item.tags,
          title: item.title,
          url: `https://linux.do/t/topic/${item.topic_id}`
        }))
      }];

      // 移除加载提示
      document.body.removeChild(loadingMsg);

      alert(`成功导出 ${allBookmarks.length} 个书签，请前往扩展收藏夹手动导入下载的 json 文件！`);

      const blob = new Blob([JSON.stringify(formattedData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${myusername}-bookmarks.json`;
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('导出书签时发生错误：', error);
      alert('导出书签失败，请检查控制台查看错误信息。');
    }
  }

  // 在页面加载完成后创建按钮
  window.addEventListener('load', function () {
    setTimeout(createExportButton, 1000);
  });
})();
