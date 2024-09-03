// ==UserScript==
// @name         linuxdo 增强插件
// @namespace    https://github.com/dlzmoe/linuxdo-scripts
// @version      0.3.15
// @author       dlzmoe
// @description  linux.do 增强插件，功能持续更新，欢迎提出新想法！
// @license      Apache-2.0
// @icon         https://cdn.linux.do/uploads/default/optimized/3X/9/d/9dd49731091ce8656e94433a26a3ef36062b3994_2_32x32.png
// @match        *://*.linux.do/*
// @require      https://unpkg.com/vue@3.4.38/dist/vue.global.prod.js
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(i=>{if(typeof GM_addStyle=="function"){GM_addStyle(i);return}const t=document.createElement("style");t.textContent=i,document.head.append(t)})(' input[data-v-44945bb2]{width:70px;outline:none;height:24px;border:1px solid #b6b6b6;border-radius:4px;margin-left:10px;padding:0 10px;box-sizing:border-box}.emojiPicker{top:0;left:100%;position:absolute;display:grid;grid-template-columns:repeat(12,1fr);gap:10px;height:100%;overflow:auto;background-color:#000c;padding:10px;border-radius:5px;z-index:9}.emojiPicker img{cursor:pointer;width:30px;height:30px}.sidebar-section-header-caret.right{transform:rotate(-90deg)}.item select[data-v-d780d688]{height:28px;border:1px solid #b6b6b6;border-radius:4px;width:180px;margin-left:10px;cursor:pointer}.item[data-v-12935e12],.item[data-v-cb743585],.item[data-v-e58a62ee],.item[data-v-f84417d4]{border:none!important}.linxudoscripts-tag{background:#29a6a9;color:#fff;font-size:14px!important;padding:0 10px;height:26px;text-align:center;display:inline-flex!important;align-items:center;justify-content:center;border-radius:5px}.menu-table{width:100%}.menu-table td,.menu-table th{padding:10px;font-size:14px}.menu-table .span{cursor:pointer}.menu-table .span+.span{margin-left:10px}.item[data-v-0e067488]{border:none}.post-stream.lookopwrapactive .topic-post{display:none!important}.post-stream.lookopwrapactive .topic-post.topic-owner{display:block!important}@keyframes breathAnimation-0068d3be{0%,to{transform:scale(1);box-shadow:0 0 5px #00000080}50%{transform:scale(1.1);box-shadow:0 0 10px #000000b3}}.breath-animation[data-v-0068d3be]{animation:breathAnimation-0068d3be 4s ease-in-out infinite}.minimized[data-v-0068d3be]{width:50px!important;height:50px!important;border-radius:50%!important;padding:0!important;overflow:hidden;cursor:pointer}.button[data-v-0068d3be]:hover{background-color:#f0f0f0}#linuxDoLevelPopupContent[data-v-0068d3be]{line-height:1.6;position:fixed;bottom:20px;right:90px;width:250px;height:auto;background-color:#fff;box-shadow:0 0 10px #00000080;padding:15px;z-index:10000;font-size:14px;border-radius:5px}#linuxDoUserSearch[data-v-0068d3be]{width:100%;margin-top:10px}.button[data-v-0068d3be]{margin-top:10px}.minimize-button[data-v-0068d3be]{position:absolute;top:5px;right:5px;z-index:10001;background:transparent;border:none;cursor:pointer;border-radius:50%;text-align:center;line-height:40px;width:40px;height:40px}.dark-theme #linuxDoLevelPopupContent[data-v-0068d3be]{background:#535353}.linuxdoscripts-aidialog{position:fixed;top:0;left:-100%;width:500px;height:100vh;background:#fff;box-shadow:1px 2px 5px #0000003d;z-index:999;padding-top:60px;transition:all .1s linear;opacity:0;visibility:hidden;overflow:hidden}.linuxdoscripts-aidialog.act{left:0;opacity:1;visibility:inherit;overflow:inherit}a[data-v-677b97d9]{margin-left:10px}a[data-v-677b97d9]:hover{text-decoration:underline}.UsageTip{position:static;margin:0;font-size:14px;line-height:1.6}.UsageTip>div{margin:10px 0}.UsageTip button{background:#333;color:#fff;padding:8px 10px;margin-bottom:10px;border:none;outline:none;border-radius:4px}.dark-theme .UsageTip{background:#333;color:#ccc}.dark-theme .UsageTip button{background:#999;color:#fff}[class*=" el-icon-"],[class^=el-icon-]{display:none}.el-message{z-index:99999999999!important}#linuxdoscripts{font-size:15px}#linuxdoscripts input[type=text]{width:100%}#linuxdoscripts input[type=checkbox]{transform:scale(1.2)}#linuxdoscripts #menu_suspendedball{display:none}#linuxdoscripts img{vertical-align:bottom;max-width:100%;height:auto}#linuxdoscripts .close{position:absolute;right:10px;top:3px;cursor:pointer;font-size:34px;color:#999;transform:rotate(45deg)}#linuxdoscripts .setting-btn{z-index:999;position:fixed;bottom:20px;right:20px}#linuxdoscripts .setting-btn .el-button{margin:15px 0 0;width:50px;height:50px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#919191;color:#fff;font-size:14px;cursor:pointer;transition:all .1s linear;border:none}#linuxdoscripts .setting-btn .el-button svg{margin:0}#linuxdoscripts .setting-btn .el-button:hover{opacity:.9}#linuxdoscripts .hint{margin-top:5px;color:#d94f4f;font-size:14px}#linuxdoscripts dialog{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:700px;background:#fff;color:#333;box-shadow:1px 2px 5px #0003;border-radius:10px;padding:15px;z-index:99999;overflow-x:hidden;box-sizing:border-box;margin:0}#linuxdoscripts dialog .menu-about{padding:5px 0;line-height:2}#linuxdoscripts dialog .menu-about .initialization{color:#999;border-bottom:1px dashed #999;cursor:pointer}#linuxdoscripts dialog .menu-about .initialization:hover{color:#333;border-color:#333}#linuxdoscripts dialog p{margin:0;font-size:14px}#linuxdoscripts .title{font-size:18px;text-align:center;font-weight:600;border-bottom:1px solid #eee;padding-bottom:6px}#linuxdoscripts .btn{border:none;outline:0;min-width:80px;height:32px;display:inline-flex;align-items:center;justify-content:center;background:#1c1c1e;color:#fff;font-size:14px;border-radius:5px;cursor:pointer;transition:all .1s linear}#linuxdoscripts .btn+.btn{margin-left:10px}#linuxdoscripts .btn.saveload{background:#4040b7}#linuxdoscripts .btn:hover{opacity:.9}#linuxdoscripts .menu-nav{display:flex;align-items:center;margin:0;padding:5px 0;border-bottom:1px solid #eee}#linuxdoscripts .menu-nav li{margin-right:10px;border-radius:4px;height:26px;min-width:60px;padding:0 10px;display:inline-flex;align-items:center;justify-content:center;font-size:14px;cursor:pointer}#linuxdoscripts .menu-nav li.act{background:#000;color:#fff}#linuxdoscripts .menu-body{height:480px;overflow-y:auto;padding-right:10px}#linuxdoscripts .menu-body::-webkit-scrollbar{height:8px;width:8px}#linuxdoscripts .menu-body::-webkit-scrollbar-corner{background:none}#linuxdoscripts .menu-body::-webkit-scrollbar-thumb{background:#dee0e1;border-radius:8px}#linuxdoscripts .menu-body .menu-body-item{display:none}#linuxdoscripts .menu-body .menu-body-item.act{display:block}#linuxdoscripts .menu-footer{display:flex;justify-content:space-between;margin-top:10px;padding-top:6px;border-top:1px solid #eee}#linuxdoscripts .menu-footer.hides{opacity:0;visibility:hidden;overflow:hidden}#linuxdoscripts .import{margin-left:auto!important}#linuxdoscripts .import,#linuxdoscripts .export{background:#d1f0ff;color:#559095}#linuxdoscripts .floorlottery{background:#ffb003}#linuxdoscripts .menu-body-item{padding-bottom:30px}#linuxdoscripts .menu-body-item .item{margin-top:12px;border-bottom:1px solid #eee;padding-bottom:10px;display:flex;align-items:center;justify-content:space-between}#linuxdoscripts textarea{font-family:inherit;width:100%;min-height:100px!important;border:1px solid #999;outline:0;padding:5px;font-size:14px;margin:5px 0 0;resize:none;border-radius:0;color:var(--d-input-text-color);background:var(--d-input-bg-color)}#linuxdoscripts textarea:focus{border-color:var(--tertiary);outline:2px solid var(--tertiary);outline-offset:-2px}#linuxdoscripts #floorlotterloading img{width:50px;height:50px}#linuxdoscripts .floorlotterywrap{display:none;width:400px;height:300px;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);margin:0;z-index:999}#linuxdoscripts .floorlotterywrap{width:400px;height:300px}#linuxdoscripts .el-checkbox__inner{border:1px solid #979797}#linuxdoscripts label{margin:0}.linuxdoscripts-opacity{display:none;position:fixed;left:0;top:0;width:100vw;height:100vh;background:#00000080;z-index:9999}.linuxlevel.four{background:linear-gradient(to right,red,#00f);-webkit-background-clip:text;color:transparent}.topic-post{position:relative}.linuxfloor{display:flex;color:#ff8383;width:30px;height:30px;align-items:center;justify-content:center;border-radius:6px;font-size:16px;margin-left:10px}.signature-p{color:#279a36;font-size:14px;word-break:break-word}.topic-list .views{font-weight:400!important;white-space:nowrap!important}.createreply{display:flex;flex-direction:column;max-width:300px}.createreply button{margin-bottom:10px;justify-content:flex-start;text-align:left}.topicpreview-btn{padding:4px 12px!important;font-size:14px!important;opacity:0!important}.topic-list-item:hover .topicpreview-btn{opacity:1!important}.topicpreview{position:fixed;top:0;left:0;z-index:99999;width:100vw;height:100vh;display:flex;justify-content:center;align-items:center;display:none}.topicpreview .topicpreview-container{padding:30px 0;border-radius:5px;width:100%;max-width:800px;overflow-y:auto;height:80vh;z-index:10;background:#fafafa;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)}.topicpreview .topicpreview-container .topicpreview-title{font-size:22px;font-weight:600;padding:0 30px}.topicpreview .topicpreview-container .topicpreview-date{padding:0 30px;color:#666}.topicpreview .topicpreview-container .topicpreview-content>.item{display:flex;align-items:flex-start;padding:20px 30px}.topicpreview .topicpreview-container .topicpreview-content>.item .itemfloor{width:50px;text-align:left;font-size:16px;padding-top:15px;color:#25b4cf}.topicpreview .topicpreview-container .topicpreview-content>.item .itempost{flex:1;background:#fff;padding:15px;border-radius:10px;font-size:15px;color:#666}.topicpreview .topicpreview-container .topicpreview-content>.item .itempost pre code{max-width:620px}.topicpreview .topicpreview-container .topicpreview-content>.item .itempost img{max-width:100%;max-height:100%;height:auto}.topicpreview .topicpreview-container .topicpreview-content>.item .itempost .itemname{font-size:16px;color:#8f3a3a;display:flex;justify-content:space-between;align-items:center}.topicpreview .topicpreview-container .topicpreview-content>.item .itempost .itemname span{color:#9e9e9e;margin-left:20px}.topicpreview .topicpreview-container .topicpreview-content>.item .itempost .itemdate{color:#b9b9b9;font-size:16px;margin-left:auto}.topicpreview-opacity{position:absolute;top:0;left:0;width:100%;height:100%;opacity:1;background:#0009;z-index:9}.body-preview .sidebar-wrapper{display:none!important}body.body-preview #main-outlet-wrapper{display:block!important;padding-left:50px!important}.body-preview .d-header-wrap,.body-preview .menu_suspendedball{display:none!important}.post-activity{white-space:nowrap;display:inline-block;width:100%;text-align:left}.d-header img{height:var(--d-logo-height);width:auto;max-width:100%;object-fit:contain}.aicreated-btn{outline:none;border:1px solid #c5c5c5;background:#eee;display:flex;align-items:center;justify-content:center;line-height:1;font-size:14px;padding:4px 10px;border-radius:3px;margin-bottom:10px}.gpt-summary-wrap{background:#fffbd9;border-radius:5px;padding:10px;font-size:14px;color:#666;margin:0 0 10px;line-height:1.6}.gpt-summary-wrap .airegenerate{display:none;margin-top:6px;outline:none;border:1px solid #eee;background:#ffe27d;color:#626262;padding:4px 10px;cursor:pointer;border-radius:3px}.aicreatenewtopictitle{margin-left:20px}.aicreatenewtopictitle:hover{text-decoration:underline;cursor:pointer}.dark-theme input{background:#999;color:#fff}.dark-theme #linuxdoscripts dialog{background:#333;color:#eee;box-shadow:1px 2px 5px #000;border-color:#737373}.dark-theme #linuxdoscripts dialog .menu-about .initialization:hover{color:#eee;border-color:#eee}.dark-theme #linuxdoscripts .title,.dark-theme #linuxdoscripts .item,.dark-theme #linuxdoscripts .menu-footer{border-color:#4b4b4b}.dark-theme .topicpreview .topicpreview-container{background:#292929}.dark-theme .topicpreview .topicpreview-container .topicpreview-content>.item .itempost{background:#363636;color:#a9a9a9}.dark-theme .topicpreview .topicpreview-container .topicpreview-content>.item .itempost .itemdate,.dark-theme .topicpreview .topicpreview-container .topicpreview-content>.item .itempost .itemname span{color:#6b6b6b}.dark-theme .aicreated-btn{background:#999;color:#fff}.dark-theme .gpt-summary-wrap{color:#d9d9d9;background:#717171} ');

