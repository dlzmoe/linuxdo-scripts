## linuxdo Enhancement Plugin (linuxdo-scripts)

Scripts are continuously updated. Issues and PRs are welcome!

[中文简体](https://github.com/dlzmoe/linuxdo-scripts/blob/main/README.md) | [English](https://github.com/dlzmoe/linuxdo-scripts/blob/main/README_EN.md)

![Release](https://img.shields.io/github/v/release/dlzmoe/linuxdo-scripts?label=linuxdo%20%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6&labelColor=%235D5D5D&color=%23E97435) ![Last Commit](https://img.shields.io/github/last-commit/dlzmoe/linuxdo-scripts) ![Stars](https://img.shields.io/github/stars/dlzmoe%2Flinuxdo-scripts?style=flat) ![License](https://img.shields.io/github/license/dlzmoe/linuxdo-scripts)

## Table of Contents
  - [Features](#features)
  - [Usage](#usage)
  - [Development](#development)
  - [Changelog](#changelog)
  - [Star History](#star-history)
  - [Contributor](#contributor)
  - [Disclaimer](#disclaimer)
  - [License](#license)

The linux.do enhancement plugin adds features such as topic creation time display, floor count display, opening topics in new tabs, forcibly blocking topics from certain users, quick replies (customizable), optimized signature image display, direct preview of details and comments in the topic list, import/export feature settings panel, floor lottery, user-defined tags, viewing only the author’s posts, automatic scrolling for reading, custom CSS support, optimized mixed language display, rank information query, AI summarization of topics, intelligent reply generation, webdav synchronization support, and theme skin switching for forums. Features are continuously updated. New ideas are welcome!

[GitHub Repository](https://github.com/dlzmoe/linuxdo-scripts) |
[Install from Greasyfork](https://greasyfork.org/scripts/501827) |
[Report Bugs or Request Features](https://github.com/dlzmoe/linuxdo-scripts/issues/new/choose) |
[Documentation for Use and Development](https://linuxdo-scripts-docs.netlify.app/) |
[WeChat Group](https://zishu.me/linuxdo-scripts/) | 
[Discord Community](https://discord.gg/n2pErsD7Kg)

> **Tip:**  
> I will share interesting features in the group chat as soon as possible. Feeling like I post too frequently.  
> WeChat group: [https://zishu.me/linuxdo-scripts/](https://zishu.me/linuxdo-scripts/)  
> Discord community: [https://discord.gg/n2pErsD7Kg](https://discord.gg/n2pErsD7Kg)

---

The development environment is Windows / Chrome / Violentmonkey. If you encounter errors or issues with other tampermonkey managers, try using Violentmonkey (which I currently use and find to be more compatible).

> **Warning:**  
> Arc browser users please use the Violentmonkey extension.  
> The tampermonkey extension does not function under the Arc browser due to compatibility issues, which are unrelated to the plugin and stem from issues between the browser and the tampermonkey manager.  

## Features

- [x] Display topic creation time
- [x] Show floor count
- [x] Open topics in new tabs
- [x] Forcibly block topics from certain users
- [x] Quick reply feature (customizable)
- [x] Optimize signature image display to prevent image distortion
- [x] Import/export feature settings panel
- [x] Floor lottery
- [x] View only the author’s posts switch function
- [x] Auto-scrolling for reading
- [x] Night mode
- [x] User tag function
- [x] Direct preview of details and comments in the topic list
- [x] Comment box emoji optimization
- [x] Support custom CSS styles
- [x] Optimize mixed language display
- [x] New rank information query
- [x] Switch forum emoji styles
- [x] AI summarization of topics and intelligent reply generation
- [x] Support webdav synchronization
- [x] Switch forum theme skins

<details>
<summary>Sample Screenshots:</summary>

| ![image](https://github.com/user-attachments/assets/c70edbe9-ead1-4a6b-b268-7fc956d3f72f) | ![image](https://github.com/user-attachments/assets/bde3b652-4948-4f00-a825-5f235ebf4d78) |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| ![image](https://github.com/user-attachments/assets/05b6510e-0e61-4977-a958-cd8459aaff84) | ![image](https://github.com/user-attachments/assets/4e22e692-85a1-424a-96cc-f39c24b94516) |
| ![image](https://github.com/user-attachments/assets/b9c8626d-03af-4a55-8a92-1f1ebd9a02bf) | ![image](https://github.com/user-attachments/assets/399c1645-36e1-4fe2-a671-ae40685e87ca) |

</details>

## Usage

Click this link to automatically trigger the tampermonkey script installation process, which can also trigger updates later.

[https://greasyfork.org/scripts/501827](https://greasyfork.org/scripts/501827)

## Development

```
node: v16.15.1
```

Features are implemented as components, with a new component registered for each new feature to avoid conflicts.

Clone this repository, download dependencies, and run the code.

```shell
git clone https://github.com/dlzmoe/linuxdo-scripts
yarn # Install dependencies
yarn dev # Run locally
yarn build # Build and package
```

The program will automatically trigger local testing.

> **Note:**  
> For automatic release package construction, modify the `version` number in `package.json` and write the current version's changelog in `CHANGELOG.md`.

## Changelog

[version-log.md](https://github.com/dlzmoe/linuxdo-scripts/blob/main/version-log.md)

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=dlzmoe/linuxdo-scripts&type=Date)](https://star-history.com/#dlzmoe/linuxdo-scripts&Date)

## Contributor

![Contributor](https://contrib.rocks/image?repo=dlzmoe/linuxdo-scripts)

## Disclaimer

All features provided by this script run only in the browser. The source code is transparent and publicly available. This script is for educational and research purposes only, does not involve any profit schemes or participate in any profit organizations. Any disputes arising from or related to the use of this script should be resolved amicably by the parties involved. This script does not bear any responsibility for any losses or damages that may occur to users or others due to the software provided by this script. By downloading, installing, and using the software provided in this product, the user signifies trust in the author and its related agreements and disclaimers.

## License

[Apache-2.0 license](https://github.com/dlzmoe/linuxdo-scripts/blob/main/LICENSE)
