<p align="center"><img src="./github-header-image.png"></p>
<h2 align="center">linuxdo Enhancement Plugin (linuxdo-scripts)</h2>
<p align="center">The scripts are continuously updated. Feel free to raise issues and submit pull requests ~</p>

[简体中文](https://github.com/dlzmoe/linuxdo-scripts/blob/main/README.md) | [English](https://github.com/dlzmoe/linuxdo-scripts/blob/main/README_EN.md)

<p align="center">
<img src="https://img.shields.io/github/v/release/dlzmoe/linuxdo-scripts?label=linuxdo%20%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6&labelColor=%235D5D5D&color=%23E97435">
<img src="https://img.shields.io/github/last-commit/dlzmoe/linuxdo-scripts">
<img src="https://img.shields.io/github/stars/dlzmoe%2Flinuxdo-scripts?style=flat">
<img src="https://img.shields.io/github/license/dlzmoe/linuxdo-scripts">
</p>

The linux.do enhancement plugin features topic creation time display, floor count, opening topics in a new tab, forcibly blocking a user's topics, quick replies (customizable), optimized signature image display to prevent image breakage, direct preview of details and comments in the topic list, import/export settings panel, floor lotteries, user-defined tags, viewing only the original poster, automatic scrolling reading, support for custom CSS styles, optimized display for mixed Chinese and English, level information queries, AI summarization of topics and intelligent reply generation, webDAV synchronization, switching forum themes and skins, etc. The features are continuously updated, and new ideas are welcome!

[GitHub Repository](https://github.com/dlzmoe/linuxdo-scripts) |
[Install from Greasyfork Store](https://greasyfork.org/scripts/501827) |
[Bug Reporting and Feature Requests](https://github.com/dlzmoe/linuxdo-scripts/issues/new/choose) |
[Usage and Development Documentation](https://linuxdo-scripts-docs.netlify.app/) |
[Discord Community](https://discord.gg/n2pErsD7Kg)

> [!TIP] 
> I will share any fun features in the group chat as soon as possible. Feeling like I post too frequently.  
> Discord Community: https://discord.gg/n2pErsD7Kg  

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/anghunk)

## Table of Contents
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Usage Instructions](#usage-instructions)
  - [Development Notes](#development-notes)
  - [Changelog](#changelog)
  - [Contribution History](#contribution-history)
  - [Disclaimer](#disclaimer)
  - [License Agreement](#license-agreement)

---

The development environment is Windows / Chrome / Violentmonkey. If you encounter errors or non-functionality using other userscript managers, you can try using Violentmonkey (which I am currently using and has better compatibility).

> [!WARNING]  
> Arc browser users should use the Violentmonkey extension. 
> The Violentmonkey extension cannot be used with the Arc browser due to compatibility issues between the browser and the userscript manager, which is unrelated to the plugin.  

## Features

- [x] Topic list shows creation time
- [x] Displays floor count
- [x] Opens topics in a new tab
- [x] Forcibly block (blacklist) a user's topics
- [x] Quick reply to topics (supports customization)
- [x] Optimized signature image display to prevent image breakage
- [x] Import/export function settings panel
- [x] Floor lottery
- [x] Toggle view to see only the original poster
- [x] Automatic scrolling reading
- [x] Dark mode
- [x] User tag functionality
- [x] Direct preview of details and comments in the topic list
- [x] Optimized emoji in the comment box
- [x] Supports custom CSS styles
- [x] Optimized display for mixed Chinese and English
- [x] New level information query feature
- [x] Toggle forum emoji styles
- [x] AI summarization of topics and intelligent reply generation
- [x] Supports WebDAV synchronization
- [x] Switch forum theme skins

<details>
<summary>Some Screenshot Demonstrations:</summary>

| ![image](https://github.com/user-attachments/assets/f3fb854f-e6fd-4da4-9a9c-377b6537fab7) | ![image](https://github.com/user-attachments/assets/3b2a9e63-3939-4dbc-a00f-c713ca2c7f33) |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| ![image](https://github.com/user-attachments/assets/2c67ab9f-2359-4ab5-b0dd-0f257560b98b) | ![image](https://github.com/user-attachments/assets/ed4f925c-e26c-43ce-a886-fa764ac341b5) |
| ![image](https://github.com/user-attachments/assets/c6ba9abb-43aa-40ce-a4a1-b9cdae229a2d) | ![image](https://github.com/user-attachments/assets/399c1645-36e1-4fe2-a671-ae40685e87ca) |

</details>

## Usage Instructions

Click this link to automatically trigger the installation program for the userscript; future updates can also be triggered.

https://greasyfork.org/scripts/501827

### (Beginner Method)

- [Chrome - Violentmonkey](https://chromewebstore.google.com/detail/jinjaccalgkegednnccohejagnlnfdag)
- [Edge - Violentmonkey](https://microsoftedge.microsoft.com/addons/detail/violentmonkey/eeagobfjdenkkddmbclomhiblgggliao)
- [Firefox - Greasemonkey](https://addons.mozilla.org/zh-CN/firefox/addon/greasemonkey/)

First, we need to install a userscript manager. Choose the corresponding manager for your browser and download it. Once installed, you will see Greasemonkey in the browser’s extensions section.

Then, we can click the above link ([https://greasyfork.org/scripts/501827](https://greasyfork.org/scripts/501827)) to download the script. After downloading, click on the extension icon in the upper right corner of the browser, and then click on the Greasemonkey icon to see the linuxdo enhancement plugin, which can be managed independently.

Finally, open the forum at [https://linux.do/](https://linux.do/) to use the plugin normally. (After installation, refresh the forum page for the plugin to work properly.)

## Development Notes

```
node: v16.15.1
```

Features are developed in component forms. Each new feature registers a new component to avoid conflicts.

Clone this repository and install the dependencies, then run the code.

```shell
git clone https://github.com/dlzmoe/linuxdo-scripts
yarn # Install dependencies
yarn dev # Run locally
yarn build # Build the package
```

The program will automatically trigger local testing.

> To automatically build the Release package, you need to modify the `version` number in `package.json` and write the current version change log in `CHANGELOG.md`.

## Changelog

[version-log.md](https://github.com/dlzmoe/linuxdo-scripts/blob/main/version-log.md)

## Contribution History

![Contributor](https://contrib.rocks/image?repo=dlzmoe/linuxdo-scripts)

[![Star History Chart](https://api.star-history.com/svg?repos=dlzmoe/linuxdo-scripts&type=Date)](https://star-history.com/#dlzmoe/linuxdo-scripts&Date)

## Disclaimer

All functionalities provided in this script run solely within the browser. The source code used is open and transparent, and this script is for learning and research purposes only. It does not employ any profit-making schemes or engage in any profit organizations. Any disputes arising from or related to the use of this script should be amicably resolved between the parties involved. This script does not assume responsibility for any losses or damages of any kind incurred by the user or others as a result of using the software provided by this script. By downloading, installing, and using the software provided in this product, the user indicates trust in the author and their associated agreements and disclaimers.

## License Agreement

[Apache-2.0 license](https://github.com/dlzmoe/linuxdo-scripts/blob/main/LICENSE)
