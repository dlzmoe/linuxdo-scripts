import os
import json
import shutil
import re

# 配置文件路径
config_file = 'config.json'

# 读取配置文件
if not os.path.exists(config_file):
    print(f"文件 {config_file} 不存在，请检查路径。")
else:
    with open(config_file, 'r', encoding='utf-8') as f:
        config_data = json.load(f)
        version_log_file = config_data.get('version_log_file', 'version-log.md')
        changelog_file = config_data.get('changelog_file', 'CHANGELOG.md')
        package_file = config_data.get('package_file', 'package.json')

    # 检查 package.json 文件
    if not os.path.exists(package_file):
        print(f"文件 {package_file} 不存在，请检查路径。")
    else:
        with open(package_file, 'r', encoding='utf-8') as f:
            package_data = json.load(f)
            version = package_data.get('version', '0.0.0')

        # 验证版本号格式
        if not re.match(r'^\d+\.\d+\.\d+$', version):
            print(f"版本号 {version} 格式不正确，请使用语义版本号格式（MAJOR.MINOR.PATCH）。")
        else:
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
