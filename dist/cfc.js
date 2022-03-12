(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // src/scripts/env.js
  var require_env = __commonJS({
    "src/scripts/env.js"() {
      (function(global) {
        global.env = {
          destructure: true
        };
        const env2 = global.env;
        try {
          let { a } = { a: true };
        } catch (err) {
          env2.destructure = false;
        }
        ;
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
        String.prototype.toCamelCase = function() {
          let str = this.toLowerCase();
          let _StringCache = Object.cache;
          let cvt = null;
          switch (true) {
            case !_StringCache.toCamel: {
              _StringCache.toCamel = {};
            }
            case true: {
              _StringCache = _StringCache.toCamel;
            }
            case _StringCache[str]:
              {
                cvt = _StringCache[str];
              }
              break;
            default:
              {
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
                cvt = join;
              }
              break;
          }
          ;
          return cvt;
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
          let q = this.querySelectorAll(selector2).toArray();
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
                this.getAttribute(attr) == val && q.push(this);
              }
              ;
              break;
            case (attr && !val):
              {
                this.getAttribute(attr) && q.push(this);
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
            let name = node.dataset.name;
            if (name == dataName) {
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
          let storage2 = this[n];
          return {
            set(key, value) {
              storage2[key] = value;
            },
            get(key) {
              return storage2[key];
            },
            getAll(key) {
              return storage2;
            },
            remove(key) {
              delete storage2[key];
            }
          };
        };
      })(window);
    }
  });

  // src/scripts/polyfill.js
  var require_polyfill = __commonJS({
    "src/scripts/polyfill.js"() {
      if (!Object.keys) {
        Object.keys = function(obj) {
          var keys = [];
          for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
              keys.push(i);
            }
          }
          return keys;
        };
      }
    }
  });

  // src/scripts/utils.js
  var require_utils = __commonJS({
    "src/scripts/utils.js"(exports, module) {
      var global = {};
      var TYPES = {
        typeof: function(ctx) {
          switch (true) {
            case typeof ctx == "string":
              return "string";
            case typeof ctx == "number":
              return "number";
            case ctx instanceof Array:
              return "array";
            case ctx instanceof Function:
              return "function";
            case ctx instanceof HTMLCollection:
              return "htmlcollection";
            case ctx instanceof NodeList:
              return "htmlnodelist";
            case ctx instanceof Element:
              return "domlement";
            case ctx instanceof Object:
              return "object";
          }
          ;
        },
        isArray: function(ctx) {
          return this.typeof(ctx) == "array";
        },
        isObject: function(ctx) {
          return this.typeof(ctx) == "object";
        },
        isNumber: function(ctx) {
          return this.typeof(ctx) == "number";
        },
        isString: function(ctx) {
          return this.typeof(ctx) == "string";
        },
        isHTMLCollection: function(ctx) {
          return this.typeof(ctx) == "htmlcollection";
        },
        isNodeList: function(ctx) {
          return this.typeof(ctx) == "htmlnodelist";
        },
        isElement: function(ctx) {
          return this.typeof(ctx) == "domlement";
        },
        isFunction: function(ctx) {
          return this.typeof(ctx) == "function";
        }
      };
      var LOOP = {
        each: function(ctx, fn2, type) {
          if (type == "object") {
            var i = 0;
            for (var key in ctx) {
              if (ctx.hasOwnProperty(key)) {
                fn2({ key, value: ctx[key] }, i);
                i = i + 1;
              }
              ;
            }
            ;
          } else {
            for (var a = 0; a < ctx.length; a++) {
              fn2(ctx[a], a);
            }
          }
          ;
        },
        map: function(ctx, fn2) {
          var type = TYPES.isArray(ctx) || ctx.length ? "array" : "object";
          var st = ctx.length && type == "array" ? [] : {};
          this.each(ctx, function(obj, index) {
            var r = fn2(obj, index);
            if (type == "object") {
              st[r.key] = r.value;
            } else {
              st.push(r);
            }
            ;
          }, type);
          return st;
        },
        reduce: function(ctx, accu, fn2) {
          var type = TYPES.typeof(ctx);
          this.each(ctx, function(obj, index) {
            accu = fn2(obj, accu, index);
          }, type);
          return accu;
        },
        filter: function(ctx, fn2) {
          var type = TYPES.isArray(ctx) || ctx.length ? "array" : "object";
          var st = ctx.length && type == "array" ? [] : {};
          this.each(ctx, function(obj, index) {
            var r = fn2(obj, index);
            if (r) {
              if (type == "object") {
                st[obj.key] = obj.value;
              } else {
                st.push(obj.value);
              }
              ;
            }
            ;
          }, type);
          return st;
        }
      };
      var OTHERS = {
        perf: function(fn2) {
          console.time("test");
          fn2();
          console.timeEnd("test");
        },
        logTest: function(a, ops, b) {
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
          return searchParams;
        },
        sanitize: function(string) {
          if (typeof string != "string") {
            return string;
          }
          ;
          const map = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#x27;",
            "/": "&#x2F;"
          };
          const reg = /[&<>"'/]/ig;
          return string.replace(reg, (match) => map[match]);
        },
        toFormData: function(form2, options = {}) {
          let formData = new FormData(form2);
          let o2 = {};
          let fd = new FormData();
          for (let [key, value] of formData.entries()) {
            if (!!value) {
              value = this.sanitize(value);
            }
            ;
            if (options.json) {
              if (options.trim) {
                if (!!value) {
                  o2[key] = value;
                }
                ;
              } else {
                o2[key] = value;
              }
              ;
            } else {
              fd.append(key, value);
            }
          }
          ;
          if (options.json) {
            return o2;
          } else {
            return fd;
          }
          ;
        },
        loopStringSplitSpace: function(string, fn2) {
          string = string.split(" ");
          if (TYPES.isArray(string)) {
            for (let i = 0; i < string.length; i++) {
              fn2(string[i]);
            }
            ;
          }
          ;
        }
      };
      try {
        global.UTILS = { ...LOOP, ...TYPES, ...OTHERS };
      } catch (err) {
        global.UTILS = {};
        iter = LOOP.each;
        iter(LOOP, function(key, value) {
          global.UTILS[key] = value;
        });
        iter(TYPES, function(key, value) {
          global.UTILS[key] = value;
        });
        iter(OTHERS, function(key, value) {
          global.UTILS[key] = value;
        });
      }
      var iter;
      module.exports = global.UTILS;
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
        HTMLTemplateElement.prototype.replaceSubTemplate = function(el2) {
          let subTemplates = el2.getElementsByTagName("sub-template");
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
          let fr2 = document.createDocumentFragment();
          let styles = temp.content.querySelector("style");
          if (styles) {
            fr2.appendChild(styles);
          }
          let others = [];
          for (let o2 = 0; o2 < temp.content.children.length; o2++) {
            let el2 = temp.content.children[0];
            this.replaceSubTemplate(el2);
            others.push(el2);
          }
          cf = { style: fr2.children[0], others };
          return cf;
        };
        HTMLTemplateElement.prototype.parseStyle = function(style) {
          if (!style)
            return false;
          var styles = style.textContent;
          styles = styles.replace(/\s/g, "");
          if (!styles.length) {
            return;
          }
          let isSelector = false;
          let isOpen = false;
          let isClose = false;
          let splitted = styles.split("");
          let selector2 = "";
          styles = "";
          var obj = false;
          for (let l2 = 0; l2 < splitted.length; l2++) {
            let cha = splitted[l2];
            if (cha == "{") {
              isSelector = true;
              isOpen = true;
            }
            ;
            if (cha == "}") {
              isSelector = false;
              isOpen = false;
            }
            ;
            if (!isSelector && cha != "	" && cha != "}" && cha != " " && cha != ";") {
              selector2 += cha;
            }
            ;
            if (isOpen && cha != "	" && cha != "{" & cha != " ") {
              styles += cha;
            }
            ;
            if (cha == "}") {
              if (!obj) {
                obj = {};
              }
              ;
              obj[selector2] = styles;
              selector2 = "";
              styles = "";
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
          let { style, others } = this.collectContent();
          let styles = this.parseStyle(style);
          let element = this.parseHTML(others);
          for (let selector2 in styles) {
            if (styles.hasOwnProperty(selector2)) {
              let query = element.querySelectorAll(selector2);
              let css = styles[selector2];
              for (let q = 0; q < query.length; q++) {
                let item = query[q];
                item.setAttribute("style", css);
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

  // src/scripts/storage.js
  var require_storage = __commonJS({
    "src/scripts/storage.js"(exports, module) {
      module.exports = function() {
        function typeOf(_obj) {
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
        function ObjectMerge(obj, value, key) {
          obj = Object.assign(obj, { [key]: value });
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
            var item = src[i];
            if (typeOf(id2) == "object") {
              var obj = id2;
              var key = Object.keys(id2)[0];
              var value = obj[key];
              if (typeOf(item) == "object") {
                var test = item[key] == value;
                if (test) {
                  has = i;
                  break;
                }
                ;
              }
              ;
            } else if (typeOf(id2) != "array") {
              var test = id2 == item;
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
          var type = typeOf(id2);
          if (type == "object") {
            var _key = Object.keys(id2)[0];
            if (src[key] != void 0 && src[key] == id2[_key]) {
              key = _key;
            }
            ;
          } else if (type == "string") {
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
        var methods = {
          create: function(storage2, data2) {
            if (isArray(storage2)) {
              let unique = new Set(storage2);
              if (typeOf(data2) == "array") {
                data2.forEach((i) => {
                  unique.add(i);
                });
              } else {
                unique.add(data2);
              }
              ;
              storage2 = Array.from(unique);
            } else if (isObject(storage2)) {
              if (isObject(data2)) {
                ObjectForEach(data2, function(value, key) {
                  storage2[key] = value;
                });
              } else {
                storage2[data2] = data2;
              }
              ;
            }
            ;
            return storage2;
          },
          createOrUpdate: function(storage2, data2) {
            var has = hasItem(storage2, data2);
            if (typeOf(storage2) == "array") {
              if (!isNull(has)) {
                storage2[has] = data2;
              } else {
                storage2.includes(data2);
              }
            } else if (typeOf(storage2) == "object") {
              if (isNull(has)) {
                if (isObject(data2)) {
                  ObjectForEach(data2, function(value, key) {
                    ObjectMerge(storage2, value, key);
                  });
                } else {
                  storage2[data2] = data2;
                }
                ;
              } else {
                storage2[has] = data2;
              }
              ;
            }
            ;
            return storage2;
          },
          remove: function(storage2, id2) {
            if (typeOf(id2) == "string") {
              var has = hasItem(storage2, id2);
              if (typeOf(storage2) == "object") {
                delete storage2[has];
              } else if (typeOf(storage2) == "array") {
                var arr = [];
                for (var i = 0; i < storage2.length; i++) {
                  if (i != has) {
                    arr.push(storage2[i]);
                  } else {
                    continue;
                  }
                  ;
                }
                ;
                storage2 = arr;
              }
              ;
              return storage2;
            } else if (typeOf(id2) == "object") {
              return Object.filter(storage2, function(value, key) {
                var test = id2[key] != void 0 && id2[key] == value;
                return !test;
              });
            } else if (typeOf(id2) == "array") {
              return Object.filter(storage2, function(value, key) {
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
          get: function(storage2, id2) {
            var type = typeOf(id2);
            if (type == "string") {
              var has = hasItem(storage2, id2);
              if (has == 0 || has) {
                return storage2[has];
              }
              ;
            } else if (type == "object") {
              return Object.filter(storage2, function(value, key) {
                var test = !isUndefined(id2[key]) && id2[key] == value;
                return test;
              });
            } else if (type == "array") {
              return Object.filter(storage2, function(value, key) {
                var test = id2.contains(key);
                return test;
              });
            }
            return null;
          },
          getNot: function(storage2, id2) {
            var type = typeOf(id2);
            if (type == "string") {
              return Object.filter(storage2, function(value, key) {
                var test = key != id2;
                return test;
              });
            } else if (type == "object") {
              return Object.filter(storage2, function(value, key) {
                return Object.some(id2, function(_value, _key) {
                  var test = _key == key && _value == value;
                  return !test;
                });
              });
            } else if (type == "array") {
              return Object.filter(storage2, function(value, key) {
                var test = !id2.contains(key);
                return test;
              });
            }
            return null;
          },
          getAll: function(storage2) {
            return storage2;
          }
        };
        var STORAGE = class {
          constructor(type, name, child) {
            this.type = type;
            this.name = name;
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
          close(storage2) {
            this.child = storage2;
            this.create();
            return this.init(true);
          }
          create() {
            this.cache[this.name] = this.child;
          }
          array() {
            this.create();
          }
          object() {
            this.create();
          }
          session(save) {
            this.create();
            try {
              if (!sessionStorage[this.name]) {
                sessionStorage.setItem(this.name, JSON.stringify(this.cache));
              } else if (save) {
                sessionStorage.setItem(this.name, JSON.stringify(this.cache));
              } else {
                sessionStorage.removeItem(this.name);
                sessionStorage.setItem(this.name, JSON.stringify(this.cache));
              }
            } catch (err) {
              this.create();
            }
            ;
          }
          local(save) {
            this.create();
            try {
              if (!localStorage[this.name]) {
                localStorage.setItem(this.name, JSON.stringify(this.cache));
              } else if (save) {
                localStorage.setItem(this.name, JSON.stringify(this.cache));
              } else {
                localStorage.removeItem(this.name);
                localStorage.setItem(this.name, JSON.stringify(this.cache));
              }
            } catch (err) {
              this.create();
            }
            ;
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
            var storage2 = this.storage.open();
            var has = hasItem(storage2, id2);
            return isNull(has) ? false : has;
          }
          get(id2) {
            return new Promise((res, rej) => {
              setTimeout(() => {
                var storage2 = this.storage.open();
                res(storage2);
              });
            }).then((storage2) => {
              return methods.get(storage2, id2);
            });
          }
          getNot(id2) {
            var storage2 = this.storage.open();
            return methods.getNot(storage2, id2);
          }
          getAll() {
            var storage2 = this.storage.open();
            return Promise.resolve(storage2);
          }
          update(id2, update) {
            var storage2 = this.storage.open();
            var has = hasItem(storage2, id2);
            if (has == 0 || has) {
              storage2 = methods.createOrUpdate(storage2, data);
              return this.storage.close(storage2);
            }
            ;
            return false;
          }
          createOrUpdate(data2) {
            if (arguments.length > 1) {
              let key = arguments[0];
              let value = arguments[1];
              data2 = { [key]: value };
            }
            ;
            var storage2 = this.storage.open();
            storage2 = methods.createOrUpdate(storage2, data2);
            return this.storage.close(storage2);
          }
          create(data2) {
            var storage2 = this.storage.open();
            storage2 = methods.create(storage2, data2);
            return this.storage.close(storage2);
          }
          remove(id2) {
            var storage2 = this.storage.open();
            storage2 = methods.remove(storage2, id2);
            return this.storage.close(storage2);
          }
        };
        return USB;
      };
    }
  });

  // src/scripts/piece.js
  var require_piece = __commonJS({
    "src/scripts/piece.js"(exports, module) {
      module.exports = function() {
        function Piece(el2) {
          this.el = Piece.toArray(el2);
        }
        ;
        Piece.toArray = function(el2) {
          let r = [];
          switch (true) {
            case el2 instanceof Array:
              {
                r = el2;
              }
              break;
            case (el2.length && (el2.tagName && el2.tagName != "FORM") && !(el2 instanceof Array)):
              {
                for (let e = 0; e < el2.length; e++) {
                  r.push(el2[e]);
                }
                ;
              }
              break;
            case !(el2 instanceof Array):
              {
                r = [el2];
              }
              break;
          }
          ;
          return r;
        };
        Piece.prototype.getElements = function() {
          return this.el;
        };
        Piece.prototype.getElement = function() {
          return this.el[0];
        };
        Piece.prototype.remove = function(name) {
          let i = -1, length2 = this.el.length;
          let fg = document.createDocumentFragment();
          while (++i < length2) {
            let el2 = this.el[i];
            el2 && fg.appendChild(el2);
          }
          ;
          fr = null;
        };
        Piece.prototype.replaceDataSrc = function() {
          let els = this.el[0];
          let srcs = els.querySelectorAll("[data-src]");
          for (let s = 0; s < srcs.length; s++) {
            el = srcs[s];
            el.setAttribute("src", el.dataset.src);
            el.removeAttribute("data-src");
          }
          ;
        };
        Piece.cloneNode = function(el2) {
          el2 = el2 instanceof Array ? el2 : this.toArray(el2);
          let a = [];
          for (let e = 0; e < el2.length; e++) {
            a.push(el2[e].cloneNode(true));
          }
          ;
          return new Piece(a);
        };
        Piece.prototype.dataset = function(data2, cb) {
          let l2 = this.el.length;
          let i = -1;
          while (++i < l2) {
            if (this.el[i].dataset[data2]) {
              let exec = cb(this.el[i]);
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
        Piece.prototype.cloneNode = function(el2) {
          el2 = this.el;
          return Piece.cloneNode(el2);
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
                  let el2 = this.el[i];
                  let q = el2.getElementsByTagName("*");
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
            let el2 = this.el[i];
            root.appendChild(el2);
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
                  let el2 = this.el[i];
                  let q = el2.getElementsByTagName(selector);
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
                  let el2 = this.el[i];
                  let q = el2.querySelector(selector);
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
                  let el2 = this.el[i];
                  let q = el2.querySelectorAll(selector2);
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
                  let el2 = this.el[i];
                  let q = el2.querySelector(selector2);
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
                  let el2 = this.el[i];
                  let q = el2.querySelectorIncluded(selector2, attr, val);
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
                  let el2 = this.el[i];
                  let q = el2.querySelectorAllIncluded(selector2, attr, val);
                  q && (r = r.concat(q.toArra()));
                }
                ;
              }
              break;
          }
          ;
          return r;
        };
        Piece.prototype.contains = function(el2) {
          let length2 = this.el.length, test = false;
          switch (length2 == 1) {
            case true:
              {
                test = this.el[0].contains(el2);
              }
              break;
            case false:
              {
                let index = -1;
                while (++index < length2) {
                  let _el = this.el[index];
                  if (_el.contains(el2)) {
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
          let arg, sel, i, a, el2, query;
          arg = arguments;
          o = {};
          length = arg.length;
          i = -1;
          a = -1;
          while (++i < this.el.length) {
            el2 = this.el[i];
            while (++a < length) {
              sel = arg[a];
              if (el2.getAttribute(`data-${sel}`)) {
                o[sel] = [el2];
              } else {
                o[sel] = [];
              }
              query = el2.querySelectorAll(`[data-${sel}]`);
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
        return Piece;
      };
    }
  });

  // src/scripts/observer.js
  var require_observer = __commonJS({
    "src/scripts/observer.js"(exports, module) {
      module.exports = function() {
        function Observer2(subscribe2, handlers, logger) {
          this.subscribe = subscribe2;
          this.handlers = handlers;
          this.logger = logger || false;
          this.stat = {
            handlers: {},
            subscribe: {}
          };
          this.results = {};
          this.wm = /* @__PURE__ */ new WeakMap();
        }
        Observer2.prototype.notify = function(component3, event, e, filter, ispage, appName) {
          function engrave() {
            return {
              _component: component3,
              _event: event,
              _e: e
            };
          }
          ;
          function ret(handler2) {
            return handler2;
          }
          ;
          let { _component, _event, _e } = engrave();
          let handler = this.handlers[_component] && this.handlers[_component][_event];
          if (handler == void 0 && ispage) {
            let o2 = {
              [_event]: function() {
                return _e;
              }
            };
            o2[_event].binded = _component;
            o2[_event].listenTo = appName;
            handler = o2[_event];
          }
          ;
          _component = handler.binded;
          handler = ret(handler);
          if (!handler) {
            console.error(`no setup handler for the event ${_event} in ${_component} component`);
            return;
          }
          ;
          let prom = new Promise((res, rej) => {
            let e2 = handler(_e);
            res(e2);
          });
          this.stat.handlers[handler.original] += 1;
          return prom.then((variable) => {
            let execs = [];
            if (!this.results[_component]) {
              this.results[_component] = {};
            }
            ;
            if (this.subscribe[_component] && this.subscribe[_component][_event]) {
              let subscribe2 = this.subscribe[_component][_event];
              filter = !filter ? true : (() => {
                subscribe2 = subscribe2.filter((fn2) => {
                  let binded = fn2.binded;
                  return filter.includes(binded);
                });
              })();
              for (let s = 0; s < subscribe2.length; s++) {
                let fn2 = subscribe2[s];
                this.stat.subscribe[fn2.original] += 1;
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
                        this.results[_component][_event] = exec;
                        res();
                      }).catch((err) => {
                        rej(err);
                      });
                    } else {
                      this.results[_component][_event] = exec;
                      res();
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
            });
          });
        };
        Observer2.prototype.registerSubscribe = function(subscribe2) {
          return new Promise((res, rej) => {
            for (component in subscribe2) {
              if (subscribe2.hasOwnProperty(component)) {
                if (!this.subscribe[component]) {
                  this.subscribe[component] = {};
                } else {
                  continue;
                }
                ;
              }
              ;
            }
            ;
            res();
          }).then(() => {
            let obj = {};
            for (component in subscribe2) {
              if (subscribe2.hasOwnProperty(component)) {
                let events = subscribe2[component];
                for (let name in events) {
                  if (events.hasOwnProperty(name)) {
                    let arr = events[name];
                    for (let f = 0; f < arr.length; f++) {
                      let handler = arr[f];
                      if (!obj[component]) {
                        obj[component] = {};
                      }
                      ;
                      if (!obj[component][handler.original]) {
                        obj[component][handler.original] = [];
                      }
                      ;
                      obj[component][handler.original].push(handler);
                      this.stat.subscribe[handler.original] = 0;
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
            return obj;
          }).then((obj) => {
            for (let component3 in obj) {
              if (obj.hasOwnProperty(component3)) {
                if (!this.subscribe[component3]) {
                  this.subscribe[component3] = {};
                }
                ;
                for (let event in obj[component3]) {
                  if (obj[component3].hasOwnProperty(event)) {
                    for (let handler of obj[component3][event]) {
                      if (!this.subscribe[component3][handler.original]) {
                        this.subscribe[component3][handler.original] = [];
                      }
                      ;
                      this.subscribe[component3][handler.original].push(handler);
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
            obj = {};
          });
        };
        Observer2.prototype.registerHandlers = function(handlers, component3) {
          if (!this.handlers[component3]) {
            this.handlers[component3] = {};
          }
          ;
          for (let fn2 in handlers) {
            if (handlers.hasOwnProperty(fn2)) {
              let handler = handlers[fn2];
              this.handlers[component3][fn2] = handler;
              this.stat.handlers[handler.original] = 0;
            }
            ;
          }
          ;
        };
        return Observer2;
      };
    }
  });

  // src/scripts/templating.js
  var require_templating = __commonJS({
    "src/scripts/templating.js"(exports, module) {
      module.exports = function() {
        function Templating(data2, template, isConvert) {
          this.data = data2;
          this.template = template;
          this.isConvert = isConvert;
        }
        ;
        Templating.prototype._getTag = function(template) {
          return template.match(new RegExp("(?<=<)|([^/s]+)(?=>)", "g"))[2];
        };
        Templating.prototype._bindReplace = function(obj, string) {
          for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
              let pattern = new RegExp(`{{${key}}}`, "g");
              pattern && (string = string.replace(pattern, `${obj[key]}`));
            }
            ;
          }
          ;
          return string;
        };
        Templating.prototype._toElement = function(template, tag) {
          let fr2 = document.createElement("template");
          fr2.innerHTML = template;
          return fr2.content.children[0];
        };
        Templating.prototype.createElement = function() {
          let template = this.template;
          let data2 = this.data;
          let isConvert = this.isConvert;
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
        return Templating;
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
              let { element } = cf;
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
              let fr2 = [];
              for (let k = 0; k < keyframes.length; k++) {
                let kk = keyframes[k];
                switch (true) {
                  case typeof kk == "string":
                    {
                      fr2.push(this.dic(kk));
                    }
                    break;
                  case kk instanceof Object: {
                    let { name, offset } = kk;
                    if (name && offset) {
                      let def = this.dic(name);
                      def[def.length - 1].offset = offset;
                      fr2.push(def);
                    } else {
                      fr2.push(kk);
                    }
                  }
                }
                ;
              }
              keyframes = fr2;
              fr2 = null;
              let recurseCall = () => {
                let kf = keyframes[index];
                let animate2 = element.animate(kf, config.options || this.duration);
                animate2.finished.then(() => {
                  if (index < keyframes.length - 1) {
                    index += 1;
                    recurseCall();
                  } else {
                    keyframes = [];
                    res();
                  }
                });
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
            let selector2 = cf.selector, el2;
            switch (true) {
              case !!(selector2.val && selector2.attr):
                {
                  el2 = this.html.querySelectorIncluded(`[${selector2.attr}=${selector2.val}]`, selector2.attr, selector2.val);
                }
                break;
              case !!(selector2.val && !selector2.attr):
                {
                  let attr = selector2.val.match(new RegExp(`^[.]`)) ? "class" : selector2.val.match(new RegExp(`^[#]`)) ? "id" : null;
                  let val = attr ? selector2.val.slice(1) : null;
                  el2 = this.html.querySelectorIncluded(selector2.val, attr, val);
                }
                break;
            }
            ;
            cf.element = el2;
            configs.push(cf);
          }
          ;
          return configs;
        }
        dic(name) {
          let coll = {
            slideOutUp: [{
              transform: "translate3d(0,0,0)",
              visibility: "visible",
              opacity: "1"
            }, {
              transform: "translate3d(0,100%,0)",
              visibility: "hidden",
              opacity: "0"
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
              opacity: "1"
            }, {
              transform: "translate3d(0,-100%,0)",
              visibility: "hidden",
              opacity: "0"
            }],
            slideInUp: [{
              transform: "translate3d(0,100%,0)",
              visibility: "hidden",
              opacity: "0"
            }, {
              transform: "translate3d(0,0,0)",
              visibility: "visible",
              opacity: "1"
            }],
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
              opacity: "0"
            }, {
              transform: "translate3d(0,0,0)",
              visibility: "visible",
              opacity: "1"
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
          return coll[name.trim()] || [];
        }
      };
    }
  });

  // src/scripts/persist.js
  var require_persist = __commonJS({
    "src/scripts/persist.js"(exports, module) {
      module.exports = function(dependency) {
        const StorageKit = dependency.StorageKit;
        return class {
          constructor() {
            this.storage = new StorageKit({
              child: "array",
              storage: "session",
              name: "_cake_persistent"
            });
          }
          listen(components) {
            window.addEventListener("DOMContentLoaded", (e) => {
              setTimeout(() => {
                this.storage.getAll().then((result) => {
                  if (result && !result.length)
                    return;
                  for (let r = 0; r < result.length; r++) {
                    let item = result[r];
                    let component3 = components[item];
                    component3.isConnected = false;
                    if (component3) {
                      !component3.isConnected && component3.render.bind(component3)();
                    } else {
                      console.error(`component ${component3} is not found!`);
                    }
                  }
                  ;
                });
              });
            });
          }
          append(name) {
            this.storage.create(name);
          }
          remove(name) {
            this.storage.remove(name);
          }
        };
      };
    }
  });

  // src/scripts/hash.js
  var require_hash = __commonJS({
    "src/scripts/hash.js"(exports, module) {
      module.exports = class {
        constructor(Components) {
          this.Components = Components;
        }
        listen() {
          window.addEventListener("hashchange", (e) => {
            let hit = this.compare(e);
            this.find(hit, this.notify);
          });
        }
        compare(e) {
          let { oldURL, newURL } = e;
          let hit = null;
          if (oldURL.length > newURL.length) {
            let prev = new URL(oldURL).hash.substring(1).split("/");
            let next = new URL(newURL).hash.substring(1).split("/");
            for (let p = 0; p < prev.length; p++) {
              if (!next.includes(prev[p])) {
                hit = prev[p];
                break;
              }
              ;
            }
            ;
          }
          ;
          return hit;
        }
        find(name, cb) {
          if (!name)
            return;
          if (!this.Components[name]) {
            let lk = setInterval(() => {
              if (this.Components[name]) {
                if (this.Components[name].isConnected) {
                  cb(this.Components[name]);
                }
                ;
                clearTimeout(lk);
              }
              ;
            }, 50);
            setTimeout(() => {
              clearTimeout(lk);
            }, 5e3);
          } else {
            if (this.Components[name].isConnected) {
              cb(this.Components[name]);
            }
            ;
          }
          ;
        }
        notify(component3) {
          component3.fire.destroy();
        }
        add(componentName) {
          let hash2 = location.hash;
          if (!hash2.includes(componentName)) {
            location.hash = hash2 + "/" + componentName;
          }
          ;
        }
        remove(componentName) {
          let hash2 = location.hash;
          let removed = hash2.replace(componentName, "");
          location.replace(removed);
        }
      };
    }
  });

  // src/scripts/router.js
  var require_router = __commonJS({
    "src/scripts/router.js"(exports, module) {
      module.exports = function(components, component3) {
        const hooks = [];
        return class {
          constructor(routes) {
            this.route = this.compile(routes);
            this.prev = null;
            this.components = components;
            this.watch();
            this.persist();
            Object.defineProperty(component3.prototype, "$router", {
              configurable: true,
              get: () => {
                return {
                  goTo: this.goTo,
                  ...this.prev
                };
              },
              set(value) {
                return;
              }
            });
          }
          goTo(hash2, params) {
            if (params) {
              let p = "";
              for (let key in params) {
                p += `${key}=${params[key]}&`;
              }
              ;
              params = p;
              window.location.hash = `!/${hash2}?${params}`;
            } else {
              window.location.hash = `!/${hash2}`;
            }
          }
          persist() {
            if (!document.hasRouterPersist) {
              document.addEventListener("DOMContentLoaded", (e) => {
                this.navigate(true);
              });
              document.hasRouterPersist = true;
            }
            ;
          }
          watch() {
            if (!window.hasRouterPop) {
              window.onpopstate = (e) => {
                this.clear().then(() => {
                  this.navigate();
                });
              };
              window.hasRouterPop = true;
            }
            ;
          }
          compile(routes) {
            let con = {};
            for (let key in routes) {
              const len = key.length;
              let regex = String(key);
              regex = regex.slice(1);
              regex = regex.split("/");
              regex = regex.map((item, index) => {
                let param = item.includes(":");
                let a = "";
                index == 0 ? a += "^/" : a += "/";
                param ? a += "(([^/#?]+?))" : a += item;
                index == len - 1 ? a += "/?$" : a += "";
                if (param) {
                  const paramKey = item.replace(":", "");
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
                con[key] = {
                  params: con[key].params,
                  regex: new RegExp(regex.join("")),
                  ...routes[key]
                };
              } else {
                con[key] = {
                  regex: new RegExp(regex.join("")),
                  ...routes[key]
                };
              }
            }
            ;
            con.length = Object.keys(routes).length;
            con.keys = Object.keys(routes);
            return con;
          }
          navigate(ispersist) {
            let hash2 = window.location.hash, scheme;
            if (hash2) {
              scheme = hash2.includes("#!/") ? 2 : hash2.includes("#/") ? 1 : null;
              hash2 = hash2.slice(scheme);
            } else {
              hash2 = "/";
              scheme = true;
            }
            ;
            if (!scheme) {
              return;
            }
            ;
            const url = new URL(`http://localhost${hash2}`);
            const { search, pathname: path } = url;
            const keys = this.route.keys;
            const state = {};
            if (search) {
              new URLSearchParams(search).forEach((value, key) => {
                state[key] = value;
              });
            }
            ;
            for (let i = 0; i < keys.length; i++) {
              const route = this.route[keys[i]];
              const { regex, components: components2, params, name } = route;
              if (params) {
                let _path = String(path);
                _path = _path.slice(1);
                _path = _path.split("/");
                Object.entries(params).forEach((param) => {
                  const [key, value] = param;
                  if (_path[value]) {
                    state[key] = _path[value];
                  }
                  ;
                });
              }
              ;
              const test = regex.test(path);
              console.log(147, test, path);
              if (test) {
                this.prev = { components: components2, state, path, name };
                break;
              }
              ;
            }
            ;
            if (this.prev) {
              const { components: components2, state: state2, path: path2, name } = this.prev;
              try {
                return Promise.all(ispersist ? [Promise.resolve()] : hooks.map((subscribe2) => {
                  return subscribe2();
                })).then(() => {
                  if (components2.length) {
                    return Promise.all(components2.map((item) => {
                      return this.components[item].render({ emit: { data: this.prev } });
                    }));
                  }
                });
              } catch (err) {
                throw new Error(`some of the component in ${JSON.stringify(components2)} in path ${path2} of router is not found, make sure the it is created`);
              }
            }
          }
          static pushState(data2, notused, path) {
            window.history.pushState(data2, notused, path);
            let promise = Promise.resolve();
            if (this.prev) {
              const { components: _components, state, path: path2, name } = this.prev;
              promise = Promise.all(_components.map((item) => {
                return components[item].fire.destroy();
              }));
            }
            ;
            return promise.then(() => {
              return this.navigate();
            });
          }
          clear() {
            let promise = Promise.resolve();
            if (this.prev) {
              const { components: _components, state, path, name } = this.prev;
              promise = Promise.all(_components.map((item) => {
                if (components[item].fire.destroy) {
                  return components[item].fire.destroy();
                } else {
                  console.error(`there is no destroy handler in "${item}" component`);
                  return Promise.resolve();
                }
              }));
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
        };
      };
    }
  });

  // src/scripts/form.js
  var require_form = __commonJS({
    "src/scripts/form.js"(exports, module) {
      module.exports = function() {
        let component3 = this;
        this.$form = {};
        this.$form.options = (obj, isgroup) => {
          let { options, params } = obj;
          if (!options) {
            options = [];
          }
          ;
          let prom = Promise.all(options.map((item) => {
            let { control, field, tbl, src, schema } = item;
            return component3.fire(src, { tbl, field, params }).then((opts) => {
              opts = opts || [];
              item.query = opts;
              opts = opts.map((item2) => {
                return schema(item2);
              });
              let scheme = schema({});
              for (let key in scheme) {
                if (scheme.hasOwnProperty(key)) {
                  scheme[key] = "";
                }
                ;
              }
              ;
              opts.unshift(scheme);
              item.options = opts;
              return item;
            });
          })).then((result) => {
            if (isgroup) {
              return result.reduce((accu, iter) => {
                let { type, control } = iter;
                if (!type) {
                  type = "select";
                }
                ;
                if (!accu[type]) {
                  accu[type] = {};
                }
                ;
                if (!accu[type][control]) {
                  accu[type][control] = iter;
                }
                ;
                return accu;
              }, {});
            } else {
              return result.reduce((accu, iter) => {
                accu[iter.control] = iter.options;
                return accu;
              }, {});
            }
            ;
          }).catch((err) => {
            console.error(err);
          });
          return prom;
        };
        this.$form.plot = (config) => {
          let { data: data2, container } = config;
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
              let el2 = els[e];
              let name = el2.name;
              let value = data2[name];
              let r = callback(el2, value, e);
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
          query(container, "INPUT.input", function(el2, value) {
            if (value != void 0) {
              if (el2.type == "date") {
                value = new Date(value) == "Invalid Date" ? "" : new Date(value).toJSON().split("T")[0];
                el2.value = value;
              } else {
                el2.value = value;
              }
            }
            ;
          });
          setTimeout(() => {
            query(container, "SELECT.input:not(.cake-template)", function(select, value) {
              query(select, "OPTION:not(.cake-template)", function(option, _value, index) {
                if (option) {
                  if (option.value == value) {
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
      };
    }
  });

  // src/scripts/scope.js
  var require_scope = __commonJS({
    "src/scripts/scope.js"(exports, module) {
      module.exports = function(dependency) {
        const StorageKit = dependency.StorageKit;
        const _hooks = {};
        class Scope {
          constructor(name) {
            this.name = name;
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
          install(component3) {
            this.session = new StorageKit({
              child: "object",
              storage: "session",
              name: "_cake_scope_cf"
            });
            this.memory = new StorageKit({
              child: "object",
              storage: "object",
              name: "_cake_scope_cf"
            });
          }
          notifier(component3, obj) {
            const { value, bind: bind2 } = obj;
            if (!this.reactiveData[component3]) {
              this.reactiveData[component3] = {};
            }
            ;
            this.reactiveData[component3][bind2] = value;
            return this.set(bind2, value);
          }
          getInputData(type = "json", _component) {
            let component3 = _component || this.name;
            console.log(this.reactiveData);
            let data2 = JSON.parse(JSON.stringify(this.reactiveData[component3]));
            for (let key in data2) {
              let value = data2[key];
              data2[key] = this.sanitize(value);
            }
            ;
            if (type == "json") {
              return data2;
            } else if (type == "formdata") {
              const formData = new FormData();
              for (let key in data2) {
                let value = data2[key];
                formData.append(key, value);
              }
              ;
              return formData;
            }
            ;
          }
          hook(component3, bind2, callback) {
            if (!_hooks[component3]) {
              _hooks[component3] = {};
            }
            ;
            if (!_hooks[component3][bind2]) {
              _hooks[component3][bind2] = [];
            }
            ;
            _hooks[component3][bind2].push(callback);
          }
          get(key, quick = false) {
            let pkey = this.pKeys[key];
            if (!pkey) {
              return Promise.reject(`${key} is not found`);
            }
            if (quick) {
              return this.memory.get(pkey);
            } else {
              return this.session.get(pkey);
            }
            ;
          }
          set(key, value) {
            let pkey = `${this.name}-${key}`;
            let notify = this.notify;
            let name = this.name;
            let prevValue = null;
            this.pKeys[key] = pkey;
            return new Promise(async (res, rej) => {
              prevValue = await this.get(key, true);
              if (key != "password") {
                this.session.createOrUpdate(pkey, value);
              }
              ;
              res();
            }).then(() => {
              this.memory.createOrUpdate(pkey, value);
              const hooks = _hooks[this.name];
              if (hooks) {
                const callbacks = hooks[key];
                if (callbacks) {
                  callbacks.forEach((cb) => {
                    cb(value);
                  });
                }
                ;
              }
              ;
              return Promise.all(notify.map((cb) => {
                return cb(key, value, prevValue, name);
              }));
            });
          }
        }
        return Scope;
      };
    }
  });

  // src/scripts/attributes.js
  var require_attributes = __commonJS({
    "src/scripts/attributes.js"(exports, module) {
      module.exports = function(dependency) {
        const StorageKit = dependency.StorageKit;
        const Templating = dependency.Templating;
        const Utils = dependency.Utils;
        function Attrib() {
          this.uiid = 0;
          this.notify = {};
          this.st = {};
          this.cacheStatic = [];
          this.store = new StorageKit({
            child: "object",
            storage: "session",
            name: "_cake_component_cf"
          });
        }
        ;
        Attrib.prototype._getConfig = function(type, prop, newValue, prevValue, component3) {
          if (newValue == null) {
            return [];
          }
          ;
          if (newValue == prevValue && type != "bind") {
            return [];
          }
          ;
          let id2 = `${type}-${prop}-${component3}`;
          let loc = Object.cache._getConfig;
          if (!loc) {
            loc = Object.cache._getConfig = {};
          }
          ;
          if (!loc[id2]) {
            var st = component3 ? (() => {
              let config = this.st[component3] && this.st[component3][type];
              if (config && config.length) {
                return config.filter((item) => {
                  let { bind: bind2 } = item || { bind: false };
                  return bind2 == prop || false;
                });
              } else {
                return [];
              }
              ;
            })() : (() => {
              let ctx = [];
              for (let component4 in this.st) {
                if (this.st.hasOwnProperty(component4)) {
                  let s = this.st[component4];
                  if (s[type]) {
                    for (let i = 0; i < s[type].length; i++) {
                      let item = s[type][i];
                      if (item.bind == prop) {
                        ctx.push({ ...item, component: component4 });
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
              return ctx;
            })();
            loc[id2] = st;
          }
          ;
          return loc[id2];
        };
        Attrib.prototype._notifyToggle = function(prop, newValue, prevValue, component3, html) {
          html = html || document;
          let subscribe2 = this._getConfig("toggle", prop, newValue, prevValue);
          if (!subscribe2) {
            return;
          }
          ;
          html = html || document;
          for (let s = 0; s < subscribe2.length; s++) {
            let sub = subscribe2[s];
            if (!sub)
              continue;
            let { sel, bind: bind2, value, ops } = sub;
            let el2 = html.querySelector(`[data-toggle=${sel}]`);
            if (value == prevValue) {
              el2 && el2.classList.remove("is-active");
            }
            if (value == newValue) {
              if (el2) {
                if (el2.classList.contains("is-active")) {
                  el2.classList.remove("is-active");
                }
                ;
                el2 && el2.classList.add("is-active");
              }
              ;
            }
            ;
          }
          ;
        };
        Attrib.prototype._notifySwitch = function(prop, newValue, prevValue, component3, html) {
          html = html || document;
          let configs = this._getConfig("switch", prop, newValue, prevValue, component3);
          if (!configs.length)
            return;
          let forIf = {};
          for (let c = 0; c < configs.length; c++) {
            let config = configs[c];
            let { bind: bind2, sel, map, cases } = config;
            let parent = html.querySelectorAll(`[data-switch-slot=${sel}]`);
            for (let n = 0; n < newValue.length; n++) {
              let row = newValue[n];
              let slot = parent[n];
              let prop2 = row[map];
              if (prop2 != void 0) {
                let _case = null;
                for (let c2 = 0; c2 < cases.length; c2++) {
                  let test = cases[c2].bind.includes(prop2);
                  if (test) {
                    _case = cases[c2];
                    break;
                  }
                  ;
                }
                ;
                if (_case) {
                  let { _id, bind: bind3 } = _case;
                  let hit = document.querySelector(`[data-case=${sel}-${_id}]`);
                  if (hit && hit.toString().includes("Element")) {
                    hit = hit.cloneNode(true);
                    let forChildren = hit.querySelectorAll("[data-for-auto=true]");
                    for (let f = 0; f < forChildren.length; f++) {
                      let ch = forChildren[f];
                      ch.dataset.for = `${ch.dataset.for}-active`;
                    }
                    ;
                    hit.removeAttribute("data-case");
                    let template = new Templating(row, hit, false).createElement();
                    if (hit.dataset.if) {
                      let sel2 = hit.dataset.if;
                      let binded = template.dataset.ifBind;
                      let component4 = config.component;
                      let { bind: bind4 } = this.getWatchItemsBySel(component4, "if", sel2);
                      if (sel2) {
                        if (!forIf[bind4]) {
                          forIf[bind4] = {};
                        }
                        ;
                        forIf[bind4][binded] = row;
                      }
                    }
                    template.classList.remove("cake-template");
                    slot.replaceWith(template);
                  }
                }
              }
            }
            ;
          }
          ;
          for (let bind2 in forIf) {
            if (forIf.hasOwnProperty(bind2)) {
              this._notifyIf(bind2, forIf[bind2]);
            }
            ;
          }
          ;
        };
        Attrib.prototype._notifyBind = function(prop, newValue, prevValue, component3, html) {
          html = html || document;
          let configs = this._getConfig("bind", prop, newValue, prevValue, component3);
          if (!configs.length)
            return;
          for (let c = 0; c < configs.length; c++) {
            let config = configs[c];
            let { attr, bind: bind2, sel } = config;
            let attrHyphen = attr.toHyphen();
            if (prop == bind2) {
              let els = html.querySelectorAll(`[data-bind=${sel}]`);
              for (let p = 0; p < els.length; p++) {
                let el2 = els[p];
                if (attr == "class" || attr == "className") {
                  if (el2.classList.length) {
                    Utils.loopStringSplitSpace(prevValue, function(cls) {
                      el2.classList.remove(cls);
                    });
                    Utils.loopStringSplitSpace(newValue, function(cls) {
                      el2.classList.add(cls);
                    });
                  } else {
                    Utils.loopStringSplitSpace(newValue, function(cls) {
                      el2.classList.add(cls);
                    });
                  }
                  ;
                } else {
                  el2.setAttribute(attrHyphen, newValue);
                  el2[attr] = newValue;
                }
                ;
              }
              ;
            }
            ;
          }
          ;
        };
        Attrib.prototype._notifyInput = function(prop, newValue, prevValue, component3, html) {
          html = html || document;
          let configs = this._getConfig("input", prop, newValue, prevValue, component3);
          if (!configs.length)
            return;
          for (let c = 0; c < configs.length; c++) {
            let config = configs[c];
            let { attr, bind: bind2, sel } = config;
            let attrHyphen = attr.toHyphen();
            if (prop == bind2) {
              let els = html.querySelectorAll(`[data-input=${sel}]`);
              for (let p = 0; p < els.length; p++) {
                let el2 = els[p];
                if (attr == "className") {
                  if (prevValue) {
                    if (newValue) {
                      el2.classList.replace(prevValue, newValue);
                    } else {
                      el2.classList.remove(prevValue);
                    }
                    ;
                  } else {
                    el2.classList.add(newValue);
                  }
                  ;
                } else {
                  el2.setAttribute(attrHyphen, newValue);
                  el2[attr] = newValue;
                }
                ;
              }
              ;
            }
            ;
          }
          ;
        };
        Attrib.prototype._notifyFor = function(prop, newValue, prevValue, component3, html) {
          let configs = this._getConfig("for", prop, newValue, prevValue, component3);
          if (!configs.length)
            return;
          let vItems = [];
          for (let c = 0; c < configs.length; c++) {
            let { bind: bind2, sel, iter, ins, component: component4, cleaned } = configs[c];
            html = html || document;
            if (component4) {
              html = Cake.Components[component4].html;
            }
            ;
            let target = html.querySelectorIncluded(`[data-for-template=${sel}]`);
            let cloned = target.cloneNode(true);
            ;
            (() => {
              let switchs = cloned && cloned.querySelectorAll(`[data-switch]`);
              if (switchs && switchs.length) {
                let l2 = switchs.length, i = -1;
                while (++i < l2) {
                  let sw = switchs[i];
                  let parent = sw.parentElement;
                  let div = document.createElement("div");
                  div.dataset.switchSlot = sw.dataset.switch;
                  parent.replaceChild(div, sw);
                }
                ;
                switchs = null;
              }
              ;
            })();
            ;
            (() => {
              let template = cloned;
              let i = -1;
              l = newValue.length;
              newValue = newValue.map((item) => {
                for (let key in item) {
                  if (item.hasOwnProperty(key)) {
                    item[`${iter}.${key}`] = item[key];
                  }
                  ;
                }
                ;
                return item;
              });
              newValue.forEach((item) => {
                let create = new Templating(item, template, false).createElement();
                create.style.removeProperty("display");
                create.classList.remove("cake-template");
                create.removeAttribute("data-for-template");
                target.insertAdjacentElement("beforebegin", create);
                let safeSrc = create.querySelectorAll("[data-src]");
                if (safeSrc) {
                  for (let s = 0; s < safeSrc.length; s++) {
                    let el2 = safeSrc[s];
                    el2.src = el2.dataset.src;
                    el2.removeAttribute("data-src");
                  }
                  ;
                }
                ;
              });
              if (cleaned) {
                target.remove();
              }
              ;
            })();
          }
          ;
          this._notifyForAuto({ configs, newValue });
        };
        Attrib.prototype._notifyForAuto = function(obj) {
          let { vItems, configs, newValue } = obj;
          for (let o2 = 0; o2 < configs.length; o2++) {
            let config = configs[o2];
            let children = config.children;
            if (!children)
              continue;
            let childCf = [];
            for (let c = 0; c < children.length; c++) {
              let child = children[c];
              if (!this.st[config.component]) {
                continue;
              }
              let cf = this.st[config.component].for.find((item) => {
                return item.sel == child;
              });
              cf && childCf.push(new Promise((res) => {
                let { bind: bind2, sel, iter, ins } = cf;
                setTimeout(() => {
                  let targets = document.querySelectorAll(`[data-for=${sel}-active]`);
                  for (let t = 0; t < targets.length; t++) {
                    let target = targets[t];
                    let prop = target.dataset.forBindKey;
                    let value = target.dataset.forBindVal;
                    let props = newValue.find((item) => {
                      return item[prop] == value;
                    });
                    let pr = bind2.split(".")[bind2.split(".").length - 1];
                    let datas = props[pr].length && props[pr].map((item) => {
                      if (item instanceof Object) {
                        return item;
                      } else {
                        return { [iter]: item };
                      }
                      ;
                    });
                    if (datas) {
                      for (let d = 0; d < datas.length; d++) {
                        let data2 = datas[d];
                        let template = target.cloneNode(true);
                        let create = new Templating(data2, template, false).createElement();
                        create.style.removeProperty("display");
                        create.classList.remove("cake-template");
                        create.removeAttribute("data-for-template");
                        fragment.append(create);
                        target.insertAdjacentElement("beforebegin", create);
                      }
                      ;
                    }
                    ;
                    if (target.parentElement.tagName == "SELECT") {
                      target.parentElement.selectedIndex = 0;
                    }
                    ;
                  }
                  ;
                });
              }));
            }
            ;
          }
          ;
        };
        Attrib.prototype._notifyForUpdate = function(prop, newValue, prevValue, component3, html) {
          html = html || document;
          let configs = this._getConfig("forUpdate", prop, newValue, prevValue, component3);
          if (!configs.length)
            return;
          for (let c = 0; c < configs.length; c++) {
            let { bind: bind2, sel, iter, ins } = configs[c];
            for (let o2 in newValue) {
              if (newValue.hasOwnProperty(o2)) {
                let targets = document.querySelectorAll(`[data-for-bind-val=${o2}]`);
                for (let t = 0; t < targets.length; t++) {
                  let target = targets[t];
                  let binded = target.dataset.forBindVal;
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
                      let item = dataForIteration[i];
                      let create = new Templating(item, template, false).createElement();
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
        };
        Attrib.prototype._notifyClass = function(prop, newValue, prevValue, component3, html) {
          html = html || document;
          let configs = this._getConfig("class", prop, newValue, prevValue, component3);
          if (!configs.length)
            return;
          let removeWhiteSpace = function(str) {
            return str.split(" ").join("");
          };
          let cache = {};
          for (let c = 0; c < configs.length; c++) {
            let config = configs[c];
            let { hasNegate, bind: bind2, testVal, className, ops, sel } = config;
            bind2 = removeWhiteSpace(bind2);
            if (prop == bind2) {
              if (!cache[sel]) {
                cache[sel] = html.querySelectorAll(`[data-class=${sel}]:not(.cake-template)`);
              }
              let els = cache[sel];
              for (let p = 0; p < els.length; p++) {
                let el2 = els[p];
                let test = false;
                if (ops) {
                  test = Utils.logTest(newValue, ops, testVal);
                  hasNegate && (test = !test);
                } else if (hasNegate) {
                  test = !newValue;
                } else {
                  test = !!newValue;
                }
                ;
                if (test) {
                  Utils.loopStringSplitSpace(className, function(cls) {
                    if (!el2.classList.contains(cls)) {
                      el2.classList.add(cls);
                    }
                  });
                } else {
                  Utils.loopStringSplitSpace(className, function(cls) {
                    if (el2.classList.contains(cls)) {
                      el2.classList.remove(cls);
                    }
                  });
                }
                ;
              }
              ;
            }
            ;
          }
          ;
        };
        Attrib.prototype._notifyAttr = function(prop, newValue, prevValue, component3, html) {
          html = html || document;
          let configs = this._getConfig("attr", prop, newValue, prevValue, component3);
          if (!configs.length)
            return;
          let removeWhiteSpace = function(str) {
            return !str ? str : str.split(" ").join("");
          };
          let cache = {};
          for (let c = 0; c < configs.length; c++) {
            let config = configs[c];
            let { hasNegate, bind: bind2, testVal, attr, ops, sel, attrkey, attrvalue } = config;
            bind2 = removeWhiteSpace(bind2);
            attr = removeWhiteSpace(attr);
            if (prop == bind2) {
              if (!cache[sel]) {
                cache[sel] = html.querySelectorAll(`[data-attr=${sel}]:not(.cake-template)`);
              }
              let els = cache[sel];
              for (let p = 0; p < els.length; p++) {
                let el2 = els[p];
                let test = false;
                if (ops) {
                  test = Utils.logTest(newValue, ops, testVal);
                  hasNegate && (test = !test);
                } else if (hasNegate) {
                  test = !newValue;
                } else {
                  test = !!newValue;
                }
                ;
                if (test) {
                  el2.removeAttribute(attrkey);
                } else {
                  if (attrvalue) {
                    el2.setAttribute(attrkey, attrvalue);
                  }
                }
                ;
              }
              ;
            }
            ;
          }
          ;
        };
        Attrib.prototype._notifyIf = function(prop, newValue, prevValue, component3, html) {
          html = html || document;
          let configs = this._getConfig("if", prop, newValue, prevValue, component3);
          if (!configs.length)
            return;
          let cache = {};
          for (let c = 0; c < configs.length; c++) {
            let config = configs[c];
            let { attr, bind: bind2, sel, testval, _true, _false, ops, hasNegate } = config;
            let attrHyphen = attr.toHyphen();
            let trueNotIgnore = _true != "null";
            let falseNotIgnore = _false != "null";
            if (prop == bind2) {
              if (!cache[sel]) {
                cache[sel] = html.querySelectorAll(`[data-if=${sel}]:not(.cake-template)`);
              }
              let els = cache[sel];
              for (let p = 0; p < els.length; p++) {
                let el2 = els[p];
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
                          el2.classList.remove(cls);
                        });
                        trueClasses2.forEach((cls) => {
                          el2.classList.add(cls);
                        });
                      } else {
                        trueClasses2.forEach((cls) => {
                          if (!el2.classList.contains(cls)) {
                            el2.classList.add(cls);
                          }
                          ;
                        });
                      }
                      ;
                    } else {
                      el2.setAttribute(attr, _true);
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
                          el2.classList.remove(cls);
                        });
                        falseClasses.forEach((cls) => {
                          el2.classList.add(cls);
                        });
                      } else {
                        trueClasses.forEach((cls) => {
                          if (!el2.classList.contains(cls)) {
                            el2.classList.add(cls);
                          }
                          ;
                        });
                      }
                      ;
                    } else {
                      el2.setAttribute(attr, _false);
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
        };
        Attrib.prototype.notifier = function(prop, newValue, prevValue, component3) {
          let val = newValue;
          if (Utils.isObject(val)) {
            val = JSON.parse(JSON.stringify(newValue));
          }
          ;
          return new Promise((res) => {
            this._notifyFor(prop, val, prevValue, component3);
            res();
          }).then(() => {
            return this._notifyForUpdate(prop, val, prevValue, component3);
          }).then(() => {
            return this._notifySwitch(prop, val, prevValue, component3);
          }).then(() => {
            return this._notifyToggle(prop, val, prevValue, component3);
          }).then(() => {
            return this._notifyBind(prop, val, prevValue, component3);
          }).then(() => {
            return this._notifyInput(prop, val, prevValue, component3);
          }).then(() => {
            return this._notifyIf(prop, val, prevValue, component3);
          }).then(() => {
            return this._notifyClass(prop, val, prevValue, component3);
          }).then(() => {
            return this._notifyAttr(prop, val, prevValue, component3);
          });
        };
        Attrib.prototype.registerNotifier = function(component3, fn2) {
          if (!this.notify[component3]) {
            this.notify[component3] = [];
          }
          ;
          this.notify[component3].push(fn2);
        };
        Attrib.prototype.getEventTarget = function(component3) {
          let id2 = `${component3}`;
          let loc = Object.cache.getEventTarget;
          if (!loc) {
            loc = Object.cache.getEventTarget = {};
          }
          ;
          if (!loc[id2]) {
            let cf = this.st[component3];
            loc[id2] = cf && (cf?.evt ?? []) || [];
          }
          ;
          return loc[id2];
        };
        Attrib.prototype.getRouterTarget = function(component3) {
          let id2 = `${component3}`;
          let loc = Object.cache.getRouterTarget;
          if (!loc) {
            loc = Object.cache.getRouterTarget = {};
          }
          ;
          if (!loc[id2]) {
            let cf = this.st[component3];
            loc[id2] = cf && (cf?.router ?? []) || [];
          }
          ;
          return loc[id2];
        };
        Attrib.prototype.getWatchItems = function(component3) {
          let id2 = `${component3}`;
          let loc = Object.cache.getWatchItems;
          if (!loc) {
            loc = Object.cache.getWatchItems = {};
          }
          ;
          if (!loc[id2]) {
            let st = this.st[component3] || {};
            let wt = /* @__PURE__ */ new Set();
            for (let type in st) {
              if (st.hasOwnProperty(type)) {
                let tst = st[type];
                for (let t = 0; t < tst.length; t++) {
                  let item = tst[t];
                  let { bind: bind2 } = item;
                  if (bind2) {
                    wt.add(bind2);
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
            loc[id2] = [...wt];
          }
          ;
          return loc[id2];
        };
        Attrib.prototype.getWatchItemsByType = function(component3, type) {
          let id2 = `${component3}-${type}`;
          let loc = Object.cache.getWatchItemsByType;
          if (!loc) {
            loc = Object.cache.getWatchItemsByType = {};
          }
          ;
          if (!loc[id2]) {
            let st = this.st[component3] || {};
            let tst = st[type] || [];
            let wt = /* @__PURE__ */ new Set();
            for (let t = 0; t < tst.length; t++) {
              let item = tst[t];
              let { bind: bind2 } = item;
              switch (!!bind2) {
                case true:
                  {
                    wt.add(bind2);
                  }
                  break;
                default:
                  {
                    switch (true) {
                      case (type == "animate" || type == "toggle"): {
                        if (wt.constructor.name = "Set") {
                          wt = [];
                        }
                        ;
                        wt.push(item);
                      }
                    }
                    ;
                  }
                  ;
              }
              ;
            }
            ;
            loc[id2] = [...wt];
          }
          ;
          return loc[id2];
        };
        Attrib.prototype.getWatchItemsBySel = function(component3, type, sel) {
          let id2 = `${component3}-${type}-${sel}`;
          let loc = Object.cache.watchItemsBySel;
          if (!loc) {
            loc = Object.cache.watchItemsBySel = {};
          }
          ;
          if (!loc[id2]) {
            let array = this.st[component3][type];
            let find = array.find((item) => {
              return item.sel == sel;
            });
            loc[id2] = find ? find : false;
          }
          ;
          return loc[id2];
        };
        Attrib.prototype._activateReactive = (component3) => {
        };
        Attrib.prototype._register = function(store, f, s, obj) {
          switch (true) {
            case !store[f]:
              {
                store[f] = {};
              }
              ;
            case !store[f][s]:
              {
                store[f][s] = [];
              }
              ;
            default:
              {
                store[f][s].push(obj);
              }
              ;
              break;
          }
          ;
        };
        Attrib.prototype._static = function(component3) {
          return function(qs, isStatic) {
            let els = [];
            for (let t = 0; t < qs.length; t++) {
              let el2 = qs[t];
              switch (isStatic) {
                case false:
                  {
                    els.push(el2);
                  }
                  ;
                  break;
                case true:
                  {
                    let dComponent = el2.closest("[data-component]");
                    dComponent = dComponent && dComponent.dataset.component;
                    switch (dComponent == component3) {
                      case true:
                        {
                          els.push(el2);
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
        Attrib.prototype._compileEvents = function(events, component3, isStatic) {
          return new Promise((res) => {
            if (!events.length) {
              res();
              return;
            }
            ;
            let els = this._static(component3)(events, isStatic);
            if (!els.length) {
              res();
              return;
            }
            for (let e = 0; e < els.length; e++) {
              let id2 = `cke${this.uiid}`;
              let el2 = els[e];
              let splitted = el2.dataset.event.split(" ").join("").split(",");
              for (let s = 0; s < splitted.length; s++) {
                let [event, cb] = splitted[s].split(":");
                cb = cb || event;
                this._register(this.st, component3, "evt", { event, sel: id2, cb });
                el2.dataset.event = id2;
                this.uiid++;
              }
            }
            ;
            res();
          });
        };
        Attrib.prototype._compileToggle = function(toggles, component3, isStatic) {
          return new Promise((res) => {
            if (!toggles.length) {
              res();
              return;
            }
            let els = this._static(component3)(toggles, isStatic);
            if (!els.length) {
              res();
              return;
            }
            let c = {};
            for (let t = 0; t < toggles.length; t++) {
              let id2 = `ckt${this.uiid}`;
              let el2 = toggles[t];
              let ns = el2.dataset.toggle;
              if (c[ns]) {
                id2 = c[ns];
              }
              ;
              this._register(this.st, component3, "toggle", { sel: id2, name: "ns-" + ns });
              el2.dataset.toggle = id2;
              this.uiid++;
              c[ns] = id2;
            }
            ;
            c = {};
            res();
          });
        };
        Attrib.prototype._compileFor = function(fors, component3, isStatic, el2) {
          return new Promise((res) => {
            let target = el2;
            if (!fors.length) {
              res();
              return;
            }
            ;
            let els = this._static(component3)(fors, isStatic);
            if (!els.length) {
              res();
              return;
            }
            let o2 = {};
            for (let f = 0; f < els.length; f++) {
              let id2 = `ckf${this.uiid}`;
              let el3 = els[f];
              let fr2 = el3.dataset.for;
              let isCleaned = el3.dataset.forCleaned == "true";
              let [a, b, c] = fr2.split(" ");
              el3.style.display = "none";
              el3.classList.add("cake-template");
              el3.dataset.for = id2;
              el3.dataset.forTemplate = id2;
              o2[id2] = { bind: c, sel: id2, iter: a, ins: b, cleaned: isCleaned };
              ++this.uiid;
              if (f != 0) {
                let parent = el3.parentElement && el3.parentElement.closest("[data-for]");
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
                this._register(this.st, component3, "for", o2[key]);
              }
              ;
            }
            ;
            res();
          });
        };
        Attrib.prototype._compileForUpdate = function(fors, component3, isStatic) {
          return new Promise((res) => {
            if (!fors.length) {
              res();
              return;
            }
            ;
            let els = this._static(component3)(fors, isStatic);
            if (!els.length) {
              res();
              return;
            }
            for (let f = 0; f < els.length; f++) {
              let id2 = `ckfu${this.uiid}`;
              let el2 = els[f];
              let fr2 = el2.dataset.forUpdate;
              el2.style.display = "none";
              el2.classList.add("cake-template");
              el2.dataset.forUpdate = id2;
              if (!el2.dataset.for) {
                el2.dataset.forTemplate = id2;
              }
              let [a, b, c] = fr2.split(" ");
              this._register(this.st, component3, "forUpdate", { bind: c, sel: id2, iter: a, ins: b });
              this.uiid++;
            }
            ;
            res();
          });
        };
        Attrib.prototype._compileSwitch = function(switchs, component3, isStatic) {
          return new Promise((res) => {
            if (!switchs.length) {
              res();
              return;
            }
            ;
            let els = this._static(component3)(switchs, isStatic);
            if (!els.length) {
              res();
              return;
            }
            for (let s = 0; s < els.length; s++) {
              let id2 = `cks${this.uiid}`;
              let el2 = els[s];
              let bind2 = el2.dataset.switch, map = "def";
              if (bind2.includes(".")) {
                var [f, ...rest] = el2.dataset.switch.split(".");
                bind2 = f;
                map = rest[0];
              }
              ;
              el2.dataset.switch = id2;
              let cases = el2.querySelectorAll("[data-case]");
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
              this._register(this.st, component3, "switch", { bind: bind2, sel: id2, map, cases: casesId });
              this.uiid++;
            }
            ;
            res();
          });
        };
        Attrib.prototype._compileBind = function(elModels, component3, isStatic) {
          return new Promise((res) => {
            if (!elModels.length) {
              res();
              return;
            }
            ;
            let els = this._static(component3)(elModels, isStatic);
            if (!els.length) {
              res();
              return;
            }
            for (let s = 0; s < els.length; s++) {
              let id2 = `ckm${this.uiid}`;
              let el2 = els[s];
              let model = el2.dataset.bind;
              let gr = model.split(",");
              for (let g = 0; g < gr.length; g++) {
                let val = gr[g].split(" ").join("");
                if (val.includes(":")) {
                  var [attr, bind2] = val.split(":");
                } else {
                  var bind2 = val;
                  var attr = "value";
                }
                ;
                this._register(this.st, component3, "bind", { attr, bind: bind2, sel: id2 });
              }
              this.uiid++;
              el2.dataset.bind = id2;
            }
            ;
            res();
          });
        };
        Attrib.prototype._compileAnimate = function(anims, component3, isStatic) {
          return new Promise((res) => {
            if (!anims.length) {
              res();
              return;
            }
            ;
            let els = this._static(component3)(anims, isStatic);
            if (!els.length) {
              res();
              return;
            }
            for (let s = 0; s < els.length; s++) {
              let id2 = `cka${this.uiid}`;
              let el2 = els[s];
              let anim = el2.dataset.animate;
              anim = anim.split(" ").join("");
              let o2 = {};
              let split = anim.split(",");
              for (let a = 0; a < split.length; a++) {
                let item = split[a];
                let [ctx, anims2] = item.split(":");
                if (ctx == "ns") {
                  o2.ns = anims2;
                  break;
                } else {
                  o2[ctx] = { keyframes: anims2.split("-") };
                }
                ;
              }
              ;
              o2.selector = { attr: "data-animate", val: id2 };
              this._register(this.st, component3, "animate", o2);
              this.uiid++;
              el2.dataset.animate = id2;
            }
            ;
            res();
          });
        };
        Attrib.prototype._compileIf = function(ifs, component3, isStatic) {
          return new Promise((res) => {
            if (!ifs.length) {
              res();
              return;
            }
            ;
            let els = this._static(component3)(ifs, isStatic);
            if (!els.length) {
              res();
              return;
            }
            const regex = new RegExp("<|>|===|==|!==|!=");
            for (let s = 0; s < els.length; s++) {
              let id2 = `ci${this.uiid}`;
              let el2 = els[s];
              let _if = el2.dataset.if;
              let gr = _if.split(",");
              for (let g = 0; g < gr.length; g++) {
                let val = gr[g];
                let attr = val.substring(0, val.indexOf("="));
                let exp = val.substring(val.indexOf("=") + 1, val.length);
                exp = exp.split(new RegExp("[()]")).join("");
                let [test, r] = exp.split("?");
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
                let [_true, _false] = r.split(":");
                this._register(this.st, component3, "if", { hasNegate, attr, ops, bind: bind2, testval: testVal || null, _true, _false, sel: id2 });
              }
              this.uiid++;
              el2.dataset.if = id2;
            }
            ;
            res();
          });
        };
        Attrib.prototype._compileClass = function(cls, component3, isStatic) {
          return new Promise((res) => {
            if (!cls.length) {
              res();
              return;
            }
            ;
            let els = this._static(component3)(cls, isStatic);
            if (!els.length) {
              res();
              return;
            }
            let regex = new RegExp("<|>|===|==|!==|!=");
            for (let s = 0; s < els.length; s++) {
              let id2, el2, cl, hasRegularLog2, hasNegate, bindVal, ops, testVal;
              id2 = `cc${this.uiid}`;
              el2 = els[s];
              cl = el2.dataset.class;
              let [test, className] = cl.split("&&");
              test = test.trim();
              className = className.trim();
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
              if (hasNegate) {
                hasNegate && (bind = bind.slice(1));
              }
              ;
              this._register(this.st, component3, "class", { hasNegate, bind, testVal, className, ops, sel: id2 });
              this.uiid++;
              el2.dataset.class = id2;
            }
            ;
            res();
          });
        };
        Attrib.prototype._compileAttr = function(attrs, component3, isStatic) {
          return new Promise((res) => {
            if (!attrs.length) {
              res();
              return;
            }
            ;
            let els = this._static(component3)(attrs, isStatic);
            if (!els.length) {
              res();
              return;
            }
            let regex = new RegExp("<|>|===|==|!==|!=");
            for (let s = 0; s < els.length; s++) {
              let id2, el2, cl, hasRegularLog2, hasNegate, bindVal, ops, testVal;
              id2 = `cre${this.uiid}`;
              el2 = els[s];
              cl = el2.dataset.attr;
              let [test, attrPair] = cl.split("&&");
              attrPair = attrPair.trim();
              let [attrkey, attrvalue] = attrPair.split("=");
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
              if (hasNegate) {
                hasNegate && (bind = bind.slice(1));
              }
              ;
              this._register(this.st, component3, "attr", { hasNegate, bind, testVal, attrkey, attrvalue, ops, sel: id2 });
              this.uiid++;
              el2.dataset.attr = id2;
            }
            ;
            res();
          });
        };
        Attrib.prototype._compileRouter = function(router2, component3, isStatic) {
          return new Promise((res) => {
            if (!router2.length) {
              res();
              return;
            }
            ;
            let els = this._static(component3)(router2, isStatic);
            if (!els.length) {
              res();
              return;
            }
            for (let s = 0; s < els.length; s++) {
              let id2 = `rt${this.uiid}`;
              let el2 = els[s];
              let value = el2.dataset.routerLink;
              this._register(this.st, component3, "router", { value, sel: id2 });
              this.uiid++;
              el2.dataset.routerLink = id2;
            }
            ;
            res();
          });
        };
        Attrib.prototype._compileInput = function(elModels, component3, isStatic) {
          return new Promise((res) => {
            if (!elModels.length) {
              res();
              return;
            }
            ;
            let els = this._static(component3)(elModels, isStatic);
            if (!els.length) {
              res();
              return;
            }
            for (let s = 0; s < els.length; s++) {
              let id2 = `cknt${this.uiid}`;
              let el2 = els[s];
              let nodeType = el2.tagName;
              let model = el2.dataset.input;
              let gr = model.split(",");
              for (let g = 0; g < gr.length; g++) {
                let val = gr[g].split(" ").join("");
                if (val.includes(":")) {
                  var [attr, bind2] = val.split(":");
                } else {
                  var bind2 = val;
                  var attr = "value";
                }
                ;
                this._register(this.st, component3, "input", { attr, bind: bind2, sel: id2, nodeType });
              }
              ;
              this.uiid++;
              el2.dataset.input = id2;
            }
            ;
            res();
          });
        };
        Attrib.prototype.inject = function(el2, component3, isStatic = false) {
          return new Promise((res) => {
            let query = el2.getElementsByDataset("bind", "for", "for-update", "switch", "toggle", "event", "animate", "if", "class", "input", "attr");
            res(query);
          }).then((query) => {
            let r = [];
            let map = {
              "bind": this._compileBind,
              "for": this._compileFor,
              "for-update": this._compileForUpdate,
              "switch": this._compileSwitch,
              "toggle": this._compileToggle,
              "event": this._compileEvents,
              "animate": this._compileAnimate,
              "if": this._compileIf,
              "class": this._compileClass,
              "input": this._compileInput,
              "attr": this._compileAttr
            };
            for (let q in query) {
              if (query.hasOwnProperty(q)) {
                if (query[q].length) {
                  r.push(map[q].apply(this, [query[q], component3, isStatic, el2]));
                }
                ;
              }
              ;
            }
            ;
            console.timeEnd(component3);
            return r.length ? Promise.all(r) : Promise.resolve();
          }).then(() => {
            return Promise.resolve();
          });
        };
        return Attrib;
      };
    }
  });

  // src/scripts/component.js
  var require_component = __commonJS({
    "src/scripts/component.js"(exports, module) {
      module.exports = function(dependency) {
        const Mo = dependency.Mo;
        const Templating = dependency.Templating;
        const Piece = dependency.Piece;
        const Utils = dependency.Utils;
        const pushState = dependency.pushState;
        function Component(name, template, options) {
          this.name = name;
          this.template = template;
          this.options = options;
          this.handlers = options.handlers;
          this.subscribe = options.subscribe;
          this.data = {};
          this.root = options.root;
          this.items = false;
          this.type = options.type || "view";
          this.toggle = options.toggle;
          this.targets = {};
          this.animateOptions = options.animate;
          this.role = options.role;
          this.isReady = false;
          this.await = {};
          this.utils = Utils;
          (name == "app" || options.role == "app") && (() => {
            this.staticComponent = options.static || [];
          })();
          this.container = {};
          this.compile = new Promise((res) => {
            this._bindHandlers();
            res();
          }).then(() => {
            this._bindSubscribe();
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
        ;
        Component.prototype.isStatic = false;
        Component.prototype.hasEvent = false;
        Component.prototype.isConnected = false;
        Component.prototype.destroyed = false;
        Component.prototype.isCreated = false;
        Component.prototype.Subscribe = function(handler) {
          this.$observer.registerSubscribe({
            [handler.listenTo]: {
              [handler.original]: [handler]
            }
          });
        };
        Component.prototype.Node = function(el2) {
          const piece2 = new Piece(el2);
          ;
          return piece2;
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
          for (let component3 in this.subscribe) {
            if (this.subscribe.hasOwnProperty(component3)) {
              subscribe = this.subscribe[component3];
              let isMany = !!subscribe.components && !!subscribe.handler;
              if (isMany) {
                let event = component3;
                let { components, handler } = subscribe;
                handler = handler.bind(this);
                handler.binded = this.name;
                handler.original = event;
                for (let c = 0; c < components.length; c++) {
                  let component4 = components[c];
                  if (!flattened[component4]) {
                    flattened[component4] = {};
                  }
                  ;
                  if (!flattened[component4][event]) {
                    flattened[component4][event] = [];
                  }
                  handler.listenTo = component4;
                  flattened[component4][event].push(handler);
                }
                ;
              } else {
                if (!flattened[component3]) {
                  flattened[component3] = {};
                }
                ;
                let fns = subscribe;
                for (let fn2 in fns) {
                  if (fns.hasOwnProperty(fn2)) {
                    let handler = fns[fn2];
                    let original = handler.name;
                    handler = handler.bind(this);
                    handler.original = original;
                    handler.binded = this.name;
                    handler.listenTo = component3;
                    if (!flattened[component3][original]) {
                      flattened[component3][original] = [];
                    }
                    ;
                    flattened[component3][original].push(handler);
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
        Component.prototype.notifyStaticComponent = function(page, event, data2) {
          Cake.Observer.notify(page, event, data2, this.staticComponent[page], true, this.name);
        };
        Component.prototype.doFor = function(prop, newValue) {
          const getHTML = () => {
            return this.html;
          };
          if (newValue == null)
            return;
          this.$attrib._notifyFor(prop, newValue, null, this.name, getHTML());
        };
        Component.prototype.doToggle = function(prop, newValue) {
          this.$attrib._notifyToggle(prop, newValue, null, this.name, this.html);
        };
        Component.prototype.doSwitch = function(prop, newValue) {
          this.$attrib._notifySwitch(prop, newValue, null, this.name, this.html);
        };
        Component.prototype.doIf = function(prop, newValue) {
          this.$attrib._notifyIf(prop, newValue, null, this.name, this.html);
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
              let { ns: name, selector: selector2 } = at;
              if (at.ns) {
                if (da[name]) {
                  let ns = da[name];
                  Object.assign(at, da[name]);
                  delete da[name];
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
          return new Templating(data2, template, isConvert).createElement();
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
                    this._watchBindedItems();
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
        Component.prototype.render = function(options) {
          let payload = null;
          let { root, multiple, cleaned, emit, static: static2, hashed, data: data2 } = options || {};
          const getValue = (item) => {
            return this.data[item] || this.$scope[item] || null;
          };
          return new Promise((res, rej) => {
            !!root && (this.root = root);
            multiple && this._smoothReset();
            if (!this.isReady) {
              this.createElement().then(() => {
                hashed === true && this.$hash.add(this.name);
                !this.template && this.fire.isConnected && this.fire.isConnected({ emit }, true);
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
                let forItems = this.$attrib.getWatchItemsByType(this.name, "for");
                for (let i = 0; i < forItems.length; i++) {
                  let nv = getValue(forItems[i]);
                  this.doFor(forItems[i], nv);
                }
                ;
                res(this.html);
              }).then((element) => {
                payload = { element, emit };
                this.fire.beforeConnected && this.fire.beforeConnected(payload, true);
                return element;
              }).then((element) => {
                if (this.isStatic) {
                } else {
                  let prom = !data2 ? Promise.resolve() : (() => {
                    return new Promise((res) => {
                      let el2 = element.getElement();
                      el2 = this.$templating(data2, el2);
                      this.html = element = this.Node(el2);
                      this.html.replaceDataSrc();
                      data2 = null;
                      res();
                    });
                  })();
                  return prom.then(() => {
                    element.appendTo(this.root, cleaned);
                    this.isConnected = true;
                  });
                }
              }).then(() => {
                return this.findTarget();
              }).then(() => {
                return this.findContainer();
              }).then(() => {
                let switchItems = this.$attrib.getWatchItemsByType(this.name, "switch");
                for (let i = 0; i < switchItems.length; i++) {
                  this.doSwitch(switchItems[i], getValue(switchItems[i]));
                }
                ;
              }).then(() => {
                return this.addEvent(static2, multiple);
              }).then(() => {
                return this.fire.isConnected && this.fire.isConnected(payload, true);
              }).then(() => {
                return this.$animate("render");
              }).then(() => {
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
        Component.prototype._hardReset = function(name) {
          this.isConnected = false;
          this.$persist.remove(name);
          this.html = this.original.cloneNode();
          return true;
        };
        Component.prototype.reset = function() {
          let animate2 = this.$animate("remove");
          if (animate2 instanceof Promise) {
            return this.await.animateRemove = new Promise((res) => {
              animate2.then(() => {
                return this.html.remove();
              }).then(() => {
                return this._hardReset(this.name);
              }).then(() => {
                res();
              });
            });
          } else {
            return new Promise((res) => {
              this.html.remove(this.name);
              this._hardReset(this.name);
              res();
            });
          }
        };
        Component.prototype.addEvent = function(static2, multiple) {
          let isStatic = !!static2;
          let isMultiple = !!multiple;
          if (isMultiple && isStatic) {
            return false;
          }
          ;
          let component3 = this.name;
          function notify(event, component4, isPreventDefault, isStopPropagation) {
            return function(e) {
              if (isPreventDefault) {
                e.preventDefault();
              }
              ;
              if (isStopPropagation) {
                e.stopPropagation();
              }
              ;
              Cake.Observer.notify(component4, event, e);
            };
          }
          ;
          if (!this.targets)
            return;
          for (let event in this.targets) {
            if (this.targets.hasOwnProperty(event)) {
              let cf = this.targets[event];
              for (let item of cf) {
                let { sel, el: el2, cb } = item;
                cb = cb || event;
                if (!el2.Ref().get("__cake__events")) {
                  el2.Ref().set("__cake__events", {});
                }
                ;
                let store = el2.Ref().get("__cake__events");
                if (!store[cb]) {
                  let place = event.substring(0, 2);
                  let isPreventDefault = !place.includes("~");
                  let isStopPropagation = place.includes("^");
                  if (!isPreventDefault || isStopPropagation) {
                    event = event.slice(1);
                  }
                  ;
                  el2.addEventListener(event, notify(cb, component3, isPreventDefault, isStopPropagation), true);
                  store[cb] = true;
                  el2.Ref().set("__cake__events", store);
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
          let e = JSON.parse(JSON.stringify(q));
          for (let item of e) {
            item.el = document.querySelector(`[data-event=${item.sel}]`);
            if (!this.targets[item.event]) {
              this.targets[item.event] = [];
            }
            ;
            this.targets[item.event].push(item);
          }
          ;
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
                  let { ns } = config;
                  let f = attrToggle.find((item) => {
                    return item.name == `ns-${ns}`;
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
              let { basis = "data-name", cls = "is-active", mode = "radio", sel, persist: persist2 = true } = config;
              let targets = this.html.querySelectorAll(sel);
              if (!targets.length) {
                return;
              }
              ;
              let prev, next;
              if (targets.length == 1) {
                let isbool = typeof this.bases == "boolean";
                let isforce = !!this.bases;
                let el2 = targets[0];
                if (persist2) {
                  const _forceState = function(el3, cls2, isforce2) {
                    if (isforce2) {
                      if (el3.classList.contains(cls2)) {
                        el3.classList.remove(cls2);
                      }
                      ;
                    } else {
                      if (!el3.classList.contains(cls2)) {
                        el3.classList.add(cls2);
                      }
                      ;
                    }
                  };
                  if (isbool) {
                    if (isforce) {
                      this.cache.createOrUpdate(this.bind, true);
                      _forceState(el2, cls, true);
                    } else {
                      this.cache.createOrUpdate(this.bind, false);
                      _forceState(el2, cls, false);
                    }
                    el2.classList.toggle(cls);
                  } else {
                    this.cache.createOrUpdate(this.bind, !el2.classList.contains(cls));
                    el2.classList.toggle(cls);
                  }
                  ;
                }
                ;
              } else {
                for (let t = 0; t < targets.length; t++) {
                  let el2 = targets[t];
                  let has = el2.classList.contains(cls);
                  let attr = el2.getAttribute(basis);
                  if (attr == this.bases) {
                    if (mode == "switch") {
                      el2.classList.toggle(cls);
                    } else {
                      if (!has) {
                        el2.classList.add(cls);
                      }
                      ;
                    }
                    ;
                    if (persist2) {
                      this.cache.createOrUpdate(this.bind, attr);
                    }
                    ;
                    next = attr;
                  } else {
                    if (has) {
                      el2.classList.remove(cls);
                      prev = el2.getAttribute(basis);
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
              let { basis = "data-name", cls = "is-active", sel } = config;
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
                  let el2 = targets[0];
                  if (bases) {
                    el2.classList.add(cls);
                  }
                  ;
                } else {
                  for (let t = 0; t < targets.length; t++) {
                    let el2 = targets[t];
                    let has = el2.classList.contains(cls);
                    let attr = el2.getAttribute(basis);
                    if (attr == bases) {
                      if (!has) {
                        el2.classList.add(cls);
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
              let el2 = containers[c];
              let name = el2.dataset.container;
              if (name) {
                this.container[name] = el2;
              }
              ;
            }
            ;
            res();
          });
        };
        Component.prototype._watchBindedItems = function() {
        };
        Component.prototype._watchReactive = function() {
          if (!this.items.length) {
            this.items = this.$attrib.getWatchItems(this.name);
            let name = this.name;
            let { input } = this.$attrib.st[name] || { input: false };
            let notify = this.$attrib.notify[name];
            if (input) {
              input.forEach((item) => {
                let { attr, bind: bind2, sel, nodeType } = item;
                let el2 = document.querySelector(`[data-input=${sel}]`);
                if (el2 && !el2._reactive) {
                  if (nodeType == "INPUT" || nodeType == "TEXTAREA") {
                    notify.forEach((n) => {
                      n(name, { value: el2.value, bind: bind2 });
                    });
                    el2.addEventListener("input", (e) => {
                      if (notify && notify.length) {
                        notify.forEach((n) => {
                          n(name, { value: e.target.value, bind: bind2 });
                        });
                      }
                      ;
                    });
                    el2.addEventListener("change", (e) => {
                      if (notify && notify.length) {
                        notify.forEach((n) => {
                          n(name, { value: e.target.value, bind: bind2 });
                        });
                      }
                      ;
                    });
                  } else if (nodeType == "SELECT") {
                    (() => {
                      const { selectedOptions } = input;
                      const selected = [];
                      for (let i = 0; i < selectedOptions.length; i++) {
                        const opt = selectedOptions[i];
                        const text = opt.text;
                        const value = opt.value;
                        selected.push({ text, value });
                      }
                      ;
                      if (notify && notify.length) {
                        notify.forEach((n) => {
                          n(name, { value: selected, bind: bind2 });
                        });
                      }
                      ;
                    })();
                    el2.addEventListener("change", (e) => {
                      const { selectedOptions } = e.target;
                      const selected = [];
                      for (let i = 0; i < selectedOptions.length; i++) {
                        const opt = selectedOptions[i];
                        const text = opt.text;
                        const value = opt.value;
                        selected.push({ text, value });
                      }
                      ;
                      if (notify && notify.length) {
                        notify.forEach((n) => {
                          n(name, { value: selected, bind: bind2 });
                        });
                      }
                      ;
                    });
                  }
                  ;
                  el2._reactive = true;
                }
                ;
              });
            }
            ;
          }
          ;
        };
        Component.prototype.observer = function(subscribe2) {
          function callback(name) {
            return this.handler[name];
          }
          this.observer = new Observer(this, subscribe2, callback.bind(this));
        };
        Component.prototype.variable = function(obj) {
          let vary = Object.keys(obj);
          let validate = {};
          let values = [];
          function invalid(name, test, type) {
            if (!test) {
              validate[name] = `value is not '${type}'`;
            }
            ;
          }
          ;
          for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
              let config = obj[key];
              let { type, value } = config;
              let test;
              if (["string", "number"].includes(type)) {
                test = typeof value == type;
              } else if (value instanceof Array) {
                test = type == "array";
              } else {
                test = type == "object";
              }
              values.push(value);
              invalid(key, test, type);
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
        return Component;
      };
    }
  });

  // src/scripts/cake.js
  var require_cake = __commonJS({
    "src/scripts/cake.js"(exports, module) {
      module.exports = function(dependency) {
        const Attrib = dependency.Attrib;
        const Scope = dependency.Scope;
        const Component = dependency.Component;
        const Hasher = dependency.Hasher;
        const Router = dependency.Router;
        const Persistent = dependency.Persistent;
        const StorageKit = dependency.StorageKit;
        const Observer2 = dependency.Observer;
        const Formy = dependency.Formy;
        function Cake2(name) {
          this.name = name;
          this.components = {};
        }
        ;
        Cake2.Components = function(name) {
          return {
            subscribe(cb, ctx) {
              function subscribeExternal() {
                let component3 = Cake2.Components[name];
                if (component3) {
                  if (cb instanceof Function) {
                    let name2 = cb.name;
                    if (ctx) {
                      cb = cb.bind(ctx);
                    }
                    cb.binded = "external";
                    cb.original = name2;
                    cb.listenTo = component3.name;
                    component3.Subscribe(cb);
                  }
                } else {
                }
                ;
              }
              ;
              return new Promise((res, rej) => {
                let lk = setInterval(() => {
                  if (Cake2.Components[name]) {
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
        Cake2.Subscribe = {};
        Cake2.Handlers = {};
        Cake2.Attributes = new Attrib();
        Cake2.Models.$loaded = function(name) {
          return new Promise((res, rej) => {
            let mk = setInterval(() => {
              if (Cake2.Models[name]) {
                clearInterval(mk);
                res(Cake2.Models[name]);
              }
              ;
            });
            setTimeout(() => {
              if (!Cake2.Models[name]) {
                clearInterval(mk);
                rej(name);
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
                let { isTrusted, data: data2 } = payload || { isTrusted: false };
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
        Cake2.create = function(name, template, options) {
          let group = new Cake2(name, template, options);
          group.create(name, template, options);
        };
        Cake2.plugin = function() {
        };
        Cake2.init = function(name) {
          return new Component(name);
        };
        Cake2.Hasher = new Hasher(Cake2.Components);
        Cake2.Hasher.listen();
        Cake2.Router = Router(Cake2.Components, Component);
        Cake2.Persistent = new Persistent();
        Cake2.Persistent.listen(Cake2.Components);
        Cake2.Cache = new StorageKit({
          name: "cache",
          storage: "session",
          child: "object"
        });
        Cake2.getSubscriber = function(component3, handler) {
          let subscribe2 = Cake2.Subscribe;
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
                    if (listenTo == component3) {
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
        Cake2.Observer = new Observer2(Cake2.Subscribe, Cake2.Handlers);
        Cake2.prototype._defineProperty = function(component3, prop, get, set) {
          Object.defineProperty(component3, prop, {
            configurable: true,
            get() {
              return get();
            },
            set(value) {
              if (set) {
                set(value);
              } else {
              }
            }
          });
        };
        Cake2.prototype._defineProperty(Component.prototype, "$observer", function() {
          return Cake2.Observer;
        });
        Cake2.prototype._defineProperty(Component, "$globalScope", function() {
          const scope2 = new Scope("globalScope");
          return scope2;
        });
        Cake2.$universalScope = function() {
          const scope2 = new Scope("universalScope");
          return scope2;
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
        Cake2.prototype.create = function(name, template, options) {
          console.time(name);
          let component3 = new Component(name, template, options);
          const scope2 = new Scope(name);
          scope2.registerNotifier(function(prop, newValue, prevValue, component4) {
            return Cake2.Attributes.notifier(prop, newValue, prevValue, component4);
          });
          Cake2.Attributes.registerNotifier(name, function(name2, obj) {
            scope2.notifier(name2, obj);
          });
          component3.compile.then(() => {
            let { subscribe: subscribe2, root, html, handlers, role } = component3;
            role == "form" && function() {
              Formy.bind(component3)();
            }();
            return Cake2.Observer.registerSubscribe(subscribe2).then(() => {
              return { root, handlers };
            });
          }).then(({ handlers, root }) => {
            Cake2.Observer.registerHandlers(handlers, component3.name);
            this._defineProperty(component3, "root", function() {
              if (component3._root) {
                return component3._root;
              } else {
                let selector2 = root || "#app";
                let query = document.querySelector(selector2);
                if (query) {
                  return query;
                }
              }
              ;
              throw new Error(`the selector '${root}' as container of component '${component3.name}' is not found!`);
            }, function(value) {
              Object.assign(component3, { _root: value });
            });
            this._defineProperty(component3, "$scope", function() {
              return scope2;
            });
          }).then(() => {
            component3.fire = function() {
              function fire(name2, variable) {
                variable = !variable ? null : typeof variable == "function" ? variable.bind(component3)() : function() {
                  return variable;
                }.bind(component3)();
                let o2 = {
                  [name2]: () => {
                    return variable;
                  }
                };
                fn = o2[name2].bind(component3);
                if (typeof fn == "function") {
                  let getAttributes2 = function(element) {
                    let o3 = {};
                    if (!element) {
                      return o3;
                    }
                    ;
                    let attributes2 = element.attributes;
                    if (attributes2) {
                      for (let i = 0; i < attributes2.length; i++) {
                        let attribute = attributes2[i];
                        let name3 = attribute.name;
                        let value = attribute.value;
                        o3[name3] = value;
                      }
                      ;
                    }
                    ;
                    return o3;
                  };
                  var getAttributes = getAttributes2;
                  fn.name = name2;
                  fn.original = name2;
                  fn.binded = component3.name;
                  Cake2.Observer.registerHandlers({ [name2]: fn }, component3.name);
                  let payload = variable;
                  ;
                  if (variable && (variable.element || variable.root || variable.container)) {
                    const element = getAttributes2(variable.element);
                    const root = getAttributes2(variable.root);
                    const container = getAttributes2(variable.container);
                    payload = { status: 0, attributes: { element, root, container } };
                  }
                  ;
                  Cake2.MainMessageChannel.send({ component: component3.name, event: name2, payload });
                  const notify = Cake2.Observer.notify(component3.name, name2, {}).then(() => {
                    return Cake2.Observer.results[component3.name][name2];
                  });
                  component3.await[name2] = notify;
                  return component3.await[name2];
                }
                ;
                console.error(`the param in fire is not an instance of function`);
              }
              ;
              function addStaticMethod(fn2, handlers) {
                for (let h in handlers) {
                  if (handlers.hasOwnProperty(h)) {
                    let handler = handlers[h];
                    let event = handler.original;
                    Object.defineProperty(fn2, event, {
                      get() {
                        let fn3 = {
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
                            if (isBroadcast) {
                              const notify = new Promise((res, rej) => {
                                setTimeout(() => {
                                  let payload = variable;
                                  if (variable && variable.element) {
                                    payload = { status: 0, message: "element cant be cloned" };
                                  }
                                  ;
                                  Cake2.MainMessageChannel.send({ component: component3.name, event: name, payload });
                                  Cake2.Observer.notify(component3.name, event, variable).then(() => {
                                    return Cake2.Observer.results[component3.name][event];
                                  }).then((r) => {
                                    res(r);
                                  }).catch((err) => {
                                    console.error(err);
                                  });
                                });
                              });
                              component3.await[event] = notify;
                              return component3.await[event];
                            } else {
                              return handler(variable);
                            }
                            ;
                          }
                        };
                        fn3[event] = fn3[event].bind(component3);
                        fn3[event].originalName = event;
                        fn3[event].binded = component3.name;
                        return fn3[event];
                      }
                    });
                  }
                  ;
                }
                ;
              }
              addStaticMethod(fire, component3.handlers);
              return fire;
            }();
          }).then(() => {
            if (component3.type == "view") {
              component3.toggler = component3.toggler(component3);
              Cake2.Components[name] = component3;
            }
            ;
          }).then(() => {
            component3.options.data && component3.options.data.bind(component3.data)(component3);
            component3.options.init && component3.options.init.bind(component3)();
            component3.options.utils && component3.options.utils.bind(component3.utils)(component3);
            component3.options.router && Cake2.Router.subscribe(component3.options.router.bind(component3));
          }).then(() => {
            if (component3.type == "model") {
              Cake2.Models[name] = component3;
            }
            if (component3.isStatic && component3.type == "view") {
              component3.render();
            } else {
            }
            ;
          });
        };
        return Cake2;
      };
    }
  });

  // src/app.js
  var env = require_env();
  var extensions = require_extends();
  var polyfill = require_polyfill();
  var utils = require_utils();
  var templateExtend = require_template_extend();
  var storage = require_storage();
  var piece = require_piece();
  var observer = require_observer();
  var templating = require_templating();
  var animate = require_animate();
  var persist = require_persist();
  var hash = require_hash();
  var router = require_router();
  var form = require_form();
  var scope = require_scope()({
    StorageKit: storage()
  });
  var attributes = require_attributes()({
    StorageKit: storage(),
    Templating: templating(),
    Utils: utils
  });
  var component2 = require_component()({
    Utils: utils,
    Mo: animate,
    Templating: templating(),
    Piece: piece(),
    pushState: router.pushState
  });
  var cake = require_cake()({
    Attrib: attributes,
    Scope: scope,
    Component: component2,
    Hasher: hash,
    Router: router,
    Persistent: persist({
      StorageKit: storage()
    }),
    StorageKit: storage(),
    Observer: observer(),
    Formy: form
  });
  window.Cake = cake;
})();
