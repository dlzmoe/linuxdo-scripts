import os
import requests
import time
from dotenv import load_dotenv

# 加载 .env 文件中的环境变量
load_dotenv()

OPENAI_URL = os.getenv("OPENAI_URL")
API_KEY = os.getenv("API_KEY")
MODEL = os.getenv("MODEL")
INPUT_FILE = os.getenv("INPUT_FILE")
OUTPUT_FILE = os.getenv("OUTPUT_FILE")
TARGET_LANGUAGE = os.getenv("TARGET_LANGUAGE")

def read_markdown_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()

def write_markdown_file(file_path, content):
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(content)

def translate_text(text):
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    prompt = f"Translate the following text to {TARGET_LANGUAGE}. Markdown syntax is not preserved:\n\n{text}"
    
    data = {
        "model": MODEL,
        "messages": [{"role": "user", "content": prompt}]
    }
    
    print("正在翻译...请稍候")
    
    response = requests.post(OPENAI_URL, headers=headers, json=data)
    
    if response.status_code == 200:
        return response.json()['choices'][0]['message']['content']
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return None

def main():
    if not os.path.exists(INPUT_FILE):
        print(f"输入文件 {INPUT_FILE} 不存在")
        return
    
    markdown_content = read_markdown_file(INPUT_FILE)
    
    if markdown_content.startswith('```'):
        markdown_content = markdown_content[3:].strip()
    if markdown_content.endswith('```'):
        markdown_content = markdown_content[:-3].strip()

    print(f"{time.strftime('%X')}：开始翻译")
    
    translated_content = translate_text(markdown_content)
    
    if translated_content:
        write_markdown_file(OUTPUT_FILE, translated_content)
        print(f"{time.strftime('%X')}：翻译完成，输出保存到 {OUTPUT_FILE}")
    else:
        print("翻译失败")

if __name__ == "__main__":
    main()
