// ==UserScript==
// @name         linuxdo 主题色 6
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
<link href="https://thepros.get.it/stylesheets/color_definitions_get-it-light_11_2_ee762a2dd28c63827357489083590cecd6db9323.css" media="all" rel="stylesheet" class="light-scheme"><link href="https://thepros.get.it/stylesheets/color_definitions_dark_1_2_09865b07ec4b67b9401e67edb03a78a33aadf245.css" media="(prefers-color-scheme: dark)" rel="stylesheet" class="dark-scheme">
<link href="https://thepros.get.it/stylesheets/desktop_7c3d1efacb3c0d0d50e7279609b75879527a37ad.css" media="all" rel="stylesheet" data-target="desktop">
<link href="https://thepros.get.it/stylesheets/chat_7c3d1efacb3c0d0d50e7279609b75879527a37ad.css" media="all" rel="stylesheet" data-target="chat">
<link href="https://thepros.get.it/stylesheets/checklist_7c3d1efacb3c0d0d50e7279609b75879527a37ad.css" media="all" rel="stylesheet" data-target="checklist">
<link href="https://thepros.get.it/stylesheets/discourse-details_7c3d1efacb3c0d0d50e7279609b75879527a37ad.css" media="all" rel="stylesheet" data-target="discourse-details">
<link href="https://thepros.get.it/stylesheets/discourse-lazy-videos_7c3d1efacb3c0d0d50e7279609b75879527a37ad.css" media="all" rel="stylesheet" data-target="discourse-lazy-videos">
<link href="https://thepros.get.it/stylesheets/discourse-local-dates_7c3d1efacb3c0d0d50e7279609b75879527a37ad.css" media="all" rel="stylesheet" data-target="discourse-local-dates">
<link href="https://thepros.get.it/stylesheets/discourse-narrative-bot_7c3d1efacb3c0d0d50e7279609b75879527a37ad.css" media="all" rel="stylesheet" data-target="discourse-narrative-bot">
<link href="https://thepros.get.it/stylesheets/discourse-presence_7c3d1efacb3c0d0d50e7279609b75879527a37ad.css" media="all" rel="stylesheet" data-target="discourse-presence">
<link href="https://thepros.get.it/stylesheets/docker_manager_7c3d1efacb3c0d0d50e7279609b75879527a37ad.css" media="all" rel="stylesheet" data-target="docker_manager">
<link href="https://thepros.get.it/stylesheets/footnote_7c3d1efacb3c0d0d50e7279609b75879527a37ad.css" media="all" rel="stylesheet" data-target="footnote">
<link href="https://thepros.get.it/stylesheets/poll_7c3d1efacb3c0d0d50e7279609b75879527a37ad.css" media="all" rel="stylesheet" data-target="poll">
<link href="https://thepros.get.it/stylesheets/spoiler-alert_7c3d1efacb3c0d0d50e7279609b75879527a37ad.css" media="all" rel="stylesheet" data-target="spoiler-alert">
<link href="https://thepros.get.it/stylesheets/chat_desktop_7c3d1efacb3c0d0d50e7279609b75879527a37ad.css" media="all" rel="stylesheet" data-target="chat_desktop">
<link href="https://thepros.get.it/stylesheets/poll_desktop_7c3d1efacb3c0d0d50e7279609b75879527a37ad.css" media="all" rel="stylesheet" data-target="poll_desktop">
<link href="https://thepros.get.it/stylesheets/desktop_theme_4_b593f6a33945d84e8923041356dbae20f78de862.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="4" data-theme-name="clickable topic">
<link href="https://thepros.get.it/stylesheets/desktop_theme_3_d0247eb7936be09a3ee02299f743974ceebc1031.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="3" data-theme-name="modern category + group boxes">
<link href="https://thepros.get.it/stylesheets/desktop_theme_5_7bc2214caaf0db1a71f3fd05dc0fb629f55ac150.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="5" data-theme-name="search banner">
<link href="https://thepros.get.it/stylesheets/desktop_theme_2_381e73ac5235cf49a7c855137e4af4cc4d4a80ef.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="2" data-theme-name="air theme">
`)

  });
})();