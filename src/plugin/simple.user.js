// ==UserScript==
// @name         linuxdo 增强插件（简单版）
// @namespace    https://github.com/dlzmoe/linuxdo-scripts
// @version      0.0.1
// @author       dlzmoe
// @description  linux.do 增强插件，功能持续更新，欢迎提出新想法！
// @license      MIT
// @icon         https://linux.do/uploads/default/optimized/3X/9/d/9dd49731091ce8656e94433a26a3ef36062b3994_2_32x32.png
// @match        *://linux.do/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
  'use strict';

  // 显示楼层号
  function showFloor() {
    $(".topic-post").each(function () {
      const num = $(this)
        .find("article")
        .attr("id")
        .replace(/^post_/, "");
      if ($(this).find(".linuxfloor").length < 1) {
        $(this).find(".post-infos").append(`<span class="linuxfloor" style="display:flex;color:var(--tertiary);width:30px;height:30px;align-items:center;justify-content:center;border-radius:6px;font-size:16px;margin-left:10px;">#${num}</span>`);
      }
    });
  }

  setInterval(() => {
    showFloor();
  }, 1000);
})();