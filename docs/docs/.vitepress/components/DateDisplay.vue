<template>
  <span>{{ formattedDate }}</span>
</template>

<script>
export default {
  props: {
    date: {
      type: String,
      required: true,
    },
  },
  computed: {
    formattedDate() {
      if (!this.date) return "";
      const datePattern = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
      if (!datePattern.test(this.date)) {
        console.warn(`Date '${this.date}' is not in the correct format (YYYY-MM-DD).`);
        return this.date; // 或者返回一个错误信息或默认值
      }
      // 如果你需要进一步格式化日期，可以在这里实现
      return this.date;
    },
  },
};
</script>
