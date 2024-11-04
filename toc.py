# 运行 `py toc.py` 自动生成 README.md 目录
import re

def generate_toc(md_file):
    toc = []
    with open(md_file, 'r', encoding='utf-8') as file:
        for line in file:
            if line.startswith('## '):
                title = line[3:].strip()
                link = re.sub(r'\s+', '-', title.lower())
                toc.append(f'  - [{title}](#{link})')
            elif line.startswith('### '):
                title = line[4:].strip() 
                link = re.sub(r'\s+', '-', title.lower())
                toc.append(f'    - [{title}](#{link})')

    return '\n'.join(toc)

if __name__ == "__main__":
    md_file = 'README.md'
    toc = generate_toc(md_file)
    print("## 目录")
    print(toc)
