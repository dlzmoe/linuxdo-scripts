<p align="center"><img src="./github-header-image.png"></p>
<h2 align="center">LinuxDo Enhanced Plugin (linuxdo-scripts)</h2>
<p align="center">Scripts are continuously updated; feel free to raise issues and submit pull requests~</p>

[简体中文](https://github.com/dlzmoe/linuxdo-scripts/blob/main/README.md) | [English](https://github.com/dlzmoe/linuxdo-scripts/blob/main/README_EN.md)

<p align="center">
<img src="https://img.shields.io/github/v/release/dlzmoe/linuxdo-scripts?label=linuxdo%20%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6&labelColor=%235D5D5D&color=%23E97435">
<img src="https://img.shields.io/github/last-commit/dlzmoe/linuxdo-scripts">
<img src="https://img.shields.io/github/stars/dlzmoe%2Flinuxdo-scripts?style=flat">
<img src="https://img.shields.io/github/license/dlzmoe/linuxdo-scripts">
</p>

The LinuxDo enhanced plugin shows the creation time of topics in the topic list, displays the floor number, opens topics in a new tab, forces block (blacklist) topics from certain users, quick reply to topics (supporting customization), optimizes signature image display to prevent image breakage, allows direct preview of details and comments in the topic list, import/export functionality settings panel, floor lottery, user-defined tags, a mode to only view the original poster, auto-scrolling reading, supports custom CSS styles, optimizes Chinese and English mixed arrangement, level information query, AI summary topic feature, intelligently generates replies, supports WebDAV synchronization, switches forum theme skins, etc. More features can be found in the settings list. Features are continuously updated, and new ideas are welcome!

[GitHub Repository](https://github.com/dlzmoe/linuxdo-scripts) |
[Install from Greasyfork Store](https://greasyfork.org/scripts/501827) |
[Bug Reporting and Feature Requests](https://github.com/dlzmoe/linuxdo-scripts/issues/new/choose) |
[Usage and Development Documentation](https://linuxdo-scripts-docs.netlify.app/) |
[Discord Community](https://discord.gg/n2pErsD7Kg)

> [!TIP] 
> I will share any fun features in the group chat as soon as they are released. I feel like I post too frequently!  
> Discord Community: https://discord.gg/n2pErsD7Kg  

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/anghunk)

## Table of Contents
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Usage Instructions](#usage-instructions)
  - [Development Notes](#development-notes)
  - [Change Log](#change-log)
  - [Contribution History](#contribution-history)
  - [Disclaimer](#disclaimer)
  - [License Agreement](#license-agreement)

---

The development environment is Windows / Chrome / Violentmonkey. If you encounter errors or issues with other script managers, I suggest trying Violentmonkey (which I am currently using and has better compatibility).

> [!WARNING]  
> Arc browser users should use the Violentmonkey extension. The tampermonkey extensions may not work under the Arc browser due to compatibility issues, which are unrelated to the plugin; the problem lies between the browser and the script manager.

## Features

- [x] Topic list displays creation time
- [x] Displays floor number
- [x] Opens topics in a new tab
- [x] Force block (blacklist) certain users' topics
- [x] Quick reply to topics (customizable)
- [x] Optimize signature image display to prevent image breakage
- [x] Import/export settings panel functionality
- [x] Floor lottery
- [x] Toggle “View Only Original Poster” feature
- [x] Auto-scrolling reading
- [x] Night mode
- [x] User tagging feature
- [x] Direct preview of details and comments in the topic list
- [x] Optimization of emoji in the comment box
- [x] Supports custom CSS styles
- [x] Optimizes display of Chinese and English mixed content
- [x] Added level information query
- [x] Switches forum emoji styles
- [x] AI summary topic feature and intelligently generated replies
- [x] Supports WebDAV synchronization
- [x] Switches forum theme skins
- [x] More features can be found in the settings list

<details>
<summary>Some demo screenshots:</summary>

| ![image](https://github.com/user-attachments/assets/f3fb854f-e6fd-4da4-9a9c-377b6537fab7) | ![image](https://github.com/user-attachments/assets/3b2a9e63-3939-4dbc-a00f-c713ca2c7f33) |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| ![image](https://github.com/user-attachments/assets/2c67ab9f-2359-4ab5-b0dd-0f257560b98b) | ![image](https://github.com/user-attachments/assets/ed4f925c-e26c-43ce-a886-fa764ac341b5) |
| ![image](https://github.com/user-attachments/assets/c6ba9abb-43aa-40ce-a4a1-b9cdae229a2d) | ![image](https://github.com/user-attachments/assets/399c1645-36e1-4fe2-a671-ae40685e87ca) |

</details>


## Usage Instructions

Click this link to automatically trigger the tampermonkey script installation; subsequent updates can also be triggered this way.

https://greasyfork.org/scripts/501827


### (Simple Method)

- [Chrome - Violentmonkey](https://chromewebstore.google.com/detail/jinjaccalgkegednnccohejagnlnfdag)
- [Edge - Violentmonkey](https://microsoftedge.microsoft.com/addons/detail/violentmonkey/eeagobfjdenkkddmbclomhiblgggliao)
- [Firefox - Greasemonkey](https://addons.mozilla.org/zh-CN/firefox/addon/greasemonkey/)

First, we need to install a user script manager; select the appropriate manager for your browser and install it. After installation, you will see Greasemonkey in your browser's extensions.

Then we can click the above link ([https://greasyfork.org/scripts/501827](https://greasyfork.org/scripts/501827)) to download the script. Once downloaded, click on the extension icon in the top right corner of your browser, then click on the Greasemonkey icon to find the LinuxDo enhanced plugin, which you can manage independently.

Finally, we can open the forum at [https://linux.do/](https://linux.do/) to use the plugin normally (you need to refresh the forum page after installation for it to work properly).


## Development Notes

```
node: v16.15.1
```

Functions are developed as components, where each new function registers a new component to avoid conflicts.

To install this repository, download the dependencies, and run the code:

```shell
git clone https://github.com/dlzmoe/linuxdo-scripts
yarn # Install dependencies
yarn dev # Run locally
yarn build # Build package
```

The program will automatically trigger local testing.

> To automatically build release packages, change the `version` in `package.json` and write the current version update log in `CHANGELOG.md`.

### CSP Issues

If you encounter `Refused to load the script xxxxx` when loading the local script, you can temporarily disable CSP using [Disable-CSP](https://github.com/lisonge/Disable-CSP). Remember to revert this change after development is done.


## Change Log

[version-log.md](https://github.com/dlzmoe/linuxdo-scripts/blob/main/version-log.md)


## Contribution History

![Contributor](https://contrib.rocks/image?repo=dlzmoe/linuxdo-scripts)

[![Star History Chart](https://api.star-history.com/svg?repos=dlzmoe/linuxdo-scripts&type=Date)](https://star-history.com/#dlzmoe/linuxdo-scripts&Date)


## Disclaimer

All features provided in this script run only in a browser, with the source code being open and transparent. This script is intended for study and research use only, without any profit scheme or involvement in any profit organization. Any disputes arising from or related to the use of this script should be resolved amicably, and this script bears no responsibility for any form of loss or harm that users or others may incur while using the provided software. By downloading, installing, and using the software provided in this product, users indicate their trust in the author and their related agreements and disclaimers.


## License Agreement

[Apache-2.0 license](https://github.com/dlzmoe/linuxdo-scripts/blob/main/LICENSE)
