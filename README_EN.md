[Simplified Chinese](https://github.com/dlzmoe/linuxdo-scripts/blob/main/README.md) | [English](https://github.com/dlzmoe/linuxdo-scripts/blob/main/README_EN.md)

<div align="center">
  <a href="https://github.com/dlzmoe/linuxdo-scripts">
    <img src="https://github.com/dlzmoe/linuxdo-scripts/blob/main/public/icon/128.png?raw=true" alt="Logo" width="80" height="80">
  </a>

  <h2>LinuxDo Scripts</h2>
  <p>
    <a href="https://discord.gg/n2pErsD7Kg">Discord</a>
    ·
    <a href="https://linuxdo-scripts.zishu.me">Docs</a>
    ·
    <a href="https://github.com/dlzmoe/linuxdo-scripts/issues/new/choose">Issues</a>
    ·
    <a href="https://github.com/dlzmoe/linuxdo-scripts/releases/latest">Releases</a>
    <br />
  </p>

  <p>
    <img src="https://img.shields.io/github/v/release/dlzmoe/linuxdo-scripts?style=flat-square&label=LinuxDo Scripts Extension&labelColor=%235D5D5D&color=%23E97435">
    <img src="https://img.shields.io/github/stars/dlzmoe/linuxdo-scripts?style=flat-square&label=Github%20Stars">
    <img src="https://img.shields.io/chrome-web-store/users/fbgblmjbeebanackldpbmpacppflgmlj?style=flat-square&label=Chrome%20Web%20Store">
    <img src="https://img.shields.io/github/license/dlzmoe/linuxdo-scripts?style=flat-square&">
  </p>

</div>

![image](https://github.com/user-attachments/assets/8824696c-f2d4-4cfd-8273-901a3d007a39)

The LinuxDo Scripts extension comes with a comprehensive bookmark feature, displays topic creation times in the topic list, shows the number of floors, opens topics in new tabs, allows forced blocking (blacklisting) of certain users' topics, quick replies to topics (with customization support), optimizes signature image display to prevent broken images, allows previewing details and comments directly from the topic list, syncs settings panel data, includes floor-based giveaways, user-defined tags, a "View Only OP" feature, supports custom CSS styles, optimizes mixed Chinese and English text display, adds level information lookup, AI topic summarization, intelligent reply generation, forum theme skin switching, and more. For more features, please check the settings list. Features are continuously updated, and new ideas are welcome!

## Installation and Usage

- Chrome, Edge, Arc, and Brave users can install it from the [Chrome Web Store](https://chromewebstore.google.com/detail/fbgblmjbeebanackldpbmpacppflgmlj).
- Firefox users can install it from [Firefox Add-ons](https://addons.mozilla.org/zh-CN/firefox/addon/linux_do-scripts/).

## Features

<details>
<summary>Feature List:</summary>

- [x] Built-in comprehensive bookmark feature
- [x] Display topic creation time in the topic list
- [x] Show the number of floors
- [x] Open topics in new tabs
- [x] Force block (blacklist) certain users' topics
- [x] Quick replies to topics (with customization support)
- [x] Optimize signature image display to prevent broken images
- [x] Sync settings panel data
- [x] Floor-based giveaways
- [x] "View Only OP" toggle feature
- [x] Automatic dark mode switching
- [x] User-defined tags
- [x] Preview details and comments directly from the topic list
- [x] Optimize comment box emoticons
- [x] Support custom CSS styles
- [x] Optimize mixed Chinese and English text display
- [x] Add level information lookup
- [x] Switch forum emoticon styles
- [x] AI topic summarization and intelligent reply generation
- [x] Switch forum theme skins
- [x] More features available in the settings list

</details>

<details>
<summary>Partial Screenshots:</summary>

| ![image](https://github.com/user-attachments/assets/f3fb854f-e6fd-4da4-9a9c-377b6537fab7) | ![image](https://github.com/user-attachments/assets/eef1330f-3354-41a6-b654-8048d457856d) |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| ![image](https://github.com/user-attachments/assets/2c67ab9f-2359-4ab5-b0dd-0f257560b98b) | ![image](https://github.com/user-attachments/assets/ed4f925c-e26c-43ce-a886-fa764ac341b5) |
| ![image](https://github.com/user-attachments/assets/c6ba9abb-43aa-40ce-a4a1-b9cdae229a2d) | ![image](https://github.com/user-attachments/assets/399c1645-36e1-4fe2-a671-ae40685e87ca) |

</details>

## Development Notes

```
node: v22.12.0
```

Features are implemented as components. Each new feature is registered as a new component to avoid conflicts.

Clone this repository and install dependencies, then run the code.

```shell
git clone https://github.com/dlzmoe/linuxdo-scripts
npm install # Install dependencies
npm run dev # Run locally
```

After starting, open the local `.output` folder and drag `chrome-mv3` into `chrome://extensions/` to start development.

No build is required. After submitting a PR, I will review it, and if there are no major issues, it will be merged as soon as possible.

## Changelog

[version-log.md](https://github.com/dlzmoe/linuxdo-scripts/blob/main/version-log.md)

## Contribution History

![Contributor](https://contrib.rocks/image?repo=dlzmoe/linuxdo-scripts)

![Stargazers over time](https://starchart.cc/dlzmoe/linuxdo-scripts.svg?variant=adaptive)

## Disclaimer

All features provided in this script run only in the browser. The source code is publicly visible and transparent. This script is for learning and research purposes only and does not participate in any profit schemes or organizations. Any disputes arising from or related to the use of this script should be resolved through friendly negotiation. The script is not responsible for any form of loss or damage caused to the user or others while using the software provided by this script. By downloading, installing, and using the software provided in this product, the user agrees to trust the author and the related agreements and disclaimers.

## License

[MIT license](https://github.com/dlzmoe/linuxdo-scripts/blob/main/LICENSE)