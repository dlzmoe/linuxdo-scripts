<p align="center"><img src="./github-header-image.png"></p>
<h2 align="center">linuxdo Enhancement Plugin (linuxdo-scripts)</h2>
<p align="center">Scripts are continuously updated, feel free to raise issues and submit PRs ~</p>

[简体中文](https://github.com/dlzmoe/linuxdo-scripts/blob/main/README.md) | [English](https://github.com/dlzmoe/linuxdo-scripts/blob/main/README_EN.md)

<p align="center">
<img src="https://img.shields.io/github/v/release/dlzmoe/linuxdo-scripts?label=linuxdo%20%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6&labelColor=%235D5D5D&color=%23E97435">
<img src="https://img.shields.io/github/last-commit/dlzmoe/linuxdo-scripts">
<img src="https://img.shields.io/github/stars/dlzmoe%2Flinuxdo-scripts?style=flat">
<img src="https://img.shields.io/github/license/dlzmoe/linuxdo-scripts">
</p>

The linux.do enhancement plugin includes a variety of features: topic list displays the creation time, shows floor numbers, opens topics in a new tab, forcibly blocks (blacklists) a user's topics, quick reply to topics (supports customization), optimizes signature image display to prevent image breaking, allows direct preview of details and comments in topic lists, imports and exports function settings panel, lottery by floor, user-defined tags, view only the floor owner, auto-scroll reading, supports custom CSS styles, optimizes mixed Chinese and English text display, queries level information, AI summarizes topic function, intelligent reply generation, supports WebDAV synchronization, switches forum themes, etc. New features are continuously updated, and we welcome new ideas!

[GitHub Repository](https://github.com/dlzmoe/linuxdo-scripts) |
[Greasyfork Store Installation](https://greasyfork.org/scripts/501827) |
[Bug Report and Feature Requests](https://github.com/dlzmoe/linuxdo-scripts/issues/new/choose) |
[Usage and Development Documentation](https://linuxdo-scripts-docs.netlify.app/) |
[Discord Community](https://discord.gg/n2pErsD7Kg)

> [!TIP]
> I will share interesting features in the group chat as soon as they are available. I feel like I'm posting too frequently.
> Discord Community: https://discord.gg/n2pErsD7Kg  

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/anghunk)

## Table of Contents
- [Table of Contents](#table-of-contents)
- [Features](#features)
- [Usage Instructions](#usage-instructions)
- [Development Instructions](#development-instructions)
- [Changelog](#changelog)
- [Contribution History](#contribution-history)
- [Disclaimer](#disclaimer)
- [License](#license)

---

The development environment is Windows / Chrome / ViolentMonkey. If there are errors or it does not work with other userscript managers, you might try using ViolentMonkey (which I am currently using, it has better compatibility).

> [!WARNING]  
>  Arc browser users should use the ViolentMonkey extension.
>  The tampermonkey extension cannot function under Arc browser due to compatibility issues between the browser and userscript managers, unrelated to the plugin.

## Features

- [x] Topic list displays creation time
- [x] Displays floor numbers
- [x] Opens topics in new tabs
- [x] Forcibly block (blacklist) certain users' topics
- [x] Quick replies to topics (supports customization)
- [x] Optimize signature image display to prevent image breaking
- [x] Import and export function settings panel
- [x] Lottery by floor
- [x] View only floor owners switch
- [x] Auto-scroll reading
- [x] Night mode
- [x] User tagging feature
- [x] Directly preview details and comments in topic lists
- [x] Emoji optimization in comment box
- [x] Supports custom CSS styles
- [x] Optimizes mixed Chinese and English text display
- [x] New level information querying
- [x] Switch forum emoji styles
- [x] AI summarizes topics and intelligently generates replies
- [x] Supports WebDAV synchronization
- [x] Switches forum theme skins

<details>
<summary>Some Screenshots:</summary>

| ![image](https://github.com/user-attachments/assets/f3fb854f-e6fd-4da4-9a9c-377b6537fab7) | ![image](https://github.com/user-attachments/assets/3b2a9e63-3939-4dbc-a00f-c713ca2c7f33) |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| ![image](https://github.com/user-attachments/assets/2c67ab9f-2359-4ab5-b0dd-0f257560b98b) | ![image](https://github.com/user-attachments/assets/ed4f925c-e26c-43ce-a886-fa764ac341b5) |
| ![image](https://github.com/user-attachments/assets/c6ba9abb-43aa-40ce-a4a1-b9cdae229a2d) | ![image](https://github.com/user-attachments/assets/399c1645-36e1-4fe2-a671-ae40685e87ca) |

</details>

## Usage Instructions

Click the following link to automatically trigger the userscript installation process, and future updates can also be triggered in the same way.

https://greasyfork.org/scripts/501827

### (For Beginners)

- [Chrome - ViolentMonkey](https://chromewebstore.google.com/detail/jinjaccalgkegednnccohejagnlnfdag)
- [Edge - ViolentMonkey](https://microsoftedge.microsoft.com/addons/detail/violentmonkey/eeagobfjdenkkddmbclomhiblgggliao)
- [Firefox - Greasemonkey](https://addons.mozilla.org/zh-CN/firefox/addon/greasemonkey/)

First, we need to install a userscript manager. Choose the corresponding manager for your browser and download and install it. Once installed, you can see Greasemonkey in your browser’s extensions.

Then we can click the link above (https://greasyfork.org/scripts/501827) to download the script. Once downloaded, click on the extension icon in the upper right corner of the browser, click on the Greasemonkey icon, and you will see the Linuxdo Enhancement Plugin, which you can manage at will.

Finally, go to https://linux.do/ forum to use the plugin normally. (You need to refresh the forum page for the plugin to work after installation.)

## Development Instructions

```
node: v16.15.1
```

Features are developed as components, registering a new component for each new feature to avoid conflicts.

Install this repository and download dependencies, then run the code.

```shell
git clone https://github.com/dlzmoe/linuxdo-scripts
yarn # Install dependencies
yarn dev # Run locally
yarn build # Package build
```

The program will automatically trigger local testing.

> For automatic Release package building, modify the `version` number in `package.json`, and write the current version update log in `CHANGELOG.md`.

## Changelog

[version-log.md](https://github.com/dlzmoe/linuxdo-scripts/blob/main/version-log.md)

## Contribution History

![Contributor](https://contrib.rocks/image?repo=dlzmoe/linuxdo-scripts)

[![Star History Chart](https://api.star-history.com/svg?repos=dlzmoe/linuxdo-scripts&type=Date)](https://star-history.com/#dlzmoe/linuxdo-scripts&Date)

## Disclaimer

All features provided in this script run only in the browser, the source code used is transparent and public, and this script is for educational and research purposes only. It does not use any profit scheme or participate in any profit organization. Any disputes arising from or related to the use of this script should be resolved amicably by both parties. This script does not bear any responsibility for any form of loss or damage caused to the user or others while using the software provided by this script. By downloading, installing, and using the software provided in this product, the user indicates their trust in the author and their related agreements and disclaimers.

## License

[Apache-2.0 license](https://github.com/dlzmoe/linuxdo-scripts/blob/main/LICENSE)
