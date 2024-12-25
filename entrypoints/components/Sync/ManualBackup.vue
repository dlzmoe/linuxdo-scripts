<template>
  <input
    type="file"
    id="fileInput"
    ref="fileInput"
    style="display: none"
    accept=".json"
    @change="handleFileUpload"
  />
  <button class="btn import" @click="triggerFileInput">导入</button>
  <button class="btn export" @click="exportData">导出</button>
</template>

<script>
import $ from "jquery";
export default {
  data() {
    return {};
  },
  methods: {
    // 提示组件
    messageToast(message) {
      const messageElement = document.createElement("div");
      messageElement.className = "messageToast-text";
      messageElement.innerText = message;
      document.getElementById("messageToast").appendChild(messageElement);
      setTimeout(() => {
        messageElement.remove();
      }, 3000);
    },
    // 导入数据
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file && file.type === "application/json") {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const jsonData = JSON.parse(e.target.result);
            this.importData(jsonData);
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        };
        reader.readAsText(file);
      } else {
        console.error("Please select a valid JSON file.");
      }
    },
    // 处理导入的数据
    importData(data) {
      localStorage.setItem("linxudoscriptssettingDMI", data);
      this.messageToast("导入成功，即将刷新页面！");
      setTimeout(() => {
        location.reload();
      }, 1500);
    },
    // 导出数据
    exportData() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const formattedDate = year + month + day;

      const data = localStorage.getItem("linxudoscriptssettingDMI");
      const dataStr = JSON.stringify(data, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `linuxdo-script-data-${formattedDate}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      this.messageToast("导出成功！");
    },
  },
};
</script>

