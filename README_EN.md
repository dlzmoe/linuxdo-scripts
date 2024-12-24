## LinuxDo Scripts (formerly: linuxdo-scripts)

> The script is continuously updated. Feel free to submit issues or pull requests ~  
> Reconstructed into a browser extension via the Tampermonkey plugin, version 1.0 is now available.  
> It is not yet available in the extension store, but you can download the latest installation package from the releases section.

[简体中文](https://github.com/dlzmoe/linuxdo-scripts/blob/main/README.md) | [English](https://github.com/dlzmoe/linuxdo-scripts/blob/main/README_EN.md)

![Release Badge](https://img.shields.io/github/v/release/dlzmoe/linuxdo-scripts?label=LinuxDo Scripts 扩展&labelColor=%235D5D5D&color=%23E97435)
![Last Commit](https://img.shields.io/github/last-commit/dlzmoe/linuxdo-scripts)
![Stars](https://img.shields.io/github/stars/dlzmoe%2Flinuxdo-scripts?style=flat)
![License](https://img.shields.io/github/license/dlzmoe/linuxdo-scripts)

LinuxDo Scripts extension includes features like displaying the creation time in topic lists, showing floor counts, opening topics in new tabs, force-blocking certain users' topics, quick replies (with customization), optimizing signature image display to prevent broken images, previewing topic details and comments directly from the topic list, importing and exporting the feature settings panel, floor-based lottery, user-defined tags, view-only owner mode, auto-scrolling reading, custom CSS support, optimized mixed language display, level information lookup, AI-powered topic summaries and auto-generated replies, WebDAV synchronization support, forum theme skin switching, and more. For more features, please refer to the settings list. Features are continuously updated, and new ideas are always welcome!

[GitHub Repository](https://github.com/dlzmoe/linuxdo-scripts) |  
~~[Greasyfork Store Installation](https://greasyfork.org/scripts/501827)~~ |  
[Bug Reports & Feature Requests](https://github.com/dlzmoe/linuxdo-scripts/issues/new/choose) |  
[Usage and Development Docs](https://linuxdo-scripts-docs.netlify.app/) |  
[Discord Community](https://discord.gg/n2pErsD7Kg)

## Features

<details>
<summary>Feature List:</summary>

- [x] Display creation time in topic list
- [x] Show floor count
- [x] Open topics in new tabs
- [x] Force-block (blacklist) topics from specific users
- [x] Quick reply to topics (supports customization)
- [x] Optimize signature image display to prevent broken images
- [x] Import and export feature settings panel
- [x] Floor-based lottery
- [x] Toggle "View Only Owner" mode
- [x] Auto-scrolling reading mode
- [x] Dark mode
- [x] User tag feature
- [x] Direct preview of topic details and comments in the topic list
- [x] Emoji optimization in comment box
- [x] Supports custom CSS styles
- [x] Optimized mixed Chinese and English display
- [x] Added level information lookup
- [x] Switch forum emoji styles
- [x] AI-powered topic summary and auto-generated replies
- [x] WebDAV synchronization support
- [x] Switch forum theme skin
- [x] More features can be found in the settings list

</details>

<details>
<summary>Some Screenshots:</summary>

| ![image](https://github.com/user-attachments/assets/f3fb854f-e6fd-4da4-9a9c-377b6537fab7) | ![image](https://github.com/user-attachments/assets/3b2a9e63-3939-4dbc-a00f-c713ca2c7f33) |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| ![image](https://github.com/user-attachments/assets/2c67ab9f-2359-4ab5-b0dd-0f257560b98b) | ![image](https://github.com/user-attachments/assets/ed4f925c-e26c-43ce-a886-fa764ac341b5) |
| ![image](https://github.com/user-attachments/assets/c6ba9abb-43aa-40ce-a4a1-b9cdae229a2d) | ![image](https://github.com/user-attachments/assets/399c1645-36e1-4fe2-a671-ae40685e87ca) |

</details>

## Usage

Click this link to go to releases for installation and download:  
[Releases](https://github.com/dlzmoe/linuxdo-scripts/releases)

## Development Instructions

```
node: v16.15.1
```

Features are organized as components. Each time a new feature is added, a new component is registered to avoid conflicts.

To install this repository and download dependencies, run the following commands:

```bash
git clone https://github.com/dlzmoe/linuxdo-scripts
yarn # Install dependencies
yarn dev # Run locally
```

No need for building; after submitting a pull request, I'll review and merge it as soon as possible if there are no major issues.

## Changelog

[version-log.md](https://github.com/dlzmoe/linuxdo-scripts/blob/main/version-log.md)

## Contribution History

![Contributor](https://contrib.rocks/image?repo=dlzmoe/linuxdo-scripts)

[![Stargazers over time](https://starchart.cc/dlzmoe/linuxdo-scripts.svg?variant=adaptive)](https://starchart.cc/dlzmoe/linuxdo-scripts)

## Disclaimer

All functionalities provided by this script run only in the browser. The source code is open and transparent. This script is for educational and research purposes only, and does not participate in any profit-making schemes or organizations. Any disputes arising from the use of this script should be resolved amicably by the parties involved. The author and the script will not be held responsible for any damages or losses caused to the user or others while using the software provided by this script. By downloading, installing, or using the software provided by this product, the user acknowledges trust in the author and agrees to the related agreements and disclaimers.

## License

[MIT License](https://github.com/dlzmoe/linuxdo-scripts/blob/main/LICENSE)
