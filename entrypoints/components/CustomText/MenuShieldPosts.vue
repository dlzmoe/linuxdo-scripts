<template>
  <div class="item" style="border: none">
    <div class="tit">
      {{ sort }}. 屏蔽指定天数前的帖子
      <input type="text" v-model="localChecked.days" placeholder="默认天数 5" />
    </div>
    <input type="checkbox" v-model="localChecked.value1" @change="handleChange" />
  </div>
  <div>
    <p>针对分类：留空对全部分类生效，多个分类用英文逗号【,】进行分隔</p>
    <textarea v-model="localChecked.cate" placeholder="搞七捻三"></textarea>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  props: {
    value: {
      type: Object,
      default: {
        value1: false,
        cate: "搞七捻三",
        days: "5",
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
    },
    // 过滤时间格式
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
    // 屏蔽指定分类、指定时间
    GetTimestamp() {
      if (
        !$(".nav-pills > li.nav-item_posted").hasClass("active") &&
        !$(".nav-pills > li.nav-item_bookmarks").hasClass("active")
      ) {
        if (this.localChecked.cate == "") {
          $(".topic-list .age").each((index, element) => {
            const str = $(element).attr("title");
            const match = str.match(/创建日期：([\s\S]*?)最新：/);
            if (match && match[1]) {
              const creationDate = match[1].trim();
              const timestamp = this.convertToTimestamp(creationDate);
              const days = Number(this.localChecked.days) * 86400000;
              if (Date.now() - timestamp > days) {
                $(element).parents("tr.topic-list-item").remove();
              }
            }
          });
        } else {
          const cateArray = this.localChecked.cate.split(",").map((item) => item.trim());
          $(".badge-category__wrapper .badge-category__name").each((index, element) => {
            let htmlContent = $(element).html();
            htmlContent = htmlContent.replace(/,\s*Lv[1-3]/g, "");
            if (cateArray.includes(htmlContent.trim())) {
              $(element)
                .parents("tr.topic-list-item")
                .find(".age")
                .each((index, element) => {
                  const str = $(element).attr("title");
                  const match = str.match(/创建日期：([\s\S]*?)最新：/);
                  if (match && match[1]) {
                    const creationDate = match[1].trim();
                    const timestamp = this.convertToTimestamp(creationDate);
                    const days = Number(this.localChecked.days) * 86400000;
                    if (Date.now() - timestamp > days) {
                      $(element).parents("tr.topic-list-item").remove();
                    }
                  }
                });
            }
          });
        }
      }
    },
  },
  created() {
    if (this.localChecked.value1) {
      let pollinglength1 = 0;
      setInterval(() => {
        if (pollinglength1 != $(".topic-list-body tr").length) {
          pollinglength1 = $(".topic-list-body tr").length;
          this.GetTimestamp();
        }
      }, 1000);
    }
  },
};
</script>

<style lang="less" scoped>
input[type="text"] {
  width: 100px !important;
  outline: none;
  height: 24px;
  border: 1px solid #b6b6b6;
  border-radius: 4px;
  margin-left: 10px;
  padding: 0 10px;
  box-sizing: border-box;
}
</style>
