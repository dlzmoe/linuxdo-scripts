var content = function() {
  "use strict";var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  var _a, _b;
  function defineContentScript(definition2) {
    return definition2;
  }
  const browser = (
    // @ts-expect-error
    ((_b = (_a = globalThis.browser) == null ? void 0 : _a.runtime) == null ? void 0 : _b.id) == null ? globalThis.chrome : (
      // @ts-expect-error
      globalThis.browser
    )
  );
  function print$1(method, ...args) {
    if (typeof args[0] === "string") {
      const message = args.shift();
      method(`[wxt] ${message}`, ...args);
    } else {
      method("[wxt]", ...args);
    }
  }
  const logger$1 = {
    debug: (...args) => print$1(console.debug, ...args),
    log: (...args) => print$1(console.log, ...args),
    warn: (...args) => print$1(console.warn, ...args),
    error: (...args) => print$1(console.error, ...args)
  };
  const _WxtLocationChangeEvent = class _WxtLocationChangeEvent extends Event {
    constructor(newUrl, oldUrl) {
      super(_WxtLocationChangeEvent.EVENT_NAME, {});
      this.newUrl = newUrl;
      this.oldUrl = oldUrl;
    }
  };
  __publicField(_WxtLocationChangeEvent, "EVENT_NAME", getUniqueEventName("wxt:locationchange"));
  let WxtLocationChangeEvent = _WxtLocationChangeEvent;
  function getUniqueEventName(eventName) {
    var _a2;
    return `${(_a2 = browser == null ? void 0 : browser.runtime) == null ? void 0 : _a2.id}:${"content"}:${eventName}`;
  }
  function createLocationWatcher(ctx) {
    let interval;
    let oldUrl;
    return {
      /**
       * Ensure the location watcher is actively looking for URL changes. If it's already watching,
       * this is a noop.
       */
      run() {
        if (interval != null) return;
        oldUrl = new URL(location.href);
        interval = ctx.setInterval(() => {
          let newUrl = new URL(location.href);
          if (newUrl.href !== oldUrl.href) {
            window.dispatchEvent(new WxtLocationChangeEvent(newUrl, oldUrl));
            oldUrl = newUrl;
          }
        }, 1e3);
      }
    };
  }
  const _ContentScriptContext = class _ContentScriptContext {
    constructor(contentScriptName, options) {
      __publicField(this, "isTopFrame", window.self === window.top);
      __publicField(this, "abortController");
      __publicField(this, "locationWatcher", createLocationWatcher(this));
      this.contentScriptName = contentScriptName;
      this.options = options;
      this.abortController = new AbortController();
      if (this.isTopFrame) {
        this.listenForNewerScripts({ ignoreFirstEvent: true });
        this.stopOldScripts();
      } else {
        this.listenForNewerScripts();
      }
    }
    get signal() {
      return this.abortController.signal;
    }
    abort(reason) {
      return this.abortController.abort(reason);
    }
    get isInvalid() {
      if (browser.runtime.id == null) {
        this.notifyInvalidated();
      }
      return this.signal.aborted;
    }
    get isValid() {
      return !this.isInvalid;
    }
    /**
     * Add a listener that is called when the content script's context is invalidated.
     *
     * @returns A function to remove the listener.
     *
     * @example
     * browser.runtime.onMessage.addListener(cb);
     * const removeInvalidatedListener = ctx.onInvalidated(() => {
     *   browser.runtime.onMessage.removeListener(cb);
     * })
     * // ...
     * removeInvalidatedListener();
     */
    onInvalidated(cb) {
      this.signal.addEventListener("abort", cb);
      return () => this.signal.removeEventListener("abort", cb);
    }
    /**
     * Return a promise that never resolves. Useful if you have an async function that shouldn't run
     * after the context is expired.
     *
     * @example
     * const getValueFromStorage = async () => {
     *   if (ctx.isInvalid) return ctx.block();
     *
     *   // ...
     * }
     */
    block() {
      return new Promise(() => {
      });
    }
    /**
     * Wrapper around `window.setInterval` that automatically clears the interval when invalidated.
     */
    setInterval(handler, timeout) {
      const id = setInterval(() => {
        if (this.isValid) handler();
      }, timeout);
      this.onInvalidated(() => clearInterval(id));
      return id;
    }
    /**
     * Wrapper around `window.setTimeout` that automatically clears the interval when invalidated.
     */
    setTimeout(handler, timeout) {
      const id = setTimeout(() => {
        if (this.isValid) handler();
      }, timeout);
      this.onInvalidated(() => clearTimeout(id));
      return id;
    }
    /**
     * Wrapper around `window.requestAnimationFrame` that automatically cancels the request when
     * invalidated.
     */
    requestAnimationFrame(callback) {
      const id = requestAnimationFrame((...args) => {
        if (this.isValid) callback(...args);
      });
      this.onInvalidated(() => cancelAnimationFrame(id));
      return id;
    }
    /**
     * Wrapper around `window.requestIdleCallback` that automatically cancels the request when
     * invalidated.
     */
    requestIdleCallback(callback, options) {
      const id = requestIdleCallback((...args) => {
        if (!this.signal.aborted) callback(...args);
      }, options);
      this.onInvalidated(() => cancelIdleCallback(id));
      return id;
    }
    addEventListener(target, type2, handler, options) {
      var _a2;
      if (type2 === "wxt:locationchange") {
        if (this.isValid) this.locationWatcher.run();
      }
      (_a2 = target.addEventListener) == null ? void 0 : _a2.call(
        target,
        type2.startsWith("wxt:") ? getUniqueEventName(type2) : type2,
        handler,
        {
          ...options,
          signal: this.signal
        }
      );
    }
    /**
     * @internal
     * Abort the abort controller and execute all `onInvalidated` listeners.
     */
    notifyInvalidated() {
      this.abort("Content script context invalidated");
      logger$1.debug(
        `Content script "${this.contentScriptName}" context invalidated`
      );
    }
    stopOldScripts() {
      window.postMessage(
        {
          type: _ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE,
          contentScriptName: this.contentScriptName
        },
        "*"
      );
    }
    listenForNewerScripts(options) {
      let isFirst = true;
      const cb = (event) => {
        var _a2, _b2;
        if (((_a2 = event.data) == null ? void 0 : _a2.type) === _ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE && ((_b2 = event.data) == null ? void 0 : _b2.contentScriptName) === this.contentScriptName) {
          const wasFirst = isFirst;
          isFirst = false;
          if (wasFirst && (options == null ? void 0 : options.ignoreFirstEvent)) return;
          this.notifyInvalidated();
        }
      };
      addEventListener("message", cb);
      this.onInvalidated(() => removeEventListener("message", cb));
    }
  };
  __publicField(_ContentScriptContext, "SCRIPT_STARTED_MESSAGE_TYPE", getUniqueEventName(
    "wxt:content-script-started"
  ));
  let ContentScriptContext = _ContentScriptContext;
  const nullKey = Symbol("null");
  let keyCounter = 0;
  class ManyKeysMap extends Map {
    constructor() {
      super();
      this._objectHashes = /* @__PURE__ */ new WeakMap();
      this._symbolHashes = /* @__PURE__ */ new Map();
      this._publicKeys = /* @__PURE__ */ new Map();
      const [pairs] = arguments;
      if (pairs === null || pairs === void 0) {
        return;
      }
      if (typeof pairs[Symbol.iterator] !== "function") {
        throw new TypeError(typeof pairs + " is not iterable (cannot read property Symbol(Symbol.iterator))");
      }
      for (const [keys, value] of pairs) {
        this.set(keys, value);
      }
    }
    _getPublicKeys(keys, create = false) {
      if (!Array.isArray(keys)) {
        throw new TypeError("The keys parameter must be an array");
      }
      const privateKey = this._getPrivateKey(keys, create);
      let publicKey;
      if (privateKey && this._publicKeys.has(privateKey)) {
        publicKey = this._publicKeys.get(privateKey);
      } else if (create) {
        publicKey = [...keys];
        this._publicKeys.set(privateKey, publicKey);
      }
      return { privateKey, publicKey };
    }
    _getPrivateKey(keys, create = false) {
      const privateKeys = [];
      for (let key of keys) {
        if (key === null) {
          key = nullKey;
        }
        const hashes = typeof key === "object" || typeof key === "function" ? "_objectHashes" : typeof key === "symbol" ? "_symbolHashes" : false;
        if (!hashes) {
          privateKeys.push(key);
        } else if (this[hashes].has(key)) {
          privateKeys.push(this[hashes].get(key));
        } else if (create) {
          const privateKey = `@@mkm-ref-${keyCounter++}@@`;
          this[hashes].set(key, privateKey);
          privateKeys.push(privateKey);
        } else {
          return false;
        }
      }
      return JSON.stringify(privateKeys);
    }
    set(keys, value) {
      const { publicKey } = this._getPublicKeys(keys, true);
      return super.set(publicKey, value);
    }
    get(keys) {
      const { publicKey } = this._getPublicKeys(keys);
      return super.get(publicKey);
    }
    has(keys) {
      const { publicKey } = this._getPublicKeys(keys);
      return super.has(publicKey);
    }
    delete(keys) {
      const { publicKey, privateKey } = this._getPublicKeys(keys);
      return Boolean(publicKey && super.delete(publicKey) && this._publicKeys.delete(privateKey));
    }
    clear() {
      super.clear();
      this._symbolHashes.clear();
      this._publicKeys.clear();
    }
    get [Symbol.toStringTag]() {
      return "ManyKeysMap";
    }
    get size() {
      return super.size;
    }
  }
  function isPlainObject$1(value) {
    if (value === null || typeof value !== "object") {
      return false;
    }
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
      return false;
    }
    if (Symbol.iterator in value) {
      return false;
    }
    if (Symbol.toStringTag in value) {
      return Object.prototype.toString.call(value) === "[object Module]";
    }
    return true;
  }
  function _defu(baseObject, defaults, namespace = ".", merger) {
    if (!isPlainObject$1(defaults)) {
      return _defu(baseObject, {}, namespace, merger);
    }
    const object = Object.assign({}, defaults);
    for (const key in baseObject) {
      if (key === "__proto__" || key === "constructor") {
        continue;
      }
      const value = baseObject[key];
      if (value === null || value === void 0) {
        continue;
      }
      if (merger && merger(object, key, value, namespace)) {
        continue;
      }
      if (Array.isArray(value) && Array.isArray(object[key])) {
        object[key] = [...value, ...object[key]];
      } else if (isPlainObject$1(value) && isPlainObject$1(object[key])) {
        object[key] = _defu(
          value,
          object[key],
          (namespace ? `${namespace}.` : "") + key.toString(),
          merger
        );
      } else {
        object[key] = value;
      }
    }
    return object;
  }
  function createDefu(merger) {
    return (...arguments_) => (
      // eslint-disable-next-line unicorn/no-array-reduce
      arguments_.reduce((p2, c) => _defu(p2, c, "", merger), {})
    );
  }
  const defu = createDefu();
  const isExist = (element) => {
    return element !== null ? { isDetected: true, result: element } : { isDetected: false };
  };
  const isNotExist = (element) => {
    return element === null ? { isDetected: true, result: null } : { isDetected: false };
  };
  const getDefaultOptions = () => ({
    target: globalThis.document,
    unifyProcess: true,
    detector: isExist,
    observeConfigs: {
      childList: true,
      subtree: true,
      attributes: true
    },
    signal: void 0,
    customMatcher: void 0
  });
  const mergeOptions$1 = (userSideOptions, defaultOptions) => {
    return defu(userSideOptions, defaultOptions);
  };
  const unifyCache = new ManyKeysMap();
  function createWaitElement(instanceOptions) {
    const { defaultOptions } = instanceOptions;
    return (selector, options) => {
      const {
        target,
        unifyProcess,
        observeConfigs,
        detector,
        signal,
        customMatcher
      } = mergeOptions$1(options, defaultOptions);
      const unifyPromiseKey = [
        selector,
        target,
        unifyProcess,
        observeConfigs,
        detector,
        signal,
        customMatcher
      ];
      const cachedPromise = unifyCache.get(unifyPromiseKey);
      if (unifyProcess && cachedPromise) {
        return cachedPromise;
      }
      const detectPromise = new Promise(
        // biome-ignore lint/suspicious/noAsyncPromiseExecutor: avoid nesting promise
        async (resolve2, reject) => {
          if (signal == null ? void 0 : signal.aborted) {
            return reject(signal.reason);
          }
          const observer = new MutationObserver(
            async (mutations) => {
              for (const _ of mutations) {
                if (signal == null ? void 0 : signal.aborted) {
                  observer.disconnect();
                  break;
                }
                const detectResult2 = await detectElement({
                  selector,
                  target,
                  detector,
                  customMatcher
                });
                if (detectResult2.isDetected) {
                  observer.disconnect();
                  resolve2(detectResult2.result);
                  break;
                }
              }
            }
          );
          signal == null ? void 0 : signal.addEventListener(
            "abort",
            () => {
              observer.disconnect();
              return reject(signal.reason);
            },
            { once: true }
          );
          const detectResult = await detectElement({
            selector,
            target,
            detector,
            customMatcher
          });
          if (detectResult.isDetected) {
            return resolve2(detectResult.result);
          }
          observer.observe(target, observeConfigs);
        }
      ).finally(() => {
        unifyCache.delete(unifyPromiseKey);
      });
      unifyCache.set(unifyPromiseKey, detectPromise);
      return detectPromise;
    };
  }
  async function detectElement({
    target,
    selector,
    detector,
    customMatcher
  }) {
    const element = customMatcher ? customMatcher(selector) : target.querySelector(selector);
    return await detector(element);
  }
  const waitElement = createWaitElement({
    defaultOptions: getDefaultOptions()
  });
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var isPotentialCustomElementName_1;
  var hasRequiredIsPotentialCustomElementName;
  function requireIsPotentialCustomElementName() {
    if (hasRequiredIsPotentialCustomElementName) return isPotentialCustomElementName_1;
    hasRequiredIsPotentialCustomElementName = 1;
    var regex = /^[a-z](?:[\.0-9_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*-(?:[\x2D\.0-9_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*$/;
    var isPotentialCustomElementName2 = function(string) {
      return regex.test(string);
    };
    isPotentialCustomElementName_1 = isPotentialCustomElementName2;
    return isPotentialCustomElementName_1;
  }
  var isPotentialCustomElementNameExports = requireIsPotentialCustomElementName();
  const isPotentialCustomElementName = /* @__PURE__ */ getDefaultExportFromCjs(isPotentialCustomElementNameExports);
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve2, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve2(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };
  function createIsolatedElement(options) {
    return __async(this, null, function* () {
      const { name: name2, mode = "closed", css, isolateEvents = false } = options;
      if (!isPotentialCustomElementName(name2)) {
        throw Error(
          `"${name2}" is not a valid custom element name. It must be two words and kebab-case, with a few exceptions. See spec for more details: https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name`
        );
      }
      const parentElement = document.createElement(name2);
      const shadow = parentElement.attachShadow({ mode });
      const isolatedElement = document.createElement("html");
      const body = document.createElement("body");
      const head = document.createElement("head");
      if (css) {
        const style = document.createElement("style");
        if ("url" in css) {
          style.textContent = yield fetch(css.url).then((res) => res.text());
        } else {
          style.textContent = css.textContent;
        }
        head.appendChild(style);
      }
      isolatedElement.appendChild(head);
      isolatedElement.appendChild(body);
      shadow.appendChild(isolatedElement);
      if (isolateEvents) {
        const eventTypes = Array.isArray(isolateEvents) ? isolateEvents : ["keydown", "keyup", "keypress"];
        eventTypes.forEach((eventType) => {
          body.addEventListener(eventType, (e) => e.stopPropagation());
        });
      }
      return {
        parentElement,
        shadow,
        isolatedElement: body
      };
    });
  }
  async function createShadowRootUi(ctx, options) {
    var _a2;
    const css = [options.css ?? ""];
    if (((_a2 = ctx.options) == null ? void 0 : _a2.cssInjectionMode) === "ui") {
      const entryCss = await loadCss();
      css.push(entryCss.replaceAll(":root", ":host"));
    }
    const {
      isolatedElement: uiContainer,
      parentElement: shadowHost,
      shadow
    } = await createIsolatedElement({
      name: options.name,
      css: {
        textContent: css.join("\n").trim()
      },
      mode: options.mode ?? "open",
      isolateEvents: options.isolateEvents
    });
    shadowHost.setAttribute("data-wxt-shadow-root", "");
    let mounted;
    const mount = () => {
      mountUi(shadowHost, options);
      applyPosition(shadowHost, shadow.querySelector("html"), options);
      mounted = options.onMount(uiContainer, shadow, shadowHost);
    };
    const remove2 = () => {
      var _a3;
      (_a3 = options.onRemove) == null ? void 0 : _a3.call(options, mounted);
      shadowHost.remove();
      while (uiContainer.lastChild)
        uiContainer.removeChild(uiContainer.lastChild);
      mounted = void 0;
    };
    const mountFunctions = createMountFunctions(
      {
        mount,
        remove: remove2
      },
      options
    );
    ctx.onInvalidated(remove2);
    return {
      shadow,
      shadowHost,
      uiContainer,
      ...mountFunctions,
      get mounted() {
        return mounted;
      }
    };
  }
  function applyPosition(root, positionedElement, options) {
    var _a2, _b2;
    if (options.position === "inline") return;
    if (options.zIndex != null) root.style.zIndex = String(options.zIndex);
    root.style.overflow = "visible";
    root.style.position = "relative";
    root.style.width = "0";
    root.style.height = "0";
    root.style.display = "block";
    if (positionedElement) {
      if (options.position === "overlay") {
        positionedElement.style.position = "absolute";
        if ((_a2 = options.alignment) == null ? void 0 : _a2.startsWith("bottom-"))
          positionedElement.style.bottom = "0";
        else positionedElement.style.top = "0";
        if ((_b2 = options.alignment) == null ? void 0 : _b2.endsWith("-right"))
          positionedElement.style.right = "0";
        else positionedElement.style.left = "0";
      } else {
        positionedElement.style.position = "fixed";
        positionedElement.style.top = "0";
        positionedElement.style.bottom = "0";
        positionedElement.style.left = "0";
        positionedElement.style.right = "0";
      }
    }
  }
  function getAnchor(options) {
    if (options.anchor == null) return document.body;
    let resolved = typeof options.anchor === "function" ? options.anchor() : options.anchor;
    if (typeof resolved === "string") {
      if (resolved.startsWith("/")) {
        const result2 = document.evaluate(
          resolved,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        );
        return result2.singleNodeValue ?? void 0;
      } else {
        return document.querySelector(resolved) ?? void 0;
      }
    }
    return resolved ?? void 0;
  }
  function mountUi(root, options) {
    var _a2, _b2;
    const anchor = getAnchor(options);
    if (anchor == null)
      throw Error(
        "Failed to mount content script UI: could not find anchor element"
      );
    switch (options.append) {
      case void 0:
      case "last":
        anchor.append(root);
        break;
      case "first":
        anchor.prepend(root);
        break;
      case "replace":
        anchor.replaceWith(root);
        break;
      case "after":
        (_a2 = anchor.parentElement) == null ? void 0 : _a2.insertBefore(root, anchor.nextElementSibling);
        break;
      case "before":
        (_b2 = anchor.parentElement) == null ? void 0 : _b2.insertBefore(root, anchor);
        break;
      default:
        options.append(anchor, root);
        break;
    }
  }
  function createMountFunctions(baseFunctions, options) {
    let autoMountInstance = void 0;
    const stopAutoMount = () => {
      autoMountInstance == null ? void 0 : autoMountInstance.stopAutoMount();
      autoMountInstance = void 0;
    };
    const mount = () => {
      baseFunctions.mount();
    };
    const unmount = baseFunctions.remove;
    const remove2 = () => {
      stopAutoMount();
      baseFunctions.remove();
    };
    const autoMount = (autoMountOptions) => {
      if (autoMountInstance) {
        logger$1.warn("autoMount is already set.");
      }
      autoMountInstance = autoMountUi(
        { mount, unmount, stopAutoMount },
        {
          ...options,
          ...autoMountOptions
        }
      );
    };
    return {
      mount,
      remove: remove2,
      autoMount
    };
  }
  function autoMountUi(uiCallbacks, options) {
    const abortController = new AbortController();
    const EXPLICIT_STOP_REASON = "explicit_stop_auto_mount";
    const _stopAutoMount = () => {
      var _a2;
      abortController.abort(EXPLICIT_STOP_REASON);
      (_a2 = options.onStop) == null ? void 0 : _a2.call(options);
    };
    let resolvedAnchor = typeof options.anchor === "function" ? options.anchor() : options.anchor;
    if (resolvedAnchor instanceof Element) {
      throw Error(
        "autoMount and Element anchor option cannot be combined. Avoid passing `Element` directly or `() => Element` to the anchor."
      );
    }
    async function observeElement(selector) {
      let isAnchorExist = !!getAnchor(options);
      while (!abortController.signal.aborted) {
        try {
          const changedAnchor = await waitElement(selector ?? "body", {
            customMatcher: () => getAnchor(options) ?? null,
            detector: isAnchorExist ? isNotExist : isExist,
            signal: abortController.signal
          });
          isAnchorExist = !!changedAnchor;
          if (isAnchorExist) {
            uiCallbacks.mount();
          } else {
            uiCallbacks.unmount();
            if (options.once) {
              uiCallbacks.stopAutoMount();
            }
          }
        } catch (error) {
          if (abortController.signal.aborted && abortController.signal.reason === EXPLICIT_STOP_REASON) {
            break;
          } else {
            throw error;
          }
        }
      }
    }
    observeElement(resolvedAnchor);
    return { stopAutoMount: _stopAutoMount };
  }
  async function loadCss() {
    const url = browser.runtime.getURL(
      `/content-scripts/${"content"}.css`
    );
    try {
      const res = await fetch(url);
      return await res.text();
    } catch (err) {
      logger$1.warn(
        `Failed to load styles @ ${url}. Did you forget to import the stylesheet in your entrypoint?`,
        err
      );
      return "";
    }
  }
  /**
  * @vue/shared v3.5.13
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
  /*! #__NO_SIDE_EFFECTS__ */
  // @__NO_SIDE_EFFECTS__
  function makeMap(str) {
    const map2 = /* @__PURE__ */ Object.create(null);
    for (const key of str.split(",")) map2[key] = 1;
    return (val) => val in map2;
  }
  const EMPTY_OBJ = Object.freeze({});
  const EMPTY_ARR = Object.freeze([]);
  const NOOP = () => {
  };
  const NO = () => false;
  const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // uppercase letter
  (key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
  const isModelListener = (key) => key.startsWith("onUpdate:");
  const extend = Object.assign;
  const remove = (arr, el) => {
    const i = arr.indexOf(el);
    if (i > -1) {
      arr.splice(i, 1);
    }
  };
  const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
  const isArray = Array.isArray;
  const isMap = (val) => toTypeString(val) === "[object Map]";
  const isSet = (val) => toTypeString(val) === "[object Set]";
  const isDate = (val) => toTypeString(val) === "[object Date]";
  const isFunction = (val) => typeof val === "function";
  const isString = (val) => typeof val === "string";
  const isSymbol = (val) => typeof val === "symbol";
  const isObject = (val) => val !== null && typeof val === "object";
  const isPromise = (val) => {
    return (isObject(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
  };
  const objectToString = Object.prototype.toString;
  const toTypeString = (value) => objectToString.call(value);
  const toRawType = (value) => {
    return toTypeString(value).slice(8, -1);
  };
  const isPlainObject = (val) => toTypeString(val) === "[object Object]";
  const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
  const isReservedProp = /* @__PURE__ */ makeMap(
    // the leading comma is intentional so empty string "" is also included
    ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
  );
  const isBuiltInDirective = /* @__PURE__ */ makeMap(
    "bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo"
  );
  const cacheStringFunction = (fn) => {
    const cache = /* @__PURE__ */ Object.create(null);
    return (str) => {
      const hit = cache[str];
      return hit || (cache[str] = fn(str));
    };
  };
  const camelizeRE = /-(\w)/g;
  const camelize = cacheStringFunction(
    (str) => {
      return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
    }
  );
  const hyphenateRE = /\B([A-Z])/g;
  const hyphenate = cacheStringFunction(
    (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
  );
  const capitalize = cacheStringFunction((str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  });
  const toHandlerKey = cacheStringFunction(
    (str) => {
      const s = str ? `on${capitalize(str)}` : ``;
      return s;
    }
  );
  const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
  const invokeArrayFns = (fns, ...arg) => {
    for (let i = 0; i < fns.length; i++) {
      fns[i](...arg);
    }
  };
  const def$1 = (obj, key, value, writable = false) => {
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: false,
      writable,
      value
    });
  };
  const looseToNumber = (val) => {
    const n = parseFloat(val);
    return isNaN(n) ? val : n;
  };
  let _globalThis;
  const getGlobalThis = () => {
    return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
  };
  function normalizeStyle(value) {
    if (isArray(value)) {
      const res = {};
      for (let i = 0; i < value.length; i++) {
        const item = value[i];
        const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
        if (normalized) {
          for (const key in normalized) {
            res[key] = normalized[key];
          }
        }
      }
      return res;
    } else if (isString(value) || isObject(value)) {
      return value;
    }
  }
  const listDelimiterRE = /;(?![^(]*\))/g;
  const propertyDelimiterRE = /:([^]+)/;
  const styleCommentRE = /\/\*[^]*?\*\//g;
  function parseStringStyle(cssText) {
    const ret = {};
    cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
      if (item) {
        const tmp = item.split(propertyDelimiterRE);
        tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
      }
    });
    return ret;
  }
  function normalizeClass(value) {
    let res = "";
    if (isString(value)) {
      res = value;
    } else if (isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        const normalized = normalizeClass(value[i]);
        if (normalized) {
          res += normalized + " ";
        }
      }
    } else if (isObject(value)) {
      for (const name2 in value) {
        if (value[name2]) {
          res += name2 + " ";
        }
      }
    }
    return res.trim();
  }
  const HTML_TAGS = "html,body,base,head,link,meta,style,title,address,article,aside,footer,header,hgroup,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot";
  const SVG_TAGS = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view";
  const MATH_TAGS = "annotation,annotation-xml,maction,maligngroup,malignmark,math,menclose,merror,mfenced,mfrac,mfraction,mglyph,mi,mlabeledtr,mlongdiv,mmultiscripts,mn,mo,mover,mpadded,mphantom,mprescripts,mroot,mrow,ms,mscarries,mscarry,msgroup,msline,mspace,msqrt,msrow,mstack,mstyle,msub,msubsup,msup,mtable,mtd,mtext,mtr,munder,munderover,none,semantics";
  const isHTMLTag = /* @__PURE__ */ makeMap(HTML_TAGS);
  const isSVGTag = /* @__PURE__ */ makeMap(SVG_TAGS);
  const isMathMLTag = /* @__PURE__ */ makeMap(MATH_TAGS);
  const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
  const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
  function includeBooleanAttr(value) {
    return !!value || value === "";
  }
  function looseCompareArrays(a, b) {
    if (a.length !== b.length) return false;
    let equal = true;
    for (let i = 0; equal && i < a.length; i++) {
      equal = looseEqual(a[i], b[i]);
    }
    return equal;
  }
  function looseEqual(a, b) {
    if (a === b) return true;
    let aValidType = isDate(a);
    let bValidType = isDate(b);
    if (aValidType || bValidType) {
      return aValidType && bValidType ? a.getTime() === b.getTime() : false;
    }
    aValidType = isSymbol(a);
    bValidType = isSymbol(b);
    if (aValidType || bValidType) {
      return a === b;
    }
    aValidType = isArray(a);
    bValidType = isArray(b);
    if (aValidType || bValidType) {
      return aValidType && bValidType ? looseCompareArrays(a, b) : false;
    }
    aValidType = isObject(a);
    bValidType = isObject(b);
    if (aValidType || bValidType) {
      if (!aValidType || !bValidType) {
        return false;
      }
      const aKeysCount = Object.keys(a).length;
      const bKeysCount = Object.keys(b).length;
      if (aKeysCount !== bKeysCount) {
        return false;
      }
      for (const key in a) {
        const aHasKey = a.hasOwnProperty(key);
        const bHasKey = b.hasOwnProperty(key);
        if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) {
          return false;
        }
      }
    }
    return String(a) === String(b);
  }
  function looseIndexOf(arr, val) {
    return arr.findIndex((item) => looseEqual(item, val));
  }
  const isRef$1 = (val) => {
    return !!(val && val["__v_isRef"] === true);
  };
  const toDisplayString = (val) => {
    return isString(val) ? val : val == null ? "" : isArray(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? isRef$1(val) ? toDisplayString(val.value) : JSON.stringify(val, replacer, 2) : String(val);
  };
  const replacer = (_key, val) => {
    if (isRef$1(val)) {
      return replacer(_key, val.value);
    } else if (isMap(val)) {
      return {
        [`Map(${val.size})`]: [...val.entries()].reduce(
          (entries, [key, val2], i) => {
            entries[stringifySymbol(key, i) + " =>"] = val2;
            return entries;
          },
          {}
        )
      };
    } else if (isSet(val)) {
      return {
        [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v))
      };
    } else if (isSymbol(val)) {
      return stringifySymbol(val);
    } else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
      return String(val);
    }
    return val;
  };
  const stringifySymbol = (v, i = "") => {
    var _a2;
    return (
      // Symbol.description in es2019+ so we need to cast here to pass
      // the lib: es2016 check
      isSymbol(v) ? `Symbol(${(_a2 = v.description) != null ? _a2 : i})` : v
    );
  };
  /**
  * @vue/reactivity v3.5.13
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
  function warn$2(msg, ...args) {
    console.warn(`[Vue warn] ${msg}`, ...args);
  }
  let activeEffectScope;
  class EffectScope {
    constructor(detached = false) {
      this.detached = detached;
      this._active = true;
      this.effects = [];
      this.cleanups = [];
      this._isPaused = false;
      this.parent = activeEffectScope;
      if (!detached && activeEffectScope) {
        this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
          this
        ) - 1;
      }
    }
    get active() {
      return this._active;
    }
    pause() {
      if (this._active) {
        this._isPaused = true;
        let i, l;
        if (this.scopes) {
          for (i = 0, l = this.scopes.length; i < l; i++) {
            this.scopes[i].pause();
          }
        }
        for (i = 0, l = this.effects.length; i < l; i++) {
          this.effects[i].pause();
        }
      }
    }
    /**
     * Resumes the effect scope, including all child scopes and effects.
     */
    resume() {
      if (this._active) {
        if (this._isPaused) {
          this._isPaused = false;
          let i, l;
          if (this.scopes) {
            for (i = 0, l = this.scopes.length; i < l; i++) {
              this.scopes[i].resume();
            }
          }
          for (i = 0, l = this.effects.length; i < l; i++) {
            this.effects[i].resume();
          }
        }
      }
    }
    run(fn) {
      if (this._active) {
        const currentEffectScope = activeEffectScope;
        try {
          activeEffectScope = this;
          return fn();
        } finally {
          activeEffectScope = currentEffectScope;
        }
      } else {
        warn$2(`cannot run an inactive effect scope.`);
      }
    }
    /**
     * This should only be called on non-detached scopes
     * @internal
     */
    on() {
      activeEffectScope = this;
    }
    /**
     * This should only be called on non-detached scopes
     * @internal
     */
    off() {
      activeEffectScope = this.parent;
    }
    stop(fromParent) {
      if (this._active) {
        this._active = false;
        let i, l;
        for (i = 0, l = this.effects.length; i < l; i++) {
          this.effects[i].stop();
        }
        this.effects.length = 0;
        for (i = 0, l = this.cleanups.length; i < l; i++) {
          this.cleanups[i]();
        }
        this.cleanups.length = 0;
        if (this.scopes) {
          for (i = 0, l = this.scopes.length; i < l; i++) {
            this.scopes[i].stop(true);
          }
          this.scopes.length = 0;
        }
        if (!this.detached && this.parent && !fromParent) {
          const last = this.parent.scopes.pop();
          if (last && last !== this) {
            this.parent.scopes[this.index] = last;
            last.index = this.index;
          }
        }
        this.parent = void 0;
      }
    }
  }
  function getCurrentScope() {
    return activeEffectScope;
  }
  let activeSub;
  const pausedQueueEffects = /* @__PURE__ */ new WeakSet();
  class ReactiveEffect {
    constructor(fn) {
      this.fn = fn;
      this.deps = void 0;
      this.depsTail = void 0;
      this.flags = 1 | 4;
      this.next = void 0;
      this.cleanup = void 0;
      this.scheduler = void 0;
      if (activeEffectScope && activeEffectScope.active) {
        activeEffectScope.effects.push(this);
      }
    }
    pause() {
      this.flags |= 64;
    }
    resume() {
      if (this.flags & 64) {
        this.flags &= ~64;
        if (pausedQueueEffects.has(this)) {
          pausedQueueEffects.delete(this);
          this.trigger();
        }
      }
    }
    /**
     * @internal
     */
    notify() {
      if (this.flags & 2 && !(this.flags & 32)) {
        return;
      }
      if (!(this.flags & 8)) {
        batch(this);
      }
    }
    run() {
      if (!(this.flags & 1)) {
        return this.fn();
      }
      this.flags |= 2;
      cleanupEffect(this);
      prepareDeps(this);
      const prevEffect = activeSub;
      const prevShouldTrack = shouldTrack;
      activeSub = this;
      shouldTrack = true;
      try {
        return this.fn();
      } finally {
        if (activeSub !== this) {
          warn$2(
            "Active effect was not restored correctly - this is likely a Vue internal bug."
          );
        }
        cleanupDeps(this);
        activeSub = prevEffect;
        shouldTrack = prevShouldTrack;
        this.flags &= ~2;
      }
    }
    stop() {
      if (this.flags & 1) {
        for (let link2 = this.deps; link2; link2 = link2.nextDep) {
          removeSub(link2);
        }
        this.deps = this.depsTail = void 0;
        cleanupEffect(this);
        this.onStop && this.onStop();
        this.flags &= ~1;
      }
    }
    trigger() {
      if (this.flags & 64) {
        pausedQueueEffects.add(this);
      } else if (this.scheduler) {
        this.scheduler();
      } else {
        this.runIfDirty();
      }
    }
    /**
     * @internal
     */
    runIfDirty() {
      if (isDirty(this)) {
        this.run();
      }
    }
    get dirty() {
      return isDirty(this);
    }
  }
  let batchDepth = 0;
  let batchedSub;
  let batchedComputed;
  function batch(sub, isComputed = false) {
    sub.flags |= 8;
    if (isComputed) {
      sub.next = batchedComputed;
      batchedComputed = sub;
      return;
    }
    sub.next = batchedSub;
    batchedSub = sub;
  }
  function startBatch() {
    batchDepth++;
  }
  function endBatch() {
    if (--batchDepth > 0) {
      return;
    }
    if (batchedComputed) {
      let e = batchedComputed;
      batchedComputed = void 0;
      while (e) {
        const next = e.next;
        e.next = void 0;
        e.flags &= ~8;
        e = next;
      }
    }
    let error;
    while (batchedSub) {
      let e = batchedSub;
      batchedSub = void 0;
      while (e) {
        const next = e.next;
        e.next = void 0;
        e.flags &= ~8;
        if (e.flags & 1) {
          try {
            ;
            e.trigger();
          } catch (err) {
            if (!error) error = err;
          }
        }
        e = next;
      }
    }
    if (error) throw error;
  }
  function prepareDeps(sub) {
    for (let link2 = sub.deps; link2; link2 = link2.nextDep) {
      link2.version = -1;
      link2.prevActiveLink = link2.dep.activeLink;
      link2.dep.activeLink = link2;
    }
  }
  function cleanupDeps(sub) {
    let head;
    let tail = sub.depsTail;
    let link2 = tail;
    while (link2) {
      const prev = link2.prevDep;
      if (link2.version === -1) {
        if (link2 === tail) tail = prev;
        removeSub(link2);
        removeDep(link2);
      } else {
        head = link2;
      }
      link2.dep.activeLink = link2.prevActiveLink;
      link2.prevActiveLink = void 0;
      link2 = prev;
    }
    sub.deps = head;
    sub.depsTail = tail;
  }
  function isDirty(sub) {
    for (let link2 = sub.deps; link2; link2 = link2.nextDep) {
      if (link2.dep.version !== link2.version || link2.dep.computed && (refreshComputed(link2.dep.computed) || link2.dep.version !== link2.version)) {
        return true;
      }
    }
    if (sub._dirty) {
      return true;
    }
    return false;
  }
  function refreshComputed(computed2) {
    if (computed2.flags & 4 && !(computed2.flags & 16)) {
      return;
    }
    computed2.flags &= ~16;
    if (computed2.globalVersion === globalVersion) {
      return;
    }
    computed2.globalVersion = globalVersion;
    const dep = computed2.dep;
    computed2.flags |= 2;
    if (dep.version > 0 && !computed2.isSSR && computed2.deps && !isDirty(computed2)) {
      computed2.flags &= ~2;
      return;
    }
    const prevSub = activeSub;
    const prevShouldTrack = shouldTrack;
    activeSub = computed2;
    shouldTrack = true;
    try {
      prepareDeps(computed2);
      const value = computed2.fn(computed2._value);
      if (dep.version === 0 || hasChanged(value, computed2._value)) {
        computed2._value = value;
        dep.version++;
      }
    } catch (err) {
      dep.version++;
      throw err;
    } finally {
      activeSub = prevSub;
      shouldTrack = prevShouldTrack;
      cleanupDeps(computed2);
      computed2.flags &= ~2;
    }
  }
  function removeSub(link2, soft = false) {
    const { dep, prevSub, nextSub } = link2;
    if (prevSub) {
      prevSub.nextSub = nextSub;
      link2.prevSub = void 0;
    }
    if (nextSub) {
      nextSub.prevSub = prevSub;
      link2.nextSub = void 0;
    }
    if (dep.subsHead === link2) {
      dep.subsHead = nextSub;
    }
    if (dep.subs === link2) {
      dep.subs = prevSub;
      if (!prevSub && dep.computed) {
        dep.computed.flags &= ~4;
        for (let l = dep.computed.deps; l; l = l.nextDep) {
          removeSub(l, true);
        }
      }
    }
    if (!soft && !--dep.sc && dep.map) {
      dep.map.delete(dep.key);
    }
  }
  function removeDep(link2) {
    const { prevDep, nextDep } = link2;
    if (prevDep) {
      prevDep.nextDep = nextDep;
      link2.prevDep = void 0;
    }
    if (nextDep) {
      nextDep.prevDep = prevDep;
      link2.nextDep = void 0;
    }
  }
  let shouldTrack = true;
  const trackStack = [];
  function pauseTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = false;
  }
  function resetTracking() {
    const last = trackStack.pop();
    shouldTrack = last === void 0 ? true : last;
  }
  function cleanupEffect(e) {
    const { cleanup } = e;
    e.cleanup = void 0;
    if (cleanup) {
      const prevSub = activeSub;
      activeSub = void 0;
      try {
        cleanup();
      } finally {
        activeSub = prevSub;
      }
    }
  }
  let globalVersion = 0;
  class Link {
    constructor(sub, dep) {
      this.sub = sub;
      this.dep = dep;
      this.version = dep.version;
      this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
    }
  }
  class Dep {
    constructor(computed2) {
      this.computed = computed2;
      this.version = 0;
      this.activeLink = void 0;
      this.subs = void 0;
      this.map = void 0;
      this.key = void 0;
      this.sc = 0;
      {
        this.subsHead = void 0;
      }
    }
    track(debugInfo) {
      if (!activeSub || !shouldTrack || activeSub === this.computed) {
        return;
      }
      let link2 = this.activeLink;
      if (link2 === void 0 || link2.sub !== activeSub) {
        link2 = this.activeLink = new Link(activeSub, this);
        if (!activeSub.deps) {
          activeSub.deps = activeSub.depsTail = link2;
        } else {
          link2.prevDep = activeSub.depsTail;
          activeSub.depsTail.nextDep = link2;
          activeSub.depsTail = link2;
        }
        addSub(link2);
      } else if (link2.version === -1) {
        link2.version = this.version;
        if (link2.nextDep) {
          const next = link2.nextDep;
          next.prevDep = link2.prevDep;
          if (link2.prevDep) {
            link2.prevDep.nextDep = next;
          }
          link2.prevDep = activeSub.depsTail;
          link2.nextDep = void 0;
          activeSub.depsTail.nextDep = link2;
          activeSub.depsTail = link2;
          if (activeSub.deps === link2) {
            activeSub.deps = next;
          }
        }
      }
      if (activeSub.onTrack) {
        activeSub.onTrack(
          extend(
            {
              effect: activeSub
            },
            debugInfo
          )
        );
      }
      return link2;
    }
    trigger(debugInfo) {
      this.version++;
      globalVersion++;
      this.notify(debugInfo);
    }
    notify(debugInfo) {
      startBatch();
      try {
        if (true) {
          for (let head = this.subsHead; head; head = head.nextSub) {
            if (head.sub.onTrigger && !(head.sub.flags & 8)) {
              head.sub.onTrigger(
                extend(
                  {
                    effect: head.sub
                  },
                  debugInfo
                )
              );
            }
          }
        }
        for (let link2 = this.subs; link2; link2 = link2.prevSub) {
          if (link2.sub.notify()) {
            ;
            link2.sub.dep.notify();
          }
        }
      } finally {
        endBatch();
      }
    }
  }
  function addSub(link2) {
    link2.dep.sc++;
    if (link2.sub.flags & 4) {
      const computed2 = link2.dep.computed;
      if (computed2 && !link2.dep.subs) {
        computed2.flags |= 4 | 16;
        for (let l = computed2.deps; l; l = l.nextDep) {
          addSub(l);
        }
      }
      const currentTail = link2.dep.subs;
      if (currentTail !== link2) {
        link2.prevSub = currentTail;
        if (currentTail) currentTail.nextSub = link2;
      }
      if (link2.dep.subsHead === void 0) {
        link2.dep.subsHead = link2;
      }
      link2.dep.subs = link2;
    }
  }
  const targetMap = /* @__PURE__ */ new WeakMap();
  const ITERATE_KEY = Symbol(
    "Object iterate"
  );
  const MAP_KEY_ITERATE_KEY = Symbol(
    "Map keys iterate"
  );
  const ARRAY_ITERATE_KEY = Symbol(
    "Array iterate"
  );
  function track(target, type2, key) {
    if (shouldTrack && activeSub) {
      let depsMap = targetMap.get(target);
      if (!depsMap) {
        targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
      }
      let dep = depsMap.get(key);
      if (!dep) {
        depsMap.set(key, dep = new Dep());
        dep.map = depsMap;
        dep.key = key;
      }
      {
        dep.track({
          target,
          type: type2,
          key
        });
      }
    }
  }
  function trigger(target, type2, key, newValue, oldValue, oldTarget) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
      globalVersion++;
      return;
    }
    const run = (dep) => {
      if (dep) {
        {
          dep.trigger({
            target,
            type: type2,
            key,
            newValue,
            oldValue,
            oldTarget
          });
        }
      }
    };
    startBatch();
    if (type2 === "clear") {
      depsMap.forEach(run);
    } else {
      const targetIsArray = isArray(target);
      const isArrayIndex = targetIsArray && isIntegerKey(key);
      if (targetIsArray && key === "length") {
        const newLength = Number(newValue);
        depsMap.forEach((dep, key2) => {
          if (key2 === "length" || key2 === ARRAY_ITERATE_KEY || !isSymbol(key2) && key2 >= newLength) {
            run(dep);
          }
        });
      } else {
        if (key !== void 0 || depsMap.has(void 0)) {
          run(depsMap.get(key));
        }
        if (isArrayIndex) {
          run(depsMap.get(ARRAY_ITERATE_KEY));
        }
        switch (type2) {
          case "add":
            if (!targetIsArray) {
              run(depsMap.get(ITERATE_KEY));
              if (isMap(target)) {
                run(depsMap.get(MAP_KEY_ITERATE_KEY));
              }
            } else if (isArrayIndex) {
              run(depsMap.get("length"));
            }
            break;
          case "delete":
            if (!targetIsArray) {
              run(depsMap.get(ITERATE_KEY));
              if (isMap(target)) {
                run(depsMap.get(MAP_KEY_ITERATE_KEY));
              }
            }
            break;
          case "set":
            if (isMap(target)) {
              run(depsMap.get(ITERATE_KEY));
            }
            break;
        }
      }
    }
    endBatch();
  }
  function reactiveReadArray(array) {
    const raw = toRaw(array);
    if (raw === array) return raw;
    track(raw, "iterate", ARRAY_ITERATE_KEY);
    return isShallow(array) ? raw : raw.map(toReactive);
  }
  function shallowReadArray(arr) {
    track(arr = toRaw(arr), "iterate", ARRAY_ITERATE_KEY);
    return arr;
  }
  const arrayInstrumentations = {
    __proto__: null,
    [Symbol.iterator]() {
      return iterator(this, Symbol.iterator, toReactive);
    },
    concat(...args) {
      return reactiveReadArray(this).concat(
        ...args.map((x) => isArray(x) ? reactiveReadArray(x) : x)
      );
    },
    entries() {
      return iterator(this, "entries", (value) => {
        value[1] = toReactive(value[1]);
        return value;
      });
    },
    every(fn, thisArg) {
      return apply(this, "every", fn, thisArg, void 0, arguments);
    },
    filter(fn, thisArg) {
      return apply(this, "filter", fn, thisArg, (v) => v.map(toReactive), arguments);
    },
    find(fn, thisArg) {
      return apply(this, "find", fn, thisArg, toReactive, arguments);
    },
    findIndex(fn, thisArg) {
      return apply(this, "findIndex", fn, thisArg, void 0, arguments);
    },
    findLast(fn, thisArg) {
      return apply(this, "findLast", fn, thisArg, toReactive, arguments);
    },
    findLastIndex(fn, thisArg) {
      return apply(this, "findLastIndex", fn, thisArg, void 0, arguments);
    },
    // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
    forEach(fn, thisArg) {
      return apply(this, "forEach", fn, thisArg, void 0, arguments);
    },
    includes(...args) {
      return searchProxy(this, "includes", args);
    },
    indexOf(...args) {
      return searchProxy(this, "indexOf", args);
    },
    join(separator) {
      return reactiveReadArray(this).join(separator);
    },
    // keys() iterator only reads `length`, no optimisation required
    lastIndexOf(...args) {
      return searchProxy(this, "lastIndexOf", args);
    },
    map(fn, thisArg) {
      return apply(this, "map", fn, thisArg, void 0, arguments);
    },
    pop() {
      return noTracking(this, "pop");
    },
    push(...args) {
      return noTracking(this, "push", args);
    },
    reduce(fn, ...args) {
      return reduce(this, "reduce", fn, args);
    },
    reduceRight(fn, ...args) {
      return reduce(this, "reduceRight", fn, args);
    },
    shift() {
      return noTracking(this, "shift");
    },
    // slice could use ARRAY_ITERATE but also seems to beg for range tracking
    some(fn, thisArg) {
      return apply(this, "some", fn, thisArg, void 0, arguments);
    },
    splice(...args) {
      return noTracking(this, "splice", args);
    },
    toReversed() {
      return reactiveReadArray(this).toReversed();
    },
    toSorted(comparer) {
      return reactiveReadArray(this).toSorted(comparer);
    },
    toSpliced(...args) {
      return reactiveReadArray(this).toSpliced(...args);
    },
    unshift(...args) {
      return noTracking(this, "unshift", args);
    },
    values() {
      return iterator(this, "values", toReactive);
    }
  };
  function iterator(self2, method, wrapValue) {
    const arr = shallowReadArray(self2);
    const iter = arr[method]();
    if (arr !== self2 && !isShallow(self2)) {
      iter._next = iter.next;
      iter.next = () => {
        const result2 = iter._next();
        if (result2.value) {
          result2.value = wrapValue(result2.value);
        }
        return result2;
      };
    }
    return iter;
  }
  const arrayProto = Array.prototype;
  function apply(self2, method, fn, thisArg, wrappedRetFn, args) {
    const arr = shallowReadArray(self2);
    const needsWrap = arr !== self2 && !isShallow(self2);
    const methodFn = arr[method];
    if (methodFn !== arrayProto[method]) {
      const result22 = methodFn.apply(self2, args);
      return needsWrap ? toReactive(result22) : result22;
    }
    let wrappedFn = fn;
    if (arr !== self2) {
      if (needsWrap) {
        wrappedFn = function(item, index) {
          return fn.call(this, toReactive(item), index, self2);
        };
      } else if (fn.length > 2) {
        wrappedFn = function(item, index) {
          return fn.call(this, item, index, self2);
        };
      }
    }
    const result2 = methodFn.call(arr, wrappedFn, thisArg);
    return needsWrap && wrappedRetFn ? wrappedRetFn(result2) : result2;
  }
  function reduce(self2, method, fn, args) {
    const arr = shallowReadArray(self2);
    let wrappedFn = fn;
    if (arr !== self2) {
      if (!isShallow(self2)) {
        wrappedFn = function(acc, item, index) {
          return fn.call(this, acc, toReactive(item), index, self2);
        };
      } else if (fn.length > 3) {
        wrappedFn = function(acc, item, index) {
          return fn.call(this, acc, item, index, self2);
        };
      }
    }
    return arr[method](wrappedFn, ...args);
  }
  function searchProxy(self2, method, args) {
    const arr = toRaw(self2);
    track(arr, "iterate", ARRAY_ITERATE_KEY);
    const res = arr[method](...args);
    if ((res === -1 || res === false) && isProxy(args[0])) {
      args[0] = toRaw(args[0]);
      return arr[method](...args);
    }
    return res;
  }
  function noTracking(self2, method, args = []) {
    pauseTracking();
    startBatch();
    const res = toRaw(self2)[method].apply(self2, args);
    endBatch();
    resetTracking();
    return res;
  }
  const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
  const builtInSymbols = new Set(
    /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
  );
  function hasOwnProperty(key) {
    if (!isSymbol(key)) key = String(key);
    const obj = toRaw(this);
    track(obj, "has", key);
    return obj.hasOwnProperty(key);
  }
  class BaseReactiveHandler {
    constructor(_isReadonly = false, _isShallow = false) {
      this._isReadonly = _isReadonly;
      this._isShallow = _isShallow;
    }
    get(target, key, receiver) {
      if (key === "__v_skip") return target["__v_skip"];
      const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
      if (key === "__v_isReactive") {
        return !isReadonly2;
      } else if (key === "__v_isReadonly") {
        return isReadonly2;
      } else if (key === "__v_isShallow") {
        return isShallow2;
      } else if (key === "__v_raw") {
        if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || // receiver is not the reactive proxy, but has the same prototype
        // this means the receiver is a user proxy of the reactive proxy
        Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
          return target;
        }
        return;
      }
      const targetIsArray = isArray(target);
      if (!isReadonly2) {
        let fn;
        if (targetIsArray && (fn = arrayInstrumentations[key])) {
          return fn;
        }
        if (key === "hasOwnProperty") {
          return hasOwnProperty;
        }
      }
      const res = Reflect.get(
        target,
        key,
        // if this is a proxy wrapping a ref, return methods using the raw ref
        // as receiver so that we don't have to call `toRaw` on the ref in all
        // its class methods
        isRef(target) ? target : receiver
      );
      if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
        return res;
      }
      if (!isReadonly2) {
        track(target, "get", key);
      }
      if (isShallow2) {
        return res;
      }
      if (isRef(res)) {
        return targetIsArray && isIntegerKey(key) ? res : res.value;
      }
      if (isObject(res)) {
        return isReadonly2 ? readonly(res) : reactive(res);
      }
      return res;
    }
  }
  class MutableReactiveHandler extends BaseReactiveHandler {
    constructor(isShallow2 = false) {
      super(false, isShallow2);
    }
    set(target, key, value, receiver) {
      let oldValue = target[key];
      if (!this._isShallow) {
        const isOldValueReadonly = isReadonly(oldValue);
        if (!isShallow(value) && !isReadonly(value)) {
          oldValue = toRaw(oldValue);
          value = toRaw(value);
        }
        if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
          if (isOldValueReadonly) {
            return false;
          } else {
            oldValue.value = value;
            return true;
          }
        }
      }
      const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
      const result2 = Reflect.set(
        target,
        key,
        value,
        isRef(target) ? target : receiver
      );
      if (target === toRaw(receiver)) {
        if (!hadKey) {
          trigger(target, "add", key, value);
        } else if (hasChanged(value, oldValue)) {
          trigger(target, "set", key, value, oldValue);
        }
      }
      return result2;
    }
    deleteProperty(target, key) {
      const hadKey = hasOwn(target, key);
      const oldValue = target[key];
      const result2 = Reflect.deleteProperty(target, key);
      if (result2 && hadKey) {
        trigger(target, "delete", key, void 0, oldValue);
      }
      return result2;
    }
    has(target, key) {
      const result2 = Reflect.has(target, key);
      if (!isSymbol(key) || !builtInSymbols.has(key)) {
        track(target, "has", key);
      }
      return result2;
    }
    ownKeys(target) {
      track(
        target,
        "iterate",
        isArray(target) ? "length" : ITERATE_KEY
      );
      return Reflect.ownKeys(target);
    }
  }
  class ReadonlyReactiveHandler extends BaseReactiveHandler {
    constructor(isShallow2 = false) {
      super(true, isShallow2);
    }
    set(target, key) {
      {
        warn$2(
          `Set operation on key "${String(key)}" failed: target is readonly.`,
          target
        );
      }
      return true;
    }
    deleteProperty(target, key) {
      {
        warn$2(
          `Delete operation on key "${String(key)}" failed: target is readonly.`,
          target
        );
      }
      return true;
    }
  }
  const mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
  const readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
  const shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(true);
  const shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
  const toShallow = (value) => value;
  const getProto = (v) => Reflect.getPrototypeOf(v);
  function createIterableMethod(method, isReadonly2, isShallow2) {
    return function(...args) {
      const target = this["__v_raw"];
      const rawTarget = toRaw(target);
      const targetIsMap = isMap(rawTarget);
      const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
      const isKeyOnly = method === "keys" && targetIsMap;
      const innerIterator = target[method](...args);
      const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
      !isReadonly2 && track(
        rawTarget,
        "iterate",
        isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
      );
      return {
        // iterator protocol
        next() {
          const { value, done } = innerIterator.next();
          return done ? { value, done } : {
            value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
            done
          };
        },
        // iterable protocol
        [Symbol.iterator]() {
          return this;
        }
      };
    };
  }
  function createReadonlyMethod(type2) {
    return function(...args) {
      {
        const key = args[0] ? `on key "${args[0]}" ` : ``;
        warn$2(
          `${capitalize(type2)} operation ${key}failed: target is readonly.`,
          toRaw(this)
        );
      }
      return type2 === "delete" ? false : type2 === "clear" ? void 0 : this;
    };
  }
  function createInstrumentations(readonly2, shallow) {
    const instrumentations = {
      get(key) {
        const target = this["__v_raw"];
        const rawTarget = toRaw(target);
        const rawKey = toRaw(key);
        if (!readonly2) {
          if (hasChanged(key, rawKey)) {
            track(rawTarget, "get", key);
          }
          track(rawTarget, "get", rawKey);
        }
        const { has } = getProto(rawTarget);
        const wrap = shallow ? toShallow : readonly2 ? toReadonly : toReactive;
        if (has.call(rawTarget, key)) {
          return wrap(target.get(key));
        } else if (has.call(rawTarget, rawKey)) {
          return wrap(target.get(rawKey));
        } else if (target !== rawTarget) {
          target.get(key);
        }
      },
      get size() {
        const target = this["__v_raw"];
        !readonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
        return Reflect.get(target, "size", target);
      },
      has(key) {
        const target = this["__v_raw"];
        const rawTarget = toRaw(target);
        const rawKey = toRaw(key);
        if (!readonly2) {
          if (hasChanged(key, rawKey)) {
            track(rawTarget, "has", key);
          }
          track(rawTarget, "has", rawKey);
        }
        return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
      },
      forEach(callback, thisArg) {
        const observed = this;
        const target = observed["__v_raw"];
        const rawTarget = toRaw(target);
        const wrap = shallow ? toShallow : readonly2 ? toReadonly : toReactive;
        !readonly2 && track(rawTarget, "iterate", ITERATE_KEY);
        return target.forEach((value, key) => {
          return callback.call(thisArg, wrap(value), wrap(key), observed);
        });
      }
    };
    extend(
      instrumentations,
      readonly2 ? {
        add: createReadonlyMethod("add"),
        set: createReadonlyMethod("set"),
        delete: createReadonlyMethod("delete"),
        clear: createReadonlyMethod("clear")
      } : {
        add(value) {
          if (!shallow && !isShallow(value) && !isReadonly(value)) {
            value = toRaw(value);
          }
          const target = toRaw(this);
          const proto = getProto(target);
          const hadKey = proto.has.call(target, value);
          if (!hadKey) {
            target.add(value);
            trigger(target, "add", value, value);
          }
          return this;
        },
        set(key, value) {
          if (!shallow && !isShallow(value) && !isReadonly(value)) {
            value = toRaw(value);
          }
          const target = toRaw(this);
          const { has, get } = getProto(target);
          let hadKey = has.call(target, key);
          if (!hadKey) {
            key = toRaw(key);
            hadKey = has.call(target, key);
          } else {
            checkIdentityKeys(target, has, key);
          }
          const oldValue = get.call(target, key);
          target.set(key, value);
          if (!hadKey) {
            trigger(target, "add", key, value);
          } else if (hasChanged(value, oldValue)) {
            trigger(target, "set", key, value, oldValue);
          }
          return this;
        },
        delete(key) {
          const target = toRaw(this);
          const { has, get } = getProto(target);
          let hadKey = has.call(target, key);
          if (!hadKey) {
            key = toRaw(key);
            hadKey = has.call(target, key);
          } else {
            checkIdentityKeys(target, has, key);
          }
          const oldValue = get ? get.call(target, key) : void 0;
          const result2 = target.delete(key);
          if (hadKey) {
            trigger(target, "delete", key, void 0, oldValue);
          }
          return result2;
        },
        clear() {
          const target = toRaw(this);
          const hadItems = target.size !== 0;
          const oldTarget = isMap(target) ? new Map(target) : new Set(target);
          const result2 = target.clear();
          if (hadItems) {
            trigger(
              target,
              "clear",
              void 0,
              void 0,
              oldTarget
            );
          }
          return result2;
        }
      }
    );
    const iteratorMethods = [
      "keys",
      "values",
      "entries",
      Symbol.iterator
    ];
    iteratorMethods.forEach((method) => {
      instrumentations[method] = createIterableMethod(method, readonly2, shallow);
    });
    return instrumentations;
  }
  function createInstrumentationGetter(isReadonly2, shallow) {
    const instrumentations = createInstrumentations(isReadonly2, shallow);
    return (target, key, receiver) => {
      if (key === "__v_isReactive") {
        return !isReadonly2;
      } else if (key === "__v_isReadonly") {
        return isReadonly2;
      } else if (key === "__v_raw") {
        return target;
      }
      return Reflect.get(
        hasOwn(instrumentations, key) && key in target ? instrumentations : target,
        key,
        receiver
      );
    };
  }
  const mutableCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(false, false)
  };
  const shallowCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(false, true)
  };
  const readonlyCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(true, false)
  };
  const shallowReadonlyCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(true, true)
  };
  function checkIdentityKeys(target, has, key) {
    const rawKey = toRaw(key);
    if (rawKey !== key && has.call(target, rawKey)) {
      const type2 = toRawType(target);
      warn$2(
        `Reactive ${type2} contains both the raw and reactive versions of the same object${type2 === `Map` ? ` as keys` : ``}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
      );
    }
  }
  const reactiveMap = /* @__PURE__ */ new WeakMap();
  const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
  const readonlyMap = /* @__PURE__ */ new WeakMap();
  const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
  function targetTypeMap(rawType) {
    switch (rawType) {
      case "Object":
      case "Array":
        return 1;
      case "Map":
      case "Set":
      case "WeakMap":
      case "WeakSet":
        return 2;
      default:
        return 0;
    }
  }
  function getTargetType(value) {
    return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
  }
  function reactive(target) {
    if (isReadonly(target)) {
      return target;
    }
    return createReactiveObject(
      target,
      false,
      mutableHandlers,
      mutableCollectionHandlers,
      reactiveMap
    );
  }
  function shallowReactive(target) {
    return createReactiveObject(
      target,
      false,
      shallowReactiveHandlers,
      shallowCollectionHandlers,
      shallowReactiveMap
    );
  }
  function readonly(target) {
    return createReactiveObject(
      target,
      true,
      readonlyHandlers,
      readonlyCollectionHandlers,
      readonlyMap
    );
  }
  function shallowReadonly(target) {
    return createReactiveObject(
      target,
      true,
      shallowReadonlyHandlers,
      shallowReadonlyCollectionHandlers,
      shallowReadonlyMap
    );
  }
  function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
    if (!isObject(target)) {
      {
        warn$2(
          `value cannot be made ${isReadonly2 ? "readonly" : "reactive"}: ${String(
            target
          )}`
        );
      }
      return target;
    }
    if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
      return target;
    }
    const existingProxy = proxyMap.get(target);
    if (existingProxy) {
      return existingProxy;
    }
    const targetType = getTargetType(target);
    if (targetType === 0) {
      return target;
    }
    const proxy = new Proxy(
      target,
      targetType === 2 ? collectionHandlers : baseHandlers
    );
    proxyMap.set(target, proxy);
    return proxy;
  }
  function isReactive(value) {
    if (isReadonly(value)) {
      return isReactive(value["__v_raw"]);
    }
    return !!(value && value["__v_isReactive"]);
  }
  function isReadonly(value) {
    return !!(value && value["__v_isReadonly"]);
  }
  function isShallow(value) {
    return !!(value && value["__v_isShallow"]);
  }
  function isProxy(value) {
    return value ? !!value["__v_raw"] : false;
  }
  function toRaw(observed) {
    const raw = observed && observed["__v_raw"];
    return raw ? toRaw(raw) : observed;
  }
  function markRaw(value) {
    if (!hasOwn(value, "__v_skip") && Object.isExtensible(value)) {
      def$1(value, "__v_skip", true);
    }
    return value;
  }
  const toReactive = (value) => isObject(value) ? reactive(value) : value;
  const toReadonly = (value) => isObject(value) ? readonly(value) : value;
  function isRef(r) {
    return r ? r["__v_isRef"] === true : false;
  }
  function unref(ref2) {
    return isRef(ref2) ? ref2.value : ref2;
  }
  const shallowUnwrapHandlers = {
    get: (target, key, receiver) => key === "__v_raw" ? target : unref(Reflect.get(target, key, receiver)),
    set: (target, key, value, receiver) => {
      const oldValue = target[key];
      if (isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      } else {
        return Reflect.set(target, key, value, receiver);
      }
    }
  };
  function proxyRefs(objectWithRefs) {
    return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
  }
  class ComputedRefImpl {
    constructor(fn, setter, isSSR) {
      this.fn = fn;
      this.setter = setter;
      this._value = void 0;
      this.dep = new Dep(this);
      this.__v_isRef = true;
      this.deps = void 0;
      this.depsTail = void 0;
      this.flags = 16;
      this.globalVersion = globalVersion - 1;
      this.next = void 0;
      this.effect = this;
      this["__v_isReadonly"] = !setter;
      this.isSSR = isSSR;
    }
    /**
     * @internal
     */
    notify() {
      this.flags |= 16;
      if (!(this.flags & 8) && // avoid infinite self recursion
      activeSub !== this) {
        batch(this, true);
        return true;
      }
    }
    get value() {
      const link2 = this.dep.track({
        target: this,
        type: "get",
        key: "value"
      });
      refreshComputed(this);
      if (link2) {
        link2.version = this.dep.version;
      }
      return this._value;
    }
    set value(newValue) {
      if (this.setter) {
        this.setter(newValue);
      } else {
        warn$2("Write operation failed: computed value is readonly");
      }
    }
  }
  function computed$1(getterOrOptions, debugOptions, isSSR = false) {
    let getter;
    let setter;
    if (isFunction(getterOrOptions)) {
      getter = getterOrOptions;
    } else {
      getter = getterOrOptions.get;
      setter = getterOrOptions.set;
    }
    const cRef = new ComputedRefImpl(getter, setter, isSSR);
    return cRef;
  }
  const INITIAL_WATCHER_VALUE = {};
  const cleanupMap = /* @__PURE__ */ new WeakMap();
  let activeWatcher = void 0;
  function onWatcherCleanup(cleanupFn, failSilently = false, owner = activeWatcher) {
    if (owner) {
      let cleanups = cleanupMap.get(owner);
      if (!cleanups) cleanupMap.set(owner, cleanups = []);
      cleanups.push(cleanupFn);
    } else if (!failSilently) {
      warn$2(
        `onWatcherCleanup() was called when there was no active watcher to associate with.`
      );
    }
  }
  function watch$1(source, cb, options = EMPTY_OBJ) {
    const { immediate, deep, once, scheduler, augmentJob, call } = options;
    const warnInvalidSource = (s) => {
      (options.onWarn || warn$2)(
        `Invalid watch source: `,
        s,
        `A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.`
      );
    };
    const reactiveGetter = (source2) => {
      if (deep) return source2;
      if (isShallow(source2) || deep === false || deep === 0)
        return traverse(source2, 1);
      return traverse(source2);
    };
    let effect2;
    let getter;
    let cleanup;
    let boundCleanup;
    let forceTrigger = false;
    let isMultiSource = false;
    if (isRef(source)) {
      getter = () => source.value;
      forceTrigger = isShallow(source);
    } else if (isReactive(source)) {
      getter = () => reactiveGetter(source);
      forceTrigger = true;
    } else if (isArray(source)) {
      isMultiSource = true;
      forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
      getter = () => source.map((s) => {
        if (isRef(s)) {
          return s.value;
        } else if (isReactive(s)) {
          return reactiveGetter(s);
        } else if (isFunction(s)) {
          return call ? call(s, 2) : s();
        } else {
          warnInvalidSource(s);
        }
      });
    } else if (isFunction(source)) {
      if (cb) {
        getter = call ? () => call(source, 2) : source;
      } else {
        getter = () => {
          if (cleanup) {
            pauseTracking();
            try {
              cleanup();
            } finally {
              resetTracking();
            }
          }
          const currentEffect = activeWatcher;
          activeWatcher = effect2;
          try {
            return call ? call(source, 3, [boundCleanup]) : source(boundCleanup);
          } finally {
            activeWatcher = currentEffect;
          }
        };
      }
    } else {
      getter = NOOP;
      warnInvalidSource(source);
    }
    if (cb && deep) {
      const baseGetter = getter;
      const depth = deep === true ? Infinity : deep;
      getter = () => traverse(baseGetter(), depth);
    }
    const scope = getCurrentScope();
    const watchHandle = () => {
      effect2.stop();
      if (scope && scope.active) {
        remove(scope.effects, effect2);
      }
    };
    if (once && cb) {
      const _cb = cb;
      cb = (...args) => {
        _cb(...args);
        watchHandle();
      };
    }
    let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
    const job = (immediateFirstRun) => {
      if (!(effect2.flags & 1) || !effect2.dirty && !immediateFirstRun) {
        return;
      }
      if (cb) {
        const newValue = effect2.run();
        if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue))) {
          if (cleanup) {
            cleanup();
          }
          const currentWatcher = activeWatcher;
          activeWatcher = effect2;
          try {
            const args = [
              newValue,
              // pass undefined as the old value when it's changed for the first time
              oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
              boundCleanup
            ];
            call ? call(cb, 3, args) : (
              // @ts-expect-error
              cb(...args)
            );
            oldValue = newValue;
          } finally {
            activeWatcher = currentWatcher;
          }
        }
      } else {
        effect2.run();
      }
    };
    if (augmentJob) {
      augmentJob(job);
    }
    effect2 = new ReactiveEffect(getter);
    effect2.scheduler = scheduler ? () => scheduler(job, false) : job;
    boundCleanup = (fn) => onWatcherCleanup(fn, false, effect2);
    cleanup = effect2.onStop = () => {
      const cleanups = cleanupMap.get(effect2);
      if (cleanups) {
        if (call) {
          call(cleanups, 4);
        } else {
          for (const cleanup2 of cleanups) cleanup2();
        }
        cleanupMap.delete(effect2);
      }
    };
    {
      effect2.onTrack = options.onTrack;
      effect2.onTrigger = options.onTrigger;
    }
    if (cb) {
      if (immediate) {
        job(true);
      } else {
        oldValue = effect2.run();
      }
    } else if (scheduler) {
      scheduler(job.bind(null, true), true);
    } else {
      effect2.run();
    }
    watchHandle.pause = effect2.pause.bind(effect2);
    watchHandle.resume = effect2.resume.bind(effect2);
    watchHandle.stop = watchHandle;
    return watchHandle;
  }
  function traverse(value, depth = Infinity, seen) {
    if (depth <= 0 || !isObject(value) || value["__v_skip"]) {
      return value;
    }
    seen = seen || /* @__PURE__ */ new Set();
    if (seen.has(value)) {
      return value;
    }
    seen.add(value);
    depth--;
    if (isRef(value)) {
      traverse(value.value, depth, seen);
    } else if (isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        traverse(value[i], depth, seen);
      }
    } else if (isSet(value) || isMap(value)) {
      value.forEach((v) => {
        traverse(v, depth, seen);
      });
    } else if (isPlainObject(value)) {
      for (const key in value) {
        traverse(value[key], depth, seen);
      }
      for (const key of Object.getOwnPropertySymbols(value)) {
        if (Object.prototype.propertyIsEnumerable.call(value, key)) {
          traverse(value[key], depth, seen);
        }
      }
    }
    return value;
  }
  /**
  * @vue/runtime-core v3.5.13
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
  const stack = [];
  function pushWarningContext(vnode) {
    stack.push(vnode);
  }
  function popWarningContext() {
    stack.pop();
  }
  let isWarning = false;
  function warn$1(msg, ...args) {
    if (isWarning) return;
    isWarning = true;
    pauseTracking();
    const instance = stack.length ? stack[stack.length - 1].component : null;
    const appWarnHandler = instance && instance.appContext.config.warnHandler;
    const trace = getComponentTrace();
    if (appWarnHandler) {
      callWithErrorHandling(
        appWarnHandler,
        instance,
        11,
        [
          // eslint-disable-next-line no-restricted-syntax
          msg + args.map((a) => {
            var _a2, _b2;
            return (_b2 = (_a2 = a.toString) == null ? void 0 : _a2.call(a)) != null ? _b2 : JSON.stringify(a);
          }).join(""),
          instance && instance.proxy,
          trace.map(
            ({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`
          ).join("\n"),
          trace
        ]
      );
    } else {
      const warnArgs = [`[Vue warn]: ${msg}`, ...args];
      if (trace.length && // avoid spamming console during tests
      true) {
        warnArgs.push(`
`, ...formatTrace(trace));
      }
      console.warn(...warnArgs);
    }
    resetTracking();
    isWarning = false;
  }
  function getComponentTrace() {
    let currentVNode = stack[stack.length - 1];
    if (!currentVNode) {
      return [];
    }
    const normalizedStack = [];
    while (currentVNode) {
      const last = normalizedStack[0];
      if (last && last.vnode === currentVNode) {
        last.recurseCount++;
      } else {
        normalizedStack.push({
          vnode: currentVNode,
          recurseCount: 0
        });
      }
      const parentInstance = currentVNode.component && currentVNode.component.parent;
      currentVNode = parentInstance && parentInstance.vnode;
    }
    return normalizedStack;
  }
  function formatTrace(trace) {
    const logs = [];
    trace.forEach((entry, i) => {
      logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
    });
    return logs;
  }
  function formatTraceEntry({ vnode, recurseCount }) {
    const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
    const isRoot = vnode.component ? vnode.component.parent == null : false;
    const open = ` at <${formatComponentName(
      vnode.component,
      vnode.type,
      isRoot
    )}`;
    const close = `>` + postfix;
    return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
  }
  function formatProps(props) {
    const res = [];
    const keys = Object.keys(props);
    keys.slice(0, 3).forEach((key) => {
      res.push(...formatProp(key, props[key]));
    });
    if (keys.length > 3) {
      res.push(` ...`);
    }
    return res;
  }
  function formatProp(key, value, raw) {
    if (isString(value)) {
      value = JSON.stringify(value);
      return raw ? value : [`${key}=${value}`];
    } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
      return raw ? value : [`${key}=${value}`];
    } else if (isRef(value)) {
      value = formatProp(key, toRaw(value.value), true);
      return raw ? value : [`${key}=Ref<`, value, `>`];
    } else if (isFunction(value)) {
      return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
    } else {
      value = toRaw(value);
      return raw ? value : [`${key}=`, value];
    }
  }
  const ErrorTypeStrings$1 = {
    ["sp"]: "serverPrefetch hook",
    ["bc"]: "beforeCreate hook",
    ["c"]: "created hook",
    ["bm"]: "beforeMount hook",
    ["m"]: "mounted hook",
    ["bu"]: "beforeUpdate hook",
    ["u"]: "updated",
    ["bum"]: "beforeUnmount hook",
    ["um"]: "unmounted hook",
    ["a"]: "activated hook",
    ["da"]: "deactivated hook",
    ["ec"]: "errorCaptured hook",
    ["rtc"]: "renderTracked hook",
    ["rtg"]: "renderTriggered hook",
    [0]: "setup function",
    [1]: "render function",
    [2]: "watcher getter",
    [3]: "watcher callback",
    [4]: "watcher cleanup function",
    [5]: "native event handler",
    [6]: "component event handler",
    [7]: "vnode hook",
    [8]: "directive hook",
    [9]: "transition hook",
    [10]: "app errorHandler",
    [11]: "app warnHandler",
    [12]: "ref function",
    [13]: "async component loader",
    [14]: "scheduler flush",
    [15]: "component update",
    [16]: "app unmount cleanup function"
  };
  function callWithErrorHandling(fn, instance, type2, args) {
    try {
      return args ? fn(...args) : fn();
    } catch (err) {
      handleError(err, instance, type2);
    }
  }
  function callWithAsyncErrorHandling(fn, instance, type2, args) {
    if (isFunction(fn)) {
      const res = callWithErrorHandling(fn, instance, type2, args);
      if (res && isPromise(res)) {
        res.catch((err) => {
          handleError(err, instance, type2);
        });
      }
      return res;
    }
    if (isArray(fn)) {
      const values = [];
      for (let i = 0; i < fn.length; i++) {
        values.push(callWithAsyncErrorHandling(fn[i], instance, type2, args));
      }
      return values;
    } else {
      warn$1(
        `Invalid value type passed to callWithAsyncErrorHandling(): ${typeof fn}`
      );
    }
  }
  function handleError(err, instance, type2, throwInDev = true) {
    const contextVNode = instance ? instance.vnode : null;
    const { errorHandler, throwUnhandledErrorInProduction } = instance && instance.appContext.config || EMPTY_OBJ;
    if (instance) {
      let cur = instance.parent;
      const exposedInstance = instance.proxy;
      const errorInfo = ErrorTypeStrings$1[type2];
      while (cur) {
        const errorCapturedHooks = cur.ec;
        if (errorCapturedHooks) {
          for (let i = 0; i < errorCapturedHooks.length; i++) {
            if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
              return;
            }
          }
        }
        cur = cur.parent;
      }
      if (errorHandler) {
        pauseTracking();
        callWithErrorHandling(errorHandler, null, 10, [
          err,
          exposedInstance,
          errorInfo
        ]);
        resetTracking();
        return;
      }
    }
    logError(err, type2, contextVNode, throwInDev, throwUnhandledErrorInProduction);
  }
  function logError(err, type2, contextVNode, throwInDev = true, throwInProd = false) {
    {
      const info = ErrorTypeStrings$1[type2];
      if (contextVNode) {
        pushWarningContext(contextVNode);
      }
      warn$1(`Unhandled error${info ? ` during execution of ${info}` : ``}`);
      if (contextVNode) {
        popWarningContext();
      }
      if (throwInDev) {
        throw err;
      } else {
        console.error(err);
      }
    }
  }
  const queue = [];
  let flushIndex = -1;
  const pendingPostFlushCbs = [];
  let activePostFlushCbs = null;
  let postFlushIndex = 0;
  const resolvedPromise = /* @__PURE__ */ Promise.resolve();
  let currentFlushPromise = null;
  const RECURSION_LIMIT = 100;
  function nextTick(fn) {
    const p2 = currentFlushPromise || resolvedPromise;
    return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
  }
  function findInsertionIndex(id) {
    let start = flushIndex + 1;
    let end = queue.length;
    while (start < end) {
      const middle = start + end >>> 1;
      const middleJob = queue[middle];
      const middleJobId = getId(middleJob);
      if (middleJobId < id || middleJobId === id && middleJob.flags & 2) {
        start = middle + 1;
      } else {
        end = middle;
      }
    }
    return start;
  }
  function queueJob(job) {
    if (!(job.flags & 1)) {
      const jobId = getId(job);
      const lastJob = queue[queue.length - 1];
      if (!lastJob || // fast path when the job id is larger than the tail
      !(job.flags & 2) && jobId >= getId(lastJob)) {
        queue.push(job);
      } else {
        queue.splice(findInsertionIndex(jobId), 0, job);
      }
      job.flags |= 1;
      queueFlush();
    }
  }
  function queueFlush() {
    if (!currentFlushPromise) {
      currentFlushPromise = resolvedPromise.then(flushJobs);
    }
  }
  function queuePostFlushCb(cb) {
    if (!isArray(cb)) {
      if (activePostFlushCbs && cb.id === -1) {
        activePostFlushCbs.splice(postFlushIndex + 1, 0, cb);
      } else if (!(cb.flags & 1)) {
        pendingPostFlushCbs.push(cb);
        cb.flags |= 1;
      }
    } else {
      pendingPostFlushCbs.push(...cb);
    }
    queueFlush();
  }
  function flushPreFlushCbs(instance, seen, i = flushIndex + 1) {
    {
      seen = seen || /* @__PURE__ */ new Map();
    }
    for (; i < queue.length; i++) {
      const cb = queue[i];
      if (cb && cb.flags & 2) {
        if (instance && cb.id !== instance.uid) {
          continue;
        }
        if (checkRecursiveUpdates(seen, cb)) {
          continue;
        }
        queue.splice(i, 1);
        i--;
        if (cb.flags & 4) {
          cb.flags &= ~1;
        }
        cb();
        if (!(cb.flags & 4)) {
          cb.flags &= ~1;
        }
      }
    }
  }
  function flushPostFlushCbs(seen) {
    if (pendingPostFlushCbs.length) {
      const deduped = [...new Set(pendingPostFlushCbs)].sort(
        (a, b) => getId(a) - getId(b)
      );
      pendingPostFlushCbs.length = 0;
      if (activePostFlushCbs) {
        activePostFlushCbs.push(...deduped);
        return;
      }
      activePostFlushCbs = deduped;
      {
        seen = seen || /* @__PURE__ */ new Map();
      }
      for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
        const cb = activePostFlushCbs[postFlushIndex];
        if (checkRecursiveUpdates(seen, cb)) {
          continue;
        }
        if (cb.flags & 4) {
          cb.flags &= ~1;
        }
        if (!(cb.flags & 8)) cb();
        cb.flags &= ~1;
      }
      activePostFlushCbs = null;
      postFlushIndex = 0;
    }
  }
  const getId = (job) => job.id == null ? job.flags & 2 ? -1 : Infinity : job.id;
  function flushJobs(seen) {
    {
      seen = seen || /* @__PURE__ */ new Map();
    }
    const check = (job) => checkRecursiveUpdates(seen, job);
    try {
      for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
        const job = queue[flushIndex];
        if (job && !(job.flags & 8)) {
          if (check(job)) {
            continue;
          }
          if (job.flags & 4) {
            job.flags &= ~1;
          }
          callWithErrorHandling(
            job,
            job.i,
            job.i ? 15 : 14
          );
          if (!(job.flags & 4)) {
            job.flags &= ~1;
          }
        }
      }
    } finally {
      for (; flushIndex < queue.length; flushIndex++) {
        const job = queue[flushIndex];
        if (job) {
          job.flags &= ~1;
        }
      }
      flushIndex = -1;
      queue.length = 0;
      flushPostFlushCbs(seen);
      currentFlushPromise = null;
      if (queue.length || pendingPostFlushCbs.length) {
        flushJobs(seen);
      }
    }
  }
  function checkRecursiveUpdates(seen, fn) {
    const count = seen.get(fn) || 0;
    if (count > RECURSION_LIMIT) {
      const instance = fn.i;
      const componentName = instance && getComponentName(instance.type);
      handleError(
        `Maximum recursive updates exceeded${componentName ? ` in component <${componentName}>` : ``}. This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. Possible sources include component template, render function, updated hook or watcher source function.`,
        null,
        10
      );
      return true;
    }
    seen.set(fn, count + 1);
    return false;
  }
  let isHmrUpdating = false;
  const hmrDirtyComponents = /* @__PURE__ */ new Map();
  {
    getGlobalThis().__VUE_HMR_RUNTIME__ = {
      createRecord: tryWrap(createRecord),
      rerender: tryWrap(rerender),
      reload: tryWrap(reload)
    };
  }
  const map = /* @__PURE__ */ new Map();
  function registerHMR(instance) {
    const id = instance.type.__hmrId;
    let record = map.get(id);
    if (!record) {
      createRecord(id, instance.type);
      record = map.get(id);
    }
    record.instances.add(instance);
  }
  function unregisterHMR(instance) {
    map.get(instance.type.__hmrId).instances.delete(instance);
  }
  function createRecord(id, initialDef) {
    if (map.has(id)) {
      return false;
    }
    map.set(id, {
      initialDef: normalizeClassComponent(initialDef),
      instances: /* @__PURE__ */ new Set()
    });
    return true;
  }
  function normalizeClassComponent(component) {
    return isClassComponent(component) ? component.__vccOpts : component;
  }
  function rerender(id, newRender) {
    const record = map.get(id);
    if (!record) {
      return;
    }
    record.initialDef.render = newRender;
    [...record.instances].forEach((instance) => {
      if (newRender) {
        instance.render = newRender;
        normalizeClassComponent(instance.type).render = newRender;
      }
      instance.renderCache = [];
      isHmrUpdating = true;
      instance.update();
      isHmrUpdating = false;
    });
  }
  function reload(id, newComp) {
    const record = map.get(id);
    if (!record) return;
    newComp = normalizeClassComponent(newComp);
    updateComponentDef(record.initialDef, newComp);
    const instances = [...record.instances];
    for (let i = 0; i < instances.length; i++) {
      const instance = instances[i];
      const oldComp = normalizeClassComponent(instance.type);
      let dirtyInstances = hmrDirtyComponents.get(oldComp);
      if (!dirtyInstances) {
        if (oldComp !== record.initialDef) {
          updateComponentDef(oldComp, newComp);
        }
        hmrDirtyComponents.set(oldComp, dirtyInstances = /* @__PURE__ */ new Set());
      }
      dirtyInstances.add(instance);
      instance.appContext.propsCache.delete(instance.type);
      instance.appContext.emitsCache.delete(instance.type);
      instance.appContext.optionsCache.delete(instance.type);
      if (instance.ceReload) {
        dirtyInstances.add(instance);
        instance.ceReload(newComp.styles);
        dirtyInstances.delete(instance);
      } else if (instance.parent) {
        queueJob(() => {
          isHmrUpdating = true;
          instance.parent.update();
          isHmrUpdating = false;
          dirtyInstances.delete(instance);
        });
      } else if (instance.appContext.reload) {
        instance.appContext.reload();
      } else if (typeof window !== "undefined") {
        window.location.reload();
      } else {
        console.warn(
          "[HMR] Root or manually mounted instance modified. Full reload required."
        );
      }
      if (instance.root.ce && instance !== instance.root) {
        instance.root.ce._removeChildStyle(oldComp);
      }
    }
    queuePostFlushCb(() => {
      hmrDirtyComponents.clear();
    });
  }
  function updateComponentDef(oldComp, newComp) {
    extend(oldComp, newComp);
    for (const key in oldComp) {
      if (key !== "__file" && !(key in newComp)) {
        delete oldComp[key];
      }
    }
  }
  function tryWrap(fn) {
    return (id, arg) => {
      try {
        return fn(id, arg);
      } catch (e) {
        console.error(e);
        console.warn(
          `[HMR] Something went wrong during Vue component hot-reload. Full reload required.`
        );
      }
    };
  }
  let devtools$1;
  let buffer = [];
  let devtoolsNotInstalled = false;
  function emit$1(event, ...args) {
    if (devtools$1) {
      devtools$1.emit(event, ...args);
    } else if (!devtoolsNotInstalled) {
      buffer.push({ event, args });
    }
  }
  function setDevtoolsHook$1(hook, target) {
    var _a2, _b2;
    devtools$1 = hook;
    if (devtools$1) {
      devtools$1.enabled = true;
      buffer.forEach(({ event, args }) => devtools$1.emit(event, ...args));
      buffer = [];
    } else if (
      // handle late devtools injection - only do this if we are in an actual
      // browser environment to avoid the timer handle stalling test runner exit
      // (#4815)
      typeof window !== "undefined" && // some envs mock window but not fully
      window.HTMLElement && // also exclude jsdom
      // eslint-disable-next-line no-restricted-syntax
      !((_b2 = (_a2 = window.navigator) == null ? void 0 : _a2.userAgent) == null ? void 0 : _b2.includes("jsdom"))
    ) {
      const replay = target.__VUE_DEVTOOLS_HOOK_REPLAY__ = target.__VUE_DEVTOOLS_HOOK_REPLAY__ || [];
      replay.push((newHook) => {
        setDevtoolsHook$1(newHook, target);
      });
      setTimeout(() => {
        if (!devtools$1) {
          target.__VUE_DEVTOOLS_HOOK_REPLAY__ = null;
          devtoolsNotInstalled = true;
          buffer = [];
        }
      }, 3e3);
    } else {
      devtoolsNotInstalled = true;
      buffer = [];
    }
  }
  function devtoolsInitApp(app, version2) {
    emit$1("app:init", app, version2, {
      Fragment,
      Text,
      Comment,
      Static
    });
  }
  function devtoolsUnmountApp(app) {
    emit$1("app:unmount", app);
  }
  const devtoolsComponentAdded = /* @__PURE__ */ createDevtoolsComponentHook(
    "component:added"
    /* COMPONENT_ADDED */
  );
  const devtoolsComponentUpdated = /* @__PURE__ */ createDevtoolsComponentHook(
    "component:updated"
    /* COMPONENT_UPDATED */
  );
  const _devtoolsComponentRemoved = /* @__PURE__ */ createDevtoolsComponentHook(
    "component:removed"
    /* COMPONENT_REMOVED */
  );
  const devtoolsComponentRemoved = (component) => {
    if (devtools$1 && typeof devtools$1.cleanupBuffer === "function" && // remove the component if it wasn't buffered
    !devtools$1.cleanupBuffer(component)) {
      _devtoolsComponentRemoved(component);
    }
  };
  /*! #__NO_SIDE_EFFECTS__ */
  // @__NO_SIDE_EFFECTS__
  function createDevtoolsComponentHook(hook) {
    return (component) => {
      emit$1(
        hook,
        component.appContext.app,
        component.uid,
        component.parent ? component.parent.uid : void 0,
        component
      );
    };
  }
  const devtoolsPerfStart = /* @__PURE__ */ createDevtoolsPerformanceHook(
    "perf:start"
    /* PERFORMANCE_START */
  );
  const devtoolsPerfEnd = /* @__PURE__ */ createDevtoolsPerformanceHook(
    "perf:end"
    /* PERFORMANCE_END */
  );
  function createDevtoolsPerformanceHook(hook) {
    return (component, type2, time) => {
      emit$1(hook, component.appContext.app, component.uid, component, type2, time);
    };
  }
  function devtoolsComponentEmit(component, event, params) {
    emit$1(
      "component:emit",
      component.appContext.app,
      component,
      event,
      params
    );
  }
  let currentRenderingInstance = null;
  let currentScopeId = null;
  function setCurrentRenderingInstance(instance) {
    const prev = currentRenderingInstance;
    currentRenderingInstance = instance;
    currentScopeId = instance && instance.type.__scopeId || null;
    return prev;
  }
  function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
    if (!ctx) return fn;
    if (fn._n) {
      return fn;
    }
    const renderFnWithContext = (...args) => {
      if (renderFnWithContext._d) {
        setBlockTracking(-1);
      }
      const prevInstance = setCurrentRenderingInstance(ctx);
      let res;
      try {
        res = fn(...args);
      } finally {
        setCurrentRenderingInstance(prevInstance);
        if (renderFnWithContext._d) {
          setBlockTracking(1);
        }
      }
      {
        devtoolsComponentUpdated(ctx);
      }
      return res;
    };
    renderFnWithContext._n = true;
    renderFnWithContext._c = true;
    renderFnWithContext._d = true;
    return renderFnWithContext;
  }
  function validateDirectiveName(name2) {
    if (isBuiltInDirective(name2)) {
      warn$1("Do not use built-in directive ids as custom directive id: " + name2);
    }
  }
  function withDirectives(vnode, directives) {
    if (currentRenderingInstance === null) {
      warn$1(`withDirectives can only be used inside render functions.`);
      return vnode;
    }
    const instance = getComponentPublicInstance(currentRenderingInstance);
    const bindings = vnode.dirs || (vnode.dirs = []);
    for (let i = 0; i < directives.length; i++) {
      let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
      if (dir) {
        if (isFunction(dir)) {
          dir = {
            mounted: dir,
            updated: dir
          };
        }
        if (dir.deep) {
          traverse(value);
        }
        bindings.push({
          dir,
          instance,
          value,
          oldValue: void 0,
          arg,
          modifiers
        });
      }
    }
    return vnode;
  }
  function invokeDirectiveHook(vnode, prevVNode, instance, name2) {
    const bindings = vnode.dirs;
    const oldBindings = prevVNode && prevVNode.dirs;
    for (let i = 0; i < bindings.length; i++) {
      const binding = bindings[i];
      if (oldBindings) {
        binding.oldValue = oldBindings[i].value;
      }
      let hook = binding.dir[name2];
      if (hook) {
        pauseTracking();
        callWithAsyncErrorHandling(hook, instance, 8, [
          vnode.el,
          binding,
          vnode,
          prevVNode
        ]);
        resetTracking();
      }
    }
  }
  const TeleportEndKey = Symbol("_vte");
  const isTeleport = (type2) => type2.__isTeleport;
  function setTransitionHooks(vnode, hooks) {
    if (vnode.shapeFlag & 6 && vnode.component) {
      vnode.transition = hooks;
      setTransitionHooks(vnode.component.subTree, hooks);
    } else if (vnode.shapeFlag & 128) {
      vnode.ssContent.transition = hooks.clone(vnode.ssContent);
      vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
    } else {
      vnode.transition = hooks;
    }
  }
  function markAsyncBoundary(instance) {
    instance.ids = [instance.ids[0] + instance.ids[2]++ + "-", 0, 0];
  }
  const knownTemplateRefs = /* @__PURE__ */ new WeakSet();
  function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
    if (isArray(rawRef)) {
      rawRef.forEach(
        (r, i) => setRef(
          r,
          oldRawRef && (isArray(oldRawRef) ? oldRawRef[i] : oldRawRef),
          parentSuspense,
          vnode,
          isUnmount
        )
      );
      return;
    }
    if (isAsyncWrapper(vnode) && !isUnmount) {
      if (vnode.shapeFlag & 512 && vnode.type.__asyncResolved && vnode.component.subTree.component) {
        setRef(rawRef, oldRawRef, parentSuspense, vnode.component.subTree);
      }
      return;
    }
    const refValue = vnode.shapeFlag & 4 ? getComponentPublicInstance(vnode.component) : vnode.el;
    const value = isUnmount ? null : refValue;
    const { i: owner, r: ref3 } = rawRef;
    if (!owner) {
      warn$1(
        `Missing ref owner context. ref cannot be used on hoisted vnodes. A vnode with ref must be created inside the render function.`
      );
      return;
    }
    const oldRef = oldRawRef && oldRawRef.r;
    const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
    const setupState = owner.setupState;
    const rawSetupState = toRaw(setupState);
    const canSetSetupRef = setupState === EMPTY_OBJ ? () => false : (key) => {
      {
        if (hasOwn(rawSetupState, key) && !isRef(rawSetupState[key])) {
          warn$1(
            `Template ref "${key}" used on a non-ref value. It will not work in the production build.`
          );
        }
        if (knownTemplateRefs.has(rawSetupState[key])) {
          return false;
        }
      }
      return hasOwn(rawSetupState, key);
    };
    if (oldRef != null && oldRef !== ref3) {
      if (isString(oldRef)) {
        refs[oldRef] = null;
        if (canSetSetupRef(oldRef)) {
          setupState[oldRef] = null;
        }
      } else if (isRef(oldRef)) {
        oldRef.value = null;
      }
    }
    if (isFunction(ref3)) {
      callWithErrorHandling(ref3, owner, 12, [value, refs]);
    } else {
      const _isString = isString(ref3);
      const _isRef = isRef(ref3);
      if (_isString || _isRef) {
        const doSet = () => {
          if (rawRef.f) {
            const existing = _isString ? canSetSetupRef(ref3) ? setupState[ref3] : refs[ref3] : ref3.value;
            if (isUnmount) {
              isArray(existing) && remove(existing, refValue);
            } else {
              if (!isArray(existing)) {
                if (_isString) {
                  refs[ref3] = [refValue];
                  if (canSetSetupRef(ref3)) {
                    setupState[ref3] = refs[ref3];
                  }
                } else {
                  ref3.value = [refValue];
                  if (rawRef.k) refs[rawRef.k] = ref3.value;
                }
              } else if (!existing.includes(refValue)) {
                existing.push(refValue);
              }
            }
          } else if (_isString) {
            refs[ref3] = value;
            if (canSetSetupRef(ref3)) {
              setupState[ref3] = value;
            }
          } else if (_isRef) {
            ref3.value = value;
            if (rawRef.k) refs[rawRef.k] = value;
          } else {
            warn$1("Invalid template ref type:", ref3, `(${typeof ref3})`);
          }
        };
        if (value) {
          doSet.id = -1;
          queuePostRenderEffect(doSet, parentSuspense);
        } else {
          doSet();
        }
      } else {
        warn$1("Invalid template ref type:", ref3, `(${typeof ref3})`);
      }
    }
  }
  getGlobalThis().requestIdleCallback || ((cb) => setTimeout(cb, 1));
  getGlobalThis().cancelIdleCallback || ((id) => clearTimeout(id));
  const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
  const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
  function onActivated(hook, target) {
    registerKeepAliveHook(hook, "a", target);
  }
  function onDeactivated(hook, target) {
    registerKeepAliveHook(hook, "da", target);
  }
  function registerKeepAliveHook(hook, type2, target = currentInstance) {
    const wrappedHook = hook.__wdc || (hook.__wdc = () => {
      let current = target;
      while (current) {
        if (current.isDeactivated) {
          return;
        }
        current = current.parent;
      }
      return hook();
    });
    injectHook(type2, wrappedHook, target);
    if (target) {
      let current = target.parent;
      while (current && current.parent) {
        if (isKeepAlive(current.parent.vnode)) {
          injectToKeepAliveRoot(wrappedHook, type2, target, current);
        }
        current = current.parent;
      }
    }
  }
  function injectToKeepAliveRoot(hook, type2, target, keepAliveRoot) {
    const injected = injectHook(
      type2,
      hook,
      keepAliveRoot,
      true
      /* prepend */
    );
    onUnmounted(() => {
      remove(keepAliveRoot[type2], injected);
    }, target);
  }
  function injectHook(type2, hook, target = currentInstance, prepend = false) {
    if (target) {
      const hooks = target[type2] || (target[type2] = []);
      const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
        pauseTracking();
        const reset = setCurrentInstance(target);
        const res = callWithAsyncErrorHandling(hook, target, type2, args);
        reset();
        resetTracking();
        return res;
      });
      if (prepend) {
        hooks.unshift(wrappedHook);
      } else {
        hooks.push(wrappedHook);
      }
      return wrappedHook;
    } else {
      const apiName = toHandlerKey(ErrorTypeStrings$1[type2].replace(/ hook$/, ""));
      warn$1(
        `${apiName} is called when there is no active component instance to be associated with. Lifecycle injection APIs can only be used during execution of setup(). If you are using async setup(), make sure to register lifecycle hooks before the first await statement.`
      );
    }
  }
  const createHook = (lifecycle) => (hook, target = currentInstance) => {
    if (!isInSSRComponentSetup || lifecycle === "sp") {
      injectHook(lifecycle, (...args) => hook(...args), target);
    }
  };
  const onBeforeMount = createHook("bm");
  const onMounted = createHook("m");
  const onBeforeUpdate = createHook(
    "bu"
  );
  const onUpdated = createHook("u");
  const onBeforeUnmount = createHook(
    "bum"
  );
  const onUnmounted = createHook("um");
  const onServerPrefetch = createHook(
    "sp"
  );
  const onRenderTriggered = createHook("rtg");
  const onRenderTracked = createHook("rtc");
  function onErrorCaptured(hook, target = currentInstance) {
    injectHook("ec", hook, target);
  }
  const COMPONENTS = "components";
  function resolveComponent(name2, maybeSelfReference) {
    return resolveAsset(COMPONENTS, name2, true, maybeSelfReference) || name2;
  }
  const NULL_DYNAMIC_COMPONENT = Symbol.for("v-ndc");
  function resolveAsset(type2, name2, warnMissing = true, maybeSelfReference = false) {
    const instance = currentRenderingInstance || currentInstance;
    if (instance) {
      const Component = instance.type;
      {
        const selfName = getComponentName(
          Component,
          false
        );
        if (selfName && (selfName === name2 || selfName === camelize(name2) || selfName === capitalize(camelize(name2)))) {
          return Component;
        }
      }
      const res = (
        // local registration
        // check instance[type] first which is resolved for options API
        resolve(instance[type2] || Component[type2], name2) || // global registration
        resolve(instance.appContext[type2], name2)
      );
      if (!res && maybeSelfReference) {
        return Component;
      }
      if (warnMissing && !res) {
        const extra = `
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.`;
        warn$1(`Failed to resolve ${type2.slice(0, -1)}: ${name2}${extra}`);
      }
      return res;
    } else {
      warn$1(
        `resolve${capitalize(type2.slice(0, -1))} can only be used in render() or setup().`
      );
    }
  }
  function resolve(registry, name2) {
    return registry && (registry[name2] || registry[camelize(name2)] || registry[capitalize(camelize(name2))]);
  }
  function renderList(source, renderItem, cache, index) {
    let ret;
    const cached = cache;
    const sourceIsArray = isArray(source);
    if (sourceIsArray || isString(source)) {
      const sourceIsReactiveArray = sourceIsArray && isReactive(source);
      let needsWrap = false;
      if (sourceIsReactiveArray) {
        needsWrap = !isShallow(source);
        source = shallowReadArray(source);
      }
      ret = new Array(source.length);
      for (let i = 0, l = source.length; i < l; i++) {
        ret[i] = renderItem(
          needsWrap ? toReactive(source[i]) : source[i],
          i,
          void 0,
          cached
        );
      }
    } else if (typeof source === "number") {
      if (!Number.isInteger(source)) {
        warn$1(`The v-for range expect an integer value but got ${source}.`);
      }
      ret = new Array(source);
      for (let i = 0; i < source; i++) {
        ret[i] = renderItem(i + 1, i, void 0, cached);
      }
    } else if (isObject(source)) {
      if (source[Symbol.iterator]) {
        ret = Array.from(
          source,
          (item, i) => renderItem(item, i, void 0, cached)
        );
      } else {
        const keys = Object.keys(source);
        ret = new Array(keys.length);
        for (let i = 0, l = keys.length; i < l; i++) {
          const key = keys[i];
          ret[i] = renderItem(source[key], key, i, cached);
        }
      }
    } else {
      ret = [];
    }
    return ret;
  }
  const getPublicInstance = (i) => {
    if (!i) return null;
    if (isStatefulComponent(i)) return getComponentPublicInstance(i);
    return getPublicInstance(i.parent);
  };
  const publicPropertiesMap = (
    // Move PURE marker to new line to workaround compiler discarding it
    // due to type annotation
    /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
      $: (i) => i,
      $el: (i) => i.vnode.el,
      $data: (i) => i.data,
      $props: (i) => shallowReadonly(i.props),
      $attrs: (i) => shallowReadonly(i.attrs),
      $slots: (i) => shallowReadonly(i.slots),
      $refs: (i) => shallowReadonly(i.refs),
      $parent: (i) => getPublicInstance(i.parent),
      $root: (i) => getPublicInstance(i.root),
      $host: (i) => i.ce,
      $emit: (i) => i.emit,
      $options: (i) => resolveMergedOptions(i),
      $forceUpdate: (i) => i.f || (i.f = () => {
        queueJob(i.update);
      }),
      $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
      $watch: (i) => instanceWatch.bind(i)
    })
  );
  const isReservedPrefix = (key) => key === "_" || key === "$";
  const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
  const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
      if (key === "__v_skip") {
        return true;
      }
      const { ctx, setupState, data, props, accessCache, type: type2, appContext } = instance;
      if (key === "__isVue") {
        return true;
      }
      let normalizedProps;
      if (key[0] !== "$") {
        const n = accessCache[key];
        if (n !== void 0) {
          switch (n) {
            case 1:
              return setupState[key];
            case 2:
              return data[key];
            case 4:
              return ctx[key];
            case 3:
              return props[key];
          }
        } else if (hasSetupBinding(setupState, key)) {
          accessCache[key] = 1;
          return setupState[key];
        } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
          accessCache[key] = 2;
          return data[key];
        } else if (
          // only cache other properties when instance has declared (thus stable)
          // props
          (normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)
        ) {
          accessCache[key] = 3;
          return props[key];
        } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
          accessCache[key] = 4;
          return ctx[key];
        } else if (shouldCacheAccess) {
          accessCache[key] = 0;
        }
      }
      const publicGetter = publicPropertiesMap[key];
      let cssModule, globalProperties;
      if (publicGetter) {
        if (key === "$attrs") {
          track(instance.attrs, "get", "");
          markAttrsAccessed();
        } else if (key === "$slots") {
          track(instance, "get", key);
        }
        return publicGetter(instance);
      } else if (
        // css module (injected by vue-loader)
        (cssModule = type2.__cssModules) && (cssModule = cssModule[key])
      ) {
        return cssModule;
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (
        // global properties
        globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
      ) {
        {
          return globalProperties[key];
        }
      } else if (currentRenderingInstance && (!isString(key) || // #1091 avoid internal isRef/isVNode checks on component instance leading
      // to infinite warning loop
      key.indexOf("__v") !== 0)) {
        if (data !== EMPTY_OBJ && isReservedPrefix(key[0]) && hasOwn(data, key)) {
          warn$1(
            `Property ${JSON.stringify(
              key
            )} must be accessed via $data because it starts with a reserved character ("$" or "_") and is not proxied on the render context.`
          );
        } else if (instance === currentRenderingInstance) {
          warn$1(
            `Property ${JSON.stringify(key)} was accessed during render but is not defined on instance.`
          );
        }
      }
    },
    set({ _: instance }, key, value) {
      const { data, setupState, ctx } = instance;
      if (hasSetupBinding(setupState, key)) {
        setupState[key] = value;
        return true;
      } else if (setupState.__isScriptSetup && hasOwn(setupState, key)) {
        warn$1(`Cannot mutate <script setup> binding "${key}" from Options API.`);
        return false;
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        data[key] = value;
        return true;
      } else if (hasOwn(instance.props, key)) {
        warn$1(`Attempting to mutate prop "${key}". Props are readonly.`);
        return false;
      }
      if (key[0] === "$" && key.slice(1) in instance) {
        warn$1(
          `Attempting to mutate public property "${key}". Properties starting with $ are reserved and readonly.`
        );
        return false;
      } else {
        if (key in instance.appContext.config.globalProperties) {
          Object.defineProperty(ctx, key, {
            enumerable: true,
            configurable: true,
            value
          });
        } else {
          ctx[key] = value;
        }
      }
      return true;
    },
    has({
      _: { data, setupState, accessCache, ctx, appContext, propsOptions }
    }, key) {
      let normalizedProps;
      return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
    },
    defineProperty(target, key, descriptor) {
      if (descriptor.get != null) {
        target._.accessCache[key] = 0;
      } else if (hasOwn(descriptor, "value")) {
        this.set(target, key, descriptor.value, null);
      }
      return Reflect.defineProperty(target, key, descriptor);
    }
  };
  {
    PublicInstanceProxyHandlers.ownKeys = (target) => {
      warn$1(
        `Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead.`
      );
      return Reflect.ownKeys(target);
    };
  }
  function createDevRenderContext(instance) {
    const target = {};
    Object.defineProperty(target, `_`, {
      configurable: true,
      enumerable: false,
      get: () => instance
    });
    Object.keys(publicPropertiesMap).forEach((key) => {
      Object.defineProperty(target, key, {
        configurable: true,
        enumerable: false,
        get: () => publicPropertiesMap[key](instance),
        // intercepted by the proxy so no need for implementation,
        // but needed to prevent set errors
        set: NOOP
      });
    });
    return target;
  }
  function exposePropsOnRenderContext(instance) {
    const {
      ctx,
      propsOptions: [propsOptions]
    } = instance;
    if (propsOptions) {
      Object.keys(propsOptions).forEach((key) => {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => instance.props[key],
          set: NOOP
        });
      });
    }
  }
  function exposeSetupStateOnRenderContext(instance) {
    const { ctx, setupState } = instance;
    Object.keys(toRaw(setupState)).forEach((key) => {
      if (!setupState.__isScriptSetup) {
        if (isReservedPrefix(key[0])) {
          warn$1(
            `setup() return property ${JSON.stringify(
              key
            )} should not start with "$" or "_" which are reserved prefixes for Vue internals.`
          );
          return;
        }
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => setupState[key],
          set: NOOP
        });
      }
    });
  }
  function normalizePropsOrEmits(props) {
    return isArray(props) ? props.reduce(
      (normalized, p2) => (normalized[p2] = null, normalized),
      {}
    ) : props;
  }
  function createDuplicateChecker() {
    const cache = /* @__PURE__ */ Object.create(null);
    return (type2, key) => {
      if (cache[key]) {
        warn$1(`${type2} property "${key}" is already defined in ${cache[key]}.`);
      } else {
        cache[key] = type2;
      }
    };
  }
  let shouldCacheAccess = true;
  function applyOptions(instance) {
    const options = resolveMergedOptions(instance);
    const publicThis = instance.proxy;
    const ctx = instance.ctx;
    shouldCacheAccess = false;
    if (options.beforeCreate) {
      callHook(options.beforeCreate, instance, "bc");
    }
    const {
      // state
      data: dataOptions,
      computed: computedOptions,
      methods,
      watch: watchOptions,
      provide: provideOptions,
      inject: injectOptions,
      // lifecycle
      created,
      beforeMount,
      mounted,
      beforeUpdate,
      updated,
      activated,
      deactivated,
      beforeDestroy,
      beforeUnmount,
      destroyed,
      unmounted,
      render,
      renderTracked,
      renderTriggered,
      errorCaptured,
      serverPrefetch,
      // public API
      expose,
      inheritAttrs,
      // assets
      components,
      directives,
      filters
    } = options;
    const checkDuplicateProperties = createDuplicateChecker();
    {
      const [propsOptions] = instance.propsOptions;
      if (propsOptions) {
        for (const key in propsOptions) {
          checkDuplicateProperties("Props", key);
        }
      }
    }
    if (injectOptions) {
      resolveInjections(injectOptions, ctx, checkDuplicateProperties);
    }
    if (methods) {
      for (const key in methods) {
        const methodHandler = methods[key];
        if (isFunction(methodHandler)) {
          {
            Object.defineProperty(ctx, key, {
              value: methodHandler.bind(publicThis),
              configurable: true,
              enumerable: true,
              writable: true
            });
          }
          {
            checkDuplicateProperties("Methods", key);
          }
        } else {
          warn$1(
            `Method "${key}" has type "${typeof methodHandler}" in the component definition. Did you reference the function correctly?`
          );
        }
      }
    }
    if (dataOptions) {
      if (!isFunction(dataOptions)) {
        warn$1(
          `The data option must be a function. Plain object usage is no longer supported.`
        );
      }
      const data = dataOptions.call(publicThis, publicThis);
      if (isPromise(data)) {
        warn$1(
          `data() returned a Promise - note data() cannot be async; If you intend to perform data fetching before component renders, use async setup() + <Suspense>.`
        );
      }
      if (!isObject(data)) {
        warn$1(`data() should return an object.`);
      } else {
        instance.data = reactive(data);
        {
          for (const key in data) {
            checkDuplicateProperties("Data", key);
            if (!isReservedPrefix(key[0])) {
              Object.defineProperty(ctx, key, {
                configurable: true,
                enumerable: true,
                get: () => data[key],
                set: NOOP
              });
            }
          }
        }
      }
    }
    shouldCacheAccess = true;
    if (computedOptions) {
      for (const key in computedOptions) {
        const opt = computedOptions[key];
        const get = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
        if (get === NOOP) {
          warn$1(`Computed property "${key}" has no getter.`);
        }
        const set = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : () => {
          warn$1(
            `Write operation failed: computed property "${key}" is readonly.`
          );
        };
        const c = computed({
          get,
          set
        });
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => c.value,
          set: (v) => c.value = v
        });
        {
          checkDuplicateProperties("Computed", key);
        }
      }
    }
    if (watchOptions) {
      for (const key in watchOptions) {
        createWatcher(watchOptions[key], ctx, publicThis, key);
      }
    }
    if (provideOptions) {
      const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
      Reflect.ownKeys(provides).forEach((key) => {
        provide(key, provides[key]);
      });
    }
    if (created) {
      callHook(created, instance, "c");
    }
    function registerLifecycleHook(register, hook) {
      if (isArray(hook)) {
        hook.forEach((_hook) => register(_hook.bind(publicThis)));
      } else if (hook) {
        register(hook.bind(publicThis));
      }
    }
    registerLifecycleHook(onBeforeMount, beforeMount);
    registerLifecycleHook(onMounted, mounted);
    registerLifecycleHook(onBeforeUpdate, beforeUpdate);
    registerLifecycleHook(onUpdated, updated);
    registerLifecycleHook(onActivated, activated);
    registerLifecycleHook(onDeactivated, deactivated);
    registerLifecycleHook(onErrorCaptured, errorCaptured);
    registerLifecycleHook(onRenderTracked, renderTracked);
    registerLifecycleHook(onRenderTriggered, renderTriggered);
    registerLifecycleHook(onBeforeUnmount, beforeUnmount);
    registerLifecycleHook(onUnmounted, unmounted);
    registerLifecycleHook(onServerPrefetch, serverPrefetch);
    if (isArray(expose)) {
      if (expose.length) {
        const exposed = instance.exposed || (instance.exposed = {});
        expose.forEach((key) => {
          Object.defineProperty(exposed, key, {
            get: () => publicThis[key],
            set: (val) => publicThis[key] = val
          });
        });
      } else if (!instance.exposed) {
        instance.exposed = {};
      }
    }
    if (render && instance.render === NOOP) {
      instance.render = render;
    }
    if (inheritAttrs != null) {
      instance.inheritAttrs = inheritAttrs;
    }
    if (components) instance.components = components;
    if (directives) instance.directives = directives;
    if (serverPrefetch) {
      markAsyncBoundary(instance);
    }
  }
  function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
    if (isArray(injectOptions)) {
      injectOptions = normalizeInject(injectOptions);
    }
    for (const key in injectOptions) {
      const opt = injectOptions[key];
      let injected;
      if (isObject(opt)) {
        if ("default" in opt) {
          injected = inject(
            opt.from || key,
            opt.default,
            true
          );
        } else {
          injected = inject(opt.from || key);
        }
      } else {
        injected = inject(opt);
      }
      if (isRef(injected)) {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => injected.value,
          set: (v) => injected.value = v
        });
      } else {
        ctx[key] = injected;
      }
      {
        checkDuplicateProperties("Inject", key);
      }
    }
  }
  function callHook(hook, instance, type2) {
    callWithAsyncErrorHandling(
      isArray(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
      instance,
      type2
    );
  }
  function createWatcher(raw, ctx, publicThis, key) {
    let getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
    if (isString(raw)) {
      const handler = ctx[raw];
      if (isFunction(handler)) {
        {
          watch(getter, handler);
        }
      } else {
        warn$1(`Invalid watch handler specified by key "${raw}"`, handler);
      }
    } else if (isFunction(raw)) {
      {
        watch(getter, raw.bind(publicThis));
      }
    } else if (isObject(raw)) {
      if (isArray(raw)) {
        raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
      } else {
        const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
        if (isFunction(handler)) {
          watch(getter, handler, raw);
        } else {
          warn$1(`Invalid watch handler specified by key "${raw.handler}"`, handler);
        }
      }
    } else {
      warn$1(`Invalid watch option: "${key}"`, raw);
    }
  }
  function resolveMergedOptions(instance) {
    const base = instance.type;
    const { mixins, extends: extendsOptions } = base;
    const {
      mixins: globalMixins,
      optionsCache: cache,
      config: { optionMergeStrategies }
    } = instance.appContext;
    const cached = cache.get(base);
    let resolved;
    if (cached) {
      resolved = cached;
    } else if (!globalMixins.length && !mixins && !extendsOptions) {
      {
        resolved = base;
      }
    } else {
      resolved = {};
      if (globalMixins.length) {
        globalMixins.forEach(
          (m) => mergeOptions(resolved, m, optionMergeStrategies, true)
        );
      }
      mergeOptions(resolved, base, optionMergeStrategies);
    }
    if (isObject(base)) {
      cache.set(base, resolved);
    }
    return resolved;
  }
  function mergeOptions(to, from, strats, asMixin = false) {
    const { mixins, extends: extendsOptions } = from;
    if (extendsOptions) {
      mergeOptions(to, extendsOptions, strats, true);
    }
    if (mixins) {
      mixins.forEach(
        (m) => mergeOptions(to, m, strats, true)
      );
    }
    for (const key in from) {
      if (asMixin && key === "expose") {
        warn$1(
          `"expose" option is ignored when declared in mixins or extends. It should only be declared in the base component itself.`
        );
      } else {
        const strat = internalOptionMergeStrats[key] || strats && strats[key];
        to[key] = strat ? strat(to[key], from[key]) : from[key];
      }
    }
    return to;
  }
  const internalOptionMergeStrats = {
    data: mergeDataFn,
    props: mergeEmitsOrPropsOptions,
    emits: mergeEmitsOrPropsOptions,
    // objects
    methods: mergeObjectOptions,
    computed: mergeObjectOptions,
    // lifecycle
    beforeCreate: mergeAsArray,
    created: mergeAsArray,
    beforeMount: mergeAsArray,
    mounted: mergeAsArray,
    beforeUpdate: mergeAsArray,
    updated: mergeAsArray,
    beforeDestroy: mergeAsArray,
    beforeUnmount: mergeAsArray,
    destroyed: mergeAsArray,
    unmounted: mergeAsArray,
    activated: mergeAsArray,
    deactivated: mergeAsArray,
    errorCaptured: mergeAsArray,
    serverPrefetch: mergeAsArray,
    // assets
    components: mergeObjectOptions,
    directives: mergeObjectOptions,
    // watch
    watch: mergeWatchOptions,
    // provide / inject
    provide: mergeDataFn,
    inject: mergeInject
  };
  function mergeDataFn(to, from) {
    if (!from) {
      return to;
    }
    if (!to) {
      return from;
    }
    return function mergedDataFn() {
      return extend(
        isFunction(to) ? to.call(this, this) : to,
        isFunction(from) ? from.call(this, this) : from
      );
    };
  }
  function mergeInject(to, from) {
    return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
  }
  function normalizeInject(raw) {
    if (isArray(raw)) {
      const res = {};
      for (let i = 0; i < raw.length; i++) {
        res[raw[i]] = raw[i];
      }
      return res;
    }
    return raw;
  }
  function mergeAsArray(to, from) {
    return to ? [...new Set([].concat(to, from))] : from;
  }
  function mergeObjectOptions(to, from) {
    return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
  }
  function mergeEmitsOrPropsOptions(to, from) {
    if (to) {
      if (isArray(to) && isArray(from)) {
        return [.../* @__PURE__ */ new Set([...to, ...from])];
      }
      return extend(
        /* @__PURE__ */ Object.create(null),
        normalizePropsOrEmits(to),
        normalizePropsOrEmits(from != null ? from : {})
      );
    } else {
      return from;
    }
  }
  function mergeWatchOptions(to, from) {
    if (!to) return from;
    if (!from) return to;
    const merged = extend(/* @__PURE__ */ Object.create(null), to);
    for (const key in from) {
      merged[key] = mergeAsArray(to[key], from[key]);
    }
    return merged;
  }
  function createAppContext() {
    return {
      app: null,
      config: {
        isNativeTag: NO,
        performance: false,
        globalProperties: {},
        optionMergeStrategies: {},
        errorHandler: void 0,
        warnHandler: void 0,
        compilerOptions: {}
      },
      mixins: [],
      components: {},
      directives: {},
      provides: /* @__PURE__ */ Object.create(null),
      optionsCache: /* @__PURE__ */ new WeakMap(),
      propsCache: /* @__PURE__ */ new WeakMap(),
      emitsCache: /* @__PURE__ */ new WeakMap()
    };
  }
  let uid$1 = 0;
  function createAppAPI(render, hydrate) {
    return function createApp2(rootComponent, rootProps = null) {
      if (!isFunction(rootComponent)) {
        rootComponent = extend({}, rootComponent);
      }
      if (rootProps != null && !isObject(rootProps)) {
        warn$1(`root props passed to app.mount() must be an object.`);
        rootProps = null;
      }
      const context = createAppContext();
      const installedPlugins = /* @__PURE__ */ new WeakSet();
      const pluginCleanupFns = [];
      let isMounted = false;
      const app = context.app = {
        _uid: uid$1++,
        _component: rootComponent,
        _props: rootProps,
        _container: null,
        _context: context,
        _instance: null,
        version: version$1,
        get config() {
          return context.config;
        },
        set config(v) {
          {
            warn$1(
              `app.config cannot be replaced. Modify individual options instead.`
            );
          }
        },
        use(plugin, ...options) {
          if (installedPlugins.has(plugin)) {
            warn$1(`Plugin has already been applied to target app.`);
          } else if (plugin && isFunction(plugin.install)) {
            installedPlugins.add(plugin);
            plugin.install(app, ...options);
          } else if (isFunction(plugin)) {
            installedPlugins.add(plugin);
            plugin(app, ...options);
          } else {
            warn$1(
              `A plugin must either be a function or an object with an "install" function.`
            );
          }
          return app;
        },
        mixin(mixin) {
          {
            if (!context.mixins.includes(mixin)) {
              context.mixins.push(mixin);
            } else {
              warn$1(
                "Mixin has already been applied to target app" + (mixin.name ? `: ${mixin.name}` : "")
              );
            }
          }
          return app;
        },
        component(name2, component) {
          {
            validateComponentName(name2, context.config);
          }
          if (!component) {
            return context.components[name2];
          }
          if (context.components[name2]) {
            warn$1(`Component "${name2}" has already been registered in target app.`);
          }
          context.components[name2] = component;
          return app;
        },
        directive(name2, directive) {
          {
            validateDirectiveName(name2);
          }
          if (!directive) {
            return context.directives[name2];
          }
          if (context.directives[name2]) {
            warn$1(`Directive "${name2}" has already been registered in target app.`);
          }
          context.directives[name2] = directive;
          return app;
        },
        mount(rootContainer, isHydrate, namespace) {
          if (!isMounted) {
            if (rootContainer.__vue_app__) {
              warn$1(
                `There is already an app instance mounted on the host container.
 If you want to mount another app on the same host container, you need to unmount the previous app by calling \`app.unmount()\` first.`
              );
            }
            const vnode = app._ceVNode || createVNode(rootComponent, rootProps);
            vnode.appContext = context;
            if (namespace === true) {
              namespace = "svg";
            } else if (namespace === false) {
              namespace = void 0;
            }
            {
              context.reload = () => {
                render(
                  cloneVNode(vnode),
                  rootContainer,
                  namespace
                );
              };
            }
            {
              render(vnode, rootContainer, namespace);
            }
            isMounted = true;
            app._container = rootContainer;
            rootContainer.__vue_app__ = app;
            {
              app._instance = vnode.component;
              devtoolsInitApp(app, version$1);
            }
            return getComponentPublicInstance(vnode.component);
          } else {
            warn$1(
              `App has already been mounted.
If you want to remount the same app, move your app creation logic into a factory function and create fresh app instances for each mount - e.g. \`const createMyApp = () => createApp(App)\``
            );
          }
        },
        onUnmount(cleanupFn) {
          if (typeof cleanupFn !== "function") {
            warn$1(
              `Expected function as first argument to app.onUnmount(), but got ${typeof cleanupFn}`
            );
          }
          pluginCleanupFns.push(cleanupFn);
        },
        unmount() {
          if (isMounted) {
            callWithAsyncErrorHandling(
              pluginCleanupFns,
              app._instance,
              16
            );
            render(null, app._container);
            {
              app._instance = null;
              devtoolsUnmountApp(app);
            }
            delete app._container.__vue_app__;
          } else {
            warn$1(`Cannot unmount an app that is not mounted.`);
          }
        },
        provide(key, value) {
          if (key in context.provides) {
            warn$1(
              `App already provides property with key "${String(key)}". It will be overwritten with the new value.`
            );
          }
          context.provides[key] = value;
          return app;
        },
        runWithContext(fn) {
          const lastApp = currentApp;
          currentApp = app;
          try {
            return fn();
          } finally {
            currentApp = lastApp;
          }
        }
      };
      return app;
    };
  }
  let currentApp = null;
  function provide(key, value) {
    if (!currentInstance) {
      {
        warn$1(`provide() can only be used inside setup().`);
      }
    } else {
      let provides = currentInstance.provides;
      const parentProvides = currentInstance.parent && currentInstance.parent.provides;
      if (parentProvides === provides) {
        provides = currentInstance.provides = Object.create(parentProvides);
      }
      provides[key] = value;
    }
  }
  function inject(key, defaultValue, treatDefaultAsFactory = false) {
    const instance = currentInstance || currentRenderingInstance;
    if (instance || currentApp) {
      const provides = currentApp ? currentApp._context.provides : instance ? instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : void 0;
      if (provides && key in provides) {
        return provides[key];
      } else if (arguments.length > 1) {
        return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
      } else {
        warn$1(`injection "${String(key)}" not found.`);
      }
    } else {
      warn$1(`inject() can only be used inside setup() or functional components.`);
    }
  }
  const internalObjectProto = {};
  const createInternalObject = () => Object.create(internalObjectProto);
  const isInternalObject = (obj) => Object.getPrototypeOf(obj) === internalObjectProto;
  function initProps(instance, rawProps, isStateful, isSSR = false) {
    const props = {};
    const attrs = createInternalObject();
    instance.propsDefaults = /* @__PURE__ */ Object.create(null);
    setFullProps(instance, rawProps, props, attrs);
    for (const key in instance.propsOptions[0]) {
      if (!(key in props)) {
        props[key] = void 0;
      }
    }
    {
      validateProps(rawProps || {}, props, instance);
    }
    if (isStateful) {
      instance.props = isSSR ? props : shallowReactive(props);
    } else {
      if (!instance.type.props) {
        instance.props = attrs;
      } else {
        instance.props = props;
      }
    }
    instance.attrs = attrs;
  }
  function isInHmrContext(instance) {
    while (instance) {
      if (instance.type.__hmrId) return true;
      instance = instance.parent;
    }
  }
  function updateProps(instance, rawProps, rawPrevProps, optimized) {
    const {
      props,
      attrs,
      vnode: { patchFlag }
    } = instance;
    const rawCurrentProps = toRaw(props);
    const [options] = instance.propsOptions;
    let hasAttrsChanged = false;
    if (
      // always force full diff in dev
      // - #1942 if hmr is enabled with sfc component
      // - vite#872 non-sfc component used by sfc component
      !isInHmrContext(instance) && (optimized || patchFlag > 0) && !(patchFlag & 16)
    ) {
      if (patchFlag & 8) {
        const propsToUpdate = instance.vnode.dynamicProps;
        for (let i = 0; i < propsToUpdate.length; i++) {
          let key = propsToUpdate[i];
          if (isEmitListener(instance.emitsOptions, key)) {
            continue;
          }
          const value = rawProps[key];
          if (options) {
            if (hasOwn(attrs, key)) {
              if (value !== attrs[key]) {
                attrs[key] = value;
                hasAttrsChanged = true;
              }
            } else {
              const camelizedKey = camelize(key);
              props[camelizedKey] = resolvePropValue(
                options,
                rawCurrentProps,
                camelizedKey,
                value,
                instance,
                false
              );
            }
          } else {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          }
        }
      }
    } else {
      if (setFullProps(instance, rawProps, props, attrs)) {
        hasAttrsChanged = true;
      }
      let kebabKey;
      for (const key in rawCurrentProps) {
        if (!rawProps || // for camelCase
        !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
        // and converted to camelCase (#955)
        ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
          if (options) {
            if (rawPrevProps && // for camelCase
            (rawPrevProps[key] !== void 0 || // for kebab-case
            rawPrevProps[kebabKey] !== void 0)) {
              props[key] = resolvePropValue(
                options,
                rawCurrentProps,
                key,
                void 0,
                instance,
                true
              );
            }
          } else {
            delete props[key];
          }
        }
      }
      if (attrs !== rawCurrentProps) {
        for (const key in attrs) {
          if (!rawProps || !hasOwn(rawProps, key) && true) {
            delete attrs[key];
            hasAttrsChanged = true;
          }
        }
      }
    }
    if (hasAttrsChanged) {
      trigger(instance.attrs, "set", "");
    }
    {
      validateProps(rawProps || {}, props, instance);
    }
  }
  function setFullProps(instance, rawProps, props, attrs) {
    const [options, needCastKeys] = instance.propsOptions;
    let hasAttrsChanged = false;
    let rawCastValues;
    if (rawProps) {
      for (let key in rawProps) {
        if (isReservedProp(key)) {
          continue;
        }
        const value = rawProps[key];
        let camelKey;
        if (options && hasOwn(options, camelKey = camelize(key))) {
          if (!needCastKeys || !needCastKeys.includes(camelKey)) {
            props[camelKey] = value;
          } else {
            (rawCastValues || (rawCastValues = {}))[camelKey] = value;
          }
        } else if (!isEmitListener(instance.emitsOptions, key)) {
          if (!(key in attrs) || value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
    if (needCastKeys) {
      const rawCurrentProps = toRaw(props);
      const castValues = rawCastValues || EMPTY_OBJ;
      for (let i = 0; i < needCastKeys.length; i++) {
        const key = needCastKeys[i];
        props[key] = resolvePropValue(
          options,
          rawCurrentProps,
          key,
          castValues[key],
          instance,
          !hasOwn(castValues, key)
        );
      }
    }
    return hasAttrsChanged;
  }
  function resolvePropValue(options, props, key, value, instance, isAbsent) {
    const opt = options[key];
    if (opt != null) {
      const hasDefault = hasOwn(opt, "default");
      if (hasDefault && value === void 0) {
        const defaultValue = opt.default;
        if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
          const { propsDefaults } = instance;
          if (key in propsDefaults) {
            value = propsDefaults[key];
          } else {
            const reset = setCurrentInstance(instance);
            value = propsDefaults[key] = defaultValue.call(
              null,
              props
            );
            reset();
          }
        } else {
          value = defaultValue;
        }
        if (instance.ce) {
          instance.ce._setProp(key, value);
        }
      }
      if (opt[
        0
        /* shouldCast */
      ]) {
        if (isAbsent && !hasDefault) {
          value = false;
        } else if (opt[
          1
          /* shouldCastTrue */
        ] && (value === "" || value === hyphenate(key))) {
          value = true;
        }
      }
    }
    return value;
  }
  const mixinPropsCache = /* @__PURE__ */ new WeakMap();
  function normalizePropsOptions(comp, appContext, asMixin = false) {
    const cache = asMixin ? mixinPropsCache : appContext.propsCache;
    const cached = cache.get(comp);
    if (cached) {
      return cached;
    }
    const raw = comp.props;
    const normalized = {};
    const needCastKeys = [];
    let hasExtends = false;
    if (!isFunction(comp)) {
      const extendProps = (raw2) => {
        hasExtends = true;
        const [props, keys] = normalizePropsOptions(raw2, appContext, true);
        extend(normalized, props);
        if (keys) needCastKeys.push(...keys);
      };
      if (!asMixin && appContext.mixins.length) {
        appContext.mixins.forEach(extendProps);
      }
      if (comp.extends) {
        extendProps(comp.extends);
      }
      if (comp.mixins) {
        comp.mixins.forEach(extendProps);
      }
    }
    if (!raw && !hasExtends) {
      if (isObject(comp)) {
        cache.set(comp, EMPTY_ARR);
      }
      return EMPTY_ARR;
    }
    if (isArray(raw)) {
      for (let i = 0; i < raw.length; i++) {
        if (!isString(raw[i])) {
          warn$1(`props must be strings when using array syntax.`, raw[i]);
        }
        const normalizedKey = camelize(raw[i]);
        if (validatePropName(normalizedKey)) {
          normalized[normalizedKey] = EMPTY_OBJ;
        }
      }
    } else if (raw) {
      if (!isObject(raw)) {
        warn$1(`invalid props options`, raw);
      }
      for (const key in raw) {
        const normalizedKey = camelize(key);
        if (validatePropName(normalizedKey)) {
          const opt = raw[key];
          const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : extend({}, opt);
          const propType = prop.type;
          let shouldCast = false;
          let shouldCastTrue = true;
          if (isArray(propType)) {
            for (let index = 0; index < propType.length; ++index) {
              const type2 = propType[index];
              const typeName = isFunction(type2) && type2.name;
              if (typeName === "Boolean") {
                shouldCast = true;
                break;
              } else if (typeName === "String") {
                shouldCastTrue = false;
              }
            }
          } else {
            shouldCast = isFunction(propType) && propType.name === "Boolean";
          }
          prop[
            0
            /* shouldCast */
          ] = shouldCast;
          prop[
            1
            /* shouldCastTrue */
          ] = shouldCastTrue;
          if (shouldCast || hasOwn(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
    const res = [normalized, needCastKeys];
    if (isObject(comp)) {
      cache.set(comp, res);
    }
    return res;
  }
  function validatePropName(key) {
    if (key[0] !== "$" && !isReservedProp(key)) {
      return true;
    } else {
      warn$1(`Invalid prop name: "${key}" is a reserved property.`);
    }
    return false;
  }
  function getType(ctor) {
    if (ctor === null) {
      return "null";
    }
    if (typeof ctor === "function") {
      return ctor.name || "";
    } else if (typeof ctor === "object") {
      const name2 = ctor.constructor && ctor.constructor.name;
      return name2 || "";
    }
    return "";
  }
  function validateProps(rawProps, props, instance) {
    const resolvedValues = toRaw(props);
    const options = instance.propsOptions[0];
    const camelizePropsKey = Object.keys(rawProps).map((key) => camelize(key));
    for (const key in options) {
      let opt = options[key];
      if (opt == null) continue;
      validateProp(
        key,
        resolvedValues[key],
        opt,
        shallowReadonly(resolvedValues),
        !camelizePropsKey.includes(key)
      );
    }
  }
  function validateProp(name2, value, prop, props, isAbsent) {
    const { type: type2, required, validator, skipCheck } = prop;
    if (required && isAbsent) {
      warn$1('Missing required prop: "' + name2 + '"');
      return;
    }
    if (value == null && !required) {
      return;
    }
    if (type2 != null && type2 !== true && !skipCheck) {
      let isValid = false;
      const types = isArray(type2) ? type2 : [type2];
      const expectedTypes = [];
      for (let i = 0; i < types.length && !isValid; i++) {
        const { valid, expectedType } = assertType(value, types[i]);
        expectedTypes.push(expectedType || "");
        isValid = valid;
      }
      if (!isValid) {
        warn$1(getInvalidTypeMessage(name2, value, expectedTypes));
        return;
      }
    }
    if (validator && !validator(value, props)) {
      warn$1('Invalid prop: custom validator check failed for prop "' + name2 + '".');
    }
  }
  const isSimpleType = /* @__PURE__ */ makeMap(
    "String,Number,Boolean,Function,Symbol,BigInt"
  );
  function assertType(value, type2) {
    let valid;
    const expectedType = getType(type2);
    if (expectedType === "null") {
      valid = value === null;
    } else if (isSimpleType(expectedType)) {
      const t = typeof value;
      valid = t === expectedType.toLowerCase();
      if (!valid && t === "object") {
        valid = value instanceof type2;
      }
    } else if (expectedType === "Object") {
      valid = isObject(value);
    } else if (expectedType === "Array") {
      valid = isArray(value);
    } else {
      valid = value instanceof type2;
    }
    return {
      valid,
      expectedType
    };
  }
  function getInvalidTypeMessage(name2, value, expectedTypes) {
    if (expectedTypes.length === 0) {
      return `Prop type [] for prop "${name2}" won't match anything. Did you mean to use type Array instead?`;
    }
    let message = `Invalid prop: type check failed for prop "${name2}". Expected ${expectedTypes.map(capitalize).join(" | ")}`;
    const expectedType = expectedTypes[0];
    const receivedType = toRawType(value);
    const expectedValue = styleValue(value, expectedType);
    const receivedValue = styleValue(value, receivedType);
    if (expectedTypes.length === 1 && isExplicable(expectedType) && !isBoolean(expectedType, receivedType)) {
      message += ` with value ${expectedValue}`;
    }
    message += `, got ${receivedType} `;
    if (isExplicable(receivedType)) {
      message += `with value ${receivedValue}.`;
    }
    return message;
  }
  function styleValue(value, type2) {
    if (type2 === "String") {
      return `"${value}"`;
    } else if (type2 === "Number") {
      return `${Number(value)}`;
    } else {
      return `${value}`;
    }
  }
  function isExplicable(type2) {
    const explicitTypes = ["string", "number", "boolean"];
    return explicitTypes.some((elem) => type2.toLowerCase() === elem);
  }
  function isBoolean(...args) {
    return args.some((elem) => elem.toLowerCase() === "boolean");
  }
  const isInternalKey = (key) => key[0] === "_" || key === "$stable";
  const normalizeSlotValue = (value) => isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
  const normalizeSlot = (key, rawSlot, ctx) => {
    if (rawSlot._n) {
      return rawSlot;
    }
    const normalized = withCtx((...args) => {
      if (currentInstance && (!ctx || ctx.root === currentInstance.root)) {
        warn$1(
          `Slot "${key}" invoked outside of the render function: this will not track dependencies used in the slot. Invoke the slot function inside the render function instead.`
        );
      }
      return normalizeSlotValue(rawSlot(...args));
    }, ctx);
    normalized._c = false;
    return normalized;
  };
  const normalizeObjectSlots = (rawSlots, slots, instance) => {
    const ctx = rawSlots._ctx;
    for (const key in rawSlots) {
      if (isInternalKey(key)) continue;
      const value = rawSlots[key];
      if (isFunction(value)) {
        slots[key] = normalizeSlot(key, value, ctx);
      } else if (value != null) {
        {
          warn$1(
            `Non-function value encountered for slot "${key}". Prefer function slots for better performance.`
          );
        }
        const normalized = normalizeSlotValue(value);
        slots[key] = () => normalized;
      }
    }
  };
  const normalizeVNodeSlots = (instance, children) => {
    if (!isKeepAlive(instance.vnode) && true) {
      warn$1(
        `Non-function value encountered for default slot. Prefer function slots for better performance.`
      );
    }
    const normalized = normalizeSlotValue(children);
    instance.slots.default = () => normalized;
  };
  const assignSlots = (slots, children, optimized) => {
    for (const key in children) {
      if (optimized || key !== "_") {
        slots[key] = children[key];
      }
    }
  };
  const initSlots = (instance, children, optimized) => {
    const slots = instance.slots = createInternalObject();
    if (instance.vnode.shapeFlag & 32) {
      const type2 = children._;
      if (type2) {
        assignSlots(slots, children, optimized);
        if (optimized) {
          def$1(slots, "_", type2, true);
        }
      } else {
        normalizeObjectSlots(children, slots);
      }
    } else if (children) {
      normalizeVNodeSlots(instance, children);
    }
  };
  const updateSlots = (instance, children, optimized) => {
    const { vnode, slots } = instance;
    let needDeletionCheck = true;
    let deletionComparisonTarget = EMPTY_OBJ;
    if (vnode.shapeFlag & 32) {
      const type2 = children._;
      if (type2) {
        if (isHmrUpdating) {
          assignSlots(slots, children, optimized);
          trigger(instance, "set", "$slots");
        } else if (optimized && type2 === 1) {
          needDeletionCheck = false;
        } else {
          assignSlots(slots, children, optimized);
        }
      } else {
        needDeletionCheck = !children.$stable;
        normalizeObjectSlots(children, slots);
      }
      deletionComparisonTarget = children;
    } else if (children) {
      normalizeVNodeSlots(instance, children);
      deletionComparisonTarget = { default: 1 };
    }
    if (needDeletionCheck) {
      for (const key in slots) {
        if (!isInternalKey(key) && deletionComparisonTarget[key] == null) {
          delete slots[key];
        }
      }
    }
  };
  let supported;
  let perf;
  function startMeasure(instance, type2) {
    if (instance.appContext.config.performance && isSupported()) {
      perf.mark(`vue-${type2}-${instance.uid}`);
    }
    {
      devtoolsPerfStart(instance, type2, isSupported() ? perf.now() : Date.now());
    }
  }
  function endMeasure(instance, type2) {
    if (instance.appContext.config.performance && isSupported()) {
      const startTag = `vue-${type2}-${instance.uid}`;
      const endTag = startTag + `:end`;
      perf.mark(endTag);
      perf.measure(
        `<${formatComponentName(instance, instance.type)}> ${type2}`,
        startTag,
        endTag
      );
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
    }
    {
      devtoolsPerfEnd(instance, type2, isSupported() ? perf.now() : Date.now());
    }
  }
  function isSupported() {
    if (supported !== void 0) {
      return supported;
    }
    if (typeof window !== "undefined" && window.performance) {
      supported = true;
      perf = window.performance;
    } else {
      supported = false;
    }
    return supported;
  }
  function initFeatureFlags() {
    const needWarn = [];
    if (needWarn.length) {
      const multi = needWarn.length > 1;
      console.warn(
        `Feature flag${multi ? `s` : ``} ${needWarn.join(", ")} ${multi ? `are` : `is`} not explicitly defined. You are running the esm-bundler build of Vue, which expects these compile-time feature flags to be globally injected via the bundler config in order to get better tree-shaking in the production bundle.

For more details, see https://link.vuejs.org/feature-flags.`
      );
    }
  }
  const queuePostRenderEffect = queueEffectWithSuspense;
  function createRenderer(options) {
    return baseCreateRenderer(options);
  }
  function baseCreateRenderer(options, createHydrationFns) {
    {
      initFeatureFlags();
    }
    const target = getGlobalThis();
    target.__VUE__ = true;
    {
      setDevtoolsHook$1(target.__VUE_DEVTOOLS_GLOBAL_HOOK__, target);
    }
    const {
      insert: hostInsert,
      remove: hostRemove,
      patchProp: hostPatchProp,
      createElement: hostCreateElement,
      createText: hostCreateText,
      createComment: hostCreateComment,
      setText: hostSetText,
      setElementText: hostSetElementText,
      parentNode: hostParentNode,
      nextSibling: hostNextSibling,
      setScopeId: hostSetScopeId = NOOP,
      insertStaticContent: hostInsertStaticContent
    } = options;
    const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, namespace = void 0, slotScopeIds = null, optimized = isHmrUpdating ? false : !!n2.dynamicChildren) => {
      if (n1 === n2) {
        return;
      }
      if (n1 && !isSameVNodeType(n1, n2)) {
        anchor = getNextHostNode(n1);
        unmount(n1, parentComponent, parentSuspense, true);
        n1 = null;
      }
      if (n2.patchFlag === -2) {
        optimized = false;
        n2.dynamicChildren = null;
      }
      const { type: type2, ref: ref3, shapeFlag } = n2;
      switch (type2) {
        case Text:
          processText(n1, n2, container, anchor);
          break;
        case Comment:
          processCommentNode(n1, n2, container, anchor);
          break;
        case Static:
          if (n1 == null) {
            mountStaticNode(n2, container, anchor, namespace);
          } else {
            patchStaticNode(n1, n2, container, namespace);
          }
          break;
        case Fragment:
          processFragment(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          break;
        default:
          if (shapeFlag & 1) {
            processElement(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          } else if (shapeFlag & 6) {
            processComponent(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          } else if (shapeFlag & 64) {
            type2.process(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized,
              internals
            );
          } else if (shapeFlag & 128) {
            type2.process(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized,
              internals
            );
          } else {
            warn$1("Invalid VNode type:", type2, `(${typeof type2})`);
          }
      }
      if (ref3 != null && parentComponent) {
        setRef(ref3, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
      }
    };
    const processText = (n1, n2, container, anchor) => {
      if (n1 == null) {
        hostInsert(
          n2.el = hostCreateText(n2.children),
          container,
          anchor
        );
      } else {
        const el = n2.el = n1.el;
        if (n2.children !== n1.children) {
          hostSetText(el, n2.children);
        }
      }
    };
    const processCommentNode = (n1, n2, container, anchor) => {
      if (n1 == null) {
        hostInsert(
          n2.el = hostCreateComment(n2.children || ""),
          container,
          anchor
        );
      } else {
        n2.el = n1.el;
      }
    };
    const mountStaticNode = (n2, container, anchor, namespace) => {
      [n2.el, n2.anchor] = hostInsertStaticContent(
        n2.children,
        container,
        anchor,
        namespace,
        n2.el,
        n2.anchor
      );
    };
    const patchStaticNode = (n1, n2, container, namespace) => {
      if (n2.children !== n1.children) {
        const anchor = hostNextSibling(n1.anchor);
        removeStaticNode(n1);
        [n2.el, n2.anchor] = hostInsertStaticContent(
          n2.children,
          container,
          anchor,
          namespace
        );
      } else {
        n2.el = n1.el;
        n2.anchor = n1.anchor;
      }
    };
    const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
      let next;
      while (el && el !== anchor) {
        next = hostNextSibling(el);
        hostInsert(el, container, nextSibling);
        el = next;
      }
      hostInsert(anchor, container, nextSibling);
    };
    const removeStaticNode = ({ el, anchor }) => {
      let next;
      while (el && el !== anchor) {
        next = hostNextSibling(el);
        hostRemove(el);
        el = next;
      }
      hostRemove(anchor);
    };
    const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      if (n2.type === "svg") {
        namespace = "svg";
      } else if (n2.type === "math") {
        namespace = "mathml";
      }
      if (n1 == null) {
        mountElement(
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        patchElement(
          n1,
          n2,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      }
    };
    const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      let el;
      let vnodeHook;
      const { props, shapeFlag, transition, dirs } = vnode;
      el = vnode.el = hostCreateElement(
        vnode.type,
        namespace,
        props && props.is,
        props
      );
      if (shapeFlag & 8) {
        hostSetElementText(el, vnode.children);
      } else if (shapeFlag & 16) {
        mountChildren(
          vnode.children,
          el,
          null,
          parentComponent,
          parentSuspense,
          resolveChildrenNamespace(vnode, namespace),
          slotScopeIds,
          optimized
        );
      }
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "created");
      }
      setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
      if (props) {
        for (const key in props) {
          if (key !== "value" && !isReservedProp(key)) {
            hostPatchProp(el, key, null, props[key], namespace, parentComponent);
          }
        }
        if ("value" in props) {
          hostPatchProp(el, "value", null, props.value, namespace);
        }
        if (vnodeHook = props.onVnodeBeforeMount) {
          invokeVNodeHook(vnodeHook, parentComponent, vnode);
        }
      }
      {
        def$1(el, "__vnode", vnode, true);
        def$1(el, "__vueParentComponent", parentComponent, true);
      }
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
      }
      const needCallTransitionHooks = needTransition(parentSuspense, transition);
      if (needCallTransitionHooks) {
        transition.beforeEnter(el);
      }
      hostInsert(el, container, anchor);
      if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
          needCallTransitionHooks && transition.enter(el);
          dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
        }, parentSuspense);
      }
    };
    const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
      if (scopeId) {
        hostSetScopeId(el, scopeId);
      }
      if (slotScopeIds) {
        for (let i = 0; i < slotScopeIds.length; i++) {
          hostSetScopeId(el, slotScopeIds[i]);
        }
      }
      if (parentComponent) {
        let subTree = parentComponent.subTree;
        if (subTree.patchFlag > 0 && subTree.patchFlag & 2048) {
          subTree = filterSingleRoot(subTree.children) || subTree;
        }
        if (vnode === subTree || isSuspense(subTree.type) && (subTree.ssContent === vnode || subTree.ssFallback === vnode)) {
          const parentVNode = parentComponent.vnode;
          setScopeId(
            el,
            parentVNode,
            parentVNode.scopeId,
            parentVNode.slotScopeIds,
            parentComponent.parent
          );
        }
      }
    };
    const mountChildren = (children, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, start = 0) => {
      for (let i = start; i < children.length; i++) {
        const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
        patch(
          null,
          child,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      }
    };
    const patchElement = (n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      const el = n2.el = n1.el;
      {
        el.__vnode = n2;
      }
      let { patchFlag, dynamicChildren, dirs } = n2;
      patchFlag |= n1.patchFlag & 16;
      const oldProps = n1.props || EMPTY_OBJ;
      const newProps = n2.props || EMPTY_OBJ;
      let vnodeHook;
      parentComponent && toggleRecurse(parentComponent, false);
      if (vnodeHook = newProps.onVnodeBeforeUpdate) {
        invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
      }
      if (dirs) {
        invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
      }
      parentComponent && toggleRecurse(parentComponent, true);
      if (isHmrUpdating) {
        patchFlag = 0;
        optimized = false;
        dynamicChildren = null;
      }
      if (oldProps.innerHTML && newProps.innerHTML == null || oldProps.textContent && newProps.textContent == null) {
        hostSetElementText(el, "");
      }
      if (dynamicChildren) {
        patchBlockChildren(
          n1.dynamicChildren,
          dynamicChildren,
          el,
          parentComponent,
          parentSuspense,
          resolveChildrenNamespace(n2, namespace),
          slotScopeIds
        );
        {
          traverseStaticChildren(n1, n2);
        }
      } else if (!optimized) {
        patchChildren(
          n1,
          n2,
          el,
          null,
          parentComponent,
          parentSuspense,
          resolveChildrenNamespace(n2, namespace),
          slotScopeIds,
          false
        );
      }
      if (patchFlag > 0) {
        if (patchFlag & 16) {
          patchProps(el, oldProps, newProps, parentComponent, namespace);
        } else {
          if (patchFlag & 2) {
            if (oldProps.class !== newProps.class) {
              hostPatchProp(el, "class", null, newProps.class, namespace);
            }
          }
          if (patchFlag & 4) {
            hostPatchProp(el, "style", oldProps.style, newProps.style, namespace);
          }
          if (patchFlag & 8) {
            const propsToUpdate = n2.dynamicProps;
            for (let i = 0; i < propsToUpdate.length; i++) {
              const key = propsToUpdate[i];
              const prev = oldProps[key];
              const next = newProps[key];
              if (next !== prev || key === "value") {
                hostPatchProp(el, key, prev, next, namespace, parentComponent);
              }
            }
          }
        }
        if (patchFlag & 1) {
          if (n1.children !== n2.children) {
            hostSetElementText(el, n2.children);
          }
        }
      } else if (!optimized && dynamicChildren == null) {
        patchProps(el, oldProps, newProps, parentComponent, namespace);
      }
      if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
          dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
        }, parentSuspense);
      }
    };
    const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, namespace, slotScopeIds) => {
      for (let i = 0; i < newChildren.length; i++) {
        const oldVNode = oldChildren[i];
        const newVNode = newChildren[i];
        const container = (
          // oldVNode may be an errored async setup() component inside Suspense
          // which will not have a mounted element
          oldVNode.el && // - In the case of a Fragment, we need to provide the actual parent
          // of the Fragment itself so it can move its children.
          (oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
          // which also requires the correct parent container
          !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
          oldVNode.shapeFlag & (6 | 64)) ? hostParentNode(oldVNode.el) : (
            // In other cases, the parent container is not actually used so we
            // just pass the block element here to avoid a DOM parentNode call.
            fallbackContainer
          )
        );
        patch(
          oldVNode,
          newVNode,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          true
        );
      }
    };
    const patchProps = (el, oldProps, newProps, parentComponent, namespace) => {
      if (oldProps !== newProps) {
        if (oldProps !== EMPTY_OBJ) {
          for (const key in oldProps) {
            if (!isReservedProp(key) && !(key in newProps)) {
              hostPatchProp(
                el,
                key,
                oldProps[key],
                null,
                namespace,
                parentComponent
              );
            }
          }
        }
        for (const key in newProps) {
          if (isReservedProp(key)) continue;
          const next = newProps[key];
          const prev = oldProps[key];
          if (next !== prev && key !== "value") {
            hostPatchProp(el, key, prev, next, namespace, parentComponent);
          }
        }
        if ("value" in newProps) {
          hostPatchProp(el, "value", oldProps.value, newProps.value, namespace);
        }
      }
    };
    const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
      const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
      let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
      if (
        // #5523 dev root fragment may inherit directives
        isHmrUpdating || patchFlag & 2048
      ) {
        patchFlag = 0;
        optimized = false;
        dynamicChildren = null;
      }
      if (fragmentSlotScopeIds) {
        slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
      }
      if (n1 == null) {
        hostInsert(fragmentStartAnchor, container, anchor);
        hostInsert(fragmentEndAnchor, container, anchor);
        mountChildren(
          // #10007
          // such fragment like `<></>` will be compiled into
          // a fragment which doesn't have a children.
          // In this case fallback to an empty array
          n2.children || [],
          container,
          fragmentEndAnchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
        // of renderSlot() with no valid children
        n1.dynamicChildren) {
          patchBlockChildren(
            n1.dynamicChildren,
            dynamicChildren,
            container,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds
          );
          {
            traverseStaticChildren(n1, n2);
          }
        } else {
          patchChildren(
            n1,
            n2,
            container,
            fragmentEndAnchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        }
      }
    };
    const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      n2.slotScopeIds = slotScopeIds;
      if (n1 == null) {
        if (n2.shapeFlag & 512) {
          parentComponent.ctx.activate(
            n2,
            container,
            anchor,
            namespace,
            optimized
          );
        } else {
          mountComponent(
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            optimized
          );
        }
      } else {
        updateComponent(n1, n2, optimized);
      }
    };
    const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, namespace, optimized) => {
      const instance = initialVNode.component = createComponentInstance(
        initialVNode,
        parentComponent,
        parentSuspense
      );
      if (instance.type.__hmrId) {
        registerHMR(instance);
      }
      {
        pushWarningContext(initialVNode);
        startMeasure(instance, `mount`);
      }
      if (isKeepAlive(initialVNode)) {
        instance.ctx.renderer = internals;
      }
      {
        {
          startMeasure(instance, `init`);
        }
        setupComponent(instance, false, optimized);
        {
          endMeasure(instance, `init`);
        }
      }
      if (instance.asyncDep) {
        if (isHmrUpdating) initialVNode.el = null;
        parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect, optimized);
        if (!initialVNode.el) {
          const placeholder = instance.subTree = createVNode(Comment);
          processCommentNode(null, placeholder, container, anchor);
        }
      } else {
        setupRenderEffect(
          instance,
          initialVNode,
          container,
          anchor,
          parentSuspense,
          namespace,
          optimized
        );
      }
      {
        popWarningContext();
        endMeasure(instance, `mount`);
      }
    };
    const updateComponent = (n1, n2, optimized) => {
      const instance = n2.component = n1.component;
      if (shouldUpdateComponent(n1, n2, optimized)) {
        if (instance.asyncDep && !instance.asyncResolved) {
          {
            pushWarningContext(n2);
          }
          updateComponentPreRender(instance, n2, optimized);
          {
            popWarningContext();
          }
          return;
        } else {
          instance.next = n2;
          instance.update();
        }
      } else {
        n2.el = n1.el;
        instance.vnode = n2;
      }
    };
    const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, namespace, optimized) => {
      const componentUpdateFn = () => {
        if (!instance.isMounted) {
          let vnodeHook;
          const { el, props } = initialVNode;
          const { bm, m, parent, root, type: type2 } = instance;
          const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
          toggleRecurse(instance, false);
          if (bm) {
            invokeArrayFns(bm);
          }
          if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
            invokeVNodeHook(vnodeHook, parent, initialVNode);
          }
          toggleRecurse(instance, true);
          {
            if (root.ce) {
              root.ce._injectChildStyle(type2);
            }
            {
              startMeasure(instance, `render`);
            }
            const subTree = instance.subTree = renderComponentRoot(instance);
            {
              endMeasure(instance, `render`);
            }
            {
              startMeasure(instance, `patch`);
            }
            patch(
              null,
              subTree,
              container,
              anchor,
              instance,
              parentSuspense,
              namespace
            );
            {
              endMeasure(instance, `patch`);
            }
            initialVNode.el = subTree.el;
          }
          if (m) {
            queuePostRenderEffect(m, parentSuspense);
          }
          if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
            const scopedInitialVNode = initialVNode;
            queuePostRenderEffect(
              () => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode),
              parentSuspense
            );
          }
          if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
            instance.a && queuePostRenderEffect(instance.a, parentSuspense);
          }
          instance.isMounted = true;
          {
            devtoolsComponentAdded(instance);
          }
          initialVNode = container = anchor = null;
        } else {
          let { next, bu, u, parent, vnode } = instance;
          {
            const nonHydratedAsyncRoot = locateNonHydratedAsyncRoot(instance);
            if (nonHydratedAsyncRoot) {
              if (next) {
                next.el = vnode.el;
                updateComponentPreRender(instance, next, optimized);
              }
              nonHydratedAsyncRoot.asyncDep.then(() => {
                if (!instance.isUnmounted) {
                  componentUpdateFn();
                }
              });
              return;
            }
          }
          let originNext = next;
          let vnodeHook;
          {
            pushWarningContext(next || instance.vnode);
          }
          toggleRecurse(instance, false);
          if (next) {
            next.el = vnode.el;
            updateComponentPreRender(instance, next, optimized);
          } else {
            next = vnode;
          }
          if (bu) {
            invokeArrayFns(bu);
          }
          if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
            invokeVNodeHook(vnodeHook, parent, next, vnode);
          }
          toggleRecurse(instance, true);
          {
            startMeasure(instance, `render`);
          }
          const nextTree = renderComponentRoot(instance);
          {
            endMeasure(instance, `render`);
          }
          const prevTree = instance.subTree;
          instance.subTree = nextTree;
          {
            startMeasure(instance, `patch`);
          }
          patch(
            prevTree,
            nextTree,
            // parent may have changed if it's in a teleport
            hostParentNode(prevTree.el),
            // anchor may have changed if it's in a fragment
            getNextHostNode(prevTree),
            instance,
            parentSuspense,
            namespace
          );
          {
            endMeasure(instance, `patch`);
          }
          next.el = nextTree.el;
          if (originNext === null) {
            updateHOCHostEl(instance, nextTree.el);
          }
          if (u) {
            queuePostRenderEffect(u, parentSuspense);
          }
          if (vnodeHook = next.props && next.props.onVnodeUpdated) {
            queuePostRenderEffect(
              () => invokeVNodeHook(vnodeHook, parent, next, vnode),
              parentSuspense
            );
          }
          {
            devtoolsComponentUpdated(instance);
          }
          {
            popWarningContext();
          }
        }
      };
      instance.scope.on();
      const effect2 = instance.effect = new ReactiveEffect(componentUpdateFn);
      instance.scope.off();
      const update = instance.update = effect2.run.bind(effect2);
      const job = instance.job = effect2.runIfDirty.bind(effect2);
      job.i = instance;
      job.id = instance.uid;
      effect2.scheduler = () => queueJob(job);
      toggleRecurse(instance, true);
      {
        effect2.onTrack = instance.rtc ? (e) => invokeArrayFns(instance.rtc, e) : void 0;
        effect2.onTrigger = instance.rtg ? (e) => invokeArrayFns(instance.rtg, e) : void 0;
      }
      update();
    };
    const updateComponentPreRender = (instance, nextVNode, optimized) => {
      nextVNode.component = instance;
      const prevProps = instance.vnode.props;
      instance.vnode = nextVNode;
      instance.next = null;
      updateProps(instance, nextVNode.props, prevProps, optimized);
      updateSlots(instance, nextVNode.children, optimized);
      pauseTracking();
      flushPreFlushCbs(instance);
      resetTracking();
    };
    const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized = false) => {
      const c1 = n1 && n1.children;
      const prevShapeFlag = n1 ? n1.shapeFlag : 0;
      const c2 = n2.children;
      const { patchFlag, shapeFlag } = n2;
      if (patchFlag > 0) {
        if (patchFlag & 128) {
          patchKeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          return;
        } else if (patchFlag & 256) {
          patchUnkeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          return;
        }
      }
      if (shapeFlag & 8) {
        if (prevShapeFlag & 16) {
          unmountChildren(c1, parentComponent, parentSuspense);
        }
        if (c2 !== c1) {
          hostSetElementText(container, c2);
        }
      } else {
        if (prevShapeFlag & 16) {
          if (shapeFlag & 16) {
            patchKeyedChildren(
              c1,
              c2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          } else {
            unmountChildren(c1, parentComponent, parentSuspense, true);
          }
        } else {
          if (prevShapeFlag & 8) {
            hostSetElementText(container, "");
          }
          if (shapeFlag & 16) {
            mountChildren(
              c2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          }
        }
      }
    };
    const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      c1 = c1 || EMPTY_ARR;
      c2 = c2 || EMPTY_ARR;
      const oldLength = c1.length;
      const newLength = c2.length;
      const commonLength = Math.min(oldLength, newLength);
      let i;
      for (i = 0; i < commonLength; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        patch(
          c1[i],
          nextChild,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      }
      if (oldLength > newLength) {
        unmountChildren(
          c1,
          parentComponent,
          parentSuspense,
          true,
          false,
          commonLength
        );
      } else {
        mountChildren(
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized,
          commonLength
        );
      }
    };
    const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      let i = 0;
      const l2 = c2.length;
      let e1 = c1.length - 1;
      let e2 = l2 - 1;
      while (i <= e1 && i <= e2) {
        const n1 = c1[i];
        const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (isSameVNodeType(n1, n2)) {
          patch(
            n1,
            n2,
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else {
          break;
        }
        i++;
      }
      while (i <= e1 && i <= e2) {
        const n1 = c1[e1];
        const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
        if (isSameVNodeType(n1, n2)) {
          patch(
            n1,
            n2,
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else {
          break;
        }
        e1--;
        e2--;
      }
      if (i > e1) {
        if (i <= e2) {
          const nextPos = e2 + 1;
          const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
          while (i <= e2) {
            patch(
              null,
              c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]),
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
            i++;
          }
        }
      } else if (i > e2) {
        while (i <= e1) {
          unmount(c1[i], parentComponent, parentSuspense, true);
          i++;
        }
      } else {
        const s1 = i;
        const s2 = i;
        const keyToNewIndexMap = /* @__PURE__ */ new Map();
        for (i = s2; i <= e2; i++) {
          const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
          if (nextChild.key != null) {
            if (keyToNewIndexMap.has(nextChild.key)) {
              warn$1(
                `Duplicate keys found during update:`,
                JSON.stringify(nextChild.key),
                `Make sure keys are unique.`
              );
            }
            keyToNewIndexMap.set(nextChild.key, i);
          }
        }
        let j;
        let patched = 0;
        const toBePatched = e2 - s2 + 1;
        let moved = false;
        let maxNewIndexSoFar = 0;
        const newIndexToOldIndexMap = new Array(toBePatched);
        for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0;
        for (i = s1; i <= e1; i++) {
          const prevChild = c1[i];
          if (patched >= toBePatched) {
            unmount(prevChild, parentComponent, parentSuspense, true);
            continue;
          }
          let newIndex;
          if (prevChild.key != null) {
            newIndex = keyToNewIndexMap.get(prevChild.key);
          } else {
            for (j = s2; j <= e2; j++) {
              if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
                newIndex = j;
                break;
              }
            }
          }
          if (newIndex === void 0) {
            unmount(prevChild, parentComponent, parentSuspense, true);
          } else {
            newIndexToOldIndexMap[newIndex - s2] = i + 1;
            if (newIndex >= maxNewIndexSoFar) {
              maxNewIndexSoFar = newIndex;
            } else {
              moved = true;
            }
            patch(
              prevChild,
              c2[newIndex],
              container,
              null,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
            patched++;
          }
        }
        const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
        j = increasingNewIndexSequence.length - 1;
        for (i = toBePatched - 1; i >= 0; i--) {
          const nextIndex = s2 + i;
          const nextChild = c2[nextIndex];
          const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
          if (newIndexToOldIndexMap[i] === 0) {
            patch(
              null,
              nextChild,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          } else if (moved) {
            if (j < 0 || i !== increasingNewIndexSequence[j]) {
              move(nextChild, container, anchor, 2);
            } else {
              j--;
            }
          }
        }
      }
    };
    const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
      const { el, type: type2, transition, children, shapeFlag } = vnode;
      if (shapeFlag & 6) {
        move(vnode.component.subTree, container, anchor, moveType);
        return;
      }
      if (shapeFlag & 128) {
        vnode.suspense.move(container, anchor, moveType);
        return;
      }
      if (shapeFlag & 64) {
        type2.move(vnode, container, anchor, internals);
        return;
      }
      if (type2 === Fragment) {
        hostInsert(el, container, anchor);
        for (let i = 0; i < children.length; i++) {
          move(children[i], container, anchor, moveType);
        }
        hostInsert(vnode.anchor, container, anchor);
        return;
      }
      if (type2 === Static) {
        moveStaticNode(vnode, container, anchor);
        return;
      }
      const needTransition2 = moveType !== 2 && shapeFlag & 1 && transition;
      if (needTransition2) {
        if (moveType === 0) {
          transition.beforeEnter(el);
          hostInsert(el, container, anchor);
          queuePostRenderEffect(() => transition.enter(el), parentSuspense);
        } else {
          const { leave, delayLeave, afterLeave } = transition;
          const remove22 = () => hostInsert(el, container, anchor);
          const performLeave = () => {
            leave(el, () => {
              remove22();
              afterLeave && afterLeave();
            });
          };
          if (delayLeave) {
            delayLeave(el, remove22, performLeave);
          } else {
            performLeave();
          }
        }
      } else {
        hostInsert(el, container, anchor);
      }
    };
    const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
      const {
        type: type2,
        props,
        ref: ref3,
        children,
        dynamicChildren,
        shapeFlag,
        patchFlag,
        dirs,
        cacheIndex
      } = vnode;
      if (patchFlag === -2) {
        optimized = false;
      }
      if (ref3 != null) {
        setRef(ref3, null, parentSuspense, vnode, true);
      }
      if (cacheIndex != null) {
        parentComponent.renderCache[cacheIndex] = void 0;
      }
      if (shapeFlag & 256) {
        parentComponent.ctx.deactivate(vnode);
        return;
      }
      const shouldInvokeDirs = shapeFlag & 1 && dirs;
      const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
      let vnodeHook;
      if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }
      if (shapeFlag & 6) {
        unmountComponent(vnode.component, parentSuspense, doRemove);
      } else {
        if (shapeFlag & 128) {
          vnode.suspense.unmount(parentSuspense, doRemove);
          return;
        }
        if (shouldInvokeDirs) {
          invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
        }
        if (shapeFlag & 64) {
          vnode.type.remove(
            vnode,
            parentComponent,
            parentSuspense,
            internals,
            doRemove
          );
        } else if (dynamicChildren && // #5154
        // when v-once is used inside a block, setBlockTracking(-1) marks the
        // parent block with hasOnce: true
        // so that it doesn't take the fast path during unmount - otherwise
        // components nested in v-once are never unmounted.
        !dynamicChildren.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
        (type2 !== Fragment || patchFlag > 0 && patchFlag & 64)) {
          unmountChildren(
            dynamicChildren,
            parentComponent,
            parentSuspense,
            false,
            true
          );
        } else if (type2 === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
          unmountChildren(children, parentComponent, parentSuspense);
        }
        if (doRemove) {
          remove2(vnode);
        }
      }
      if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
          shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
        }, parentSuspense);
      }
    };
    const remove2 = (vnode) => {
      const { type: type2, el, anchor, transition } = vnode;
      if (type2 === Fragment) {
        if (vnode.patchFlag > 0 && vnode.patchFlag & 2048 && transition && !transition.persisted) {
          vnode.children.forEach((child) => {
            if (child.type === Comment) {
              hostRemove(child.el);
            } else {
              remove2(child);
            }
          });
        } else {
          removeFragment(el, anchor);
        }
        return;
      }
      if (type2 === Static) {
        removeStaticNode(vnode);
        return;
      }
      const performRemove = () => {
        hostRemove(el);
        if (transition && !transition.persisted && transition.afterLeave) {
          transition.afterLeave();
        }
      };
      if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
        const { leave, delayLeave } = transition;
        const performLeave = () => leave(el, performRemove);
        if (delayLeave) {
          delayLeave(vnode.el, performRemove, performLeave);
        } else {
          performLeave();
        }
      } else {
        performRemove();
      }
    };
    const removeFragment = (cur, end) => {
      let next;
      while (cur !== end) {
        next = hostNextSibling(cur);
        hostRemove(cur);
        cur = next;
      }
      hostRemove(end);
    };
    const unmountComponent = (instance, parentSuspense, doRemove) => {
      if (instance.type.__hmrId) {
        unregisterHMR(instance);
      }
      const { bum, scope, job, subTree, um, m, a } = instance;
      invalidateMount(m);
      invalidateMount(a);
      if (bum) {
        invokeArrayFns(bum);
      }
      scope.stop();
      if (job) {
        job.flags |= 8;
        unmount(subTree, instance, parentSuspense, doRemove);
      }
      if (um) {
        queuePostRenderEffect(um, parentSuspense);
      }
      queuePostRenderEffect(() => {
        instance.isUnmounted = true;
      }, parentSuspense);
      if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
        parentSuspense.deps--;
        if (parentSuspense.deps === 0) {
          parentSuspense.resolve();
        }
      }
      {
        devtoolsComponentRemoved(instance);
      }
    };
    const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
      for (let i = start; i < children.length; i++) {
        unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
      }
    };
    const getNextHostNode = (vnode) => {
      if (vnode.shapeFlag & 6) {
        return getNextHostNode(vnode.component.subTree);
      }
      if (vnode.shapeFlag & 128) {
        return vnode.suspense.next();
      }
      const el = hostNextSibling(vnode.anchor || vnode.el);
      const teleportEnd = el && el[TeleportEndKey];
      return teleportEnd ? hostNextSibling(teleportEnd) : el;
    };
    let isFlushing = false;
    const render = (vnode, container, namespace) => {
      if (vnode == null) {
        if (container._vnode) {
          unmount(container._vnode, null, null, true);
        }
      } else {
        patch(
          container._vnode || null,
          vnode,
          container,
          null,
          null,
          null,
          namespace
        );
      }
      container._vnode = vnode;
      if (!isFlushing) {
        isFlushing = true;
        flushPreFlushCbs();
        flushPostFlushCbs();
        isFlushing = false;
      }
    };
    const internals = {
      p: patch,
      um: unmount,
      m: move,
      r: remove2,
      mt: mountComponent,
      mc: mountChildren,
      pc: patchChildren,
      pbc: patchBlockChildren,
      n: getNextHostNode,
      o: options
    };
    let hydrate;
    return {
      render,
      hydrate,
      createApp: createAppAPI(render)
    };
  }
  function resolveChildrenNamespace({ type: type2, props }, currentNamespace) {
    return currentNamespace === "svg" && type2 === "foreignObject" || currentNamespace === "mathml" && type2 === "annotation-xml" && props && props.encoding && props.encoding.includes("html") ? void 0 : currentNamespace;
  }
  function toggleRecurse({ effect: effect2, job }, allowed) {
    if (allowed) {
      effect2.flags |= 32;
      job.flags |= 4;
    } else {
      effect2.flags &= ~32;
      job.flags &= ~4;
    }
  }
  function needTransition(parentSuspense, transition) {
    return (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
  }
  function traverseStaticChildren(n1, n2, shallow = false) {
    const ch1 = n1.children;
    const ch2 = n2.children;
    if (isArray(ch1) && isArray(ch2)) {
      for (let i = 0; i < ch1.length; i++) {
        const c1 = ch1[i];
        let c2 = ch2[i];
        if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
          if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
            c2 = ch2[i] = cloneIfMounted(ch2[i]);
            c2.el = c1.el;
          }
          if (!shallow && c2.patchFlag !== -2)
            traverseStaticChildren(c1, c2);
        }
        if (c2.type === Text) {
          c2.el = c1.el;
        }
        if (c2.type === Comment && !c2.el) {
          c2.el = c1.el;
        }
      }
    }
  }
  function getSequence(arr) {
    const p2 = arr.slice();
    const result2 = [0];
    let i, j, u, v, c;
    const len = arr.length;
    for (i = 0; i < len; i++) {
      const arrI = arr[i];
      if (arrI !== 0) {
        j = result2[result2.length - 1];
        if (arr[j] < arrI) {
          p2[i] = j;
          result2.push(i);
          continue;
        }
        u = 0;
        v = result2.length - 1;
        while (u < v) {
          c = u + v >> 1;
          if (arr[result2[c]] < arrI) {
            u = c + 1;
          } else {
            v = c;
          }
        }
        if (arrI < arr[result2[u]]) {
          if (u > 0) {
            p2[i] = result2[u - 1];
          }
          result2[u] = i;
        }
      }
    }
    u = result2.length;
    v = result2[u - 1];
    while (u-- > 0) {
      result2[u] = v;
      v = p2[v];
    }
    return result2;
  }
  function locateNonHydratedAsyncRoot(instance) {
    const subComponent = instance.subTree.component;
    if (subComponent) {
      if (subComponent.asyncDep && !subComponent.asyncResolved) {
        return subComponent;
      } else {
        return locateNonHydratedAsyncRoot(subComponent);
      }
    }
  }
  function invalidateMount(hooks) {
    if (hooks) {
      for (let i = 0; i < hooks.length; i++)
        hooks[i].flags |= 8;
    }
  }
  const ssrContextKey = Symbol.for("v-scx");
  const useSSRContext = () => {
    {
      const ctx = inject(ssrContextKey);
      if (!ctx) {
        warn$1(
          `Server rendering context not provided. Make sure to only call useSSRContext() conditionally in the server build.`
        );
      }
      return ctx;
    }
  };
  function watch(source, cb, options) {
    if (!isFunction(cb)) {
      warn$1(
        `\`watch(fn, options?)\` signature has been moved to a separate API. Use \`watchEffect(fn, options?)\` instead. \`watch\` now only supports \`watch(source, cb, options?) signature.`
      );
    }
    return doWatch(source, cb, options);
  }
  function doWatch(source, cb, options = EMPTY_OBJ) {
    const { immediate, deep, flush, once } = options;
    if (!cb) {
      if (immediate !== void 0) {
        warn$1(
          `watch() "immediate" option is only respected when using the watch(source, callback, options?) signature.`
        );
      }
      if (deep !== void 0) {
        warn$1(
          `watch() "deep" option is only respected when using the watch(source, callback, options?) signature.`
        );
      }
      if (once !== void 0) {
        warn$1(
          `watch() "once" option is only respected when using the watch(source, callback, options?) signature.`
        );
      }
    }
    const baseWatchOptions = extend({}, options);
    baseWatchOptions.onWarn = warn$1;
    const runsImmediately = cb && immediate || !cb && flush !== "post";
    let ssrCleanup;
    if (isInSSRComponentSetup) {
      if (flush === "sync") {
        const ctx = useSSRContext();
        ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
      } else if (!runsImmediately) {
        const watchStopHandle = () => {
        };
        watchStopHandle.stop = NOOP;
        watchStopHandle.resume = NOOP;
        watchStopHandle.pause = NOOP;
        return watchStopHandle;
      }
    }
    const instance = currentInstance;
    baseWatchOptions.call = (fn, type2, args) => callWithAsyncErrorHandling(fn, instance, type2, args);
    let isPre = false;
    if (flush === "post") {
      baseWatchOptions.scheduler = (job) => {
        queuePostRenderEffect(job, instance && instance.suspense);
      };
    } else if (flush !== "sync") {
      isPre = true;
      baseWatchOptions.scheduler = (job, isFirstRun) => {
        if (isFirstRun) {
          job();
        } else {
          queueJob(job);
        }
      };
    }
    baseWatchOptions.augmentJob = (job) => {
      if (cb) {
        job.flags |= 4;
      }
      if (isPre) {
        job.flags |= 2;
        if (instance) {
          job.id = instance.uid;
          job.i = instance;
        }
      }
    };
    const watchHandle = watch$1(source, cb, baseWatchOptions);
    if (isInSSRComponentSetup) {
      if (ssrCleanup) {
        ssrCleanup.push(watchHandle);
      } else if (runsImmediately) {
        watchHandle();
      }
    }
    return watchHandle;
  }
  function instanceWatch(source, value, options) {
    const publicThis = this.proxy;
    const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
    let cb;
    if (isFunction(value)) {
      cb = value;
    } else {
      cb = value.handler;
      options = value;
    }
    const reset = setCurrentInstance(this);
    const res = doWatch(getter, cb.bind(publicThis), options);
    reset();
    return res;
  }
  function createPathGetter(ctx, path) {
    const segments = path.split(".");
    return () => {
      let cur = ctx;
      for (let i = 0; i < segments.length && cur; i++) {
        cur = cur[segments[i]];
      }
      return cur;
    };
  }
  const getModelModifiers = (props, modelName) => {
    return modelName === "modelValue" || modelName === "model-value" ? props.modelModifiers : props[`${modelName}Modifiers`] || props[`${camelize(modelName)}Modifiers`] || props[`${hyphenate(modelName)}Modifiers`];
  };
  function emit(instance, event, ...rawArgs) {
    if (instance.isUnmounted) return;
    const props = instance.vnode.props || EMPTY_OBJ;
    {
      const {
        emitsOptions,
        propsOptions: [propsOptions]
      } = instance;
      if (emitsOptions) {
        if (!(event in emitsOptions) && true) {
          if (!propsOptions || !(toHandlerKey(camelize(event)) in propsOptions)) {
            warn$1(
              `Component emitted event "${event}" but it is neither declared in the emits option nor as an "${toHandlerKey(camelize(event))}" prop.`
            );
          }
        } else {
          const validator = emitsOptions[event];
          if (isFunction(validator)) {
            const isValid = validator(...rawArgs);
            if (!isValid) {
              warn$1(
                `Invalid event arguments: event validation failed for event "${event}".`
              );
            }
          }
        }
      }
    }
    let args = rawArgs;
    const isModelListener2 = event.startsWith("update:");
    const modifiers = isModelListener2 && getModelModifiers(props, event.slice(7));
    if (modifiers) {
      if (modifiers.trim) {
        args = rawArgs.map((a) => isString(a) ? a.trim() : a);
      }
      if (modifiers.number) {
        args = rawArgs.map(looseToNumber);
      }
    }
    {
      devtoolsComponentEmit(instance, event, args);
    }
    {
      const lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && props[toHandlerKey(lowerCaseEvent)]) {
        warn$1(
          `Event "${lowerCaseEvent}" is emitted in component ${formatComponentName(
            instance,
            instance.type
          )} but the handler is registered for "${event}". Note that HTML attributes are case-insensitive and you cannot use v-on to listen to camelCase events when using in-DOM templates. You should probably use "${hyphenate(
            event
          )}" instead of "${event}".`
        );
      }
    }
    let handlerName;
    let handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
    props[handlerName = toHandlerKey(camelize(event))];
    if (!handler && isModelListener2) {
      handler = props[handlerName = toHandlerKey(hyphenate(event))];
    }
    if (handler) {
      callWithAsyncErrorHandling(
        handler,
        instance,
        6,
        args
      );
    }
    const onceHandler = props[handlerName + `Once`];
    if (onceHandler) {
      if (!instance.emitted) {
        instance.emitted = {};
      } else if (instance.emitted[handlerName]) {
        return;
      }
      instance.emitted[handlerName] = true;
      callWithAsyncErrorHandling(
        onceHandler,
        instance,
        6,
        args
      );
    }
  }
  function normalizeEmitsOptions(comp, appContext, asMixin = false) {
    const cache = appContext.emitsCache;
    const cached = cache.get(comp);
    if (cached !== void 0) {
      return cached;
    }
    const raw = comp.emits;
    let normalized = {};
    let hasExtends = false;
    if (!isFunction(comp)) {
      const extendEmits = (raw2) => {
        const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
        if (normalizedFromExtend) {
          hasExtends = true;
          extend(normalized, normalizedFromExtend);
        }
      };
      if (!asMixin && appContext.mixins.length) {
        appContext.mixins.forEach(extendEmits);
      }
      if (comp.extends) {
        extendEmits(comp.extends);
      }
      if (comp.mixins) {
        comp.mixins.forEach(extendEmits);
      }
    }
    if (!raw && !hasExtends) {
      if (isObject(comp)) {
        cache.set(comp, null);
      }
      return null;
    }
    if (isArray(raw)) {
      raw.forEach((key) => normalized[key] = null);
    } else {
      extend(normalized, raw);
    }
    if (isObject(comp)) {
      cache.set(comp, normalized);
    }
    return normalized;
  }
  function isEmitListener(options, key) {
    if (!options || !isOn(key)) {
      return false;
    }
    key = key.slice(2).replace(/Once$/, "");
    return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
  }
  let accessedAttrs = false;
  function markAttrsAccessed() {
    accessedAttrs = true;
  }
  function renderComponentRoot(instance) {
    const {
      type: Component,
      vnode,
      proxy,
      withProxy,
      propsOptions: [propsOptions],
      slots,
      attrs,
      emit: emit2,
      render,
      renderCache,
      props,
      data,
      setupState,
      ctx,
      inheritAttrs
    } = instance;
    const prev = setCurrentRenderingInstance(instance);
    let result2;
    let fallthroughAttrs;
    {
      accessedAttrs = false;
    }
    try {
      if (vnode.shapeFlag & 4) {
        const proxyToUse = withProxy || proxy;
        const thisProxy = setupState.__isScriptSetup ? new Proxy(proxyToUse, {
          get(target, key, receiver) {
            warn$1(
              `Property '${String(
                key
              )}' was accessed via 'this'. Avoid using 'this' in templates.`
            );
            return Reflect.get(target, key, receiver);
          }
        }) : proxyToUse;
        result2 = normalizeVNode(
          render.call(
            thisProxy,
            proxyToUse,
            renderCache,
            true ? shallowReadonly(props) : props,
            setupState,
            data,
            ctx
          )
        );
        fallthroughAttrs = attrs;
      } else {
        const render2 = Component;
        if (attrs === props) {
          markAttrsAccessed();
        }
        result2 = normalizeVNode(
          render2.length > 1 ? render2(
            true ? shallowReadonly(props) : props,
            true ? {
              get attrs() {
                markAttrsAccessed();
                return shallowReadonly(attrs);
              },
              slots,
              emit: emit2
            } : { attrs, slots, emit: emit2 }
          ) : render2(
            true ? shallowReadonly(props) : props,
            null
          )
        );
        fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
      }
    } catch (err) {
      blockStack.length = 0;
      handleError(err, instance, 1);
      result2 = createVNode(Comment);
    }
    let root = result2;
    let setRoot = void 0;
    if (result2.patchFlag > 0 && result2.patchFlag & 2048) {
      [root, setRoot] = getChildRoot(result2);
    }
    if (fallthroughAttrs && inheritAttrs !== false) {
      const keys = Object.keys(fallthroughAttrs);
      const { shapeFlag } = root;
      if (keys.length) {
        if (shapeFlag & (1 | 6)) {
          if (propsOptions && keys.some(isModelListener)) {
            fallthroughAttrs = filterModelListeners(
              fallthroughAttrs,
              propsOptions
            );
          }
          root = cloneVNode(root, fallthroughAttrs, false, true);
        } else if (!accessedAttrs && root.type !== Comment) {
          const allAttrs = Object.keys(attrs);
          const eventAttrs = [];
          const extraAttrs = [];
          for (let i = 0, l = allAttrs.length; i < l; i++) {
            const key = allAttrs[i];
            if (isOn(key)) {
              if (!isModelListener(key)) {
                eventAttrs.push(key[2].toLowerCase() + key.slice(3));
              }
            } else {
              extraAttrs.push(key);
            }
          }
          if (extraAttrs.length) {
            warn$1(
              `Extraneous non-props attributes (${extraAttrs.join(", ")}) were passed to component but could not be automatically inherited because component renders fragment or text or teleport root nodes.`
            );
          }
          if (eventAttrs.length) {
            warn$1(
              `Extraneous non-emits event listeners (${eventAttrs.join(", ")}) were passed to component but could not be automatically inherited because component renders fragment or text root nodes. If the listener is intended to be a component custom event listener only, declare it using the "emits" option.`
            );
          }
        }
      }
    }
    if (vnode.dirs) {
      if (!isElementRoot(root)) {
        warn$1(
          `Runtime directive used on component with non-element root node. The directives will not function as intended.`
        );
      }
      root = cloneVNode(root, null, false, true);
      root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
    }
    if (vnode.transition) {
      if (!isElementRoot(root)) {
        warn$1(
          `Component inside <Transition> renders non-element root node that cannot be animated.`
        );
      }
      setTransitionHooks(root, vnode.transition);
    }
    if (setRoot) {
      setRoot(root);
    } else {
      result2 = root;
    }
    setCurrentRenderingInstance(prev);
    return result2;
  }
  const getChildRoot = (vnode) => {
    const rawChildren = vnode.children;
    const dynamicChildren = vnode.dynamicChildren;
    const childRoot = filterSingleRoot(rawChildren, false);
    if (!childRoot) {
      return [vnode, void 0];
    } else if (childRoot.patchFlag > 0 && childRoot.patchFlag & 2048) {
      return getChildRoot(childRoot);
    }
    const index = rawChildren.indexOf(childRoot);
    const dynamicIndex = dynamicChildren ? dynamicChildren.indexOf(childRoot) : -1;
    const setRoot = (updatedRoot) => {
      rawChildren[index] = updatedRoot;
      if (dynamicChildren) {
        if (dynamicIndex > -1) {
          dynamicChildren[dynamicIndex] = updatedRoot;
        } else if (updatedRoot.patchFlag > 0) {
          vnode.dynamicChildren = [...dynamicChildren, updatedRoot];
        }
      }
    };
    return [normalizeVNode(childRoot), setRoot];
  };
  function filterSingleRoot(children, recurse = true) {
    let singleRoot;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (isVNode(child)) {
        if (child.type !== Comment || child.children === "v-if") {
          if (singleRoot) {
            return;
          } else {
            singleRoot = child;
            if (recurse && singleRoot.patchFlag > 0 && singleRoot.patchFlag & 2048) {
              return filterSingleRoot(singleRoot.children);
            }
          }
        }
      } else {
        return;
      }
    }
    return singleRoot;
  }
  const getFunctionalFallthrough = (attrs) => {
    let res;
    for (const key in attrs) {
      if (key === "class" || key === "style" || isOn(key)) {
        (res || (res = {}))[key] = attrs[key];
      }
    }
    return res;
  };
  const filterModelListeners = (attrs, props) => {
    const res = {};
    for (const key in attrs) {
      if (!isModelListener(key) || !(key.slice(9) in props)) {
        res[key] = attrs[key];
      }
    }
    return res;
  };
  const isElementRoot = (vnode) => {
    return vnode.shapeFlag & (6 | 1) || vnode.type === Comment;
  };
  function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
    const { props: prevProps, children: prevChildren, component } = prevVNode;
    const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
    const emits = component.emitsOptions;
    if ((prevChildren || nextChildren) && isHmrUpdating) {
      return true;
    }
    if (nextVNode.dirs || nextVNode.transition) {
      return true;
    }
    if (optimized && patchFlag >= 0) {
      if (patchFlag & 1024) {
        return true;
      }
      if (patchFlag & 16) {
        if (!prevProps) {
          return !!nextProps;
        }
        return hasPropsChanged(prevProps, nextProps, emits);
      } else if (patchFlag & 8) {
        const dynamicProps = nextVNode.dynamicProps;
        for (let i = 0; i < dynamicProps.length; i++) {
          const key = dynamicProps[i];
          if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
            return true;
          }
        }
      }
    } else {
      if (prevChildren || nextChildren) {
        if (!nextChildren || !nextChildren.$stable) {
          return true;
        }
      }
      if (prevProps === nextProps) {
        return false;
      }
      if (!prevProps) {
        return !!nextProps;
      }
      if (!nextProps) {
        return true;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    }
    return false;
  }
  function hasPropsChanged(prevProps, nextProps, emitsOptions) {
    const nextKeys = Object.keys(nextProps);
    if (nextKeys.length !== Object.keys(prevProps).length) {
      return true;
    }
    for (let i = 0; i < nextKeys.length; i++) {
      const key = nextKeys[i];
      if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
        return true;
      }
    }
    return false;
  }
  function updateHOCHostEl({ vnode, parent }, el) {
    while (parent) {
      const root = parent.subTree;
      if (root.suspense && root.suspense.activeBranch === vnode) {
        root.el = vnode.el;
      }
      if (root === vnode) {
        (vnode = parent.vnode).el = el;
        parent = parent.parent;
      } else {
        break;
      }
    }
  }
  const isSuspense = (type2) => type2.__isSuspense;
  function queueEffectWithSuspense(fn, suspense) {
    if (suspense && suspense.pendingBranch) {
      if (isArray(fn)) {
        suspense.effects.push(...fn);
      } else {
        suspense.effects.push(fn);
      }
    } else {
      queuePostFlushCb(fn);
    }
  }
  const Fragment = Symbol.for("v-fgt");
  const Text = Symbol.for("v-txt");
  const Comment = Symbol.for("v-cmt");
  const Static = Symbol.for("v-stc");
  const blockStack = [];
  let currentBlock = null;
  function openBlock(disableTracking = false) {
    blockStack.push(currentBlock = disableTracking ? null : []);
  }
  function closeBlock() {
    blockStack.pop();
    currentBlock = blockStack[blockStack.length - 1] || null;
  }
  let isBlockTreeEnabled = 1;
  function setBlockTracking(value, inVOnce = false) {
    isBlockTreeEnabled += value;
    if (value < 0 && currentBlock && inVOnce) {
      currentBlock.hasOnce = true;
    }
  }
  function setupBlock(vnode) {
    vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
    closeBlock();
    if (isBlockTreeEnabled > 0 && currentBlock) {
      currentBlock.push(vnode);
    }
    return vnode;
  }
  function createElementBlock(type2, props, children, patchFlag, dynamicProps, shapeFlag) {
    return setupBlock(
      createBaseVNode(
        type2,
        props,
        children,
        patchFlag,
        dynamicProps,
        shapeFlag,
        true
      )
    );
  }
  function createBlock(type2, props, children, patchFlag, dynamicProps) {
    return setupBlock(
      createVNode(
        type2,
        props,
        children,
        patchFlag,
        dynamicProps,
        true
      )
    );
  }
  function isVNode(value) {
    return value ? value.__v_isVNode === true : false;
  }
  function isSameVNodeType(n1, n2) {
    if (n2.shapeFlag & 6 && n1.component) {
      const dirtyInstances = hmrDirtyComponents.get(n2.type);
      if (dirtyInstances && dirtyInstances.has(n1.component)) {
        n1.shapeFlag &= ~256;
        n2.shapeFlag &= ~512;
        return false;
      }
    }
    return n1.type === n2.type && n1.key === n2.key;
  }
  const createVNodeWithArgsTransform = (...args) => {
    return _createVNode(
      ...args
    );
  };
  const normalizeKey = ({ key }) => key != null ? key : null;
  const normalizeRef = ({
    ref: ref3,
    ref_key,
    ref_for
  }) => {
    if (typeof ref3 === "number") {
      ref3 = "" + ref3;
    }
    return ref3 != null ? isString(ref3) || isRef(ref3) || isFunction(ref3) ? { i: currentRenderingInstance, r: ref3, k: ref_key, f: !!ref_for } : ref3 : null;
  };
  function createBaseVNode(type2, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type2 === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
    const vnode = {
      __v_isVNode: true,
      __v_skip: true,
      type: type2,
      props,
      key: props && normalizeKey(props),
      ref: props && normalizeRef(props),
      scopeId: currentScopeId,
      slotScopeIds: null,
      children,
      component: null,
      suspense: null,
      ssContent: null,
      ssFallback: null,
      dirs: null,
      transition: null,
      el: null,
      anchor: null,
      target: null,
      targetStart: null,
      targetAnchor: null,
      staticCount: 0,
      shapeFlag,
      patchFlag,
      dynamicProps,
      dynamicChildren: null,
      appContext: null,
      ctx: currentRenderingInstance
    };
    if (needFullChildrenNormalization) {
      normalizeChildren(vnode, children);
      if (shapeFlag & 128) {
        type2.normalize(vnode);
      }
    } else if (children) {
      vnode.shapeFlag |= isString(children) ? 8 : 16;
    }
    if (vnode.key !== vnode.key) {
      warn$1(`VNode created with invalid key (NaN). VNode type:`, vnode.type);
    }
    if (isBlockTreeEnabled > 0 && // avoid a block node from tracking itself
    !isBlockNode && // has current parent block
    currentBlock && // presence of a patch flag indicates this node needs patching on updates.
    // component nodes also should always be patched, because even if the
    // component doesn't need to update, it needs to persist the instance on to
    // the next vnode so that it can be properly unmounted later.
    (vnode.patchFlag > 0 || shapeFlag & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
    // vnode should not be considered dynamic due to handler caching.
    vnode.patchFlag !== 32) {
      currentBlock.push(vnode);
    }
    return vnode;
  }
  const createVNode = createVNodeWithArgsTransform;
  function _createVNode(type2, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
    if (!type2 || type2 === NULL_DYNAMIC_COMPONENT) {
      if (!type2) {
        warn$1(`Invalid vnode type when creating vnode: ${type2}.`);
      }
      type2 = Comment;
    }
    if (isVNode(type2)) {
      const cloned = cloneVNode(
        type2,
        props,
        true
        /* mergeRef: true */
      );
      if (children) {
        normalizeChildren(cloned, children);
      }
      if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
        if (cloned.shapeFlag & 6) {
          currentBlock[currentBlock.indexOf(type2)] = cloned;
        } else {
          currentBlock.push(cloned);
        }
      }
      cloned.patchFlag = -2;
      return cloned;
    }
    if (isClassComponent(type2)) {
      type2 = type2.__vccOpts;
    }
    if (props) {
      props = guardReactiveProps(props);
      let { class: klass, style } = props;
      if (klass && !isString(klass)) {
        props.class = normalizeClass(klass);
      }
      if (isObject(style)) {
        if (isProxy(style) && !isArray(style)) {
          style = extend({}, style);
        }
        props.style = normalizeStyle(style);
      }
    }
    const shapeFlag = isString(type2) ? 1 : isSuspense(type2) ? 128 : isTeleport(type2) ? 64 : isObject(type2) ? 4 : isFunction(type2) ? 2 : 0;
    if (shapeFlag & 4 && isProxy(type2)) {
      type2 = toRaw(type2);
      warn$1(
        `Vue received a Component that was made a reactive object. This can lead to unnecessary performance overhead and should be avoided by marking the component with \`markRaw\` or using \`shallowRef\` instead of \`ref\`.`,
        `
Component that was made reactive: `,
        type2
      );
    }
    return createBaseVNode(
      type2,
      props,
      children,
      patchFlag,
      dynamicProps,
      shapeFlag,
      isBlockNode,
      true
    );
  }
  function guardReactiveProps(props) {
    if (!props) return null;
    return isProxy(props) || isInternalObject(props) ? extend({}, props) : props;
  }
  function cloneVNode(vnode, extraProps, mergeRef = false, cloneTransition = false) {
    const { props, ref: ref3, patchFlag, children, transition } = vnode;
    const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
    const cloned = {
      __v_isVNode: true,
      __v_skip: true,
      type: vnode.type,
      props: mergedProps,
      key: mergedProps && normalizeKey(mergedProps),
      ref: extraProps && extraProps.ref ? (
        // #2078 in the case of <component :is="vnode" ref="extra"/>
        // if the vnode itself already has a ref, cloneVNode will need to merge
        // the refs so the single vnode can be set on multiple refs
        mergeRef && ref3 ? isArray(ref3) ? ref3.concat(normalizeRef(extraProps)) : [ref3, normalizeRef(extraProps)] : normalizeRef(extraProps)
      ) : ref3,
      scopeId: vnode.scopeId,
      slotScopeIds: vnode.slotScopeIds,
      children: patchFlag === -1 && isArray(children) ? children.map(deepCloneVNode) : children,
      target: vnode.target,
      targetStart: vnode.targetStart,
      targetAnchor: vnode.targetAnchor,
      staticCount: vnode.staticCount,
      shapeFlag: vnode.shapeFlag,
      // if the vnode is cloned with extra props, we can no longer assume its
      // existing patch flag to be reliable and need to add the FULL_PROPS flag.
      // note: preserve flag for fragments since they use the flag for children
      // fast paths only.
      patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
      dynamicProps: vnode.dynamicProps,
      dynamicChildren: vnode.dynamicChildren,
      appContext: vnode.appContext,
      dirs: vnode.dirs,
      transition,
      // These should technically only be non-null on mounted VNodes. However,
      // they *should* be copied for kept-alive vnodes. So we just always copy
      // them since them being non-null during a mount doesn't affect the logic as
      // they will simply be overwritten.
      component: vnode.component,
      suspense: vnode.suspense,
      ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
      ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
      el: vnode.el,
      anchor: vnode.anchor,
      ctx: vnode.ctx,
      ce: vnode.ce
    };
    if (transition && cloneTransition) {
      setTransitionHooks(
        cloned,
        transition.clone(cloned)
      );
    }
    return cloned;
  }
  function deepCloneVNode(vnode) {
    const cloned = cloneVNode(vnode);
    if (isArray(vnode.children)) {
      cloned.children = vnode.children.map(deepCloneVNode);
    }
    return cloned;
  }
  function createTextVNode(text = " ", flag = 0) {
    return createVNode(Text, null, text, flag);
  }
  function createStaticVNode(content2, numberOfNodes) {
    const vnode = createVNode(Static, null, content2);
    vnode.staticCount = numberOfNodes;
    return vnode;
  }
  function createCommentVNode(text = "", asBlock = false) {
    return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
  }
  function normalizeVNode(child) {
    if (child == null || typeof child === "boolean") {
      return createVNode(Comment);
    } else if (isArray(child)) {
      return createVNode(
        Fragment,
        null,
        // #3666, avoid reference pollution when reusing vnode
        child.slice()
      );
    } else if (isVNode(child)) {
      return cloneIfMounted(child);
    } else {
      return createVNode(Text, null, String(child));
    }
  }
  function cloneIfMounted(child) {
    return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
  }
  function normalizeChildren(vnode, children) {
    let type2 = 0;
    const { shapeFlag } = vnode;
    if (children == null) {
      children = null;
    } else if (isArray(children)) {
      type2 = 16;
    } else if (typeof children === "object") {
      if (shapeFlag & (1 | 64)) {
        const slot = children.default;
        if (slot) {
          slot._c && (slot._d = false);
          normalizeChildren(vnode, slot());
          slot._c && (slot._d = true);
        }
        return;
      } else {
        type2 = 32;
        const slotFlag = children._;
        if (!slotFlag && !isInternalObject(children)) {
          children._ctx = currentRenderingInstance;
        } else if (slotFlag === 3 && currentRenderingInstance) {
          if (currentRenderingInstance.slots._ === 1) {
            children._ = 1;
          } else {
            children._ = 2;
            vnode.patchFlag |= 1024;
          }
        }
      }
    } else if (isFunction(children)) {
      children = { default: children, _ctx: currentRenderingInstance };
      type2 = 32;
    } else {
      children = String(children);
      if (shapeFlag & 64) {
        type2 = 16;
        children = [createTextVNode(children)];
      } else {
        type2 = 8;
      }
    }
    vnode.children = children;
    vnode.shapeFlag |= type2;
  }
  function mergeProps(...args) {
    const ret = {};
    for (let i = 0; i < args.length; i++) {
      const toMerge = args[i];
      for (const key in toMerge) {
        if (key === "class") {
          if (ret.class !== toMerge.class) {
            ret.class = normalizeClass([ret.class, toMerge.class]);
          }
        } else if (key === "style") {
          ret.style = normalizeStyle([ret.style, toMerge.style]);
        } else if (isOn(key)) {
          const existing = ret[key];
          const incoming = toMerge[key];
          if (incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming))) {
            ret[key] = existing ? [].concat(existing, incoming) : incoming;
          }
        } else if (key !== "") {
          ret[key] = toMerge[key];
        }
      }
    }
    return ret;
  }
  function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
    callWithAsyncErrorHandling(hook, instance, 7, [
      vnode,
      prevVNode
    ]);
  }
  const emptyAppContext = createAppContext();
  let uid = 0;
  function createComponentInstance(vnode, parent, suspense) {
    const type2 = vnode.type;
    const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
    const instance = {
      uid: uid++,
      vnode,
      type: type2,
      parent,
      appContext,
      root: null,
      // to be immediately set
      next: null,
      subTree: null,
      // will be set synchronously right after creation
      effect: null,
      update: null,
      // will be set synchronously right after creation
      job: null,
      scope: new EffectScope(
        true
        /* detached */
      ),
      render: null,
      proxy: null,
      exposed: null,
      exposeProxy: null,
      withProxy: null,
      provides: parent ? parent.provides : Object.create(appContext.provides),
      ids: parent ? parent.ids : ["", 0, 0],
      accessCache: null,
      renderCache: [],
      // local resolved assets
      components: null,
      directives: null,
      // resolved props and emits options
      propsOptions: normalizePropsOptions(type2, appContext),
      emitsOptions: normalizeEmitsOptions(type2, appContext),
      // emit
      emit: null,
      // to be set immediately
      emitted: null,
      // props default value
      propsDefaults: EMPTY_OBJ,
      // inheritAttrs
      inheritAttrs: type2.inheritAttrs,
      // state
      ctx: EMPTY_OBJ,
      data: EMPTY_OBJ,
      props: EMPTY_OBJ,
      attrs: EMPTY_OBJ,
      slots: EMPTY_OBJ,
      refs: EMPTY_OBJ,
      setupState: EMPTY_OBJ,
      setupContext: null,
      // suspense related
      suspense,
      suspenseId: suspense ? suspense.pendingId : 0,
      asyncDep: null,
      asyncResolved: false,
      // lifecycle hooks
      // not using enums here because it results in computed properties
      isMounted: false,
      isUnmounted: false,
      isDeactivated: false,
      bc: null,
      c: null,
      bm: null,
      m: null,
      bu: null,
      u: null,
      um: null,
      bum: null,
      da: null,
      a: null,
      rtg: null,
      rtc: null,
      ec: null,
      sp: null
    };
    {
      instance.ctx = createDevRenderContext(instance);
    }
    instance.root = parent ? parent.root : instance;
    instance.emit = emit.bind(null, instance);
    if (vnode.ce) {
      vnode.ce(instance);
    }
    return instance;
  }
  let currentInstance = null;
  const getCurrentInstance = () => currentInstance || currentRenderingInstance;
  let internalSetCurrentInstance;
  let setInSSRSetupState;
  {
    const g = getGlobalThis();
    const registerGlobalSetter = (key, setter) => {
      let setters;
      if (!(setters = g[key])) setters = g[key] = [];
      setters.push(setter);
      return (v) => {
        if (setters.length > 1) setters.forEach((set) => set(v));
        else setters[0](v);
      };
    };
    internalSetCurrentInstance = registerGlobalSetter(
      `__VUE_INSTANCE_SETTERS__`,
      (v) => currentInstance = v
    );
    setInSSRSetupState = registerGlobalSetter(
      `__VUE_SSR_SETTERS__`,
      (v) => isInSSRComponentSetup = v
    );
  }
  const setCurrentInstance = (instance) => {
    const prev = currentInstance;
    internalSetCurrentInstance(instance);
    instance.scope.on();
    return () => {
      instance.scope.off();
      internalSetCurrentInstance(prev);
    };
  };
  const unsetCurrentInstance = () => {
    currentInstance && currentInstance.scope.off();
    internalSetCurrentInstance(null);
  };
  const isBuiltInTag = /* @__PURE__ */ makeMap("slot,component");
  function validateComponentName(name2, { isNativeTag }) {
    if (isBuiltInTag(name2) || isNativeTag(name2)) {
      warn$1(
        "Do not use built-in or reserved HTML elements as component id: " + name2
      );
    }
  }
  function isStatefulComponent(instance) {
    return instance.vnode.shapeFlag & 4;
  }
  let isInSSRComponentSetup = false;
  function setupComponent(instance, isSSR = false, optimized = false) {
    isSSR && setInSSRSetupState(isSSR);
    const { props, children } = instance.vnode;
    const isStateful = isStatefulComponent(instance);
    initProps(instance, props, isStateful, isSSR);
    initSlots(instance, children, optimized);
    const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
    isSSR && setInSSRSetupState(false);
    return setupResult;
  }
  function setupStatefulComponent(instance, isSSR) {
    var _a2;
    const Component = instance.type;
    {
      if (Component.name) {
        validateComponentName(Component.name, instance.appContext.config);
      }
      if (Component.components) {
        const names = Object.keys(Component.components);
        for (let i = 0; i < names.length; i++) {
          validateComponentName(names[i], instance.appContext.config);
        }
      }
      if (Component.directives) {
        const names = Object.keys(Component.directives);
        for (let i = 0; i < names.length; i++) {
          validateDirectiveName(names[i]);
        }
      }
      if (Component.compilerOptions && isRuntimeOnly()) {
        warn$1(
          `"compilerOptions" is only supported when using a build of Vue that includes the runtime compiler. Since you are using a runtime-only build, the options should be passed via your build tool config instead.`
        );
      }
    }
    instance.accessCache = /* @__PURE__ */ Object.create(null);
    instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
    {
      exposePropsOnRenderContext(instance);
    }
    const { setup } = Component;
    if (setup) {
      pauseTracking();
      const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
      const reset = setCurrentInstance(instance);
      const setupResult = callWithErrorHandling(
        setup,
        instance,
        0,
        [
          shallowReadonly(instance.props),
          setupContext
        ]
      );
      const isAsyncSetup = isPromise(setupResult);
      resetTracking();
      reset();
      if ((isAsyncSetup || instance.sp) && !isAsyncWrapper(instance)) {
        markAsyncBoundary(instance);
      }
      if (isAsyncSetup) {
        setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
        if (isSSR) {
          return setupResult.then((resolvedResult) => {
            handleSetupResult(instance, resolvedResult, isSSR);
          }).catch((e) => {
            handleError(e, instance, 0);
          });
        } else {
          instance.asyncDep = setupResult;
          if (!instance.suspense) {
            const name2 = (_a2 = Component.name) != null ? _a2 : "Anonymous";
            warn$1(
              `Component <${name2}>: setup function returned a promise, but no <Suspense> boundary was found in the parent component tree. A component with async setup() must be nested in a <Suspense> in order to be rendered.`
            );
          }
        }
      } else {
        handleSetupResult(instance, setupResult, isSSR);
      }
    } else {
      finishComponentSetup(instance, isSSR);
    }
  }
  function handleSetupResult(instance, setupResult, isSSR) {
    if (isFunction(setupResult)) {
      if (instance.type.__ssrInlineRender) {
        instance.ssrRender = setupResult;
      } else {
        instance.render = setupResult;
      }
    } else if (isObject(setupResult)) {
      if (isVNode(setupResult)) {
        warn$1(
          `setup() should not return VNodes directly - return a render function instead.`
        );
      }
      {
        instance.devtoolsRawSetupState = setupResult;
      }
      instance.setupState = proxyRefs(setupResult);
      {
        exposeSetupStateOnRenderContext(instance);
      }
    } else if (setupResult !== void 0) {
      warn$1(
        `setup() should return an object. Received: ${setupResult === null ? "null" : typeof setupResult}`
      );
    }
    finishComponentSetup(instance, isSSR);
  }
  let compile;
  const isRuntimeOnly = () => !compile;
  function finishComponentSetup(instance, isSSR, skipOptions) {
    const Component = instance.type;
    if (!instance.render) {
      instance.render = Component.render || NOOP;
    }
    {
      const reset = setCurrentInstance(instance);
      pauseTracking();
      try {
        applyOptions(instance);
      } finally {
        resetTracking();
        reset();
      }
    }
    if (!Component.render && instance.render === NOOP && !isSSR) {
      if (Component.template) {
        warn$1(
          `Component provided template option but runtime compilation is not supported in this build of Vue. Configure your bundler to alias "vue" to "vue/dist/vue.esm-bundler.js".`
        );
      } else {
        warn$1(`Component is missing template or render function: `, Component);
      }
    }
  }
  const attrsProxyHandlers = {
    get(target, key) {
      markAttrsAccessed();
      track(target, "get", "");
      return target[key];
    },
    set() {
      warn$1(`setupContext.attrs is readonly.`);
      return false;
    },
    deleteProperty() {
      warn$1(`setupContext.attrs is readonly.`);
      return false;
    }
  };
  function getSlotsProxy(instance) {
    return new Proxy(instance.slots, {
      get(target, key) {
        track(instance, "get", "$slots");
        return target[key];
      }
    });
  }
  function createSetupContext(instance) {
    const expose = (exposed) => {
      {
        if (instance.exposed) {
          warn$1(`expose() should be called only once per setup().`);
        }
        if (exposed != null) {
          let exposedType = typeof exposed;
          if (exposedType === "object") {
            if (isArray(exposed)) {
              exposedType = "array";
            } else if (isRef(exposed)) {
              exposedType = "ref";
            }
          }
          if (exposedType !== "object") {
            warn$1(
              `expose() should be passed a plain object, received ${exposedType}.`
            );
          }
        }
      }
      instance.exposed = exposed || {};
    };
    {
      let attrsProxy;
      let slotsProxy;
      return Object.freeze({
        get attrs() {
          return attrsProxy || (attrsProxy = new Proxy(instance.attrs, attrsProxyHandlers));
        },
        get slots() {
          return slotsProxy || (slotsProxy = getSlotsProxy(instance));
        },
        get emit() {
          return (event, ...args) => instance.emit(event, ...args);
        },
        expose
      });
    }
  }
  function getComponentPublicInstance(instance) {
    if (instance.exposed) {
      return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
        get(target, key) {
          if (key in target) {
            return target[key];
          } else if (key in publicPropertiesMap) {
            return publicPropertiesMap[key](instance);
          }
        },
        has(target, key) {
          return key in target || key in publicPropertiesMap;
        }
      }));
    } else {
      return instance.proxy;
    }
  }
  const classifyRE = /(?:^|[-_])(\w)/g;
  const classify = (str) => str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "");
  function getComponentName(Component, includeInferred = true) {
    return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
  }
  function formatComponentName(instance, Component, isRoot = false) {
    let name2 = getComponentName(Component);
    if (!name2 && Component.__file) {
      const match = Component.__file.match(/([^/\\]+)\.\w+$/);
      if (match) {
        name2 = match[1];
      }
    }
    if (!name2 && instance && instance.parent) {
      const inferFromRegistry = (registry) => {
        for (const key in registry) {
          if (registry[key] === Component) {
            return key;
          }
        }
      };
      name2 = inferFromRegistry(
        instance.components || instance.parent.type.components
      ) || inferFromRegistry(instance.appContext.components);
    }
    return name2 ? classify(name2) : isRoot ? `App` : `Anonymous`;
  }
  function isClassComponent(value) {
    return isFunction(value) && "__vccOpts" in value;
  }
  const computed = (getterOrOptions, debugOptions) => {
    const c = computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
    {
      const i = getCurrentInstance();
      if (i && i.appContext.config.warnRecursiveComputed) {
        c._warnRecursive = true;
      }
    }
    return c;
  };
  function initCustomFormatter() {
    if (typeof window === "undefined") {
      return;
    }
    const vueStyle = { style: "color:#3ba776" };
    const numberStyle = { style: "color:#1677ff" };
    const stringStyle = { style: "color:#f5222d" };
    const keywordStyle = { style: "color:#eb2f96" };
    const formatter = {
      __vue_custom_formatter: true,
      header(obj) {
        if (!isObject(obj)) {
          return null;
        }
        if (obj.__isVue) {
          return ["div", vueStyle, `VueInstance`];
        } else if (isRef(obj)) {
          return [
            "div",
            {},
            ["span", vueStyle, genRefFlag(obj)],
            "<",
            // avoid debugger accessing value affecting behavior
            formatValue("_value" in obj ? obj._value : obj),
            `>`
          ];
        } else if (isReactive(obj)) {
          return [
            "div",
            {},
            ["span", vueStyle, isShallow(obj) ? "ShallowReactive" : "Reactive"],
            "<",
            formatValue(obj),
            `>${isReadonly(obj) ? ` (readonly)` : ``}`
          ];
        } else if (isReadonly(obj)) {
          return [
            "div",
            {},
            ["span", vueStyle, isShallow(obj) ? "ShallowReadonly" : "Readonly"],
            "<",
            formatValue(obj),
            ">"
          ];
        }
        return null;
      },
      hasBody(obj) {
        return obj && obj.__isVue;
      },
      body(obj) {
        if (obj && obj.__isVue) {
          return [
            "div",
            {},
            ...formatInstance(obj.$)
          ];
        }
      }
    };
    function formatInstance(instance) {
      const blocks = [];
      if (instance.type.props && instance.props) {
        blocks.push(createInstanceBlock("props", toRaw(instance.props)));
      }
      if (instance.setupState !== EMPTY_OBJ) {
        blocks.push(createInstanceBlock("setup", instance.setupState));
      }
      if (instance.data !== EMPTY_OBJ) {
        blocks.push(createInstanceBlock("data", toRaw(instance.data)));
      }
      const computed2 = extractKeys(instance, "computed");
      if (computed2) {
        blocks.push(createInstanceBlock("computed", computed2));
      }
      const injected = extractKeys(instance, "inject");
      if (injected) {
        blocks.push(createInstanceBlock("injected", injected));
      }
      blocks.push([
        "div",
        {},
        [
          "span",
          {
            style: keywordStyle.style + ";opacity:0.66"
          },
          "$ (internal): "
        ],
        ["object", { object: instance }]
      ]);
      return blocks;
    }
    function createInstanceBlock(type2, target) {
      target = extend({}, target);
      if (!Object.keys(target).length) {
        return ["span", {}];
      }
      return [
        "div",
        { style: "line-height:1.25em;margin-bottom:0.6em" },
        [
          "div",
          {
            style: "color:#476582"
          },
          type2
        ],
        [
          "div",
          {
            style: "padding-left:1.25em"
          },
          ...Object.keys(target).map((key) => {
            return [
              "div",
              {},
              ["span", keywordStyle, key + ": "],
              formatValue(target[key], false)
            ];
          })
        ]
      ];
    }
    function formatValue(v, asRaw = true) {
      if (typeof v === "number") {
        return ["span", numberStyle, v];
      } else if (typeof v === "string") {
        return ["span", stringStyle, JSON.stringify(v)];
      } else if (typeof v === "boolean") {
        return ["span", keywordStyle, v];
      } else if (isObject(v)) {
        return ["object", { object: asRaw ? toRaw(v) : v }];
      } else {
        return ["span", stringStyle, String(v)];
      }
    }
    function extractKeys(instance, type2) {
      const Comp = instance.type;
      if (isFunction(Comp)) {
        return;
      }
      const extracted = {};
      for (const key in instance.ctx) {
        if (isKeyOfType(Comp, key, type2)) {
          extracted[key] = instance.ctx[key];
        }
      }
      return extracted;
    }
    function isKeyOfType(Comp, key, type2) {
      const opts = Comp[type2];
      if (isArray(opts) && opts.includes(key) || isObject(opts) && key in opts) {
        return true;
      }
      if (Comp.extends && isKeyOfType(Comp.extends, key, type2)) {
        return true;
      }
      if (Comp.mixins && Comp.mixins.some((m) => isKeyOfType(m, key, type2))) {
        return true;
      }
    }
    function genRefFlag(v) {
      if (isShallow(v)) {
        return `ShallowRef`;
      }
      if (v.effect) {
        return `ComputedRef`;
      }
      return `Ref`;
    }
    if (window.devtoolsFormatters) {
      window.devtoolsFormatters.push(formatter);
    } else {
      window.devtoolsFormatters = [formatter];
    }
  }
  const version$1 = "3.5.13";
  const warn = warn$1;
  /**
  * @vue/runtime-dom v3.5.13
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
  let policy = void 0;
  const tt = typeof window !== "undefined" && window.trustedTypes;
  if (tt) {
    try {
      policy = /* @__PURE__ */ tt.createPolicy("vue", {
        createHTML: (val) => val
      });
    } catch (e) {
      warn(`Error creating trusted types policy: ${e}`);
    }
  }
  const unsafeToTrustedHTML = policy ? (val) => policy.createHTML(val) : (val) => val;
  const svgNS = "http://www.w3.org/2000/svg";
  const mathmlNS = "http://www.w3.org/1998/Math/MathML";
  const doc = typeof document !== "undefined" ? document : null;
  const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
  const nodeOps = {
    insert: (child, parent, anchor) => {
      parent.insertBefore(child, anchor || null);
    },
    remove: (child) => {
      const parent = child.parentNode;
      if (parent) {
        parent.removeChild(child);
      }
    },
    createElement: (tag2, namespace, is, props) => {
      const el = namespace === "svg" ? doc.createElementNS(svgNS, tag2) : namespace === "mathml" ? doc.createElementNS(mathmlNS, tag2) : is ? doc.createElement(tag2, { is }) : doc.createElement(tag2);
      if (tag2 === "select" && props && props.multiple != null) {
        el.setAttribute("multiple", props.multiple);
      }
      return el;
    },
    createText: (text) => doc.createTextNode(text),
    createComment: (text) => doc.createComment(text),
    setText: (node, text) => {
      node.nodeValue = text;
    },
    setElementText: (el, text) => {
      el.textContent = text;
    },
    parentNode: (node) => node.parentNode,
    nextSibling: (node) => node.nextSibling,
    querySelector: (selector) => doc.querySelector(selector),
    setScopeId(el, id) {
      el.setAttribute(id, "");
    },
    // __UNSAFE__
    // Reason: innerHTML.
    // Static content here can only come from compiled templates.
    // As long as the user only uses trusted templates, this is safe.
    insertStaticContent(content2, parent, anchor, namespace, start, end) {
      const before = anchor ? anchor.previousSibling : parent.lastChild;
      if (start && (start === end || start.nextSibling)) {
        while (true) {
          parent.insertBefore(start.cloneNode(true), anchor);
          if (start === end || !(start = start.nextSibling)) break;
        }
      } else {
        templateContainer.innerHTML = unsafeToTrustedHTML(
          namespace === "svg" ? `<svg>${content2}</svg>` : namespace === "mathml" ? `<math>${content2}</math>` : content2
        );
        const template = templateContainer.content;
        if (namespace === "svg" || namespace === "mathml") {
          const wrapper = template.firstChild;
          while (wrapper.firstChild) {
            template.appendChild(wrapper.firstChild);
          }
          template.removeChild(wrapper);
        }
        parent.insertBefore(template, anchor);
      }
      return [
        // first
        before ? before.nextSibling : parent.firstChild,
        // last
        anchor ? anchor.previousSibling : parent.lastChild
      ];
    }
  };
  const vtcKey = Symbol("_vtc");
  function patchClass(el, value, isSVG) {
    const transitionClasses = el[vtcKey];
    if (transitionClasses) {
      value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
    }
    if (value == null) {
      el.removeAttribute("class");
    } else if (isSVG) {
      el.setAttribute("class", value);
    } else {
      el.className = value;
    }
  }
  const vShowOriginalDisplay = Symbol("_vod");
  const vShowHidden = Symbol("_vsh");
  const vShow = {
    beforeMount(el, { value }, { transition }) {
      el[vShowOriginalDisplay] = el.style.display === "none" ? "" : el.style.display;
      if (transition && value) {
        transition.beforeEnter(el);
      } else {
        setDisplay(el, value);
      }
    },
    mounted(el, { value }, { transition }) {
      if (transition && value) {
        transition.enter(el);
      }
    },
    updated(el, { value, oldValue }, { transition }) {
      if (!value === !oldValue) return;
      if (transition) {
        if (value) {
          transition.beforeEnter(el);
          setDisplay(el, true);
          transition.enter(el);
        } else {
          transition.leave(el, () => {
            setDisplay(el, false);
          });
        }
      } else {
        setDisplay(el, value);
      }
    },
    beforeUnmount(el, { value }) {
      setDisplay(el, value);
    }
  };
  {
    vShow.name = "show";
  }
  function setDisplay(el, value) {
    el.style.display = value ? el[vShowOriginalDisplay] : "none";
    el[vShowHidden] = !value;
  }
  const CSS_VAR_TEXT = Symbol("CSS_VAR_TEXT");
  const displayRE = /(^|;)\s*display\s*:/;
  function patchStyle(el, prev, next) {
    const style = el.style;
    const isCssString = isString(next);
    let hasControlledDisplay = false;
    if (next && !isCssString) {
      if (prev) {
        if (!isString(prev)) {
          for (const key in prev) {
            if (next[key] == null) {
              setStyle(style, key, "");
            }
          }
        } else {
          for (const prevStyle of prev.split(";")) {
            const key = prevStyle.slice(0, prevStyle.indexOf(":")).trim();
            if (next[key] == null) {
              setStyle(style, key, "");
            }
          }
        }
      }
      for (const key in next) {
        if (key === "display") {
          hasControlledDisplay = true;
        }
        setStyle(style, key, next[key]);
      }
    } else {
      if (isCssString) {
        if (prev !== next) {
          const cssVarText = style[CSS_VAR_TEXT];
          if (cssVarText) {
            next += ";" + cssVarText;
          }
          style.cssText = next;
          hasControlledDisplay = displayRE.test(next);
        }
      } else if (prev) {
        el.removeAttribute("style");
      }
    }
    if (vShowOriginalDisplay in el) {
      el[vShowOriginalDisplay] = hasControlledDisplay ? style.display : "";
      if (el[vShowHidden]) {
        style.display = "none";
      }
    }
  }
  const semicolonRE = /[^\\];\s*$/;
  const importantRE = /\s*!important$/;
  function setStyle(style, name2, val) {
    if (isArray(val)) {
      val.forEach((v) => setStyle(style, name2, v));
    } else {
      if (val == null) val = "";
      {
        if (semicolonRE.test(val)) {
          warn(
            `Unexpected semicolon at the end of '${name2}' style value: '${val}'`
          );
        }
      }
      if (name2.startsWith("--")) {
        style.setProperty(name2, val);
      } else {
        const prefixed = autoPrefix(style, name2);
        if (importantRE.test(val)) {
          style.setProperty(
            hyphenate(prefixed),
            val.replace(importantRE, ""),
            "important"
          );
        } else {
          style[prefixed] = val;
        }
      }
    }
  }
  const prefixes = ["Webkit", "Moz", "ms"];
  const prefixCache = {};
  function autoPrefix(style, rawName) {
    const cached = prefixCache[rawName];
    if (cached) {
      return cached;
    }
    let name2 = camelize(rawName);
    if (name2 !== "filter" && name2 in style) {
      return prefixCache[rawName] = name2;
    }
    name2 = capitalize(name2);
    for (let i = 0; i < prefixes.length; i++) {
      const prefixed = prefixes[i] + name2;
      if (prefixed in style) {
        return prefixCache[rawName] = prefixed;
      }
    }
    return rawName;
  }
  const xlinkNS = "http://www.w3.org/1999/xlink";
  function patchAttr(el, key, value, isSVG, instance, isBoolean2 = isSpecialBooleanAttr(key)) {
    if (isSVG && key.startsWith("xlink:")) {
      if (value == null) {
        el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
      } else {
        el.setAttributeNS(xlinkNS, key, value);
      }
    } else {
      if (value == null || isBoolean2 && !includeBooleanAttr(value)) {
        el.removeAttribute(key);
      } else {
        el.setAttribute(
          key,
          isBoolean2 ? "" : isSymbol(value) ? String(value) : value
        );
      }
    }
  }
  function patchDOMProp(el, key, value, parentComponent, attrName) {
    if (key === "innerHTML" || key === "textContent") {
      if (value != null) {
        el[key] = key === "innerHTML" ? unsafeToTrustedHTML(value) : value;
      }
      return;
    }
    const tag2 = el.tagName;
    if (key === "value" && tag2 !== "PROGRESS" && // custom elements may use _value internally
    !tag2.includes("-")) {
      const oldValue = tag2 === "OPTION" ? el.getAttribute("value") || "" : el.value;
      const newValue = value == null ? (
        // #11647: value should be set as empty string for null and undefined,
        // but <input type="checkbox"> should be set as 'on'.
        el.type === "checkbox" ? "on" : ""
      ) : String(value);
      if (oldValue !== newValue || !("_value" in el)) {
        el.value = newValue;
      }
      if (value == null) {
        el.removeAttribute(key);
      }
      el._value = value;
      return;
    }
    let needRemove = false;
    if (value === "" || value == null) {
      const type2 = typeof el[key];
      if (type2 === "boolean") {
        value = includeBooleanAttr(value);
      } else if (value == null && type2 === "string") {
        value = "";
        needRemove = true;
      } else if (type2 === "number") {
        value = 0;
        needRemove = true;
      }
    }
    try {
      el[key] = value;
    } catch (e) {
      if (!needRemove) {
        warn(
          `Failed setting prop "${key}" on <${tag2.toLowerCase()}>: value ${value} is invalid.`,
          e
        );
      }
    }
    needRemove && el.removeAttribute(attrName || key);
  }
  function addEventListener$1(el, event, handler, options) {
    el.addEventListener(event, handler, options);
  }
  function removeEventListener$1(el, event, handler, options) {
    el.removeEventListener(event, handler, options);
  }
  const veiKey = Symbol("_vei");
  function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
    const invokers = el[veiKey] || (el[veiKey] = {});
    const existingInvoker = invokers[rawName];
    if (nextValue && existingInvoker) {
      existingInvoker.value = sanitizeEventValue(nextValue, rawName);
    } else {
      const [name2, options] = parseName(rawName);
      if (nextValue) {
        const invoker = invokers[rawName] = createInvoker(
          sanitizeEventValue(nextValue, rawName),
          instance
        );
        addEventListener$1(el, name2, invoker, options);
      } else if (existingInvoker) {
        removeEventListener$1(el, name2, existingInvoker, options);
        invokers[rawName] = void 0;
      }
    }
  }
  const optionsModifierRE = /(?:Once|Passive|Capture)$/;
  function parseName(name2) {
    let options;
    if (optionsModifierRE.test(name2)) {
      options = {};
      let m;
      while (m = name2.match(optionsModifierRE)) {
        name2 = name2.slice(0, name2.length - m[0].length);
        options[m[0].toLowerCase()] = true;
      }
    }
    const event = name2[2] === ":" ? name2.slice(3) : hyphenate(name2.slice(2));
    return [event, options];
  }
  let cachedNow = 0;
  const p = /* @__PURE__ */ Promise.resolve();
  const getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
  function createInvoker(initialValue, instance) {
    const invoker = (e) => {
      if (!e._vts) {
        e._vts = Date.now();
      } else if (e._vts <= invoker.attached) {
        return;
      }
      callWithAsyncErrorHandling(
        patchStopImmediatePropagation(e, invoker.value),
        instance,
        5,
        [e]
      );
    };
    invoker.value = initialValue;
    invoker.attached = getNow();
    return invoker;
  }
  function sanitizeEventValue(value, propName) {
    if (isFunction(value) || isArray(value)) {
      return value;
    }
    warn(
      `Wrong type passed as event handler to ${propName} - did you forget @ or : in front of your prop?
Expected function or array of functions, received type ${typeof value}.`
    );
    return NOOP;
  }
  function patchStopImmediatePropagation(e, value) {
    if (isArray(value)) {
      const originalStop = e.stopImmediatePropagation;
      e.stopImmediatePropagation = () => {
        originalStop.call(e);
        e._stopped = true;
      };
      return value.map(
        (fn) => (e2) => !e2._stopped && fn && fn(e2)
      );
    } else {
      return value;
    }
  }
  const isNativeOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // lowercase letter
  key.charCodeAt(2) > 96 && key.charCodeAt(2) < 123;
  const patchProp = (el, key, prevValue, nextValue, namespace, parentComponent) => {
    const isSVG = namespace === "svg";
    if (key === "class") {
      patchClass(el, nextValue, isSVG);
    } else if (key === "style") {
      patchStyle(el, prevValue, nextValue);
    } else if (isOn(key)) {
      if (!isModelListener(key)) {
        patchEvent(el, key, prevValue, nextValue, parentComponent);
      }
    } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
      patchDOMProp(el, key, nextValue);
      if (!el.tagName.includes("-") && (key === "value" || key === "checked" || key === "selected")) {
        patchAttr(el, key, nextValue, isSVG, parentComponent, key !== "value");
      }
    } else if (
      // #11081 force set props for possible async custom element
      el._isVueCE && (/[A-Z]/.test(key) || !isString(nextValue))
    ) {
      patchDOMProp(el, camelize(key), nextValue, parentComponent, key);
    } else {
      if (key === "true-value") {
        el._trueValue = nextValue;
      } else if (key === "false-value") {
        el._falseValue = nextValue;
      }
      patchAttr(el, key, nextValue, isSVG);
    }
  };
  function shouldSetAsProp(el, key, value, isSVG) {
    if (isSVG) {
      if (key === "innerHTML" || key === "textContent") {
        return true;
      }
      if (key in el && isNativeOn(key) && isFunction(value)) {
        return true;
      }
      return false;
    }
    if (key === "spellcheck" || key === "draggable" || key === "translate") {
      return false;
    }
    if (key === "form") {
      return false;
    }
    if (key === "list" && el.tagName === "INPUT") {
      return false;
    }
    if (key === "type" && el.tagName === "TEXTAREA") {
      return false;
    }
    if (key === "width" || key === "height") {
      const tag2 = el.tagName;
      if (tag2 === "IMG" || tag2 === "VIDEO" || tag2 === "CANVAS" || tag2 === "SOURCE") {
        return false;
      }
    }
    if (isNativeOn(key) && isString(value)) {
      return false;
    }
    return key in el;
  }
  const getModelAssigner = (vnode) => {
    const fn = vnode.props["onUpdate:modelValue"] || false;
    return isArray(fn) ? (value) => invokeArrayFns(fn, value) : fn;
  };
  function onCompositionStart(e) {
    e.target.composing = true;
  }
  function onCompositionEnd(e) {
    const target = e.target;
    if (target.composing) {
      target.composing = false;
      target.dispatchEvent(new Event("input"));
    }
  }
  const assignKey = Symbol("_assign");
  const vModelText = {
    created(el, { modifiers: { lazy, trim, number } }, vnode) {
      el[assignKey] = getModelAssigner(vnode);
      const castToNumber = number || vnode.props && vnode.props.type === "number";
      addEventListener$1(el, lazy ? "change" : "input", (e) => {
        if (e.target.composing) return;
        let domValue = el.value;
        if (trim) {
          domValue = domValue.trim();
        }
        if (castToNumber) {
          domValue = looseToNumber(domValue);
        }
        el[assignKey](domValue);
      });
      if (trim) {
        addEventListener$1(el, "change", () => {
          el.value = el.value.trim();
        });
      }
      if (!lazy) {
        addEventListener$1(el, "compositionstart", onCompositionStart);
        addEventListener$1(el, "compositionend", onCompositionEnd);
        addEventListener$1(el, "change", onCompositionEnd);
      }
    },
    // set value on mounted so it's after min/max for type="range"
    mounted(el, { value }) {
      el.value = value == null ? "" : value;
    },
    beforeUpdate(el, { value, oldValue, modifiers: { lazy, trim, number } }, vnode) {
      el[assignKey] = getModelAssigner(vnode);
      if (el.composing) return;
      const elValue = (number || el.type === "number") && !/^0\d/.test(el.value) ? looseToNumber(el.value) : el.value;
      const newValue = value == null ? "" : value;
      if (elValue === newValue) {
        return;
      }
      if (document.activeElement === el && el.type !== "range") {
        if (lazy && value === oldValue) {
          return;
        }
        if (trim && el.value.trim() === newValue) {
          return;
        }
      }
      el.value = newValue;
    }
  };
  const vModelCheckbox = {
    // #4096 array checkboxes need to be deep traversed
    deep: true,
    created(el, _, vnode) {
      el[assignKey] = getModelAssigner(vnode);
      addEventListener$1(el, "change", () => {
        const modelValue = el._modelValue;
        const elementValue = getValue(el);
        const checked = el.checked;
        const assign = el[assignKey];
        if (isArray(modelValue)) {
          const index = looseIndexOf(modelValue, elementValue);
          const found = index !== -1;
          if (checked && !found) {
            assign(modelValue.concat(elementValue));
          } else if (!checked && found) {
            const filtered = [...modelValue];
            filtered.splice(index, 1);
            assign(filtered);
          }
        } else if (isSet(modelValue)) {
          const cloned = new Set(modelValue);
          if (checked) {
            cloned.add(elementValue);
          } else {
            cloned.delete(elementValue);
          }
          assign(cloned);
        } else {
          assign(getCheckboxValue(el, checked));
        }
      });
    },
    // set initial checked on mount to wait for true-value/false-value
    mounted: setChecked,
    beforeUpdate(el, binding, vnode) {
      el[assignKey] = getModelAssigner(vnode);
      setChecked(el, binding, vnode);
    }
  };
  function setChecked(el, { value, oldValue }, vnode) {
    el._modelValue = value;
    let checked;
    if (isArray(value)) {
      checked = looseIndexOf(value, vnode.props.value) > -1;
    } else if (isSet(value)) {
      checked = value.has(vnode.props.value);
    } else {
      if (value === oldValue) return;
      checked = looseEqual(value, getCheckboxValue(el, true));
    }
    if (el.checked !== checked) {
      el.checked = checked;
    }
  }
  const vModelRadio = {
    created(el, { value }, vnode) {
      el.checked = looseEqual(value, vnode.props.value);
      el[assignKey] = getModelAssigner(vnode);
      addEventListener$1(el, "change", () => {
        el[assignKey](getValue(el));
      });
    },
    beforeUpdate(el, { value, oldValue }, vnode) {
      el[assignKey] = getModelAssigner(vnode);
      if (value !== oldValue) {
        el.checked = looseEqual(value, vnode.props.value);
      }
    }
  };
  const vModelSelect = {
    // <select multiple> value need to be deep traversed
    deep: true,
    created(el, { value, modifiers: { number } }, vnode) {
      const isSetModel = isSet(value);
      addEventListener$1(el, "change", () => {
        const selectedVal = Array.prototype.filter.call(el.options, (o) => o.selected).map(
          (o) => number ? looseToNumber(getValue(o)) : getValue(o)
        );
        el[assignKey](
          el.multiple ? isSetModel ? new Set(selectedVal) : selectedVal : selectedVal[0]
        );
        el._assigning = true;
        nextTick(() => {
          el._assigning = false;
        });
      });
      el[assignKey] = getModelAssigner(vnode);
    },
    // set value in mounted & updated because <select> relies on its children
    // <option>s.
    mounted(el, { value }) {
      setSelected(el, value);
    },
    beforeUpdate(el, _binding, vnode) {
      el[assignKey] = getModelAssigner(vnode);
    },
    updated(el, { value }) {
      if (!el._assigning) {
        setSelected(el, value);
      }
    }
  };
  function setSelected(el, value) {
    const isMultiple = el.multiple;
    const isArrayValue = isArray(value);
    if (isMultiple && !isArrayValue && !isSet(value)) {
      warn(
        `<select multiple v-model> expects an Array or Set value for its binding, but got ${Object.prototype.toString.call(value).slice(8, -1)}.`
      );
      return;
    }
    for (let i = 0, l = el.options.length; i < l; i++) {
      const option = el.options[i];
      const optionValue = getValue(option);
      if (isMultiple) {
        if (isArrayValue) {
          const optionType = typeof optionValue;
          if (optionType === "string" || optionType === "number") {
            option.selected = value.some((v) => String(v) === String(optionValue));
          } else {
            option.selected = looseIndexOf(value, optionValue) > -1;
          }
        } else {
          option.selected = value.has(optionValue);
        }
      } else if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) el.selectedIndex = i;
        return;
      }
    }
    if (!isMultiple && el.selectedIndex !== -1) {
      el.selectedIndex = -1;
    }
  }
  function getValue(el) {
    return "_value" in el ? el._value : el.value;
  }
  function getCheckboxValue(el, checked) {
    const key = checked ? "_trueValue" : "_falseValue";
    return key in el ? el[key] : checked;
  }
  const rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
  let renderer;
  function ensureRenderer() {
    return renderer || (renderer = createRenderer(rendererOptions));
  }
  const createApp = (...args) => {
    const app = ensureRenderer().createApp(...args);
    {
      injectNativeTagCheck(app);
      injectCompilerOptionsCheck(app);
    }
    const { mount } = app;
    app.mount = (containerOrSelector) => {
      const container = normalizeContainer(containerOrSelector);
      if (!container) return;
      const component = app._component;
      if (!isFunction(component) && !component.render && !component.template) {
        component.template = container.innerHTML;
      }
      if (container.nodeType === 1) {
        container.textContent = "";
      }
      const proxy = mount(container, false, resolveRootNamespace(container));
      if (container instanceof Element) {
        container.removeAttribute("v-cloak");
        container.setAttribute("data-v-app", "");
      }
      return proxy;
    };
    return app;
  };
  function resolveRootNamespace(container) {
    if (container instanceof SVGElement) {
      return "svg";
    }
    if (typeof MathMLElement === "function" && container instanceof MathMLElement) {
      return "mathml";
    }
  }
  function injectNativeTagCheck(app) {
    Object.defineProperty(app.config, "isNativeTag", {
      value: (tag2) => isHTMLTag(tag2) || isSVGTag(tag2) || isMathMLTag(tag2),
      writable: false
    });
  }
  function injectCompilerOptionsCheck(app) {
    {
      const isCustomElement = app.config.isCustomElement;
      Object.defineProperty(app.config, "isCustomElement", {
        get() {
          return isCustomElement;
        },
        set() {
          warn(
            `The \`isCustomElement\` config option is deprecated. Use \`compilerOptions.isCustomElement\` instead.`
          );
        }
      });
      const compilerOptions = app.config.compilerOptions;
      const msg = `The \`compilerOptions\` config option is only respected when using a build of Vue.js that includes the runtime compiler (aka "full build"). Since you are using the runtime-only build, \`compilerOptions\` must be passed to \`@vue/compiler-dom\` in the build setup instead.
- For vue-loader: pass it via vue-loader's \`compilerOptions\` loader option.
- For vue-cli: see https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader
- For vite: pass it via @vitejs/plugin-vue options. See https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#example-for-passing-options-to-vuecompiler-sfc`;
      Object.defineProperty(app.config, "compilerOptions", {
        get() {
          warn(msg);
          return compilerOptions;
        },
        set() {
          warn(msg);
        }
      });
    }
  }
  function normalizeContainer(container) {
    if (isString(container)) {
      const res = document.querySelector(container);
      if (!res) {
        warn(
          `Failed to mount app: mount target selector "${container}" returned null.`
        );
      }
      return res;
    }
    if (window.ShadowRoot && container instanceof window.ShadowRoot && container.mode === "closed") {
      warn(
        `mounting on a ShadowRoot with \`{mode: "closed"}\` may lead to unpredictable bugs`
      );
    }
    return container;
  }
  /**
  * vue v3.5.13
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
  function initDev() {
    {
      initCustomFormatter();
    }
  }
  {
    initDev();
  }
  var jquery$1 = { exports: {} };
  /*!
   * jQuery JavaScript Library v3.7.1
   * https://jquery.com/
   *
   * Copyright OpenJS Foundation and other contributors
   * Released under the MIT license
   * https://jquery.org/license
   *
   * Date: 2023-08-28T13:37Z
   */
  var jquery = jquery$1.exports;
  var hasRequiredJquery;
  function requireJquery() {
    if (hasRequiredJquery) return jquery$1.exports;
    hasRequiredJquery = 1;
    (function(module) {
      (function(global2, factory) {
        {
          module.exports = global2.document ? factory(global2, true) : function(w) {
            if (!w.document) {
              throw new Error("jQuery requires a window with a document");
            }
            return factory(w);
          };
        }
      })(typeof window !== "undefined" ? window : jquery, function(window2, noGlobal) {
        var arr = [];
        var getProto2 = Object.getPrototypeOf;
        var slice = arr.slice;
        var flat = arr.flat ? function(array) {
          return arr.flat.call(array);
        } : function(array) {
          return arr.concat.apply([], array);
        };
        var push = arr.push;
        var indexOf = arr.indexOf;
        var class2type = {};
        var toString = class2type.toString;
        var hasOwn2 = class2type.hasOwnProperty;
        var fnToString = hasOwn2.toString;
        var ObjectFunctionString = fnToString.call(Object);
        var support = {};
        var isFunction2 = function isFunction3(obj) {
          return typeof obj === "function" && typeof obj.nodeType !== "number" && typeof obj.item !== "function";
        };
        var isWindow = function isWindow2(obj) {
          return obj != null && obj === obj.window;
        };
        var document2 = window2.document;
        var preservedScriptAttributes = {
          type: true,
          src: true,
          nonce: true,
          noModule: true
        };
        function DOMEval(code, node, doc2) {
          doc2 = doc2 || document2;
          var i, val, script = doc2.createElement("script");
          script.text = code;
          if (node) {
            for (i in preservedScriptAttributes) {
              val = node[i] || node.getAttribute && node.getAttribute(i);
              if (val) {
                script.setAttribute(i, val);
              }
            }
          }
          doc2.head.appendChild(script).parentNode.removeChild(script);
        }
        function toType(obj) {
          if (obj == null) {
            return obj + "";
          }
          return typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
        }
        var version2 = "3.7.1", rhtmlSuffix = /HTML$/i, jQuery = function(selector, context) {
          return new jQuery.fn.init(selector, context);
        };
        jQuery.fn = jQuery.prototype = {
          // The current version of jQuery being used
          jquery: version2,
          constructor: jQuery,
          // The default length of a jQuery object is 0
          length: 0,
          toArray: function() {
            return slice.call(this);
          },
          // Get the Nth element in the matched element set OR
          // Get the whole matched element set as a clean array
          get: function(num) {
            if (num == null) {
              return slice.call(this);
            }
            return num < 0 ? this[num + this.length] : this[num];
          },
          // Take an array of elements and push it onto the stack
          // (returning the new matched element set)
          pushStack: function(elems) {
            var ret = jQuery.merge(this.constructor(), elems);
            ret.prevObject = this;
            return ret;
          },
          // Execute a callback for every element in the matched set.
          each: function(callback) {
            return jQuery.each(this, callback);
          },
          map: function(callback) {
            return this.pushStack(jQuery.map(this, function(elem, i) {
              return callback.call(elem, i, elem);
            }));
          },
          slice: function() {
            return this.pushStack(slice.apply(this, arguments));
          },
          first: function() {
            return this.eq(0);
          },
          last: function() {
            return this.eq(-1);
          },
          even: function() {
            return this.pushStack(jQuery.grep(this, function(_elem, i) {
              return (i + 1) % 2;
            }));
          },
          odd: function() {
            return this.pushStack(jQuery.grep(this, function(_elem, i) {
              return i % 2;
            }));
          },
          eq: function(i) {
            var len = this.length, j = +i + (i < 0 ? len : 0);
            return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
          },
          end: function() {
            return this.prevObject || this.constructor();
          },
          // For internal use only.
          // Behaves like an Array's method, not like a jQuery method.
          push,
          sort: arr.sort,
          splice: arr.splice
        };
        jQuery.extend = jQuery.fn.extend = function() {
          var options, name2, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;
          if (typeof target === "boolean") {
            deep = target;
            target = arguments[i] || {};
            i++;
          }
          if (typeof target !== "object" && !isFunction2(target)) {
            target = {};
          }
          if (i === length) {
            target = this;
            i--;
          }
          for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
              for (name2 in options) {
                copy = options[name2];
                if (name2 === "__proto__" || target === copy) {
                  continue;
                }
                if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                  src = target[name2];
                  if (copyIsArray && !Array.isArray(src)) {
                    clone = [];
                  } else if (!copyIsArray && !jQuery.isPlainObject(src)) {
                    clone = {};
                  } else {
                    clone = src;
                  }
                  copyIsArray = false;
                  target[name2] = jQuery.extend(deep, clone, copy);
                } else if (copy !== void 0) {
                  target[name2] = copy;
                }
              }
            }
          }
          return target;
        };
        jQuery.extend({
          // Unique for each copy of jQuery on the page
          expando: "jQuery" + (version2 + Math.random()).replace(/\D/g, ""),
          // Assume jQuery is ready without the ready module
          isReady: true,
          error: function(msg) {
            throw new Error(msg);
          },
          noop: function() {
          },
          isPlainObject: function(obj) {
            var proto, Ctor;
            if (!obj || toString.call(obj) !== "[object Object]") {
              return false;
            }
            proto = getProto2(obj);
            if (!proto) {
              return true;
            }
            Ctor = hasOwn2.call(proto, "constructor") && proto.constructor;
            return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
          },
          isEmptyObject: function(obj) {
            var name2;
            for (name2 in obj) {
              return false;
            }
            return true;
          },
          // Evaluates a script in a provided context; falls back to the global one
          // if not specified.
          globalEval: function(code, options, doc2) {
            DOMEval(code, { nonce: options && options.nonce }, doc2);
          },
          each: function(obj, callback) {
            var length, i = 0;
            if (isArrayLike(obj)) {
              length = obj.length;
              for (; i < length; i++) {
                if (callback.call(obj[i], i, obj[i]) === false) {
                  break;
                }
              }
            } else {
              for (i in obj) {
                if (callback.call(obj[i], i, obj[i]) === false) {
                  break;
                }
              }
            }
            return obj;
          },
          // Retrieve the text value of an array of DOM nodes
          text: function(elem) {
            var node, ret = "", i = 0, nodeType = elem.nodeType;
            if (!nodeType) {
              while (node = elem[i++]) {
                ret += jQuery.text(node);
              }
            }
            if (nodeType === 1 || nodeType === 11) {
              return elem.textContent;
            }
            if (nodeType === 9) {
              return elem.documentElement.textContent;
            }
            if (nodeType === 3 || nodeType === 4) {
              return elem.nodeValue;
            }
            return ret;
          },
          // results is for internal usage only
          makeArray: function(arr2, results) {
            var ret = results || [];
            if (arr2 != null) {
              if (isArrayLike(Object(arr2))) {
                jQuery.merge(
                  ret,
                  typeof arr2 === "string" ? [arr2] : arr2
                );
              } else {
                push.call(ret, arr2);
              }
            }
            return ret;
          },
          inArray: function(elem, arr2, i) {
            return arr2 == null ? -1 : indexOf.call(arr2, elem, i);
          },
          isXMLDoc: function(elem) {
            var namespace = elem && elem.namespaceURI, docElem = elem && (elem.ownerDocument || elem).documentElement;
            return !rhtmlSuffix.test(namespace || docElem && docElem.nodeName || "HTML");
          },
          // Support: Android <=4.0 only, PhantomJS 1 only
          // push.apply(_, arraylike) throws on ancient WebKit
          merge: function(first, second) {
            var len = +second.length, j = 0, i = first.length;
            for (; j < len; j++) {
              first[i++] = second[j];
            }
            first.length = i;
            return first;
          },
          grep: function(elems, callback, invert) {
            var callbackInverse, matches = [], i = 0, length = elems.length, callbackExpect = !invert;
            for (; i < length; i++) {
              callbackInverse = !callback(elems[i], i);
              if (callbackInverse !== callbackExpect) {
                matches.push(elems[i]);
              }
            }
            return matches;
          },
          // arg is for internal usage only
          map: function(elems, callback, arg) {
            var length, value, i = 0, ret = [];
            if (isArrayLike(elems)) {
              length = elems.length;
              for (; i < length; i++) {
                value = callback(elems[i], i, arg);
                if (value != null) {
                  ret.push(value);
                }
              }
            } else {
              for (i in elems) {
                value = callback(elems[i], i, arg);
                if (value != null) {
                  ret.push(value);
                }
              }
            }
            return flat(ret);
          },
          // A global GUID counter for objects
          guid: 1,
          // jQuery.support is not used in Core but other projects attach their
          // properties to it so it needs to exist.
          support
        });
        if (typeof Symbol === "function") {
          jQuery.fn[Symbol.iterator] = arr[Symbol.iterator];
        }
        jQuery.each(
          "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),
          function(_i, name2) {
            class2type["[object " + name2 + "]"] = name2.toLowerCase();
          }
        );
        function isArrayLike(obj) {
          var length = !!obj && "length" in obj && obj.length, type2 = toType(obj);
          if (isFunction2(obj) || isWindow(obj)) {
            return false;
          }
          return type2 === "array" || length === 0 || typeof length === "number" && length > 0 && length - 1 in obj;
        }
        function nodeName(elem, name2) {
          return elem.nodeName && elem.nodeName.toLowerCase() === name2.toLowerCase();
        }
        var pop = arr.pop;
        var sort = arr.sort;
        var splice = arr.splice;
        var whitespace = "[\\x20\\t\\r\\n\\f]";
        var rtrimCSS = new RegExp(
          "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$",
          "g"
        );
        jQuery.contains = function(a, b) {
          var bup = b && b.parentNode;
          return a === bup || !!(bup && bup.nodeType === 1 && // Support: IE 9 - 11+
          // IE doesn't have `contains` on SVG.
          (a.contains ? a.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
        };
        var rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;
        function fcssescape(ch, asCodePoint) {
          if (asCodePoint) {
            if (ch === "\0") {
              return "�";
            }
            return ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " ";
          }
          return "\\" + ch;
        }
        jQuery.escapeSelector = function(sel) {
          return (sel + "").replace(rcssescape, fcssescape);
        };
        var preferredDoc = document2, pushNative = push;
        (function() {
          var i, Expr, outermostContext, sortInput, hasDuplicate, push2 = pushNative, document3, documentElement2, documentIsHTML, rbuggyQSA, matches, expando = jQuery.expando, dirruns = 0, done = 0, classCache = createCache(), tokenCache = createCache(), compilerCache = createCache(), nonnativeSelectorCache = createCache(), sortOrder = function(a, b) {
            if (a === b) {
              hasDuplicate = true;
            }
            return 0;
          }, booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+", attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace + // Operator (capture 2)
          "*([*^$|!~]?=)" + whitespace + // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
          `*(?:'((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)"|(` + identifier + "))|)" + whitespace + "*\\]", pseudos = ":(" + identifier + `)(?:\\((('((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)")|((?:\\\\.|[^\\\\()[\\]]|` + attributes + ")*)|.*)\\)|)", rwhitespace = new RegExp(whitespace + "+", "g"), rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"), rleadingCombinator = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"), rdescend = new RegExp(whitespace + "|>"), rpseudo = new RegExp(pseudos), ridentifier = new RegExp("^" + identifier + "$"), matchExpr = {
            ID: new RegExp("^#(" + identifier + ")"),
            CLASS: new RegExp("^\\.(" + identifier + ")"),
            TAG: new RegExp("^(" + identifier + "|[*])"),
            ATTR: new RegExp("^" + attributes),
            PSEUDO: new RegExp("^" + pseudos),
            CHILD: new RegExp(
              "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)",
              "i"
            ),
            bool: new RegExp("^(?:" + booleans + ")$", "i"),
            // For use in libraries implementing .is()
            // We use this for POS matching in `select`
            needsContext: new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
          }, rinputs = /^(?:input|select|textarea|button)$/i, rheader = /^h\d$/i, rquickExpr2 = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, rsibling = /[+~]/, runescape = new RegExp("\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\([^\\r\\n\\f])", "g"), funescape = function(escape2, nonHex) {
            var high = "0x" + escape2.slice(1) - 65536;
            if (nonHex) {
              return nonHex;
            }
            return high < 0 ? String.fromCharCode(high + 65536) : String.fromCharCode(high >> 10 | 55296, high & 1023 | 56320);
          }, unloadHandler = function() {
            setDocument();
          }, inDisabledFieldset = addCombinator(
            function(elem) {
              return elem.disabled === true && nodeName(elem, "fieldset");
            },
            { dir: "parentNode", next: "legend" }
          );
          function safeActiveElement() {
            try {
              return document3.activeElement;
            } catch (err) {
            }
          }
          try {
            push2.apply(
              arr = slice.call(preferredDoc.childNodes),
              preferredDoc.childNodes
            );
            arr[preferredDoc.childNodes.length].nodeType;
          } catch (e) {
            push2 = {
              apply: function(target, els) {
                pushNative.apply(target, slice.call(els));
              },
              call: function(target) {
                pushNative.apply(target, slice.call(arguments, 1));
              }
            };
          }
          function find(selector, context, results, seed) {
            var m, i2, elem, nid, match, groups, newSelector, newContext = context && context.ownerDocument, nodeType = context ? context.nodeType : 9;
            results = results || [];
            if (typeof selector !== "string" || !selector || nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {
              return results;
            }
            if (!seed) {
              setDocument(context);
              context = context || document3;
              if (documentIsHTML) {
                if (nodeType !== 11 && (match = rquickExpr2.exec(selector))) {
                  if (m = match[1]) {
                    if (nodeType === 9) {
                      if (elem = context.getElementById(m)) {
                        if (elem.id === m) {
                          push2.call(results, elem);
                          return results;
                        }
                      } else {
                        return results;
                      }
                    } else {
                      if (newContext && (elem = newContext.getElementById(m)) && find.contains(context, elem) && elem.id === m) {
                        push2.call(results, elem);
                        return results;
                      }
                    }
                  } else if (match[2]) {
                    push2.apply(results, context.getElementsByTagName(selector));
                    return results;
                  } else if ((m = match[3]) && context.getElementsByClassName) {
                    push2.apply(results, context.getElementsByClassName(m));
                    return results;
                  }
                }
                if (!nonnativeSelectorCache[selector + " "] && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
                  newSelector = selector;
                  newContext = context;
                  if (nodeType === 1 && (rdescend.test(selector) || rleadingCombinator.test(selector))) {
                    newContext = rsibling.test(selector) && testContext(context.parentNode) || context;
                    if (newContext != context || !support.scope) {
                      if (nid = context.getAttribute("id")) {
                        nid = jQuery.escapeSelector(nid);
                      } else {
                        context.setAttribute("id", nid = expando);
                      }
                    }
                    groups = tokenize(selector);
                    i2 = groups.length;
                    while (i2--) {
                      groups[i2] = (nid ? "#" + nid : ":scope") + " " + toSelector(groups[i2]);
                    }
                    newSelector = groups.join(",");
                  }
                  try {
                    push2.apply(
                      results,
                      newContext.querySelectorAll(newSelector)
                    );
                    return results;
                  } catch (qsaError) {
                    nonnativeSelectorCache(selector, true);
                  } finally {
                    if (nid === expando) {
                      context.removeAttribute("id");
                    }
                  }
                }
              }
            }
            return select(selector.replace(rtrimCSS, "$1"), context, results, seed);
          }
          function createCache() {
            var keys = [];
            function cache(key, value) {
              if (keys.push(key + " ") > Expr.cacheLength) {
                delete cache[keys.shift()];
              }
              return cache[key + " "] = value;
            }
            return cache;
          }
          function markFunction(fn) {
            fn[expando] = true;
            return fn;
          }
          function assert(fn) {
            var el = document3.createElement("fieldset");
            try {
              return !!fn(el);
            } catch (e) {
              return false;
            } finally {
              if (el.parentNode) {
                el.parentNode.removeChild(el);
              }
              el = null;
            }
          }
          function createInputPseudo(type2) {
            return function(elem) {
              return nodeName(elem, "input") && elem.type === type2;
            };
          }
          function createButtonPseudo(type2) {
            return function(elem) {
              return (nodeName(elem, "input") || nodeName(elem, "button")) && elem.type === type2;
            };
          }
          function createDisabledPseudo(disabled) {
            return function(elem) {
              if ("form" in elem) {
                if (elem.parentNode && elem.disabled === false) {
                  if ("label" in elem) {
                    if ("label" in elem.parentNode) {
                      return elem.parentNode.disabled === disabled;
                    } else {
                      return elem.disabled === disabled;
                    }
                  }
                  return elem.isDisabled === disabled || // Where there is no isDisabled, check manually
                  elem.isDisabled !== !disabled && inDisabledFieldset(elem) === disabled;
                }
                return elem.disabled === disabled;
              } else if ("label" in elem) {
                return elem.disabled === disabled;
              }
              return false;
            };
          }
          function createPositionalPseudo(fn) {
            return markFunction(function(argument) {
              argument = +argument;
              return markFunction(function(seed, matches2) {
                var j, matchIndexes = fn([], seed.length, argument), i2 = matchIndexes.length;
                while (i2--) {
                  if (seed[j = matchIndexes[i2]]) {
                    seed[j] = !(matches2[j] = seed[j]);
                  }
                }
              });
            });
          }
          function testContext(context) {
            return context && typeof context.getElementsByTagName !== "undefined" && context;
          }
          function setDocument(node) {
            var subWindow, doc2 = node ? node.ownerDocument || node : preferredDoc;
            if (doc2 == document3 || doc2.nodeType !== 9 || !doc2.documentElement) {
              return document3;
            }
            document3 = doc2;
            documentElement2 = document3.documentElement;
            documentIsHTML = !jQuery.isXMLDoc(document3);
            matches = documentElement2.matches || documentElement2.webkitMatchesSelector || documentElement2.msMatchesSelector;
            if (documentElement2.msMatchesSelector && // Support: IE 11+, Edge 17 - 18+
            // IE/Edge sometimes throw a "Permission denied" error when strict-comparing
            // two documents; shallow comparisons work.
            // eslint-disable-next-line eqeqeq
            preferredDoc != document3 && (subWindow = document3.defaultView) && subWindow.top !== subWindow) {
              subWindow.addEventListener("unload", unloadHandler);
            }
            support.getById = assert(function(el) {
              documentElement2.appendChild(el).id = jQuery.expando;
              return !document3.getElementsByName || !document3.getElementsByName(jQuery.expando).length;
            });
            support.disconnectedMatch = assert(function(el) {
              return matches.call(el, "*");
            });
            support.scope = assert(function() {
              return document3.querySelectorAll(":scope");
            });
            support.cssHas = assert(function() {
              try {
                document3.querySelector(":has(*,:jqfake)");
                return false;
              } catch (e) {
                return true;
              }
            });
            if (support.getById) {
              Expr.filter.ID = function(id) {
                var attrId = id.replace(runescape, funescape);
                return function(elem) {
                  return elem.getAttribute("id") === attrId;
                };
              };
              Expr.find.ID = function(id, context) {
                if (typeof context.getElementById !== "undefined" && documentIsHTML) {
                  var elem = context.getElementById(id);
                  return elem ? [elem] : [];
                }
              };
            } else {
              Expr.filter.ID = function(id) {
                var attrId = id.replace(runescape, funescape);
                return function(elem) {
                  var node2 = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
                  return node2 && node2.value === attrId;
                };
              };
              Expr.find.ID = function(id, context) {
                if (typeof context.getElementById !== "undefined" && documentIsHTML) {
                  var node2, i2, elems, elem = context.getElementById(id);
                  if (elem) {
                    node2 = elem.getAttributeNode("id");
                    if (node2 && node2.value === id) {
                      return [elem];
                    }
                    elems = context.getElementsByName(id);
                    i2 = 0;
                    while (elem = elems[i2++]) {
                      node2 = elem.getAttributeNode("id");
                      if (node2 && node2.value === id) {
                        return [elem];
                      }
                    }
                  }
                  return [];
                }
              };
            }
            Expr.find.TAG = function(tag2, context) {
              if (typeof context.getElementsByTagName !== "undefined") {
                return context.getElementsByTagName(tag2);
              } else {
                return context.querySelectorAll(tag2);
              }
            };
            Expr.find.CLASS = function(className, context) {
              if (typeof context.getElementsByClassName !== "undefined" && documentIsHTML) {
                return context.getElementsByClassName(className);
              }
            };
            rbuggyQSA = [];
            assert(function(el) {
              var input;
              documentElement2.appendChild(el).innerHTML = "<a id='" + expando + "' href='' disabled='disabled'></a><select id='" + expando + "-\r\\' disabled='disabled'><option selected=''></option></select>";
              if (!el.querySelectorAll("[selected]").length) {
                rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
              }
              if (!el.querySelectorAll("[id~=" + expando + "-]").length) {
                rbuggyQSA.push("~=");
              }
              if (!el.querySelectorAll("a#" + expando + "+*").length) {
                rbuggyQSA.push(".#.+[+~]");
              }
              if (!el.querySelectorAll(":checked").length) {
                rbuggyQSA.push(":checked");
              }
              input = document3.createElement("input");
              input.setAttribute("type", "hidden");
              el.appendChild(input).setAttribute("name", "D");
              documentElement2.appendChild(el).disabled = true;
              if (el.querySelectorAll(":disabled").length !== 2) {
                rbuggyQSA.push(":enabled", ":disabled");
              }
              input = document3.createElement("input");
              input.setAttribute("name", "");
              el.appendChild(input);
              if (!el.querySelectorAll("[name='']").length) {
                rbuggyQSA.push("\\[" + whitespace + "*name" + whitespace + "*=" + whitespace + `*(?:''|"")`);
              }
            });
            if (!support.cssHas) {
              rbuggyQSA.push(":has");
            }
            rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
            sortOrder = function(a, b) {
              if (a === b) {
                hasDuplicate = true;
                return 0;
              }
              var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
              if (compare) {
                return compare;
              }
              compare = (a.ownerDocument || a) == (b.ownerDocument || b) ? a.compareDocumentPosition(b) : (
                // Otherwise we know they are disconnected
                1
              );
              if (compare & 1 || !support.sortDetached && b.compareDocumentPosition(a) === compare) {
                if (a === document3 || a.ownerDocument == preferredDoc && find.contains(preferredDoc, a)) {
                  return -1;
                }
                if (b === document3 || b.ownerDocument == preferredDoc && find.contains(preferredDoc, b)) {
                  return 1;
                }
                return sortInput ? indexOf.call(sortInput, a) - indexOf.call(sortInput, b) : 0;
              }
              return compare & 4 ? -1 : 1;
            };
            return document3;
          }
          find.matches = function(expr, elements) {
            return find(expr, null, null, elements);
          };
          find.matchesSelector = function(elem, expr) {
            setDocument(elem);
            if (documentIsHTML && !nonnativeSelectorCache[expr + " "] && (!rbuggyQSA || !rbuggyQSA.test(expr))) {
              try {
                var ret = matches.call(elem, expr);
                if (ret || support.disconnectedMatch || // As well, disconnected nodes are said to be in a document
                // fragment in IE 9
                elem.document && elem.document.nodeType !== 11) {
                  return ret;
                }
              } catch (e) {
                nonnativeSelectorCache(expr, true);
              }
            }
            return find(expr, document3, null, [elem]).length > 0;
          };
          find.contains = function(context, elem) {
            if ((context.ownerDocument || context) != document3) {
              setDocument(context);
            }
            return jQuery.contains(context, elem);
          };
          find.attr = function(elem, name2) {
            if ((elem.ownerDocument || elem) != document3) {
              setDocument(elem);
            }
            var fn = Expr.attrHandle[name2.toLowerCase()], val = fn && hasOwn2.call(Expr.attrHandle, name2.toLowerCase()) ? fn(elem, name2, !documentIsHTML) : void 0;
            if (val !== void 0) {
              return val;
            }
            return elem.getAttribute(name2);
          };
          find.error = function(msg) {
            throw new Error("Syntax error, unrecognized expression: " + msg);
          };
          jQuery.uniqueSort = function(results) {
            var elem, duplicates = [], j = 0, i2 = 0;
            hasDuplicate = !support.sortStable;
            sortInput = !support.sortStable && slice.call(results, 0);
            sort.call(results, sortOrder);
            if (hasDuplicate) {
              while (elem = results[i2++]) {
                if (elem === results[i2]) {
                  j = duplicates.push(i2);
                }
              }
              while (j--) {
                splice.call(results, duplicates[j], 1);
              }
            }
            sortInput = null;
            return results;
          };
          jQuery.fn.uniqueSort = function() {
            return this.pushStack(jQuery.uniqueSort(slice.apply(this)));
          };
          Expr = jQuery.expr = {
            // Can be adjusted by the user
            cacheLength: 50,
            createPseudo: markFunction,
            match: matchExpr,
            attrHandle: {},
            find: {},
            relative: {
              ">": { dir: "parentNode", first: true },
              " ": { dir: "parentNode" },
              "+": { dir: "previousSibling", first: true },
              "~": { dir: "previousSibling" }
            },
            preFilter: {
              ATTR: function(match) {
                match[1] = match[1].replace(runescape, funescape);
                match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape);
                if (match[2] === "~=") {
                  match[3] = " " + match[3] + " ";
                }
                return match.slice(0, 4);
              },
              CHILD: function(match) {
                match[1] = match[1].toLowerCase();
                if (match[1].slice(0, 3) === "nth") {
                  if (!match[3]) {
                    find.error(match[0]);
                  }
                  match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd"));
                  match[5] = +(match[7] + match[8] || match[3] === "odd");
                } else if (match[3]) {
                  find.error(match[0]);
                }
                return match;
              },
              PSEUDO: function(match) {
                var excess, unquoted = !match[6] && match[2];
                if (matchExpr.CHILD.test(match[0])) {
                  return null;
                }
                if (match[3]) {
                  match[2] = match[4] || match[5] || "";
                } else if (unquoted && rpseudo.test(unquoted) && // Get excess from tokenize (recursively)
                (excess = tokenize(unquoted, true)) && // advance to the next closing parenthesis
                (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {
                  match[0] = match[0].slice(0, excess);
                  match[2] = unquoted.slice(0, excess);
                }
                return match.slice(0, 3);
              }
            },
            filter: {
              TAG: function(nodeNameSelector) {
                var expectedNodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
                return nodeNameSelector === "*" ? function() {
                  return true;
                } : function(elem) {
                  return nodeName(elem, expectedNodeName);
                };
              },
              CLASS: function(className) {
                var pattern = classCache[className + " "];
                return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(className, function(elem) {
                  return pattern.test(
                    typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || ""
                  );
                });
              },
              ATTR: function(name2, operator, check) {
                return function(elem) {
                  var result2 = find.attr(elem, name2);
                  if (result2 == null) {
                    return operator === "!=";
                  }
                  if (!operator) {
                    return true;
                  }
                  result2 += "";
                  if (operator === "=") {
                    return result2 === check;
                  }
                  if (operator === "!=") {
                    return result2 !== check;
                  }
                  if (operator === "^=") {
                    return check && result2.indexOf(check) === 0;
                  }
                  if (operator === "*=") {
                    return check && result2.indexOf(check) > -1;
                  }
                  if (operator === "$=") {
                    return check && result2.slice(-check.length) === check;
                  }
                  if (operator === "~=") {
                    return (" " + result2.replace(rwhitespace, " ") + " ").indexOf(check) > -1;
                  }
                  if (operator === "|=") {
                    return result2 === check || result2.slice(0, check.length + 1) === check + "-";
                  }
                  return false;
                };
              },
              CHILD: function(type2, what, _argument, first, last) {
                var simple = type2.slice(0, 3) !== "nth", forward = type2.slice(-4) !== "last", ofType = what === "of-type";
                return first === 1 && last === 0 ? (
                  // Shortcut for :nth-*(n)
                  function(elem) {
                    return !!elem.parentNode;
                  }
                ) : function(elem, _context, xml) {
                  var cache, outerCache, node, nodeIndex, start, dir2 = simple !== forward ? "nextSibling" : "previousSibling", parent = elem.parentNode, name2 = ofType && elem.nodeName.toLowerCase(), useCache = !xml && !ofType, diff = false;
                  if (parent) {
                    if (simple) {
                      while (dir2) {
                        node = elem;
                        while (node = node[dir2]) {
                          if (ofType ? nodeName(node, name2) : node.nodeType === 1) {
                            return false;
                          }
                        }
                        start = dir2 = type2 === "only" && !start && "nextSibling";
                      }
                      return true;
                    }
                    start = [forward ? parent.firstChild : parent.lastChild];
                    if (forward && useCache) {
                      outerCache = parent[expando] || (parent[expando] = {});
                      cache = outerCache[type2] || [];
                      nodeIndex = cache[0] === dirruns && cache[1];
                      diff = nodeIndex && cache[2];
                      node = nodeIndex && parent.childNodes[nodeIndex];
                      while (node = ++nodeIndex && node && node[dir2] || // Fallback to seeking `elem` from the start
                      (diff = nodeIndex = 0) || start.pop()) {
                        if (node.nodeType === 1 && ++diff && node === elem) {
                          outerCache[type2] = [dirruns, nodeIndex, diff];
                          break;
                        }
                      }
                    } else {
                      if (useCache) {
                        outerCache = elem[expando] || (elem[expando] = {});
                        cache = outerCache[type2] || [];
                        nodeIndex = cache[0] === dirruns && cache[1];
                        diff = nodeIndex;
                      }
                      if (diff === false) {
                        while (node = ++nodeIndex && node && node[dir2] || (diff = nodeIndex = 0) || start.pop()) {
                          if ((ofType ? nodeName(node, name2) : node.nodeType === 1) && ++diff) {
                            if (useCache) {
                              outerCache = node[expando] || (node[expando] = {});
                              outerCache[type2] = [dirruns, diff];
                            }
                            if (node === elem) {
                              break;
                            }
                          }
                        }
                      }
                    }
                    diff -= last;
                    return diff === first || diff % first === 0 && diff / first >= 0;
                  }
                };
              },
              PSEUDO: function(pseudo, argument) {
                var args, fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || find.error("unsupported pseudo: " + pseudo);
                if (fn[expando]) {
                  return fn(argument);
                }
                if (fn.length > 1) {
                  args = [pseudo, pseudo, "", argument];
                  return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function(seed, matches2) {
                    var idx, matched = fn(seed, argument), i2 = matched.length;
                    while (i2--) {
                      idx = indexOf.call(seed, matched[i2]);
                      seed[idx] = !(matches2[idx] = matched[i2]);
                    }
                  }) : function(elem) {
                    return fn(elem, 0, args);
                  };
                }
                return fn;
              }
            },
            pseudos: {
              // Potentially complex pseudos
              not: markFunction(function(selector) {
                var input = [], results = [], matcher = compile2(selector.replace(rtrimCSS, "$1"));
                return matcher[expando] ? markFunction(function(seed, matches2, _context, xml) {
                  var elem, unmatched = matcher(seed, null, xml, []), i2 = seed.length;
                  while (i2--) {
                    if (elem = unmatched[i2]) {
                      seed[i2] = !(matches2[i2] = elem);
                    }
                  }
                }) : function(elem, _context, xml) {
                  input[0] = elem;
                  matcher(input, null, xml, results);
                  input[0] = null;
                  return !results.pop();
                };
              }),
              has: markFunction(function(selector) {
                return function(elem) {
                  return find(selector, elem).length > 0;
                };
              }),
              contains: markFunction(function(text) {
                text = text.replace(runescape, funescape);
                return function(elem) {
                  return (elem.textContent || jQuery.text(elem)).indexOf(text) > -1;
                };
              }),
              // "Whether an element is represented by a :lang() selector
              // is based solely on the element's language value
              // being equal to the identifier C,
              // or beginning with the identifier C immediately followed by "-".
              // The matching of C against the element's language value is performed case-insensitively.
              // The identifier C does not have to be a valid language name."
              // https://www.w3.org/TR/selectors/#lang-pseudo
              lang: markFunction(function(lang) {
                if (!ridentifier.test(lang || "")) {
                  find.error("unsupported lang: " + lang);
                }
                lang = lang.replace(runescape, funescape).toLowerCase();
                return function(elem) {
                  var elemLang;
                  do {
                    if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang")) {
                      elemLang = elemLang.toLowerCase();
                      return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
                    }
                  } while ((elem = elem.parentNode) && elem.nodeType === 1);
                  return false;
                };
              }),
              // Miscellaneous
              target: function(elem) {
                var hash = window2.location && window2.location.hash;
                return hash && hash.slice(1) === elem.id;
              },
              root: function(elem) {
                return elem === documentElement2;
              },
              focus: function(elem) {
                return elem === safeActiveElement() && document3.hasFocus() && !!(elem.type || elem.href || ~elem.tabIndex);
              },
              // Boolean properties
              enabled: createDisabledPseudo(false),
              disabled: createDisabledPseudo(true),
              checked: function(elem) {
                return nodeName(elem, "input") && !!elem.checked || nodeName(elem, "option") && !!elem.selected;
              },
              selected: function(elem) {
                if (elem.parentNode) {
                  elem.parentNode.selectedIndex;
                }
                return elem.selected === true;
              },
              // Contents
              empty: function(elem) {
                for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                  if (elem.nodeType < 6) {
                    return false;
                  }
                }
                return true;
              },
              parent: function(elem) {
                return !Expr.pseudos.empty(elem);
              },
              // Element/input types
              header: function(elem) {
                return rheader.test(elem.nodeName);
              },
              input: function(elem) {
                return rinputs.test(elem.nodeName);
              },
              button: function(elem) {
                return nodeName(elem, "input") && elem.type === "button" || nodeName(elem, "button");
              },
              text: function(elem) {
                var attr;
                return nodeName(elem, "input") && elem.type === "text" && // Support: IE <10 only
                // New HTML5 attribute values (e.g., "search") appear
                // with elem.type === "text"
                ((attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text");
              },
              // Position-in-collection
              first: createPositionalPseudo(function() {
                return [0];
              }),
              last: createPositionalPseudo(function(_matchIndexes, length) {
                return [length - 1];
              }),
              eq: createPositionalPseudo(function(_matchIndexes, length, argument) {
                return [argument < 0 ? argument + length : argument];
              }),
              even: createPositionalPseudo(function(matchIndexes, length) {
                var i2 = 0;
                for (; i2 < length; i2 += 2) {
                  matchIndexes.push(i2);
                }
                return matchIndexes;
              }),
              odd: createPositionalPseudo(function(matchIndexes, length) {
                var i2 = 1;
                for (; i2 < length; i2 += 2) {
                  matchIndexes.push(i2);
                }
                return matchIndexes;
              }),
              lt: createPositionalPseudo(function(matchIndexes, length, argument) {
                var i2;
                if (argument < 0) {
                  i2 = argument + length;
                } else if (argument > length) {
                  i2 = length;
                } else {
                  i2 = argument;
                }
                for (; --i2 >= 0; ) {
                  matchIndexes.push(i2);
                }
                return matchIndexes;
              }),
              gt: createPositionalPseudo(function(matchIndexes, length, argument) {
                var i2 = argument < 0 ? argument + length : argument;
                for (; ++i2 < length; ) {
                  matchIndexes.push(i2);
                }
                return matchIndexes;
              })
            }
          };
          Expr.pseudos.nth = Expr.pseudos.eq;
          for (i in { radio: true, checkbox: true, file: true, password: true, image: true }) {
            Expr.pseudos[i] = createInputPseudo(i);
          }
          for (i in { submit: true, reset: true }) {
            Expr.pseudos[i] = createButtonPseudo(i);
          }
          function setFilters() {
          }
          setFilters.prototype = Expr.filters = Expr.pseudos;
          Expr.setFilters = new setFilters();
          function tokenize(selector, parseOnly) {
            var matched, match, tokens, type2, soFar, groups, preFilters, cached = tokenCache[selector + " "];
            if (cached) {
              return parseOnly ? 0 : cached.slice(0);
            }
            soFar = selector;
            groups = [];
            preFilters = Expr.preFilter;
            while (soFar) {
              if (!matched || (match = rcomma.exec(soFar))) {
                if (match) {
                  soFar = soFar.slice(match[0].length) || soFar;
                }
                groups.push(tokens = []);
              }
              matched = false;
              if (match = rleadingCombinator.exec(soFar)) {
                matched = match.shift();
                tokens.push({
                  value: matched,
                  // Cast descendant combinators to space
                  type: match[0].replace(rtrimCSS, " ")
                });
                soFar = soFar.slice(matched.length);
              }
              for (type2 in Expr.filter) {
                if ((match = matchExpr[type2].exec(soFar)) && (!preFilters[type2] || (match = preFilters[type2](match)))) {
                  matched = match.shift();
                  tokens.push({
                    value: matched,
                    type: type2,
                    matches: match
                  });
                  soFar = soFar.slice(matched.length);
                }
              }
              if (!matched) {
                break;
              }
            }
            if (parseOnly) {
              return soFar.length;
            }
            return soFar ? find.error(selector) : (
              // Cache the tokens
              tokenCache(selector, groups).slice(0)
            );
          }
          function toSelector(tokens) {
            var i2 = 0, len = tokens.length, selector = "";
            for (; i2 < len; i2++) {
              selector += tokens[i2].value;
            }
            return selector;
          }
          function addCombinator(matcher, combinator, base) {
            var dir2 = combinator.dir, skip = combinator.next, key = skip || dir2, checkNonElements = base && key === "parentNode", doneName = done++;
            return combinator.first ? (
              // Check against closest ancestor/preceding element
              function(elem, context, xml) {
                while (elem = elem[dir2]) {
                  if (elem.nodeType === 1 || checkNonElements) {
                    return matcher(elem, context, xml);
                  }
                }
                return false;
              }
            ) : (
              // Check against all ancestor/preceding elements
              function(elem, context, xml) {
                var oldCache, outerCache, newCache = [dirruns, doneName];
                if (xml) {
                  while (elem = elem[dir2]) {
                    if (elem.nodeType === 1 || checkNonElements) {
                      if (matcher(elem, context, xml)) {
                        return true;
                      }
                    }
                  }
                } else {
                  while (elem = elem[dir2]) {
                    if (elem.nodeType === 1 || checkNonElements) {
                      outerCache = elem[expando] || (elem[expando] = {});
                      if (skip && nodeName(elem, skip)) {
                        elem = elem[dir2] || elem;
                      } else if ((oldCache = outerCache[key]) && oldCache[0] === dirruns && oldCache[1] === doneName) {
                        return newCache[2] = oldCache[2];
                      } else {
                        outerCache[key] = newCache;
                        if (newCache[2] = matcher(elem, context, xml)) {
                          return true;
                        }
                      }
                    }
                  }
                }
                return false;
              }
            );
          }
          function elementMatcher(matchers) {
            return matchers.length > 1 ? function(elem, context, xml) {
              var i2 = matchers.length;
              while (i2--) {
                if (!matchers[i2](elem, context, xml)) {
                  return false;
                }
              }
              return true;
            } : matchers[0];
          }
          function multipleContexts(selector, contexts, results) {
            var i2 = 0, len = contexts.length;
            for (; i2 < len; i2++) {
              find(selector, contexts[i2], results);
            }
            return results;
          }
          function condense(unmatched, map2, filter, context, xml) {
            var elem, newUnmatched = [], i2 = 0, len = unmatched.length, mapped = map2 != null;
            for (; i2 < len; i2++) {
              if (elem = unmatched[i2]) {
                if (!filter || filter(elem, context, xml)) {
                  newUnmatched.push(elem);
                  if (mapped) {
                    map2.push(i2);
                  }
                }
              }
            }
            return newUnmatched;
          }
          function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
            if (postFilter && !postFilter[expando]) {
              postFilter = setMatcher(postFilter);
            }
            if (postFinder && !postFinder[expando]) {
              postFinder = setMatcher(postFinder, postSelector);
            }
            return markFunction(function(seed, results, context, xml) {
              var temp, i2, elem, matcherOut, preMap = [], postMap = [], preexisting = results.length, elems = seed || multipleContexts(
                selector || "*",
                context.nodeType ? [context] : context,
                []
              ), matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems;
              if (matcher) {
                matcherOut = postFinder || (seed ? preFilter : preexisting || postFilter) ? (
                  // ...intermediate processing is necessary
                  []
                ) : (
                  // ...otherwise use results directly
                  results
                );
                matcher(matcherIn, matcherOut, context, xml);
              } else {
                matcherOut = matcherIn;
              }
              if (postFilter) {
                temp = condense(matcherOut, postMap);
                postFilter(temp, [], context, xml);
                i2 = temp.length;
                while (i2--) {
                  if (elem = temp[i2]) {
                    matcherOut[postMap[i2]] = !(matcherIn[postMap[i2]] = elem);
                  }
                }
              }
              if (seed) {
                if (postFinder || preFilter) {
                  if (postFinder) {
                    temp = [];
                    i2 = matcherOut.length;
                    while (i2--) {
                      if (elem = matcherOut[i2]) {
                        temp.push(matcherIn[i2] = elem);
                      }
                    }
                    postFinder(null, matcherOut = [], temp, xml);
                  }
                  i2 = matcherOut.length;
                  while (i2--) {
                    if ((elem = matcherOut[i2]) && (temp = postFinder ? indexOf.call(seed, elem) : preMap[i2]) > -1) {
                      seed[temp] = !(results[temp] = elem);
                    }
                  }
                }
              } else {
                matcherOut = condense(
                  matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut
                );
                if (postFinder) {
                  postFinder(null, results, matcherOut, xml);
                } else {
                  push2.apply(results, matcherOut);
                }
              }
            });
          }
          function matcherFromTokens(tokens) {
            var checkContext, matcher, j, len = tokens.length, leadingRelative = Expr.relative[tokens[0].type], implicitRelative = leadingRelative || Expr.relative[" "], i2 = leadingRelative ? 1 : 0, matchContext = addCombinator(function(elem) {
              return elem === checkContext;
            }, implicitRelative, true), matchAnyContext = addCombinator(function(elem) {
              return indexOf.call(checkContext, elem) > -1;
            }, implicitRelative, true), matchers = [function(elem, context, xml) {
              var ret = !leadingRelative && (xml || context != outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
              checkContext = null;
              return ret;
            }];
            for (; i2 < len; i2++) {
              if (matcher = Expr.relative[tokens[i2].type]) {
                matchers = [addCombinator(elementMatcher(matchers), matcher)];
              } else {
                matcher = Expr.filter[tokens[i2].type].apply(null, tokens[i2].matches);
                if (matcher[expando]) {
                  j = ++i2;
                  for (; j < len; j++) {
                    if (Expr.relative[tokens[j].type]) {
                      break;
                    }
                  }
                  return setMatcher(
                    i2 > 1 && elementMatcher(matchers),
                    i2 > 1 && toSelector(
                      // If the preceding token was a descendant combinator, insert an implicit any-element `*`
                      tokens.slice(0, i2 - 1).concat({ value: tokens[i2 - 2].type === " " ? "*" : "" })
                    ).replace(rtrimCSS, "$1"),
                    matcher,
                    i2 < j && matcherFromTokens(tokens.slice(i2, j)),
                    j < len && matcherFromTokens(tokens = tokens.slice(j)),
                    j < len && toSelector(tokens)
                  );
                }
                matchers.push(matcher);
              }
            }
            return elementMatcher(matchers);
          }
          function matcherFromGroupMatchers(elementMatchers, setMatchers) {
            var bySet = setMatchers.length > 0, byElement = elementMatchers.length > 0, superMatcher = function(seed, context, xml, results, outermost) {
              var elem, j, matcher, matchedCount = 0, i2 = "0", unmatched = seed && [], setMatched = [], contextBackup = outermostContext, elems = seed || byElement && Expr.find.TAG("*", outermost), dirrunsUnique = dirruns += contextBackup == null ? 1 : Math.random() || 0.1, len = elems.length;
              if (outermost) {
                outermostContext = context == document3 || context || outermost;
              }
              for (; i2 !== len && (elem = elems[i2]) != null; i2++) {
                if (byElement && elem) {
                  j = 0;
                  if (!context && elem.ownerDocument != document3) {
                    setDocument(elem);
                    xml = !documentIsHTML;
                  }
                  while (matcher = elementMatchers[j++]) {
                    if (matcher(elem, context || document3, xml)) {
                      push2.call(results, elem);
                      break;
                    }
                  }
                  if (outermost) {
                    dirruns = dirrunsUnique;
                  }
                }
                if (bySet) {
                  if (elem = !matcher && elem) {
                    matchedCount--;
                  }
                  if (seed) {
                    unmatched.push(elem);
                  }
                }
              }
              matchedCount += i2;
              if (bySet && i2 !== matchedCount) {
                j = 0;
                while (matcher = setMatchers[j++]) {
                  matcher(unmatched, setMatched, context, xml);
                }
                if (seed) {
                  if (matchedCount > 0) {
                    while (i2--) {
                      if (!(unmatched[i2] || setMatched[i2])) {
                        setMatched[i2] = pop.call(results);
                      }
                    }
                  }
                  setMatched = condense(setMatched);
                }
                push2.apply(results, setMatched);
                if (outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1) {
                  jQuery.uniqueSort(results);
                }
              }
              if (outermost) {
                dirruns = dirrunsUnique;
                outermostContext = contextBackup;
              }
              return unmatched;
            };
            return bySet ? markFunction(superMatcher) : superMatcher;
          }
          function compile2(selector, match) {
            var i2, setMatchers = [], elementMatchers = [], cached = compilerCache[selector + " "];
            if (!cached) {
              if (!match) {
                match = tokenize(selector);
              }
              i2 = match.length;
              while (i2--) {
                cached = matcherFromTokens(match[i2]);
                if (cached[expando]) {
                  setMatchers.push(cached);
                } else {
                  elementMatchers.push(cached);
                }
              }
              cached = compilerCache(
                selector,
                matcherFromGroupMatchers(elementMatchers, setMatchers)
              );
              cached.selector = selector;
            }
            return cached;
          }
          function select(selector, context, results, seed) {
            var i2, tokens, token, type2, find2, compiled = typeof selector === "function" && selector, match = !seed && tokenize(selector = compiled.selector || selector);
            results = results || [];
            if (match.length === 1) {
              tokens = match[0] = match[0].slice(0);
              if (tokens.length > 2 && (token = tokens[0]).type === "ID" && context.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]) {
                context = (Expr.find.ID(
                  token.matches[0].replace(runescape, funescape),
                  context
                ) || [])[0];
                if (!context) {
                  return results;
                } else if (compiled) {
                  context = context.parentNode;
                }
                selector = selector.slice(tokens.shift().value.length);
              }
              i2 = matchExpr.needsContext.test(selector) ? 0 : tokens.length;
              while (i2--) {
                token = tokens[i2];
                if (Expr.relative[type2 = token.type]) {
                  break;
                }
                if (find2 = Expr.find[type2]) {
                  if (seed = find2(
                    token.matches[0].replace(runescape, funescape),
                    rsibling.test(tokens[0].type) && testContext(context.parentNode) || context
                  )) {
                    tokens.splice(i2, 1);
                    selector = seed.length && toSelector(tokens);
                    if (!selector) {
                      push2.apply(results, seed);
                      return results;
                    }
                    break;
                  }
                }
              }
            }
            (compiled || compile2(selector, match))(
              seed,
              context,
              !documentIsHTML,
              results,
              !context || rsibling.test(selector) && testContext(context.parentNode) || context
            );
            return results;
          }
          support.sortStable = expando.split("").sort(sortOrder).join("") === expando;
          setDocument();
          support.sortDetached = assert(function(el) {
            return el.compareDocumentPosition(document3.createElement("fieldset")) & 1;
          });
          jQuery.find = find;
          jQuery.expr[":"] = jQuery.expr.pseudos;
          jQuery.unique = jQuery.uniqueSort;
          find.compile = compile2;
          find.select = select;
          find.setDocument = setDocument;
          find.tokenize = tokenize;
          find.escape = jQuery.escapeSelector;
          find.getText = jQuery.text;
          find.isXML = jQuery.isXMLDoc;
          find.selectors = jQuery.expr;
          find.support = jQuery.support;
          find.uniqueSort = jQuery.uniqueSort;
        })();
        var dir = function(elem, dir2, until) {
          var matched = [], truncate = until !== void 0;
          while ((elem = elem[dir2]) && elem.nodeType !== 9) {
            if (elem.nodeType === 1) {
              if (truncate && jQuery(elem).is(until)) {
                break;
              }
              matched.push(elem);
            }
          }
          return matched;
        };
        var siblings = function(n, elem) {
          var matched = [];
          for (; n; n = n.nextSibling) {
            if (n.nodeType === 1 && n !== elem) {
              matched.push(n);
            }
          }
          return matched;
        };
        var rneedsContext = jQuery.expr.match.needsContext;
        var rsingleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
        function winnow(elements, qualifier, not) {
          if (isFunction2(qualifier)) {
            return jQuery.grep(elements, function(elem, i) {
              return !!qualifier.call(elem, i, elem) !== not;
            });
          }
          if (qualifier.nodeType) {
            return jQuery.grep(elements, function(elem) {
              return elem === qualifier !== not;
            });
          }
          if (typeof qualifier !== "string") {
            return jQuery.grep(elements, function(elem) {
              return indexOf.call(qualifier, elem) > -1 !== not;
            });
          }
          return jQuery.filter(qualifier, elements, not);
        }
        jQuery.filter = function(expr, elems, not) {
          var elem = elems[0];
          if (not) {
            expr = ":not(" + expr + ")";
          }
          if (elems.length === 1 && elem.nodeType === 1) {
            return jQuery.find.matchesSelector(elem, expr) ? [elem] : [];
          }
          return jQuery.find.matches(expr, jQuery.grep(elems, function(elem2) {
            return elem2.nodeType === 1;
          }));
        };
        jQuery.fn.extend({
          find: function(selector) {
            var i, ret, len = this.length, self2 = this;
            if (typeof selector !== "string") {
              return this.pushStack(jQuery(selector).filter(function() {
                for (i = 0; i < len; i++) {
                  if (jQuery.contains(self2[i], this)) {
                    return true;
                  }
                }
              }));
            }
            ret = this.pushStack([]);
            for (i = 0; i < len; i++) {
              jQuery.find(selector, self2[i], ret);
            }
            return len > 1 ? jQuery.uniqueSort(ret) : ret;
          },
          filter: function(selector) {
            return this.pushStack(winnow(this, selector || [], false));
          },
          not: function(selector) {
            return this.pushStack(winnow(this, selector || [], true));
          },
          is: function(selector) {
            return !!winnow(
              this,
              // If this is a positional/relative selector, check membership in the returned set
              // so $("p:first").is("p:last") won't return true for a doc with two "p".
              typeof selector === "string" && rneedsContext.test(selector) ? jQuery(selector) : selector || [],
              false
            ).length;
          }
        });
        var rootjQuery, rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/, init = jQuery.fn.init = function(selector, context, root) {
          var match, elem;
          if (!selector) {
            return this;
          }
          root = root || rootjQuery;
          if (typeof selector === "string") {
            if (selector[0] === "<" && selector[selector.length - 1] === ">" && selector.length >= 3) {
              match = [null, selector, null];
            } else {
              match = rquickExpr.exec(selector);
            }
            if (match && (match[1] || !context)) {
              if (match[1]) {
                context = context instanceof jQuery ? context[0] : context;
                jQuery.merge(this, jQuery.parseHTML(
                  match[1],
                  context && context.nodeType ? context.ownerDocument || context : document2,
                  true
                ));
                if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
                  for (match in context) {
                    if (isFunction2(this[match])) {
                      this[match](context[match]);
                    } else {
                      this.attr(match, context[match]);
                    }
                  }
                }
                return this;
              } else {
                elem = document2.getElementById(match[2]);
                if (elem) {
                  this[0] = elem;
                  this.length = 1;
                }
                return this;
              }
            } else if (!context || context.jquery) {
              return (context || root).find(selector);
            } else {
              return this.constructor(context).find(selector);
            }
          } else if (selector.nodeType) {
            this[0] = selector;
            this.length = 1;
            return this;
          } else if (isFunction2(selector)) {
            return root.ready !== void 0 ? root.ready(selector) : (
              // Execute immediately if ready is not present
              selector(jQuery)
            );
          }
          return jQuery.makeArray(selector, this);
        };
        init.prototype = jQuery.fn;
        rootjQuery = jQuery(document2);
        var rparentsprev = /^(?:parents|prev(?:Until|All))/, guaranteedUnique = {
          children: true,
          contents: true,
          next: true,
          prev: true
        };
        jQuery.fn.extend({
          has: function(target) {
            var targets = jQuery(target, this), l = targets.length;
            return this.filter(function() {
              var i = 0;
              for (; i < l; i++) {
                if (jQuery.contains(this, targets[i])) {
                  return true;
                }
              }
            });
          },
          closest: function(selectors, context) {
            var cur, i = 0, l = this.length, matched = [], targets = typeof selectors !== "string" && jQuery(selectors);
            if (!rneedsContext.test(selectors)) {
              for (; i < l; i++) {
                for (cur = this[i]; cur && cur !== context; cur = cur.parentNode) {
                  if (cur.nodeType < 11 && (targets ? targets.index(cur) > -1 : (
                    // Don't pass non-elements to jQuery#find
                    cur.nodeType === 1 && jQuery.find.matchesSelector(cur, selectors)
                  ))) {
                    matched.push(cur);
                    break;
                  }
                }
              }
            }
            return this.pushStack(matched.length > 1 ? jQuery.uniqueSort(matched) : matched);
          },
          // Determine the position of an element within the set
          index: function(elem) {
            if (!elem) {
              return this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
            }
            if (typeof elem === "string") {
              return indexOf.call(jQuery(elem), this[0]);
            }
            return indexOf.call(
              this,
              // If it receives a jQuery object, the first element is used
              elem.jquery ? elem[0] : elem
            );
          },
          add: function(selector, context) {
            return this.pushStack(
              jQuery.uniqueSort(
                jQuery.merge(this.get(), jQuery(selector, context))
              )
            );
          },
          addBack: function(selector) {
            return this.add(
              selector == null ? this.prevObject : this.prevObject.filter(selector)
            );
          }
        });
        function sibling(cur, dir2) {
          while ((cur = cur[dir2]) && cur.nodeType !== 1) {
          }
          return cur;
        }
        jQuery.each({
          parent: function(elem) {
            var parent = elem.parentNode;
            return parent && parent.nodeType !== 11 ? parent : null;
          },
          parents: function(elem) {
            return dir(elem, "parentNode");
          },
          parentsUntil: function(elem, _i, until) {
            return dir(elem, "parentNode", until);
          },
          next: function(elem) {
            return sibling(elem, "nextSibling");
          },
          prev: function(elem) {
            return sibling(elem, "previousSibling");
          },
          nextAll: function(elem) {
            return dir(elem, "nextSibling");
          },
          prevAll: function(elem) {
            return dir(elem, "previousSibling");
          },
          nextUntil: function(elem, _i, until) {
            return dir(elem, "nextSibling", until);
          },
          prevUntil: function(elem, _i, until) {
            return dir(elem, "previousSibling", until);
          },
          siblings: function(elem) {
            return siblings((elem.parentNode || {}).firstChild, elem);
          },
          children: function(elem) {
            return siblings(elem.firstChild);
          },
          contents: function(elem) {
            if (elem.contentDocument != null && // Support: IE 11+
            // <object> elements with no `data` attribute has an object
            // `contentDocument` with a `null` prototype.
            getProto2(elem.contentDocument)) {
              return elem.contentDocument;
            }
            if (nodeName(elem, "template")) {
              elem = elem.content || elem;
            }
            return jQuery.merge([], elem.childNodes);
          }
        }, function(name2, fn) {
          jQuery.fn[name2] = function(until, selector) {
            var matched = jQuery.map(this, fn, until);
            if (name2.slice(-5) !== "Until") {
              selector = until;
            }
            if (selector && typeof selector === "string") {
              matched = jQuery.filter(selector, matched);
            }
            if (this.length > 1) {
              if (!guaranteedUnique[name2]) {
                jQuery.uniqueSort(matched);
              }
              if (rparentsprev.test(name2)) {
                matched.reverse();
              }
            }
            return this.pushStack(matched);
          };
        });
        var rnothtmlwhite = /[^\x20\t\r\n\f]+/g;
        function createOptions(options) {
          var object = {};
          jQuery.each(options.match(rnothtmlwhite) || [], function(_, flag) {
            object[flag] = true;
          });
          return object;
        }
        jQuery.Callbacks = function(options) {
          options = typeof options === "string" ? createOptions(options) : jQuery.extend({}, options);
          var firing, memory, fired, locked, list2 = [], queue2 = [], firingIndex = -1, fire = function() {
            locked = locked || options.once;
            fired = firing = true;
            for (; queue2.length; firingIndex = -1) {
              memory = queue2.shift();
              while (++firingIndex < list2.length) {
                if (list2[firingIndex].apply(memory[0], memory[1]) === false && options.stopOnFalse) {
                  firingIndex = list2.length;
                  memory = false;
                }
              }
            }
            if (!options.memory) {
              memory = false;
            }
            firing = false;
            if (locked) {
              if (memory) {
                list2 = [];
              } else {
                list2 = "";
              }
            }
          }, self2 = {
            // Add a callback or a collection of callbacks to the list
            add: function() {
              if (list2) {
                if (memory && !firing) {
                  firingIndex = list2.length - 1;
                  queue2.push(memory);
                }
                (function add(args) {
                  jQuery.each(args, function(_, arg) {
                    if (isFunction2(arg)) {
                      if (!options.unique || !self2.has(arg)) {
                        list2.push(arg);
                      }
                    } else if (arg && arg.length && toType(arg) !== "string") {
                      add(arg);
                    }
                  });
                })(arguments);
                if (memory && !firing) {
                  fire();
                }
              }
              return this;
            },
            // Remove a callback from the list
            remove: function() {
              jQuery.each(arguments, function(_, arg) {
                var index;
                while ((index = jQuery.inArray(arg, list2, index)) > -1) {
                  list2.splice(index, 1);
                  if (index <= firingIndex) {
                    firingIndex--;
                  }
                }
              });
              return this;
            },
            // Check if a given callback is in the list.
            // If no argument is given, return whether or not list has callbacks attached.
            has: function(fn) {
              return fn ? jQuery.inArray(fn, list2) > -1 : list2.length > 0;
            },
            // Remove all callbacks from the list
            empty: function() {
              if (list2) {
                list2 = [];
              }
              return this;
            },
            // Disable .fire and .add
            // Abort any current/pending executions
            // Clear all callbacks and values
            disable: function() {
              locked = queue2 = [];
              list2 = memory = "";
              return this;
            },
            disabled: function() {
              return !list2;
            },
            // Disable .fire
            // Also disable .add unless we have memory (since it would have no effect)
            // Abort any pending executions
            lock: function() {
              locked = queue2 = [];
              if (!memory && !firing) {
                list2 = memory = "";
              }
              return this;
            },
            locked: function() {
              return !!locked;
            },
            // Call all callbacks with the given context and arguments
            fireWith: function(context, args) {
              if (!locked) {
                args = args || [];
                args = [context, args.slice ? args.slice() : args];
                queue2.push(args);
                if (!firing) {
                  fire();
                }
              }
              return this;
            },
            // Call all the callbacks with the given arguments
            fire: function() {
              self2.fireWith(this, arguments);
              return this;
            },
            // To know if the callbacks have already been called at least once
            fired: function() {
              return !!fired;
            }
          };
          return self2;
        };
        function Identity(v) {
          return v;
        }
        function Thrower(ex) {
          throw ex;
        }
        function adoptValue(value, resolve2, reject, noValue) {
          var method;
          try {
            if (value && isFunction2(method = value.promise)) {
              method.call(value).done(resolve2).fail(reject);
            } else if (value && isFunction2(method = value.then)) {
              method.call(value, resolve2, reject);
            } else {
              resolve2.apply(void 0, [value].slice(noValue));
            }
          } catch (value2) {
            reject.apply(void 0, [value2]);
          }
        }
        jQuery.extend({
          Deferred: function(func) {
            var tuples = [
              // action, add listener, callbacks,
              // ... .then handlers, argument index, [final state]
              [
                "notify",
                "progress",
                jQuery.Callbacks("memory"),
                jQuery.Callbacks("memory"),
                2
              ],
              [
                "resolve",
                "done",
                jQuery.Callbacks("once memory"),
                jQuery.Callbacks("once memory"),
                0,
                "resolved"
              ],
              [
                "reject",
                "fail",
                jQuery.Callbacks("once memory"),
                jQuery.Callbacks("once memory"),
                1,
                "rejected"
              ]
            ], state = "pending", promise = {
              state: function() {
                return state;
              },
              always: function() {
                deferred.done(arguments).fail(arguments);
                return this;
              },
              "catch": function(fn) {
                return promise.then(null, fn);
              },
              // Keep pipe for back-compat
              pipe: function() {
                var fns = arguments;
                return jQuery.Deferred(function(newDefer) {
                  jQuery.each(tuples, function(_i, tuple) {
                    var fn = isFunction2(fns[tuple[4]]) && fns[tuple[4]];
                    deferred[tuple[1]](function() {
                      var returned = fn && fn.apply(this, arguments);
                      if (returned && isFunction2(returned.promise)) {
                        returned.promise().progress(newDefer.notify).done(newDefer.resolve).fail(newDefer.reject);
                      } else {
                        newDefer[tuple[0] + "With"](
                          this,
                          fn ? [returned] : arguments
                        );
                      }
                    });
                  });
                  fns = null;
                }).promise();
              },
              then: function(onFulfilled, onRejected, onProgress) {
                var maxDepth = 0;
                function resolve2(depth, deferred2, handler, special) {
                  return function() {
                    var that = this, args = arguments, mightThrow = function() {
                      var returned, then;
                      if (depth < maxDepth) {
                        return;
                      }
                      returned = handler.apply(that, args);
                      if (returned === deferred2.promise()) {
                        throw new TypeError("Thenable self-resolution");
                      }
                      then = returned && // Support: Promises/A+ section 2.3.4
                      // https://promisesaplus.com/#point-64
                      // Only check objects and functions for thenability
                      (typeof returned === "object" || typeof returned === "function") && returned.then;
                      if (isFunction2(then)) {
                        if (special) {
                          then.call(
                            returned,
                            resolve2(maxDepth, deferred2, Identity, special),
                            resolve2(maxDepth, deferred2, Thrower, special)
                          );
                        } else {
                          maxDepth++;
                          then.call(
                            returned,
                            resolve2(maxDepth, deferred2, Identity, special),
                            resolve2(maxDepth, deferred2, Thrower, special),
                            resolve2(
                              maxDepth,
                              deferred2,
                              Identity,
                              deferred2.notifyWith
                            )
                          );
                        }
                      } else {
                        if (handler !== Identity) {
                          that = void 0;
                          args = [returned];
                        }
                        (special || deferred2.resolveWith)(that, args);
                      }
                    }, process = special ? mightThrow : function() {
                      try {
                        mightThrow();
                      } catch (e) {
                        if (jQuery.Deferred.exceptionHook) {
                          jQuery.Deferred.exceptionHook(
                            e,
                            process.error
                          );
                        }
                        if (depth + 1 >= maxDepth) {
                          if (handler !== Thrower) {
                            that = void 0;
                            args = [e];
                          }
                          deferred2.rejectWith(that, args);
                        }
                      }
                    };
                    if (depth) {
                      process();
                    } else {
                      if (jQuery.Deferred.getErrorHook) {
                        process.error = jQuery.Deferred.getErrorHook();
                      } else if (jQuery.Deferred.getStackHook) {
                        process.error = jQuery.Deferred.getStackHook();
                      }
                      window2.setTimeout(process);
                    }
                  };
                }
                return jQuery.Deferred(function(newDefer) {
                  tuples[0][3].add(
                    resolve2(
                      0,
                      newDefer,
                      isFunction2(onProgress) ? onProgress : Identity,
                      newDefer.notifyWith
                    )
                  );
                  tuples[1][3].add(
                    resolve2(
                      0,
                      newDefer,
                      isFunction2(onFulfilled) ? onFulfilled : Identity
                    )
                  );
                  tuples[2][3].add(
                    resolve2(
                      0,
                      newDefer,
                      isFunction2(onRejected) ? onRejected : Thrower
                    )
                  );
                }).promise();
              },
              // Get a promise for this deferred
              // If obj is provided, the promise aspect is added to the object
              promise: function(obj) {
                return obj != null ? jQuery.extend(obj, promise) : promise;
              }
            }, deferred = {};
            jQuery.each(tuples, function(i, tuple) {
              var list2 = tuple[2], stateString = tuple[5];
              promise[tuple[1]] = list2.add;
              if (stateString) {
                list2.add(
                  function() {
                    state = stateString;
                  },
                  // rejected_callbacks.disable
                  // fulfilled_callbacks.disable
                  tuples[3 - i][2].disable,
                  // rejected_handlers.disable
                  // fulfilled_handlers.disable
                  tuples[3 - i][3].disable,
                  // progress_callbacks.lock
                  tuples[0][2].lock,
                  // progress_handlers.lock
                  tuples[0][3].lock
                );
              }
              list2.add(tuple[3].fire);
              deferred[tuple[0]] = function() {
                deferred[tuple[0] + "With"](this === deferred ? void 0 : this, arguments);
                return this;
              };
              deferred[tuple[0] + "With"] = list2.fireWith;
            });
            promise.promise(deferred);
            if (func) {
              func.call(deferred, deferred);
            }
            return deferred;
          },
          // Deferred helper
          when: function(singleValue) {
            var remaining = arguments.length, i = remaining, resolveContexts = Array(i), resolveValues = slice.call(arguments), primary = jQuery.Deferred(), updateFunc = function(i2) {
              return function(value) {
                resolveContexts[i2] = this;
                resolveValues[i2] = arguments.length > 1 ? slice.call(arguments) : value;
                if (!--remaining) {
                  primary.resolveWith(resolveContexts, resolveValues);
                }
              };
            };
            if (remaining <= 1) {
              adoptValue(
                singleValue,
                primary.done(updateFunc(i)).resolve,
                primary.reject,
                !remaining
              );
              if (primary.state() === "pending" || isFunction2(resolveValues[i] && resolveValues[i].then)) {
                return primary.then();
              }
            }
            while (i--) {
              adoptValue(resolveValues[i], updateFunc(i), primary.reject);
            }
            return primary.promise();
          }
        });
        var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
        jQuery.Deferred.exceptionHook = function(error, asyncError) {
          if (window2.console && window2.console.warn && error && rerrorNames.test(error.name)) {
            window2.console.warn(
              "jQuery.Deferred exception: " + error.message,
              error.stack,
              asyncError
            );
          }
        };
        jQuery.readyException = function(error) {
          window2.setTimeout(function() {
            throw error;
          });
        };
        var readyList = jQuery.Deferred();
        jQuery.fn.ready = function(fn) {
          readyList.then(fn).catch(function(error) {
            jQuery.readyException(error);
          });
          return this;
        };
        jQuery.extend({
          // Is the DOM ready to be used? Set to true once it occurs.
          isReady: false,
          // A counter to track how many items to wait for before
          // the ready event fires. See trac-6781
          readyWait: 1,
          // Handle when the DOM is ready
          ready: function(wait) {
            if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
              return;
            }
            jQuery.isReady = true;
            if (wait !== true && --jQuery.readyWait > 0) {
              return;
            }
            readyList.resolveWith(document2, [jQuery]);
          }
        });
        jQuery.ready.then = readyList.then;
        function completed() {
          document2.removeEventListener("DOMContentLoaded", completed);
          window2.removeEventListener("load", completed);
          jQuery.ready();
        }
        if (document2.readyState === "complete" || document2.readyState !== "loading" && !document2.documentElement.doScroll) {
          window2.setTimeout(jQuery.ready);
        } else {
          document2.addEventListener("DOMContentLoaded", completed);
          window2.addEventListener("load", completed);
        }
        var access = function(elems, fn, key, value, chainable, emptyGet, raw) {
          var i = 0, len = elems.length, bulk = key == null;
          if (toType(key) === "object") {
            chainable = true;
            for (i in key) {
              access(elems, fn, i, key[i], true, emptyGet, raw);
            }
          } else if (value !== void 0) {
            chainable = true;
            if (!isFunction2(value)) {
              raw = true;
            }
            if (bulk) {
              if (raw) {
                fn.call(elems, value);
                fn = null;
              } else {
                bulk = fn;
                fn = function(elem, _key, value2) {
                  return bulk.call(jQuery(elem), value2);
                };
              }
            }
            if (fn) {
              for (; i < len; i++) {
                fn(
                  elems[i],
                  key,
                  raw ? value : value.call(elems[i], i, fn(elems[i], key))
                );
              }
            }
          }
          if (chainable) {
            return elems;
          }
          if (bulk) {
            return fn.call(elems);
          }
          return len ? fn(elems[0], key) : emptyGet;
        };
        var rmsPrefix = /^-ms-/, rdashAlpha = /-([a-z])/g;
        function fcamelCase(_all, letter) {
          return letter.toUpperCase();
        }
        function camelCase(string) {
          return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
        }
        var acceptData = function(owner) {
          return owner.nodeType === 1 || owner.nodeType === 9 || !+owner.nodeType;
        };
        function Data() {
          this.expando = jQuery.expando + Data.uid++;
        }
        Data.uid = 1;
        Data.prototype = {
          cache: function(owner) {
            var value = owner[this.expando];
            if (!value) {
              value = {};
              if (acceptData(owner)) {
                if (owner.nodeType) {
                  owner[this.expando] = value;
                } else {
                  Object.defineProperty(owner, this.expando, {
                    value,
                    configurable: true
                  });
                }
              }
            }
            return value;
          },
          set: function(owner, data, value) {
            var prop, cache = this.cache(owner);
            if (typeof data === "string") {
              cache[camelCase(data)] = value;
            } else {
              for (prop in data) {
                cache[camelCase(prop)] = data[prop];
              }
            }
            return cache;
          },
          get: function(owner, key) {
            return key === void 0 ? this.cache(owner) : (
              // Always use camelCase key (gh-2257)
              owner[this.expando] && owner[this.expando][camelCase(key)]
            );
          },
          access: function(owner, key, value) {
            if (key === void 0 || key && typeof key === "string" && value === void 0) {
              return this.get(owner, key);
            }
            this.set(owner, key, value);
            return value !== void 0 ? value : key;
          },
          remove: function(owner, key) {
            var i, cache = owner[this.expando];
            if (cache === void 0) {
              return;
            }
            if (key !== void 0) {
              if (Array.isArray(key)) {
                key = key.map(camelCase);
              } else {
                key = camelCase(key);
                key = key in cache ? [key] : key.match(rnothtmlwhite) || [];
              }
              i = key.length;
              while (i--) {
                delete cache[key[i]];
              }
            }
            if (key === void 0 || jQuery.isEmptyObject(cache)) {
              if (owner.nodeType) {
                owner[this.expando] = void 0;
              } else {
                delete owner[this.expando];
              }
            }
          },
          hasData: function(owner) {
            var cache = owner[this.expando];
            return cache !== void 0 && !jQuery.isEmptyObject(cache);
          }
        };
        var dataPriv = new Data();
        var dataUser = new Data();
        var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, rmultiDash = /[A-Z]/g;
        function getData(data) {
          if (data === "true") {
            return true;
          }
          if (data === "false") {
            return false;
          }
          if (data === "null") {
            return null;
          }
          if (data === +data + "") {
            return +data;
          }
          if (rbrace.test(data)) {
            return JSON.parse(data);
          }
          return data;
        }
        function dataAttr(elem, key, data) {
          var name2;
          if (data === void 0 && elem.nodeType === 1) {
            name2 = "data-" + key.replace(rmultiDash, "-$&").toLowerCase();
            data = elem.getAttribute(name2);
            if (typeof data === "string") {
              try {
                data = getData(data);
              } catch (e) {
              }
              dataUser.set(elem, key, data);
            } else {
              data = void 0;
            }
          }
          return data;
        }
        jQuery.extend({
          hasData: function(elem) {
            return dataUser.hasData(elem) || dataPriv.hasData(elem);
          },
          data: function(elem, name2, data) {
            return dataUser.access(elem, name2, data);
          },
          removeData: function(elem, name2) {
            dataUser.remove(elem, name2);
          },
          // TODO: Now that all calls to _data and _removeData have been replaced
          // with direct calls to dataPriv methods, these can be deprecated.
          _data: function(elem, name2, data) {
            return dataPriv.access(elem, name2, data);
          },
          _removeData: function(elem, name2) {
            dataPriv.remove(elem, name2);
          }
        });
        jQuery.fn.extend({
          data: function(key, value) {
            var i, name2, data, elem = this[0], attrs = elem && elem.attributes;
            if (key === void 0) {
              if (this.length) {
                data = dataUser.get(elem);
                if (elem.nodeType === 1 && !dataPriv.get(elem, "hasDataAttrs")) {
                  i = attrs.length;
                  while (i--) {
                    if (attrs[i]) {
                      name2 = attrs[i].name;
                      if (name2.indexOf("data-") === 0) {
                        name2 = camelCase(name2.slice(5));
                        dataAttr(elem, name2, data[name2]);
                      }
                    }
                  }
                  dataPriv.set(elem, "hasDataAttrs", true);
                }
              }
              return data;
            }
            if (typeof key === "object") {
              return this.each(function() {
                dataUser.set(this, key);
              });
            }
            return access(this, function(value2) {
              var data2;
              if (elem && value2 === void 0) {
                data2 = dataUser.get(elem, key);
                if (data2 !== void 0) {
                  return data2;
                }
                data2 = dataAttr(elem, key);
                if (data2 !== void 0) {
                  return data2;
                }
                return;
              }
              this.each(function() {
                dataUser.set(this, key, value2);
              });
            }, null, value, arguments.length > 1, null, true);
          },
          removeData: function(key) {
            return this.each(function() {
              dataUser.remove(this, key);
            });
          }
        });
        jQuery.extend({
          queue: function(elem, type2, data) {
            var queue2;
            if (elem) {
              type2 = (type2 || "fx") + "queue";
              queue2 = dataPriv.get(elem, type2);
              if (data) {
                if (!queue2 || Array.isArray(data)) {
                  queue2 = dataPriv.access(elem, type2, jQuery.makeArray(data));
                } else {
                  queue2.push(data);
                }
              }
              return queue2 || [];
            }
          },
          dequeue: function(elem, type2) {
            type2 = type2 || "fx";
            var queue2 = jQuery.queue(elem, type2), startLength = queue2.length, fn = queue2.shift(), hooks = jQuery._queueHooks(elem, type2), next = function() {
              jQuery.dequeue(elem, type2);
            };
            if (fn === "inprogress") {
              fn = queue2.shift();
              startLength--;
            }
            if (fn) {
              if (type2 === "fx") {
                queue2.unshift("inprogress");
              }
              delete hooks.stop;
              fn.call(elem, next, hooks);
            }
            if (!startLength && hooks) {
              hooks.empty.fire();
            }
          },
          // Not public - generate a queueHooks object, or return the current one
          _queueHooks: function(elem, type2) {
            var key = type2 + "queueHooks";
            return dataPriv.get(elem, key) || dataPriv.access(elem, key, {
              empty: jQuery.Callbacks("once memory").add(function() {
                dataPriv.remove(elem, [type2 + "queue", key]);
              })
            });
          }
        });
        jQuery.fn.extend({
          queue: function(type2, data) {
            var setter = 2;
            if (typeof type2 !== "string") {
              data = type2;
              type2 = "fx";
              setter--;
            }
            if (arguments.length < setter) {
              return jQuery.queue(this[0], type2);
            }
            return data === void 0 ? this : this.each(function() {
              var queue2 = jQuery.queue(this, type2, data);
              jQuery._queueHooks(this, type2);
              if (type2 === "fx" && queue2[0] !== "inprogress") {
                jQuery.dequeue(this, type2);
              }
            });
          },
          dequeue: function(type2) {
            return this.each(function() {
              jQuery.dequeue(this, type2);
            });
          },
          clearQueue: function(type2) {
            return this.queue(type2 || "fx", []);
          },
          // Get a promise resolved when queues of a certain type
          // are emptied (fx is the type by default)
          promise: function(type2, obj) {
            var tmp, count = 1, defer = jQuery.Deferred(), elements = this, i = this.length, resolve2 = function() {
              if (!--count) {
                defer.resolveWith(elements, [elements]);
              }
            };
            if (typeof type2 !== "string") {
              obj = type2;
              type2 = void 0;
            }
            type2 = type2 || "fx";
            while (i--) {
              tmp = dataPriv.get(elements[i], type2 + "queueHooks");
              if (tmp && tmp.empty) {
                count++;
                tmp.empty.add(resolve2);
              }
            }
            resolve2();
            return defer.promise(obj);
          }
        });
        var pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;
        var rcssNum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i");
        var cssExpand = ["Top", "Right", "Bottom", "Left"];
        var documentElement = document2.documentElement;
        var isAttached = function(elem) {
          return jQuery.contains(elem.ownerDocument, elem);
        }, composed = { composed: true };
        if (documentElement.getRootNode) {
          isAttached = function(elem) {
            return jQuery.contains(elem.ownerDocument, elem) || elem.getRootNode(composed) === elem.ownerDocument;
          };
        }
        var isHiddenWithinTree = function(elem, el) {
          elem = el || elem;
          return elem.style.display === "none" || elem.style.display === "" && // Otherwise, check computed style
          // Support: Firefox <=43 - 45
          // Disconnected elements can have computed display: none, so first confirm that elem is
          // in the document.
          isAttached(elem) && jQuery.css(elem, "display") === "none";
        };
        function adjustCSS(elem, prop, valueParts, tween) {
          var adjusted, scale, maxIterations = 20, currentValue = tween ? function() {
            return tween.cur();
          } : function() {
            return jQuery.css(elem, prop, "");
          }, initial = currentValue(), unit = valueParts && valueParts[3] || (jQuery.cssNumber[prop] ? "" : "px"), initialInUnit = elem.nodeType && (jQuery.cssNumber[prop] || unit !== "px" && +initial) && rcssNum.exec(jQuery.css(elem, prop));
          if (initialInUnit && initialInUnit[3] !== unit) {
            initial = initial / 2;
            unit = unit || initialInUnit[3];
            initialInUnit = +initial || 1;
            while (maxIterations--) {
              jQuery.style(elem, prop, initialInUnit + unit);
              if ((1 - scale) * (1 - (scale = currentValue() / initial || 0.5)) <= 0) {
                maxIterations = 0;
              }
              initialInUnit = initialInUnit / scale;
            }
            initialInUnit = initialInUnit * 2;
            jQuery.style(elem, prop, initialInUnit + unit);
            valueParts = valueParts || [];
          }
          if (valueParts) {
            initialInUnit = +initialInUnit || +initial || 0;
            adjusted = valueParts[1] ? initialInUnit + (valueParts[1] + 1) * valueParts[2] : +valueParts[2];
            if (tween) {
              tween.unit = unit;
              tween.start = initialInUnit;
              tween.end = adjusted;
            }
          }
          return adjusted;
        }
        var defaultDisplayMap = {};
        function getDefaultDisplay(elem) {
          var temp, doc2 = elem.ownerDocument, nodeName2 = elem.nodeName, display = defaultDisplayMap[nodeName2];
          if (display) {
            return display;
          }
          temp = doc2.body.appendChild(doc2.createElement(nodeName2));
          display = jQuery.css(temp, "display");
          temp.parentNode.removeChild(temp);
          if (display === "none") {
            display = "block";
          }
          defaultDisplayMap[nodeName2] = display;
          return display;
        }
        function showHide(elements, show) {
          var display, elem, values = [], index = 0, length = elements.length;
          for (; index < length; index++) {
            elem = elements[index];
            if (!elem.style) {
              continue;
            }
            display = elem.style.display;
            if (show) {
              if (display === "none") {
                values[index] = dataPriv.get(elem, "display") || null;
                if (!values[index]) {
                  elem.style.display = "";
                }
              }
              if (elem.style.display === "" && isHiddenWithinTree(elem)) {
                values[index] = getDefaultDisplay(elem);
              }
            } else {
              if (display !== "none") {
                values[index] = "none";
                dataPriv.set(elem, "display", display);
              }
            }
          }
          for (index = 0; index < length; index++) {
            if (values[index] != null) {
              elements[index].style.display = values[index];
            }
          }
          return elements;
        }
        jQuery.fn.extend({
          show: function() {
            return showHide(this, true);
          },
          hide: function() {
            return showHide(this);
          },
          toggle: function(state) {
            if (typeof state === "boolean") {
              return state ? this.show() : this.hide();
            }
            return this.each(function() {
              if (isHiddenWithinTree(this)) {
                jQuery(this).show();
              } else {
                jQuery(this).hide();
              }
            });
          }
        });
        var rcheckableType = /^(?:checkbox|radio)$/i;
        var rtagName = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i;
        var rscriptType = /^$|^module$|\/(?:java|ecma)script/i;
        (function() {
          var fragment = document2.createDocumentFragment(), div = fragment.appendChild(document2.createElement("div")), input = document2.createElement("input");
          input.setAttribute("type", "radio");
          input.setAttribute("checked", "checked");
          input.setAttribute("name", "t");
          div.appendChild(input);
          support.checkClone = div.cloneNode(true).cloneNode(true).lastChild.checked;
          div.innerHTML = "<textarea>x</textarea>";
          support.noCloneChecked = !!div.cloneNode(true).lastChild.defaultValue;
          div.innerHTML = "<option></option>";
          support.option = !!div.lastChild;
        })();
        var wrapMap = {
          // XHTML parsers do not magically insert elements in the
          // same way that tag soup parsers do. So we cannot shorten
          // this by omitting <tbody> or other required elements.
          thead: [1, "<table>", "</table>"],
          col: [2, "<table><colgroup>", "</colgroup></table>"],
          tr: [2, "<table><tbody>", "</tbody></table>"],
          td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
          _default: [0, "", ""]
        };
        wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
        wrapMap.th = wrapMap.td;
        if (!support.option) {
          wrapMap.optgroup = wrapMap.option = [1, "<select multiple='multiple'>", "</select>"];
        }
        function getAll(context, tag2) {
          var ret;
          if (typeof context.getElementsByTagName !== "undefined") {
            ret = context.getElementsByTagName(tag2 || "*");
          } else if (typeof context.querySelectorAll !== "undefined") {
            ret = context.querySelectorAll(tag2 || "*");
          } else {
            ret = [];
          }
          if (tag2 === void 0 || tag2 && nodeName(context, tag2)) {
            return jQuery.merge([context], ret);
          }
          return ret;
        }
        function setGlobalEval(elems, refElements) {
          var i = 0, l = elems.length;
          for (; i < l; i++) {
            dataPriv.set(
              elems[i],
              "globalEval",
              !refElements || dataPriv.get(refElements[i], "globalEval")
            );
          }
        }
        var rhtml = /<|&#?\w+;/;
        function buildFragment(elems, context, scripts2, selection, ignored) {
          var elem, tmp, tag2, wrap, attached, j, fragment = context.createDocumentFragment(), nodes = [], i = 0, l = elems.length;
          for (; i < l; i++) {
            elem = elems[i];
            if (elem || elem === 0) {
              if (toType(elem) === "object") {
                jQuery.merge(nodes, elem.nodeType ? [elem] : elem);
              } else if (!rhtml.test(elem)) {
                nodes.push(context.createTextNode(elem));
              } else {
                tmp = tmp || fragment.appendChild(context.createElement("div"));
                tag2 = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
                wrap = wrapMap[tag2] || wrapMap._default;
                tmp.innerHTML = wrap[1] + jQuery.htmlPrefilter(elem) + wrap[2];
                j = wrap[0];
                while (j--) {
                  tmp = tmp.lastChild;
                }
                jQuery.merge(nodes, tmp.childNodes);
                tmp = fragment.firstChild;
                tmp.textContent = "";
              }
            }
          }
          fragment.textContent = "";
          i = 0;
          while (elem = nodes[i++]) {
            if (selection && jQuery.inArray(elem, selection) > -1) {
              if (ignored) {
                ignored.push(elem);
              }
              continue;
            }
            attached = isAttached(elem);
            tmp = getAll(fragment.appendChild(elem), "script");
            if (attached) {
              setGlobalEval(tmp);
            }
            if (scripts2) {
              j = 0;
              while (elem = tmp[j++]) {
                if (rscriptType.test(elem.type || "")) {
                  scripts2.push(elem);
                }
              }
            }
          }
          return fragment;
        }
        var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;
        function returnTrue() {
          return true;
        }
        function returnFalse() {
          return false;
        }
        function on(elem, types, selector, data, fn, one) {
          var origFn, type2;
          if (typeof types === "object") {
            if (typeof selector !== "string") {
              data = data || selector;
              selector = void 0;
            }
            for (type2 in types) {
              on(elem, type2, selector, data, types[type2], one);
            }
            return elem;
          }
          if (data == null && fn == null) {
            fn = selector;
            data = selector = void 0;
          } else if (fn == null) {
            if (typeof selector === "string") {
              fn = data;
              data = void 0;
            } else {
              fn = data;
              data = selector;
              selector = void 0;
            }
          }
          if (fn === false) {
            fn = returnFalse;
          } else if (!fn) {
            return elem;
          }
          if (one === 1) {
            origFn = fn;
            fn = function(event) {
              jQuery().off(event);
              return origFn.apply(this, arguments);
            };
            fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
          }
          return elem.each(function() {
            jQuery.event.add(this, types, fn, data, selector);
          });
        }
        jQuery.event = {
          global: {},
          add: function(elem, types, handler, data, selector) {
            var handleObjIn, eventHandle, tmp, events, t, handleObj, special, handlers, type2, namespaces, origType, elemData = dataPriv.get(elem);
            if (!acceptData(elem)) {
              return;
            }
            if (handler.handler) {
              handleObjIn = handler;
              handler = handleObjIn.handler;
              selector = handleObjIn.selector;
            }
            if (selector) {
              jQuery.find.matchesSelector(documentElement, selector);
            }
            if (!handler.guid) {
              handler.guid = jQuery.guid++;
            }
            if (!(events = elemData.events)) {
              events = elemData.events = /* @__PURE__ */ Object.create(null);
            }
            if (!(eventHandle = elemData.handle)) {
              eventHandle = elemData.handle = function(e) {
                return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ? jQuery.event.dispatch.apply(elem, arguments) : void 0;
              };
            }
            types = (types || "").match(rnothtmlwhite) || [""];
            t = types.length;
            while (t--) {
              tmp = rtypenamespace.exec(types[t]) || [];
              type2 = origType = tmp[1];
              namespaces = (tmp[2] || "").split(".").sort();
              if (!type2) {
                continue;
              }
              special = jQuery.event.special[type2] || {};
              type2 = (selector ? special.delegateType : special.bindType) || type2;
              special = jQuery.event.special[type2] || {};
              handleObj = jQuery.extend({
                type: type2,
                origType,
                data,
                handler,
                guid: handler.guid,
                selector,
                needsContext: selector && jQuery.expr.match.needsContext.test(selector),
                namespace: namespaces.join(".")
              }, handleObjIn);
              if (!(handlers = events[type2])) {
                handlers = events[type2] = [];
                handlers.delegateCount = 0;
                if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {
                  if (elem.addEventListener) {
                    elem.addEventListener(type2, eventHandle);
                  }
                }
              }
              if (special.add) {
                special.add.call(elem, handleObj);
                if (!handleObj.handler.guid) {
                  handleObj.handler.guid = handler.guid;
                }
              }
              if (selector) {
                handlers.splice(handlers.delegateCount++, 0, handleObj);
              } else {
                handlers.push(handleObj);
              }
              jQuery.event.global[type2] = true;
            }
          },
          // Detach an event or set of events from an element
          remove: function(elem, types, handler, selector, mappedTypes) {
            var j, origCount, tmp, events, t, handleObj, special, handlers, type2, namespaces, origType, elemData = dataPriv.hasData(elem) && dataPriv.get(elem);
            if (!elemData || !(events = elemData.events)) {
              return;
            }
            types = (types || "").match(rnothtmlwhite) || [""];
            t = types.length;
            while (t--) {
              tmp = rtypenamespace.exec(types[t]) || [];
              type2 = origType = tmp[1];
              namespaces = (tmp[2] || "").split(".").sort();
              if (!type2) {
                for (type2 in events) {
                  jQuery.event.remove(elem, type2 + types[t], handler, selector, true);
                }
                continue;
              }
              special = jQuery.event.special[type2] || {};
              type2 = (selector ? special.delegateType : special.bindType) || type2;
              handlers = events[type2] || [];
              tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");
              origCount = j = handlers.length;
              while (j--) {
                handleObj = handlers[j];
                if ((mappedTypes || origType === handleObj.origType) && (!handler || handler.guid === handleObj.guid) && (!tmp || tmp.test(handleObj.namespace)) && (!selector || selector === handleObj.selector || selector === "**" && handleObj.selector)) {
                  handlers.splice(j, 1);
                  if (handleObj.selector) {
                    handlers.delegateCount--;
                  }
                  if (special.remove) {
                    special.remove.call(elem, handleObj);
                  }
                }
              }
              if (origCount && !handlers.length) {
                if (!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false) {
                  jQuery.removeEvent(elem, type2, elemData.handle);
                }
                delete events[type2];
              }
            }
            if (jQuery.isEmptyObject(events)) {
              dataPriv.remove(elem, "handle events");
            }
          },
          dispatch: function(nativeEvent) {
            var i, j, ret, matched, handleObj, handlerQueue, args = new Array(arguments.length), event = jQuery.event.fix(nativeEvent), handlers = (dataPriv.get(this, "events") || /* @__PURE__ */ Object.create(null))[event.type] || [], special = jQuery.event.special[event.type] || {};
            args[0] = event;
            for (i = 1; i < arguments.length; i++) {
              args[i] = arguments[i];
            }
            event.delegateTarget = this;
            if (special.preDispatch && special.preDispatch.call(this, event) === false) {
              return;
            }
            handlerQueue = jQuery.event.handlers.call(this, event, handlers);
            i = 0;
            while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
              event.currentTarget = matched.elem;
              j = 0;
              while ((handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped()) {
                if (!event.rnamespace || handleObj.namespace === false || event.rnamespace.test(handleObj.namespace)) {
                  event.handleObj = handleObj;
                  event.data = handleObj.data;
                  ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args);
                  if (ret !== void 0) {
                    if ((event.result = ret) === false) {
                      event.preventDefault();
                      event.stopPropagation();
                    }
                  }
                }
              }
            }
            if (special.postDispatch) {
              special.postDispatch.call(this, event);
            }
            return event.result;
          },
          handlers: function(event, handlers) {
            var i, handleObj, sel, matchedHandlers, matchedSelectors, handlerQueue = [], delegateCount = handlers.delegateCount, cur = event.target;
            if (delegateCount && // Support: IE <=9
            // Black-hole SVG <use> instance trees (trac-13180)
            cur.nodeType && // Support: Firefox <=42
            // Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
            // https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
            // Support: IE 11 only
            // ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
            !(event.type === "click" && event.button >= 1)) {
              for (; cur !== this; cur = cur.parentNode || this) {
                if (cur.nodeType === 1 && !(event.type === "click" && cur.disabled === true)) {
                  matchedHandlers = [];
                  matchedSelectors = {};
                  for (i = 0; i < delegateCount; i++) {
                    handleObj = handlers[i];
                    sel = handleObj.selector + " ";
                    if (matchedSelectors[sel] === void 0) {
                      matchedSelectors[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) > -1 : jQuery.find(sel, this, null, [cur]).length;
                    }
                    if (matchedSelectors[sel]) {
                      matchedHandlers.push(handleObj);
                    }
                  }
                  if (matchedHandlers.length) {
                    handlerQueue.push({ elem: cur, handlers: matchedHandlers });
                  }
                }
              }
            }
            cur = this;
            if (delegateCount < handlers.length) {
              handlerQueue.push({ elem: cur, handlers: handlers.slice(delegateCount) });
            }
            return handlerQueue;
          },
          addProp: function(name2, hook) {
            Object.defineProperty(jQuery.Event.prototype, name2, {
              enumerable: true,
              configurable: true,
              get: isFunction2(hook) ? function() {
                if (this.originalEvent) {
                  return hook(this.originalEvent);
                }
              } : function() {
                if (this.originalEvent) {
                  return this.originalEvent[name2];
                }
              },
              set: function(value) {
                Object.defineProperty(this, name2, {
                  enumerable: true,
                  configurable: true,
                  writable: true,
                  value
                });
              }
            });
          },
          fix: function(originalEvent) {
            return originalEvent[jQuery.expando] ? originalEvent : new jQuery.Event(originalEvent);
          },
          special: {
            load: {
              // Prevent triggered image.load events from bubbling to window.load
              noBubble: true
            },
            click: {
              // Utilize native event to ensure correct state for checkable inputs
              setup: function(data) {
                var el = this || data;
                if (rcheckableType.test(el.type) && el.click && nodeName(el, "input")) {
                  leverageNative(el, "click", true);
                }
                return false;
              },
              trigger: function(data) {
                var el = this || data;
                if (rcheckableType.test(el.type) && el.click && nodeName(el, "input")) {
                  leverageNative(el, "click");
                }
                return true;
              },
              // For cross-browser consistency, suppress native .click() on links
              // Also prevent it if we're currently inside a leveraged native-event stack
              _default: function(event) {
                var target = event.target;
                return rcheckableType.test(target.type) && target.click && nodeName(target, "input") && dataPriv.get(target, "click") || nodeName(target, "a");
              }
            },
            beforeunload: {
              postDispatch: function(event) {
                if (event.result !== void 0 && event.originalEvent) {
                  event.originalEvent.returnValue = event.result;
                }
              }
            }
          }
        };
        function leverageNative(el, type2, isSetup) {
          if (!isSetup) {
            if (dataPriv.get(el, type2) === void 0) {
              jQuery.event.add(el, type2, returnTrue);
            }
            return;
          }
          dataPriv.set(el, type2, false);
          jQuery.event.add(el, type2, {
            namespace: false,
            handler: function(event) {
              var result2, saved = dataPriv.get(this, type2);
              if (event.isTrigger & 1 && this[type2]) {
                if (!saved) {
                  saved = slice.call(arguments);
                  dataPriv.set(this, type2, saved);
                  this[type2]();
                  result2 = dataPriv.get(this, type2);
                  dataPriv.set(this, type2, false);
                  if (saved !== result2) {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    return result2;
                  }
                } else if ((jQuery.event.special[type2] || {}).delegateType) {
                  event.stopPropagation();
                }
              } else if (saved) {
                dataPriv.set(this, type2, jQuery.event.trigger(
                  saved[0],
                  saved.slice(1),
                  this
                ));
                event.stopPropagation();
                event.isImmediatePropagationStopped = returnTrue;
              }
            }
          });
        }
        jQuery.removeEvent = function(elem, type2, handle) {
          if (elem.removeEventListener) {
            elem.removeEventListener(type2, handle);
          }
        };
        jQuery.Event = function(src, props) {
          if (!(this instanceof jQuery.Event)) {
            return new jQuery.Event(src, props);
          }
          if (src && src.type) {
            this.originalEvent = src;
            this.type = src.type;
            this.isDefaultPrevented = src.defaultPrevented || src.defaultPrevented === void 0 && // Support: Android <=2.3 only
            src.returnValue === false ? returnTrue : returnFalse;
            this.target = src.target && src.target.nodeType === 3 ? src.target.parentNode : src.target;
            this.currentTarget = src.currentTarget;
            this.relatedTarget = src.relatedTarget;
          } else {
            this.type = src;
          }
          if (props) {
            jQuery.extend(this, props);
          }
          this.timeStamp = src && src.timeStamp || Date.now();
          this[jQuery.expando] = true;
        };
        jQuery.Event.prototype = {
          constructor: jQuery.Event,
          isDefaultPrevented: returnFalse,
          isPropagationStopped: returnFalse,
          isImmediatePropagationStopped: returnFalse,
          isSimulated: false,
          preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = returnTrue;
            if (e && !this.isSimulated) {
              e.preventDefault();
            }
          },
          stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = returnTrue;
            if (e && !this.isSimulated) {
              e.stopPropagation();
            }
          },
          stopImmediatePropagation: function() {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = returnTrue;
            if (e && !this.isSimulated) {
              e.stopImmediatePropagation();
            }
            this.stopPropagation();
          }
        };
        jQuery.each({
          altKey: true,
          bubbles: true,
          cancelable: true,
          changedTouches: true,
          ctrlKey: true,
          detail: true,
          eventPhase: true,
          metaKey: true,
          pageX: true,
          pageY: true,
          shiftKey: true,
          view: true,
          "char": true,
          code: true,
          charCode: true,
          key: true,
          keyCode: true,
          button: true,
          buttons: true,
          clientX: true,
          clientY: true,
          offsetX: true,
          offsetY: true,
          pointerId: true,
          pointerType: true,
          screenX: true,
          screenY: true,
          targetTouches: true,
          toElement: true,
          touches: true,
          which: true
        }, jQuery.event.addProp);
        jQuery.each({ focus: "focusin", blur: "focusout" }, function(type2, delegateType) {
          function focusMappedHandler(nativeEvent) {
            if (document2.documentMode) {
              var handle = dataPriv.get(this, "handle"), event = jQuery.event.fix(nativeEvent);
              event.type = nativeEvent.type === "focusin" ? "focus" : "blur";
              event.isSimulated = true;
              handle(nativeEvent);
              if (event.target === event.currentTarget) {
                handle(event);
              }
            } else {
              jQuery.event.simulate(
                delegateType,
                nativeEvent.target,
                jQuery.event.fix(nativeEvent)
              );
            }
          }
          jQuery.event.special[type2] = {
            // Utilize native event if possible so blur/focus sequence is correct
            setup: function() {
              var attaches;
              leverageNative(this, type2, true);
              if (document2.documentMode) {
                attaches = dataPriv.get(this, delegateType);
                if (!attaches) {
                  this.addEventListener(delegateType, focusMappedHandler);
                }
                dataPriv.set(this, delegateType, (attaches || 0) + 1);
              } else {
                return false;
              }
            },
            trigger: function() {
              leverageNative(this, type2);
              return true;
            },
            teardown: function() {
              var attaches;
              if (document2.documentMode) {
                attaches = dataPriv.get(this, delegateType) - 1;
                if (!attaches) {
                  this.removeEventListener(delegateType, focusMappedHandler);
                  dataPriv.remove(this, delegateType);
                } else {
                  dataPriv.set(this, delegateType, attaches);
                }
              } else {
                return false;
              }
            },
            // Suppress native focus or blur if we're currently inside
            // a leveraged native-event stack
            _default: function(event) {
              return dataPriv.get(event.target, type2);
            },
            delegateType
          };
          jQuery.event.special[delegateType] = {
            setup: function() {
              var doc2 = this.ownerDocument || this.document || this, dataHolder = document2.documentMode ? this : doc2, attaches = dataPriv.get(dataHolder, delegateType);
              if (!attaches) {
                if (document2.documentMode) {
                  this.addEventListener(delegateType, focusMappedHandler);
                } else {
                  doc2.addEventListener(type2, focusMappedHandler, true);
                }
              }
              dataPriv.set(dataHolder, delegateType, (attaches || 0) + 1);
            },
            teardown: function() {
              var doc2 = this.ownerDocument || this.document || this, dataHolder = document2.documentMode ? this : doc2, attaches = dataPriv.get(dataHolder, delegateType) - 1;
              if (!attaches) {
                if (document2.documentMode) {
                  this.removeEventListener(delegateType, focusMappedHandler);
                } else {
                  doc2.removeEventListener(type2, focusMappedHandler, true);
                }
                dataPriv.remove(dataHolder, delegateType);
              } else {
                dataPriv.set(dataHolder, delegateType, attaches);
              }
            }
          };
        });
        jQuery.each({
          mouseenter: "mouseover",
          mouseleave: "mouseout",
          pointerenter: "pointerover",
          pointerleave: "pointerout"
        }, function(orig, fix) {
          jQuery.event.special[orig] = {
            delegateType: fix,
            bindType: fix,
            handle: function(event) {
              var ret, target = this, related = event.relatedTarget, handleObj = event.handleObj;
              if (!related || related !== target && !jQuery.contains(target, related)) {
                event.type = handleObj.origType;
                ret = handleObj.handler.apply(this, arguments);
                event.type = fix;
              }
              return ret;
            }
          };
        });
        jQuery.fn.extend({
          on: function(types, selector, data, fn) {
            return on(this, types, selector, data, fn);
          },
          one: function(types, selector, data, fn) {
            return on(this, types, selector, data, fn, 1);
          },
          off: function(types, selector, fn) {
            var handleObj, type2;
            if (types && types.preventDefault && types.handleObj) {
              handleObj = types.handleObj;
              jQuery(types.delegateTarget).off(
                handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
                handleObj.selector,
                handleObj.handler
              );
              return this;
            }
            if (typeof types === "object") {
              for (type2 in types) {
                this.off(type2, selector, types[type2]);
              }
              return this;
            }
            if (selector === false || typeof selector === "function") {
              fn = selector;
              selector = void 0;
            }
            if (fn === false) {
              fn = returnFalse;
            }
            return this.each(function() {
              jQuery.event.remove(this, types, fn, selector);
            });
          }
        });
        var rnoInnerhtml = /<script|<style|<link/i, rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i, rcleanScript = /^\s*<!\[CDATA\[|\]\]>\s*$/g;
        function manipulationTarget(elem, content2) {
          if (nodeName(elem, "table") && nodeName(content2.nodeType !== 11 ? content2 : content2.firstChild, "tr")) {
            return jQuery(elem).children("tbody")[0] || elem;
          }
          return elem;
        }
        function disableScript(elem) {
          elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
          return elem;
        }
        function restoreScript(elem) {
          if ((elem.type || "").slice(0, 5) === "true/") {
            elem.type = elem.type.slice(5);
          } else {
            elem.removeAttribute("type");
          }
          return elem;
        }
        function cloneCopyEvent(src, dest) {
          var i, l, type2, pdataOld, udataOld, udataCur, events;
          if (dest.nodeType !== 1) {
            return;
          }
          if (dataPriv.hasData(src)) {
            pdataOld = dataPriv.get(src);
            events = pdataOld.events;
            if (events) {
              dataPriv.remove(dest, "handle events");
              for (type2 in events) {
                for (i = 0, l = events[type2].length; i < l; i++) {
                  jQuery.event.add(dest, type2, events[type2][i]);
                }
              }
            }
          }
          if (dataUser.hasData(src)) {
            udataOld = dataUser.access(src);
            udataCur = jQuery.extend({}, udataOld);
            dataUser.set(dest, udataCur);
          }
        }
        function fixInput(src, dest) {
          var nodeName2 = dest.nodeName.toLowerCase();
          if (nodeName2 === "input" && rcheckableType.test(src.type)) {
            dest.checked = src.checked;
          } else if (nodeName2 === "input" || nodeName2 === "textarea") {
            dest.defaultValue = src.defaultValue;
          }
        }
        function domManip(collection, args, callback, ignored) {
          args = flat(args);
          var fragment, first, scripts2, hasScripts, node, doc2, i = 0, l = collection.length, iNoClone = l - 1, value = args[0], valueIsFunction = isFunction2(value);
          if (valueIsFunction || l > 1 && typeof value === "string" && !support.checkClone && rchecked.test(value)) {
            return collection.each(function(index) {
              var self2 = collection.eq(index);
              if (valueIsFunction) {
                args[0] = value.call(this, index, self2.html());
              }
              domManip(self2, args, callback, ignored);
            });
          }
          if (l) {
            fragment = buildFragment(args, collection[0].ownerDocument, false, collection, ignored);
            first = fragment.firstChild;
            if (fragment.childNodes.length === 1) {
              fragment = first;
            }
            if (first || ignored) {
              scripts2 = jQuery.map(getAll(fragment, "script"), disableScript);
              hasScripts = scripts2.length;
              for (; i < l; i++) {
                node = fragment;
                if (i !== iNoClone) {
                  node = jQuery.clone(node, true, true);
                  if (hasScripts) {
                    jQuery.merge(scripts2, getAll(node, "script"));
                  }
                }
                callback.call(collection[i], node, i);
              }
              if (hasScripts) {
                doc2 = scripts2[scripts2.length - 1].ownerDocument;
                jQuery.map(scripts2, restoreScript);
                for (i = 0; i < hasScripts; i++) {
                  node = scripts2[i];
                  if (rscriptType.test(node.type || "") && !dataPriv.access(node, "globalEval") && jQuery.contains(doc2, node)) {
                    if (node.src && (node.type || "").toLowerCase() !== "module") {
                      if (jQuery._evalUrl && !node.noModule) {
                        jQuery._evalUrl(node.src, {
                          nonce: node.nonce || node.getAttribute("nonce")
                        }, doc2);
                      }
                    } else {
                      DOMEval(node.textContent.replace(rcleanScript, ""), node, doc2);
                    }
                  }
                }
              }
            }
          }
          return collection;
        }
        function remove2(elem, selector, keepData) {
          var node, nodes = selector ? jQuery.filter(selector, elem) : elem, i = 0;
          for (; (node = nodes[i]) != null; i++) {
            if (!keepData && node.nodeType === 1) {
              jQuery.cleanData(getAll(node));
            }
            if (node.parentNode) {
              if (keepData && isAttached(node)) {
                setGlobalEval(getAll(node, "script"));
              }
              node.parentNode.removeChild(node);
            }
          }
          return elem;
        }
        jQuery.extend({
          htmlPrefilter: function(html2) {
            return html2;
          },
          clone: function(elem, dataAndEvents, deepDataAndEvents) {
            var i, l, srcElements, destElements, clone = elem.cloneNode(true), inPage = isAttached(elem);
            if (!support.noCloneChecked && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {
              destElements = getAll(clone);
              srcElements = getAll(elem);
              for (i = 0, l = srcElements.length; i < l; i++) {
                fixInput(srcElements[i], destElements[i]);
              }
            }
            if (dataAndEvents) {
              if (deepDataAndEvents) {
                srcElements = srcElements || getAll(elem);
                destElements = destElements || getAll(clone);
                for (i = 0, l = srcElements.length; i < l; i++) {
                  cloneCopyEvent(srcElements[i], destElements[i]);
                }
              } else {
                cloneCopyEvent(elem, clone);
              }
            }
            destElements = getAll(clone, "script");
            if (destElements.length > 0) {
              setGlobalEval(destElements, !inPage && getAll(elem, "script"));
            }
            return clone;
          },
          cleanData: function(elems) {
            var data, elem, type2, special = jQuery.event.special, i = 0;
            for (; (elem = elems[i]) !== void 0; i++) {
              if (acceptData(elem)) {
                if (data = elem[dataPriv.expando]) {
                  if (data.events) {
                    for (type2 in data.events) {
                      if (special[type2]) {
                        jQuery.event.remove(elem, type2);
                      } else {
                        jQuery.removeEvent(elem, type2, data.handle);
                      }
                    }
                  }
                  elem[dataPriv.expando] = void 0;
                }
                if (elem[dataUser.expando]) {
                  elem[dataUser.expando] = void 0;
                }
              }
            }
          }
        });
        jQuery.fn.extend({
          detach: function(selector) {
            return remove2(this, selector, true);
          },
          remove: function(selector) {
            return remove2(this, selector);
          },
          text: function(value) {
            return access(this, function(value2) {
              return value2 === void 0 ? jQuery.text(this) : this.empty().each(function() {
                if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                  this.textContent = value2;
                }
              });
            }, null, value, arguments.length);
          },
          append: function() {
            return domManip(this, arguments, function(elem) {
              if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                var target = manipulationTarget(this, elem);
                target.appendChild(elem);
              }
            });
          },
          prepend: function() {
            return domManip(this, arguments, function(elem) {
              if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                var target = manipulationTarget(this, elem);
                target.insertBefore(elem, target.firstChild);
              }
            });
          },
          before: function() {
            return domManip(this, arguments, function(elem) {
              if (this.parentNode) {
                this.parentNode.insertBefore(elem, this);
              }
            });
          },
          after: function() {
            return domManip(this, arguments, function(elem) {
              if (this.parentNode) {
                this.parentNode.insertBefore(elem, this.nextSibling);
              }
            });
          },
          empty: function() {
            var elem, i = 0;
            for (; (elem = this[i]) != null; i++) {
              if (elem.nodeType === 1) {
                jQuery.cleanData(getAll(elem, false));
                elem.textContent = "";
              }
            }
            return this;
          },
          clone: function(dataAndEvents, deepDataAndEvents) {
            dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
            deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
            return this.map(function() {
              return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
            });
          },
          html: function(value) {
            return access(this, function(value2) {
              var elem = this[0] || {}, i = 0, l = this.length;
              if (value2 === void 0 && elem.nodeType === 1) {
                return elem.innerHTML;
              }
              if (typeof value2 === "string" && !rnoInnerhtml.test(value2) && !wrapMap[(rtagName.exec(value2) || ["", ""])[1].toLowerCase()]) {
                value2 = jQuery.htmlPrefilter(value2);
                try {
                  for (; i < l; i++) {
                    elem = this[i] || {};
                    if (elem.nodeType === 1) {
                      jQuery.cleanData(getAll(elem, false));
                      elem.innerHTML = value2;
                    }
                  }
                  elem = 0;
                } catch (e) {
                }
              }
              if (elem) {
                this.empty().append(value2);
              }
            }, null, value, arguments.length);
          },
          replaceWith: function() {
            var ignored = [];
            return domManip(this, arguments, function(elem) {
              var parent = this.parentNode;
              if (jQuery.inArray(this, ignored) < 0) {
                jQuery.cleanData(getAll(this));
                if (parent) {
                  parent.replaceChild(elem, this);
                }
              }
            }, ignored);
          }
        });
        jQuery.each({
          appendTo: "append",
          prependTo: "prepend",
          insertBefore: "before",
          insertAfter: "after",
          replaceAll: "replaceWith"
        }, function(name2, original) {
          jQuery.fn[name2] = function(selector) {
            var elems, ret = [], insert = jQuery(selector), last = insert.length - 1, i = 0;
            for (; i <= last; i++) {
              elems = i === last ? this : this.clone(true);
              jQuery(insert[i])[original](elems);
              push.apply(ret, elems.get());
            }
            return this.pushStack(ret);
          };
        });
        var rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i");
        var rcustomProp = /^--/;
        var getStyles = function(elem) {
          var view = elem.ownerDocument.defaultView;
          if (!view || !view.opener) {
            view = window2;
          }
          return view.getComputedStyle(elem);
        };
        var swap = function(elem, options, callback) {
          var ret, name2, old = {};
          for (name2 in options) {
            old[name2] = elem.style[name2];
            elem.style[name2] = options[name2];
          }
          ret = callback.call(elem);
          for (name2 in options) {
            elem.style[name2] = old[name2];
          }
          return ret;
        };
        var rboxStyle = new RegExp(cssExpand.join("|"), "i");
        (function() {
          function computeStyleTests() {
            if (!div) {
              return;
            }
            container.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0";
            div.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%";
            documentElement.appendChild(container).appendChild(div);
            var divStyle = window2.getComputedStyle(div);
            pixelPositionVal = divStyle.top !== "1%";
            reliableMarginLeftVal = roundPixelMeasures(divStyle.marginLeft) === 12;
            div.style.right = "60%";
            pixelBoxStylesVal = roundPixelMeasures(divStyle.right) === 36;
            boxSizingReliableVal = roundPixelMeasures(divStyle.width) === 36;
            div.style.position = "absolute";
            scrollboxSizeVal = roundPixelMeasures(div.offsetWidth / 3) === 12;
            documentElement.removeChild(container);
            div = null;
          }
          function roundPixelMeasures(measure) {
            return Math.round(parseFloat(measure));
          }
          var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal, reliableTrDimensionsVal, reliableMarginLeftVal, container = document2.createElement("div"), div = document2.createElement("div");
          if (!div.style) {
            return;
          }
          div.style.backgroundClip = "content-box";
          div.cloneNode(true).style.backgroundClip = "";
          support.clearCloneStyle = div.style.backgroundClip === "content-box";
          jQuery.extend(support, {
            boxSizingReliable: function() {
              computeStyleTests();
              return boxSizingReliableVal;
            },
            pixelBoxStyles: function() {
              computeStyleTests();
              return pixelBoxStylesVal;
            },
            pixelPosition: function() {
              computeStyleTests();
              return pixelPositionVal;
            },
            reliableMarginLeft: function() {
              computeStyleTests();
              return reliableMarginLeftVal;
            },
            scrollboxSize: function() {
              computeStyleTests();
              return scrollboxSizeVal;
            },
            // Support: IE 9 - 11+, Edge 15 - 18+
            // IE/Edge misreport `getComputedStyle` of table rows with width/height
            // set in CSS while `offset*` properties report correct values.
            // Behavior in IE 9 is more subtle than in newer versions & it passes
            // some versions of this test; make sure not to make it pass there!
            //
            // Support: Firefox 70+
            // Only Firefox includes border widths
            // in computed dimensions. (gh-4529)
            reliableTrDimensions: function() {
              var table, tr, trChild, trStyle;
              if (reliableTrDimensionsVal == null) {
                table = document2.createElement("table");
                tr = document2.createElement("tr");
                trChild = document2.createElement("div");
                table.style.cssText = "position:absolute;left:-11111px;border-collapse:separate";
                tr.style.cssText = "box-sizing:content-box;border:1px solid";
                tr.style.height = "1px";
                trChild.style.height = "9px";
                trChild.style.display = "block";
                documentElement.appendChild(table).appendChild(tr).appendChild(trChild);
                trStyle = window2.getComputedStyle(tr);
                reliableTrDimensionsVal = parseInt(trStyle.height, 10) + parseInt(trStyle.borderTopWidth, 10) + parseInt(trStyle.borderBottomWidth, 10) === tr.offsetHeight;
                documentElement.removeChild(table);
              }
              return reliableTrDimensionsVal;
            }
          });
        })();
        function curCSS(elem, name2, computed2) {
          var width, minWidth, maxWidth, ret, isCustomProp = rcustomProp.test(name2), style = elem.style;
          computed2 = computed2 || getStyles(elem);
          if (computed2) {
            ret = computed2.getPropertyValue(name2) || computed2[name2];
            if (isCustomProp && ret) {
              ret = ret.replace(rtrimCSS, "$1") || void 0;
            }
            if (ret === "" && !isAttached(elem)) {
              ret = jQuery.style(elem, name2);
            }
            if (!support.pixelBoxStyles() && rnumnonpx.test(ret) && rboxStyle.test(name2)) {
              width = style.width;
              minWidth = style.minWidth;
              maxWidth = style.maxWidth;
              style.minWidth = style.maxWidth = style.width = ret;
              ret = computed2.width;
              style.width = width;
              style.minWidth = minWidth;
              style.maxWidth = maxWidth;
            }
          }
          return ret !== void 0 ? (
            // Support: IE <=9 - 11 only
            // IE returns zIndex value as an integer.
            ret + ""
          ) : ret;
        }
        function addGetHookIf(conditionFn, hookFn) {
          return {
            get: function() {
              if (conditionFn()) {
                delete this.get;
                return;
              }
              return (this.get = hookFn).apply(this, arguments);
            }
          };
        }
        var cssPrefixes = ["Webkit", "Moz", "ms"], emptyStyle = document2.createElement("div").style, vendorProps = {};
        function vendorPropName(name2) {
          var capName = name2[0].toUpperCase() + name2.slice(1), i = cssPrefixes.length;
          while (i--) {
            name2 = cssPrefixes[i] + capName;
            if (name2 in emptyStyle) {
              return name2;
            }
          }
        }
        function finalPropName(name2) {
          var final = jQuery.cssProps[name2] || vendorProps[name2];
          if (final) {
            return final;
          }
          if (name2 in emptyStyle) {
            return name2;
          }
          return vendorProps[name2] = vendorPropName(name2) || name2;
        }
        var rdisplayswap = /^(none|table(?!-c[ea]).+)/, cssShow = { position: "absolute", visibility: "hidden", display: "block" }, cssNormalTransform = {
          letterSpacing: "0",
          fontWeight: "400"
        };
        function setPositiveNumber(_elem, value, subtract) {
          var matches = rcssNum.exec(value);
          return matches ? (
            // Guard against undefined "subtract", e.g., when used as in cssHooks
            Math.max(0, matches[2] - (subtract || 0)) + (matches[3] || "px")
          ) : value;
        }
        function boxModelAdjustment(elem, dimension, box, isBorderBox, styles, computedVal) {
          var i = dimension === "width" ? 1 : 0, extra = 0, delta = 0, marginDelta = 0;
          if (box === (isBorderBox ? "border" : "content")) {
            return 0;
          }
          for (; i < 4; i += 2) {
            if (box === "margin") {
              marginDelta += jQuery.css(elem, box + cssExpand[i], true, styles);
            }
            if (!isBorderBox) {
              delta += jQuery.css(elem, "padding" + cssExpand[i], true, styles);
              if (box !== "padding") {
                delta += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
              } else {
                extra += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
              }
            } else {
              if (box === "content") {
                delta -= jQuery.css(elem, "padding" + cssExpand[i], true, styles);
              }
              if (box !== "margin") {
                delta -= jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
              }
            }
          }
          if (!isBorderBox && computedVal >= 0) {
            delta += Math.max(0, Math.ceil(
              elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] - computedVal - delta - extra - 0.5
              // If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
              // Use an explicit zero to avoid NaN (gh-3964)
            )) || 0;
          }
          return delta + marginDelta;
        }
        function getWidthOrHeight(elem, dimension, extra) {
          var styles = getStyles(elem), boxSizingNeeded = !support.boxSizingReliable() || extra, isBorderBox = boxSizingNeeded && jQuery.css(elem, "boxSizing", false, styles) === "border-box", valueIsBorderBox = isBorderBox, val = curCSS(elem, dimension, styles), offsetProp = "offset" + dimension[0].toUpperCase() + dimension.slice(1);
          if (rnumnonpx.test(val)) {
            if (!extra) {
              return val;
            }
            val = "auto";
          }
          if ((!support.boxSizingReliable() && isBorderBox || // Support: IE 10 - 11+, Edge 15 - 18+
          // IE/Edge misreport `getComputedStyle` of table rows with width/height
          // set in CSS while `offset*` properties report correct values.
          // Interestingly, in some cases IE 9 doesn't suffer from this issue.
          !support.reliableTrDimensions() && nodeName(elem, "tr") || // Fall back to offsetWidth/offsetHeight when value is "auto"
          // This happens for inline elements with no explicit setting (gh-3571)
          val === "auto" || // Support: Android <=4.1 - 4.3 only
          // Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
          !parseFloat(val) && jQuery.css(elem, "display", false, styles) === "inline") && // Make sure the element is visible & connected
          elem.getClientRects().length) {
            isBorderBox = jQuery.css(elem, "boxSizing", false, styles) === "border-box";
            valueIsBorderBox = offsetProp in elem;
            if (valueIsBorderBox) {
              val = elem[offsetProp];
            }
          }
          val = parseFloat(val) || 0;
          return val + boxModelAdjustment(
            elem,
            dimension,
            extra || (isBorderBox ? "border" : "content"),
            valueIsBorderBox,
            styles,
            // Provide the current computed size to request scroll gutter calculation (gh-3589)
            val
          ) + "px";
        }
        jQuery.extend({
          // Add in style property hooks for overriding the default
          // behavior of getting and setting a style property
          cssHooks: {
            opacity: {
              get: function(elem, computed2) {
                if (computed2) {
                  var ret = curCSS(elem, "opacity");
                  return ret === "" ? "1" : ret;
                }
              }
            }
          },
          // Don't automatically add "px" to these possibly-unitless properties
          cssNumber: {
            animationIterationCount: true,
            aspectRatio: true,
            borderImageSlice: true,
            columnCount: true,
            flexGrow: true,
            flexShrink: true,
            fontWeight: true,
            gridArea: true,
            gridColumn: true,
            gridColumnEnd: true,
            gridColumnStart: true,
            gridRow: true,
            gridRowEnd: true,
            gridRowStart: true,
            lineHeight: true,
            opacity: true,
            order: true,
            orphans: true,
            scale: true,
            widows: true,
            zIndex: true,
            zoom: true,
            // SVG-related
            fillOpacity: true,
            floodOpacity: true,
            stopOpacity: true,
            strokeMiterlimit: true,
            strokeOpacity: true
          },
          // Add in properties whose names you wish to fix before
          // setting or getting the value
          cssProps: {},
          // Get and set the style property on a DOM Node
          style: function(elem, name2, value, extra) {
            if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
              return;
            }
            var ret, type2, hooks, origName = camelCase(name2), isCustomProp = rcustomProp.test(name2), style = elem.style;
            if (!isCustomProp) {
              name2 = finalPropName(origName);
            }
            hooks = jQuery.cssHooks[name2] || jQuery.cssHooks[origName];
            if (value !== void 0) {
              type2 = typeof value;
              if (type2 === "string" && (ret = rcssNum.exec(value)) && ret[1]) {
                value = adjustCSS(elem, name2, ret);
                type2 = "number";
              }
              if (value == null || value !== value) {
                return;
              }
              if (type2 === "number" && !isCustomProp) {
                value += ret && ret[3] || (jQuery.cssNumber[origName] ? "" : "px");
              }
              if (!support.clearCloneStyle && value === "" && name2.indexOf("background") === 0) {
                style[name2] = "inherit";
              }
              if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== void 0) {
                if (isCustomProp) {
                  style.setProperty(name2, value);
                } else {
                  style[name2] = value;
                }
              }
            } else {
              if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== void 0) {
                return ret;
              }
              return style[name2];
            }
          },
          css: function(elem, name2, extra, styles) {
            var val, num, hooks, origName = camelCase(name2), isCustomProp = rcustomProp.test(name2);
            if (!isCustomProp) {
              name2 = finalPropName(origName);
            }
            hooks = jQuery.cssHooks[name2] || jQuery.cssHooks[origName];
            if (hooks && "get" in hooks) {
              val = hooks.get(elem, true, extra);
            }
            if (val === void 0) {
              val = curCSS(elem, name2, styles);
            }
            if (val === "normal" && name2 in cssNormalTransform) {
              val = cssNormalTransform[name2];
            }
            if (extra === "" || extra) {
              num = parseFloat(val);
              return extra === true || isFinite(num) ? num || 0 : val;
            }
            return val;
          }
        });
        jQuery.each(["height", "width"], function(_i, dimension) {
          jQuery.cssHooks[dimension] = {
            get: function(elem, computed2, extra) {
              if (computed2) {
                return rdisplayswap.test(jQuery.css(elem, "display")) && // Support: Safari 8+
                // Table columns in Safari have non-zero offsetWidth & zero
                // getBoundingClientRect().width unless display is changed.
                // Support: IE <=11 only
                // Running getBoundingClientRect on a disconnected node
                // in IE throws an error.
                (!elem.getClientRects().length || !elem.getBoundingClientRect().width) ? swap(elem, cssShow, function() {
                  return getWidthOrHeight(elem, dimension, extra);
                }) : getWidthOrHeight(elem, dimension, extra);
              }
            },
            set: function(elem, value, extra) {
              var matches, styles = getStyles(elem), scrollboxSizeBuggy = !support.scrollboxSize() && styles.position === "absolute", boxSizingNeeded = scrollboxSizeBuggy || extra, isBorderBox = boxSizingNeeded && jQuery.css(elem, "boxSizing", false, styles) === "border-box", subtract = extra ? boxModelAdjustment(
                elem,
                dimension,
                extra,
                isBorderBox,
                styles
              ) : 0;
              if (isBorderBox && scrollboxSizeBuggy) {
                subtract -= Math.ceil(
                  elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] - parseFloat(styles[dimension]) - boxModelAdjustment(elem, dimension, "border", false, styles) - 0.5
                );
              }
              if (subtract && (matches = rcssNum.exec(value)) && (matches[3] || "px") !== "px") {
                elem.style[dimension] = value;
                value = jQuery.css(elem, dimension);
              }
              return setPositiveNumber(elem, value, subtract);
            }
          };
        });
        jQuery.cssHooks.marginLeft = addGetHookIf(
          support.reliableMarginLeft,
          function(elem, computed2) {
            if (computed2) {
              return (parseFloat(curCSS(elem, "marginLeft")) || elem.getBoundingClientRect().left - swap(elem, { marginLeft: 0 }, function() {
                return elem.getBoundingClientRect().left;
              })) + "px";
            }
          }
        );
        jQuery.each({
          margin: "",
          padding: "",
          border: "Width"
        }, function(prefix, suffix) {
          jQuery.cssHooks[prefix + suffix] = {
            expand: function(value) {
              var i = 0, expanded = {}, parts = typeof value === "string" ? value.split(" ") : [value];
              for (; i < 4; i++) {
                expanded[prefix + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0];
              }
              return expanded;
            }
          };
          if (prefix !== "margin") {
            jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
          }
        });
        jQuery.fn.extend({
          css: function(name2, value) {
            return access(this, function(elem, name3, value2) {
              var styles, len, map2 = {}, i = 0;
              if (Array.isArray(name3)) {
                styles = getStyles(elem);
                len = name3.length;
                for (; i < len; i++) {
                  map2[name3[i]] = jQuery.css(elem, name3[i], false, styles);
                }
                return map2;
              }
              return value2 !== void 0 ? jQuery.style(elem, name3, value2) : jQuery.css(elem, name3);
            }, name2, value, arguments.length > 1);
          }
        });
        function Tween(elem, options, prop, end, easing) {
          return new Tween.prototype.init(elem, options, prop, end, easing);
        }
        jQuery.Tween = Tween;
        Tween.prototype = {
          constructor: Tween,
          init: function(elem, options, prop, end, easing, unit) {
            this.elem = elem;
            this.prop = prop;
            this.easing = easing || jQuery.easing._default;
            this.options = options;
            this.start = this.now = this.cur();
            this.end = end;
            this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
          },
          cur: function() {
            var hooks = Tween.propHooks[this.prop];
            return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
          },
          run: function(percent) {
            var eased, hooks = Tween.propHooks[this.prop];
            if (this.options.duration) {
              this.pos = eased = jQuery.easing[this.easing](
                percent,
                this.options.duration * percent,
                0,
                1,
                this.options.duration
              );
            } else {
              this.pos = eased = percent;
            }
            this.now = (this.end - this.start) * eased + this.start;
            if (this.options.step) {
              this.options.step.call(this.elem, this.now, this);
            }
            if (hooks && hooks.set) {
              hooks.set(this);
            } else {
              Tween.propHooks._default.set(this);
            }
            return this;
          }
        };
        Tween.prototype.init.prototype = Tween.prototype;
        Tween.propHooks = {
          _default: {
            get: function(tween) {
              var result2;
              if (tween.elem.nodeType !== 1 || tween.elem[tween.prop] != null && tween.elem.style[tween.prop] == null) {
                return tween.elem[tween.prop];
              }
              result2 = jQuery.css(tween.elem, tween.prop, "");
              return !result2 || result2 === "auto" ? 0 : result2;
            },
            set: function(tween) {
              if (jQuery.fx.step[tween.prop]) {
                jQuery.fx.step[tween.prop](tween);
              } else if (tween.elem.nodeType === 1 && (jQuery.cssHooks[tween.prop] || tween.elem.style[finalPropName(tween.prop)] != null)) {
                jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
              } else {
                tween.elem[tween.prop] = tween.now;
              }
            }
          }
        };
        Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
          set: function(tween) {
            if (tween.elem.nodeType && tween.elem.parentNode) {
              tween.elem[tween.prop] = tween.now;
            }
          }
        };
        jQuery.easing = {
          linear: function(p2) {
            return p2;
          },
          swing: function(p2) {
            return 0.5 - Math.cos(p2 * Math.PI) / 2;
          },
          _default: "swing"
        };
        jQuery.fx = Tween.prototype.init;
        jQuery.fx.step = {};
        var fxNow, inProgress, rfxtypes = /^(?:toggle|show|hide)$/, rrun = /queueHooks$/;
        function schedule() {
          if (inProgress) {
            if (document2.hidden === false && window2.requestAnimationFrame) {
              window2.requestAnimationFrame(schedule);
            } else {
              window2.setTimeout(schedule, jQuery.fx.interval);
            }
            jQuery.fx.tick();
          }
        }
        function createFxNow() {
          window2.setTimeout(function() {
            fxNow = void 0;
          });
          return fxNow = Date.now();
        }
        function genFx(type2, includeWidth) {
          var which, i = 0, attrs = { height: type2 };
          includeWidth = includeWidth ? 1 : 0;
          for (; i < 4; i += 2 - includeWidth) {
            which = cssExpand[i];
            attrs["margin" + which] = attrs["padding" + which] = type2;
          }
          if (includeWidth) {
            attrs.opacity = attrs.width = type2;
          }
          return attrs;
        }
        function createTween(value, prop, animation) {
          var tween, collection = (Animation.tweeners[prop] || []).concat(Animation.tweeners["*"]), index = 0, length = collection.length;
          for (; index < length; index++) {
            if (tween = collection[index].call(animation, prop, value)) {
              return tween;
            }
          }
        }
        function defaultPrefilter(elem, props, opts) {
          var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display, isBox = "width" in props || "height" in props, anim = this, orig = {}, style = elem.style, hidden = elem.nodeType && isHiddenWithinTree(elem), dataShow = dataPriv.get(elem, "fxshow");
          if (!opts.queue) {
            hooks = jQuery._queueHooks(elem, "fx");
            if (hooks.unqueued == null) {
              hooks.unqueued = 0;
              oldfire = hooks.empty.fire;
              hooks.empty.fire = function() {
                if (!hooks.unqueued) {
                  oldfire();
                }
              };
            }
            hooks.unqueued++;
            anim.always(function() {
              anim.always(function() {
                hooks.unqueued--;
                if (!jQuery.queue(elem, "fx").length) {
                  hooks.empty.fire();
                }
              });
            });
          }
          for (prop in props) {
            value = props[prop];
            if (rfxtypes.test(value)) {
              delete props[prop];
              toggle = toggle || value === "toggle";
              if (value === (hidden ? "hide" : "show")) {
                if (value === "show" && dataShow && dataShow[prop] !== void 0) {
                  hidden = true;
                } else {
                  continue;
                }
              }
              orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);
            }
          }
          propTween = !jQuery.isEmptyObject(props);
          if (!propTween && jQuery.isEmptyObject(orig)) {
            return;
          }
          if (isBox && elem.nodeType === 1) {
            opts.overflow = [style.overflow, style.overflowX, style.overflowY];
            restoreDisplay = dataShow && dataShow.display;
            if (restoreDisplay == null) {
              restoreDisplay = dataPriv.get(elem, "display");
            }
            display = jQuery.css(elem, "display");
            if (display === "none") {
              if (restoreDisplay) {
                display = restoreDisplay;
              } else {
                showHide([elem], true);
                restoreDisplay = elem.style.display || restoreDisplay;
                display = jQuery.css(elem, "display");
                showHide([elem]);
              }
            }
            if (display === "inline" || display === "inline-block" && restoreDisplay != null) {
              if (jQuery.css(elem, "float") === "none") {
                if (!propTween) {
                  anim.done(function() {
                    style.display = restoreDisplay;
                  });
                  if (restoreDisplay == null) {
                    display = style.display;
                    restoreDisplay = display === "none" ? "" : display;
                  }
                }
                style.display = "inline-block";
              }
            }
          }
          if (opts.overflow) {
            style.overflow = "hidden";
            anim.always(function() {
              style.overflow = opts.overflow[0];
              style.overflowX = opts.overflow[1];
              style.overflowY = opts.overflow[2];
            });
          }
          propTween = false;
          for (prop in orig) {
            if (!propTween) {
              if (dataShow) {
                if ("hidden" in dataShow) {
                  hidden = dataShow.hidden;
                }
              } else {
                dataShow = dataPriv.access(elem, "fxshow", { display: restoreDisplay });
              }
              if (toggle) {
                dataShow.hidden = !hidden;
              }
              if (hidden) {
                showHide([elem], true);
              }
              anim.done(function() {
                if (!hidden) {
                  showHide([elem]);
                }
                dataPriv.remove(elem, "fxshow");
                for (prop in orig) {
                  jQuery.style(elem, prop, orig[prop]);
                }
              });
            }
            propTween = createTween(hidden ? dataShow[prop] : 0, prop, anim);
            if (!(prop in dataShow)) {
              dataShow[prop] = propTween.start;
              if (hidden) {
                propTween.end = propTween.start;
                propTween.start = 0;
              }
            }
          }
        }
        function propFilter(props, specialEasing) {
          var index, name2, easing, value, hooks;
          for (index in props) {
            name2 = camelCase(index);
            easing = specialEasing[name2];
            value = props[index];
            if (Array.isArray(value)) {
              easing = value[1];
              value = props[index] = value[0];
            }
            if (index !== name2) {
              props[name2] = value;
              delete props[index];
            }
            hooks = jQuery.cssHooks[name2];
            if (hooks && "expand" in hooks) {
              value = hooks.expand(value);
              delete props[name2];
              for (index in value) {
                if (!(index in props)) {
                  props[index] = value[index];
                  specialEasing[index] = easing;
                }
              }
            } else {
              specialEasing[name2] = easing;
            }
          }
        }
        function Animation(elem, properties, options) {
          var result2, stopped, index = 0, length = Animation.prefilters.length, deferred = jQuery.Deferred().always(function() {
            delete tick.elem;
          }), tick = function() {
            if (stopped) {
              return false;
            }
            var currentTime = fxNow || createFxNow(), remaining = Math.max(0, animation.startTime + animation.duration - currentTime), temp = remaining / animation.duration || 0, percent = 1 - temp, index2 = 0, length2 = animation.tweens.length;
            for (; index2 < length2; index2++) {
              animation.tweens[index2].run(percent);
            }
            deferred.notifyWith(elem, [animation, percent, remaining]);
            if (percent < 1 && length2) {
              return remaining;
            }
            if (!length2) {
              deferred.notifyWith(elem, [animation, 1, 0]);
            }
            deferred.resolveWith(elem, [animation]);
            return false;
          }, animation = deferred.promise({
            elem,
            props: jQuery.extend({}, properties),
            opts: jQuery.extend(true, {
              specialEasing: {},
              easing: jQuery.easing._default
            }, options),
            originalProperties: properties,
            originalOptions: options,
            startTime: fxNow || createFxNow(),
            duration: options.duration,
            tweens: [],
            createTween: function(prop, end) {
              var tween = jQuery.Tween(
                elem,
                animation.opts,
                prop,
                end,
                animation.opts.specialEasing[prop] || animation.opts.easing
              );
              animation.tweens.push(tween);
              return tween;
            },
            stop: function(gotoEnd) {
              var index2 = 0, length2 = gotoEnd ? animation.tweens.length : 0;
              if (stopped) {
                return this;
              }
              stopped = true;
              for (; index2 < length2; index2++) {
                animation.tweens[index2].run(1);
              }
              if (gotoEnd) {
                deferred.notifyWith(elem, [animation, 1, 0]);
                deferred.resolveWith(elem, [animation, gotoEnd]);
              } else {
                deferred.rejectWith(elem, [animation, gotoEnd]);
              }
              return this;
            }
          }), props = animation.props;
          propFilter(props, animation.opts.specialEasing);
          for (; index < length; index++) {
            result2 = Animation.prefilters[index].call(animation, elem, props, animation.opts);
            if (result2) {
              if (isFunction2(result2.stop)) {
                jQuery._queueHooks(animation.elem, animation.opts.queue).stop = result2.stop.bind(result2);
              }
              return result2;
            }
          }
          jQuery.map(props, createTween, animation);
          if (isFunction2(animation.opts.start)) {
            animation.opts.start.call(elem, animation);
          }
          animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);
          jQuery.fx.timer(
            jQuery.extend(tick, {
              elem,
              anim: animation,
              queue: animation.opts.queue
            })
          );
          return animation;
        }
        jQuery.Animation = jQuery.extend(Animation, {
          tweeners: {
            "*": [function(prop, value) {
              var tween = this.createTween(prop, value);
              adjustCSS(tween.elem, prop, rcssNum.exec(value), tween);
              return tween;
            }]
          },
          tweener: function(props, callback) {
            if (isFunction2(props)) {
              callback = props;
              props = ["*"];
            } else {
              props = props.match(rnothtmlwhite);
            }
            var prop, index = 0, length = props.length;
            for (; index < length; index++) {
              prop = props[index];
              Animation.tweeners[prop] = Animation.tweeners[prop] || [];
              Animation.tweeners[prop].unshift(callback);
            }
          },
          prefilters: [defaultPrefilter],
          prefilter: function(callback, prepend) {
            if (prepend) {
              Animation.prefilters.unshift(callback);
            } else {
              Animation.prefilters.push(callback);
            }
          }
        });
        jQuery.speed = function(speed, easing, fn) {
          var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
            complete: fn || !fn && easing || isFunction2(speed) && speed,
            duration: speed,
            easing: fn && easing || easing && !isFunction2(easing) && easing
          };
          if (jQuery.fx.off) {
            opt.duration = 0;
          } else {
            if (typeof opt.duration !== "number") {
              if (opt.duration in jQuery.fx.speeds) {
                opt.duration = jQuery.fx.speeds[opt.duration];
              } else {
                opt.duration = jQuery.fx.speeds._default;
              }
            }
          }
          if (opt.queue == null || opt.queue === true) {
            opt.queue = "fx";
          }
          opt.old = opt.complete;
          opt.complete = function() {
            if (isFunction2(opt.old)) {
              opt.old.call(this);
            }
            if (opt.queue) {
              jQuery.dequeue(this, opt.queue);
            }
          };
          return opt;
        };
        jQuery.fn.extend({
          fadeTo: function(speed, to, easing, callback) {
            return this.filter(isHiddenWithinTree).css("opacity", 0).show().end().animate({ opacity: to }, speed, easing, callback);
          },
          animate: function(prop, speed, easing, callback) {
            var empty = jQuery.isEmptyObject(prop), optall = jQuery.speed(speed, easing, callback), doAnimation = function() {
              var anim = Animation(this, jQuery.extend({}, prop), optall);
              if (empty || dataPriv.get(this, "finish")) {
                anim.stop(true);
              }
            };
            doAnimation.finish = doAnimation;
            return empty || optall.queue === false ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
          },
          stop: function(type2, clearQueue, gotoEnd) {
            var stopQueue = function(hooks) {
              var stop = hooks.stop;
              delete hooks.stop;
              stop(gotoEnd);
            };
            if (typeof type2 !== "string") {
              gotoEnd = clearQueue;
              clearQueue = type2;
              type2 = void 0;
            }
            if (clearQueue) {
              this.queue(type2 || "fx", []);
            }
            return this.each(function() {
              var dequeue = true, index = type2 != null && type2 + "queueHooks", timers = jQuery.timers, data = dataPriv.get(this);
              if (index) {
                if (data[index] && data[index].stop) {
                  stopQueue(data[index]);
                }
              } else {
                for (index in data) {
                  if (data[index] && data[index].stop && rrun.test(index)) {
                    stopQueue(data[index]);
                  }
                }
              }
              for (index = timers.length; index--; ) {
                if (timers[index].elem === this && (type2 == null || timers[index].queue === type2)) {
                  timers[index].anim.stop(gotoEnd);
                  dequeue = false;
                  timers.splice(index, 1);
                }
              }
              if (dequeue || !gotoEnd) {
                jQuery.dequeue(this, type2);
              }
            });
          },
          finish: function(type2) {
            if (type2 !== false) {
              type2 = type2 || "fx";
            }
            return this.each(function() {
              var index, data = dataPriv.get(this), queue2 = data[type2 + "queue"], hooks = data[type2 + "queueHooks"], timers = jQuery.timers, length = queue2 ? queue2.length : 0;
              data.finish = true;
              jQuery.queue(this, type2, []);
              if (hooks && hooks.stop) {
                hooks.stop.call(this, true);
              }
              for (index = timers.length; index--; ) {
                if (timers[index].elem === this && timers[index].queue === type2) {
                  timers[index].anim.stop(true);
                  timers.splice(index, 1);
                }
              }
              for (index = 0; index < length; index++) {
                if (queue2[index] && queue2[index].finish) {
                  queue2[index].finish.call(this);
                }
              }
              delete data.finish;
            });
          }
        });
        jQuery.each(["toggle", "show", "hide"], function(_i, name2) {
          var cssFn = jQuery.fn[name2];
          jQuery.fn[name2] = function(speed, easing, callback) {
            return speed == null || typeof speed === "boolean" ? cssFn.apply(this, arguments) : this.animate(genFx(name2, true), speed, easing, callback);
          };
        });
        jQuery.each({
          slideDown: genFx("show"),
          slideUp: genFx("hide"),
          slideToggle: genFx("toggle"),
          fadeIn: { opacity: "show" },
          fadeOut: { opacity: "hide" },
          fadeToggle: { opacity: "toggle" }
        }, function(name2, props) {
          jQuery.fn[name2] = function(speed, easing, callback) {
            return this.animate(props, speed, easing, callback);
          };
        });
        jQuery.timers = [];
        jQuery.fx.tick = function() {
          var timer, i = 0, timers = jQuery.timers;
          fxNow = Date.now();
          for (; i < timers.length; i++) {
            timer = timers[i];
            if (!timer() && timers[i] === timer) {
              timers.splice(i--, 1);
            }
          }
          if (!timers.length) {
            jQuery.fx.stop();
          }
          fxNow = void 0;
        };
        jQuery.fx.timer = function(timer) {
          jQuery.timers.push(timer);
          jQuery.fx.start();
        };
        jQuery.fx.interval = 13;
        jQuery.fx.start = function() {
          if (inProgress) {
            return;
          }
          inProgress = true;
          schedule();
        };
        jQuery.fx.stop = function() {
          inProgress = null;
        };
        jQuery.fx.speeds = {
          slow: 600,
          fast: 200,
          // Default speed
          _default: 400
        };
        jQuery.fn.delay = function(time, type2) {
          time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
          type2 = type2 || "fx";
          return this.queue(type2, function(next, hooks) {
            var timeout = window2.setTimeout(next, time);
            hooks.stop = function() {
              window2.clearTimeout(timeout);
            };
          });
        };
        (function() {
          var input = document2.createElement("input"), select = document2.createElement("select"), opt = select.appendChild(document2.createElement("option"));
          input.type = "checkbox";
          support.checkOn = input.value !== "";
          support.optSelected = opt.selected;
          input = document2.createElement("input");
          input.value = "t";
          input.type = "radio";
          support.radioValue = input.value === "t";
        })();
        var boolHook, attrHandle = jQuery.expr.attrHandle;
        jQuery.fn.extend({
          attr: function(name2, value) {
            return access(this, jQuery.attr, name2, value, arguments.length > 1);
          },
          removeAttr: function(name2) {
            return this.each(function() {
              jQuery.removeAttr(this, name2);
            });
          }
        });
        jQuery.extend({
          attr: function(elem, name2, value) {
            var ret, hooks, nType = elem.nodeType;
            if (nType === 3 || nType === 8 || nType === 2) {
              return;
            }
            if (typeof elem.getAttribute === "undefined") {
              return jQuery.prop(elem, name2, value);
            }
            if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
              hooks = jQuery.attrHooks[name2.toLowerCase()] || (jQuery.expr.match.bool.test(name2) ? boolHook : void 0);
            }
            if (value !== void 0) {
              if (value === null) {
                jQuery.removeAttr(elem, name2);
                return;
              }
              if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name2)) !== void 0) {
                return ret;
              }
              elem.setAttribute(name2, value + "");
              return value;
            }
            if (hooks && "get" in hooks && (ret = hooks.get(elem, name2)) !== null) {
              return ret;
            }
            ret = jQuery.find.attr(elem, name2);
            return ret == null ? void 0 : ret;
          },
          attrHooks: {
            type: {
              set: function(elem, value) {
                if (!support.radioValue && value === "radio" && nodeName(elem, "input")) {
                  var val = elem.value;
                  elem.setAttribute("type", value);
                  if (val) {
                    elem.value = val;
                  }
                  return value;
                }
              }
            }
          },
          removeAttr: function(elem, value) {
            var name2, i = 0, attrNames = value && value.match(rnothtmlwhite);
            if (attrNames && elem.nodeType === 1) {
              while (name2 = attrNames[i++]) {
                elem.removeAttribute(name2);
              }
            }
          }
        });
        boolHook = {
          set: function(elem, value, name2) {
            if (value === false) {
              jQuery.removeAttr(elem, name2);
            } else {
              elem.setAttribute(name2, name2);
            }
            return name2;
          }
        };
        jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function(_i, name2) {
          var getter = attrHandle[name2] || jQuery.find.attr;
          attrHandle[name2] = function(elem, name3, isXML) {
            var ret, handle, lowercaseName = name3.toLowerCase();
            if (!isXML) {
              handle = attrHandle[lowercaseName];
              attrHandle[lowercaseName] = ret;
              ret = getter(elem, name3, isXML) != null ? lowercaseName : null;
              attrHandle[lowercaseName] = handle;
            }
            return ret;
          };
        });
        var rfocusable = /^(?:input|select|textarea|button)$/i, rclickable = /^(?:a|area)$/i;
        jQuery.fn.extend({
          prop: function(name2, value) {
            return access(this, jQuery.prop, name2, value, arguments.length > 1);
          },
          removeProp: function(name2) {
            return this.each(function() {
              delete this[jQuery.propFix[name2] || name2];
            });
          }
        });
        jQuery.extend({
          prop: function(elem, name2, value) {
            var ret, hooks, nType = elem.nodeType;
            if (nType === 3 || nType === 8 || nType === 2) {
              return;
            }
            if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
              name2 = jQuery.propFix[name2] || name2;
              hooks = jQuery.propHooks[name2];
            }
            if (value !== void 0) {
              if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name2)) !== void 0) {
                return ret;
              }
              return elem[name2] = value;
            }
            if (hooks && "get" in hooks && (ret = hooks.get(elem, name2)) !== null) {
              return ret;
            }
            return elem[name2];
          },
          propHooks: {
            tabIndex: {
              get: function(elem) {
                var tabindex = jQuery.find.attr(elem, "tabindex");
                if (tabindex) {
                  return parseInt(tabindex, 10);
                }
                if (rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href) {
                  return 0;
                }
                return -1;
              }
            }
          },
          propFix: {
            "for": "htmlFor",
            "class": "className"
          }
        });
        if (!support.optSelected) {
          jQuery.propHooks.selected = {
            get: function(elem) {
              var parent = elem.parentNode;
              if (parent && parent.parentNode) {
                parent.parentNode.selectedIndex;
              }
              return null;
            },
            set: function(elem) {
              var parent = elem.parentNode;
              if (parent) {
                parent.selectedIndex;
                if (parent.parentNode) {
                  parent.parentNode.selectedIndex;
                }
              }
            }
          };
        }
        jQuery.each([
          "tabIndex",
          "readOnly",
          "maxLength",
          "cellSpacing",
          "cellPadding",
          "rowSpan",
          "colSpan",
          "useMap",
          "frameBorder",
          "contentEditable"
        ], function() {
          jQuery.propFix[this.toLowerCase()] = this;
        });
        function stripAndCollapse(value) {
          var tokens = value.match(rnothtmlwhite) || [];
          return tokens.join(" ");
        }
        function getClass(elem) {
          return elem.getAttribute && elem.getAttribute("class") || "";
        }
        function classesToArray(value) {
          if (Array.isArray(value)) {
            return value;
          }
          if (typeof value === "string") {
            return value.match(rnothtmlwhite) || [];
          }
          return [];
        }
        jQuery.fn.extend({
          addClass: function(value) {
            var classNames, cur, curValue, className, i, finalValue;
            if (isFunction2(value)) {
              return this.each(function(j) {
                jQuery(this).addClass(value.call(this, j, getClass(this)));
              });
            }
            classNames = classesToArray(value);
            if (classNames.length) {
              return this.each(function() {
                curValue = getClass(this);
                cur = this.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";
                if (cur) {
                  for (i = 0; i < classNames.length; i++) {
                    className = classNames[i];
                    if (cur.indexOf(" " + className + " ") < 0) {
                      cur += className + " ";
                    }
                  }
                  finalValue = stripAndCollapse(cur);
                  if (curValue !== finalValue) {
                    this.setAttribute("class", finalValue);
                  }
                }
              });
            }
            return this;
          },
          removeClass: function(value) {
            var classNames, cur, curValue, className, i, finalValue;
            if (isFunction2(value)) {
              return this.each(function(j) {
                jQuery(this).removeClass(value.call(this, j, getClass(this)));
              });
            }
            if (!arguments.length) {
              return this.attr("class", "");
            }
            classNames = classesToArray(value);
            if (classNames.length) {
              return this.each(function() {
                curValue = getClass(this);
                cur = this.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";
                if (cur) {
                  for (i = 0; i < classNames.length; i++) {
                    className = classNames[i];
                    while (cur.indexOf(" " + className + " ") > -1) {
                      cur = cur.replace(" " + className + " ", " ");
                    }
                  }
                  finalValue = stripAndCollapse(cur);
                  if (curValue !== finalValue) {
                    this.setAttribute("class", finalValue);
                  }
                }
              });
            }
            return this;
          },
          toggleClass: function(value, stateVal) {
            var classNames, className, i, self2, type2 = typeof value, isValidValue = type2 === "string" || Array.isArray(value);
            if (isFunction2(value)) {
              return this.each(function(i2) {
                jQuery(this).toggleClass(
                  value.call(this, i2, getClass(this), stateVal),
                  stateVal
                );
              });
            }
            if (typeof stateVal === "boolean" && isValidValue) {
              return stateVal ? this.addClass(value) : this.removeClass(value);
            }
            classNames = classesToArray(value);
            return this.each(function() {
              if (isValidValue) {
                self2 = jQuery(this);
                for (i = 0; i < classNames.length; i++) {
                  className = classNames[i];
                  if (self2.hasClass(className)) {
                    self2.removeClass(className);
                  } else {
                    self2.addClass(className);
                  }
                }
              } else if (value === void 0 || type2 === "boolean") {
                className = getClass(this);
                if (className) {
                  dataPriv.set(this, "__className__", className);
                }
                if (this.setAttribute) {
                  this.setAttribute(
                    "class",
                    className || value === false ? "" : dataPriv.get(this, "__className__") || ""
                  );
                }
              }
            });
          },
          hasClass: function(selector) {
            var className, elem, i = 0;
            className = " " + selector + " ";
            while (elem = this[i++]) {
              if (elem.nodeType === 1 && (" " + stripAndCollapse(getClass(elem)) + " ").indexOf(className) > -1) {
                return true;
              }
            }
            return false;
          }
        });
        var rreturn = /\r/g;
        jQuery.fn.extend({
          val: function(value) {
            var hooks, ret, valueIsFunction, elem = this[0];
            if (!arguments.length) {
              if (elem) {
                hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()];
                if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== void 0) {
                  return ret;
                }
                ret = elem.value;
                if (typeof ret === "string") {
                  return ret.replace(rreturn, "");
                }
                return ret == null ? "" : ret;
              }
              return;
            }
            valueIsFunction = isFunction2(value);
            return this.each(function(i) {
              var val;
              if (this.nodeType !== 1) {
                return;
              }
              if (valueIsFunction) {
                val = value.call(this, i, jQuery(this).val());
              } else {
                val = value;
              }
              if (val == null) {
                val = "";
              } else if (typeof val === "number") {
                val += "";
              } else if (Array.isArray(val)) {
                val = jQuery.map(val, function(value2) {
                  return value2 == null ? "" : value2 + "";
                });
              }
              hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];
              if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === void 0) {
                this.value = val;
              }
            });
          }
        });
        jQuery.extend({
          valHooks: {
            option: {
              get: function(elem) {
                var val = jQuery.find.attr(elem, "value");
                return val != null ? val : (
                  // Support: IE <=10 - 11 only
                  // option.text throws exceptions (trac-14686, trac-14858)
                  // Strip and collapse whitespace
                  // https://html.spec.whatwg.org/#strip-and-collapse-whitespace
                  stripAndCollapse(jQuery.text(elem))
                );
              }
            },
            select: {
              get: function(elem) {
                var value, option, i, options = elem.options, index = elem.selectedIndex, one = elem.type === "select-one", values = one ? null : [], max = one ? index + 1 : options.length;
                if (index < 0) {
                  i = max;
                } else {
                  i = one ? index : 0;
                }
                for (; i < max; i++) {
                  option = options[i];
                  if ((option.selected || i === index) && // Don't return options that are disabled or in a disabled optgroup
                  !option.disabled && (!option.parentNode.disabled || !nodeName(option.parentNode, "optgroup"))) {
                    value = jQuery(option).val();
                    if (one) {
                      return value;
                    }
                    values.push(value);
                  }
                }
                return values;
              },
              set: function(elem, value) {
                var optionSet, option, options = elem.options, values = jQuery.makeArray(value), i = options.length;
                while (i--) {
                  option = options[i];
                  if (option.selected = jQuery.inArray(jQuery.valHooks.option.get(option), values) > -1) {
                    optionSet = true;
                  }
                }
                if (!optionSet) {
                  elem.selectedIndex = -1;
                }
                return values;
              }
            }
          }
        });
        jQuery.each(["radio", "checkbox"], function() {
          jQuery.valHooks[this] = {
            set: function(elem, value) {
              if (Array.isArray(value)) {
                return elem.checked = jQuery.inArray(jQuery(elem).val(), value) > -1;
              }
            }
          };
          if (!support.checkOn) {
            jQuery.valHooks[this].get = function(elem) {
              return elem.getAttribute("value") === null ? "on" : elem.value;
            };
          }
        });
        var location2 = window2.location;
        var nonce = { guid: Date.now() };
        var rquery = /\?/;
        jQuery.parseXML = function(data) {
          var xml, parserErrorElem;
          if (!data || typeof data !== "string") {
            return null;
          }
          try {
            xml = new window2.DOMParser().parseFromString(data, "text/xml");
          } catch (e) {
          }
          parserErrorElem = xml && xml.getElementsByTagName("parsererror")[0];
          if (!xml || parserErrorElem) {
            jQuery.error("Invalid XML: " + (parserErrorElem ? jQuery.map(parserErrorElem.childNodes, function(el) {
              return el.textContent;
            }).join("\n") : data));
          }
          return xml;
        };
        var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/, stopPropagationCallback = function(e) {
          e.stopPropagation();
        };
        jQuery.extend(jQuery.event, {
          trigger: function(event, data, elem, onlyHandlers) {
            var i, cur, tmp, bubbleType, ontype, handle, special, lastElement, eventPath = [elem || document2], type2 = hasOwn2.call(event, "type") ? event.type : event, namespaces = hasOwn2.call(event, "namespace") ? event.namespace.split(".") : [];
            cur = lastElement = tmp = elem = elem || document2;
            if (elem.nodeType === 3 || elem.nodeType === 8) {
              return;
            }
            if (rfocusMorph.test(type2 + jQuery.event.triggered)) {
              return;
            }
            if (type2.indexOf(".") > -1) {
              namespaces = type2.split(".");
              type2 = namespaces.shift();
              namespaces.sort();
            }
            ontype = type2.indexOf(":") < 0 && "on" + type2;
            event = event[jQuery.expando] ? event : new jQuery.Event(type2, typeof event === "object" && event);
            event.isTrigger = onlyHandlers ? 2 : 3;
            event.namespace = namespaces.join(".");
            event.rnamespace = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
            event.result = void 0;
            if (!event.target) {
              event.target = elem;
            }
            data = data == null ? [event] : jQuery.makeArray(data, [event]);
            special = jQuery.event.special[type2] || {};
            if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false) {
              return;
            }
            if (!onlyHandlers && !special.noBubble && !isWindow(elem)) {
              bubbleType = special.delegateType || type2;
              if (!rfocusMorph.test(bubbleType + type2)) {
                cur = cur.parentNode;
              }
              for (; cur; cur = cur.parentNode) {
                eventPath.push(cur);
                tmp = cur;
              }
              if (tmp === (elem.ownerDocument || document2)) {
                eventPath.push(tmp.defaultView || tmp.parentWindow || window2);
              }
            }
            i = 0;
            while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {
              lastElement = cur;
              event.type = i > 1 ? bubbleType : special.bindType || type2;
              handle = (dataPriv.get(cur, "events") || /* @__PURE__ */ Object.create(null))[event.type] && dataPriv.get(cur, "handle");
              if (handle) {
                handle.apply(cur, data);
              }
              handle = ontype && cur[ontype];
              if (handle && handle.apply && acceptData(cur)) {
                event.result = handle.apply(cur, data);
                if (event.result === false) {
                  event.preventDefault();
                }
              }
            }
            event.type = type2;
            if (!onlyHandlers && !event.isDefaultPrevented()) {
              if ((!special._default || special._default.apply(eventPath.pop(), data) === false) && acceptData(elem)) {
                if (ontype && isFunction2(elem[type2]) && !isWindow(elem)) {
                  tmp = elem[ontype];
                  if (tmp) {
                    elem[ontype] = null;
                  }
                  jQuery.event.triggered = type2;
                  if (event.isPropagationStopped()) {
                    lastElement.addEventListener(type2, stopPropagationCallback);
                  }
                  elem[type2]();
                  if (event.isPropagationStopped()) {
                    lastElement.removeEventListener(type2, stopPropagationCallback);
                  }
                  jQuery.event.triggered = void 0;
                  if (tmp) {
                    elem[ontype] = tmp;
                  }
                }
              }
            }
            return event.result;
          },
          // Piggyback on a donor event to simulate a different one
          // Used only for `focus(in | out)` events
          simulate: function(type2, elem, event) {
            var e = jQuery.extend(
              new jQuery.Event(),
              event,
              {
                type: type2,
                isSimulated: true
              }
            );
            jQuery.event.trigger(e, null, elem);
          }
        });
        jQuery.fn.extend({
          trigger: function(type2, data) {
            return this.each(function() {
              jQuery.event.trigger(type2, data, this);
            });
          },
          triggerHandler: function(type2, data) {
            var elem = this[0];
            if (elem) {
              return jQuery.event.trigger(type2, data, elem, true);
            }
          }
        });
        var rbracket = /\[\]$/, rCRLF = /\r?\n/g, rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i, rsubmittable = /^(?:input|select|textarea|keygen)/i;
        function buildParams(prefix, obj, traditional, add) {
          var name2;
          if (Array.isArray(obj)) {
            jQuery.each(obj, function(i, v) {
              if (traditional || rbracket.test(prefix)) {
                add(prefix, v);
              } else {
                buildParams(
                  prefix + "[" + (typeof v === "object" && v != null ? i : "") + "]",
                  v,
                  traditional,
                  add
                );
              }
            });
          } else if (!traditional && toType(obj) === "object") {
            for (name2 in obj) {
              buildParams(prefix + "[" + name2 + "]", obj[name2], traditional, add);
            }
          } else {
            add(prefix, obj);
          }
        }
        jQuery.param = function(a, traditional) {
          var prefix, s = [], add = function(key, valueOrFunction) {
            var value = isFunction2(valueOrFunction) ? valueOrFunction() : valueOrFunction;
            s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value == null ? "" : value);
          };
          if (a == null) {
            return "";
          }
          if (Array.isArray(a) || a.jquery && !jQuery.isPlainObject(a)) {
            jQuery.each(a, function() {
              add(this.name, this.value);
            });
          } else {
            for (prefix in a) {
              buildParams(prefix, a[prefix], traditional, add);
            }
          }
          return s.join("&");
        };
        jQuery.fn.extend({
          serialize: function() {
            return jQuery.param(this.serializeArray());
          },
          serializeArray: function() {
            return this.map(function() {
              var elements = jQuery.prop(this, "elements");
              return elements ? jQuery.makeArray(elements) : this;
            }).filter(function() {
              var type2 = this.type;
              return this.name && !jQuery(this).is(":disabled") && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type2) && (this.checked || !rcheckableType.test(type2));
            }).map(function(_i, elem) {
              var val = jQuery(this).val();
              if (val == null) {
                return null;
              }
              if (Array.isArray(val)) {
                return jQuery.map(val, function(val2) {
                  return { name: elem.name, value: val2.replace(rCRLF, "\r\n") };
                });
              }
              return { name: elem.name, value: val.replace(rCRLF, "\r\n") };
            }).get();
          }
        });
        var r20 = /%20/g, rhash = /#.*$/, rantiCache = /([?&])_=[^&]*/, rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg, rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, rnoContent = /^(?:GET|HEAD)$/, rprotocol = /^\/\//, prefilters = {}, transports = {}, allTypes = "*/".concat("*"), originAnchor = document2.createElement("a");
        originAnchor.href = location2.href;
        function addToPrefiltersOrTransports(structure) {
          return function(dataTypeExpression, func) {
            if (typeof dataTypeExpression !== "string") {
              func = dataTypeExpression;
              dataTypeExpression = "*";
            }
            var dataType, i = 0, dataTypes = dataTypeExpression.toLowerCase().match(rnothtmlwhite) || [];
            if (isFunction2(func)) {
              while (dataType = dataTypes[i++]) {
                if (dataType[0] === "+") {
                  dataType = dataType.slice(1) || "*";
                  (structure[dataType] = structure[dataType] || []).unshift(func);
                } else {
                  (structure[dataType] = structure[dataType] || []).push(func);
                }
              }
            }
          };
        }
        function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {
          var inspected = {}, seekingTransport = structure === transports;
          function inspect(dataType) {
            var selected;
            inspected[dataType] = true;
            jQuery.each(structure[dataType] || [], function(_, prefilterOrFactory) {
              var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
              if (typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[dataTypeOrTransport]) {
                options.dataTypes.unshift(dataTypeOrTransport);
                inspect(dataTypeOrTransport);
                return false;
              } else if (seekingTransport) {
                return !(selected = dataTypeOrTransport);
              }
            });
            return selected;
          }
          return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");
        }
        function ajaxExtend(target, src) {
          var key, deep, flatOptions = jQuery.ajaxSettings.flatOptions || {};
          for (key in src) {
            if (src[key] !== void 0) {
              (flatOptions[key] ? target : deep || (deep = {}))[key] = src[key];
            }
          }
          if (deep) {
            jQuery.extend(true, target, deep);
          }
          return target;
        }
        function ajaxHandleResponses(s, jqXHR, responses) {
          var ct, type2, finalDataType, firstDataType, contents = s.contents, dataTypes = s.dataTypes;
          while (dataTypes[0] === "*") {
            dataTypes.shift();
            if (ct === void 0) {
              ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
            }
          }
          if (ct) {
            for (type2 in contents) {
              if (contents[type2] && contents[type2].test(ct)) {
                dataTypes.unshift(type2);
                break;
              }
            }
          }
          if (dataTypes[0] in responses) {
            finalDataType = dataTypes[0];
          } else {
            for (type2 in responses) {
              if (!dataTypes[0] || s.converters[type2 + " " + dataTypes[0]]) {
                finalDataType = type2;
                break;
              }
              if (!firstDataType) {
                firstDataType = type2;
              }
            }
            finalDataType = finalDataType || firstDataType;
          }
          if (finalDataType) {
            if (finalDataType !== dataTypes[0]) {
              dataTypes.unshift(finalDataType);
            }
            return responses[finalDataType];
          }
        }
        function ajaxConvert(s, response, jqXHR, isSuccess) {
          var conv2, current, conv, tmp, prev, converters = {}, dataTypes = s.dataTypes.slice();
          if (dataTypes[1]) {
            for (conv in s.converters) {
              converters[conv.toLowerCase()] = s.converters[conv];
            }
          }
          current = dataTypes.shift();
          while (current) {
            if (s.responseFields[current]) {
              jqXHR[s.responseFields[current]] = response;
            }
            if (!prev && isSuccess && s.dataFilter) {
              response = s.dataFilter(response, s.dataType);
            }
            prev = current;
            current = dataTypes.shift();
            if (current) {
              if (current === "*") {
                current = prev;
              } else if (prev !== "*" && prev !== current) {
                conv = converters[prev + " " + current] || converters["* " + current];
                if (!conv) {
                  for (conv2 in converters) {
                    tmp = conv2.split(" ");
                    if (tmp[1] === current) {
                      conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]];
                      if (conv) {
                        if (conv === true) {
                          conv = converters[conv2];
                        } else if (converters[conv2] !== true) {
                          current = tmp[0];
                          dataTypes.unshift(tmp[1]);
                        }
                        break;
                      }
                    }
                  }
                }
                if (conv !== true) {
                  if (conv && s.throws) {
                    response = conv(response);
                  } else {
                    try {
                      response = conv(response);
                    } catch (e) {
                      return {
                        state: "parsererror",
                        error: conv ? e : "No conversion from " + prev + " to " + current
                      };
                    }
                  }
                }
              }
            }
          }
          return { state: "success", data: response };
        }
        jQuery.extend({
          // Counter for holding the number of active queries
          active: 0,
          // Last-Modified header cache for next request
          lastModified: {},
          etag: {},
          ajaxSettings: {
            url: location2.href,
            type: "GET",
            isLocal: rlocalProtocol.test(location2.protocol),
            global: true,
            processData: true,
            async: true,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            /*
            timeout: 0,
            data: null,
            dataType: null,
            username: null,
            password: null,
            cache: null,
            throws: false,
            traditional: false,
            headers: {},
            */
            accepts: {
              "*": allTypes,
              text: "text/plain",
              html: "text/html",
              xml: "application/xml, text/xml",
              json: "application/json, text/javascript"
            },
            contents: {
              xml: /\bxml\b/,
              html: /\bhtml/,
              json: /\bjson\b/
            },
            responseFields: {
              xml: "responseXML",
              text: "responseText",
              json: "responseJSON"
            },
            // Data converters
            // Keys separate source (or catchall "*") and destination types with a single space
            converters: {
              // Convert anything to text
              "* text": String,
              // Text to html (true = no transformation)
              "text html": true,
              // Evaluate text as a json expression
              "text json": JSON.parse,
              // Parse text as xml
              "text xml": jQuery.parseXML
            },
            // For options that shouldn't be deep extended:
            // you can add your own custom options here if
            // and when you create one that shouldn't be
            // deep extended (see ajaxExtend)
            flatOptions: {
              url: true,
              context: true
            }
          },
          // Creates a full fledged settings object into target
          // with both ajaxSettings and settings fields.
          // If target is omitted, writes into ajaxSettings.
          ajaxSetup: function(target, settings) {
            return settings ? (
              // Building a settings object
              ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings)
            ) : (
              // Extending ajaxSettings
              ajaxExtend(jQuery.ajaxSettings, target)
            );
          },
          ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
          ajaxTransport: addToPrefiltersOrTransports(transports),
          // Main method
          ajax: function(url, options) {
            if (typeof url === "object") {
              options = url;
              url = void 0;
            }
            options = options || {};
            var transport, cacheURL, responseHeadersString, responseHeaders, timeoutTimer, urlAnchor, completed2, fireGlobals, i, uncached, s = jQuery.ajaxSetup({}, options), callbackContext = s.context || s, globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ? jQuery(callbackContext) : jQuery.event, deferred = jQuery.Deferred(), completeDeferred = jQuery.Callbacks("once memory"), statusCode = s.statusCode || {}, requestHeaders = {}, requestHeadersNames = {}, strAbort = "canceled", jqXHR = {
              readyState: 0,
              // Builds headers hashtable if needed
              getResponseHeader: function(key) {
                var match;
                if (completed2) {
                  if (!responseHeaders) {
                    responseHeaders = {};
                    while (match = rheaders.exec(responseHeadersString)) {
                      responseHeaders[match[1].toLowerCase() + " "] = (responseHeaders[match[1].toLowerCase() + " "] || []).concat(match[2]);
                    }
                  }
                  match = responseHeaders[key.toLowerCase() + " "];
                }
                return match == null ? null : match.join(", ");
              },
              // Raw string
              getAllResponseHeaders: function() {
                return completed2 ? responseHeadersString : null;
              },
              // Caches the header
              setRequestHeader: function(name2, value) {
                if (completed2 == null) {
                  name2 = requestHeadersNames[name2.toLowerCase()] = requestHeadersNames[name2.toLowerCase()] || name2;
                  requestHeaders[name2] = value;
                }
                return this;
              },
              // Overrides response content-type header
              overrideMimeType: function(type2) {
                if (completed2 == null) {
                  s.mimeType = type2;
                }
                return this;
              },
              // Status-dependent callbacks
              statusCode: function(map2) {
                var code;
                if (map2) {
                  if (completed2) {
                    jqXHR.always(map2[jqXHR.status]);
                  } else {
                    for (code in map2) {
                      statusCode[code] = [statusCode[code], map2[code]];
                    }
                  }
                }
                return this;
              },
              // Cancel the request
              abort: function(statusText) {
                var finalText = statusText || strAbort;
                if (transport) {
                  transport.abort(finalText);
                }
                done(0, finalText);
                return this;
              }
            };
            deferred.promise(jqXHR);
            s.url = ((url || s.url || location2.href) + "").replace(rprotocol, location2.protocol + "//");
            s.type = options.method || options.type || s.method || s.type;
            s.dataTypes = (s.dataType || "*").toLowerCase().match(rnothtmlwhite) || [""];
            if (s.crossDomain == null) {
              urlAnchor = document2.createElement("a");
              try {
                urlAnchor.href = s.url;
                urlAnchor.href = urlAnchor.href;
                s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !== urlAnchor.protocol + "//" + urlAnchor.host;
              } catch (e) {
                s.crossDomain = true;
              }
            }
            if (s.data && s.processData && typeof s.data !== "string") {
              s.data = jQuery.param(s.data, s.traditional);
            }
            inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);
            if (completed2) {
              return jqXHR;
            }
            fireGlobals = jQuery.event && s.global;
            if (fireGlobals && jQuery.active++ === 0) {
              jQuery.event.trigger("ajaxStart");
            }
            s.type = s.type.toUpperCase();
            s.hasContent = !rnoContent.test(s.type);
            cacheURL = s.url.replace(rhash, "");
            if (!s.hasContent) {
              uncached = s.url.slice(cacheURL.length);
              if (s.data && (s.processData || typeof s.data === "string")) {
                cacheURL += (rquery.test(cacheURL) ? "&" : "?") + s.data;
                delete s.data;
              }
              if (s.cache === false) {
                cacheURL = cacheURL.replace(rantiCache, "$1");
                uncached = (rquery.test(cacheURL) ? "&" : "?") + "_=" + nonce.guid++ + uncached;
              }
              s.url = cacheURL + uncached;
            } else if (s.data && s.processData && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0) {
              s.data = s.data.replace(r20, "+");
            }
            if (s.ifModified) {
              if (jQuery.lastModified[cacheURL]) {
                jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]);
              }
              if (jQuery.etag[cacheURL]) {
                jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL]);
              }
            }
            if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
              jqXHR.setRequestHeader("Content-Type", s.contentType);
            }
            jqXHR.setRequestHeader(
              "Accept",
              s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"]
            );
            for (i in s.headers) {
              jqXHR.setRequestHeader(i, s.headers[i]);
            }
            if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || completed2)) {
              return jqXHR.abort();
            }
            strAbort = "abort";
            completeDeferred.add(s.complete);
            jqXHR.done(s.success);
            jqXHR.fail(s.error);
            transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);
            if (!transport) {
              done(-1, "No Transport");
            } else {
              jqXHR.readyState = 1;
              if (fireGlobals) {
                globalEventContext.trigger("ajaxSend", [jqXHR, s]);
              }
              if (completed2) {
                return jqXHR;
              }
              if (s.async && s.timeout > 0) {
                timeoutTimer = window2.setTimeout(function() {
                  jqXHR.abort("timeout");
                }, s.timeout);
              }
              try {
                completed2 = false;
                transport.send(requestHeaders, done);
              } catch (e) {
                if (completed2) {
                  throw e;
                }
                done(-1, e);
              }
            }
            function done(status, nativeStatusText, responses, headers) {
              var isSuccess, success, error, response, modified, statusText = nativeStatusText;
              if (completed2) {
                return;
              }
              completed2 = true;
              if (timeoutTimer) {
                window2.clearTimeout(timeoutTimer);
              }
              transport = void 0;
              responseHeadersString = headers || "";
              jqXHR.readyState = status > 0 ? 4 : 0;
              isSuccess = status >= 200 && status < 300 || status === 304;
              if (responses) {
                response = ajaxHandleResponses(s, jqXHR, responses);
              }
              if (!isSuccess && jQuery.inArray("script", s.dataTypes) > -1 && jQuery.inArray("json", s.dataTypes) < 0) {
                s.converters["text script"] = function() {
                };
              }
              response = ajaxConvert(s, response, jqXHR, isSuccess);
              if (isSuccess) {
                if (s.ifModified) {
                  modified = jqXHR.getResponseHeader("Last-Modified");
                  if (modified) {
                    jQuery.lastModified[cacheURL] = modified;
                  }
                  modified = jqXHR.getResponseHeader("etag");
                  if (modified) {
                    jQuery.etag[cacheURL] = modified;
                  }
                }
                if (status === 204 || s.type === "HEAD") {
                  statusText = "nocontent";
                } else if (status === 304) {
                  statusText = "notmodified";
                } else {
                  statusText = response.state;
                  success = response.data;
                  error = response.error;
                  isSuccess = !error;
                }
              } else {
                error = statusText;
                if (status || !statusText) {
                  statusText = "error";
                  if (status < 0) {
                    status = 0;
                  }
                }
              }
              jqXHR.status = status;
              jqXHR.statusText = (nativeStatusText || statusText) + "";
              if (isSuccess) {
                deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
              } else {
                deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
              }
              jqXHR.statusCode(statusCode);
              statusCode = void 0;
              if (fireGlobals) {
                globalEventContext.trigger(
                  isSuccess ? "ajaxSuccess" : "ajaxError",
                  [jqXHR, s, isSuccess ? success : error]
                );
              }
              completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);
              if (fireGlobals) {
                globalEventContext.trigger("ajaxComplete", [jqXHR, s]);
                if (!--jQuery.active) {
                  jQuery.event.trigger("ajaxStop");
                }
              }
            }
            return jqXHR;
          },
          getJSON: function(url, data, callback) {
            return jQuery.get(url, data, callback, "json");
          },
          getScript: function(url, callback) {
            return jQuery.get(url, void 0, callback, "script");
          }
        });
        jQuery.each(["get", "post"], function(_i, method) {
          jQuery[method] = function(url, data, callback, type2) {
            if (isFunction2(data)) {
              type2 = type2 || callback;
              callback = data;
              data = void 0;
            }
            return jQuery.ajax(jQuery.extend({
              url,
              type: method,
              dataType: type2,
              data,
              success: callback
            }, jQuery.isPlainObject(url) && url));
          };
        });
        jQuery.ajaxPrefilter(function(s) {
          var i;
          for (i in s.headers) {
            if (i.toLowerCase() === "content-type") {
              s.contentType = s.headers[i] || "";
            }
          }
        });
        jQuery._evalUrl = function(url, options, doc2) {
          return jQuery.ajax({
            url,
            // Make this explicit, since user can override this through ajaxSetup (trac-11264)
            type: "GET",
            dataType: "script",
            cache: true,
            async: false,
            global: false,
            // Only evaluate the response if it is successful (gh-4126)
            // dataFilter is not invoked for failure responses, so using it instead
            // of the default converter is kludgy but it works.
            converters: {
              "text script": function() {
              }
            },
            dataFilter: function(response) {
              jQuery.globalEval(response, options, doc2);
            }
          });
        };
        jQuery.fn.extend({
          wrapAll: function(html2) {
            var wrap;
            if (this[0]) {
              if (isFunction2(html2)) {
                html2 = html2.call(this[0]);
              }
              wrap = jQuery(html2, this[0].ownerDocument).eq(0).clone(true);
              if (this[0].parentNode) {
                wrap.insertBefore(this[0]);
              }
              wrap.map(function() {
                var elem = this;
                while (elem.firstElementChild) {
                  elem = elem.firstElementChild;
                }
                return elem;
              }).append(this);
            }
            return this;
          },
          wrapInner: function(html2) {
            if (isFunction2(html2)) {
              return this.each(function(i) {
                jQuery(this).wrapInner(html2.call(this, i));
              });
            }
            return this.each(function() {
              var self2 = jQuery(this), contents = self2.contents();
              if (contents.length) {
                contents.wrapAll(html2);
              } else {
                self2.append(html2);
              }
            });
          },
          wrap: function(html2) {
            var htmlIsFunction = isFunction2(html2);
            return this.each(function(i) {
              jQuery(this).wrapAll(htmlIsFunction ? html2.call(this, i) : html2);
            });
          },
          unwrap: function(selector) {
            this.parent(selector).not("body").each(function() {
              jQuery(this).replaceWith(this.childNodes);
            });
            return this;
          }
        });
        jQuery.expr.pseudos.hidden = function(elem) {
          return !jQuery.expr.pseudos.visible(elem);
        };
        jQuery.expr.pseudos.visible = function(elem) {
          return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
        };
        jQuery.ajaxSettings.xhr = function() {
          try {
            return new window2.XMLHttpRequest();
          } catch (e) {
          }
        };
        var xhrSuccessStatus = {
          // File protocol always yields status code 0, assume 200
          0: 200,
          // Support: IE <=9 only
          // trac-1450: sometimes IE returns 1223 when it should be 204
          1223: 204
        }, xhrSupported = jQuery.ajaxSettings.xhr();
        support.cors = !!xhrSupported && "withCredentials" in xhrSupported;
        support.ajax = xhrSupported = !!xhrSupported;
        jQuery.ajaxTransport(function(options) {
          var callback, errorCallback;
          if (support.cors || xhrSupported && !options.crossDomain) {
            return {
              send: function(headers, complete) {
                var i, xhr = options.xhr();
                xhr.open(
                  options.type,
                  options.url,
                  options.async,
                  options.username,
                  options.password
                );
                if (options.xhrFields) {
                  for (i in options.xhrFields) {
                    xhr[i] = options.xhrFields[i];
                  }
                }
                if (options.mimeType && xhr.overrideMimeType) {
                  xhr.overrideMimeType(options.mimeType);
                }
                if (!options.crossDomain && !headers["X-Requested-With"]) {
                  headers["X-Requested-With"] = "XMLHttpRequest";
                }
                for (i in headers) {
                  xhr.setRequestHeader(i, headers[i]);
                }
                callback = function(type2) {
                  return function() {
                    if (callback) {
                      callback = errorCallback = xhr.onload = xhr.onerror = xhr.onabort = xhr.ontimeout = xhr.onreadystatechange = null;
                      if (type2 === "abort") {
                        xhr.abort();
                      } else if (type2 === "error") {
                        if (typeof xhr.status !== "number") {
                          complete(0, "error");
                        } else {
                          complete(
                            // File: protocol always yields status 0; see trac-8605, trac-14207
                            xhr.status,
                            xhr.statusText
                          );
                        }
                      } else {
                        complete(
                          xhrSuccessStatus[xhr.status] || xhr.status,
                          xhr.statusText,
                          // Support: IE <=9 only
                          // IE9 has no XHR2 but throws on binary (trac-11426)
                          // For XHR2 non-text, let the caller handle it (gh-2498)
                          (xhr.responseType || "text") !== "text" || typeof xhr.responseText !== "string" ? { binary: xhr.response } : { text: xhr.responseText },
                          xhr.getAllResponseHeaders()
                        );
                      }
                    }
                  };
                };
                xhr.onload = callback();
                errorCallback = xhr.onerror = xhr.ontimeout = callback("error");
                if (xhr.onabort !== void 0) {
                  xhr.onabort = errorCallback;
                } else {
                  xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                      window2.setTimeout(function() {
                        if (callback) {
                          errorCallback();
                        }
                      });
                    }
                  };
                }
                callback = callback("abort");
                try {
                  xhr.send(options.hasContent && options.data || null);
                } catch (e) {
                  if (callback) {
                    throw e;
                  }
                }
              },
              abort: function() {
                if (callback) {
                  callback();
                }
              }
            };
          }
        });
        jQuery.ajaxPrefilter(function(s) {
          if (s.crossDomain) {
            s.contents.script = false;
          }
        });
        jQuery.ajaxSetup({
          accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
          },
          contents: {
            script: /\b(?:java|ecma)script\b/
          },
          converters: {
            "text script": function(text) {
              jQuery.globalEval(text);
              return text;
            }
          }
        });
        jQuery.ajaxPrefilter("script", function(s) {
          if (s.cache === void 0) {
            s.cache = false;
          }
          if (s.crossDomain) {
            s.type = "GET";
          }
        });
        jQuery.ajaxTransport("script", function(s) {
          if (s.crossDomain || s.scriptAttrs) {
            var script, callback;
            return {
              send: function(_, complete) {
                script = jQuery("<script>").attr(s.scriptAttrs || {}).prop({ charset: s.scriptCharset, src: s.url }).on("load error", callback = function(evt) {
                  script.remove();
                  callback = null;
                  if (evt) {
                    complete(evt.type === "error" ? 404 : 200, evt.type);
                  }
                });
                document2.head.appendChild(script[0]);
              },
              abort: function() {
                if (callback) {
                  callback();
                }
              }
            };
          }
        });
        var oldCallbacks = [], rjsonp = /(=)\?(?=&|$)|\?\?/;
        jQuery.ajaxSetup({
          jsonp: "callback",
          jsonpCallback: function() {
            var callback = oldCallbacks.pop() || jQuery.expando + "_" + nonce.guid++;
            this[callback] = true;
            return callback;
          }
        });
        jQuery.ajaxPrefilter("json jsonp", function(s, originalSettings, jqXHR) {
          var callbackName, overwritten, responseContainer, jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ? "url" : typeof s.data === "string" && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && rjsonp.test(s.data) && "data");
          if (jsonProp || s.dataTypes[0] === "jsonp") {
            callbackName = s.jsonpCallback = isFunction2(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback;
            if (jsonProp) {
              s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName);
            } else if (s.jsonp !== false) {
              s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName;
            }
            s.converters["script json"] = function() {
              if (!responseContainer) {
                jQuery.error(callbackName + " was not called");
              }
              return responseContainer[0];
            };
            s.dataTypes[0] = "json";
            overwritten = window2[callbackName];
            window2[callbackName] = function() {
              responseContainer = arguments;
            };
            jqXHR.always(function() {
              if (overwritten === void 0) {
                jQuery(window2).removeProp(callbackName);
              } else {
                window2[callbackName] = overwritten;
              }
              if (s[callbackName]) {
                s.jsonpCallback = originalSettings.jsonpCallback;
                oldCallbacks.push(callbackName);
              }
              if (responseContainer && isFunction2(overwritten)) {
                overwritten(responseContainer[0]);
              }
              responseContainer = overwritten = void 0;
            });
            return "script";
          }
        });
        support.createHTMLDocument = function() {
          var body = document2.implementation.createHTMLDocument("").body;
          body.innerHTML = "<form></form><form></form>";
          return body.childNodes.length === 2;
        }();
        jQuery.parseHTML = function(data, context, keepScripts) {
          if (typeof data !== "string") {
            return [];
          }
          if (typeof context === "boolean") {
            keepScripts = context;
            context = false;
          }
          var base, parsed, scripts2;
          if (!context) {
            if (support.createHTMLDocument) {
              context = document2.implementation.createHTMLDocument("");
              base = context.createElement("base");
              base.href = document2.location.href;
              context.head.appendChild(base);
            } else {
              context = document2;
            }
          }
          parsed = rsingleTag.exec(data);
          scripts2 = !keepScripts && [];
          if (parsed) {
            return [context.createElement(parsed[1])];
          }
          parsed = buildFragment([data], context, scripts2);
          if (scripts2 && scripts2.length) {
            jQuery(scripts2).remove();
          }
          return jQuery.merge([], parsed.childNodes);
        };
        jQuery.fn.load = function(url, params, callback) {
          var selector, type2, response, self2 = this, off = url.indexOf(" ");
          if (off > -1) {
            selector = stripAndCollapse(url.slice(off));
            url = url.slice(0, off);
          }
          if (isFunction2(params)) {
            callback = params;
            params = void 0;
          } else if (params && typeof params === "object") {
            type2 = "POST";
          }
          if (self2.length > 0) {
            jQuery.ajax({
              url,
              // If "type" variable is undefined, then "GET" method will be used.
              // Make value of this field explicit since
              // user can override it through ajaxSetup method
              type: type2 || "GET",
              dataType: "html",
              data: params
            }).done(function(responseText) {
              response = arguments;
              self2.html(selector ? (
                // If a selector was specified, locate the right elements in a dummy div
                // Exclude scripts to avoid IE 'Permission Denied' errors
                jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector)
              ) : (
                // Otherwise use the full result
                responseText
              ));
            }).always(callback && function(jqXHR, status) {
              self2.each(function() {
                callback.apply(this, response || [jqXHR.responseText, status, jqXHR]);
              });
            });
          }
          return this;
        };
        jQuery.expr.pseudos.animated = function(elem) {
          return jQuery.grep(jQuery.timers, function(fn) {
            return elem === fn.elem;
          }).length;
        };
        jQuery.offset = {
          setOffset: function(elem, options, i) {
            var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition, position = jQuery.css(elem, "position"), curElem = jQuery(elem), props = {};
            if (position === "static") {
              elem.style.position = "relative";
            }
            curOffset = curElem.offset();
            curCSSTop = jQuery.css(elem, "top");
            curCSSLeft = jQuery.css(elem, "left");
            calculatePosition = (position === "absolute" || position === "fixed") && (curCSSTop + curCSSLeft).indexOf("auto") > -1;
            if (calculatePosition) {
              curPosition = curElem.position();
              curTop = curPosition.top;
              curLeft = curPosition.left;
            } else {
              curTop = parseFloat(curCSSTop) || 0;
              curLeft = parseFloat(curCSSLeft) || 0;
            }
            if (isFunction2(options)) {
              options = options.call(elem, i, jQuery.extend({}, curOffset));
            }
            if (options.top != null) {
              props.top = options.top - curOffset.top + curTop;
            }
            if (options.left != null) {
              props.left = options.left - curOffset.left + curLeft;
            }
            if ("using" in options) {
              options.using.call(elem, props);
            } else {
              curElem.css(props);
            }
          }
        };
        jQuery.fn.extend({
          // offset() relates an element's border box to the document origin
          offset: function(options) {
            if (arguments.length) {
              return options === void 0 ? this : this.each(function(i) {
                jQuery.offset.setOffset(this, options, i);
              });
            }
            var rect, win, elem = this[0];
            if (!elem) {
              return;
            }
            if (!elem.getClientRects().length) {
              return { top: 0, left: 0 };
            }
            rect = elem.getBoundingClientRect();
            win = elem.ownerDocument.defaultView;
            return {
              top: rect.top + win.pageYOffset,
              left: rect.left + win.pageXOffset
            };
          },
          // position() relates an element's margin box to its offset parent's padding box
          // This corresponds to the behavior of CSS absolute positioning
          position: function() {
            if (!this[0]) {
              return;
            }
            var offsetParent, offset, doc2, elem = this[0], parentOffset = { top: 0, left: 0 };
            if (jQuery.css(elem, "position") === "fixed") {
              offset = elem.getBoundingClientRect();
            } else {
              offset = this.offset();
              doc2 = elem.ownerDocument;
              offsetParent = elem.offsetParent || doc2.documentElement;
              while (offsetParent && (offsetParent === doc2.body || offsetParent === doc2.documentElement) && jQuery.css(offsetParent, "position") === "static") {
                offsetParent = offsetParent.parentNode;
              }
              if (offsetParent && offsetParent !== elem && offsetParent.nodeType === 1) {
                parentOffset = jQuery(offsetParent).offset();
                parentOffset.top += jQuery.css(offsetParent, "borderTopWidth", true);
                parentOffset.left += jQuery.css(offsetParent, "borderLeftWidth", true);
              }
            }
            return {
              top: offset.top - parentOffset.top - jQuery.css(elem, "marginTop", true),
              left: offset.left - parentOffset.left - jQuery.css(elem, "marginLeft", true)
            };
          },
          // This method will return documentElement in the following cases:
          // 1) For the element inside the iframe without offsetParent, this method will return
          //    documentElement of the parent window
          // 2) For the hidden or detached element
          // 3) For body or html element, i.e. in case of the html node - it will return itself
          //
          // but those exceptions were never presented as a real life use-cases
          // and might be considered as more preferable results.
          //
          // This logic, however, is not guaranteed and can change at any point in the future
          offsetParent: function() {
            return this.map(function() {
              var offsetParent = this.offsetParent;
              while (offsetParent && jQuery.css(offsetParent, "position") === "static") {
                offsetParent = offsetParent.offsetParent;
              }
              return offsetParent || documentElement;
            });
          }
        });
        jQuery.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function(method, prop) {
          var top = "pageYOffset" === prop;
          jQuery.fn[method] = function(val) {
            return access(this, function(elem, method2, val2) {
              var win;
              if (isWindow(elem)) {
                win = elem;
              } else if (elem.nodeType === 9) {
                win = elem.defaultView;
              }
              if (val2 === void 0) {
                return win ? win[prop] : elem[method2];
              }
              if (win) {
                win.scrollTo(
                  !top ? val2 : win.pageXOffset,
                  top ? val2 : win.pageYOffset
                );
              } else {
                elem[method2] = val2;
              }
            }, method, val, arguments.length);
          };
        });
        jQuery.each(["top", "left"], function(_i, prop) {
          jQuery.cssHooks[prop] = addGetHookIf(
            support.pixelPosition,
            function(elem, computed2) {
              if (computed2) {
                computed2 = curCSS(elem, prop);
                return rnumnonpx.test(computed2) ? jQuery(elem).position()[prop] + "px" : computed2;
              }
            }
          );
        });
        jQuery.each({ Height: "height", Width: "width" }, function(name2, type2) {
          jQuery.each({
            padding: "inner" + name2,
            content: type2,
            "": "outer" + name2
          }, function(defaultExtra, funcName) {
            jQuery.fn[funcName] = function(margin, value) {
              var chainable = arguments.length && (defaultExtra || typeof margin !== "boolean"), extra = defaultExtra || (margin === true || value === true ? "margin" : "border");
              return access(this, function(elem, type3, value2) {
                var doc2;
                if (isWindow(elem)) {
                  return funcName.indexOf("outer") === 0 ? elem["inner" + name2] : elem.document.documentElement["client" + name2];
                }
                if (elem.nodeType === 9) {
                  doc2 = elem.documentElement;
                  return Math.max(
                    elem.body["scroll" + name2],
                    doc2["scroll" + name2],
                    elem.body["offset" + name2],
                    doc2["offset" + name2],
                    doc2["client" + name2]
                  );
                }
                return value2 === void 0 ? (
                  // Get width or height on the element, requesting but not forcing parseFloat
                  jQuery.css(elem, type3, extra)
                ) : (
                  // Set width or height on the element
                  jQuery.style(elem, type3, value2, extra)
                );
              }, type2, chainable ? margin : void 0, chainable);
            };
          });
        });
        jQuery.each([
          "ajaxStart",
          "ajaxStop",
          "ajaxComplete",
          "ajaxError",
          "ajaxSuccess",
          "ajaxSend"
        ], function(_i, type2) {
          jQuery.fn[type2] = function(fn) {
            return this.on(type2, fn);
          };
        });
        jQuery.fn.extend({
          bind: function(types, data, fn) {
            return this.on(types, null, data, fn);
          },
          unbind: function(types, fn) {
            return this.off(types, null, fn);
          },
          delegate: function(selector, types, data, fn) {
            return this.on(types, selector, data, fn);
          },
          undelegate: function(selector, types, fn) {
            return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn);
          },
          hover: function(fnOver, fnOut) {
            return this.on("mouseenter", fnOver).on("mouseleave", fnOut || fnOver);
          }
        });
        jQuery.each(
          "blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),
          function(_i, name2) {
            jQuery.fn[name2] = function(data, fn) {
              return arguments.length > 0 ? this.on(name2, null, data, fn) : this.trigger(name2);
            };
          }
        );
        var rtrim2 = /^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g;
        jQuery.proxy = function(fn, context) {
          var tmp, args, proxy;
          if (typeof context === "string") {
            tmp = fn[context];
            context = fn;
            fn = tmp;
          }
          if (!isFunction2(fn)) {
            return void 0;
          }
          args = slice.call(arguments, 2);
          proxy = function() {
            return fn.apply(context || this, args.concat(slice.call(arguments)));
          };
          proxy.guid = fn.guid = fn.guid || jQuery.guid++;
          return proxy;
        };
        jQuery.holdReady = function(hold) {
          if (hold) {
            jQuery.readyWait++;
          } else {
            jQuery.ready(true);
          }
        };
        jQuery.isArray = Array.isArray;
        jQuery.parseJSON = JSON.parse;
        jQuery.nodeName = nodeName;
        jQuery.isFunction = isFunction2;
        jQuery.isWindow = isWindow;
        jQuery.camelCase = camelCase;
        jQuery.type = toType;
        jQuery.now = Date.now;
        jQuery.isNumeric = function(obj) {
          var type2 = jQuery.type(obj);
          return (type2 === "number" || type2 === "string") && // parseFloat NaNs numeric-cast false positives ("")
          // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
          // subtraction forces infinities to NaN
          !isNaN(obj - parseFloat(obj));
        };
        jQuery.trim = function(text) {
          return text == null ? "" : (text + "").replace(rtrim2, "$1");
        };
        var _jQuery = window2.jQuery, _$ = window2.$;
        jQuery.noConflict = function(deep) {
          if (window2.$ === jQuery) {
            window2.$ = _$;
          }
          if (deep && window2.jQuery === jQuery) {
            window2.jQuery = _jQuery;
          }
          return jQuery;
        };
        if (typeof noGlobal === "undefined") {
          window2.jQuery = window2.$ = jQuery;
        }
        return jQuery;
      });
    })(jquery$1);
    return jquery$1.exports;
  }
  var jqueryExports = requireJquery();
  const $ = /* @__PURE__ */ getDefaultExportFromCjs(jqueryExports);
  const name = "linuxdo-scripts";
  const description = "manifest.json description";
  const version = "1.0.9";
  const type = "module";
  const scripts = { "dev": "wxt", "dev:firefox": "wxt -b firefox", "build": "wxt build", "py": "py scripts/build.py", "build:firefox": "wxt build -b firefox", "zip": "wxt zip", "zip:firefox": "wxt zip -b firefox", "compile": "vue-tsc --noEmit", "postinstall": "wxt prepare", "publish": "wxt build && wxt zip && wxt zip -b firefox && py scripts/build.py" };
  const dependencies = { "element-plus": "^2.9.1", "jquery": "^3.7.1", "marked": "^14.1.1", "pangu": "^4.0.7", "vue": "^3.5.12", "webdav": "^5.7.1", "webext-dynamic-content-scripts": "^10.0.3", "webext-permission-toggle": "^5.0.1" };
  const devDependencies = { "@types/chrome": "^0.0.280", "@wxt-dev/module-vue": "^1.0.1", "adm-zip": "^0.5.16", "less": "^4.2.1", "less-loader": "^8.0.0", "sass": "^1.77.8", "style-loader": "^2.0.0", "typescript": "5.6.3", "vue-tsc": "^2.1.10", "wxt": "^0.19.13" };
  const packageJson = {
    name,
    description,
    "private": true,
    version,
    type,
    scripts,
    dependencies,
    devDependencies
  };
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$_ = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    data() {
      return {
        eventListeners: []
      };
    },
    methods: {
      createSuperLabel(url, id) {
        let a = document.createElement("a");
        a.setAttribute("href", url);
        a.setAttribute("target", "_blank");
        a.setAttribute("id", id);
        if (!document.getElementById(id)) {
          document.body.appendChild(a);
        }
        a.click();
      },
      init() {
        this.removeEventListeners();
        $(".topic-list a.title,.topic .search-link").each((index, element) => {
          const listener = (event) => {
            event.preventDefault();
            var url = $(element).attr("href");
            this.createSuperLabel(url, url);
          };
          $(element).on("click", listener);
          this.eventListeners.push({ element, listener });
        });
      },
      removeEventListeners() {
        this.eventListeners.forEach(({ element, listener }) => {
          $(element).off("click", listener);
        });
        this.eventListeners = [];
      }
    },
    created() {
      if (this.modelValue) {
        let pollinglength1 = 0;
        let pollinglength2 = 0;
        setInterval(() => {
          if (pollinglength1 != $(".topic-list-body tr").length) {
            pollinglength1 = $(".topic-list-body tr").length;
            this.init();
          }
          if (pollinglength2 != $(".post-stream .topic-post").length) {
            pollinglength2 = $(".post-stream .topic-post").length;
            this.init();
          }
        }, 1e3);
      }
    },
    beforeDestroy() {
      this.removeEventListeners();
    }
  };
  const _hoisted_1$V = { class: "item" };
  const _hoisted_2$K = { class: "tit" };
  const _hoisted_3$C = ["checked"];
  function _sfc_render$_(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$V, [
      createBaseVNode(
        "div",
        _hoisted_2$K,
        toDisplayString($props.sort) + ". 是否新标签页打开话题",
        1
        /* TEXT */
      ),
      createBaseVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$C)
    ]);
  }
  const MenuOpenpostblank = /* @__PURE__ */ _export_sfc(_sfc_main$_, [["render", _sfc_render$_], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/BasicSettings/MenuOpenpostblank.vue"]]);
  const _sfc_main$Z = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    methods: {
      init() {
        if ($("#list-area .show-more").length > 0) {
          $("head title").html("【有新话题赶紧来水！！】");
        }
      }
    },
    created() {
      if (this.modelValue) {
        setInterval(() => {
          this.init();
        }, 1e3);
      }
    }
  };
  const _hoisted_1$U = { class: "item" };
  const _hoisted_2$J = { class: "tit" };
  const _hoisted_3$B = ["checked"];
  function _sfc_render$Z(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$U, [
      createBaseVNode(
        "div",
        _hoisted_2$J,
        toDisplayString($props.sort) + ". 是否开启新话题提醒",
        1
        /* TEXT */
      ),
      createBaseVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$B)
    ]);
  }
  const MenuNewtopicreminder = /* @__PURE__ */ _export_sfc(_sfc_main$Z, [["render", _sfc_render$Z], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/BasicSettings/MenuNewtopicreminder.vue"]]);
  const _sfc_main$Y = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    methods: {
      init() {
        $("nav.post-controls .show-replies").each(function() {
          $(this).click();
        });
      }
    },
    created() {
      if (this.modelValue) {
        let pollinglength2 = 0;
        setInterval(() => {
          if (pollinglength2 != $(".post-stream .topic-post").length) {
            pollinglength2 = $(".post-stream .topic-post").length;
            this.init();
          }
        }, 1e3);
      }
    }
  };
  const _hoisted_1$T = { class: "item" };
  const _hoisted_2$I = { class: "tit" };
  const _hoisted_3$A = ["checked"];
  function _sfc_render$Y(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$T, [
      createBaseVNode(
        "div",
        _hoisted_2$I,
        toDisplayString($props.sort) + ". 是否自动展开回复",
        1
        /* TEXT */
      ),
      createBaseVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$A)
    ]);
  }
  const MenuAutoexpandreply = /* @__PURE__ */ _export_sfc(_sfc_main$Y, [["render", _sfc_render$Y], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/BasicSettings/MenuAutoexpandreply.vue"]]);
  const _sfc_main$X = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    methods: {
      init() {
        const tabs = $(".reply-to-tab");
        let index = 0;
        const clickNext = () => {
          if (index >= tabs.length) return;
          const tab = $(tabs[index]);
          if (!tab.data("clicked")) {
            tab.click();
            tab.data("clicked", true);
          }
          index++;
          setTimeout(clickNext, 1e3);
        };
        clickNext();
      }
    },
    created() {
      if (this.modelValue) {
        setInterval(() => {
          if ($(".topic-body .reply-to-tab").length > 0) {
            this.init();
          }
        }, 1e3);
      }
    }
  };
  const _hoisted_1$S = { class: "item" };
  const _hoisted_2$H = { class: "tit" };
  const _hoisted_3$z = ["checked"];
  function _sfc_render$X(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$S, [
      createBaseVNode(
        "div",
        _hoisted_2$H,
        toDisplayString($props.sort) + ". 是否自动展开回复父帖子",
        1
        /* TEXT */
      ),
      createBaseVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$z)
    ]);
  }
  const MenuAutoexpandreply1 = /* @__PURE__ */ _export_sfc(_sfc_main$X, [["render", _sfc_render$X], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/BasicSettings/MenuAutoexpandreply1.vue"]]);
  const _sfc_main$W = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    methods: {
      formattedDate(time) {
        const timestamp = Number(time);
        const date = new Date(timestamp);
        const now = /* @__PURE__ */ new Date();
        const isToday = now.getFullYear() === date.getFullYear() && now.getMonth() === date.getMonth() && now.getDate() === date.getDate();
        const isThisYear = now.getFullYear() === date.getFullYear();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        if (isToday) {
          return `${hours}:${minutes}`;
        } else if (isThisYear) {
          return `${month}/${day} ${hours}:${minutes}`;
        } else {
          return `${year}/${month}/${day} ${hours}:${minutes}`;
        }
      },
      convertToTimestamp(dateStr) {
        const cleanedDateStr = dateStr.replace(/\s+/g, "");
        const datePattern = /(\d{4})年(\d{1,2})月(\d{1,2})日(\d{2}):(\d{2})/;
        const dateMatch = cleanedDateStr.match(datePattern);
        if (dateMatch) {
          const year = parseInt(dateMatch[1], 10);
          const month = parseInt(dateMatch[2], 10) - 1;
          const day = parseInt(dateMatch[3], 10);
          const hours = parseInt(dateMatch[4], 10);
          const minutes = parseInt(dateMatch[5], 10);
          const date = new Date(year, month, day, hours, minutes);
          return date.getTime();
        }
        return null;
      },
      setInitDate() {
        $(".topic-list .age").each((index, element) => {
          const str = $(element).attr("title");
          const match = str.match(/创建日期：([\s\S]*?)最新：/);
          if (match && match[1]) {
            const creationDate = match[1].trim();
            const timestamp = this.convertToTimestamp(creationDate);
            if ($(element).find(".linuxtime").length < 1) {
              const now = (/* @__PURE__ */ new Date()).getTime();
              const oneDay = 1e3 * 60 * 60 * 24;
              const oneWeek = oneDay * 7;
              const oneMonth = oneDay * 30;
              const threeMonths = oneMonth * 3;
              let color;
              const timeDiff = now - timestamp;
              if (timeDiff < oneDay) {
                color = "#45B5AA";
                $(element).find(".post-activity").append(
                  `<span class="linuxtime" style="color:${color}">（${this.formattedDate(
                    timestamp
                  )}）</span>`
                );
              } else if (timeDiff < oneWeek) {
                color = "#66A586";
                $(element).find(".post-activity").append(
                  `<span class="linuxtime" style="color:${color}">（${this.formattedDate(
                    timestamp
                  )}）</span>`
                );
              } else if (timeDiff < oneMonth) {
                color = "#CFA94A";
                $(element).find(".post-activity").append(
                  `<span class="linuxtime" style="color:${color}">（${this.formattedDate(
                    timestamp
                  )}）</span>`
                );
              } else if (timeDiff < threeMonths) {
                color = "#3e8ed2";
                $(element).find(".post-activity").append(
                  `<span class="linuxtime" style="color:${color}">（${this.formattedDate(
                    timestamp
                  )}）</span>`
                );
              } else {
                color = "#cccccc";
                $(element).find(".post-activity").append(
                  `<span class="linuxtime" style="color:${color}">
                  （<img style="width:20px;vertical-align:sub;" src="https://linux.do/uploads/default/original/4X/4/0/8/408c29a1d1dfaada3160fb2ae366cf3a7c7c1696.png">${this.formattedDate(
                    timestamp
                  )}）
                </span>`
                );
              }
            }
          }
        });
      },
      initDateAndStartPolling() {
        setInterval(() => {
          this.setInitDate();
          this.startPolling();
        }, 1e3);
      },
      startPolling() {
        setInterval(() => {
          this.setInitDate();
        }, 1e4);
      }
    },
    mounted() {
      if (this.modelValue) {
        this.startPolling();
        this.initDateAndStartPolling();
      }
    }
  };
  const _hoisted_1$R = { class: "item" };
  const _hoisted_2$G = { class: "tit" };
  const _hoisted_3$y = ["checked"];
  function _sfc_render$W(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", null, [
      createBaseVNode("div", _hoisted_1$R, [
        createBaseVNode(
          "div",
          _hoisted_2$G,
          toDisplayString($props.sort) + ". 话题列表显示创建时间",
          1
          /* TEXT */
        ),
        createBaseVNode("input", {
          type: "checkbox",
          checked: $props.modelValue,
          onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
        }, null, 40, _hoisted_3$y)
      ])
    ]);
  }
  const MenuShowcreatetime = /* @__PURE__ */ _export_sfc(_sfc_main$W, [["render", _sfc_render$W], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/BasicSettings/MenuShowcreatetime.vue"]]);
  const _sfc_main$V = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    methods: {
      formattedDate(time) {
        const timestamp = Number(time);
        const date = new Date(timestamp);
        const now = /* @__PURE__ */ new Date();
        const isToday = now.getFullYear() === date.getFullYear() && now.getMonth() === date.getMonth() && now.getDate() === date.getDate();
        const isThisYear = now.getFullYear() === date.getFullYear();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        if (isToday) {
          return `${hours}:${minutes}`;
        } else if (isThisYear) {
          return `${month}/${day} ${hours}:${minutes}`;
        } else {
          return `${year}/${month}/${day} ${hours}:${minutes}`;
        }
      },
      convertToTimestamp(dateStr) {
        const cleanedDateStr = dateStr.replace(/\s+/g, "");
        const datePattern = /(\d{4})年(\d{1,2})月(\d{1,2})日(\d{2}):(\d{2})/;
        const dateMatch = cleanedDateStr.match(datePattern);
        if (dateMatch) {
          const year = parseInt(dateMatch[1], 10);
          const month = parseInt(dateMatch[2], 10) - 1;
          const day = parseInt(dateMatch[3], 10);
          const hours = parseInt(dateMatch[4], 10);
          const minutes = parseInt(dateMatch[5], 10);
          const date = new Date(year, month, day, hours, minutes);
          return date.getTime();
        }
        return null;
      },
      setInitDate() {
        $(".topic-list-item .age").each((index, element) => {
          const str = $(element).attr("title");
          const match = str.match(/创建日期：([\s\S]*?)最新：/);
          if (match && match[1]) {
            const creationDate = match[1].trim();
            const timestamp = this.convertToTimestamp(creationDate);
            const now = (/* @__PURE__ */ new Date()).getTime();
            const oneDay = 1e3 * 60 * 60 * 24;
            const oneWeek = oneDay * 7;
            const oneMonth = oneDay * 30;
            const threeMonths = oneMonth * 3;
            let color;
            const timeDiff = now - timestamp;
            if (timeDiff < oneDay) {
              color = "#45B5AA";
              $(element).siblings(".views").html(
                `<span class="linuxtime" style="color:${color}">${this.formattedDate(
                  timestamp
                )}</span>`
              );
            } else if (timeDiff < oneWeek) {
              color = "#66A586";
              $(element).siblings(".views").html(
                `<span class="linuxtime" style="color:${color}">${this.formattedDate(
                  timestamp
                )}</span>`
              );
            } else if (timeDiff < oneMonth) {
              color = "#CFA94A";
              $(element).siblings(".views").html(
                `<span class="linuxtime" style="color:${color}">${this.formattedDate(
                  timestamp
                )}</span>`
              );
            } else if (timeDiff < threeMonths) {
              color = "#3e8ed2";
              $(element).siblings(".views").html(
                `<span class="linuxtime" style="color:${color}">${this.formattedDate(
                  timestamp
                )}</span>`
              );
            } else {
              color = "#cccccc";
              $(element).siblings(".views").html(
                `<span class="linuxtime" style="color:${color}">
               <img style="width:20px;vertical-align:sub;" src="https://linux.do/uploads/default/original/4X/4/0/8/408c29a1d1dfaada3160fb2ae366cf3a7c7c1696.png">${this.formattedDate(
                  timestamp
                )}
                </span>`
              );
            }
          }
        });
      },
      initDateAndStartPolling() {
        setInterval(() => {
          this.setInitDate();
          this.startPolling();
        }, 1e3);
      },
      startPolling() {
        setInterval(() => {
          this.setInitDate();
        }, 1e4);
      }
    },
    mounted() {
      if (this.modelValue) {
        this.startPolling();
        this.initDateAndStartPolling();
      }
    }
  };
  const _hoisted_1$Q = { class: "item" };
  const _hoisted_2$F = { class: "tit" };
  const _hoisted_3$x = ["checked"];
  function _sfc_render$V(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$Q, [
      createBaseVNode(
        "div",
        _hoisted_2$F,
        toDisplayString($props.sort) + ". 将浏览量替换为创建时间（与 4 互斥，只可选择一个）",
        1
        /* TEXT */
      ),
      createBaseVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$x)
    ]);
  }
  const MenuShowcreatetime1 = /* @__PURE__ */ _export_sfc(_sfc_main$V, [["render", _sfc_render$V], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/BasicSettings/MenuShowcreatetime1.vue"]]);
  const _sfc_main$U = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    methods: {
      init() {
        $(".topic-post").each(function() {
          const num = $(this).find("article").attr("id").replace(/^post_/, "");
          if ($(this).find(".linuxfloor").length < 1) {
            $(this).find(".post-infos").append(`<span class="linuxfloor">#${num}</span>`);
          }
        });
      }
    },
    created() {
      if (this.modelValue) {
        let pollinglength2 = 0;
        setInterval(() => {
          if (pollinglength2 != $(".post-stream .topic-post").length) {
            pollinglength2 = $(".post-stream .topic-post").length;
            this.init();
          }
        }, 1e3);
      }
    }
  };
  const _hoisted_1$P = { class: "item" };
  const _hoisted_2$E = { class: "tit" };
  const _hoisted_3$w = ["checked"];
  function _sfc_render$U(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$P, [
      createBaseVNode(
        "div",
        _hoisted_2$E,
        toDisplayString($props.sort) + ". 是否显示楼层数",
        1
        /* TEXT */
      ),
      createBaseVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$w)
    ]);
  }
  const MenuShowfloors = /* @__PURE__ */ _export_sfc(_sfc_main$U, [["render", _sfc_render$U], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/BasicSettings/MenuShowfloors.vue"]]);
  const _sfc_main$T = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    created() {
      if (this.modelValue) {
        $("head").append(`<style>.header-title{display:none!important}</style>`);
      }
    }
  };
  const _hoisted_1$O = { class: "item" };
  const _hoisted_2$D = { class: "tit" };
  const _hoisted_3$v = ["checked"];
  function _sfc_render$T(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$O, [
      createBaseVNode(
        "div",
        _hoisted_2$D,
        toDisplayString($props.sort) + ". 隐藏话题详情顶部大标题",
        1
        /* TEXT */
      ),
      createBaseVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$v)
    ]);
  }
  const MenuHidetopicdetailtitle = /* @__PURE__ */ _export_sfc(_sfc_main$T, [["render", _sfc_render$T], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/BasicSettings/MenuHidetopicdetailtitle.vue"]]);
  const _sfc_main$S = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    methods: {
      init() {
        if ($(".topicpreview").length < 1) {
          $("body").append(`<div class="topicpreview">
          <div class="topicpreview-opacity"></div>
          <div class="topicpreview-container">
            <p style="text-align: center">正在加载中...</p>  
          </div>
          </div>`);
        }
        $(".topic-list .main-link a.title").each(function() {
          const id = $(this).attr("data-topic-id");
          if ($(this).parents(".link-top-line").find(".topicpreview-btn").length < 1) {
            $(this).parents(".link-top-line").append(
              `<button class="btn btn-icon-text btn-default topicpreview-btn" data-id="${id}">预览</button>`
            );
          }
        });
      },
      setClick() {
        $(".topicpreview-btn").each(function() {
          $(this).click(function() {
            $(".topicpreview").show();
            let previewData = {};
            let previewurl = $(this).attr("data-id");
            fetch(`/t/${previewurl}.json`).then((response) => response.json()).then((data) => {
              previewData = data;
              function formatDate(isoString) {
                const date = new Date(isoString);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                const hours = String(date.getHours()).padStart(2, "0");
                const minutes = String(date.getMinutes()).padStart(2, "0");
                const seconds = String(date.getSeconds()).padStart(2, "0");
                return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
              }
              $(".topicpreview-container").html(`
                <div class="topicpreview-title">${previewData.title}</div>
                <p class="topicpreview-date">发帖时间：${formatDate(
                previewData.created_at
              )}</p>
                <div class="topicpreview-content"></div>
                <p style="text-align: center;">仅显示前 20 条，<a href="/t/topic/${previewurl}/">查看更多</a></p>
              `);
              $.each(previewData.post_stream.posts, function(index, post) {
                $(".topicpreview .topicpreview-content").append(`
                  <div class="item">
                    <span class="itemfloor">${index + 1}楼</span>
                    <div class="itempost">
                      <div class="itemname">
                        ${post.display_username} 
                        <span>${post.username}</span>
                        <div class="itemdate">${formatDate(post.created_at)}</div>
                      </div>
                      ${post.cooked}
                    </div>
                  </div>
                `);
              });
              setInterval(() => {
                $(".lightbox").attr("href", "javascript:void(0)");
              }, 1e3);
            });
          });
        });
        $(".topicpreview-opacity").click(this.closePreview);
      },
      closePreview() {
        $(".topicpreview").hide();
        $(".topicpreview-container").html(
          `<p style="text-align: center">正在加载中...</p> `
        );
      },
      handleKeyDown(event) {
        if (event.key === "Escape") {
          this.closePreview();
        }
      }
    },
    created() {
      if (this.modelValue) {
        setInterval(() => {
          this.init();
        }, 1e3);
        let pollinglength1 = 0;
        let pollinglength2 = 0;
        setInterval(() => {
          if (pollinglength1 != $(".topic-list-body tr").length) {
            pollinglength1 = $(".topic-list-body tr").length;
            this.setClick();
          }
          if (pollinglength2 != $(".post-stream .topic-post").length) {
            pollinglength2 = $(".post-stream .topic-post").length;
            this.setClick();
          }
        }, 1e3);
        document.addEventListener("keydown", this.handleKeyDown);
      }
    },
    beforeUnmount() {
      document.removeEventListener("keydown", this.handleKeyDown);
    }
  };
  const _hoisted_1$N = { class: "item" };
  const _hoisted_2$C = { class: "tit" };
  const _hoisted_3$u = ["checked"];
  function _sfc_render$S(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$N, [
      createBaseVNode(
        "div",
        _hoisted_2$C,
        toDisplayString($props.sort) + ". 是否开启话题预览功能",
        1
        /* TEXT */
      ),
      createBaseVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$u)
    ]);
  }
  const MenuTopicpreview = /* @__PURE__ */ _export_sfc(_sfc_main$S, [["render", _sfc_render$S], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/BasicSettings/MenuTopicpreview.vue"]]);
  const _sfc_main$R = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"]
  };
  const _hoisted_1$M = { class: "item" };
  const _hoisted_2$B = { class: "tit" };
  const _hoisted_3$t = ["checked"];
  function _sfc_render$R(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$M, [
      createBaseVNode(
        "div",
        _hoisted_2$B,
        toDisplayString($props.sort) + ". 是否开启只看楼主",
        1
        /* TEXT */
      ),
      createBaseVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$t)
    ]);
  }
  const MenuLookOP = /* @__PURE__ */ _export_sfc(_sfc_main$R, [["render", _sfc_render$R], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/BasicSettings/MenuLookOP.vue"]]);
  const _sfc_main$Q = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    created() {
      if (this.modelValue) {
        $("head").append(`<style>
      .topic-body .cooked{max-height:600px!important;overflow-y:auto!important;}
      </style>`);
      }
    }
  };
  const _hoisted_1$L = { class: "item" };
  const _hoisted_2$A = { class: "tit" };
  const _hoisted_3$s = ["checked"];
  function _sfc_render$Q(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$L, [
      createBaseVNode(
        "div",
        _hoisted_2$A,
        toDisplayString($props.sort) + ". 智能限制楼层高度",
        1
        /* TEXT */
      ),
      createBaseVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$s)
    ]);
  }
  const MenuFloorHeight = /* @__PURE__ */ _export_sfc(_sfc_main$Q, [["render", _sfc_render$Q], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/BasicSettings/MenuFloorHeight.vue"]]);
  const emojiSet = [
    {
      size: "30x30",
      name: "tieba_001",
      url: "/uploads/default/original/3X/9/a/9ac368cc8eafad165bbcf61b0263803d3b2dc2a7.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_002",
      url: "/uploads/default/original/3X/1/6/16baef70ba80d438e4bb1907ec0c354d680e09df.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_003",
      url: "/uploads/default/original/3X/2/7/27a55a1370c41f0736ba094bdc8866c6c2878c16.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_004",
      url: "/uploads/default/original/3X/9/e/9eac534efec605f5a1ac3b2f08d768cfbb4c63a9.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_005",
      url: "/uploads/default/original/3X/7/4/7493e87cae45656ac7997e8c79c852f9abc80454.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_006",
      url: "/uploads/default/original/3X/5/9/596da26825d2a806bd1952b5231f24d212866c1b.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_007",
      url: "/uploads/default/original/3X/c/0/c055b564a5b580ddfbf651df9a70feaec2b3b8e4.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_008",
      url: "/uploads/default/original/3X/9/e/9e137b2c72b77ee75454d737b5ad9d043dd49954.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_009",
      url: "/uploads/default/original/3X/c/7/c756c0f079d25093ed6c7c2feaaa423ead63411c.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_125",
      url: "/uploads/default/original/3X/1/3/133688dda7ae38a3ddbc9eda0ca99fa8ddbb2704.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_010",
      url: "/uploads/default/original/3X/2/b/2b58793c54c273c2d3d40722c4def435543084b4.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_011",
      url: "/uploads/default/original/3X/0/b/0b73771da5b3dc534ad05f1b5fff24325fc0eff7.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_012",
      url: "/uploads/default/original/3X/9/d/9d9e539ba33d272a5c6468cdb2fa7615695fa788.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_013",
      url: "/uploads/default/original/3X/e/1/e1aad11157b14d04bc8056573ecb23b5a219d260.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_014",
      url: "/uploads/default/original/3X/1/2/123defe5ac241618f3bb5246a727be77d996656d.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_015",
      url: "/uploads/default/original/3X/d/3/d3347ade2d4baf8092696b33c3523e634923b4fe.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_016",
      url: "/uploads/default/original/3X/2/1/21158038759f6a8630df8507f782a45a6caee004.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_017",
      url: "/uploads/default/original/3X/7/7/7732425deb158037a8692c45381de35ca83105e6.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_018",
      url: "/uploads/default/original/3X/7/1/7101ed3a9c047d318454b4eff91d74c06db5eaab.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_019",
      url: "/uploads/default/original/3X/e/e/eeccf0c1ccda4a4f3b33b4bb502c14e80c324443.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_020",
      url: "/uploads/default/original/3X/2/8/286824f9727de34e43b906346c0bdb0f854b1e2b.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_021",
      url: "/uploads/default/original/3X/0/9/09077d62fc78be7a9c19a8c084a35eac8373d241.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_022",
      url: "/uploads/default/original/3X/6/2/62e7b0ea68e56cc033f78527e62a825a6d9001f2.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_023",
      url: "/uploads/default/original/3X/d/4/d4e4c57ba70bd38264f0677cf338fa8af3228fbd.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_024",
      url: "/uploads/default/original/3X/9/c/9c2f3e1ce5982036af66b951a26231b7590e93d4.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_025",
      url: "/uploads/default/original/3X/e/4/e415f72201d585ac7ccc869a334048006d2b6b9d.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_026",
      url: "/uploads/default/original/3X/a/d/ad2d245bbe71a05b0bd7a42f435d25524517c7ac.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_027",
      url: "/uploads/default/original/3X/7/9/7992e06b38f76d7d55a8bc496fa6dd046ba1f0ad.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_028",
      url: "/uploads/default/original/3X/4/4/448d0cb933ec8016797faef8c8dcfb8822e43326.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_029",
      url: "/uploads/default/original/3X/8/4/84cd00fd735f11a57b193d62880f55b4ab835c7e.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_030",
      url: "/uploads/default/original/3X/6/8/68b3471539dbbe40437b0881916feb2d9d4ad254.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_031",
      url: "/uploads/default/original/3X/8/9/89870339101e10993ef1e55dd9e96f275a6a99f9.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_032",
      url: "/uploads/default/original/3X/2/5/25936c19b7808540b4a46eb7aeddced05658ec77.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_033",
      url: "/uploads/default/original/3X/d/f/dff9a29b33ccc0eeffe6d457cee58307246e28ab.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_034",
      url: "/uploads/default/original/3X/8/b/8b42b74ab6f63dcd02b923cee5ab8f224f32954e.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_035",
      url: "/uploads/default/original/3X/a/2/a268ad46209a864548c0439854c562d5a1a852e4.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_036",
      url: "/uploads/default/original/3X/4/9/49b2eba636dba687d98c4254bb00c682194f3556.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_037",
      url: "/uploads/default/original/3X/5/3/5359fdcfeb8a92794fdf7e0a9e1b7002ba635765.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_038",
      url: "/uploads/default/original/3X/5/3/535b871b10c649510280825c98e80ee1122613ec.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_039",
      url: "/uploads/default/original/3X/9/8/98939cb96a8df85af0efdaf02dcc144265e64703.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_040",
      url: "/uploads/default/original/3X/3/a/3a5fcb80663d73c1f116527c17de7cad37b72c49.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_041",
      url: "/uploads/default/original/3X/4/0/40cc7fe068c66b38c5e58ee8b59879f572dcd2ca.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_042",
      url: "/uploads/default/original/3X/e/6/e69395f0a9f391ca3c296aeddf510d0fb1d28fdf.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_043",
      url: "/uploads/default/original/3X/1/2/123e2d16a27491073fd90994fcd2820a48b2eb1d.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_044",
      url: "/uploads/default/original/3X/4/d/4d101bae8975480e4c81969242c6db771ccf29df.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_045",
      url: "/uploads/default/original/3X/6/8/687dca2210abafbcaaf211e27a013c1c0d7d480c.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_046",
      url: "/uploads/default/original/3X/1/4/14bca5d4cdaca743d0da8bc7f3b23146b53bc534.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_047",
      url: "/uploads/default/original/3X/c/d/cd555f2a5f605873e85b12ebf5e20affeb86817b.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_048",
      url: "/uploads/default/original/3X/7/d/7d5173acb48b6662934d93d15ccf03bc4eb4fe1e.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_049",
      url: "/uploads/default/original/3X/b/7/b774ed3e1792a0c345c3dc6b405398fc330476c4.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_050",
      url: "/uploads/default/original/3X/6/3/63c1a091c6a7a3a4ba09f79d3df61b5258d1da14.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_062",
      url: "/uploads/default/original/3X/6/4/644937964bfb3b7ff9519a8c789fba156bc51493.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_063",
      url: "/uploads/default/original/3X/9/7/977e25c3bb0bb2ffffd7680ef75de860c9bc8eeb.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_064",
      url: "/uploads/default/original/3X/f/a/fa08552ff47b7347fe769ea71e251784fe46e9c4.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_065",
      url: "/uploads/default/original/3X/8/d/8ddf6f88c399106b30f08bc6ae594dba19e8da36.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_066",
      url: "/uploads/default/original/3X/d/c/dccf34dbec6856992ab133e61a1f35417caf5f94.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_067",
      url: "/uploads/default/original/3X/1/6/16cd502b6c1d42d6d929788d47a96e50313b361f.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_068",
      url: "/uploads/default/original/3X/a/7/a79256841becf6fc218cf13ed7c9708d2846f472.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_069",
      url: "/uploads/default/original/3X/1/b/1b279f1106ef55973ae2df3a41edda04181163f6.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_070",
      url: "/uploads/default/original/3X/1/e/1e8646c269ac7a1cea631b1a2fe107a4b0137dd4.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_071",
      url: "/uploads/default/original/3X/4/f/4fcf98aa20e5148d8f0dd1e117d99ad52fe7787a.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_072",
      url: "/uploads/default/original/3X/f/b/fbdca3a08e2eb36d408a9f723251132a6e1a4a1d.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_073",
      url: "/uploads/default/original/3X/e/f/efcf23577412c17df6354df84eae836ad324d3fc.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_074",
      url: "/uploads/default/original/3X/4/0/40f2d01d50e90a29680636aa5b5b6808fe4e496b.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_075",
      url: "/uploads/default/original/3X/b/2/b29012e6751baac99a0b364978e2ba6c68696bb0.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_076",
      url: "/uploads/default/original/3X/8/e/8eb5b83342386cac1dcf7ee4de785540eb85b941.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_077",
      url: "/uploads/default/original/3X/0/d/0d84801a6c000b4724a4f998ae2cebbb75088672.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_078",
      url: "/uploads/default/original/3X/e/8/e8342efcc78faa5225bc94fdc50d595b35de226a.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_079",
      url: "/uploads/default/original/3X/0/3/03493b5fee0ad65939b223bcb99256c2ad3f92cf.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_080",
      url: "/uploads/default/original/3X/6/0/6010085f85bbd33ec476d908a3adedf43bf806d2.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_081",
      url: "/uploads/default/original/3X/4/7/472396c3c1fdc62031460f52fa57e70656559956.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_082",
      url: "/uploads/default/original/3X/e/8/e8ed47702a901d932ce0f2c926006c569777acae.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_083",
      url: "/uploads/default/original/3X/8/3/839487b3bbfe38ea8a6d69115c2b18e336c776aa.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_084",
      url: "/uploads/default/original/3X/d/a/da2b0f67a66746f0702044254460f5f210159dfe.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_085",
      url: "/uploads/default/original/3X/4/b/4bfbebdb5da3afb04e73813042a2645dea7895a3.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_086",
      url: "/uploads/default/original/3X/4/0/4035794fd9995594b024ca6695de918567c5b192.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_087",
      url: "/uploads/default/original/3X/2/e/2e09f3a3c7b27eacbabe9e9614b06b88d5b06343.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_088",
      url: "/uploads/default/original/3X/8/8/8842b4bbda39465fefb2a5cee47c8b203463e327.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_089",
      url: "/uploads/default/original/3X/c/2/c20aca50f9432ad01fdaf454e2013083be11909c.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_090",
      url: "/uploads/default/original/3X/0/e/0eb0e2df1d8287c00069e1bb906f65a7e6f8ac1f.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_091",
      url: "/uploads/default/original/3X/f/c/fcb760df48754f55cd9030370300880cddc30aeb.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_092",
      url: "/uploads/default/original/3X/6/d/6d1bcb4bdba18ec87caac87e5c944d81244c0925.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_093",
      url: "/uploads/default/original/3X/1/7/17e9f52f1b3f19e5fcf1e30b0bef7154b9cb25e9.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_094",
      url: "/uploads/default/original/3X/d/8/d84a7737da89e36a682519cc53dc36869dc8324a.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_095",
      url: "/uploads/default/original/3X/d/6/d687f7716a72d08b5ab44bf515b4b47ddf973a16.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_096",
      url: "/uploads/default/original/3X/9/1/91c4bdc5b31022de2047b0e326f85aac696a61d8.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_097",
      url: "/uploads/default/original/3X/9/9/992ffdfd94f164debe2ff1ffd686eb9b6d886c30.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_098",
      url: "/uploads/default/original/3X/a/b/ab4d09d173fe9d726a7df370527e3bb11b86ac37.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_099",
      url: "/uploads/default/original/3X/9/e/9e07307cddc9a8e1b17374d688dcd9cac0009b36.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_100",
      url: "/uploads/default/original/3X/0/8/083d87100f8608832766302d52e90c66bfa7b55e.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_101",
      url: "/uploads/default/original/3X/d/d/ddf9dab71979b328b8cc99a110961278b31af15f.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_102",
      url: "/uploads/default/original/3X/c/1/c1e30e625a80f2c4e38d15051adc0fbff0cdac85.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_103",
      url: "/uploads/default/original/3X/4/9/4932179ffb43027d3482ff0a8e79ad3c9f124675.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_104",
      url: "/uploads/default/original/3X/e/e/ee4698ca2806e680bf8710a138964433caeec7db.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_105",
      url: "/uploads/default/original/3X/0/4/04b9b300e3259e61fe2e9b6e1a291112fece7aa5.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_106",
      url: "/uploads/default/original/3X/4/5/45cf9833729d3f67e4b71327c07bda302ac3f792.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_107",
      url: "/uploads/default/original/3X/6/c/6c0346f696e90c6f804ade9f9d578c8c79c99aac.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_108",
      url: "/uploads/default/original/3X/a/1/a1ec5ef51c85ebabebe5102b00a1a4caeb08be63.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_109",
      url: "/uploads/default/original/3X/b/7/b75001317cf515737019777e8a6ed35b5b46ca6c.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_110",
      url: "/uploads/default/original/3X/0/1/0194cea00dae49fd82321825b52d96e1f8f47732.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_111",
      url: "/uploads/default/original/3X/b/5/b52e429fb2a84f8e72169c358f00b20e271d9f83.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_112",
      url: "/uploads/default/original/3X/c/9/c9aa6ca75dbffd21308721ce156da371e82b47f9.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_113",
      url: "/uploads/default/original/3X/1/c/1cadebeaf0cd36af11665ffa5802ba1c5b143be9.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_114",
      url: "/uploads/default/original/3X/d/d/dd93786f2a24352b65e23f81d2c24c1a41439cf0.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_115",
      url: "/uploads/default/original/3X/1/e/1e79d50d73b1afaeffe39574e92154d5d2878787.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_116",
      url: "/uploads/default/original/3X/d/a/daf75362acc5e46c813a77d8bd143e4e20dd89e5.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_117",
      url: "/uploads/default/original/3X/f/c/fcca64230d5d15b933b3b9db491f9d3516909b62.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_118",
      url: "/uploads/default/original/3X/1/8/189ed0fa3c3c01fdf1a99e836f1fa921f679b286.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_119",
      url: "/uploads/default/original/3X/1/2/1267794a9888419b4d72a2e92162dcb10c08d740.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_120",
      url: "/uploads/default/original/3X/2/b/2b20054bfb140ededbc4a5b94d529960ab49522a.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_121",
      url: "/uploads/default/original/3X/5/4/54c6102be172ff5b326edcff59e4ed6485495218.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_122",
      url: "/uploads/default/original/3X/f/b/fb9a3fe91bb52c30496dd41c739bd829511498fe.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_123",
      url: "/uploads/default/original/3X/0/6/069a4f21d927aac0db15bb2304ca29f5bdd0f733.png?v=12"
    },
    {
      size: "30x30",
      name: "tieba_124",
      url: "/uploads/default/original/3X/3/7/372798490ea3b5ca4dac38233413355c6c8175ce.png?v=12"
    }
  ];
  setInterval(() => {
    var editor = document.querySelector(".d-editor-button-bar");
    if (!document.querySelector(".emoji-picker-button") && editor) {
      var emojiButton = document.createElement("button");
      emojiButton.classList.add(
        "btn",
        "no-text",
        "btn-icon",
        "emoji",
        "emoji-picker-button"
      );
      emojiButton.title = "插入贴吧表情包";
      emojiButton.innerHTML = "<svg class='fa d-icon d-icon-far-face-smile svg-icon svg-string' xmlns='http://www.w3.org/2000/svg'><use href='#far-face-smile'></use></svg>";
      editor.appendChild(emojiButton);
      emojiButton.addEventListener("click", function() {
        var emojiPicker = document.createElement("div");
        emojiPicker.className = "emojiPicker";
        var emojiSetHtml = emojiSet.map(
          (emo) => `<img src="${emo.url}" name="${emo.name}" url="${emo.url}" alt="${emo.size}" onclick="insertEmoji(event)"/>`
        ).join("");
        emojiPicker.innerHTML = emojiSetHtml;
        emojiPicker.style.position = "absolute";
        emojiPicker.style.background = "#FFF";
        emojiPicker.style.border = "1px solid #ddd";
        emojiPicker.style.padding = "10px";
        if (document.body.contains(document.querySelector(".emojiPicker"))) {
          document.querySelector(".emojiPicker").remove();
        } else {
          emojiButton.after(emojiPicker);
        }
        emojiPicker.addEventListener("click", function(e) {
          if (e.target.tagName === "IMG") {
            var textArea = document.querySelector(".d-editor-input");
            if (!textArea) {
              alert("找不到输入框");
              return;
            }
            var emojiMarkdown = `![${e.target.name}|${e.target.alt}](${e.target.src})`;
            var startPos = textArea.selectionStart;
            var endPos = textArea.selectionEnd;
            textArea.value = textArea.value.substring(0, startPos) + emojiMarkdown + textArea.value.substring(endPos, textArea.value.length);
            var event = new Event("input", {
              bubbles: true,
              cancelable: true
            });
            textArea.dispatchEvent(event);
            emojiPicker.remove();
          }
        });
      });
    }
  }, 100);
  const _sfc_main$P = {};
  function _sfc_render$P(_ctx, _cache, $props, $setup, $data, $options) {
    return null;
  }
  const ReplyTBEnjoy = /* @__PURE__ */ _export_sfc(_sfc_main$P, [["render", _sfc_render$P], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/BasicSettings/ReplyTBEnjoy.vue"]]);
  var pangu$1 = { exports: {} };
  /*!
   * pangu.js
   * --------
   * @version: 4.0.7
   * @homepage: https://github.com/vinta/pangu.js
   * @license: MIT
   * @author: Vinta Chen <vinta.chen@gmail.com> (https://github.com/vinta)
   */
  var hasRequiredPangu;
  function requirePangu() {
    if (hasRequiredPangu) return pangu$1.exports;
    hasRequiredPangu = 1;
    (function(module, exports) {
      (function webpackUniversalModuleDefinition(root, factory) {
        module.exports = factory();
      })(window, function() {
        return (
          /******/
          function(modules) {
            var installedModules = {};
            function __webpack_require__(moduleId) {
              if (installedModules[moduleId]) {
                return installedModules[moduleId].exports;
              }
              var module2 = installedModules[moduleId] = {
                /******/
                i: moduleId,
                /******/
                l: false,
                /******/
                exports: {}
                /******/
              };
              modules[moduleId].call(module2.exports, module2, module2.exports, __webpack_require__);
              module2.l = true;
              return module2.exports;
            }
            __webpack_require__.m = modules;
            __webpack_require__.c = installedModules;
            __webpack_require__.d = function(exports2, name2, getter) {
              if (!__webpack_require__.o(exports2, name2)) {
                Object.defineProperty(exports2, name2, { enumerable: true, get: getter });
              }
            };
            __webpack_require__.r = function(exports2) {
              if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
                Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
              }
              Object.defineProperty(exports2, "__esModule", { value: true });
            };
            __webpack_require__.t = function(value, mode) {
              if (mode & 1) value = __webpack_require__(value);
              if (mode & 8) return value;
              if (mode & 4 && typeof value === "object" && value && value.__esModule) return value;
              var ns = /* @__PURE__ */ Object.create(null);
              __webpack_require__.r(ns);
              Object.defineProperty(ns, "default", { enumerable: true, value });
              if (mode & 2 && typeof value != "string") for (var key in value) __webpack_require__.d(ns, key, (function(key2) {
                return value[key2];
              }).bind(null, key));
              return ns;
            };
            __webpack_require__.n = function(module2) {
              var getter = module2 && module2.__esModule ? (
                /******/
                function getDefault() {
                  return module2["default"];
                }
              ) : (
                /******/
                function getModuleExports() {
                  return module2;
                }
              );
              __webpack_require__.d(getter, "a", getter);
              return getter;
            };
            __webpack_require__.o = function(object, property) {
              return Object.prototype.hasOwnProperty.call(object, property);
            };
            __webpack_require__.p = "";
            return __webpack_require__(__webpack_require__.s = 0);
          }([
            /* 0 */
            /***/
            function(module2, exports2, __webpack_require__) {
              var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
              (function(global2, factory) {
                {
                  !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = factory, __WEBPACK_AMD_DEFINE_RESULT__ = typeof __WEBPACK_AMD_DEFINE_FACTORY__ === "function" ? __WEBPACK_AMD_DEFINE_FACTORY__.apply(exports2, __WEBPACK_AMD_DEFINE_ARRAY__) : __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__ !== void 0 && (module2.exports = __WEBPACK_AMD_DEFINE_RESULT__));
                }
              })(this, function() {
                function _typeof(obj) {
                  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                    _typeof = function _typeof2(obj2) {
                      return typeof obj2;
                    };
                  } else {
                    _typeof = function _typeof2(obj2) {
                      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
                    };
                  }
                  return _typeof(obj);
                }
                function _classCallCheck(instance, Constructor) {
                  if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                  }
                }
                function _defineProperties(target, props) {
                  for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                  }
                }
                function _createClass(Constructor, protoProps, staticProps) {
                  _defineProperties(Constructor.prototype, protoProps);
                  return Constructor;
                }
                function _possibleConstructorReturn(self2, call) {
                  if (call && (_typeof(call) === "object" || typeof call === "function")) {
                    return call;
                  }
                  return _assertThisInitialized(self2);
                }
                function _assertThisInitialized(self2) {
                  if (self2 === void 0) {
                    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                  }
                  return self2;
                }
                function _getPrototypeOf(o) {
                  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
                    return o2.__proto__ || Object.getPrototypeOf(o2);
                  };
                  return _getPrototypeOf(o);
                }
                function _inherits(subClass, superClass) {
                  if (typeof superClass !== "function" && superClass !== null) {
                    throw new TypeError("Super expression must either be null or a function");
                  }
                  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
                  if (superClass) _setPrototypeOf(subClass, superClass);
                }
                function _setPrototypeOf(o, p2) {
                  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o2, p3) {
                    o2.__proto__ = p3;
                    return o2;
                  };
                  return _setPrototypeOf(o, p2);
                }
                var _require = __webpack_require__(1), Pangu = _require.Pangu;
                function once(func) {
                  var _this = this, _arguments = arguments;
                  var executed = false;
                  return function() {
                    if (executed) {
                      return;
                    }
                    var self2 = _this;
                    executed = true;
                    func.apply(self2, _arguments);
                  };
                }
                function debounce(func, delay, mustRunDelay) {
                  var _this2 = this, _arguments2 = arguments;
                  var timer = null;
                  var startTime = null;
                  return function() {
                    var self2 = _this2;
                    var args = _arguments2;
                    var currentTime = +/* @__PURE__ */ new Date();
                    clearTimeout(timer);
                    if (!startTime) {
                      startTime = currentTime;
                    }
                    if (currentTime - startTime >= mustRunDelay) {
                      func.apply(self2, args);
                      startTime = currentTime;
                    } else {
                      timer = setTimeout(function() {
                        func.apply(self2, args);
                      }, delay);
                    }
                  };
                }
                var BrowserPangu = function(_Pangu) {
                  _inherits(BrowserPangu2, _Pangu);
                  function BrowserPangu2() {
                    var _this3;
                    _classCallCheck(this, BrowserPangu2);
                    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(BrowserPangu2).call(this));
                    _this3.blockTags = /^(div|p|h1|h2|h3|h4|h5|h6)$/i;
                    _this3.ignoredTags = /^(script|code|pre|textarea)$/i;
                    _this3.presentationalTags = /^(b|code|del|em|i|s|strong)$/i;
                    _this3.spaceLikeTags = /^(br|hr|i|img|pangu)$/i;
                    _this3.spaceSensitiveTags = /^(a|del|pre|s|strike|u)$/i;
                    _this3.isAutoSpacingPageExecuted = false;
                    return _this3;
                  }
                  _createClass(BrowserPangu2, [{
                    key: "isContentEditable",
                    value: function isContentEditable(node) {
                      return node.isContentEditable || node.getAttribute && node.getAttribute("g_editable") === "true";
                    }
                  }, {
                    key: "isSpecificTag",
                    value: function isSpecificTag(node, tagRegex) {
                      return node && node.nodeName && node.nodeName.search(tagRegex) >= 0;
                    }
                  }, {
                    key: "isInsideSpecificTag",
                    value: function isInsideSpecificTag(node, tagRegex) {
                      var checkCurrent = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
                      var currentNode = node;
                      if (checkCurrent) {
                        if (this.isSpecificTag(currentNode, tagRegex)) {
                          return true;
                        }
                      }
                      while (currentNode.parentNode) {
                        currentNode = currentNode.parentNode;
                        if (this.isSpecificTag(currentNode, tagRegex)) {
                          return true;
                        }
                      }
                      return false;
                    }
                  }, {
                    key: "canIgnoreNode",
                    value: function canIgnoreNode(node) {
                      var currentNode = node;
                      if (currentNode && (this.isSpecificTag(currentNode, this.ignoredTags) || this.isContentEditable(currentNode))) {
                        return true;
                      }
                      while (currentNode.parentNode) {
                        currentNode = currentNode.parentNode;
                        if (currentNode && (this.isSpecificTag(currentNode, this.ignoredTags) || this.isContentEditable(currentNode))) {
                          return true;
                        }
                      }
                      return false;
                    }
                  }, {
                    key: "isFirstTextChild",
                    value: function isFirstTextChild(parentNode, targetNode) {
                      var childNodes = parentNode.childNodes;
                      for (var i = 0; i < childNodes.length; i++) {
                        var childNode = childNodes[i];
                        if (childNode.nodeType !== Node.COMMENT_NODE && childNode.textContent) {
                          return childNode === targetNode;
                        }
                      }
                      return false;
                    }
                  }, {
                    key: "isLastTextChild",
                    value: function isLastTextChild(parentNode, targetNode) {
                      var childNodes = parentNode.childNodes;
                      for (var i = childNodes.length - 1; i > -1; i--) {
                        var childNode = childNodes[i];
                        if (childNode.nodeType !== Node.COMMENT_NODE && childNode.textContent) {
                          return childNode === targetNode;
                        }
                      }
                      return false;
                    }
                  }, {
                    key: "spacingNodeByXPath",
                    value: function spacingNodeByXPath(xPathQuery, contextNode) {
                      if (!(contextNode instanceof Node) || contextNode instanceof DocumentFragment) {
                        return;
                      }
                      var textNodes = document.evaluate(xPathQuery, contextNode, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                      var currentTextNode;
                      var nextTextNode;
                      for (var i = textNodes.snapshotLength - 1; i > -1; --i) {
                        currentTextNode = textNodes.snapshotItem(i);
                        if (this.isSpecificTag(currentTextNode.parentNode, this.presentationalTags) && !this.isInsideSpecificTag(currentTextNode.parentNode, this.ignoredTags)) {
                          var elementNode = currentTextNode.parentNode;
                          if (elementNode.previousSibling) {
                            var previousSibling = elementNode.previousSibling;
                            if (previousSibling.nodeType === Node.TEXT_NODE) {
                              var testText = previousSibling.data.substr(-1) + currentTextNode.data.toString().charAt(0);
                              var testNewText = this.spacing(testText);
                              if (testText !== testNewText) {
                                previousSibling.data = "".concat(previousSibling.data, " ");
                              }
                            }
                          }
                          if (elementNode.nextSibling) {
                            var nextSibling = elementNode.nextSibling;
                            if (nextSibling.nodeType === Node.TEXT_NODE) {
                              var _testText = currentTextNode.data.substr(-1) + nextSibling.data.toString().charAt(0);
                              var _testNewText = this.spacing(_testText);
                              if (_testText !== _testNewText) {
                                nextSibling.data = " ".concat(nextSibling.data);
                              }
                            }
                          }
                        }
                        if (this.canIgnoreNode(currentTextNode)) {
                          nextTextNode = currentTextNode;
                          continue;
                        }
                        var newText = this.spacing(currentTextNode.data);
                        if (currentTextNode.data !== newText) {
                          currentTextNode.data = newText;
                        }
                        if (nextTextNode) {
                          if (currentTextNode.nextSibling && currentTextNode.nextSibling.nodeName.search(this.spaceLikeTags) >= 0) {
                            nextTextNode = currentTextNode;
                            continue;
                          }
                          var _testText2 = currentTextNode.data.toString().substr(-1) + nextTextNode.data.toString().substr(0, 1);
                          var _testNewText2 = this.spacing(_testText2);
                          if (_testNewText2 !== _testText2) {
                            var nextNode = nextTextNode;
                            while (nextNode.parentNode && nextNode.nodeName.search(this.spaceSensitiveTags) === -1 && this.isFirstTextChild(nextNode.parentNode, nextNode)) {
                              nextNode = nextNode.parentNode;
                            }
                            var currentNode = currentTextNode;
                            while (currentNode.parentNode && currentNode.nodeName.search(this.spaceSensitiveTags) === -1 && this.isLastTextChild(currentNode.parentNode, currentNode)) {
                              currentNode = currentNode.parentNode;
                            }
                            if (currentNode.nextSibling) {
                              if (currentNode.nextSibling.nodeName.search(this.spaceLikeTags) >= 0) {
                                nextTextNode = currentTextNode;
                                continue;
                              }
                            }
                            if (currentNode.nodeName.search(this.blockTags) === -1) {
                              if (nextNode.nodeName.search(this.spaceSensitiveTags) === -1) {
                                if (nextNode.nodeName.search(this.ignoredTags) === -1 && nextNode.nodeName.search(this.blockTags) === -1) {
                                  if (nextTextNode.previousSibling) {
                                    if (nextTextNode.previousSibling.nodeName.search(this.spaceLikeTags) === -1) {
                                      nextTextNode.data = " ".concat(nextTextNode.data);
                                    }
                                  } else {
                                    if (!this.canIgnoreNode(nextTextNode)) {
                                      nextTextNode.data = " ".concat(nextTextNode.data);
                                    }
                                  }
                                }
                              } else if (currentNode.nodeName.search(this.spaceSensitiveTags) === -1) {
                                currentTextNode.data = "".concat(currentTextNode.data, " ");
                              } else {
                                var panguSpace = document.createElement("pangu");
                                panguSpace.innerHTML = " ";
                                if (nextNode.previousSibling) {
                                  if (nextNode.previousSibling.nodeName.search(this.spaceLikeTags) === -1) {
                                    nextNode.parentNode.insertBefore(panguSpace, nextNode);
                                  }
                                } else {
                                  nextNode.parentNode.insertBefore(panguSpace, nextNode);
                                }
                                if (!panguSpace.previousElementSibling) {
                                  if (panguSpace.parentNode) {
                                    panguSpace.parentNode.removeChild(panguSpace);
                                  }
                                }
                              }
                            }
                          }
                        }
                        nextTextNode = currentTextNode;
                      }
                    }
                  }, {
                    key: "spacingNode",
                    value: function spacingNode(contextNode) {
                      var xPathQuery = ".//*/text()[normalize-space(.)]";
                      if (contextNode.children && contextNode.children.length === 0) {
                        xPathQuery = ".//text()[normalize-space(.)]";
                      }
                      this.spacingNodeByXPath(xPathQuery, contextNode);
                    }
                  }, {
                    key: "spacingElementById",
                    value: function spacingElementById(idName) {
                      var xPathQuery = 'id("'.concat(idName, '")//text()');
                      this.spacingNodeByXPath(xPathQuery, document);
                    }
                  }, {
                    key: "spacingElementByClassName",
                    value: function spacingElementByClassName(className) {
                      var xPathQuery = '//*[contains(concat(" ", normalize-space(@class), " "), "'.concat(className, '")]//text()');
                      this.spacingNodeByXPath(xPathQuery, document);
                    }
                  }, {
                    key: "spacingElementByTagName",
                    value: function spacingElementByTagName(tagName) {
                      var xPathQuery = "//".concat(tagName, "//text()");
                      this.spacingNodeByXPath(xPathQuery, document);
                    }
                  }, {
                    key: "spacingPageTitle",
                    value: function spacingPageTitle() {
                      var xPathQuery = "/html/head/title/text()";
                      this.spacingNodeByXPath(xPathQuery, document);
                    }
                  }, {
                    key: "spacingPageBody",
                    value: function spacingPageBody() {
                      var xPathQuery = "/html/body//*/text()[normalize-space(.)]";
                      ["script", "style", "textarea"].forEach(function(tag2) {
                        xPathQuery = "".concat(xPathQuery, '[translate(name(..),"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz")!="').concat(tag2, '"]');
                      });
                      this.spacingNodeByXPath(xPathQuery, document);
                    }
                  }, {
                    key: "spacingPage",
                    value: function spacingPage() {
                      this.spacingPageTitle();
                      this.spacingPageBody();
                    }
                  }, {
                    key: "autoSpacingPage",
                    value: function autoSpacingPage() {
                      var pageDelay = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1e3;
                      var nodeDelay = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 500;
                      var nodeMaxWait = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 2e3;
                      if (!(document.body instanceof Node)) {
                        return;
                      }
                      if (this.isAutoSpacingPageExecuted) {
                        return;
                      }
                      this.isAutoSpacingPageExecuted = true;
                      var self2 = this;
                      var onceSpacingPage = once(function() {
                        self2.spacingPage();
                      });
                      var videos = document.getElementsByTagName("video");
                      if (videos.length === 0) {
                        setTimeout(function() {
                          onceSpacingPage();
                        }, pageDelay);
                      } else {
                        for (var i = 0; i < videos.length; i++) {
                          var video = videos[i];
                          if (video.readyState === 4) {
                            setTimeout(function() {
                              onceSpacingPage();
                            }, 3e3);
                            break;
                          }
                          video.addEventListener("loadeddata", function() {
                            setTimeout(function() {
                              onceSpacingPage();
                            }, 4e3);
                          });
                        }
                      }
                      var queue2 = [];
                      var debouncedSpacingNodes = debounce(function() {
                        while (queue2.length) {
                          var node = queue2.shift();
                          if (node) {
                            self2.spacingNode(node);
                          }
                        }
                      }, nodeDelay, {
                        "maxWait": nodeMaxWait
                      });
                      var mutationObserver = new MutationObserver(function(mutations, observer) {
                        mutations.forEach(function(mutation) {
                          switch (mutation.type) {
                            case "childList":
                              mutation.addedNodes.forEach(function(node2) {
                                if (node2.nodeType === Node.ELEMENT_NODE) {
                                  queue2.push(node2);
                                } else if (node2.nodeType === Node.TEXT_NODE) {
                                  queue2.push(node2.parentNode);
                                }
                              });
                              break;
                            case "characterData":
                              var node = mutation.target;
                              if (node.nodeType === Node.TEXT_NODE) {
                                queue2.push(node.parentNode);
                              }
                              break;
                          }
                        });
                        debouncedSpacingNodes();
                      });
                      mutationObserver.observe(document.body, {
                        characterData: true,
                        childList: true,
                        subtree: true
                      });
                    }
                  }]);
                  return BrowserPangu2;
                }(Pangu);
                var pangu2 = new BrowserPangu();
                module2.exports = pangu2;
                module2.exports.default = pangu2;
                module2.exports.Pangu = BrowserPangu;
              });
            },
            /* 1 */
            /***/
            function(module2, exports2, __webpack_require__) {
              var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
              (function(global2, factory) {
                {
                  !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = factory, __WEBPACK_AMD_DEFINE_RESULT__ = typeof __WEBPACK_AMD_DEFINE_FACTORY__ === "function" ? __WEBPACK_AMD_DEFINE_FACTORY__.apply(exports2, __WEBPACK_AMD_DEFINE_ARRAY__) : __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__ !== void 0 && (module2.exports = __WEBPACK_AMD_DEFINE_RESULT__));
                }
              })(this, function() {
                function _typeof(obj) {
                  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                    _typeof = function _typeof2(obj2) {
                      return typeof obj2;
                    };
                  } else {
                    _typeof = function _typeof2(obj2) {
                      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
                    };
                  }
                  return _typeof(obj);
                }
                function _classCallCheck(instance, Constructor) {
                  if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                  }
                }
                function _defineProperties(target, props) {
                  for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                  }
                }
                function _createClass(Constructor, protoProps, staticProps) {
                  _defineProperties(Constructor.prototype, protoProps);
                  return Constructor;
                }
                var CJK = "⺀-⻿⼀-⿟぀-ゟ゠-ヺー-ヿ㄀-ㄯ㈀-㋿㐀-䶿一-鿿豈-﫿";
                var ANY_CJK = new RegExp("[".concat(CJK, "]"));
                var CONVERT_TO_FULLWIDTH_CJK_SYMBOLS_CJK = new RegExp("([".concat(CJK, "])[ ]*([\\:]+|\\.)[ ]*([").concat(CJK, "])"), "g");
                var CONVERT_TO_FULLWIDTH_CJK_SYMBOLS = new RegExp("([".concat(CJK, "])[ ]*([~\\!;,\\?]+)[ ]*"), "g");
                var DOTS_CJK = new RegExp("([\\.]{2,}|…)([".concat(CJK, "])"), "g");
                var FIX_CJK_COLON_ANS = new RegExp("([".concat(CJK, "])\\:([A-Z0-9\\(\\)])"), "g");
                var CJK_QUOTE = new RegExp("([".concat(CJK, '])([`"״])'), "g");
                var QUOTE_CJK = new RegExp('([`"״])(['.concat(CJK, "])"), "g");
                var FIX_QUOTE_ANY_QUOTE = /([`"\u05f4]+)[ ]*(.+?)[ ]*([`"\u05f4]+)/g;
                var CJK_SINGLE_QUOTE_BUT_POSSESSIVE = new RegExp("([".concat(CJK, "])('[^s])"), "g");
                var SINGLE_QUOTE_CJK = new RegExp("(')([".concat(CJK, "])"), "g");
                var FIX_POSSESSIVE_SINGLE_QUOTE = new RegExp("([A-Za-z0-9".concat(CJK, "])( )('s)"), "g");
                var HASH_ANS_CJK_HASH = new RegExp("([".concat(CJK, "])(#)([").concat(CJK, "]+)(#)([").concat(CJK, "])"), "g");
                var CJK_HASH = new RegExp("([".concat(CJK, "])(#([^ ]))"), "g");
                var HASH_CJK = new RegExp("(([^ ])#)([".concat(CJK, "])"), "g");
                var CJK_OPERATOR_ANS = new RegExp("([".concat(CJK, "])([\\+\\-\\*\\/=&\\|<>])([A-Za-z0-9])"), "g");
                var ANS_OPERATOR_CJK = new RegExp("([A-Za-z0-9])([\\+\\-\\*\\/=&\\|<>])([".concat(CJK, "])"), "g");
                var FIX_SLASH_AS = /([/]) ([a-z\-_\./]+)/g;
                var FIX_SLASH_AS_SLASH = /([/\.])([A-Za-z\-_\./]+) ([/])/g;
                var CJK_LEFT_BRACKET = new RegExp("([".concat(CJK, "])([\\(\\[\\{<>“])"), "g");
                var RIGHT_BRACKET_CJK = new RegExp("([\\)\\]\\}<>”])([".concat(CJK, "])"), "g");
                var FIX_LEFT_BRACKET_ANY_RIGHT_BRACKET = /([\(\[\{<\u201c]+)[ ]*(.+?)[ ]*([\)\]\}>\u201d]+)/;
                var ANS_CJK_LEFT_BRACKET_ANY_RIGHT_BRACKET = new RegExp("([A-Za-z0-9".concat(CJK, "])[ ]*([“])([A-Za-z0-9").concat(CJK, "\\-_ ]+)([”])"), "g");
                var LEFT_BRACKET_ANY_RIGHT_BRACKET_ANS_CJK = new RegExp("([“])([A-Za-z0-9".concat(CJK, "\\-_ ]+)([”])[ ]*([A-Za-z0-9").concat(CJK, "])"), "g");
                var AN_LEFT_BRACKET = /([A-Za-z0-9])([\(\[\{])/g;
                var RIGHT_BRACKET_AN = /([\)\]\}])([A-Za-z0-9])/g;
                var CJK_ANS = new RegExp("([".concat(CJK, "])([A-Za-zͰ-Ͽ0-9@\\$%\\^&\\*\\-\\+\\\\=\\|/¡-ÿ⅐-↏✀—➿])"), "g");
                var ANS_CJK = new RegExp("([A-Za-zͰ-Ͽ0-9~\\$%\\^&\\*\\-\\+\\\\=\\|/!;:,\\.\\?¡-ÿ⅐-↏✀—➿])([".concat(CJK, "])"), "g");
                var S_A = /(%)([A-Za-z])/g;
                var MIDDLE_DOT = /([ ]*)([\u00b7\u2022\u2027])([ ]*)/g;
                var Pangu = function() {
                  function Pangu2() {
                    _classCallCheck(this, Pangu2);
                    this.version = "4.0.7";
                  }
                  _createClass(Pangu2, [{
                    key: "convertToFullwidth",
                    value: function convertToFullwidth(symbols) {
                      return symbols.replace(/~/g, "～").replace(/!/g, "！").replace(/;/g, "；").replace(/:/g, "：").replace(/,/g, "，").replace(/\./g, "。").replace(/\?/g, "？");
                    }
                  }, {
                    key: "spacing",
                    value: function spacing(text) {
                      if (typeof text !== "string") {
                        console.warn("spacing(text) only accepts string but got ".concat(_typeof(text)));
                        return text;
                      }
                      if (text.length <= 1 || !ANY_CJK.test(text)) {
                        return text;
                      }
                      var self2 = this;
                      var newText = text;
                      newText = newText.replace(CONVERT_TO_FULLWIDTH_CJK_SYMBOLS_CJK, function(match, leftCjk, symbols, rightCjk) {
                        var fullwidthSymbols = self2.convertToFullwidth(symbols);
                        return "".concat(leftCjk).concat(fullwidthSymbols).concat(rightCjk);
                      });
                      newText = newText.replace(CONVERT_TO_FULLWIDTH_CJK_SYMBOLS, function(match, cjk, symbols) {
                        var fullwidthSymbols = self2.convertToFullwidth(symbols);
                        return "".concat(cjk).concat(fullwidthSymbols);
                      });
                      newText = newText.replace(DOTS_CJK, "$1 $2");
                      newText = newText.replace(FIX_CJK_COLON_ANS, "$1：$2");
                      newText = newText.replace(CJK_QUOTE, "$1 $2");
                      newText = newText.replace(QUOTE_CJK, "$1 $2");
                      newText = newText.replace(FIX_QUOTE_ANY_QUOTE, "$1$2$3");
                      newText = newText.replace(CJK_SINGLE_QUOTE_BUT_POSSESSIVE, "$1 $2");
                      newText = newText.replace(SINGLE_QUOTE_CJK, "$1 $2");
                      newText = newText.replace(FIX_POSSESSIVE_SINGLE_QUOTE, "$1's");
                      newText = newText.replace(HASH_ANS_CJK_HASH, "$1 $2$3$4 $5");
                      newText = newText.replace(CJK_HASH, "$1 $2");
                      newText = newText.replace(HASH_CJK, "$1 $3");
                      newText = newText.replace(CJK_OPERATOR_ANS, "$1 $2 $3");
                      newText = newText.replace(ANS_OPERATOR_CJK, "$1 $2 $3");
                      newText = newText.replace(FIX_SLASH_AS, "$1$2");
                      newText = newText.replace(FIX_SLASH_AS_SLASH, "$1$2$3");
                      newText = newText.replace(CJK_LEFT_BRACKET, "$1 $2");
                      newText = newText.replace(RIGHT_BRACKET_CJK, "$1 $2");
                      newText = newText.replace(FIX_LEFT_BRACKET_ANY_RIGHT_BRACKET, "$1$2$3");
                      newText = newText.replace(ANS_CJK_LEFT_BRACKET_ANY_RIGHT_BRACKET, "$1 $2$3$4");
                      newText = newText.replace(LEFT_BRACKET_ANY_RIGHT_BRACKET_ANS_CJK, "$1$2$3 $4");
                      newText = newText.replace(AN_LEFT_BRACKET, "$1 $2");
                      newText = newText.replace(RIGHT_BRACKET_AN, "$1 $2");
                      newText = newText.replace(CJK_ANS, "$1 $2");
                      newText = newText.replace(ANS_CJK, "$1 $2");
                      newText = newText.replace(S_A, "$1 $2");
                      newText = newText.replace(MIDDLE_DOT, "・");
                      return newText;
                    }
                  }, {
                    key: "spacingText",
                    value: function spacingText(text) {
                      var callback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : function() {
                      };
                      var newText;
                      try {
                        newText = this.spacing(text);
                      } catch (err) {
                        callback(err);
                        return;
                      }
                      callback(null, newText);
                    }
                  }, {
                    key: "spacingTextSync",
                    value: function spacingTextSync(text) {
                      return this.spacing(text);
                    }
                  }]);
                  return Pangu2;
                }();
                var pangu2 = new Pangu();
                module2.exports = pangu2;
                module2.exports.default = pangu2;
                module2.exports.Pangu = Pangu;
              });
            }
            /******/
          ])
        );
      });
    })(pangu$1);
    return pangu$1.exports;
  }
  var panguExports = requirePangu();
  const pangu = /* @__PURE__ */ getDefaultExportFromCjs(panguExports);
  const _sfc_main$O = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    created() {
      if (this.modelValue) {
        setInterval(() => {
          pangu.spacingElementByClassName("cooked");
          pangu.spacingElementByTagName("h1");
          document.addEventListener("DOMContentLoaded", () => {
            pangu.autoSpacingPage();
          });
          if ($(".pangutext").length < 1) {
            $(".save-or-cancel .cancel").before(`<span class="pangutext">混排优化</span>`);
            $(".pangutext").click(function() {
              const $textarea = $(".d-editor-input");
              let text = pangu.spacing($textarea.val());
              $textarea.focus();
              $textarea.val("");
              for (let i = 0; i < text.length; i++) {
                let char = text[i];
                $textarea.val($textarea.val() + char);
                let inputEvent = new Event("input", {
                  bubbles: true,
                  cancelable: true
                });
                $textarea[0].dispatchEvent(inputEvent);
                let keyEvent = new KeyboardEvent("keydown", {
                  key: char,
                  char,
                  keyCode: char.charCodeAt(0),
                  which: char.charCodeAt(0),
                  bubbles: true
                });
                $textarea[0].dispatchEvent(keyEvent);
              }
            });
          }
        }, 1e3);
      }
    }
  };
  const _hoisted_1$K = { class: "item" };
  const _hoisted_2$z = { class: "tit" };
  const _hoisted_3$r = ["checked"];
  function _sfc_render$O(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$K, [
      createBaseVNode(
        "div",
        _hoisted_2$z,
        toDisplayString($props.sort) + ". 是否开启中英文混排优化显示",
        1
        /* TEXT */
      ),
      createBaseVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$r)
    ]);
  }
  const MenuPangu = /* @__PURE__ */ _export_sfc(_sfc_main$O, [["render", _sfc_render$O], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/BasicSettings/MenuPangu.vue"]]);
  const _sfc_main$N = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"]
  };
  const _hoisted_1$J = { class: "item" };
  const _hoisted_2$y = { class: "tit" };
  const _hoisted_3$q = ["checked"];
  function _sfc_render$N(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$J, [
      createBaseVNode(
        "div",
        _hoisted_2$y,
        toDisplayString($props.sort) + ". 是否显示等级查询按钮",
        1
        /* TEXT */
      ),
      createBaseVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$q)
    ]);
  }
  const MenuLevelSearch = /* @__PURE__ */ _export_sfc(_sfc_main$N, [["render", _sfc_render$N], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/BasicSettings/MenuLevelSearch.vue"]]);
  const _sfc_main$M = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    created() {
      if (this.modelValue) {
        $("head").append(`<style>
     .user-menu-dropdown-wrapper .notification.read{display:none!important;}
     .user-menu-dropdown-wrapper .notification.unread{display:list-item!important;}
     </style>`);
      }
    }
  };
  const _hoisted_1$I = { class: "item" };
  const _hoisted_2$x = { class: "tit" };
  const _hoisted_3$p = ["checked"];
  function _sfc_render$M(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$I, [
      createBaseVNode(
        "div",
        _hoisted_2$x,
        toDisplayString($props.sort) + ". 消息通知仅显示未读",
        1
        /* TEXT */
      ),
      createBaseVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$p)
    ]);
  }
  const MenuShowUnread = /* @__PURE__ */ _export_sfc(_sfc_main$M, [["render", _sfc_render$M], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/BasicSettings/MenuShowUnread.vue"]]);
  const _sfc_main$L = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    created() {
      if (this.modelValue) {
        $("head").append(`<style>.spoiled,.spoiled *{filter:none!important;}</style>`);
      }
    }
  };
  const _hoisted_1$H = { class: "item" };
  const _hoisted_2$w = { class: "tit" };
  const _hoisted_3$o = ["checked"];
  function _sfc_render$L(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$H, [
      createBaseVNode(
        "div",
        _hoisted_2$w,
        toDisplayString($props.sort) + ". 是否屏蔽模糊文字",
        1
        /* TEXT */
      ),
      createBaseVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$o)
    ]);
  }
  const MenuFilterText = /* @__PURE__ */ _export_sfc(_sfc_main$L, [["render", _sfc_render$L], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/BasicSettings/MenuFilterText.vue"]]);
  const _sfc_main$K = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    created() {
      if (this.modelValue) {
        $("head").append(`<style>
        .topic-post .cooked+hr,
        .topic-post .signature-img,
        .topic-post .signature-p{display:none}

        .topic-post.current-user-post .cooked+hr,
        .topic-post.current-user-post .signature-img,
        .topic-post.current-user-post .signature-p{display:block}
      </style>`);
      }
    }
  };
  const _hoisted_1$G = { class: "item" };
  const _hoisted_2$v = { class: "tit" };
  const _hoisted_3$n = ["checked"];
  function _sfc_render$K(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$G, [
      createBaseVNode(
        "div",
        _hoisted_2$v,
        toDisplayString($props.sort) + ". 只看自己签名尾巴",
        1
        /* TEXT */
      ),
      createBaseVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$n)
    ]);
  }
  const MenuLookmeSign = /* @__PURE__ */ _export_sfc(_sfc_main$K, [["render", _sfc_render$K], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/BasicSettings/MenuLookmeSign.vue"]]);
  const _sfc_main$J = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    data() {
      return {
        options: [
          { value: "twitter", label: "twitter" },
          { value: "facebook_messenger", label: "facebook_messenger" },
          { value: "google", label: "google" },
          { value: "google_classic", label: "google_classic" },
          { value: "win10", label: "win10" }
        ]
      };
    },
    computed: {
      value1: {
        get() {
          return this.modelValue.value1;
        },
        set(newValue) {
          this.$emit("update:modelValue", { ...this.modelValue, value1: newValue });
        }
      },
      value2: {
        get() {
          return this.modelValue.value2;
        },
        set(newValue) {
          this.$emit("update:modelValue", { ...this.modelValue, value2: newValue });
        }
      }
    },
    methods: {
      handleChange() {
        this.toggleEmojiStyle();
      },
      toggleEmojiStyle() {
        if (this.value1) {
          this.replaceEmojiStyle();
          this.initObserver();
        } else {
          this.observer && this.observer.disconnect();
        }
      },
      replaceEmojiStyle() {
        const imgs = document.querySelectorAll("img");
        imgs.forEach(this.updateImageSrc);
      },
      updateImageSrc(img) {
        const applePath = "images/emoji/apple";
        if (img.src.includes(applePath)) {
          img.src = img.src.replace(applePath, `images/emoji/${this.value2}`);
        }
      },
      processMutations(mutations) {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              if (node.tagName === "IMG") {
                this.updateImageSrc(node);
              } else if (node.querySelectorAll) {
                node.querySelectorAll("img").forEach(this.updateImageSrc);
              }
            }
          });
          if (mutation.type === "attributes" && mutation.target.tagName === "IMG") {
            this.updateImageSrc(mutation.target);
          }
        });
      },
      initObserver() {
        this.observer = new MutationObserver(this.processMutations);
        this.observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["src"]
        });
      }
    },
    mounted() {
      if (this.value1) {
        this.toggleEmojiStyle();
      }
    },
    beforeDestroy() {
      this.observer && this.observer.disconnect();
    }
  };
  const _hoisted_1$F = { class: "item" };
  const _hoisted_2$u = { class: "tit" };
  const _hoisted_3$m = ["value"];
  function _sfc_render$J(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$F, [
      createBaseVNode("div", _hoisted_2$u, [
        createTextVNode(
          toDisplayString($props.sort) + ". 切换论坛表情风格 ",
          1
          /* TEXT */
        ),
        withDirectives(createBaseVNode(
          "select",
          {
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $options.value2 = $event)
          },
          [
            (openBlock(true), createElementBlock(
              Fragment,
              null,
              renderList($data.options, (item) => {
                return openBlock(), createElementBlock("option", {
                  value: item.value,
                  key: item.value
                }, toDisplayString(item.label), 9, _hoisted_3$m);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ],
          512
          /* NEED_PATCH */
        ), [
          [vModelSelect, $options.value2]
        ])
      ]),
      withDirectives(createBaseVNode(
        "input",
        {
          type: "checkbox",
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $options.value1 = $event),
          onChange: _cache[2] || (_cache[2] = (...args) => $options.handleChange && $options.handleChange(...args))
        },
        null,
        544
        /* NEED_HYDRATION, NEED_PATCH */
      ), [
        [vModelCheckbox, $options.value1]
      ])
    ]);
  }
  const MenureplaceEmojiStyle = /* @__PURE__ */ _export_sfc(_sfc_main$J, [["render", _sfc_render$J], ["__scopeId", "data-v-770e4473"], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/BasicSettings/MenureplaceEmojiStyle.vue"]]);
  const _sfc_main$I = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    created() {
      if (this.modelValue) {
        setInterval(() => {
          if ($(".replyja").length < 1) {
            $("#reply-control .save-or-cancel .create").after(
              `<button class="btn btn-default replyja" style="margin-left:15px;" type="button">ja 字体</button>`
            );
            $(".replyja").click(function() {
              let $textarea = $(".d-editor-textarea-wrapper textarea");
              let text = `<span lang="ja">

${$(".d-editor-input").val()}

</span>`;
              $(".d-editor-textarea-wrapper textarea").val("");
              $textarea.focus();
              for (let i = 0; i < text.length; i++) {
                let char = text[i];
                $textarea.val($textarea.val() + char);
                let inputEvent = new Event("input", {
                  bubbles: true,
                  cancelable: true
                });
                $textarea[0].dispatchEvent(inputEvent);
                let keyEvent = new KeyboardEvent("keydown", {
                  key: char,
                  char,
                  keyCode: char.charCodeAt(0),
                  which: char.charCodeAt(0),
                  bubbles: true
                });
                $textarea[0].dispatchEvent(keyEvent);
              }
            });
          }
        }, 1e3);
      }
    }
  };
  const _hoisted_1$E = { class: "item" };
  const _hoisted_2$t = { class: "tit" };
  const _hoisted_3$l = ["checked"];
  function _sfc_render$I(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$E, [
      createBaseVNode(
        "div",
        _hoisted_2$t,
        toDisplayString($props.sort) + ". 编辑器切换 ja 字体",
        1
        /* TEXT */
      ),
      createBaseVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$l)
    ]);
  }
  const MenuEditorJa = /* @__PURE__ */ _export_sfc(_sfc_main$I, [["render", _sfc_render$I], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/BasicSettings/MenuEditorJa.vue"]]);
  const _sfc_main$H = {
    props: {
      value: {
        type: Boolean,
        default: false
      },
      sort: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        localChecked: this.value
      };
    },
    watch: {
      value(newValue) {
        this.localChecked = newValue;
      }
    },
    methods: {
      handleChange() {
        this.$emit("update:value", this.localChecked);
      }
    },
    created() {
      if (this.localChecked) {
        setInterval(() => {
          if ($(".created_order").length < 1) {
            $("#navigation-bar").prepend(
              `<li title="最新创建" class="latest ember-view created_order"><a href="/latest?order=created">最新创建</a></li>`
            );
            $(".created_order").click(function() {
              setTimeout(() => {
                $("#navigation-bar>li").removeClass("active");
                $(this).addClass("active");
              }, 500);
            });
          }
        }, 1e3);
      }
    }
  };
  const _hoisted_1$D = { class: "item" };
  const _hoisted_2$s = { class: "tit" };
  function _sfc_render$H(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$D, [
      createBaseVNode(
        "div",
        _hoisted_2$s,
        toDisplayString($props.sort) + ". 首页新增按创建时间排序",
        1
        /* TEXT */
      ),
      withDirectives(createBaseVNode(
        "input",
        {
          type: "checkbox",
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.localChecked = $event),
          onChange: _cache[1] || (_cache[1] = (...args) => $options.handleChange && $options.handleChange(...args))
        },
        null,
        544
        /* NEED_HYDRATION, NEED_PATCH */
      ), [
        [vModelCheckbox, $data.localChecked]
      ])
    ]);
  }
  const MenuCreatedOrder = /* @__PURE__ */ _export_sfc(_sfc_main$H, [["render", _sfc_render$H], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/BasicSettings/MenuCreatedOrder.vue"]]);
  const _sfc_main$G = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    created() {
      if (this.modelValue) {
        $(window).on("scroll", function() {
          if ($(window).scrollTop() >= 250) {
            $(".navigation-container").addClass("is-active");
          } else {
            $(".navigation-container").removeClass("is-active");
          }
        });
      }
    }
  };
  const _hoisted_1$C = { class: "item" };
  const _hoisted_2$r = { class: "tit" };
  const _hoisted_3$k = ["checked"];
  function _sfc_render$G(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$C, [
      createBaseVNode(
        "div",
        _hoisted_2$r,
        toDisplayString($props.sort) + ". 开启列表页导航栏浮动",
        1
        /* TEXT */
      ),
      createBaseVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$k)
    ]);
  }
  const MenuStickyNav = /* @__PURE__ */ _export_sfc(_sfc_main$G, [["render", _sfc_render$G], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/BasicSettings/MenuStickyNav.vue"]]);
  const _sfc_main$F = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    created() {
      if (this.modelValue) {
        $("head").append(`<style>
       .quote-button .quote-sharing{display:none!important}
      </style>`);
      }
    }
  };
  const _hoisted_1$B = { class: "item" };
  const _hoisted_2$q = { class: "tit" };
  const _hoisted_3$j = ["checked"];
  function _sfc_render$F(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$B, [
      createBaseVNode(
        "div",
        _hoisted_2$q,
        toDisplayString($props.sort) + ". 禁用选中文字分享功能",
        1
        /* TEXT */
      ),
      createBaseVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$j)
    ]);
  }
  const MenuSelectedShare = /* @__PURE__ */ _export_sfc(_sfc_main$F, [["render", _sfc_render$F], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/BasicSettings/MenuSelectedShare.vue"]]);
  const _sfc_main$E = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    created() {
      if (this.modelValue) {
        setInterval(() => {
          $(".cooked iframe, .cooked video").each(function() {
            const $element = $(this);
            let src = $element.attr("src");
            if (src) {
              if (!src.includes("autoplay=false")) {
                if (src.includes("autoplay=")) {
                  src = src.replace(/autoplay=[^&]*/, "autoplay=false");
                } else {
                  const separator = src.includes("?") ? "&" : "?";
                  src += `${separator}autoplay=false`;
                }
                $element.attr("src", src);
              }
            }
          });
        }, 1e3);
      }
    }
  };
  const _hoisted_1$A = { class: "item" };
  const _hoisted_2$p = { class: "tit" };
  const _hoisted_3$i = ["checked"];
  function _sfc_render$E(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$A, [
      createBaseVNode(
        "div",
        _hoisted_2$p,
        toDisplayString($props.sort) + ". 禁用视频自动播放",
        1
        /* TEXT */
      ),
      createBaseVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$i)
    ]);
  }
  const MenuDisableAutoplay = /* @__PURE__ */ _export_sfc(_sfc_main$E, [["render", _sfc_render$E], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/BasicSettings/MenuDisableAutoplay.vue"]]);
  const _sfc_main$D = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"]
  };
  const _hoisted_1$z = { class: "item" };
  const _hoisted_2$o = { class: "tit" };
  const _hoisted_3$h = ["checked"];
  function _sfc_render$D(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$z, [
      createBaseVNode(
        "div",
        _hoisted_2$o,
        toDisplayString($props.sort) + ". 是否显示回复悬浮按钮",
        1
        /* TEXT */
      ),
      createBaseVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$h)
    ]);
  }
  const MenuShowRepltBtn = /* @__PURE__ */ _export_sfc(_sfc_main$D, [["render", _sfc_render$D], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/BasicSettings/MenuShowRepltBtn.vue"]]);
  const _sfc_main$C = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    methods: {
      // 提示组件
      messageToast(message) {
        const messageElement2 = document.createElement("div");
        messageElement2.className = "messageToast-text";
        messageElement2.innerText = message;
        document.getElementById("messageToast").appendChild(messageElement2);
        setTimeout(() => {
          messageElement2.remove();
        }, 3e3);
      },
      init() {
        $(".topic-list .main-link a.title").each(function() {
          const id = $(this).attr("data-topic-id");
          if ($(this).parents(".link-top-line").find(".donottopic-btn").length < 1) {
            $(this).parents(".link-top-line").append(
              `<button class="btn btn-icon-text btn-default donottopic-btn donottopic-${id}" data-id="${id}">免打扰</button>`
            );
          }
        });
        function getCSRFToken() {
          return document.querySelector('meta[name="csrf-token"]').getAttribute("content");
        }
        $(document).off("click", ".donottopic-btn").on("click", ".donottopic-btn", function() {
          const formData = new FormData();
          formData.append("notification_level", 0);
          const topicId = $(this).attr("data-id");
          return new Promise((resolve2, reject) => {
            fetch(`https://linux.do/t/${topicId}/notifications`, {
              method: "POST",
              body: formData,
              headers: {
                "X-CSRF-Token": getCSRFToken(),
                // CSRF 令牌
                "X-Requested-With": "XMLHttpRequest"
                // 表明这是 XMLHttpRequest 请求
              },
              credentials: "include"
              // 附带 cookie
            }).then((response) => {
              if (!response.ok) {
                reject(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            }).then(() => {
              $(this).parents(".topic-list-item").remove();
              $("#messageToast").append(messageElement);
              this.messageToast("帖子已设为免打扰！");
              resolve2();
            }).catch((error) => {
              console.log(error);
            });
          });
        });
      }
    },
    created() {
      if (this.modelValue) {
        setInterval(() => {
          this.init();
        }, 1e3);
      }
    }
  };
  const _hoisted_1$y = { class: "item" };
  const _hoisted_2$n = { class: "tit" };
  const _hoisted_3$g = ["checked"];
  function _sfc_render$C(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$y, [
      createBaseVNode(
        "div",
        _hoisted_2$n,
        toDisplayString($props.sort) + ". 列表快速免打扰帖子",
        1
        /* TEXT */
      ),
      createBaseVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$g)
    ]);
  }
  const MenuDonotTopic = /* @__PURE__ */ _export_sfc(_sfc_main$C, [["render", _sfc_render$C], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/BasicSettings/MenuDonotTopic.vue"]]);
  const _sfc_main$B = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    created() {
      if (this.modelValue) {
        setTimeout(() => {
          var svgElement = $('button[title="切换颜色主题"]').find("svg");
          var currentTime = /* @__PURE__ */ new Date();
          var currentHour = currentTime.getHours();
          if (currentHour >= 18 || currentHour < 6) {
            console.log("现在是夜里");
            if (svgElement.hasClass("d-icon-moon")) {
              $('button[title="切换颜色主题"]')[0].click();
            }
          } else {
            console.log("现在不是夜里");
            if (svgElement.hasClass("d-icon-sun")) {
              $('button[title="切换颜色主题"]')[0].click();
            }
          }
        }, 1e3);
      }
    }
  };
  const _hoisted_1$x = { class: "item" };
  const _hoisted_2$m = { class: "tit" };
  const _hoisted_3$f = ["checked"];
  function _sfc_render$B(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$x, [
      createBaseVNode(
        "div",
        _hoisted_2$m,
        toDisplayString($props.sort) + ". 是否自动切换黑夜模式",
        1
        /* TEXT */
      ),
      createBaseVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$f)
    ]);
  }
  const MenuAutoDark = /* @__PURE__ */ _export_sfc(_sfc_main$B, [["render", _sfc_render$B], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/BasicSettings/MenuAutoDark.vue"]]);
  const _sfc_main$A = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    created() {
      if (this.modelValue) {
        $("head").append(`<style>
      .d-editor-input::placeholder{opacity:0;}
      </style>`);
      }
    }
  };
  const _hoisted_1$w = { class: "item" };
  const _hoisted_2$l = { class: "tit" };
  const _hoisted_3$e = ["checked"];
  function _sfc_render$A(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$w, [
      createBaseVNode(
        "div",
        _hoisted_2$l,
        toDisplayString($props.sort) + ". 是否隐藏输入框提示文字",
        1
        /* TEXT */
      ),
      createBaseVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$e)
    ]);
  }
  const MenuHiddenPlaceholder = /* @__PURE__ */ _export_sfc(_sfc_main$A, [["render", _sfc_render$A], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/BasicSettings/MenuHiddenPlaceholder.vue"]]);
  const _sfc_main$z = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    created() {
      if (this.modelValue) {
        try {
          require("discourse/routes/topic").default.disableReplaceState = true;
          console.log("disableReplaceState 已成功设置为 true");
        } catch (e) {
          console.error("设置 disableReplaceState 失败：", e);
        }
      }
    }
  };
  const _hoisted_1$v = { class: "item" };
  const _hoisted_2$k = { class: "tit" };
  const _hoisted_3$d = ["checked"];
  function _sfc_render$z(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$v, [
      createBaseVNode(
        "div",
        _hoisted_2$k,
        toDisplayString($props.sort) + ". 是否禁用浏览帖子时 URL 更新楼层数",
        1
        /* TEXT */
      ),
      createBaseVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$d)
    ]);
  }
  const MenuDisableReplaceState = /* @__PURE__ */ _export_sfc(_sfc_main$z, [["render", _sfc_render$z], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/BasicSettings/MenuDisableReplaceState.vue"]]);
  const _sfc_main$y = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    created() {
      if (this.modelValue.enable) {
        $("head").append(`<style>
        .topic-list-data.posters { width: max-content !important; }
        .topic-list-content.right { margin-left:0 !important; }

        .topic-list-data.posters ${this.modelValue.showAuthor ? "> *:not(:first-child)" : ""},
        .topic-list-avatar.pull-left  { display:none !important }
      </style>`);
      }
    }
  };
  const _hoisted_1$u = { class: "item" };
  const _hoisted_2$j = { class: "tit" };
  const _hoisted_3$c = ["checked"];
  const _hoisted_4$4 = ["checked"];
  function _sfc_render$y(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$u, [
      createBaseVNode("div", _hoisted_2$j, [
        createCommentVNode(" 是否保留发帖人仅 PC 端 类主站样式有效，移动端默认只有发帖人 "),
        createTextVNode(
          " " + toDisplayString($props.sort) + ". 是否移除话题列表上的头像（是否保留发帖人 ",
          1
          /* TEXT */
        ),
        createBaseVNode("input", {
          type: "checkbox",
          checked: $props.modelValue.showAuthor,
          onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", {
            enable: $props.modelValue.enable,
            showAuthor: $event.target.checked
          }))
        }, null, 40, _hoisted_3$c),
        _cache[2] || (_cache[2] = createTextVNode(" ） "))
      ]),
      createBaseVNode("input", {
        type: "checkbox",
        checked: $props.modelValue.enable,
        onChange: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("update:modelValue", {
          enable: $event.target.checked,
          showAuthor: $props.modelValue.showAuthor
        }))
      }, null, 40, _hoisted_4$4)
    ]);
  }
  const MenuRemovePostAvatar = /* @__PURE__ */ _export_sfc(_sfc_main$y, [["render", _sfc_render$y], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/BasicSettings/MenuRemovePostAvatar.vue"]]);
  const _sfc_main$x = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"]
  };
  const _hoisted_1$t = { class: "item" };
  const _hoisted_2$i = { class: "tit" };
  const _hoisted_3$b = ["checked"];
  function _sfc_render$x(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$t, [
      createBaseVNode(
        "div",
        _hoisted_2$i,
        toDisplayString($props.sort) + ". 是否显示最热帖子排行榜",
        1
        /* TEXT */
      ),
      createBaseVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$b)
    ]);
  }
  const MenuHotRankingList = /* @__PURE__ */ _export_sfc(_sfc_main$x, [["render", _sfc_render$x], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/BasicSettings/MenuHotRankingList.vue"]]);
  const _sfc_main$w = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"]
  };
  const _hoisted_1$s = { class: "item" };
  const _hoisted_2$h = { class: "tit" };
  const _hoisted_3$a = ["checked"];
  function _sfc_render$w(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$s, [
      createBaseVNode(
        "div",
        _hoisted_2$h,
        toDisplayString($props.sort) + ". 显示返回顶部按钮",
        1
        /* TEXT */
      ),
      createBaseVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$a)
    ]);
  }
  const MenuBackToTop = /* @__PURE__ */ _export_sfc(_sfc_main$w, [["render", _sfc_render$w], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/BasicSettings/MenuBackToTop.vue"]]);
  const _sfc_main$v = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    data() {
      return {
        isFocusedOnInput: false
        // 标记当前是否聚焦在输入框上
      };
    },
    created() {
      if (this.modelValue) {
        window.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener("focus", this.handleFocus, true);
        window.addEventListener("blur", this.handleBlur, true);
      }
    },
    beforeUnmount() {
      window.removeEventListener("keydown", this.handleKeyDown);
      window.removeEventListener("focus", this.handleFocus, true);
      window.removeEventListener("blur", this.handleBlur, true);
    },
    watch: {
      modelValue(newValue) {
        if (newValue) {
          window.addEventListener("keydown", this.handleKeyDown);
          window.addEventListener("focus", this.handleFocus, true);
          window.addEventListener("blur", this.handleBlur, true);
        } else {
          window.removeEventListener("keydown", this.handleKeyDown);
          window.removeEventListener("focus", this.handleFocus, true);
          window.removeEventListener("blur", this.handleBlur, true);
        }
      }
    },
    methods: {
      // 提示组件
      messageToast(message) {
        const messageElement2 = document.createElement("div");
        messageElement2.className = "messageToast-text";
        messageElement2.innerText = message;
        document.getElementById("messageToast").appendChild(messageElement2);
        setTimeout(() => {
          messageElement2.remove();
        }, 3e3);
      },
      handleKeyDown(event) {
        if (this.isFocusedOnInput) return;
        if (event.key === "q") {
          const parentSelector = "#post_1";
          const button = document.querySelector(
            `${parentSelector} .btn-toggle-reaction-like[title="点赞此帖子"]`
          );
          if (button) {
            button.click();
            this.messageToast("已点赞！");
          } else {
            console.log("按钮未找到");
          }
        }
      },
      handleFocus(event) {
        if (event.target.tagName === "input" || event.target.tagName === "textarea") {
          this.isFocusedOnInput = true;
        }
      },
      handleBlur(event) {
        if (event.target.tagName === "input" || event.target.tagName === "textarea") {
          this.isFocusedOnInput = false;
        }
      }
    }
  };
  const _hoisted_1$r = { class: "item" };
  const _hoisted_2$g = { class: "tit" };
  const _hoisted_3$9 = ["checked"];
  function _sfc_render$v(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$r, [
      createBaseVNode("div", _hoisted_2$g, [
        createTextVNode(
          toDisplayString($props.sort) + ". 是否开启快捷给主题点赞 (快捷键：",
          1
          /* TEXT */
        ),
        _cache[1] || (_cache[1] = createBaseVNode(
          "kbd",
          null,
          "Q",
          -1
          /* HOISTED */
        )),
        _cache[2] || (_cache[2] = createTextVNode(")"))
      ]),
      createBaseVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$9)
    ]);
  }
  const MenuQuickLikeTopic = /* @__PURE__ */ _export_sfc(_sfc_main$v, [["render", _sfc_render$v], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/BasicSettings/MenuQuickLikeTopic.vue"]]);
  const _sfc_main$u = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    created() {
      if (this.modelValue) {
        $("head").append(`<style>
      .sidebar-section-link-suffix.icon.unread,
      .topic-post-badges{display:none !important}
      </style>`);
      }
    }
  };
  const _hoisted_1$q = { class: "item" };
  const _hoisted_2$f = { class: "tit" };
  const _hoisted_3$8 = ["checked"];
  function _sfc_render$u(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$q, [
      createBaseVNode(
        "div",
        _hoisted_2$f,
        toDisplayString($props.sort) + ". 是否隐藏新消息小蓝点（除帖子未读小蓝点）",
        1
        /* TEXT */
      ),
      createBaseVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$8)
    ]);
  }
  const MenuHideNewBluedot = /* @__PURE__ */ _export_sfc(_sfc_main$u, [["render", _sfc_render$u], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/BasicSettings/MenuHideNewBluedot.vue"]]);
  const _sfc_main$t = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    created() {
      if (this.modelValue) {
        setInterval(() => {
          $(".post-avatar .avatar").each(function() {
            const currentSrc = $(this).attr("src");
            if (currentSrc.endsWith(".gif")) {
              $(this).attr("src", currentSrc.replace(".gif", ".png"));
            }
          });
        }, 1e3);
      }
    }
  };
  const _hoisted_1$p = { class: "item" };
  const _hoisted_2$e = { class: "tit" };
  const _hoisted_3$7 = ["checked"];
  function _sfc_render$t(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$p, [
      createBaseVNode(
        "div",
        _hoisted_2$e,
        toDisplayString($props.sort) + ". gif 头像转静态图片（不喜花里胡哨的佬友可以开启）",
        1
        /* TEXT */
      ),
      createBaseVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$7)
    ]);
  }
  const MenuGifToPng = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["render", _sfc_render$t], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/BasicSettings/MenuGifToPng.vue"]]);
  const _sfc_main$s = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    created() {
      if (this.modelValue) {
        $("head").append(`<style>
      .search-banner{display:none!important;}
      #main-outlet{padding-top:1.5em!important;}
      </style>`);
      }
    }
  };
  const _hoisted_1$o = { class: "item" };
  const _hoisted_2$d = { class: "tit" };
  const _hoisted_3$6 = ["checked"];
  function _sfc_render$s(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$o, [
      createBaseVNode(
        "div",
        _hoisted_2$d,
        toDisplayString($props.sort) + ". 是否隐藏首页 banner 区域",
        1
        /* TEXT */
      ),
      createBaseVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$6)
    ]);
  }
  const MenuHideHomeBanner = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["render", _sfc_render$s], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/BasicSettings/MenuHideHomeBanner.vue"]]);
  const _sfc_main$r = {
    props: ["modelValue", "sort"],
    emits: ["update:modelValue"],
    methods: {
      // 提示组件
      messageToast(message) {
        const messageElement2 = document.createElement("div");
        messageElement2.className = "messageToast-text";
        messageElement2.innerText = message;
        document.getElementById("messageToast").appendChild(messageElement2);
        setTimeout(() => {
          messageElement2.remove();
        }, 3e3);
      }
    },
    created() {
      if (this.modelValue) {
        const vm = this;
        setInterval(() => {
          if ($(".linxudoscripts-bookmark").length < 1) {
            $(".topic-map__contents").after(
              '<button class="btn btn-icon-text linxudoscripts-bookmark" type="button"><svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-bookmark-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 17l-6 4v-14a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v5" /><path d="M16 19h6" /><path d="M19 16v6" /></svg><span class="d-button-label">收藏</span></button>'
            );
            $(".linxudoscripts-bookmark").click(function() {
              var title = $(".header-title .topic-link").text().trim();
              var cate = $(
                ".categories-wrapper .badge-category__wrapper .badge-category__name"
              ).text().trim();
              var tags = $("#topic-title .discourse-tags .discourse-tag.box").map(function() {
                return $(this).text().trim();
              }).get();
              var url = "https://linux.do" + $(".header-title .topic-link").attr("href");
              var data = {
                url,
                title,
                cate,
                tags
              };
              console.log(data);
              chrome.storage.local.set({ bookmarkData: data }, () => {
                vm.messageToast("收藏成功，请前往收藏夹查看。");
              });
              chrome.runtime.sendMessage({ action: "open_bookmark_page" });
            });
          }
        }, 1e3);
      }
    }
  };
  const _hoisted_1$n = { class: "item" };
  const _hoisted_2$c = { class: "tit" };
  const _hoisted_3$5 = ["checked"];
  function _sfc_render$r(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$n, [
      createBaseVNode(
        "div",
        _hoisted_2$c,
        toDisplayString($props.sort) + ". 是否开启收藏功能",
        1
        /* TEXT */
      ),
      createBaseVNode("input", {
        type: "checkbox",
        checked: $props.modelValue,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$5)
    ]);
  }
  const MenuBookmark = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["render", _sfc_render$r], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/BasicSettings/MenuBookmark.vue"]]);
  const _sfc_main$q = {
    props: {
      value: {
        type: String,
        default: ""
      },
      sort: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        textarea: this.value
      };
    },
    watch: {
      value(newValue) {
        this.textarea = newValue;
      }
    },
    methods: {
      handleChange() {
        this.$emit("update:value", this.textarea);
      }
    },
    created() {
      if (this.textarea) {
        $("body").after(`<style>${this.textarea}</style>`);
      }
    }
  };
  const _hoisted_1$m = { class: "item" };
  const _hoisted_2$b = { class: "tit" };
  function _sfc_render$q(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock(
      Fragment,
      null,
      [
        createBaseVNode("div", _hoisted_1$m, [
          createBaseVNode(
            "div",
            _hoisted_2$b,
            toDisplayString($props.sort) + ". 自定义 CSS（支持 import 引入第三方样式文件） ",
            1
            /* TEXT */
          )
        ]),
        withDirectives(createBaseVNode(
          "textarea",
          {
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.textarea = $event),
            onInput: _cache[1] || (_cache[1] = (...args) => $options.handleChange && $options.handleChange(...args)),
            placeholder: "body{font-size:16px;}"
          },
          "  ",
          544
          /* NEED_HYDRATION, NEED_PATCH */
        ), [
          [vModelText, $data.textarea]
        ])
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const MenuOtherCss = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["render", _sfc_render$q], ["__scopeId", "data-v-45c2fff0"], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/CustomText/MenuOtherCss.vue"]]);
  const _sfc_main$p = {
    props: {
      value: {
        type: String,
        default: ""
      },
      sort: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        textarea: this.value
      };
    },
    watch: {
      value(newValue) {
        this.textarea = newValue;
      }
    },
    methods: {
      handleChange() {
        this.$emit("update:value", this.textarea);
      },
      init() {
        $(".d-header .title a").html(`<img src="${this.textarea}">`);
      }
    },
    created() {
      if (this.textarea && this.textarea != "") {
        this.init();
      }
    }
  };
  const _hoisted_1$l = { class: "item" };
  const _hoisted_2$a = { class: "tit" };
  function _sfc_render$p(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock(
      Fragment,
      null,
      [
        createBaseVNode("div", _hoisted_1$l, [
          createBaseVNode(
            "div",
            _hoisted_2$a,
            toDisplayString($props.sort) + ". 自定义论坛 logo",
            1
            /* TEXT */
          )
        ]),
        withDirectives(createBaseVNode(
          "input",
          {
            type: "text",
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.textarea = $event),
            onInput: _cache[1] || (_cache[1] = (...args) => $options.handleChange && $options.handleChange(...args)),
            placeholder: "输入图片链接"
          },
          null,
          544
          /* NEED_HYDRATION, NEED_PATCH */
        ), [
          [vModelText, $data.textarea]
        ])
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const MenuLogoUrl = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["render", _sfc_render$p], ["__scopeId", "data-v-67eea5c6"], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/CustomText/MenuLogoUrl.vue"]]);
  const _sfc_main$o = {
    props: {
      value: {
        type: String,
        default: ""
      },
      sort: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        textarea: this.value
      };
    },
    watch: {
      value(newValue) {
        this.textarea = newValue;
      }
    },
    methods: {
      handleChange() {
        this.$emit("update:value", this.textarea);
      },
      init() {
        this.list = this.textarea.split(/\r?\n/) || [];
        if ($(".createreply").length < 1) {
          $(".timeline-container .topic-timeline").append(
            `<div class="createreply" style="margin-top:6.4rem;"></div>`
          );
          this.list.forEach(function(item) {
            var $li = $(
              '<button class="btn btn-default create reply-to-post no-text btn-icon" type="button"></button>'
            ).text(item);
            $(".createreply").append($li);
          });
          $(".createreply button").click(function() {
            if ($(".timeline-footer-controls button.create").length != 0) {
              $(".timeline-footer-controls button.create")[0].click();
            }
            if ($("#topic-footer-buttons .topic-footer-main-buttons button.create").length != 0) {
              $(
                "#topic-footer-buttons .topic-footer-main-buttons button.create"
              )[0].click();
            }
            setTimeout(() => {
              let $textarea = $(".d-editor-textarea-wrapper textarea");
              let text = $(this).html();
              $textarea.focus();
              for (let i = 0; i < text.length; i++) {
                let char = text[i];
                $textarea.val($textarea.val() + char);
                let inputEvent = new Event("input", {
                  bubbles: true,
                  cancelable: true
                });
                $textarea[0].dispatchEvent(inputEvent);
                let keyEvent = new KeyboardEvent("keydown", {
                  key: char,
                  char,
                  keyCode: char.charCodeAt(0),
                  which: char.charCodeAt(0),
                  bubbles: true
                });
                $textarea[0].dispatchEvent(keyEvent);
              }
            }, 1e3);
          });
        }
      }
    },
    created() {
      if (this.textarea) {
        setInterval(() => {
          this.init();
        }, 1e3);
      }
    }
  };
  const _hoisted_1$k = { class: "item" };
  const _hoisted_2$9 = { class: "tit" };
  function _sfc_render$o(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock(
      Fragment,
      null,
      [
        createBaseVNode("div", _hoisted_1$k, [
          createBaseVNode(
            "div",
            _hoisted_2$9,
            toDisplayString($props.sort) + ". 自定义快捷回复（换行分隔）",
            1
            /* TEXT */
          )
        ]),
        withDirectives(createBaseVNode(
          "textarea",
          {
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.textarea = $event),
            onInput: _cache[1] || (_cache[1] = (...args) => $options.handleChange && $options.handleChange(...args)),
            placeholder: "前排围观支持一下\\n感谢分享大佬厉害啊\\n有点厉害支持~~"
          },
          "  ",
          544
          /* NEED_HYDRATION, NEED_PATCH */
        ), [
          [vModelText, $data.textarea]
        ])
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const MenuCreatereply = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["render", _sfc_render$o], ["__scopeId", "data-v-95807548"], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/CustomText/MenuCreatereply.vue"]]);
  const _sfc_main$n = {
    props: {
      value: {
        type: String,
        default: ""
      },
      sort: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        textarea: this.value
      };
    },
    watch: {
      value(newValue) {
        this.textarea = newValue;
      }
    },
    methods: {
      handleChange() {
        this.$emit("update:value", this.textarea);
      },
      init() {
        this.list = this.textarea.split(",") || [];
        var self2 = this;
        $(".topic-list .topic-list-data.posters>a:nth-child(1)").filter((index, element) => {
          var user = $(element).attr("data-user-card");
          return self2.list.indexOf(user) !== -1;
        }).parents("tr.topic-list-item").hide();
        $(".topic-post .full-name a").filter((index, element) => {
          var user = $(element).attr("data-user-card");
          return self2.list.indexOf(user) !== -1;
        }).parents(".topic-post").hide();
      }
    },
    created() {
      if (this.textarea) {
        let pollinglength1 = 0;
        let pollinglength2 = 0;
        setInterval(() => {
          if (pollinglength1 != $(".topic-list-body tr").length) {
            pollinglength1 = $(".topic-list-body tr").length;
            this.init();
          }
          if (pollinglength2 != $(".post-stream .topic-post").length) {
            pollinglength2 = $(".post-stream .topic-post").length;
            this.init();
          }
        }, 1e3);
      }
    }
  };
  const _hoisted_1$j = { class: "item" };
  const _hoisted_2$8 = { class: "tit" };
  function _sfc_render$n(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock(
      Fragment,
      null,
      [
        createBaseVNode("div", _hoisted_1$j, [
          createBaseVNode(
            "div",
            _hoisted_2$8,
            toDisplayString($props.sort) + ". 屏蔽指定用户（使用英文，分隔）",
            1
            /* TEXT */
          )
        ]),
        withDirectives(createBaseVNode(
          "textarea",
          {
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.textarea = $event),
            onInput: _cache[1] || (_cache[1] = (...args) => $options.handleChange && $options.handleChange(...args)),
            placeholder: "user1,user2,user3"
          },
          "  ",
          544
          /* NEED_HYDRATION, NEED_PATCH */
        ), [
          [vModelText, $data.textarea]
        ])
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const MenuBlockuserlist = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["render", _sfc_render$n], ["__scopeId", "data-v-f5f1bbd6"], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/CustomText/MenuBlockuserlist.vue"]]);
  const _sfc_main$m = {
    props: {
      value: {
        type: String,
        default: ""
      },
      sort: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        textarea: this.value
      };
    },
    watch: {
      value(newValue) {
        this.textarea = newValue;
      }
    },
    methods: {
      handleChange() {
        this.$emit("update:value", this.textarea);
      },
      init() {
        if (!this.textarea) return;
        const keywords = this.textarea.split(",").map((keyword) => keyword.trim()).filter(Boolean);
        if (keywords.length === 0) return;
        try {
          $(".topic-list .main-link .raw-topic-link>*").filter((index, element) => {
            const text = $(element).text();
            return keywords.some((keyword) => text.includes(keyword));
          }).parents("tr.topic-list-item").hide();
          $(".topic-list-item .discourse-tags a").filter((index, element) => {
            const text = $(element).text();
            return keywords.some((keyword) => text.includes(keyword));
          }).parents("tr.topic-list-item").hide();
          $(".topic-body .cooked").filter((index, element) => {
            const text = $(element).text();
            return keywords.some((keyword) => text.includes(keyword));
          }).parents(".topic-post").hide();
        } catch (error) {
          console.error("init 方法出错：", error);
        }
      }
    },
    created() {
      if (this.textarea) {
        let previousTopicListLength = 0;
        let previousPostStreamLength = 0;
        this.pollingInterval = setInterval(() => {
          try {
            const currentTopicListLength = $(".topic-list-body tr").length || 0;
            const currentPostStreamLength = $(".post-stream .topic-post").length || 0;
            if (previousTopicListLength !== currentTopicListLength) {
              previousTopicListLength = currentTopicListLength;
              this.init();
            }
            if (previousPostStreamLength !== currentPostStreamLength) {
              previousPostStreamLength = currentPostStreamLength;
              this.init();
            }
          } catch (error) {
            console.error("轮询逻辑出错：", error);
          }
        }, 1e3);
      }
    },
    beforeDestroy() {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval);
      }
    }
  };
  const _hoisted_1$i = { class: "item" };
  const _hoisted_2$7 = { class: "tit" };
  function _sfc_render$m(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock(
      Fragment,
      null,
      [
        createBaseVNode("div", _hoisted_1$i, [
          createBaseVNode(
            "div",
            _hoisted_2$7,
            toDisplayString($props.sort) + ". 关键词屏蔽功能（使用英文，分隔）屏蔽包含关键字的话题标题、标签、回复 ",
            1
            /* TEXT */
          )
        ]),
        withDirectives(createBaseVNode(
          "textarea",
          {
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.textarea = $event),
            onInput: _cache[1] || (_cache[1] = (...args) => $options.handleChange && $options.handleChange(...args))
          },
          " ",
          544
          /* NEED_HYDRATION, NEED_PATCH */
        ), [
          [vModelText, $data.textarea]
        ])
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const MenuBlockKeyword = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["render", _sfc_render$m], ["__scopeId", "data-v-564f7fb0"], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/CustomText/MenuBlockKeyword.vue"]]);
  const _sfc_main$l = {
    props: {
      value: {
        type: Object,
        default: {
          value1: false,
          cate: "搞七捻三",
          days: "5"
        }
      },
      sort: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        localChecked: this.value
      };
    },
    watch: {
      value(newValue) {
        this.localChecked = newValue;
      }
    },
    methods: {
      handleChange() {
        this.$emit("update:value", this.localChecked);
      },
      // 过滤时间格式
      convertToTimestamp(dateStr) {
        const cleanedDateStr = dateStr.replace(/\s+/g, "");
        const datePattern = /(\d{4})年(\d{1,2})月(\d{1,2})日(\d{2}):(\d{2})/;
        const dateMatch = cleanedDateStr.match(datePattern);
        if (dateMatch) {
          const year = parseInt(dateMatch[1], 10);
          const month = parseInt(dateMatch[2], 10) - 1;
          const day = parseInt(dateMatch[3], 10);
          const hours = parseInt(dateMatch[4], 10);
          const minutes = parseInt(dateMatch[5], 10);
          const date = new Date(year, month, day, hours, minutes);
          return date.getTime();
        }
        return null;
      },
      // 屏蔽指定分类、指定时间
      GetTimestamp() {
        if (!$(".nav-pills > li.nav-item_posted").hasClass("active") && !$(".nav-pills > li.nav-item_bookmarks").hasClass("active")) {
          if (this.localChecked.cate == "") {
            $(".topic-list .age").each((index, element) => {
              const str = $(element).attr("title");
              const match = str.match(/创建日期：([\s\S]*?)最新：/);
              if (match && match[1]) {
                const creationDate = match[1].trim();
                const timestamp = this.convertToTimestamp(creationDate);
                const days = Number(this.localChecked.days) * 864e5;
                if (Date.now() - timestamp > days) {
                  $(element).parents("tr.topic-list-item").remove();
                }
              }
            });
          } else {
            const cateArray = this.localChecked.cate.split(",").map((item) => item.trim());
            $(".badge-category__wrapper .badge-category__name").each((index, element) => {
              let htmlContent = $(element).html();
              htmlContent = htmlContent.replace(/,\s*Lv[1-3]/g, "");
              if (cateArray.includes(htmlContent.trim())) {
                $(element).parents("tr.topic-list-item").find(".age").each((index2, element2) => {
                  const str = $(element2).attr("title");
                  const match = str.match(/创建日期：([\s\S]*?)最新：/);
                  if (match && match[1]) {
                    const creationDate = match[1].trim();
                    const timestamp = this.convertToTimestamp(creationDate);
                    const days = Number(this.localChecked.days) * 864e5;
                    if (Date.now() - timestamp > days) {
                      $(element2).parents("tr.topic-list-item").remove();
                    }
                  }
                });
              }
            });
          }
        }
      }
    },
    created() {
      if (this.localChecked.value1) {
        let pollinglength1 = 0;
        setInterval(() => {
          if (pollinglength1 != $(".topic-list-body tr").length) {
            pollinglength1 = $(".topic-list-body tr").length;
            this.GetTimestamp();
          }
        }, 1e3);
      }
    }
  };
  const _hoisted_1$h = {
    class: "item",
    style: { "border": "none" }
  };
  const _hoisted_2$6 = { class: "tit" };
  function _sfc_render$l(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock(
      Fragment,
      null,
      [
        createBaseVNode("div", _hoisted_1$h, [
          createBaseVNode("div", _hoisted_2$6, [
            createTextVNode(
              toDisplayString($props.sort) + ". 屏蔽指定天数前的帖子 ",
              1
              /* TEXT */
            ),
            withDirectives(createBaseVNode(
              "input",
              {
                type: "text",
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.localChecked.days = $event),
                placeholder: "默认天数 5"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vModelText, $data.localChecked.days]
            ])
          ]),
          withDirectives(createBaseVNode(
            "input",
            {
              type: "checkbox",
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.localChecked.value1 = $event),
              onChange: _cache[2] || (_cache[2] = (...args) => $options.handleChange && $options.handleChange(...args))
            },
            null,
            544
            /* NEED_HYDRATION, NEED_PATCH */
          ), [
            [vModelCheckbox, $data.localChecked.value1]
          ])
        ]),
        createBaseVNode("div", null, [
          _cache[4] || (_cache[4] = createBaseVNode(
            "p",
            null,
            "针对分类：留空对全部分类生效，多个分类用英文逗号【,】进行分隔",
            -1
            /* HOISTED */
          )),
          withDirectives(createBaseVNode(
            "textarea",
            {
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.localChecked.cate = $event),
              placeholder: "搞七捻三"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vModelText, $data.localChecked.cate]
          ])
        ])
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const MenuShieldPosts = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["render", _sfc_render$l], ["__scopeId", "data-v-285e4a6e"], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/CustomText/MenuShieldPosts.vue"]]);
  const _sfc_main$k = {
    props: {
      value: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        tableData: this.value
      };
    },
    watch: {
      value(newValue) {
        this.tableData = newValue;
      }
    },
    methods: {
      handleChange() {
        this.$emit("update:value", this.tableData);
      },
      // 修改标签
      editTags(item) {
        var tags = prompt(`对 @${item.name} 修改标签`, item.tags);
        if (tags == null) {
          return item.tags;
        }
        if (tags != item.tags) {
          var existingPerson = this.tableData.find((items) => items.name === item.name);
          if (existingPerson) {
            existingPerson.tags = tags;
          } else {
            this.tableData.push({ name: person, tags });
          }
          let settingData1 = localStorage.getItem("linxudoscriptssettingDMI");
          settingData1 = JSON.parse(settingData1);
          settingData1.usertags = this.tableData;
          localStorage.setItem("linxudoscriptssettingDMI", JSON.stringify(settingData1));
          this.$emit("update:value", this.tableData);
        }
      },
      delTags(item) {
        var del = confirm("是否确认删除！");
        if (del == true) {
          this.tableData.splice(item, 1);
          let settingData1 = localStorage.getItem("linxudoscriptssettingDMI");
          settingData1 = JSON.parse(settingData1);
          settingData1.usertags = this.tableData;
          localStorage.setItem("linxudoscriptssettingDMI", JSON.stringify(settingData1));
          this.$emit("update:value", this.tableData);
        }
      }
    },
    created() {
      let settingData = localStorage.getItem("linxudoscriptssettingDMI");
      settingData = JSON.parse(settingData);
      if (!settingData.usertags) {
        settingData.usertags = [];
      }
      settingData.usertags = settingData.usertags.filter((user) => user.tags);
      this.tableData = settingData.usertags;
      setInterval(() => {
        if ($(".addusertag").length < 1) {
          $(".usercard-controls").append(
            `<li><button class="btn addusertag" type="button">添加用户标签</button></li>`
          );
          $(".addusertag").click(function() {
            var person2 = $(".user-card .user-profile-link").attr("href").replace("/u/", "");
            var tags = prompt(`对 @${person2} 设置标签（保存后刷新页面）`, "");
            if (tags == null) {
              return false;
            }
            var lowerCasePerson = person2;
            var existingPerson = settingData.usertags.find(
              (item) => item.name === lowerCasePerson
            );
            if (existingPerson) {
              existingPerson.tags = tags;
            } else {
              settingData.usertags.push({ name: person2, tags });
            }
            localStorage.setItem("linxudoscriptssettingDMI", JSON.stringify(settingData));
          });
        }
        $(".topic-post").each(function() {
          const username = $(this).find(".first a").attr("data-user-card").toLowerCase();
          const userTag = settingData.usertags.find((user) => user.name === username);
          if (userTag) {
            if ($(this).find(".linxudoscripts-tag").length < 1) {
              $(this).find(".names").append(`<span class="linxudoscripts-tag"># ${userTag.tags}</span>`);
            }
          }
        });
      }, 1e3);
    }
  };
  const _hoisted_1$g = { class: "menu-table" };
  const _hoisted_2$5 = ["onClick"];
  const _hoisted_3$4 = ["onClick"];
  function _sfc_render$k(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", null, [
      createBaseVNode("table", _hoisted_1$g, [
        _cache[0] || (_cache[0] = createBaseVNode(
          "thead",
          null,
          [
            createBaseVNode("tr", null, [
              createBaseVNode("th", null, "用户名"),
              createBaseVNode("th", null, "标签"),
              createBaseVNode("th", null, "操作")
            ])
          ],
          -1
          /* HOISTED */
        )),
        createBaseVNode("tbody", null, [
          (openBlock(true), createElementBlock(
            Fragment,
            null,
            renderList($data.tableData, (item) => {
              return openBlock(), createElementBlock("tr", {
                key: item.name
              }, [
                createBaseVNode(
                  "td",
                  null,
                  toDisplayString(item.name),
                  1
                  /* TEXT */
                ),
                createBaseVNode(
                  "td",
                  null,
                  toDisplayString(item.tags),
                  1
                  /* TEXT */
                ),
                createBaseVNode("td", null, [
                  createBaseVNode("span", {
                    class: "span",
                    onClick: ($event) => $options.editTags(item)
                  }, "修改", 8, _hoisted_2$5),
                  createBaseVNode("span", {
                    class: "span",
                    onClick: ($event) => $options.delTags(item),
                    style: { "color": "#e00" }
                  }, "删除！", 8, _hoisted_3$4)
                ])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ])
    ]);
  }
  const UserTags = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$k], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/UserTags/UserTags.vue"]]);
  function _getDefaults() {
    return {
      async: false,
      breaks: false,
      extensions: null,
      gfm: true,
      hooks: null,
      pedantic: false,
      renderer: null,
      silent: false,
      tokenizer: null,
      walkTokens: null
    };
  }
  let _defaults = _getDefaults();
  function changeDefaults(newDefaults) {
    _defaults = newDefaults;
  }
  const escapeTest = /[&<>"']/;
  const escapeReplace = new RegExp(escapeTest.source, "g");
  const escapeTestNoEncode = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/;
  const escapeReplaceNoEncode = new RegExp(escapeTestNoEncode.source, "g");
  const escapeReplacements = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  const getEscapeReplacement = (ch) => escapeReplacements[ch];
  function escape$1(html2, encode) {
    if (encode) {
      if (escapeTest.test(html2)) {
        return html2.replace(escapeReplace, getEscapeReplacement);
      }
    } else {
      if (escapeTestNoEncode.test(html2)) {
        return html2.replace(escapeReplaceNoEncode, getEscapeReplacement);
      }
    }
    return html2;
  }
  const caret = /(^|[^\[])\^/g;
  function edit(regex, opt) {
    let source = typeof regex === "string" ? regex : regex.source;
    opt = opt || "";
    const obj = {
      replace: (name2, val) => {
        let valSource = typeof val === "string" ? val : val.source;
        valSource = valSource.replace(caret, "$1");
        source = source.replace(name2, valSource);
        return obj;
      },
      getRegex: () => {
        return new RegExp(source, opt);
      }
    };
    return obj;
  }
  function cleanUrl(href) {
    try {
      href = encodeURI(href).replace(/%25/g, "%");
    } catch {
      return null;
    }
    return href;
  }
  const noopTest = { exec: () => null };
  function splitCells(tableRow, count) {
    const row = tableRow.replace(/\|/g, (match, offset, str) => {
      let escaped = false;
      let curr = offset;
      while (--curr >= 0 && str[curr] === "\\")
        escaped = !escaped;
      if (escaped) {
        return "|";
      } else {
        return " |";
      }
    }), cells = row.split(/ \|/);
    let i = 0;
    if (!cells[0].trim()) {
      cells.shift();
    }
    if (cells.length > 0 && !cells[cells.length - 1].trim()) {
      cells.pop();
    }
    if (count) {
      if (cells.length > count) {
        cells.splice(count);
      } else {
        while (cells.length < count)
          cells.push("");
      }
    }
    for (; i < cells.length; i++) {
      cells[i] = cells[i].trim().replace(/\\\|/g, "|");
    }
    return cells;
  }
  function rtrim(str, c, invert) {
    const l = str.length;
    if (l === 0) {
      return "";
    }
    let suffLen = 0;
    while (suffLen < l) {
      const currChar = str.charAt(l - suffLen - 1);
      if (currChar === c && !invert) {
        suffLen++;
      } else {
        break;
      }
    }
    return str.slice(0, l - suffLen);
  }
  function findClosingBracket(str, b) {
    if (str.indexOf(b[1]) === -1) {
      return -1;
    }
    let level = 0;
    for (let i = 0; i < str.length; i++) {
      if (str[i] === "\\") {
        i++;
      } else if (str[i] === b[0]) {
        level++;
      } else if (str[i] === b[1]) {
        level--;
        if (level < 0) {
          return i;
        }
      }
    }
    return -1;
  }
  function outputLink(cap, link2, raw, lexer) {
    const href = link2.href;
    const title = link2.title ? escape$1(link2.title) : null;
    const text = cap[1].replace(/\\([\[\]])/g, "$1");
    if (cap[0].charAt(0) !== "!") {
      lexer.state.inLink = true;
      const token = {
        type: "link",
        raw,
        href,
        title,
        text,
        tokens: lexer.inlineTokens(text)
      };
      lexer.state.inLink = false;
      return token;
    }
    return {
      type: "image",
      raw,
      href,
      title,
      text: escape$1(text)
    };
  }
  function indentCodeCompensation(raw, text) {
    const matchIndentToCode = raw.match(/^(\s+)(?:```)/);
    if (matchIndentToCode === null) {
      return text;
    }
    const indentToCode = matchIndentToCode[1];
    return text.split("\n").map((node) => {
      const matchIndentInNode = node.match(/^\s+/);
      if (matchIndentInNode === null) {
        return node;
      }
      const [indentInNode] = matchIndentInNode;
      if (indentInNode.length >= indentToCode.length) {
        return node.slice(indentToCode.length);
      }
      return node;
    }).join("\n");
  }
  class _Tokenizer {
    // set by the lexer
    constructor(options) {
      __publicField(this, "options");
      __publicField(this, "rules");
      // set by the lexer
      __publicField(this, "lexer");
      this.options = options || _defaults;
    }
    space(src) {
      const cap = this.rules.block.newline.exec(src);
      if (cap && cap[0].length > 0) {
        return {
          type: "space",
          raw: cap[0]
        };
      }
    }
    code(src) {
      const cap = this.rules.block.code.exec(src);
      if (cap) {
        const text = cap[0].replace(/^(?: {1,4}| {0,3}\t)/gm, "");
        return {
          type: "code",
          raw: cap[0],
          codeBlockStyle: "indented",
          text: !this.options.pedantic ? rtrim(text, "\n") : text
        };
      }
    }
    fences(src) {
      const cap = this.rules.block.fences.exec(src);
      if (cap) {
        const raw = cap[0];
        const text = indentCodeCompensation(raw, cap[3] || "");
        return {
          type: "code",
          raw,
          lang: cap[2] ? cap[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : cap[2],
          text
        };
      }
    }
    heading(src) {
      const cap = this.rules.block.heading.exec(src);
      if (cap) {
        let text = cap[2].trim();
        if (/#$/.test(text)) {
          const trimmed = rtrim(text, "#");
          if (this.options.pedantic) {
            text = trimmed.trim();
          } else if (!trimmed || / $/.test(trimmed)) {
            text = trimmed.trim();
          }
        }
        return {
          type: "heading",
          raw: cap[0],
          depth: cap[1].length,
          text,
          tokens: this.lexer.inline(text)
        };
      }
    }
    hr(src) {
      const cap = this.rules.block.hr.exec(src);
      if (cap) {
        return {
          type: "hr",
          raw: rtrim(cap[0], "\n")
        };
      }
    }
    blockquote(src) {
      const cap = this.rules.block.blockquote.exec(src);
      if (cap) {
        let lines = rtrim(cap[0], "\n").split("\n");
        let raw = "";
        let text = "";
        const tokens = [];
        while (lines.length > 0) {
          let inBlockquote = false;
          const currentLines = [];
          let i;
          for (i = 0; i < lines.length; i++) {
            if (/^ {0,3}>/.test(lines[i])) {
              currentLines.push(lines[i]);
              inBlockquote = true;
            } else if (!inBlockquote) {
              currentLines.push(lines[i]);
            } else {
              break;
            }
          }
          lines = lines.slice(i);
          const currentRaw = currentLines.join("\n");
          const currentText = currentRaw.replace(/\n {0,3}((?:=+|-+) *)(?=\n|$)/g, "\n    $1").replace(/^ {0,3}>[ \t]?/gm, "");
          raw = raw ? `${raw}
${currentRaw}` : currentRaw;
          text = text ? `${text}
${currentText}` : currentText;
          const top = this.lexer.state.top;
          this.lexer.state.top = true;
          this.lexer.blockTokens(currentText, tokens, true);
          this.lexer.state.top = top;
          if (lines.length === 0) {
            break;
          }
          const lastToken = tokens[tokens.length - 1];
          if ((lastToken == null ? void 0 : lastToken.type) === "code") {
            break;
          } else if ((lastToken == null ? void 0 : lastToken.type) === "blockquote") {
            const oldToken = lastToken;
            const newText = oldToken.raw + "\n" + lines.join("\n");
            const newToken = this.blockquote(newText);
            tokens[tokens.length - 1] = newToken;
            raw = raw.substring(0, raw.length - oldToken.raw.length) + newToken.raw;
            text = text.substring(0, text.length - oldToken.text.length) + newToken.text;
            break;
          } else if ((lastToken == null ? void 0 : lastToken.type) === "list") {
            const oldToken = lastToken;
            const newText = oldToken.raw + "\n" + lines.join("\n");
            const newToken = this.list(newText);
            tokens[tokens.length - 1] = newToken;
            raw = raw.substring(0, raw.length - lastToken.raw.length) + newToken.raw;
            text = text.substring(0, text.length - oldToken.raw.length) + newToken.raw;
            lines = newText.substring(tokens[tokens.length - 1].raw.length).split("\n");
            continue;
          }
        }
        return {
          type: "blockquote",
          raw,
          tokens,
          text
        };
      }
    }
    list(src) {
      let cap = this.rules.block.list.exec(src);
      if (cap) {
        let bull = cap[1].trim();
        const isordered = bull.length > 1;
        const list2 = {
          type: "list",
          raw: "",
          ordered: isordered,
          start: isordered ? +bull.slice(0, -1) : "",
          loose: false,
          items: []
        };
        bull = isordered ? `\\d{1,9}\\${bull.slice(-1)}` : `\\${bull}`;
        if (this.options.pedantic) {
          bull = isordered ? bull : "[*+-]";
        }
        const itemRegex = new RegExp(`^( {0,3}${bull})((?:[	 ][^\\n]*)?(?:\\n|$))`);
        let endsWithBlankLine = false;
        while (src) {
          let endEarly = false;
          let raw = "";
          let itemContents = "";
          if (!(cap = itemRegex.exec(src))) {
            break;
          }
          if (this.rules.block.hr.test(src)) {
            break;
          }
          raw = cap[0];
          src = src.substring(raw.length);
          let line = cap[2].split("\n", 1)[0].replace(/^\t+/, (t) => " ".repeat(3 * t.length));
          let nextLine = src.split("\n", 1)[0];
          let blankLine = !line.trim();
          let indent = 0;
          if (this.options.pedantic) {
            indent = 2;
            itemContents = line.trimStart();
          } else if (blankLine) {
            indent = cap[1].length + 1;
          } else {
            indent = cap[2].search(/[^ ]/);
            indent = indent > 4 ? 1 : indent;
            itemContents = line.slice(indent);
            indent += cap[1].length;
          }
          if (blankLine && /^[ \t]*$/.test(nextLine)) {
            raw += nextLine + "\n";
            src = src.substring(nextLine.length + 1);
            endEarly = true;
          }
          if (!endEarly) {
            const nextBulletRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`);
            const hrRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`);
            const fencesBeginRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:\`\`\`|~~~)`);
            const headingBeginRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}#`);
            const htmlBeginRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}<(?:[a-z].*>|!--)`, "i");
            while (src) {
              const rawLine = src.split("\n", 1)[0];
              let nextLineWithoutTabs;
              nextLine = rawLine;
              if (this.options.pedantic) {
                nextLine = nextLine.replace(/^ {1,4}(?=( {4})*[^ ])/g, "  ");
                nextLineWithoutTabs = nextLine;
              } else {
                nextLineWithoutTabs = nextLine.replace(/\t/g, "    ");
              }
              if (fencesBeginRegex.test(nextLine)) {
                break;
              }
              if (headingBeginRegex.test(nextLine)) {
                break;
              }
              if (htmlBeginRegex.test(nextLine)) {
                break;
              }
              if (nextBulletRegex.test(nextLine)) {
                break;
              }
              if (hrRegex.test(nextLine)) {
                break;
              }
              if (nextLineWithoutTabs.search(/[^ ]/) >= indent || !nextLine.trim()) {
                itemContents += "\n" + nextLineWithoutTabs.slice(indent);
              } else {
                if (blankLine) {
                  break;
                }
                if (line.replace(/\t/g, "    ").search(/[^ ]/) >= 4) {
                  break;
                }
                if (fencesBeginRegex.test(line)) {
                  break;
                }
                if (headingBeginRegex.test(line)) {
                  break;
                }
                if (hrRegex.test(line)) {
                  break;
                }
                itemContents += "\n" + nextLine;
              }
              if (!blankLine && !nextLine.trim()) {
                blankLine = true;
              }
              raw += rawLine + "\n";
              src = src.substring(rawLine.length + 1);
              line = nextLineWithoutTabs.slice(indent);
            }
          }
          if (!list2.loose) {
            if (endsWithBlankLine) {
              list2.loose = true;
            } else if (/\n[ \t]*\n[ \t]*$/.test(raw)) {
              endsWithBlankLine = true;
            }
          }
          let istask = null;
          let ischecked;
          if (this.options.gfm) {
            istask = /^\[[ xX]\] /.exec(itemContents);
            if (istask) {
              ischecked = istask[0] !== "[ ] ";
              itemContents = itemContents.replace(/^\[[ xX]\] +/, "");
            }
          }
          list2.items.push({
            type: "list_item",
            raw,
            task: !!istask,
            checked: ischecked,
            loose: false,
            text: itemContents,
            tokens: []
          });
          list2.raw += raw;
        }
        list2.items[list2.items.length - 1].raw = list2.items[list2.items.length - 1].raw.trimEnd();
        list2.items[list2.items.length - 1].text = list2.items[list2.items.length - 1].text.trimEnd();
        list2.raw = list2.raw.trimEnd();
        for (let i = 0; i < list2.items.length; i++) {
          this.lexer.state.top = false;
          list2.items[i].tokens = this.lexer.blockTokens(list2.items[i].text, []);
          if (!list2.loose) {
            const spacers = list2.items[i].tokens.filter((t) => t.type === "space");
            const hasMultipleLineBreaks = spacers.length > 0 && spacers.some((t) => /\n.*\n/.test(t.raw));
            list2.loose = hasMultipleLineBreaks;
          }
        }
        if (list2.loose) {
          for (let i = 0; i < list2.items.length; i++) {
            list2.items[i].loose = true;
          }
        }
        return list2;
      }
    }
    html(src) {
      const cap = this.rules.block.html.exec(src);
      if (cap) {
        const token = {
          type: "html",
          block: true,
          raw: cap[0],
          pre: cap[1] === "pre" || cap[1] === "script" || cap[1] === "style",
          text: cap[0]
        };
        return token;
      }
    }
    def(src) {
      const cap = this.rules.block.def.exec(src);
      if (cap) {
        const tag2 = cap[1].toLowerCase().replace(/\s+/g, " ");
        const href = cap[2] ? cap[2].replace(/^<(.*)>$/, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "";
        const title = cap[3] ? cap[3].substring(1, cap[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : cap[3];
        return {
          type: "def",
          tag: tag2,
          raw: cap[0],
          href,
          title
        };
      }
    }
    table(src) {
      const cap = this.rules.block.table.exec(src);
      if (!cap) {
        return;
      }
      if (!/[:|]/.test(cap[2])) {
        return;
      }
      const headers = splitCells(cap[1]);
      const aligns = cap[2].replace(/^\||\| *$/g, "").split("|");
      const rows = cap[3] && cap[3].trim() ? cap[3].replace(/\n[ \t]*$/, "").split("\n") : [];
      const item = {
        type: "table",
        raw: cap[0],
        header: [],
        align: [],
        rows: []
      };
      if (headers.length !== aligns.length) {
        return;
      }
      for (const align of aligns) {
        if (/^ *-+: *$/.test(align)) {
          item.align.push("right");
        } else if (/^ *:-+: *$/.test(align)) {
          item.align.push("center");
        } else if (/^ *:-+ *$/.test(align)) {
          item.align.push("left");
        } else {
          item.align.push(null);
        }
      }
      for (let i = 0; i < headers.length; i++) {
        item.header.push({
          text: headers[i],
          tokens: this.lexer.inline(headers[i]),
          header: true,
          align: item.align[i]
        });
      }
      for (const row of rows) {
        item.rows.push(splitCells(row, item.header.length).map((cell, i) => {
          return {
            text: cell,
            tokens: this.lexer.inline(cell),
            header: false,
            align: item.align[i]
          };
        }));
      }
      return item;
    }
    lheading(src) {
      const cap = this.rules.block.lheading.exec(src);
      if (cap) {
        return {
          type: "heading",
          raw: cap[0],
          depth: cap[2].charAt(0) === "=" ? 1 : 2,
          text: cap[1],
          tokens: this.lexer.inline(cap[1])
        };
      }
    }
    paragraph(src) {
      const cap = this.rules.block.paragraph.exec(src);
      if (cap) {
        const text = cap[1].charAt(cap[1].length - 1) === "\n" ? cap[1].slice(0, -1) : cap[1];
        return {
          type: "paragraph",
          raw: cap[0],
          text,
          tokens: this.lexer.inline(text)
        };
      }
    }
    text(src) {
      const cap = this.rules.block.text.exec(src);
      if (cap) {
        return {
          type: "text",
          raw: cap[0],
          text: cap[0],
          tokens: this.lexer.inline(cap[0])
        };
      }
    }
    escape(src) {
      const cap = this.rules.inline.escape.exec(src);
      if (cap) {
        return {
          type: "escape",
          raw: cap[0],
          text: escape$1(cap[1])
        };
      }
    }
    tag(src) {
      const cap = this.rules.inline.tag.exec(src);
      if (cap) {
        if (!this.lexer.state.inLink && /^<a /i.test(cap[0])) {
          this.lexer.state.inLink = true;
        } else if (this.lexer.state.inLink && /^<\/a>/i.test(cap[0])) {
          this.lexer.state.inLink = false;
        }
        if (!this.lexer.state.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
          this.lexer.state.inRawBlock = true;
        } else if (this.lexer.state.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
          this.lexer.state.inRawBlock = false;
        }
        return {
          type: "html",
          raw: cap[0],
          inLink: this.lexer.state.inLink,
          inRawBlock: this.lexer.state.inRawBlock,
          block: false,
          text: cap[0]
        };
      }
    }
    link(src) {
      const cap = this.rules.inline.link.exec(src);
      if (cap) {
        const trimmedUrl = cap[2].trim();
        if (!this.options.pedantic && /^</.test(trimmedUrl)) {
          if (!/>$/.test(trimmedUrl)) {
            return;
          }
          const rtrimSlash = rtrim(trimmedUrl.slice(0, -1), "\\");
          if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) {
            return;
          }
        } else {
          const lastParenIndex = findClosingBracket(cap[2], "()");
          if (lastParenIndex > -1) {
            const start = cap[0].indexOf("!") === 0 ? 5 : 4;
            const linkLen = start + cap[1].length + lastParenIndex;
            cap[2] = cap[2].substring(0, lastParenIndex);
            cap[0] = cap[0].substring(0, linkLen).trim();
            cap[3] = "";
          }
        }
        let href = cap[2];
        let title = "";
        if (this.options.pedantic) {
          const link2 = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);
          if (link2) {
            href = link2[1];
            title = link2[3];
          }
        } else {
          title = cap[3] ? cap[3].slice(1, -1) : "";
        }
        href = href.trim();
        if (/^</.test(href)) {
          if (this.options.pedantic && !/>$/.test(trimmedUrl)) {
            href = href.slice(1);
          } else {
            href = href.slice(1, -1);
          }
        }
        return outputLink(cap, {
          href: href ? href.replace(this.rules.inline.anyPunctuation, "$1") : href,
          title: title ? title.replace(this.rules.inline.anyPunctuation, "$1") : title
        }, cap[0], this.lexer);
      }
    }
    reflink(src, links) {
      let cap;
      if ((cap = this.rules.inline.reflink.exec(src)) || (cap = this.rules.inline.nolink.exec(src))) {
        const linkString = (cap[2] || cap[1]).replace(/\s+/g, " ");
        const link2 = links[linkString.toLowerCase()];
        if (!link2) {
          const text = cap[0].charAt(0);
          return {
            type: "text",
            raw: text,
            text
          };
        }
        return outputLink(cap, link2, cap[0], this.lexer);
      }
    }
    emStrong(src, maskedSrc, prevChar = "") {
      let match = this.rules.inline.emStrongLDelim.exec(src);
      if (!match)
        return;
      if (match[3] && prevChar.match(/[\p{L}\p{N}]/u))
        return;
      const nextChar = match[1] || match[2] || "";
      if (!nextChar || !prevChar || this.rules.inline.punctuation.exec(prevChar)) {
        const lLength = [...match[0]].length - 1;
        let rDelim, rLength, delimTotal = lLength, midDelimTotal = 0;
        const endReg = match[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
        endReg.lastIndex = 0;
        maskedSrc = maskedSrc.slice(-1 * src.length + lLength);
        while ((match = endReg.exec(maskedSrc)) != null) {
          rDelim = match[1] || match[2] || match[3] || match[4] || match[5] || match[6];
          if (!rDelim)
            continue;
          rLength = [...rDelim].length;
          if (match[3] || match[4]) {
            delimTotal += rLength;
            continue;
          } else if (match[5] || match[6]) {
            if (lLength % 3 && !((lLength + rLength) % 3)) {
              midDelimTotal += rLength;
              continue;
            }
          }
          delimTotal -= rLength;
          if (delimTotal > 0)
            continue;
          rLength = Math.min(rLength, rLength + delimTotal + midDelimTotal);
          const lastCharLength = [...match[0]][0].length;
          const raw = src.slice(0, lLength + match.index + lastCharLength + rLength);
          if (Math.min(lLength, rLength) % 2) {
            const text2 = raw.slice(1, -1);
            return {
              type: "em",
              raw,
              text: text2,
              tokens: this.lexer.inlineTokens(text2)
            };
          }
          const text = raw.slice(2, -2);
          return {
            type: "strong",
            raw,
            text,
            tokens: this.lexer.inlineTokens(text)
          };
        }
      }
    }
    codespan(src) {
      const cap = this.rules.inline.code.exec(src);
      if (cap) {
        let text = cap[2].replace(/\n/g, " ");
        const hasNonSpaceChars = /[^ ]/.test(text);
        const hasSpaceCharsOnBothEnds = /^ /.test(text) && / $/.test(text);
        if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
          text = text.substring(1, text.length - 1);
        }
        text = escape$1(text, true);
        return {
          type: "codespan",
          raw: cap[0],
          text
        };
      }
    }
    br(src) {
      const cap = this.rules.inline.br.exec(src);
      if (cap) {
        return {
          type: "br",
          raw: cap[0]
        };
      }
    }
    del(src) {
      const cap = this.rules.inline.del.exec(src);
      if (cap) {
        return {
          type: "del",
          raw: cap[0],
          text: cap[2],
          tokens: this.lexer.inlineTokens(cap[2])
        };
      }
    }
    autolink(src) {
      const cap = this.rules.inline.autolink.exec(src);
      if (cap) {
        let text, href;
        if (cap[2] === "@") {
          text = escape$1(cap[1]);
          href = "mailto:" + text;
        } else {
          text = escape$1(cap[1]);
          href = text;
        }
        return {
          type: "link",
          raw: cap[0],
          text,
          href,
          tokens: [
            {
              type: "text",
              raw: text,
              text
            }
          ]
        };
      }
    }
    url(src) {
      var _a2;
      let cap;
      if (cap = this.rules.inline.url.exec(src)) {
        let text, href;
        if (cap[2] === "@") {
          text = escape$1(cap[0]);
          href = "mailto:" + text;
        } else {
          let prevCapZero;
          do {
            prevCapZero = cap[0];
            cap[0] = ((_a2 = this.rules.inline._backpedal.exec(cap[0])) == null ? void 0 : _a2[0]) ?? "";
          } while (prevCapZero !== cap[0]);
          text = escape$1(cap[0]);
          if (cap[1] === "www.") {
            href = "http://" + cap[0];
          } else {
            href = cap[0];
          }
        }
        return {
          type: "link",
          raw: cap[0],
          text,
          href,
          tokens: [
            {
              type: "text",
              raw: text,
              text
            }
          ]
        };
      }
    }
    inlineText(src) {
      const cap = this.rules.inline.text.exec(src);
      if (cap) {
        let text;
        if (this.lexer.state.inRawBlock) {
          text = cap[0];
        } else {
          text = escape$1(cap[0]);
        }
        return {
          type: "text",
          raw: cap[0],
          text
        };
      }
    }
  }
  const newline = /^(?:[ \t]*(?:\n|$))+/;
  const blockCode = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/;
  const fences = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/;
  const hr = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/;
  const heading = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/;
  const bullet = /(?:[*+-]|\d{1,9}[.)])/;
  const lheading = edit(/^(?!bull |blockCode|fences|blockquote|heading|html)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html))+?)\n {0,3}(=+|-+) *(?:\n+|$)/).replace(/bull/g, bullet).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).getRegex();
  const _paragraph = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/;
  const blockText = /^[^\n]+/;
  const _blockLabel = /(?!\s*\])(?:\\.|[^\[\]\\])+/;
  const def = edit(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", _blockLabel).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex();
  const list = edit(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, bullet).getRegex();
  const _tag = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
  const _comment = /<!--(?:-?>|[\s\S]*?(?:-->|$))/;
  const html = edit("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", _comment).replace("tag", _tag).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
  const paragraph = edit(_paragraph).replace("hr", hr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _tag).getRegex();
  const blockquote = edit(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", paragraph).getRegex();
  const blockNormal = {
    blockquote,
    code: blockCode,
    def,
    fences,
    heading,
    hr,
    html,
    lheading,
    list,
    newline,
    paragraph,
    table: noopTest,
    text: blockText
  };
  const gfmTable = edit("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", hr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _tag).getRegex();
  const blockGfm = {
    ...blockNormal,
    table: gfmTable,
    paragraph: edit(_paragraph).replace("hr", hr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", gfmTable).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _tag).getRegex()
  };
  const blockPedantic = {
    ...blockNormal,
    html: edit(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", _comment).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
    def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
    heading: /^(#{1,6})(.*)(?:\n+|$)/,
    fences: noopTest,
    // fences not supported
    lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
    paragraph: edit(_paragraph).replace("hr", hr).replace("heading", " *#{1,6} *[^\n]").replace("lheading", lheading).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
  };
  const escape = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/;
  const inlineCode = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/;
  const br = /^( {2,}|\\)\n(?!\s*$)/;
  const inlineText = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/;
  const _punctuation = "\\p{P}\\p{S}";
  const punctuation = edit(/^((?![*_])[\spunctuation])/, "u").replace(/punctuation/g, _punctuation).getRegex();
  const blockSkip = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g;
  const emStrongLDelim = edit(/^(?:\*+(?:((?!\*)[punct])|[^\s*]))|^_+(?:((?!_)[punct])|([^\s_]))/, "u").replace(/punct/g, _punctuation).getRegex();
  const emStrongRDelimAst = edit("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)[punct](\\*+)(?=[\\s]|$)|[^punct\\s](\\*+)(?!\\*)(?=[punct\\s]|$)|(?!\\*)[punct\\s](\\*+)(?=[^punct\\s])|[\\s](\\*+)(?!\\*)(?=[punct])|(?!\\*)[punct](\\*+)(?!\\*)(?=[punct])|[^punct\\s](\\*+)(?=[^punct\\s])", "gu").replace(/punct/g, _punctuation).getRegex();
  const emStrongRDelimUnd = edit("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)[punct](_+)(?=[\\s]|$)|[^punct\\s](_+)(?!_)(?=[punct\\s]|$)|(?!_)[punct\\s](_+)(?=[^punct\\s])|[\\s](_+)(?!_)(?=[punct])|(?!_)[punct](_+)(?!_)(?=[punct])", "gu").replace(/punct/g, _punctuation).getRegex();
  const anyPunctuation = edit(/\\([punct])/, "gu").replace(/punct/g, _punctuation).getRegex();
  const autolink = edit(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex();
  const _inlineComment = edit(_comment).replace("(?:-->|$)", "-->").getRegex();
  const tag = edit("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", _inlineComment).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex();
  const _inlineLabel = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
  const link = edit(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/).replace("label", _inlineLabel).replace("href", /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex();
  const reflink = edit(/^!?\[(label)\]\[(ref)\]/).replace("label", _inlineLabel).replace("ref", _blockLabel).getRegex();
  const nolink = edit(/^!?\[(ref)\](?:\[\])?/).replace("ref", _blockLabel).getRegex();
  const reflinkSearch = edit("reflink|nolink(?!\\()", "g").replace("reflink", reflink).replace("nolink", nolink).getRegex();
  const inlineNormal = {
    _backpedal: noopTest,
    // only used for GFM url
    anyPunctuation,
    autolink,
    blockSkip,
    br,
    code: inlineCode,
    del: noopTest,
    emStrongLDelim,
    emStrongRDelimAst,
    emStrongRDelimUnd,
    escape,
    link,
    nolink,
    punctuation,
    reflink,
    reflinkSearch,
    tag,
    text: inlineText,
    url: noopTest
  };
  const inlinePedantic = {
    ...inlineNormal,
    link: edit(/^!?\[(label)\]\((.*?)\)/).replace("label", _inlineLabel).getRegex(),
    reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", _inlineLabel).getRegex()
  };
  const inlineGfm = {
    ...inlineNormal,
    escape: edit(escape).replace("])", "~|])").getRegex(),
    url: edit(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
    _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
    del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
    text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
  };
  const inlineBreaks = {
    ...inlineGfm,
    br: edit(br).replace("{2,}", "*").getRegex(),
    text: edit(inlineGfm.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
  };
  const block = {
    normal: blockNormal,
    gfm: blockGfm,
    pedantic: blockPedantic
  };
  const inline = {
    normal: inlineNormal,
    gfm: inlineGfm,
    breaks: inlineBreaks,
    pedantic: inlinePedantic
  };
  class _Lexer {
    constructor(options) {
      __publicField(this, "tokens");
      __publicField(this, "options");
      __publicField(this, "state");
      __publicField(this, "tokenizer");
      __publicField(this, "inlineQueue");
      this.tokens = [];
      this.tokens.links = /* @__PURE__ */ Object.create(null);
      this.options = options || _defaults;
      this.options.tokenizer = this.options.tokenizer || new _Tokenizer();
      this.tokenizer = this.options.tokenizer;
      this.tokenizer.options = this.options;
      this.tokenizer.lexer = this;
      this.inlineQueue = [];
      this.state = {
        inLink: false,
        inRawBlock: false,
        top: true
      };
      const rules = {
        block: block.normal,
        inline: inline.normal
      };
      if (this.options.pedantic) {
        rules.block = block.pedantic;
        rules.inline = inline.pedantic;
      } else if (this.options.gfm) {
        rules.block = block.gfm;
        if (this.options.breaks) {
          rules.inline = inline.breaks;
        } else {
          rules.inline = inline.gfm;
        }
      }
      this.tokenizer.rules = rules;
    }
    /**
     * Expose Rules
     */
    static get rules() {
      return {
        block,
        inline
      };
    }
    /**
     * Static Lex Method
     */
    static lex(src, options) {
      const lexer = new _Lexer(options);
      return lexer.lex(src);
    }
    /**
     * Static Lex Inline Method
     */
    static lexInline(src, options) {
      const lexer = new _Lexer(options);
      return lexer.inlineTokens(src);
    }
    /**
     * Preprocessing
     */
    lex(src) {
      src = src.replace(/\r\n|\r/g, "\n");
      this.blockTokens(src, this.tokens);
      for (let i = 0; i < this.inlineQueue.length; i++) {
        const next = this.inlineQueue[i];
        this.inlineTokens(next.src, next.tokens);
      }
      this.inlineQueue = [];
      return this.tokens;
    }
    blockTokens(src, tokens = [], lastParagraphClipped = false) {
      if (this.options.pedantic) {
        src = src.replace(/\t/g, "    ").replace(/^ +$/gm, "");
      }
      let token;
      let lastToken;
      let cutSrc;
      while (src) {
        if (this.options.extensions && this.options.extensions.block && this.options.extensions.block.some((extTokenizer) => {
          if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            return true;
          }
          return false;
        })) {
          continue;
        }
        if (token = this.tokenizer.space(src)) {
          src = src.substring(token.raw.length);
          if (token.raw.length === 1 && tokens.length > 0) {
            tokens[tokens.length - 1].raw += "\n";
          } else {
            tokens.push(token);
          }
          continue;
        }
        if (token = this.tokenizer.code(src)) {
          src = src.substring(token.raw.length);
          lastToken = tokens[tokens.length - 1];
          if (lastToken && (lastToken.type === "paragraph" || lastToken.type === "text")) {
            lastToken.raw += "\n" + token.raw;
            lastToken.text += "\n" + token.text;
            this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
          } else {
            tokens.push(token);
          }
          continue;
        }
        if (token = this.tokenizer.fences(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.heading(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.hr(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.blockquote(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.list(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.html(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.def(src)) {
          src = src.substring(token.raw.length);
          lastToken = tokens[tokens.length - 1];
          if (lastToken && (lastToken.type === "paragraph" || lastToken.type === "text")) {
            lastToken.raw += "\n" + token.raw;
            lastToken.text += "\n" + token.raw;
            this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
          } else if (!this.tokens.links[token.tag]) {
            this.tokens.links[token.tag] = {
              href: token.href,
              title: token.title
            };
          }
          continue;
        }
        if (token = this.tokenizer.table(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.lheading(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        cutSrc = src;
        if (this.options.extensions && this.options.extensions.startBlock) {
          let startIndex = Infinity;
          const tempSrc = src.slice(1);
          let tempStart;
          this.options.extensions.startBlock.forEach((getStartIndex) => {
            tempStart = getStartIndex.call({ lexer: this }, tempSrc);
            if (typeof tempStart === "number" && tempStart >= 0) {
              startIndex = Math.min(startIndex, tempStart);
            }
          });
          if (startIndex < Infinity && startIndex >= 0) {
            cutSrc = src.substring(0, startIndex + 1);
          }
        }
        if (this.state.top && (token = this.tokenizer.paragraph(cutSrc))) {
          lastToken = tokens[tokens.length - 1];
          if (lastParagraphClipped && (lastToken == null ? void 0 : lastToken.type) === "paragraph") {
            lastToken.raw += "\n" + token.raw;
            lastToken.text += "\n" + token.text;
            this.inlineQueue.pop();
            this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
          } else {
            tokens.push(token);
          }
          lastParagraphClipped = cutSrc.length !== src.length;
          src = src.substring(token.raw.length);
          continue;
        }
        if (token = this.tokenizer.text(src)) {
          src = src.substring(token.raw.length);
          lastToken = tokens[tokens.length - 1];
          if (lastToken && lastToken.type === "text") {
            lastToken.raw += "\n" + token.raw;
            lastToken.text += "\n" + token.text;
            this.inlineQueue.pop();
            this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
          } else {
            tokens.push(token);
          }
          continue;
        }
        if (src) {
          const errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
          if (this.options.silent) {
            console.error(errMsg);
            break;
          } else {
            throw new Error(errMsg);
          }
        }
      }
      this.state.top = true;
      return tokens;
    }
    inline(src, tokens = []) {
      this.inlineQueue.push({ src, tokens });
      return tokens;
    }
    /**
     * Lexing/Compiling
     */
    inlineTokens(src, tokens = []) {
      let token, lastToken, cutSrc;
      let maskedSrc = src;
      let match;
      let keepPrevChar, prevChar;
      if (this.tokens.links) {
        const links = Object.keys(this.tokens.links);
        if (links.length > 0) {
          while ((match = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) != null) {
            if (links.includes(match[0].slice(match[0].lastIndexOf("[") + 1, -1))) {
              maskedSrc = maskedSrc.slice(0, match.index) + "[" + "a".repeat(match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex);
            }
          }
        }
      }
      while ((match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) != null) {
        maskedSrc = maskedSrc.slice(0, match.index) + "[" + "a".repeat(match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
      }
      while ((match = this.tokenizer.rules.inline.anyPunctuation.exec(maskedSrc)) != null) {
        maskedSrc = maskedSrc.slice(0, match.index) + "++" + maskedSrc.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
      }
      while (src) {
        if (!keepPrevChar) {
          prevChar = "";
        }
        keepPrevChar = false;
        if (this.options.extensions && this.options.extensions.inline && this.options.extensions.inline.some((extTokenizer) => {
          if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            return true;
          }
          return false;
        })) {
          continue;
        }
        if (token = this.tokenizer.escape(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.tag(src)) {
          src = src.substring(token.raw.length);
          lastToken = tokens[tokens.length - 1];
          if (lastToken && token.type === "text" && lastToken.type === "text") {
            lastToken.raw += token.raw;
            lastToken.text += token.text;
          } else {
            tokens.push(token);
          }
          continue;
        }
        if (token = this.tokenizer.link(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.reflink(src, this.tokens.links)) {
          src = src.substring(token.raw.length);
          lastToken = tokens[tokens.length - 1];
          if (lastToken && token.type === "text" && lastToken.type === "text") {
            lastToken.raw += token.raw;
            lastToken.text += token.text;
          } else {
            tokens.push(token);
          }
          continue;
        }
        if (token = this.tokenizer.emStrong(src, maskedSrc, prevChar)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.codespan(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.br(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.del(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.autolink(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (!this.state.inLink && (token = this.tokenizer.url(src))) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        cutSrc = src;
        if (this.options.extensions && this.options.extensions.startInline) {
          let startIndex = Infinity;
          const tempSrc = src.slice(1);
          let tempStart;
          this.options.extensions.startInline.forEach((getStartIndex) => {
            tempStart = getStartIndex.call({ lexer: this }, tempSrc);
            if (typeof tempStart === "number" && tempStart >= 0) {
              startIndex = Math.min(startIndex, tempStart);
            }
          });
          if (startIndex < Infinity && startIndex >= 0) {
            cutSrc = src.substring(0, startIndex + 1);
          }
        }
        if (token = this.tokenizer.inlineText(cutSrc)) {
          src = src.substring(token.raw.length);
          if (token.raw.slice(-1) !== "_") {
            prevChar = token.raw.slice(-1);
          }
          keepPrevChar = true;
          lastToken = tokens[tokens.length - 1];
          if (lastToken && lastToken.type === "text") {
            lastToken.raw += token.raw;
            lastToken.text += token.text;
          } else {
            tokens.push(token);
          }
          continue;
        }
        if (src) {
          const errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
          if (this.options.silent) {
            console.error(errMsg);
            break;
          } else {
            throw new Error(errMsg);
          }
        }
      }
      return tokens;
    }
  }
  class _Renderer {
    // set by the parser
    constructor(options) {
      __publicField(this, "options");
      __publicField(this, "parser");
      this.options = options || _defaults;
    }
    space(token) {
      return "";
    }
    code({ text, lang, escaped }) {
      var _a2;
      const langString = (_a2 = (lang || "").match(/^\S*/)) == null ? void 0 : _a2[0];
      const code = text.replace(/\n$/, "") + "\n";
      if (!langString) {
        return "<pre><code>" + (escaped ? code : escape$1(code, true)) + "</code></pre>\n";
      }
      return '<pre><code class="language-' + escape$1(langString) + '">' + (escaped ? code : escape$1(code, true)) + "</code></pre>\n";
    }
    blockquote({ tokens }) {
      const body = this.parser.parse(tokens);
      return `<blockquote>
${body}</blockquote>
`;
    }
    html({ text }) {
      return text;
    }
    heading({ tokens, depth }) {
      return `<h${depth}>${this.parser.parseInline(tokens)}</h${depth}>
`;
    }
    hr(token) {
      return "<hr>\n";
    }
    list(token) {
      const ordered = token.ordered;
      const start = token.start;
      let body = "";
      for (let j = 0; j < token.items.length; j++) {
        const item = token.items[j];
        body += this.listitem(item);
      }
      const type2 = ordered ? "ol" : "ul";
      const startAttr = ordered && start !== 1 ? ' start="' + start + '"' : "";
      return "<" + type2 + startAttr + ">\n" + body + "</" + type2 + ">\n";
    }
    listitem(item) {
      let itemBody = "";
      if (item.task) {
        const checkbox = this.checkbox({ checked: !!item.checked });
        if (item.loose) {
          if (item.tokens.length > 0 && item.tokens[0].type === "paragraph") {
            item.tokens[0].text = checkbox + " " + item.tokens[0].text;
            if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === "text") {
              item.tokens[0].tokens[0].text = checkbox + " " + item.tokens[0].tokens[0].text;
            }
          } else {
            item.tokens.unshift({
              type: "text",
              raw: checkbox + " ",
              text: checkbox + " "
            });
          }
        } else {
          itemBody += checkbox + " ";
        }
      }
      itemBody += this.parser.parse(item.tokens, !!item.loose);
      return `<li>${itemBody}</li>
`;
    }
    checkbox({ checked }) {
      return "<input " + (checked ? 'checked="" ' : "") + 'disabled="" type="checkbox">';
    }
    paragraph({ tokens }) {
      return `<p>${this.parser.parseInline(tokens)}</p>
`;
    }
    table(token) {
      let header = "";
      let cell = "";
      for (let j = 0; j < token.header.length; j++) {
        cell += this.tablecell(token.header[j]);
      }
      header += this.tablerow({ text: cell });
      let body = "";
      for (let j = 0; j < token.rows.length; j++) {
        const row = token.rows[j];
        cell = "";
        for (let k = 0; k < row.length; k++) {
          cell += this.tablecell(row[k]);
        }
        body += this.tablerow({ text: cell });
      }
      if (body)
        body = `<tbody>${body}</tbody>`;
      return "<table>\n<thead>\n" + header + "</thead>\n" + body + "</table>\n";
    }
    tablerow({ text }) {
      return `<tr>
${text}</tr>
`;
    }
    tablecell(token) {
      const content2 = this.parser.parseInline(token.tokens);
      const type2 = token.header ? "th" : "td";
      const tag2 = token.align ? `<${type2} align="${token.align}">` : `<${type2}>`;
      return tag2 + content2 + `</${type2}>
`;
    }
    /**
     * span level renderer
     */
    strong({ tokens }) {
      return `<strong>${this.parser.parseInline(tokens)}</strong>`;
    }
    em({ tokens }) {
      return `<em>${this.parser.parseInline(tokens)}</em>`;
    }
    codespan({ text }) {
      return `<code>${text}</code>`;
    }
    br(token) {
      return "<br>";
    }
    del({ tokens }) {
      return `<del>${this.parser.parseInline(tokens)}</del>`;
    }
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      const cleanHref = cleanUrl(href);
      if (cleanHref === null) {
        return text;
      }
      href = cleanHref;
      let out = '<a href="' + href + '"';
      if (title) {
        out += ' title="' + title + '"';
      }
      out += ">" + text + "</a>";
      return out;
    }
    image({ href, title, text }) {
      const cleanHref = cleanUrl(href);
      if (cleanHref === null) {
        return text;
      }
      href = cleanHref;
      let out = `<img src="${href}" alt="${text}"`;
      if (title) {
        out += ` title="${title}"`;
      }
      out += ">";
      return out;
    }
    text(token) {
      return "tokens" in token && token.tokens ? this.parser.parseInline(token.tokens) : token.text;
    }
  }
  class _TextRenderer {
    // no need for block level renderers
    strong({ text }) {
      return text;
    }
    em({ text }) {
      return text;
    }
    codespan({ text }) {
      return text;
    }
    del({ text }) {
      return text;
    }
    html({ text }) {
      return text;
    }
    text({ text }) {
      return text;
    }
    link({ text }) {
      return "" + text;
    }
    image({ text }) {
      return "" + text;
    }
    br() {
      return "";
    }
  }
  class _Parser {
    constructor(options) {
      __publicField(this, "options");
      __publicField(this, "renderer");
      __publicField(this, "textRenderer");
      this.options = options || _defaults;
      this.options.renderer = this.options.renderer || new _Renderer();
      this.renderer = this.options.renderer;
      this.renderer.options = this.options;
      this.renderer.parser = this;
      this.textRenderer = new _TextRenderer();
    }
    /**
     * Static Parse Method
     */
    static parse(tokens, options) {
      const parser = new _Parser(options);
      return parser.parse(tokens);
    }
    /**
     * Static Parse Inline Method
     */
    static parseInline(tokens, options) {
      const parser = new _Parser(options);
      return parser.parseInline(tokens);
    }
    /**
     * Parse Loop
     */
    parse(tokens, top = true) {
      let out = "";
      for (let i = 0; i < tokens.length; i++) {
        const anyToken = tokens[i];
        if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[anyToken.type]) {
          const genericToken = anyToken;
          const ret = this.options.extensions.renderers[genericToken.type].call({ parser: this }, genericToken);
          if (ret !== false || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(genericToken.type)) {
            out += ret || "";
            continue;
          }
        }
        const token = anyToken;
        switch (token.type) {
          case "space": {
            out += this.renderer.space(token);
            continue;
          }
          case "hr": {
            out += this.renderer.hr(token);
            continue;
          }
          case "heading": {
            out += this.renderer.heading(token);
            continue;
          }
          case "code": {
            out += this.renderer.code(token);
            continue;
          }
          case "table": {
            out += this.renderer.table(token);
            continue;
          }
          case "blockquote": {
            out += this.renderer.blockquote(token);
            continue;
          }
          case "list": {
            out += this.renderer.list(token);
            continue;
          }
          case "html": {
            out += this.renderer.html(token);
            continue;
          }
          case "paragraph": {
            out += this.renderer.paragraph(token);
            continue;
          }
          case "text": {
            let textToken = token;
            let body = this.renderer.text(textToken);
            while (i + 1 < tokens.length && tokens[i + 1].type === "text") {
              textToken = tokens[++i];
              body += "\n" + this.renderer.text(textToken);
            }
            if (top) {
              out += this.renderer.paragraph({
                type: "paragraph",
                raw: body,
                text: body,
                tokens: [{ type: "text", raw: body, text: body }]
              });
            } else {
              out += body;
            }
            continue;
          }
          default: {
            const errMsg = 'Token with "' + token.type + '" type was not found.';
            if (this.options.silent) {
              console.error(errMsg);
              return "";
            } else {
              throw new Error(errMsg);
            }
          }
        }
      }
      return out;
    }
    /**
     * Parse Inline Tokens
     */
    parseInline(tokens, renderer2) {
      renderer2 = renderer2 || this.renderer;
      let out = "";
      for (let i = 0; i < tokens.length; i++) {
        const anyToken = tokens[i];
        if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[anyToken.type]) {
          const ret = this.options.extensions.renderers[anyToken.type].call({ parser: this }, anyToken);
          if (ret !== false || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(anyToken.type)) {
            out += ret || "";
            continue;
          }
        }
        const token = anyToken;
        switch (token.type) {
          case "escape": {
            out += renderer2.text(token);
            break;
          }
          case "html": {
            out += renderer2.html(token);
            break;
          }
          case "link": {
            out += renderer2.link(token);
            break;
          }
          case "image": {
            out += renderer2.image(token);
            break;
          }
          case "strong": {
            out += renderer2.strong(token);
            break;
          }
          case "em": {
            out += renderer2.em(token);
            break;
          }
          case "codespan": {
            out += renderer2.codespan(token);
            break;
          }
          case "br": {
            out += renderer2.br(token);
            break;
          }
          case "del": {
            out += renderer2.del(token);
            break;
          }
          case "text": {
            out += renderer2.text(token);
            break;
          }
          default: {
            const errMsg = 'Token with "' + token.type + '" type was not found.';
            if (this.options.silent) {
              console.error(errMsg);
              return "";
            } else {
              throw new Error(errMsg);
            }
          }
        }
      }
      return out;
    }
  }
  class _Hooks {
    constructor(options) {
      __publicField(this, "options");
      __publicField(this, "block");
      this.options = options || _defaults;
    }
    /**
     * Process markdown before marked
     */
    preprocess(markdown) {
      return markdown;
    }
    /**
     * Process HTML after marked is finished
     */
    postprocess(html2) {
      return html2;
    }
    /**
     * Process all tokens before walk tokens
     */
    processAllTokens(tokens) {
      return tokens;
    }
    /**
     * Provide function to tokenize markdown
     */
    provideLexer() {
      return this.block ? _Lexer.lex : _Lexer.lexInline;
    }
    /**
     * Provide function to parse tokens
     */
    provideParser() {
      return this.block ? _Parser.parse : _Parser.parseInline;
    }
  }
  __publicField(_Hooks, "passThroughHooks", /* @__PURE__ */ new Set([
    "preprocess",
    "postprocess",
    "processAllTokens"
  ]));
  class Marked {
    constructor(...args) {
      __publicField(this, "defaults", _getDefaults());
      __publicField(this, "options", this.setOptions);
      __publicField(this, "parse", this.parseMarkdown(true));
      __publicField(this, "parseInline", this.parseMarkdown(false));
      __publicField(this, "Parser", _Parser);
      __publicField(this, "Renderer", _Renderer);
      __publicField(this, "TextRenderer", _TextRenderer);
      __publicField(this, "Lexer", _Lexer);
      __publicField(this, "Tokenizer", _Tokenizer);
      __publicField(this, "Hooks", _Hooks);
      this.use(...args);
    }
    /**
     * Run callback for every token
     */
    walkTokens(tokens, callback) {
      var _a2, _b2;
      let values = [];
      for (const token of tokens) {
        values = values.concat(callback.call(this, token));
        switch (token.type) {
          case "table": {
            const tableToken = token;
            for (const cell of tableToken.header) {
              values = values.concat(this.walkTokens(cell.tokens, callback));
            }
            for (const row of tableToken.rows) {
              for (const cell of row) {
                values = values.concat(this.walkTokens(cell.tokens, callback));
              }
            }
            break;
          }
          case "list": {
            const listToken = token;
            values = values.concat(this.walkTokens(listToken.items, callback));
            break;
          }
          default: {
            const genericToken = token;
            if ((_b2 = (_a2 = this.defaults.extensions) == null ? void 0 : _a2.childTokens) == null ? void 0 : _b2[genericToken.type]) {
              this.defaults.extensions.childTokens[genericToken.type].forEach((childTokens) => {
                const tokens2 = genericToken[childTokens].flat(Infinity);
                values = values.concat(this.walkTokens(tokens2, callback));
              });
            } else if (genericToken.tokens) {
              values = values.concat(this.walkTokens(genericToken.tokens, callback));
            }
          }
        }
      }
      return values;
    }
    use(...args) {
      const extensions = this.defaults.extensions || { renderers: {}, childTokens: {} };
      args.forEach((pack) => {
        const opts = { ...pack };
        opts.async = this.defaults.async || opts.async || false;
        if (pack.extensions) {
          pack.extensions.forEach((ext) => {
            if (!ext.name) {
              throw new Error("extension name required");
            }
            if ("renderer" in ext) {
              const prevRenderer = extensions.renderers[ext.name];
              if (prevRenderer) {
                extensions.renderers[ext.name] = function(...args2) {
                  let ret = ext.renderer.apply(this, args2);
                  if (ret === false) {
                    ret = prevRenderer.apply(this, args2);
                  }
                  return ret;
                };
              } else {
                extensions.renderers[ext.name] = ext.renderer;
              }
            }
            if ("tokenizer" in ext) {
              if (!ext.level || ext.level !== "block" && ext.level !== "inline") {
                throw new Error("extension level must be 'block' or 'inline'");
              }
              const extLevel = extensions[ext.level];
              if (extLevel) {
                extLevel.unshift(ext.tokenizer);
              } else {
                extensions[ext.level] = [ext.tokenizer];
              }
              if (ext.start) {
                if (ext.level === "block") {
                  if (extensions.startBlock) {
                    extensions.startBlock.push(ext.start);
                  } else {
                    extensions.startBlock = [ext.start];
                  }
                } else if (ext.level === "inline") {
                  if (extensions.startInline) {
                    extensions.startInline.push(ext.start);
                  } else {
                    extensions.startInline = [ext.start];
                  }
                }
              }
            }
            if ("childTokens" in ext && ext.childTokens) {
              extensions.childTokens[ext.name] = ext.childTokens;
            }
          });
          opts.extensions = extensions;
        }
        if (pack.renderer) {
          const renderer2 = this.defaults.renderer || new _Renderer(this.defaults);
          for (const prop in pack.renderer) {
            if (!(prop in renderer2)) {
              throw new Error(`renderer '${prop}' does not exist`);
            }
            if (["options", "parser"].includes(prop)) {
              continue;
            }
            const rendererProp = prop;
            const rendererFunc = pack.renderer[rendererProp];
            const prevRenderer = renderer2[rendererProp];
            renderer2[rendererProp] = (...args2) => {
              let ret = rendererFunc.apply(renderer2, args2);
              if (ret === false) {
                ret = prevRenderer.apply(renderer2, args2);
              }
              return ret || "";
            };
          }
          opts.renderer = renderer2;
        }
        if (pack.tokenizer) {
          const tokenizer = this.defaults.tokenizer || new _Tokenizer(this.defaults);
          for (const prop in pack.tokenizer) {
            if (!(prop in tokenizer)) {
              throw new Error(`tokenizer '${prop}' does not exist`);
            }
            if (["options", "rules", "lexer"].includes(prop)) {
              continue;
            }
            const tokenizerProp = prop;
            const tokenizerFunc = pack.tokenizer[tokenizerProp];
            const prevTokenizer = tokenizer[tokenizerProp];
            tokenizer[tokenizerProp] = (...args2) => {
              let ret = tokenizerFunc.apply(tokenizer, args2);
              if (ret === false) {
                ret = prevTokenizer.apply(tokenizer, args2);
              }
              return ret;
            };
          }
          opts.tokenizer = tokenizer;
        }
        if (pack.hooks) {
          const hooks = this.defaults.hooks || new _Hooks();
          for (const prop in pack.hooks) {
            if (!(prop in hooks)) {
              throw new Error(`hook '${prop}' does not exist`);
            }
            if (["options", "block"].includes(prop)) {
              continue;
            }
            const hooksProp = prop;
            const hooksFunc = pack.hooks[hooksProp];
            const prevHook = hooks[hooksProp];
            if (_Hooks.passThroughHooks.has(prop)) {
              hooks[hooksProp] = (arg) => {
                if (this.defaults.async) {
                  return Promise.resolve(hooksFunc.call(hooks, arg)).then((ret2) => {
                    return prevHook.call(hooks, ret2);
                  });
                }
                const ret = hooksFunc.call(hooks, arg);
                return prevHook.call(hooks, ret);
              };
            } else {
              hooks[hooksProp] = (...args2) => {
                let ret = hooksFunc.apply(hooks, args2);
                if (ret === false) {
                  ret = prevHook.apply(hooks, args2);
                }
                return ret;
              };
            }
          }
          opts.hooks = hooks;
        }
        if (pack.walkTokens) {
          const walkTokens = this.defaults.walkTokens;
          const packWalktokens = pack.walkTokens;
          opts.walkTokens = function(token) {
            let values = [];
            values.push(packWalktokens.call(this, token));
            if (walkTokens) {
              values = values.concat(walkTokens.call(this, token));
            }
            return values;
          };
        }
        this.defaults = { ...this.defaults, ...opts };
      });
      return this;
    }
    setOptions(opt) {
      this.defaults = { ...this.defaults, ...opt };
      return this;
    }
    lexer(src, options) {
      return _Lexer.lex(src, options ?? this.defaults);
    }
    parser(tokens, options) {
      return _Parser.parse(tokens, options ?? this.defaults);
    }
    parseMarkdown(blockType) {
      const parse = (src, options) => {
        const origOpt = { ...options };
        const opt = { ...this.defaults, ...origOpt };
        const throwError = this.onError(!!opt.silent, !!opt.async);
        if (this.defaults.async === true && origOpt.async === false) {
          return throwError(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
        }
        if (typeof src === "undefined" || src === null) {
          return throwError(new Error("marked(): input parameter is undefined or null"));
        }
        if (typeof src !== "string") {
          return throwError(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(src) + ", string expected"));
        }
        if (opt.hooks) {
          opt.hooks.options = opt;
          opt.hooks.block = blockType;
        }
        const lexer = opt.hooks ? opt.hooks.provideLexer() : blockType ? _Lexer.lex : _Lexer.lexInline;
        const parser = opt.hooks ? opt.hooks.provideParser() : blockType ? _Parser.parse : _Parser.parseInline;
        if (opt.async) {
          return Promise.resolve(opt.hooks ? opt.hooks.preprocess(src) : src).then((src2) => lexer(src2, opt)).then((tokens) => opt.hooks ? opt.hooks.processAllTokens(tokens) : tokens).then((tokens) => opt.walkTokens ? Promise.all(this.walkTokens(tokens, opt.walkTokens)).then(() => tokens) : tokens).then((tokens) => parser(tokens, opt)).then((html2) => opt.hooks ? opt.hooks.postprocess(html2) : html2).catch(throwError);
        }
        try {
          if (opt.hooks) {
            src = opt.hooks.preprocess(src);
          }
          let tokens = lexer(src, opt);
          if (opt.hooks) {
            tokens = opt.hooks.processAllTokens(tokens);
          }
          if (opt.walkTokens) {
            this.walkTokens(tokens, opt.walkTokens);
          }
          let html2 = parser(tokens, opt);
          if (opt.hooks) {
            html2 = opt.hooks.postprocess(html2);
          }
          return html2;
        } catch (e) {
          return throwError(e);
        }
      };
      return parse;
    }
    onError(silent, async) {
      return (e) => {
        e.message += "\nPlease report this to https://github.com/markedjs/marked.";
        if (silent) {
          const msg = "<p>An error occurred:</p><pre>" + escape$1(e.message + "", true) + "</pre>";
          if (async) {
            return Promise.resolve(msg);
          }
          return msg;
        }
        if (async) {
          return Promise.reject(e);
        }
        throw e;
      };
    }
  }
  const markedInstance = new Marked();
  function marked(src, opt) {
    return markedInstance.parse(src, opt);
  }
  marked.options = marked.setOptions = function(options) {
    markedInstance.setOptions(options);
    marked.defaults = markedInstance.defaults;
    changeDefaults(marked.defaults);
    return marked;
  };
  marked.getDefaults = _getDefaults;
  marked.defaults = _defaults;
  marked.use = function(...args) {
    markedInstance.use(...args);
    marked.defaults = markedInstance.defaults;
    changeDefaults(marked.defaults);
    return marked;
  };
  marked.walkTokens = function(tokens, callback) {
    return markedInstance.walkTokens(tokens, callback);
  };
  marked.parseInline = markedInstance.parseInline;
  marked.Parser = _Parser;
  marked.parser = _Parser.parse;
  marked.Renderer = _Renderer;
  marked.TextRenderer = _TextRenderer;
  marked.Lexer = _Lexer;
  marked.lexer = _Lexer.lex;
  marked.Tokenizer = _Tokenizer;
  marked.Hooks = _Hooks;
  marked.parse = marked;
  marked.options;
  marked.setOptions;
  marked.use;
  marked.walkTokens;
  marked.parseInline;
  _Parser.parse;
  _Lexer.lex;
  const _sfc_main$j = {
    props: {
      value: {
        type: Object,
        default: {
          value1: false,
          value2: false,
          title: false,
          btn: true,
          apikey: "",
          baseurl: "https://api.openai.com",
          full_url: "/v1/chat/completions",
          model: "gpt-4o-mini",
          prompt: "根据以下帖子内容进行总结，请使用 markdown 格式返回回答，没有字数限制，但要求文字精炼，简介准确，语言要求返回简体中文，并且进行中英文混排优化。可以通过编号列表（1，2，3）列出核心要点。注意不要输出标题，例如：核心要点总结，帖子总结等，直接输出文本段落。",
          prompt1: "根据以下帖子内容，帮我给作者写一条回复，简短，表明我的观点，用口语回复，不需要很正式。您可以通过讨论的方式进行回复，这将有助于引导其他用户或作者进行互动。",
          prompt2: "根据以下帖子内容，生成一个合适的标题用于社交论坛发布使用，格式要求：不要书名号或其他符号，只需要一句纯文本。尽量精简到 15 字以内，如果字数不够表达主题，可以适当多生成几个字。"
        }
      }
    },
    data() {
      return {
        localChecked: this.value
      };
    },
    watch: {
      value(newValue) {
        this.localChecked = newValue;
      }
    },
    methods: {
      handleChange() {
        this.$emit("update:value", this.localChecked);
      },
      getTopicUrl(url) {
        const regex = /^(https:\/\/linux\.do\/t\/topic\/\d+)(\/\d+)?$/;
        const match = url.match(regex);
        return match ? match[1] : url;
      },
      // 是否开启手动生成
      setCreatedBtn() {
        if (this.localChecked.btn) {
          $("head").append("<style>.aicreated-btn{display:inline-flex!important}</style>");
        }
      },
      // 获取帖子内容并生成总结
      async getPostContent() {
        $(".post-stream").before(
          `<div class="gpt-summary-wrap">
         <div class="gpt-summary">AI 总结：正在使用 AI 总结内容中，请稍后...</div>
          </div>`
        );
        const config = JSON.parse(localStorage.getItem("linxudoscriptssettingDMI")).gptdata;
        return new Promise((resolve2, reject) => {
          const str = $("#topic-title h1 a").text() + $("#post_1 .cooked").text();
          const prompt2 = `${config.prompt}
帖子内容如下：
${str}`;
          fetch(`${config.baseurl}${config.full_url}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${config.apikey}`
            },
            body: JSON.stringify({
              model: config.model,
              messages: [
                {
                  role: "user",
                  content: prompt2
                }
              ],
              temperature: 0.7
            })
          }).then((response) => {
            if (!response.ok) {
              reject(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          }).then((gptData) => {
            $(".gpt-summary").html(`${marked.parse(gptData.choices[0].message.content)}`);
            let summaryCache = JSON.parse(localStorage.getItem("summaryCacheData")) || [];
            const regex = /^(https:\/\/linux\.do\/t\/topic\/\d+)(\/\d+)?$/;
            const match = window.location.href.match(regex)[1];
            let existingObject = summaryCache.find((item) => item.name == match);
            let newObject = {
              name: match,
              value: gptData.choices[0].message.content
            };
            if (existingObject) {
              existingObject.value = newObject.value;
            } else {
              summaryCache.push(newObject);
            }
            localStorage.setItem("summaryCacheData", JSON.stringify(summaryCache));
            resolve2();
          }).catch((error) => {
            $(".gpt-summary").html(`生成失败，请检查配置是否正确并刷新重试！`);
            console.log(error);
          });
        });
      },
      // 生成 AI 回复
      async setAIRelpy() {
        $(".aireply-popup").show();
        $(".aireply-popup-text").html("AI 推荐回复正在生成中，请稍后。。。");
        const config = JSON.parse(localStorage.getItem("linxudoscriptssettingDMI")).gptdata;
        return new Promise((resolve2, reject) => {
          const str = $("#topic-title h1 a").text() + $("#post_1 .cooked").text();
          const prompt2 = `${config.prompt1}
帖子内容如下：
${str}`;
          fetch(`${config.baseurl}${config.full_url}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${config.apikey}`
            },
            body: JSON.stringify({
              model: config.model,
              messages: [
                {
                  role: "user",
                  content: prompt2
                }
              ],
              temperature: 0.7
            })
          }).then((response) => {
            if (!response.ok) {
              reject(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          }).then((gptData) => {
            this.AIReplyPopup(gptData.choices[0].message.content);
            resolve2();
          }).catch((error) => {
            console.log(error);
          });
        });
      },
      // 推荐回复弹窗
      AIReplyPopup(text) {
        $(".aireply-popup-text").html(text);
      },
      // AI 根据新建话题内容生成标题
      async getCreateNewTopicTitle() {
        return new Promise((resolve2, reject) => {
          const topic_contentdata = $(".d-editor-preview").html();
          const config = JSON.parse(localStorage.getItem("linxudoscriptssettingDMI")).gptdata;
          const prompt2 = `${config.prompt2}
帖子内容如下：
${topic_contentdata}`;
          fetch(`${config.baseurl}${config.full_url}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${config.apikey}`
            },
            body: JSON.stringify({
              model: config.model,
              messages: [
                {
                  role: "user",
                  content: prompt2
                }
              ],
              temperature: 0.7
            })
          }).then((response) => {
            if (!response.ok) {
              reject(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          }).then((gptData) => {
            $("#reply-title").val(gptData.choices[0].message.content);
            resolve2();
          }).catch((error) => {
            console.log(error);
            $("#reply-title").val(`抱歉生成失败，请检查配置或者反馈给开发者！`);
          });
        });
      }
    },
    async created() {
      if (this.localChecked.value2) {
        $("body").append(`
        <div class="aireply-popup">
          <textarea class="aireply-popup-text"></textarea>
          <button class="aireply-popup-close">关闭</button>
        </div>
      `);
        setInterval(() => {
          if ($(".gpt-summary-wrap").length < 1 && $(".aireplay-btn").length < 1) {
            $("#topic-title").after(
              `<button class="aireplay-btn" type="button">AI 回复</button>`
            );
            $(".aireplay-btn").click(() => {
              this.setAIRelpy();
            });
            $(".aireply-popup-close").click(() => {
              $(".aireply-popup").hide();
              $(".aireply-popup-text").html("AI 推荐回复正在生成中，请稍后。。。");
            });
          }
        }, 1e3);
      }
      if (this.localChecked.value1) {
        setInterval(() => {
          if ($(".gpt-summary-wrap").length < 1 && $(".aicreated-btn").length < 1) {
            $("#topic-title").after(
              `<button class="aicreated-btn" type="button">AI 总结</button>`
            );
            $(".aicreated-btn").click(() => {
              $(".gpt-summary-wrap").remove();
              this.getPostContent();
            });
          }
        }, 1e3);
        this.setCreatedBtn();
        setInterval(() => {
          if ($(".post-stream").length > 0) {
            if ($(".gpt-summary-wrap").length < 1) {
              let summaryCache = JSON.parse(localStorage.getItem("summaryCacheData")) || [];
              const regex = /^(https:\/\/linux\.do\/t\/topic\/\d+)(\/\d+)?$/;
              const match = window.location.href.match(regex)[1];
              let existingObject = summaryCache.find((item) => item.name === match);
              if (existingObject) {
                $(".post-stream").before(
                  `<div class="gpt-summary-wrap">
<div class="gpt-summary">${marked.parse(existingObject.value)}</div>
</div>`
                );
              }
            }
            if (!this.localChecked.btn) {
              if ($(".gpt-summary-wrap").length < 1) {
                this.getPostContent();
              }
            }
            $(".topic-list .main-link a.title").click(() => {
              $(".gpt-summary-wrap").remove();
            });
          }
        }, 1e3);
      }
      if (this.localChecked.title) {
        setInterval(() => {
          if ($(".action-title").length > 0) {
            if ($(".action-title").html().includes("创建新话题")) {
              if ($(".aicreatenewtopictitle").length < 1) {
                $(".action-title").append(
                  '<span class="aicreatenewtopictitle">AI 生成标题</span>'
                );
                $(".aicreatenewtopictitle").click(() => {
                  $("#reply-title").val("正在生成中，请稍后...");
                  this.getCreateNewTopicTitle();
                });
              }
            }
          }
        }, 1e3);
        let summaryCacheData = JSON.parse(localStorage.getItem("summaryCacheData")) || [];
        if (summaryCacheData.length > 20) {
          summaryCacheData = summaryCacheData.slice(-20);
        }
        localStorage.setItem("summaryCacheData", JSON.stringify(summaryCacheData));
      }
    }
  };
  const _hoisted_1$f = { class: "item" };
  const _hoisted_2$4 = { class: "item" };
  const _hoisted_3$3 = { class: "item" };
  const _hoisted_4$3 = { class: "item" };
  const _hoisted_5$2 = { class: "flex" };
  function _sfc_render$j(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", null, [
      createBaseVNode("div", _hoisted_1$f, [
        _cache[15] || (_cache[15] = createBaseVNode(
          "div",
          { class: "tit" },
          "1. 是否开启 AI 生成话题总结",
          -1
          /* HOISTED */
        )),
        withDirectives(createBaseVNode(
          "input",
          {
            type: "checkbox",
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.localChecked.value1 = $event),
            onChange: _cache[1] || (_cache[1] = (...args) => $options.handleChange && $options.handleChange(...args))
          },
          null,
          544
          /* NEED_HYDRATION, NEED_PATCH */
        ), [
          [vModelCheckbox, $data.localChecked.value1]
        ])
      ]),
      createBaseVNode("div", _hoisted_2$4, [
        _cache[16] || (_cache[16] = createBaseVNode(
          "div",
          { class: "tit" },
          "2. 是否显示手动总结按钮",
          -1
          /* HOISTED */
        )),
        withDirectives(createBaseVNode(
          "input",
          {
            type: "checkbox",
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.localChecked.btn = $event),
            onChange: _cache[3] || (_cache[3] = (...args) => $options.handleChange && $options.handleChange(...args))
          },
          null,
          544
          /* NEED_HYDRATION, NEED_PATCH */
        ), [
          [vModelCheckbox, $data.localChecked.btn]
        ])
      ]),
      createBaseVNode("div", _hoisted_3$3, [
        _cache[17] || (_cache[17] = createBaseVNode(
          "div",
          { class: "tit" },
          "3. 是否开启 AI 生成回复推荐",
          -1
          /* HOISTED */
        )),
        withDirectives(createBaseVNode(
          "input",
          {
            type: "checkbox",
            "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.localChecked.value2 = $event),
            onChange: _cache[5] || (_cache[5] = (...args) => $options.handleChange && $options.handleChange(...args))
          },
          null,
          544
          /* NEED_HYDRATION, NEED_PATCH */
        ), [
          [vModelCheckbox, $data.localChecked.value2]
        ])
      ]),
      createBaseVNode("div", _hoisted_4$3, [
        _cache[18] || (_cache[18] = createBaseVNode(
          "div",
          { class: "tit" },
          "4. 新建话题使用 AI 生成标题",
          -1
          /* HOISTED */
        )),
        withDirectives(createBaseVNode(
          "input",
          {
            type: "checkbox",
            "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $data.localChecked.title = $event),
            onChange: _cache[7] || (_cache[7] = (...args) => $options.handleChange && $options.handleChange(...args))
          },
          null,
          544
          /* NEED_HYDRATION, NEED_PATCH */
        ), [
          [vModelCheckbox, $data.localChecked.title]
        ])
      ]),
      _cache[19] || (_cache[19] = createBaseVNode(
        "div",
        { class: "item" },
        [
          createBaseVNode("div", { class: "tit" }, "5. 配置信息")
        ],
        -1
        /* HOISTED */
      )),
      withDirectives(createBaseVNode(
        "input",
        {
          type: "text",
          "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $data.localChecked.apikey = $event),
          placeholder: "sk-xxxxxxxx"
        },
        null,
        512
        /* NEED_PATCH */
      ), [
        [vModelText, $data.localChecked.apikey]
      ]),
      createBaseVNode("div", _hoisted_5$2, [
        withDirectives(createBaseVNode(
          "input",
          {
            style: { "width": "33%" },
            type: "text",
            "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $data.localChecked.baseurl = $event),
            placeholder: "https://api.openai.com"
          },
          null,
          512
          /* NEED_PATCH */
        ), [
          [vModelText, $data.localChecked.baseurl]
        ]),
        withDirectives(createBaseVNode(
          "input",
          {
            style: { "width": "32%", "margin-left": "1%" },
            type: "text",
            "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => $data.localChecked.full_url = $event),
            placeholder: "/v1/chat/completions"
          },
          null,
          512
          /* NEED_PATCH */
        ), [
          [vModelText, $data.localChecked.full_url]
        ]),
        withDirectives(createBaseVNode(
          "input",
          {
            style: { "width": "32%", "margin-left": "1%" },
            type: "text",
            "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => $data.localChecked.model = $event),
            placeholder: "模型，如：gpt-4o-mini"
          },
          null,
          512
          /* NEED_PATCH */
        ), [
          [vModelText, $data.localChecked.model]
        ])
      ]),
      _cache[20] || (_cache[20] = createBaseVNode(
        "div",
        { class: "item" },
        "6. AI 总结帖子 prompt:",
        -1
        /* HOISTED */
      )),
      withDirectives(createBaseVNode(
        "textarea",
        {
          "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => $data.localChecked.prompt = $event)
        },
        null,
        512
        /* NEED_PATCH */
      ), [
        [vModelText, $data.localChecked.prompt]
      ]),
      _cache[21] || (_cache[21] = createBaseVNode(
        "div",
        { class: "item" },
        "7. AI 生成回复 prompt:",
        -1
        /* HOISTED */
      )),
      withDirectives(createBaseVNode(
        "textarea",
        {
          "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => $data.localChecked.prompt1 = $event)
        },
        null,
        512
        /* NEED_PATCH */
      ), [
        [vModelText, $data.localChecked.prompt1]
      ]),
      _cache[22] || (_cache[22] = createBaseVNode(
        "div",
        { class: "item" },
        "8. AI 生成标题 prompt:",
        -1
        /* HOISTED */
      )),
      withDirectives(createBaseVNode(
        "textarea",
        {
          "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => $data.localChecked.prompt2 = $event)
        },
        null,
        512
        /* NEED_PATCH */
      ), [
        [vModelText, $data.localChecked.prompt2]
      ]),
      _cache[23] || (_cache[23] = createBaseVNode(
        "div",
        {
          class: "item",
          style: { "margin-top": "10px" }
        },
        " 注意：请按照指定格式填写参数；不支持 http，请使用 https。 ",
        -1
        /* HOISTED */
      ))
    ]);
  }
  const GPTconfig = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$j], ["__scopeId", "data-v-ce316007"], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/AIConfig/GPTconfig.vue"]]);
  const _sfc_main$i = {
    props: ["modelValue"],
    emits: ["update:modelValue"],
    data() {
      return {
        radio: this.modelValue,
        // 初始化 radio
        list: [
          {
            id: 0,
            name: "ls-themes0",
            imgurl: ""
          },
          {
            id: 6,
            name: "ls-themes6",
            imgurl: "https://linux.do/uploads/default/original/3X/d/9/d935995d90221b7acdde23df142ba7bbe3c38bf0.png"
          },
          {
            id: 5,
            name: "ls-themes5",
            imgurl: "https://linux.do/uploads/default/optimized/3X/3/a/3a9cfbddfd2385ec4c638a10b15055220332e65c_2_1035x565.png"
          },
          {
            id: 4,
            name: "ls-themes4",
            imgurl: "https://linux.do/uploads/default/optimized/3X/8/f/8fb7fe2251b44a6ea1831055bf5ac3ef2c12b4ea_2_1035x544.jpeg"
          },
          {
            id: 3,
            name: "ls-themes3",
            imgurl: "https://linux.do/uploads/default/optimized/3X/2/5/25f83e28507a9ec9fe8ad41874ed578c2e007ff6_2_1035x544.jpeg"
          },
          {
            id: 2,
            name: "ls-themes2",
            imgurl: "https://linux.do/uploads/default/optimized/3X/b/b/bbaa57335e0eab7e4db7ddb5944b613ce0cb5b89_2_1035x544.jpeg"
          },
          {
            id: 1,
            name: "ls-themes1",
            imgurl: "https://linux.do/uploads/default/optimized/3X/2/f/2f1a0d87acb496eb544e17a72022c58ccfd72104_2_1035x544.jpeg"
          }
        ],
        jsonData: [
          {
            id: 1,
            content: "<link href='https://forum.godotengine.org/stylesheets/color_definitions_godot-light_14_5_bfb37f9ae1fb41e9775aafca6e20cddcf38a5ef5.css' media='all' rel='stylesheet' class='light-scheme'><link href='https://forum.godotengine.org/stylesheets/color_definitions_godot-dark_15_5_5ddd0db082f3ae82a3ba77b0ccd1e9a549731798.css' media='(prefers-color-scheme:dark)' rel='stylesheet' class='dark-scheme'><link href='https://forum.godotengine.org/stylesheets/desktop_6551c8b35c64f23dde7a58f9883f833dcb41d6c2.css' media='all' rel='stylesheet' data-target='desktop'><link href='https://forum.godotengine.org/stylesheets/checklist_6551c8b35c64f23dde7a58f9883f833dcb41d6c2.css' media='all' rel='stylesheet' data-target='checklist'><link href='https://forum.godotengine.org/stylesheets/discourse-details_6551c8b35c64f23dde7a58f9883f833dcb41d6c2.css' media='all' rel='stylesheet' data-target='discourse-details'><link href='https://forum.godotengine.org/stylesheets/discourse-lazy-videos_6551c8b35c64f23dde7a58f9883f833dcb41d6c2.css' media='all' rel='stylesheet' data-target='discourse-lazy-videos'><link href='https://forum.godotengine.org/stylesheets/discourse-local-dates_6551c8b35c64f23dde7a58f9883f833dcb41d6c2.css' media='all' rel='stylesheet' data-target='discourse-local-dates'><link href='https://forum.godotengine.org/stylesheets/discourse-narrative-bot_6551c8b35c64f23dde7a58f9883f833dcb41d6c2.css' media='all' rel='stylesheet' data-target='discourse-narrative-bot'><link href='https://forum.godotengine.org/stylesheets/discourse-presence_6551c8b35c64f23dde7a58f9883f833dcb41d6c2.css' media='all' rel='stylesheet' data-target='discourse-presence'><link href='https://forum.godotengine.org/stylesheets/discourse-solved_6551c8b35c64f23dde7a58f9883f833dcb41d6c2.css' media='all' rel='stylesheet' data-target='discourse-solved'><link href='https://forum.godotengine.org/stylesheets/docker_manager_6551c8b35c64f23dde7a58f9883f833dcb41d6c2.css' media='all' rel='stylesheet' data-target='docker_manager'><link href='https://forum.godotengine.org/stylesheets/footnote_6551c8b35c64f23dde7a58f9883f833dcb41d6c2.css' media='all' rel='stylesheet' data-target='footnote'><link href='https://forum.godotengine.org/stylesheets/poll_6551c8b35c64f23dde7a58f9883f833dcb41d6c2.css' media='all' rel='stylesheet' data-target='poll'><link href='https://forum.godotengine.org/stylesheets/spoiler-alert_6551c8b35c64f23dde7a58f9883f833dcb41d6c2.css' media='all' rel='stylesheet' data-target='spoiler-alert'><link href='https://forum.godotengine.org/stylesheets/poll_desktop_6551c8b35c64f23dde7a58f9883f833dcb41d6c2.css' media='all' rel='stylesheet' data-target='poll_desktop'><link href='https://forum.godotengine.org/stylesheets/desktop_theme_9_818c40f50955dc75b8ee82ebc6b63677c57bad1a.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='9' data-theme-name='custom header links'><link href='https://forum.godotengine.org/stylesheets/desktop_theme_3_da63025974d890f429338f0221ce160e14b07fc7.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='3' data-theme-name='godot tweaks'><link href='https://forum.godotengine.org/stylesheets/desktop_theme_12_279dc32ddce5227f4513713baa0e0caf3dc6f846.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='12' data-theme-name='post badges'><link href='https://forum.godotengine.org/stylesheets/desktop_theme_7_b736b09c69b69b5359282426c2559c196e5d619e.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='7' data-theme-name='search banner'><link href='https://forum.godotengine.org/stylesheets/desktop_theme_5_73982ca8b55af63e007c66d4bd9ddc7af40f0b7f.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='5' data-theme-name='godot theme'>"
          },
          {
            id: 2,
            content: "<link href='https://sea2.discourse-cdn.com/hellohellohello/stylesheets/color_definitions_hf-light_3_4_e9f0e3d0b716595aad22a8443d01cdbaf9dff610.css' media='all' rel='stylesheet' class='light-scheme'><link href='https://sea2.discourse-cdn.com/hellohellohello/stylesheets/color_definitions_hf-dark_4_4_a909a408a44c8e15765a6792c5aa2abab3fbfdfc.css' media='(prefers-color-scheme:dark)' rel='stylesheet' class='dark-scheme'><link href='https://sea2.discourse-cdn.com/hellohellohello/stylesheets/desktop_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css' media='all' rel='stylesheet' data-target='desktop'><link href='https://sea2.discourse-cdn.com/hellohellohello/stylesheets/checklist_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css' media='all' rel='stylesheet' data-target='checklist'><link href='https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-adplugin_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css' media='all' rel='stylesheet' data-target='discourse-adplugin'><link href='https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-ai_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css' media='all' rel='stylesheet' data-target='discourse-ai'><link href='https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-akismet_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css' media='all' rel='stylesheet' data-target='discourse-akismet'><link href='https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-cakeday_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css' media='all' rel='stylesheet' data-target='discourse-cakeday'><link href='https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-details_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css' media='all' rel='stylesheet' data-target='discourse-details'><link href='https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-lazy-videos_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css' media='all' rel='stylesheet' data-target='discourse-lazy-videos'><link href='https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-local-dates_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css' media='all' rel='stylesheet' data-target='discourse-local-dates'><link href='https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-math_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css' media='all' rel='stylesheet' data-target='discourse-math'><link href='https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-narrative-bot_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css' media='all' rel='stylesheet' data-target='discourse-narrative-bot'><link href='https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-policy_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css' media='all' rel='stylesheet' data-target='discourse-policy'><link href='https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-presence_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css' media='all' rel='stylesheet' data-target='discourse-presence'><link href='https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-reactions_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css' media='all' rel='stylesheet' data-target='discourse-reactions'><link href='https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-solved_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css' media='all' rel='stylesheet' data-target='discourse-solved'><link href='https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-templates_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css' media='all' rel='stylesheet' data-target='discourse-templates'><link href='https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-topic-voting_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css' media='all' rel='stylesheet' data-target='discourse-topic-voting'><link href='https://sea2.discourse-cdn.com/hellohellohello/stylesheets/footnote_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css' media='all' rel='stylesheet' data-target='footnote'><link href='https://sea2.discourse-cdn.com/hellohellohello/stylesheets/hosted-site_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css' media='all' rel='stylesheet' data-target='hosted-site'><link href='https://sea2.discourse-cdn.com/hellohellohello/stylesheets/poll_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css' media='all' rel='stylesheet' data-target='poll'><link href='https://sea2.discourse-cdn.com/hellohellohello/stylesheets/spoiler-alert_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css' media='all' rel='stylesheet' data-target='spoiler-alert'><link href='https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-ai_desktop_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css' media='all' rel='stylesheet' data-target='discourse-ai_desktop'><link href='https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-reactions_desktop_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css' media='all' rel='stylesheet' data-target='discourse-reactions_desktop'><link href='https://sea2.discourse-cdn.com/hellohellohello/stylesheets/discourse-topic-voting_desktop_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css' media='all' rel='stylesheet' data-target='discourse-topic-voting_desktop'><link href='https://sea2.discourse-cdn.com/hellohellohello/stylesheets/poll_desktop_9690da8ac361c476ab1b25cc9aaade81b0eb2977.css' media='all' rel='stylesheet' data-target='poll_desktop'><link href='https://sea2.discourse-cdn.com/hellohellohello/stylesheets/desktop_theme_4_dc1402c93670f70f3de138ee4819934dae9704d0.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='4' data-theme-name='discourse-huggingface-theme'>"
          },
          {
            id: 3,
            content: "<link href='https://dub2.discourse-cdn.com/unity/stylesheets/desktop_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css' media='all' rel='stylesheet' data-target='desktop'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/checklist_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css' media='all' rel='stylesheet' data-target='checklist'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/discourse-akismet_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css' media='all' rel='stylesheet' data-target='discourse-akismet'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/discourse-cakeday_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css' media='all' rel='stylesheet' data-target='discourse-cakeday'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/discourse-custom-topic-lists_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css' media='all' rel='stylesheet' data-target='discourse-custom-topic-lists'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/discourse-data-explorer_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css' media='all' rel='stylesheet' data-target='discourse-data-explorer'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/discourse-details_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css' media='all' rel='stylesheet' data-target='discourse-details'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/discourse-lazy-videos_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css' media='all' rel='stylesheet' data-target='discourse-lazy-videos'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/discourse-local-dates_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css' media='all' rel='stylesheet' data-target='discourse-local-dates'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/discourse-math_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css' media='all' rel='stylesheet' data-target='discourse-math'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/discourse-narrative-bot_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css' media='all' rel='stylesheet' data-target='discourse-narrative-bot'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/discourse-policy_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css' media='all' rel='stylesheet' data-target='discourse-policy'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/discourse-post-voting_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css' media='all' rel='stylesheet' data-target='discourse-post-voting'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/discourse-presence_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css' media='all' rel='stylesheet' data-target='discourse-presence'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/discourse-preset-topic-composer_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css' media='all' rel='stylesheet' data-target='discourse-preset-topic-composer'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/discourse-reactions_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css' media='all' rel='stylesheet' data-target='discourse-reactions'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/discourse-rss-polling_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css' media='all' rel='stylesheet' data-target='discourse-rss-polling'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/discourse-signatures_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css' media='all' rel='stylesheet' data-target='discourse-signatures'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/discourse-solved_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css' media='all' rel='stylesheet' data-target='discourse-solved'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/discourse-templates_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css' media='all' rel='stylesheet' data-target='discourse-templates'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/discourse-user-notes_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css' media='all' rel='stylesheet' data-target='discourse-user-notes'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/footnote_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css' media='all' rel='stylesheet' data-target='footnote'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/hosted-site_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css' media='all' rel='stylesheet' data-target='hosted-site'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/poll_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css' media='all' rel='stylesheet' data-target='poll'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/spoiler-alert_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css' media='all' rel='stylesheet' data-target='spoiler-alert'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/discourse-post-voting_desktop_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css' media='all' rel='stylesheet' data-target='discourse-post-voting_desktop'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/discourse-reactions_desktop_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css' media='all' rel='stylesheet' data-target='discourse-reactions_desktop'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/poll_desktop_cfd252fc4676c9752a6eddc24d305200f1bae9d3.css' media='all' rel='stylesheet' data-target='poll_desktop'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_21_7ad18baff84d86d2854bef0ea3531d2b132f80e7.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='21' data-theme-name='category badge styles'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_43_3f15e2f66fc3e5c3aebf2b816db682ffddd62aec.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='43' data-theme-name='category banners'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_44_76340a944941297c187ed34184cc60417a9431da.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='44' data-theme-name='category icons'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_41_5dae38cddbdae9477debd421890ea804b79ec6bb.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='41' data-theme-name='collapsible category groups'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_2_7e9be53a9033f4321fe3ff84ac7ac5916c6f7422.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='2' data-theme-name='dark-light toggle'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_14_11cc9920871247240c539d33b999ff8565c0528e.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='14' data-theme-name='discotoc'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_22_60ced06ad2f59e47b7897d05ee076d301232f5fd.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='22' data-theme-name='discourse-icon'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_13_56d83ffa5ca70edecf74b36d321e04576f4ef1b8.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='13' data-theme-name='discourse-mermaid-theme-component'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_6_953aa87e9ac9cc51e20305e98e782fbec1b0decd.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='6' data-theme-name='discourse-search-banner'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_45_726192e6534fe4d91047ee004c17310f78672e52.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='45' data-theme-name='experimental filter component'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_46_07c0c0f168d9030b56037a94a177640f8e52ed4a.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='46' data-theme-name='full width'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_15_f7eb451c3ff264d93f495b3d6fac50216f49e72d.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='15' data-theme-name='image comparison slider'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_16_5b0101e1835bb5a0e53726e669f272edb9d23bbd.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='16' data-theme-name='pdf previews'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_48_e048fdfd4a9755e059453bb30952ad45bf05e097.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='48' data-theme-name='tag icons'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_17_91ca32199f3209aafcae04ddf03498ed470c69f1.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='17' data-theme-name='tiles - gallery component'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_18_0559ffde96204857d0ebc8c686798e0873b0c584.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='18' data-theme-name='topic thumbnails'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_28_1fc38880197870acc63fb0a16acf5aced129415b.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='28' data-theme-name='unformatted code detector'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_49_b140cc9a50e4dd4d7f5154a7adfd1c85c59e3b63.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='49' data-theme-name='unity: brand identity'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_25_30313f97df8e6b00d3ee8693aa3671cce7c9919a.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='25' data-theme-name='unity: dsa'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_12_132a4fbaac41ffa5dd9101b35885f1a153acdbc5.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='12' data-theme-name='unity: onetrust'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_50_cb48ef097d7269de9b930e7a46b126ce5b9df9e4.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='50' data-theme-name='unity: theme extras'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_10_36ca6f6783651cde9551aca71e209742439766d4.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='10' data-theme-name='unity'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_51_285c9656e620803a07e356ce8cb738d955d8ad2d.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='51' data-theme-name='hotfix: restyle experimental topic summary'><link href='https://dub2.discourse-cdn.com/unity/stylesheets/desktop_theme_24_5c1029e2582d7c1b73ef31e86f4ea0f297bd8a06.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='24' data-theme-name='override-mermaid-styles'>"
          },
          {
            id: 4,
            content: "<link href='https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/color_definitions_google-ai-for-developers_8_2_a146065001d103c6f508d0aecd9795e2b85e0231.css' media='all' rel='stylesheet' class='light-scheme'><link href='https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/desktop_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css' media='all' rel='stylesheet' data-target='desktop'><link href='https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/checklist_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css' media='all' rel='stylesheet' data-target='checklist'><link href='https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-ai_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css' media='all' rel='stylesheet' data-target='discourse-ai'><link href='https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-akismet_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css' media='all' rel='stylesheet' data-target='discourse-akismet'><link href='https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-cakeday_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css' media='all' rel='stylesheet' data-target='discourse-cakeday'><link href='https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-data-explorer_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css' media='all' rel='stylesheet' data-target='discourse-data-explorer'><link href='https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-details_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css' media='all' rel='stylesheet' data-target='discourse-details'><link href='https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-lazy-videos_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css' media='all' rel='stylesheet' data-target='discourse-lazy-videos'><link href='https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-local-dates_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css' media='all' rel='stylesheet' data-target='discourse-local-dates'><link href='https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-narrative-bot_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css' media='all' rel='stylesheet' data-target='discourse-narrative-bot'><link href='https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-policy_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css' media='all' rel='stylesheet' data-target='discourse-policy'><link href='https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-presence_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css' media='all' rel='stylesheet' data-target='discourse-presence'><link href='https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-reactions_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css' media='all' rel='stylesheet' data-target='discourse-reactions'><link href='https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-solved_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css' media='all' rel='stylesheet' data-target='discourse-solved'><link href='https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-templates_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css' media='all' rel='stylesheet' data-target='discourse-templates'><link href='https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-topic-voting_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css' media='all' rel='stylesheet' data-target='discourse-topic-voting'><link href='https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/footnote_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css' media='all' rel='stylesheet' data-target='footnote'><link href='https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/hosted-site_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css' media='all' rel='stylesheet' data-target='hosted-site'><link href='https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/poll_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css' media='all' rel='stylesheet' data-target='poll'><link href='https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/spoiler-alert_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css' media='all' rel='stylesheet' data-target='spoiler-alert'><link href='https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-ai_desktop_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css' media='all' rel='stylesheet' data-target='discourse-ai_desktop'><link href='https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-reactions_desktop_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css' media='all' rel='stylesheet' data-target='discourse-reactions_desktop'><link href='https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/discourse-topic-voting_desktop_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css' media='all' rel='stylesheet' data-target='discourse-topic-voting_desktop'><link href='https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/poll_desktop_512b34b3c789d4724f7cb6afc7f9dbb5bdcf63bc.css' media='all' rel='stylesheet' data-target='poll_desktop'><link href='https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/desktop_theme_4_89b44c1aa4a914829f5dab76be36f050017112fd.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='4' data-theme-name='discourse header search'><link href='https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/desktop_theme_3_a8a980bc06c18d3fc858c318921f96f6581459cf.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='3' data-theme-name='discourse-material-icons'><link href='https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/desktop_theme_9_ad782db09c6a21e86f43e7f9fbbaa30324037bf5.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='9' data-theme-name='global notice custom css'><link href='https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/desktop_theme_8_878e84961d78833adf9238d6eda91eb9292d7ed3.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='8' data-theme-name='temp nav fixes'><link href='https://yyz1.discourse-cdn.com/googleaitrial/stylesheets/desktop_theme_2_c35f48dbd27cfaac6e78670aa85b8a0bd9a462fa.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='2' data-theme-name='google ai'>"
          },
          {
            id: 5,
            content: "<link href='https://forum.ksec.co.uk/stylesheets/color_definitions_light_7_2_5186d2d3066aedb3bfcac1027d47b8b0b5350afb.css' media='all' rel='stylesheet' class='light-scheme'><link href='https://forum.ksec.co.uk/stylesheets/color_definitions_dark_1_2_a0603164c6b779ba925871d7963187c6a6dfa8d0.css' media='(prefers-color-scheme:dark)' rel='stylesheet' class='dark-scheme'><link href='https://forum.ksec.co.uk/stylesheets/desktop_1f2801adf122e33ac71771f0a0d92bf223707572.css' media='all' rel='stylesheet' data-target='desktop'><link href='https://forum.ksec.co.uk/stylesheets/checklist_1f2801adf122e33ac71771f0a0d92bf223707572.css' media='all' rel='stylesheet' data-target='checklist'><link href='https://forum.ksec.co.uk/stylesheets/discourse-ai_1f2801adf122e33ac71771f0a0d92bf223707572.css' media='all' rel='stylesheet' data-target='discourse-ai'><link href='https://forum.ksec.co.uk/stylesheets/discourse-akismet_1f2801adf122e33ac71771f0a0d92bf223707572.css' media='all' rel='stylesheet' data-target='discourse-akismet'><link href='https://forum.ksec.co.uk/stylesheets/discourse-cakeday_1f2801adf122e33ac71771f0a0d92bf223707572.css' media='all' rel='stylesheet' data-target='discourse-cakeday'><link href='https://forum.ksec.co.uk/stylesheets/discourse-details_1f2801adf122e33ac71771f0a0d92bf223707572.css' media='all' rel='stylesheet' data-target='discourse-details'><link href='https://forum.ksec.co.uk/stylesheets/discourse-gamification_1f2801adf122e33ac71771f0a0d92bf223707572.css' media='all' rel='stylesheet' data-target='discourse-gamification'><link href='https://forum.ksec.co.uk/stylesheets/discourse-lazy-videos_1f2801adf122e33ac71771f0a0d92bf223707572.css' media='all' rel='stylesheet' data-target='discourse-lazy-videos'><link href='https://forum.ksec.co.uk/stylesheets/discourse-local-dates_1f2801adf122e33ac71771f0a0d92bf223707572.css' media='all' rel='stylesheet' data-target='discourse-local-dates'><link href='https://forum.ksec.co.uk/stylesheets/discourse-narrative-bot_1f2801adf122e33ac71771f0a0d92bf223707572.css' media='all' rel='stylesheet' data-target='discourse-narrative-bot'><link href='https://forum.ksec.co.uk/stylesheets/discourse-presence_1f2801adf122e33ac71771f0a0d92bf223707572.css' media='all' rel='stylesheet' data-target='discourse-presence'><link href='https://forum.ksec.co.uk/stylesheets/discourse-reactions_1f2801adf122e33ac71771f0a0d92bf223707572.css' media='all' rel='stylesheet' data-target='discourse-reactions'><link href='https://forum.ksec.co.uk/stylesheets/discourse-rss-polling_1f2801adf122e33ac71771f0a0d92bf223707572.css' media='all' rel='stylesheet' data-target='discourse-rss-polling'><link href='https://forum.ksec.co.uk/stylesheets/docker_manager_1f2801adf122e33ac71771f0a0d92bf223707572.css' media='all' rel='stylesheet' data-target='docker_manager'><link href='https://forum.ksec.co.uk/stylesheets/footnote_1f2801adf122e33ac71771f0a0d92bf223707572.css' media='all' rel='stylesheet' data-target='footnote'><link href='https://forum.ksec.co.uk/stylesheets/poll_1f2801adf122e33ac71771f0a0d92bf223707572.css' media='all' rel='stylesheet' data-target='poll'><link href='https://forum.ksec.co.uk/stylesheets/spoiler-alert_1f2801adf122e33ac71771f0a0d92bf223707572.css' media='all' rel='stylesheet' data-target='spoiler-alert'><link href='https://forum.ksec.co.uk/stylesheets/discourse-ai_desktop_1f2801adf122e33ac71771f0a0d92bf223707572.css' media='all' rel='stylesheet' data-target='discourse-ai_desktop'><link href='https://forum.ksec.co.uk/stylesheets/discourse-gamification_desktop_1f2801adf122e33ac71771f0a0d92bf223707572.css' media='all' rel='stylesheet' data-target='discourse-gamification_desktop'><link href='https://forum.ksec.co.uk/stylesheets/discourse-reactions_desktop_1f2801adf122e33ac71771f0a0d92bf223707572.css' media='all' rel='stylesheet' data-target='discourse-reactions_desktop'><link href='https://forum.ksec.co.uk/stylesheets/poll_desktop_1f2801adf122e33ac71771f0a0d92bf223707572.css' media='all' rel='stylesheet' data-target='poll_desktop'><link href='https://forum.ksec.co.uk/stylesheets/desktop_theme_4_51fe4f92f85e2ddf8cb2ac39b3f18429f14452c8.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='4' data-theme-name='discourse clickable topic'><link href='https://forum.ksec.co.uk/stylesheets/desktop_theme_6_003073d7e039da7d37eb1e79b3772306ac8657f4.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='6' data-theme-name='discourse-gifs'><link href='https://forum.ksec.co.uk/stylesheets/desktop_theme_5_ce3252be82b7db613c78ea4f283dcf17abe51741.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='5' data-theme-name='discourse-search-banner'><link href='https://forum.ksec.co.uk/stylesheets/desktop_theme_9_12b3533905718e859faa16d62a11c119e4d64875.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='9' data-theme-name='icon header links'><link href='https://forum.ksec.co.uk/stylesheets/desktop_theme_3_28ffee2ef9ff10c2ad27c49227f68bb1da72a779.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='3' data-theme-name='modern category + group boxes'><link href='https://forum.ksec.co.uk/stylesheets/desktop_theme_2_dd1b36aa59bc2c658ff7a7825007d31f580dab8b.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='2' data-theme-name='air theme'><link href='https://forum.ksec.co.uk/stylesheets/desktop_theme_11_f4cc23465e9e5bf8d991504b6106825edc03c16a.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='11' data-theme-name='custom css &amp; html'>"
          },
          {
            id: 6,
            content: "<link href='https://thepros.get.it/stylesheets/color_definitions_get-it-light_11_2_ee762a2dd28c63827357489083590cecd6db9323.css' media='all' rel='stylesheet' class='light-scheme'><link href='https://thepros.get.it/stylesheets/color_definitions_dark_1_2_09865b07ec4b67b9401e67edb03a78a33aadf245.css' media='(prefers-color-scheme:dark)' rel='stylesheet' class='dark-scheme'><link href='https://thepros.get.it/stylesheets/desktop_7c3d1efacb3c0d0d50e7279609b75879527a37ad.css' media='all' rel='stylesheet' data-target='desktop'><link href='https://thepros.get.it/stylesheets/chat_7c3d1efacb3c0d0d50e7279609b75879527a37ad.css' media='all' rel='stylesheet' data-target='chat'><link href='https://thepros.get.it/stylesheets/checklist_7c3d1efacb3c0d0d50e7279609b75879527a37ad.css' media='all' rel='stylesheet' data-target='checklist'><link href='https://thepros.get.it/stylesheets/discourse-details_7c3d1efacb3c0d0d50e7279609b75879527a37ad.css' media='all' rel='stylesheet' data-target='discourse-details'><link href='https://thepros.get.it/stylesheets/discourse-lazy-videos_7c3d1efacb3c0d0d50e7279609b75879527a37ad.css' media='all' rel='stylesheet' data-target='discourse-lazy-videos'><link href='https://thepros.get.it/stylesheets/discourse-local-dates_7c3d1efacb3c0d0d50e7279609b75879527a37ad.css' media='all' rel='stylesheet' data-target='discourse-local-dates'><link href='https://thepros.get.it/stylesheets/discourse-narrative-bot_7c3d1efacb3c0d0d50e7279609b75879527a37ad.css' media='all' rel='stylesheet' data-target='discourse-narrative-bot'><link href='https://thepros.get.it/stylesheets/discourse-presence_7c3d1efacb3c0d0d50e7279609b75879527a37ad.css' media='all' rel='stylesheet' data-target='discourse-presence'><link href='https://thepros.get.it/stylesheets/docker_manager_7c3d1efacb3c0d0d50e7279609b75879527a37ad.css' media='all' rel='stylesheet' data-target='docker_manager'><link href='https://thepros.get.it/stylesheets/footnote_7c3d1efacb3c0d0d50e7279609b75879527a37ad.css' media='all' rel='stylesheet' data-target='footnote'><link href='https://thepros.get.it/stylesheets/poll_7c3d1efacb3c0d0d50e7279609b75879527a37ad.css' media='all' rel='stylesheet' data-target='poll'><link href='https://thepros.get.it/stylesheets/spoiler-alert_7c3d1efacb3c0d0d50e7279609b75879527a37ad.css' media='all' rel='stylesheet' data-target='spoiler-alert'><link href='https://thepros.get.it/stylesheets/chat_desktop_7c3d1efacb3c0d0d50e7279609b75879527a37ad.css' media='all' rel='stylesheet' data-target='chat_desktop'><link href='https://thepros.get.it/stylesheets/poll_desktop_7c3d1efacb3c0d0d50e7279609b75879527a37ad.css' media='all' rel='stylesheet' data-target='poll_desktop'><link href='https://thepros.get.it/stylesheets/desktop_theme_4_b593f6a33945d84e8923041356dbae20f78de862.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='4' data-theme-name='clickable topic'><link href='https://thepros.get.it/stylesheets/desktop_theme_3_d0247eb7936be09a3ee02299f743974ceebc1031.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='3' data-theme-name='modern category + group boxes'><link href='https://thepros.get.it/stylesheets/desktop_theme_5_7bc2214caaf0db1a71f3fd05dc0fb629f55ac150.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='5' data-theme-name='search banner'><link href='https://thepros.get.it/stylesheets/desktop_theme_2_381e73ac5235cf49a7c855137e4af4cc4d4a80ef.css' media='all' rel='stylesheet' data-target='desktop_theme' data-theme-id='2' data-theme-name='air theme'>"
          }
        ]
      };
    },
    watch: {
      modelValue(newValue) {
        this.radio = newValue;
      }
    },
    created() {
      if (this.modelValue && this.modelValue !== 0) {
        let result2 = this.jsonData.find((item) => item.id === this.modelValue);
        if (result2) {
          $("body").append(result2.content);
        }
      }
    }
  };
  const _hoisted_1$e = { class: "item" };
  const _hoisted_2$3 = { class: "ls-flex" };
  const _hoisted_3$2 = ["id", "value", "onChange"];
  const _hoisted_4$2 = ["for"];
  const _hoisted_5$1 = ["for"];
  const _hoisted_6$1 = ["for"];
  const _hoisted_7$1 = ["src", "alt"];
  function _sfc_render$i(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$e, [
      _cache[1] || (_cache[1] = createBaseVNode(
        "p",
        null,
        "切换论坛主题：",
        -1
        /* HOISTED */
      )),
      _cache[2] || (_cache[2] = createBaseVNode(
        "p",
        null,
        "如果存在样式问题请切换其他主题或者关闭，因为这个功能直接 copy Discourse 框架下其他论坛的样式文件，我也改不了。",
        -1
        /* HOISTED */
      )),
      _cache[3] || (_cache[3] = createBaseVNode(
        "hr",
        null,
        null,
        -1
        /* HOISTED */
      )),
      createBaseVNode("ul", null, [
        (openBlock(true), createElementBlock(
          Fragment,
          null,
          renderList($data.list, (item) => {
            return openBlock(), createElementBlock("li", {
              key: item.id
            }, [
              createBaseVNode("div", _hoisted_2$3, [
                withDirectives(createBaseVNode("input", {
                  type: "radio",
                  id: item.name,
                  name: "ls-themes",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.radio = $event),
                  value: item.id,
                  onChange: ($event) => _ctx.$emit("update:modelValue", item.id)
                }, null, 40, _hoisted_3$2), [
                  [vModelRadio, $data.radio]
                ]),
                item.id !== 0 ? (openBlock(), createElementBlock("label", {
                  key: 0,
                  for: item.name
                }, "风格 " + toDisplayString(item.id), 9, _hoisted_4$2)) : (openBlock(), createElementBlock("label", {
                  key: 1,
                  for: item.name
                }, "关闭", 8, _hoisted_5$1))
              ]),
              createBaseVNode("label", {
                for: item.name
              }, [
                item.id !== 0 ? (openBlock(), createElementBlock("img", {
                  key: 0,
                  src: item.imgurl,
                  alt: item.name
                }, null, 8, _hoisted_7$1)) : createCommentVNode("v-if", true)
              ], 8, _hoisted_6$1)
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ])
    ]);
  }
  const Themes = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$i], ["__scopeId", "data-v-f7f5ddf1"], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/Themes/index.vue"]]);
  const _sfc_main$h = {
    data() {
      return {};
    },
    methods: {
      // 提示组件
      messageToast(message) {
        const messageElement2 = document.createElement("div");
        messageElement2.className = "messageToast-text";
        messageElement2.innerText = message;
        document.getElementById("messageToast").appendChild(messageElement2);
        setTimeout(() => {
          messageElement2.remove();
        }, 3e3);
      },
      // 导入数据
      triggerFileInput() {
        this.$refs.fileInput.click();
      },
      handleFileUpload(event) {
        const file = event.target.files[0];
        if (file && file.type === "application/json") {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const jsonData = JSON.parse(e.target.result);
              this.importData(jsonData);
            } catch (error) {
              console.error("Error parsing JSON:", error);
            }
          };
          reader.readAsText(file);
        } else {
          console.error("Please select a valid JSON file.");
        }
      },
      // 处理导入的数据
      importData(data) {
        localStorage.setItem("linxudoscriptssettingDMI", data);
        this.messageToast("导入成功，即将刷新页面！");
        setTimeout(() => {
          location.reload();
        }, 1500);
      },
      // 导出数据
      exportData() {
        const today = /* @__PURE__ */ new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        const formattedDate = year + month + day;
        const data = localStorage.getItem("linxudoscriptssettingDMI");
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link2 = document.createElement("a");
        link2.href = url;
        link2.download = `linuxdo-script-data-${formattedDate}.json`;
        document.body.appendChild(link2);
        link2.click();
        document.body.removeChild(link2);
        URL.revokeObjectURL(url);
        this.messageToast("导出成功！");
      }
    }
  };
  function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock(
      Fragment,
      null,
      [
        createBaseVNode(
          "input",
          {
            type: "file",
            id: "fileInput",
            ref: "fileInput",
            style: { "display": "none" },
            accept: ".json",
            onChange: _cache[0] || (_cache[0] = (...args) => $options.handleFileUpload && $options.handleFileUpload(...args))
          },
          null,
          544
          /* NEED_HYDRATION, NEED_PATCH */
        ),
        createBaseVNode("button", {
          class: "btn import",
          onClick: _cache[1] || (_cache[1] = (...args) => $options.triggerFileInput && $options.triggerFileInput(...args))
        }, "导入"),
        createBaseVNode("button", {
          class: "btn export",
          onClick: _cache[2] || (_cache[2] = (...args) => $options.exportData && $options.exportData(...args))
        }, "导出")
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const ManualBackup = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$h], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/Sync/ManualBackup.vue"]]);
  const _sfc_main$g = {
    props: {
      value: {
        type: Object,
        default: {
          webdavUrl: "",
          webdavUsername: "",
          webdavPassword: ""
        }
      }
    },
    components: {
      ManualBackup
    },
    watch: {
      value(newValue) {
        this.tableData = newValue;
      }
    },
    data() {
      return {
        tableData: this.value
      };
    },
    methods: {
      // 提示组件
      messageToast(message) {
        const messageElement2 = document.createElement("div");
        messageElement2.className = "messageToast-text";
        messageElement2.innerText = message;
        document.getElementById("messageToast").appendChild(messageElement2);
        setTimeout(() => {
          messageElement2.remove();
        }, 3e3);
      },
      handleChange() {
        $(".lxwebdavpassword").removeClass("act");
        this.$emit("update:value", this.tableData);
        let linxudoscriptssettingDMI = JSON.parse(
          localStorage.getItem("linxudoscriptssettingDMI")
        );
        let data = {
          webdavUrl: this.tableData.webdavUrl,
          webdavUsername: this.tableData.webdavUsername,
          webdavPassword: this.tableData.webdavPassword
        };
        linxudoscriptssettingDMI.syncbackup = data;
        localStorage.setItem(
          "linxudoscriptssettingDMI",
          JSON.stringify(linxudoscriptssettingDMI)
        );
      },
      // 通用 WebDAV 请求函数
      sendWebDAVRequest(auth, method, url, data = null) {
        return new Promise((resolve2, reject) => {
          chrome.runtime.sendMessage(
            { action: "webdavRequest", auth, method, url, data },
            (response) => {
              if (response.status >= 200 && response.status < 300 || response.status === 207) {
                resolve2(response);
              } else {
                reject(new Error(response.statusText));
              }
            }
          );
        });
      },
      // 检查文件夹是否存在
      checkFolderExists(folderUrl) {
        const auth = {
          username: this.tableData.webdavUsername,
          password: this.tableData.webdavPassword
        };
        return this.sendWebDAVRequest(auth, "PROPFIND", folderUrl);
      },
      // 创建文件夹
      createFolder(folderUrl) {
        const auth = {
          username: this.tableData.webdavUsername,
          password: this.tableData.webdavPassword
        };
        return this.sendWebDAVRequest(auth, "MKCOL", folderUrl);
      },
      // 检查并创建文件夹
      async checkAndCreateFolder() {
        const folderUrl = `${this.tableData.webdavUrl}linuxdo-scripts-backup/`;
        try {
          const response = await this.checkFolderExists(folderUrl);
          if (response.status === 404) {
            await this.createFolder(folderUrl);
            console.log("Folder 'linuxdo-scripts-backup' created successfully.");
          } else {
            console.log("Folder 'linuxdo-scripts-backup' already exists.");
          }
          const data = localStorage.getItem("linxudoscriptssettingDMI");
          const uploadUrl = `${this.tableData.webdavUrl}linuxdo-scripts-backup/data.json`;
          try {
            const uploadResponse = await this.sendWebDAVRequest({
              username: this.tableData.webdavUsername,
              password: this.tableData.webdavPassword
            }, "PUT", uploadUrl, data);
            this.messageToast("同步到云端成功！");
          } catch (error) {
            console.error("Upload failed:", error);
            this.messageToast("同步失败！");
          }
        } catch (error) {
          console.error(error);
        }
      },
      // 下载文件
      downloadFile(url) {
        const auth = {
          username: this.tableData.webdavUsername,
          password: this.tableData.webdavPassword
        };
        return this.sendWebDAVRequest(auth, "GET", url);
      },
      // 上传
      async uploadSampleFile() {
        this.checkAndCreateFolder();
      },
      // 下载
      async downloadSampleFile() {
        const downloadUrl = `${this.tableData.webdavUrl}linuxdo-scripts-backup/data.json`;
        try {
          const downloadResponse = await this.downloadFile(downloadUrl);
          localStorage.setItem("linxudoscriptssettingDMI", downloadResponse.data);
          this.messageToast("下载成功，即将刷新页面！");
          setTimeout(() => {
            location.reload();
          }, 1500);
        } catch (error) {
          console.error(error);
          this.messageToast("下载失败，请检查是否存在备份！");
        }
      },
      // 显示/隐藏密码
      showpsw() {
        $(".lxwebdavpassword").addClass("act");
      }
    },
    created() {
      let linxudoscriptssettingDMI = {};
      try {
        const storedData = localStorage.getItem("linxudoscriptssettingDMI");
        if (storedData) {
          linxudoscriptssettingDMI = JSON.parse(storedData);
        }
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
      const syncbackup = linxudoscriptssettingDMI.syncbackup || {};
      this.tableData.webdavUrl = (syncbackup == null ? void 0 : syncbackup.webdavUrl) || "";
      this.tableData.webdavUsername = (syncbackup == null ? void 0 : syncbackup.webdavUsername) || "";
      this.tableData.webdavPassword = (syncbackup == null ? void 0 : syncbackup.webdavPassword) || "";
    }
  };
  function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ManualBackup = resolveComponent("ManualBackup");
    return openBlock(), createElementBlock(
      Fragment,
      null,
      [
        createCommentVNode(' <div class="item">\r\n    用于在云端同步设置数据，无需手动导入导出。（同步前先保存设置）\r\n  </div> '),
        createCommentVNode(' <div class="item">\r\n    <div class="tit">WebDav 地址：</div>\r\n    <input\r\n      type="text"\r\n      v-model="tableData.webdavUrl"\r\n      @blur="handleChange"\r\n      placeholder="https://dav.xxxx.com/dav/"\r\n    />\r\n  </div>\r\n  <div class="item">\r\n    <div class="tit">WebDav 用户名：</div>\r\n    <input\r\n      type="text"\r\n      v-model="tableData.webdavUsername"\r\n      @blur="handleChange"\r\n    />\r\n  </div>\r\n  <div class="item">\r\n    <div class="tit">WebDav 密码：</div>\r\n    <input\r\n      type="text"\r\n      class="lxwebdavpassword"\r\n      v-model="tableData.webdavPassword"\r\n      @blur="handleChange"\r\n      @focus="showpsw"\r\n    />\r\n  </div>\r\n\r\n  <div class="btnwrapper">\r\n    <button @click="uploadSampleFile">同步到云端</button>\r\n    <button @click="downloadSampleFile">下载到本地</button>\r\n  </div> '),
        createCommentVNode(" <hr /> "),
        createCommentVNode(" 手动导入导出 "),
        _cache[0] || (_cache[0] = createBaseVNode(
          "div",
          { style: { "margin": "10px 0" } },
          "手动导入导出数据：",
          -1
          /* HOISTED */
        )),
        createVNode(_component_ManualBackup)
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const SyncBackup = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$g], ["__scopeId", "data-v-907c6430"], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/Sync/SyncBackup.vue"]]);
  const _sfc_main$f = {
    data() {
      return {
        status: false
      };
    },
    methods: {
      lookop() {
        this.status = !this.status;
        $(".post-stream").toggleClass("lookopwrapactive");
      }
    },
    created() {
      $("head").append(`<style>
.post-stream.lookopwrapactive .topic-post{display:none !important;}
.post-stream.lookopwrapactive .topic-post.topic-owner{display: block !important;}
    </style>`);
    }
  };
  const _hoisted_1$d = { class: "lookopbtn" };
  function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$d, [
      createBaseVNode(
        "div",
        {
          class: normalizeClass(["el-button", { act: $data.status }]),
          onClick: _cache[0] || (_cache[0] = (...args) => $options.lookop && $options.lookop(...args)),
          title: "只看楼主"
        },
        " 楼主 ",
        2
        /* CLASS */
      )
    ]);
  }
  const LookOP = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$f], ["__scopeId", "data-v-3433b66f"], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/Button/LookOP.vue"]]);
  const _sfc_main$e = {
    data() {
      return {
        isMinimized: true,
        content: "输入用户名查询等级信息",
        username: "",
        levelDescriptions: {
          0: "游客",
          1: "基本用户",
          2: "成员",
          3: "活跃用户",
          4: "领导者"
        },
        levelRequirements: {
          0: { topics_entered: 5, posts_read_count: 30, time_read: 600 },
          1: {
            days_visited: 15,
            likes_given: 1,
            likes_received: 1,
            post_count: 3,
            topics_entered: 20,
            posts_read_count: 100,
            time_read: 3600
          },
          2: {
            days_visited: 50,
            likes_given: 30,
            likes_received: 20,
            post_count: 10,
            topics_entered: 0,
            posts_read_count: 0
          }
        }
      };
    },
    methods: {
      async fetchAboutData() {
        try {
          const response = await fetch("/about.json", {
            headers: {
              Accept: "application/json",
              "User-Agent": "Mozilla/5.0"
            },
            method: "GET"
          });
          if (!response.ok)
            throw new Error(`HTTP 错误！状态：${response.status}`);
          return await response.json();
        } catch (error) {
          console.error("获取关于页面数据失败：", error);
          this.displayError("获取关于页面数据失败");
          return null;
        }
      },
      async fetchUserData(username) {
        try {
          const response = await fetch(`/u/${username}/summary.json`, {
            headers: {
              Accept: "application/json",
              "User-Agent": "Mozilla/5.0"
            },
            method: "GET"
          });
          if (!response.ok)
            throw new Error(`HTTP 错误！状态：${response.status}`);
          return await response.json();
        } catch (error) {
          console.error("获取用户数据失败：", error);
          this.displayError("获取用户数据失败");
          return null;
        }
      },
      async handleSearch() {
        if (this.username == "") {
          return false;
        }
        this.content = "正在查询中，请稍后...";
        const username = this.username.trim();
        if (username) {
          const aboutData = await this.fetchAboutData();
          const userData = await this.fetchUserData(username);
          if (userData && aboutData) {
            const userSummary = userData.user_summary;
            const user = userData.users[0];
            const status = aboutData.about.stats;
            this.updatePopupContent(userSummary, user, status);
          }
        }
      },
      updatePopupContent(userSummary, user, status) {
        if (userSummary && user) {
          let content2 = `<strong>信任等级：</strong>${this.levelDescriptions[user.trust_level]}<br><strong>升级进度：</strong><br>`;
          if (user.trust_level === 3) {
            content2 += `联系管理员以升级到领导者<br>`;
          } else if (user.trust_level === 4) {
            content2 += `您已是最高信任等级<br>`;
          } else {
            const requirements = this.levelRequirements[user.trust_level];
            if (user.trust_level === 2) {
              requirements.posts_read_count = Math.min(
                Math.floor(status.posts_30_days / 4),
                2e4
              );
              requirements.topics_entered = Math.min(
                Math.floor(status.topics_30_days / 4),
                500
              );
            }
            Object.entries(requirements).forEach(([key, val]) => {
              const currentVal = userSummary[key] || 0;
              const color = currentVal >= val ? "green" : "red";
              content2 += `${this.translateStat(
                key
              )}: <span style="color: ${color};">${currentVal} / ${val}</span><br>`;
            });
          }
          this.content = content2;
        }
      },
      togglePopupSize() {
        this.isMinimized = !this.isMinimized;
      },
      displayError(message) {
        this.content = `<strong>错误：</strong>${message}`;
      },
      translateStat(stat) {
        const translations = {
          days_visited: "访问天数",
          likes_given: "给出的赞",
          likes_received: "收到的赞",
          post_count: "帖子数量",
          posts_read_count: "阅读的帖子数",
          topics_entered: "进入的主题数",
          time_read: "阅读时间"
        };
        return translations[stat] || stat;
      }
    },
    created() {
      setInterval(() => {
        if (!this.username) {
          const avatarImg = $("#toggle-current-user img.avatar");
          const src = avatarImg.length ? avatarImg.attr("src") : null;
          if (src) {
            const match = src.match(/\/user_avatar\/linux\.do\/([^\/]+)/);
            if (match && match[1]) {
              this.username = match[1];
            }
          }
        }
      }, 1e3);
    }
  };
  const _hoisted_1$c = {
    key: 0,
    id: "linuxDoLevelPopupContent"
  };
  const _hoisted_2$2 = ["innerHTML"];
  function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", null, [
      createBaseVNode(
        "div",
        {
          class: normalizeClass(["el-button", ["linuxDoLevelPopup", $data.isMinimized ? "minimized" : ""]]),
          onClick: _cache[0] || (_cache[0] = (...args) => $options.togglePopupSize && $options.togglePopupSize(...args)),
          title: "等级查询"
        },
        _cache[3] || (_cache[3] = [
          createBaseVNode(
            "span",
            null,
            "等级",
            -1
            /* HOISTED */
          )
        ]),
        2
        /* CLASS */
      ),
      !$data.isMinimized ? (openBlock(), createElementBlock("div", _hoisted_1$c, [
        createBaseVNode("div", { innerHTML: $data.content }, null, 8, _hoisted_2$2),
        withDirectives(createBaseVNode(
          "input",
          {
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.username = $event),
            autocomplete: "off",
            type: "text",
            placeholder: "请输入用户名...",
            id: "linuxDoUserSearch"
          },
          null,
          512
          /* NEED_PATCH */
        ), [
          [vModelText, $data.username]
        ]),
        createBaseVNode("button", {
          onClick: _cache[2] || (_cache[2] = (...args) => $options.handleSearch && $options.handleSearch(...args)),
          class: "btn btn-icon-text",
          type: "button"
        }, _cache[4] || (_cache[4] = [
          createBaseVNode(
            "span",
            { class: "d-button-label" },
            "搜索",
            -1
            /* HOISTED */
          )
        ]))
      ])) : createCommentVNode("v-if", true)
    ]);
  }
  const LevelDiglog = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$e], ["__scopeId", "data-v-ee11b6d3"], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/Button/LevelDiglog.vue"]]);
  const _sfc_main$d = {
    methods: {
      replaybtn() {
        $('button[title="开始撰写此话题的回复"]')[0].click();
      }
    }
  };
  const _hoisted_1$b = { class: "replaybtn" };
  function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$b, [
      createBaseVNode("div", {
        class: "el-button",
        onClick: _cache[0] || (_cache[0] = (...args) => $options.replaybtn && $options.replaybtn(...args)),
        type: "primary",
        title: "回复"
      }, " 回复 ")
    ]);
  }
  const ReplyBtn = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$d], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/Button/ReplyBtn.vue"]]);
  const _sfc_main$c = {
    data() {
      return {
        showhot: false,
        list: []
      };
    },
    methods: {
      // 提示组件
      messageToast(message) {
        const messageElement2 = document.createElement("div");
        messageElement2.className = "messageToast-text";
        messageElement2.innerText = message;
        document.getElementById("messageToast").appendChild(messageElement2);
        setTimeout(() => {
          messageElement2.remove();
        }, 3e3);
      },
      hotranking() {
        this.showhot = !this.showhot;
      },
      query() {
        this.list = [];
        this.init();
        this.messageToast("刷新成功！");
      },
      init() {
        fetch("/top.json").then((response) => response.json()).then((data) => {
          this.list = data.topic_list.topics.slice(0, 10);
        }).catch((error) => {
        });
      }
    },
    created() {
      this.init();
    }
  };
  const _hoisted_1$a = { class: "hotranking" };
  const _hoisted_2$1 = { class: "hotranking-container" };
  const _hoisted_3$1 = { class: "flex" };
  const _hoisted_4$1 = ["href"];
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", null, [
      createBaseVNode("div", _hoisted_1$a, [
        createBaseVNode("div", {
          class: "el-button",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.hotranking && $options.hotranking(...args)),
          title: "只看楼主"
        }, "热门")
      ]),
      withDirectives(createBaseVNode(
        "div",
        _hoisted_2$1,
        [
          createBaseVNode("div", _hoisted_3$1, [
            _cache[2] || (_cache[2] = createBaseVNode(
              "div",
              { class: "title" },
              "今日最热帖子",
              -1
              /* HOISTED */
            )),
            createBaseVNode("button", {
              onClick: _cache[1] || (_cache[1] = (...args) => $options.query && $options.query(...args))
            }, "刷新")
          ]),
          createBaseVNode("ol", null, [
            (openBlock(true), createElementBlock(
              Fragment,
              null,
              renderList($data.list, (item) => {
                return openBlock(), createElementBlock("li", {
                  key: item.id
                }, [
                  createBaseVNode("a", {
                    href: "https://linux.do/t/topic/" + item.id,
                    target: "_blank"
                  }, toDisplayString(item.title), 9, _hoisted_4$1)
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ],
        512
        /* NEED_PATCH */
      ), [
        [vShow, $data.showhot]
      ])
    ]);
  }
  const HotRankingList = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$c], ["__scopeId", "data-v-1efed507"], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/Button/HotRankingList.vue"]]);
  const _sfc_main$b = {
    methods: {
      scrollToTop() {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }
    }
  };
  const _hoisted_1$9 = { class: "backtotop" };
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$9, [
      createBaseVNode("div", {
        class: "el-button",
        style: { "font-size": "18px" },
        onClick: _cache[0] || (_cache[0] = (...args) => $options.scrollToTop && $options.scrollToTop(...args)),
        type: "primary",
        title: "返回顶部"
      }, _cache[1] || (_cache[1] = [
        createStaticVNode('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-up-dashed"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 5v6m0 3v1.5m0 3v.5"></path><path d="M18 11l-6 -6"></path><path d="M6 11l6 -6"></path></svg>', 1)
      ]))
    ]);
  }
  const BackToTop = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$b], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/Button/BackToTop.vue"]]);
  const _sfc_main$a = {
    data() {
      return {
        version: packageJson.version
      };
    }
  };
  const _hoisted_1$8 = { class: "item-foot" };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$8, [
      _cache[0] || (_cache[0] = createBaseVNode(
        "span",
        null,
        [
          createBaseVNode("a", {
            href: "https://github.com/dlzmoe/linuxdo-scripts",
            target: "_blank"
          }, [
            createBaseVNode("img", {
              alt: "GitHub Repo stars",
              src: "https://img.shields.io/github/stars/dlzmoe/linuxdo-scripts?style=flat-square&label=Github%20Stars"
            })
          ])
        ],
        -1
        /* HOISTED */
      )),
      createCommentVNode(' <span><a href="https://greasyfork.org/scripts/501827" target="_blank"><img alt="Greasy Fork Downloads" src="https://img.shields.io/greasyfork/dt/501827?style=flat-square&label=Greasy%20Fork"></a></span> '),
      createBaseVNode(
        "span",
        null,
        "当前版本：" + toDisplayString($data.version),
        1
        /* TEXT */
      )
    ]);
  }
  const Updates = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$a], ["__scopeId", "data-v-a81c81f6"], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/Other/Updates.vue"]]);
  const _sfc_main$9 = {
    created() {
      setTimeout(() => {
        const isShowplugininstallationprompts = localStorage.getItem(
          "isShowplugininstallationprompts"
        );
        if (isShowplugininstallationprompts == "true") ;
        else {
          if ($(".UsageTip").length < 1) {
            $(".sidebar-footer-container").before(`
            <dialog open class="UsageTip">
              <div class="title">友情提示</div>
              <div>
                佬友你好，你已经成功安装 LinuxDo Scripts 扩展啦！
              </div>
              <div style="color:#e00">
                鼠标移动到浏览器最左侧可以滑出设置按钮，点击它开始配置插件！
              </div>
              <div>如果可以的话欢迎点个 star 支持一下~</div>
              <div>
                <a href="https://github.com/dlzmoe/linuxdo-scripts/" target="_blank">
                  <img
                    src="https://img.shields.io/github/stars/dlzmoe%2Flinuxdo-scripts?style=for-the-badge&labelColor=%235D5D5D&color=%23E97435"
                    alt="icon"
                  />
                </a>
              </div>
              <button class="clicktohide">点击我，该提示永远不会出现啦</button>
            </dialog>
           `);
            $(".clicktohide").click(function() {
              localStorage.setItem("isShowplugininstallationprompts", true);
              $(".UsageTip").remove();
            });
          }
        }
      }, 100);
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    return null;
  }
  const UsageTip = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$9], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/Other/UsageTip.vue"]]);
  const _sfc_main$8 = {
    methods: {
      init() {
        $(".signature-img").each(function() {
          var self1 = $(this);
          var url1 = self1.attr("src");
          var img1 = new Image();
          img1.src = url1;
          img1.onerror = function() {
            if (self1.siblings(".signature-p").length < 1) {
              self1.after(
                `<p class="signature-p">${url1}（该用户签名不可访问，已自动转文字）</p>`
              );
              self1.hide();
            }
          };
        });
      }
    },
    created() {
      let pollinglength2 = 0;
      setInterval(() => {
        if (pollinglength2 != $(".post-stream .topic-post").length) {
          pollinglength2 = $(".post-stream .topic-post").length;
          this.init();
        }
      }, 1e3);
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    return null;
  }
  const Signature = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$8], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/Other/Signature.vue"]]);
  const _sfc_main$7 = {};
  const _hoisted_1$7 = {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    fill: "none",
    viewBox: "0 0 24 24",
    class: "icon-sm"
  };
  function _sfc_render$7(_ctx, _cache) {
    return openBlock(), createElementBlock("svg", _hoisted_1$7, _cache[0] || (_cache[0] = [
      createBaseVNode(
        "path",
        {
          fill: "currentColor",
          "fill-rule": "evenodd",
          d: "M11.568 3.5a1 1 0 0 0-.863.494l-.811 1.381A3 3 0 0 1 7.33 6.856l-1.596.013a1 1 0 0 0-.858.501l-.44.761a1 1 0 0 0-.003.992l.792 1.4a3 3 0 0 1 0 2.954l-.792 1.4a1 1 0 0 0 .004.992l.439.76a1 1 0 0 0 .858.502l1.596.013a3 3 0 0 1 2.564 1.48l.811 1.382a1 1 0 0 0 .863.494h.87a1 1 0 0 0 .862-.494l.812-1.381a3 3 0 0 1 2.563-1.481l1.596-.013a1 1 0 0 0 .859-.501l.439-.761a1 1 0 0 0 .004-.992l-.793-1.4a3 3 0 0 1 0-2.953l.793-1.401a1 1 0 0 0-.004-.992l-.439-.76a1 1 0 0 0-.859-.502l-1.596-.013a3 3 0 0 1-2.563-1.48L13.3 3.993a1 1 0 0 0-.862-.494zM8.98 2.981A3 3 0 0 1 11.568 1.5h.87a3 3 0 0 1 2.588 1.481l.81 1.382a1 1 0 0 0 .855.494l1.597.013a3 3 0 0 1 2.575 1.502l.44.76a3 3 0 0 1 .011 2.975l-.792 1.4a1 1 0 0 0 0 .985l.792 1.401a3 3 0 0 1-.012 2.974l-.439.761a3 3 0 0 1-2.575 1.503l-1.597.012a1 1 0 0 0-.854.494l-.811 1.382a3 3 0 0 1-2.588 1.481h-.87a3 3 0 0 1-2.588-1.481l-.811-1.382a1 1 0 0 0-.855-.494l-1.596-.012a3 3 0 0 1-2.576-1.503l-.439-.76a3 3 0 0 1-.012-2.975l.793-1.4a1 1 0 0 0 0-.985l-.793-1.4a3 3 0 0 1 .012-2.975l.44-.761A3 3 0 0 1 5.717 4.87l1.596-.013a1 1 0 0 0 .855-.494z",
          "clip-rule": "evenodd"
        },
        null,
        -1
        /* HOISTED */
      ),
      createBaseVNode(
        "path",
        {
          fill: "currentColor",
          "fill-rule": "evenodd",
          d: "M12.003 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M8.502 12a3.5 3.5 0 1 1 7 .001 3.5 3.5 0 0 1-7-.001",
          "clip-rule": "evenodd"
        },
        null,
        -1
        /* HOISTED */
      )
    ]));
  }
  const Setting1 = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$7], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/Svg/Setting1.vue"]]);
  const _sfc_main$6 = {};
  const _hoisted_1$6 = {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    fill: "none",
    viewBox: "0 0 24 24",
    class: "icon-sm"
  };
  function _sfc_render$6(_ctx, _cache) {
    return openBlock(), createElementBlock("svg", _hoisted_1$6, _cache[0] || (_cache[0] = [
      createBaseVNode(
        "path",
        {
          fill: "currentColor",
          "fill-rule": "evenodd",
          d: "M12 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6M7 7a5 5 0 1 1 10 0A5 5 0 0 1 7 7m12.028 8.626c-.342-.061-.834.027-1.346.557a1 1 0 0 1-1.438 0c-.512-.53-1.003-.618-1.345-.557-.36.064-.681.312-.837.702-.257.643-.16 2.334 2.901 4.134 3.062-1.8 3.159-3.49 2.901-4.134a1.11 1.11 0 0 0-.836-.702m2.693-.041c.854 2.134-.456 4.844-4.284 6.904a1 1 0 0 1-.948 0c-3.828-2.06-5.137-4.77-4.284-6.904a3.11 3.11 0 0 1 2.343-1.929c.809-.144 1.655.035 2.415.536.76-.5 1.607-.68 2.415-.536a3.11 3.11 0 0 1 2.343 1.929m-11.795-1.38a1 1 0 0 1-.548 1.303C7.06 16.453 5.5 18.581 5.5 21a1 1 0 1 1-2 0c0-3.322 2.141-6.128 5.122-7.344a1 1 0 0 1 1.304.549",
          "clip-rule": "evenodd"
        },
        null,
        -1
        /* HOISTED */
      )
    ]));
  }
  const Setting2 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$6], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/Svg/Setting2.vue"]]);
  const _sfc_main$5 = {};
  const _hoisted_1$5 = {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    fill: "none",
    viewBox: "0 0 24 24",
    class: "icon-sm"
  };
  function _sfc_render$5(_ctx, _cache) {
    return openBlock(), createElementBlock("svg", _hoisted_1$5, _cache[0] || (_cache[0] = [
      createBaseVNode(
        "path",
        {
          fill: "currentColor",
          "fill-rule": "evenodd",
          d: "M12.4 3.767a1 1 0 0 0-.8 0l-6 2.625a1 1 0 0 0-.6.916V13c0 1.714.616 3.283 1.638 4.5A6.99 6.99 0 0 1 12 15c2.153 0 4.078.972 5.362 2.5A6.97 6.97 0 0 0 19 13V7.308a1 1 0 0 0-.6-.916zm3.47 15.067A4.99 4.99 0 0 0 12 17a4.99 4.99 0 0 0-3.87 1.834A6.97 6.97 0 0 0 12 20c1.43 0 2.762-.43 3.87-1.166m-5.072-16.9a3 3 0 0 1 2.405 0l6 2.626A3 3 0 0 1 21 7.308V13a9 9 0 1 1-18 0V7.308A3 3 0 0 1 4.798 4.56zM12 8.5a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5m-3.75 1.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0",
          "clip-rule": "evenodd"
        },
        null,
        -1
        /* HOISTED */
      )
    ]));
  }
  const Setting3 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$5], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/Svg/Setting3.vue"]]);
  const _sfc_main$4 = {};
  const _hoisted_1$4 = {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    class: "icon icon-tabler icons-tabler-outline icon-tabler-brand-openai"
  };
  function _sfc_render$4(_ctx, _cache) {
    return openBlock(), createElementBlock("svg", _hoisted_1$4, _cache[0] || (_cache[0] = [
      createStaticVNode('<path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M11.217 19.384a3.501 3.501 0 0 0 6.783 -1.217v-5.167l-6 -3.35"></path><path d="M5.214 15.014a3.501 3.501 0 0 0 4.446 5.266l4.34 -2.534v-6.946"></path><path d="M6 7.63c-1.391 -.236 -2.787 .395 -3.534 1.689a3.474 3.474 0 0 0 1.271 4.745l4.263 2.514l6 -3.348"></path><path d="M12.783 4.616a3.501 3.501 0 0 0 -6.783 1.217v5.067l6 3.45"></path><path d="M18.786 8.986a3.501 3.501 0 0 0 -4.446 -5.266l-4.34 2.534v6.946"></path><path d="M18 16.302c1.391 .236 2.787 -.395 3.534 -1.689a3.474 3.474 0 0 0 -1.271 -4.745l-4.308 -2.514l-5.955 3.42"></path>', 7)
    ]));
  }
  const Setting4 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/Svg/Setting4.vue"]]);
  const _sfc_main$3 = {};
  const _hoisted_1$3 = {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    class: "icon icon-tabler icons-tabler-outline icon-tabler-cheese"
  };
  function _sfc_render$3(_ctx, _cache) {
    return openBlock(), createElementBlock("svg", _hoisted_1$3, _cache[0] || (_cache[0] = [
      createStaticVNode('<path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4.519 20.008l16.481 -.008v-3.5a2 2 0 1 1 0 -4v-3.5h-16.722"></path><path d="M21 9l-9.385 -4.992c-2.512 .12 -4.758 1.42 -6.327 3.425c-1.423 1.82 -2.288 4.221 -2.288 6.854c0 2.117 .56 4.085 1.519 5.721"></path><path d="M15 13v.01"></path><path d="M8 13v.01"></path><path d="M11 16v.01"></path>', 6)
    ]));
  }
  const Setting5 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/Svg/Setting5.vue"]]);
  const _sfc_main$2 = {};
  const _hoisted_1$2 = {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    class: "icon icon-tabler icons-tabler-outline icon-tabler-refresh"
  };
  function _sfc_render$2(_ctx, _cache) {
    return openBlock(), createElementBlock("svg", _hoisted_1$2, _cache[0] || (_cache[0] = [
      createBaseVNode(
        "path",
        {
          stroke: "none",
          d: "M0 0h24v24H0z",
          fill: "none"
        },
        null,
        -1
        /* HOISTED */
      ),
      createBaseVNode(
        "path",
        { d: "M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" },
        null,
        -1
        /* HOISTED */
      ),
      createBaseVNode(
        "path",
        { d: "M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" },
        null,
        -1
        /* HOISTED */
      )
    ]));
  }
  const Setting6 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/Svg/Setting6.vue"]]);
  const _sfc_main$1 = {};
  const _hoisted_1$1 = {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    class: "icon icon-tabler icons-tabler-outline icon-tabler-language-hiragana"
  };
  function _sfc_render$1(_ctx, _cache) {
    return openBlock(), createElementBlock("svg", _hoisted_1$1, _cache[0] || (_cache[0] = [
      createStaticVNode('<path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 5h7"></path><path d="M7 4c0 4.846 0 7 .5 8"></path><path d="M10 8.5c0 2.286 -2 4.5 -3.5 4.5s-2.5 -1.135 -2.5 -2c0 -2 1 -3 3 -3s5 .57 5 2.857c0 1.524 -.667 2.571 -2 3.143"></path><path d="M12 20l4 -9l4 9"></path><path d="M19.1 18h-6.2"></path>', 6)
    ]));
  }
  const Setting7 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/components/Svg/Setting7.vue"]]);
  const _sfc_main = {
    components: {
      Setting1,
      Setting2,
      Setting3,
      Setting4,
      Setting5,
      Setting6,
      Setting7,
      MenuOpenpostblank,
      MenuNewtopicreminder,
      MenuAutoexpandreply,
      MenuAutoexpandreply1,
      MenuShowcreatetime,
      MenuShowcreatetime1,
      MenuShowfloors,
      MenuHidetopicdetailtitle,
      MenuTopicpreview,
      MenuCreatereply,
      MenuBlockuserlist,
      Updates,
      MenuLookOP,
      LookOP,
      LevelDiglog,
      UsageTip,
      MenuFloorHeight,
      UserTags,
      MenuOtherCss,
      MenuLogoUrl,
      ReplyTBEnjoy,
      MenuPangu,
      MenuLevelSearch,
      MenuShowUnread,
      MenuFilterText,
      MenuLookmeSign,
      MenureplaceEmojiStyle,
      MenuEditorJa,
      MenuCreatedOrder,
      GPTconfig,
      MenuStickyNav,
      MenuBlockKeyword,
      SyncBackup,
      MenuShieldPosts,
      Themes,
      Signature,
      MenuSelectedShare,
      MenuDisableAutoplay,
      MenuShowRepltBtn,
      ReplyBtn,
      MenuDonotTopic,
      MenuAutoDark,
      MenuHiddenPlaceholder,
      MenuDisableReplaceState,
      MenuRemovePostAvatar,
      MenuHotRankingList,
      HotRankingList,
      MenuBackToTop,
      BackToTop,
      MenuQuickLikeTopic,
      MenuHideNewBluedot,
      MenuGifToPng,
      MenuHideHomeBanner,
      MenuBookmark
    },
    data() {
      return {
        opacity: false,
        showdialog: false,
        showFloorLottery: false,
        activeIndex: 0,
        // 当前激活的索引
        // 楼层抽奖
        floorlotteryval1: "",
        floorlotteryval2: "",
        floorlotterloading: false,
        floorlotterresult: "",
        version: packageJson.version,
        opacity: false,
        open: false,
        // 设置数据
        settingData: {
          checked1: false,
          checked2: false,
          checked3: false,
          checked31: false,
          checked4: false,
          checked41: true,
          checked5: true,
          checked6: false,
          checked7: false,
          checked9: true,
          QuickReply: "",
          blockList: "",
          blockkeywrod: "",
          checked10: false,
          othercss: "",
          logourl: "",
          checked11: true,
          checked12: true,
          checked13: false,
          checked14: false,
          checked15: false,
          checked17: {
            value1: true,
            value2: "twitter"
          },
          checked19: false,
          checked20: false,
          checked21: {
            value1: false,
            cate: "搞七捻三",
            days: "5"
          },
          checked23: false,
          checked24: true,
          checked25: true,
          checked26: true,
          checked27: false,
          checked28: false,
          checked29: false,
          checked33: false,
          checked34: true,
          checked35: false,
          checked37: false,
          checked38: false,
          checked39: false,
          checked40: false,
          removePostavatarData: {
            enable: false,
            showAuthor: false
          },
          usertags: [],
          gptdata: {
            value1: false,
            value2: false,
            title: false,
            btn: true,
            apikey: "",
            baseurl: "https://api.openai.com",
            full_url: "/v1/chat/completions",
            model: "gpt-4o-mini",
            prompt: "根据以下帖子内容进行总结，请使用 markdown 格式返回回答，没有字数限制，但要求文字精炼，简介准确，语言要求返回简体中文，并且进行中英文混排优化。可以通过编号列表（1，2，3）列出核心要点。注意不要输出标题，例如：核心要点总结，帖子总结等，直接输出文本段落。",
            prompt1: "根据以下帖子内容，帮我给作者写一条回复，简短，表明我的观点，用口语回复，不需要很正式。您可以通过讨论的方式进行回复，这将有助于引导其他用户或作者进行互动。",
            prompt2: "根据以下帖子内容，生成一个合适的标题用于社交论坛发布使用，格式要求：不要书名号或其他符号，只需要一句纯文本。尽量精简到 15 字以内，如果字数不够表达主题，可以适当多生成几个字。"
          },
          syncbackup: {
            webdavUrl: "",
            webdavUsername: "",
            webdavPassword: ""
          },
          themes: 0
        },
        showlookop: false,
        showlevelsearch: false,
        showreplybtn: false,
        showhotranking: false,
        showbacktotop: false
      };
    },
    methods: {
      // 开始抽奖
      drawRandomNumbers() {
        if (this.floorlotteryval1 === "" || this.floorlotteryval2 === "") {
          this.messageToast("请输入有效的数字");
          return false;
        }
        const total = parseInt(this.floorlotteryval1);
        const count = parseInt(this.floorlotteryval2);
        if (isNaN(total) || isNaN(count) || total <= 0 || count <= 0 || count > total) {
          this.messageToast("请输入有效的数字");
          return false;
        }
        this.floorlotterloading = true;
        this.floorlotterresult = "";
        setTimeout(() => {
          const result2 = this.getRandomNumbers(total, count);
          this.floorlotterresult = result2.join(", ");
          this.floorlotterloading = false;
        }, 1e3);
      },
      getRandomNumbers(total, count) {
        const numbers = Array.from({ length: total }, (_, i) => i + 1);
        const result2 = [];
        for (let i = 0; i < count; i++) {
          const randomIndex = Math.floor(Math.random() * numbers.length);
          result2.push(numbers[randomIndex]);
          numbers.splice(randomIndex, 1);
        }
        return result2;
      },
      closelotter() {
        this.showFloorLottery = false;
        this.opacity = false;
      },
      // 提示组件
      messageToast(message) {
        const messageElement2 = document.createElement("div");
        messageElement2.className = "messageToast-text";
        messageElement2.innerText = message;
        document.getElementById("messageToast").appendChild(messageElement2);
        setTimeout(() => {
          messageElement2.remove();
        }, 3e3);
      },
      // 打开设置
      setting() {
        this.showdialog = true;
        this.opacity = true;
      },
      // 关闭弹窗
      closedialog() {
        this.showdialog = false;
        this.opacity = false;
      },
      // 保存设置
      save() {
        localStorage.setItem("linxudoscriptssettingDMI", JSON.stringify(this.settingData));
        this.messageToast("保存成功！");
        this.showdialog = false;
        this.opacity = false;
      },
      // 保存并刷新
      saveload() {
        this.save();
        location.reload();
      },
      // 打开抽奖弹窗
      openFloorlottery() {
        this.showdialog = false;
        this.opacity = true, this.showFloorLottery = true;
      },
      showItem(index) {
        this.activeIndex = index;
      },
      // 初始化设置
      initialization() {
        localStorage.removeItem("linxudoscriptssettingDMI");
        this.messageToast("初始化设置成功，即将自动刷新！");
        setTimeout(() => {
          location.reload();
        }, 1e3);
      }
    },
    created() {
      $("body").append('<div id="messageToast"></div>');
      console.log(
        `%c linuxdo 增强插件 v${packageJson.version} %c 已开启 `,
        "padding: 2px 1px; color: #fff; background: #606060;",
        "padding: 2px 1px; color: #fff; background: #42c02e;"
      );
      const linxudoscriptssettingDMI = localStorage.getItem("linxudoscriptssettingDMI");
      if (linxudoscriptssettingDMI) {
        let deepMerge = function(target, source) {
          for (const key in source) {
            if (source[key] instanceof Object && key in target) {
              target[key] = deepMerge(target[key], source[key]);
            } else {
              target[key] = source[key];
            }
          }
          return target;
        };
        let existingData = JSON.parse(localStorage.getItem("linxudoscriptssettingDMI"));
        this.settingData = deepMerge(this.settingData, existingData);
        localStorage.setItem("linxudoscriptssettingDMI", JSON.stringify(this.settingData));
        this.showlookop = this.settingData.checked9;
        this.showlevelsearch = this.settingData.checked12;
        this.showreplybtn = this.settingData.checked25;
        this.showhotranking = this.settingData.checked33;
        this.showbacktotop = this.settingData.checked34;
        if (this.showreplybtn) {
          setInterval(() => {
            if (window.location.href.includes("/topic/")) {
              $(".replaybtn").show();
              $(".lookopbtn").show();
            } else {
              $(".replaybtn").hide();
              $(".lookopbtn").hide();
            }
          }, 1e3);
        }
      } else {
        localStorage.setItem("linxudoscriptssettingDMI", JSON.stringify(this.settingData));
      }
      $("head").append(`<style>.linuxdoscripts-setting-wrap{position:fixed;left:0;bottom:0;width:60px;height:100vh;z-index:9;display:flex;flex-direction:column;justify-content:flex-end;padding:10px;box-sizing:border-box}.linuxdoscripts-setting-wrap>button{opacity:0;margin-left:-50px;transition:all .2s linear}.linuxdoscripts-setting-wrap:hover>button{opacity:1;margin-left:0}@media (max-width:768px){.linuxdoscripts-setting-wrap{height:auto;position:fixed}.linuxdoscripts-setting-wrap>button{opacity:1;margin-left:0}}.linuxdoscripts-setting{display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;outline:0;background:#000;color:#fff;width:40px;height:40px;border-radius:5px;box-shadow:1px 2px 5px rgba(0,0,0,.6)}.timeline-container .topic-timeline .timeline-scrollarea{max-width:100px!important}#linuxdoscripts{font-size:14px}#linuxdoscripts input[type=text]{width:100%;background:var(--d-input-bg-color)}#linuxdoscripts input[type=checkbox]{width:auto;transform:scale(1.2)}#linuxdoscripts input[type=radio]{width:auto}#linuxdoscripts img{vertical-align:bottom;max-width:100%;height:auto}#linuxdoscripts .close{position:absolute;right:10px;top:45%;cursor:pointer;font-size:34px;color:#999;transform:translateY(-50%) rotate(45deg)}#linuxdoscripts .setting-btn{z-index:199;position:fixed;bottom:20px;right:20px}#linuxdoscripts .setting-btn .el-button{margin:0;margin-top:15px;width:50px;height:50px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--tertiary-low);font-size:14px;cursor:pointer;border:none}#linuxdoscripts .setting-btn .el-button svg{margin:0}#linuxdoscripts .setting-btn .el-button:hover{opacity:.9}#linuxdoscripts .hint{margin-top:5px;color:#d94f4f;font-size:14px}#linuxdoscripts dialog{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:700px;max-width:100vw;background:var(--header_background);color:var(--primary);box-shadow:0 8px 32px rgba(0,0,0,.1);border-radius:16px;padding:15px;z-index:99999;overflow-x:hidden;box-sizing:border-box;margin:0;border:none;outline:0}#linuxdoscripts dialog .menu-about{padding:5px 0;line-height:2}#linuxdoscripts dialog .menu-about .initialization{color:#999;border-bottom:1px dashed #999;cursor:pointer}#linuxdoscripts dialog .menu-about .initialization:hover{color:#333;border-color:#333}#linuxdoscripts dialog p{margin:0;font-size:14px}#linuxdoscripts .menu-header{padding:.5rem .5rem 1rem;border-bottom:1px solid #eee;position:relative}#linuxdoscripts .title{font-size:18px;font-weight:600;display:flex;align-items:center}#linuxdoscripts .title img{margin-left:10px}#linuxdoscripts button{padding:10px 16px;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;transition:all .2s ease;border:none;display:inline-flex;align-items:center;justify-content:center;background-color:var(--primary-low)}#linuxdoscripts button+button{margin-left:8px}#linuxdoscripts button.saveload{background:#000;color:#fff}#linuxdoscripts button:hover{opacity:.9}#linuxdoscripts .menu-flex{display:flex;justify-content:space-between;align-items:flex-start}#linuxdoscripts .menu-nav{width:140px;display:flex;flex-direction:column;padding:0;margin:0;padding-top:15px;margin-right:20px}#linuxdoscripts .menu-nav li{border-radius:4px;height:32px;width:100%;margin-bottom:5px;box-sizing:border-box;padding:0 10px;display:inline-flex;align-items:center;justify-content:flex-start;font-size:14px;cursor:pointer;line-height:1}#linuxdoscripts .menu-nav li svg{width:16px;margin-right:5px}#linuxdoscripts .menu-nav li.act{background:var(--d-selected)}#linuxdoscripts .menu-body{flex:1;height:480px;overflow-y:auto;box-sizing:border-box}#linuxdoscripts .menu-body::-webkit-scrollbar{height:8px;width:8px}#linuxdoscripts .menu-body::-webkit-scrollbar-corner{background:0 0}#linuxdoscripts .menu-body::-webkit-scrollbar-thumb{background:#dee0e1;border-radius:8px}#linuxdoscripts .menu-footer{display:flex;margin-top:10px;padding-top:6px}#linuxdoscripts .import{margin-left:auto!important}#linuxdoscripts .export,#linuxdoscripts .import{background:#d1f0ff;color:#559095}#linuxdoscripts .floorlottery{background:#ffb003;color:#fff}#linuxdoscripts .menu-body-item{padding-bottom:30px}#linuxdoscripts .menu-body-item .item{border-bottom:1px solid rgba(0,0,0,.05);padding:15px 0;display:flex;align-items:center;justify-content:space-between}#linuxdoscripts .menu-body-item .item .tit{height:100%;display:flex;align-items:center}#linuxdoscripts .menu-body-item .item input{margin-top:0;margin-bottom:0}#linuxdoscripts .menu-body-item .item select{margin-top:0;margin-bottom:0}#linuxdoscripts .menu-body-item .item input[type=checkbox]{width:30px;height:16px;position:relative;background-color:#dcdfe6;box-shadow:#dfdfdf 0 0 0 0 inset;border-radius:20px;background-clip:content-box;display:inline-block;appearance:none;-webkit-appearance:none;-moz-appearance:none;user-select:none;outline:0;padding:0}#linuxdoscripts .menu-body-item .item input[type=checkbox]::before{content:"";position:absolute;width:12px;height:12px;background-color:#fff;border-radius:50%;left:2px;top:0;bottom:0;margin:auto;transition:.3s}#linuxdoscripts .menu-body-item .item input[type=checkbox]:checked{background-color:var(--tertiary);transition:.6s}#linuxdoscripts .menu-body-item .item input[type=checkbox]:checked::before{left:14px;transition:.3s}#linuxdoscripts input{font-family:inherit;width:100%;border:1px solid #999;outline:0;padding:5px;font-size:14px;margin:0;resize:none;border-radius:0;color:var(--d-input-text-color);background:var(--d-input-bg-color)}#linuxdoscripts input:focus{border-color:var(--tertiary);outline:2px solid var(--tertiary);outline-offset:-2px}#linuxdoscripts textarea{font-family:inherit;width:100%;min-height:100px!important;border:1px solid #999;outline:0;padding:5px;font-size:14px;margin:0;resize:none;border-radius:0;color:var(--d-input-text-color);background:var(--d-input-bg-color)}#linuxdoscripts textarea:focus{border-color:var(--tertiary);outline:2px solid var(--tertiary);outline-offset:-2px}#linuxdoscripts #floorlotterloading img{width:50px;height:50px}#linuxdoscripts .floorlotterywrap{display:none;width:400px;height:300px;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);margin:0;z-index:999}#linuxdoscripts .floorlotterywrap{width:400px;height:300px}#linuxdoscripts .el-checkbox__inner{border:1px solid #979797}#linuxdoscripts label{margin:0}.linuxdoscripts-opacity{position:fixed;left:0;top:0;width:100vw;height:100vh;background:rgba(0,0,0,.5);z-index:9999}.linuxlevel.four{background:linear-gradient(to right,red,#00f);-webkit-background-clip:text;color:transparent}.topic-post{position:relative}.linuxfloor{display:flex;color:var(--tertiary);width:30px;height:30px;align-items:center;justify-content:center;border-radius:6px;font-size:16px;margin-left:10px}.signature-p{color:#279a36;font-size:14px;word-break:break-word}.topic-list .views{font-weight:400!important;white-space:nowrap!important}.createreply{display:flex;flex-direction:column;max-width:300px}.createreply button{margin-bottom:10px;justify-content:flex-start;text-align:left}.donottopic-btn,.topicpreview-btn{padding:4px 12px!important;font-size:14px!important;opacity:0!important;margin-right:5px!important}.topic-list-item:hover .donottopic-btn,.topic-list-item:hover .topicpreview-btn{opacity:1!important}.topicpreview{position:fixed;top:0;left:0;z-index:99999;width:100vw;height:100vh;display:flex;justify-content:center;align-items:center;display:none}.topicpreview .topicpreview-container{padding:30px 0;border-radius:5px;width:100%;max-width:800px;overflow-y:auto;height:80vh;z-index:10;background:var(--header_background);position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)}.topicpreview .topicpreview-container .topicpreview-title{font-size:22px;font-weight:600;padding:0 30px}.topicpreview .topicpreview-container .topicpreview-date{padding:0 30px;color:#666}.topicpreview .topicpreview-container .topicpreview-content>.item{display:flex;align-items:flex-start;padding:20px 30px}.topicpreview .topicpreview-container .topicpreview-content>.item .itemfloor{width:50px;text-align:left;font-size:16px;padding-top:15px;color:#25b4cf}.topicpreview .topicpreview-container .topicpreview-content>.item .itempost{flex:1;background:var(--tertiary-low);padding:15px 15px;border-radius:10px;font-size:15px;word-break:break-all}.topicpreview .topicpreview-container .topicpreview-content>.item .itempost pre code{max-width:620px}.topicpreview .topicpreview-container .topicpreview-content>.item .itempost img{max-width:100%;max-height:100%;height:auto}.topicpreview .topicpreview-container .topicpreview-content>.item .itempost .itemname{font-size:16px;color:#8f3a3a;display:flex;justify-content:space-between;align-items:center}.topicpreview .topicpreview-container .topicpreview-content>.item .itempost .itemname span{color:#9e9e9e;margin-left:20px}.topicpreview .topicpreview-container .topicpreview-content>.item .itempost .itemdate{color:#b9b9b9;font-size:16px;margin-left:auto}.topicpreview-opacity{position:absolute;top:0;left:0;width:100%;height:100%;opacity:1;background:rgba(0,0,0,.6);z-index:9}.body-preview .sidebar-wrapper{display:none!important}body.body-preview #main-outlet-wrapper{display:block!important;padding-left:50px!important}.body-preview .d-header-wrap{display:none!important}.body-preview .menu_suspendedball{display:none!important}.post-activity{white-space:nowrap;display:inline-block;width:100%;text-align:left}.d-header img{height:var(--d-logo-height);width:auto;max-width:100%;object-fit:contain}.aicreated-btn,.aireplay-btn{outline:0;border:none;background:var(--tertiary-low);display:inline-flex;align-items:center;justify-content:center;line-height:1;font-size:14px;padding:4px 10px;border-radius:3px;margin-bottom:10px;margin-right:10px}.aicreated-btn{display:none}.gpt-summary-wrap{background:var(--tertiary-low);border-radius:5px;padding:10px;font-size:14px;margin:0 0 10px 0;line-height:1.6}.gpt-summary-wrap .airegenerate{display:none;margin-top:6px;outline:0;border:1px solid #eee;background:#ffe27d;color:#626262;padding:4px 10px;cursor:pointer;border-radius:3px}.aicreatenewtopictitle{margin-left:20px}.aicreatenewtopictitle:hover{text-decoration:underline;cursor:pointer}.aireply-popup{z-index:999999;position:fixed;top:10%;left:50%;transform:translateX(-50%);width:500px;padding:20px;background:var(--tertiary-low);color:#333;box-shadow:transparent 0 0 0 0,transparent 0 0 0 0,rgba(0,0,0,.1) 0 20px 25px -5px,rgba(0,0,0,.1) 0 8px 10px -6px;border-radius:10px;display:none}.aireply-popup .aireply-popup-text{width:100%;height:120px}.aireply-popup .aireply-popup-close{outline:0;min-width:80px;height:32px;border:none;background-color:var(--header_background);text-shadow:0 -1px 0 rgba(0,0,0,.12);box-shadow:0 2px 0 rgba(0,0,0,.045);border-radius:4px;padding:0 10px;box-sizing:border-box;transition:all .1s linear}#messageToast{z-index:9999999;position:fixed;left:50%;transform:translateX(-50%);top:10%;width:100%;display:flex;flex-direction:column;align-items:center}#messageToast .messageToast-text{background:#4caf50;color:#fff;border-radius:6px;width:auto;display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;text-align:center;line-height:1;height:40px;min-width:240px;font-size:16px;padding:0 30px;box-sizing:border-box;margin-bottom:10px;opacity:0;animation:messageToast .2s forwards;padding:12px 24px;color:#fff;border-radius:4px;font-size:14px;z-index:9999;box-shadow:0 2px 5px rgba(0,0,0,.2)}@keyframes messageToast{0%{transform:translateY(10px);opacity:0}100%{transform:translateY(0);opacity:1}}.pangutext{cursor:pointer;margin-left:20px}.pangutext:hover{color:#279a36}.navigation-container.is-active{position:fixed;top:65px;background:var(--header_background);z-index:9;box-shadow:1px 3px 7px 0 rgba(0,0,0,.2);margin-left:-30px;padding-left:30px;border-radius:5px;padding-top:10px;padding-right:20px;min-width:1000px;width:auto}.topic-body.clearfix.highlighted{background-color:var(--tertiary-low)!important}.hotranking-container{position:fixed;right:100px;bottom:20px;background:#fff;box-shadow:1px 10px 20px rgba(0,0,0,.2);border-radius:10px;width:400px;min-height:380px;padding:20px;box-sizing:border-box;z-index:999}.hotranking-container .flex{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem}.hotranking-container ol li,.hotranking-container ul li{padding:2px 0}.hotranking-container ol li a:hover,.hotranking-container ul li a:hover{text-decoration:underline}.menu-body{padding:0 15px}.inner{display:flex;align-items:center;margin-bottom:10px}.inner label{width:70px;font-weight:400}.inner input{flex:1;margin:0;max-width:300px}.linxudoscripts-tag{background:#29a6a9;color:#fff;font-size:14px!important;padding:0 10px;height:26px;text-align:center;display:inline-flex!important;align-items:center;justify-content:center;border-radius:5px}.menu-table{width:100%}.menu-table td,.menu-table th{padding:10px;font-size:14px}.menu-table .span{cursor:pointer}.menu-table .span+.span{margin-left:10px}.emojiPicker{top:0;left:100%;position:absolute;display:grid;grid-template-columns:repeat(12,1fr);gap:10px;height:100%;overflow:auto;background-color:rgba(0,0,0,.8);padding:10px;border-radius:5px;z-index:9}.emojiPicker img{cursor:pointer;width:30px;height:30px}.UsageTip{position:static;margin:0;font-size:14px;line-height:1.6;background:var(--d-sidebar-background);color:var(--primary-medium)}.UsageTip>div{margin:10px 0}.UsageTip button{padding:8px 10px;margin-bottom:10px;border:none;outline:0;border-radius:4px}.linuxtime img{margin-right:5px}</style>`);
    }
  };
  const _hoisted_1 = { class: "linuxdoscripts-setting-wrap" };
  const _hoisted_2 = { id: "linuxdoscripts" };
  const _hoisted_3 = { class: "linuxdoscripts-opacity" };
  const _hoisted_4 = { class: "setting-btn" };
  const _hoisted_5 = {
    open: "",
    id: "menu_suspendedball"
  };
  const _hoisted_6 = { class: "menu-header" };
  const _hoisted_7 = { class: "menu-flex" };
  const _hoisted_8 = { class: "menu-nav" };
  const _hoisted_9 = { class: "menu-body" };
  const _hoisted_10 = { class: "menu-body-item" };
  const _hoisted_11 = { class: "menu-about" };
  const _hoisted_12 = { class: "hint" };
  const _hoisted_13 = { class: "menu-body-item" };
  const _hoisted_14 = { class: "menu-body-item" };
  const _hoisted_15 = { class: "menu-body-item" };
  const _hoisted_16 = { class: "menu-body-item" };
  const _hoisted_17 = { class: "menu-body-item" };
  const _hoisted_18 = { class: "menu-footer" };
  const _hoisted_19 = {
    id: "floorlotteryDialog",
    open: ""
  };
  const _hoisted_20 = {
    class: "menu-body",
    style: { "margin-top": "10px" }
  };
  const _hoisted_21 = { class: "inner" };
  const _hoisted_22 = { class: "inner" };
  const _hoisted_23 = { key: 0 };
  const _hoisted_24 = {
    key: 1,
    title: "抽奖结果",
    type: "success"
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_BackToTop = resolveComponent("BackToTop");
    const _component_ReplyBtn = resolveComponent("ReplyBtn");
    const _component_LookOP = resolveComponent("LookOP");
    const _component_LevelDiglog = resolveComponent("LevelDiglog");
    const _component_HotRankingList = resolveComponent("HotRankingList");
    const _component_Setting1 = resolveComponent("Setting1");
    const _component_Setting2 = resolveComponent("Setting2");
    const _component_Setting3 = resolveComponent("Setting3");
    const _component_Setting4 = resolveComponent("Setting4");
    const _component_Setting5 = resolveComponent("Setting5");
    const _component_Setting6 = resolveComponent("Setting6");
    const _component_Updates = resolveComponent("Updates");
    const _component_MenuOpenpostblank = resolveComponent("MenuOpenpostblank");
    const _component_MenuNewtopicreminder = resolveComponent("MenuNewtopicreminder");
    const _component_MenuAutoexpandreply = resolveComponent("MenuAutoexpandreply");
    const _component_MenuShowcreatetime = resolveComponent("MenuShowcreatetime");
    const _component_MenuShowcreatetime1 = resolveComponent("MenuShowcreatetime1");
    const _component_MenuShowfloors = resolveComponent("MenuShowfloors");
    const _component_MenuHidetopicdetailtitle = resolveComponent("MenuHidetopicdetailtitle");
    const _component_MenuTopicpreview = resolveComponent("MenuTopicpreview");
    const _component_MenuLookOP = resolveComponent("MenuLookOP");
    const _component_MenuFloorHeight = resolveComponent("MenuFloorHeight");
    const _component_MenuPangu = resolveComponent("MenuPangu");
    const _component_MenuLevelSearch = resolveComponent("MenuLevelSearch");
    const _component_MenuShowUnread = resolveComponent("MenuShowUnread");
    const _component_MenuFilterText = resolveComponent("MenuFilterText");
    const _component_MenuLookmeSign = resolveComponent("MenuLookmeSign");
    const _component_MenureplaceEmojiStyle = resolveComponent("MenureplaceEmojiStyle");
    const _component_MenuEditorJa = resolveComponent("MenuEditorJa");
    const _component_MenuStickyNav = resolveComponent("MenuStickyNav");
    const _component_MenuSelectedShare = resolveComponent("MenuSelectedShare");
    const _component_MenuDisableAutoplay = resolveComponent("MenuDisableAutoplay");
    const _component_MenuShowRepltBtn = resolveComponent("MenuShowRepltBtn");
    const _component_MenuDonotTopic = resolveComponent("MenuDonotTopic");
    const _component_MenuAutoDark = resolveComponent("MenuAutoDark");
    const _component_MenuHiddenPlaceholder = resolveComponent("MenuHiddenPlaceholder");
    const _component_MenuDisableReplaceState = resolveComponent("MenuDisableReplaceState");
    const _component_MenuRemovePostAvatar = resolveComponent("MenuRemovePostAvatar");
    const _component_MenuHotRankingList = resolveComponent("MenuHotRankingList");
    const _component_MenuBackToTop = resolveComponent("MenuBackToTop");
    const _component_MenuQuickLikeTopic = resolveComponent("MenuQuickLikeTopic");
    const _component_MenuHideNewBluedot = resolveComponent("MenuHideNewBluedot");
    const _component_MenuGifToPng = resolveComponent("MenuGifToPng");
    const _component_MenuHideHomeBanner = resolveComponent("MenuHideHomeBanner");
    const _component_MenuBookmark = resolveComponent("MenuBookmark");
    const _component_MenuLogoUrl = resolveComponent("MenuLogoUrl");
    const _component_MenuCreatereply = resolveComponent("MenuCreatereply");
    const _component_MenuBlockKeyword = resolveComponent("MenuBlockKeyword");
    const _component_MenuBlockuserlist = resolveComponent("MenuBlockuserlist");
    const _component_MenuShieldPosts = resolveComponent("MenuShieldPosts");
    const _component_MenuOtherCss = resolveComponent("MenuOtherCss");
    const _component_UserTags = resolveComponent("UserTags");
    const _component_GPTconfig = resolveComponent("GPTconfig");
    const _component_Themes = resolveComponent("Themes");
    const _component_SyncBackup = resolveComponent("SyncBackup");
    const _component_UsageTip = resolveComponent("UsageTip");
    const _component_ReplyTBEnjoy = resolveComponent("ReplyTBEnjoy");
    const _component_Signature = resolveComponent("Signature");
    return openBlock(), createElementBlock(
      Fragment,
      null,
      [
        createBaseVNode("div", _hoisted_1, [
          createBaseVNode("button", {
            class: "linuxdoscripts-setting",
            title: "设置",
            type: "button",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.setting && $options.setting(...args))
          }, _cache[59] || (_cache[59] = [
            createBaseVNode(
              "svg",
              {
                xmlns: "http://www.w3.org/2000/svg",
                width: "24",
                height: "24",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                class: "icon icon-tabler icons-tabler-outline icon-tabler-settings"
              },
              [
                createBaseVNode("path", {
                  stroke: "none",
                  d: "M0 0h24v24H0z",
                  fill: "none"
                }),
                createBaseVNode("path", { d: "M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" }),
                createBaseVNode("path", { d: "M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" })
              ],
              -1
              /* HOISTED */
            )
          ]))
        ]),
        createBaseVNode("div", _hoisted_2, [
          withDirectives(createBaseVNode(
            "div",
            _hoisted_3,
            null,
            512
            /* NEED_PATCH */
          ), [
            [vShow, $data.opacity]
          ]),
          createBaseVNode("div", _hoisted_4, [
            withDirectives(createVNode(
              _component_BackToTop,
              null,
              null,
              512
              /* NEED_PATCH */
            ), [
              [vShow, $data.showbacktotop]
            ]),
            createCommentVNode(" 返回顶部按钮 "),
            withDirectives(createVNode(
              _component_ReplyBtn,
              null,
              null,
              512
              /* NEED_PATCH */
            ), [
              [vShow, $data.showreplybtn]
            ]),
            createCommentVNode(" 显示回复按钮 "),
            withDirectives(createVNode(
              _component_LookOP,
              null,
              null,
              512
              /* NEED_PATCH */
            ), [
              [vShow, $data.showlookop]
            ]),
            createCommentVNode(" 只看楼主 "),
            withDirectives(createVNode(
              _component_LevelDiglog,
              null,
              null,
              512
              /* NEED_PATCH */
            ), [
              [vShow, $data.showlevelsearch]
            ]),
            createCommentVNode(" 查询等级功能 "),
            withDirectives(createVNode(
              _component_HotRankingList,
              null,
              null,
              512
              /* NEED_PATCH */
            ), [
              [vShow, $data.showhotranking]
            ]),
            createCommentVNode(" 最热排行榜 ")
          ]),
          withDirectives(createBaseVNode(
            "dialog",
            _hoisted_5,
            [
              createBaseVNode("div", _hoisted_6, [
                _cache[60] || (_cache[60] = createBaseVNode(
                  "div",
                  { class: "title" },
                  "LinuxDo Scripts 扩展设置",
                  -1
                  /* HOISTED */
                )),
                createBaseVNode("div", {
                  class: "close",
                  onClick: _cache[1] || (_cache[1] = (...args) => $options.closedialog && $options.closedialog(...args))
                }, "+")
              ]),
              createBaseVNode("div", _hoisted_7, [
                createBaseVNode("ul", _hoisted_8, [
                  createBaseVNode(
                    "li",
                    {
                      onClick: _cache[2] || (_cache[2] = ($event) => $options.showItem(0)),
                      class: normalizeClass({ act: $data.activeIndex == 0 })
                    },
                    [
                      createVNode(_component_Setting1),
                      _cache[61] || (_cache[61] = createTextVNode("通用设置"))
                    ],
                    2
                    /* CLASS */
                  ),
                  createBaseVNode(
                    "li",
                    {
                      onClick: _cache[3] || (_cache[3] = ($event) => $options.showItem(1)),
                      class: normalizeClass({ act: $data.activeIndex == 1 })
                    },
                    [
                      createVNode(_component_Setting2),
                      _cache[62] || (_cache[62] = createTextVNode("自定义"))
                    ],
                    2
                    /* CLASS */
                  ),
                  createBaseVNode(
                    "li",
                    {
                      onClick: _cache[4] || (_cache[4] = ($event) => $options.showItem(2)),
                      class: normalizeClass({ act: $data.activeIndex == 2 })
                    },
                    [
                      createVNode(_component_Setting3),
                      _cache[63] || (_cache[63] = createTextVNode("用户标签"))
                    ],
                    2
                    /* CLASS */
                  ),
                  createBaseVNode(
                    "li",
                    {
                      onClick: _cache[5] || (_cache[5] = ($event) => $options.showItem(3)),
                      class: normalizeClass({ act: $data.activeIndex == 3 })
                    },
                    [
                      createVNode(_component_Setting4),
                      _cache[64] || (_cache[64] = createTextVNode("AI 配置"))
                    ],
                    2
                    /* CLASS */
                  ),
                  createBaseVNode(
                    "li",
                    {
                      onClick: _cache[6] || (_cache[6] = ($event) => $options.showItem(4)),
                      class: normalizeClass({ act: $data.activeIndex == 4 })
                    },
                    [
                      createVNode(_component_Setting5),
                      _cache[65] || (_cache[65] = createTextVNode("主题风格"))
                    ],
                    2
                    /* CLASS */
                  ),
                  createBaseVNode(
                    "li",
                    {
                      onClick: _cache[7] || (_cache[7] = ($event) => $options.showItem(5)),
                      class: normalizeClass({ act: $data.activeIndex == 5 })
                    },
                    [
                      createVNode(_component_Setting6),
                      _cache[66] || (_cache[66] = createTextVNode("数据同步"))
                    ],
                    2
                    /* CLASS */
                  ),
                  createVNode(_component_Updates)
                ]),
                createBaseVNode("div", _hoisted_9, [
                  withDirectives(createBaseVNode(
                    "div",
                    _hoisted_10,
                    [
                      createBaseVNode("div", _hoisted_11, [
                        _cache[69] || (_cache[69] = createBaseVNode(
                          "p",
                          null,
                          "请注意，该设置面板数据全部保存在本地浏览器缓存中，注意备份。",
                          -1
                          /* HOISTED */
                        )),
                        createBaseVNode("p", _hoisted_12, [
                          _cache[67] || (_cache[67] = createTextVNode(" 如果感觉哪里不太对劲，点我 ")),
                          createBaseVNode("span", {
                            class: "initialization",
                            onClick: _cache[8] || (_cache[8] = (...args) => $options.initialization && $options.initialization(...args))
                          }, "初始化设置"),
                          _cache[68] || (_cache[68] = createTextVNode(" ，会清除所有的设置数据并初始化！！ "))
                        ])
                      ]),
                      createCommentVNode(" 新标签页打开 "),
                      createVNode(_component_MenuOpenpostblank, {
                        sort: 1,
                        modelValue: $data.settingData.checked1,
                        "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $data.settingData.checked1 = $event)
                      }, null, 8, ["modelValue"]),
                      createCommentVNode(" 新话题提醒 "),
                      createVNode(_component_MenuNewtopicreminder, {
                        sort: 2,
                        modelValue: $data.settingData.checked2,
                        "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => $data.settingData.checked2 = $event)
                      }, null, 8, ["modelValue"]),
                      createCommentVNode(" 自动展开回复 "),
                      createVNode(_component_MenuAutoexpandreply, {
                        sort: 3,
                        modelValue: $data.settingData.checked3,
                        "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => $data.settingData.checked3 = $event)
                      }, null, 8, ["modelValue"]),
                      createCommentVNode(' <MenuAutoexpandreply1 :sort="3.1" v-model="settingData.checked31" /> '),
                      createCommentVNode(" 话题列表显示创建时间 "),
                      createVNode(_component_MenuShowcreatetime, {
                        sort: 4,
                        modelValue: $data.settingData.checked4,
                        "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => $data.settingData.checked4 = $event)
                      }, null, 8, ["modelValue"]),
                      createVNode(_component_MenuShowcreatetime1, {
                        sort: 4.1,
                        modelValue: $data.settingData.checked41,
                        "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => $data.settingData.checked41 = $event)
                      }, null, 8, ["modelValue"]),
                      createCommentVNode(" 显示楼层数 "),
                      createVNode(_component_MenuShowfloors, {
                        sort: 5,
                        modelValue: $data.settingData.checked5,
                        "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => $data.settingData.checked5 = $event)
                      }, null, 8, ["modelValue"]),
                      createCommentVNode(" 隐藏话题详情顶部大标题 "),
                      createVNode(_component_MenuHidetopicdetailtitle, {
                        sort: 6,
                        modelValue: $data.settingData.checked6,
                        "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => $data.settingData.checked6 = $event)
                      }, null, 8, ["modelValue"]),
                      createCommentVNode(" 话题预览功能 "),
                      createVNode(_component_MenuTopicpreview, {
                        sort: 7,
                        modelValue: $data.settingData.checked7,
                        "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => $data.settingData.checked7 = $event)
                      }, null, 8, ["modelValue"]),
                      createCommentVNode(" 只看楼主按钮 "),
                      createVNode(_component_MenuLookOP, {
                        sort: 9,
                        modelValue: $data.settingData.checked9,
                        "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => $data.settingData.checked9 = $event)
                      }, null, 8, ["modelValue"]),
                      createCommentVNode(" 智能限制楼层高度 "),
                      createVNode(_component_MenuFloorHeight, {
                        sort: 10,
                        modelValue: $data.settingData.checked10,
                        "onUpdate:modelValue": _cache[18] || (_cache[18] = ($event) => $data.settingData.checked10 = $event)
                      }, null, 8, ["modelValue"]),
                      createCommentVNode(" 中英文混排优化显示 "),
                      createVNode(_component_MenuPangu, {
                        sort: 11,
                        modelValue: $data.settingData.checked11,
                        "onUpdate:modelValue": _cache[19] || (_cache[19] = ($event) => $data.settingData.checked11 = $event)
                      }, null, 8, ["modelValue"]),
                      createCommentVNode(" 是否显示等级查询按钮 "),
                      createVNode(_component_MenuLevelSearch, {
                        sort: 12,
                        modelValue: $data.settingData.checked12,
                        "onUpdate:modelValue": _cache[20] || (_cache[20] = ($event) => $data.settingData.checked12 = $event)
                      }, null, 8, ["modelValue"]),
                      createCommentVNode(" 消息通知仅显示未读 "),
                      createVNode(_component_MenuShowUnread, {
                        sort: 13,
                        modelValue: $data.settingData.checked13,
                        "onUpdate:modelValue": _cache[21] || (_cache[21] = ($event) => $data.settingData.checked13 = $event)
                      }, null, 8, ["modelValue"]),
                      createCommentVNode(" 是否屏蔽模糊文字 "),
                      createVNode(_component_MenuFilterText, {
                        sort: 14,
                        modelValue: $data.settingData.checked14,
                        "onUpdate:modelValue": _cache[22] || (_cache[22] = ($event) => $data.settingData.checked14 = $event)
                      }, null, 8, ["modelValue"]),
                      createCommentVNode(" 只看自己签名 "),
                      createVNode(_component_MenuLookmeSign, {
                        sort: 15,
                        modelValue: $data.settingData.checked15,
                        "onUpdate:modelValue": _cache[23] || (_cache[23] = ($event) => $data.settingData.checked15 = $event)
                      }, null, 8, ["modelValue"]),
                      createCommentVNode(" 切换论坛表情风格 "),
                      createVNode(_component_MenureplaceEmojiStyle, {
                        sort: 16,
                        modelValue: $data.settingData.checked17,
                        "onUpdate:modelValue": _cache[24] || (_cache[24] = ($event) => $data.settingData.checked17 = $event)
                      }, null, 8, ["modelValue"]),
                      createCommentVNode(" 编辑器切换 ja 字体 "),
                      createVNode(_component_MenuEditorJa, {
                        sort: 17,
                        modelValue: $data.settingData.checked19,
                        "onUpdate:modelValue": _cache[25] || (_cache[25] = ($event) => $data.settingData.checked19 = $event)
                      }, null, 8, ["modelValue"]),
                      createCommentVNode(" 开启列表页导航栏浮动 "),
                      createVNode(_component_MenuStickyNav, {
                        sort: 18,
                        modelValue: $data.settingData.checked20,
                        "onUpdate:modelValue": _cache[26] || (_cache[26] = ($event) => $data.settingData.checked20 = $event)
                      }, null, 8, ["modelValue"]),
                      createCommentVNode(" 禁用选中文字分享功能 "),
                      createVNode(_component_MenuSelectedShare, {
                        sort: 20,
                        modelValue: $data.settingData.checked23,
                        "onUpdate:modelValue": _cache[27] || (_cache[27] = ($event) => $data.settingData.checked23 = $event)
                      }, null, 8, ["modelValue"]),
                      createCommentVNode(" 禁用视频自动播放 "),
                      createVNode(_component_MenuDisableAutoplay, {
                        sort: 21,
                        modelValue: $data.settingData.checked24,
                        "onUpdate:modelValue": _cache[28] || (_cache[28] = ($event) => $data.settingData.checked24 = $event)
                      }, null, 8, ["modelValue"]),
                      createCommentVNode(" 回复悬浮按钮 "),
                      createVNode(_component_MenuShowRepltBtn, {
                        sort: 22,
                        modelValue: $data.settingData.checked25,
                        "onUpdate:modelValue": _cache[29] || (_cache[29] = ($event) => $data.settingData.checked25 = $event)
                      }, null, 8, ["modelValue"]),
                      createCommentVNode(" 列表快速免打扰帖子 "),
                      createVNode(_component_MenuDonotTopic, {
                        sort: 23,
                        modelValue: $data.settingData.checked26,
                        "onUpdate:modelValue": _cache[30] || (_cache[30] = ($event) => $data.settingData.checked26 = $event)
                      }, null, 8, ["modelValue"]),
                      createCommentVNode(" 自动切换黑夜模式 "),
                      createVNode(_component_MenuAutoDark, {
                        sort: 24,
                        modelValue: $data.settingData.checked27,
                        "onUpdate:modelValue": _cache[31] || (_cache[31] = ($event) => $data.settingData.checked27 = $event)
                      }, null, 8, ["modelValue"]),
                      createCommentVNode(" 是否隐藏输入框提示文字 "),
                      createVNode(_component_MenuHiddenPlaceholder, {
                        sort: 25,
                        modelValue: $data.settingData.checked28,
                        "onUpdate:modelValue": _cache[32] || (_cache[32] = ($event) => $data.settingData.checked28 = $event)
                      }, null, 8, ["modelValue"]),
                      createCommentVNode(" 是否禁用浏览帖子时 URL 更新楼层数 "),
                      createVNode(_component_MenuDisableReplaceState, {
                        sort: 26,
                        modelValue: $data.settingData.checked29,
                        "onUpdate:modelValue": _cache[33] || (_cache[33] = ($event) => $data.settingData.checked29 = $event)
                      }, null, 8, ["modelValue"]),
                      createCommentVNode(" 是否移除话题上的头像 (减少网络请求) "),
                      createVNode(_component_MenuRemovePostAvatar, {
                        sort: 27,
                        modelValue: $data.settingData.removePostavatarData,
                        "onUpdate:modelValue": _cache[34] || (_cache[34] = ($event) => $data.settingData.removePostavatarData = $event)
                      }, null, 8, ["modelValue"]),
                      createCommentVNode(" 是否显示最热帖子排行榜 "),
                      createVNode(_component_MenuHotRankingList, {
                        sort: 28,
                        modelValue: $data.settingData.checked33,
                        "onUpdate:modelValue": _cache[35] || (_cache[35] = ($event) => $data.settingData.checked33 = $event)
                      }, null, 8, ["modelValue"]),
                      createCommentVNode(" 是否显示返回顶部按钮 "),
                      createVNode(_component_MenuBackToTop, {
                        sort: 29,
                        modelValue: $data.settingData.checked34,
                        "onUpdate:modelValue": _cache[36] || (_cache[36] = ($event) => $data.settingData.checked34 = $event)
                      }, null, 8, ["modelValue"]),
                      createCommentVNode(" 是否显示快捷点赞主题按钮 "),
                      createVNode(_component_MenuQuickLikeTopic, {
                        sort: 30,
                        modelValue: $data.settingData.checked35,
                        "onUpdate:modelValue": _cache[37] || (_cache[37] = ($event) => $data.settingData.checked35 = $event)
                      }, null, 8, ["modelValue"]),
                      createCommentVNode(" 隐藏新消息小蓝点（除帖子未读小蓝点） "),
                      createVNode(_component_MenuHideNewBluedot, {
                        sort: 32,
                        modelValue: $data.settingData.checked37,
                        "onUpdate:modelValue": _cache[38] || (_cache[38] = ($event) => $data.settingData.checked37 = $event)
                      }, null, 8, ["modelValue"]),
                      createCommentVNode(" gif 头像转静态图片 "),
                      createVNode(_component_MenuGifToPng, {
                        sort: 33,
                        modelValue: $data.settingData.checked38,
                        "onUpdate:modelValue": _cache[39] || (_cache[39] = ($event) => $data.settingData.checked38 = $event)
                      }, null, 8, ["modelValue"]),
                      createCommentVNode(" 新增是否隐藏首页 banner 区域 "),
                      createVNode(_component_MenuHideHomeBanner, {
                        sort: 34,
                        modelValue: $data.settingData.checked39,
                        "onUpdate:modelValue": _cache[40] || (_cache[40] = ($event) => $data.settingData.checked39 = $event)
                      }, null, 8, ["modelValue"]),
                      createCommentVNode(" 是否开启收藏功能 "),
                      createVNode(_component_MenuBookmark, {
                        sort: 35,
                        modelValue: $data.settingData.checked40,
                        "onUpdate:modelValue": _cache[41] || (_cache[41] = ($event) => $data.settingData.checked40 = $event)
                      }, null, 8, ["modelValue"])
                    ],
                    512
                    /* NEED_PATCH */
                  ), [
                    [vShow, $data.activeIndex == 0]
                  ]),
                  withDirectives(createBaseVNode(
                    "div",
                    _hoisted_13,
                    [
                      createCommentVNode(" 自定义论坛 logo "),
                      createVNode(_component_MenuLogoUrl, {
                        sort: 1,
                        value: $data.settingData.logourl,
                        "onUpdate:value": _cache[42] || (_cache[42] = ($event) => $data.settingData.logourl = $event)
                      }, null, 8, ["value"]),
                      createCommentVNode(" 自定义快捷回复 "),
                      createVNode(_component_MenuCreatereply, {
                        sort: 2,
                        value: $data.settingData.QuickReply,
                        "onUpdate:value": _cache[43] || (_cache[43] = ($event) => $data.settingData.QuickReply = $event)
                      }, null, 8, ["value"]),
                      createCommentVNode(" 关键词屏蔽功能 "),
                      createVNode(_component_MenuBlockKeyword, {
                        sort: 3,
                        value: $data.settingData.blockkeywrod,
                        "onUpdate:value": _cache[44] || (_cache[44] = ($event) => $data.settingData.blockkeywrod = $event)
                      }, null, 8, ["value"]),
                      createCommentVNode(" 屏蔽指定用户 "),
                      createVNode(_component_MenuBlockuserlist, {
                        sort: 4,
                        value: $data.settingData.blockList,
                        "onUpdate:value": _cache[45] || (_cache[45] = ($event) => $data.settingData.blockList = $event)
                      }, null, 8, ["value"]),
                      createCommentVNode(" 屏蔽指定分类的多少天前的帖子 "),
                      createVNode(_component_MenuShieldPosts, {
                        sort: 5,
                        value: $data.settingData.checked21,
                        "onUpdate:value": _cache[46] || (_cache[46] = ($event) => $data.settingData.checked21 = $event)
                      }, null, 8, ["value"]),
                      createCommentVNode(" 自定义 CSS "),
                      createVNode(_component_MenuOtherCss, {
                        sort: 6,
                        value: $data.settingData.othercss,
                        "onUpdate:value": _cache[47] || (_cache[47] = ($event) => $data.settingData.othercss = $event)
                      }, null, 8, ["value"])
                    ],
                    512
                    /* NEED_PATCH */
                  ), [
                    [vShow, $data.activeIndex == 1]
                  ]),
                  withDirectives(createBaseVNode(
                    "div",
                    _hoisted_14,
                    [
                      createVNode(_component_UserTags, {
                        value: $data.settingData.usertags,
                        "onUpdate:value": _cache[48] || (_cache[48] = ($event) => $data.settingData.usertags = $event)
                      }, null, 8, ["value"])
                    ],
                    512
                    /* NEED_PATCH */
                  ), [
                    [vShow, $data.activeIndex == 2]
                  ]),
                  withDirectives(createBaseVNode(
                    "div",
                    _hoisted_15,
                    [
                      createVNode(_component_GPTconfig, {
                        value: $data.settingData.gptdata,
                        "onUpdate:value": _cache[49] || (_cache[49] = ($event) => $data.settingData.gptdata = $event)
                      }, null, 8, ["value"])
                    ],
                    512
                    /* NEED_PATCH */
                  ), [
                    [vShow, $data.activeIndex == 3]
                  ]),
                  withDirectives(createBaseVNode(
                    "div",
                    _hoisted_16,
                    [
                      createVNode(_component_Themes, {
                        modelValue: $data.settingData.themes,
                        "onUpdate:modelValue": _cache[50] || (_cache[50] = ($event) => $data.settingData.themes = $event)
                      }, null, 8, ["modelValue"])
                    ],
                    512
                    /* NEED_PATCH */
                  ), [
                    [vShow, $data.activeIndex == 4]
                  ]),
                  withDirectives(createBaseVNode(
                    "div",
                    _hoisted_17,
                    [
                      createVNode(_component_SyncBackup, {
                        value: $data.settingData.syncbackup,
                        "onUpdate:value": _cache[51] || (_cache[51] = ($event) => $data.settingData.syncbackup = $event)
                      }, null, 8, ["value"])
                    ],
                    512
                    /* NEED_PATCH */
                  ), [
                    [vShow, $data.activeIndex == 5]
                  ])
                ])
              ]),
              createBaseVNode("div", _hoisted_18, [
                createBaseVNode("button", {
                  class: "save",
                  onClick: _cache[52] || (_cache[52] = (...args) => $options.save && $options.save(...args))
                }, "保存"),
                createBaseVNode("button", {
                  class: "saveload",
                  onClick: _cache[53] || (_cache[53] = (...args) => $options.saveload && $options.saveload(...args))
                }, "保存并刷新"),
                createBaseVNode("button", {
                  class: "floorlottery",
                  onClick: _cache[54] || (_cache[54] = (...args) => $options.openFloorlottery && $options.openFloorlottery(...args))
                }, "楼层抽奖")
              ])
            ],
            512
            /* NEED_PATCH */
          ), [
            [vShow, $data.showdialog]
          ]),
          createCommentVNode(" 楼层抽奖 "),
          withDirectives(createBaseVNode(
            "dialog",
            _hoisted_19,
            [
              _cache[73] || (_cache[73] = createBaseVNode(
                "div",
                { class: "menu-header" },
                [
                  createBaseVNode("div", { class: "title" }, "楼层抽奖")
                ],
                -1
                /* HOISTED */
              )),
              createBaseVNode("div", _hoisted_20, [
                createBaseVNode("div", _hoisted_21, [
                  _cache[70] || (_cache[70] = createBaseVNode(
                    "label",
                    null,
                    "总楼层数：",
                    -1
                    /* HOISTED */
                  )),
                  withDirectives(createBaseVNode(
                    "input",
                    {
                      type: "text",
                      "onUpdate:modelValue": _cache[55] || (_cache[55] = ($event) => $data.floorlotteryval1 = $event)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [vModelText, $data.floorlotteryval1]
                  ])
                ]),
                createBaseVNode("div", _hoisted_22, [
                  _cache[71] || (_cache[71] = createBaseVNode(
                    "label",
                    null,
                    "抽奖数量：",
                    -1
                    /* HOISTED */
                  )),
                  withDirectives(createBaseVNode(
                    "input",
                    {
                      type: "text",
                      "onUpdate:modelValue": _cache[56] || (_cache[56] = ($event) => $data.floorlotteryval2 = $event)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [vModelText, $data.floorlotteryval2]
                  ])
                ]),
                createBaseVNode("button", {
                  class: "btn save",
                  onClick: _cache[57] || (_cache[57] = (...args) => $options.drawRandomNumbers && $options.drawRandomNumbers(...args))
                }, "开始抽奖"),
                createBaseVNode("button", {
                  class: "btn",
                  style: { "background": "#979797" },
                  plain: "",
                  onClick: _cache[58] || (_cache[58] = (...args) => $options.closelotter && $options.closelotter(...args))
                }, " 关闭弹窗 "),
                _cache[72] || (_cache[72] = createBaseVNode(
                  "div",
                  { style: { "height": "20px" } },
                  null,
                  -1
                  /* HOISTED */
                )),
                $data.floorlotterloading ? (openBlock(), createElementBlock("div", _hoisted_23, "正在抽奖...")) : createCommentVNode("v-if", true),
                $data.floorlotterresult ? (openBlock(), createElementBlock(
                  "div",
                  _hoisted_24,
                  " 抽奖结果：恭喜 " + toDisplayString($data.floorlotterresult) + " 楼中奖！ ",
                  1
                  /* TEXT */
                )) : createCommentVNode("v-if", true)
              ])
            ],
            512
            /* NEED_PATCH */
          ), [
            [vShow, $data.showFloorLottery]
          ]),
          createCommentVNode(" 使用提示 "),
          createVNode(_component_UsageTip),
          createCommentVNode(" 回复弹窗显示贴吧表情 "),
          createVNode(_component_ReplyTBEnjoy),
          createCommentVNode(" 修复小尾巴裂图 "),
          createVNode(_component_Signature)
        ]),
        _cache[74] || (_cache[74] = createBaseVNode(
          "div",
          { id: "messageToast" },
          null,
          -1
          /* HOISTED */
        ))
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/zsh-code/seo/demo/linuxdo-scripts/entrypoints/App.vue"]]);
  const definition = defineContentScript({
    matches: ["https://linux.do/*"],
    cssInjectionMode: "ui",
    async main(ctx) {
      const ui = await createShadowRootUi(ctx, {
        name: "linuxdo-scripts-ui",
        position: "inline",
        anchor: "body",
        onMount: (container) => {
          const app = createApp(App);
          app.mount(container);
        },
        onRemove: (app) => {
          app == null ? void 0 : app.unmount();
        }
      });
      ui.mount();
    }
  });
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
  const result = (async () => {
    try {
      initPlugins();
      const { main, ...options } = definition;
      const ctx = new ContentScriptContext("content", options);
      return await main(ctx);
    } catch (err) {
      logger.error(
        `The content script "${"content"}" crashed on startup!`,
        err
      );
      throw err;
    }
  })();
  return result;
}();
content;
