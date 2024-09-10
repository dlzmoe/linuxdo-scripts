## linuxdo Enhancement Plugin (linuxdo-scripts)

Scripts are constantly updated; feel free to propose issues and submit PRs!

[简体中文](https://github.com/dlzmoe/linuxdo-scripts/blob/main/README.md) | [English](https://github.com/dlzmoe/linuxdo-scripts/blob/main/README_EN.md)

![Version](https://img.shields.io/github/v/release/dlzmoe/linuxdo-scripts?label=linuxdo%20%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6&labelColor=%235D5D5D&color=%23E97435)
![Last Commit](https://img.shields.io/github/last-commit/dlzmoe/linuxdo-scripts)
![Stars](https://img.shields.io/github/stars/dlzmoe%2Flinuxdo-scripts?style=flat)
![License](https://img.shields.io/github/license/dlzmoe/linuxdo-scripts)

The linux.do enhancement plugin includes features such as displaying creation time in topic lists, showing floor counts, opening topics in new tabs, forcibly blocking a user's topics, quick reply to topics (customizable), optimizing signature image display to prevent distortion, directly previewing details and comments in the topic list, importing and exporting the feature settings panel, floor lotteries, user-defined tags, "only view the host" mode, automatic scrolling for reading, custom CSS styles, optimized mixed Chinese and English display, level information query, AI summarization of topics, intelligent reply generation, WebDAV synchronization, changing forum theme skin, etc. Features are continually updated, and new ideas are welcome!

[GitHub Repository](https://github.com/dlzmoe/linuxdo-scripts) | 
[Install from Greasyfork](https://greasyfork.org/scripts/501827) | 
[Bug Feedback and Feature Requests](https://github.com/dlzmoe/linuxdo-scripts/issues/new/choose) | 
[Usage and Development Documentation](https://linuxdo-scripts-docs.netlify.app/) | 
[Wechat Group Chat](https://zishu.me/linuxdo-scripts/) | 
[Discord Community](https://discord.gg/n2pErsD7Kg)

> **TIP:**  
> Any fun features will be shared in the group chat as soon as I can. I feeling I post too frequently.  
> Wechat Group Chat: https://zishu.me/linuxdo-scripts/  
> Discord Community: https://discord.gg/n2pErsD7Kg  

## Table of Contents
- [Features](#features)
- [Usage Instructions](#usage-instructions)
- [Development Notes](#development-notes)
- [Changelog](#changelog)
- [Star History](#star-history)
- [Contributors](#contributors)
- [Disclaimer](#disclaimer)
- [License](#license)

---

The development environment is Windows / Chrome / Violentmonkey. If you get errors or it doesn't work with other userscripts managers, try using Violentmonkey (which I'm currently using and has a better compatibility).

> **WARNING:**  
> Arc Browser users should use the Violentmonkey extension.  
> The tampermonkey extensions do not work under Arc Browser due to compatibility issues, which is unrelated to the plugin but rather a problem between the browser and userscript managers.

## Features

- [x] Display creation time in topic lists
- [x] Show floor counts
- [x] Open topics in new tabs
- [x] Force block (blacklist) a user’s topics
- [x] Quick reply to topics (customizable)
- [x] Optimize signature image display to prevent distortion
- [x] Import and export feature settings panel
- [x] Floor lotteries
- [x] Enable "only view the host" mode
- [x] Automatic scrolling for reading
- [x] Dark mode
- [x] User tag feature
- [x] Directly preview details and comments in the topic list
- [x] Optimize emoji in comment boxes
- [x] Support for custom CSS styles
- [x] Optimize mixed Chinese and English display
- [x] Introduce level information query
- [x] Switch forum emoji style
- [x] AI summarization of topics, intelligent reply generation
- [x] Support for WebDAV synchronization
- [x] Switch forum theme skin

<details>
<summary>Partial Screenshot Demonstration:</summary>

| ![image](https://github.com/user-attachments/assets/c70edbe9-ead1-4a6b-b268-7fc956d3f72f) | ![image](https://github.com/user-attachments/assets/bde3b652-4948-4f00-a825-5f235ebf4d78) |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| ![image](https://github.com/user-attachments/assets/05b6510e-0e61-4977-a958-cd8459aaff84) | ![image](https://github.com/user-attachments/assets/4e22e692-85a1-424a-96cc-f39c24b94516) |
| ![image](https://github.com/user-attachments/assets/b9c8626d-03af-4a55-8a92-1f1ebd9a02bf) | ![image](https://github.com/user-attachments/assets/399c1645-36e1-4fe2-a671-ae40685e87ca) |

</details>

## Usage Instructions

Click this link to automatically trigger the userscript installation program, which can also prompt updates later.

https://greasyfork.org/scripts/501827

## Development Notes

```
node: v16.15.1
```

Features are developed as components; each new feature will register a new component to avoid conflicts.

Clone this repository and install dependencies, then run the code.

```shell
git clone https://github.com/dlzmoe/linuxdo-scripts
yarn # install dependencies
yarn dev # run locally
yarn build # build package
```

The program will automatically trigger local tests.

> Regarding automatically building Release packages, please modify the `version` version number in `package.json` and write the current version change log in `CHANGELOG.md`.

## Changelog

[version-log.md](https://github.com/dlzmoe/linuxdo-scripts/blob/main/version-log.md)

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=dlzmoe/linuxdo-scripts&type=Date)](https://star-history.com/#dlzmoe/linuxdo-scripts&Date)

## Contributors

![Contributor](https://contrib.rocks/image?repo=dlzmoe/linuxdo-scripts)

## Disclaimer

All features provided in this script run solely in the browser, and the source code used is publicly visible and transparent. This script is only for learning and research purposes, does not utilize any profit schemes or participate in any profit organizations. Any disputes arising from the use of this script or related to it should be resolved amicably by both parties. The script does not bear any responsibility for any loss or damage caused to the user or others when using this software. By downloading, installing, and using the software provided in this product, the user indicates trust in the author and the related agreements and disclaimers.

## License

[Apache-2.0 license](https://github.com/dlzmoe/linuxdo-scripts/blob/main/LICENSE)
