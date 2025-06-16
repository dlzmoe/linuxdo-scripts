<template>
  <div>
    <div class="el-button" @click="togglePopupSize" title="等级查询">
      <span>等级</span>
    </div>
    <div v-if="!isMinimized" id="linuxDoLevelPopupContent">
      <div v-html="content"></div>
      <input v-model="username" autocomplete="off" type="text" placeholder="请输入用户名..." id="linuxDoUserSearch" />
      <button @click="handleSearch" class="btn btn-icon-text" type="button">
        <span class="d-button-label">搜索</span>
      </button>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
export default {
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
        4: "领导者",
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
          time_read: 3600,
        },
        2: {
          days_visited: 50,
          likes_given: 30,
          likes_received: 20,
          post_count: 10,
          topics_entered: 0,
          posts_read_count: 0,
        },
      },
    };
  },
  methods: {
    async fetchAboutData() {
      try {
        const baseUrl = window.location.origin;
        const response = await fetch(`${baseUrl}/about.json`, {
          headers: {
            Accept: "application/json",
            "User-Agent": "Mozilla/5.0",
          },
          method: "GET",
        });
        if (!response.ok)
          throw new Error(`HTTP 错误！状态：${response.status}`);
        return await response.json();
      } catch (error) {
        console.error("获取关于页面数据失败：", error);
        this.displayError("获取关于页面数据失败");
        return null;
      }
    },
    async fetchUserData(username) {
      try {
        const baseUrl = window.location.origin;
        const response = await fetch(`${baseUrl}/u/${username}/summary.json`, {
          headers: {
            Accept: "application/json",
            "User-Agent": "Mozilla/5.0",
          },
          method: "GET",
        });
        if (!response.ok)
          throw new Error(`HTTP 错误！状态：${response.status}`);
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
        let content = `<strong>信任等级：</strong>${this.levelDescriptions[user.trust_level]
          }<br><strong>升级进度：</strong><br>`;

        if (user.trust_level === 3) {
          content += `联系管理员以升级到领导者<br>`;
        } else if (user.trust_level === 4) {
          content += `您已是最高信任等级<br>`;
        } else {
          const requirements = this.levelRequirements[user.trust_level];
          if (user.trust_level === 2) {
            requirements.posts_read_count = Math.min(
              Math.floor(status.posts_30_days / 4),
              20000
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
        time_read: "阅读时间",
      };

      return translations[stat] || stat;
    },
  },
  created() {
    setInterval(() => {
      if (!this.username) {
        const avatarImg = $("#toggle-current-user img.avatar");
        const src = avatarImg.length ? avatarImg.attr("src") : null;
        if (src) {
          const match = src.match(/\/user_avatar\/linux\.do\/([^\/]+)/);
          if (match && match[1]) {
            this.username = match[1];
          }
        }
      }
    }, 1000);
  },
};
</script>

<style scoped lang="less">
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(var(--primary-rgb), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0);
  }
}

.minimized {
  width: 50px !important;
  height: 50px !important;
  border-radius: 50% !important;
  padding: 0 !important;
  overflow: hidden;
  cursor: pointer;
  animation: pulse 2s infinite;
}

#linuxDoLevelPopupContent {
  line-height: 1.6;
  position: fixed;
  bottom: 20px;
  right: 90px;
  width: 300px;
  height: auto;
  background-color: var(--secondary);
  padding: 20px;
  z-index: 10000;
  font-size: 14px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.3s ease-out;
  border: 1px solid var(--primary-low);
  box-sizing: border-box;

  *{
    box-sizing: border-box;
  }

  strong {
    color: var(--primary);
    font-weight: 600;
  }
}

#linuxDoUserSearch {
  width: 100%;
  margin-top: 15px;
  padding: 10px 12px;
  border: 2px solid var(--primary-low);
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
  }
}

.btn {
  width: 100%;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-medium) 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(var(--primary-rgb), 0.2);
  position: relative;
  overflow: hidden;
  margin-top: 10px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(var(--primary-rgb), 0.3);
    
    &::before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 10px rgba(var(--primary-rgb), 0.2);
  }
  
  .d-button-label {
    position: relative;
    z-index: 1;
  }
}

.minimize-button {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10001;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 50%;
  text-align: center;
  line-height: 32px;
  width: 32px;
  height: 32px;
  color: var(--primary);
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--primary-low);
  }
}
</style>
