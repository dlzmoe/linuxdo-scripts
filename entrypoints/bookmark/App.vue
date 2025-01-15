<template>
  <div class="flex">
    <div class="fixed">
      <!-- 文件夹 -->
      <div class="item" @click="toggleMenu('folder')" :class="{active:menutype == 'folder'}" title="文件夹"><svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-folder"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 3a1 1 0 0 1 .608 .206l.1 .087l2.706 2.707h6.586a3 3 0 0 1 2.995 2.824l.005 .176v8a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-11a3 3 0 0 1 2.824 -2.995l.176 -.005h4z" /></svg></div>
      <!-- 分类 -->
      <div class="item" @click="toggleMenu('cate')" :class="{active:menutype == 'cate'}" title="话题分类"><svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-category"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 3h-6a1 1 0 0 0 -1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1 -1v-6a1 1 0 0 0 -1 -1z" /><path d="M20 3h-6a1 1 0 0 0 -1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1 -1v-6a1 1 0 0 0 -1 -1z" /><path d="M10 13h-6a1 1 0 0 0 -1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1 -1v-6a1 1 0 0 0 -1 -1z" /><path d="M17 13a4 4 0 1 1 -3.995 4.2l-.005 -.2l.005 -.2a4 4 0 0 1 3.995 -3.8z" /></svg></div>
      <!-- 标签 -->
      <div class="item" @click="toggleMenu('tags')" :class="{active:menutype == 'tags'}" title="标签"><svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-tags"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9.172 5a3 3 0 0 1 2.121 .879l5.71 5.71a3.41 3.41 0 0 1 0 4.822l-3.592 3.592a3.41 3.41 0 0 1 -4.822 0l-5.71 -5.71a3 3 0 0 1 -.879 -2.121v-4.172a3 3 0 0 1 3 -3zm-2.172 4h-.01a1 1 0 1 0 .01 2a1 1 0 0 0 0 -2" /><path d="M14.293 5.293a1 1 0 0 1 1.414 0l4.593 4.592a5.82 5.82 0 0 1 0 8.23l-1.592 1.592a1 1 0 0 1 -1.414 -1.414l1.592 -1.592a3.82 3.82 0 0 0 0 -5.402l-4.592 -4.592a1 1 0 0 1 0 -1.414" /></svg></div>
      <!-- Webdav 同步 -->
      <div class="item" @click="openWebdavDialog" title="WebDAV 同步"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/></svg></div>
      <!-- 手动新增 -->
      <div class="item" @click="openAddPostDialog" title="手动新增收藏链接"><svg xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-file-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" /><path d="M12 11l0 6" /><path d="M9 14l6 0" /></svg></div>
    </div>

    <div class="head-search">
      <el-input v-model="search" style="width:300px" @input="searchPosts" placeholder="全局搜索标题..." />
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
            {{ item.name }} <em>{{ item.list.length }}</em>
          </li>
        </ul>
      </div>
      <div v-show="menutype == 'cate'">
        <div class="page-title">类别</div>
        <ul>
          <li
            v-for="item in catelist"
            :key="item.id"
            @click="selectItemCate(item.id)"
            :class="{ selected: item.id === selectItemCateId }"
          >
            <img 
              v-if="item.logo"
              :src="`https://linux.do${item.logo}`"
              class="category-icon"
            />
            <span :style="{ color: '#' + item.color }">{{ item.name }}</span>
            <em>{{ item.list.length }}</em>
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
    </div>

    <div class="container">
      <el-table :data="tableData.list" v-loading="loading">
        <el-table-column prop="title" label="标题" min-width="300">
          <template v-slot="scope">
            <a :href="scope.row.url" target="_blank">{{ scope.row.title }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="cate" label="类别" width="160">
          <template v-slot="scope">
            <div class="category-cell">
              <img 
                v-if="getCategoryInfo(scope.row.cate)?.uploaded_logo"
                :src="`https://linux.do${getCategoryInfo(scope.row.cate).uploaded_logo.url}`"
                class="category-icon"
              />
              <span :style="{ color: '#' + getCategoryInfo(scope.row.cate)?.color }">
                {{ scope.row.cate }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="tags" label="标签" width="200">
          <template v-slot="scope">
            {{ scope.row.tags.join('，') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right" v-if="this.menutype == 'folder'">
          <template v-slot="scope">
            <el-button type="primary" @click="openMoveDialog(scope.row)">修改</el-button>
            <el-button type="danger" @click="openDelDialog(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  
  <transition name="fade">
    <div class="gotop" v-show="showGoTop" @click="gotop"><svg  xmlns="http://www.w3.org/2000/svg"  width="50"  height="50"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-square-chevron-up"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19 2a3 3 0 0 1 3 3v14a3 3 0 0 1 -3 3h-14a3 3 0 0 1 -3 -3v-14a3 3 0 0 1 3 -3zm-6.387 7.21a1 1 0 0 0 -1.32 .083l-3 3l-.083 .094a1 1 0 0 0 .083 1.32l.094 .083a1 1 0 0 0 1.32 -.083l2.293 -2.292l2.293 2.292l.094 .083a1 1 0 0 0 1.32 -1.497l-3 -3z" /></svg></div>
  </transition>

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

  <!-- Webdav 同步 -->
  <el-dialog v-model="WebdavDialog" title="收藏夹 WebDAV 同步设置" width="550">
    <el-form :model="webdavConfig" label-width="100px">
      <el-form-item label="服务器地址">
        <el-input v-model="webdavConfig.serverUrl" placeholder="https://example.com/dav/"/>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="webdavConfig.username" placeholder="用户名"/>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="webdavConfig.password" placeholder="密码"/>
      </el-form-item>
    </el-form>
    <div class="webdav-actions">
      <el-button type="primary" @click="saveWebDAVConfig">保存配置</el-button>
    </div>

    <el-divider>云端同步操作</el-divider>
    <div class="webdav-sync-actions">
      <el-button type="primary" @click="exportToWebDAV" :loading="exporting">导出到 WebDAV</el-button>
      <el-button type="primary" @click="importFromWebDAV" :loading="importing">从 WebDAV 导入</el-button>
    </div>
    <el-divider>手动同步操作</el-divider>
    <el-button type="primary" @click="exportData">导出 json 文件</el-button>
    <label for="file-upload" class="el-button el-button--primary">导入 json 文件</label>
    <input id="file-upload" type="file" @change="importData" style="display: none" />
  </el-dialog>

  <!-- 手动新增收藏链接 -->
  <el-dialog v-model="addPostDialogVisible" title="添加书签" width="550" class="addPost">
    <el-input
      v-model="autoaccessstr"
      :rows="2"
      type="textarea"
      placeholder="https://linux.do/t/topic/309543/372"
    />
    <el-button type="primary" @click="autoAccess" :loading="autoAccessLoading">自动解析</el-button>
    <hr>
    <div class="item">
      <label>URL：<span>*</span></label>
      <el-input v-model="addPost.url" />
    </div>
    <div class="item">
      <label>标题：<span>*</span></label>
      <el-input v-model="addPost.title" />
    </div>
    <div class="item">
      <label>分类：</label>
      <el-input v-model="addPost.cate" />
    </div>
    <div class="item">
      <label>标签：</label>
      <el-input v-model="addPost.tags" placeholder="使用英文逗号,相连" />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="addPostDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="setAddAccess">添加</el-button>
      </div>
    </template>
  </el-dialog>

</template>

<script>
// WebDAVClient 类定义
class WebDAVClient {
  constructor(serverUrl, username, password) {
    if (!serverUrl || typeof serverUrl !== 'string') {
      throw new Error('服务器地址不能为空');
    }
    this.serverUrl = serverUrl.endsWith('/') ? serverUrl : serverUrl + '/';
    this.auth = 'Basic ' + btoa(username + ':' + password);
  }

  async request(method, path, data = null, headers = {}) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      // 移除路径开头的斜杠，并编码路径中的特殊字符
      path = path.replace(/^\/+/, '');
      const url = this.serverUrl + path;
      
      xhr.open(method, url, true);
      
      // 添加认证头
      xhr.setRequestHeader('Authorization', this.auth);
      
      // 添加其他头部
      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });

      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(new Error(`请求失败: ${xhr.status} ${xhr.statusText}`));
        }
      };

      xhr.onerror = function() {
        reject(new Error('网络请求失败'));
      };

      // 正确地处理请求体
      if (data) {
        // 如果是字符串，直接发送
        if (typeof data === 'string') {
          xhr.send(data);
        } 
        // 如果是对象，转换为JSON字符串
        else if (typeof data === 'object') {
          xhr.send(JSON.stringify(data));
        }
      } else {
        xhr.send();
      }
    });
  }

  async putFile(path, content) {
    return this.request('PUT', path, content, {
      'Content-Type': 'application/json;charset=UTF-8'
    });
  }

  async getFile(path) {
    return this.request('GET', path);
  }

  async exists(path) {
    try {
      await this.request('PROPFIND', path, null, {
        'Depth': '0'
      });
      return true;
    } catch (e) {
      if (e.message.includes('404')) {
        return false;
      }
      throw e;
    }
  }

  async createDirectory(path) {
    return this.request('MKCOL', path);
  }
}

