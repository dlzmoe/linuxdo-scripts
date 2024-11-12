<h2 align="center">linuxdo Enhancement Plugin (linuxdo-scripts)</h2>
<p align="center">Scripts are continuously updated, issues and pull requests are welcome ~</p>

[简体中文](https://github.com/dlzmoe/linuxdo-scripts/blob/main/README.md) | [English](https://github.com/dlzmoe/linuxdo-scripts/blob/main/README_EN.md)

<p align="center">
<img src="https://img.shields.io/github/v/release/dlzmoe/linuxdo-scripts?label=linuxdo%20enhancement%20plugin&labelColor=%235D5D5D&color=%23E97435">
<img src="https://img.shields.io/github/last-commit/dlzmoe/linuxdo-scripts">
<img src="https://img.shields.io/github/stars/dlzmoe%2Flinuxdo-scripts?style=flat">
<img src="https://img.shields.io/github/license/dlzmoe/linuxdo-scripts">
</p>

The linux.do enhancement plugin includes features such as displaying creation times in the topic list, showing floor counts, opening topics in new tabs, forcing block (blacklisting) of certain users’ topics, quick replies (customizable), optimizing signature image display to prevent image breakage, directly previewing details and comments in the topic list, import/export for the feature settings panel, floor lottery, user-defined tags, viewing only the original poster, automatic scrolling reading, supporting custom CSS styles, optimizing mixed Chinese and English display, querying level information, AI summarization of topics, intelligent reply generation, WebDAV synchronization, switching forum theme skins, and much more. Please check the settings list for more features. Features are continuously updated, and new ideas are welcome!

[Github Repository](https://github.com/dlzmoe/linuxdo-scripts) |  
[Install from Greasyfork](https://greasyfork.org/scripts/501827) |  
[Report bugs and request features](https://github.com/dlzmoe/linuxdo-scripts/issues/new/choose) |  
[Usage and development documentation](https://linuxdo-scripts-docs.netlify.app/) |  
[Discord Community](https://discord.gg/n2pErsD7Kg)

> [!TIP]  
> Any fun features will be shared in the group chat in real-time. I feel like I’m posting too frequently.  
> Discord Community: https://discord.gg/n2pErsD7Kg  

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/anghunk)

## Table of Contents
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Usage](#usage)
  - [Development Instructions](#development-instructions)
  - [Changelog](#changelog)
  - [Contribution History](#contribution-history)
  - [Disclaimer](#disclaimer)
  - [License Agreement](#license-agreement)

---

The development environment is Windows / Chrome / Violentmonkey. If you encounter errors or issues with other userscript managers, you can try using Violentmonkey (which I am currently using and is more compatible).

> [!WARNING]  
> If you are using the Arc browser, please use the Violentmonkey extension.  
> The tampermonkey extension cannot be used under the Arc browser due to compatibility issues, which is a problem between the browser and the userscript manager and not related to the plugin.  

## Features

- [x] Display creation time in topic list
- [x] Show floor counts
- [x] Open topics in new tabs
- [x] Force block (blacklist) certain users' topics
- [x] Quick reply to topics (customizable)
- [x] Optimize signature images to prevent image breakage
- [x] Import/export for feature settings panel
- [x] Floor lottery feature
- [x] View only the original poster's posts feature
- [x] Automatic scrolling reading
- [x] Dark mode
- [x] User tagging feature
- [x] Directly preview details and comments in the topic list
- [x] Emoji optimization in comment box
- [x] Support custom CSS styles
- [x] Optimize mixed Chinese and English display
- [x] New level information query
- [x] Switch forum emoji style
- [x] AI summarization of topics, generate replies intelligently
- [x] Support WebDAV synchronization
- [x] Switch forum theme skin
- [x] More features in the settings list

<details>
<summary>Some demonstration screenshots:</summary>

| ![image](https://github.com/user-attachments/assets/f3fb854f-e6fd-4da4-9a9c-377b6537fab7) | ![image](https://github.com/user-attachments/assets/3b2a9e63-3939-4dbc-a00f-c713ca2c7f33) |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| ![image](https://github.com/user-attachments/assets/2c67ab9f-2359-4ab5-b0dd-0f257560b98b) | ![image](https://github.com/user-attachments/assets/ed4f925c-e26c-43ce-a886-fa764ac341b5) |
| ![image](https://github.com/user-attachments/assets/c6ba9abb-43aa-40ce-a4a1-b9cdae229a2d) | ![image](https://github.com/user-attachments/assets/399c1645-36e1-4fe2-a671-ae40685e87ca) |

</details>

## Usage

Clicking this link will automatically trigger the userscript installation process, and updates can also be triggered afterward.

https://greasyfork.org/scripts/501827


### (Beginner Method)

- [Chrome - Violentmonkey](https://chromewebstore.google.com/detail/jinjaccalgkegednnccohejagnlnfdag)
- [Edge - Violentmonkey](https://microsoftedge.microsoft.com/addons/detail/violentmonkey/eeagobfjdenkkddmbclomhiblgggliao)
- [Firefox - Greasemonkey](https://addons.mozilla.org/zh-CN/firefox/addon/greasemonkey/)

First, we need to install a userscript manager. Choose the corresponding manager for your browser to download and install. After installation, you can see the userscript manager in your browser's extensions.

Then we can click the above link ([https://greasyfork.org/scripts/501827](https://greasyfork.org/scripts/501827)) to download the script. After downloading, click the extension icon in the upper right corner of the browser, click the userscript manager icon, and you can see the linuxdo enhancement plugin and manage it yourself.

Finally, navigate to [https://linux.do/](https://linux.do/) forum to use the plugin normally. (Refresh the forum page after installation to use it properly.)


## Development Instructions

```
node: v16.15.1
```

> [!NOTE]
> Prerequisite: Since the forum has CSP enabled, it is not possible to inject scripts during local development. You need to install [Disable-CSP Chrome Extension](https://github.com/lisonge/Disable-CSP) to bypass CSP, and enable the first option `Disable HTTP CSP`.

Features are developed in a component-based approach. Each time a new feature is added, a new component is registered to avoid conflicts.

You can clone this repository, install dependencies, and run the code.

```shell
git clone https://github.com/dlzmoe/linuxdo-scripts
yarn # Install dependencies
yarn dev # Run locally
```

No need to build. After PR, I will review the code and merge it as soon as possible if there are no major issues.

### CSP Issues

If you encounter the error `Refused to load the script xxxxx` while loading local scripts, you can temporarily disable CSP using [Disable-CSP](https://github.com/lisonge/Disable-CSP). Remember to revert this after development.

## Changelog

[version-log.md](https://github.com/dlzmoe/linuxdo-scripts/blob/main/version-log.md)


## Contribution History

![Contributor](https://contrib.rocks/image?repo=dlzmoe/linuxdo-scripts)

[![Star History Chart](https://api.star-history.com/svg?repos=dlzmoe/linuxdo-scripts&type=Date)](https://star-history.com/#dlzmoe/linuxdo-scripts&Date)


## Disclaimer

All features provided in this script run only in the browser, the source code used is publicly available and transparent. This script is meant for learning and research purposes only, not for any profit-making schemes or involvement in any profit-making organizations. Any disputes arising from or related to the use of this script should be resolved amicably by both parties. This script bears no responsibility for any form of loss or injury caused to the user or others while using the software provided by this script. By downloading, installing, and using the software provided in this product, the user indicates trust in the author and its related agreements and disclaimers.

## License Agreement

[Apache-2.0 license](https://github.com/dlzmoe/linuxdo-scripts/blob/main/LICENSE)
