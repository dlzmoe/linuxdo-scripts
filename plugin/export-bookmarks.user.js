// ==UserScript==
// @name        导出所有书签，搭配 1.0.19 版本及以后使用
// @namespace   https://github.com/dlzmoe/linuxdo-scripts
// @match       https://linux.do/*
// @grant       none
// @version     1.2
// @author      dlzmoe
// ==/UserScript==
(function () {
  'use strict';
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

  setTimeout(async () => {
    try {
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
  }, 100);
})();