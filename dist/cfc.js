(() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value2) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value: value2 }) : obj[key] = value2;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __commonJS = (cb2, mod) => function __require() {
    return mod || (0, cb2[__getOwnPropNames(cb2)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // src/scripts/env.js
  var require_env = __commonJS({
    "src/scripts/env.js"() {
      (function(global) {
        global.env = {
          destructure: true
        };
        const env2 = global.env;
        Promise.prototype.ObjectType = "Promise";
      })(window);
    }
  });

  // src/scripts/extends.js
  var require_extends = __commonJS({
    "src/scripts/extends.js"() {
      (function(global) {
        HTMLCollection.prototype.toArray = function() {
          let b = [];
          for (let a = 0; a < this.length; a++) {
            b[a] = this[a];
          }
          return b;
        };
        NodeList.prototype.toArray = function() {
          let b = [];
          let index = -1;
          let length2 = this.length;
          while (++index < length2) {
            b[index] = this[index];
          }
          ;
          return b;
        };
        Object.cache = /* @__PURE__ */ Object.create(null);
        Object.caching = (name2) => {
          const obj = Object.cache;
          if (!obj[name2]) {
            obj[name2] = {};
          }
          ;
          return {
            set(key, value2) {
              obj[name2][key] = value2;
              return true;
            },
            get(key) {
              return obj[name2][key];
            }
          };
        };
        String.prototype.toHyphen = function() {
          let _StringCache = Object.cache;
          let cvt = null;
          let str = this;
          if (!_StringCache.toHyphen) {
            _StringCache.toHyphen = {};
          }
          ;
          if (_StringCache[str]) {
            cvt = _StringCache[str];
          }
          ;
          if (cvt != void 0) {
            return cvt;
          }
          ;
          let splitted = str.split("");
          let ss = "", i = -1;
          while (++i < splitted.length) {
            let s = splitted[i];
            switch (i) {
              case 0:
                {
                  ss += s.toLowerCase();
                }
                break;
              default: {
                s.charCodeAt() < 91 && (ss += "-");
                ss += s.toLowerCase();
              }
            }
          }
          ;
          _StringCache[str] = ss;
          cvt = ss;
          return cvt;
        };
        String.prototype.toProper = function() {
          let str = this;
          let cache = Object.caching("toProper").get(str);
          if (cache) {
            return cache;
          } else {
            let first = str.substring(0, 1);
            let rest = str.slice(1);
            let proper = `${first.toUpperCase()}${rest}`;
            Object.caching("toProper").set(str, proper);
            return proper;
          }
          ;
        };
        String.prototype.removeSpace = function() {
          return this.split(" ").join("");
        };
        String.prototype.toCamelCase = function() {
          let str = this.toLowerCase();
          let _StringCache = Object.cache;
          let cvt = null;
          if (!_StringCache.toCamel) {
            _StringCache.toCamel = {};
          }
          ;
          _StringCache = _StringCache.toCamel;
          if (_StringCache[str]) {
            return _StringCache[str];
          } else {
            let split = str.split("-");
            if (split.length == 1) {
              return str;
            }
            ;
            let join = "";
            let i = -1;
            let length2 = split.length;
            while (++i < length2) {
              let str2 = split[i];
              switch (i) {
                case 0:
                  {
                    join += str2;
                  }
                  ;
                  break;
                default:
                  {
                    let first = str2.substring(0, 1).toUpperCase();
                    ;
                    let second = str2.substring(1);
                    join += first + second;
                  }
                  break;
              }
            }
            ;
            _StringCache[str] = join;
            return join;
          }
          ;
        };
        HTMLElement.prototype.querySelectorIncluded = function(selector2, attr, val) {
          let q = this.querySelector(selector2);
          return q ? q : (() => {
            switch (true) {
              case (!attr && !val):
                {
                  let qu = this.closest(selector2);
                  if (qu == this) {
                    q = qu;
                  }
                  ;
                }
                ;
                break;
              case (!!attr && !!val):
                {
                  q = this.getAttribute(attr) == val ? this : null;
                }
                ;
                break;
              case (!!attr && !val):
                {
                  q = this.getAttribute(attr) ? this : null;
                }
                break;
            }
            ;
            return q;
          })();
        };
        HTMLElement.prototype.querySelectorAllIncluded = function(selector2, attr, val) {
          let q;
          try {
            q = this.querySelectorAll(selector2);
            q && (q = q.toArray());
          } catch (err) {
            q = [];
          }
          ;
          if (selector2) {
            q = this.querySelectorAll(selector2).toArray();
          } else if (attr && val) {
            q = this.querySelectorAll(`[${attr}=${val}]`).toArray();
            if (this.dataset[attr] == val) {
              q.push(this);
            }
            ;
          } else if (attr && !val) {
            q = this.querySelectorAll(`[${attr}]`).toArray();
            if (!!this.dataset[attr]) {
              q.push(this);
            }
            ;
          }
          ;
          switch (true) {
            case (!attr && !val):
              {
                let qu = this.closest(selector2);
                qu == this && q.push(qu);
              }
              ;
              break;
            case (attr && val):
              {
              }
              ;
              break;
            case (attr && !val):
              {
              }
              break;
          }
          ;
          return q;
        };
        HTMLDocument.prototype.querySelectorIncluded = function(selector2) {
          return this.querySelector(selector2);
        };
        HTMLDocument.prototype.querySelectorAllIncluded = function(selector2) {
          return this.querySelectorAll(selector2);
        };
        Array.prototype.toggler = function(dataName, activeClass) {
          for (let t = 0; t < this.length; t++) {
            let node = this[t];
            let name2 = node.dataset.name;
            if (name2 == dataName) {
              node.classList.toggle(activeClass);
            } else {
              if (node.classList.contains(activeClass)) {
                node.classList.toggle(activeClass);
              }
              ;
            }
            ;
          }
          ;
        };
        HTMLElement.prototype.Ref = function() {
          let n = "_cakes_storage";
          !this[n] && (this._cakes_storage = {});
          let storage = this[n];
          return {
            set(key, value2) {
              storage[key] = value2;
            },
            get(key) {
              return storage[key];
            },
            getAll(key) {
              return storage;
            },
            remove(key) {
              delete storage[key];
            }
          };
        };
        HTMLElement.prototype.replaceDataSrc = function() {
          let srcs = this.querySelectorAllIncluded(null, "data-src", null);
          for (let s = 0; s < srcs.length; s++) {
            let el = srcs[s];
            el.setAttribute("src", el.dataset.src);
            el.removeAttribute("data-src");
          }
          ;
        };
        Object.keep = function(path, data2) {
          let rawdirs = path.split(".");
          let dirs = rawdirs.slice(1);
          let isArray = data2.constructor.name == "Array";
          let ins = isArray ? [] : {};
          const has = function(obj, prop, value2) {
            if (!obj[prop]) {
              obj[prop] = value2 == void 0 ? {} : value2;
            }
            ;
            return obj[prop];
          };
          if (rawdirs[0]) {
            has(Object.cache, rawdirs[0], dirs.length ? {} : data2);
          }
          ;
          let orig = Object.cache[rawdirs[0]];
          for (let i = 0; i < dirs.length; i++) {
            let dir = dirs[i];
            let last = dirs.length - 1 == i;
            if (last) {
              orig = has(orig, dir, ins);
              if (isArray) {
                orig = orig.concat(data2);
              } else {
                orig = Object.assign(orig, data2);
              }
              ;
            } else {
              orig = has(orig, dir, {});
            }
            ;
          }
          ;
          return Object.cache[rawdirs[0]];
        };
      })(window);
    }
  });

  // src/scripts/utils.js
  var require_utils = __commonJS({
    "src/scripts/utils.js"(exports, module) {
      var global = {};
      var TYPES = {
        typeof: function(ctx2) {
          switch (true) {
            case typeof ctx2 == "string":
              return "string";
            case typeof ctx2 == "number":
              return "number";
            case ctx2 instanceof Array:
              return "array";
            case ctx2 instanceof Function:
              return "function";
            case ctx2 instanceof HTMLCollection:
              return "htmlcollection";
            case ctx2 instanceof NodeList:
              return "htmlnodelist";
            case ctx2 instanceof Element:
              return "domlement";
            case ctx2 instanceof Object:
              return "object";
          }
          ;
        },
        isArray: function(ctx2) {
          return this.typeof(ctx2) == "array";
        },
        isObject: function(ctx2) {
          return this.typeof(ctx2) == "object";
        },
        isNumber: function(ctx2) {
          return this.typeof(ctx2) == "number";
        },
        isString: function(ctx2) {
          return this.typeof(ctx2) == "string";
        },
        isHTMLCollection: function(ctx2) {
          return this.typeof(ctx2) == "htmlcollection";
        },
        isNodeList: function(ctx2) {
          return this.typeof(ctx2) == "htmlnodelist";
        },
        isElement: function(ctx2) {
          return this.typeof(ctx2) == "domlement";
        },
        isFunction: function(ctx2) {
          return this.typeof(ctx2) == "function";
        }
      };
      var LOOP = {
        _each: function(ctx2, fn2, type2) {
          if (type2 == "object") {
            var i = 0;
            for (var key in ctx2) {
              if (ctx2.hasOwnProperty(key)) {
                fn2({ key, value: ctx2[key] }, i);
                i = i + 1;
              }
              ;
            }
            ;
          } else {
            for (var a = 0; a < ctx2.length; a++) {
              fn2(ctx2[a], a);
            }
          }
          ;
        },
        each: function(ctx2, fn2) {
          var type2 = TYPES.isArray(ctx2) || ctx2.length ? "array" : "object";
          this._each(ctx2, function(obj, index) {
            fn2(obj, index);
          }, type2);
        },
        map: function(ctx2, fn2) {
          var type2 = TYPES.isArray(ctx2) || ctx2.length ? "array" : "object";
          var st = ctx2.length && type2 == "array" ? [] : {};
          this._each(ctx2, function(obj, index) {
            var r = fn2(obj, index);
            if (type2 == "object") {
              st[r.key] = r.value;
            } else {
              st.push(r);
            }
            ;
          }, type2);
          return st;
        },
        reduce: function(ctx2, accu, fn2) {
          var type2 = TYPES.typeof(ctx2);
          this._each(ctx2, function(obj, index) {
            accu = fn2(obj, accu, index);
          }, type2);
          return accu;
        },
        filter: function(ctx2, fn2) {
          var type2 = TYPES.isArray(ctx2) || ctx2.length ? "array" : "object";
          var st = ctx2.length && type2 == "array" ? [] : {};
          this._each(ctx2, function(obj, index) {
            var r = fn2(obj, index);
            if (r) {
              if (type2 == "object") {
                st[obj.key] = obj.value;
              } else {
                st.push(obj.value);
              }
              ;
            }
            ;
          }, type2);
          return st;
        }
      };
      var OBJECT = {
        dictionary: function(obj, path) {
          if (path) {
            path = path.split(".");
          }
          ;
          for (let p = 0; p < path.length; p++) {
            let _p = path[p];
            if (obj[_p]) {
              obj = obj[_p];
            } else {
              obj = null;
              break;
            }
            ;
          }
          ;
          return obj;
        }
      };
      var STRING = {
        removeWhiteSpace(str) {
          return String(str).split(" ").join("");
        }
      };
      var OTHERS = {
        perf: function(fn2) {
          console.time("test");
          fn2();
          console.timeEnd("test");
        },
        logTest: function(a, ops, b) {
          try {
            a = JSON.parse(a);
          } catch (err) {
          }
          try {
            b = JSON.parse(b);
          } catch (err) {
          }
          switch (ops) {
            case "==":
              {
                return a == b;
              }
              ;
            case "!=":
              {
                return a != b;
              }
              ;
            case "<":
              {
                return a < b;
              }
              ;
            case ">":
              {
                return a > b;
              }
              ;
            case ">=":
              {
                return a >= b;
              }
              ;
            case "<=":
              {
                return a <= b;
              }
              ;
          }
        },
        toUrlSearchParams: function(obj, istrim = true) {
          let searchParams = "";
          for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
              let val = obj[key];
              if (val.toString().includes("Object")) {
                val = JSON.stringify(val);
              }
              ;
              if (istrim && val) {
                searchParams += `${encodeURI(key)}=${encodeURI(val)}&`;
              } else {
                searchParams += `${encodeURI(key)}=${encodeURI(val)}&`;
              }
              ;
            }
            ;
          }
          ;
          return searchParams.slice(0, searchParams.length - 1);
        },
        sanitize: function(string, exclude = []) {
          if (typeof string != "string") {
            return string;
          }
          ;
          let map = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#x27;",
            "/": "&#x2F;"
          };
          map = Object.keys(map).reduce((accu, key) => {
            if (!exclude.includes(key)) {
              accu[key] = map[key];
            }
            ;
            return accu;
          }, {});
          const reg = /[&<>"'/]/ig;
          return string.replace(reg, (match) => {
            return map[match] || match;
          });
        },
        toFormData: function(form, options = {}) {
          const controls = [];
          const textareas = form.querySelectorAll("TEXTAREA");
          const inputs = form.querySelectorAll("INPUT");
          const selects = form.querySelectorAll("SELECT");
          function loop(arr, cont) {
            for (let i = 0; i < arr.length; i++) {
              cont.push(arr[i]);
            }
            ;
          }
          ;
          loop(textareas, controls);
          loop(inputs, controls);
          loop(selects, controls);
          let o2 = {};
          for (let i = 0; i < controls.length; i++) {
            let control = controls[i];
            let key = control.name || control.id;
            if (key && ["{{", "((", "[[", "<<", "%%", "&&"].includes(key)) {
            } else {
              let type2;
              const element = form[key];
              if (element) {
                if (element.closest && !element.closest(".cake-template")) {
                  const tag = element.tagName;
                  if (tag == "SELECT") {
                    value = element.value;
                  } else if (tag == "INPUT" && element.getAttribute("type") == "checkbox") {
                    value = element.checked;
                  } else if (tag == "INPUT" && element.getAttribute("type") == "file") {
                    value = element.files;
                  } else {
                    if (options.sanitize == false) {
                      value = element.value;
                    } else {
                      value = this.sanitize(element.value, options.skipsanitize);
                    }
                  }
                  ;
                  if (options.json) {
                    if (options.trim) {
                      if (value != "") {
                        o2[key] = value;
                      }
                      ;
                    } else {
                      o2[key] = value;
                    }
                    ;
                  } else {
                    o2[key] = value;
                  }
                }
                ;
              }
              ;
            }
            ;
          }
          ;
          if (options.json) {
            return o2;
          } else {
            let fd = new FormData();
            for (let key in o2) {
              if (o2.hasOwnProperty(key)) {
                let value2 = o2[key];
                if (value2.constructor.name == "FileList") {
                  LOOP.each(value2, function(item2, index) {
                    fd.append(key, item2, item2.name);
                  });
                } else {
                  fd.append(key, value2);
                }
                ;
              }
              ;
            }
            ;
            return fd;
          }
          ;
        },
        splitBySpace: function(string, fn2) {
          if (string) {
            string = string.split(" ");
            if (TYPES.isArray(string)) {
              for (let i = 0; i < string.length; i++) {
                fn2(string[i]);
              }
              ;
            }
            ;
          }
        },
        toArray(arrayLike) {
          let a = [];
          if (!arrayLike.length) {
            return a;
          }
          ;
          for (let i = 0; i < arrayLike.length; i++) {
            a.push(arrayLike[i]);
          }
          ;
          return a;
        },
        timeOut(fn2, time = 1) {
          setTimeout(() => {
            fn2();
          }, time);
        },
        instanceID() {
          return location.origin;
        },
        recurse(array, callback) {
          return new Promise((res, rej) => {
            try {
              let l2 = array.length;
              let index = 0;
              const rec = () => {
                if (l2 > index) {
                  callback(array[index]);
                  index += 1;
                  rec();
                } else {
                  res();
                }
                ;
              };
              rec();
            } catch (err) {
              rej(err.message);
            }
            ;
          });
        },
        browser() {
          if (window._browser)
            return window._browser;
          var isOpera = !!window.opr && !!opr.addons || !!window.opera || navigator.userAgent.indexOf(" OPR/") >= 0;
          var isFirefox = typeof InstallTrigger !== "undefined";
          var isSafari = /constructor/i.test(window.HTMLElement) || function(p) {
            return p.toString() === "[object SafariRemoteNotification]";
          }(!window["safari"] || safari.pushNotification);
          var isIE = !!document.documentMode;
          var isEdge = !isIE && !!window.StyleMedia;
          var isChrome = !!window.chrome && !!window.chrome.webstore || !!window.cordova;
          var isBlink = (isChrome || isOpera) && !!window.CSS;
          return window._browser = isOpera ? "Opera" : isFirefox ? "Firefox" : isSafari ? "Safari" : isChrome ? "Chrome" : isIE ? "IE" : isEdge ? "Edge" : isBlink ? "Blink" : "Don't know";
        },
        isOpera() {
          return this.browser == "Opera";
        },
        isFirefox() {
          return this.browser() == "Firefox";
        },
        isSafari() {
          return this.browser == "Safari";
        },
        isChrome() {
          return this.browser == "Chrome";
        },
        isIE() {
          return this.browser == "IE";
        },
        isEdge() {
          return this.browser == "Edge";
        },
        isBlink() {
          return this.browser == "Blink";
        },
        device() {
          if (navigator.userAgent.includes("Android")) {
            return "android";
          } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            return "IOS";
          } else {
            return "desktop";
          }
          ;
        },
        isAndroid() {
          return this.device() == "android";
        },
        isIOS() {
          return this.device() == "ios";
        },
        isDesktop() {
          return this.device() == "desktop";
        },
        escapeRegExp(text) {
          return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        }
      };
      var ARRAY = {
        unique: function(arr, prop) {
          if (Set && TYPES.isArray(arr)) {
            return [...new Set(arr)];
          } else {
            let a = {};
            Loop.each(arr, function(item2, index) {
              if (prop && TYPES.isObject(item2)) {
                let p = OBJECT.dictionary(item2, prop);
                if (p) {
                  a[p] = true;
                }
                ;
              } else {
                a[item2] = true;
              }
              ;
            });
            return Object.keys(a);
          }
          ;
        }
      };
      try {
        global.UTILS = __spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues({}, LOOP), TYPES), OTHERS), STRING), ARRAY);
      } catch (err) {
        global.UTILS = {};
        iter = LOOP.each;
        iter(LOOP, function(key, value2) {
          global.UTILS[key] = value2;
        });
        iter(TYPES, function(key, value2) {
          global.UTILS[key] = value2;
        });
        iter(OTHERS, function(key, value2) {
          global.UTILS[key] = value2;
        });
        iter(STRING, function(key, value2) {
          global.UTILS[key] = value2;
        });
      }
      var iter;
      module.exports = global.UTILS;
    }
  });

  // src/scripts/polyfill.js
  var require_polyfill = __commonJS({
    "src/scripts/polyfill.js"(exports, module) {
      var UTILS = require_utils();
      var self = window || {};
      module.exports = {
        Set: function(data2) {
          if (self.Set) {
            return new Set(data2);
          } else {
            return UTILS.unique(data2);
          }
          ;
        }
      };
    }
  });

  // src/scripts/template-extend.js
  var require_template_extend = __commonJS({
    "src/scripts/template-extend.js"() {
      (function() {
        customElements.define("sub-template", class extends HTMLElement {
          constructor() {
            super();
          }
          connectedCallback() {
            this.replace(this);
          }
          replace(subTemplate) {
            let ref = subTemplate.dataset.template;
            let refEl = document.getElementsByName(ref);
            if (refEl.length > 1) {
              console.error(`template with name ${ref} has more than one reference.`);
              return;
            }
            ;
            if (!refEl) {
              subTemplate.remove();
              throw new Error(`${ref} is not found!`);
            }
            ;
            if (refEl[0]) {
              let temp = refEl[0];
              if (temp.constructor.name == "HTMLTemplateElement") {
                temp = temp.content.cloneNode(true).firstElementChild;
                if (!temp) {
                  return;
                }
                ;
                let attrs = subTemplate.attributes;
                for (let a = 0; a < attrs.length; a++) {
                  let attr = attrs[a];
                  if (attr.name != "data-template") {
                    temp.setAttribute(attr.name, attr.value);
                  }
                  ;
                }
                ;
                subTemplate.replaceWith(temp);
              } else {
                throw new Error(`${ref} is not referred to a Template Element!`);
              }
              ;
            }
            ;
          }
        });
        HTMLTemplateElement.prototype.replaceSubTemplate = function(el) {
          let subTemplates = el.getElementsByTagName("sub-template");
          if (subTemplates) {
            subTemplates = subTemplates.toArray();
            for (let s = 0; s < subTemplates.length; s++) {
              let subTemplate = subTemplates[s];
              customElements.get("sub-template").prototype.replace(subTemplate);
            }
            ;
          }
          ;
        };
        HTMLTemplateElement.prototype.collectContent = function() {
          let template = this;
          let cf = null;
          let temp = template.cloneNode(true);
          let fr = document.createDocumentFragment();
          let styles = temp.content.querySelector("style");
          if (styles) {
            fr.appendChild(styles);
          }
          let others = [];
          for (let o2 = 0; o2 < temp.content.children.length; o2++) {
            let el = temp.content.children[0];
            this.replaceSubTemplate(el);
            others.push(el);
          }
          cf = { style: fr.children[0], others };
          return cf;
        };
        HTMLTemplateElement.prototype.parseStyle = function(style) {
          if (!style)
            return false;
          var styles = style.textContent.trim();
          if (!styles.length) {
            return;
          }
          let obj = {};
          let sel = "";
          let splitted = styles.split("}");
          for (let sp = 0; sp < splitted.length; sp++) {
            let item2 = splitted[sp];
            let _sp1 = item2.split("{");
            let sel2 = _sp1[0];
            let style2 = _sp1[1];
            if (!!sel2) {
              obj[sel2.trim()] = (() => {
                let n = false;
                let s = "";
                let splitted2 = style2.split("");
                for (let sp2 = 0; sp2 < splitted2.length; sp2++) {
                  let item3 = splitted2[sp2];
                  if (item3 == "\n") {
                    n = true;
                  } else if (item3 == " ") {
                    if (n) {
                    } else {
                      s += item3;
                    }
                    ;
                  } else {
                    n = false;
                    s += item3;
                  }
                  ;
                }
                ;
                return s;
              })();
            }
            ;
          }
          ;
          return obj;
        };
        HTMLTemplateElement.prototype.parseHTML = function(others) {
          if (others) {
            var parent = document.createElement("HTML");
            for (let o2 = 0; o2 < others.length; o2++) {
              let other = others[o2];
              parent.append(other);
            }
            ;
          }
          ;
          return parent || false;
        };
        HTMLTemplateElement.prototype.getContent = function(isConvert) {
          let _collectedContent = this.collectContent();
          let style = _collectedContent.style;
          let others = _collectedContent.others;
          let styles = this.parseStyle(style);
          let element = this.parseHTML(others);
          for (let selector2 in styles) {
            if (styles.hasOwnProperty(selector2)) {
              let query = element.querySelectorAll(selector2);
              let css = styles[selector2];
              for (let q = 0; q < query.length; q++) {
                let item2 = query[q];
                item2.setAttribute("style", css);
              }
              ;
            }
          }
          ;
          element = isConvert ? element.children.toArray() : element.innerHTML;
          return element.length == 1 ? element[0] : element;
        };
      })();
    }
  });

  // src/scripts/plugin.js
  var require_plugin = __commonJS({
    "src/scripts/plugin.js"(exports, module) {
      var Utils = require_utils();
      module.exports = function() {
        Object.caching("plugins").set("plugin", {});
        return function(key, value2) {
          if (Utils.isObject(key) && !value2) {
            const plugins = Object.caching("plugins").get("plugin");
            Object.caching("plugins").set("plugin", Object.assign(plugins, key));
          } else if (Utils.isString(key) && value2 != void 0) {
            const plugins = Object.caching("plugins").get("plugin");
            plugins[key] = value2;
            Object.caching("plugins").set("plugin", plugins);
          } else if (Utils.isString(key) && value2 == void 0) {
            return Object.caching("plugins").get("plugin")[key] || {};
          }
          ;
        };
      }();
    }
  });

  // src/scripts/templating.js
  var require_templating = __commonJS({
    "src/scripts/templating.js"(exports, module) {
      var Utils = require_utils();
      function Templating(options) {
        this.options = options;
        this.tag = (this.options && this.options.tag || "{{ }}").split(" ");
        this.lefttag = Utils.escapeRegExp(this.tag[0]);
        this.righttag = Utils.escapeRegExp(this.tag[1]);
      }
      Templating.prototype._getTag = function(template) {
        try {
          return template.match(new RegExp("(?<=<)|([^/s]+)(?=>)", "g"))[2];
        } catch (err) {
          throw new Error(`template of ${template} is empty.`);
        }
      };
      Templating.prototype._bindReplace = function(obj, string) {
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            let pattern = new RegExp(`${this.lefttag}${key}${this.righttag}`, "g");
            pattern && (string = string.replace(pattern, `${obj[key]}`));
          }
          ;
        }
        ;
        return string;
      };
      Templating.prototype.replaceString = function(obj, string) {
        return this._bindReplace(obj, string);
      };
      Templating.prototype._toElement = function(template, tag) {
        let fr = document.createElement("template");
        fr.innerHTML = template;
        return fr.content.children[0];
      };
      Templating.prototype.createElement = function(data2, template, isConvert) {
        if (data2) {
          if (data2 instanceof Array) {
            let isString = typeof template == "string";
            let tag = isString ? this._getTag(template) : template.tagName;
            template = isString ? template : template.outerHTML;
            let els = [];
            for (let d = 0; d < data2.length; d++) {
              let dd = data2[d];
              let bindData = this._bindReplace(dd, template);
              let element = this._toElement(bindData, tag);
              if (isConvert) {
                element = element.outerHTML;
              }
              ;
              els.push(element);
            }
            ;
            return els;
          } else if (data2 instanceof Object) {
            let isString = typeof template == "string";
            let tag = isString ? this._getTag(template) : template.tagName;
            template = isString ? template : template.outerHTML;
            let bindData = this._bindReplace(data2, template);
            let element = this._toElement(bindData, tag);
            if (isConvert) {
              element = element.outerHTML;
            }
            ;
            return element;
          }
        } else {
          let isString = typeof template == "string";
          let tag = isString ? this._getTag(template) : template.tagName;
          return this._toElement(template, tag);
        }
        ;
      };
      module.exports = Templating;
    }
  });

  // src/scripts/attrib/utils.js
  var require_utils2 = __commonJS({
    "src/scripts/attrib/utils.js"(exports) {
      exports.getConfig = function(st, prop, newValue, prevValue, component2) {
        if (newValue == null) {
          return [];
        }
        ;
        if (newValue == prevValue && type != "bind") {
          return [];
        }
        ;
        return (() => {
          let ctx2 = [];
          let s = st;
          if (s && s.length) {
            for (let i = 0; i < s.length; i++) {
              let item2 = s[i];
              if (item2.bind == prop) {
                ctx2.push(__spreadProps(__spreadValues({}, item2), { component: component2 }));
              }
              ;
            }
            ;
          }
          ;
          return ctx2;
        })();
      };
      exports.updateConfig = function(st, type2, prop, newValue, prevValue, component2, update, sel) {
        if (newValue == null) {
          return;
        }
        ;
        if (newValue == prevValue && type2 != "bind") {
          return;
        }
        ;
        var st = (() => {
          let config = st[component2] && st[component2][type2];
          if (config && config.length) {
            let ctx2 = [];
            for (let i = 0; i < config.length; i++) {
              let item2 = config[i];
              let test = item2.bind == prop && (sel ? item2.sel == sel : true);
              if (test) {
                Object.assign(item2, update);
              } else {
              }
              ;
            }
            ;
            return ctx2;
          } else {
            return [];
          }
          ;
        })();
        return st;
      };
      exports.extendConfig = function(configs) {
        const cloned = [];
        for (let i = 0; i < configs.length; i++) {
          const cl = {};
          const item2 = configs[i];
          for (let key in item2) {
            cl[key] = item2[key];
          }
          ;
          cloned.push(cl);
        }
        ;
        return cloned.reduce((accu, iter) => {
          let incrementedSels = iter.incrementedSels;
          if (incrementedSels && incrementedSels.length) {
            incrementedSels.forEach((ic) => {
              let cloned2 = __spreadValues({}, iter);
              cloned2.incrementedSel = ic;
              accu.push(cloned2);
            });
          } else {
            accu.push(iter);
          }
          ;
          return accu;
        }, []);
      };
    }
  });

  // src/scripts/attrib/data-attr.js
  var require_data_attr = __commonJS({
    "src/scripts/attrib/data-attr.js"(exports, module) {
      var Utils = require_utils();
      var _utils = require_utils2();
      var getConfig = _utils.getConfig;
      var updateConfig = _utils.updateConfig;
      var extendConfig = _utils.extendConfig;
      module.exports = async function(prop, newValue, prevValue, component2, html) {
        html = html || document;
        let st = this.storage.get(component2, "attr");
        let configs = getConfig(st, prop, newValue, prevValue, component2);
        if (!configs.length)
          return;
        configs = extendConfig(configs);
        return Promise.all(configs.map((config) => {
          let data2;
          let hasNegate = config.hasNegate;
          let bind2 = config.bind;
          let testVal = config.testVal;
          let attr = config.attr;
          let ops = config.ops;
          let sel = config.sel;
          let attrkey = config.attrkey;
          let attrvalue = config.attrvalue;
          let incrementedSel = config.incrementedSel;
          let incrementId = config.incrementId;
          bind2 = Utils.removeWhiteSpace(bind2);
          attr = Utils.removeWhiteSpace(attr);
          incrementedSel = newValue.incrementedSel || incrementedSel;
          if (!!newValue.incrementedSel) {
            data2 = newValue[bind2];
          } else {
            data2 = newValue;
          }
          ;
          if (prop == bind2) {
            let els = html.querySelectorAll(`[data-attr=${incrementedSel || sel}]:not(.cake-template)`);
            return Promise.all([...els].map((el) => {
              let test = false;
              if (ops) {
                test = Utils.logTest(data2, ops, testVal);
                hasNegate && (test = !test);
              } else if (hasNegate) {
                test = !data2;
              } else {
                test = !!data2;
              }
              ;
              if (test) {
                if (attrvalue) {
                  el.setAttribute(attrkey, attrvalue);
                } else {
                  el.setAttribute(attrkey);
                }
                ;
              } else {
                el.removeAttribute(attrkey);
              }
              ;
            }));
          }
          ;
          newValue = null;
        }));
      };
    }
  });

  // src/scripts/attrib/data-bind.js
  var require_data_bind = __commonJS({
    "src/scripts/attrib/data-bind.js"(exports, module) {
      var Utils = require_utils();
      var _utils = require_utils2();
      var getConfig = _utils.getConfig;
      var updateConfig = _utils.updateConfig;
      var extendConfig = _utils.extendConfig;
      module.exports = async function(prop, newValue, prevValue, component2, html) {
        html = html || document;
        let st = this.storage.get(component2, "bind");
        let configs = getConfig(st, prop, newValue, prevValue, component2);
        if (!configs.length)
          return;
        configs = extendConfig(configs);
        for (let c = 0; c < configs.length; c++) {
          let config = configs[c], data2;
          let attr = config.attr;
          let bind2 = config.bind;
          let sel = config.sel;
          let incrementedSel = config.incrementedSel;
          let incrementId = config.incrementId;
          let incrementedSels = config.incrementedSels;
          incrementedSel = newValue.incrementedSel || incrementedSel;
          if (!!newValue.incrementedSel) {
            data2 = newValue[bind2];
          } else {
            data2 = newValue;
          }
          ;
          let attrHyphen = attr.toHyphen();
          if (prop == bind2) {
            let els = html.querySelectorAll(`[data-bind=${incrementedSel || sel}]`);
            for (let p = 0; p < els.length; p++) {
              let el = els[p];
              if (attr == "class" || attr == "className") {
                if (el.classList.length) {
                  Utils.splitBySpace(prevValue, function(cls) {
                    el.classList.remove(cls);
                  });
                  Utils.splitBySpace(data2, function(cls) {
                    el.classList.add(cls);
                  });
                } else {
                  Utils.splitBySpace(data2, function(cls) {
                    el.classList.add(cls);
                  });
                }
                ;
              } else {
                if (data2 != void 0 || data2 != null) {
                  el.setAttribute(attrHyphen, data2);
                  el[attr] = data2;
                }
                ;
              }
              ;
            }
            ;
          }
          ;
        }
        ;
        newValue = null;
      };
    }
  });

  // src/scripts/attrib/data-class.js
  var require_data_class = __commonJS({
    "src/scripts/attrib/data-class.js"(exports, module) {
      var Utils = require_utils();
      var _utils = require_utils2();
      var getConfig = _utils.getConfig;
      var updateConfig = _utils.updateConfig;
      var extendConfig = _utils.extendConfig;
      module.exports = async function(prop, newValue, prevValue, component2, html) {
        let st = this.storage.get(component2, "class");
        html = html || document;
        let configs = getConfig(st, prop, newValue, prevValue, component2);
        if (!configs.length)
          return;
        let cache = {};
        configs = extendConfig(configs);
        for (let c = 0; c < configs.length; c++) {
          let config = configs[c], data2;
          let hasNegate = config.hasNegate;
          let bind2 = config.bind;
          let testVal = config.testVal;
          let className = config.className;
          let ops = config.ops;
          let sel = config.sel;
          let incrementedSel = config.incrementedSel;
          let incrementId = config.incrementId;
          bind2 = Utils.removeWhiteSpace(bind2);
          incrementedSel = newValue.incrementedSel || incrementedSel;
          if (!!newValue.incrementedSel) {
            data2 = newValue[bind2];
          } else {
            data2 = newValue;
          }
          ;
          if (prop == bind2) {
            if (!cache[incrementedSel || sel]) {
              cache[incrementedSel || sel] = html.querySelectorAll(`[data-class=${incrementedSel || sel}]:not(.cake-template)`);
            }
            let els = cache[incrementedSel || sel];
            for (let p = 0; p < els.length; p++) {
              let el = els[p];
              let test = false;
              if (ops) {
                test = Utils.logTest(data2, ops, testVal);
                hasNegate && (test = !test);
              } else if (hasNegate) {
                test = data2 == testVal;
              } else {
                test = !!data2;
              }
              ;
              if (test) {
                Utils.splitBySpace(className, function(cls) {
                  const classList = Utils.toArray(el.classList);
                  if (!classList.includes(cls)) {
                    setTimeout(() => {
                      el.classList.add(cls);
                    });
                  }
                  ;
                });
              } else {
                Utils.splitBySpace(className, function(cls) {
                  const classList = Utils.toArray(el.classList);
                  if (classList.includes(cls)) {
                    setTimeout(() => {
                      el.classList.remove(cls);
                    });
                  }
                  ;
                });
              }
              ;
            }
            ;
          }
          ;
        }
        ;
        newValue = null;
      };
    }
  });

  // src/scripts/piece.js
  var require_piece = __commonJS({
    "src/scripts/piece.js"(exports, module) {
      function Piece(el) {
        this.el = Piece.toArray(el);
      }
      Piece.toArray = function(el) {
        let r = [];
        switch (true) {
          case el instanceof Array:
            {
              r = el;
            }
            break;
          case (el.length && (el.tagName && el.tagName != "FORM") && !(el instanceof Array)):
            {
              for (let e = 0; e < el.length; e++) {
                r.push(el[e]);
              }
              ;
            }
            break;
          case !(el instanceof Array):
            {
              r = [el];
            }
            break;
        }
        ;
        return r;
      };
      Piece.prototype.loop = function(callback) {
        try {
          let i = -1, length2 = this.el.length;
          while (++i < length2) {
            let el = this.el[i];
            callback(i, el);
          }
          ;
          return true;
        } catch (err) {
          console.error(err);
          return false;
        }
        ;
      };
      Piece.prototype.getElements = function() {
        return this.el;
      };
      Piece.prototype.getElement = function(index = 0) {
        return this.el[index];
      };
      Piece.prototype.remove = function() {
        let i = -1, length2 = this.el.length;
        let fg = document.createDocumentFragment();
        while (++i < length2) {
          let el = this.el[i];
          el && fg.appendChild(el);
        }
        ;
        fg = null;
        return true;
      };
      Piece.prototype.replaceDataSrc = function() {
        return this.loop(function(index, el) {
          el.replaceDataSrc();
        });
      };
      Piece.cloneNode = function(el) {
        el = el instanceof Array ? el : this.toArray(el);
        let a = [];
        for (let e = 0; e < el.length; e++) {
          a.push(el[e].cloneNode(true));
        }
        ;
        return new Piece(a);
      };
      Piece.prototype.dataset = function(data2, cb2) {
        let l2 = this.el.length;
        let i = -1;
        while (++i < l2) {
          if (this.el[i].dataset[data2]) {
            let exec = cb2(this.el[i]);
            if (exec == "break") {
              break;
            }
            ;
          }
          ;
        }
        ;
        return true;
      };
      Piece.prototype.getContainers = function() {
        return this.getElementsByDataset("container").container;
      };
      Piece.prototype.cloneNode = function(el) {
        el = this.el;
        return Piece.cloneNode(el);
      };
      Piece.prototype.getAllElements = function() {
        let length2 = this.el.length;
        let r = [];
        switch (true) {
          case length2 == 1:
            {
              r = this.el[0].getElementsByTagName("*").toArray();
            }
            break;
          case length2 > 1:
            {
              let i = -1;
              while (++i < length2) {
                let el = this.el[i];
                let q = el.getElementsByTagName("*");
                if (q) {
                  for (let i2 = 0; i2 < q.length; i2++) {
                    r.push(q[i2]);
                  }
                  ;
                }
                ;
              }
              ;
            }
            break;
        }
        ;
        return r;
      };
      Piece.prototype.appendTo = function(root, cleaned) {
        if (!root && !root.attributes) {
          throw new TypeError(`the ${root} is not an instance of Element`);
        }
        ;
        cleaned && (root.innerHTML = "");
        for (let i = 0; i < this.el.length; i++) {
          let el = this.el[i];
          root.appendChild(el);
        }
        ;
      };
      Piece.prototype.getElementsByTagName = function(tag) {
        let length2 = this.el.length;
        let r = [];
        switch (true) {
          case length2 == 1:
            {
              r = this.el[0].getElementsByTagName(id).toArray();
            }
            break;
          case length2 > 1:
            {
              let i = -1;
              while (++i < length2) {
                let el = this.el[i];
                let q = el.getElementsByTagName(selector);
                if (q) {
                  for (let i2 = 0; i2 < q.length; i2++) {
                    r.push(q[i2]);
                  }
                  ;
                }
                ;
              }
              ;
            }
            break;
        }
        ;
        return r;
      };
      Piece.prototype.getElementById = function(ids) {
        let length2 = this.el.length;
        let r = [];
        switch (true) {
          case length2 == 1:
            {
              r = this.el[0].getElementById(id);
            }
            break;
          case length2 > 1:
            {
              let i = -1;
              while (++i < length2) {
                let el = this.el[i];
                let q = el.querySelector(selector);
                if (q) {
                  r.push(q);
                }
                ;
              }
              ;
            }
            break;
        }
        ;
        return r;
      };
      Piece.prototype.querySelectorAll = function(selector2) {
        let length2 = this.el.length;
        let r = [];
        switch (true) {
          case length2 == 1:
            {
              r = this.el[0].querySelectorAll(selector2);
            }
            break;
          case length2 > 1:
            {
              let els = [];
              let i = -1;
              while (++i < length2) {
                let el = this.el[i];
                let q = el.querySelectorAll(selector2);
                q && (r = r.concat(q.toArra()));
              }
              ;
            }
            break;
          default: {
            r = [];
          }
        }
        ;
        return r;
      };
      Piece.prototype.querySelector = function(selector2) {
        let length2 = this.el.length;
        let r = [];
        switch (true) {
          case length2 == 1:
            {
              r = this.el[0].querySelector(selector2);
            }
            break;
          case length2 > 1:
            {
              let i = -1;
              while (++i < length2) {
                let el = this.el[i];
                let q = el.querySelector(selector2);
                if (q) {
                  r.push(q);
                }
                ;
              }
              ;
            }
            break;
        }
        ;
        return r;
      };
      Piece.prototype.querySelectorIncluded = function(selector2, attr, val) {
        let length2 = this.el.length;
        let r = [];
        switch (true) {
          case length2 == 1:
            {
              r = this.el[0].querySelectorIncluded(selector2, attr, val);
            }
            break;
          case length2 > 1:
            {
              let i = -1;
              while (++i < length2) {
                let el = this.el[i];
                let q = el.querySelectorIncluded(selector2, attr, val);
                q && r.push(q);
              }
              ;
            }
            break;
        }
        ;
        return r;
      };
      Piece.prototype.querySelectorAllIncluded = function(selector2, attr, val) {
        let length2 = this.el.length;
        let r = [];
        switch (true) {
          case length2 == 1:
            {
              r = this.el[0].querySelectorAllIncluded(selector2, attr, val);
            }
            break;
          case length2 > 1:
            {
              let i = -1;
              while (++i < length2) {
                let el = this.el[i];
                let q = el.querySelectorAllIncluded(selector2, attr, val);
                q && (r = r.concat(q.toArra()));
              }
              ;
            }
            break;
        }
        ;
        return r;
      };
      Piece.prototype.contains = function(el) {
        let length2 = this.el.length, test = false;
        switch (length2 == 1) {
          case true:
            {
              test = this.el[0].contains(el);
            }
            break;
          case false:
            {
              let index = -1;
              while (++index < length2) {
                let _el = this.el[index];
                if (_el.contains(el)) {
                  test = true;
                  break;
                }
                ;
              }
              ;
            }
            break;
        }
        return test;
      };
      Piece.prototype.getElementsByDataset = function() {
        let arg, sel, i, a, el, query;
        arg = arguments;
        o = {};
        length = arg.length;
        i = -1;
        a = -1;
        while (++i < this.el.length) {
          el = this.el[i];
          while (++a < length) {
            sel = arg[a];
            if (el.getAttribute(`data-${sel}`)) {
              o[sel] = [el];
            } else {
              o[sel] = [];
            }
            query = el.querySelectorAll(`[data-${sel}]`);
            if (query.length) {
              o[sel] = o[sel].concat([...query]);
            }
            ;
          }
          ;
        }
        ;
        return o;
      };
      module.exports = Piece;
    }
  });

  // src/scripts/attrib/data-for-update.js
  var require_data_for_update = __commonJS({
    "src/scripts/attrib/data-for-update.js"(exports, module) {
      var Utils = require_utils();
      var Piece = require_piece();
      var Templating = require_templating();
      var Plugin = require_plugin();
      var _utils = require_utils2();
      var getConfig = _utils.getConfig;
      var updateConfig = _utils.updateConfig;
      var extendConfig = _utils.extendConfig;
      module.exports = async function(prop, newValue, prevValue, component2, html) {
        html = html || document;
        let st = this.storage.get(component2, "forUpdate");
        let configs = getConfig(st, prop, newValue, prevValue, component2);
        if (!configs.length)
          return;
        let templating = new Templating(Plugin("templating"));
        const attrPayload = [];
        for (let c = 0; c < configs.length; c++) {
          let bind2 = configs[c].bind;
          let sel = configs[c].sel;
          let iter = configs[c].iter;
          let ins = configs[c].ins;
          let targets = configs[c].targets;
          for (let o2 in newValue) {
            if (newValue.hasOwnProperty(o2)) {
              let targets2 = document.querySelectorAll(`[data-for-update-bind=${o2}]`);
              for (let t = 0; t < targets2.length; t++) {
                let target = targets2[t];
                let binded = target.dataset.forUpdateBind;
                if (!target.dataset.forTemplate) {
                  target.remove();
                } else {
                  let template = target.cloneNode(true);
                  template.style.removeProperty("display");
                  template.classList.remove("cake-template");
                  let dataForIteration = newValue[binded];
                  let i = -1;
                  l = dataForIteration.length;
                  while (++i < l) {
                    let item2 = dataForIteration[i];
                    let index = i;
                    for (let lt = 0; lt < this.logicalType.length; lt++) {
                      let type2 = this.logicalType[lt];
                      const logicalHtml = new Piece(target).querySelectorAllIncluded(`[data-${type2}]`);
                      for (let l2 = 0; l2 < logicalHtml.length; l2++) {
                        const hit = logicalHtml[l2];
                        if (hit.dataset[type2]) {
                          let sel2 = hit.dataset[type2];
                          let incrementedSel = `${sel2}-${o2}-${index}`;
                          template.dataset[type2] = incrementedSel;
                          let bind3 = this.getWatchItemsBySel(component2, type2, sel2).bind;
                          if (bind3.includes(".")) {
                            let split = bind3.split(".");
                            binded = split[0];
                            for (let key in item2) {
                              let value2 = item2[key];
                              let _key = `${binded}.${key}`;
                              item2[_key] = value2;
                            }
                            ;
                          }
                          ;
                          if (sel2) {
                            attrPayload.push(__spreadProps(__spreadValues({ _type: type2 }, item2), { incrementedSel, sel: sel2, bind: bind3, incrementId: index, component: component2 }));
                          }
                          ;
                        }
                        ;
                      }
                      ;
                    }
                    ;
                    let create = templating.createElement(item2, template, false);
                    create.classList.remove("cake-template");
                    create.removeAttribute("data-for-template");
                    target.insertAdjacentElement("beforebegin", create);
                    if (target.parentElement.tagName == "SELECT") {
                      target.parentElement.selectedIndex = 0;
                    }
                    ;
                  }
                  ;
                }
                ;
              }
              ;
            }
            ;
          }
          ;
        }
        ;
        newValue = null;
        return Promise.all(attrPayload.map((payload) => {
          const bind2 = payload.bind;
          const _type = payload._type;
          const component3 = payload.component;
          const incrementedSel = payload.incrementedSel;
          const sel = payload.sel;
          const name2 = `notify${_type.toProper()}`;
          updateConfig(_type, bind2, payload, null, component3, { incrementedSel }, sel);
          return this[name2](bind2, payload, null, component3);
        })).then(() => {
        });
      };
    }
  });

  // src/scripts/storage/components-store.js
  var require_components_store = __commonJS({
    "src/scripts/storage/components-store.js"(exports, module) {
      var storage = {};
      function subscribeExternal() {
        let component2 = storage[name];
        if (component2) {
          if (cb instanceof Function) {
            let name2 = cb.name;
            if (ctx) {
              cb = cb.bind(ctx);
            }
            cb.binded = "external";
            cb.original = name2;
            cb.listenTo = component2.name;
            component2.Subscribe(cb);
          }
        } else {
        }
        ;
      }
      window.ComponentStorage = storage;
      module.exports = {
        subscribe(cb2, ctx2) {
          return new Promise((res, rej) => {
            let lk = setInterval(() => {
              if (storage[name]) {
                subscribeExternal();
                clearInterval(lk);
                res();
              }
              ;
            });
          });
        },
        set(componentName, component2) {
          storage[componentName] = component2;
          return true;
        },
        get(componentName) {
          return storage[componentName];
        }
      };
    }
  });

  // src/scripts/attrib/data-for.js
  var require_data_for = __commonJS({
    "src/scripts/attrib/data-for.js"(exports, module) {
      var Utils = require_utils();
      var Templating = require_templating();
      var Plugin = require_plugin();
      var ComponentStorage = require_components_store();
      var _utils = require_utils2();
      var getConfig = _utils.getConfig;
      var updateConfig = _utils.updateConfig;
      var extendConfig = _utils.extendConfig;
      module.exports = async function(prop, newValue, prevValue, component2, html) {
        let sts = this.storage.get(component2);
        let templating = new Templating(Plugin("templating"));
        return new Promise((res, rej) => {
          try {
            let configs = getConfig(this.storage.get(component2, "for"), prop, newValue, prevValue, component2);
            let switchConfig = getConfig(this.storage.get(component2, "switch"), prop, newValue, prevValue, component2);
            if (!configs.length)
              return;
            let data2 = newValue.reduce((accu, item2) => {
              accu.push(item2);
              return accu;
            }, []);
            newValue = null;
            for (let c = 0; c < configs.length; c++) {
              let bind2 = configs[c].bind;
              let sel = configs[c].sel;
              let iter = configs[c].iter;
              let ins = configs[c].ins;
              let component3 = configs[c].component;
              let cleaned = configs[c].cleaned;
              html = ComponentStorage.get(component3).html;
              let target = html.querySelectorIncluded(`[data-for-template=${sel}]`);
              let cloned = target.cloneNode(true);
              ;
              (() => {
                data2 = data2.map((item2) => {
                  for (let key in item2) {
                    if (item2.hasOwnProperty(key)) {
                      item2[`${iter}.${key}`] = item2[key];
                    }
                    ;
                  }
                  ;
                  return item2;
                });
              })();
              let hasReplaced = [];
              ;
              (() => {
                let increment = 0;
                Object.keys(sts).forEach((key) => {
                  if (!["for", "evt", "animate", "switch"].includes(key)) {
                    let conf = sts[key];
                    let temp = conf[0];
                    let bind3 = temp && temp.bind || void 0;
                    if (bind3 && bind3.match(new RegExp(templating.lefttag), "g")) {
                      data2.forEach((item2, index) => {
                        let o2 = {};
                        o2.bind = templating.replaceString(item2, bind3);
                        o2.sel = `${temp.sel}-${increment}`;
                        o2.rawsel = temp.sel;
                        increment += 1;
                        data2[index].__sel = o2.sel;
                        for (let key2 in temp) {
                          if (temp.hasOwnProperty(key2)) {
                            if (!o2[key2]) {
                              o2[key2] = temp[key2];
                            }
                            ;
                          }
                          ;
                        }
                        ;
                        conf.push(o2);
                      });
                      hasReplaced.push(key);
                    } else {
                    }
                    ;
                  }
                  ;
                });
              })();
              ;
              (() => {
                if (cleaned) {
                  let parent = target.parentElement;
                  parent.children.toArray().forEach((child) => {
                    if (child.dataset.for && !child.classList.contains("cake-template")) {
                      child.remove();
                    }
                    ;
                  });
                }
                ;
                let i = -1;
                l = data2.length;
                data2.forEach((item2, index) => {
                  let template = target.cloneNode(true);
                  (() => {
                    if (switchConfig && !switchConfig.length)
                      return;
                    let bind3 = switchConfig[0].bind;
                    let map = switchConfig[0].map;
                    let sel2 = switchConfig[0].sel;
                    let cases = switchConfig[0].cases;
                    const mapping = item2[map];
                    const switchElement = template.querySelector(`[data-switch=${sel2}]`);
                    let hitCase = cases.find((item3) => {
                      let _id = item3._id;
                      let bind4 = item3.bind;
                      if (bind4.includes("|")) {
                        return bind4.split("|").map((item4) => item4.trim()).some((item4) => item4 == mapping);
                      } else {
                        return bind4 == mapping;
                      }
                      ;
                    });
                    const find = cloned.querySelector(`[data-case=${sel2}-${hitCase._id}]`);
                    find.classList.remove("cake-template");
                    switchElement.innerHTML = find.outerHTML;
                  })();
                  let create = templating.createElement(item2, template, false);
                  ;
                  (() => {
                    Object.keys(sts).forEach((key) => {
                      if (hasReplaced.includes(key)) {
                        let conf = sts[key];
                        let cf = conf.find((cf2) => {
                          return cf2.sel == item2.__sel;
                        });
                        if (cf) {
                          let rawsel = cf.rawsel;
                          if (rawsel) {
                            let get = create.querySelector(`[data-${key}=${rawsel}]`);
                            get.dataset[key] = cf.sel;
                          }
                          ;
                        }
                      }
                      ;
                    });
                  })();
                  ;
                  (() => {
                    create.style.removeProperty("display");
                    create.classList.remove("cake-template");
                    create.removeAttribute("data-for-template");
                    target.insertAdjacentElement("beforebegin", create);
                  })();
                  ;
                  (() => {
                    const children = configs[0] && configs[0].children;
                    if (!children)
                      return;
                    children.forEach((child) => {
                      const forAutoElement = create.querySelector(`[data-for=${child}]`);
                      if (forAutoElement) {
                        const dataBindKey = forAutoElement.dataset.forAutoBindKey;
                        const dataBindValue = forAutoElement.dataset.forAutoBindValue;
                        const iteration = forAutoElement.dataset.forIter;
                        const datas = item2[iteration];
                        if (datas) {
                          for (let d = 0; d < datas.length; d++) {
                            let data3 = datas[d];
                            let template2 = forAutoElement.cloneNode(true);
                            let create2 = templating.createElement(data3, template2, false);
                            create2.style.removeProperty("display");
                            create2.classList.remove("cake-template");
                            create2.removeAttribute("data-for-template");
                            forAutoElement.insertAdjacentElement("beforebegin", create2);
                          }
                          ;
                        }
                        ;
                        const select = forAutoElement.closest("SELECT");
                        if (select) {
                          select.selectedIndex = 0;
                        }
                        ;
                      }
                      ;
                    });
                  })();
                  create.replaceDataSrc();
                });
                res();
              })();
            }
            ;
            data2 = null;
          } catch (err) {
            rej(err);
          }
        });
      };
    }
  });

  // src/scripts/attrib/data-if.js
  var require_data_if = __commonJS({
    "src/scripts/attrib/data-if.js"(exports, module) {
      var Utils = require_utils();
      var _utils = require_utils2();
      var getConfig = _utils.getConfig;
      var updateConfig = _utils.updateConfig;
      var extendConfig = _utils.extendConfig;
      module.exports = async function(prop, newValue, prevValue, component2, html) {
        html = html || document;
        let st = this.storage.get(component2, "if");
        let configs = getConfig(st, prop, newValue, prevValue, component2);
        if (!configs.length)
          return;
        configs = extendConfig(configs);
        let cache = {};
        for (let c = 0; c < configs.length; c++) {
          let config = configs[c];
          let attr = config.attr;
          let bind2 = config.bind;
          let sel = config.sel;
          let testval = config.testval;
          let _true = config._true;
          let _false = config._false;
          let ops = config.ops;
          let hasNegate = config.hasNegate;
          let incrementedSel = config.incrementedSel;
          let incrementId = config.incrementId;
          let attrHyphen = attr.toHyphen();
          let trueNotIgnore = _true != "null";
          let falseNotIgnore = _false != "null";
          if (prop == bind2) {
            if (!cache[sel]) {
              cache[sel] = html.querySelectorAll(`[data-if=${incrementedSel || sel}]:not(.cake-template)`);
            }
            let els = cache[sel];
            for (let p = 0; p < els.length; p++) {
              let el = els[p];
              let data2 = newValue;
              let test;
              if (testval) {
                test = Utils.logTest(testval, ops, data2);
              } else {
                test = hasNegate ? !data2 : !!data2;
              }
              ;
              if (test) {
                if (trueNotIgnore) {
                  if (attr == "class") {
                    let trueClasses2 = _true.split(" ");
                    if (falseNotIgnore) {
                      let falseClasses = _false.split(" ");
                      falseClasses.forEach((cls) => {
                        el.classList.remove(cls);
                      });
                      trueClasses2.forEach((cls) => {
                        el.classList.add(cls);
                      });
                    } else {
                      trueClasses2.forEach((cls) => {
                        if (!el.classList.contains(cls)) {
                          el.classList.add(cls);
                        }
                        ;
                      });
                    }
                    ;
                  } else {
                    if (data2[_true]) {
                      el.setAttribute(attr, data2[_true]);
                    }
                  }
                  ;
                }
              } else {
                if (falseNotIgnore) {
                  if (attr == "class") {
                    let falseClasses = _false.split(" ");
                    if (trueNotIgnore) {
                      let trueClasses2 = _true.split(" ");
                      trueClasses2.forEach((cls) => {
                        el.classList.remove(cls);
                      });
                      falseClasses.forEach((cls) => {
                        el.classList.add(cls);
                      });
                    } else {
                      trueClasses.forEach((cls) => {
                        if (!el.classList.contains(cls)) {
                          el.classList.add(cls);
                        }
                        ;
                      });
                    }
                    ;
                  } else {
                    el.setAttribute(attr, _false);
                  }
                  ;
                }
              }
              ;
            }
            ;
          }
          ;
        }
        ;
        newValue = null;
      };
    }
  });

  // src/scripts/attrib/data-model.js
  var require_data_model = __commonJS({
    "src/scripts/attrib/data-model.js"(exports, module) {
      var Utils = require_utils();
      var _utils = require_utils2();
      var getConfig = _utils.getConfig;
      var updateConfig = _utils.updateConfig;
      var extendConfig = _utils.extendConfig;
      module.exports = async function(prop, newValue, prevValue, component2, html) {
        html = html || document;
        let st = this.storage.get(component2, "model");
        let configs = getConfig(st, prop, newValue, prevValue, component2);
        if (!configs.length)
          return;
        for (let c = 0; c < configs.length; c++) {
          let config = configs[c];
          let attr = config.attr;
          let bind2 = config.bind;
          let sel = config.sel;
          let attrHyphen = attr.toHyphen();
          if (prop == bind2) {
            let els = html.querySelectorAll(`[data-model=${sel}]`);
            for (let p = 0; p < els.length; p++) {
              let el = els[p];
              if (attr == "className") {
                if (prevValue) {
                  if (newValue) {
                    el.classList.replace(prevValue, newValue);
                  } else {
                    el.classList.remove(prevValue);
                  }
                  ;
                } else {
                  el.classList.add(newValue);
                }
                ;
              } else {
                el.setAttribute(attrHyphen, newValue);
                el[attr] = newValue;
              }
              ;
            }
            ;
          }
          ;
        }
        ;
        newValue = null;
      };
    }
  });

  // src/scripts/attrib/data-toggle.js
  var require_data_toggle = __commonJS({
    "src/scripts/attrib/data-toggle.js"(exports, module) {
      var Utils = require_utils();
      var _utils = require_utils2();
      var getConfig = _utils.getConfig;
      var updateConfig = _utils.updateConfig;
      var extendConfig = _utils.extendConfig;
      module.exports = async function(prop, newValue, prevValue, component2, html) {
        html = html || document;
        let st = this.storage.get(component2, "toggle");
        let configs = getConfig(st, prop, newValue, prevValue);
        if (!configs) {
          return;
        }
        ;
        configs = extendConfig(configs);
        html = html || document;
        for (let s = 0; s < configs.length; s++) {
          let sub = configs[s];
          if (!sub)
            continue;
          let sel = sub.sel;
          let bind2 = sub.bind;
          let value2 = sub.value;
          let ops = sub.ops;
          let el = html.querySelector(`[data-toggle=${sel}]`);
          if (value2 == prevValue) {
            el && el.classList.remove("is-active");
          }
          if (value2 == newValue) {
            if (el) {
              if (el.classList.contains("is-active")) {
                el.classList.remove("is-active");
              }
              ;
              el && el.classList.add("is-active");
            }
            ;
          }
          ;
        }
        ;
        newValue = null;
      };
    }
  });

  // src/scripts/storage/AttribConfigStorage.js
  var require_AttribConfigStorage = __commonJS({
    "src/scripts/storage/AttribConfigStorage.js"(exports, module) {
      function ComponentAttribStorage() {
        this.store = {};
      }
      ComponentAttribStorage.prototype.set = function(component2, type2, obj) {
        let store = this.store;
        switch (true) {
          case !store[component2]:
            {
              store[component2] = {};
            }
            ;
          case !store[component2][type2]:
            {
              store[component2][type2] = [];
            }
            ;
          default:
            {
              store[component2][type2].push(obj);
            }
            ;
            break;
        }
        ;
        return true;
      };
      ComponentAttribStorage.prototype.get = function(component2, attr) {
        let store = this.store;
        if (component2 && attr) {
          return store[component2] && store[component2][attr] || [];
        }
        ;
        if (component2 && !attr) {
          return store[component2] || {};
        }
      };
      module.exports = ComponentAttribStorage;
    }
  });

  // src/scripts/attributes.js
  var require_attributes = __commonJS({
    "src/scripts/attributes.js"(exports, module) {
      var Templating = require_templating();
      var notifyAttr = require_data_attr();
      var notifyBind = require_data_bind();
      var notifyClass = require_data_class();
      var notifyForUpdate = require_data_for_update();
      var notifyFor = require_data_for();
      var notifyIf = require_data_if();
      var notifyModel = require_data_model();
      var notifyToggle = require_data_toggle();
      var AttribConfigStorage = require_AttribConfigStorage();
      var UTILS = require_utils();
      function Attrib() {
        this.uiid = 0;
        this.notify = {};
        this.sts = {};
        this.storage = new AttribConfigStorage();
        this.logicalType = ["if", "bind", "switch", "toggle", "class", "attr"];
      }
      Attrib.prototype.notifyFor = notifyFor;
      Attrib.prototype.notifyForUpdate = notifyForUpdate;
      Attrib.prototype.notifyClass = notifyClass;
      Attrib.prototype.notifyBind = notifyBind;
      Attrib.prototype.notifyAttr = notifyAttr;
      Attrib.prototype.notifyIf = notifyIf;
      Attrib.prototype.notifyModel = notifyModel;
      Attrib.prototype.notifyToggle = notifyToggle;
      Attrib.prototype.notifier = function(prop, newValue, prevValue, component2) {
        if (newValue == void 0) {
          return Promise.resolve();
        }
        ;
        let val = JSON.parse(JSON.stringify(newValue));
        const equiv = {
          for: "For",
          forUpdate: "ForUpdate",
          toggle: "Toggle",
          bind: "Bind",
          if: "If",
          class: "Class",
          attr: "Attr"
        };
        let hits = Object.caching("AttribProp").get(prop) || (() => {
          let hits2 = {};
          const actions = Object.keys(equiv);
          const configs = this.storage.get(component2);
          if (!configs) {
            return [];
          }
          ;
          for (let a = 0; a < actions.length; a++) {
            const action = actions[a];
            const vals = configs[action];
            if (vals) {
              for (let v = 0; v < vals.length; v++) {
                const val2 = vals[v];
                const bind2 = val2.bind;
                if (bind2 == prop) {
                  hits2[action] = true;
                }
                ;
              }
              ;
            }
            ;
          }
          ;
          hits2 = Object.keys(hits2);
          Object.caching("AttribProp").set(prop, hits2);
          return hits2;
        })();
        return new Promise((res, rej) => {
          try {
            let l2 = hits.length;
            let index = 0;
            const rec = () => {
              if (l2 > index) {
                let attr = hits[index];
                const name2 = equiv[attr];
                index += 1;
                this[`notify${name2}`](prop, val, prevValue, component2).then(() => {
                  rec();
                });
              } else {
                res();
              }
              ;
            };
            rec();
          } catch (err) {
            rej(err.message);
          }
          ;
        });
      };
      Attrib.prototype.registerNotifier = function(component2, fn2) {
        if (!this.notify[component2]) {
          this.notify[component2] = [];
        }
        ;
        this.notify[component2].push(fn2);
      };
      Attrib.prototype.getEventTarget = function(component2) {
        let id2 = `${component2}`;
        let target = Object.caching("getEventTarget").get(id2);
        if (!target) {
          let cf = this.storage.get(component2);
          target = cf && cf.evt ? cf.evt : [];
          Object.caching("getEventTarget").set(id2, target);
        }
        ;
        return target;
      };
      Attrib.prototype.getRouterTarget = function(component2) {
        let id2 = `${component2}`;
        let target = Object.caching("getRouterTarget").get(id2);
        if (!target) {
          let cf = this.storage.get(component2);
          target = cf && cf.router ? cf.router : [];
          Object.caching("getRouterTarget").set(id2, target);
        }
        ;
        return target;
      };
      Attrib.prototype.getWatchItems = function(component2) {
        let id2 = `${component2}`;
        let target = Object.caching("getWatchItems").get(id2);
        if (!target) {
          let _st = this.storage.get(component2);
          let red = UTILS.reduce(_st, { wt: [], forWt: [] }, function(obj, accu, index) {
            let type2 = obj.key;
            let tst = obj.value;
            UTILS.each(tst, function(item2, index2) {
              let bind2 = item2.bind;
              if (bind2) {
                if (type2 == "for") {
                  accu.forWt.push(bind2);
                } else {
                  accu.wt.push(bind2);
                }
                ;
              }
              ;
            });
            return accu;
          });
          let wt = UTILS.unique(red.wt);
          let forWt = UTILS.unique(red.forWt);
          target = forWt.concat(wt);
          Object.caching("getWatchItems").set(id2, target);
        }
        ;
        return target;
      };
      Attrib.prototype.getWatchItemsByType = function(component2, type2) {
        let id2 = `${component2}-${type2}`;
        let target = Object.caching("getWatchItemsByType").get(id2);
        if (!target) {
          let _st = this.storage.get(component2);
          ;
          let tst = _st[type2] || [];
          let wt = /* @__PURE__ */ new Set();
          for (let t = 0; t < tst.length; t++) {
            let item2 = tst[t];
            let bind2 = item2.bind;
            switch (!!bind2) {
              case true:
                {
                  wt.add(bind2);
                }
                break;
              default:
                {
                  switch (true) {
                    case (type2 == "animate" || type2 == "toggle"): {
                      if (wt.constructor.name = "Set") {
                        wt = [];
                      }
                      ;
                      wt.push(item2);
                    }
                  }
                  ;
                }
                ;
            }
            ;
          }
          ;
          target = [...wt];
          Object.caching("getWatchItemsByType").set(id2, target);
        }
        ;
        return target;
      };
      Attrib.prototype.getWatchItemsBySel = function(component2, type2, sel) {
        let id2 = `${component2}-${type2}-${sel}`;
        let target = Object.caching("watchItemsBySel").get(id2);
        if (!target) {
          let array = this.storage.get(component2, type2);
          ;
          let find = array.find((item2) => {
            return item2.sel == sel;
          });
          target = find ? find : false;
          Object.caching("watchItemsBySel").set(id2, target);
        }
        ;
        return target;
      };
      Attrib.prototype.getConfig = function(component2) {
        return this.storage.get(component2);
      };
      Attrib.prototype._activateReactive = (component2) => {
      };
      Attrib.prototype._register = function(f, s, obj) {
        return this.storage.set(f, s, obj);
      };
      Attrib.prototype._static = function(component2) {
        return function(qs, isStatic) {
          let els = [];
          for (let t = 0; t < qs.length; t++) {
            let el = qs[t];
            switch (isStatic) {
              case false:
                {
                  els.push(el);
                }
                ;
                break;
              case true:
                {
                  let dComponent = el.closest("[data-component]");
                  dComponent = dComponent && dComponent.dataset.component;
                  switch (dComponent == component2) {
                    case true:
                      {
                        els.push(el);
                      }
                      break;
                  }
                  ;
                }
                break;
              default: {
                continue;
              }
            }
            ;
          }
          ;
          return els;
        };
      };
      Attrib.prototype._loopElements = function(attr, els, component2, isStatic, cb2) {
        if (!els.length) {
          return false;
        }
        ;
        els = this._static(component2)(els, isStatic);
        if (!els.length) {
          return false;
        }
        ;
        for (let i = 0; i < els.length; i++) {
          let el = els[i];
          let id2 = `ckm${this.uiid}`;
          let target, gr;
          if (attr.includes(",")) {
            let attrs = attr.split(",");
            target = {}, gr = {};
            for (let a = 0; a < attrs.length; a++) {
              let attr2 = attrs[a];
              target[attr2] = el.dataset[attr2];
              gr[attr2] = target.split(",");
            }
            ;
          } else {
            target = el.dataset[attr];
            gr = target.split(",");
          }
          cb2(el, id2, target, gr, i);
        }
        ;
        return true;
      };
      Attrib.prototype._compileEvents = function(events, component2, isStatic) {
        return new Promise((res) => {
          this._loopElements("event", events, component2, isStatic, function(el, id2, target, gr, index) {
            let splitted = gr;
            for (let s = 0; s < splitted.length; s++) {
              let _sp1 = splitted[s].split(":");
              let event = _sp1[0];
              let cb2 = _sp1[1];
              this._register(component2, "evt", { event, sel: id2, cb: cb2 });
              el.dataset.event = id2;
              this.uiid++;
            }
          }.bind(this));
          res();
        });
      };
      Attrib.prototype._compileToggle = function(toggles, component2, isStatic) {
        return new Promise((res) => {
          let c = {};
          this._loopElements("toggle", toggles, component2, isStatic, function(el, id2, target, gr, index) {
            let ns = target;
            if (c[ns]) {
              id2 = c[ns];
            }
            ;
            this._register(component2, "toggle", { sel: id2, name: "ns-" + ns });
            el.dataset.toggle = id2;
            this.uiid++;
            c[ns] = id2;
          }.bind(this));
          c = {};
          res();
        });
      };
      Attrib.prototype._compileFor = function(fors, component2, isStatic, el) {
        return new Promise((res) => {
          let target = el;
          if (!fors.length) {
            res();
            return;
          }
          ;
          let els = this._static(component2)(fors, isStatic);
          if (!els.length) {
            res();
            return;
          }
          let o2 = {};
          for (let f = 0; f < els.length; f++) {
            let id2 = `ckf${this.uiid}`;
            o2[id2] = {};
            let el2 = els[f];
            let fr = el2.dataset.for;
            let autoBind = el2.dataset.forAutoBind;
            let isCleaned = el2.dataset.forCleaned == void 0 || el2.dataset.forCleaned == "true";
            let _sp1 = fr.split(" ");
            let a = _sp1[0];
            let b = _sp1[1];
            let c = _sp1[2];
            if (autoBind) {
              let iteration = el2.dataset.forIter;
              let split = autoBind.split(":");
              let autoBindKey = split[0] && split[0].trim();
              let autoBindValue = split[1] && split[1].trim();
              o2[id2] = { iteration };
              el2.dataset.forAutoBindKey = autoBindKey;
              el2.dataset.forAutoBindValue = autoBindValue;
              el2.removeAttribute("data-for-auto-bind");
            }
            el2.style.display = "none";
            el2.classList.add("cake-template");
            el2.dataset.for = id2;
            el2.dataset.forTemplate = id2;
            o2[id2] = Object.assign(o2[id2], { bind: c, sel: id2, iter: a, ins: b, cleaned: isCleaned });
            ++this.uiid;
            if (f != 0) {
              let parent = el2.parentElement && el2.parentElement.closest("[data-for]");
              if (!parent) {
                continue;
              }
              let parentIsFor = !!parent.dataset.for;
              if (target.contains(parent) && parentIsFor) {
                let parentId = parent.dataset.for;
                let parentCf = o2[parentId];
                if (parentCf && !parentCf.children) {
                  parentCf.children = [id2];
                } else if (parentCf) {
                  parentCf.children.push(id2);
                }
                ;
              }
            }
            ;
          }
          ;
          for (let key in o2) {
            if (o2.hasOwnProperty(key)) {
              this._register(component2, "for", o2[key]);
            }
            ;
          }
          ;
          res();
        });
      };
      Attrib.prototype._compileForUpdate = function(fors, component2, isStatic) {
        return new Promise((res) => {
          this._loopElements("forUpdate", fors, component2, isStatic, function(el, id2, target, gr, index) {
            el.style.display = "none";
            el.classList.add("cake-template");
            el.dataset.forUpdate = id2;
            if (!el.dataset.for) {
              el.dataset.forTemplate = id2;
            }
            let _sp1 = target.split(" ");
            let a = _sp1[0];
            let b = _sp1[1];
            let c = _sp1[2];
            this._register(component2, "forUpdate", { bind: c, sel: id2, iter: a, ins: b });
            this.uiid++;
          }.bind(this));
          res();
        });
      };
      Attrib.prototype._compileSwitch = function(switchs, component2, isStatic) {
        return new Promise((res) => {
          this._loopElements("switch", switchs, component2, isStatic, function(el, id2, target, gr, index) {
            let bind2 = el.dataset.switch, map = "def";
            if (bind2.includes(".")) {
              const _sp1 = el.dataset.switch.split(".");
              bind2 = _sp1[0];
              map = _sp1[1];
            }
            ;
            el.dataset.switch = id2;
            let cases = el.querySelectorAll("[data-case]");
            let casesId = [];
            for (let c = 0; c < cases.length; c++) {
              let _case = cases[c];
              let closest = _case.closest(`[data-switch=${id2}]`);
              _case.classList.add("cake-template");
              if (closest) {
                let caseBind = _case.dataset.case;
                let _id = `cksc${this.uiid}`;
                _case.dataset.case = `${id2}-${_id}`;
                casesId.push({ _id, bind: caseBind });
                this.uiid++;
              }
              ;
            }
            ;
            this._register(component2, "switch", { bind: bind2, sel: id2, map, cases: casesId });
            this.uiid++;
          }.bind(this));
          res();
        });
      };
      Attrib.prototype._compileBind = function(elModels, component2, isStatic) {
        return new Promise((res) => {
          this._loopElements("bind", elModels, component2, isStatic, function(el, id2, target, gr, index) {
            for (let g = 0; g < gr.length; g++) {
              let val = gr[g].split(" ").join("");
              if (val.includes(":")) {
                const _sp1 = val.split(":");
                var attr = _sp1[0];
                var bind2 = _sp1[1];
              } else {
                var bind2 = val;
                var attr = el.value == void 0 ? "textContent" : "value";
              }
              ;
              this._register(component2, "bind", { attr, bind: bind2, sel: id2 });
            }
            this.uiid++;
            el.dataset.bind = id2;
          }.bind(this));
          res();
        });
      };
      Attrib.prototype._compileAnimate = function(anims, component2, isStatic) {
        return new Promise((res) => {
          this._loopElements("animate", anims, component2, isStatic, function(el, id2, target, gr, index) {
            let o2 = {};
            for (let a = 0; a < gr.length; a++) {
              let item2 = gr[a];
              let _sp1 = item2.split(":");
              let ctx2 = _sp1[0];
              let anims2 = _sp1[1];
              if (ctx2 == "ns") {
                o2.ns = anims2;
                break;
              } else {
                o2[ctx2] = { keyframes: anims2.split("-") };
              }
              ;
            }
            ;
            o2.selector = { attr: "data-animate", val: id2 };
            this._register(component2, "animate", o2);
            this.uiid++;
            el.dataset.animate = id2;
          }.bind(this));
          res();
        });
      };
      Attrib.prototype._compileIf = function(ifs, component2, isStatic) {
        return new Promise((res) => {
          const regex = new RegExp("<|>|===|==|!==|!=");
          this._loopElements("if,ifBind", ifs, component2, isStatic, function(el, id2, target, gr, index) {
            let _if = target["if"];
            let _ifBind = target["ifBind"];
            let _gr = gr["if"];
            for (let g = 0; g < _gr.length; g++) {
              let val = gr[g];
              let attr = val.substring(0, val.indexOf("="));
              let exp = val.substring(val.indexOf("=") + 1, val.length);
              exp = exp.split(new RegExp("[()]")).join("");
              let _sp2 = exp.split("?");
              let test = _sp2[0];
              let r = _sp2[1];
              let hasNegate = test[0] == "!";
              hasRegularLog = test.match(regex);
              let bind2, testVal, ops;
              if (hasRegularLog) {
                let splitted = test.split(regex);
                bind2 = splitted[0].trim();
                testVal = splitted[1].trim();
                ops = hasRegularLog[0];
              } else {
                bind2 = test;
              }
              ;
              if (hasNegate) {
                bind2 = bind2.slice(1);
              }
              ;
              let _sp1 = r.split(":");
              let _true = _sp1[0];
              let _false = _sp1[1];
              this._register(component2, "if", { hasNegate, attr, ops, bind: bind2, testval: testVal || null, _true, _false, sel: id2, ifBind: _ifBind });
            }
            this.uiid++;
            el.dataset.if = id2;
          }.bind(this));
          res();
        });
      };
      Attrib.prototype._compileClass = function(cls, component2, isStatic) {
        return new Promise((res) => {
          let regex = new RegExp("<|>|===|==|!==|!=");
          this._loopElements("class", cls, component2, isStatic, function(el, id2, target, gr, index) {
            let hasRegularLog2, hasNegate, bindVal, ops, testVal, hasNegateCount;
            let cls2 = gr;
            for (let c = 0; c < cls2.length; c++) {
              let clItem = cls2[c];
              let _sp1 = clItem.split("&&");
              let test = _sp1[0];
              let className = _sp1[1];
              test = test.trim();
              className = className.trim();
              hasRegularLog2 = test.match(regex);
              if (test.substring(0, 2).includes("!")) {
                hasNegate = true;
                hasNegateCount = test.substring(0, 2) == "!!" ? 2 : test.substring(0, 1) == "!" ? 1 : 0;
              } else {
                hasNegate = false;
                hasNegateCount = 0;
              }
              ;
              if (hasRegularLog2) {
                let splitted = test.split(regex);
                bindVal = splitted[0].trim();
                testVal = splitted[1].trim();
                ops = hasRegularLog2[0].trim();
              } else {
                !hasNegate && (bindVal = test);
                if (hasNegate) {
                  bindVal = test.substring(hasNegateCount);
                  testVal = hasNegateCount == 2;
                }
                ;
              }
              ;
              this._register(component2, "class", { hasNegate, bind: bindVal, testVal, className, ops, sel: id2 });
            }
            this.uiid++;
            el.dataset.class = id2;
          }.bind(this));
          res();
        });
      };
      Attrib.prototype._compileAttr = function(attrs, component2, isStatic) {
        return new Promise((res) => {
          let regex = new RegExp("<|>|===|==|!==|!=");
          this._loopElements("attr", attrs, component2, isStatic, function(el, id2, target, gr, index) {
            let hasRegularLog2, hasNegate, bindVal, ops, testVal;
            let _sp2 = target.split("&&");
            let test = _sp2[0];
            let attrPair = _sp2[1];
            attrPair = attrPair.trim();
            let _sp1 = attrPair.split("=");
            let attrkey = _sp1[0];
            let attrvalue = _sp1[1];
            test = test.trim();
            hasRegularLog2 = test.match(regex);
            hasNegate = test[0] == "!";
            if (hasRegularLog2) {
              let splitted = test.split(regex);
              bind = splitted[0];
              testVal = splitted[1];
              ops = hasRegularLog2[0];
            } else {
              bind = test;
            }
            ;
            if (hasNegate) {
              hasNegate && (bind = bind.slice(1));
            }
            ;
            this._register(component2, "attr", { hasNegate, bind, testVal, attrkey, attrvalue, ops, sel: id2 });
            this.uiid++;
            el.dataset.attr = id2;
          }.bind(this));
          res();
        });
      };
      Attrib.prototype._compileModel = function(elModels, component2, isStatic) {
        return new Promise((res) => {
          this._loopElements("model", elModels, component2, isStatic, function(el, id2, target, gr, index) {
            let nodeType = el.tagName;
            for (let g = 0; g < gr.length; g++) {
              let val = gr[g].split(" ").join("");
              if (val.includes(":")) {
                var splitted = val.split(":");
                var attr = splitted[0];
                var bind2 = splitted[1];
              } else {
                var bind2 = val;
                var attr = "value";
              }
              ;
              this._register(component2, "model", { attr, bind: bind2, sel: id2, nodeType });
            }
            ;
            this.uiid++;
            el.dataset.model = id2;
          }.bind(this));
          res();
        });
      };
      Attrib.prototype.inject = function(el, component2, isStatic = false) {
        return new Promise((res) => {
          let query = el.getElementsByDataset("bind", "for", "for-update", "switch", "toggle", "event", "animate", "if", "class", "attr");
          res(query);
        }).then((query) => {
          let r = [];
          let map = {
            "bind": this._compileBind,
            "switch": this._compileSwitch,
            "toggle": this._compileToggle,
            "if": this._compileIf,
            "class": this._compileClass,
            "attr": this._compileAttr,
            "for": this._compileFor,
            "for-update": this._compileForUpdate,
            "event": this._compileEvents,
            "animate": this._compileAnimate
          };
          for (let q in query) {
            if (query.hasOwnProperty(q)) {
              if (query[q].length) {
                r.push(map[q].apply(this, [query[q], component2, isStatic, el]));
              }
              ;
            }
            ;
          }
          ;
          console.timeEnd(component2);
          return Promise.all(r.length ? r : [r]);
        }).then(() => {
          return Promise.resolve();
        });
      };
      module.exports = Attrib;
    }
  });

  // src/scripts/storage.js
  var require_storage = __commonJS({
    "src/scripts/storage.js"(exports, module) {
      var Utils = require_utils();
      module.exports = function() {
        function typeOf(_obj) {
          if (!_obj) {
            return null;
          }
          ;
          return _obj.constructor.name.toLowerCase();
        }
        ;
        function ObjectForEach(obj, fn2) {
          for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
              fn2(obj[key], key);
            }
            ;
          }
          ;
        }
        ;
        function ObjectMerge(obj, value2, key) {
          obj = Object.assign(obj, { [key]: value2 });
        }
        ;
        function isNull(d) {
          return d === null;
        }
        ;
        function isUndefined(d) {
          return d === void 0;
        }
        ;
        function isArray(_obj) {
          return typeOf(_obj) == "array";
        }
        ;
        function isObject(_obj) {
          return typeOf(_obj) == "object";
        }
        ;
        var hasInArray = function(src, id2) {
          var has = null;
          for (var i = 0; i < src.length; i++) {
            var item2 = src[i];
            if (typeOf(id2) == "object") {
              var obj = id2;
              var key = Object.keys(id2)[0];
              var value2 = obj[key];
              if (typeOf(item2) == "object") {
                var test = item2[key] == value2;
                if (test) {
                  has = i;
                  break;
                }
                ;
              }
              ;
            } else if (typeOf(id2) != "array") {
              var test = id2 == item2;
              if (test) {
                has = i;
                break;
              }
              ;
            }
            ;
          }
          ;
          return has;
        };
        var hasInObject = function(src, id2) {
          var key = null;
          var type2 = typeOf(id2);
          if (type2 == "object") {
            var _key = Object.keys(id2)[0];
            if (src[key] != void 0 && src[key] == id2[_key]) {
              key = _key;
            }
            ;
          } else if (type2 == "string") {
            key = id2;
          }
          ;
          return key;
        };
        var hasItem = function(src, id2) {
          var has = null;
          if (typeOf(src) == "array") {
            has = hasInArray(src, id2);
          } else if (typeOf(src) == "object") {
            has = hasInObject(src, id2);
          }
          ;
          return has;
        };
        var STORAGE = class {
          constructor(type2, name2, child) {
            this.type = type2;
            this.name = `${Utils.instanceID()}-${name2}`;
            this.child = child;
            this.cache = {};
            if (typeOf(this.child) == "string") {
              this.child = child == "array" ? [] : child == "object" ? {} : false;
            }
            ;
          }
          init(save) {
            if (this[this.type]) {
              this[this.type](save);
              return true;
            }
            ;
            return false;
          }
          open() {
            if (this.type == "session") {
              var decoded = JSON.parse(sessionStorage[this.name]);
              return decoded[this.name];
            } else if (this.type == "local") {
              var decoded = JSON.parse(localStorage[this.name]);
              return decoded[this.name];
            } else {
              return this.cache[this.name];
            }
            ;
          }
          close(storage) {
            this.child = storage;
            this.recache();
            return this.init(true);
          }
          recache() {
            this.cache[this.name] = this.child;
          }
          create() {
            this.cache[this.name] = this.child;
          }
          array() {
            this.create();
          }
          object(issave) {
            this.create();
          }
          session(save) {
            if (!save) {
              this.recache();
            }
            ;
            try {
              if (!sessionStorage[this.name] && !save) {
                sessionStorage.setItem(this.name, JSON.stringify(this.cache));
              } else if (save) {
                sessionStorage.setItem(this.name, JSON.stringify(this.cache));
              } else {
              }
              ;
            } catch (err) {
              this.recache();
            }
            ;
          }
          local(save) {
            if (!save) {
              this.recache();
            }
            ;
            try {
              if (!localStorage[this.name] && !save) {
                localStorage.setItem(this.name, JSON.stringify(this.cache));
              } else if (save) {
                localStorage.setItem(this.name, JSON.stringify(this.cache));
              } else {
              }
              ;
            } catch (err) {
              this.recache();
            }
            ;
          }
        };
        var methods = {
          create: function(storage, data2) {
            if (isArray(storage)) {
              let unique = new Set(storage);
              if (typeOf(data2) == "array") {
                data2.forEach((i) => {
                  unique.add(i);
                });
              } else {
                unique.add(data2);
              }
              ;
              storage = Array.from(unique);
            } else if (isObject(storage)) {
              if (isObject(data2)) {
                ObjectForEach(data2, function(value2, key) {
                  storage[key] = value2;
                });
              } else {
                storage[data2] = data2;
              }
              ;
            }
            ;
            return storage;
          },
          createOrUpdate: function(storage, data2) {
            var has = hasItem(storage, data2);
            if (typeOf(storage) == "array") {
              if (!isNull(has)) {
                storage[has] = data2;
              } else {
                storage.includes(data2);
              }
            } else if (typeOf(storage) == "object") {
              if (isNull(has)) {
                if (isObject(data2)) {
                  ObjectForEach(data2, function(value2, key) {
                    ObjectMerge(storage, value2, key);
                  });
                } else {
                  storage[data2] = data2;
                }
                ;
              } else {
                storage[has] = data2;
              }
              ;
            }
            ;
            return storage;
          },
          remove: function(storage, id2) {
            if (typeOf(id2) == "string") {
              var has = hasItem(storage, id2);
              if (typeOf(storage) == "object") {
                delete storage[has];
              } else if (typeOf(storage) == "array") {
                var arr = [];
                for (var i = 0; i < storage.length; i++) {
                  if (i != has) {
                    arr.push(storage[i]);
                  } else {
                    continue;
                  }
                  ;
                }
                ;
                storage = arr;
              }
              ;
              return storage;
            } else if (typeOf(id2) == "object") {
              return Object.filter(storage, function(value2, key) {
                var test = id2[key] != void 0 && id2[key] == value2;
                return !test;
              });
            } else if (typeOf(id2) == "array") {
              return Object.filter(storage, function(value2, key) {
                var test = id2.contains(key);
                return !test;
              });
            }
            ;
            if (isNull(has)) {
              return false;
            }
            ;
          },
          get: function(storage, id2) {
            var type2 = typeOf(id2);
            if (type2 == "string") {
              var has = hasItem(storage, id2);
              if (has == 0 || has) {
                return storage[has];
              }
              ;
            } else if (type2 == "object") {
              return Object.filter(storage, function(value2, key) {
                var test = !isUndefined(id2[key]) && id2[key] == value2;
                return test;
              });
            } else if (type2 == "array") {
              return Object.filter(storage, function(value2, key) {
                var test = id2.contains(key);
                return test;
              });
            }
            return null;
          },
          getNot: function(storage, id2) {
            var type2 = typeOf(id2);
            if (type2 == "string") {
              return Object.filter(storage, function(value2, key) {
                var test = key != id2;
                return test;
              });
            } else if (type2 == "object") {
              return Object.filter(storage, function(value2, key) {
                return Object.some(id2, function(_value, _key) {
                  var test = _key == key && _value == value2;
                  return !test;
                });
              });
            } else if (type2 == "array") {
              return Object.filter(storage, function(value2, key) {
                var test = !id2.contains(key);
                return test;
              });
            }
            return null;
          },
          getAll: function(storage) {
            return storage;
          }
        };
        var USB = class {
          constructor(_obj) {
            this.name = _obj.name;
            this.storageType = _obj.storage;
            this.child = _obj.child || "object";
            try {
              if (typeOf(this.child) == "string") {
                this.child = this.child == "array" ? [] : this.child == "object" ? {} : null;
              }
              ;
            } catch (err) {
              if (this.storageType == "session") {
                sessionStorage.clear();
              } else if (this.storageType == "local") {
                localStorage.clear();
              }
              ;
              if (typeOf(this.child) == "string") {
                this.child = this.child == "array" ? [] : this.child == "object" ? {} : null;
              }
              ;
            }
            ;
            if (!["array", "object"].includes(typeOf(this.child))) {
              throw new Error("the child must be an object or array type.");
            }
            ;
            this.storage = new STORAGE(this.storageType, this.name, this.child);
            this.storage.init();
          }
          has(id2) {
            var storage = this.storage.open();
            var has = hasItem(storage, id2);
            return isNull(has) ? false : has;
          }
          get(id2, quick) {
            if (quick) {
              var storage = this.storage.open();
              return methods.get(storage, id2);
            } else {
              return new Promise((res, rej) => {
                setTimeout(() => {
                  var storage2 = this.storage.open();
                  res(storage2);
                });
              }).then((storage2) => {
                return methods.get(storage2, id2);
              });
            }
          }
          getNot(id2) {
            var storage = this.storage.open();
            return methods.getNot(storage, id2);
          }
          getAll() {
            var storage = this.storage.open();
            return Promise.resolve(storage);
          }
          update(id2, update) {
            var storage = this.storage.open();
            var has = hasItem(storage, id2);
            if (has == 0 || has) {
              storage = methods.createOrUpdate(storage, data);
              return this.storage.close(storage);
            }
            ;
            return false;
          }
          createOrUpdate(data2) {
            if (arguments.length > 1) {
              let key = arguments[0];
              let value2 = arguments[1];
              data2 = { [key]: value2 };
            }
            ;
            var storage = this.storage.open();
            storage = methods.createOrUpdate(storage, data2);
            const close = this.storage.close(storage);
            return close;
          }
          create(data2) {
            var storage = this.storage.open();
            storage = methods.create(storage, data2);
            return this.storage.close(storage);
          }
          remove(id2) {
            var storage = this.storage.open();
            storage = methods.remove(storage, id2);
            return this.storage.close(storage);
          }
        };
        return USB;
      };
    }
  });

  // src/scripts/scope.js
  var require_scope = __commonJS({
    "src/scripts/scope.js"(exports, module) {
      var StorageKit = require_storage()();
      module.exports = function(dependency) {
        const _hooks = {};
        class Scope {
          constructor(name2) {
            this.name = name2;
            this.reactiveData = {};
            this.notify = [];
            this.install(this.name);
            this.pKeys = {};
            this.sanitize = function(data2) {
              const map = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#x27;",
                "/": "&#x2F;"
              };
              const reg = /[&<>"'/]/ig;
              if (typeof data2 == "string") {
                return data2.replace(reg, (match) => map[match] || "");
              } else {
                return data2;
              }
              ;
            };
          }
          registerNotifier(fn2) {
            this.notify.push(fn2);
          }
          install() {
            this.session = new StorageKit({
              child: "object",
              storage: "session",
              name: `_cake_${this.name}_cf`
            });
          }
          notifier(component2, obj) {
            const value2 = obj.value;
            const bind2 = obj.bind;
            if (!this.reactiveData[component2]) {
              this.reactiveData[component2] = {};
            }
            ;
            this.reactiveData[component2][bind2] = value2;
            return this.set(bind2, value2);
          }
          getInputData(type2 = "json", _component) {
            let component2 = _component || this.name;
            let data2 = JSON.parse(JSON.stringify(this.reactiveData[component2]));
            for (let key in data2) {
              let value2 = data2[key];
              data2[key] = this.sanitize(value2);
            }
            ;
            if (type2 == "json") {
              return data2;
            } else if (type2 == "formdata") {
              const formData = new FormData();
              for (let key in data2) {
                let value2 = data2[key];
                formData.append(key, value2);
              }
              ;
              return formData;
            }
            ;
          }
          hook(component2, bind2, callback) {
            if (!_hooks[component2]) {
              _hooks[component2] = {};
            }
            ;
            if (!_hooks[component2][bind2]) {
              _hooks[component2][bind2] = [];
            }
            ;
            _hooks[component2][bind2].push(callback);
          }
          get(key, quick = false) {
            let pkey = this.pKeys[key];
            if (quick) {
              return this.session.get(key, true);
            } else {
              return this.session.get(key);
            }
            ;
          }
          set(key, value2) {
            let pkey = `${this.name}-${key}`;
            let notify = this.notify;
            let name2 = this.name;
            let prevValue = null;
            this.pKeys[key] = pkey;
            return new Promise(async (res, rej) => {
              if (key != "password") {
                this.session.createOrUpdate(key, value2);
              }
              ;
              res();
            }).then(async () => {
              return Promise.all(notify.map((cb2) => {
                return cb2(key, value2, prevValue, name2).then(() => {
                  const hooks = _hooks[this.name];
                  if (hooks) {
                    const callbacks = hooks[key];
                    if (callbacks) {
                      callbacks.forEach((cb3) => {
                        cb3(value2);
                      });
                    }
                    ;
                  }
                  ;
                });
              }));
            });
          }
        }
        return Scope;
      };
    }
  });

  // src/scripts/animate.js
  var require_animate = __commonJS({
    "src/scripts/animate.js"(exports, module) {
      module.exports = class {
        constructor(config = [], html) {
          this.html = html || document;
          this.cf = config;
          this.duration = 300;
        }
        animate(moment) {
          this.config = this.parse(this.cf);
          return new Promise((res) => {
            for (let i = 0; i < this.config.length; i++) {
              let cf = this.config[i];
              let element = cf.element;
              if (!cf[moment]) {
                res();
                break;
              }
              ;
              let config = cf[moment];
              if (!config.options && !(config.options && config.options.duration)) {
                config.options = { duration: this.duration };
              }
              ;
              if (!config.keyframes && !element) {
                continue;
              }
              let keyframes = config.keyframes;
              let index = 0;
              let fr = [];
              for (let k = 0; k < keyframes.length; k++) {
                let kk = keyframes[k];
                switch (true) {
                  case typeof kk == "string":
                    {
                      fr.push(this.dic(kk));
                    }
                    break;
                  case kk instanceof Object: {
                    let name2 = kk.name;
                    let offset = kk.offset;
                    if (name2 && offset) {
                      let def = this.dic(name2);
                      def[def.length - 1].offset = offset;
                      fr.push(def);
                    } else {
                      fr.push(kk);
                    }
                  }
                }
                ;
              }
              keyframes = fr;
              fr = null;
              let recurseCall = () => {
                let kf = keyframes[index];
                let animate = element.animate(kf, config.options || this.duration);
                if (animate.finished) {
                  animate.finished.then(() => {
                    if (index < keyframes.length - 1) {
                      index += 1;
                      recurseCall();
                    } else {
                      keyframes = [];
                      res();
                    }
                  });
                } else {
                  animate.onfinish = () => {
                    if (index < keyframes.length - 1) {
                      index += 1;
                      recurseCall();
                    } else {
                      keyframes = [];
                      res();
                    }
                  };
                }
                ;
              };
              recurseCall();
            }
            ;
          });
        }
        parse(config) {
          let configs = [], length2 = config.length, i = -1;
          while (++i < length2) {
            let cf = config[i];
            let selector2 = cf.selector, el;
            switch (true) {
              case !!(selector2.val && selector2.attr):
                {
                  el = this.html.querySelectorIncluded(`[${selector2.attr}=${selector2.val}]`, selector2.attr, selector2.val);
                }
                break;
              case !!(selector2.val && !selector2.attr):
                {
                  let attr = selector2.val.match(new RegExp(`^[.]`)) ? "class" : selector2.val.match(new RegExp(`^[#]`)) ? "id" : null;
                  let val = attr ? selector2.val.slice(1) : null;
                  el = this.html.querySelectorIncluded(selector2.val, attr, val);
                }
                break;
            }
            ;
            cf.element = el;
            configs.push(cf);
          }
          ;
          return configs;
        }
        dic(name2) {
          let coll = {
            slideOutUp: [{
              transform: "translate3d(0,0,0)",
              visibility: "visible",
              opacity: "1",
              easing: "ease-out"
            }, {
              transform: "translate3d(0,100%,0)",
              visibility: "hidden",
              opacity: "0",
              easing: "ease-out"
            }],
            slideOutRight: [{
              transform: "translate3d(0,0,0)",
              visibility: "visible",
              opacity: "1"
            }, {
              transform: "translate3d(100%,0,0)",
              visibility: "hidden",
              opacity: "0"
            }],
            slideOutLeft: [{
              transform: "translate3d(0,0,0)",
              visibility: "visible",
              opacity: "1"
            }, {
              transform: "translate3d(-100%,0,0)",
              visibility: "hidden",
              opacity: "0"
            }],
            slideOutDown: [{
              transform: "translate3d(0,0,0)",
              visibility: "visible",
              opacity: "1",
              easing: "ease-out"
            }, {
              transform: "translate3d(0,-100%,0)",
              visibility: "hidden",
              opacity: "0",
              easing: "ease-out"
            }],
            slideInUp: [
              {
                transform: "translate3d(0,100%,0)",
                visibility: "hidden",
                opacity: "0",
                easing: "ease-out"
              },
              {
                transform: "translate3d(0,0,0)",
                visibility: "visible",
                opacity: "1",
                easing: "ease"
              }
            ],
            slideInRight: [{
              transform: "translate3d(100%,0,0)",
              visibility: "hidden",
              opacity: "0"
            }, {
              transform: "translate3d(0,0,0)",
              visibility: "visible",
              opacity: "1"
            }],
            slideInLeft: [{
              transform: "translate3d(-100%,0,0)",
              visibility: "hidden",
              opacity: "0",
              easing: "ease-out"
            }, {
              transform: "translate3d(0,0,0)",
              visibility: "visible",
              opacity: "1"
            }],
            slideInDown: [{
              transform: "translate3d(0,-100%,0)",
              visibility: "hidden",
              opacity: "0",
              easing: "ease-out"
            }, {
              transform: "translate3d(0,0,0)",
              visibility: "visible",
              opacity: "1",
              easing: "ease-out"
            }],
            disappear: [{
              opacity: "1"
            }, {
              opacity: "0"
            }],
            appear: [{
              opacity: "0"
            }, {
              opacity: "1"
            }],
            flipInX: [
              ,
              { offset: 0, backfaceVisibility: "visible" },
              { transform: "perspective(400px) rotate3d(1,0,0,90deg)", opacity: "0", offset: 0 },
              { transform: "perspective(400px) rotate3d(1,0,0,-20deg)", offset: 0.4, easing: "ease-in" },
              { offset: 0.6, opacity: "1", transform: "perspective(400px) rotate3d(1,0,0,10deg)" },
              { transform: "perspective(400px) rotate3d(1,0,0,-5deg)", offset: 0.8 },
              { offset: 1, backfaceVisibility: "visible", transform: "perspective(400px) rotate3d(1,0,0,0)" }
            ]
          };
          return coll[name2.trim()] || [];
        }
      };
    }
  });

  // src/scripts/component.js
  var require_component = __commonJS({
    "src/scripts/component.js"(exports, module) {
      var Mo = require_animate();
      var Piece = require_piece();
      var Utils = require_utils();
      var Templating = require_templating();
      var Plugin = require_plugin();
      function Component(name2, template, options) {
        this.name = name2;
        this.template = template;
        this.options = options;
        this.handlers = options.handlers;
        this.subscribe = options.subscribe;
        this.renderqueue = options.renderqueue;
        this.data = {};
        this.root = options.root;
        this.items = false;
        this.type = options.type || "view";
        this.toggle = options.toggle;
        this.targets = {};
        this.animateOptions = options.animate;
        this.role = options.role;
        this.isReady = false;
        this.scope = options.scope;
        this.formSelector = options.form;
        this.await = {};
        this.state = options.state;
        this.originalState = {};
        this.utils = Utils;
        (name2 == "app" || options.role == "app") && (() => {
          this.staticComponent = options.static || [];
        })();
        this.container = {};
        this.compile = new Promise((res) => {
          this._bindHandlers();
          res();
        }).then(() => {
          return this._bindSubscribe();
        }).then(() => {
          return this.cloneState();
        }).then(() => {
          switch (this.type == "view" && !!this.template) {
            case true:
              return this.createElementAsync();
            default:
              this.isStatic = false;
              break;
          }
          ;
        });
      }
      Component.prototype.isStatic = false;
      Component.prototype.hasEvent = false;
      Component.prototype.isConnected = false;
      Component.prototype.destroyed = false;
      Component.prototype.isCreated = false;
      Component.prototype.cloneState = function() {
        if (!this.state) {
          return;
        }
        ;
        for (let key in this.state) {
          if (this.state.hasOwnProperty(key)) {
            this.originalState[key] = this.state[key];
          }
          ;
        }
        ;
        this.$state = (() => {
          return this.state;
        })();
      };
      Component.prototype.clearState = function() {
        if (!this.state) {
          return;
        }
        ;
        this.state = JSON.parse(JSON.stringify(this.originalState));
        this.$state = (() => {
          return this.state;
        })();
      };
      Component.prototype.Subscribe = function(handler) {
        this.$observer.registerSubscribe({
          [handler.listenTo]: {
            [handler.original]: [handler]
          }
        });
      };
      Component.prototype.Node = function(el) {
        const piece = new Piece(el);
        ;
        return piece;
      };
      Component.prototype._bindHandlers = function() {
        for (let key in this.handlers) {
          if (this.handlers.hasOwnProperty(key)) {
            let fn2 = this.handlers[key];
            let originalName = fn2.name;
            fn2 = fn2.bind(this);
            fn2.original = originalName;
            fn2.binded = this.name;
            this.handlers[originalName] = fn2;
            this.initAwaitHandlers(key);
          }
          ;
        }
        ;
        if (!this.await.destroy) {
          this.await.destroy = Promise.resolve();
        }
        if (!this.await.animateRemove) {
          this.await.animateRemove = Promise.resolve();
        }
      };
      Component.prototype.initAwaitHandlers = function(handlerName) {
        this.await[handlerName] = Promise.resolve();
      };
      Component.prototype._bindSubscribe = function() {
        let flattened = {};
        for (let component2 in this.subscribe) {
          if (this.subscribe.hasOwnProperty(component2)) {
            subscribe = this.subscribe[component2];
            if (!!subscribe.components && !subscribe.handler) {
              throw new Error(`there is no handler in format many of subscribe in event ${component2}`);
            } else if (!subscribe.components && !!subscribe.handler) {
              throw new Error(`there is no components in format many of subscribe in event ${component2}`);
            }
            ;
            let isMany = !!subscribe.components && !!subscribe.handler;
            if (isMany) {
              let event = component2;
              let components2 = subscribe.components;
              let handler = subscribe.handler;
              handler = handler.bind(this);
              handler.binded = this.name;
              handler.original = event;
              for (let c = 0; c < components2.length; c++) {
                let component3 = components2[c];
                if (!flattened[component3]) {
                  flattened[component3] = {};
                }
                ;
                if (!flattened[component3][event]) {
                  flattened[component3][event] = {};
                }
                handler.listenTo = component3;
                flattened[component3][event] = handler;
              }
              ;
            } else {
              if (!flattened[component2]) {
                flattened[component2] = {};
              }
              ;
              let fns = subscribe;
              for (let fn2 in fns) {
                if (fns.hasOwnProperty(fn2)) {
                  let handler = fns[fn2];
                  let original = handler.name;
                  try {
                    handler = handler.bind(this);
                  } catch (err) {
                  }
                  handler.original = original;
                  handler.binded = this.name;
                  handler.listenTo = component2;
                  if (!flattened[component2][original]) {
                    flattened[component2][original] = {};
                  }
                  ;
                  flattened[component2][original] = handler;
                }
                ;
              }
              ;
            }
            ;
          }
          ;
        }
        ;
        this.subscribe = flattened;
      };
      Component.prototype.getHTML = function() {
        return this.html;
      };
      Component.prototype.doFor = function(prop, newValue) {
        if (newValue == null)
          return;
        return this.$attrib.notifyFor(prop, newValue, null, this.name, this.getHTML());
      };
      Component.prototype.doToggle = function(prop, newValue) {
        this.$attrib.notifyToggle(prop, newValue, null, this.name, this.html);
      };
      Component.prototype.doSwitch = function(prop, newValue) {
        this.$attrib.notifySwitch(prop, newValue, null, this.name, this.html);
      };
      Component.prototype.doIf = function(prop, newValue) {
        this.$attrib.notifyIf(prop, newValue, null, this.name, this.html);
      };
      Component.prototype.$animate = function(moment) {
        let ata = this.$attrib.getWatchItemsByType(this.name, "animate");
        let da = this.animateOptions;
        let arr = [];
        ;
        (() => {
          if (!ata.length && !(ata instanceof Array) || !da) {
            return;
          }
          for (let a = 0; a < ata.length; a++) {
            let at = ata[a];
            let name2 = at.ns;
            let selector2 = at.selector;
            if (at.ns) {
              if (da[name2]) {
                let ns = da[name2];
                Object.assign(at, da[name2]);
                delete da[name2];
              }
              ;
            } else {
              arr.push(ata);
            }
            ;
          }
          ;
        })();
        if (!ata.length) {
          return false;
        }
        ;
        (() => {
          let obj = {};
          let selector2 = {};
          for (let key in da) {
            if (da.hasOwnProperty(key)) {
              selector2.val = key;
              obj.selector = selector2;
              Object.assign(obj, da[key]);
              ata.push(obj);
              obj = {};
              selector2 = {};
            }
            ;
          }
          ;
        })();
        return new Mo(ata, this.html).animate(moment);
      };
      Component.prototype.$templating = function(data2, t, isConvert) {
        let template = t || this.template;
        return new Templating(Plugin("templating")).createElement(data2, template, isConvert);
      };
      Component.prototype.createElement = function() {
        let isSelector = this.template.substring(0, 1) == "#";
        if (!isSelector)
          return;
        let selector2 = this.template.substr(1);
        let query = document.getElementById(selector2);
        let isTemplate = this.isTemplate = query && query.toString().includes("Template");
        if (!query) {
          throw new Error(`the template for ${this.name} is not found with.`);
        }
        ;
        return new Promise((res) => {
          switch (isTemplate) {
            case true:
              {
                let element = query.getContent(true);
                if (!element) {
                  throw new Error(`it might be theres no template in component - ${this.name}`);
                }
                element.cake_component = this.name;
                this.html = this.Node(element);
                this._parseHTML(this.isStatic).then(() => {
                  res();
                });
              }
              break;
            case null:
              {
                res();
              }
              break;
            default:
              {
                let element = query;
                if (!element) {
                  throw new Error(`it might be theres no template in component - ${this.name}`);
                }
                element.cake_component = this.name;
                this.html = this.Node(element);
                this.isStatic = true;
                this._parseHTML(this.isStatic).then(() => {
                  res();
                });
              }
              ;
          }
          ;
        });
      };
      Component.prototype.createElementAsync = function() {
        return new Promise((res) => {
          this.createElement().then(() => {
            res();
          });
        }).then(() => {
          this.isReady = true;
        });
      };
      Component.prototype._isParsed = false;
      Component.prototype._parseHTML = function(isStatic = false) {
        return this.$attrib.inject(this.html, this.name, isStatic).then(() => {
          this.original = this.html.cloneNode();
          this._isParsed = true;
        });
      };
      Component.prototype.render = function(options = {}) {
        if (this.isConnected) {
          if (this.renderqueue) {
            if (Utils.isArray(this.renderqueue)) {
              this.renderqueue.unshift({ date: new Date(), id: new Date().getTime(), options });
              console.log(`rendering ${this.name} has been queued`);
            } else {
              console.error(`renderqueue must be an array`);
            }
            ;
          } else {
            console.error(`${this.name} is already rendered and connected to the DOM`);
          }
          ;
          return Promise.resolve();
        }
        ;
        let root = options.root;
        let cleaned = options.cleaned;
        let emit = options.emit || {};
        let DATA = options.data || {};
        let multiple = this.options.multiple;
        let state = this.state || {};
        let payload = { emit };
        return new Promise((res, rej) => {
          !!root && (this.root = root);
          if (!this.isReady) {
            this.createElement().then(() => {
              return !this.template && this.fire.isConnected && this.fire.isConnected(payload, true);
            }).then(() => {
              this.isReady = true;
              res();
            });
          } else {
            res();
          }
          ;
        }).then(() => {
          return this.await.destroy.then(() => {
            return this.await.animateRemove;
          }).then(() => {
            return new Promise((res, rej) => {
              let attrItems = this.$attrib.getWatchItems(this.name);
              Promise.all(attrItems.map((item2) => {
                if (DATA[item2]) {
                  return this.$attrib.notifier(item2, DATA[item2], null, this.name, this.getHTML());
                }
              })).then(() => {
                res(this.html);
              });
            }).then((element) => {
              payload = { element, emit };
              return new Promise((res, rej) => {
                try {
                  this.fire.beforeConnected && this.fire.beforeConnected(payload, true);
                  res(element);
                } catch (err) {
                  rej(err);
                }
                ;
              });
            }).then((element) => {
              if (this.isStatic) {
              } else {
                let prom = !DATA ? Promise.resolve() : (() => {
                  return new Promise((res) => {
                    let el = element.getElement();
                    el = this.$templating(DATA, el);
                    this.html = element = this.Node(el);
                    this.html.replaceDataSrc();
                    DATA = null;
                    res();
                  });
                })();
                return prom.then(() => {
                  element.appendTo(this.root, cleaned);
                  this.isConnected = true;
                });
              }
            }).then(() => {
            }).then(() => {
              return this.findContainer();
            }).then(() => {
              try {
                return this.fire.isConnected && this.fire.isConnected(payload, true);
              } catch (err) {
                console.log(440, err);
              }
            }).then(() => {
              return this.findTarget();
            }).then(() => {
              return this.addEvent();
            }).then(() => {
              return this.$animate("render");
            }).then(() => {
              multiple && this._smoothReset();
              return new Promise((res, rej) => {
                setTimeout(() => {
                  this._watchReactive();
                  res();
                }, 100);
              });
            });
          });
        });
      };
      Component.prototype.renderAsync = function(options) {
        this.render(options).then(() => {
          this.$persist.append(this.name);
        });
      };
      Component.prototype._smoothReset = function() {
        this.isConnected = false;
        this.html = this.original.cloneNode();
      };
      Component.prototype._hardReset = function(name2) {
        this.isConnected = false;
        this.$persist.remove(name2);
        this.html = this.original.cloneNode();
        return true;
      };
      Component.prototype.reset = function() {
        let animate = this.$animate("remove");
        if (animate instanceof Promise) {
          return this.await.animateRemove = new Promise((res) => {
            animate.then(() => {
              return this.html.remove();
            }).then(() => {
              this.container = {};
            }).then(() => {
              return this.clearState();
            }).then(() => {
              return this._hardReset(this.name);
            }).then(() => {
              res();
            }).then(() => {
              if (this.renderqueue && this.renderqueue.length) {
                let conf = this.renderqueue.pop();
                let options = conf.options;
                return this.render(options);
              }
              ;
            });
          });
        } else {
          return new Promise((res) => {
            this.html.remove(this.name);
            this.clearState();
            this.container = {};
            this._hardReset(this.name);
            res();
          });
        }
      };
      Component.prototype.addEvent = function(static2, multiple) {
        let component2 = this.name;
        function notify(event, component3, isPreventDefault, isStopPropagation) {
          return function(e) {
            if (!isPreventDefault) {
              e.preventDefault();
            }
            ;
            if (isStopPropagation) {
              e.stopPropagation();
            }
            ;
            Cake.Observer.notify(component3, event, e);
          };
        }
        ;
        if (!this.targets)
          return;
        for (let event in this.targets) {
          if (this.targets.hasOwnProperty(event)) {
            let cf = this.targets[event];
            for (let item2 of cf) {
              let sel = item2.sel;
              let el = item2.el;
              let cb2 = item2.cb;
              let _event = event;
              let place = event.substring(0, 2);
              let isPreventDefault = place.includes("~");
              let isStopPropagation = place.includes("^");
              if (isPreventDefault || isStopPropagation) {
                _event = event.slice(1);
                cb2 = cb2 || _event;
              } else {
                if (!cb2) {
                  cb2 = event;
                }
              }
              ;
              if (!el.Ref().get("__cake__events")) {
                el.Ref().set("__cake__events", {});
              }
              ;
              let store = el.Ref().get("__cake__events");
              if (!store[cb2]) {
                el.addEventListener(_event, notify(cb2, component2, isPreventDefault, isStopPropagation), true);
                store[cb2] = true;
                el.Ref().set("__cake__events", store);
              } else {
                continue;
              }
              ;
            }
            ;
          }
          ;
        }
        ;
      };
      Component.prototype.findTarget = function() {
        let q = this.$attrib.getEventTarget(this.name);
        return new Promise((res) => {
          for (let item2 of q) {
            let els = this.html.querySelectorAllIncluded(`[data-event=${item2.sel}]`);
            for (let e = 0; e < els.length; e++) {
              if (!this.targets[item2.event]) {
                this.targets[item2.event] = [];
              }
              ;
              this.targets[item2.event].push(__spreadValues({ el: els[e] }, item2));
            }
            ;
          }
          ;
          res();
        });
      };
      Component.prototype.toggler = function(_this) {
        let attrToggle = this.$attrib.getWatchItemsByType(this.name, "toggle");
        let cl = class {
          constructor(bind2, bases, html, _this2) {
            this.toggle = _this2.toggle;
            this.bind = bind2;
            this.bases = bases;
            this.cache = _this2.$cache;
            this.html = html;
          }
          check(bind2) {
            let config = this.toggle[bind2];
            if (!config) {
              console.error(`${bind2} is not found in toggle! choose from ${JSON.stringify(Object.keys(this.toggle))}`);
            } else {
              if (attrToggle.length) {
                let ns = config.ns;
                let f = attrToggle.find((item2) => {
                  return item2.name == `ns-${ns}`;
                });
                f && (config.sel = `[data-toggle=${f.sel}]`);
              }
              ;
              return config;
            }
            ;
          }
          _toggle() {
            let config = this.check(this.bind);
            if (!config) {
              return;
            }
            let basis = config.basis || "data-name";
            let cls = config.cls || "is-active";
            let mode = config.mode || "radio";
            let sel = config.sel;
            let persist = config.persist == void 0 ? true : config.persist;
            let targets = this.html.querySelectorAll(sel);
            if (!targets.length) {
              return;
            }
            ;
            let prev, next;
            if (targets.length == 1) {
              let isbool = typeof this.bases == "boolean";
              let isforce = !!this.bases;
              let el = targets[0];
              if (persist) {
                const _forceState = function(el2, cls2, isforce2) {
                  if (isforce2) {
                    if (el2.classList.contains(cls2)) {
                      el2.classList.remove(cls2);
                    }
                    ;
                  } else {
                    if (!el2.classList.contains(cls2)) {
                      el2.classList.add(cls2);
                    }
                    ;
                  }
                };
                if (isbool) {
                  if (isforce) {
                    this.cache.createOrUpdate(this.bind, true);
                    _forceState(el, cls, true);
                  } else {
                    this.cache.createOrUpdate(this.bind, false);
                    _forceState(el, cls, false);
                  }
                  el.classList.toggle(cls);
                } else {
                  this.cache.createOrUpdate(this.bind, !el.classList.contains(cls));
                  el.classList.toggle(cls);
                }
                ;
              }
              ;
            } else {
              for (let t = 0; t < targets.length; t++) {
                let el = targets[t];
                let has = el.classList.contains(cls);
                let attr = el.getAttribute(basis);
                if (attr == this.bases) {
                  if (mode == "switch") {
                    el.classList.toggle(cls);
                  } else {
                    if (!has) {
                      el.classList.add(cls);
                    }
                    ;
                  }
                  ;
                  if (persist) {
                    this.cache.createOrUpdate(this.bind, attr);
                  }
                  ;
                  next = attr;
                } else {
                  if (has) {
                    el.classList.remove(cls);
                    prev = el.getAttribute(basis);
                  }
                  ;
                }
                ;
              }
              ;
            }
            return { prev, next };
          }
          _recall() {
            let config = this.check(this.bind);
            if (!config) {
              return;
            }
            let basis = config.basis || "data-name";
            let cls = config.cls || "is-active";
            let sel = config.sel;
            return this.cache.get(this.bind).then((result) => {
              if (!result) {
                return result;
              }
              ;
              let bases = result;
              let targets = this.html.querySelectorAll(sel);
              if (!targets.length) {
                return;
              }
              ;
              if (targets.length == 1) {
                let el = targets[0];
                if (bases) {
                  el.classList.add(cls);
                }
                ;
              } else {
                for (let t = 0; t < targets.length; t++) {
                  let el = targets[t];
                  let has = el.classList.contains(cls);
                  let attr = el.getAttribute(basis);
                  if (attr == bases) {
                    if (!has) {
                      el.classList.add(cls);
                    }
                    ;
                  }
                  ;
                }
                ;
              }
              ;
              return bases;
            });
          }
        };
        let fn2 = (bind2, bases) => {
          return new cl(bind2, bases, this.html, this)._toggle();
        };
        fn2.recall = (bind2) => {
          return new cl(bind2, false, this.html, this)._recall();
        };
        return fn2;
      };
      Component.prototype.findContainer = function() {
        return new Promise((res) => {
          let containers = this.html.getContainers();
          for (let c = 0; c < containers.length; c++) {
            let el = containers[c];
            let name2 = el.dataset.container;
            if (name2) {
              this.container[name2] = el;
            }
            ;
          }
          ;
          res();
        });
      };
      Component.prototype._validator = function(name2, value2) {
        if (this.options.validate) {
          this.validate = this.options.validate;
          const handler = this.validate[name2];
          if (handler) {
          }
          ;
        }
        ;
      };
      Component.prototype._watchReactive = function() {
        if (this.role == "form" && this.options.watch === true) {
          const validator = this.options.validate;
          const form = this.$form();
          if (form._reactive) {
            return;
          }
          ;
          if (this.state && !this.state.formData) {
            this.state.formData = {};
          }
          ;
          const component2 = this;
          const handler = (e) => {
            const target = e.target;
            const name2 = target.name || target.id;
            const value2 = target.value;
            let handler2 = validator[name2];
            if (handler2) {
              handler2 = handler2.bind(component2);
              if (handler2) {
                let validated = handler2(e);
                if (validated) {
                  this.state && (this.state.formData[name2] = value2);
                  this.$scope.set(name2, value2);
                }
                ;
              }
              ;
            } else {
              this.state && (this.state.formData[name2] = value2);
              this.$scope.set(name2, value2);
            }
            ;
          };
          form.addEventListener("change", (e) => {
            if (!(e.target.tagName == "INPUT" || e.target.tagName == "TEXTAREA")) {
              handler(e);
            }
            ;
          });
          form.addEventListener("input", (e) => {
            if (e.target.tagName == "INPUT" || e.target.tagName == "TEXTAREA") {
              handler(e);
            }
            ;
          });
          form._reactive = true;
        }
        ;
      };
      Component.prototype.observer = function(subscribe2) {
        function callback(name2) {
          return this.handler[name2];
        }
        this.observer = new Observer(this, subscribe2, callback.bind(this));
      };
      Component.prototype.variable = function(obj) {
        let vary = Object.keys(obj);
        let validate = {};
        let values = [];
        function invalid(name2, test, type2) {
          if (!test) {
            validate[name2] = `value is not '${type2}'`;
          }
          ;
        }
        ;
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            let config = obj[key];
            let type2 = config.type;
            let value2 = config.value;
            let test;
            if (["string", "number"].includes(type2)) {
              test = typeof value2 == type2;
            } else if (value2 instanceof Array) {
              test = type2 == "array";
            } else {
              test = type2 == "object";
            }
            values.push(value2);
            invalid(key, test, type2);
          }
          ;
        }
        ;
        if (Object.keys(validate).length) {
          throw new Error(JSON.stringify(validate));
        } else {
          return values;
        }
      };
      module.exports = Component;
    }
  });

  // src/scripts/router.js
  var require_router = __commonJS({
    "src/scripts/router.js"(exports, module) {
      var Utils = require_utils();
      var StorageKit = require_storage()();
      var ComponentStorage = require_components_store();
      var RouterStore = new StorageKit({
        child: "object",
        storage: "local",
        name: `_cake_router_cf`
      });
      module.exports = function(models, component2) {
        const hooks = [];
        return class {
          constructor(routes, options) {
            this.options = options;
            this.unauthRoute = null;
            this.componentConf = null;
            this.authValidRoute = null;
            this.authConfig = function() {
              if (!this.options) {
                return;
              }
              ;
              const confAuth = this.options.auth;
              const confComponents = this.options.components;
              if (confComponents) {
                this.componentConf = confComponents;
              }
              ;
              if (confAuth && confAuth.verify) {
                const verify = confAuth.verify;
                this.verifyComponent = verify[0];
                this.verifyComponentHandler = verify[1];
                this.unauthRoute = confAuth["401"];
                return confAuth;
              }
              ;
              if (confAuth && confAuth.valid) {
                this.authValidRoute = confAuth.valid;
              }
              ;
              return null;
            }.bind(this)();
            this.authRedirectRoute = {};
            this.route = this.compile(routes);
            this.prev = null;
            this.components = ComponentStorage;
            this.watch();
            this.persist();
            Object.defineProperty(component2.prototype, "$router", {
              configurable: true,
              get: () => {
                return __spreadValues({
                  goTo: this.goTo.bind(this),
                  goBack: this.goBack.bind(this),
                  auth: this.auth.bind(this),
                  logout: this.logout.bind(this),
                  login: this.login.bind(this)
                }, this.prev);
              },
              set(value2) {
                return;
              }
            });
          }
          getComponent(name2, path) {
            if (this.componentConf && this.componentConf[name2]) {
              let rerender = this.componentConf[name2].rerender;
              if (rerender) {
                name2 = rerender.includes(path) ? name2 : null;
              }
              ;
            }
            ;
            return name2 ? this.components.get(name2) : null;
          }
          verifyAuth(token) {
            return models.$loaded(this.verifyComponent).then((model) => {
              return model.fire[this.verifyComponentHandler](token);
            });
          }
          async authenticate(name2) {
            const initialize = this.unauthRoute == name2;
            if (this.unauthRoute) {
              try {
                const config = RouterStore.get("role", true);
                const token = config.token;
                const isverified = await this.verifyAuth(token);
                if (isverified.status == 0) {
                  this.logout();
                }
                ;
                if (config) {
                  if (initialize) {
                    const role = config.role;
                    const data2 = config.data;
                    const route = this.authRedirectRoute[role];
                    if (route) {
                      const name3 = route.name;
                      this.goTo(name3);
                    }
                    ;
                  } else {
                  }
                } else {
                  if (initialize) {
                  } else {
                    this.logout();
                  }
                }
                ;
              } catch (err) {
                if (initialize) {
                } else {
                  this.logout();
                }
              }
              ;
            }
            ;
          }
          login(cred) {
            let role = cred.role;
            let token = cred.token;
            let data2 = cred.data;
            let created = RouterStore.createOrUpdate("role", { role, token, data: data2 });
            return created;
          }
          auth() {
            const auth = RouterStore.get("role", true);
            if (!auth) {
              return {};
            }
            ;
            return auth;
          }
          logout() {
            try {
              RouterStore.remove("role");
            } catch (err) {
            }
            ;
            this.goTo(this.unauthRoute, { replace: true });
          }
          goTo(routeName, config = {}) {
            try {
              let routes = this.route;
              let params = config.params || {};
              let isreplace = config.replace;
              let hash = null;
              const raw = Object.entries(routes);
              if (!routeName) {
                const auth = RouterStore.get("role", true);
                const role = auth.role;
                const route = this.authRedirectRoute[role];
                if (route) {
                  routeName = route.name;
                }
                ;
              }
              ;
              if (!routeName) {
                throw new Error(`provide routename`);
              }
              ;
              for (let i = 0; i < raw.length; i++) {
                const route = raw[i][0];
                const config2 = raw[i][1];
                const name2 = config2.name;
                if (name2 == routeName) {
                  hash = route;
                  break;
                }
                ;
              }
              ;
              if (!hash) {
                throw new Error(`${routeName} is not found in routes`);
              }
              ;
              if (hash == "/") {
                if (isreplace) {
                  location.replace(`${location.origin}${location.pathname}`);
                } else {
                  window.location = `${location.origin}${location.pathname}`;
                }
                return;
              }
              ;
              let path;
              hash = hash.slice(1);
              if (params.toString().includes("Object")) {
                let p = "";
                for (let key in params) {
                  p += `${key}=${params[key]}&`;
                }
                ;
                params = p;
                path = `!/${hash}?${params}`;
              } else {
                path = `!/${hash}`;
              }
              if (hash == "/") {
                path = "";
              }
              ;
              if (isreplace) {
                let loc = `${location.origin}${location.pathname}#${path}`;
                Utils.isChrome() && !Utils.isFirefox() && history.replaceState(void 0, void 0, loc);
                location.replace(loc);
              } else {
                var a = document.createElement("a");
                a.href = `#${path}`;
                Utils.isChrome() && !Utils.isFirefox() && history.pushState(void 0, void 0, a.href);
                a.click();
              }
            } catch (err) {
              console.log(err);
            }
          }
          goBack() {
            return new Promise((res, rej) => {
              window.history.back();
              res();
            });
          }
          persist() {
            if (!document.hasRouterPersist) {
              let event = "DOMContentLoaded";
              if ("deviceready" in document) {
                event = "deviceready";
              }
              ;
              document.addEventListener(event, (e) => {
                this.parse();
                this.notify().then(() => {
                  return this.navigate(true);
                });
              });
              document.hasRouterPersist = true;
            }
            ;
          }
          watch() {
            if (!window.hasRouterPop) {
              window.addEventListener("popstate", (e) => {
                this.parse();
                this.notify().then(() => {
                  console.log("notified");
                  return this.clear().then(() => {
                    console.log("cleared");
                    return this.navigate().then(() => {
                      console.log("navigated");
                    });
                  });
                });
              });
              window.hasRouterPop = true;
            } else {
              this.parse();
            }
            ;
          }
          compile(routes) {
            let con = {};
            for (let key in routes) {
              let config = routes[key];
              key = String(key);
              const len = key.length;
              let regex = key;
              if (["404"].includes(key)) {
                const callback = routes[key];
                config = { callback, name: key };
              } else {
                regex = regex.slice(1);
              }
              ;
              regex = regex.split("/");
              regex = regex.map((item2, index) => {
                let param = item2.includes(":");
                let a = "";
                index == 0 ? a += "^/" : a += "/";
                param ? a += "(([^/#?]+?))" : a += item2;
                index == len - 1 ? a += "/?$" : a += "";
                if (param) {
                  const paramKey = item2.replace(":", "");
                  if (!con[key]) {
                    con[key] = {};
                  }
                  ;
                  con[key].params = {
                    [paramKey]: index
                  };
                }
                ;
                return a;
              });
              if (con[key] && con[key].params) {
                con[key] = __spreadValues({
                  params: con[key].params,
                  regex: new RegExp(regex.join(""))
                }, config);
              } else {
                con[key] = __spreadValues({
                  regex: new RegExp(regex.join(""))
                }, config);
              }
              ;
              if (this.authValidRoute) {
                Utils.each(this.authValidRoute, function(obj, i) {
                  let key2 = obj.key;
                  let value2 = obj.value;
                  if (value2 == config.name) {
                    if (this.authRedirectRoute[value2]) {
                      throw new Error(`auth ${item} is found in other route`);
                    } else {
                      this.authRedirectRoute[value2] = config;
                    }
                    ;
                  }
                  ;
                });
              }
              ;
            }
            ;
            con.length = Object.keys(routes).length;
            con.keys = Object.keys(routes);
            return con;
          }
          parse() {
            let hash = window.location.hash, scheme, routeName;
            if (hash) {
              scheme = hash.includes("#!/") ? 2 : hash.includes("#/") ? 1 : null;
              hash = hash.slice(scheme);
            } else {
              hash = "/";
              scheme = true;
            }
            ;
            if (!scheme) {
              return;
            }
            ;
            const url = new URL(`http://localhost${hash}`);
            let search = url.search;
            let path = url.pathname;
            const keys = this.route.keys;
            const state = {};
            if (search) {
              new URLSearchParams(search).forEach((value2, key) => {
                state[key] = value2;
              });
            }
            ;
            let has = false;
            for (let i = 0; i < keys.length; i++) {
              const route = this.route[keys[i]];
              const regex = route.regex;
              const components2 = route.components;
              const params = route.params;
              const name2 = route.name;
              const auth = route.auth;
              const overlay = route.overlay;
              const display = route.display;
              const onrender = route.onrender;
              if (params) {
                let _path = String(path);
                _path = _path.slice(1);
                _path = _path.split("/");
                Object.entries(params).forEach((param) => {
                  const key = param[0];
                  const value2 = param[1];
                  if (_path[value2]) {
                    state[key] = _path[value2];
                  }
                  ;
                });
              }
              ;
              const test = regex.test(path);
              if (test) {
                routeName = name2;
                if (auth == true) {
                  this.authenticate(routeName);
                }
                ;
                this.prev = { components: components2, state, path, name: name2, prev: this.prev, overlay, display, onrender };
                has = true;
                break;
              }
              ;
            }
            ;
            console.log(430, has, hash);
            if (!has) {
              if (this.route["404"]) {
                let path2 = this.route["404"].callback();
                let origin = location.origin;
                let pathname = location.pathname;
                if (this.route[path2]) {
                  if (path2 == "/") {
                    path2 = `${origin}${pathname}`;
                  } else {
                    if (pathname.slice(-1) == "/") {
                      path2 = `${origin}${pathname}#!${path2}`;
                    } else {
                      path2 = `${origin}${pathname}/#!${path2}`;
                    }
                    ;
                  }
                  ;
                  location.replace(path2);
                } else if (!!path2 && !this.route[path2]) {
                  if (origin.slice(-1) == "/") {
                    if (path2[0] == "/") {
                      path2 = path2.slice(1);
                    }
                    ;
                  }
                  ;
                  path2 = `${origin}${path2}`;
                  location.replace(path2);
                }
                ;
              }
              ;
            } else {
            }
          }
          navigate(ispersist) {
            if (this.prev) {
              const components2 = this.prev.components;
              const state = this.prev.state;
              const path = this.prev.path;
              const name2 = this.prev.name;
              const overlay = this.prev.overlay;
              const onrender = this.prev.onrender || {};
              try {
                if (components2.length) {
                  return new Promise((res, rej) => {
                    const l2 = components2.length;
                    let i = 0;
                    if (l2) {
                      const recur = () => {
                        let component3 = components2[i];
                        if (components2.length > i) {
                          i += 1;
                          let componentName = component3;
                          let isunload = this.getComponent(component3, path);
                          component3 = this.components.get(component3);
                          if (component3) {
                            if (component3.isConnected && !isunload) {
                              if (component3.fire.softReload) {
                                component3.fire.softReload();
                                component3.await.softReload && component3.await.softReload.then(() => {
                                  recur();
                                });
                              } else {
                                recur();
                              }
                              ;
                            } else {
                              component3.render(__spreadValues({ emit: { route: this.prev } }, onrender[componentName] || {})).then(() => {
                                if (component3.await.isConnected) {
                                  component3.await.isConnected && component3.await.isConnected.then(() => {
                                    recur();
                                  });
                                } else {
                                  recur();
                                }
                              }).catch((err) => {
                                throw err;
                              });
                            }
                            ;
                          }
                        } else {
                          res();
                        }
                        ;
                      };
                      recur();
                    } else {
                      res();
                    }
                    ;
                  });
                }
              } catch (err) {
                console.log(err);
                throw new Error(`some of the component in ${JSON.stringify(components2)} in path ${path} of router is not found, make sure the it is created`);
              }
            }
          }
          static pushState(data2, notused, path) {
            console.log(path);
            window.history.pushState(data2, notused, path);
            let promise = Promise.resolve();
            if (this.prev) {
              const _components = this.prev.components;
              const state = this.prev.state;
              const path2 = this.prev.path;
              const name2 = this.prev.name;
              promise = new Promise((res, rej) => {
                const l2 = components.length;
                let i = 0;
                if (l2) {
                  const recur = async () => {
                    let component3 = components[i];
                    if (components.length > i) {
                      component3 = this.getComponent(component3, path2);
                      if (component3) {
                        component3.fire.destroy();
                        component3.await.destroy.then(() => {
                          return recur();
                        });
                      } else {
                        await recur();
                      }
                    } else {
                      res();
                    }
                    ;
                    i += 1;
                  };
                  recur();
                } else {
                  res();
                }
                ;
              });
            }
            ;
            return promise.then(() => {
              return this.navigate();
            });
          }
          clear() {
            let promise = Promise.resolve();
            const overlay = this.prev && this.prev.overlay || void 0;
            if (overlay) {
              return promise;
            }
            ;
            const recur = async function(index, componentNames, sourceComponents, callback) {
              let component3 = componentNames[index];
              let componentName = component3;
              let self = recur;
              try {
                if (componentNames.length > index) {
                  index += 1;
                  component3 = this.getComponent(component3, this.prev.path);
                  if (component3) {
                    if (!component3.fire.destroy) {
                      throw new Error(`${componentName} has no destroy handler!`);
                    }
                    ;
                    component3.fire.destroy();
                    component3.await.destroy.then(() => {
                      return self(index, componentNames, sourceComponents, callback);
                    });
                  } else {
                    await self(index, componentNames, sourceComponents, callback);
                  }
                  ;
                } else {
                  callback();
                }
                ;
              } catch (err) {
                throw err;
              }
            }.bind(this);
            if (this.prev && this.prev.prev) {
              let components2 = this.prev.prev.components;
              let state = this.prev.prev.state;
              let path = this.prev.prev.path;
              let name2 = this.prev.prev.name;
              let overlay2 = this.prev.prev.overlay;
              let destroyPromise = Promise.resolve();
              if (overlay2) {
                destroyPromise = new Promise((res, rej) => {
                  const l2 = components2.length;
                  let i = 0;
                  if (l2) {
                    recur(i, components2, this.components, res);
                  } else {
                    res();
                  }
                  ;
                });
              }
              ;
              promise = new Promise((res, rej) => {
                const l2 = components2.length;
                let i = 0;
                if (l2) {
                  recur(i, components2, this.components, res);
                } else {
                  res();
                }
                ;
              });
              return destroyPromise.then(() => {
                return promise;
              });
            }
            ;
            return promise;
          }
          pushState(data2, notused, path) {
            window.history.pushState(data2, notused, path);
            let promise = Promise.resolve();
            this.clear();
            return promise.then(() => {
              return this.navigate();
            });
          }
          static subscribe(fn2) {
            if (fn2 && fn2.constructor.name == "Function") {
              hooks.push(fn2);
            }
            ;
          }
          notify() {
            return Promise.all(false ? [Promise.resolve()] : hooks.map((subscribe2) => {
              return subscribe2();
            }));
          }
        };
      };
    }
  });

  // src/scripts/persist.js
  var require_persist = __commonJS({
    "src/scripts/persist.js"(exports, module) {
      var StorageKit = require_storage()();
      var ComponentStorage = require_components_store();
      module.exports = class {
        constructor() {
          this.storage = new StorageKit({
            child: "array",
            storage: "session",
            name: "_cake_persistent"
          });
        }
        listen(components2) {
          components2 = ComponentStorage;
          let event = "DOMContentLoaded";
          if ("deviceready" in document) {
            event = "deviceready";
          }
          ;
          window.addEventListener(event, (e) => {
            setTimeout(() => {
              this.storage.getAll().then((result) => {
                if (!(result && !result.length))
                  return;
                for (let r = 0; r < result.length; r++) {
                  let item2 = result[r];
                  let component2 = components2.get(item2);
                  component2.isConnected = false;
                  if (component2) {
                    !component2.isConnected && component2.render.bind(component2)();
                  } else {
                    console.error(`component ${component2} is not found!`);
                  }
                }
                ;
              });
            });
          });
        }
        append(name2) {
          this.storage.create(name2);
        }
        remove(name2) {
          this.storage.remove(name2);
        }
      };
    }
  });

  // src/scripts/storage/handler-stat.js
  var require_handler_stat = __commonJS({
    "src/scripts/storage/handler-stat.js"(exports, module) {
      var stat = {
        handlers: {},
        subscribe: {}
      };
      window.Stat = stat;
      function set(storage, component2, fn2) {
        if (storage[component2] == void 0) {
          storage[component2] = {};
        }
        ;
        if (storage[component2][fn2] == void 0) {
          storage[component2][fn2] = 0;
        } else {
          storage[component2][fn2] += 1;
        }
        ;
        return true;
      }
      module.exports = {
        handlers: {
          set: function(component2, fn2) {
            return set(stat.handlers, component2, fn2);
          },
          get: function(component2) {
            if (stat.handlers[component2] != void 0) {
              console.table(stat.handlers[component2]);
            } else {
              console.log(null);
            }
            ;
          }
        },
        subscribe: {
          set: function(component2, fn2) {
            return set(stat.subscribe, component2, fn2);
          },
          get: function(component2) {
            if (stat.subscribe[component2] != void 0) {
              console.table(stat.subscribe[component2]);
            } else {
              console.log(null);
            }
            ;
          }
        }
      };
    }
  });

  // src/scripts/storage/subscriber.js
  var require_subscriber = __commonJS({
    "src/scripts/storage/subscriber.js"(exports, module) {
      var Stat = require_handler_stat();
      var subscriber = {};
      window.Subscribe = subscriber;
      module.exports = {
        set: function(subscribe2) {
          return new Promise((res, rej) => {
            for (component in subscribe2) {
              if (subscribe2.hasOwnProperty(component)) {
                let events = subscribe2[component];
                for (let event in events) {
                  if (events.hasOwnProperty(event)) {
                    let handler = events[event];
                    if (!subscriber[component]) {
                      subscriber[component] = {};
                    }
                    ;
                    if (!subscriber[component][event]) {
                      subscriber[component][event] = [];
                    }
                    ;
                    subscriber[component][event].push(handler);
                    Stat.subscribe.set(component, handler.original);
                  }
                  ;
                }
                ;
              }
              ;
            }
            ;
            res();
          });
        },
        get: function(component2, event) {
          return subscriber[component2] && subscriber[component2][event];
        }
      };
    }
  });

  // src/scripts/storage/handler.js
  var require_handler = __commonJS({
    "src/scripts/storage/handler.js"(exports, module) {
      var Stat = require_handler_stat();
      var handler = {};
      window.Handler = handler;
      module.exports = {
        set: function(handlers, component2) {
          return new Promise((res) => {
            for (let fn2 in handlers) {
              if (handlers.hasOwnProperty(fn2)) {
                let _handler = handlers[fn2];
                if (!handler[component2]) {
                  handler[component2] = {};
                }
                ;
                handler[component2][_handler.original] = _handler;
                Stat.handlers.set(component2, _handler.original);
              }
              ;
            }
            ;
            res();
          });
        },
        get: function(component2, event) {
          return handler[component2] && handler[component2][event];
        }
      };
    }
  });

  // src/scripts/observer.js
  var require_observer = __commonJS({
    "src/scripts/observer.js"(exports, module) {
      var Subscriber = require_subscriber();
      var Handler = require_handler();
      var Stat = require_handler_stat();
      function Observer2(logger) {
        this.logger = logger || false;
        this.results = {};
      }
      Observer2.prototype.notify = function(component2, event, e) {
        let _component = component2;
        let _event = event;
        let _e = e;
        let handler = Handler.get(_component, _event);
        if (!handler) {
          console.error(`no setup handler for the event ${_event} in ${_component} component`);
          return;
        }
        ;
        _component = handler.binded;
        let prom = new Promise((res, rej) => {
          let e2 = handler(_e);
          res(e2);
        });
        Stat.handlers.set(_component, handler.original);
        return prom.then((variable) => {
          let execs = [];
          if (!this.results[_component]) {
            this.results[_component] = {};
          }
          ;
          let subscribe2 = Subscriber.get(_component, _event);
          if (subscribe2) {
            for (let s = 0; s < subscribe2.length; s++) {
              let fn2 = subscribe2[s];
              Stat.subscribe.set(_component, fn2.original);
              execs.push(new Promise((res, rej) => {
                try {
                  let exec = (() => {
                    return fn2(variable);
                  })();
                  if (exec && exec.ObjectType == "Promise") {
                    exec.then((result) => {
                      if (!this.results[_component]) {
                        this.results[_component] = {};
                      }
                      ;
                      this.results[_component][_event] = result;
                      res(result);
                    }).catch((err) => {
                      rej(err);
                    });
                  } else {
                    this.results[_component][_event] = exec;
                    res(exec);
                  }
                } catch (e2) {
                  console.log(e2);
                  rej(e2);
                }
                ;
              }));
            }
            ;
          } else {
            if (this.logger) {
              console.info(`no subscriber for (${_event}) event of (${_component}) component`);
            }
            ;
            this.results[_component][_event] = variable;
          }
          ;
          return Promise.all(execs).then(() => {
            variable = null;
            execs = [];
            return true;
          });
        });
      };
      module.exports = Observer2;
    }
  });

  // src/scripts/form.js
  var require_form = __commonJS({
    "src/scripts/form.js"(exports, module) {
      module.exports = function(component2) {
        class Options {
          constructor(type2) {
            this.type = type2;
            this.storage = {};
          }
          store(formControl, data2) {
            this.storage[formControl] = data2;
          }
          get options() {
            if (this.type == "select" || this.type == "virtual") {
              let a = {};
              for (let key in this.storage) {
                let val = this.storage[key];
                a[key] = val.options;
              }
              ;
              return a;
            }
            ;
            return false;
          }
          get value() {
            if (this.type == "input") {
              let a = "";
              for (let key in this.storage) {
                let val = this.storage[key];
                a = val.options[0];
              }
              ;
              return a;
            }
            ;
            return false;
          }
          get query() {
            let a = {};
            for (let key in this.storage) {
              let val = this.storage[key];
              a = val.query[0] || null;
            }
            ;
            return a;
          }
          get has() {
            let a = "";
            for (let key in this.storage) {
              let val = this.storage[key];
              a = val.query[0] || null;
            }
            ;
            return a;
          }
        }
        ;
        const form = {};
        form.options = (obj) => {
          let options = obj.options;
          let params = obj.params;
          if (!options) {
            options = [];
          }
          ;
          let isgroup = options.length > 1;
          let prom = Promise.all(options.map((item2) => {
            let control = item2.control;
            let field = item2.field;
            let tbl = item2.tbl;
            let src = item2.src;
            let schema = item2.schema;
            let type2 = item2.type;
            return component2.fire(src, { tbl, field, params }).then((opts) => {
              opts = opts || [];
              item2.query = opts;
              opts = opts.map((item3) => {
                return schema(item3);
              });
              if (type2 != "input") {
                let scheme = schema({});
                for (let key in scheme) {
                  if (scheme.hasOwnProperty(key)) {
                    scheme[key] = "";
                  }
                  ;
                }
                ;
                opts.unshift(scheme);
              }
              item2.options = opts;
              return item2;
            }).then((iter) => {
              let type3 = iter.type;
              let control2 = iter.control;
              if (!type3) {
                type3 = "others";
              }
              ;
              const cls = new Options(type3);
              if (isgroup) {
                let o2 = {};
                if (!o2[control2]) {
                  o2[control2] = cls;
                  o2[control2].store(control2, iter);
                }
                ;
                return o2;
              } else {
                cls.store(control2, iter);
                return cls;
              }
              ;
            });
          })).then((res) => {
            if (isgroup) {
              return res.reduce((accu, iter) => {
                Object.assign(accu, iter);
                return accu;
              }, {});
            } else {
              return res[0];
            }
          }).catch((err) => {
            console.error(err);
          });
          return prom;
        };
        form.plot = (config) => {
          let data2 = config.data;
          let container = config.container;
          if (!data2 && !container) {
            return;
          }
          ;
          const query = (root, selector2, callback) => {
            if (!root) {
              console.info("root is not provided!");
              return;
            }
            const els = root.querySelectorAll(`${selector2}`);
            const len = els.length;
            if (!len) {
              callback(null, data2);
              return;
            }
            for (let e = 0; e < len; e++) {
              let el = els[e];
              let name2 = el.name;
              let value2 = data2[name2];
              let r = callback(el, value2, e);
              if (r == "break") {
                break;
              }
              ;
              if (r == "continue") {
                continue;
              }
              ;
            }
            ;
          };
          query(container, "INPUT.input", function(el, value2) {
            if (value2 != void 0) {
              if (el.type == "date") {
                value2 = new Date(value2) == "Invalid Date" ? "" : new Date(value2).toJSON().split("T")[0];
                el.value = value2;
              } else {
                el.value = value2;
              }
            }
            ;
          });
          setTimeout(() => {
            query(container, "SELECT.input:not(.cake-template)", function(select, value2) {
              query(select, "OPTION:not(.cake-template)", function(option, _value, index) {
                if (option) {
                  if (option.value == value2) {
                    select.selectedIndex = index;
                    return "break";
                  }
                  ;
                } else {
                  console.log(option, _value, "provide schema");
                }
              });
            });
          }, 500);
          return Promise.resolve();
        };
        return form;
      };
    }
  });

  // src/scripts/cake.js
  var require_cake = __commonJS({
    "src/scripts/cake.js"(exports, module) {
      var Attrib = require_attributes();
      var Scope = require_scope()();
      var Component = require_component();
      var Router = require_router();
      var Persistent = require_persist();
      var StorageKit = require_storage()();
      var Observer2 = require_observer();
      var Formy = require_form();
      var Utils = require_utils();
      var Templating = require_templating();
      var Plugin = require_plugin();
      var Subscriber = require_subscriber();
      var Handler = require_handler();
      var ComponentStorage = require_components_store();
      function Cake2(name2) {
        this.componentName = name2;
        this.components = {};
      }
      Cake2.app = function(config) {
        this.name = config.name || "";
      };
      Cake2.Components = function(name2) {
        return {
          subscribe(cb2, ctx2) {
            function subscribeExternal() {
              let component2 = Cake2.Components[name2];
              if (component2) {
                if (cb2 instanceof Function) {
                  let name3 = cb2.name;
                  if (ctx2) {
                    cb2 = cb2.bind(ctx2);
                  }
                  cb2.binded = "external";
                  cb2.original = name3;
                  cb2.listenTo = component2.name;
                  component2.Subscribe(cb2);
                }
              } else {
              }
              ;
            }
            ;
            return new Promise((res, rej) => {
              let lk = setInterval(() => {
                if (Cake2.Components[name2]) {
                  subscribeExternal();
                  clearInterval(lk);
                  res();
                }
                ;
              });
            });
          }
        };
      };
      Cake2.Models = {};
      Cake2.plugin = Plugin;
      Cake2.Attributes = new Attrib();
      Cake2.Models.$loaded = function(name2) {
        return new Promise((res, rej) => {
          let mk = setInterval(() => {
            if (Cake2.Models[name2]) {
              clearInterval(mk);
              res(Cake2.Models[name2]);
            }
            ;
          });
          setTimeout(() => {
            if (!Cake2.Models[name2]) {
              clearInterval(mk);
              rej(name2);
            }
          }, 1e4);
        });
      };
      Cake2.MainMessageChannel = function() {
        let channel = new MessageChannel();
        return {
          send(data2) {
            channel.port2.postMessage(data2);
          },
          receive(fn2) {
            channel.port1.onmessage = function(payload) {
              let data2 = payload.data;
              let isTrusted = payload.isTrusted == void 0 ? false : payload.isTrusted;
              if (isTrusted) {
                fn2({ status: 1, data: data2 });
              } else {
                fn2({ status: 0, err: "not trusted!" });
              }
              ;
            };
          }
        };
      }();
      Cake2.Utils = {
        scopeTrap(k) {
          return false;
        },
        scopeNotifier(m) {
          return m;
        }
      };
      Cake2.create = function(name2, template, options) {
        let group = new Cake2(name2, template, options);
        group.create(name2, template, options);
      };
      Cake2.init = function(name2) {
        return new Component(name2);
      };
      Cake2.Router = Router(Cake2.Models, Component);
      Cake2.Persistent = new Persistent();
      Cake2.Persistent.listen(Cake2.Components);
      Cake2.Cache = new StorageKit({
        name: "cache",
        storage: "session",
        child: "object"
      });
      Cake2.getSubscriber = function(component2, handler) {
        let subscribe2 = Subscriber;
        let obj = {};
        for (let c in subscribe2) {
          if (subscribe2.hasOwnProperty(c)) {
            let handlers = subscribe2[c];
            for (let h in handlers) {
              if (handlers.hasOwnProperty(h)) {
                let hs = handlers[h];
                for (let h2 of hs) {
                  let _handler = h2;
                  let original = _handler.original;
                  let binded = _handler.binded;
                  let listenTo = _handler.listenTo;
                  if (listenTo == component2) {
                    if (original == handler) {
                      if (!obj[binded]) {
                        obj[binded] = handler;
                      } else {
                        let v = obj[binded] instanceof Array ? obj[binded] : [obj[binded]];
                        obj[binded] = v.concat(handler);
                      }
                      ;
                    } else if (!handler) {
                      if (!obj[binded]) {
                        obj[binded] = original;
                      } else {
                        let v = obj[binded] instanceof Array ? obj[binded] : [obj[binded]];
                        obj[binded] = v.concat(original);
                      }
                      ;
                    }
                  }
                  ;
                }
                ;
              }
              ;
            }
            ;
          }
        }
        ;
        return obj;
      };
      Cake2.Observer = new Observer2();
      Cake2.prototype._defineProperty = function(component2, prop, get, set) {
        Object.defineProperty(component2, prop, {
          configurable: true,
          get() {
            return get();
          },
          set(value2) {
            if (set) {
              set(value2);
            } else {
            }
          }
        });
      };
      Cake2.prototype._defineProperty(Component.prototype, "$observer", function() {
        return Cake2.Observer;
      });
      Cake2._globalScope = new Scope("globalScope");
      Cake2.prototype._defineProperty(Component.prototype, "$globalScope", function() {
        const scope = Cake2._globalScope;
        return scope;
      });
      Cake2._universalScope = new Scope("universalScope");
      Cake2.$universalScope = function() {
        const scope = Cake2._universalScope;
        return scope;
      };
      Cake2.prototype._defineProperty(Component.prototype, "$attrib", function() {
        return Cake2.Attributes;
      });
      Cake2.prototype._defineProperty(Component.prototype, "$persist", function() {
        return Cake2.Persistent;
      });
      Cake2.prototype._defineProperty(Component.prototype, "$cache", function() {
        return Cake2.Cache;
      });
      Cake2.prototype._defineProperty(Component.prototype, "$hash", function() {
        return Cake2.Hasher;
      });
      Cake2.prototype.create = function(name2, template, options) {
        console.time(name2);
        let component2 = new Component(name2, template, options);
        const scope = new Scope(name2);
        component2.scope && (() => {
          for (let _component in component2.scope) {
            if (component2.scope.hasOwnProperty(_component)) {
              const handlers = component2.scope[_component];
              for (let key in handlers) {
                if (handlers.hasOwnProperty(key)) {
                  let handler = handlers[key];
                  const bind2 = handler.name;
                  handler = handler.bind(component2);
                  scope.hook(_component, bind2, handler);
                }
                ;
              }
              ;
            }
            ;
          }
          ;
        })();
        scope.registerNotifier(function(prop, newValue, prevValue, component3) {
          return Cake2.Attributes.notifier(prop, newValue, prevValue, component3);
        });
        Cake2.Attributes.registerNotifier(name2, function(name3, obj) {
          return scope.notifier(name3, obj);
        });
        component2.compile.then(() => {
          let subscribe2 = component2.subscribe;
          let root = component2.root;
          let html = component2.html;
          let handlers = component2.handlers;
          let role = component2.role;
          let state = component2.state;
          return Subscriber.set(subscribe2).then(() => {
            return { root, handlers };
          });
        }).then((_obj) => {
          const handlers = _obj.handlers;
          const root = _obj.root;
          Handler.set(handlers, component2.name);
          this._defineProperty(component2, "root", function() {
            if (component2._root) {
              return component2._root;
            } else {
              let selector2 = root || "#app";
              let query = document.querySelector(selector2);
              if (query) {
                return query;
              }
            }
            ;
            throw new Error(`the selector '${root}' as container of component '${component2.name}' is not found!`);
          }, function(value2) {
            Object.assign(component2, { _root: value2 });
          });
          this._defineProperty(component2, "$scope", function() {
            return scope;
          });
          component2.role == "form" && (() => {
            const methods = Formy(component2);
            const form = () => {
              return component2.root.querySelector(component2.formSelector || "FORM");
            };
            for (let method in methods) {
              if (methods.hasOwnProperty(method)) {
                Object.defineProperty(form, method, {
                  get() {
                    return methods[method];
                  }
                });
              }
              ;
            }
            ;
            this._defineProperty(component2, "$form", function() {
              return form;
            });
          })();
        }).then(() => {
          component2.fire = function() {
            function fire(name3, variable) {
              variable = !variable ? null : typeof variable == "function" ? variable.bind(component2)() : function() {
                return variable;
              }.bind(component2)();
              let o2 = {
                [name3]: () => {
                  return variable;
                }
              };
              fn = o2[name3].bind(component2);
              if (typeof fn == "function") {
                let getAttributes2 = function(element) {
                  let o3 = {};
                  if (!element) {
                    return o3;
                  }
                  ;
                  let attributes = element.attributes;
                  if (attributes) {
                    for (let i = 0; i < attributes.length; i++) {
                      let attribute = attributes[i];
                      let name4 = attribute.name;
                      let value2 = attribute.value;
                      o3[name4] = value2;
                    }
                    ;
                  }
                  ;
                  return o3;
                };
                var getAttributes = getAttributes2;
                fn.name = name3;
                fn.original = name3;
                fn.binded = component2.name;
                Handler.set({ [name3]: fn }, component2.name);
                let payload = variable;
                ;
                if (variable && (variable.element || variable.root || variable.container)) {
                  const element = getAttributes2(variable.element);
                  const root = getAttributes2(variable.root);
                  const container = getAttributes2(variable.container);
                  payload = { status: 0, attributes: { element, root, container } };
                }
                ;
                const notify = Cake2.Observer.notify(component2.name, name3, {}).then(() => {
                  return Cake2.Observer.results[component2.name][name3];
                });
                component2.await[name3] = notify;
                return component2.await[name3];
              }
              ;
              console.error(`the param in fire is not an instance of function`);
            }
            ;
            function addStaticMethod(fire2, handlers) {
              for (let h in handlers) {
                if (handlers.hasOwnProperty(h)) {
                  let handler = handlers[h];
                  let event = handler.original;
                  let fn2 = {
                    [event]: function(variable, isBroadcast) {
                      if (isBroadcast != void 0) {
                        isBroadcast = isBroadcast;
                      }
                      ;
                      if (isBroadcast == void 0 && event == "destroy") {
                        isBroadcast = true;
                      }
                      ;
                      if (isBroadcast == void 0) {
                        isBroadcast = false;
                      }
                      ;
                      if (isBroadcast) {
                        component2.await[event] = new Promise((res) => {
                          setTimeout(() => {
                            let payload = variable || {};
                            Cake2.Observer.notify(component2.name, event, payload).then(() => {
                              return Cake2.Observer.results[component2.name][event];
                            }).then((r) => {
                              res(r);
                            }).catch((err) => {
                              console.log(448, component2.name, event, payload);
                              console.trace();
                              console.error(err);
                            });
                          });
                        });
                        return component2.await[event];
                      } else {
                        return handler(variable);
                      }
                      ;
                    }
                  };
                  fn2[event] = fn2[event].bind(component2);
                  fn2[event].originalName = event;
                  fn2[event].binded = component2.name;
                  fire2[event] = fn2[event];
                  fire2.component = component2.name;
                }
                ;
              }
              ;
            }
            addStaticMethod(fire, component2.handlers);
            return fire;
          }();
        }).then(() => {
          if (component2.type == "view") {
            component2.toggler = component2.toggler(component2);
            ComponentStorage.set(name2, component2);
          }
          ;
        }).then(() => {
          component2.options.router && Cake2.Router.subscribe(component2.options.router.bind(component2));
          component2.options.data && component2.options.data.bind(component2.data)(component2);
          component2.options.init && component2.options.init.bind(component2)();
          component2.options.utils && component2.options.utils.bind(component2.utils)(component2);
        }).then(() => {
          if (component2.type == "model") {
            Cake2.Models[name2] = component2;
          }
          if (component2.isStatic && component2.type == "view") {
            component2.render();
          } else {
          }
          ;
        });
      };
      module.exports = Cake2;
    }
  });

  // src/app.js
  var env = require_env();
  var extensions = require_extends();
  var polyfill = require_polyfill();
  var utils = require_utils();
  var templateExtend = require_template_extend();
  var plugin = require_plugin();
  var cake = require_cake();
  window.Cake = cake;
})();
