import AdmZip from 'adm-zip';
import path from 'path';
import fs from 'fs';

// __dirname 替代方法
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 定义 .output 文件夹和压缩文件路径
const distFolder = path.resolve(__dirname, '../.output/chrome-mv3'); // 如果 .output 在根目录下
const zipFile = path.resolve(__dirname, '../.output/chrome-mv3.zip');

// 检查 .output 文件夹是否存在
if (!fs.existsSync(distFolder)) {
  console.error('❌ .output 文件夹不存在"');
  process.exit(1);
}

// 创建 zip 文件
const zip = new AdmZip();
zip.addLocalFolder(distFolder); // 添加 .output 文件夹到压缩包
zip.writeZip(zipFile);

console.log(`✅ 压缩完成：${zipFile}`);
