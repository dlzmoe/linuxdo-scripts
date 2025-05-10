<template>
  <div class="item">
    <div class="tit">{{ sort }}. 是否开启论坛文章导出功能</div>
    <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)" />
  </div>
</template>

<script>
import $ from 'jquery';
export default {
  props: ['modelValue', 'sort'],
  emits: ['update:modelValue'],
  data() {
    return {
      exportBtnClass: 'linxudoscripts-export-md',
    };
  },
  methods: {
    injectExportBtn() {
      if ($('.' + this.exportBtnClass).length < 1) {
        // 右上角插入按钮
        const btn = $(`
          <button class="btn btn-icon-text ${this.exportBtnClass}" type="button" style="margin-left:8px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="d-icon icon icon-tabler icon-tabler-download"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" /><polyline points="7 11 12 16 17 11" /><line x1="12" y1="4" x2="12" y2="16" /></svg>
            <span class="d-button-label">导出为Markdown</span>
          </button>
        `);
        // 选择帖子右上角区域
        const $target = $('.topic-map__actions, .topic-map .buttons, .topic-map__contents .buttons').first();
        if ($target.length > 0) {
          $target.append(btn);
        } else {
          // 兜底只插入到第一个帖子内容后
          $('.regular.contents').first().after(btn);
        }
        btn.on('click', () => this.exportMarkdown());
      }
    },
    exportMarkdown() {
      // 递归转 Markdown，过滤.meta 和 .post-menu-area.clearfix
      function html2md(node) {
        if (node.classList) {
          if (node.classList.contains('meta')) return '';
          if (node.classList.contains('post-menu-area') && node.classList.contains('clearfix')) return '';
        }
        if (node.tagName === 'PRE') {
          const codeBlock = node.querySelector('code');
          if(codeBlock) {
            return `\n\`\`\`\n${codeBlock.textContent.replace(/\n$/, '')}\n\`\`\`\n\n`;
          }
        }
        if (node.tagName === 'CODE') {
          if (!node.parentElement || node.parentElement.tagName !== 'PRE') {
            return '`' + node.textContent + '`';
          }
        }
        if (node.tagName === 'BR') {
          return '  \n';
        }
        if (node.tagName === 'P') {
          return '\n' + html2md_children(node) + '\n';
        }
        if (node.tagName === 'UL') {
          return '\n' + Array.from(node.children).map(li => html2md(li)).join('') + '\n';
        }
        if (node.tagName === 'OL') {
          let i = 1;
          return '\n' + Array.from(node.children).map(li => `${i++}. ${html2md_children(li)}\n`).join('') + '\n';
        }
        if (node.tagName === 'LI') {
          const prefix = (node.parentElement && node.parentElement.tagName === 'UL') ? '- ' : '';
          return prefix + html2md_children(node) + '\n';
        }
        if (node.tagName === 'BLOCKQUOTE') {
          return '\n> ' + html2md_children(node).replace(/\n/g, '\n> ') + '\n';
        }
        if (/^H[1-6]$/.test(node.tagName)) {
          const lv = node.tagName[1];
          return '\n' + '#'.repeat(lv) + ' ' + html2md_children(node) + '\n';
        }
        if (node.tagName === 'A') {
          // 如果 a 标签只包含一个 img，直接导出为图片
          if (
            node.childNodes.length === 1 &&
            node.childNodes[0].nodeType === 1 &&
            node.childNodes[0].tagName === 'IMG'
          ) {
            const img = node.childNodes[0];
            return `![${img.alt}](${img.src})`;
          }
          return `[${html2md_children(node)}](${node.href})`;
        }
        if (node.tagName === 'IMG') {
          return `![${node.alt}](${node.src})`;
        }
        if (node.tagName === 'STRONG' || node.tagName === 'B') {
          return `**${html2md_children(node)}**`;
        }
        if (node.tagName === 'EM' || node.tagName === 'I') {
          return `*${html2md_children(node)}*`;
        }
        return html2md_children(node);
      }
      function html2md_children(node) {
        let text = '';
        node.childNodes.forEach(child => {
          if (child.nodeType === 3) {
            text += child.textContent;
          } else if (child.nodeType === 1) {
            text += html2md(child);
          }
        });
        return text;
      }
      let allText = '';
      let ele = document.querySelector('.regular.contents');
      if (ele) {
        allText += html2md(ele);
      } else {
        allText = '未找到内容';
      }
      const blob = new Blob([allText], {type: 'text/markdown;charset=utf-8'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'discourse_export.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
  },
  mounted() {
    if (this.modelValue) {
      this.interval = setInterval(this.injectExportBtn, 1000);
    }
  },
  watch: {
    modelValue(val) {
      if (val) {
        this.interval = setInterval(this.injectExportBtn, 1000);
      } else {
        clearInterval(this.interval);
        $('.' + this.exportBtnClass).remove();
      }
    },
  },
  beforeDestroy() {
    clearInterval(this.interval);
    $('.' + this.exportBtnClass).remove();
  },
};
</script> 