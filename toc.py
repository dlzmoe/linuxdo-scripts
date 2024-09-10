import re

def generate_toc(md_file):
    toc = []
    with open(md_file, 'r', encoding='utf-8') as file:
        for line in file:
            # 匹配二级标题
            if line.startswith('## '):
                title = line[3:].strip()  # 去掉前面的 '## '
                # 将标题转换为链接
                link = re.sub(r'\s+', '-', title.lower())
                toc.append(f'  - [{title}](#{link})')
            # 匹配三级标题
            elif line.startswith('### '):
                title = line[4:].strip()  # 去掉前面的 '### '
                link = re.sub(r'\s+', '-', title.lower())
                toc.append(f'    - [{title}](#{link})')

    return '\n'.join(toc)

if __name__ == "__main__":
    md_file = 'README.md'  # 替换为你的 Markdown 文件名
    toc = generate_toc(md_file)
    print("## 目录")
    print(toc)
