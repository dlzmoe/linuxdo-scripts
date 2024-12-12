<template>
  <div
    class="el-button"
    style="font-size: 18px"
    @click="handleSummary"
    type="primary"
    title="AI总结此帖子"
  >
    <svg
      class="fa d-icon d-icon-discourse-sparkles svg-icon svg-string"
      xmlns="http://www.w3.org/2000/svg"
    >
      <use href="#discourse-sparkles"></use>
    </svg>
  </div>
</template>

<script>
import { marked } from "marked";

export default {
  data() {
    return {
      isLoading: false,
      currentPage: 1,
      hasMoreComments: true,
      allContent: "",
    };
  },

  mounted() {
    // 检查配置并添加按钮
    const config = JSON.parse(localStorage.getItem("linxudoscriptssetting"))?.gptdata;
    if (config?.value1) {
      this.initSummaryButton();
    }
  },

  methods: {
    initSummaryButton() {
      setInterval(() => {
        if ($(".gpt-summary-wrap").length < 1 && $(".aicreated-btn").length < 1) {
          $("#topic-title").after(
            `<button class="aicreated-btn" type="button">AI 总结</button>`
          );
          $(".aicreated-btn").click(() => {
            $(".gpt-summary-wrap").remove();
            this.handleSummary();
          });
        }
      }, 1000);

      // 从缓存加载总结
      this.loadCachedSummary();
    },

    loadCachedSummary() {
      setInterval(() => {
        if ($(".post-stream").length > 0 && $(".gpt-summary-wrap").length < 1) {
          let summaryCache = JSON.parse(localStorage.getItem("summaryCacheData")) || [];
          const topicUrl = window.location.href.match(/^(https:\/\/linux\.do\/t\/topic\/\d+)/)?.[1];

          if (topicUrl) {
            let existingObject = summaryCache.find((item) => item.name === topicUrl);
            if (existingObject) {
              $(".post-stream").before(
                `<div class="gpt-summary-wrap">
                  <div class="gpt-summary">${marked.parse(existingObject.value)}</div>
                </div>`
              );
            }
          }
        }
      }, 1000);
    },

    // 获取指定页码的评论内容
    async getPageComments(page) {
      const topicId = window.location.href.match(/\/topic\/(\d+)/)?.[1];
      if (!topicId) return null;

      try {
        const response = await fetch(`/t/${topicId}/${page}.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error("获取评论失败:", error);
        return null;
      }
    },

    // 获取所有评论内容
    async getAllComments() {
      this.allContent = $("#topic-title h1 a").text() + "\n\n";
      this.allContent += $("#post_1 .cooked").text() + "\n\n评论内容：\n";
      
      while (this.hasMoreComments) {
        const data = await this.getPageComments(this.currentPage);
        if (!data) {
          this.hasMoreComments = false;
          break;
        }

        // 获取当前页的评论
        if (data.post_stream?.posts) {
          // 跳过第一个帖子(已经获取过了)
          const posts = this.currentPage === 1 ? 
            data.post_stream.posts.slice(1) : 
            data.post_stream.posts;
            
          posts.forEach(post => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(post.cooked, 'text/html');
            this.allContent += `\n${doc.body.textContent}\n`;
          });

          // 检查是否还有更多评论
          if (posts.length === 0) {
            this.hasMoreComments = false;
          } else {
            this.currentPage++;
          }
        } else {
          this.hasMoreComments = false;
        }
      }
    },

    // 生成总结
    async generateSummary() {
      const config = JSON.parse(localStorage.getItem("linxudoscriptssetting"))?.gptdata;
      if (!config) {
        throw new Error("未找到AI配置信息");
      }

      const prompt = `${config.prompt}\n帖子内容如下：\n${this.allContent}`;

      const response = await fetch(`${config.baseurl}${config.full_url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apikey}`,
        },
        body: JSON.stringify({
          model: config.model,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const gptData = await response.json();
      const summaryContent = gptData.choices[0].message.content;
      
      // 更新UI
      $(".gpt-summary").html(marked.parse(summaryContent));

      // 缓存总结
      this.cacheSummary(summaryContent);
    },

    // 缓存总结结果
    cacheSummary(content) {
      let summaryCache = JSON.parse(localStorage.getItem("summaryCacheData")) || [];
      const topicUrl = window.location.href.match(/^(https:\/\/linux\.do\/t\/topic\/\d+)/)?.[1];
      
      if (!topicUrl) return;

      const newSummary = {
        name: topicUrl,
        value: content,
      };

      const existingIndex = summaryCache.findIndex(item => item.name === topicUrl);
      if (existingIndex !== -1) {
        summaryCache[existingIndex] = newSummary;
      } else {
        summaryCache.push(newSummary);
      }

      // 只保留最近20条记录
      if (summaryCache.length > 20) {
        summaryCache = summaryCache.slice(-20);
      }

      localStorage.setItem("summaryCacheData", JSON.stringify(summaryCache));
    },

    // 处理总结请求
    async handleSummary() {
      if (this.isLoading) return;
      
      this.isLoading = true;
      
      // 移除已有的总结
      $(".gpt-summary-wrap").remove();
      
      // 添加加载提示
      $(".post-stream").before(
        `<div class="gpt-summary-wrap">
          <div class="gpt-summary">AI 总结：正在获取评论内容并使用 AI 总结中，请稍后...</div>
        </div>`
      );

      try {
        // 重置状态
        this.currentPage = 1;
        this.hasMoreComments = true;
        this.allContent = "";

        // 获取所有评论并生成总结
        await this.getAllComments();
        await this.generateSummary();
      } catch (error) {
        console.error("总结失败:", error);
        $(".gpt-summary").html(`生成失败: ${error.message}`);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style lang="less">
.gpt-summary-wrap {
  margin: 10px 0;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e9ecef;
}

.aicreated-btn {
  margin-left: 10px;
  padding: 5px 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }
}
</style>
