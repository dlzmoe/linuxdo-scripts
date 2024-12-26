> **Note**
> Special Activity: [L Station 2024 Annual Summary] Script - [Source Code](./plugin/summary.user.js) / [Direct Installation](https://raw.githubusercontent.com/dlzmoe/linuxdo-scripts/refs/heads/main/plugin/summary.user.js)

<h2 align="center">LinuxDo Scripts Extension (formerly: linuxdo-scripts Enhancement Plugin)</h2>
<p align="center">Continuously updated. Issues and PR submissions are welcome!</p>

[简体中文](https://github.com/dlzmoe/linuxdo-scripts/blob/main/README.md) | [English](https://github.com/dlzmoe/linuxdo-scripts/blob/main/README_EN.md)

<p align="center">
<img src="https://img.shields.io/github/v/release/dlzmoe/linuxdo-scripts?label=LinuxDo Scripts Extension&labelColor=%235D5D5D&color=%23E97435">
<img src="https://img.shields.io/github/last-commit/dlzmoe/linuxdo-scripts">
<img src="https://img.shields.io/github/stars/dlzmoe%2Flinuxdo-scripts?style=flat">
<img src="https://img.shields.io/github/license/dlzmoe/linuxdo-scripts">
</p>

The LinuxDo Scripts extension displays the creation time in topic lists, shows post counts, opens topics in new tabs, forces block (blacklist) a user's topics, provides quick replies to topics (customizable), optimizes signature image display to prevent broken images, allows direct preview of details and comments in topic lists, imports and exports settings panel, offers post-level lotteries, supports user-defined tags, shows only the owner’s posts, automatically scrolls for reading, supports custom CSS styles, optimizes mixed Chinese and English display, queries level information, provides AI summarization of topics, intelligently generates replies, supports WebDAV synchronization, and allows switching of forum themes. For more features, please check the settings list; features are continuously updated, and new ideas are welcome!

[Github Repository](https://github.com/dlzmoe/linuxdo-scripts) |
[Chrome Store](https://chromewebstore.google.com/detail/fbgblmjbeebanackldpbmpacppflgmlj) |
~~[Greasyfork Store Installation](https://greasyfork.org/scripts/501827)~~ |
[Bug Reports and Feature Requests](https://github.com/dlzmoe/linuxdo-scripts/issues/new/choose) |
[Usage and Development Documentation](https://linuxdo-scripts-docs.netlify.app/) |
[Discord Community](https://discord.gg/n2pErsD7Kg)

## Installation and Use

- Chrome, Edge, and Arc users please install from the [Chrome Store](https://chromewebstore.google.com/detail/fbgblmjbeebanackldpbmpacppflgmlj)
- Firefox users can click the link to download the compressed package for use. [Download Compressed Package](https://github.com/dlzmoe/linuxdo-scripts/releases)

![image](https://github.com/user-attachments/assets/1553917a-1b3b-44f4-b624-2ca2a1616e4f)

## Features

<details>
<summary>Feature List:</summary>

- [x] Display creation time in topic lists
- [x] Show post counts 
- [x] Open topics in new tabs 
- [x] Force block (blacklist) certain user's topics 
- [x] Quick reply to topics (customizable) 
- [x] Optimize signature image display to prevent broken images 
- [x] Import and export settings panel 
- [x] Post-level lotteries 
- [x] Show only owner’s posts toggle 
- [x] Automatic scrolling for reading 
- [x] Dark mode 
- [x] User tags function 
- [x] Direct preview of details and comments in topic lists 
- [x] Emoji optimization in comment box 
- [x] Support custom CSS styles 
- [x] Optimize mixed Chinese and English display 
- [x] Added level information query 
- [x] Switch forum emoji styles 
- [x] AI summarization of topics, intelligent reply generation 
- [x] Support WebDAV synchronization 
- [x] Switch forum theme skins 
- [x] More features, please check the settings list 

</details>

<details>
<summary>Some Screenshot Demonstrations:</summary>

| ![image](https://github.com/user-attachments/assets/f3fb854f-e6fd-4da4-9a9c-377b6537fab7) | ![image](https://github.com/user-attachments/assets/3b2a9e63-3939-4dbc-a00f-c713ca2c7f33) |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| ![image](https://github.com/user-attachments/assets/2c67ab9f-2359-4ab5-b0dd-0f257560b98b) | ![image](https://github.com/user-attachments/assets/ed4f925c-e26c-43ce-a886-fa764ac341b5) |
| ![image](https://github.com/user-attachments/assets/c6ba9abb-43aa-40ce-a4a1-b9cdae229a2d) | ![image](https://github.com/user-attachments/assets/399c1645-36e1-4fe2-a671-ae40685e87ca) |

</details>

## Development Instructions

```
node: v22.12.0
```

Features are developed as components, registering a new component for each new feature to avoid conflicts.

Clone the repository, install dependencies, and run the code.

```shell
git clone https://github.com/dlzmoe/linuxdo-scripts
yarn # Install dependencies
yarn dev # Run locally
```

No build is required; PR code will be reviewed and merged as soon as possible if there are no major issues.

## Change Log

[version-log.md](https://github.com/dlzmoe/linuxdo-scripts/blob/main/version-log.md)

## Contribution History

![Contributor](https://contrib.rocks/image?repo=dlzmoe/linuxdo-scripts)

[![Stargazers over time](https://starchart.cc/dlzmoe/linuxdo-scripts.svg?variant=adaptive)](https://starchart.cc/dlzmoe/linuxdo-scripts)

## Disclaimer

All features provided in this script run only in the browser, and the source code used is publicly available and transparent. This script is for educational and research purposes only, does not engage in any profit-making schemes or associations, and any disputes arising from or related to the use of this script should be amicably resolved by the parties involved. This script is not responsible for any loss or damage caused to users or others when using the software provided by this script. By downloading, installing, and using the software provided in this product, users indicate their trust in the author and related agreements and disclaimers.

## Copyright Agreement

[MIT License](https://github.com/dlzmoe/linuxdo-scripts/blob/main/LICENSE)
