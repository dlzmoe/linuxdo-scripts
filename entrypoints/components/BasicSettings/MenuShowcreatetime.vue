<template>
  <div>
    <div class="item">
      <div class="tit">{{ sort }}. 话题列表显示创建时间</div>
      <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)" />
    </div>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  props: ["modelValue", "sort"],
  emits: ["update:modelValue"],
  data() {
    return {
      updateIntervalId: null, // 添加变量存储更新定时器ID
      pollingIntervalId: null // 添加变量存储轮询定时器ID
    };
  },
  methods: {
    formattedDate(time) {
      const timestamp = Number(time);
      const date = new Date(timestamp);
      const now = new Date();
      const isToday =
        now.getFullYear() === date.getFullYear() &&
        now.getMonth() === date.getMonth() &&
        now.getDate() === date.getDate();

      const isThisYear = now.getFullYear() === date.getFullYear();

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      if (isToday) {
        return `${hours}:${minutes}`;
      } else if (isThisYear) {
        return `${month}/${day} ${hours}:${minutes}`;
      } else {
        return `${year}/${month}/${day} ${hours}:${minutes}`;
      }
    },

    convertToTimestamp(dateStr) {
      const cleanedDateStr = dateStr.replace(/\s+/g, ""); // 去掉所有空格
      const datePattern = /(\d{4})年(\d{1,2})月(\d{1,2})日(\d{2}):(\d{2})/;
      const dateMatch = cleanedDateStr.match(datePattern);

      if (dateMatch) {
        const year = parseInt(dateMatch[1], 10);
        const month = parseInt(dateMatch[2], 10) - 1;
        const day = parseInt(dateMatch[3], 10);
        const hours = parseInt(dateMatch[4], 10);
        const minutes = parseInt(dateMatch[5], 10);

        const date = new Date(year, month, day, hours, minutes);
        return date.getTime();
      }
      return null;
    },
    setInitDate() {
      $(".topic-list .age").each((index, element) => {
        const str = $(element).attr("title");
        const match = str.match(/创建日期：([\s\S]*?)最新：/);

        if (match && match[1]) {
          const creationDate = match[1].trim();
          const timestamp = this.convertToTimestamp(creationDate);

          if ($(element).find(".linuxtime").length < 1) {
            const now = new Date().getTime();
            const oneDay = 1000 * 60 * 60 * 24;
            const oneWeek = oneDay * 7;
            const oneMonth = oneDay * 30;
            const threeMonths = oneMonth * 3;

            let color;
            const timeDiff = now - timestamp;

            if (timeDiff < oneDay) {
              color = "#45B5AA";
              $(element)
                .find(".post-activity")
                .append(
                  `<span class="linuxtime" style="color:${color}">（${this.formattedDate(
                    timestamp
                  )}）</span>`
                );
            } else if (timeDiff < oneWeek) {
              color = "#66A586";
              $(element)
                .find(".post-activity")
                .append(
                  `<span class="linuxtime" style="color:${color}">（${this.formattedDate(
                    timestamp
                  )}）</span>`
                );
            } else if (timeDiff < oneMonth) {
              color = "#CFA94A";
              $(element)
                .find(".post-activity")
                .append(
                  `<span class="linuxtime" style="color:${color}">（${this.formattedDate(
                    timestamp
                  )}）</span>`
                );
            } else if (timeDiff < threeMonths) {
              color = "#3e8ed2";
              $(element)
                .find(".post-activity")
                .append(
                  `<span class="linuxtime" style="color:${color}">（${this.formattedDate(
                    timestamp
                  )}）</span>`
                );
            } else {
              color = "#cccccc";
              $(element)
                .find(".post-activity")
                .append(
                  `<span class="linuxtime" style="color:${color}">
                  （<svg style="vertical-align:bottom;margin-right:5px;" class="icon" width="22" height="22" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#A51C30" d="M916.992 813.44c11.008-44.032-9.856-53.632-9.856-53.632 7.168-23.552-12.8-46.592-12.8-46.592a72.448 72.448 0 0 0-12.032-34.816h-85.12V179.2a9.856 9.856 0 0 0-9.984-9.6h-54.144a9.856 9.856 0 0 1-9.472-7.168A204.8 204.8 0 0 0 524.8 14.208h-27.904a204.8 204.8 0 0 0-198.016 147.712 9.856 9.856 0 0 1-9.472 7.168h-51.968a10.496 10.496 0 0 0-10.752 10.368v499.2h-84.992v1.28a78.336 78.336 0 0 0-9.088 32.256s-22.656 23.296-15.36 46.72c0 0-20.736 9.856-9.344 53.504 0 0-66.176 11.776-49.408 193.536h83.072v0.768h740.608l86.528-0.896c14.72-181.376-51.712-192.384-51.712-192.384z" /></svg>${this.formattedDate(
                    timestamp
                  )}）
                </span>`
                );
            }

            // $(element).find(".post-activity").append(`<span class="linuxtime" style="color:${color}">（${this.formattedDate(timestamp)}）</span>`);
          }
        }
      });
    },
    // 初始化定时器，避免嵌套创建多个定时器
    initTimers() {
      // 清除可能已存在的定时器
      this.clearTimers();
      
      // 立即执行一次初始化
      this.setInitDate();
      
      // 设置短间隔更新定时器 (1秒)
      this.updateIntervalId = setInterval(() => {
        this.setInitDate();
      }, 1000);
      
      // 设置长间隔轮询定时器 (10秒)，避免资源浪费
      this.pollingIntervalId = setInterval(() => {
        this.setInitDate();
      }, 10000);
    },
    // 清除所有定时器
    clearTimers() {
      if (this.updateIntervalId) {
        clearInterval(this.updateIntervalId);
        this.updateIntervalId = null;
      }
      if (this.pollingIntervalId) {
        clearInterval(this.pollingIntervalId);
        this.pollingIntervalId = null;
      }
    }
  },
  mounted() {
    if (this.modelValue) {
      this.initTimers();
    }
  },
  beforeUnmount() {
    // 清除定时器
    this.clearTimers();
  },
  // Vue 2 兼容性
  beforeDestroy() {
    // 清除定时器
    this.clearTimers();
  },
  watch: {
    // 监听属性变化，动态处理定时器
    modelValue(newVal) {
      if (newVal) {
        this.initTimers();
      } else {
        this.clearTimers();
      }
    }
  }
};
</script>
