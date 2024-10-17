## linuxdo Enhanced Plugin (linuxdo-scripts)

Scripts are continuously updated, and feedback through issues and pull requests is welcome!

[简体中文](https://github.com/dlzmoe/linuxdo-scripts/blob/main/README.md) | [English](https://github.com/dlzmoe/linuxdo-scripts/blob/main/README_EN.md)

![Version Badge](https://img.shields.io/github/v/release/dlzmoe/linuxdo-scripts?label=linuxdo%20%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6&labelColor=%235D5D5D&color=%23E97435)
![Last Commit Badge](https://img.shields.io/github/last-commit/dlzmoe/linuxdo-scripts)
![Stars Badge](https://img.shields.io/github/stars/dlzmoe%2Flinuxdo-scripts?style=flat)
![License Badge](https://img.shields.io/github/license/dlzmoe/linuxdo-scripts)

The linux.do enhanced plugin features display creation time in topic lists, show post floor numbers, open topics in new tabs, force block topics from certain users, quick replies to topics (customizable), optimize signature image display to prevent broken images, direct preview of details and comments in topic lists, import/export settings panel, floor lottery, user-defined tags, view only the original poster, auto-scroll reading, support for custom CSS styles, optimization for mixed Chinese and English text, level information query, AI topic summary feature, intelligent response generation, support for WebDAV synchronization, theme skin switching in forums, and more. Features are continuously updated, and new ideas are welcome!

[GitHub Repository](https://github.com/dlzmoe/linuxdo-scripts) | 
[Greasyfork Store Installation](https://greasyfork.org/scripts/501827) | 
[Bug Reports and Feature Requests](https://github.com/dlzmoe/linuxdo-scripts/issues/new/choose) | 
[Usage and Development Documentation](https://linuxdo-scripts-docs.netlify.app/) | 
[Discord Community](https://discord.gg/n2pErsD7Kg)

> **Tip**  
> I will share interesting features in the chat group first. Sometimes I feel I'm posting too frequently.  
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

The development environment is Windows/Chrome/Tampermonkey. If you encounter errors or issues with other userscript managers, you might try using Tampermonkey (which I am currently using and is known for better compatibility).

> **Warning**  
> Arc browser users should use the Tampermonkey extension. The Tampermonkey extension cannot be used on Arc browser due to compatibility issues which are unrelated to the plugin and stem from issues between the browser and userscript manager.

## Features

- [x] Displays creation time in topic lists
- [x] Shows post floor numbers
- [x] Opens topics in new tabs
- [x] Forces block (blacklist) topics from certain users
- [x] Quick replies to topics (customizable)
- [x] Optimizes signature image display to prevent broken images
- [x] Import/export feature settings panel
- [x] Floor lottery feature
- [x] Switch to view only the original poster
- [x] Auto-scroll reading
- [x] Night mode
- [x] User tagging feature
- [x] Direct preview of details and comments in topic lists
- [x] Optimized comment box emojis
- [x] Support for custom CSS styles
- [x] Optimized display for mixed Chinese and English text
- [x] New level information query
- [x] Switch forum emoji styles
- [x] AI topic summary feature and intelligent response generation
- [x] Support for WebDAV synchronization
- [x] Switch forum theme skins

<details>
<summary>Some Screenshot Demonstrations:</summary>

| ![image](https://github.com/user-attachments/assets/f3fb854f-e6fd-4da4-9a9c-377b6537fab7) | ![image](https://github.com/user-attachments/assets/3b2a9e63-3939-4dbc-a00f-c713ca2c7f33) |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| ![image](https://github.com/user-attachments/assets/2c67ab9f-2359-4ab5-b0dd-0f257560b98b) | ![image](https://github.com/user-attachments/assets/ed4f925c-e26c-43ce-a886-fa764ac341b5) |
| ![image](https://github.com/user-attachments/assets/c6ba9abb-43aa-40ce-a4a1-b9cdae229a2d) | ![image](https://github.com/user-attachments/assets/399c1645-36e1-4fe2-a671-ae40685e87ca) |

</details>

## Usage

Click this link to automatically trigger the userscript installation process, which can also update in the future:

https://greasyfork.org/scripts/501827

## Development Instructions

```
node: v16.15.1
```

Functionality is organized by components, registering a new component for each new feature to avoid conflicts.

Clone this repository, download dependencies, and run the code:

```shell
git clone https://github.com/dlzmoe/linuxdo-scripts
yarn # install dependencies
yarn dev # run locally
yarn build # build package
```

The program will automatically trigger local tests.

> **Note**  
> To automatically create a Release package, modify the `version` number in `package.json`, and write the current version update log in `CHANGELOG.md`.

## Changelog

[version-log.md](https://github.com/dlzmoe/linuxdo-scripts/blob/main/version-log.md)

## Contribution History

![Contributor](https://contrib.rocks/image?repo=dlzmoe/linuxdo-scripts)

[![Star History Chart](https://api.star-history.com/svg?repos=dlzmoe/linuxdo-scripts&type=Date)](https://star-history.com/#dlzmoe/linuxdo-scripts&Date)

## Disclaimer

All features provided by this script run only in the browser. The source code used is open and transparent, and this script is for educational research purposes only. It does not involve any profit schemes or participate in any profit organizations. Any disputes arising from or related to the use of this script should be resolved amicably among the parties involved. This script bears no responsibility for any form of loss or harm caused to the user or others while using the software provided by this script. By downloading, installing, and using the software provided in this product, the user indicates trust in the author and its related agreements and disclaimers.

## License Agreement

[Apache-2.0 license](https://github.com/dlzmoe/linuxdo-scripts/blob/main/LICENSE)
