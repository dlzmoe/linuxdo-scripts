// ==UserScript==
// @name         linuxdo 主题色 2
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
<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/color_definitions_hf-light_3_4_e9f0e3d0b716595aad22a8443d01cdbaf9dff610.css" media="all" rel="stylesheet" class="light-scheme"><link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/color_definitions_hf-dark_4_4_a909a408a44c8e15765a6792c5aa2abab3fbfdfc.css" media="(prefers-color-scheme: dark)" rel="stylesheet" class="dark-scheme">
<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/desktop_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css" media="all" rel="stylesheet" data-target="desktop">
<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/checklist_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css" media="all" rel="stylesheet" data-target="checklist">
<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-adplugin_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css" media="all" rel="stylesheet" data-target="discourse-adplugin">
<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-ai_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css" media="all" rel="stylesheet" data-target="discourse-ai">
<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-akismet_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css" media="all" rel="stylesheet" data-target="discourse-akismet">
<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-cakeday_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css" media="all" rel="stylesheet" data-target="discourse-cakeday">
<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-details_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css" media="all" rel="stylesheet" data-target="discourse-details">
<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-lazy-videos_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css" media="all" rel="stylesheet" data-target="discourse-lazy-videos">
<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-local-dates_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css" media="all" rel="stylesheet" data-target="discourse-local-dates">
<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-math_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css" media="all" rel="stylesheet" data-target="discourse-math">
<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-narrative-bot_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css" media="all" rel="stylesheet" data-target="discourse-narrative-bot">
<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-policy_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css" media="all" rel="stylesheet" data-target="discourse-policy">
<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-presence_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css" media="all" rel="stylesheet" data-target="discourse-presence">
<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-reactions_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css" media="all" rel="stylesheet" data-target="discourse-reactions">
<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-solved_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css" media="all" rel="stylesheet" data-target="discourse-solved">
<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-templates_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css" media="all" rel="stylesheet" data-target="discourse-templates">
<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-topic-voting_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css" media="all" rel="stylesheet" data-target="discourse-topic-voting">
<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/footnote_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css" media="all" rel="stylesheet" data-target="footnote">
<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/hosted-site_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css" media="all" rel="stylesheet" data-target="hosted-site">
<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/poll_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css" media="all" rel="stylesheet" data-target="poll">
<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/spoiler-alert_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css" media="all" rel="stylesheet" data-target="spoiler-alert">
<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-ai_desktop_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css" media="all" rel="stylesheet" data-target="discourse-ai_desktop">
<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-reactions_desktop_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css" media="all" rel="stylesheet" data-target="discourse-reactions_desktop">
<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-topic-voting_desktop_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css" media="all" rel="stylesheet" data-target="discourse-topic-voting_desktop">
<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/poll_desktop_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css" media="all" rel="stylesheet" data-target="poll_desktop">
<link href="https://sea2.discourse-cdn.com/hellohellohello/stylesheets/desktop_theme_4_dc1402c93670f70f3de138ee4819934dae9704d0.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="4" data-theme-name="discourse-huggingface-theme">
`)

  });
})();