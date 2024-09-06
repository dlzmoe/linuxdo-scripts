// ==UserScript==
// @name         linuxdo 主题色 4
// @namespace    https://github.com/dlzmoe/linuxdo-scripts
// @version      0.0.0
// @description  切换论坛主题色
// @author       dlzmoe
// @match        *://linux.do/*
// @icon         https://cdn.linux.do/uploads/default/optimized/3X/9/d/9dd49731091ce8656e94433a26a3ef36062b3994_2_32x32.png
// @license      Apache-2.0 license
// ==/UserScript==

(function () {
  'use strict';
  window.addEventListener('load', function () {
    
$('body').append(`
<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/color_definitions_google-ai-for-developers_8_2_a146065001d103c6f508d0aecd9795e2b85e0231.css" media="all" rel="stylesheet" class="light-scheme">
<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/desktop_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="desktop">
<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/checklist_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="checklist">
<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-ai_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="discourse-ai">
<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-akismet_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="discourse-akismet">
<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-cakeday_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="discourse-cakeday">
<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-data-explorer_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="discourse-data-explorer">
<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-details_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="discourse-details">
<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-lazy-videos_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="discourse-lazy-videos">
<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-local-dates_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="discourse-local-dates">
<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-narrative-bot_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="discourse-narrative-bot">
<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-policy_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="discourse-policy">
<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-presence_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="discourse-presence">
<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-reactions_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="discourse-reactions">
<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-solved_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="discourse-solved">
<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-templates_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="discourse-templates">
<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-topic-voting_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="discourse-topic-voting">
<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/footnote_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="footnote">
<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/hosted-site_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="hosted-site">
<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/poll_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="poll">
<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/spoiler-alert_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="spoiler-alert">
<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-ai_desktop_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="discourse-ai_desktop">
<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-reactions_desktop_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="discourse-reactions_desktop">
<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-topic-voting_desktop_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="discourse-topic-voting_desktop">
<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/poll_desktop_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css" media="all" rel="stylesheet" data-target="poll_desktop">
<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/desktop_theme_4_89b44c1aa4a914829f5dab76be36f050017112fd.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="4" data-theme-name="discourse header search">
<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/desktop_theme_3_a8a980bc06c18d3fc858c318921f96f6581459cf.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="3" data-theme-name="discourse-material-icons">
<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/desktop_theme_9_ad782db09c6a21e86f43e7f9fbbaa30324037bf5.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="9" data-theme-name="global notice custom css">
<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/desktop_theme_8_878e84961d78833adf9238d6eda91eb9292d7ed3.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="8" data-theme-name="temp nav fixes">
<link href="https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/desktop_theme_2_c35f48dbd27cfaac6e78670aa85b8a0bd9a462fa.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="2" data-theme-name="google ai">
`)

  });
})();