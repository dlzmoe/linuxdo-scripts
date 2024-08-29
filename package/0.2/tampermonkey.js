// ==UserScript==
// @name         linuxdo 增强插件本地开发
// @namespace    https://github.com/dlzmoe/linuxdo-scripts
// @version      0.0.0
// @description  linux.do 增强插件，功能持续更新，欢迎提出新想法！
// @author       dlzmoe
// @match        *://linux.do/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @icon         https://cdn.linux.do/uploads/default/optimized/3X/9/d/9dd49731091ce8656e94433a26a3ef36062b3994_2_32x32.png
// @license      Apache-2.0 license
// ==/UserScript==

(function () {
  'use strict';
  window.addEventListener('load', function () {
    
    var script = document.createElement('script');
    script.src = 'http://localhost:8080/app.bundle.js';
    document.body.appendChild(script);

  });
})();