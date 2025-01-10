// ==UserScript==
// @name        L 站 2024 年度总结
// @namespace   https://github.com/dlzmoe/linuxdo-scripts
// @match       https://linux.do/*
// @grant       none
// @version     1.0
// @author      dlzmoe
// ==/UserScript==

(function () {
  'use strict';
  var myusername = "anghunk";
  
  $('head').append(`<style>.annualsummary{position:fixed;left:0;top:0;height:100vh;overflow-y:auto;width:500px;z-index:99999}</style>`)
  fetch(`https://linux.do/u/${myusername}/summary.json`)
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem('2024summary', JSON.stringify(data));
    })
    .catch((error) => {
      console.log(error)
    });
  fetch(`https://linux.do/u/about.json`)
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem('2024about', JSON.stringify(data));
    })
    .catch((error) => {
      console.log(error)
    });
  fetch(`https://linux.do/u/${myusername}.json`)
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem('2024name', JSON.stringify(data));
    })
    .catch((error) => {
      console.log(error)
    });

  $('body').append(`
   <div class="annualsummary">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1300">
      <!-- 背景渐变定义 -->
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#2d5873;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1c3d53;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="valueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#2c3e50;stop-opacity:0.95" />
          <stop offset="100%" style="stop-color:#34495e;stop-opacity:0.95" />
        </linearGradient>
        <linearGradient id="footprintGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#2b5876;stop-opacity:0.95" />
          <stop offset="100%" style="stop-color:#4e4376;stop-opacity:0.95" />
        </linearGradient>
        <linearGradient id="friendsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#373B44;stop-opacity:0.95" />
          <stop offset="100%" style="stop-color:#4286f4;stop-opacity:0.95" />
        </linearGradient>
      </defs>

      <!-- 主背景 -->
      <rect width="800" height="1200" fill="url(#bgGradient)"/>

      <!-- 标题区域 - 日期颜色更改为亮橙色 -->
      <text x="400" y="80" fill="#ffcc55" font-size="32" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold">你的 2024 Linux.do 故事</text>
      <text x="400" y="120" fill="#98c1d9" font-size="20" text-anchor="middle" font-family="Arial, sans-serif">从<tspan fill="#ff9966"> ${JSON.parse(localStorage.getItem('2024name')).user.created_at.slice(0, 10)} </tspan>起，我们已经一起度过了<tspan fill="#ff9966"> ${JSON.parse(localStorage.getItem('2024summary')).user_summary.days_visited} </tspan>个日夜</text>

      <!-- 社区价值卡片 -->
      <g transform="translate(50, 160)">
        <rect width="700" height="240" rx="15" fill="url(#valueGradient)"/>
        <text x="350" y="40" fill="#64ffda" font-size="22" text-anchor="middle" font-weight="bold">✨ 闪耀时刻 ✨</text>

        <!-- 左侧数据 - 数字改为金色 -->
        <g transform="translate(50, 80)">
          <text x="0" y="0" fill="#98c1d9" font-size="16">你共创建了<tspan fill="#ffd700" font-size="24"> ${JSON.parse(localStorage.getItem('2024summary')).user_summary.topic_count} </tspan> 个有趣话题</text>
          <text x="0" y="30" fill="#98c1d9" font-size="20">超过 <tspan fill="#ffd700" font-size="24"> ${JSON.parse(localStorage.getItem('2024summary')).user_summary.post_count} </tspan> 次社区互动</text>
          <text x="0" y="60" fill="#98c1d9" font-size="16">收获 <tspan fill="#ffd700" font-size="24"> ${JSON.parse(localStorage.getItem('2024summary')).user_summary.likes_received} </tspan> 次佬友点赞</text>
          <text x="0" y="90" fill="#98c1d9" font-size="20">累计 <tspan fill="#ffd700" font-size="24"> ${JSON.parse(localStorage.getItem('2024name')).user.gamification_score} </tspan> 点社区点数</text>
        </g>

        <!-- 右侧数据 -->
        <g transform="translate(380, 80)">
          <text x="0" y="0" fill="#98c1d9" font-size="16">这一年里，你为社区贡献了</text>
          <text x="0" y="30" fill="#98c1d9" font-size="20">精心编写的 <tspan fill="#ffd700" font-size="24" font-weight="bold">${JSON.parse(localStorage.getItem('2024summary')).user_summary.solved_count}</tspan> 个解决方案</text>
          <text x="0" y="60" fill="#98c1d9" font-size="16">帮助无数 L 站佬友解决难题</text>
          <text x="0" y="90" fill="#98c1d9" font-size="16">吸引了 <tspan fill="#ffd700" font-size="24">${JSON.parse(localStorage.getItem('2024name')).user.total_followers}</tspan> 位佬友的关注</text>
        </g>
      </g>

      <!-- 社区足迹卡片 -->
      <g transform="translate(50, 450)">
        <rect width="700" height="280" rx="15" fill="url(#footprintGradient)"/>
        <text x="350" y="40" fill="#7ee8fa" font-size="22" text-anchor="middle" font-weight="bold">🌟 成长印记 🌟</text>
        <g transform="translate(50, 80)">
          <text x="0" y="0" fill="#98c1d9" font-size="16">在过去的 <tspan fill="#ffd700"> ${JSON.parse(localStorage.getItem('2024summary')).user_summary.days_visited} </tspan> 天里</text>
          <text x="0" y="30" fill="#98c1d9" font-size="20">你累计花费了 <tspan fill="#ffd700" font-size="24">${(JSON.parse(localStorage.getItem('2024summary')).user_summary.time_read / 86400).toFixed(2)} </tspan> 天的时光畅游技术海洋</text>
          <text x="0" y="60" fill="#98c1d9" font-size="16">浏览了 <tspan fill="#ffd700">${JSON.parse(localStorage.getItem('2024summary')).user_summary.topics_entered} </tspan> 个精彩话题，阅读了 <tspan fill="#ffd700">${JSON.parse(localStorage.getItem('2024summary')).user_summary.posts_read_count} </tspan>篇帖子</text>
        </g>

        <g transform="translate(50, 180)">
          <text x="0" y="0" fill="#98c1d9" font-size="16">你最喜欢的板块是<tspan fill="#ffd700" font-size="24" font-weight="bold"> ${JSON.parse(localStorage.getItem('2024summary')).user_summary.top_categories[0].name} </tspan>，</text>
          <text x="0" y="30" fill="#98c1d9" font-size="20">与佬友们分享了 <tspan fill="#ffd700" font-size="24">${JSON.parse(localStorage.getItem('2024summary')).user_summary.top_categories[0].post_count} </tspan> 次互动</text>
          <text x="0" y="60" fill="#98c1d9" font-size="16">其次是${JSON.parse(localStorage.getItem('2024summary')).user_summary.top_categories[1].name}，参与了 <tspan fill="#ffd700">${JSON.parse(localStorage.getItem('2024summary')).user_summary.top_categories[1].post_count} </tspan> 次讨论</text>
        </g>
      </g>

      <!-- 互动卡片 -->
      <g transform="translate(50, 770)">
        <rect width="700" height="200" rx="15" fill="url(#friendsGradient)"/>
        <text x="350" y="40" fill="#a0e9ff" font-size="22" text-anchor="middle" font-weight="bold">🤝 佬友相伴 🤝</text>
        <g transform="translate(50, 80)">
          <text x="0" y="0" fill="#98c1d9" font-size="16">最常与你互动的是<tspan fill="#ffd700" font-size="24" font-weight="bold"> ${JSON.parse(localStorage.getItem('2024summary')).user_summary.most_replied_to_users[0].name} </tspan>，</text>
          <text x="0" y="30" fill="#98c1d9" font-size="20">你们进行了 <tspan fill="#ffd700" font-size="24">${JSON.parse(localStorage.getItem('2024summary')).user_summary.most_replied_to_users[0].count}</tspan> 次精彩对话</text>
          <text x="0" y="60" fill="#98c1d9" font-size="16">而 <tspan fill="#ffd700" font-size="24">${JSON.parse(localStorage.getItem('2024summary')).user_summary.most_liked_by_users[0].name}</tspan> 给予了你最多认可：<tspan fill="#ffd700">${JSON.parse(localStorage.getItem('2024summary')).user_summary.most_liked_by_users[0].count}</tspan> 个赞</text>
          <text x="0" y="90" fill="#98c1d9" font-size="16">你也为 <tspan fill="#ffd700" font-size="24">${JSON.parse(localStorage.getItem('2024summary')).user_summary.most_liked_users[0].name} </tspan>的分享送出了 <tspan fill="#ffd700">${JSON.parse(localStorage.getItem('2024summary')).user_summary.most_liked_users[0].count}</tspan> 个赞</text>
        </g>
      </g>

      <!-- 年度寄语 -->
      <g transform="translate(50, 1000)">
        <rect width="700" height="110" rx="15" fill="url(#valueGradient)"/>
        <text x="350" y="40" fill="#98c1d9" font-size="20" text-anchor="middle" font-family="Arial, sans-serif">🔥 感谢你为社区带来的每一份贡献  🔥</text>
        <text x="350" y="70" fill="#98d2ee" font-size="18" text-anchor="middle" font-family="Arial, sans-serif">愿在新的一年，我们继续在技术的海洋中携手成长！</text>
        <text x="350" y="100" fill="#98e3ff" font-size="18" text-anchor="middle" font-family="Arial, sans-serif"><tspan fill="#ffa300" font-weight="bold">真诚、友善、团结、专业</tspan> ，共建你我引以为荣之社区。</text>
      </g>

      <!-- 版权信息 -->
      <text x="400" y="1150" fill="#98c1d9" font-size="14" text-anchor="middle" font-family="Arial, sans-serif">© 2024 Linux.do All Rights Reserved</text>
    </svg>
  </div>
  `)
})();