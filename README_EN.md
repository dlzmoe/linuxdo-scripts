## linuxdo Enhancement Plugin (linuxdo-scripts)

Scripts are continuously updated. Issues and pull requests are welcome!

[简体中文](https://github.com/dlzmoe/linuxdo-scripts/blob/main/README.md) | [English](https://github.com/dlzmoe/linuxdo-scripts/blob/main/README_EN.md)

![Release](https://img.shields.io/github/v/release/dlzmoe/linuxdo-scripts?label=linuxdo%20%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6&labelColor=%235D5D5D&color=%23E97435) ![Last Commit](https://img.shields.io/github/last-commit/dlzmoe/linuxdo-scripts) ![Stars](https://img.shields.io/github/stars/dlzmoe%2Flinuxdo-scripts?style=flat) ![License](https://img.shields.io/github/license/dlzmoe/linuxdo-scripts)

The linux.do enhancement plugin provides features such as displaying the creation time of topics, showing floor numbers, opening topics in new tabs, forcing block (blacklisting) of certain topics, convenient replies (customizable), optimizing signature image display, previewing details and comments directly in the topic list, import/export settings panel, floor lotteries, user-defined tags, view only the author's posts, auto-scrolling reading, support for custom CSS styles, mixed rendering of Chinese and English, level information queries, AI-based topic summary feature, intelligent reply generation, support for WebDAV synchronization, switching forum theme skins, and more. Please check the settings list for continuous updates and feel free to propose new ideas!

[GitHub Repository](https://github.com/dlzmoe/linuxdo-scripts) | [Install from Greasyfork Store](https://greasyfork.org/scripts/501827) | [Bug Reporting & Feature Requests](https://github.com/dlzmoe/linuxdo-scripts/issues/new/choose) | [Usage and Development Documentation](https://linuxdo-scripts-docs.netlify.app/) | [Discord Community](https://discord.gg/n2pErsD7Kg)

> **Note:**  
> I will share interesting features in the group chat as soon as possible, as I feel that posting too frequently may be annoying.  
> Join the Discord community: https://discord.gg/n2pErsD7Kg  

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/anghunk)

## Table of Contents
- [Table of Contents](#table-of-contents)
- [Features](#features)
- [Usage](#usage)
- [Development Notes](#development-notes)
- [Changelog](#changelog)
- [Contribution History](#contribution-history)
- [Disclaimer](#disclaimer)
- [License Agreement](#license-agreement)

---

The development environment is Windows / Chrome / Violentmonkey. If you encounter errors or it doesn't work with other userscript managers, try using Violentmonkey (which I am currently using and is quite compatible).

> **Warning:**  
> Arc browser users should use the Violentmonkey extension.  
> The tamper monkey extension cannot be used in Arc browser due to compatibility issues.

## Features

- [x] Display creation time in topic list
- [x] Show floor numbers
- [x] Open topics in a new tab
- [x] Force block (blacklist) certain topics
- [x] Convenient replies (customizable)
- [x] Optimize signature image display
- [x] Import/export feature settings panel
- [x] Floor lottery
- [x] Toggle view only the author's posts
- [x] Auto-scrolling reading
- [x] Dark mode
- [x] User tagging feature
- [x] Direct preview of details and comments in topic list
- [x] Comment box emoji optimization
- [x] Support for custom CSS styles
- [x] Mixed rendering of Chinese and English is optimized
- [x] Added level information query
- [x] Switch forum emoji styles
- [x] AI-based topic summary feature and intelligent reply generation
- [x] Support for WebDAV synchronization
- [x] Switch forum theme skins
- [x] More features, please check the settings list

<details>
<summary>Demo Screenshots:</summary>

| ![image](https://github.com/user-attachments/assets/f3fb854f-e6fd-4da4-9a9c-377b6537fab7) | ![image](https://github.com/user-attachments/assets/3b2a9e63-3939-4dbc-a00f-c713ca2c7f33) |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| ![image](https://github.com/user-attachments/assets/2c67ab9f-2359-4ab5-b0dd-0f257560b98b) | ![image](https://github.com/user-attachments/assets/ed4f925c-e26c-43ce-a886-fa764ac341b5) |
| ![image](https://github.com/user-attachments/assets/c6ba9abb-43aa-40ce-a4a1-b9cdae229a2d) | ![image](https://github.com/user-attachments/assets/399c1645-36e1-4fe2-a671-ae40685e87ca) |

</details>

## Usage

Click the link to enter the Greasyfork store to download and install.

[https://greasyfork.org/scripts/501827](https://greasyfork.org/scripts/501827)

### (For Beginners)

- [Chrome - Violentmonkey](https://chromewebstore.google.com/detail/jinjaccalgkegednnccohejagnlnfdag)
- [Edge - Violentmonkey](https://microsoftedge.microsoft.com/addons/detail/violentmonkey/eeagobfjdenkkddmbclomhiblgggliao)
- [Firefox - Greasemonkey](https://addons.mozilla.org/zh-CN/firefox/addon/greasemonkey/)

First, you need to install a userscript manager by choosing the one that corresponds to your browser. Once installed, you will see the userscript manager in the browser's extensions.

Then, you can click the above link ([https://greasyfork.org/scripts/501827](https://greasyfork.org/scripts/501827)) to download the script. After downloading, click on the extensions icon in the top right corner of the browser, and you will see the linuxdo enhancement plugin, which you can manage freely.

Finally, open the [https://linux.do/](https://linux.do/) forum and the plugin should work normally. (You need to refresh the forum page after installation for it to work properly.)

## Development Notes

```
node: v16.15.1
```

> **Note:**  
> Essential: Due to the forum's CSP, scripts cannot be injected during local development, so you need to install the [Chrome extension - Disable-CSP](https://github.com/lisonge/Disable-CSP) to bypass CSP and enable the first option `Disable HTTP CSP`.

Features are developed as components to avoid conflicts when adding new features.

Clone this repository and install dependencies to run the code.

```shell
git clone https://github.com/dlzmoe/linuxdo-scripts
yarn # Install dependencies
yarn dev # Run locally
```

No build is required; I will review PR codes and merge them in the shortest time possible if there are no major issues.

### CSP Issues

If you see `Refused to load the script xxxxx` when loading local scripts, you can use [Disable-CSP](https://github.com/lisonge/Disable-CSP) to temporarily disable CSP. Remember to revert after development.

## Changelog

[version-log.md](https://github.com/dlzmoe/linuxdo-scripts/blob/main/version-log.md)

## Contribution History

![Contributor](https://contrib.rocks/image?repo=dlzmoe/linuxdo-scripts)

[![Star History Chart](https://api.star-history.com/svg?repos=dlzmoe/linuxdo-scripts&type=Date)](https://star-history.com/#dlzmoe/linuxdo-scripts&Date)

## Disclaimer

All features provided in this script run solely within the browser. The source code used is open and transparent. This script is for study and research purposes only, does not use any profit-making schemes, or participate in any profit-making organizations. Any disputes arising from the use of this script should be resolved amicably. This script is not responsible for any form of loss or damage that may be caused to the user or others while using the software provided by this script. By downloading, installing, and using the software provided in this product, users indicate their trust in the author and related agreements and disclaimers.

## License Agreement

[Apache-2.0 license](https://github.com/dlzmoe/linuxdo-scripts/blob/main/LICENSE)
