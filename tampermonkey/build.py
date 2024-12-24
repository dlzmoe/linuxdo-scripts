# 自动生成油猴文件、版本信息等数据
import os
import json
import shutil

version_log_file = 'version-log.md'
changelog_file = 'CHANGELOG.md'
package_file = 'package.json'
source_script_file = 'dist/linuxdo-scripts.user.js'
destination_script_file = 'linuxdo-scripts.user.js'

# 复制文件到根目录
if os.path.exists(source_script_file):
    shutil.copy(source_script_file, destination_script_file)
    print(f"已将 {source_script_file} 复制到根目录下。")
    # 找到 'use strict'; 字段，在后面加上一段文字
    with open(destination_script_file, 'r+', encoding='utf-8') as file:
        content = file.read()
        position = content.find("'use strict';")
        if position != -1:
            insertion_text = "\n\n  if (document.getElementById('challenge-form')) {\n      return;\n   }"
            content = content[:position + len("'use strict';")] + insertion_text + content[position + len("'use strict';"):]
            file.seek(0)
            file.write(content)
            file.truncate()
        else:
            print(f"文件 {destination_script_file} 中未找到 'use strict'; 字段。")
else:
    print(f"文件 {source_script_file} 不存在，请检查路径。")

# 检查 package.json 文件
if not os.path.exists(package_file):
    print(f"文件 {package_file} 不存在，请检查路径。")
else:
    with open(package_file, 'r', encoding='utf-8') as f:
        package_data = json.load(f)
        version = package_data.get('version', '0.0.0')

    # 检查 version-log.md 文件
    if not os.path.exists(version_log_file):
        print(f"文件 {version_log_file} 不存在，请检查路径。")
    else:
        with open(version_log_file, 'r', encoding='utf-8') as f:
            # 读取第一行
            version_log_first_line = f.readline().strip()

        # 处理第一行不符合预期的情况
        if version_log_first_line.startswith('##'):
            version_log_version = version_log_first_line.split(' ')[-1]
        else:
            version_log_version = '0.0.0'

        # 仅在版本号不一致时才更新 version-log.md
        if version != version_log_version:
            if not os.path.exists(changelog_file):
                print(f"文件 {changelog_file} 不存在，请检查路径。")
            else:
                with open(changelog_file, 'r', encoding='utf-8') as f:
                    changelog_content = f.read()

                with open(version_log_file, 'r+', encoding='utf-8') as f:
                    existing_content = f.read()
                    f.seek(0, 0)
                    f.write(f"## {version}\n\n" + changelog_content + '\n\n' + existing_content)

                print(f"已更新 {version_log_file} 文件，版本号为 {version}。")
        else:
            print(f"版本号 {version} 已存在于 {version_log_file} 中，无需更新。")