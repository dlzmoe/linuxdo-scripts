## linuxdo Enhanced Plugin (linuxdo-scripts)

Scripts are continuously updated. Issues and PR submissions are welcome!

[简体中文](https://github.com/dlzmoe/linuxdo-scripts/blob/main/README.md) | [English](https://github.com/dlzmoe/linuxdo-scripts/blob/main/README_EN.md)

![Release Badge](https://img.shields.io/github/v/release/dlzmoe/linuxdo-scripts?label=linuxdo%20%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6&labelColor=%235D5D5D&color=%23E97435)
![Last Commit Badge](https://img.shields.io/github/last-commit/dlzmoe/linuxdo-scripts)
![Stars Badge](https://img.shields.io/github/stars/dlzmoe%2Flinuxdo-scripts?style=flat)
![License Badge](https://img.shields.io/github/license/dlzmoe/linuxdo-scripts)

The linux.do enhanced plugin adds features such as displaying creation time for topics, showing floor count, opening topics in a new tab, forcing block on certain users' topics, quick replies (customizable), optimizing signature image display, directly previewing details and comments in the topic list, import/export settings panel, floor lottery, user-defined tags, view only the original poster, auto-scrolling reading, support for custom CSS styles, mixed Chinese and English optimization, rank information query, AI topic summarization, intelligent reply generation, WebDAV sync support, theme skin switching, and more! More features can be found in the settings list. Continuous updates are made, and new ideas are welcome!

[GitHub Repository](https://github.com/dlzmoe/linuxdo-scripts) | [Greasyfork Store Installation](https://greasyfork.org/scripts/501827) | [Bug Feedback & Feature Requests](https://github.com/dlzmoe/linuxdo-scripts/issues/new/choose) | [Usage and Development Documentation](https://linuxdo-scripts-docs.zishu.me/) | [Discord Community](https://discord.gg/n2pErsD7Kg)


## Table of Contents
- [Table of Contents](#table-of-contents)
- [Features](#features)
- [Usage Instructions](#usage-instructions)
  - [Beginner Method](#beginner-method)
- [Development Instructions](#development-instructions)
  - [CSP Issues](#csp-issues)
- [Changelog](#changelog)
- [Contribution History](#contribution-history)
- [Disclaimer](#disclaimer)
- [Copyright Agreement](#copyright-agreement)

---

The development environment is Windows / Chrome / Violentmonkey. If there are errors or it doesn’t work with other userscript managers, try using Violentmonkey (which I’m currently using, with better compatibility).

> **WARNING**  
> Arc browser users should use Violentmonkey extension.  
> The monkey tampering extension cannot be used under the Arc browser due to compatibility issues.

## Features

- [x] Display creation time for topics
- [x] Show floor count
- [x] Open topics in a new tab
- [x] Force block (blacklist) certain users' topics
- [x] Quick replies for topics (customizable)
- [x] Optimize signature image display to prevent image breaking
- [x] Import/export settings panel
- [x] Floor lottery
- [x] Toggle view only the original poster
- [x] Auto-scrolling reading
- [x] Dark mode
- [x] User tagging feature
- [x] Directly preview details and comments in the topic list
- [x] Emoji optimization in comment boxes
- [x] Support custom CSS styles
- [x] Mixed Chinese and English display optimization
- [x] New rank information query
- [x] Switch forum emoji styles
- [x] AI summarization of topics and intelligent reply generation
- [x] Support WebDAV synchronization
- [x] Switch forum theme skin
- [x] More features are available in the settings list

<details>
<summary>Some Screenshot Demos:</summary>

| ![image](https://github.com/user-attachments/assets/f3fb854f-e6fd-4da4-9a9c-377b6537fab7) | ![image](https://github.com/user-attachments/assets/3b2a9e63-3939-4dbc-a00f-c713ca2c7f33) |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| ![image](https://github.com/user-attachments/assets/2c67ab9f-2359-4ab5-b0dd-0f257560b98b) | ![image](https://github.com/user-attachments/assets/ed4f925c-e26c-43ce-a886-fa764ac341b5) |
| ![image](https://github.com/user-attachments/assets/c6ba9abb-43aa-40ce-a4a1-b9cdae229a2d) | ![image](https://github.com/user-attachments/assets/399c1645-36e1-4fe2-a671-ae40685e87ca) |

</details>

## Usage Instructions

Click the following link to enter the Greasyfork store for installation.

[https://greasyfork.org/scripts/501827](https://greasyfork.org/scripts/501827)

### Beginner Method

- [Chrome - Violentmonkey](https://chromewebstore.google.com/detail/jinjaccalgkegednnccohejagnlnfdag)
- [Edge - Violentmonkey](https://microsoftedge.microsoft.com/addons/detail/violentmonkey/eeagobfjdenkkddmbclomhiblgggliao)
- [Firefox - Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)

First, you need to install a userscript manager; choose the appropriate manager for your browser, download and install it. After installation, you will see Greasemonkey in the browser’s extensions section.

Then, click the link above ([https://greasyfork.org/scripts/501827](https://greasyfork.org/scripts/501827)) to download the script. After downloading, click the extension icon in the upper right corner of your browser, select the Greasemonkey icon, and you'll find the linuxdo enhanced plugin for self-management.

Finally, open [https://linux.do/](https://linux.do/) forum to use the plugin normally. (You need to refresh the forum page after installation for it to work properly)

## Development Instructions

```
node: v16.15.1
```

> **NOTE**  
> Prerequisite: Since the forum has enabled CSP, you cannot inject scripts during local development. You need to install the [Google Extension - Disable-CSP](https://github.com/lisonge/Disable-CSP) to bypass CSP and enable the first option `Disable HTTP CSP`.

Features are developed as components so that each new feature can register a new component to avoid conflicts.

Clone this repository, install dependencies, and run the code.

```shell
git clone https://github.com/dlzmoe/linuxdo-scripts
yarn # Install dependencies
yarn dev # Run locally
```

No need to build. After submitting a PR, I will review it, and if there are no major issues, it will be merged as soon as possible.

### CSP Issues

If loading the local script shows `Refused to load the script xxxxx`, you can use [Disable-CSP](https://github.com/lisonge/Disable-CSP) to temporarily disable CSP. Remember to revert after development completion.

## Changelog

[version-log.md](https://github.com/dlzmoe/linuxdo-scripts/blob/main/version-log.md)

## Contribution History

![Contributor](https://contrib.rocks/image?repo=dlzmoe/linuxdo-scripts)

[![Stargazers over time](https://starchart.cc/dlzmoe/linuxdo-scripts.svg?variant=adaptive)](https://starchart.cc/dlzmoe/linuxdo-scripts)

## Disclaimer

All features provided by this script run only in the browser. The source code used is publicly visible and transparent. This script is for educational research purposes only and does not use any profit schemes or participate in any profit organizations. Any disputes arising from the use of this script or related to it should be resolved amicably. This script is not responsible for any form of loss or harm caused to users or others by using the software provided by this script. By downloading, installing, and using the software provided in this product, users indicate their trust in the author and related agreements & disclaimers.

## Copyright Agreement

[MIT license](https://github.com/dlzmoe/linuxdo-scripts/blob/main/LICENSE)