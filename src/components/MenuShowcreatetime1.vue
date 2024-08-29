<template>
  <div class="item">
    <div class="tit">{{ sort }}. 将浏览量替换为创建时间（与 4 互斥，只可选择一个）</div>
    <input type="checkbox" v-model="localChecked" @change="handleChange">
  </div>
</template>

<script>
export default {
  props: {
    value: {
     type: Object,
      default: {
        value: false,
      },
    },
    sort: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      localChecked: this.value,
    };
  },
  watch: {
    value(newValue) {
      this.localChecked = newValue;
    },
  },
  methods: {
    handleChange() {
      this.$emit("update:value", this.localChecked);
      if (this.localChecked) {
        this.setInitDate(); // 如果勾选，初始化日期
      }
    },
    formattedDate(time) {
      const timestamp = Number(time);
      const date = new Date(timestamp);
      const now = new Date();
      const isToday =
        now.getFullYear() === date.getFullYear() &&
        now.getMonth() === date.getMonth() &&
        now.getDate() === date.getDate();

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      return isToday ? `${hours}:${minutes}` : `${month}/${day} ${hours}:${minutes}`;
    },

    convertToTimestamp(dateStr) {
      const datePattern = /(\d{4}) 年 (\d{1,2}) 月 (\d{1,2}) 日 (\d{2}):(\d{2})/;
      const dateMatch = dateStr.match(datePattern);

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

          // if ($(element).find(".linuxtime").length < 1) {
          const now = new Date().getTime();
          const oneDay = 1000 * 60 * 60 * 24;
          const oneWeek = oneDay * 7;
          const oneMonth = oneDay * 30;
          const threeMonths = oneMonth * 3;

          let color;
          const timeDiff = now - timestamp;

          if (timeDiff < oneDay) {
            color = "#45B5AA";
            $(element).siblings(".views").html(`<span class="linuxtime" style="color:${color}">${this.formattedDate(timestamp)}</span>`);
          } else if (timeDiff < oneWeek) {
            color = "#66A586";
            $(element).siblings(".views").html(`<span class="linuxtime" style="color:${color}">${this.formattedDate(timestamp)}</span>`);
          } else if (timeDiff < oneMonth) {
            color = "#CFA94A";
            $(element).siblings(".views").html(`<span class="linuxtime" style="color:${color}">${this.formattedDate(timestamp)}</span>`);
          } else if (timeDiff < threeMonths) {
            color = "#3e8ed2";
            $(element).siblings(".views").html(`<span class="linuxtime" style="color:${color}">${this.formattedDate(timestamp)}</span>`);
          } else {
            color = "#cccccc";
            $(element)
            .siblings(".views")
            .html(
              `<span class="linuxtime" style="color:${color}">
               <img style="width:20px;vertical-align:sub;" src="https://telegra.ph/file/94cb6dfe0410e401abbe8.png">${this.formattedDate(timestamp)}
                </span>`
            );
          }

          // $(element).siblings(".views").html(`<span class="linuxtime" style="color:${color}">${this.formattedDate(timestamp)}</span>`);
        }
        // }
      });
    },
    initDateAndStartPolling() {
      setInterval(() => {
        this.setInitDate();
        this.startPolling();
      }, 1000);
    },
    startPolling() {
      setInterval(() => {
        this.setInitDate(); // 定时更新日期
      }, 10000); // 每 10 秒更新一次
    },
  },
  mounted() {
    if (this.localChecked) {
      this.startPolling();
      this.initDateAndStartPolling();
    }
  },
};
</script>

<style scoped>
.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
