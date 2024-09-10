```markdown
## linuxdo Enhancement Plugin (linuxdo-scripts)

Scripts are continuously updated. You are welcome to submit issues and pull requests!

[简体中文](https://github.com/dlzmoe/linuxdo-scripts/blob/main/README.md) | [English](https://github.com/dlzmoe/linuxdo-scripts/blob/main/README_EN.md)

![Version](https://img.shields.io/github/v/release/dlzmoe/linuxdo-scripts?label=linuxdo%20%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6&labelColor=%235D5D5D&color=%23E97435) ![Last Commit](https://img.shields.io/github/last-commit/dlzmoe/linuxdo-scripts) ![Stars](https://img.shields.io/github/stars/dlzmoe%2Flinuxdo-scripts?style=flat) ![License](https://img.shields.io/github/license/dlzmoe/linuxdo-scripts)

The linux.do enhancement plugin displays topic creation times, shows floor numbers, opens topics in new tabs, forcibly blocks topics from specific users, provides quick replies to topics (customizable), optimizes signature image display to prevent images from breaking, allows direct preview of details and comments in the topic list, supports import/export in the function settings panel, allows floor lotteries, provides user-defined tags, shows only the original poster's posts, features auto-scrolling reading, supports custom CSS styles, optimizes mixed Chinese and English layout, provides level information queries, features AI summary of topics and intelligent reply generation, supports WebDAV synchronization, allows switching of forum themes, and more. Functionality is continuously updated, and new ideas are always welcome!

[GitHub Repository](https://github.com/dlzmoe/linuxdo-scripts) | [Install from Greasyfork](https://greasyfork.org/scripts/501827) | [Bug Feedback and Feature Requests](https://github.com/dlzmoe/linuxdo-scripts/issues/new/choose) | [Usage and Development Documentation](https://linuxdo-scripts-docs.netlify.app/) | [WeChat Group Chat](https://zishu.me/linuxdo-scripts/) | [Discord Community](https://discord.gg/n2pErsD7Kg)

> **Tip:**  
> I will share fun features in the group chat as soon as I find them.  
> WeChat Group Chat: https://zishu.me/linuxdo-scripts/  
> Discord Community: https://discord.gg/n2pErsD7Kg  

---

The development environment is Windows / Chrome / Violentmonkey. If you encounter errors or non-functionality using other script managers, try using Violentmonkey (which I am currently using with good compatibility).

> **Warning:**  
> Arc browser users should use the Violentmonkey extension.  
> The tampermonkey extension does not work under the Arc browser due to compatibility issues between the browser and script manager, unrelated to the plugin itself.

## Features

- [x] Displays topic creation time
- [x] Shows floor numbers
- [x] Opens topics in new tabs
- [x] Forcibly blocks topics from specific users
- [x] Quick replies to topics (customizable)
- [x] Optimizes signature image display to prevent images from breaking
- [x] Import/export function settings panel
- [x] Floor lottery
- [x] Toggle "Only see the original poster" feature
- [x] Auto-scrolling reading
- [x] Dark mode
- [x] User tag functionality
- [x] Directly preview details and comments in the topic list
- [x] Comment box emoji optimization
- [x] Supports custom CSS styles
- [x] Optimizes mixed Chinese and English display
- [x] New level information query
- [x] Switch forum emoji style
- [x] AI topic summary functionality, intelligent reply generation
- [x] Supports WebDAV synchronization
- [x] Switch forum theme skin

<details>
<summary>Some Screenshot Demonstrations:</summary>

| ![image](https://github.com/user-attachments/assets/c70edbe9-ead1-4a6b-b268-7fc956d3f72f) | ![image](https://github.com/user-attachments/assets/bde3b652-4948-4f00-a825-5f235ebf4d78) |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| ![image](https://github.com/user-attachments/assets/05b6510e-0e61-4977-a958-cd8459aaff84) | ![image](https://github.com/user-attachments/assets/4e22e692-85a1-424a-96cc-f39c24b94516) |
| ![image](https://github.com/user-attachments/assets/b9c8626d-03af-4a55-8a92-1f1ebd9a02bf) | ![image](https://github.com/user-attachments/assets/399c1645-36e1-4fe2-a671-ae40685e87ca) |

</details>

## Usage Instructions

Click this link to automatically trigger the Tampermonkey script installation process, which will also trigger updates thereafter.

https://greasyfork.org/scripts/501827

## Development Instructions

```
node: v16.15.1
```

Features are developed in components. Each new feature registers a new component to avoid conflicts.

Clone this repository and install dependencies, then run the code.

```shell
git clone https://github.com/dlzmoe/linuxdo-scripts
yarn # Install dependencies
yarn dev # Run locally
yarn build # Build package
```

The program will automatically trigger local testing.

> Regarding the automatic building of release packages, please update the `version` number in `package.json` and write the current version's change log in `CHANGELOG.md`.

## Change Log

[version-log.md](https://github.com/dlzmoe/linuxdo-scripts/blob/main/version-log.md)

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=dlzmoe/linuxdo-scripts&type=Date)](https://star-history.com/#dlzmoe/linuxdo-scripts&Date)

## Contributor

![Contributor](https://contrib.rocks/image?repo=dlzmoe/linuxdo-scripts)

## Disclaimer

All functionalities provided by this script operate solely within the browser. The source code is open and transparent. This script is for learning and research purposes only, without any monetization scheme or involvement in any profit-making organization. Any disputes arising from or related to the use of this script should be resolved amicably by the parties involved. This script does not bear any responsibility for any form of loss or harm that may be caused to users or others while using this script. By downloading, installing, and using the software provided in this product, users indicate their trust in the author and its related agreements and disclaimers.

## License

[Apache-2.0 License](https://github.com/dlzmoe/linuxdo-scripts/blob/main/LICENSE)
```