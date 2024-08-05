<template>
  <div id="linuxdoscripts">
    <div class="linuxdoscripts-opacity" v-if="opacity"></div>
    <el-button class="setting-btn" @click="setting" type="primary">
      <svg
        class="fa d-icon d-icon-cog svg-icon svg-string"
        xmlns="http://www.w3.org/2000/svg"
      >
        <use href="#cog"></use>
      </svg>
    </el-button>

    <dialog open v-show="open" id="menu_suspendedball">
      <div class="title">设置</div>
      <div class="close" @click="closedialog">+</div>
      <div class="menu-body">
        <p class="hint">请注意，该设置面板数据全部保存在本地浏览器缓存中，注意备份。</p>
        <!-- 新标签页打开 -->
        <MenuOpenpostblank v-model="settingData.checked1" />
        <!-- 新话题提醒 -->
        <MenuNewtopicreminder v-model="settingData.checked2" />
        <!-- 自动展开回复 -->
        <MenuAutoexpandreply v-model="settingData.checked3" />
        <!-- 话题列表显示创建时间 -->
        <MenuShowcreatetime v-model="settingData.checked4" />
        <!-- 显示楼层数 -->
        <MenuShowfloors v-model="settingData.checked5" />
        <!-- 隐藏话题详情顶部大标题 -->
        <MenuHidetopicdetailtitle v-model="settingData.checked6" />
        <!-- 话题预览功能 -->
        <MenuTopicpreview v-model="settingData.checked7" />
        <!-- 自定义快捷回复 -->
        <MenuCreatereply v-model="settingData.QuickReply" />
        <!-- 屏蔽指定用户 -->
        <MenuBlockuserlist v-model="settingData.blockList" />
      </div>
      <!-- <div class="item">
        <div class="tit">屏蔽用户列表（使用英文，分隔）</div>
        <textarea id="blockuserlist" placeholder="user1,user2,user3"></textarea>
      </div> -->
      <!-- <div class="item">
        <div class="tit">自定义快捷回复（换行分隔）</div>
        <textarea id="customquickreply" placeholder="前排~">
前排围观~
你好啊</textarea>
      </div> -->
      <div class="menu-footer">
        <button class="btn save" @click="save">保存</button>
        <button class="btn floorlottery">楼层抽奖</button>
        <button class="btn import">导入</button>
        <input type="file" id="fileInput" style="display: none" accept=".json" />
        <button class="btn export">导出</button>
      </div>
    </dialog>

    <dialog open class="floorlotterywrap">
      <div>
        <label for="totalFloors">总楼层：</label>
        <input type="number" id="totalFloors" min="1" />
      </div>
      <div>
        <label for="numToDraw">需要抽取的个数：</label>
        <input type="number" id="numToDraw" min="1" />
      </div>
      <button id="floorlotterdrawButton" class="btn">确定</button>
      <button id="floorlotterclose" class="btn">关闭</button>
      <div id="floorlotterloading" style="display: none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="icon icon-tabler icons-tabler-outline icon-tabler-loader"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M12 6l0 -3" />
          <path d="M16.25 7.75l2.15 -2.15" />
          <path d="M18 12l3 0" />
          <path d="M16.25 16.25l2.15 2.15" />
          <path d="M12 18l0 3" />
          <path d="M7.75 16.25l-2.15 2.15" />
          <path d="M6 12l-3 0" />
          <path d="M7.75 7.75l-2.15 -2.15" />
        </svg>
      </div>
      <div id="result"></div>
    </dialog>
  </div>
</template>