(function (vue) {
  'use strict';

  const name = "linuxdo-scripts";
  const version = "0.3.15";
  const author = "dlzmoe";
  const description = "An enhanced script for the linux.do forum";
  const type = "module";
  const license = "Apache-2.0";
  const scripts = {
    dev: "vite",
    build: "vite build && py build.py",
    preview: "vite preview"
  };
  const dependencies = {
    jquery: "^3.7.1",
    vue: "^3.4.27"
  };
  const devDependencies = {
    "@vitejs/plugin-vue": "^5.0.4",
    less: "^4.1.0",
    "less-loader": "^8.0.0",
    "style-loader": "^2.0.0",
    vite: "^5.2.12",
    "vite-plugin-monkey": "^4.0.0"
  };
  const packageJson = {
    name,
    version,
    author,
    description,
    type,
    "private": true,
    license,
    scripts,
    dependencies,
    devDependencies
  };
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$z = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    data() {
      return {
        eventListeners: []
      };
    },
    methods: {
      init() {
        this.removeEventListeners();
        $(".topic-list a.title,.topic .search-link").each((index, element) => {
          const listener = (event) => {
            event.preventDefault();
            var url = $(element).attr("href");
            window.open(url, "_blank");
          };
          $(element).on("click", listener);
          this.eventListeners.push({ element, listener });
        });
      },
      removeEventListeners() {
        this.eventListeners.forEach(({ element, listener }) => {
          $(element).off("click", listener);
        });
        this.eventListeners = [];
      }
    },
    created() {
      if (this.modelValue) {
        let pollinglength1 = 0;
        let pollinglength2 = 0;
        setInterval(() => {
          if (pollinglength1 != $(".topic-list-body tr").length) {
            pollinglength1 = $(".topic-list-body tr").length;
            this.init();
          }
          if (pollinglength2 != $(".post-stream .topic-post").length) {
            pollinglength2 = $(".post-stream .topic-post").length;
            this.init();
          }
        }, 1e3);
      }
    },
    beforeDestroy() {
      this.removeEventListeners();
    }
  };
  const _hoisted_1$v = { class: "item" };
  const _hoisted_2$v = { class: "tit" };
  const _hoisted_3$p = ["checked"];
  function _sfc_render$z(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$v, [
      vue.createElementVNode("div", _hoisted_2$v, vue.toDisplayString($props.sort) + ". 是否新标签页打开话题", 1),
      vue.createElementVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$p)
    ]);
  }
  const MenuOpenpostblank = /* @__PURE__ */ _export_sfc(_sfc_main$z, [["render", _sfc_render$z]]);
  const _sfc_main$y = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    methods: {
      init() {
        if ($("#list-area .show-more").length > 0) {
          $("head title").html("【有新话题赶紧来水！！】");
        }
      }
    },
    created() {
      if (this.modelValue) {
        setInterval(() => {
          this.init();
        }, 1e3);
      }
    }
  };
  const _hoisted_1$u = { class: "item" };
  const _hoisted_2$u = { class: "tit" };
  const _hoisted_3$o = ["checked"];
  function _sfc_render$y(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$u, [
      vue.createElementVNode("div", _hoisted_2$u, vue.toDisplayString($props.sort) + ". 是否开启新话题提醒", 1),
      vue.createElementVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$o)
    ]);
  }
  const MenuNewtopicreminder = /* @__PURE__ */ _export_sfc(_sfc_main$y, [["render", _sfc_render$y]]);
  const _sfc_main$x = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    methods: {
      init() {
        $("nav.post-controls .show-replies").each(function() {
          $(this).click();
        });
      }
    },
    created() {
      if (this.modelValue) {
        let pollinglength2 = 0;
        setInterval(() => {
          if (pollinglength2 != $(".post-stream .topic-post").length) {
            pollinglength2 = $(".post-stream .topic-post").length;
            this.init();
          }
        }, 1e3);
      }
    }
  };
  const _hoisted_1$t = { class: "item" };
  const _hoisted_2$t = { class: "tit" };
  const _hoisted_3$n = ["checked"];
  function _sfc_render$x(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$t, [
      vue.createElementVNode("div", _hoisted_2$t, vue.toDisplayString($props.sort) + ". 是否自动展开回复", 1),
      vue.createElementVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$n)
    ]);
  }
  const MenuAutoexpandreply = /* @__PURE__ */ _export_sfc(_sfc_main$x, [["render", _sfc_render$x]]);
  const _sfc_main$w = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    methods: {
      formattedDate(time) {
        const timestamp = Number(time);
        const date = new Date(timestamp);
        const now = /* @__PURE__ */ new Date();
        const isToday = now.getFullYear() === date.getFullYear() && now.getMonth() === date.getMonth() && now.getDate() === date.getDate();
        date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return isToday ? `${hours}:${minutes}` : `${month}/${day} ${hours}:${minutes}`;
      },
      convertToTimestamp(dateStr) {
        const cleanedDateStr = dateStr.replace(/\s+/g, "");
        const datePattern = /(\d{4})年(\d{1,2})月(\d{1,2})日(\d{2}):(\d{2})/;
        const dateMatch = cleanedDateStr.match(datePattern);
        if (dateMatch) {
          const year = parseInt(dateMatch[1], 10);
          const month = parseInt(dateMatch[2], 10) - 1;
          const day = parseInt(dateMatch[3], 10);
          const hours = parseInt(dateMatch[4], 10);
          const minutes = parseInt(dateMatch[5], 10);
          const date = new Date(year, month, day, hours, minutes);
          return date.getTime();
        }
        return null;
      },
      setInitDate() {
        $(".topic-list .age").each((index, element) => {
          const str = $(element).attr("title");
          const match = str.match(/创建日期：([\s\S]*?)最新：/);
          if (match && match[1]) {
            const creationDate = match[1].trim();
            const timestamp = this.convertToTimestamp(creationDate);
            if ($(element).find(".linuxtime").length < 1) {
              const now = (/* @__PURE__ */ new Date()).getTime();
              const oneDay = 1e3 * 60 * 60 * 24;
              const oneWeek = oneDay * 7;
              const oneMonth = oneDay * 30;
              const threeMonths = oneMonth * 3;
              let color;
              const timeDiff = now - timestamp;
              if (timeDiff < oneDay) {
                color = "#45B5AA";
                $(element).find(".post-activity").append(
                  `<span class="linuxtime" style="color:${color}">（${this.formattedDate(
                  timestamp
                )}）</span>`
                );
              } else if (timeDiff < oneWeek) {
                color = "#66A586";
                $(element).find(".post-activity").append(
                  `<span class="linuxtime" style="color:${color}">（${this.formattedDate(
                  timestamp
                )}）</span>`
                );
              } else if (timeDiff < oneMonth) {
                color = "#CFA94A";
                $(element).find(".post-activity").append(
                  `<span class="linuxtime" style="color:${color}">（${this.formattedDate(
                  timestamp
                )}）</span>`
                );
              } else if (timeDiff < threeMonths) {
                color = "#3e8ed2";
                $(element).find(".post-activity").append(
                  `<span class="linuxtime" style="color:${color}">（${this.formattedDate(
                  timestamp
                )}）</span>`
                );
              } else {
                color = "#cccccc";
                $(element).find(".post-activity").append(
                  `<span class="linuxtime" style="color:${color}">
                  （<img style="width:20px;vertical-align:sub;" src="https://linux.do/uploads/default/original/3X/b/d/bdf4a2ff2b3639c4f74462f2da8383f9c5cdb25e.png">${this.formattedDate(
                  timestamp
                )}）
                </span>`
                );
              }
            }
          }
        });
      },
      initDateAndStartPolling() {
        setInterval(() => {
          this.setInitDate();
          this.startPolling();
        }, 1e3);
      },
      startPolling() {
        setInterval(() => {
          this.setInitDate();
        }, 1e4);
      }
    },
    mounted() {
      if (this.modelValue) {
        this.startPolling();
        this.initDateAndStartPolling();
      }
    }
  };
  const _hoisted_1$s = { class: "item" };
  const _hoisted_2$s = { class: "tit" };
  const _hoisted_3$m = ["checked"];
  function _sfc_render$w(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", null, [
      vue.createElementVNode("div", _hoisted_1$s, [
        vue.createElementVNode("div", _hoisted_2$s, vue.toDisplayString($props.sort) + ". 话题列表显示创建时间", 1),
        vue.createElementVNode("input", {
          type: "checkbox",
          checked: $props.modelValue,
          onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
        }, null, 40, _hoisted_3$m)
      ])
    ]);
  }
  const MenuShowcreatetime = /* @__PURE__ */ _export_sfc(_sfc_main$w, [["render", _sfc_render$w]]);
  const _sfc_main$v = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    methods: {
      formattedDate(time) {
        const timestamp = Number(time);
        const date = new Date(timestamp);
        const now = /* @__PURE__ */ new Date();
        const isToday = now.getFullYear() === date.getFullYear() && now.getMonth() === date.getMonth() && now.getDate() === date.getDate();
        date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return isToday ? `${hours}:${minutes}` : `${month}/${day} ${hours}:${minutes}`;
      },
      convertToTimestamp(dateStr) {
        const cleanedDateStr = dateStr.replace(/\s+/g, "");
        const datePattern = /(\d{4})年(\d{1,2})月(\d{1,2})日(\d{2}):(\d{2})/;
        const dateMatch = cleanedDateStr.match(datePattern);
        if (dateMatch) {
          const year = parseInt(dateMatch[1], 10);
          const month = parseInt(dateMatch[2], 10) - 1;
          const day = parseInt(dateMatch[3], 10);
          const hours = parseInt(dateMatch[4], 10);
          const minutes = parseInt(dateMatch[5], 10);
          const date = new Date(year, month, day, hours, minutes);
          return date.getTime();
        }
        return null;
      },
      setInitDate() {
        $(".topic-list-item .age").each((index, element) => {
          const str = $(element).attr("title");
          const match = str.match(/创建日期：([\s\S]*?)最新：/);
          if (match && match[1]) {
            const creationDate = match[1].trim();
            const timestamp = this.convertToTimestamp(creationDate);
            const now = (/* @__PURE__ */ new Date()).getTime();
            const oneDay = 1e3 * 60 * 60 * 24;
            const oneWeek = oneDay * 7;
            const oneMonth = oneDay * 30;
            const threeMonths = oneMonth * 3;
            let color;
            const timeDiff = now - timestamp;
            if (timeDiff < oneDay) {
              color = "#45B5AA";
              $(element).siblings(".views").html(
                `<span class="linuxtime" style="color:${color}">${this.formattedDate(
                timestamp
              )}</span>`
              );
            } else if (timeDiff < oneWeek) {
              color = "#66A586";
              $(element).siblings(".views").html(
                `<span class="linuxtime" style="color:${color}">${this.formattedDate(
                timestamp
              )}</span>`
              );
            } else if (timeDiff < oneMonth) {
              color = "#CFA94A";
              $(element).siblings(".views").html(
                `<span class="linuxtime" style="color:${color}">${this.formattedDate(
                timestamp
              )}</span>`
              );
            } else if (timeDiff < threeMonths) {
              color = "#3e8ed2";
              $(element).siblings(".views").html(
                `<span class="linuxtime" style="color:${color}">${this.formattedDate(
                timestamp
              )}</span>`
              );
            } else {
              color = "#cccccc";
              $(element).siblings(".views").html(
                `<span class="linuxtime" style="color:${color}">
               <img style="width:20px;vertical-align:sub;" src="https://linux.do/uploads/default/original/3X/b/d/bdf4a2ff2b3639c4f74462f2da8383f9c5cdb25e.png">${this.formattedDate(
                timestamp
              )}
                </span>`
              );
            }
          }
        });
      },
      initDateAndStartPolling() {
        setInterval(() => {
          this.setInitDate();
          this.startPolling();
        }, 1e3);
      },
      startPolling() {
        setInterval(() => {
          this.setInitDate();
        }, 1e4);
      }
    },
    mounted() {
      if (this.modelValue) {
        this.startPolling();
        this.initDateAndStartPolling();
      }
    }
  };
  const _hoisted_1$r = { class: "item" };
  const _hoisted_2$r = { class: "tit" };
  const _hoisted_3$l = ["checked"];
  function _sfc_render$v(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$r, [
      vue.createElementVNode("div", _hoisted_2$r, vue.toDisplayString($props.sort) + ". 将浏览量替换为创建时间（与 4 互斥，只可选择一个）", 1),
      vue.createElementVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$l)
    ]);
  }
  const MenuShowcreatetime1 = /* @__PURE__ */ _export_sfc(_sfc_main$v, [["render", _sfc_render$v]]);
  const _sfc_main$u = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    methods: {
      init() {
        $(".topic-post").each(function() {
          const num = $(this).find("article").attr("id").replace(/^post_/, "");
          if ($(this).find(".linuxfloor").length < 1) {
            $(this).find(".post-infos").append(`<span class="linuxfloor">#${num}</span>`);
          }
        });
      }
    },
    created() {
      if (this.modelValue) {
        let pollinglength2 = 0;
        setInterval(() => {
          if (pollinglength2 != $(".post-stream .topic-post").length) {
            pollinglength2 = $(".post-stream .topic-post").length;
            this.init();
          }
        }, 1e3);
      }
    }
  };
  const _hoisted_1$q = { class: "item" };
  const _hoisted_2$q = { class: "tit" };
  const _hoisted_3$k = ["checked"];
  function _sfc_render$u(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$q, [
      vue.createElementVNode("div", _hoisted_2$q, vue.toDisplayString($props.sort) + ". 是否显示楼层数", 1),
      vue.createElementVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$k)
    ]);
  }
  const MenuShowfloors = /* @__PURE__ */ _export_sfc(_sfc_main$u, [["render", _sfc_render$u]]);
  const _sfc_main$t = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    created() {
      if (this.modelValue) {
        $("head").append(`<style>.header-title{display:none!important}</style>`);
      }
    }
  };
  const _hoisted_1$p = { class: "item" };
  const _hoisted_2$p = { class: "tit" };
  const _hoisted_3$j = ["checked"];
  function _sfc_render$t(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$p, [
      vue.createElementVNode("div", _hoisted_2$p, vue.toDisplayString($props.sort) + ". 隐藏话题详情顶部大标题", 1),
      vue.createElementVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$j)
    ]);
  }
  const MenuHidetopicdetailtitle = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["render", _sfc_render$t]]);
  const _sfc_main$s = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    methods: {
      init() {
        if ($(".topicpreview").length < 1) {
          $("body").append(`<div class="topicpreview">
          <div class="topicpreview-opacity"></div>
          <div class="topicpreview-container">
            <p style="text-align: center">正在加载中...</p>  
          </div>
          </div>`);
        }
        $(".topic-list .main-link a.title").each(function() {
          const id = $(this).attr("data-topic-id");
          if ($(this).parents(".link-top-line").find(".topicpreview-btn").length < 1) {
            $(this).parents(".link-top-line").append(
              `<button class="btn btn-icon-text btn-default topicpreview-btn" data-id="${id}">预览</button>`
            );
          }
        });
      },
      setClick() {
        $(".topicpreview-btn").each(function() {
          $(this).click(function() {
            $(".topicpreview").show();
            let previewData = {};
            let previewurl = $(this).attr("data-id");
            fetch(`/t/${previewurl}.json`).then((response) => response.json()).then((data) => {
              previewData = data;
              function formatDate(isoString) {
                const date = new Date(isoString);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                const hours = String(date.getHours()).padStart(2, "0");
                const minutes = String(date.getMinutes()).padStart(2, "0");
                const seconds = String(date.getSeconds()).padStart(2, "0");
                return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
              }
              $(".topicpreview-container").html(`
                <div class="topicpreview-title">${previewData.title}</div>
                <p class="topicpreview-date">发帖时间：${formatDate(
              previewData.created_at
            )}</p>
                <div class="topicpreview-content"></div>
                <p style="text-align: center;">仅显示前 20 条，<a href="/t/topic/${previewurl}/">查看更多</a></p>
              `);
              $.each(previewData.post_stream.posts, function(index, post) {
                $(".topicpreview .topicpreview-content").append(`
                  <div class="item">
                    <span class="itemfloor">${index + 1}楼</span>
                    <div class="itempost">
                      <div class="itemname">
                        ${post.display_username} 
                        <span>${post.username}</span>
                        <div class="itemdate">${formatDate(post.created_at)}</div>
                      </div>
                      ${post.cooked}
                    </div>
                  </div>
                `);
              });
              setInterval(() => {
                $(".lightbox").attr("href", "javascript:void(0)");
              }, 1e3);
            });
          });
        });
        $(".topicpreview-opacity").click(function() {
          $(".topicpreview").hide();
          $(".topicpreview-container").html(
            `<p style="text-align: center">正在加载中...</p> `
          );
        });
      }
    },
    created() {
      if (this.modelValue) {
        setInterval(() => {
          this.init();
        }, 1e3);
        let pollinglength1 = 0;
        let pollinglength2 = 0;
        setInterval(() => {
          if (pollinglength1 != $(".topic-list-body tr").length) {
            pollinglength1 = $(".topic-list-body tr").length;
            this.setClick();
          }
          if (pollinglength2 != $(".post-stream .topic-post").length) {
            pollinglength2 = $(".post-stream .topic-post").length;
            this.setClick();
          }
        }, 1e3);
      }
    }
  };
  const _hoisted_1$o = { class: "item" };
  const _hoisted_2$o = { class: "tit" };
  const _hoisted_3$i = ["checked"];
  function _sfc_render$s(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$o, [
      vue.createElementVNode("div", _hoisted_2$o, vue.toDisplayString($props.sort) + ". 是否开启话题预览功能", 1),
      vue.createElementVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$i)
    ]);
  }
  const MenuTopicpreview = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["render", _sfc_render$s]]);
  const _sfc_main$r = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    computed: {
      value1: {
        get() {
          return this.modelValue.value1;
        },
        set(newValue) {
          this.$emit("update:modelValue", { ...this.modelValue, value1: newValue });
        }
      },
      value2: {
        get() {
          return this.modelValue.value2;
        },
        set(newValue) {
          this.$emit("update:modelValue", { ...this.modelValue, value2: newValue });
        }
      }
    },
    methods: {
      updateValue1(newValue) {
        this.value1 = newValue;
      }
    }
  };
  const _hoisted_1$n = { class: "item" };
  const _hoisted_2$n = { class: "tit" };
  const _hoisted_3$h = ["checked"];
  function _sfc_render$r(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$n, [
      vue.createElementVNode("div", _hoisted_2$n, [
        vue.createTextVNode(vue.toDisplayString($props.sort) + ". 是否显示自动阅读按钮，可调节速度默认 10 ", 1),
        vue.withDirectives(vue.createElementVNode("input", {
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $options.value2 = $event),
          placeholder: "默认速度 10"
        }, null, 512), [
          [vue.vModelText, $options.value2]
        ])
      ]),
      vue.createElementVNode("input", {
        type: "checkbox",
        checked: $options.value1,
        onChange: _cache[1] || (_cache[1] = ($event) => $options.updateValue1($event.target.checked))
      }, null, 40, _hoisted_3$h)
    ]);
  }
  const MenuAutoRead = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["render", _sfc_render$r], ["__scopeId", "data-v-44945bb2"]]);
  const _sfc_main$q = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"]
  };
  const _hoisted_1$m = { class: "item" };
  const _hoisted_2$m = { class: "tit" };
  const _hoisted_3$g = ["checked"];
  function _sfc_render$q(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$m, [
      vue.createElementVNode("div", _hoisted_2$m, vue.toDisplayString($props.sort) + ". 是否开启只看楼主", 1),
      vue.createElementVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$g)
    ]);
  }
  const MenuLookOP = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["render", _sfc_render$q]]);
  const _sfc_main$p = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    created() {
      if (this.modelValue) {
        $("head").append(`<style>
      .topic-body .cooked{max-height:600px!important;overflow-y:auto!important;}
      </style>`);
      }
    }
  };
  const _hoisted_1$l = { class: "item" };
  const _hoisted_2$l = { class: "tit" };
  const _hoisted_3$f = ["checked"];
  function _sfc_render$p(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$l, [
      vue.createElementVNode("div", _hoisted_2$l, vue.toDisplayString($props.sort) + ". 智能限制楼层高度", 1),
      vue.createElementVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$f)
    ]);
  }
  const MenuFloorHeight = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["render", _sfc_render$p]]);
  const emojiSet = [
    {
      size: "30x30",
      name: "tieba_001",
      url: "/uploads/default/original/3X/9/a/9ac368cc8eafad165bbcf61b0263803d3b2dc2a7.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_002",
      url: "/uploads/default/original/3X/1/6/16baef70ba80d438e4bb1907ec0c354d680e09df.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_003",
      url: "/uploads/default/original/3X/2/7/27a55a1370c41f0736ba094bdc8866c6c2878c16.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_004",
      url: "/uploads/default/original/3X/9/e/9eac534efec605f5a1ac3b2f08d768cfbb4c63a9.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_005",
      url: "/uploads/default/original/3X/7/4/7493e87cae45656ac7997e8c79c852f9abc80454.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_006",
      url: "/uploads/default/original/3X/5/9/596da26825d2a806bd1952b5231f24d212866c1b.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_007",
      url: "/uploads/default/original/3X/c/0/c055b564a5b580ddfbf651df9a70feaec2b3b8e4.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_008",
      url: "/uploads/default/original/3X/9/e/9e137b2c72b77ee75454d737b5ad9d043dd49954.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_009",
      url: "/uploads/default/original/3X/c/7/c756c0f079d25093ed6c7c2feaaa423ead63411c.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_125",
      url: "/uploads/default/original/3X/1/3/133688dda7ae38a3ddbc9eda0ca99fa8ddbb2704.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_010",
      url: "/uploads/default/original/3X/2/b/2b58793c54c273c2d3d40722c4def435543084b4.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_011",
      url: "/uploads/default/original/3X/0/b/0b73771da5b3dc534ad05f1b5fff24325fc0eff7.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_012",
      url: "/uploads/default/original/3X/9/d/9d9e539ba33d272a5c6468cdb2fa7615695fa788.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_013",
      url: "/uploads/default/original/3X/e/1/e1aad11157b14d04bc8056573ecb23b5a219d260.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_014",
      url: "/uploads/default/original/3X/1/2/123defe5ac241618f3bb5246a727be77d996656d.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_015",
      url: "/uploads/default/original/3X/d/3/d3347ade2d4baf8092696b33c3523e634923b4fe.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_016",
      url: "/uploads/default/original/3X/2/1/21158038759f6a8630df8507f782a45a6caee004.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_017",
      url: "/uploads/default/original/3X/7/7/7732425deb158037a8692c45381de35ca83105e6.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_018",
      url: "/uploads/default/original/3X/7/1/7101ed3a9c047d318454b4eff91d74c06db5eaab.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_019",
      url: "/uploads/default/original/3X/e/e/eeccf0c1ccda4a4f3b33b4bb502c14e80c324443.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_020",
      url: "/uploads/default/original/3X/2/8/286824f9727de34e43b906346c0bdb0f854b1e2b.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_021",
      url: "/uploads/default/original/3X/0/9/09077d62fc78be7a9c19a8c084a35eac8373d241.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_022",
      url: "/uploads/default/original/3X/6/2/62e7b0ea68e56cc033f78527e62a825a6d9001f2.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_023",
      url: "/uploads/default/original/3X/d/4/d4e4c57ba70bd38264f0677cf338fa8af3228fbd.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_024",
      url: "/uploads/default/original/3X/9/c/9c2f3e1ce5982036af66b951a26231b7590e93d4.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_025",
      url: "/uploads/default/original/3X/e/4/e415f72201d585ac7ccc869a334048006d2b6b9d.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_026",
      url: "/uploads/default/original/3X/a/d/ad2d245bbe71a05b0bd7a42f435d25524517c7ac.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_027",
      url: "/uploads/default/original/3X/7/9/7992e06b38f76d7d55a8bc496fa6dd046ba1f0ad.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_028",
      url: "/uploads/default/original/3X/4/4/448d0cb933ec8016797faef8c8dcfb8822e43326.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_029",
      url: "/uploads/default/original/3X/8/4/84cd00fd735f11a57b193d62880f55b4ab835c7e.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_030",
      url: "/uploads/default/original/3X/6/8/68b3471539dbbe40437b0881916feb2d9d4ad254.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_031",
      url: "/uploads/default/original/3X/8/9/89870339101e10993ef1e55dd9e96f275a6a99f9.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_032",
      url: "/uploads/default/original/3X/2/5/25936c19b7808540b4a46eb7aeddced05658ec77.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_033",
      url: "/uploads/default/original/3X/d/f/dff9a29b33ccc0eeffe6d457cee58307246e28ab.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_034",
      url: "/uploads/default/original/3X/8/b/8b42b74ab6f63dcd02b923cee5ab8f224f32954e.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_035",
      url: "/uploads/default/original/3X/a/2/a268ad46209a864548c0439854c562d5a1a852e4.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_036",
      url: "/uploads/default/original/3X/4/9/49b2eba636dba687d98c4254bb00c682194f3556.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_037",
      url: "/uploads/default/original/3X/5/3/5359fdcfeb8a92794fdf7e0a9e1b7002ba635765.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_038",
      url: "/uploads/default/original/3X/5/3/535b871b10c649510280825c98e80ee1122613ec.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_039",
      url: "/uploads/default/original/3X/9/8/98939cb96a8df85af0efdaf02dcc144265e64703.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_040",
      url: "/uploads/default/original/3X/3/a/3a5fcb80663d73c1f116527c17de7cad37b72c49.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_041",
      url: "/uploads/default/original/3X/4/0/40cc7fe068c66b38c5e58ee8b59879f572dcd2ca.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_042",
      url: "/uploads/default/original/3X/e/6/e69395f0a9f391ca3c296aeddf510d0fb1d28fdf.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_043",
      url: "/uploads/default/original/3X/1/2/123e2d16a27491073fd90994fcd2820a48b2eb1d.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_044",
      url: "/uploads/default/original/3X/4/d/4d101bae8975480e4c81969242c6db771ccf29df.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_045",
      url: "/uploads/default/original/3X/6/8/687dca2210abafbcaaf211e27a013c1c0d7d480c.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_046",
      url: "/uploads/default/original/3X/1/4/14bca5d4cdaca743d0da8bc7f3b23146b53bc534.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_047",
      url: "/uploads/default/original/3X/c/d/cd555f2a5f605873e85b12ebf5e20affeb86817b.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_048",
      url: "/uploads/default/original/3X/7/d/7d5173acb48b6662934d93d15ccf03bc4eb4fe1e.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_049",
      url: "/uploads/default/original/3X/b/7/b774ed3e1792a0c345c3dc6b405398fc330476c4.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_050",
      url: "/uploads/default/original/3X/6/3/63c1a091c6a7a3a4ba09f79d3df61b5258d1da14.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_062",
      url: "/uploads/default/original/3X/6/4/644937964bfb3b7ff9519a8c789fba156bc51493.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_063",
      url: "/uploads/default/original/3X/9/7/977e25c3bb0bb2ffffd7680ef75de860c9bc8eeb.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_064",
      url: "/uploads/default/original/3X/f/a/fa08552ff47b7347fe769ea71e251784fe46e9c4.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_065",
      url: "/uploads/default/original/3X/8/d/8ddf6f88c399106b30f08bc6ae594dba19e8da36.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_066",
      url: "/uploads/default/original/3X/d/c/dccf34dbec6856992ab133e61a1f35417caf5f94.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_067",
      url: "/uploads/default/original/3X/1/6/16cd502b6c1d42d6d929788d47a96e50313b361f.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_068",
      url: "/uploads/default/original/3X/a/7/a79256841becf6fc218cf13ed7c9708d2846f472.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_069",
      url: "/uploads/default/original/3X/1/b/1b279f1106ef55973ae2df3a41edda04181163f6.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_070",
      url: "/uploads/default/original/3X/1/e/1e8646c269ac7a1cea631b1a2fe107a4b0137dd4.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_071",
      url: "/uploads/default/original/3X/4/f/4fcf98aa20e5148d8f0dd1e117d99ad52fe7787a.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_072",
      url: "/uploads/default/original/3X/f/b/fbdca3a08e2eb36d408a9f723251132a6e1a4a1d.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_073",
      url: "/uploads/default/original/3X/e/f/efcf23577412c17df6354df84eae836ad324d3fc.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_074",
      url: "/uploads/default/original/3X/4/0/40f2d01d50e90a29680636aa5b5b6808fe4e496b.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_075",
      url: "/uploads/default/original/3X/b/2/b29012e6751baac99a0b364978e2ba6c68696bb0.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_076",
      url: "/uploads/default/original/3X/8/e/8eb5b83342386cac1dcf7ee4de785540eb85b941.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_077",
      url: "/uploads/default/original/3X/0/d/0d84801a6c000b4724a4f998ae2cebbb75088672.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_078",
      url: "/uploads/default/original/3X/e/8/e8342efcc78faa5225bc94fdc50d595b35de226a.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_079",
      url: "/uploads/default/original/3X/0/3/03493b5fee0ad65939b223bcb99256c2ad3f92cf.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_080",
      url: "/uploads/default/original/3X/6/0/6010085f85bbd33ec476d908a3adedf43bf806d2.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_081",
      url: "/uploads/default/original/3X/4/7/472396c3c1fdc62031460f52fa57e70656559956.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_082",
      url: "/uploads/default/original/3X/e/8/e8ed47702a901d932ce0f2c926006c569777acae.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_083",
      url: "/uploads/default/original/3X/8/3/839487b3bbfe38ea8a6d69115c2b18e336c776aa.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_084",
      url: "/uploads/default/original/3X/d/a/da2b0f67a66746f0702044254460f5f210159dfe.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_085",
      url: "/uploads/default/original/3X/4/b/4bfbebdb5da3afb04e73813042a2645dea7895a3.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_086",
      url: "/uploads/default/original/3X/4/0/4035794fd9995594b024ca6695de918567c5b192.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_087",
      url: "/uploads/default/original/3X/2/e/2e09f3a3c7b27eacbabe9e9614b06b88d5b06343.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_088",
      url: "/uploads/default/original/3X/8/8/8842b4bbda39465fefb2a5cee47c8b203463e327.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_089",
      url: "/uploads/default/original/3X/c/2/c20aca50f9432ad01fdaf454e2013083be11909c.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_090",
      url: "/uploads/default/original/3X/0/e/0eb0e2df1d8287c00069e1bb906f65a7e6f8ac1f.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_091",
      url: "/uploads/default/original/3X/f/c/fcb760df48754f55cd9030370300880cddc30aeb.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_092",
      url: "/uploads/default/original/3X/6/d/6d1bcb4bdba18ec87caac87e5c944d81244c0925.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_093",
      url: "/uploads/default/original/3X/1/7/17e9f52f1b3f19e5fcf1e30b0bef7154b9cb25e9.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_094",
      url: "/uploads/default/original/3X/d/8/d84a7737da89e36a682519cc53dc36869dc8324a.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_095",
      url: "/uploads/default/original/3X/d/6/d687f7716a72d08b5ab44bf515b4b47ddf973a16.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_096",
      url: "/uploads/default/original/3X/9/1/91c4bdc5b31022de2047b0e326f85aac696a61d8.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_097",
      url: "/uploads/default/original/3X/9/9/992ffdfd94f164debe2ff1ffd686eb9b6d886c30.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_098",
      url: "/uploads/default/original/3X/a/b/ab4d09d173fe9d726a7df370527e3bb11b86ac37.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_099",
      url: "/uploads/default/original/3X/9/e/9e07307cddc9a8e1b17374d688dcd9cac0009b36.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_100",
      url: "/uploads/default/original/3X/0/8/083d87100f8608832766302d52e90c66bfa7b55e.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_101",
      url: "/uploads/default/original/3X/d/d/ddf9dab71979b328b8cc99a110961278b31af15f.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_102",
      url: "/uploads/default/original/3X/c/1/c1e30e625a80f2c4e38d15051adc0fbff0cdac85.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_103",
      url: "/uploads/default/original/3X/4/9/4932179ffb43027d3482ff0a8e79ad3c9f124675.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_104",
      url: "/uploads/default/original/3X/e/e/ee4698ca2806e680bf8710a138964433caeec7db.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_105",
      url: "/uploads/default/original/3X/0/4/04b9b300e3259e61fe2e9b6e1a291112fece7aa5.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_106",
      url: "/uploads/default/original/3X/4/5/45cf9833729d3f67e4b71327c07bda302ac3f792.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_107",
      url: "/uploads/default/original/3X/6/c/6c0346f696e90c6f804ade9f9d578c8c79c99aac.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_108",
      url: "/uploads/default/original/3X/a/1/a1ec5ef51c85ebabebe5102b00a1a4caeb08be63.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_109",
      url: "/uploads/default/original/3X/b/7/b75001317cf515737019777e8a6ed35b5b46ca6c.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_110",
      url: "/uploads/default/original/3X/0/1/0194cea00dae49fd82321825b52d96e1f8f47732.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_111",
      url: "/uploads/default/original/3X/b/5/b52e429fb2a84f8e72169c358f00b20e271d9f83.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_112",
      url: "/uploads/default/original/3X/c/9/c9aa6ca75dbffd21308721ce156da371e82b47f9.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_113",
      url: "/uploads/default/original/3X/1/c/1cadebeaf0cd36af11665ffa5802ba1c5b143be9.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_114",
      url: "/uploads/default/original/3X/d/d/dd93786f2a24352b65e23f81d2c24c1a41439cf0.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_115",
      url: "/uploads/default/original/3X/1/e/1e79d50d73b1afaeffe39574e92154d5d2878787.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_116",
      url: "/uploads/default/original/3X/d/a/daf75362acc5e46c813a77d8bd143e4e20dd89e5.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_117",
      url: "/uploads/default/original/3X/f/c/fcca64230d5d15b933b3b9db491f9d3516909b62.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_118",
      url: "/uploads/default/original/3X/1/8/189ed0fa3c3c01fdf1a99e836f1fa921f679b286.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_119",
      url: "/uploads/default/original/3X/1/2/1267794a9888419b4d72a2e92162dcb10c08d740.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_120",
      url: "/uploads/default/original/3X/2/b/2b20054bfb140ededbc4a5b94d529960ab49522a.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_121",
      url: "/uploads/default/original/3X/5/4/54c6102be172ff5b326edcff59e4ed6485495218.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_122",
      url: "/uploads/default/original/3X/f/b/fb9a3fe91bb52c30496dd41c739bd829511498fe.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_123",
      url: "/uploads/default/original/3X/0/6/069a4f21d927aac0db15bb2304ca29f5bdd0f733.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_124",
      url: "/uploads/default/original/3X/3/7/372798490ea3b5ca4dac38233413355c6c8175ce.png?v=12"
    }
  ];
  setInterval(() => {
    var editor = document.querySelector(".d-editor-button-bar");
    if (!document.querySelector(".emoji-picker-button") && editor) {
      var emojiButton = document.createElement("button");
      emojiButton.classList.add(
        "btn",
        "no-text",
        "btn-icon",
        "emoji",
        "emoji-picker-button"
      );
      emojiButton.title = "插入贴吧表情包";
      emojiButton.innerHTML = "<svg class='fa d-icon d-icon-far-smile svg-icon svg-string' xmlns='http://www.w3.org/2000/svg'><use href='#far-smile'></use></svg>";
      editor.appendChild(emojiButton);
      emojiButton.addEventListener("click", function() {
        var emojiPicker = document.createElement("div");
        emojiPicker.className = "emojiPicker";
        var emojiSetHtml = emojiSet.map(
          (emo) => `<img src="${emo.url}" name="${emo.name}" url="${emo.url}" alt="${emo.size}" onclick="insertEmoji(event)"/>`
        ).join("");
        emojiPicker.innerHTML = emojiSetHtml;
        emojiPicker.style.position = "absolute";
        emojiPicker.style.background = "#FFF";
        emojiPicker.style.border = "1px solid #ddd";
        emojiPicker.style.padding = "10px";
        if (document.body.contains(document.querySelector(".emojiPicker"))) {
          document.querySelector(".emojiPicker").remove();
        } else {
          emojiButton.after(emojiPicker);
        }
        emojiPicker.addEventListener("click", function(e) {
          if (e.target.tagName === "IMG") {
            var textArea = document.querySelector(".d-editor-input");
            if (!textArea) {
              alert("找不到输入框");
              return;
            }
            var emojiMarkdown = `![${e.target.name}|${e.target.alt}](${e.target.src})`;
            var startPos = textArea.selectionStart;
            var endPos = textArea.selectionEnd;
            textArea.value = textArea.value.substring(0, startPos) + emojiMarkdown + textArea.value.substring(endPos, textArea.value.length);
            var event = new Event("input", {
              bubbles: true,
              cancelable: true
            });
            textArea.dispatchEvent(event);
            emojiPicker.remove();
          }
        });
      });
    }
  }, 100);
  const _sfc_main$o = {};
  function _sfc_render$o(_ctx, _cache, $props, $setup, $data, $options) {
    return null;
  }
  const ReplyTBEnjoy = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["render", _sfc_render$o]]);
  const _sfc_main$n = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    created() {
      if (this.modelValue) {
        let script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/pangu@4.0.7/dist/browser/pangu.min.js";
        document.body.appendChild(script);
        setInterval(() => {
          pangu.spacingElementByTagName("p");
          document.addEventListener("DOMContentLoaded", () => {
            pangu.autoSpacingPage();
          });
        }, 1e3);
      }
    }
  };
  const _hoisted_1$k = { class: "item" };
  const _hoisted_2$k = { class: "tit" };
  const _hoisted_3$e = ["checked"];
  function _sfc_render$n(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$k, [
      vue.createElementVNode("div", _hoisted_2$k, vue.toDisplayString($props.sort) + ". 是否开启中英文混排优化显示", 1),
      vue.createElementVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$e)
    ]);
  }
  const MenuPangu = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["render", _sfc_render$n]]);
  const _sfc_main$m = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"]
  };
  const _hoisted_1$j = { class: "item" };
  const _hoisted_2$j = { class: "tit" };
  const _hoisted_3$d = ["checked"];
  function _sfc_render$m(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$j, [
      vue.createElementVNode("div", _hoisted_2$j, vue.toDisplayString($props.sort) + ". 是否显示等级查询按钮", 1),
      vue.createElementVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$d)
    ]);
  }
  const MenuLevelSearch = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["render", _sfc_render$m]]);
  const _sfc_main$l = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    created() {
      if (this.modelValue) {
        $("head").append(`<style>
     .user-menu-dropdown-wrapper .notification.read{display:none!important;}
     .user-menu-dropdown-wrapper .notification.unread{display:list-item!important;}
     </style>`);
      }
    }
  };
  const _hoisted_1$i = { class: "item" };
  const _hoisted_2$i = { class: "tit" };
  const _hoisted_3$c = ["checked"];
  function _sfc_render$l(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$i, [
      vue.createElementVNode("div", _hoisted_2$i, vue.toDisplayString($props.sort) + ". 消息通知仅显示未读", 1),
      vue.createElementVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$c)
    ]);
  }
  const MenuShowUnread = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["render", _sfc_render$l]]);
  const _sfc_main$k = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    created() {
      if (this.modelValue) {
        $("head").append(`<style>.spoiled,.spoiled *{filter:none!important;}</style>`);
      }
    }
  };
  const _hoisted_1$h = { class: "item" };
  const _hoisted_2$h = { class: "tit" };
  const _hoisted_3$b = ["checked"];
  function _sfc_render$k(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$h, [
      vue.createElementVNode("div", _hoisted_2$h, vue.toDisplayString($props.sort) + ". 是否屏蔽模糊文字", 1),
      vue.createElementVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$b)
    ]);
  }
  const MenuFilterText = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$k]]);
  const _sfc_main$j = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    created() {
      if (this.modelValue) {
        $("head").append(`<style>
        .topic-post .cooked+hr,
        .topic-post .signature-img,
        .topic-post .signature-p{display:none}

        .topic-post.current-user-post .cooked+hr,
        .topic-post.current-user-post .signature-img,
        .topic-post.current-user-post .signature-p{display:block}
      </style>`);
      }
    }
  };
  const _hoisted_1$g = { class: "item" };
  const _hoisted_2$g = { class: "tit" };
  const _hoisted_3$a = ["checked"];
  function _sfc_render$j(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$g, [
      vue.createElementVNode("div", _hoisted_2$g, vue.toDisplayString($props.sort) + ". 只看自己签名尾巴", 1),
      vue.createElementVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$a)
    ]);
  }
  const MenuLookmeSign = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$j]]);
  const _sfc_main$i = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    methods: {
      init() {
        $(".sidebar-custom-sections>div:nth-child(1)").after(`
        <div data-section-name="快速访问" class=" sidebar-section-wrapper sidebar-section--expanded">
          <div class="sidebar-section-header-wrapper sidebar-row" id="MenuQuickAccess">
            <button class="btn no-text sidebar-section-header sidebar-section-header-collapsable btn-transparent">
              <span class="sidebar-section-header-caret">
                <svg class="fa d-icon d-icon-angle-down svg-icon svg-string" xmlns="http://www.w3.org/2000/svg">
                  <use href="#angle-down"></use>
                </svg>
              </span>
              <span class="sidebar-section-header-text">快速访问</span>
            </button>
          </div>
          <ul class="sidebar-section-content">

            <li class="sidebar-section-link-wrapper">
              <a href="/bookmarks" class="sidebar-section-link sidebar-row">
                <span class="sidebar-section-link-prefix icon">
                  <svg class="fa d-icon d-icon-bookmark svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#bookmark"></use></svg>
                </span>
                <span class="sidebar-section-link-content-text">我的书签</span>
              </a>
            </li>

          </ul>
        </div>
      `);
        $("#MenuQuickAccess").click(function() {
          $(this).find(".sidebar-section-header-caret").toggleClass("right");
          $(this).siblings(".sidebar-section-content").slideToggle();
        });
      }
    },
    created() {
      if (this.modelValue) {
        setInterval(() => {
          if ($("#MenuQuickAccess").length < 1) {
            this.init();
          }
        }, 1e3);
      }
    }
  };
  const _hoisted_1$f = { class: "item" };
  const _hoisted_2$f = { class: "tit" };
  const _hoisted_3$9 = ["checked"];
  function _sfc_render$i(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$f, [
      vue.createElementVNode("div", _hoisted_2$f, vue.toDisplayString($props.sort) + ". 开启左侧快速访问", 1),
      vue.createElementVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$9)
    ]);
  }
  const MenuQuickAccess = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$i]]);
  const _sfc_main$h = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    data() {
      return {
        options: [
          { value: "twitter", label: "twitter" },
          { value: "facebook_messenger", label: "facebook_messenger" },
          { value: "google", label: "google" },
          { value: "google_classic", label: "google_classic" },
          { value: "win10", label: "win10" }
        ]
      };
    },
    computed: {
      value1: {
        get() {
          return this.modelValue.value1;
        },
        set(newValue) {
          this.$emit("update:modelValue", { ...this.modelValue, value1: newValue });
        }
      },
      value2: {
        get() {
          return this.modelValue.value2;
        },
        set(newValue) {
          this.$emit("update:modelValue", { ...this.modelValue, value2: newValue });
        }
      }
    },
    methods: {
      handleChange() {
        this.toggleEmojiStyle();
      },
      toggleEmojiStyle() {
        if (this.value1) {
          this.replaceEmojiStyle();
          this.initObserver();
        } else {
          this.observer && this.observer.disconnect();
        }
      },
      replaceEmojiStyle() {
        const imgs = document.querySelectorAll("img");
        imgs.forEach(this.updateImageSrc);
      },
      updateImageSrc(img) {
        const applePath = "images/emoji/apple";
        if (img.src.includes(applePath)) {
          img.src = img.src.replace(applePath, `images/emoji/${this.value2}`);
        }
      },
      processMutations(mutations) {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              if (node.tagName === "IMG") {
                this.updateImageSrc(node);
              } else if (node.querySelectorAll) {
                node.querySelectorAll("img").forEach(this.updateImageSrc);
              }
            }
          });
          if (mutation.type === "attributes" && mutation.target.tagName === "IMG") {
            this.updateImageSrc(mutation.target);
          }
        });
      },
      initObserver() {
        this.observer = new MutationObserver(this.processMutations);
        this.observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["src"]
        });
      }
    },
    mounted() {
      if (this.value1) {
        this.toggleEmojiStyle();
      }
    },
    beforeDestroy() {
      this.observer && this.observer.disconnect();
    }
  };
  const _hoisted_1$e = { class: "item" };
  const _hoisted_2$e = { class: "tit" };
  const _hoisted_3$8 = ["value"];
  function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$e, [
      vue.createElementVNode("div", _hoisted_2$e, [
        vue.createTextVNode(vue.toDisplayString($props.sort) + ". 切换论坛表情风格 ", 1),
        vue.withDirectives(vue.createElementVNode("select", {
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $options.value2 = $event)
        }, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.options, (item) => {
            return vue.openBlock(), vue.createElementBlock("option", {
              value: item.value,
              key: item.value
            }, vue.toDisplayString(item.label), 9, _hoisted_3$8);
          }), 128))
        ], 512), [
          [vue.vModelSelect, $options.value2]
        ])
      ]),
      vue.withDirectives(vue.createElementVNode("input", {
        type: "checkbox",
        "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $options.value1 = $event),
        onChange: _cache[2] || (_cache[2] = (...args) => $options.handleChange && $options.handleChange(...args))
      }, null, 544), [
        [vue.vModelCheckbox, $options.value1]
      ])
    ]);
  }
  const MenureplaceEmojiStyle = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$h], ["__scopeId", "data-v-d780d688"]]);
  const _sfc_main$g = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"]
  };
  const _hoisted_1$d = { class: "item" };
  const _hoisted_2$d = { class: "tit" };
  const _hoisted_3$7 = ["checked"];
  function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$d, [
      vue.createElementVNode("div", _hoisted_2$d, vue.toDisplayString($props.sort) + ". 快速打开 Shared（需提前解锁 Shared）", 1),
      vue.createElementVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$7)
    ]);
  }
  const MenuShowAI = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$g]]);
  const _sfc_main$f = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    created() {
      if (this.modelValue) {
        setInterval(() => {
          if ($(".replyja").length < 1) {
            $("#reply-control .save-or-cancel .create").after(
              `<button class="btn btn-default replyja" style="margin-left:15px;" type="button">ja 字体</button>`
            );
            $(".replyja").click(function() {
              let $textarea = $(".d-editor-textarea-wrapper textarea");
              let text = `<span lang="ja">

${$(".d-editor-input").val()}

</span>`;
              $(".d-editor-textarea-wrapper textarea").val("");
              $textarea.focus();
              for (let i = 0; i < text.length; i++) {
                let char = text[i];
                $textarea.val($textarea.val() + char);
                let inputEvent = new Event("input", {
                  bubbles: true,
                  cancelable: true
                });
                $textarea[0].dispatchEvent(inputEvent);
                let keyEvent = new KeyboardEvent("keydown", {
                  key: char,
                  char,
                  keyCode: char.charCodeAt(0),
                  which: char.charCodeAt(0),
                  bubbles: true
                });
                $textarea[0].dispatchEvent(keyEvent);
              }
            });
          }
        }, 1e3);
      }
    }
  };
  const _hoisted_1$c = { class: "item" };
  const _hoisted_2$c = { class: "tit" };
  const _hoisted_3$6 = ["checked"];
  function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$c, [
      vue.createElementVNode("div", _hoisted_2$c, vue.toDisplayString($props.sort) + ". 编辑器切换 ja 字体", 1),
      vue.createElementVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$6)
    ]);
  }
  const MenuEditorJa = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$f]]);
  const _sfc_main$e = {
    props: {
      value: {
        type: Boolean,
        default: false
      },
      sort: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        localChecked: this.value
      };
    },
    watch: {
      value(newValue) {
        this.localChecked = newValue;
      }
    },
    methods: {
      handleChange() {
        this.$emit("update:value", this.localChecked);
      }
    },
    created() {
      if (this.localChecked) {
        setInterval(() => {
          if ($(".created_order").length < 1) {
            $("#navigation-bar").prepend(
              `<li title="最新创建" class="latest ember-view created_order"><a href="/latest?order=created">最新创建</a></li>`
            );
            $(".created_order").click(function() {
              setTimeout(() => {
                $("#navigation-bar>li").removeClass("active");
                $(this).addClass("active");
              }, 500);
            });
          }
        }, 1e3);
      }
    }
  };
  const _hoisted_1$b = { class: "item" };
  const _hoisted_2$b = { class: "tit" };
  function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$b, [
      vue.createElementVNode("div", _hoisted_2$b, vue.toDisplayString($props.sort) + ". 首页新增按创建时间排序", 1),
      vue.withDirectives(vue.createElementVNode("input", {
        type: "checkbox",
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.localChecked = $event),
        onChange: _cache[1] || (_cache[1] = (...args) => $options.handleChange && $options.handleChange(...args))
      }, null, 544), [
        [vue.vModelCheckbox, $data.localChecked]
      ])
    ]);
  }
  const MenuCreatedOrder = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$e]]);
  const _sfc_main$d = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    created() {
      if (this.modelValue) {
        $(window).on("scroll", function() {
          if ($(window).scrollTop() >= 250) {
            $(".navigation-container").addClass("is-active");
          } else {
            $(".navigation-container").removeClass("is-active");
          }
        });
        $("head").append(`<style>
.navigation-container.is-active{position:fixed;top:65px;background:#fff!important;z-index:9;box-shadow:1px 3px 7px 0 rgba(0,0,0,.2);margin-left:-30px;padding-left:30px;border-radius:5px;padding-top:10px;padding-right:20px;min-width:1000px;width:auto}
.dark-theme .navigation-container.is-active{background:#333!important}
        </style>`);
      }
    }
  };
  const _hoisted_1$a = { class: "item" };
  const _hoisted_2$a = { class: "tit" };
  const _hoisted_3$5 = ["checked"];
  function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$a, [
      vue.createElementVNode("div", _hoisted_2$a, vue.toDisplayString($props.sort) + ". 开启列表页导航栏浮动", 1),
      vue.createElementVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$5)
    ]);
  }
  const MenuStickyNav = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$d]]);
  const _sfc_main$c = {
    props: {
      value: {
        type: String,
        default: ""
      },
      sort: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        textarea: this.value
      };
    },
    watch: {
      value(newValue) {
        this.textarea = newValue;
      }
    },
    methods: {
      handleChange() {
        this.$emit("update:value", this.textarea);
      }
    },
    created() {
      if (this.textarea) {
        $("body").after(`<style>${this.textarea}</style>`);
      }
    }
  };
  const _hoisted_1$9 = { class: "item" };
  const _hoisted_2$9 = { class: "tit" };
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
      vue.createElementVNode("div", _hoisted_1$9, [
        vue.createElementVNode("div", _hoisted_2$9, vue.toDisplayString($props.sort) + ". 自定义 CSS（支持 import 引入第三方样式文件）", 1)
      ]),
      vue.withDirectives(vue.createElementVNode("textarea", {
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.textarea = $event),
        onInput: _cache[1] || (_cache[1] = (...args) => $options.handleChange && $options.handleChange(...args)),
        placeholder: "body{font-size:16px;}"
      }, "\r\n  ", 544), [
        [vue.vModelText, $data.textarea]
      ])
    ], 64);
  }
  const MenuOtherCss = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$c], ["__scopeId", "data-v-12935e12"]]);
  const _sfc_main$b = {
    props: {
      value: {
        type: String,
        default: ""
      },
      sort: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        textarea: this.value
      };
    },
    watch: {
      value(newValue) {
        this.textarea = newValue;
      }
    },
    methods: {
      handleChange() {
        this.$emit("update:value", this.textarea);
      },
      init() {
        $(".d-header .title a").html(`<img src="${this.textarea}">`);
      }
    },
    created() {
      if (this.textarea && this.textarea != "") {
        this.init();
      }
    }
  };
  const _hoisted_1$8 = { class: "item" };
  const _hoisted_2$8 = { class: "tit" };
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
      vue.createElementVNode("div", _hoisted_1$8, [
        vue.createElementVNode("div", _hoisted_2$8, vue.toDisplayString($props.sort) + ". 自定义论坛 logo", 1)
      ]),
      vue.withDirectives(vue.createElementVNode("input", {
        type: "text",
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.textarea = $event),
        onInput: _cache[1] || (_cache[1] = (...args) => $options.handleChange && $options.handleChange(...args)),
        placeholder: "输入图片链接"
      }, null, 544), [
        [vue.vModelText, $data.textarea]
      ])
    ], 64);
  }
  const MenuLogoUrl = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$b], ["__scopeId", "data-v-cb743585"]]);
  const _sfc_main$a = {
    props: {
      value: {
        type: String,
        default: "前排围观，支持一下\n感谢分享，支持一下\n有点厉害，支持一下"
      },
      sort: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        textarea: this.value
      };
    },
    watch: {
      value(newValue) {
        this.textarea = newValue;
      }
    },
    methods: {
      handleChange() {
        this.$emit("update:value", this.textarea);
      },
      init() {
        this.list = this.textarea.split(/\r?\n/) || [];
        if ($(".createreply").length < 1) {
          $(".timeline-container .topic-timeline").append(
            `<div class="createreply" style="margin-top:4rem;"></div>`
          );
          this.list.forEach(function(item) {
            var $li = $(
              '<button class="btn btn-default create reply-to-post no-text btn-icon" type="button"></button>'
            ).text(item);
            $(".createreply").append($li);
          });
          $(".createreply button").click(function() {
            if ($(".timeline-footer-controls button.create").length != 0) {
              $(".timeline-footer-controls button.create")[0].click();
            }
            if ($("#topic-footer-buttons .topic-footer-main-buttons button.create").length != 0) {
              $(
                "#topic-footer-buttons .topic-footer-main-buttons button.create"
              )[0].click();
            }
            setTimeout(() => {
              let $textarea = $(".d-editor-textarea-wrapper textarea");
              let text = $(this).html();
              $textarea.focus();
              for (let i = 0; i < text.length; i++) {
                let char = text[i];
                $textarea.val($textarea.val() + char);
                let inputEvent = new Event("input", {
                  bubbles: true,
                  cancelable: true
                });
                $textarea[0].dispatchEvent(inputEvent);
                let keyEvent = new KeyboardEvent("keydown", {
                  key: char,
                  char,
                  keyCode: char.charCodeAt(0),
                  which: char.charCodeAt(0),
                  bubbles: true
                });
                $textarea[0].dispatchEvent(keyEvent);
              }
            }, 1e3);
          });
        }
      }
    },
    created() {
      if (this.textarea) {
        setInterval(() => {
          this.init();
        }, 1e3);
      }
    }
  };
  const _hoisted_1$7 = { class: "item" };
  const _hoisted_2$7 = { class: "tit" };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
      vue.createElementVNode("div", _hoisted_1$7, [
        vue.createElementVNode("div", _hoisted_2$7, vue.toDisplayString($props.sort) + ". 自定义快捷回复（换行分隔）", 1)
      ]),
      vue.withDirectives(vue.createElementVNode("textarea", {
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.textarea = $event),
        onInput: _cache[1] || (_cache[1] = (...args) => $options.handleChange && $options.handleChange(...args)),
        placeholder: "前排围观支持一下\\n感谢分享大佬厉害啊\\n有点厉害支持~~"
      }, "\r\n  ", 544), [
        [vue.vModelText, $data.textarea]
      ])
    ], 64);
  }
  const MenuCreatereply = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$a], ["__scopeId", "data-v-e58a62ee"]]);
  const _sfc_main$9 = {
    props: {
      value: {
        type: String,
        default: ""
      },
      sort: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        textarea: this.value
      };
    },
    watch: {
      value(newValue) {
        this.textarea = newValue;
      }
    },
    methods: {
      handleChange() {
        this.$emit("update:value", this.textarea);
      },
      init() {
        this.list = this.textarea.split(",") || [];
        var self = this;
        $(".topic-list .topic-list-data.posters>a:nth-child(1)").filter((index, element) => {
          var user = $(element).attr("data-user-card");
          return self.list.indexOf(user) !== -1;
        }).parents("tr.topic-list-item").remove();
        $(".topic-post .full-name a").filter((index, element) => {
          var user = $(element).attr("data-user-card");
          return self.list.indexOf(user) !== -1;
        }).parents(".topic-post").remove();
      }
    },
    created() {
      if (this.textarea) {
        let pollinglength1 = 0;
        let pollinglength2 = 0;
        setInterval(() => {
          if (pollinglength1 != $(".topic-list-body tr").length) {
            pollinglength1 = $(".topic-list-body tr").length;
            this.init();
          }
          if (pollinglength2 != $(".post-stream .topic-post").length) {
            pollinglength2 = $(".post-stream .topic-post").length;
            this.init();
          }
        }, 1e3);
      }
    }
  };
  const _hoisted_1$6 = { class: "item" };
  const _hoisted_2$6 = { class: "tit" };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
      vue.createElementVNode("div", _hoisted_1$6, [
        vue.createElementVNode("div", _hoisted_2$6, vue.toDisplayString($props.sort) + ". 屏蔽指定用户（使用英文，分隔）", 1)
      ]),
      vue.withDirectives(vue.createElementVNode("textarea", {
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.textarea = $event),
        onInput: _cache[1] || (_cache[1] = (...args) => $options.handleChange && $options.handleChange(...args)),
        placeholder: "user1,user2,user3"
      }, "\r\n  ", 544), [
        [vue.vModelText, $data.textarea]
      ])
    ], 64);
  }
  const MenuBlockuserlist = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$9], ["__scopeId", "data-v-f84417d4"]]);
  const _sfc_main$8 = {
    data() {
      return {
        tableData: []
      };
    },
    methods: {
      // 修改标签
      editTags(item) {
        var tags = prompt(`对 @${item.name} 修改标签`, item.tags);
        if (tags == null) {
          return item.tags;
        }
        if (tags != item.tags) {
          var existingPerson = this.tableData.find((items) => items.name === item.name);
          if (existingPerson) {
            existingPerson.tags = tags;
          } else {
            this.tableData.push({ name: person, tags });
          }
          let settingData1 = localStorage.getItem("linxudoscriptssetting");
          settingData1 = JSON.parse(settingData1);
          settingData1.usertags = this.tableData;
          localStorage.setItem("linxudoscriptssetting", JSON.stringify(settingData1));
        }
      },
      delTags(item) {
        var del = confirm("是否确认删除！");
        if (del == true) {
          this.tableData.splice(item, 1);
          let settingData1 = localStorage.getItem("linxudoscriptssetting");
          settingData1 = JSON.parse(settingData1);
          settingData1.usertags = this.tableData;
          localStorage.setItem("linxudoscriptssetting", JSON.stringify(settingData1));
        }
      }
    },
    created() {
      let settingData = localStorage.getItem("linxudoscriptssetting");
      settingData = JSON.parse(settingData);
      if (!settingData.usertags) {
        settingData.usertags = [];
      }
      settingData.usertags = settingData.usertags.filter((user) => user.tags);
      this.tableData = settingData.usertags;
      setInterval(() => {
        if ($(".addusertag").length < 1) {
          $(".usercard-controls").append(
            `<li><button class="btn addusertag" type="button">添加用户标签</button></li>`
          );
          $(".addusertag").click(function() {
            var person2 = $(".user-card .user-profile-link").attr("href").replace("/u/", "");
            var tags = prompt(`对 @${person2} 设置标签（保存后刷新页面）`, "");
            if (tags == null) {
              return false;
            }
            var lowerCasePerson = person2.toLowerCase();
            var existingPerson = settingData.usertags.find(
              (item) => item.name.toLowerCase() === lowerCasePerson
            );
            if (existingPerson) {
              existingPerson.tags = tags;
            } else {
              settingData.usertags.push({ name: person2, tags });
            }
            localStorage.setItem("linxudoscriptssetting", JSON.stringify(settingData));
          });
        }
        $(".topic-post").each(function() {
          const username = $(this).find(".first a").attr("data-user-card").toLowerCase();
          const userTag = settingData.usertags.find((user) => user.name === username);
          if (userTag) {
            if ($(this).find(".linxudoscripts-tag").length < 1) {
              $(this).find(".names").append(`<span class="linxudoscripts-tag"># ${userTag.tags}</span>`);
            }
          }
        });
      }, 1e3);
    }
  };
  const _hoisted_1$5 = { class: "menu-table" };
  const _hoisted_2$5 = /* @__PURE__ */ vue.createElementVNode("tr", null, [
    /* @__PURE__ */ vue.createElementVNode("th", null, "用户名"),
    /* @__PURE__ */ vue.createElementVNode("th", null, "标签"),
    /* @__PURE__ */ vue.createElementVNode("th", null, "操作")
  ], -1);
  const _hoisted_3$4 = ["onClick"];
  const _hoisted_4$4 = ["onClick"];
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", null, [
      vue.createElementVNode("table", _hoisted_1$5, [
        _hoisted_2$5,
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.tableData, (item) => {
          return vue.openBlock(), vue.createElementBlock("tr", {
            key: item.name
          }, [
            vue.createElementVNode("td", null, vue.toDisplayString(item.name), 1),
            vue.createElementVNode("td", null, vue.toDisplayString(item.tags), 1),
            vue.createElementVNode("td", null, [
              vue.createElementVNode("span", {
                class: "span",
                onClick: ($event) => $options.editTags(item)
              }, "修改", 8, _hoisted_3$4),
              vue.createElementVNode("span", {
                class: "span",
                onClick: ($event) => $options.delTags(item),
                style: { "color": "#e00" }
              }, "删除！", 8, _hoisted_4$4)
            ])
          ]);
        }), 128))
      ])
    ]);
  }
  const UserTags = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$8]]);
  const _sfc_main$7 = {
    props: {
      value: {
        type: Object,
        default: {
          value1: false,
          value2: false,
          title: false,
          btn: false,
          apikey: "",
          baseurl: "https://api.openai.com",
          model: "gpt-4o-mini",
          prompt: `根据以下帖子内容进行总结，请使用 markdown 格式返回回答，没有字数限制，但要求文字精炼，简介准确，语言要求返回简体中文，并且进行中英文混排优化。可以通过编号列表（1，2，3）列出核心要点。
注意不要输出标题，例如：核心要点总结，帖子总结等，直接输出文本段落。`
        }
      }
    },
    data() {
      return {
        localChecked: this.value
      };
    },
    watch: {
      value(newValue) {
        this.localChecked = newValue;
      }
    },
    methods: {
      handleChange() {
        this.$emit("update:value", this.localChecked);
      },
      getTopicUrl(url) {
        const regex = /^(https:\/\/linux\.do\/t\/topic\/\d+)(\/\d+)?$/;
        const match = url.match(regex);
        return match ? match[1] : url;
      },
      // 是否开启手动生成
      setCreatedBtn() {
        if (this.localChecked.btn) {
          setInterval(() => {
            if ($(".gpt-summary-wrap").length < 1 && $(".aicreated-btn").length < 1) {
              $("#topic-title").after(
                `<button class="aicreated-btn" type="button">AI 总结</button>`
              );
              $(".aicreated-btn").click(() => {
                $(".aicreated-btn").remove();
                $(".gpt-summary-wrap").remove();
                this.getPostContent();
              });
            }
          }, 1e3);
        }
      },
      // 获取帖子内容并生成
      async getPostContent() {
        $(".post-stream").before(
          `<div class="gpt-summary-wrap">
         <div class="gpt-summary">AI 总结：正在使用 AI 总结内容中，请稍后...</div>
         <button type="button" class="airegenerate" style="display:none">重新生成</button>
          </div>`
        );
        $(".airegenerate").click(() => {
          $(".gpt-summary-wrap").remove();
          this.getPostContent();
        });
        let topicUrl = this.getTopicUrl(window.location.href);
        return new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: "GET",
            url: topicUrl + "/1.json",
            headers: {
              accept: "application/json, text/javascript, */*; q=0.01",
              "accept-language": "zh-CN,zh;q=0.9",
              "x-requested-with": "XMLHttpRequest"
            },
            onload: async function(response) {
              const config = JSON.parse(localStorage.getItem("linxudoscriptssetting")).gptdata;
              if (response.status === 200) {
                try {
                  const data = JSON.parse(response.responseText);
                  const str = data.post_stream.posts[0].cooked;
                  const prompt2 = `${config.prompt}
帖子内容如下：
${str}`;
                  const gptResponse = await fetch(`${config.baseurl}/v1/chat/completions`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${config.apikey}`
                    },
                    body: JSON.stringify({
                      model: config.model,
                      messages: [
                        {
                          role: "user",
                          content: prompt2
                        }
                      ],
                      temperature: 0.7
                    })
                  });
                  const gptData = await gptResponse.json();
                  $(".gpt-summary").html(
                    `${marked.parse(gptData.choices[0].message.content)}`
                  );
                  $(".airegenerate").show();
                  let summaryCache = JSON.parse(localStorage.getItem("summaryCacheData")) || [];
                  const regex = /^(https:\/\/linux\.do\/t\/topic\/\d+)(\/\d+)?$/;
                  const match = window.location.href.match(regex)[0];
                  let existingObject = summaryCache.find((item) => item.name == match);
                  let newObject = {
                    name: topicUrl,
                    value: gptData.choices[0].message.content
                  };
                  if (existingObject) {
                    existingObject.value = newObject.value;
                  } else {
                    summaryCache.push(newObject);
                  }
                  localStorage.setItem("summaryCacheData", JSON.stringify(summaryCache));
                } catch (error) {
                  $(".gpt-summary").html(`生成失败，请检查配置是否正确并刷新重试！`);
                  $(".airegenerate").show();
                  reject(error);
                }
              } else {
                $(".gpt-summary").html(`生成失败，请检查配置是否正确并刷新重试！`);
                $(".airegenerate").show();
              }
            },
            onerror: function(error) {
              reject(error);
            }
          });
        });
      },
      // AI 根据新建话题内容生成标题
      async getCreateNewTopicTitle() {
        return new Promise((resolve, reject) => {
          const topic_contentdata = $(".d-editor-preview").html();
          const config = JSON.parse(localStorage.getItem("linxudoscriptssetting")).gptdata;
          const prompt2 = `根据以下帖子内容，生成一个合适的标题用于社交论坛发布使用，格式要求：不要书名号或其他符号，只需要一句纯文本。尽量精简到15字以内，如果字数不够表达主题，可以适当多生成几个字。
帖子内容如下：
${topic_contentdata}`;
          fetch(`${config.baseurl}/v1/chat/completions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${config.apikey}`
            },
            body: JSON.stringify({
              model: config.model,
              messages: [
                {
                  role: "user",
                  content: prompt2
                }
              ],
              temperature: 0.7
            })
          }).then((response) => {
            if (!response.ok) {
              reject(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          }).then((gptData) => {
            console.log(gptData.choices[0].message.content);
            $("#reply-title").val(gptData.choices[0].message.content);
            resolve();
          }).catch((error) => {
            console.log(error);
            $("#reply-title").val(`抱歉生成失败，请检查配置或者反馈给开发者！`);
          });
        });
      }
    },
    created() {
      if (this.localChecked.value1) {
        let script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
        document.body.appendChild(script);
        this.setCreatedBtn();
        setInterval(() => {
          if ($(".post-stream").length > 0) {
            if ($(".gpt-summary-wrap").length < 1) {
              let summaryCache = JSON.parse(localStorage.getItem("summaryCacheData")) || [];
              const regex = /^(https:\/\/linux\.do\/t\/topic\/\d+)(\/\d+)?$/;
              const match = window.location.href.match(regex)[0];
              let existingObject = summaryCache.find((item) => item.name === match);
              if (existingObject) {
                $(".post-stream").before(
                  `<div class="gpt-summary-wrap">
<div class="gpt-summary">${marked.parse(existingObject.value)}</div>
<button type="button" class="airegenerate" style="display:none">重新生成</button>
</div>`
                );
                $(".airegenerate").click(() => {
                  $(".gpt-summary-wrap").remove();
                  this.getPostContent();
                });
              }
            }
            if (!this.localChecked.btn) {
              if ($(".gpt-summary-wrap").length < 1) {
                this.getPostContent();
              }
            }
            $(".topic-list .main-link a.title").click(() => {
              $(".gpt-summary-wrap").remove();
            });
          }
        }, 1e3);
      }
      if (this.localChecked.value2) {
        $("body").append("<style>.airegenerate{display:none!important;}</style>");
      }
      if (this.localChecked.title) {
        setInterval(() => {
          if ($(".action-title").length > 0) {
            if ($(".action-title").html().includes("创建新话题")) {
              if ($(".aicreatenewtopictitle").length < 1) {
                $(".action-title").append(
                  '<span class="aicreatenewtopictitle">AI 生成标题</span>'
                );
                $(".aicreatenewtopictitle").click(() => {
                  $("#reply-title").val("正在生成中，请稍后...");
                  this.getCreateNewTopicTitle();
                });
              }
            }
          }
        }, 1e3);
      }
    }
  };
  const _withScopeId$2 = (n) => (vue.pushScopeId("data-v-0e067488"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$4 = { class: "item" };
  const _hoisted_2$4 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "tit" }, "1. 是否开启 AI 生成话题总结", -1));
  const _hoisted_3$3 = { class: "item" };
  const _hoisted_4$3 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "tit" }, "2. 是否手动总结（默认自动总结）", -1));
  const _hoisted_5$2 = { class: "item" };
  const _hoisted_6$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "tit" }, "3. 是否关闭重新生成按钮（默认显示重新生成）", -1));
  const _hoisted_7$1 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "item" }, [
    /* @__PURE__ */ vue.createElementVNode("div", { class: "tit" }, "4. 配置信息")
  ], -1));
  const _hoisted_8$1 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ vue.createElementVNode("div", null, "5. AI 总结帖子 prompt:", -1));
  const _hoisted_9$1 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ vue.createElementVNode("div", { style: { "margin-top": "10px" } }, " 注意：baseurl 不带后缀和 '/'，不支持 http，请使用 https ", -1));
  const _hoisted_10$1 = { class: "item" };
  const _hoisted_11$1 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "tit" }, "6. 新建话题使用 AI 生成标题", -1));
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", null, [
      vue.createElementVNode("div", _hoisted_1$4, [
        _hoisted_2$4,
        vue.withDirectives(vue.createElementVNode("input", {
          type: "checkbox",
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.localChecked.value1 = $event),
          onChange: _cache[1] || (_cache[1] = (...args) => $options.handleChange && $options.handleChange(...args))
        }, null, 544), [
          [vue.vModelCheckbox, $data.localChecked.value1]
        ])
      ]),
      vue.createElementVNode("div", _hoisted_3$3, [
        _hoisted_4$3,
        vue.withDirectives(vue.createElementVNode("input", {
          type: "checkbox",
          "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.localChecked.btn = $event),
          onChange: _cache[3] || (_cache[3] = (...args) => $options.handleChange && $options.handleChange(...args))
        }, null, 544), [
          [vue.vModelCheckbox, $data.localChecked.btn]
        ])
      ]),
      vue.createElementVNode("div", _hoisted_5$2, [
        _hoisted_6$2,
        vue.withDirectives(vue.createElementVNode("input", {
          type: "checkbox",
          "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.localChecked.value2 = $event),
          onChange: _cache[5] || (_cache[5] = (...args) => $options.handleChange && $options.handleChange(...args))
        }, null, 544), [
          [vue.vModelCheckbox, $data.localChecked.value2]
        ])
      ]),
      _hoisted_7$1,
      vue.withDirectives(vue.createElementVNode("input", {
        type: "text",
        "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $data.localChecked.apikey = $event),
        placeholder: "sk-xxxxxxxx"
      }, null, 512), [
        [vue.vModelText, $data.localChecked.apikey]
      ]),
      vue.withDirectives(vue.createElementVNode("input", {
        type: "text",
        "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.localChecked.baseurl = $event),
        placeholder: "https://api.openai.com"
      }, null, 512), [
        [vue.vModelText, $data.localChecked.baseurl]
      ]),
      vue.withDirectives(vue.createElementVNode("input", {
        type: "text",
        "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $data.localChecked.model = $event),
        placeholder: "模型，如：gpt-4o-mini"
      }, null, 512), [
        [vue.vModelText, $data.localChecked.model]
      ]),
      _hoisted_8$1,
      vue.withDirectives(vue.createElementVNode("textarea", {
        "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $data.localChecked.prompt = $event)
      }, null, 512), [
        [vue.vModelText, $data.localChecked.prompt]
      ]),
      _hoisted_9$1,
      vue.createElementVNode("div", _hoisted_10$1, [
        _hoisted_11$1,
        vue.withDirectives(vue.createElementVNode("input", {
          type: "checkbox",
          "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => $data.localChecked.title = $event),
          onChange: _cache[11] || (_cache[11] = (...args) => $options.handleChange && $options.handleChange(...args))
        }, null, 544), [
          [vue.vModelCheckbox, $data.localChecked.title]
        ])
      ])
    ]);
  }
  const GPTconfig = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$7], ["__scopeId", "data-v-0e067488"]]);
  const _sfc_main$6 = {
    data() {
      return {};
    },
    methods: {
      lookop() {
        $(".post-stream").toggleClass("lookopwrapactive");
      }
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", {
      class: "el-button",
      onClick: _cache[0] || (_cache[0] = (...args) => $options.lookop && $options.lookop(...args)),
      title: "只看楼主"
    }, "楼主");
  }
  const LookOP = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$6]]);
  const _sfc_main$5 = {
    data() {
      return {
        isMinimized: true,
        content: "输入用户名查询等级信息",
        username: "",
        levelDescriptions: {
          0: "游客",
          1: "基本用户",
          2: "成员",
          3: "活跃用户",
          4: "领导者"
        },
        levelRequirements: {
          0: { topics_entered: 5, posts_read_count: 30, time_read: 600 },
          1: {
            days_visited: 15,
            likes_given: 1,
            likes_received: 1,
            post_count: 3,
            topics_entered: 20,
            posts_read_count: 100,
            time_read: 3600
          },
          2: {
            days_visited: 50,
            likes_given: 30,
            likes_received: 20,
            post_count: 10,
            topics_entered: 0,
            posts_read_count: 0
          }
        }
      };
    },
    methods: {
      async fetchAboutData() {
        try {
          const response = await fetch("/about.json", {
            headers: {
              Accept: "application/json",
              "User-Agent": "Mozilla/5.0"
            },
            method: "GET"
          });
          if (!response.ok) throw new Error(`HTTP 错误！状态：${response.status}`);
          return await response.json();
        } catch (error) {
          console.error("获取关于页面数据失败：", error);
          this.displayError("获取关于页面数据失败");
          return null;
        }
      },
      async fetchUserData(username) {
        try {
          const response = await fetch(`/u/${username}/summary.json`, {
            headers: {
              Accept: "application/json",
              "User-Agent": "Mozilla/5.0"
            },
            method: "GET"
          });
          if (!response.ok) throw new Error(`HTTP 错误！状态：${response.status}`);
          return await response.json();
        } catch (error) {
          console.error("获取用户数据失败：", error);
          this.displayError("获取用户数据失败");
          return null;
        }
      },
      async handleSearch() {
        if (this.username == "") {
          return false;
        }
        this.content = "正在查询中，请稍后...";
        const username = this.username.trim();
        if (username) {
          const aboutData = await this.fetchAboutData();
          const userData = await this.fetchUserData(username);
          if (userData && aboutData) {
            const userSummary = userData.user_summary;
            const user = userData.users[0];
            const status = aboutData.about.stats;
            this.updatePopupContent(userSummary, user, status);
          }
        }
      },
      updatePopupContent(userSummary, user, status) {
        if (userSummary && user) {
          let content = `<strong>信任等级：</strong>${this.levelDescriptions[user.trust_level]}<br><strong>升级进度：</strong><br>`;
          if (user.trust_level === 3) {
            content += `联系管理员以升级到领导者<br>`;
          } else if (user.trust_level === 4) {
            content += `您已是最高信任等级<br>`;
          } else {
            const requirements = this.levelRequirements[user.trust_level];
            if (user.trust_level === 2) {
              requirements.posts_read_count = Math.min(
                Math.floor(status.posts_30_days / 4),
                2e4
              );
              requirements.topics_entered = Math.min(
                Math.floor(status.topics_30_days / 4),
                500
              );
            }
            Object.entries(requirements).forEach(([key, val]) => {
              const currentVal = userSummary[key] || 0;
              const color = currentVal >= val ? "green" : "red";
              content += `${this.translateStat(
              key
            )}: <span style="color: ${color};">${currentVal} / ${val}</span><br>`;
            });
          }
          this.content = content;
        }
      },
      togglePopupSize() {
        this.isMinimized = !this.isMinimized;
      },
      displayError(message) {
        this.content = `<strong>错误：</strong>${message}`;
      },
      translateStat(stat) {
        const translations = {
          days_visited: "访问天数",
          likes_given: "给出的赞",
          likes_received: "收到的赞",
          post_count: "帖子数量",
          posts_read_count: "阅读的帖子数",
          topics_entered: "进入的主题数",
          time_read: "阅读时间"
        };
        return translations[stat] || stat;
      }
    },
    created() {
      setInterval(() => {
        if (!this.username) {
          const src = $("#toggle-current-user img.avatar").attr("src");
          const match = src.match(/\/user_avatar\/linux\.do\/([^\/]+)/);
          if (match && match[1]) {
            this.username = match[1];
          }
        }
      }, 1e3);
    }
  };
  const _withScopeId$1 = (n) => (vue.pushScopeId("data-v-0068d3be"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$3 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ vue.createElementVNode("span", null, "等级", -1));
  const _hoisted_2$3 = [
    _hoisted_1$3
  ];
  const _hoisted_3$2 = {
    key: 0,
    id: "linuxDoLevelPopupContent"
  };
  const _hoisted_4$2 = ["innerHTML"];
  const _hoisted_5$1 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ vue.createElementVNode("span", { class: "d-button-label" }, "搜索", -1));
  const _hoisted_6$1 = [
    _hoisted_5$1
  ];
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", null, [
      vue.createElementVNode("div", {
        class: vue.normalizeClass(["el-button", ["linuxDoLevelPopup", $data.isMinimized ? "minimized" : ""]]),
        onClick: _cache[0] || (_cache[0] = (...args) => $options.togglePopupSize && $options.togglePopupSize(...args)),
        title: "等级查询"
      }, _hoisted_2$3, 2),
      !$data.isMinimized ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_3$2, [
        vue.createElementVNode("div", { innerHTML: $data.content }, null, 8, _hoisted_4$2),
        vue.withDirectives(vue.createElementVNode("input", {
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.username = $event),
          autocomplete: "off",
          type: "text",
          placeholder: "请输入用户名...",
          id: "linuxDoUserSearch"
        }, null, 512), [
          [vue.vModelText, $data.username]
        ]),
        vue.createElementVNode("button", {
          onClick: _cache[2] || (_cache[2] = (...args) => $options.handleSearch && $options.handleSearch(...args)),
          class: "btn btn-icon-text",
          type: "button"
        }, _hoisted_6$1)
      ])) : vue.createCommentVNode("", true)
    ]);
  }
  const LevelDiglog = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$5], ["__scopeId", "data-v-0068d3be"]]);
  const _sfc_main$4 = {
    data() {
      return {
        num: 10,
        // 滚动速度
        isScrolling: false,
        scrollInterval: null
      };
    },
    methods: {
      scrollToBottomSlowly(distancePerStep = this.num, delayPerStep = 50) {
        if (this.scrollInterval !== null) {
          clearInterval(this.scrollInterval);
        }
        this.scrollInterval = setInterval(() => {
          const documentHeight = document.body.scrollHeight;
          const windowHeight = window.innerHeight;
          const scrollPosition = window.scrollY;
          if (scrollPosition + windowHeight >= documentHeight - 1) {
            clearInterval(this.scrollInterval);
            this.scrollInterval = null;
          } else {
            window.scrollBy(0, distancePerStep);
          }
        }, delayPerStep);
      },
      autoread() {
        if (this.isScrolling) {
          clearInterval(this.scrollInterval);
          this.scrollInterval = null;
          this.isScrolling = false;
        } else {
          this.scrollToBottomSlowly();
          this.isScrolling = true;
        }
      }
    },
    created() {
      let linxudoscriptssetting = localStorage.getItem("linxudoscriptssetting");
      if (linxudoscriptssetting) {
        linxudoscriptssetting = JSON.parse(linxudoscriptssetting);
        this.num = Number(linxudoscriptssetting.checked8.value2);
      }
    }
  };
  const _hoisted_1$2 = /* @__PURE__ */ vue.createElementVNode("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, [
    /* @__PURE__ */ vue.createElementVNode("path", {
      stroke: "none",
      d: "M0 0h24v24H0z",
      fill: "none"
    }),
    /* @__PURE__ */ vue.createElementVNode("path", { d: "M12.088 4.82a10 10 0 0 1 9.412 .314a1 1 0 0 1 .493 .748l.007 .118v13a1 1 0 0 1 -1.5 .866a8 8 0 0 0 -8 0a1 1 0 0 1 -1 0a8 8 0 0 0 -7.733 -.148l-.327 .18l-.103 .044l-.049 .016l-.11 .026l-.061 .01l-.117 .006h-.042l-.11 -.012l-.077 -.014l-.108 -.032l-.126 -.056l-.095 -.056l-.089 -.067l-.06 -.056l-.073 -.082l-.064 -.089l-.022 -.036l-.032 -.06l-.044 -.103l-.016 -.049l-.026 -.11l-.01 -.061l-.004 -.049l-.002 -.068v-13a1 1 0 0 1 .5 -.866a10 10 0 0 1 9.412 -.314l.088 .044l.088 -.044z" })
  ], -1);
  const _hoisted_2$2 = [
    _hoisted_1$2
  ];
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", {
      class: "el-button",
      onClick: _cache[0] || (_cache[0] = (...args) => $options.autoread && $options.autoread(...args)),
      title: "自动阅读"
    }, _hoisted_2$2);
  }
  const AutoRead = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4]]);
  const _sfc_main$3 = {
    data() {
      return {};
    },
    methods: {
      openai() {
        window.open("https://shared.oaifree.com/?temporary-chat=true", "_blank");
      }
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", null, [
      vue.createElementVNode("div", {
        class: "el-button",
        style: { "font-size": "18px" },
        onClick: _cache[0] || (_cache[0] = (...args) => $options.openai && $options.openai(...args)),
        type: "primary",
        title: "AI对话"
      }, " AI ")
    ]);
  }
  const AIDialog = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3]]);
  const _sfc_main$2 = {
    data() {
      return {
        version: packageJson.version
      };
    }
  };
  const _withScopeId = (n) => (vue.pushScopeId("data-v-677b97d9"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$1 = { class: "item" };
  const _hoisted_2$1 = { class: "tit" };
  const _hoisted_3$1 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("a", {
    href: "https://github.com/dlzmoe/linuxdo-scripts",
    target: "_blank"
  }, "Github 源码", -1));
  const _hoisted_4$1 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("a", {
    href: "https://linuxdo-scripts-docs.netlify.app/",
    target: "_blank"
  }, "使用文档", -1));
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1, [
      vue.createElementVNode("div", _hoisted_2$1, [
        vue.createTextVNode(" 当前版本：" + vue.toDisplayString($data.version) + " ", 1),
        _hoisted_3$1,
        _hoisted_4$1
      ])
    ]);
  }
  const Updates = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__scopeId", "data-v-677b97d9"]]);
  const _sfc_main$1 = {
    created() {
      setTimeout(() => {
        const isShowplugininstallationprompts = localStorage.getItem(
          "isShowplugininstallationprompts"
        );
        if (isShowplugininstallationprompts == "true") ;
        else {
          if ($(".UsageTip").length < 1) {
            $(".sidebar-footer-container").before(`
            <dialog open class="UsageTip">
              <div class="title">友情提示</div>
              <div>
                佬友你好，你已经成功安装 linuxdo 增强插件啦！<a
                  href="https://linuxdo-scripts-docs.netlify.app/"
                  target="_blank">
                  使用文档
                  </a>
              </div>
              <div style="color:#e00">
                设置按钮在下方切换主题的旁边哦~ 有个小齿轮，点击它开始配置插件！
              </div>
              <div>如果可以的话欢迎点个 star 支持一下~</div>
              <div>
                <a href="https://github.com/dlzmoe/linuxdo-scripts/" target="_blank">
                  <img
                    src="https://img.shields.io/github/stars/dlzmoe%2Flinuxdo-scripts?style=for-the-badge&labelColor=%235D5D5D&color=%23E97435"
                    alt="icon"
                  />
                </a>
              </div>
              <button class="clicktohide">点击我，该提示永远不会出现啦</button>
            </dialog>
           `);
            $(".clicktohide").click(function() {
              localStorage.setItem("isShowplugininstallationprompts", true);
              $(".UsageTip").remove();
            });
          }
        }
      }, 100);
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return null;
  }
  const UsageTip = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1]]);
  const _sfc_main = {
    components: {
      MenuOpenpostblank,
      MenuNewtopicreminder,
      MenuAutoexpandreply,
      MenuShowcreatetime,
      MenuShowcreatetime1,
      MenuShowfloors,
      MenuHidetopicdetailtitle,
      MenuTopicpreview,
      MenuCreatereply,
      MenuBlockuserlist,
      MenuAutoRead,
      AutoRead,
      Updates,
      MenuLookOP,
      LookOP,
      LevelDiglog,
      UsageTip,
      MenuFloorHeight,
      UserTags,
      MenuOtherCss,
      MenuLogoUrl,
      ReplyTBEnjoy,
      MenuPangu,
      MenuLevelSearch,
      MenuShowUnread,
      MenuFilterText,
      MenuLookmeSign,
      MenuQuickAccess,
      MenureplaceEmojiStyle,
      MenuShowAI,
      AIDialog,
      MenuEditorJa,
      MenuCreatedOrder,
      GPTconfig,
      MenuStickyNav
    },
    data() {
      return {
        version: packageJson.version,
        opacity: false,
        open: false,
        floorlotteryDialog: false,
        floorlotteryval1: "",
        floorlotteryval2: "",
        floorlotterloading: false,
        floorlotterresult: "",
        // 设置数据
        settingData: {
          checked1: false,
          checked2: false,
          checked3: false,
          checked4: false,
          checked41: true,
          checked5: true,
          checked6: false,
          checked7: false,
          checked8: {
            value1: true,
            value2: 10
          },
          checked9: true,
          QuickReply: "前排围观支持一下\n感谢分享大佬厉害啊\n有点厉害支持~~",
          blockList: "",
          checked10: false,
          othercss: "",
          logourl: "",
          checked11: true,
          checked12: true,
          checked13: false,
          checked14: false,
          checked15: false,
          checked16: false,
          checked17: {
            value1: false,
            value2: "twitter"
          },
          checked18: false,
          checked19: false,
          checked20: true,
          gptdata: {
            value1: false,
            value2: false,
            title: false,
            btn: false,
            apikey: "",
            baseurl: "https://api.openai.com",
            model: "gpt-4o-mini",
            prompt: `根据以下帖子内容进行总结，请使用 markdown 格式返回回答，没有字数限制，但要求文字精炼，简介准确，语言要求返回简体中文，并且进行中英文混排优化。可以通过编号列表（1，2，3）列出核心要点。
注意不要输出标题，例如：核心要点总结，帖子总结等，直接输出文本段落。`
          }
        },
        showautoread: false,
        showlookop: false,
        showlevelsearch: false,
        showaidialog: false
      };
    },
    methods: {
      // 关闭弹窗
      closedialog() {
        $(".linuxdoscripts-opacity").hide();
        $("#menu_suspendedball").hide();
      },
      // 保存设置
      save() {
        localStorage.setItem("linxudoscriptssetting", JSON.stringify(this.settingData));
        $(".linuxdoscripts-opacity").hide();
        $("#menu_suspendedball").hide();
      },
      saveload() {
        this.save();
        location.reload();
      },
      // 导入数据
      triggerFileInput() {
        this.$refs.fileInput.click();
      },
      handleFileUpload(event) {
        const file = event.target.files[0];
        if (file && file.type === "application/json") {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const jsonData = JSON.parse(e.target.result);
              this.importData(jsonData);
            } catch (error) {
              console.error("Error parsing JSON:", error);
            }
          };
          reader.readAsText(file);
        } else {
          console.error("Please select a valid JSON file.");
        }
      },
      importData(data) {
        this.settingData = data;
      },
      // 导出数据
      exportData() {
        const today = /* @__PURE__ */ new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        const formattedDate = year + month + day;
        const dataStr = JSON.stringify(this.settingData, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `linuxdo-script-data-${formattedDate}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      },
      // 打开抽奖弹窗
      openFloorlottery() {
        $("#menu_suspendedball").hide();
        this.floorlotteryDialog = true;
      },
      // 开始抽奖
      drawRandomNumbers() {
        if (this.floorlotteryval1 === "" || this.floorlotteryval2 === "") {
          return false;
        }
        const total = parseInt(this.floorlotteryval1);
        const count = parseInt(this.floorlotteryval2);
        if (isNaN(total) || isNaN(count) || total <= 0 || count <= 0 || count > total) {
          return false;
        }
        this.floorlotterloading = true;
        this.floorlotterresult = "";
        setTimeout(() => {
          const result = this.getRandomNumbers(total, count);
          this.floorlotterresult = result.join(", ");
          this.floorlotterloading = false;
        }, 1e3);
      },
      getRandomNumbers(total, count) {
        const numbers = Array.from({ length: total }, (_, i) => i + 1);
        const result = [];
        for (let i = 0; i < count; i++) {
          const randomIndex = Math.floor(Math.random() * numbers.length);
          result.push(numbers[randomIndex]);
          numbers.splice(randomIndex, 1);
        }
        return result;
      },
      closelotter() {
        this.floorlotteryDialog = false;
        $(".linuxdoscripts-opacity").hide();
      },
      // 默认运行脚本
      runscripts() {
        $(".linuxdoscripts-setting").click(function() {
          $(".linuxdoscripts-opacity").show();
          $("#menu_suspendedball").show();
        });
        const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (isDarkMode) {
          $("body").addClass("dark-theme");
        } else {
          $("body").removeClass("dark-theme");
        }
        const discourse_color_scheme_override = localStorage.getItem(
          "discourse_color_scheme_override"
        );
        if (discourse_color_scheme_override) {
          if (discourse_color_scheme_override == "dark") {
            $("body").addClass("dark-theme");
          } else {
            $("body").removeClass("dark-theme");
          }
        }
        $(".signature-img").each(function() {
          var self = $(this);
          if (self.siblings(".signature-p").length < 1) {
            var url = self.attr("src");
            if (url.indexOf("http") < 0) {
              self.after(
                `<p class="signature-p">${url}（该用户签名非图片格式，已自动转文字）</p>`
              );
              self.hide();
            } else {
              url.replace(/\/+$/, "");
              var domainPattern = /\.(com|org|net|edu|gov|co|cn|io|info|biz|me|us|uk|au|de|fr|jp|ru|ch|it|nl|se|no|es|mil|int|arpa|asia|museum|name|pro|coop|aero|cat|jobs|mobi|travel|xxx|idv|tv|cc|ws|bz|nu|tk|fm|ag|am|at|be|bg|cd|cf|cg|ch|cl|cm|cz|dk|dm|ec|ee|es|eu|fi|ga|gd|gf|gg|gl|gp|gr|hm|hr|ht|hu|im|io|is|je|ke|kg|ki|kr|kz|la|lc|li|lt|lu|lv|ma|mc|md|ms|mt|mu|mx|my|nf|ng|nl|no|nz|pa|pe|pf|pg|pl|pm|pn|pr|pt|pw|re|ro|rs|sa|sb|sc|sg|sh|si|sk|sm|sn|so|st|su|sx|tc|tf|tk|tl|tm|to|tr|tt|tw|ua|ug|uy|uz|vc|ve|vg|vn|vu|wf|xyz|yt|za|zm|zw)$/i;
              if (domainPattern.test(url)) {
                self.after(
                  `<p class="signature-p">${url}（该用户签名非图片格式，已自动转文字）</p>`
                );
                self.hide();
              } else if (url.indexOf("photos.google.com") !== -1) {
                self.after(
                  `<p class="signature-p">${url}（该用户签名非图片格式，已自动转文字）</p>`
                );
                self.hide();
              }
            }
          }
        });
        if ($(".menu-nav").length > 0) {
          $(".menu-nav li").each(function() {
            $(this).click(function() {
              const num = $(this).index();
              $(".menu-nav li").removeClass("act");
              $(this).addClass("act");
              $(".menu-body-item").removeClass("act");
              $(".menu-body-item").eq(num).addClass("act");
              if (num == 2) {
                $(".menu-footer").addClass("hides");
              } else {
                $(".menu-footer").removeClass("hides");
              }
            });
          });
        }
      },
      // 初始化设置
      initialization() {
        localStorage.removeItem("linxudoscriptssetting");
        setTimeout(() => {
          location.reload();
        }, 1e3);
      }
    },
    created() {
      setInterval(() => {
        if ($(".linuxdoscripts-setting").length < 1) {
          $(".sidebar-footer-actions").prepend(`<button class="btn no-text btn-icon color-scheme-toggler btn-flat linuxdoscripts-setting" title="设置" type="button">
        <svg
          class="fa d-icon d-icon-cog svg-icon svg-string"
          xmlns="http://www.w3.org/2000/svg"
        >
          <use href="#cog"></use>
        </svg>
    </button>`);
        }
      }, 1e3);
      const linxudoscriptssetting = localStorage.getItem("linxudoscriptssetting");
      if (linxudoscriptssetting) {
        this.settingData = JSON.parse(linxudoscriptssetting);
        this.showautoread = this.settingData.checked8.value1;
        this.showlookop = this.settingData.checked9;
        this.showlevelsearch = this.settingData.checked12;
        this.showaidialog = this.settingData.checked18;
      } else {
        localStorage.setItem("linxudoscriptssetting", JSON.stringify(this.settingData));
      }
      setInterval(() => {
        this.runscripts();
      }, 1e3);
    }
  };
  const _hoisted_1 = { id: "linuxdoscripts" };
  const _hoisted_2 = /* @__PURE__ */ vue.createElementVNode("div", { class: "linuxdoscripts-opacity" }, null, -1);
  const _hoisted_3 = { class: "setting-btn" };
  const _hoisted_4 = {
    open: "",
    id: "menu_suspendedball"
  };
  const _hoisted_5 = { class: "title" };
  const _hoisted_6 = /* @__PURE__ */ vue.createElementVNode("ul", { class: "menu-nav" }, [
    /* @__PURE__ */ vue.createElementVNode("li", { class: "act" }, "基础设置"),
    /* @__PURE__ */ vue.createElementVNode("li", null, "自定义文字"),
    /* @__PURE__ */ vue.createElementVNode("li", null, "用户标签"),
    /* @__PURE__ */ vue.createElementVNode("li", null, "AI 配置")
  ], -1);
  const _hoisted_7 = { class: "menu-body" };
  const _hoisted_8 = { class: "menu-body-item act" };
  const _hoisted_9 = { class: "menu-about" };
  const _hoisted_10 = /* @__PURE__ */ vue.createElementVNode("p", null, "请注意，该设置面板数据全部保存在本地浏览器缓存中，注意备份。", -1);
  const _hoisted_11 = { class: "hint" };
  const _hoisted_12 = { class: "menu-body-item" };
  const _hoisted_13 = { class: "menu-body-item" };
  const _hoisted_14 = { class: "menu-body-item" };
  const _hoisted_15 = { class: "menu-footer" };
  const _hoisted_16 = /* @__PURE__ */ vue.createElementVNode("a", {
    class: "btn",
    style: { "background": "#979797" },
    target: "_blank",
    href: "https://greasyfork.org/zh-CN/scripts/501827-linuxdo-%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6"
  }, " 检测新版本 ", -1);
  const _hoisted_17 = { open: "" };
  const _hoisted_18 = /* @__PURE__ */ vue.createElementVNode("div", { class: "title" }, "楼层抽奖", -1);
  const _hoisted_19 = { class: "menu-body" };
  const _hoisted_20 = /* @__PURE__ */ vue.createElementVNode("div", { style: { "height": "20px" } }, null, -1);
  const _hoisted_21 = { key: 0 };
  const _hoisted_22 = {
    key: 1,
    title: "抽奖结果",
    type: "success"
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_AIDialog = vue.resolveComponent("AIDialog");
    const _component_LevelDiglog = vue.resolveComponent("LevelDiglog");
    const _component_AutoRead = vue.resolveComponent("AutoRead");
    const _component_LookOP = vue.resolveComponent("LookOP");
    const _component_MenuOpenpostblank = vue.resolveComponent("MenuOpenpostblank");
    const _component_MenuNewtopicreminder = vue.resolveComponent("MenuNewtopicreminder");
    const _component_MenuAutoexpandreply = vue.resolveComponent("MenuAutoexpandreply");
    const _component_MenuShowcreatetime = vue.resolveComponent("MenuShowcreatetime");
    const _component_MenuShowcreatetime1 = vue.resolveComponent("MenuShowcreatetime1");
    const _component_MenuShowfloors = vue.resolveComponent("MenuShowfloors");
    const _component_MenuHidetopicdetailtitle = vue.resolveComponent("MenuHidetopicdetailtitle");
    const _component_MenuTopicpreview = vue.resolveComponent("MenuTopicpreview");
    const _component_MenuAutoRead = vue.resolveComponent("MenuAutoRead");
    const _component_MenuLookOP = vue.resolveComponent("MenuLookOP");
    const _component_MenuFloorHeight = vue.resolveComponent("MenuFloorHeight");
    const _component_MenuPangu = vue.resolveComponent("MenuPangu");
    const _component_MenuLevelSearch = vue.resolveComponent("MenuLevelSearch");
    const _component_MenuShowUnread = vue.resolveComponent("MenuShowUnread");
    const _component_MenuFilterText = vue.resolveComponent("MenuFilterText");
    const _component_MenuLookmeSign = vue.resolveComponent("MenuLookmeSign");
    const _component_MenuQuickAccess = vue.resolveComponent("MenuQuickAccess");
    const _component_MenureplaceEmojiStyle = vue.resolveComponent("MenureplaceEmojiStyle");
    const _component_MenuShowAI = vue.resolveComponent("MenuShowAI");
    const _component_MenuEditorJa = vue.resolveComponent("MenuEditorJa");
    const _component_MenuStickyNav = vue.resolveComponent("MenuStickyNav");
    const _component_Updates = vue.resolveComponent("Updates");
    const _component_MenuLogoUrl = vue.resolveComponent("MenuLogoUrl");
    const _component_MenuCreatereply = vue.resolveComponent("MenuCreatereply");
    const _component_MenuBlockuserlist = vue.resolveComponent("MenuBlockuserlist");
    const _component_MenuOtherCss = vue.resolveComponent("MenuOtherCss");
    const _component_UserTags = vue.resolveComponent("UserTags");
    const _component_GPTconfig = vue.resolveComponent("GPTconfig");
    const _component_UsageTip = vue.resolveComponent("UsageTip");
    const _component_ReplyTBEnjoy = vue.resolveComponent("ReplyTBEnjoy");
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
      _hoisted_2,
      vue.createElementVNode("div", _hoisted_3, [
        vue.withDirectives(vue.createVNode(_component_AIDialog, null, null, 512), [
          [vue.vShow, $data.showaidialog]
        ]),
        vue.withDirectives(vue.createVNode(_component_LevelDiglog, null, null, 512), [
          [vue.vShow, $data.showlevelsearch]
        ]),
        vue.withDirectives(vue.createVNode(_component_AutoRead, null, null, 512), [
          [vue.vShow, $data.showautoread]
        ]),
        vue.withDirectives(vue.createVNode(_component_LookOP, null, null, 512), [
          [vue.vShow, $data.showlookop]
        ])
      ]),
      vue.createElementVNode("dialog", _hoisted_4, [
        vue.createElementVNode("div", _hoisted_5, "linuxdo 增强插件设置 " + vue.toDisplayString($data.version), 1),
        vue.createElementVNode("div", {
          class: "close",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.closedialog && $options.closedialog(...args))
        }, "+"),
        _hoisted_6,
        vue.createElementVNode("div", _hoisted_7, [
          vue.createElementVNode("div", _hoisted_8, [
            vue.createElementVNode("div", _hoisted_9, [
              _hoisted_10,
              vue.createElementVNode("p", _hoisted_11, [
                vue.createTextVNode(" 如果感觉哪里不太对劲，点我"),
                vue.createElementVNode("span", {
                  class: "initialization",
                  onClick: _cache[1] || (_cache[1] = (...args) => $options.initialization && $options.initialization(...args))
                }, "初始化设置"),
                vue.createTextVNode("，会清除所有的设置数据并初始化！！ ")
              ])
            ]),
            vue.createVNode(_component_MenuOpenpostblank, {
              sort: 1,
              modelValue: $data.settingData.checked1,
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.settingData.checked1 = $event)
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_MenuNewtopicreminder, {
              sort: 2,
              modelValue: $data.settingData.checked2,
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.settingData.checked2 = $event)
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_MenuAutoexpandreply, {
              sort: 3,
              modelValue: $data.settingData.checked3,
              "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.settingData.checked3 = $event)
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_MenuShowcreatetime, {
              sort: 4,
              modelValue: $data.settingData.checked4,
              "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.settingData.checked4 = $event)
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_MenuShowcreatetime1, {
              sort: 4.1,
              modelValue: $data.settingData.checked41,
              "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $data.settingData.checked41 = $event)
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_MenuShowfloors, {
              sort: 5,
              modelValue: $data.settingData.checked5,
              "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.settingData.checked5 = $event)
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_MenuHidetopicdetailtitle, {
              sort: 6,
              modelValue: $data.settingData.checked6,
              "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $data.settingData.checked6 = $event)
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_MenuTopicpreview, {
              sort: 7,
              modelValue: $data.settingData.checked7,
              "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $data.settingData.checked7 = $event)
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_MenuAutoRead, {
              sort: 8,
              modelValue: $data.settingData.checked8,
              "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => $data.settingData.checked8 = $event)
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_MenuLookOP, {
              sort: 9,
              modelValue: $data.settingData.checked9,
              "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => $data.settingData.checked9 = $event)
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_MenuFloorHeight, {
              sort: 10,
              modelValue: $data.settingData.checked10,
              "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => $data.settingData.checked10 = $event)
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_MenuPangu, {
              sort: 11,
              modelValue: $data.settingData.checked11,
              "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => $data.settingData.checked11 = $event)
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_MenuLevelSearch, {
              sort: 12,
              modelValue: $data.settingData.checked12,
              "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => $data.settingData.checked12 = $event)
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_MenuShowUnread, {
              sort: 13,
              modelValue: $data.settingData.checked13,
              "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => $data.settingData.checked13 = $event)
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_MenuFilterText, {
              sort: 14,
              modelValue: $data.settingData.checked14,
              "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => $data.settingData.checked14 = $event)
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_MenuLookmeSign, {
              sort: 15,
              modelValue: $data.settingData.checked15,
              "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => $data.settingData.checked15 = $event)
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_MenuQuickAccess, {
              sort: 16,
              modelValue: $data.settingData.checked16,
              "onUpdate:modelValue": _cache[18] || (_cache[18] = ($event) => $data.settingData.checked16 = $event)
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_MenureplaceEmojiStyle, {
              sort: 17,
              modelValue: $data.settingData.checked17,
              "onUpdate:modelValue": _cache[19] || (_cache[19] = ($event) => $data.settingData.checked17 = $event)
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_MenuShowAI, {
              sort: 18,
              modelValue: $data.settingData.checked18,
              "onUpdate:modelValue": _cache[20] || (_cache[20] = ($event) => $data.settingData.checked18 = $event)
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_MenuEditorJa, {
              sort: 19,
              modelValue: $data.settingData.checked19,
              "onUpdate:modelValue": _cache[21] || (_cache[21] = ($event) => $data.settingData.checked19 = $event)
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_MenuStickyNav, {
              sort: 20,
              modelValue: $data.settingData.checked20,
              "onUpdate:modelValue": _cache[22] || (_cache[22] = ($event) => $data.settingData.checked20 = $event)
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_Updates)
          ]),
          vue.createElementVNode("div", _hoisted_12, [
            vue.createVNode(_component_MenuLogoUrl, {
              sort: 1,
              value: $data.settingData.logourl,
              "onUpdate:value": _cache[23] || (_cache[23] = ($event) => $data.settingData.logourl = $event)
            }, null, 8, ["value"]),
            vue.createVNode(_component_MenuCreatereply, {
              sort: 2,
              value: $data.settingData.QuickReply,
              "onUpdate:value": _cache[24] || (_cache[24] = ($event) => $data.settingData.QuickReply = $event)
            }, null, 8, ["value"]),
            vue.createVNode(_component_MenuBlockuserlist, {
              sort: 3,
              value: $data.settingData.blockList,
              "onUpdate:value": _cache[25] || (_cache[25] = ($event) => $data.settingData.blockList = $event)
            }, null, 8, ["value"]),
            vue.createVNode(_component_MenuOtherCss, {
              sort: 4,
              value: $data.settingData.othercss,
              "onUpdate:value": _cache[26] || (_cache[26] = ($event) => $data.settingData.othercss = $event)
            }, null, 8, ["value"])
          ]),
          vue.createElementVNode("div", _hoisted_13, [
            vue.createVNode(_component_UserTags)
          ]),
          vue.createElementVNode("div", _hoisted_14, [
            vue.createVNode(_component_GPTconfig, {
              value: $data.settingData.gptdata,
              "onUpdate:value": _cache[27] || (_cache[27] = ($event) => $data.settingData.gptdata = $event)
            }, null, 8, ["value"])
          ])
        ]),
        vue.createElementVNode("div", _hoisted_15, [
          vue.createElementVNode("input", {
            type: "file",
            id: "fileInput",
            ref: "fileInput",
            style: { "display": "none" },
            accept: ".json",
            onChange: _cache[28] || (_cache[28] = (...args) => $options.handleFileUpload && $options.handleFileUpload(...args))
          }, null, 544),
          vue.createElementVNode("button", {
            class: "btn save",
            onClick: _cache[29] || (_cache[29] = (...args) => $options.save && $options.save(...args))
          }, "保存"),
          vue.createElementVNode("button", {
            class: "btn saveload",
            onClick: _cache[30] || (_cache[30] = (...args) => $options.saveload && $options.saveload(...args))
          }, "保存并刷新"),
          vue.createElementVNode("button", {
            class: "btn floorlottery",
            onClick: _cache[31] || (_cache[31] = (...args) => $options.openFloorlottery && $options.openFloorlottery(...args))
          }, "楼层抽奖"),
          _hoisted_16,
          vue.createElementVNode("button", {
            class: "btn import",
            onClick: _cache[32] || (_cache[32] = (...args) => $options.triggerFileInput && $options.triggerFileInput(...args))
          }, "导入"),
          vue.createElementVNode("button", {
            class: "btn export",
            onClick: _cache[33] || (_cache[33] = (...args) => $options.exportData && $options.exportData(...args))
          }, "导出")
        ])
      ]),
      vue.withDirectives(vue.createElementVNode("dialog", _hoisted_17, [
        _hoisted_18,
        vue.createElementVNode("div", _hoisted_19, [
          vue.withDirectives(vue.createElementVNode("input", {
            type: "text",
            "onUpdate:modelValue": _cache[34] || (_cache[34] = ($event) => $data.floorlotteryval1 = $event),
            placeholder: "请输入总数"
          }, null, 512), [
            [vue.vModelText, $data.floorlotteryval1]
          ]),
          vue.withDirectives(vue.createElementVNode("input", {
            type: "text",
            "onUpdate:modelValue": _cache[35] || (_cache[35] = ($event) => $data.floorlotteryval2 = $event),
            placeholder: "请输入抽取的数量"
          }, null, 512), [
            [vue.vModelText, $data.floorlotteryval2]
          ]),
          vue.createElementVNode("button", {
            type: "primary",
            onClick: _cache[36] || (_cache[36] = (...args) => $options.drawRandomNumbers && $options.drawRandomNumbers(...args))
          }, "开始抽奖"),
          vue.createElementVNode("button", {
            type: "primary",
            plain: "",
            onClick: _cache[37] || (_cache[37] = (...args) => $options.closelotter && $options.closelotter(...args))
          }, "关闭弹窗"),
          _hoisted_20,
          $data.floorlotterloading ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_21, "正在抽奖...")) : vue.createCommentVNode("", true),
          $data.floorlotterresult ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_22, " 抽奖结果：" + vue.toDisplayString($data.floorlotterresult), 1)) : vue.createCommentVNode("", true)
        ])
      ], 512), [
        [vue.vShow, $data.floorlotteryDialog]
      ]),
      vue.createVNode(_component_UsageTip),
      vue.createVNode(_component_ReplyTBEnjoy)
    ]);
  }
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
  const app = vue.createApp(App);
  app.mount(
    (() => {
      const appDiv = document.createElement("div");
      document.body.append(appDiv);
      return appDiv;
    })()
  );

})(Vue);