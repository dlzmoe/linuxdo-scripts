// ==UserScript==
// @name         linuxdo 主题色 5
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
<link href="https://forum.ksec.co.uk/stylesheets/color_definitions_light_7_2_5186d2d3066aedb3bfcac1027d47b8b0b5350afb.css" media="all" rel="stylesheet" class="light-scheme"><link href="https://forum.ksec.co.uk/stylesheets/color_definitions_dark_1_2_a0603164c6b779ba925871d7963187c6a6dfa8d0.css" media="(prefers-color-scheme: dark)" rel="stylesheet" class="dark-scheme">
<link href="https://forum.ksec.co.uk/stylesheets/desktop_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="desktop">
<link href="https://forum.ksec.co.uk/stylesheets/checklist_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="checklist">
<link href="https://forum.ksec.co.uk/stylesheets/discourse-ai_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="discourse-ai">
<link href="https://forum.ksec.co.uk/stylesheets/discourse-akismet_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="discourse-akismet">
<link href="https://forum.ksec.co.uk/stylesheets/discourse-cakeday_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="discourse-cakeday">
<link href="https://forum.ksec.co.uk/stylesheets/discourse-details_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="discourse-details">
<link href="https://forum.ksec.co.uk/stylesheets/discourse-gamification_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="discourse-gamification">
<link href="https://forum.ksec.co.uk/stylesheets/discourse-lazy-videos_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="discourse-lazy-videos">
<link href="https://forum.ksec.co.uk/stylesheets/discourse-local-dates_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="discourse-local-dates">
<link href="https://forum.ksec.co.uk/stylesheets/discourse-narrative-bot_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="discourse-narrative-bot">
<link href="https://forum.ksec.co.uk/stylesheets/discourse-presence_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="discourse-presence">
<link href="https://forum.ksec.co.uk/stylesheets/discourse-reactions_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="discourse-reactions">
<link href="https://forum.ksec.co.uk/stylesheets/discourse-rss-polling_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="discourse-rss-polling">
<link href="https://forum.ksec.co.uk/stylesheets/docker_manager_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="docker_manager">
<link href="https://forum.ksec.co.uk/stylesheets/footnote_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="footnote">
<link href="https://forum.ksec.co.uk/stylesheets/poll_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="poll">
<link href="https://forum.ksec.co.uk/stylesheets/spoiler-alert_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="spoiler-alert">
<link href="https://forum.ksec.co.uk/stylesheets/discourse-ai_desktop_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="discourse-ai_desktop">
<link href="https://forum.ksec.co.uk/stylesheets/discourse-gamification_desktop_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="discourse-gamification_desktop">
<link href="https://forum.ksec.co.uk/stylesheets/discourse-reactions_desktop_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="discourse-reactions_desktop">
<link href="https://forum.ksec.co.uk/stylesheets/poll_desktop_1f2801adf122e33ac71771f0a0d92bf223707572.css" media="all" rel="stylesheet" data-target="poll_desktop">
<link href="https://forum.ksec.co.uk/stylesheets/desktop_theme_4_51fe4f92f85e2ddf8cb2ac39b3f18429f14452c8.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="4" data-theme-name="discourse clickable topic">
<link href="https://forum.ksec.co.uk/stylesheets/desktop_theme_6_003073d7e039da7d37eb1e79b3772306ac8657f4.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="6" data-theme-name="discourse-gifs">
<link href="https://forum.ksec.co.uk/stylesheets/desktop_theme_5_ce3252be82b7db613c78ea4f283dcf17abe51741.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="5" data-theme-name="discourse-search-banner">
<link href="https://forum.ksec.co.uk/stylesheets/desktop_theme_9_12b3533905718e859faa16d62a11c119e4d64875.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="9" data-theme-name="icon header links">
<link href="https://forum.ksec.co.uk/stylesheets/desktop_theme_3_28ffee2ef9ff10c2ad27c49227f68bb1da72a779.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="3" data-theme-name="modern category + group boxes">
<link href="https://forum.ksec.co.uk/stylesheets/desktop_theme_2_dd1b36aa59bc2c658ff7a7825007d31f580dab8b.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="2" data-theme-name="air theme">
<link href="https://forum.ksec.co.uk/stylesheets/desktop_theme_11_f4cc23465e9e5bf8d991504b6106825edc03c16a.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="11" data-theme-name="custom css &amp; html">
`)

  });
})();