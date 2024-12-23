import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-vue'],
  manifest: {
    name: "LinuxDo Scripts",
    version: "1.0.0",
    description: "为 linxu.do 用户提供了一些增强功能。",
    permissions: ["storage", "scripting", "activeTab", "contextMenus"],
  },
  hooks: {
    "build:manifestGenerated": (wxt, manifest) => {
      if (wxt.config.command === "serve") {
        // During development, content script is not listed in manifest, causing
        // "webext-dynamic-content-scripts" to throw an error. So we need to
        // add it manually.
        manifest.content_scripts ??= [];
        manifest.content_scripts.push({
          matches: ["https://linux.do/*"],
          js: ["content-scripts/content.js"],
          // If the script has CSS, add it here.
        });
      }
    },
  },
});
