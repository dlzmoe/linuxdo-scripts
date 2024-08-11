<template>
  <div>
    <el-button
      type="primary"
      @click="togglePopupSize"
      :class="['linuxDoLevelPopup', isMinimized ? 'minimized' : '']"
      title="等级查询"
    >
      <span>等级</span>
    </el-button>
    <div v-if="!isMinimized" id="linuxDoLevelPopupContent">
      <div v-html="content"></div>
      <input
        v-model="username"
        autocomplete="off"
        type="text"
        placeholder="请输入用户名..."
        id="linuxDoUserSearch"
      />
      <button @click="handleSearch" class="btn btn-icon-text" type="button">
        <span class="d-button-label">搜索</span>
      </button>
    </div>
  </div>
</template>

<script>
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
        const response = await fetch("https://linux.do/about.json", {
          headers: {
            Accept: "application/json",
            "User-Agent": "Mozilla/5.0",
          },
          method: "GET",
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
        const response = await fetch(`https://linux.do/u/${username}/summary.json`, {
          headers: {
            Accept: "application/json",
            "User-Agent": "Mozilla/5.0",
          },
          method: "GET",
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
        let content = `<strong>信任等级：</strong>${
          this.levelDescriptions[user.trust_level]
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
    const src = $(".d-header-icons .icon img.avatar").attr("src");
    const match = src.match(/\/user_avatar\/linux\.do\/([^\/]+)/);

    if (match && match[1]) {
      this.username = match[1];
    }
  },
};
</script>

<style scoped lang="less">
@keyframes breathAnimation {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
  }
}

.breath-animation {
  animation: breathAnimation 4s ease-in-out infinite;
}

.minimized {
  width: 50px !important;
  height: 50px !important;
  border-radius: 50% !important;
  padding: 0 !important;
  overflow: hidden;
  cursor: pointer;
}

.button:hover {
  background-color: #f0f0f0;
}

#linuxDoLevelPopupContent {
  line-height: 1.6;
  position: fixed;
  bottom: 20px;
  right: 90px;
  width: 250px;
  height: auto;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  padding: 15px;
  z-index: 10000;
  font-size: 14px;
  border-radius: 5px;
}

#linuxDoUserSearch {
  width: 100%;
  margin-top: 10px;
}

.button {
  margin-top: 10px;
}

.minimize-button {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 10001;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 50%;
  text-align: center;
  line-height: 40px;
  width: 40px;
  height: 40px;
}

.dark-theme {
  #linuxDoLevelPopupContent {
    background: #535353;
  }
}
</style>
