[Simplified Chinese](README.md) | [English](README_EN.md)  

<div align="center">  
  <a href="https://github.com/dlzmoe/linuxdo-scripts">  
    <img src="https://github.com/dlzmoe/linuxdo-scripts/blob/main/public/icon/128.png?raw=true" alt="Logo" width="80" height="80">  
  </a>  

  <h1>LinuxDo Scripts</h1>  

  <p>  
    <a href="https://discord.gg/n2pErsD7Kg">Discord</a>  
    ·  
    <a href="https://linuxdo-scripts.zishu.me">Documentation</a>  
    ·  
    <a href="https://github.com/dlzmoe/linuxdo-scripts/issues/new/choose">Report Issues</a>  
    ·  
    <a href="https://github.com/dlzmoe/linuxdo-scripts/releases/latest">Latest Release</a>  
  </p>  

  <p>  
    <img src="https://img.shields.io/github/stars/dlzmoe/linuxdo-scripts?style=flat&label=Github%20Stars">  
    <img src="https://img.shields.io/chrome-web-store/users/fbgblmjbeebanackldpbmpacppflgmlj?style=flat&label=Chrome%20Web%20Store">  
    <img src="https://img.shields.io/github/license/dlzmoe/linuxdo-scripts?style=flat&">  
  </p>  
</div>  

![Visitor Count](https://profile-counter.glitch.me/dlzmoe-linuxdo-scripts/count.svg)  

## 📖 Project Introduction  

LinuxDo Scripts is a feature-rich browser extension designed to enhance the user experience on the LinuxDo forum. It integrates multiple practical functions, ranging from basic interface optimizations to advanced AI-assisted features, making your forum browsing and interaction smoother and more efficient.  

| Settings Panel                                                                                  | Operation Guide                                                                                  |  
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |  
| ![image](https://github.com/user-attachments/assets/8824696c-f2d4-4cfd-8273-901a3d007a39) | ![image](https://github.com/user-attachments/assets/a052a816-3209-4e3d-ba5d-252b6518bf55) |  

## ✨ Key Features  

### 🔍 Browsing Experience Optimization  
- Display topic creation time in lists  
- Show floor numbers  
- Open topics in new tabs  
- Preview topic details and comments directly in the list  
- Improved display for mixed Chinese-English text  
- Optimized signature image display to prevent broken images  
- Automatic dark mode switching  

### 📚 Content Management  
- Comprehensive bookmark functionality  
- User tagging feature  
- Force-block (blacklist) topics from specific users  
- "View OP Only" toggle  

### 💬 Interaction Enhancements  
- Quick topic replies (with customization support)  
- Optimized emoji panel in comment boxes  
- Floor lottery feature  
- User level information lookup  

### 🤖 AI Intelligence  
- AI-generated topic summaries  
- Smart reply generation  
- AI-assisted commenting  

### 🎨 Personalization  
- Switch forum theme skins  
- Change forum emoji styles  
- Support for custom CSS styles  
- Settings panel data synchronization  

## 📥 Installation & Usage  

### Browser Support  
- **Chrome / Edge / Arc / Brave**: [Chrome Web Store](https://chromewebstore.google.com/detail/fbgblmjbeebanackldpbmpacppflgmlj)  
- **Users in China**: [Crx Store](https://www.crxsoso.com/webstore/detail/fbgblmjbeebanackldpbmpacppflgmlj)  
- **Firefox**: [Firefox Addons](https://addons.mozilla.org/zh-CN/firefox/addon/linux_do-scripts/)  

## 🛠️ Development Guide  

### Environment Requirements  
```  
node: v22.12.0  
```  

### Local Development  
1. Clone the repository and install dependencies:  
```shell  
git clone https://github.com/dlzmoe/linuxdo-scripts  
npm install  
```  

2. Start the development server:  
```shell  
npm run dev  
```  

3. Load the extension:  
- Open the local `.output` folder  
- Drag the `chrome-mv3` folder into `chrome://extensions/`  

### Development Notes  
- Modular development approach  
- Each new feature is developed as an independent component to avoid conflicts  
- PRs will undergo code review and be merged promptly if no major issues exist  

## 🤝 Contribution Guide  

We welcome new feature ideas and improvement suggestions! You can participate in the project by:  
- Submitting Issues to report problems or propose ideas  
- Contributing code via Pull Requests  
- Joining the Discord community for discussions  

## 📄 License  

This project is open-source under the MIT License. For details, see the [LICENSE](LICENSE) file.