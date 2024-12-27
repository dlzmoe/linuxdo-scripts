<template>
  <div class="flex">
    <div class="aside">
      <ul>
        <el-button type="primary" @click="openCate">新建分类</el-button>
        <el-button type="primary" @click="openAdminCate">管理分类</el-button>
      </ul>
      <ul>
        <li
          v-for="item in bookmarklist"
          :key="item.id"
          @click="selectItem(item.id)"
          :class="{ selected: item.id === selectedItemId }"
        >
          {{ item.name }}
        </li>
      </ul>
      <ul class="btn">
        <el-button type="primary" @click="exportData">导出</el-button>
        <label for="file-upload" class="el-button el-button--primary">导入</label>
        <input id="file-upload" type="file" @change="importData" style="display: none" />
      </ul>
    </div>
    <div class="container">
      <el-table :data="tableData.list">
        <el-table-column prop="title" label="标题">
          <template v-slot="scope">
            <a :href="scope.row.url" target="_blank">{{ scope.row.title }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="cate" label="分类" />
        <el-table-column prop="tags" label="标签" />
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" @click="openMoveDialog(scope.row)">修改</el-button>
            <el-button type="danger" @click="openDelDialog(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <!-- 新增分类 -->
  <el-dialog v-model="dialogVisible" title="新建分类" width="500">
    <p style="margin-bottom: 5px">请输入分类名称</p>
    <el-input v-model="newcatename" style="width: 240px" />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addCate">确认</el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 管理分类 -->
  <el-dialog v-model="AdmindialogVisible" title="管理分类" width="500">
    <p style="color: #e00">无法恢复请谨慎操作！</p>
    <el-table
      :data="bookmarklist"
      ref="multipleTable"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" :selectable="selectable" width="55" />
      <el-table-column prop="name" label="分类名" />
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button @click="openEditDialog(scope.row)" type="primary">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="deleteSelected">删除</el-button>
      </div>
    </template>

    <!-- 修改分类名称对话框 -->
    <el-dialog v-model="editDialogVisible" title="修改分类名称" width="300">
      <el-input v-model="editCateName" placeholder="请输入新的分类名称"></el-input>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="updateCateName">修改</el-button>
        </div>
      </template>
    </el-dialog>
  </el-dialog>

  <!-- 转移操作对话框 -->
  <el-dialog v-model="moveDialogVisible" title="转移到其他分类" width="500">
    <el-select v-model="targetCategoryId" placeholder="选择目标分类" style="width: 100%">
      <el-option
        v-for="category in filteredCategories"
        :key="category.id"
        :label="category.name"
        :value="category.id"
      />
    </el-select>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="moveItem">确认</el-button>
        <el-button @click="moveDialogVisible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 删除指定帖子的对话框 -->
  <el-dialog v-model="delDialogVisible" title="删除收藏贴子" width="300">
    <p>是否真的删除？</p>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="delDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmDelete">删除</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      selectedItemId: 0,
      bookmarklist: [
        {
          id: 0,
          name: "默认",
          list: [],
        },
      ],
      tableData: {},

      // 新增分类
      dialogVisible: false,
      newcatename: "",

      // 管理分类
      AdmindialogVisible: false,
      multipleSelection: [],

      editDialogVisible: false, // 控制修改对话框的显示
      editCateName: "", // 编辑中的分类名称
      currentEditCate: null, // 当前编辑的分类对象

      // 转移动作
      moveDialogVisible: false,
      currentMoveItem: null, // 当前要转移的项
      targetCategoryId: null, // 目标分类 ID

      // 删除指定帖子
      delDialogVisible: false,
    };
  },
  computed: {
    filteredCategories() {
      return this.bookmarklist.filter((item) => item.id !== this.selectedItemId);
    },
  },
  methods: {
    selectItem(id) {
      this.selectedItemId = id;
      this.tableData = this.bookmarklist[this.selectedItemId];
    },
    init() {
      this.tableData = this.bookmarklist[this.selectedItemId];
    },
    // 打开新建分类弹窗
    openCate() {
      this.dialogVisible = true;
    },
    // 新增分类
    addCate() {
      if (this.newcatename.trim() === "") {
        this.$message.error("分类名称不能为空");
        return;
      }
      const maxId = this.bookmarklist.reduce((max, item) => Math.max(max, item.id), 0);
      const newCate = {
        id: maxId + 1,
        name: this.newcatename.trim(),
        list: [],
      };
      this.bookmarklist.push(newCate);
      this.$message.success(`新增分类【${this.newcatename}】成功!`);
      this.newcatename = "";
      this.dialogVisible = false;
      localStorage.setItem("bookmarkData", JSON.stringify(this.bookmarklist));
    },

    // 打开管理分类弹窗
    openAdminCate() {
      this.AdmindialogVisible = true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 删除分类
    deleteSelected() {
      this.bookmarklist = this.bookmarklist.filter(
        (item) => !this.multipleSelection.includes(item)
      );
      this.multipleSelection = [];
      this.$message.success("删除成功！");
      this.AdmindialogVisible = false;
      localStorage.setItem("bookmarkData", JSON.stringify(this.bookmarklist));
    },
    // 打开修改弹窗
    openEditDialog(row) {
      this.currentEditCate = row;
      this.editCateName = row.name;
      this.editDialogVisible = true;
    },
    // 确认修改
    updateCateName() {
      if (this.editCateName.trim() === "") {
        this.$message.error("分类名称不能为空");
        return;
      }

      // 更新分类名称
      this.currentEditCate.name = this.editCateName;
      this.editDialogVisible = false;
      localStorage.setItem("bookmarkData", JSON.stringify(this.bookmarklist));
    },
    // 打开转移对话框
    openMoveDialog(row) {
      this.currentMoveItem = row;
      this.targetCategoryId = null;
      this.moveDialogVisible = true;
    },
    // 执行转移操作
    moveItem() {
      if (this.targetCategoryId === null) {
        this.$message.error("请选择目标分类");
        return;
      }

      // 查找当前分类和目标分类
      const currentCategory = this.bookmarklist[this.selectedItemId];
      const targetCategory = this.bookmarklist.find(
        (item) => item.id === this.targetCategoryId
      );

      // 从当前分类中移除项目并添加到目标分类中
      const index = currentCategory.list.indexOf(this.currentMoveItem);
      if (index > -1) {
        currentCategory.list.splice(index, 1);
        targetCategory.list.push(this.currentMoveItem);

        this.$message.success("项目转移成功！");
        this.moveDialogVisible = false;
        localStorage.setItem("bookmarkData", JSON.stringify(this.bookmarklist));
      }
    },
    openDelDialog(row) {
      this.deleteRow = row; // 保存要删除的行数据
      this.delDialogVisible = true; // 显示删除对话框
    },
    // 删除指定帖子
    confirmDelete() {
      const index = this.bookmarklist[this.selectedItemId].list.indexOf(this.deleteRow);
      if (index > -1) {
        this.bookmarklist[this.selectedItemId].list.splice(index, 1);
        this.delDialogVisible = false; // 关闭对话框
        this.deleteRow = null; // 清除删除行的数据
        localStorage.setItem("bookmarkData", JSON.stringify(this.bookmarklist));
        this.$message.success("删除成功！");
      }
    },

    // 导出书签数据
    exportData() {
      const blob = new Blob([JSON.stringify(this.bookmarklist)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "bookmarkData.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.$message('导出成功，请妥善保存 json 文件！')
    },
    // 导入书签数据
    importData(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target.result);
            // 简单的验证数据结构
            if (Array.isArray(data)) {
              this.bookmarklist = data;
              this.tableData = this.bookmarklist[this.selectedItemId];
              localStorage.setItem("bookmarkData", JSON.stringify(this.bookmarklist));
              this.$message.success("导入成功");
            } else {
              this.$message.error("导入数据格式有问题");
            }
          } catch (ex) {
            this.$message.error("导入数据解析出错");
          }
        };
        reader.readAsText(file);
      }
    },
  },
  created() {
    const bookmarkData = localStorage.getItem("bookmarkData");
    if (bookmarkData && JSON.parse(bookmarkData).length > 0) {
      this.bookmarklist = JSON.parse(bookmarkData);
    } else {
      localStorage.setItem("bookmarkData", JSON.stringify(this.bookmarklist));
    }
    this.init();
    const vm = this;

    chrome.storage.local.get("bookmarkData", (result) => {
      if (result.bookmarkData) {
        // 检查是否已有相同的 URL
        const isUrlExist = vm.bookmarklist.some((bookmarkGroup) =>
          bookmarkGroup.list.some((item) => item.url === result.bookmarkData.url)
        );

        if (!isUrlExist) {
          vm.bookmarklist[0].list.unshift(result.bookmarkData);
          vm.tableData = vm.bookmarklist[vm.selectedItemId];
          localStorage.setItem("bookmarkData", JSON.stringify(vm.bookmarklist));
        }
      }
    });
  },
};
</script>
