// ==UserScript==
// @name         linuxdo 主题色 1
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
<link href="https://forum.godotengine.org/stylesheets/color_definitions_godot-light_14_5_bfb37f9ae1fb41e9775aafca6e20cddcf38a5ef5.css" media="all" rel="stylesheet" class="light-scheme">
<link href="https://forum.godotengine.org/stylesheets/color_definitions_godot-dark_15_5_5ddd0db082f3ae82a3ba77b0ccd1e9a549731798.css" media="(prefers-color-scheme: dark)" rel="stylesheet" class="dark-scheme">
<link href="https://forum.godotengine.org/stylesheets/desktop_6551c8b35c64f23dde7a58f9883f833dcb41d6c2.css" media="all" rel="stylesheet" data-target="desktop">
<link href="https://forum.godotengine.org/stylesheets/checklist_6551c8b35c64f23dde7a58f9883f833dcb41d6c2.css" media="all" rel="stylesheet" data-target="checklist">
<link href="https://forum.godotengine.org/stylesheets/discourse-details_6551c8b35c64f23dde7a58f9883f833dcb41d6c2.css" media="all" rel="stylesheet" data-target="discourse-details">
<link href="https://forum.godotengine.org/stylesheets/discourse-lazy-videos_6551c8b35c64f23dde7a58f9883f833dcb41d6c2.css" media="all" rel="stylesheet" data-target="discourse-lazy-videos">
<link href="https://forum.godotengine.org/stylesheets/discourse-local-dates_6551c8b35c64f23dde7a58f9883f833dcb41d6c2.css" media="all" rel="stylesheet" data-target="discourse-local-dates">
<link href="https://forum.godotengine.org/stylesheets/discourse-narrative-bot_6551c8b35c64f23dde7a58f9883f833dcb41d6c2.css" media="all" rel="stylesheet" data-target="discourse-narrative-bot">
<link href="https://forum.godotengine.org/stylesheets/discourse-presence_6551c8b35c64f23dde7a58f9883f833dcb41d6c2.css" media="all" rel="stylesheet" data-target="discourse-presence">
<link href="https://forum.godotengine.org/stylesheets/discourse-solved_6551c8b35c64f23dde7a58f9883f833dcb41d6c2.css" media="all" rel="stylesheet" data-target="discourse-solved">
<link href="https://forum.godotengine.org/stylesheets/docker_manager_6551c8b35c64f23dde7a58f9883f833dcb41d6c2.css" media="all" rel="stylesheet" data-target="docker_manager">
<link href="https://forum.godotengine.org/stylesheets/footnote_6551c8b35c64f23dde7a58f9883f833dcb41d6c2.css" media="all" rel="stylesheet" data-target="footnote">
<link href="https://forum.godotengine.org/stylesheets/poll_6551c8b35c64f23dde7a58f9883f833dcb41d6c2.css" media="all" rel="stylesheet" data-target="poll">
<link href="https://forum.godotengine.org/stylesheets/spoiler-alert_6551c8b35c64f23dde7a58f9883f833dcb41d6c2.css" media="all" rel="stylesheet" data-target="spoiler-alert">
<link href="https://forum.godotengine.org/stylesheets/poll_desktop_6551c8b35c64f23dde7a58f9883f833dcb41d6c2.css" media="all" rel="stylesheet" data-target="poll_desktop">
<link href="https://forum.godotengine.org/stylesheets/desktop_theme_9_818c40f50955dc75b8ee82ebc6b63677c57bad1a.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="9" data-theme-name="custom header links">
<link href="https://forum.godotengine.org/stylesheets/desktop_theme_3_da63025974d890f429338f0221ce160e14b07fc7.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="3" data-theme-name="godot tweaks">
<link href="https://forum.godotengine.org/stylesheets/desktop_theme_12_279dc32ddce5227f4513713baa0e0caf3dc6f846.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="12" data-theme-name="post badges">
<link href="https://forum.godotengine.org/stylesheets/desktop_theme_7_b736b09c69b69b5359282426c2559c196e5d619e.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="7" data-theme-name="search banner">
<link href="https://forum.godotengine.org/stylesheets/desktop_theme_5_73982ca8b55af63e007c66d4bd9ddc7af40f0b7f.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="5" data-theme-name="godot theme">
`)

  });
})();