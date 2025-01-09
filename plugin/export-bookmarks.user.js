// ==UserScript==
// @name        导出所有书签
// @namespace   https://github.com/dlzmoe/linuxdo-scripts
// @match       https://linux.do/*
// @grant       none
// @version     1.0
// @author      dlzmoe
// ==/UserScript==

(function () {
  'use strict';
  var myusername = "anghunk";

  setTimeout(() => {
    fetch(`https://linux.do/u/${myusername}/bookmarks.json`)
      .then((response) => response.json())
      .then((data) => {
        
        let formattedData = [{
          id: 0,
          name: "默认",
          list: data.user_bookmark_list.bookmarks.map(item => ({
            cate: item.category_id,
            tags: item.tags,
            title: item.title,
            url: `https://linux.do/t/topic/${item.topic_id}`
          }))
        }];
        
        alert('书签导出成功，请前往扩展收藏夹手动导入下载的 json 文件！')

        // 创建 Blob 对象
        const blob = new Blob([JSON.stringify(formattedData, null, 2)], {
          type: 'application/json'
        });

        // 创建下载链接
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${myusername}-bookmarks.json`;

        // 触发下载
        document.body.appendChild(link);
        link.click();

        // 清理
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.log(error)
      });
  }, 100);
})();