<template>
  <!-- 话题列表显示创建时间 -->
  <div>
    <div class="item">
      <div class="tit">4. 话题列表显示创建时间</div>
      <template>
        <el-checkbox v-model="localChecked" @change="handleChange"></el-checkbox>
      </template>
    </div>
    <!-- <div class="item">
      <div class="tit">4.1. 话题列表显示创建时间（需开启4）</div>
      <template>
        <el-checkbox v-model="localChecked1" @change="handleChange1"></el-checkbox>
      </template>
    </div> -->
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
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
      this.$emit("input", this.localChecked);
    },
    formattedDate(time) {
      const timestamp = Number(time); // 将字符串转换为数字类型
      const date = new Date(timestamp);

      // 获取当前日期
      const now = new Date();
      const isToday =
        now.getFullYear() === date.getFullYear() &&
        now.getMonth() === date.getMonth() &&
        now.getDate() === date.getDate();

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需要加1，并且确保两位数
      const day = String(date.getDate()).padStart(2, "0"); // 确保两位数
      const hours = String(date.getHours()).padStart(2, "0"); // 确保两位数
      const minutes = String(date.getMinutes()).padStart(2, "0"); // 确保两位数

      if (isToday) {
        return `${hours}:${minutes}`;
      } else {
        return `${month}/${day} ${hours}:${minutes}`;
      }
    },

    convertToTimestamp(dateStr) {
      // 创建一个正则表达式来匹配日期和时间部分
      var datePattern = /(\d{4}) 年 (\d{1,2}) 月 (\d{1,2}) 日 (\d{2}):(\d{2})/;
      var dateMatch = dateStr.match(datePattern);

      if (dateMatch) {
        var year = parseInt(dateMatch[1], 10);
        var month = parseInt(dateMatch[2], 10) - 1; // 月份从0开始
        var day = parseInt(dateMatch[3], 10);
        var hours = parseInt(dateMatch[4], 10);
        var minutes = parseInt(dateMatch[5], 10);

        // 创建 Date 对象
        var date = new Date(year, month, day, hours, minutes);
        return date.getTime(); // 返回时间戳
      } else {
        return null; // 日期格式无效
      }
    },

    setinitdate() {
      $(".topic-list .age").each(function () {
        const str = $(this).attr("title");
        var match = str.match(/创建日期：([\s\S]*?)最新：/);

        if (match && match[1]) {
          var creationDate = match[1].trim();
          var timestamp = this.convertToTimestamp(creationDate);
          console.log(creationDate);
          console.log(timestamp);
        }

        if ($(this).find(".linuxtime").length < 1) {
          if (timestamp) {
            var now = new Date().getTime();
            var oneDay = 1000 * 60 * 60 * 24;
            var oneWeek = oneDay * 7;
            var oneMonth = oneDay * 30; // 近似值
            var threeMonths = oneMonth * 3;

            var color;
            var timeDiff = now - timestamp;

            if (menu_value("menu_viewstotime")) {
              $(this).siblings(".views").html("未知");
              $(".topic-list th.views span").html("创建时间");
              if (timeDiff < oneDay) {
                color = "#45B5AA";
                $(this)
                  .siblings(".views")
                  .html(
                    `<span class="linuxtime" style="color:${color}">${this.formattedDate(
                      timestamp
                    )}</span>`
                  );
              } else if (timeDiff < oneWeek) {
                color = "#66A586";
                $(this)
                  .siblings(".views")
                  .html(
                    `<span class="linuxtime" style="color:${color}">${this.formattedDate(
                      timestamp
                    )}</span>`
                  );
              } else if (timeDiff < oneMonth) {
                color = "#CFA94A";
                $(this)
                  .siblings(".views")
                  .html(
                    `<span class="linuxtime" style="color:${color}">${this.formattedDate(
                      timestamp
                    )}</span>`
                  );
              } else if (timeDiff < threeMonths) {
                color = "#3e8ed2";
                $(this)
                  .siblings(".views")
                  .html(
                    `<span class="linuxtime" style="color:${color}">${this.formattedDate(
                      timestamp
                    )}</span>`
                  );
              } else {
                color = "#cccccc";
                $(this).siblings(".views")
                  .html(`<span class="linuxtime" style="color:${color}"><img 
              style="width: 20px;
                    vertical-align: sub;" 
              src="https://cdn.linux.do/uploads/default/original/3X/0/a/0a7634b834bc6ecef03ab57306dafd8475387155.png"> ${this.formattedDate(
                timestamp
              )}</span>`);
              }
            } else {
              if (timeDiff < oneDay) {
                color = "#45B5AA";
                $(this)
                  .find(".post-activity")
                  .append(
                    `<span class="linuxtime" style="color:${color}">（${this.formattedDate(
                      timestamp
                    )}）</span>`
                  );
              } else if (timeDiff < oneWeek) {
                color = "#66A586";
                $(this)
                  .find(".post-activity")
                  .append(
                    `<span class="linuxtime" style="color:${color}">（${this.formattedDate(
                      timestamp
                    )}）</span>`
                  );
              } else if (timeDiff < oneMonth) {
                color = "#CFA94A";
                $(this)
                  .find(".post-activity")
                  .append(
                    `<span class="linuxtime" style="color:${color}">（${this.formattedDate(
                      timestamp
                    )}）</span>`
                  );
              } else if (timeDiff < threeMonths) {
                color = "#3e8ed2";
                $(this)
                  .find(".post-activity")
                  .append(
                    `<span class="linuxtime" style="color:${color}">（${this.formattedDate(
                      timestamp
                    )}）</span>`
                  );
              } else {
                color = "#cccccc";
                $(this).find(".post-activity")
                  .append(`<span class="linuxtime" style="color:${color}">（<img 
              style="width: 20px;
                    vertical-align: sub;" 
              src="https://cdn.linux.do/uploads/default/original/3X/0/a/0a7634b834bc6ecef03ab57306dafd8475387155.png"> ${this.formattedDate(
                timestamp
              )}）</span>`);
              }
            }
          }
        }
      });
    },
  },

  created() {
    if (this.localChecked) {
      let pollinglength1 = 0;
      let pollinglength2 = 0;
      setInterval(() => {
        if (pollinglength1 != $(".topic-list-body tr").length) {
          pollinglength1 = $(".topic-list-body tr").length;
          this.setinitdate();
        }
        if (pollinglength2 != $(".post-stream .topic-post").length) {
          pollinglength2 = $(".post-stream .topic-post").length;
          this.setinitdate();
        }
      }, 1000);
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