import categoryMap from "./data/categoryMap.js";
export default {
  data() {
    return {
      loading: false,
      categoryMap: categoryMap.categoryMap,

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

      // webdav 同步
      WebdavDialog: false,
      webdavConfig: {
        serverUrl: '',
        username: '',
        password: '',
        folder: 'linuxdo-scripts-backup/', // 默认文件夹
        filename: JSON.stringify(localStorage.getItem("bookmarkData")),
      },
      importing: false,
      exporting: false,

      showGoTop: false, // 控制返回顶部按钮的显示

      // 搜索功能
      search: "",

      // 手动新增收藏链接
      addPostDialogVisible: false,
      autoaccessstr: "", // 自动填充
      autoAccessLoading: false,
      addPost: {
        url: "",
        title: "",
        cate: "",
        tags: "",
      }
    }
  },
  computed: {
    filteredCategories() {
      return this.bookmarklist.filter((item) => item.id !== this.selectedItemId)
    },
  },
  methods: {
    // 搜索帖子标题关键词
    searchPosts() {
      if (this.search == "") {
        // this.tableData = this.bookmarklist[this.selectedItemId];
        this.tableData = this.bookmarklist.find(item => item.id === this.selectedItemId);
        return false;
      }
      
      const keyword = this.search.toLowerCase();
      const results = [];
      
      this.bookmarklist.forEach(folder => {
        const matches = folder.list.filter(post => 
          post.title.toLowerCase().includes(keyword)
        );
        results.push(...matches);
      });

      // 将结果转换为所需格式
      const searchResults = {
        id: -1,
        name: "搜索",
        list: results
      };
      
      this.tableData = searchResults;
      
      return searchResults;
      },
    // 模拟加载刷新
    Loading() {
      this.search = "";
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 100);
    },
    // 切换左侧页面类型
    toggleMenu(val) {
      this.menutype = val;
      this.selectedItemId = -1;
      this.selectItemCateId = -1;
      this.selectItemTagsId = -1;
    },
    selectItem(id) {
      this.selectedItemId = id;
      this.tableData = this.bookmarklist.find(item => item.id === id);
      console.log(this.tableData);
      
      this.Loading();
    },
    init() {
      this.selectedItemId = this.bookmarklist[0].id;
      this.tableData = this.bookmarklist[0]
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
      this.AdmindialogVisible = false;
      this.initPostCategory();
      this.initPostTags();
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

      // 查找目标文件夹
      const targetCategory = this.bookmarklist.find(
        (item) => item.id === this.targetCategoryId
      )

      // 在所有文件夹中查找并移除项目
      let itemMoved = false;
      this.bookmarklist.forEach(folder => {
        const index = folder.list.findIndex(item => item === this.currentMoveItem);
        if (index > -1) {
          folder.list.splice(index, 1);
          itemMoved = true;
        }
      });

      // 添加到目标文件夹
      if (itemMoved) {
        targetCategory.list.push(this.currentMoveItem);
        
        // 根据当前视图更新显示
        if (this.menutype === 'tags') {
          this.initPostTags();
          // 检查索引是否仍然有效
          if (this.selectItemTagsId >= this.tagslist.length) {
            this.selectItemTagsId = Math.max(0, this.tagslist.length - 1);
          }
          this.tableData = this.tagslist.length > 0 ? this.tagslist[this.selectItemTagsId] : { list: [] };
        } 
        else if (this.menutype === 'cate') {
          this.initPostCategory();
          // 检查索引是否仍然有效
          if (this.selectItemCateId >= this.catelist.length) {
            this.selectItemCateId = Math.max(0, this.catelist.length - 1);
          }
          this.tableData = this.catelist.length > 0 ? this.catelist[this.selectItemCateId] : { list: [] };
        }
        else {
          // this.tableData = this.bookmarklist[this.selectedItemId];
          this.tableData = this.bookmarklist.find(item => item.id === this.selectedItemId);
        }

        this.$message.success('收藏夹转移成功！');
        this.moveDialogVisible = false;
        localStorage.setItem('bookmarkData', JSON.stringify(this.bookmarklist));
        this.Loading();
      }
    },

    openDelDialog(row) {
      this.deleteRow = row // 保存要删除的行数据
      this.delDialogVisible = true // 显示删除对话框
    },

    // 删除指定帖子
    confirmDelete() {
      // 从所有文件夹中查找并删除该项目
      this.bookmarklist.forEach(folder => {
        const index = folder.list.findIndex(item => item === this.deleteRow);
        if (index > -1) {
          folder.list.splice(index, 1);
        }
      });

      // 如果在标签视图下，也需要更新 tagslist
      if (this.menutype === 'tags') {
        this.initPostTags(); // 重新初始化标签列表
        // 检查索引是否仍然有效
        if (this.selectItemTagsId >= this.tagslist.length) {
          this.selectItemTagsId = Math.max(0, this.tagslist.length - 1);
        }
        this.tableData = this.tagslist.length > 0 ? this.tagslist[this.selectItemTagsId] : { list: [] };
      } 
      // 如果在分类视图下，更新 catelist
      else if (this.menutype === 'cate') {
        this.initPostCategory(); // 重新初始化分类列表
        // 检查索引是否仍然有效
        if (this.selectItemCateId >= this.catelist.length) {
          this.selectItemCateId = Math.max(0, this.catelist.length - 1);
        }
        this.tableData = this.catelist.length > 0 ? this.catelist[this.selectItemCateId] : { list: [] };
      }
      // 如果在文件夹视图下，更新当前文件夹数据
      else {
        // this.tableData = this.bookmarklist[this.selectedItemId];
        this.tableData = this.bookmarklist.find(item => item.id === this.selectedItemId);
      }

      this.delDialogVisible = false;
      this.deleteRow = null;
      localStorage.setItem('bookmarkData', JSON.stringify(this.bookmarklist));
      this.$message.success('删除成功！');
      this.initPostCategory();
      this.initPostTags();
      this.Loading();
    },

    // 手动导出书签数据
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
    // 手动导入书签数据
    importData(event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target.result)
            // 简单的验证数据结构
            if (Array.isArray(data)) {

              // 创建一个 Map 用于存储按 name 分组的数据
              const mergedMap = new Map();
              
              // 先处理现有数据
              this.bookmarklist.forEach(bookmark => {
                if (mergedMap.has(bookmark.name)) {
                  // 如果已存在相同 name，合并 list
                  mergedMap.get(bookmark.name).list.push(...bookmark.list);
                } else {
                  // 不存在则添加新条目
                  mergedMap.set(bookmark.name, { 
                    id: bookmark.id,
                    name: bookmark.name,
                    list: [...bookmark.list]
                  });
                }
              });

              // 处理新数据
              data.forEach(bookmark => {
                if (mergedMap.has(bookmark.name)) {
                  // 存在相同 name 则合并 list
                  mergedMap.get(bookmark.name).list.push(...bookmark.list);
                } else {
                  // 不存在则添加新条目
                  mergedMap.set(bookmark.name, {
                    id: bookmark.id,
                    name: bookmark.name,
                    list: [...bookmark.list]
                  });
                }
              });

              // 对每个分组的 list 去重
              mergedMap.forEach(bookmark => {
                const uniqueUrls = new Map();
                bookmark.list = bookmark.list.filter(item => {
                  if (!uniqueUrls.has(item.url)) {
                    uniqueUrls.set(item.url, true);
                    return true;
                  }
                  return false;
                });
              });

              // 转换回数组形式
              this.bookmarklist = Array.from(mergedMap.values());

              // this.tableData = this.bookmarklist[this.selectedItemId]
              this.tableData = this.bookmarklist.find(item => item.id === this.selectedItemId);
              localStorage.setItem(
                'bookmarkData',
                JSON.stringify(this.bookmarklist)
              )
              this.$message.success('导入成功');
              this.Loading();
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
          const categoryInfo = this.categoryMap.find(c => c.name === item.cate);
          
          if (existingCategory) {
            existingCategory.list.push(item);
          } else {
            acc.push({
              id: acc.length,
              name: item.cate,
              list: [item],
              color: categoryInfo?.color || '',
              logo: categoryInfo?.uploaded_logo?.url || ''
            });
          }
        });
        
        return acc;
      }, []);
    },
    selectItemCate(id) {
      this.selectItemCateId = id;
      this.tableData = this.catelist[this.selectItemCateId];
      this.Loading();
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
      this.selectItemTagsId = id;
      this.tableData = this.tagslist[this.selectItemTagsId];
      this.Loading();
    },

    /*
    * webdav 同步
    */
    openWebdavDialog() {
      this.WebdavDialog = true;
    },
    // 获取完整的文件路径
    getFullPath() {
      let folder = this.webdavConfig.folder.trim()
      // 确保文件夹路径以/开头和结尾
      if (!folder.startsWith('/')) folder = '/' + folder
      if (!folder.endsWith('/')) folder = folder + '/'
      return folder + this.webdavConfig.filename.trim()
    },

    // 导出方法
    async exportToWebDAV() {
      try {
        this.exporting = true;
        const config = JSON.parse(localStorage.getItem('webdavConfig'));
        if (!config) {
          throw new Error('请先配置 WebDAV 信息');
        }

        const client = new WebDAVClient(
          config.serverUrl,
          config.username,
          atob(config.password)
        );

        // 规范化文件夹路径
        let folder = config.folder || '';
        folder = folder.replace(/^\/+|\/+$/g, ''); // 移除开头和结尾的斜杠
        if (folder) {
          folder += '/';
        }

        // 确保文件夹存在
        if (folder) {
          try {
            const exists = await client.exists(folder);
            if (!exists) {
              await client.createDirectory(folder);
            }
          } catch (error) {
            throw new Error('创建文件夹失败：' + error.message);
          }
        }

        // 正确构建文件路径
        const filePath = folder + 'bookmarks.json';  // 使用固定的文件名
        
        // 将数据转换为 JSON 字符串
        const bookmarkData = JSON.stringify(this.bookmarklist);

        // 上传文件
        await client.putFile(filePath, bookmarkData);
        
        this.$message.success('导出到 WebDAV 成功');
      } catch (error) {
        console.error('导出错误：', error);
        this.$message.error('导出失败：' + error.message);
      } finally {
        this.exporting = false;
      }
    },

    // 导入方法
    async importFromWebDAV() {
      try {
        this.importing = true;
        const config = JSON.parse(localStorage.getItem('webdavConfig'));
        if (!config) {
          throw new Error('请先配置 WebDAV 信息');
        }

        const client = new WebDAVClient(
          config.serverUrl,
          config.username,
          atob(config.password)
        );

        // 规范化文件夹路径
        let folder = config.folder || '';
        folder = folder.replace(/^\/+|\/+$/g, ''); // 移除开头和结尾的斜杠
        if (folder) {
          folder += '/';
        }

        // 使用和导出相同的文件路径
        const filePath = folder + 'bookmarks.json';

        // 检查文件是否存在
        const exists = await client.exists(filePath);
        if (!exists) {
          throw new Error('WebDAV 服务器上未找到书签文件');
        }

        // 读取文件内容
        const content = await client.getFile(filePath);
        
        try {
          // 解析 JSON 数据
          const data = JSON.parse(content);
          if (Array.isArray(data)) {
     
             // 创建一个 Map 用于存储按 name 分组的数据
            const mergedMap = new Map();
            
            // 先处理现有数据
            this.bookmarklist.forEach(bookmark => {
              if (mergedMap.has(bookmark.name)) {
                // 如果已存在相同 name，合并 list
                mergedMap.get(bookmark.name).list.push(...bookmark.list);
              } else {
                // 不存在则添加新条目
                mergedMap.set(bookmark.name, { 
                  id: bookmark.id,
                  name: bookmark.name,
                  list: [...bookmark.list]
                });
              }
            });

            // 处理新数据
            data.forEach(bookmark => {
              if (mergedMap.has(bookmark.name)) {
                // 存在相同 name 则合并 list
                mergedMap.get(bookmark.name).list.push(...bookmark.list);
              } else {
                // 不存在则添加新条目
                mergedMap.set(bookmark.name, {
                  id: bookmark.id,
                  name: bookmark.name,
                  list: [...bookmark.list]
                });
              }
            });

            // 对每个分组的 list 去重
            mergedMap.forEach(bookmark => {
              const uniqueUrls = new Map();
              bookmark.list = bookmark.list.filter(item => {
                if (!uniqueUrls.has(item.url)) {
                  uniqueUrls.set(item.url, true);
                  return true;
                }
                return false;
              });
            });

            // 转换回数组形式
            this.bookmarklist = Array.from(mergedMap.values());

            // this.tableData = this.bookmarklist[this.selectedItemId];
            this.tableData = this.bookmarklist.find(item => item.id === this.selectedItemId);
            localStorage.setItem('bookmarkData', JSON.stringify(this.bookmarklist));
            this.initPostCategory();
            this.initPostTags();
            this.$message.success('从 WebDAV 导入成功');
            this.Loading();
          } else {
            throw new Error('导入的数据格式不正确');
          }
        } catch (e) {
          throw new Error('解析导入的数据失败：' + e.message);
        }
      } catch (error) {
        console.error('导入错误：', error);
        this.$message.error('导入失败：' + error.message);
      } finally {
        this.importing = false;
      }
    },

    async checkAndRequestPermission(url) {
      var browserAPI = (typeof browser !== 'undefined' ? browser : chrome);
      try {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          throw new Error('URL 必须以 http://或 https://开头');
        }

        let origin;
        try {
          const cleanUrl = url.replace(/\/$/, '');
          origin = new URL(cleanUrl).origin + "/*";
        } catch (e) {
          throw new Error('无效的 URL 格式');
        }

        try {
          const existingPermissions = await browserAPI.permissions.contains({
            origins: [origin]
          });

          if (!existingPermissions) {
            const granted = await browserAPI.permissions.request({
              origins: [origin]
            });

            if (!granted) {
              throw new Error('用户拒绝了权限请求');
            }
          }
        } catch (e) {
          console.error('权限请求错误：', e);
          throw new Error('权限请求失败，请确保 URL 正确且已授予权限');
        }
        
        return true;
      } catch (error) {
        throw error;
      }
    },

    // 保存配置
    async saveWebDAVConfig() {
      // const hasPermission = await this.requestWebDAVPermission(this.webdavConfig.serverUrl);
      // if(!hasPermission) {
      //   return false;
      // }
      try {
        // 先验证所有必填字段是否存在且不为空
        const config = {
          serverUrl: (this.webdavConfig?.serverUrl || '').trim(),
          username: (this.webdavConfig?.username || '').trim(),
          password: this.webdavConfig?.password || '',
          folder: 'linuxdo-scripts-backup/',
          filename: JSON.stringify(localStorage.getItem("bookmarkData")),
        };

        // 验证必填字段
        const requiredFields = {
          '服务器地址': config.serverUrl,
          '用户名': config.username,
          '密码': config.password,
          '文件名': config.filename
        };

        for (const [field, value] of Object.entries(requiredFields)) {
          if (!value) {
            throw new Error(`${field}不能为空`);
          }
        }

        // 验证 URL 格式
        if (!config.serverUrl.startsWith('http://') && !config.serverUrl.startsWith('https://')) {
          throw new Error('服务器地址必须以 http:// 或 https:// 开头');
        }

        try {
          // 测试 URL 是否有效
          new URL(config.serverUrl);
        } catch (e) {
          throw new Error('无效的服务器地址格式');
        }

        // 规范化 URL 和文件夹路径
        config.serverUrl = config.serverUrl.endsWith('/') ? config.serverUrl : config.serverUrl + '/';
        config.folder = config.folder.endsWith('/') ? config.folder : config.folder + '/';
        config.folder = config.folder.startsWith('/') ? config.folder.substring(1) : config.folder;

        // 请求权限
        await this.checkAndRequestPermission(config.serverUrl);

        // 创建客户端并测试连接
        const client = new WebDAVClient(
          config.serverUrl,
          config.username,
          config.password
        );

        try {
          await client.exists('/');
        } catch (e) {
          console.error('连接测试失败：', e);
          throw new Error('无法连接到 WebDAV 服务器，请检查配置是否正确');
        }

        // 存储配置
        localStorage.setItem('webdavConfig', JSON.stringify({
          ...config,
          password: btoa(config.password)
        }));

        this.$message.success('WebDAV 配置保存成功');
      } catch (error) {
        console.error('保存配置错误：', error);
        this.$message.error(error.message || '保存配置失败');
      }
    },

    async requestWebDAVPermission(webdavUrl) {
      const url = new URL(webdavUrl);
      const pattern = `${url.protocol}//${url.hostname}/*`;
      
      try {
        const granted = await chrome.permissions.request({
          origins: [pattern]
        });
        return granted;
      } catch (err) {
        console.error('Permission request failed:', err);
        return false;
      }
    },

    // 给帖子类别增加颜色
    getCategoryInfo(cateName) {
      return this.categoryMap.find(cat => cat.name === cateName);
    },

    // gotop 点击返回顶部
    handleScroll() {
      // 当滚动超过 200px 时显示按钮
      this.showGoTop = window.scrollY > 200
    },
    gotop() {
      const currentPosition = window.pageYOffset || document.documentElement.scrollTop
      if (currentPosition > 0) {
        window.requestAnimationFrame(this.gotop)
        window.scrollTo(0, currentPosition - currentPosition / 8)
      }
    },

    /*
    * 手动新增收藏链接
    */
    openAddPostDialog() {
      this.addPostDialogVisible = true;
    },
    // 匹配类别 ID
    getCategoryNameById(categoryId) {
      const category = this.categoryMap.find((item) => item.id === categoryId);
      return category ? category.name : '';
    },
    clearAccess() {
      this.autoaccessstr = "";
      this.addPost = {
        url: "",
        title: "",
        cate: "",
        tags: "",
      }
    },
    // 自动填充
    async autoAccess() {
      this.autoAccessLoading = true;
      try {
        // 使用 URL 对象方便地解析 URL
        const url = new URL(this.autoaccessstr);
        const pathname = url.pathname; // e.g., "/t/topic/309543/372"
        const [section, topic, id, page] = pathname.split('/').filter(Boolean); // 拆分路径部分

        fetch(`https://linux.do/t/${id}.json`)
          .then((response) => response.json())
          .then((data) => {
            this.addPost = {
              url: `https://linux.do/t/topic/${id}`,
              title: data.title,
              cate: this.getCategoryNameById(data.category_id),
              tags: Array.isArray(data.tags) ? data.tags.join(',') : data.tags,
            }
            this.autoAccessLoading = false;
            this.$message.success("解析成功，正在填充数据...");
          });

      } catch (error) {
        console.error("Invalid URL format:", error.message);
        this.$message.error("解析失败！");
        this.autoAccessLoading = false;
      }
      
    },

    // 确认填充
    setAddAccess() {
      if(this.addPost.title == '' || this.addPost.url == '') {
        this.$message('请勿留空必填项！')
        return false;
      }
      this.addPostDialogVisible = false;
      // 确保 tags 是数组结构，将字符串以逗号分隔成数组，并去除多余空格
      const tagsArr = this.addPost.tags.split(',').map(tag => tag.trim());
      this.bookmarklist[0].list.unshift({
        url: this.addPost.url,
        title: this.addPost.title,
        cate: this.addPost.cate,
        tags: tagsArr,
      });
      this.initPostCategory();
      this.initPostTags();
      this.Loading();
      localStorage.setItem('bookmarkData', JSON.stringify(this.bookmarklist));
      this.$message.success("新增成功！");
      this.clearAccess();
    }
    
  },
  mounted() {
    // 添加滚动监听
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    // 组件销毁前移除监听
    window.removeEventListener('scroll', this.handleScroll)
  },
  created() {
    const bookmarkData = localStorage.getItem('bookmarkData')
    if (bookmarkData && JSON.parse(bookmarkData).length > 0) {
      this.bookmarklist = JSON.parse(bookmarkData)
    } else {
      localStorage.setItem('bookmarkData', JSON.stringify(this.bookmarklist))
    }
    this.init();
    const vm = this
    const browserAPI = (typeof browser !== 'undefined' ? browser : chrome);
    browserAPI.storage.local.get('bookmarkData', (result) => {
      if (result.bookmarkData) {
        // 检查是否已有相同的 URL
        const isUrlExist = vm.bookmarklist.some((bookmarkGroup) =>
          bookmarkGroup.list.some(
            (item) => item.url === result.bookmarkData.url
          )
        )

        if (!isUrlExist) {
        // 先检查是否存在 id 为 0 的列表
        let defaultList = vm.bookmarklist.find(item => item.id === 0);
        
        // 如果不存在，创建默认列表并添加到 bookmarklist
        if (!defaultList) {
          defaultList = {
            id: 0,
            name: "默认", 
            list: []
          };
          vm.bookmarklist.unshift(defaultList);
        }

        // 添加书签数据
        vm.bookmarklist.find(item => item.id === 0).list.unshift(result.bookmarkData);
        vm.tableData = vm.bookmarklist[0];
        this.selectedItemId = 0;
        
        this.initPostCategory();
        this.initPostTags();
        this.Loading();
        localStorage.setItem('bookmarkData', JSON.stringify(vm.bookmarklist));
        }

        // 处理完后立即清除 storage 中的数据
        browserAPI.storage.local.remove('bookmarkData');
      }
    })

    this.initPostCategory();
    this.initPostTags();
    this.Loading();

    // 加载 WebDAV 配置
    const webdavConfig = localStorage.getItem('webdavConfig');
    if (webdavConfig) {
      this.webdavConfig = JSON.parse(webdavConfig)
      this.webdavConfig.password = atob(this.webdavConfig.password)
    }

  },
}
</script>
