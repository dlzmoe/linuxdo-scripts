<template>
  <div class="body">
    <a-spin :loading="loading">
      <div class="images" v-if="isShow" ref="imagesContainer">
        <div class="images-box">
          <div class="title">{{ imagesData.title }}</div>
          <div class="author">
            <span>{{ imagesData.details.created_by.name || imagesData.details.created_by.username }}</span>
            <span>{{ formatDate(imagesData.created_at) }}</span>
          </div>
          <div class="markdown-body text" v-html="imagesData.post_stream.posts[0].cooked"></div>
        </div>
      </div>
      <div class="images" v-else>
        <a-empty />
      </div>
    </a-spin>
    <div class="container">
      <a-input v-model="postslink" placeholder="https://linux.do/t/topic/309543" />
      <a-button type="primary" style="margin-top:10px" @click="parseLink" :loading="loading">解析链接</a-button>
      <div v-if="isShow">
        <a-divider />
        <a-space>
          <a-button @click="copyToImage" :loading="loading1">复制图片</a-button>
          <a-button @click="downloadAsImage" :loading="loading2">下载图片</a-button>
        </a-space>
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
      if (this.postslink == '') {
        this.$message.warning("请输入链接！");
        return false;
      }
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
        this.$message.success("解析成功！");
      } catch (error) {
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

    async htmlToCanvas() {
      try {
        if (!this.$refs.imagesContainer) {
          throw new Error('Element not found');
        }

        // 先处理所有图片
        const images = this.$refs.imagesContainer.querySelectorAll('img');
        const imagePromises = Array.from(images).map(img => {
          return new Promise((resolve) => {
            // 创建新的 Image 对象
            const imgElement = new Image();
            imgElement.onload = function () {
              // 创建 canvas 转换图片
              const canvas = document.createElement('canvas');
              canvas.width = imgElement.width;
              canvas.height = imgElement.height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(imgElement, 0, 0);
              // 替换原始图片的 src 为 canvas 生成的 base64
              img.src = canvas.toDataURL('image/jpeg');
              resolve();
            };
            imgElement.onerror = resolve; // 即使加载失败也继续处理
            imgElement.src = img.src; // 使用原始图片的 src
          });
        });

        // 等待所有图片处理完成
        await Promise.all(imagePromises);

        // 等待一帧确保 DOM 更新
        await new Promise(resolve => requestAnimationFrame(resolve));

        // 生成最终的 canvas
        const canvas = await html2canvas(this.$refs.imagesContainer, {
          scale: 2,
          logging: false,
          backgroundColor: '#ffffff',
          useCORS: false, // 因为已经转换成 base64 了，不需要跨域
          allowTaint: true
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
