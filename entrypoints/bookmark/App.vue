<template>
  <div class="flex">
    <div class="fixed">
      <!-- 文件夹 -->
      <div class="item" @click="toggleMenu('folder')" :class="{active:menutype == 'folder'}" title="文件夹"><svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-folder"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 3a1 1 0 0 1 .608 .206l.1 .087l2.706 2.707h6.586a3 3 0 0 1 2.995 2.824l.005 .176v8a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-11a3 3 0 0 1 2.824 -2.995l.176 -.005h4z" /></svg></div>
      <!-- 分类 -->
      <div class="item" @click="toggleMenu('cate')" :class="{active:menutype == 'cate'}" title="话题分类"><svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-category"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 3h-6a1 1 0 0 0 -1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1 -1v-6a1 1 0 0 0 -1 -1z" /><path d="M20 3h-6a1 1 0 0 0 -1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1 -1v-6a1 1 0 0 0 -1 -1z" /><path d="M10 13h-6a1 1 0 0 0 -1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1 -1v-6a1 1 0 0 0 -1 -1z" /><path d="M17 13a4 4 0 1 1 -3.995 4.2l-.005 -.2l.005 -.2a4 4 0 0 1 3.995 -3.8z" /></svg></div>
      <!-- 标签 -->
      <div class="item" @click="toggleMenu('tags')" :class="{active:menutype == 'tags'}" title="标签"><svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-tags"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9.172 5a3 3 0 0 1 2.121 .879l5.71 5.71a3.41 3.41 0 0 1 0 4.822l-3.592 3.592a3.41 3.41 0 0 1 -4.822 0l-5.71 -5.71a3 3 0 0 1 -.879 -2.121v-4.172a3 3 0 0 1 3 -3zm-2.172 4h-.01a1 1 0 1 0 .01 2a1 1 0 0 0 0 -2" /><path d="M14.293 5.293a1 1 0 0 1 1.414 0l4.593 4.592a5.82 5.82 0 0 1 0 8.23l-1.592 1.592a1 1 0 0 1 -1.414 -1.414l1.592 -1.592a3.82 3.82 0 0 0 0 -5.402l-4.592 -4.592a1 1 0 0 1 0 -1.414" /></svg></div>
    </div>
    <div class="aside">
      <div v-show="menutype == 'folder'">
        <div class="page-title">文件夹</div>
        <ul>
          <el-button type="primary" @click="openCate">新建文件夹</el-button>
          <el-button type="primary" @click="openAdminCate">管理文件夹</el-button>
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
      </div>
      <div v-show="menutype == 'cate'">
        <div class="page-title">话题分类</div>
        <ul>
          <li
            v-for="item in catelist"
            :key="item.id"
            @click="selectItemCate(item.id)"
            :class="{ selected: item.id === selectItemCateId }"
          >
            {{ item.name }} <em>{{ item.list.length }}</em>
          </li>
        </ul>
      </div>
      <div v-show="menutype == 'tags'">
        <div class="page-title">标签</div>
        <ul>
          <li
            v-for="item in tagslist"
            :key="item.id"
            @click="selectItemTags(item.id)"
            :class="{ selected: item.id === selectItemTagsId }"
          >
            {{ item.name }} <em>{{ item.list.length }}</em>
          </li>
        </ul>
      </div>

      <ul class="btn">
        <el-button type="primary" @click="exportData">导出</el-button>
        <label for="file-upload" class="el-button el-button--primary">
          导入
        </label>
        <input
          id="file-upload"
          type="file"
          @change="importData"
          style="display: none"
        />
      </ul>
    </div>
    <div class="container">
      <el-table :data="tableData.list">
        <el-table-column prop="title" label="标题" min-width="300">
          <template v-slot="scope">
            <a :href="scope.row.url" target="_blank">{{ scope.row.title }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="cate" label="话题分类" width="200" />
        <el-table-column prop="tags" label="标签" width="200" />
        <el-table-column label="操作" width="200" fixed="right">
          <template v-slot="scope" v-if="menutype == 'folder'">
            <el-button type="primary" @click="openMoveDialog(scope.row)">修改</el-button>
            <el-button type="danger" @click="openDelDialog(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <!-- 新增文件夹 -->
  <el-dialog v-model="dialogVisible" title="新建文件夹" width="500">
    <p style="margin-bottom: 5px">请输入文件夹名称</p>
    <el-input v-model="newcatename" style="width: 240px" />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addCate">确认</el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 管理文件夹 -->
  <el-dialog v-model="AdmindialogVisible" title="管理文件夹" width="500">
    <p style="color: #e00">无法恢复请谨慎操作！</p>
    <el-table
      :data="bookmarklist"
      ref="multipleTable"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" :selectable="selectable" width="55" />
      <el-table-column prop="name" label="文件夹名称" />
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button @click="openEditDialog(scope.row)" type="primary"
            >修改</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="deleteSelected">删除</el-button>
      </div>
    </template>

    <!-- 修改文件夹名称对话框 -->
    <el-dialog v-model="editDialogVisible" title="修改文件夹名称" width="300">
      <el-input
        v-model="editCateName"
        placeholder="请输入新的文件夹名称"
      ></el-input>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="updateCateName">修改</el-button>
        </div>
      </template>
    </el-dialog>
  </el-dialog>

  <!-- 转移操作对话框 -->
  <el-dialog v-model="moveDialogVisible" title="转移到其他文件夹" width="500">
    <el-select
      v-model="targetCategoryId"
      placeholder="选择目标文件夹"
      style="width: 100%"
    >
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
      // 切换页面类型
      menutype: "folder",

      // 分类
      selectItemCateId: 0,
      catelist: [],

      // 标签
      selectItemTagsId: 0,
      tagslist: [],

      // 全部文件夹
      selectedItemId: 0,
      bookmarklist: [
        {
          id: 0,
          name: '默认',
          list: [],
        },
      ],
      tableData: {}, // 页面渲染的指定数据

      // 新增分类
      dialogVisible: false,
      newcatename: '',

      // 管理分类
      AdmindialogVisible: false,
      multipleSelection: [],

      editDialogVisible: false, // 控制修改对话框的显示
      editCateName: '', // 编辑中的分类名称
      currentEditCate: null, // 当前编辑的分类对象

      // 转移动作
      moveDialogVisible: false,
      currentMoveItem: null, // 当前要转移的项
      targetCategoryId: null, // 目标分类 ID

      // 删除指定帖子
      delDialogVisible: false,
    }
  },
  computed: {
    filteredCategories() {
      return this.bookmarklist.filter((item) => item.id !== this.selectedItemId)
    },
  },
  methods: {
    // 切换左侧页面类型
    toggleMenu(val) {
      this.menutype = val;
      this.selectedItemId = -1;
      this.selectItemCateId = -1;
      this.selectItemTagsId = -1;
    },
    selectItem(id) {
      this.selectedItemId = id
      this.tableData = this.bookmarklist[this.selectedItemId]
    },
    init() {
      this.tableData = this.bookmarklist[this.selectedItemId]
    },
    // 打开新建文件夹弹窗
    openCate() {
      this.dialogVisible = true
    },
    // 新增文件夹
    addCate() {
      if (this.newcatename.trim() === '') {
        this.$message.error('文件夹名称不能为空')
        return
      }
      const maxId = this.bookmarklist.reduce(
        (max, item) => Math.max(max, item.id),
        0
      )
      const newCate = {
        id: maxId + 1,
        name: this.newcatename.trim(),
        list: [],
      }
      this.bookmarklist.push(newCate)
      this.$message.success(`新增文件夹【${this.newcatename}】成功!`)
      this.newcatename = ''
      this.dialogVisible = false
      localStorage.setItem('bookmarkData', JSON.stringify(this.bookmarklist))
    },

    // 打开管理文件夹弹窗
    openAdminCate() {
      this.AdmindialogVisible = true
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 删除文件夹
    deleteSelected() {
      this.bookmarklist = this.bookmarklist.filter(
        (item) => !this.multipleSelection.includes(item)
      )
      this.multipleSelection = []
      this.$message.success('删除成功！')
      this.AdmindialogVisible = false
      localStorage.setItem('bookmarkData', JSON.stringify(this.bookmarklist))
    },
    // 打开修改弹窗
    openEditDialog(row) {
      this.currentEditCate = row
      this.editCateName = row.name
      this.editDialogVisible = true
    },
    // 确认修改
    updateCateName() {
      if (this.editCateName.trim() === '') {
        this.$message.error('文件夹名称不能为空')
        return
      }

      // 更新文件夹名称
      this.currentEditCate.name = this.editCateName
      this.editDialogVisible = false
      localStorage.setItem('bookmarkData', JSON.stringify(this.bookmarklist))
    },
    // 打开转移对话框
    openMoveDialog(row) {
      this.currentMoveItem = row
      this.targetCategoryId = null
      this.moveDialogVisible = true
    },
    // 执行转移操作
    moveItem() {
      if (this.targetCategoryId === null) {
        this.$message.error('请选择目标文件夹')
        return
      }

      // 查找当前文件夹和目标文件夹
      const currentCategory = this.bookmarklist[this.selectedItemId]
      const targetCategory = this.bookmarklist.find(
        (item) => item.id === this.targetCategoryId
      )

      // 从当前文件夹中移除项目并添加到目标文件夹中
      const index = currentCategory.list.indexOf(this.currentMoveItem)
      if (index > -1) {
        currentCategory.list.splice(index, 1)
        targetCategory.list.push(this.currentMoveItem)

        this.$message.success('收藏夹转移成功！')
        this.moveDialogVisible = false
        localStorage.setItem('bookmarkData', JSON.stringify(this.bookmarklist))
      }
    },
    openDelDialog(row) {
      this.deleteRow = row // 保存要删除的行数据
      this.delDialogVisible = true // 显示删除对话框
    },
    // 删除指定帖子
    confirmDelete() {
      const index = this.bookmarklist[this.selectedItemId].list.indexOf(
        this.deleteRow
      )
      if (index > -1) {
        this.bookmarklist[this.selectedItemId].list.splice(index, 1)
        this.delDialogVisible = false // 关闭对话框
        this.deleteRow = null // 清除删除行的数据
        localStorage.setItem('bookmarkData', JSON.stringify(this.bookmarklist))
        this.$message.success('删除成功！')
      }
    },

    // 导出书签数据
    exportData() {
      const blob = new Blob([JSON.stringify(this.bookmarklist)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'bookmarkData.json'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      this.$message('导出成功，请妥善保存 json 文件！')
    },
    // 导入书签数据
    importData(event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target.result)
            // 简单的验证数据结构
            if (Array.isArray(data)) {
              this.bookmarklist = data
              this.tableData = this.bookmarklist[this.selectedItemId]
              localStorage.setItem(
                'bookmarkData',
                JSON.stringify(this.bookmarklist)
              )
              this.$message.success('导入成功')
            } else {
              this.$message.error('导入数据格式有问题')
            }
          } catch (ex) {
            this.$message.error('导入数据解析出错')
          }
        }
        reader.readAsText(file)
      }
    },

    /*
    * 初始化帖子分类
    */
    initPostCategory() {
      this.catelist = this.bookmarklist.reduce((acc, folder) => {
        folder.list.forEach(item => {
          const existingCategory = acc.find(cat => cat.name === item.cate);
          
          if (existingCategory) {
            existingCategory.list.push(item);
          } else {
            acc.push({
              id: acc.length,
              name: item.cate,
              list: [item]
            });
          }
        });
        
        return acc;
        }, []);
    },
    selectItemCate(id) {
      this.selectItemCateId = id
      this.tableData = this.catelist[this.selectItemCateId]
    },

    /*
    * 初始化标签
    */
    initPostTags(){
      this.tagslist = this.bookmarklist.reduce((acc, folder) => {
        folder.list.forEach(item => {
          item.tags.forEach(tag => {
            const existingTag = acc.find(t => t.name === tag); 
            
            if (existingTag) {
              existingTag.list.push(item);
            } else {
              acc.push({
                id: acc.length,
                name: tag,
                list: [item]
              });
            }
          });
        });
        return acc;
        }, []);
    },
    selectItemTags(id) {
      this.selectItemTagsId = id
      this.tableData = this.tagslist[this.selectItemTagsId]
    },
  },
  created() {
    const bookmarkData = localStorage.getItem('bookmarkData')
    if (bookmarkData && JSON.parse(bookmarkData).length > 0) {
      this.bookmarklist = JSON.parse(bookmarkData)
    } else {
      localStorage.setItem('bookmarkData', JSON.stringify(this.bookmarklist))
    }
    this.init()
    const vm = this

    chrome.storage.local.get('bookmarkData', (result) => {
      if (result.bookmarkData) {
        // 检查是否已有相同的 URL
        const isUrlExist = vm.bookmarklist.some((bookmarkGroup) =>
          bookmarkGroup.list.some(
            (item) => item.url === result.bookmarkData.url
          )
        )

        if (!isUrlExist) {
          vm.bookmarklist[0].list.unshift(result.bookmarkData)
          vm.tableData = vm.bookmarklist[vm.selectedItemId]
          localStorage.setItem('bookmarkData', JSON.stringify(vm.bookmarklist))
        }

        this.initPostCategory();
        this.initPostTags();
      }
    })
  },
}
</script>
