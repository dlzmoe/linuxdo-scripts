<h2 align="center">linuxdo Enhancement Plugin (linuxdo-scripts)</h2>
<p align="center">Scripts are continuously updated. Feel free to raise issues and submit pull requests!</p>

[简体中文](https://github.com/dlzmoe/linuxdo-scripts/blob/main/README.md) | [English](https://github.com/dlzmoe/linuxdo-scripts/blob/main/README_EN.md)

![Version Badge](https://img.shields.io/github/v/release/dlzmoe/linuxdo-scripts?label=linuxdo%20%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6&labelColor=%235D5D5D&color=%23E97435) 
![Last Commit Badge](https://img.shields.io/github/last-commit/dlzmoe/linuxdo-scripts) 
![Stars Badge](https://img.shields.io/github/stars/dlzmoe%2Flinuxdo-scripts?style=flat) 
![License Badge](https://img.shields.io/github/license/dlzmoe/linuxdo-scripts) 

The linux.do enhancement plugin features topic list creation time, floor number display, topics opening in new tabs, forced blocking of certain users' topics, quick replies (customizable), optimized signature images to prevent distortion, direct preview of details and comments in the topic list, import/export for the settings panel, floor lottery, user-defined tags, view only the original poster, automatic scrolling for reading, support for custom CSS styles, mixed Chinese and English layout optimization, level information queries, AI summary of topics, intelligent reply generation, WebDAV synchronization, and theme skin switching for the forum. Features continue to be updated; feel free to propose new ideas!

[GitHub Repository](https://github.com/dlzmoe/linuxdo-scripts) | 
[Install from Greasyfork](https://greasyfork.org/scripts/501827) | 
[Bug Feedback and Feature Requests](https://github.com/dlzmoe/linuxdo-scripts/issues/new/choose) | 
[Usage and Development Documentation](https://linuxdo-scripts-docs.netlify.app/) | 
[Discord Community](https://discord.gg/n2pErsD7Kg) 

> **Tip**  
> Any fun features will be shared in the group chat. It feels like I'm posting too frequently.  
> Discord community: https://discord.gg/n2pErsD7Kg  

## Table of Contents
- [Table of Contents](#table-of-contents)
- [Features](#features)
- [Usage](#usage)
- [Development Instructions](#development-instructions)
- [Changelog](#changelog)
- [Contribution History](#contribution-history)
- [Disclaimer](#disclaimer)
- [Copyright Agreement](#copyright-agreement)

---

The development environment is Windows / Chrome / Violentmonkey. If you encounter errors or the script does not work with other userscripts managers, try using Violentmonkey (which I currently use; it has good compatibility).

> **Warning**  
> Arc Browser users should use the Violentmonkey extension.  
> The tampermonkey extension may not work under Arc Browser due to compatibility issues, which are unrelated to the plugin, being a problem between the browser and the userscripts manager.

## Features

- [x] Topic list creation time display
- [x] Floor number display
- [x] Topics open in a new tab
- [x] Forced block of certain users' topics
- [x] Quick replies (customizable)
- [x] Optimized signature image display to prevent distortion
- [x] Import/export for settings panel
- [x] Floor lottery
- [x] View only the original poster toggle
- [x] Automatic scrolling for reading
- [x] Dark mode
- [x] User tag feature
- [x] Direct preview of details and comments in the topic list
- [x] Optimized comment box for emoji
- [x] Support for custom CSS styles
- [x] Mixed Chinese and English layout optimization
- [x] New level information query addition
- [x] Toggle forum emoji style
- [x] AI topic summary feature, intelligent reply generation
- [x] Support for WebDAV synchronization
- [x] Forum theme skin switching

<details>
<summary>Partial screenshot demonstration:</summary>

| ![image](https://github.com/user-attachments/assets/c70edbe9-ead1-4a6b-b268-7fc956d3f72f) | ![image](https://github.com/user-attachments/assets/bde3b652-4948-4f00-a825-5f235ebf4d78) |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| ![image](https://github.com/user-attachments/assets/05b6510e-0e61-4977-a958-cd8459aaff84) | ![image](https://github.com/user-attachments/assets/4e22e692-85a1-424a-96cc-f39c24b94516) |
| ![image](https://github.com/user-attachments/assets/b9c8626d-03af-4a55-8a92-1f1ebd9a02bf) | ![image](https://github.com/user-attachments/assets/399c1645-36e1-4fe2-a671-ae40685e87ca) |

</details>

## Usage

Click this link to automatically trigger the userscripts installation process, which can also prompt for updates in the future.

[Install Script](https://greasyfork.org/scripts/501827)

## Development Instructions

```
node: v16.15.1
```

Features are developed as components. Each new feature registers a new component to avoid conflicts.

Clone this repository and install dependencies to run the code.

```shell
git clone https://github.com/dlzmoe/linuxdo-scripts
yarn # install dependencies
yarn dev # run locally
yarn build # build package
```

The program will automatically trigger local testing.

> To automate the construction of release packages, modify the `version` number in `package.json` and write the current version update log in `CHANGELOG.md`.

## Changelog

[version-log.md](https://github.com/dlzmoe/linuxdo-scripts/blob/main/version-log.md)

## Contribution History

![Contributor](https://contrib.rocks/image?repo=dlzmoe/linuxdo-scripts)

[![Star History Chart](https://api.star-history.com/svg?repos=dlzmoe/linuxdo-scripts&type=Date)](https://star-history.com/#dlzmoe/linuxdo-scripts&Date)

## Disclaimer

All features provided in this script run only in the browser. The source code used is publicly visible and this script is for research and study purposes only. It does not use any profit schemes or participate in any profit-making organizations. Any disputes arising from or related to the use of this script shall be resolved amicably. The script assumes no responsibility for any loss or damage of any form that may be caused to users themselves or others when using the software provided by this script. By downloading, installing, and using the software provided in this product, the user indicates trust in the author and the related agreements and disclaimers.

## Copyright Agreement

[Apache-2.0 license](https://github.com/dlzmoe/linuxdo-scripts/blob/main/LICENSE)