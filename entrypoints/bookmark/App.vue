<template>
  <p>正在开发中...测试阶段请及时保存数据。</p>
  <div class="flex">
    <div class="aside">
      <ul>
        <li
          v-for="item in directory"
          :key="item.id"
          @click="selectItem(item.id)"
          :class="{ selected: item.id === selectedItemId }"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
    <div class="container">
      <el-table :data="tableData">
        <el-table-column prop="name" label="标题" />
        <el-table-column prop="address" label="分类/标签" />
        <el-table-column prop="date" label="发布时间" />
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedItemId: 0,
      directory: [
        {
          id: 0,
          name: "默认",
        },
        {
          id: 1,
          name: "分类 1",
        },
      ],
      // 全部
      bookmarklist: [
        [
          {
            date: "2016-05-03",
            name: "Tom",
            address: "No. 189, Grove St, Los Angeles",
          },
          {
            date: "2016-05-02",
            name: "Tom",
            address: "No. 189, Grove St, Los Angeles",
          },
          {
            date: "2016-05-04",
            name: "Tom",
            address: "No. 189, Grove St, Los Angeles",
          },
          {
            date: "2016-05-01",
            name: "Tom",
            address: "No. 189, Grove St, Los Angeles",
          },
          {
            date: "2016-05-08",
            name: "Tom",
            address: "No. 189, Grove St, Los Angeles",
          },
          {
            date: "2016-05-06",
            name: "Tom",
            address: "No. 189, Grove St, Los Angeles",
          },
          {
            date: "2016-05-07",
            name: "Tom",
            address: "No. 189, Grove St, Los Angeles",
          },
        ],
        [
          {
            date: "2016-05-03",
            name: "123",
            address: "No. 189, Grove St, Los Angeles",
          },
          {
            date: "2016-05-02",
            name: "Tom",
            address: "No. 189, Grove St, Los Angeles",
          },
          {
            date: "2016-05-04",
            name: "Tom",
            address: "No. 189, Grove St, Los Angeles",
          },
          {
            date: "2016-05-01",
            name: "Tom",
            address: "No. 189, Grove St, Los Angeles",
          },
          {
            date: "2016-05-08",
            name: "Tom",
            address: "No. 189, Grove St, Los Angeles",
          },
          {
            date: "2016-05-06",
            name: "Tom",
            address: "No. 189, Grove St, Los Angeles",
          },
          {
            date: "2016-05-07",
            name: "Tom",
            address: "No. 189, Grove St, Los Angeles",
          },
        ],
      ],

      // 渲染
      tableData: [],
    };
  },
  methods: {
    selectItem(id) {
      this.selectedItemId = id;
      this.tableData = this.bookmarklist[this.selectedItemId];
    },
    // demo() {
    //   const data = 123;
    //   chrome.runtime.sendMessage({ action: "sendData", data: data });
    // },
  },
  created() {
    this.tableData = this.bookmarklist[this.selectedItemId];

    document.addEventListener("DOMContentLoaded", function () {
      chrome.storage.local.get("bookmarkData", function (result) {
        console.log("Data retrieved:", result.bookmarkData);

        // 处理读取到的数据
        // 你可以在这里把数据显示在页面上或者存储在某个地方
      });
    });
  },
};
</script>
