<template>
  <div>
    <table class="menu-table">
      <thead>
        <tr>
          <th>用户名</th>
          <th>标签</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in tableData" :key="item.name">
          <td>{{ item.name }}</td>
          <td>
            {{ item.tags }}
          </td>
          <td>
            <span class="span" @click="editTags(item)">修改</span>
            <span class="span" @click="delTags(item)" style="color: #e00">删除！</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  props: {
    value: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      tableData: this.value,
    };
  },
  watch: {
    value(newValue) {
      this.tableData = newValue;
    },
  },
  methods: {
    handleChange() {
      this.$emit("update:value", this.tableData);
    },
    // 修改标签
    editTags(item) {
      var tags = prompt(`对 @${item.name} 修改标签`, item.tags);
      if (tags == null) {
        return item.tags;
      }
      if (tags != item.tags) {
        var existingPerson = this.tableData.find((items) => items.name === item.name);

        if (existingPerson) {
          // 如果存在，直接修改该对象的 tags 属性
          existingPerson.tags = tags;
        } else {
          // 如果不存在，新增对象
          this.tableData.push({ name: person, tags: tags });
        }
        let settingData1 = localStorage.getItem("linxudoscriptssettingDMI");
        settingData1 = JSON.parse(settingData1);
        settingData1.usertags = this.tableData;
        localStorage.setItem("linxudoscriptssettingDMI", JSON.stringify(settingData1));

        this.$emit("update:value", this.tableData);
      }
    },
    delTags(item) {
      var del = confirm("是否确认删除！");
      if (del == true) {
        this.tableData.splice(item, 1);

        let settingData1 = localStorage.getItem("linxudoscriptssettingDMI");
        settingData1 = JSON.parse(settingData1);
        settingData1.usertags = this.tableData;
        localStorage.setItem("linxudoscriptssettingDMI", JSON.stringify(settingData1));

        this.$emit("update:value", this.tableData);
      }
    },
  },
  created() {
    let settingData = localStorage.getItem("linxudoscriptssettingDMI");
    settingData = JSON.parse(settingData);

    if (!settingData.usertags) {
      settingData.usertags = [];
    }
    settingData.usertags = settingData.usertags.filter((user) => user.tags);
    this.tableData = settingData.usertags;

    setInterval(() => {
      if ($(".addusertag").length < 1) {
        $(".usercard-controls").append(
          `<li><button class="btn addusertag" type="button">添加用户标签</button></li>`
        );

        $(".addusertag").click(function () {
          var person = $(".user-card .user-profile-link").attr("href").replace("/u/", "");
          var tags = prompt(`对 @${person} 设置标签（保存后刷新页面）`, "");
          if (tags == null) {
            return false;
          }

          // 转换为小写进行比较
          var lowerCasePerson = person;
          var existingPerson = settingData.usertags.find(
            (item) => item.name === lowerCasePerson
          );

          if (existingPerson) {
            existingPerson.tags = tags;
          } else {
            settingData.usertags.push({ name: person, tags: tags });
          }

          localStorage.setItem("linxudoscriptssettingDMI", JSON.stringify(settingData));
        });
      }

      $(".topic-post").each(function () {
        const username = $(this).find(".first a").attr("data-user-card").toLowerCase();
        // 在 usertags 数组中查找对应的对象
        const userTag = settingData.usertags.find((user) => user.name === username);
        if (userTag) {
          if ($(this).find(".linxudoscripts-tag").length < 1) {
            $(this)
              .find(".names")
              .append(`<span class="linxudoscripts-tag"># ${userTag.tags}</span>`);
          }
        }
      });
    }, 1000);
  },
};
</script>