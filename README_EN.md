> [!NOTE]
> Special Event: [L Site 2024 Annual Summary] Script - [Source Code](./plugin/summary.user.js) / [Direct Install](https://raw.githubusercontent.com/dlzmoe/linuxdo-scripts/refs/heads/main/plugin/summary.user.js)

<h2 align="center">LinuxDo Scripts Extension (formerly: linuxdo-scripts Enhancement Plugin)</h2>
<p align="center">Continuously updated, welcome to raise Issues and submit PRs ~</p>

[Simplified Chinese](https://github.com/dlzmoe/linuxdo-scripts/blob/main/README.md) | [English](https://github.com/dlzmoe/linuxdo-scripts/blob/main/README_EN.md)

<p align="center">
<img src="https://img.shields.io/github/v/release/dlzmoe/linuxdo-scripts?style=flat-square&label=LinuxDo Scripts Extension&labelColor=%235D5D5D&color=%23E97435">
<img src="https://img.shields.io/github/last-commit/dlzmoe/linuxdo-scripts?style=flat-square&">
<img src="https://img.shields.io/github/stars/dlzmoe/linuxdo-scripts?style=flat-square&label=Github%20Stars">
<img src="https://img.shields.io/chrome-web-store/users/fbgblmjbeebanackldpbmpacppflgmlj?style=flat-square&label=Chrome%20Web%20Store">
<img src="https://img.shields.io/github/license/dlzmoe/linuxdo-scripts?style=flat-square&">
</p>

LinuxDo Scripts Extension, displays creation time in topic lists, shows floor numbers, opens topics in new tabs, forcibly blocks (blacklists) someone's topics, quick replies to topics (supports customization), optimizes signature image display to prevent broken images, previews details and comments directly in topic lists, imports and exports function settings panels, floor lottery, user-defined tags, view only the original poster, supports custom CSS styles, optimizes mixed Chinese and English display, level information query, AI topic summarization, intelligent reply generation, supports WebDAV synchronization, switches forum theme skins, and more. Please check the settings list for more features, which are continuously updated. Welcome to propose new ideas!

[Github Repository](https://github.com/dlzmoe/linuxdo-scripts) |
[Chrome Web Store](https://chromewebstore.google.com/detail/fbgblmjbeebanackldpbmpacppflgmlj) |
[Firefox Add-ons](https://addons.mozilla.org/zh-CN/firefox/addon/linux_do-scripts/) |
~~[Greasyfork Installation](https://greasyfork.org/scripts/501827)~~   
[Bug Reports and Feature Requests](https://github.com/dlzmoe/linuxdo-scripts/issues/new/choose) |
[Usage and Development Documentation](https://linuxdo-scripts-docs.netlify.app/) |
[Discord Community](https://discord.gg/n2pErsD7Kg)

## Installation and Usage

- Chrome, Edge, Arc users please install from [Chrome Web Store](https://chromewebstore.google.com/detail/fbgblmjbeebanackldpbmpacppflgmlj)
- Firefox users please install from [Firefox Add-ons](https://addons.mozilla.org/zh-CN/firefox/addon/linux_do-scripts/)

![image](https://github.com/user-attachments/assets/1553917a-1b3b-44f4-b624-2ca2a1616e4f)

## Features

<details>
<summary>Feature List:</summary>

- [x] Display creation time in topic lists
- [x] Show floor numbers
- [x] Open topics in new tabs
- [x] Forcibly block (blacklist) someone's topics
- [x] Quick replies to topics (supports customization)
- [x] Optimize signature image display to prevent broken images
- [x] Import and export function settings panels
- [x] Floor lottery
- [x] View only the original poster
- [x] Dark mode
- [x] User-defined tags
- [x] Preview details and comments directly in topic lists
- [x] Optimize comment box emoticons
- [x] Support custom CSS styles
- [x] Optimize mixed Chinese and English display
- [x] Add level information query
- [x] Switch forum emoticon styles
- [x] AI topic summarization, intelligent reply generation
- [x] Support WebDAV synchronization
- [x] Switch forum theme skins
- [x] More features, please check the settings list

</details>

<details>
<summary>Partial Screenshots:</summary>

| ![image](https://github.com/user-attachments/assets/f3fb854f-e6fd-4da4-9a9c-377b6537fab7) | ![image](https://github.com/user-attachments/assets/3b2a9e63-3939-4dbc-a00f-c713ca2c7f33) |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| ![image](https://github.com/user-attachments/assets/2c67ab9f-2359-4ab5-b0dd-0f257560b98b) | ![image](https://github.com/user-attachments/assets/ed4f925c-e26c-43ce-a886-fa764ac341b5) |
| ![image](https://github.com/user-attachments/assets/c6ba9abb-43aa-40ce-a4a1-b9cdae229a2d) | ![image](https://github.com/user-attachments/assets/399c1645-36e1-4fe2-a671-ae40685e87ca) |

</details>

## Development Instructions

```
node: v18.17.0
```

Features are developed in a component-based manner. Each time a new feature is added, a new component is registered to avoid conflicts.

Clone this repository and install dependencies, then run the code.

```shell
git clone https://github.com/dlzmoe/linuxdo-scripts
yarn # Install dependencies
yarn dev # Run locally
```

After starting, open the local `.output` folder and drag `chrome-mv3` to `chrome://extensions/` to start development.

No build is required. After submitting PR code, I will review it, and if there are no major issues, it will be merged as soon as possible.

## Changelog

[version-log.md](https://github.com/dlzmoe/linuxdo-scripts/blob/main/version-log.md)

## Contribution History

![Contributor](https://contrib.rocks/image?repo=dlzmoe/linuxdo-scripts)

[![Stargazers over time](https://starchart.cc/dlzmoe/linuxdo-scripts.svg?variant=adaptive)](https://starchart.cc/dlzmoe/linuxdo-scripts)

## Disclaimer

All features provided in this script run only in the browser. The source code used is publicly visible and transparent. This script is for learning and research purposes only and does not use any profit schemes or participate in any profit organizations. Any disputes arising from or related to the use of this script should be resolved through friendly negotiation. This script is not responsible for any form of loss or damage caused to the user or others when using the software provided by this script. By downloading, installing, and using the software provided in this product, the user agrees to trust the author and the relevant agreements and disclaimers.

## License

[MIT license](https://github.com/dlzmoe/linuxdo-scripts/blob/main/LICENSE)