<script>
import MenuOpenpostblank from "./components/MenuOpenpostblank.vue";
import MenuNewtopicreminder from "./components/MenuNewtopicreminder.vue";
import MenuAutoexpandreply from "./components/MenuAutoexpandreply.vue";
import MenuShowcreatetime from "./components/MenuShowcreatetime.vue";
import MenuShowfloors from "./components/MenuShowfloors.vue";
import MenuHidetopicdetailtitle from "./components/MenuHidetopicdetailtitle.vue";
import MenuTopicpreview from "./components/MenuTopicpreview.vue";
import MenuCreatereply from "./components/MenuCreatereply.vue";
import MenuBlockuserlist from "./components/MenuBlockuserlist.vue";
export default {
  components: {
    MenuOpenpostblank,
    MenuNewtopicreminder,
    MenuAutoexpandreply,
    MenuShowcreatetime,
    MenuShowfloors,
    MenuHidetopicdetailtitle,
    MenuTopicpreview,
    MenuCreatereply,
    MenuBlockuserlist,
  },
  data() {
    return {
      opacity: false, // 透明度
      open: false,

      // 设置数据
      settingData: {
        checked1: false,
        checked2: false,
        checked3: false,
        checked4: false,
        checked5: false,
        checked6: false,
        checked7: false,
        checked8: false,
        checked9: false,
        QuickReply: "",
        blockList: "",
      },
    };
  },
  methods: {
    // 打开设置弹窗
    setting() {
      this.opacity = true;
      this.open = true;
    },
    // 关闭弹窗
    closedialog() {
      this.opacity = false;
      this.open = false;
    },
    // 保存设置
    save() {
      console.log(this.settingData);
      localStorage.setItem("linxudoscriptssetting", JSON.stringify(this.settingData));

      this.$message.success("保存成功！");
      this.opacity = false;
      this.open = false;
    },
    runscripts() {
      $(".signature-img").each(function () {
        var self = $(this);
        if (self.siblings(".signature-p").length < 1) {
          var url = self.attr("src");

          // 先判断是否带 http
          if (url.indexOf("http") < 0) {
            self.after(
              `<p class="signature-p">${url}（该用户签名非图片格式，已自动转文字）</p>`
            );
            self.hide();
          } else {
            // 在带 http 的链接中判断是否是域名，大几率是博客域名
            var str = url.replace(/\/+$/, "");
            var domainPattern = /\.(com|org|net|edu|gov|co|cn|io|info|biz|me|us|uk|au|de|fr|jp|ru|ch|it|nl|se|no|es|mil|int|arpa|asia|museum|name|pro|coop|aero|cat|jobs|mobi|travel|xxx|idv|tv|cc|ws|bz|nu|tk|fm|ag|am|at|be|bg|cd|cf|cg|ch|cl|cm|cz|dk|dm|ec|ee|es|eu|fi|ga|gd|gf|gg|gl|gp|gr|hm|hr|ht|hu|im|io|is|je|ke|kg|ki|kr|kz|la|lc|li|lt|lu|lv|ma|mc|md|ms|mt|mu|mx|my|nf|ng|nl|no|nz|pa|pe|pf|pg|pl|pm|pn|pr|pt|pw|re|ro|rs|sa|sb|sc|sg|sh|si|sk|sm|sn|so|st|su|sx|tc|tf|tk|tl|tm|to|tr|tt|tw|ua|ug|uy|uz|vc|ve|vg|vn|vu|wf|xyz|yt|za|zm|zw)$/i;

            if (domainPattern.test(url)) {
              self.after(
                `<p class="signature-p">${url}（该用户签名非图片格式，已自动转文字）</p>`
              );
              self.hide();
            } else if (url.indexOf("photos.google.com") !== -1) {
              // 判断是否是 google photo
              self.after(
                `<p class="signature-p">${url}（该用户签名非图片格式，已自动转文字）</p>`
              );
              self.hide();
            }
          }
        }
      });
    },
  },
  created() {
    const linxudoscriptssetting = localStorage.getItem("linxudoscriptssetting");
    if (linxudoscriptssetting) {
      this.settingData = JSON.parse(linxudoscriptssetting);
    }
    setInterval(() => {
      this.runscripts();
    }, 1000);
  },
};
</script>
