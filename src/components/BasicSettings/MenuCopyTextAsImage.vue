<template>
    <div class="item">
      <div class="tit">{{ sort }}. 是否开启快捷将选中文本转为图片并复制(快捷键: <kbd>Alt</kbd><kbd>I</kbd>)</div>
      <input
        type="checkbox"
        :checked="modelValue"
        @change="$emit('update:modelValue', $event.target.checked)"
      />
    </div>
  </template>
  
  <script>
  export default {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    data() {
      return {
        isFocusedOnInput: false, // 标记当前是否聚焦在输入框上
      };
    },
    created() {
      if (this.modelValue) {
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('focus', this.handleFocus, true);  // 捕获阶段，监听输入框聚焦
        window.addEventListener('blur', this.handleBlur, true);    // 捕获阶段，监听输入框失焦
      }
    },
    beforeUnmount() {
      window.removeEventListener('keydown', this.handleKeyDown);
      window.removeEventListener('focus', this.handleFocus, true);
      window.removeEventListener('blur', this.handleBlur, true);
    },
    watch: {
      modelValue(newValue) {
        if (newValue) {
          window.addEventListener('keydown', this.handleKeyDown);
          window.addEventListener('focus', this.handleFocus, true);
          window.addEventListener('blur', this.handleBlur, true);
        } else {
          window.removeEventListener('keydown', this.handleKeyDown);
          window.removeEventListener('focus', this.handleFocus, true);
          window.removeEventListener('blur', this.handleBlur, true);
        }
      }
    },
    methods: {
      handleKeyDown(event) {
        if (this.isFocusedOnInput) return;  // 聚焦输入框时不触发
  
        if (event.altKey && event.key.toLowerCase() === 'i') { // 监听快捷键
          const selection = window.getSelection().toString().trim();
          if (!selection) {
            this.showNotification('请先选中文本！', 'warning');
            return;
          }
  
          try {
            const context = document.createElement('canvas').getContext('2d');
            const lines = this.wrapText(context, selection, 800);
            const { canvas, context: finalContext, lineHeight } = this.setupCanvas(lines);
            this.drawImage(canvas, finalContext, lines, lineHeight);
  
            canvas.toBlob(async (blob) => {
              await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
              ]);
              this.showNotification('图片已复制到剪贴板！', 'success');
            }, 'image/png');
          } catch (error) {
            console.error('转换失败:', error);
            this.showNotification('转换失败，请检查权限或浏览器兼容性。', 'error');
          }
        }
      },
      handleFocus(event) {
        if (event.target.tagName.toLowerCase() === 'input' || event.target.tagName.toLowerCase() === 'textarea') {
          this.isFocusedOnInput = true;  // 当聚焦在输入框时
        }
      },
      handleBlur(event) {
        if (event.target.tagName.toLowerCase() === 'input' || event.target.tagName.toLowerCase() === 'textarea') {
          this.isFocusedOnInput = false; // 当失去焦点时
        }
      },
      wrapText(context, text, maxWidth) {
        const characters = Array.from(text);
        let lines = [];
        let currentLine = '';
  
        for (let char of characters) {
          const testLine = currentLine + char;
          const metrics = context.measureText(testLine);
  
          if (metrics.width > maxWidth - 40) {
            lines.push(currentLine);
            currentLine = char;
          } else {
            currentLine = testLine;
          }
        }
  
        if (currentLine) {
          lines.push(currentLine);
        }
  
        return lines;
      },
      setupCanvas(lines) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
  
        // 设置字体
        context.font = `16px Arial, "Microsoft YaHei", sans-serif`;
  
        // 计算画布尺寸
        const lineHeight = 24;
        const width = 800;
        const height = lines.length * lineHeight + 40;
  
        // 设置画布尺寸（考虑设备像素比以提高清晰度）
        const scale = window.devicePixelRatio || 1;
        canvas.width = width * scale;
        canvas.height = height * scale;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
  
        // 缩放上下文以匹配设备像素比
        context.scale(scale, scale);
  
        return { canvas, context, lineHeight };
      },
      drawImage(canvas, context, lines, lineHeight) {
        // 绘制背景
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
  
        // 绘制文本
        context.fillStyle = '#333333';
        context.font = '16px Arial, "Microsoft YaHei", sans-serif';
        context.textBaseline = 'middle';
  
        lines.forEach((line, i) => {
          const y = 20 + (i + 0.5) * lineHeight;
          context.fillText(line, 20, y);
        });
      },
      showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 12px 24px;
          background: ${type === 'success' ? '#4caf50' : type === 'warning' ? '#ff9800' : '#f44336'};
          color: white;
          border-radius: 4px;
          font-size: 14px;
          z-index: 9999;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          animation: fadeInOut 3s ease-in-out;
        `;
  
        notification.textContent = message;
        document.body.appendChild(notification);
  
        setTimeout(() => {
          notification.remove();
        }, 3000);
      }
    }
  };
  </script>
  