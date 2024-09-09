## linuxdo Enhancement Plugin (linuxdo-scripts)

Continuous updates for the scripts. Feel free to raise issues and submit pull requests!

[简体中文](https://github.com/dlzmoe/linuxdo-scripts/blob/main/README.md) | [English](https://github.com/dlzmoe/linuxdo-scripts/blob/main/README_EN.md)

![Release Badge](https://img.shields.io/github/v/release/dlzmoe/linuxdo-scripts?label=linuxdo%20%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6&labelColor=%235D5D5D&color=%23E97435)
![Last Commit Badge](https://img.shields.io/github/last-commit/dlzmoe/linuxdo-scripts)
![Stars Badge](https://img.shields.io/github/stars/dlzmoe%2Flinuxdo-scripts?style=flat)
![License Badge](https://img.shields.io/github/license/dlzmoe/linuxdo-scripts)

The linux.do enhancement plugin includes features like displaying topic creation time, showing floor numbers, opening topics in a new tab, forcing block (blacklisting) of certain users' topics, quick replies (customizable), optimizing signature image display to prevent broken images, direct preview of details and comments in topic lists, import/export for settings panel, floor lottery, user-defined tags, view only the original poster, auto-scrolling reading, support for custom CSS styles, optimization for mixed Chinese and English display, level information query, AI summary of topics, intelligent reply generation, WebDAV synchronization, theme skin switching in forums, etc. Features are continuously updated, and new ideas are welcome!

[Github Repository](https://github.com/dlzmoe/linuxdo-scripts) | 
[Greasyfork Store Installation](https://greasyfork.org/scripts/501827) | 
[Bug Feedback and Feature Requests](https://github.com/dlzmoe/linuxdo-scripts/issues/new/choose) | 
[Usage and Development Documentation](https://linuxdo-scripts-docs.netlify.app/) | 
[Plugin Community Group](https://zishu.me/linuxdo-scripts/)

> **Tip**  
> I'll share fun features in the group chat as soon as I can.  
> Plugin community group: https://zishu.me/linuxdo-scripts/

---

The development environment is Windows / Chrome / Violentmonkey. If you encounter errors or non-functionality using other Greasemonkey managers, try using Violentmonkey (which I'm currently using, as it has better compatibility).

> **Warning**  
> Arc browser users, please use the Violentmonkey extension.  
> The Tampermonkey extension cannot be used on Arc browser due to compatibility issues, which are unrelated to the plugin; it’s an issue between the browser and the user script manager.

## Features

- [x] Display creation time in topic list
- [x] Show floor numbers
- [x] Open topics in a new tab
- [x] Force block (blacklist) certain user topics
- [x] Quick reply functionality (customizable)
- [x] Optimize signature image display to prevent broken images
- [x] Import/export functionality settings panel
- [x] Floor lottery
- [x] View only original poster toggle feature
- [x] Auto-scrolling reading
- [x] Night mode
- [x] User tag functionality
- [x] Directly preview details and comments in topic list
- [x] Comment box emoji optimization
- [x] Support for custom CSS styles
- [x] Optimization for mixed Chinese and English display
- [x] Add level information query
- [x] Switch between forum emoji styles
- [x] AI topic summarization and intelligent reply generation
- [x] Support for WebDAV synchronization
- [x] Theme skin switching in forums

<details>
<summary>Part of Screenshot Demonstration:</summary>

| ![image](https://github.com/user-attachments/assets/c70edbe9-ead1-4a6b-b268-7fc956d3f72f) | ![image](https://github.com/user-attachments/assets/bde3b652-4948-4f00-a825-5f235ebf4d78) |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| ![image](https://github.com/user-attachments/assets/05b6510e-0e61-4977-a958-cd8459aaff84) | ![image](https://github.com/user-attachments/assets/4e22e692-85a1-424a-96cc-f39c24b94516) |
| ![image](https://github.com/user-attachments/assets/b9c8626d-03af-4a55-8a92-1f1ebd9a02bf) | ![image](https://github.com/user-attachments/assets/399c1645-36e1-4fe2-a671-ae40685e87ca) |

</details>

## Usage

Click this link to automatically trigger the script installation program, which can also be used to trigger updates.

https://greasyfork.org/scripts/501827

## Development Instructions

```
node: v16.15.1
```

Features are developed as components, registering a new component for each new feature to avoid conflicts.

Clone this repository and install dependencies, then run the code.

```shell
git clone https://github.com/dlzmoe/linuxdo-scripts
yarn # Install dependencies
yarn dev # Run locally
yarn build # Build package
```

The program will automatically trigger local testing.

> As for automatically building the release package, you need to modify the `version` number in `package.json`, and write the current version update log in `CHANGELOG.md`.

## Changelog

[version-log.md](https://github.com/dlzmoe/linuxdo-scripts/blob/main/version-log.md)

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=dlzmoe/linuxdo-scripts&type=Date)](https://star-history.com/#dlzmoe/linuxdo-scripts&Date)

## Contributor

![Contributor](https://contrib.rocks/image?repo=dlzmoe/linuxdo-scripts)

## Disclaimer

All functionalities provided in this script run only in the browser. The source code used is open and transparent, and this script is for educational and research purposes only, not utilizing any profit schemes or involved with any profit organizations. Any disputes arising from or related to the use of this script should be amicably resolved by all parties. This script disclaims any responsibility for any form of loss or harm caused to users themselves or others when using software provided by this script. By downloading, installing, and using the software provided in this product, the user acknowledges trust in the author and related agreements and disclaimers.

## License

[Apache-2.0 license](https://github.com/dlzmoe/linuxdo-scripts/blob/main/LICENSE)
