[简体中文](README.md) | [English](README_EN.md)

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
    <a href="https://github.com/dlzmoe/linuxdo-scripts/issues/new/choose">Issues</a>
    ·
    <a href="https://github.com/dlzmoe/linuxdo-scripts/releases/latest">Latest Release</a>
  </p>

  <p>
    <img src="https://img.shields.io/github/v/release/dlzmoe/linuxdo-scripts?style=flat&label=LinuxDo Scripts&labelColor=%235D5D5D&color=%23E97435">
    <img src="https://img.shields.io/github/stars/dlzmoe/linuxdo-scripts?style=flat&label=Github%20Stars">
    <img src="https://img.shields.io/chrome-web-store/users/fbgblmjbeebanackldpbmpacppflgmlj?style=flat&label=Chrome%20Web%20Store">
    <img src="https://img.shields.io/github/license/dlzmoe/linuxdo-scripts?style=flat&">
  </p>
</div>

## 📖 Project Introduction

LinuxDo Scripts is a feature-rich browser extension designed to enhance the user experience of the LinuxDo forum. It integrates multiple practical features, from basic interface optimizations to advanced AI-assisted functions, making your forum browsing and interaction experience smoother and more efficient.

## ✨ Key Features

### 🔍 Browsing Experience Optimization
- Display topic creation time in topic list
- Show floor numbers
- Open topics in new tabs
- Preview details and comments directly from topic list
- Optimize mixed Chinese-English text display
- Optimize signature image display to prevent broken images
- Automatic dark mode switching

### 📚 Content Management
- Comprehensive bookmark functionality
- User tagging feature
- Force block (blacklist) topics from specific users
- View OP-only toggle function

### 💬 Interaction Enhancement
- Quick topic replies (with customization support)
- Comment box emoji optimization
- Floor lottery feature
- Level information query

### 🤖 AI Intelligence
- AI topic summarization
- Intelligent reply generation
- AI-assisted posting

### 🎨 Personalization
- Switch forum theme skins
- Switch forum emoji styles
- Support custom CSS styles
- Settings panel data synchronization

## 📥 Installation and Usage

### Browser Support
- **Chrome / Edge / Arc / Brave**: [Chrome Web Store](https://chromewebstore.google.com/detail/fbgblmjbeebanackldpbmpacppflgmlj)
- **Domestic Users**: [Crx Store](https://www.crxsoso.com/webstore/detail/fbgblmjbeebanackldpbmpacppflgmlj)
- **Firefox**: [Firefox Addons](https://addons.mozilla.org/zh-CN/firefox/addon/linux_do-scripts/)

## 🛠️ Development Guide

### Environment Requirements
```
node: v22.12.0
```

### Local Development
1. Clone repository and install dependencies:
```shell
git clone https://github.com/dlzmoe/linuxdo-scripts
npm install
```

2. Start development service:
```shell
npm run dev
```

3. Load extension:
- Open local `.output` folder
- Drag `chrome-mv3` folder into `chrome://extensions/`

### Development Notes
- Component-based development model
- Each new feature is developed as an independent component to avoid conflicts
- Code review will be conducted after PR submission, and will be merged quickly if no major issues

## 🤝 Contribution Guide

Welcome to propose new feature ideas and improvement suggestions! You can participate in the project through:
- Submit Issues to report problems or make suggestions
- Submit Pull Requests to contribute code
- Join Discord community for discussions

## 📄 License

This project is open-sourced under the MIT license. For detailed information, please check the [LICENSE](LICENSE) file.