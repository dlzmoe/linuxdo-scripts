> **Note**
> Special Event: [L Station 2024 Annual Summary] Script - [Source Code](./plugin/summary.user.js) / [Direct Install](https://raw.githubusercontent.com/dlzmoe/linuxdo-scripts/refs/heads/main/plugin/summary.user.js)

<h2 align="center">LinuxDo Scripts Extension (formerly known as: linuxdo-scripts Enhancement Plugin)</h2>
<p align="center">The scripts are continuously updated; feel free to raise Issues and submit Pull Requests!</p>

> Rebuilt from a Tampermonkey plugin to a browser extension, now at version 1.0.  
> Currently not available in the extension store, you can download the latest installation package from releases.

[简体中文](https://github.com/dlzmoe/linuxdo-scripts/blob/main/README.md) | [English](https://github.com/dlzmoe/linuxdo-scripts/blob/main/README_EN.md)

<p align="center">
<img src="https://img.shields.io/github/v/release/dlzmoe/linuxdo-scripts?label=LinuxDo Scripts 扩展&labelColor=%235D5D5D&color=%23E97435">
<img src="https://img.shields.io/github/last-commit/dlzmoe/linuxdo-scripts">
<img src="https://img.shields.io/github/stars/dlzmoe%2Flinuxdo-scripts?style=flat">
<img src="https://img.shields.io/github/license/dlzmoe/linuxdo-scripts">
</p>

The LinuxDo Scripts extension offers features such as displaying creation times in topic lists, showing post counts, opening topics in new tabs, forcing block (blacklisting) specific topics, quick replies (customizable), optimizing signature images to prevent distortion, direct preview of details and comments in topic lists, import/export panels for settings, lottery for posts, user-defined tags, options to view only the original poster's messages, auto-scrolling for reading, support for custom CSS styles, mixed English and Chinese optimization, level information queries, AI topic summarization and smart response generation, WebDAV synchronization, theme skin switching for the forum, and many more features. Please check the settings list for continuous updates and new ideas!

[Github Repository](https://github.com/dlzmoe/linuxdo-scripts) |
[Chrome Store](https://chromewebstore.google.com/detail/fbgblmjbeebanackldpbmpacppflgmlj) |
~~[Greasyfork Store Installation](https://greasyfork.org/scripts/501827)~~ |
[Bug Feedback and Feature Requests](https://github.com/dlzmoe/linuxdo-scripts/issues/new/choose) |
[Usage and Development Documentation](https://linuxdo-scripts-docs.netlify.app/) |
[Discord Community](https://discord.gg/n2pErsD7Kg)

## Installation and Usage

- Chrome, Edge, and Arc users please [install from the Chrome Store](https://chromewebstore.google.com/detail/fbgblmjbeebanackldpbmpacppflgmlj)

![image](https://github.com/user-attachments/assets/1553917a-1b3b-44f4-b624-2ca2a1616e4f)

## Features

<details>
<summary>Feature List:</summary>

- [x] Display creation time in topic lists
- [x] Show post counts
- [x] Open topics in new tabs
- [x] Force block (blacklist) specific topics
- [x] Quick replies (customizable)
- [x] Optimize signature image display to prevent distortion
- [x] Import/export settings panel
- [x] Lottery for posts
- [x] Toggle view for only the original poster
- [x] Auto-scrolling for reading
- [x] Dark mode
- [x] User tagging feature
- [x] Direct preview of details and comments in topic lists
- [x] Comment box emoji optimization
- [x] Support for custom CSS styles
- [x] Mixed Chinese and English layout optimization
- [x] New level information query feature
- [x] Toggle forum emoji styles
- [x] AI topic summarization and smart response generation
- [x] Support for WebDAV synchronization
- [x] Switch forum theme skins
- [x] More features can be found in the settings list

</details>

<details>
<summary>Some Screenshots:</summary>

| ![image](https://github.com/user-attachments/assets/f3fb854f-e6fd-4da4-9a9c-377b6537fab7) | ![image](https://github.com/user-attachments/assets/3b2a9e63-3939-4dbc-a00f-c713ca2c7f33) |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| ![image](https://github.com/user-attachments/assets/2c67ab9f-2359-4ab5-b0dd-0f257560b98b) | ![image](https://github.com/user-attachments/assets/ed4f925c-e26c-43ce-a886-fa764ac341b5) |
| ![image](https://github.com/user-attachments/assets/c6ba9abb-43aa-40ce-a4a1-b9cdae229a2d) | ![image](https://github.com/user-attachments/assets/399c1645-36e1-4fe2-a671-ae40685e87ca) |

</details>

## Development Instructions

```
node: v22.12.0
```

Features are developed as components to avoid conflicts. 

Clone this repository, installe dependencies, and run the code.

```shell
git clone https://github.com/dlzmoe/linuxdo-scripts
yarn # Install dependencies
yarn dev # Run locally
```

No build is required; I will review PR code and merge without many issues in the shortest time.

## Changelog

[version-log.md](https://github.com/dlzmoe/linuxdo-scripts/blob/main/version-log.md)

## Contribution History

![Contributor](https://contrib.rocks/image?repo=dlzmoe/linuxdo-scripts)

[![Stargazers over time](https://starchart.cc/dlzmoe/linuxdo-scripts.svg?variant=adaptive)](https://starchart.cc/dlzmoe/linuxdo-scripts)

## Disclaimer

All features provided by this script run solely in the browser, and the source code used is transparent and publicly available. This script is for educational and research purposes only, does not utilize any profit schemes, nor does it participate in any profit organizations. Any disputes arising from the use of this script, all parties should resolve amicably. This script holds no responsibility for any losses or injuries that may occur to the user or others when using the software provided via this script. By downloading, installing, and using the software provided in this product, users indicate their trust in the authors and their related agreements and disclaimers.

## License Agreement

[MIT license](https://github.com/dlzmoe/linuxdo-scripts/blob/main/LICENSE)
