// ==UserScript==
// @name        导出所有书签，搭配 1.0.19 版本及以后使用
// @namespace   https://github.com/dlzmoe/linuxdo-scripts
// @match       https://linux.do/*
// @grant       none
// @version     1.0
// @author      dlzmoe
// ==/UserScript==

(function () {
  'use strict';
  const myusernameStr = $('.d-header-icons .icon img.avatar').attr('src');
  const myusername = myusernameStr.replace(/^\/user_avatar\/linux\.do\//, '').split('/')[0];

  // 如果导出失败，把下面的注释展开，并修改为你的用户名。
  // var myusername = "anghunk";

  // 分类映射
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

  setTimeout(() => {
    fetch(`https://linux.do/u/${myusername}/bookmarks.json`)
      .then((response) => response.json())
      .then((data) => {
        let formattedData = [{
          id: 0,
          name: "默认",
          list: data.user_bookmark_list.bookmarks.map(item => ({
            cate: categoryMap[item.category_id] || "未分类",
            tags: item.tags,
            title: item.title,
            url: `https://linux.do/t/topic/${item.topic_id}`
          }))
        }];

        alert('书签导出成功，请前往扩展收藏夹手动导入下载的 json 文件！');

        // 创建 Blob 对象
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
      })
      .catch((error) => {
        console.log(error);
      });
  }, 100);
})();