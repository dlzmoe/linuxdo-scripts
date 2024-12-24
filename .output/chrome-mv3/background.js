var background = function() {
  "use strict";
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
  function defineBackground(arg) {
    if (arg == null || typeof arg === "function") return { main: arg };
    return arg;
  }
  var _MatchPattern = class {
    constructor(matchPattern) {
      if (matchPattern === "<all_urls>") {
        this.isAllUrls = true;
        this.protocolMatches = [..._MatchPattern.PROTOCOLS];
        this.hostnameMatch = "*";
        this.pathnameMatch = "*";
      } else {
        const groups = /(.*):\/\/(.*?)(\/.*)/.exec(matchPattern);
        if (groups == null)
          throw new InvalidMatchPattern(matchPattern, "Incorrect format");
        const [_, protocol, hostname, pathname] = groups;
        validateProtocol(matchPattern, protocol);
        validateHostname(matchPattern, hostname);
        this.protocolMatches = protocol === "*" ? ["http", "https"] : [protocol];
        this.hostnameMatch = hostname;
        this.pathnameMatch = pathname;
      }
    }
    includes(url) {
      if (this.isAllUrls)
        return true;
      const u = typeof url === "string" ? new URL(url) : url instanceof Location ? new URL(url.href) : url;
      return !!this.protocolMatches.find((protocol) => {
        if (protocol === "http")
          return this.isHttpMatch(u);
        if (protocol === "https")
          return this.isHttpsMatch(u);
        if (protocol === "file")
          return this.isFileMatch(u);
        if (protocol === "ftp")
          return this.isFtpMatch(u);
        if (protocol === "urn")
          return this.isUrnMatch(u);
      });
    }
    isHttpMatch(url) {
      return url.protocol === "http:" && this.isHostPathMatch(url);
    }
    isHttpsMatch(url) {
      return url.protocol === "https:" && this.isHostPathMatch(url);
    }
    isHostPathMatch(url) {
      if (!this.hostnameMatch || !this.pathnameMatch)
        return false;
      const hostnameMatchRegexs = [
        this.convertPatternToRegex(this.hostnameMatch),
        this.convertPatternToRegex(this.hostnameMatch.replace(/^\*\./, ""))
      ];
      const pathnameMatchRegex = this.convertPatternToRegex(this.pathnameMatch);
      return !!hostnameMatchRegexs.find((regex) => regex.test(url.hostname)) && pathnameMatchRegex.test(url.pathname);
    }
    isFileMatch(url) {
      throw Error("Not implemented: file:// pattern matching. Open a PR to add support");
    }
    isFtpMatch(url) {
      throw Error("Not implemented: ftp:// pattern matching. Open a PR to add support");
    }
    isUrnMatch(url) {
      throw Error("Not implemented: urn:// pattern matching. Open a PR to add support");
    }
    convertPatternToRegex(pattern) {
      const escaped = this.escapeForRegex(pattern);
      const starsReplaced = escaped.replace(/\\\*/g, ".*");
      return RegExp(`^${starsReplaced}$`);
    }
    escapeForRegex(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
  };
  var MatchPattern = _MatchPattern;
  MatchPattern.PROTOCOLS = ["http", "https", "file", "ftp", "urn"];
  var InvalidMatchPattern = class extends Error {
    constructor(matchPattern, reason) {
      super(`Invalid match pattern "${matchPattern}": ${reason}`);
    }
  };
  function validateProtocol(matchPattern, protocol) {
    if (!MatchPattern.PROTOCOLS.includes(protocol) && protocol !== "*")
      throw new InvalidMatchPattern(
        matchPattern,
        `${protocol} not a valid protocol (${MatchPattern.PROTOCOLS.join(", ")})`
      );
  }
  function validateHostname(matchPattern, hostname) {
    if (hostname.includes(":"))
      throw new InvalidMatchPattern(matchPattern, `Hostname cannot include a port`);
    if (hostname.includes("*") && hostname.length > 1 && !hostname.startsWith("*."))
      throw new InvalidMatchPattern(
        matchPattern,
        `If using a wildcard (*), it must go at the start of the hostname`
      );
  }
  const browser = (
    // @ts-expect-error
    ((_b = (_a = globalThis.browser) == null ? void 0 : _a.runtime) == null ? void 0 : _b.id) == null ? globalThis.chrome : (
      // @ts-expect-error
      globalThis.browser
    )
  );
  const patternValidationRegex = /^(https?|wss?|file|ftp|\*):\/\/(\*|\*\.[^*/]+|[^*/]+)\/.*$|^file:\/\/\/.*$|^resource:\/\/(\*|\*\.[^*/]+|[^*/]+)\/.*$|^about:/;
  const isFirefox = (_c = globalThis.navigator) == null ? void 0 : _c.userAgent.includes("Firefox/");
  const allStarsRegex = isFirefox ? /^(https?|wss?):[/][/][^/]+([/].*)?$/ : /^https?:[/][/][^/]+([/].*)?$/;
  const allUrlsRegex = /^(https?|file|ftp):[/]+/;
  function assertValidPattern(matchPattern) {
    if (!isValidPattern(matchPattern)) {
      throw new Error(matchPattern + " is an invalid pattern. See https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Match_patterns for more info.");
    }
  }
  function isValidPattern(matchPattern) {
    return matchPattern === "<all_urls>" || patternValidationRegex.test(matchPattern);
  }
  function getRawPatternRegex(matchPattern) {
    assertValidPattern(matchPattern);
    let [, protocol, host = "", pathname] = matchPattern.split(/(^[^:]+:[/][/])([^/]+)?/);
    protocol = protocol.replace("*", isFirefox ? "(https?|wss?)" : "https?").replaceAll(/[/]/g, "[/]");
    if (host === "*") {
      host = "[^/]+";
    }
    host && (host = host.replace(/^[*][.]/, "([^/]+.)*").replaceAll(/[.]/g, "[.]").replace(/[*]$/, "[^.]+"));
    pathname = pathname.replaceAll(/[/]/g, "[/]").replaceAll(/[.]/g, "[.]").replaceAll(/[*]/g, ".*");
    return "^" + protocol + host + "(" + pathname + ")?$";
  }
  function patternToRegex(...matchPatterns) {
    if (matchPatterns.length === 0) {
      return /$./;
    }
    if (matchPatterns.includes("<all_urls>")) {
      return allUrlsRegex;
    }
    if (matchPatterns.includes("*://*/*")) {
      return allStarsRegex;
    }
    return new RegExp(matchPatterns.map((x) => getRawPatternRegex(x)).join("|"));
  }
  function excludeDuplicatePatterns(matchPatterns) {
    if (matchPatterns.includes("<all_urls>")) {
      return ["<all_urls>"];
    }
    if (matchPatterns.includes("*://*/*")) {
      return ["*://*/*"];
    }
    return matchPatterns.filter((possibleSubset) => !matchPatterns.some((possibleSuperset) => possibleSubset !== possibleSuperset && patternToRegex(possibleSuperset).test(possibleSubset)));
  }
  function normalizeManifestPermissions(manifest = chrome.runtime.getManifest()) {
    var _a2;
    const manifestPermissions = {
      origins: [],
      permissions: []
    };
    const list = /* @__PURE__ */ new Set([
      ...manifest.permissions ?? [],
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Not sure why it's being a PITA
      ...manifest.host_permissions ?? [],
      ...(manifest.content_scripts ?? []).flatMap((config) => config.matches ?? [])
    ]);
    if (manifest.devtools_page && !((_a2 = manifest.optional_permissions) == null ? void 0 : _a2.includes("devtools"))) {
      list.add("devtools");
    }
    for (const permission of list) {
      if (permission.includes("://") || permission === "<all_urls>") {
        manifestPermissions.origins.push(permission);
      } else {
        manifestPermissions.permissions.push(permission);
      }
    }
    return dropOverlappingPermissions(manifestPermissions);
  }
  const hostRegex = /:[/][/][*.]*([^/]+)/;
  function parseDomain(origin) {
    return origin.split(hostRegex)[1];
  }
  async function queryAdditionalPermissions(options) {
    return new Promise((resolve) => {
      chrome.permissions.getAll((currentPermissions) => {
        resolve(extractAdditionalPermissions(currentPermissions, options));
      });
    });
  }
  function extractAdditionalPermissions(currentPermissions, { manifest, strictOrigins = true } = {}) {
    const manifestPermissions = normalizeManifestPermissions(manifest);
    const additionalPermissions = {
      origins: [],
      permissions: []
    };
    for (const origin of currentPermissions.origins ?? []) {
      if (manifestPermissions.origins.includes(origin)) {
        continue;
      }
      if (!strictOrigins) {
        const domain = parseDomain(origin);
        const isDomainInManifest = manifestPermissions.origins.some((manifestOrigin) => parseDomain(manifestOrigin) === domain);
        if (isDomainInManifest) {
          continue;
        }
      }
      additionalPermissions.origins.push(origin);
    }
    for (const permission of currentPermissions.permissions ?? []) {
      if (!manifestPermissions.permissions.includes(permission)) {
        additionalPermissions.permissions.push(permission);
      }
    }
    return additionalPermissions;
  }
  function isUrlPermittedByManifest(origin, manifest = chrome.runtime.getManifest()) {
    const manifestPermissions = normalizeManifestPermissions(manifest);
    const originsRegex = patternToRegex(...manifestPermissions.origins);
    return originsRegex.test(origin);
  }
  function dropOverlappingPermissions({ origins, permissions }) {
    return {
      origins: origins ? excludeDuplicatePatterns(origins) : [],
      permissions: permissions ? [...permissions] : []
    };
  }
  function isCurrentPathname(path) {
    if (!path) {
      return false;
    }
    try {
      const { pathname } = new URL(path, location.origin);
      return pathname === location.pathname;
    } catch {
      return false;
    }
  }
  function getManifest(_version) {
    var _a2, _b2, _c2;
    return (_c2 = (_b2 = (_a2 = globalThis.chrome) == null ? void 0 : _a2.runtime) == null ? void 0 : _b2.getManifest) == null ? void 0 : _c2.call(_b2);
  }
  function once(function_) {
    let result2;
    return () => {
      if (result2 === void 0) {
        result2 = function_();
      }
      return result2;
    };
  }
  const isBackground = () => isBackgroundPage() || isBackgroundWorker();
  const isBackgroundPage = once(() => {
    var _a2, _b2;
    const manifest = getManifest();
    if (!manifest) {
      return false;
    }
    if (isCurrentPathname(manifest.background_page ?? ((_a2 = manifest.background) == null ? void 0 : _a2.page))) {
      return true;
    }
    return Boolean(((_b2 = manifest.background) == null ? void 0 : _b2.scripts) && isCurrentPathname("/_generated_background_page.html"));
  });
  const isBackgroundWorker = once(() => {
    var _a2, _b2;
    return isCurrentPathname((_b2 = (_a2 = getManifest()) == null ? void 0 : _a2.background) == null ? void 0 : _b2.service_worker);
  });
  const isPersistentBackgroundPage = once(() => {
    var _a2, _b2, _c2;
    return isBackgroundPage() && ((_a2 = getManifest()) == null ? void 0 : _a2.manifest_version) === 2 && ((_c2 = (_b2 = getManifest()) == null ? void 0 : _b2.background) == null ? void 0 : _c2.persistent) !== false;
  });
  const isChrome = () => {
    var _a2;
    return (_a2 = globalThis.navigator) == null ? void 0 : _a2.userAgent.includes("Chrome");
  };
  const storageKey = "__webext-events__startup";
  const event = new EventTarget();
  let hasRun = false;
  let hasListeners = false;
  const browserStorage = ((_d = globalThis.browser) == null ? void 0 : _d.storage) ?? ((_e = globalThis.chrome) == null ? void 0 : _e.storage);
  async function runner() {
    hasRun = true;
    if (!hasListeners) {
      return;
    }
    if (isPersistentBackgroundPage()) {
      event.dispatchEvent(new Event("extension-start"));
      return;
    }
    if (!(browserStorage == null ? void 0 : browserStorage.session)) {
      if (isChrome() && chrome.runtime.getManifest().manifest_version === 2) {
        console.warn("onExtensionStart is unable to determine whether it’s being run for the first time on MV2 Event Pages in Chrome. It will run the listeners anyway.");
      } else {
        console.warn("onExtensionStart is unable to determine whether it’s being run for the first time without the `storage` permission. It will run the listeners anyway");
      }
      event.dispatchEvent(new Event("extension-start"));
      return;
    }
    const storage = await browserStorage.session.get(storageKey);
    if (storageKey in storage) {
      return;
    }
    await browserStorage.session.set({ [storageKey]: true });
    event.dispatchEvent(new Event("extension-start"));
  }
  const onExtensionStart = Object.freeze({
    addListener(callback) {
      if (hasRun) {
        console.warn("onExtensionStart.addListener() was called after the extension started. The callback will not be called.");
      } else {
        hasListeners = true;
        event.addEventListener("extension-start", callback);
      }
    },
    removeListener(callback) {
      event.removeEventListener("extension-start", callback);
    }
  });
  setTimeout(runner, 2);
  async function oneEvent(event2, { filter, signal } = {}) {
    if (signal == null ? void 0 : signal.aborted) {
      return;
    }
    return new Promise((resolve) => {
      const listener = (...parameters) => {
        if (!filter || filter(...parameters)) {
          resolve(parameters);
          event2.removeListener(listener);
        }
      };
      event2.addListener(listener);
      signal == null ? void 0 : signal.addEventListener("abort", () => {
        resolve();
        event2.removeListener(listener);
      });
    });
  }
  function getDifferentiators(c) {
    return JSON.stringify([c.all_frames, c.exclude_matches, c.run_at]);
  }
  function excludeDuplicateFiles(contentScripts, { warn = true } = {}) {
    const uniques = /* @__PURE__ */ new Map();
    const filterWarnAndAdd = (files, context) => {
      if (!files) {
        return [];
      }
      return files.filter((file) => {
        const differentiators = getDifferentiators(context);
        if (uniques.has(file)) {
          if (warn && differentiators !== uniques.get(file)) {
            console.warn(`Duplicate file in the manifest content_scripts: ${file} 
More info: https://github.com/fregante/webext-dynamic-content-scripts/issues/62`);
          }
          return false;
        }
        uniques.set(file, differentiators);
        return true;
      });
    };
    return contentScripts.flatMap((contentScript) => {
      const { matches, ...cleanContentScript } = contentScript;
      const result2 = {
        ...cleanContentScript,
        js: filterWarnAndAdd(contentScript.js, contentScript),
        css: filterWarnAndAdd(contentScript.css, contentScript)
      };
      return result2.css.length + result2.js.length === 0 ? [] : result2;
    });
  }
  function NestedProxy(target) {
    return new Proxy(target, {
      get(target2, prop) {
        if (!target2[prop]) {
          return;
        }
        if (typeof target2[prop] !== "function") {
          return new NestedProxy(target2[prop]);
        }
        return (...arguments_) => new Promise((resolve, reject) => {
          target2[prop](...arguments_, (result2) => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
            } else {
              resolve(result2);
            }
          });
        });
      }
    });
  }
  const chromeP$1 = globalThis.chrome && new NestedProxy(globalThis.chrome);
  const gotScripting = Boolean((_f = globalThis.chrome) == null ? void 0 : _f.scripting);
  function castTarget$1(target) {
    return typeof target === "object" ? target : {
      tabId: target,
      frameId: 0
    };
  }
  function castAllFramesTarget(target) {
    if (typeof target === "object") {
      return { ...target, allFrames: false };
    }
    return {
      tabId: target,
      frameId: void 0,
      allFrames: true
    };
  }
  function castArray(possibleArray) {
    if (Array.isArray(possibleArray)) {
      return possibleArray;
    }
    return [possibleArray];
  }
  const nativeFunction = /^function \w+\(\) {[\n\s]+\[native code][\n\s]+}/;
  async function executeFunction(target, function_, ...args) {
    if (nativeFunction.test(String(function_))) {
      throw new TypeError("Native functions need to be wrapped first, like `executeFunction(1, () => alert(1))`");
    }
    const { frameId, tabId } = castTarget$1(target);
    if (gotScripting) {
      const [injection] = await chrome.scripting.executeScript({
        target: {
          tabId,
          frameIds: [frameId]
        },
        func: function_,
        args
      });
      return injection == null ? void 0 : injection.result;
    }
    const [result2] = await chromeP$1.tabs.executeScript(tabId, {
      code: `(${function_.toString()})(...${JSON.stringify(args)})`,
      matchAboutBlank: true,
      // Needed for `srcdoc` frames; doesn't hurt normal pages
      frameId
    });
    return result2;
  }
  function arrayOrUndefined(value) {
    return value === void 0 ? void 0 : [value];
  }
  async function insertCSS({ tabId, frameId, files, allFrames, matchAboutBlank, runAt }, { ignoreTargetErrors } = {}) {
    const everyInsertion = Promise.all(files.map(async (content) => {
      if (typeof content === "string") {
        content = { file: content };
      }
      if (gotScripting) {
        return chrome.scripting.insertCSS({
          target: {
            tabId,
            frameIds: arrayOrUndefined(frameId),
            allFrames: frameId === void 0 ? allFrames : void 0
          },
          files: "file" in content ? [content.file] : void 0,
          css: "code" in content ? content.code : void 0
        });
      }
      return chromeP$1.tabs.insertCSS(tabId, {
        ...content,
        matchAboutBlank,
        allFrames,
        frameId,
        runAt: runAt ?? "document_start"
        // CSS should prefer `document_start` when unspecified
      });
    }));
    if (ignoreTargetErrors) {
      await catchTargetInjectionErrors(everyInsertion);
    } else {
      await everyInsertion;
    }
  }
  function assertNoCode(files) {
    if (files.some((content) => "code" in content)) {
      throw new Error("chrome.scripting does not support injecting strings of `code`");
    }
  }
  async function executeScript({ tabId, frameId, files, allFrames, matchAboutBlank, runAt }, { ignoreTargetErrors } = {}) {
    const normalizedFiles = files.map((file) => typeof file === "string" ? { file } : file);
    if (gotScripting) {
      assertNoCode(normalizedFiles);
      const injection = chrome.scripting.executeScript({
        target: {
          tabId,
          frameIds: arrayOrUndefined(frameId),
          allFrames: frameId === void 0 ? allFrames : void 0
        },
        files: normalizedFiles.map(({ file }) => file)
      });
      if (ignoreTargetErrors) {
        await catchTargetInjectionErrors(injection);
      } else {
        await injection;
      }
      return;
    }
    const executions = [];
    for (const content of normalizedFiles) {
      if ("code" in content) {
        await executions.at(-1);
      }
      executions.push(chromeP$1.tabs.executeScript(tabId, {
        ...content,
        matchAboutBlank,
        allFrames,
        frameId,
        runAt
      }));
    }
    if (ignoreTargetErrors) {
      await catchTargetInjectionErrors(Promise.all(executions));
    } else {
      await Promise.all(executions);
    }
  }
  async function getTabsByUrl(matches, excludeMatches) {
    if (matches.length === 0) {
      return [];
    }
    const exclude = excludeMatches ? patternToRegex(...excludeMatches) : void 0;
    const tabs = await chromeP$1.tabs.query({ url: matches });
    return tabs.filter((tab) => tab.id && tab.url && (exclude ? !exclude.test(tab.url) : true)).map((tab) => tab.id);
  }
  async function injectContentScript(where, scripts, options = {}) {
    const targets = castArray(where);
    await Promise.all(targets.map(async (target) => injectContentScriptInSpecificTarget(castAllFramesTarget(target), scripts, options)));
  }
  async function injectContentScriptInSpecificTarget({ frameId, tabId, allFrames }, scripts, options = {}) {
    const injections = castArray(scripts).flatMap((script) => [
      insertCSS({
        tabId,
        frameId,
        allFrames,
        files: script.css ?? [],
        matchAboutBlank: script.matchAboutBlank ?? script.match_about_blank,
        runAt: script.runAt ?? script.run_at
      }, options),
      executeScript({
        tabId,
        frameId,
        allFrames,
        files: script.js ?? [],
        matchAboutBlank: script.matchAboutBlank ?? script.match_about_blank,
        runAt: script.runAt ?? script.run_at
      }, options)
    ]);
    await Promise.all(injections);
  }
  const blockedPrefixes = [
    "chrome.google.com/webstore",
    // Host *and* pathname
    "chromewebstore.google.com",
    "accounts-static.cdn.mozilla.net",
    "accounts.firefox.com",
    "addons.cdn.mozilla.net",
    "addons.mozilla.org",
    "api.accounts.firefox.com",
    "content.cdn.mozilla.net",
    "discovery.addons.mozilla.org",
    "input.mozilla.org",
    "install.mozilla.org",
    "oauth.accounts.firefox.com",
    "profile.accounts.firefox.com",
    "support.mozilla.org",
    "sync.services.mozilla.com",
    "testpilot.firefox.com"
  ];
  function isScriptableUrl(url) {
    if (!(url == null ? void 0 : url.startsWith("http"))) {
      return false;
    }
    const cleanUrl = url.replace(/^https?:\/\//, "");
    return blockedPrefixes.every((blocked) => !cleanUrl.startsWith(blocked));
  }
  const targetErrors = /^No frame with id \d+ in tab \d+.$|^No tab with id: \d+.$|^The tab was closed.$|^The frame was removed.$/;
  async function catchTargetInjectionErrors(promise) {
    try {
      await promise;
    } catch (error) {
      if (!targetErrors.test(error == null ? void 0 : error.message)) {
        throw error;
      }
    }
  }
  async function injectToExistingTabs(origins, scripts) {
    const excludeMatches = scripts.flatMap((script) => script.matches ?? []);
    return injectContentScript(await getTabsByUrl(origins, excludeMatches), scripts, { ignoreTargetErrors: true });
  }
  const noMatchesError = "Type error for parameter contentScriptOptions (Error processing matches: Array requires at least 1 items; you have 0) for contentScripts.register.";
  const noPermissionError = "Permission denied to register a content script for ";
  const gotNavigation = typeof chrome === "object" && "webNavigation" in chrome;
  async function isOriginPermitted(url) {
    return chromeP$1.permissions.contains({
      origins: [new URL(url).origin + "/*"]
    });
  }
  async function registerContentScript$1(contentScriptOptions, callback) {
    const { js = [], css: css2 = [], matchAboutBlank, matches = [], excludeMatches, runAt } = contentScriptOptions;
    let { allFrames } = contentScriptOptions;
    if (gotNavigation) {
      allFrames = false;
    } else if (allFrames) {
      console.warn("`allFrames: true` requires the `webNavigation` permission to work correctly: https://github.com/fregante/content-scripts-register-polyfill#permissions");
    }
    if (matches.length === 0) {
      throw new Error(noMatchesError);
    }
    await Promise.all(matches.map(async (pattern) => {
      if (!await chromeP$1.permissions.contains({ origins: [pattern] })) {
        throw new Error(noPermissionError + pattern);
      }
    }));
    const matchesRegex = patternToRegex(...matches);
    const excludeMatchesRegex = patternToRegex(...excludeMatches !== null && excludeMatches !== void 0 ? excludeMatches : []);
    const inject = async (url, tabId, frameId = 0) => {
      if (!matchesRegex.test(url) || excludeMatchesRegex.test(url) || !await isOriginPermitted(url)) {
        return;
      }
      await injectContentScript({
        tabId,
        frameId
      }, {
        css: css2,
        js,
        matchAboutBlank,
        runAt
      }, {
        ignoreTargetErrors: true
      });
    };
    const tabListener = async (tabId, { status }, { url }) => {
      if (status === "loading" && url) {
        void inject(url, tabId);
      }
    };
    const navListener = async ({ tabId, frameId, url }) => {
      void inject(url, tabId, frameId);
    };
    if (gotNavigation) {
      chrome.webNavigation.onCommitted.addListener(navListener);
    } else {
      chrome.tabs.onUpdated.addListener(tabListener);
    }
    const registeredContentScript = {
      async unregister() {
        if (gotNavigation) {
          chrome.webNavigation.onCommitted.removeListener(navListener);
        } else {
          chrome.tabs.onUpdated.removeListener(tabListener);
        }
      }
    };
    return registeredContentScript;
  }
  const chromeRegister = (_h = (_g = globalThis.chrome) == null ? void 0 : _g.scripting) == null ? void 0 : _h.registerContentScripts;
  const firefoxRegister = (_j = (_i = globalThis.browser) == null ? void 0 : _i.contentScripts) == null ? void 0 : _j.register;
  async function registerContentScript(contentScript) {
    var _a2, _b2;
    if (chromeRegister) {
      const id = "webext-dynamic-content-script-" + JSON.stringify(contentScript);
      try {
        await chromeRegister([{
          ...contentScript,
          id
        }]);
      } catch (error) {
        if (!(error == null ? void 0 : error.message.startsWith("Duplicate script ID"))) {
          throw error;
        }
      }
      return {
        unregister: async () => chrome.scripting.unregisterContentScripts({ ids: [id] })
      };
    }
    const firefoxContentScript = {
      ...contentScript,
      js: (_a2 = contentScript.js) == null ? void 0 : _a2.map((file) => ({ file })),
      css: (_b2 = contentScript.css) == null ? void 0 : _b2.map((file) => ({ file }))
    };
    if (firefoxRegister) {
      return firefoxRegister(firefoxContentScript);
    }
    return registerContentScript$1(firefoxContentScript);
  }
  const registeredScripts = /* @__PURE__ */ new Map();
  function makePathRelative(file) {
    return new URL(file, location.origin).pathname;
  }
  function getContentScripts() {
    const { content_scripts: rawManifest, manifest_version: manifestVersion } = chrome.runtime.getManifest();
    if (!rawManifest) {
      throw new Error("webext-dynamic-content-scripts tried to register scripts on the new host permissions, but no content scripts were found in the manifest.");
    }
    return excludeDuplicateFiles(rawManifest, { warn: manifestVersion === 2 });
  }
  async function registerOnOrigins(origins, contentScripts) {
    var _a2, _b2;
    if (origins.length === 0) {
      return;
    }
    for (const origin of origins) {
      for (const config of contentScripts) {
        const registeredScript = registerContentScript({
          // Always convert paths here because we don't know whether Firefox MV3 will accept full URLs
          js: (_a2 = config.js) == null ? void 0 : _a2.map((file) => makePathRelative(file)),
          css: (_b2 = config.css) == null ? void 0 : _b2.map((file) => makePathRelative(file)),
          allFrames: config.all_frames,
          matches: [origin],
          excludeMatches: config.matches,
          runAt: config.run_at
        });
        registeredScripts.set(origin, registeredScript);
      }
    }
  }
  async function handleNewPermissions({ origins }) {
    await enableOnOrigins(origins);
  }
  async function handledDroppedPermissions({ origins }) {
    if (!(origins == null ? void 0 : origins.length)) {
      return;
    }
    for (const [origin, scriptPromise] of registeredScripts) {
      if (origins.includes(origin)) {
        const script = await scriptPromise;
        void script.unregister();
      }
    }
  }
  async function enableOnOrigins(origins) {
    if (!(origins == null ? void 0 : origins.length)) {
      return;
    }
    const contentScripts = getContentScripts();
    await Promise.all([
      injectToExistingTabs(origins, contentScripts),
      registerOnOrigins(origins, contentScripts)
    ]);
  }
  async function registerExistingOrigins() {
    const { origins } = await queryAdditionalPermissions({
      strictOrigins: false
    });
    await enableOnOrigins(origins);
  }
  function init() {
    chrome.permissions.onRemoved.addListener(handledDroppedPermissions);
    chrome.permissions.onAdded.addListener(handleNewPermissions);
    onExtensionStart.addListener(registerExistingOrigins);
  }
  init();
  function castTarget(target) {
    return typeof target === "object" ? target : {
      tabId: target,
      frameId: 0
    };
  }
  async function getTabUrl(target) {
    const { frameId, tabId } = castTarget(target);
    try {
      if (frameId === 0 && "tabs" in globalThis.chrome) {
        const tab = await chromeP$1.tabs.get(tabId);
        if (tab.url) {
          return tab.url;
        }
      }
      return await executeFunction(target, () => location.href);
    } catch {
      return void 0;
    }
  }
  async function onPopupClose(watchedWindowId) {
    await oneEvent(chrome.windows.onRemoved, {
      filter: (closedWindowId) => closedWindowId === watchedWindowId
    });
  }
  function pageScript() {
    const button = document.querySelector("button");
    button.addEventListener("click", (_) => {
      window.close();
    });
    window.addEventListener("blur", (_) => {
      window.close();
    });
    window.resizeBy(0, document.body.scrollHeight - window.innerHeight);
    window.moveTo((screen.width - window.outerWidth) / 2, (screen.height - window.outerHeight) / 2);
    button.focus();
  }
  const css = (
    /* css */
    `
	/*! https://npm.im/webext-base-css */

	/* Chrome only: -webkit-hyphens */
	/* Safari only: _::-webkit-full-page-media */

	/* webpackIgnore: true */
	@import url('chrome://global/skin/in-content/common.css') (min--moz-device-pixel-ratio:0); /* Firefox-only */

	:root {
		--background-color-for-chrome: #292a2d;
		max-width: 700px;
		margin: auto;
	}

	body {
		--body-margin-h: 8px;
		margin-left: var(--body-margin-h);
		margin-right: var(--body-margin-h);
	}

	/* Selector matches Firefox’ */
	input[type='number'],
	input[type='password'],
	input[type='search'],
	input[type='text'],
	input[type='url'],
	input:not([type]),
	textarea {
		display: block;
		box-sizing: border-box;
		margin-left: 0;
		width: 100%;
		resize: vertical;
		-moz-tab-size: 4 !important;
		tab-size: 4 !important;
	}

	input[type='checkbox'] {
		vertical-align: -0.15em;
	}

	@supports (not (-webkit-hyphens:none)) and (not (-moz-appearance:none)) and (list-style-type:'*') {
		textarea:focus {
			/* Inexplicably missing from Chrome’s input style https://github.com/chromium/chromium/blob/6bea0557fe/extensions/renderer/resources/extension.css#L287 */
			border-color: #4d90fe;
			transition: border-color 200ms;
		}
	}

	hr {
		margin-right: calc(-1 * var(--body-margin-h));
		margin-left: calc(-1 * var(--body-margin-h));
		border: none;
		border-bottom: 1px solid #aaa4;
	}

	img {
		vertical-align: middle;
	}

	_::-webkit-full-page-media,
	_:future,
	:root {
		font-family: -apple-system, BlinkMacSystemFont, sans-serif, 'Apple Color Emoji';
	}

	_::-webkit-full-page-media,
	_:future,
	input[type='number'],
	input[type='password'],
	input[type='search'],
	input[type='text'],
	input[type='url'],
	input:not([type]),
	textarea {
		border: solid 1px #888;
		padding: 0.4em;
		font: inherit;
		-webkit-appearance: none;
	}

	@media (prefers-color-scheme: dark) {
		:root {
			color-scheme: dark;
			background-color: var(--background-color-for-chrome);
		}

		body,
		h3 { /* Chrome #3 */
			color: #e8eaed;
		}

		a {
			color: var(--link-color, #8ab4f8);
		}

		a:active {
			color: var(--link-color-active, #b6d3f9);
		}

		input[type='number'],
		input[type='password'],
		input[type='search'],
		input[type='text'],
		input[type='url'],
		input:not([type]),
		textarea {
			color: inherit;
			background-color: transparent;
		}
	}

	/* End webext-base-css */

	body {
		box-sizing: border-box;
		min-height: 100vh;
		margin: 0;
		padding: 1em;
		justify-content: center;
		display: flex;
		flex-direction: column;
		font-size: 14px;
		line-height: 1.5;
		font-family: system, system-ui, sans-serif;
	}

	button {
		margin-top: 1em;
		margin-left: auto;
	}
`
  );
  function getPage(message = "") {
    return (
      /* html */
      `
		<!doctype html>
		<meta charset="utf-8" />
		<title>${chrome.runtime.getManifest().name}</title>
		<style>${css}</style>
		<script defer src="alert.js"><\/script>
		<body>
			<main>${message}</main>
			<button>Ok</button>
		</body>
		<script>(${pageScript.toString()})()<\/script>
	`
    );
  }
  function getExternalUrl(message) {
    const url = new URL("https://webext-alert.vercel.app/");
    url.searchParams.set("message", message);
    url.searchParams.set("title", chrome.runtime.getManifest().name);
    return url.href;
  }
  async function openPopup(url) {
    const width = 420;
    const height = 150;
    try {
      return await chrome.windows.create({
        type: "popup",
        focused: true,
        url,
        height,
        width
      });
    } catch {
    }
  }
  async function popupAlert(message) {
    const popup = await openPopup("data:text/html," + encodeURIComponent(getPage(message))) ?? await openPopup(getExternalUrl(message));
    if (popup == null ? void 0 : popup.id) {
      await onPopupClose(popup.id);
    } else {
      console.log(message);
    }
  }
  const webextAlert = isBackgroundWorker() || !isChrome() && isBackgroundPage() ? popupAlert : globalThis.alert ?? console.log;
  const contextMenuId = "webext-permission-toggle:add-permission";
  let globalOptions;
  const chromeP = isChrome() && ((_l = (_k = globalThis.chrome) == null ? void 0 : _k.runtime) == null ? void 0 : _l.getManifest().manifest_version) < 3 ? chromeP$1 : globalThis.chrome;
  function assertTab(tab) {
    if (!(tab == null ? void 0 : tab.id)) {
      throw new Error("The browser didn't supply any information about the active tab.");
    }
  }
  function assertUrl(url) {
    if (!url) {
      throw new Error("The browser didn't supply the current page's URL.");
    }
  }
  function assertScriptableUrl(url) {
    if (!isScriptableUrl(url)) {
      throw new Error(chrome.runtime.getManifest().name + " can't be enabled on this page.");
    }
  }
  async function isOriginPermanentlyAllowed(origin) {
    return chromeP.permissions.contains({
      origins: [origin + "/*"]
    });
  }
  function updateItemRaw({ checked, enabled }) {
    chrome.contextMenus.update(contextMenuId, {
      checked,
      enabled
    });
  }
  async function updateItem(url) {
    if (!url) {
      updateItemRaw({
        enabled: true,
        checked: false
      });
      return;
    }
    if (isScriptableUrl(url)) {
      const { origin } = new URL(url);
      const isDefault = isUrlPermittedByManifest(url);
      const hasPermission = await isOriginPermanentlyAllowed(origin);
      updateItemRaw({
        // Don't let the user remove a default permission.
        // However, if they removed it via Chrome's UI, let them re-enable it with this toggle.
        enabled: !isDefault || !hasPermission,
        checked: hasPermission
      });
      return;
    }
    updateItemRaw({
      enabled: false,
      checked: false
    });
  }
  async function setPermission(url, request) {
    const permissionData = {
      origins: [
        new URL(url).origin + "/*"
      ]
    };
    await chromeP.permissions[request ? "request" : "remove"](permissionData);
    return chromeP.permissions.contains(permissionData);
  }
  async function handleTabActivated({ tabId }) {
    void updateItem(await getTabUrl(tabId) ?? "");
  }
  async function handleClick({ checked, menuItemId }, tab) {
    if (menuItemId !== contextMenuId) {
      return;
    }
    let url;
    try {
      assertTab(tab);
      url = tab.url || await getTabUrl(tab.id);
      assertUrl(url);
      assertScriptableUrl(url);
      const permissionExistsNow = await setPermission(url, checked);
      const settingWasSuccessful = permissionExistsNow === checked;
      if (!settingWasSuccessful) {
        updateItemRaw({
          checked: permissionExistsNow
        });
      }
      if (permissionExistsNow && globalOptions.reloadOnSuccess) {
        void executeFunction(tab.id, (message) => {
          if (confirm(message)) {
            location.reload();
          }
        }, globalOptions.reloadOnSuccess);
      }
    } catch (error) {
      setTimeout(updateItem, 500, url);
      if (tab == null ? void 0 : tab.id) {
        try {
          await executeFunction(tab.id, (text) => {
            window.alert(text);
          }, String(error));
        } catch {
          void webextAlert(String(error));
        }
      }
      throw error;
    }
  }
  function addPermissionToggle(options) {
    var _a2;
    if (!isBackground()) {
      throw new Error("webext-permission-toggle can only be called from a background page");
    }
    if (globalOptions) {
      throw new Error("webext-permission-toggle can only be initialized once");
    }
    const manifest = chrome.runtime.getManifest();
    if (!chrome.contextMenus) {
      if (!((_a2 = manifest.permissions) == null ? void 0 : _a2.includes("contextMenus")) && !/Android.+Firefox\//.test(navigator.userAgent)) {
        throw new Error("webext-permission-toggle requires the `contextMenus` permission");
      }
      console.warn("chrome.contextMenus is not available");
      return;
    }
    globalOptions = {
      title: `Enable ${manifest.name} on this domain`,
      reloadOnSuccess: false,
      ...options
    };
    if (globalOptions.reloadOnSuccess === true) {
      globalOptions.reloadOnSuccess = `Do you want to reload this page to apply ${manifest.name}?`;
    }
    const optionalHosts = [
      ...manifest.optional_permissions ?? [],
      ...manifest.optional_host_permissions ?? []
    ].filter((permission) => permission === "<all_urls>" || permission.includes("*"));
    if (optionalHosts.length === 0) {
      throw new TypeError("webext-permission-toggle requires some wildcard hosts to be specified in `optional_permissions` (MV2) or `optional_host_permissions` (MV3)");
    }
    chrome.contextMenus.remove(contextMenuId, () => chrome.runtime.lastError);
    const contexts = manifest.manifest_version === 2 ? ["page_action", "browser_action"] : ["action"];
    chrome.contextMenus.create({
      id: contextMenuId,
      type: "checkbox",
      checked: false,
      title: globalOptions.title,
      contexts,
      // Note: This is completely ignored by Chrome and Safari. Great. #14
      documentUrlPatterns: optionalHosts
    });
    chrome.contextMenus.onClicked.addListener(handleClick);
    chrome.tabs.onActivated.addListener(handleTabActivated);
    chrome.tabs.onUpdated.addListener(async (tabId, { status }, { url, active }) => {
      if (active && status === "complete") {
        void updateItem(url ?? await getTabUrl(tabId) ?? "");
      }
    });
  }
  const definition = defineBackground(() => {
    console.log("Hello background!", { id: browser.runtime.id });
    addPermissionToggle();
  });
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "fetchData") {
      fetch(message.url, {
        method: "GET",
        headers: {
          Authorization: "Basic " + btoa(`${message.username}:${message.password}`)
        }
      }).then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error(`Request failed with status: ${response.status}`);
        }
      }).then((data) => sendResponse({ success: true, data })).catch((error) => sendResponse({ success: false, error: error.message }));
      return true;
    }
  });
  background;
  function initPlugins() {
  }
  function print(method, ...args) {
    if (typeof args[0] === "string") {
      const message = args.shift();
      method(`[wxt] ${message}`, ...args);
    } else {
      method("[wxt]", ...args);
    }
  }
  const logger = {
    debug: (...args) => print(console.debug, ...args),
    log: (...args) => print(console.log, ...args),
    warn: (...args) => print(console.warn, ...args),
    error: (...args) => print(console.error, ...args)
  };
  let ws;
  function getDevServerWebSocket() {
    if (ws == null) {
      const serverUrl = `${"ws:"}//${"localhost"}:${3e3}`;
      logger.debug("Connecting to dev server @", serverUrl);
      ws = new WebSocket(serverUrl, "vite-hmr");
      ws.addWxtEventListener = ws.addEventListener.bind(ws);
      ws.sendCustom = (event2, payload) => ws == null ? void 0 : ws.send(JSON.stringify({ type: "custom", event: event2, payload }));
      ws.addEventListener("open", () => {
        logger.debug("Connected to dev server");
      });
      ws.addEventListener("close", () => {
        logger.debug("Disconnected from dev server");
      });
      ws.addEventListener("error", (event2) => {
        logger.error("Failed to connect to dev server", event2);
      });
      ws.addEventListener("message", (e) => {
        try {
          const message = JSON.parse(e.data);
          if (message.type === "custom") {
            ws == null ? void 0 : ws.dispatchEvent(
              new CustomEvent(message.event, { detail: message.data })
            );
          }
        } catch (err) {
          logger.error("Failed to handle message", err);
        }
      });
    }
    return ws;
  }
  function keepServiceWorkerAlive() {
    setInterval(async () => {
      await browser.runtime.getPlatformInfo();
    }, 5e3);
  }
  function reloadContentScript(payload) {
    const manifest = browser.runtime.getManifest();
    if (manifest.manifest_version == 2) {
      void reloadContentScriptMv2();
    } else {
      void reloadContentScriptMv3(payload);
    }
  }
  async function reloadContentScriptMv3({
    registration,
    contentScript
  }) {
    if (registration === "runtime") {
      await reloadRuntimeContentScriptMv3(contentScript);
    } else {
      await reloadManifestContentScriptMv3(contentScript);
    }
  }
  async function reloadManifestContentScriptMv3(contentScript) {
    const id = `wxt:${contentScript.js[0]}`;
    logger.log("Reloading content script:", contentScript);
    const registered = await browser.scripting.getRegisteredContentScripts();
    logger.debug("Existing scripts:", registered);
    const existing = registered.find((cs) => cs.id === id);
    if (existing) {
      logger.debug("Updating content script", existing);
      await browser.scripting.updateContentScripts([{ ...contentScript, id }]);
    } else {
      logger.debug("Registering new content script...");
      await browser.scripting.registerContentScripts([{ ...contentScript, id }]);
    }
    await reloadTabsForContentScript(contentScript);
  }
  async function reloadRuntimeContentScriptMv3(contentScript) {
    logger.log("Reloading content script:", contentScript);
    const registered = await browser.scripting.getRegisteredContentScripts();
    logger.debug("Existing scripts:", registered);
    const matches = registered.filter((cs) => {
      var _a2, _b2;
      const hasJs = (_a2 = contentScript.js) == null ? void 0 : _a2.find((js) => {
        var _a3;
        return (_a3 = cs.js) == null ? void 0 : _a3.includes(js);
      });
      const hasCss = (_b2 = contentScript.css) == null ? void 0 : _b2.find((css2) => {
        var _a3;
        return (_a3 = cs.css) == null ? void 0 : _a3.includes(css2);
      });
      return hasJs || hasCss;
    });
    if (matches.length === 0) {
      logger.log(
        "Content script is not registered yet, nothing to reload",
        contentScript
      );
      return;
    }
    await browser.scripting.updateContentScripts(matches);
    await reloadTabsForContentScript(contentScript);
  }
  async function reloadTabsForContentScript(contentScript) {
    const allTabs = await browser.tabs.query({});
    const matchPatterns = contentScript.matches.map(
      (match) => new MatchPattern(match)
    );
    const matchingTabs = allTabs.filter((tab) => {
      const url = tab.url;
      if (!url)
        return false;
      return !!matchPatterns.find((pattern) => pattern.includes(url));
    });
    await Promise.all(
      matchingTabs.map(async (tab) => {
        try {
          await browser.tabs.reload(tab.id);
        } catch (err) {
          logger.warn("Failed to reload tab:", err);
        }
      })
    );
  }
  async function reloadContentScriptMv2(_payload) {
    throw Error("TODO: reloadContentScriptMv2");
  }
  {
    try {
      const ws2 = getDevServerWebSocket();
      ws2.addWxtEventListener("wxt:reload-extension", () => {
        browser.runtime.reload();
      });
      ws2.addWxtEventListener("wxt:reload-content-script", (event2) => {
        reloadContentScript(event2.detail);
      });
      if (true) {
        ws2.addEventListener(
          "open",
          () => ws2.sendCustom("wxt:background-initialized")
        );
        keepServiceWorkerAlive();
      }
    } catch (err) {
      logger.error("Failed to setup web socket connection with dev server", err);
    }
    browser.commands.onCommand.addListener((command) => {
      if (command === "wxt:reload-extension") {
        browser.runtime.reload();
      }
    });
  }
  let result;
  try {
    initPlugins();
    result = definition.main();
    if (result instanceof Promise) {
      console.warn(
        "The background's main() function return a promise, but it must be synchronous"
      );
    }
  } catch (err) {
    logger.error("The background crashed on startup!");
    throw err;
  }
  const result$1 = result;
  return result$1;
}();
background;
