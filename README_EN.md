# linuxdo Enhancement Plugin (linuxdo-scripts)

Script updates continuously, and issues and PRs are welcomed!

[简体中文](https://github.com/dlzmoe/linuxdo-scripts/blob/main/README.md) | [English](https://github.com/dlzmoe/linuxdo-scripts/blob/main/README_EN.md)

![Version](https://img.shields.io/github/v/release/dlzmoe/linuxdo-scripts?label=linuxdo%20%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6&labelColor=%235D5D5D&color=%23E97435)
![Last Commit](https://img.shields.io/github/last-commit/dlzmoe/linuxdo-scripts)
![Stars](https://img.shields.io/github/stars/dlzmoe%2Flinuxdo-scripts?style=flat)
![License](https://img.shields.io/github/license/dlzmoe/linuxdo-scripts)

The linux.do enhancement plugin features topic list creation time display, floor number display, opening topics in new tabs, forced blocking of certain users' topics, quick replies (customizable), optimized signature image display to prevent image breakage, direct preview of details and comments in the topic list, import/export function setting panel, floor lottery, user-defined tags, viewing only the original poster, auto-scrolling reading, support for custom CSS styles, optimized mixed layout of Chinese and English, level information query, AI summary topic functionality, intelligent reply generation, support for WebDAV synchronization, theme skin switching, and continuous feature updates. New ideas are welcomed!

[GitHub Repository](https://github.com/dlzmoe/linuxdo-scripts) | [Install from Greasyfork](https://greasyfork.org/scripts/501827) | [Bug Feedback & Feature Requests](https://github.com/dlzmoe/linuxdo-scripts/issues/new/choose) | [Usage & Development Documentation](https://linuxdo-scripts-docs.netlify.app/) | [Discord Community](https://discord.gg/n2pErsD7Kg)

> **TIP:**  
> I will share fun features first in the group chat; I feel like I post too frequently.  
> Discord Community: https://discord.gg/n2pErsD7Kg  

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

The development environment is Windows / Chrome / Violent Monkey. If you experience errors or ineffectiveness with other userscript managers, please try Violent Monkey (which I'm currently using and has better compatibility).

> **WARNING:**  
> Arc browser users should use the Violent Monkey extension.  
> Tampermonkey extensions may not work with the Arc browser due to compatibility issues, which are unrelated to the plugin; the issue lies between the browser and userscript manager.

## Features

- [x] Topic list shows creation time
- [x] Display floor number
- [x] Open topics in new tabs
- [x] Force block (blacklist) certain users' topics
- [x] Quick reply to topics (customizable)
- [x] Optimize signature image display to prevent image breakage
- [x] Import/export function setting panel
- [x] Floor lottery
- [x] View only original poster switch
- [x] Auto-scrolling reading
- [x] Dark mode
- [x] User tag feature
- [x] Direct preview of details and comments in the topic list
- [x] Comment box emoji optimization
- [x] Support for custom CSS styles
- [x] Optimized mixed layout displaying Chinese and English
- [x] New level information query
- [x] Switching forum emoji styles
- [x] AI topic summary functionality, intelligent reply generation
- [x] Support for WebDAV synchronization
- [x] Switching forum theme skins

<details>
<summary>Some Screenshot Demos:</summary>

| ![image](https://github.com/user-attachments/assets/f3fb854f-e6fd-4da4-9a9c-377b6537fab7) | ![image](https://github.com/user-attachments/assets/3b2a9e63-3939-4dbc-a00f-c713ca2c7f33) |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| ![image](https://github.com/user-attachments/assets/2c67ab9f-2359-4ab5-b0dd-0f257560b98b) | ![image](https://github.com/user-attachments/assets/ed4f925c-e26c-43ce-a886-fa764ac341b5) |
| ![image](https://github.com/user-attachments/assets/c6ba9abb-43aa-40ce-a4a1-b9cdae229a2d) | ![image](https://github.com/user-attachments/assets/399c1645-36e1-4fe2-a671-ae40685e87ca) |

</details>

## Usage Instructions

Click this link to automatically trigger the userscript installation, and subsequent updates can also be triggered.

[Install Script](https://greasyfork.org/scripts/501827)

## Development Notes

```
node: v16.15.1
```

Features are developed as components, and a new component is registered for each new feature to avoid conflicts.

Clone the repository and download dependencies, then run the code:

```shell
git clone https://github.com/dlzmoe/linuxdo-scripts
yarn # Install dependencies
yarn dev # Run locally
yarn build # Package build
```

The program will automatically trigger local tests.

> Regarding automatic Release package building, modify the `version` number in `package.json` and write the current version change log in `CHANGELOG.md`.

## Change Log

[version-log.md](https://github.com/dlzmoe/linuxdo-scripts/blob/main/version-log.md)

## Contribution History

![Contributor](https://contrib.rocks/image?repo=dlzmoe/linuxdo-scripts)

[![Star History Chart](https://api.star-history.com/svg?repos=dlzmoe/linuxdo-scripts&type=Date)](https://star-history.com/#dlzmoe/linuxdo-scripts&Date)

## Disclaimer

All functionalities provided in this script run only in the browser, the source code used is open and transparent, and this script is for learning and research purposes only. It does not use any profit schemes or participate in any profit-related organizations. Any disputes arising from or related to the use of this script should be resolved amicably by all parties. This script does not bear any responsibility for any losses or damages that may occur to users or others while using the software provided in this script. If users download, install, and use the software provided in this product, it indicates that they trust the author and related agreements and disclaimers.

## License Agreement

[Apache-2.0 license](https://github.com/dlzmoe/linuxdo-scripts/blob/main/LICENSE)