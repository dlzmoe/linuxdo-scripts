// ==UserScript==
// @name         linuxdo 主题色 3
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
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css" media="all" rel="stylesheet" data-target="desktop">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/checklist_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css" media="all" rel="stylesheet" data-target="checklist">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-akismet_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css" media="all" rel="stylesheet" data-target="discourse-akismet">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-cakeday_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css" media="all" rel="stylesheet" data-target="discourse-cakeday">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-custom-topic-lists_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css" media="all" rel="stylesheet" data-target="discourse-custom-topic-lists">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-data-explorer_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css" media="all" rel="stylesheet" data-target="discourse-data-explorer">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-details_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css" media="all" rel="stylesheet" data-target="discourse-details">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-lazy-videos_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css" media="all" rel="stylesheet" data-target="discourse-lazy-videos">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-local-dates_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css" media="all" rel="stylesheet" data-target="discourse-local-dates">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-math_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css" media="all" rel="stylesheet" data-target="discourse-math">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-narrative-bot_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css" media="all" rel="stylesheet" data-target="discourse-narrative-bot">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-policy_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css" media="all" rel="stylesheet" data-target="discourse-policy">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-post-voting_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css" media="all" rel="stylesheet" data-target="discourse-post-voting">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-presence_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css" media="all" rel="stylesheet" data-target="discourse-presence">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-preset-topic-composer_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css" media="all" rel="stylesheet" data-target="discourse-preset-topic-composer">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-reactions_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css" media="all" rel="stylesheet" data-target="discourse-reactions">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-rss-polling_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css" media="all" rel="stylesheet" data-target="discourse-rss-polling">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-signatures_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css" media="all" rel="stylesheet" data-target="discourse-signatures">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-solved_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css" media="all" rel="stylesheet" data-target="discourse-solved">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-templates_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css" media="all" rel="stylesheet" data-target="discourse-templates">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-user-notes_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css" media="all" rel="stylesheet" data-target="discourse-user-notes">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/footnote_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css" media="all" rel="stylesheet" data-target="footnote">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/hosted-site_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css" media="all" rel="stylesheet" data-target="hosted-site">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/poll_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css" media="all" rel="stylesheet" data-target="poll">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/spoiler-alert_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css" media="all" rel="stylesheet" data-target="spoiler-alert">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-post-voting_desktop_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css" media="all" rel="stylesheet" data-target="discourse-post-voting_desktop">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/discourse-reactions_desktop_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css" media="all" rel="stylesheet" data-target="discourse-reactions_desktop">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/poll_desktop_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css" media="all" rel="stylesheet" data-target="poll_desktop">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_21_7ad18baff84d86d2854bef0ea3531d2b132f80e7.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="21" data-theme-name="category badge styles">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_43_3f15e2f66fc3e5c3aebf2b816db682ffddd62aec.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="43" data-theme-name="category banners">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_44_76340a944941297c187ed34184cc60417a9431da.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="44" data-theme-name="category icons">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_41_5dae38cddbdae9477debd421890ea804b79ec6bb.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="41" data-theme-name="collapsible category groups">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_2_7e9be53a9033f4321fe3ff84ac7ac5916c6f7422.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="2" data-theme-name="dark-light toggle">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_14_11cc9920871247240c539d33b999ff8565c0528e.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="14" data-theme-name="discotoc">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_22_60ced06ad2f59e47b7897d05ee076d301232f5fd.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="22" data-theme-name="discourse-icon">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_13_56d83ffa5ca70edecf74b36d321e04576f4ef1b8.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="13" data-theme-name="discourse-mermaid-theme-component">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_6_953aa87e9ac9cc51e20305e98e782fbec1b0decd.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="6" data-theme-name="discourse-search-banner">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_45_726192e6534fe4d91047ee004c17310f78672e52.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="45" data-theme-name="experimental filter component">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_46_07c0c0f168d9030b56037a94a177640f8e52ed4a.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="46" data-theme-name="full width">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_15_f7eb451c3ff264d93f495b3d6fac50216f49e72d.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="15" data-theme-name="image comparison slider">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_16_5b0101e1835bb5a0e53726e669f272edb9d23bbd.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="16" data-theme-name="pdf previews">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_48_e048fdfd4a9755e059453bb30952ad45bf05e097.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="48" data-theme-name="tag icons">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_17_91ca32199f3209aafcae04ddf03498ed470c69f1.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="17" data-theme-name="tiles - gallery component">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_18_0559ffde96204857d0ebc8c686798e0873b0c584.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="18" data-theme-name="topic thumbnails">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_28_1fc38880197870acc63fb0a16acf5aced129415b.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="28" data-theme-name="unformatted code detector">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_49_b140cc9a50e4dd4d7f5154a7adfd1c85c59e3b63.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="49" data-theme-name="unity: brand identity">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_25_30313f97df8e6b00d3ee8693aa3671cce7c9919a.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="25" data-theme-name="unity: dsa">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_12_132a4fbaac41ffa5dd9101b35885f1a153acdbc5.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="12" data-theme-name="unity: onetrust">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_50_cb48ef097d7269de9b930e7a46b126ce5b9df9e4.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="50" data-theme-name="unity: theme extras">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_10_36ca6f6783651cde9551aca71e209742439766d4.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="10" data-theme-name="unity">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_51_285c9656e620803a07e356ce8cb738d955d8ad2d.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="51" data-theme-name="hotfix: restyle experimental topic summary">
<link href="https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_24_5c1029e2582d7c1b73ef31e86f4ea0f297bd8a06.css" media="all" rel="stylesheet" data-target="desktop_theme" data-theme-id="24" data-theme-name="override-mermaid-styles">
`)

  });
})();