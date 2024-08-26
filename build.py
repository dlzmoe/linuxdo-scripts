import os
import json

# 文件路径
output_file = 'linuxdo-scripts.user.js'
input_file = 'dist/app.bundle.js'
package_file = 'package.json'
version_log_file = 'version-log.md'
changelog_file = 'CHANGELOG.md'

# 读取 package.json 中的版本号
if not os.path.exists(package_file):
  print(f"文件 {package_file} 不存在，请检查路径。")
else:
  with open(package_file, 'r', encoding='utf-8') as f:
    package_data = json.load(f)
    version = package_data.get('version', '0.0.0')

  # 确保 version-log.md 文件存在
  if not os.path.exists(version_log_file):
    print(f"文件 {version_log_file} 不存在，请检查路径。")
  else:
    with open(version_log_file, 'r', encoding='utf-8') as f:
      version_log_first_line = f.readline().strip()

    # 提取 version-log.md 的版本号
    version_log_version = version_log_first_line.split(' ')[-1] if version_log_first_line.startswith('##') else '0.0.0'

    # 检查 package.json 中的版本号是否与 version-log.md 的版本号一致
    if version != version_log_version:
      # 确保 CHANGELOG.md 文件存在
      if not os.path.exists(changelog_file):
        print(f"文件 {changelog_file} 不存在，请检查路径。")
      else:
        with open(changelog_file, 'r', encoding='utf-8') as f:
          changelog_content = f.read()

        # 将 CHANGELOG.md 的内容与新版本号插入 version-log.md 的最前面，并加两个换行
        with open(version_log_file, 'r+', encoding='utf-8') as f:
          existing_content = f.read()
          f.seek(0, 0)
          f.write(f"## {version}\n\n" + changelog_content + '\n\n' + existing_content)

        print(f"已更新 {version_log_file} 文件，版本号为 {version}。")

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
// @description  linux.do 增强插件，功能持续更新，欢迎提出新想法！
// @author       dlzmoe
// @match        *://linux.do/*
// @icon         https://cdn.linux.do/uploads/default/optimized/3X/9/d/9dd49731091ce8656e94433a26a3ef36062b3994_2_32x32.png
// @license      Apache-2.0 license
// @updateURL    https://raw.githubusercontent.com/dlzmoe/linuxdo-scripts/main/linuxdo-scripts.user.js
// @downloadurl  https://raw.githubusercontent.com/dlzmoe/linuxdo-scripts/main/linuxdo-scripts.user.js
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
