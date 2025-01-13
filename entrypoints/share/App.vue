<template>
  <div class="body">
    <div class="images" v-if="isShow" v-loading="loading" ref="imagesContainer" v-show="isShow">
      <div class="title">{{ imagesData.title }}</div>
      <div class="author">
        <span>{{ imagesData.details.created_by.name || imagesData.details.created_by.username }}</span>
        <span>{{ formatDate(imagesData.created_at) }}</span>
      </div>
      <div class="markdown-body text" v-html="imagesData.post_stream.posts[0].cooked"></div>
    </div>
    <div class="images" v-else v-loading="loading">
      <el-empty description="暂无数据" />
    </div>
    <div class="container">
      <el-input v-model="postslink" placeholder="https://linux.do/t/topic/309543" />
      <el-button style="margin-top:10px" type="primary" @click="parseLink" :loading="loading">解析链接</el-button>
      <div v-if="isShow">
        <hr>
        <el-button type="primary" @click="copyToImage" :loading="loading1">复制图片</el-button>
        <el-button type="primary" @click="downloadAsImage" :loading="loading2">下载图片</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas';

export default {
  data() {
    return {
      isShow: false,
      postslink: "",
      loading: false,
      loading1: false,
      loading2: false,
      imagesData: {},
    }
  },
  methods: {
    // 解析链接
    async parseLink() {
      this.loading = true;
      try {
        const url = new URL(this.postslink);
        const pathname = url.pathname;
        const [section, topic, id, page] = pathname.split('/').filter(Boolean);

        function convertOneboxToLink(data) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(data.post_stream.posts[0].cooked, 'text/html');
          const oneboxElements = doc.querySelectorAll('.onebox');

          oneboxElements.forEach(onebox => {
            const oneboxSrc = onebox.getAttribute('data-onebox-src');
            if (oneboxSrc) {
              const link = doc.createElement('a');
              link.href = oneboxSrc;
              link.textContent = oneboxSrc;
              onebox.parentNode.replaceChild(link, onebox);
            }
          });
          data.post_stream.posts[0].cooked = doc.body.innerHTML;
          return data;
        }

        const response = await fetch(`https://linux.do/t/${id}.json`);
        const data = await response.json();
        const processedData = convertOneboxToLink(data);
        this.imagesData = processedData;
        this.isShow = true;
        // 等待 DOM 更新
        await this.$nextTick();
        this.loading = false;
      } catch (error) {
        console.error("Invalid URL format:", error.message);
        this.$message.error("解析失败！");
        this.loading = false;
      }
    },

    // 转化时间格式
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },

    // 将 HTML 转换为 Canvas
    async htmlToCanvas() {
      try {
        if (!this.$refs.imagesContainer) {
          throw new Error('Element not found');
        }

        // 预处理所有图片
        const images = this.$refs.imagesContainer.getElementsByTagName('img');
        await Promise.all(Array.from(images).map(img => {
          return new Promise((resolve, reject) => {
            const newImg = new Image();
            // 设置跨域属性
            newImg.crossOrigin = 'anonymous';
            newImg.onload = () => {
              // 替换原始图片
              img.src = newImg.src;
              resolve();
            };
            newImg.onerror = reject;
            // 添加时间戳避免缓存
            newImg.src = img.src + '?t=' + new Date().getTime();
          });
        }));

        // 等待一帧确保 DOM 更新
        await new Promise(resolve => requestAnimationFrame(resolve));

        const canvas = await html2canvas(this.$refs.imagesContainer, {
          useCORS: true,
          scale: 2,
          logging: true,
          backgroundColor: '#ffffff',
          allowTaint: false,
          foreignObjectRendering: false,
          imageTimeout: 0,
          onclone: (clonedDoc) => {
            // 处理克隆的 DOM
            const clonedImages = clonedDoc.getElementsByTagName('img');
            Array.from(clonedImages).forEach(img => {
              img.crossOrigin = 'anonymous';
            });
          }
        });

        return canvas;
      } catch (error) {
        console.error('转换失败：', error);
        this.$message.error('转换失败');
        return null;
      }
    },

    // 复制为图片
    async copyToImage() {
      this.loading1 = true;
      try {
        const canvas = await this.htmlToCanvas();
        if (!canvas) return;

        canvas.toBlob(async (blob) => {
          try {
            const data = [new ClipboardItem({ 'image/png': blob })];
            await navigator.clipboard.write(data);
            this.$message.success('已复制到剪贴板');
            this.loading1 = false;
          } catch (error) {
            console.error('复制到剪贴板失败：', error);
            this.$message.error('复制失败');
          }
        }, 'image/png');
      } catch (error) {
        console.error('复制失败：', error);
        this.$message.error('复制失败');
        this.loading1 = false;
      }
    },

    // 下载为图片
    async downloadAsImage() {
      this.loading2 = true;
      try {
        const canvas = await this.htmlToCanvas();
        if (!canvas) return;

        const link = document.createElement('a');
        link.download = `${this.imagesData.title || 'download'}.png`;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.$message.success('开始下载');
        this.loading2 = false;
      } catch (error) {
        console.error('下载失败：', error);
        this.$message.error('下载失败');
        this.loading2 = false;
      }
    }
  },
  created() {
    const browserAPI = (typeof browser !== 'undefined' ? browser : chrome);
    browserAPI.storage.local.get('shareID', (result) => {
      if (result.shareID) {
        this.postslink = `https://linux.do/t/topic/${result.shareID}`
        this.parseLink();
        // 处理完后立即清除 storage 中的数据
        browserAPI.storage.local.remove('shareID');
      }
    })
  }
}
</script>
