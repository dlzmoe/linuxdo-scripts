import os
import json

# 文件路径
output_file = 'linuxdo-scripts.js'
input_file = 'dist/app.bundle.js'
package_file = 'package.json'

# 读取 package.json 中的版本号
if not os.path.exists(package_file):
    print(f"文件 {package_file} 不存在，请检查路径。")
else:
    with open(package_file, 'r', encoding='utf-8') as f:
        package_data = json.load(f)
        version = package_data.get('version', '0.0.0')

    # 确保输入文件存在
    if not os.path.exists(input_file):
        print(f"文件 {input_file} 不存在，请检查路径。")
    else:
        # 读取 app.bundle.js 文件内容
        with open(input_file, 'r', encoding='utf-8') as f:
            bundle_content = f.read()

        # 脚本模板
        script_template = f'''\
// ==UserScript==
// @name         linuxdo 增强插件
// @namespace    https://github.com/dlzmoe/linuxdo-scripts
// @version      {version}
// @description  linux.do 增强插件，话题列表显示创建时间，显示楼层数，新标签页打开话题，强制 block（拉黑屏蔽）某人的话题，话题快捷回复（支持自定义），优化签名图显示防止图裂，在话题列表可直接预览详情及评论，功能设置面板导入导出，楼层抽奖，用户自定义标签，只看楼主，自动滚动阅读，支持自定义 css 样式等，中英文混排优化，等级信息查询，功能持续更新，欢迎提出新想法！
// @author       dlzmoe
// @match        *://linux.do/*
// @icon         https://cdn.linux.do/uploads/default/optimized/3X/9/d/9dd49731091ce8656e94433a26a3ef36062b3994_2_32x32.png
// @license      Apache-2.0 license
// ==/UserScript==

(function () {{
  'use strict';
  window.addEventListener('load', function () {{

[[替换]]

  }});
}})();
'''

        # 替换占位符 [[替换]] 为 bundle_content
        final_script = script_template.replace('[[替换]]', bundle_content)

        # 写入或清空并写入 linuxdo-scripts.js 文件
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(final_script)

        print(f"已生成 {output_file} 文件，版本号为 {version}。")
