<template>
  <div class="item">用于在云端同步设置数据，无需手动导入导出。（同步前先保存设置）</div>
  <div class="item">
    <div class="tit">WebDav 地址：</div>
    <input
      type="text"
      v-model="tableData.webdavUrl"
      @blur="handleChange"
      placeholder="https://dav.xxxx.com/dav/"
    />
  </div>
  <div class="item">
    <div class="tit">WebDav 用户名：</div>
    <input type="text" v-model="tableData.webdavUsername" @blur="handleChange" />
  </div>
  <div class="item">
    <div class="tit">WebDav 密码：</div>
    <input
      type="text"
      class="lxwebdavpassword"
      v-model="tableData.webdavPassword"
      @blur="handleChange"
      @focus="showpsw"
    />
  </div>

  <div class="btnwrapper">
    <button @click="uploadSampleFile">同步到云端</button>
    <button @click="downloadSampleFile">下载到本地</button>
  </div>
  <hr />
  <!-- 手动导入导出 -->
  <div style="margin: 10px 0">手动导入导出数据：</div>
  <ManualBackup />
</template>

<script>
import ManualBackup from "./ManualBackup.vue";
export default {
  props: {
    value: {
      type: Object,
      default: {
        webdavUrl: "",
        webdavUsername: "",
        webdavPassword: "",
      },
    },
  },
  components: {
    ManualBackup,
  },
  watch: {
    value(newValue) {
      this.tableData = newValue;
    },
  },
  data() {
    return {
      tableData: this.value,
      // webdavUrl: "",
      // webdavUsername: "",
      // webdavPassword: "",
    };
  },
  methods: {
    messageToast(message) {
      const messageElement = $(`<div class="messageToast-text">${message}</div>`);
      $("#messageToast").append(messageElement);
      setTimeout(() => {
        messageElement.remove();
      }, 3000);
    },
    handleChange() {
      $(".lxwebdavpassword").removeClass("act");
      this.$emit("update:value", this.tableData);

      let linxudoscriptssetting = JSON.parse(
        localStorage.getItem("linxudoscriptssetting")
      );
      let data = {
        webdavUrl: this.tableData.webdavUrl,
        webdavUsername: this.tableData.webdavUsername,
        webdavPassword: this.tableData.webdavPassword,
      };

      linxudoscriptssetting.syncbackup = data;
      localStorage.setItem(
        "linxudoscriptssetting",
        JSON.stringify(linxudoscriptssetting)
      );
    },
    // 检查文件夹是否存在
    checkFolderExists(folderUrl) {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "PROPFIND",
          url: folderUrl,
          headers: {
            Authorization:
              "Basic " +
              btoa(`${this.tableData.webdavUsername}:${this.tableData.webdavPassword}`),
            Depth: "1", // 只检查一层
          },
          onload: function (response) {
            if (response.status === 207) {
              // Multi-Status
              resolve(true);
            } else if (response.status === 404) {
              resolve(false);
            } else {
              reject(new Error(`Error checking folder: ${response.statusText}`));
            }
          },
          onerror: function (error) {
            reject(error);
          },
        });
      });
    },

    // 创建文件夹
    createFolder(folderUrl) {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "MKCOL",
          url: folderUrl,
          headers: {
            Authorization:
              "Basic " +
              btoa(`${this.tableData.webdavUsername}:${this.tableData.webdavPassword}`),
          },
          onload: function (response) {
            if (response.status === 201) {
              // Created
              resolve(true);
            } else {
              reject(new Error(`Error creating folder: ${response.statusText}`));
            }
          },
          onerror: function (error) {
            reject(error);
          },
        });
      });
    },

    // 检查并创建文件夹
    async checkAndCreateFolder() {
      const folderUrl = `${this.tableData.webdavUrl}linuxdo-scripts-backup/`;

      try {
        const exists = await this.checkFolderExists(folderUrl);
        if (!exists) {
          await this.createFolder(folderUrl);
          console.log("Folder 'linuxdo-scripts-backup' created successfully.");
        } else {
          console.log("Folder 'linuxdo-scripts-backup' already exists.");
        }

        const data = localStorage.getItem("linxudoscriptssetting");
        let fileData;
        try {
          fileData = JSON.stringify(JSON.parse(data)); // 确保是 JSON 格式
        } catch (error) {
          console.error("Error parsing localStorage data:", error);
          return;
        }

        const uploadUrl = `${this.tableData.webdavUrl}linuxdo-scripts-backup/data.json`;

        try {
          const uploadResponse = await this.uploadFile(uploadUrl, fileData);
          this.messageToast("同步到云端成功！");
        } catch (error) {
          console.error("Upload failed:", error);
          this.messageToast("同步失败！");
        }
      } catch (error) {
        console.error(error);
      }
    },

    uploadFile(url, fileData) {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "PUT",
          url: url,
          data: fileData,
          headers: {
            "Content-Type": "text/plain",
            Authorization:
              "Basic " +
              btoa(`${this.tableData.webdavUsername}:${this.tableData.webdavPassword}`),
          },
          onload: function (response) {
            if (response.status >= 200 && response.status < 300) {
              resolve(response);
            } else {
              reject(new Error(`Upload failed: ${response.statusText}`));
            }
          },
          onerror: function (error) {
            reject(error);
          },
        });
      });
    },

    downloadFile(url) {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "GET",
          url: url,
          headers: {
            Authorization:
              "Basic " +
              btoa(`${this.tableData.webdavUsername}:${this.tableData.webdavPassword}`),
          },
          onload: function (response) {
            if (response.status >= 200 && response.status < 300) {
              resolve(response.responseText);
            } else {
              reject(new Error(`Download failed: ${response.statusText}`));
            }
          },
          onerror: function (error) {
            reject(error);
          },
        });
      });
    },
    // 上传
    async uploadSampleFile() {
      this.checkAndCreateFolder();
    },
    // 下载
    async downloadSampleFile() {
      const downloadUrl = `${this.tableData.webdavUrl}linuxdo-scripts-backup/data.json`;

      try {
        const downloadResponse = await this.downloadFile(downloadUrl);
        localStorage.setItem("linxudoscriptssetting", downloadResponse);

        this.messageToast("下载成功，即将刷新页面！");
        setTimeout(() => {
          location.reload();
        }, 1500);
      } catch (error) {
        console.error(error);
        this.messageToast("下载失败，请检查是否存在备份！");
      }
    },
    // 显示/隐藏密码
    showpsw() {
      $(".lxwebdavpassword").addClass("act");
    },
  },
  created() {
    let linxudoscriptssetting = {};  // 默认一个空对象
    try {
      const storedData = localStorage.getItem("linxudoscriptssetting");
      if (storedData) {
        linxudoscriptssetting = JSON.parse(storedData);  // 尝试解析 JSON
      }
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
    }

    // 安全访问 syncbackup 属性，使用可选链（Optional Chaining）来避免访问 undefined
    const syncbackup = linxudoscriptssetting.syncbackup || {};  // 如果没有 syncbackup，则默认空对象

    // 使用可选链和默认值处理 undefined 和 null
    this.tableData.webdavUrl = syncbackup?.webdavUrl || '';  // 如果 syncbackup.webdavUrl 不存在，默认为 ''
    this.tableData.webdavUsername = syncbackup?.webdavUsername || '';  // 同理
    this.tableData.webdavPassword = syncbackup?.webdavPassword || '';  // 同理
  },
};
</script>

<style lang="less" scoped>
.item {
  border: none !important;
  padding: 0 !important;
  margin-top: 15px;
  position: relative;

  .tit {
    white-space: nowrap;
    width: 160px;
  }

  input {
    margin: 0;
    width: 100%;
  }

  em {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      color: #999;
    }
  }

  .lxwebdavpassword {
    filter: blur(5px);
  }

  .lxwebdavpassword.act {
    filter: none;
  }
}

.btnwrapper {
  margin-top: 20px;
}
</style>
