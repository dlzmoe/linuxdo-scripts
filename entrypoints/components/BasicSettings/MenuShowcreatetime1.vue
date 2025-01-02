<template>
  <div class="item">
    <div class="tit">{{ sort }}. 将浏览量替换为创建时间（与 4 互斥，只可选择一个）</div>
    <input
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
  </div>
</template>

<script>
import $ from "jquery";
export default {
  props: ["modelValue", "sort"],
  emits: ["update:modelValue"],
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
      $(".topic-list-item .age").each((index, element) => {
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
            $(element)
              .siblings(".views")
              .html(
                `<span class="linuxtime" style="color:${color}">${this.formattedDate(
                  timestamp
                )}</span>`
              );
          } else if (timeDiff < oneWeek) {
            color = "#66A586";
            $(element)
              .siblings(".views")
              .html(
                `<span class="linuxtime" style="color:${color}">${this.formattedDate(
                  timestamp
                )}</span>`
              );
          } else if (timeDiff < oneMonth) {
            color = "#CFA94A";
            $(element)
              .siblings(".views")
              .html(
                `<span class="linuxtime" style="color:${color}">${this.formattedDate(
                  timestamp
                )}</span>`
              );
          } else if (timeDiff < threeMonths) {
            color = "#3e8ed2";
            $(element)
              .siblings(".views")
              .html(
                `<span class="linuxtime" style="color:${color}">${this.formattedDate(
                  timestamp
                )}</span>`
              );
          } else {
            color = "#cccccc";
            $(element)
              .siblings(".views")
              .html(
                `<span class="linuxtime" style="color:${color}">
               <img style="width:20px;vertical-align:sub;" src="https://linux.do/uploads/default/original/4X/4/0/8/408c29a1d1dfaada3160fb2ae366cf3a7c7c1696.png">${this.formattedDate(
                 timestamp
               )}
                </span>`
              );
          }
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
    if (this.modelValue) {
      this.startPolling();
      this.initDateAndStartPolling();
    }
  },
};
</script>
