var $parcel$global =
typeof globalThis !== 'undefined'
  ? globalThis
  : typeof self !== 'undefined'
  ? self
  : typeof window !== 'undefined'
  ? window
  : typeof global !== 'undefined'
  ? global
  : {};
var $parcel$modules = {};
var $parcel$inits = {};

var parcelRequire = $parcel$global["parcelRequire2002"];
if (parcelRequire == null) {
  parcelRequire = function(id) {
    if (id in $parcel$modules) {
      return $parcel$modules[id].exports;
    }
    if (id in $parcel$inits) {
      var init = $parcel$inits[id];
      delete $parcel$inits[id];
      var module = {id: id, exports: {}};
      $parcel$modules[id] = module;
      init.call(module.exports, module, module.exports);
      return module.exports;
    }
    var err = new Error("Cannot find module '" + id + "'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;
  };

  parcelRequire.register = function register(id, init) {
    $parcel$inits[id] = init;
  };

  $parcel$global["parcelRequire2002"] = parcelRequire;
}
parcelRequire.register("gNV9J", function(module, exports) {

const $c3bd8ee74a897c30$var$StorageKit = (parcelRequire("jUqKh"))();
module.exports = function(dependency) {
    // const StorageKit = dependency.StorageKit;
    const _hooks = {};
    class Scope {
        constructor(name){
            this.name = name;
            this.reactiveData = {};
            this.notify = [];
            this.install(this.name);
            this.pKeys = {};
            this.sanitize = function(data) {
                const map = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#x27;",
                    "/": "&#x2F;"
                };
                const reg = /[&<>"'/]/ig;
                if (typeof data == "string") return data.replace(reg, (match)=>map[match] || "");
                else return data;
            };
        }
        registerNotifier(fn) {
            this.notify.push(fn);
        }
        install() {
            this.session = new $c3bd8ee74a897c30$var$StorageKit({
                child: "object",
                storage: "session",
                name: `_cake_${this.name}_cf`
            });
        // console.log(this.name, this.session);
        // this.memory = new StorageKit({
        //     child:'object',
        //     storage:'object',
        //     name:`_cake_${this.name}_cf`,
        // });
        }
        notifier(component, obj) {
            //called by usually form input;
            //reactive input;
            // const {value, bind} = obj;
            const value = obj.value;
            const bind = obj.bind;
            if (!this.reactiveData[component]) this.reactiveData[component] = {};
            this.reactiveData[component][bind] = value;
            return this.set(bind, value);
        // console.log(this.reactiveData[component]);
        }
        getInputData(type = "json", _component) {
            let component = _component || this.name;
            // console.log(this.reactiveData);
            let data = JSON.parse(JSON.stringify(this.reactiveData[component]));
            //reset the reactiveData when after get;
            for(let key in data){
                let value = data[key];
                data[key] = this.sanitize(value);
            }
            if (type == "json") return data;
            else if (type == "formdata") {
                const formData = new FormData;
                for(let key in data){
                    let value = data[key];
                    formData.append(key, value);
                }
                return formData;
            }
        }
        //a change to get notified when the data of other component is changed;
        hook(component, bind, callback) {
            if (!_hooks[component]) _hooks[component] = {};
            if (!_hooks[component][bind]) //callbacks;
            _hooks[component][bind] = [];
            _hooks[component][bind].push(callback);
        // console.log(component, bind, callback, _hooks);
        }
        get(key, quick = false) {
            let pkey = this.pKeys[key];
            // if(this.name == 'globalScope'){
            //     // console.trace();
            //     // console.log(106, pkey,key,quick,this.pKeys,pkey)
            //     console.log(112,this.memory, quick);
            //     // console.log(113,this.memory.get('key',true));
            // }
            // if(!pkey){
            //     if(quick){
            //         return `${key} is not found`;
            //     } else {
            //         return Promise.reject(`${key} is not found`);
            //     }
            // }
            if (quick) return this.session.get(key, true);
            else return this.session.get(key);
        }
        set(key, value) {
            let pkey = `${this.name}-${key}`;
            let notify = this.notify;
            let name = this.name;
            let prevValue = null;
            this.pKeys[key] = pkey;
            return new Promise(async (res, rej)=>{
                // prevValue = await this.get(key, true);
                // if(key == 'color'){
                //     console.log(118,key, prevValue, value);
                // }
                if (key != "password") this.session.createOrUpdate(key, value);
                res();
            }).then(async ()=>{
                // await this.memory.createOrUpdate(key, value);
                // if (this.name == 'globalScope'){
                //     console.log(137,this.memory);
                // };
                // console.log(this.memory);
                // if(key == 'color'){
                //     console.log(139, this.memory.getAll());
                // }
                //custom callback for other component;
                //callback for html attributes;
                // console.log(notify)
                return Promise.all(notify.map((cb1)=>{
                    return cb1(key, value, prevValue, name).then(()=>{
                        // console.log('finish notified in scope');
                        const hooks = _hooks[this.name];
                        if (hooks) {
                            const callbacks = hooks[key];
                            if (callbacks) callbacks.forEach((cb)=>{
                                cb(value);
                            });
                        }
                    });
                }));
            });
        }
    }
    return Scope;
} // module.exports = function(dependency){
 //     const StorageKit = dependency.StorageKit;
 //     function Scope(parent, options){
 //         this.pKey = options.pKey || '$scope';
 //         this.temp = {};
 //         this.trap = options.trap;
 //         this.notify = [];
 //         this.parent = parent;
 //         this._clone = {};
 //         this._cloneAsync = {};
 //         this.whitelist = ['extend', 'set', 'get'];
 //         this.install();
 //     };
 //     Scope.prototype.registerNotifier = function(fn){
 //         this.notify.push(fn);
 //     };
 //     Scope.prototype.notifier = function(obj){
 //         // console.log(obj);
 //         Cake.$scope[obj.bind] = obj.value;
 //     };
 //     Scope.prototype.method = function(){
 //         let temp = this.temp;
 //         let trap = this.trap;
 //         let notify = this.notify;
 //         let _this = this.parent;
 //         let whitelist = this.whitelist;
 //         let cloneAsync = this._cloneAsync;
 //         return {
 //             update(keys, fn){
 //                 if (!keys.length) return;
 //                 for (let k = 0; k < keys.length; k++){
 //                     let key = keys[k];
 //                     fn(key);
 //                 };
 //             },
 //             defineProperty(key, cloned){
 //                 Object.defineProperty(temp, key, {
 //                     configurable:true,
 //                     get(){
 //                         let t = trap.bind(_this)(key) || false;
 //                         if (t){
 //                             return t;
 //                         };
 //                         return cloned[key];
 //                     },
 //                     set(newValue){
 //                         if (whitelist.includes(key) || cloneAsync[key]){
 //                         } else {
 //                             let prevValue = this[key];
 //                             for (let n = 0; n < notify.length; n++){
 //                                 let fn = notify[n];
 //                                 fn(key, newValue, prevValue);
 //                             };
 //                             cloned[key] = newValue;
 //                         }
 //                     },
 //                 });
 //             }
 //         };
 //     };
 //     Scope.prototype.install = function(){
 //         let {update, defineProperty} = this.method();
 //         let temp = this.temp;
 //         let cloned = this._clone;
 //         let clonedAsync = this._cloneAsync;
 //         Object.defineProperty(this.parent, this.pKey, {
 //             configurable:true,
 //             get(){
 //                 cloned = Object.assign(cloned, temp);
 //                 cloned = Object.assign(cloned, clonedAsync);
 //                 let keys = Object.keys(temp);
 //                 update(keys, function(key){
 //                     defineProperty(key, cloned);
 //                 });
 //                 return temp;
 //             },
 //         });
 //     };
 //     Scope.prototype.watch = function(array){
 //         // console.log(array)
 //         // console.trace();
 //         if (!array) return;
 //         let {update, defineProperty} = this.method();
 //         let cloned = this._clone;
 //         update(array, function(key){
 //             defineProperty(key, cloned);
 //         });
 //         return true;
 //     };
 //     Scope.prototype.set = function(key, value, cloned){
 //         // console.log(96,key, value);
 //         if (this.whitelist.includes(key)){
 //             return;
 //         };
 //         // console.log(102,this._clone);
 //         let notify = this.notify || [];
 //         let prevValue = cloned[key];
 //         cloned[key] = value;
 //         Object.assign(this.temp, cloned);
 //         // console.log(109,notify);
 //         return Promise.all(notify.map(cb=>{
 //             return cb(key, value, prevValue);
 //         }));
 //     };
 //     return Scope;
 // }
;

});
parcelRequire.register("jUqKh", function(module, exports) {

var $apWp0 = parcelRequire("apWp0");
module.exports = function() {
    /**
     * this class is use to unified the use of storage, in
     * object for memory and storages for sessionStorage/localStorage;
     */ // const Utils = dependency.Utils;
    // const appName = deoendenvy.appName;
    function typeOf(_obj) {
        if (!_obj) return null;
        return _obj.constructor.name.toLowerCase();
    }
    function ObjectForEach(obj, fn) {
        for(let key in obj)if (obj.hasOwnProperty(key)) fn(obj[key], key);
    }
    function ObjectMerge(obj, value, key) {
        obj = Object.assign(obj, {
            [key]: value
        });
    }
    function isNull(d) {
        return d === null;
    }
    function isUndefined(d) {
        return d === undefined;
    }
    function isArray(_obj) {
        return typeOf(_obj) == "array";
    }
    function isObject(_obj) {
        return typeOf(_obj) == "object";
    }
    var hasInArray = function(src, id) {
        var has = null;
        for(var i = 0; i < src.length; i++){
            var item = src[i];
            if (typeOf(id) == "object") {
                var obj = id;
                var key = Object.keys(id)[0];
                var value = obj[key];
                if (typeOf(item) == "object") {
                    var test = item[key] == value;
                    if (test) {
                        has = i;
                        break;
                    }
                }
            } else if (typeOf(id) != "array") {
                var test = id == item;
                if (test) {
                    has = i;
                    break;
                }
            }
        }
        return has;
    };
    var hasInObject = function(src, id) {
        var key = null;
        var type = typeOf(id);
        if (type == "object") {
            var _key = Object.keys(id)[0];
            if (src[key] != undefined && src[key] == id[_key]) key = _key;
        } else if (type == "string") key = id;
        return key;
    };
    var hasItem = function(src, id) {
        var has = null;
        if (typeOf(src) == "array") has = hasInArray(src, id);
        else if (typeOf(src) == "object") has = hasInObject(src, id);
        return has;
    };
    var STORAGE = class {
        constructor(type, name, child){
            this.type = type;
            this.name = `${$apWp0.instanceID()}-${name}`;
            this.child = child;
            this.cache = {};
            if (typeOf(this.child) == "string") this.child = child == "array" ? [] : child == "object" ? {} : false;
        }
        init(save) {
            if (this[this.type]) {
                this[this.type](save);
                return true;
            }
            return false;
        }
        open() {
            if (this.type == "session") {
                var decoded = JSON.parse(sessionStorage[this.name]);
                // if (this.name == '_cake_persistent'){
                //     console.log(2503,decoded);
                // };
                return decoded[this.name];
            } else if (this.type == "local") {
                var decoded = JSON.parse(localStorage[this.name]);
                return decoded[this.name];
            } else // console.log(119,this.type,this.cache);
            return this.cache[this.name];
        }
        close(storage) {
            this.child = storage;
            this.recache();
            // console.log(94,this.name, storage);
            return this.init(true);
        }
        recache() {
            this.cache[this.name] = this.child;
        }
        create() {
            // console.log(93, this.name, this.cache);
            this.cache[this.name] = this.child;
        }
        array() {
            this.create();
        }
        object(issave) {
            this.create();
        // console.log(120,this.type,this.cache);
        // console.trace();
        }
        session(save) {
            if (!save) this.recache();
            try {
                if (!sessionStorage[this.name] && !save) sessionStorage.setItem(this.name, JSON.stringify(this.cache));
                else if (save) sessionStorage.setItem(this.name, JSON.stringify(this.cache));
            } catch (err) {
                this.recache();
            }
        }
        local(save) {
            // this.verifyLocalStorage();
            if (!save) this.recache();
            try {
                if (!localStorage[this.name] && !save) localStorage.setItem(this.name, JSON.stringify(this.cache));
                else if (save) localStorage.setItem(this.name, JSON.stringify(this.cache));
            } catch (err) {
                this.recache();
            }
        }
    };
    var methods = {
        create: function(storage, data) {
            if (isArray(storage)) {
                let unique = new Set(storage);
                if (typeOf(data) == "array") data.forEach((i)=>{
                    unique.add(i);
                });
                else unique.add(data);
                storage = Array.from(unique);
            } else if (isObject(storage)) {
                if (isObject(data)) ObjectForEach(data, function(value, key) {
                    storage[key] = value;
                });
                else storage[data] = data;
            }
            return storage;
        },
        createOrUpdate: function(storage, data) {
            var has = hasItem(storage, data);
            if (typeOf(storage) == "array") {
                if (!isNull(has)) storage[has] = data;
                else storage.includes(data);
            } else if (typeOf(storage) == "object") {
                if (isNull(has)) {
                    if (isObject(data)) ObjectForEach(data, function(value, key) {
                        ObjectMerge(storage, value, key);
                    });
                    else storage[data] = data;
                } else storage[has] = data;
            }
            return storage;
        },
        remove: function(storage, id) {
            if (typeOf(id) == "string") {
                var has = hasItem(storage, id);
                if (typeOf(storage) == "object") delete storage[has];
                else if (typeOf(storage) == "array") {
                    var arr = [];
                    for(var i = 0; i < storage.length; i++){
                        if (i != has) arr.push(storage[i]);
                        else continue;
                    }
                    storage = arr;
                }
                return storage;
            } else if (typeOf(id) == "object") return Object.filter(storage, function(value, key) {
                var test = id[key] != undefined && id[key] == value;
                return !test;
            });
            else if (typeOf(id) == "array") return Object.filter(storage, function(value, key) {
                var test = id.contains(key);
                return !test;
            });
            if (isNull(has)) return false;
        },
        get: function(storage, id) {
            var type = typeOf(id);
            if (type == "string") {
                var has = hasItem(storage, id);
                if (has == 0 || has) return storage[has];
            } else if (type == "object") return Object.filter(storage, function(value, key) {
                var test = !isUndefined(id[key]) && id[key] == value;
                return test;
            });
            else if (type == "array") return Object.filter(storage, function(value, key) {
                var test = id.contains(key);
                return test;
            });
            return null;
        },
        getNot: function(storage, id) {
            var type = typeOf(id);
            if (type == "string") return Object.filter(storage, function(value, key) {
                var test = key != id;
                return test;
            });
            else if (type == "object") return Object.filter(storage, function(value, key) {
                return Object.some(id, function(_value, _key) {
                    var test = _key == key && _value == value;
                    return !test;
                });
            });
            else if (type == "array") return Object.filter(storage, function(value, key) {
                var test = !id.contains(key);
                return test;
            });
            return null;
        },
        getAll: function(storage) {
            return storage;
        }
    };
    var USB = class {
        constructor(_obj){
            this.name = _obj.name;
            this.storageType = _obj.storage;
            this.child = _obj.child || "object";
            try {
                if (typeOf(this.child) == "string") this.child = this.child == "array" ? [] : this.child == "object" ? {} : null;
            } catch (err) {
                if (this.storageType == "session") sessionStorage.clear();
                else if (this.storageType == "local") localStorage.clear();
                if (typeOf(this.child) == "string") this.child = this.child == "array" ? [] : this.child == "object" ? {} : null;
            }
            if (![
                "array",
                "object"
            ].includes(typeOf(this.child))) throw new Error("the child must be an object or array type.");
            this.storage = new STORAGE(this.storageType, this.name, this.child);
            this.storage.init();
        }
        has(id) {
            var storage = this.storage.open();
            var has = hasItem(storage, id);
            return isNull(has) ? false : has;
        }
        get(id, quick) {
            if (quick) {
                var storage = this.storage.open();
                return methods.get(storage, id);
            } else return new Promise((res, rej)=>{
                setTimeout(()=>{
                    var storage = this.storage.open();
                    res(storage);
                });
            }).then((storage)=>{
                // console.log(342, storage)
                return methods.get(storage, id);
            });
        }
        getNot(id) {
            var storage = this.storage.open();
            return methods.getNot(storage, id);
        }
        getAll() {
            var storage = this.storage.open();
            return Promise.resolve(storage);
        }
        update(id, update) {
            var storage = this.storage.open();
            var has = hasItem(storage, id);
            if (has == 0 || has) {
                storage = methods.createOrUpdate(storage, data);
                return this.storage.close(storage);
            }
            return false;
        }
        createOrUpdate(data) {
            if (arguments.length > 1) {
                let key = arguments[0];
                let value = arguments[1];
                data = {
                    [key]: value
                };
            }
            var storage = this.storage.open();
            storage = methods.createOrUpdate(storage, data);
            const close = this.storage.close(storage);
            // console.log(377, storage);
            return close;
        }
        create(data) {
            var storage = this.storage.open();
            storage = methods.create(storage, data);
            return this.storage.close(storage);
        }
        remove(id) {
            var storage = this.storage.open();
            storage = methods.remove(storage, id);
            return this.storage.close(storage);
        }
    };
    return USB;
};

});
parcelRequire.register("apWp0", function(module, exports) {
var $79598aa8277e83a7$var$global = {};
const $79598aa8277e83a7$var$TYPES = {
    typeof: function(ctx) {
        switch(true){
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
const $79598aa8277e83a7$var$LOOP = {
    each: function(ctx, fn, type) {
        if (type == "object") {
            var i = 0;
            for(var key in ctx)if (ctx.hasOwnProperty(key)) {
                fn({
                    key: key,
                    value: ctx[key]
                }, i);
                i = i + 1;
            }
        } else for(var a = 0; a < ctx.length; a++)fn(ctx[a], a);
    },
    map: function(ctx, fn) {
        var type = $79598aa8277e83a7$var$TYPES.isArray(ctx) || ctx.length ? "array" : "object";
        var st = ctx.length && type == "array" ? [] : {};
        this.each(ctx, function(obj, index) {
            var r = fn(obj, index);
            if (type == "object") st[r.key] = r.value;
            else st.push(r);
        }, type);
        return st;
    },
    reduce: function(ctx, accu, fn) {
        var type = $79598aa8277e83a7$var$TYPES.typeof(ctx);
        this.each(ctx, function(obj, index) {
            accu = fn(obj, accu, index);
        }, type);
        return accu;
    },
    filter: function(ctx, fn) {
        var type = $79598aa8277e83a7$var$TYPES.isArray(ctx) || ctx.length ? "array" : "object";
        var st = ctx.length && type == "array" ? [] : {};
        this.each(ctx, function(obj, index) {
            var r = fn(obj, index);
            if (r) {
                if (type == "object") st[obj.key] = obj.value;
                else st.push(obj.value);
            }
        }, type);
        return st;
    }
};
const $79598aa8277e83a7$var$OBJECT = {
    dictionary: function(obj, path) {
        if (path) path = path.split(".");
        for(let p = 0; p < path.length; p++)if (obj[p]) obj = obj[p];
        else {
            obj = null;
            break;
        }
        return obj;
    }
};
const $79598aa8277e83a7$var$STRING = {
    removeWhiteSpace (str) {
        return String(str).split(" ").join("");
    }
};
const $79598aa8277e83a7$var$OTHERS = {
    perf: function(fn) {
        console.time("test");
        fn();
        console.timeEnd("test");
    },
    logTest: function(a, ops, b) {
        try {
            a = JSON.parse(a);
        } catch (err) {}
        try {
            b = JSON.parse(b);
        } catch (err1) {}
        switch(ops){
            case "==":
                return a == b;
            case "!=":
                return a != b;
            case "<":
                return a < b;
            case ">":
                return a > b;
            case ">=":
                return a >= b;
            case "<=":
                return a <= b;
        }
    },
    toUrlSearchParams: function(obj, istrim = true) {
        let searchParams = "";
        for(let key in obj)if (obj.hasOwnProperty(key)) {
            let val = obj[key];
            if (val.toString().includes("Object")) val = JSON.stringify(val);
            if (istrim && val) searchParams += `${encodeURI(key)}=${encodeURI(val)}&`;
            else searchParams += `${encodeURI(key)}=${encodeURI(val)}&`;
        }
        return searchParams.slice(0, searchParams.length - 1);
    },
    sanitize: function(string, exclude = []) {
        if (typeof string != "string") return string;
        let map = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#x27;",
            "/": "&#x2F;"
        };
        map = Object.keys(map).reduce((accu, key)=>{
            if (!exclude.includes(key)) accu[key] = map[key];
            return accu;
        }, {});
        const reg = /[&<>"'/]/ig;
        return string.replace(reg, (match)=>{
            return map[match] || match;
        });
    },
    toFormData: function(form, options = {}) {
        const controls = [];
        const textareas = form.querySelectorAll("TEXTAREA");
        const inputs = form.querySelectorAll("INPUT");
        const selects = form.querySelectorAll("SELECT");
        function loop(arr, cont) {
            for(let i = 0; i < arr.length; i++)cont.push(arr[i]);
        }
        loop(textareas, controls);
        loop(inputs, controls);
        loop(selects, controls);
        let o = {};
        for(let i1 = 0; i1 < controls.length; i1++){
            let control = controls[i1];
            let key = control.name || control.id;
            if (key && [
                "{{",
                "((",
                "[[",
                "<<",
                "%%",
                "&&"
            ].includes(key)) ;
            else {
                let type;
                const element = form[key];
                if (element) {
                    if (element.closest && !element.closest(".cake-template")) {
                        const tag = element.tagName;
                        if (tag == "INPUT" && element.getAttribute("type") == "checkbox") value = element.checked;
                        else value = this.sanitize(element.value, options.sanitize);
                        if (options.json) {
                            if (options.trim) {
                                if (value != "") o[key] = value;
                            } else o[key] = value;
                        } else fd.append(key, value);
                    }
                }
            }
        }
        if (options.json) return o;
        else {
            let fd = new FormData();
            for(let key in o)if (o.hasOwnProperty(key)) fd.append(key, o[key]);
            return fd;
        }
    },
    splitBySpace: function(string, fn) {
        if (string) {
            string = string.split(" ");
            if ($79598aa8277e83a7$var$TYPES.isArray(string)) for(let i = 0; i < string.length; i++)fn(string[i]);
        }
    },
    toArray (arrayLike) {
        let a = [];
        if (!arrayLike.length) return a;
        for(let i = 0; i < arrayLike.length; i++)a.push(arrayLike[i]);
        return a;
    },
    timeOut (fn, time = 1) {
        setTimeout(()=>{
            fn();
        }, time);
    },
    instanceID () {
        //to have unique identifier every web app using this, in sessionStorage or localStorage;
        return location.origin;
    },
    recurse (array, callback) {
        return new Promise((res, rej)=>{
            try {
                let l = array.length;
                let index = 0;
                const rec = ()=>{
                    if (l > index) {
                        callback(array[index]);
                        index += 1;
                        rec();
                    } else res();
                };
                rec();
            } catch (err) {
                rej(err.message);
            }
        });
    },
    browser () {
        // Return cached result if avalible, else get result then cache it.
        if (window._browser) return window._browser;
        // Opera 8.0+
        var isOpera = !!window.opr && !!opr.addons || !!window.opera || navigator.userAgent.indexOf(" OPR/") >= 0;
        // Firefox 1.0+
        var isFirefox = typeof InstallTrigger !== "undefined";
        // Safari 3.0+ "[object HTMLElementConstructor]" 
        var isSafari = /constructor/i.test(window.HTMLElement) || function(p) {
            return p.toString() === "[object SafariRemoteNotification]";
        }(!window["safari"] || safari.pushNotification);
        // Internet Explorer 6-11
        var isIE = !!document.documentMode;
        // Edge 20+
        var isEdge = !isIE && !!window.StyleMedia;
        // Chrome 1+
        var isChrome = !!window.chrome && !!window.chrome.webstore;
        // Blink engine detection
        var isBlink = (isChrome || isOpera) && !!window.CSS;
        return window._browser = isOpera ? "Opera" : isFirefox ? "Firefox" : isSafari ? "Safari" : isChrome ? "Chrome" : isIE ? "IE" : isEdge ? "Edge" : isBlink ? "Blink" : "Don't know";
    },
    isOpera () {
        return this.browser == "Opera";
    },
    isFirefox () {
        return this.browser() == "Firefox";
    },
    isSafari () {
        return this.browser == "Safari";
    },
    isChrome () {
        return this.browser == "Chrome";
    },
    isIE () {
        return this.browser == "IE";
    },
    isEdge () {
        return this.browser == "Edge";
    },
    isBlink () {
        return this.browser == "Blink";
    },
    device () {
        if (navigator.userAgent.includes("Android")) return "android";
        else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) return "IOS";
        else return "desktop";
    },
    isAndroid () {
        return this.device() == "android";
    },
    isIOS () {
        return this.device() == "ios";
    },
    isDesktop () {
        return this.device() == "desktop";
    },
    escapeRegExp (text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }
};
try {
    $79598aa8277e83a7$var$global.UTILS = {
        ...$79598aa8277e83a7$var$LOOP,
        ...$79598aa8277e83a7$var$TYPES,
        ...$79598aa8277e83a7$var$OTHERS,
        ...$79598aa8277e83a7$var$STRING
    };
} catch (err) {
    $79598aa8277e83a7$var$global.UTILS = {};
    var $79598aa8277e83a7$var$iter = $79598aa8277e83a7$var$LOOP.each;
    $79598aa8277e83a7$var$iter($79598aa8277e83a7$var$LOOP, function(key, value) {
        $79598aa8277e83a7$var$global.UTILS[key] = value;
    });
    $79598aa8277e83a7$var$iter($79598aa8277e83a7$var$TYPES, function(key, value) {
        $79598aa8277e83a7$var$global.UTILS[key] = value;
    });
    $79598aa8277e83a7$var$iter($79598aa8277e83a7$var$OTHERS, function(key, value) {
        $79598aa8277e83a7$var$global.UTILS[key] = value;
    });
    $79598aa8277e83a7$var$iter($79598aa8277e83a7$var$STRING, function(key, value) {
        $79598aa8277e83a7$var$global.UTILS[key] = value;
    });
}
module.exports = $79598aa8277e83a7$var$global.UTILS;

});



(function(global) {
    global.env = {
        destructure: true
    };
    const env = global.env;
    // try {let {a} = {a:true};} catch(err){env.destructure = false};
    Promise.prototype.ObjectType = "Promise";
})(window);


(function(global) {
    HTMLCollection.prototype.toArray = function() {
        let b = [];
        for(let a = 0; a < this.length; a++)b[a] = this[a];
        return b;
    };
    NodeList.prototype.toArray = function() {
        let b = [];
        let index = -1;
        let length = this.length;
        while(++index < length)b[index] = this[index];
        // console.trace();
        // console.log(b);
        return b;
    };
    Object.cache = Object.create(null);
    Object.caching = (name)=>{
        const obj = Object.cache;
        if (!obj[name]) obj[name] = {};
        return {
            set (key, value) {
                obj[name][key] = value;
                return true;
            },
            get (key) {
                return obj[name][key];
            }
        };
    };
    String.prototype.toHyphen = function() {
        let _StringCache = Object.cache;
        let cvt = null;
        let str = this;
        if (!_StringCache.toHyphen) _StringCache.toHyphen = {};
        if (_StringCache[str]) cvt = _StringCache[str];
        if (cvt != undefined) return cvt;
        let splitted = str.split("");
        // console.log(splitted)
        let ss = "", i = -1;
        while(++i < splitted.length){
            let s = splitted[i];
            switch(i){
                case 0:
                    ss += s.toLowerCase();
                    break;
                default:
                    s.charCodeAt() < 91 && (ss += "-");
                    ss += s.toLowerCase();
            }
        }
        _StringCache[str] = ss;
        cvt = ss;
        return cvt;
    };
    String.prototype.toProper = function() {
        let str = this;
        let cache = Object.caching("toProper").get(str);
        if (cache) return cache;
        else {
            let first = str.substring(0, 1);
            let rest = str.slice(1);
            let proper = `${first.toUpperCase()}${rest}`;
            Object.caching("toProper").set(str, proper);
            return proper;
        }
    };
    String.prototype.removeSpace = function() {
        return this.split(" ").join("");
    };
    String.prototype.toCamelCase = function() {
        let str = this.toLowerCase();
        let _StringCache = Object.cache;
        let cvt = null;
        if (!_StringCache.toCamel) _StringCache.toCamel = {};
        _StringCache = _StringCache.toCamel;
        if (_StringCache[str]) return _StringCache[str];
        else {
            let split = str.split("-");
            if (split.length == 1) return str;
            let join = "";
            let i = -1;
            let length = split.length;
            while(++i < length){
                let str = split[i];
                switch(i){
                    case 0:
                        join += str;
                        break;
                    default:
                        {
                            let first = str.substring(0, 1).toUpperCase();
                            let second = str.substring(1);
                            join += first + second;
                        }
                        break;
                }
            }
            _StringCache[str] = join;
            return join;
        }
    };
    HTMLElement.prototype.querySelectorIncluded = function(selector, attr, val) {
        let q = this.querySelector(selector);
        return q ? q : (()=>{
            switch(true){
                case !attr && !val:
                    {
                        let qu = this.closest(selector);
                        if (qu == this) q = qu;
                    }
                    break;
                case !!attr && !!val:
                    q = this.getAttribute(attr) == val ? this : null;
                    break;
                case !!attr && !val:
                    q = this.getAttribute(attr) ? this : null;
                    break;
            }
            return q;
        })();
    };
    HTMLElement.prototype.querySelectorAllIncluded = function(selector, attr, val) {
        let q;
        try {
            q = this.querySelectorAll(selector);
            q && (q = q.toArray());
        } catch (err) {
            q = [];
        }
        if (selector) q = this.querySelectorAll(selector).toArray();
        else if (attr && val) {
            q = this.querySelectorAll(`[${attr}=${val}]`).toArray();
            if (this.dataset[attr] == val) q.push(this);
        } else if (attr && !val) {
            q = this.querySelectorAll(`[${attr}]`).toArray();
            if (!!this.dataset[attr]) q.push(this);
        }
        switch(true){
            case !attr && !val:
                {
                    let qu = this.closest(selector);
                    qu == this && q.push(qu);
                }
                break;
            case attr && val:
                break;
            case attr && !val:
                break;
        }
        return q;
    };
    HTMLDocument.prototype.querySelectorIncluded = function(selector) {
        return this.querySelector(selector);
    };
    HTMLDocument.prototype.querySelectorAllIncluded = function(selector) {
        return this.querySelectorAll(selector);
    };
    Array.prototype.toggler = function(dataName, activeClass) {
        for(let t = 0; t < this.length; t++){
            let node = this[t];
            let name = node.dataset.name;
            if (name == dataName) node.classList.toggle(activeClass);
            else if (node.classList.contains(activeClass)) node.classList.toggle(activeClass);
        }
    };
    HTMLElement.prototype.Ref = function() {
        let n = "_cakes_storage";
        !this[n] && (this._cakes_storage = {});
        let storage = this[n];
        return {
            set (key, value) {
                storage[key] = value;
            },
            get (key) {
                return storage[key];
            },
            getAll (key) {
                return storage;
            },
            remove (key) {
                delete storage[key];
            }
        };
    };
    HTMLElement.prototype.replaceDataSrc = function() {
        let srcs = this.querySelectorAllIncluded(null, "data-src", null);
        for(let s = 0; s < srcs.length; s++){
            let el = srcs[s];
            el.setAttribute("src", el.dataset.src);
            el.removeAttribute("data-src");
        }
    };
})(window);


if (!Object.keys) Object.keys = function(obj) {
    var keys = [];
    for(var i in obj)if (obj.hasOwnProperty(i)) keys.push(i);
    return keys;
};


parcelRequire("apWp0");
(function() {
    customElements.define("sub-template", class extends HTMLElement {
        constructor(){
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
            if (!refEl) {
                subTemplate.remove();
                throw new Error(`${ref} is not found!`);
            }
            if (refEl[0]) {
                let temp = refEl[0];
                if (temp.constructor.name == "HTMLTemplateElement") {
                    temp = temp.content.cloneNode(true).firstElementChild;
                    if (!temp) return;
                    let attrs = subTemplate.attributes;
                    for(let a = 0; a < attrs.length; a++){
                        let attr = attrs[a];
                        if (attr.name != "data-template") temp.setAttribute(attr.name, attr.value);
                    }
                    // console.log(temp);
                    subTemplate.replaceWith(temp);
                } else throw new Error(`${ref} is not referred to a Template Element!`);
            }
        }
    });
    HTMLTemplateElement.prototype.replaceSubTemplate = function(el) {
        let subTemplates = el.getElementsByTagName("sub-template");
        if (subTemplates) {
            subTemplates = subTemplates.toArray();
            for(let s = 0; s < subTemplates.length; s++){
                let subTemplate = subTemplates[s];
                customElements.get("sub-template").prototype.replace(subTemplate);
            }
        }
    };
    HTMLTemplateElement.prototype.collectContent = function() {
        let template = this;
        let cf = null;
        let temp = template.cloneNode(true);
        let fr = document.createDocumentFragment();
        let styles = temp.content.querySelector("style");
        if (styles) fr.appendChild(styles);
        let others = [];
        for(let o = 0; o < temp.content.children.length; o++){
            let el = temp.content.children[0];
            this.replaceSubTemplate(el);
            others.push(el);
        }
        cf = {
            style: fr.children[0],
            others: others
        };
        return cf;
    };
    HTMLTemplateElement.prototype.parseStyle = function(style) {
        if (!style) return false;
        var styles = style.textContent.trim();
        if (!styles.length) return;
        let obj = {};
        let sel = "";
        let splitted1 = styles.split("}");
        for(let sp1 = 0; sp1 < splitted1.length; sp1++){
            let item1 = splitted1[sp1];
            let _sp1 = item1.split("{");
            let sel = _sp1[0];
            let style = _sp1[1];
            // let [sel, style] = item.split("{");
            if (!!sel) obj[sel.trim()] = (()=>{
                let n = false;
                let s = "";
                let splitted = style.split("");
                for(let sp = 0; sp < splitted.length; sp++){
                    let item = splitted[sp];
                    if (item == "\n") n = true;
                    else if (item == " ") {
                        if (n) ;
                        else s += item;
                    } else {
                        n = false;
                        s += item;
                    }
                }
                return s;
            })();
        }
        return obj;
    };
    HTMLTemplateElement.prototype.parseHTML = function(others) {
        if (others) {
            var parent = document.createElement("HTML");
            for(let o = 0; o < others.length; o++){
                let other = others[o];
                parent.append(other);
            }
        }
        return parent || false;
    };
    HTMLTemplateElement.prototype.getContent = function(isConvert) {
        let _collectedContent = this.collectContent();
        // let {style, others} = this.collectContent();
        let style = _collectedContent.style;
        let others = _collectedContent.others;
        let styles = this.parseStyle(style);
        let element = this.parseHTML(others);
        for(let selector in styles)if (styles.hasOwnProperty(selector)) {
            // console.log(element.outerHTML)
            let query = element.querySelectorAll(selector);
            let css = styles[selector];
            for(let q = 0; q < query.length; q++){
                let item = query[q];
                // console.log(item, css)
                item.setAttribute("style", css);
            // console.log(item);
            }
        }
        element = isConvert ? element.children.toArray() : element.innerHTML;
        return element.length == 1 ? element[0] : element;
    };
})();


var $a6b6a4746468157c$exports = {};

var $apWp0 = parcelRequire("apWp0");
$a6b6a4746468157c$exports = function() {
    Object.caching("plugins").set("plugin", {});
    return function(key, value) {
        if ($apWp0.isObject(key) && !value) {
            const plugins = Object.caching("plugins").get("plugin");
            Object.caching("plugins").set("plugin", Object.assign(plugins, key));
        } else if ($apWp0.isString(key) && value != undefined) {
            const plugins = Object.caching("plugins").get("plugin");
            plugins[key] = value;
            Object.caching("plugins").set("plugin", plugins);
        } else if ($apWp0.isString(key) && value == undefined) return Object.caching("plugins").get("plugin")[key] || {};
    };
}();


var $85cf733e32a19dfe$exports = {};
var $b1bfb376f83f0a2f$exports = {};
parcelRequire("apWp0");
var $a692d954b95d4bfb$exports = {};

var $apWp0 = parcelRequire("apWp0");
// escapeRegExp
function $a692d954b95d4bfb$var$Templating(options) {
    this.options = options;
    this.tag = (this.options && this.options.tag || "{{ }}").split(" ");
    this.lefttag = $apWp0.escapeRegExp(this.tag[0]);
    this.righttag = $apWp0.escapeRegExp(this.tag[1]);
}
$a692d954b95d4bfb$var$Templating.prototype._getTag = function(template) {
    //get the tag in < h1>;
    return template.match(new RegExp("(?<=<)|([^/s]+)(?=>)", "g"))[2];
};
$a692d954b95d4bfb$var$Templating.prototype._bindReplace = function(obj, string) {
    for(let key in obj)if (obj.hasOwnProperty(key)) {
        let pattern = new RegExp(`${this.lefttag}${key}${this.righttag}`, "g");
        pattern && (string = string.replace(pattern, `${obj[key]}`));
    }
    return string;
};
$a692d954b95d4bfb$var$Templating.prototype.replaceString = function(obj, string) {
    return this._bindReplace(obj, string);
};
$a692d954b95d4bfb$var$Templating.prototype._toElement = function(template, tag) {
    let fr = document.createElement("template");
    fr.innerHTML = template;
    return fr.content.children[0];
};
$a692d954b95d4bfb$var$Templating.prototype.createElement = function(data, template, isConvert) {
    // let template = this.template;
    // let data = this.data;
    // let isConvert = this.isConvert;
    if (data) {
        if (data instanceof Array) {
            let isString = typeof template == "string";
            let tag = isString ? this._getTag(template) : template.tagName;
            template = isString ? template : template.outerHTML;
            let els = [];
            for(let d = 0; d < data.length; d++){
                let dd = data[d];
                let bindData = this._bindReplace(dd, template);
                // console.log(42, dd, bindData);
                let element = this._toElement(bindData, tag);
                if (isConvert) element = element.outerHTML;
                els.push(element);
            }
            return els;
        } else if (data instanceof Object) {
            // console.log(template)
            let isString = typeof template == "string";
            let tag = isString ? this._getTag(template) : template.tagName;
            template = isString ? template : template.outerHTML;
            let bindData = this._bindReplace(data, template);
            // console.log(60, this.tag);
            // console.log(61, bindData);
            let element = this._toElement(bindData, tag);
            if (isConvert) element = element.outerHTML;
            return element;
        }
    } else {
        let isString = typeof template == "string";
        let tag = isString ? this._getTag(template) : template.tagName;
        return this._toElement(template, tag);
    }
};
$a692d954b95d4bfb$exports = $a692d954b95d4bfb$var$Templating;


var $b79f4a011f4a4e74$exports = {};

var $apWp0 = parcelRequire("apWp0");
var $e4927455ffbf6a15$export$44487a86467333c3;
var $e4927455ffbf6a15$export$2eaf9172a83ee9e7;
var $e4927455ffbf6a15$export$c1fdfb880e73617c;
$e4927455ffbf6a15$export$44487a86467333c3 = function(st, prop, newValue, prevValue, component) {
    /*
        newValue is null, when emptying the scope;
    */ if (newValue == null) return [];
    if (newValue == prevValue && type != "bind") return [];
    return (()=>{
        let ctx = [];
        let s = st;
        if (s && s.length) for(let i = 0; i < s.length; i++){
            let item = s[i];
            // console.log(item.bind, prop, item);
            if (item.bind == prop) // console.log(type, item);
            ctx.push({
                ...item,
                component: component
            });
        }
        return ctx;
    })();
};
$e4927455ffbf6a15$export$2eaf9172a83ee9e7 = function(st, type, prop, newValue, prevValue, component, update, sel) {
    if (newValue == null) return;
    if (newValue == prevValue && type != "bind") return;
    // if(update.incrementedSels){
    //     console.debug(121,sel, update);
    // };
    var st = (()=>{
        let config = st[component] && st[component][type];
        if (config && config.length) {
            let ctx = [];
            for(let i = 0; i < config.length; i++){
                let item = config[i];
                let test = item.bind == prop && (sel ? item.sel == sel : true);
                if (test) Object.assign(item, update);
            }
            return ctx;
        } else return [];
    })();
    return st;
};
$e4927455ffbf6a15$export$c1fdfb880e73617c = function(configs) {
    /**
     * add config dynanucakky since
     * every element has unique identifier.
     * everytime it is created either in swith or forUpdate;
     */ const cloned1 = [];
    for(let i = 0; i < configs.length; i++){
        const cl = {};
        const item = configs[i];
        for(let key in item)cl[key] = item[key];
        cloned1.push(cl);
    }
    return cloned1.reduce((accu, iter)=>{
        // let {incrementedSels} = iter;
        let incrementedSels = iter.incrementedSels;
        if (incrementedSels && incrementedSels.length) incrementedSels.forEach((ic)=>{
            let cloned = {
                ...iter
            };
            cloned.incrementedSel = ic;
            accu.push(cloned);
        });
        else accu.push(iter);
        return accu;
    }, []);
};


const $b79f4a011f4a4e74$var$getConfig = $e4927455ffbf6a15$export$44487a86467333c3;
const $b79f4a011f4a4e74$var$updateConfig = $e4927455ffbf6a15$export$2eaf9172a83ee9e7;
const $b79f4a011f4a4e74$var$extendConfig = $e4927455ffbf6a15$export$c1fdfb880e73617c;
$b79f4a011f4a4e74$exports = async function(prop, newValue, prevValue, component, html) {
    html = html || document;
    let st = this.storage.get(component, "attr");
    let configs = $b79f4a011f4a4e74$var$getConfig(st, prop, newValue, prevValue, component);
    if (!configs.length) return;
    // console.log(834, newValue);
    // if(!(newValue).toString().includes('Object')){
    //     console.log(852, configs);
    // };
    configs = $b79f4a011f4a4e74$var$extendConfig(configs);
    // if(!(newValue).toString().includes('Object')){
    //     console.table(854, configs);
    // };
    return Promise.all(configs.map((config)=>{
        let data;
        // let {hasNegate, bind, testVal,attr, ops, sel, attrkey, attrvalue, incrementedSel,incrementId} = config;
        let hasNegate = config.hasNegate;
        let bind = config.bind;
        let testVal = config.testVal;
        let attr = config.attr;
        let ops = config.ops;
        let sel = config.sel;
        let attrkey = config.attrkey;
        let attrvalue = config.attrvalue;
        let incrementedSel = config.incrementedSel;
        let incrementId = config.incrementId;
        bind = $apWp0.removeWhiteSpace(bind);
        attr = $apWp0.removeWhiteSpace(attr);
        incrementedSel = newValue.incrementedSel || incrementedSel;
        // console.log(850,incrementedSel);
        if (!!newValue.incrementedSel) // console.log(229, newValue, bind);
        data = newValue[bind];
        else data = newValue;
        // console.log(39, data);
        if (prop == bind) {
            let els = html.querySelectorAll(`[data-attr=${incrementedSel || sel}]:not(.cake-template)`);
            // console.log(839, els, `[data-attr=${incrementedSel || sel}]:not(.cake-template)`);
            // console.log(865,sel,incrementedSel,els);
            // console.log(572, prop, bind, data, sel, els);
            return Promise.all([
                ...els
            ].map((el)=>{
                // console.log(869,el);
                let test = false;
                if (ops) {
                    test = $apWp0.logTest(data, ops, testVal);
                    hasNegate && (test = !test);
                } else if (hasNegate) test = !data;
                else test = !!data;
                // console.log(el, prop, data);
                if (test) {
                    if (attrvalue) el.setAttribute(attrkey, attrvalue);
                    else el.setAttribute(attrkey);
                } else el.removeAttribute(attrkey);
            }));
        }
        newValue = null;
    }));
};


var $eb8a75644e55ed44$exports = {};

var $apWp0 = parcelRequire("apWp0");

const $eb8a75644e55ed44$var$getConfig = $e4927455ffbf6a15$export$44487a86467333c3;
const $eb8a75644e55ed44$var$updateConfig = $e4927455ffbf6a15$export$2eaf9172a83ee9e7;
const $eb8a75644e55ed44$var$extendConfig = $e4927455ffbf6a15$export$c1fdfb880e73617c;
$eb8a75644e55ed44$exports = async function(prop, newValue, prevValue, component, html) {
    html = html || document;
    let st = this.storage.get(component, "bind");
    let configs = $eb8a75644e55ed44$var$getConfig(st, prop, newValue, prevValue, component);
    if (!configs.length) return;
    configs = $eb8a75644e55ed44$var$extendConfig(configs);
    for(let c = 0; c < configs.length; c++){
        let config = configs[c], data;
        // let {attr, bind, sel, incrementedSel,incrementId, incrementedSels} = config;
        let attr = config.attr;
        let bind = config.bind;
        let sel = config.sel;
        let incrementedSel = config.incrementedSel;
        let incrementId = config.incrementId;
        let incrementedSels = config.incrementedSels;
        incrementedSel = newValue.incrementedSel || incrementedSel;
        if (!!newValue.incrementedSel) // console.log(229, newValue, bind);
        data = newValue[bind];
        else data = newValue;
        let attrHyphen = attr.toHyphen();
        if (prop == bind) {
            let els = html.querySelectorAll(`[data-bind=${incrementedSel || sel}]`);
            // console.log(incrementedSel, els);
            for(let p = 0; p < els.length; p++){
                let el = els[p];
                if (attr == "class" || attr == "className") {
                    if (el.classList.length) {
                        // console.log(prevValue);
                        $apWp0.splitBySpace(prevValue, function(cls) {
                            el.classList.remove(cls);
                        });
                        $apWp0.splitBySpace(data, function(cls) {
                            el.classList.add(cls);
                        });
                    } else $apWp0.splitBySpace(data, function(cls) {
                        el.classList.add(cls);
                    });
                } else // if(prop == 'current_balance'){
                //     console.log(262, el, attrHyphen, data,)
                //     console.log(263, config.incrementedSel, newValue.incrementedSel);
                //     console.log(264, newValue, data);
                // };
                if (data != undefined || data != null) {
                    el.setAttribute(attrHyphen, data);
                    el[attr] = data;
                }
            }
        }
    }
    newValue = null;
};


var $56f13ca8aed86d3a$exports = {};

var $apWp0 = parcelRequire("apWp0");

const $56f13ca8aed86d3a$var$getConfig = $e4927455ffbf6a15$export$44487a86467333c3;
const $56f13ca8aed86d3a$var$updateConfig = $e4927455ffbf6a15$export$2eaf9172a83ee9e7;
const $56f13ca8aed86d3a$var$extendConfig = $e4927455ffbf6a15$export$c1fdfb880e73617c;
$56f13ca8aed86d3a$exports = async function(prop, newValue, prevValue, component, html) {
    // console.log(477,prop, newValue, component);
    let st = this.storage.get(component, "class");
    html = html || document;
    let configs = $56f13ca8aed86d3a$var$getConfig(st, prop, newValue, prevValue, component);
    // console.log(478, configs);
    if (!configs.length) return;
    let cache = {};
    configs = $56f13ca8aed86d3a$var$extendConfig(configs);
    // console.log(731, configs);
    for(let c = 0; c < configs.length; c++){
        let config = configs[c], data;
        // let {hasNegate, bind, testVal,className, ops, sel,  incrementedSel,incrementId} = config;
        let hasNegate = config.hasNegate;
        let bind = config.bind;
        let testVal = config.testVal;
        let className = config.className;
        let ops = config.ops;
        let sel = config.sel;
        let incrementedSel = config.incrementedSel;
        let incrementId = config.incrementId;
        bind = $apWp0.removeWhiteSpace(bind);
        incrementedSel = newValue.incrementedSel || incrementedSel;
        if (!!newValue.incrementedSel) // console.log(229, newValue, bind);
        data = newValue[bind];
        else data = newValue;
        if (prop == bind) {
            if (!cache[incrementedSel || sel]) cache[incrementedSel || sel] = html.querySelectorAll(`[data-class=${incrementedSel || sel}]:not(.cake-template)`); //just to convert iterable;
            let els = cache[incrementedSel || sel];
            // component == 'header1' && console.log(759, data,  component);
            for(let p = 0; p < els.length; p++){
                let el = els[p];
                let test = false;
                if (ops) {
                    test = $apWp0.logTest(data, ops, testVal);
                    hasNegate && (test = !test);
                } else if (hasNegate) // test = !data;
                test = data == testVal;
                else test = !!data;
                // component == 'header1' && console.log(503, {data}, {testVal}, {test}, {el}, {className});
                if (test) // console.log('add ',className);
                $apWp0.splitBySpace(className, function(cls) {
                    // console.log(519, data,  ops, testVal, test);
                    const classList = $apWp0.toArray(el.classList);
                    if (!classList.includes(cls)) setTimeout(()=>{
                        el.classList.add(cls);
                    });
                });
                else // console.log('remove ',className);
                $apWp0.splitBySpace(className, function(cls) {
                    const classList = $apWp0.toArray(el.classList);
                    if (classList.includes(cls)) setTimeout(()=>{
                        el.classList.remove(cls);
                    });
                });
            }
        }
    }
    newValue = null;
};


var $c6f8b2a89233e536$exports = {};
parcelRequire("apWp0");
var $9571e813ac86dd6f$exports = {};
function $9571e813ac86dd6f$var$Piece(el) {
    this.el = $9571e813ac86dd6f$var$Piece.toArray(el);
}
$9571e813ac86dd6f$var$Piece.toArray = function(el) {
    let r = [];
    switch(true){
        case el instanceof Array:
            r = el;
            break;
        case el.length && el.tagName && el.tagName != "FORM" && !(el instanceof Array):
            for(let e = 0; e < el.length; e++)r.push(el[e]);
            break;
        case !(el instanceof Array):
            r = [
                el
            ];
            break;
    }
    return r;
};
$9571e813ac86dd6f$var$Piece.prototype.loop = function(callback) {
    try {
        let i = -1, length = this.el.length;
        while(++i < length){
            let el = this.el[i];
            callback(i, el);
        }
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
};
$9571e813ac86dd6f$var$Piece.prototype.getElements = function() {
    return this.el;
};
$9571e813ac86dd6f$var$Piece.prototype.getElement = function(index = 0) {
    return this.el[index];
};
$9571e813ac86dd6f$var$Piece.prototype.remove = function() {
    let i = -1, length = this.el.length;
    let fg = document.createDocumentFragment();
    while(++i < length){
        let el = this.el[i];
        el && fg.appendChild(el);
    // el  && el.remove();
    }
    fg = null;
    return true;
};
$9571e813ac86dd6f$var$Piece.prototype.replaceDataSrc = function() {
    return this.loop(function(index, el) {
        el.replaceDataSrc();
    });
// let els = this.el[0];
// let srcs = els.querySelectorAll('[data-src]');
// for (let s = 0; s < srcs.length; s++){
//     el = srcs[s];
//     el.setAttribute('src', el.dataset.src);
//     el.removeAttribute('data-src');
// };
};
$9571e813ac86dd6f$var$Piece.cloneNode = function(el) {
    el = el instanceof Array ? el : this.toArray(el);
    let a = [];
    for(let e = 0; e < el.length; e++)a.push(el[e].cloneNode(true));
    return new $9571e813ac86dd6f$var$Piece(a);
};
$9571e813ac86dd6f$var$Piece.prototype.dataset = function(data, cb) {
    let l = this.el.length;
    let i = -1;
    while(++i < l)if (this.el[i].dataset[data]) {
        let exec = cb(this.el[i]);
        if (exec == "break") break;
    }
    return true;
};
$9571e813ac86dd6f$var$Piece.prototype.getContainers = function() {
    return this.getElementsByDataset("container").container;
};
$9571e813ac86dd6f$var$Piece.prototype.cloneNode = function(el) {
    el = this.el;
    return $9571e813ac86dd6f$var$Piece.cloneNode(el);
};
$9571e813ac86dd6f$var$Piece.prototype.getAllElements = function() {
    let length = this.el.length;
    let r = [];
    switch(true){
        case length == 1:
            r = this.el[0].getElementsByTagName("*").toArray();
            break;
        case length > 1:
            {
                let i = -1;
                while(++i < length){
                    let el = this.el[i];
                    let q = el.getElementsByTagName("*");
                    if (q) for(let i1 = 0; i1 < q.length; i1++)r.push(q[i1]);
                }
            }
            break;
    }
    return r;
};
$9571e813ac86dd6f$var$Piece.prototype.appendTo = function(root, cleaned) {
    if (!root && !root.attributes) throw new TypeError(`the ${root} is not an instance of Element`);
    cleaned && (root.innerHTML = "");
    for(let i = 0; i < this.el.length; i++){
        let el = this.el[i];
        root.appendChild(el);
    }
};
$9571e813ac86dd6f$var$Piece.prototype.getElementsByTagName = function(tag) {
    let length = this.el.length;
    let r = [];
    switch(true){
        case length == 1:
            r = this.el[0].getElementsByTagName(id).toArray();
            break;
        case length > 1:
            {
                let i = -1;
                while(++i < length){
                    let el = this.el[i];
                    let q = el.getElementsByTagName(selector);
                    if (q) for(let i2 = 0; i2 < q.length; i2++)r.push(q[i2]);
                }
            }
            break;
    }
    return r;
};
$9571e813ac86dd6f$var$Piece.prototype.getElementById = function(ids) {
    let length = this.el.length;
    let r = [];
    switch(true){
        case length == 1:
            r = this.el[0].getElementById(id);
            break;
        case length > 1:
            {
                let i = -1;
                while(++i < length){
                    let el = this.el[i];
                    let q = el.querySelector(selector);
                    if (q) r.push(q);
                }
            }
            break;
    }
    return r;
};
$9571e813ac86dd6f$var$Piece.prototype.querySelectorAll = function(selector) {
    let length = this.el.length;
    let r = [];
    switch(true){
        case length == 1:
            r = this.el[0].querySelectorAll(selector);
            break;
        case length > 1:
            {
                let els = [];
                let i = -1;
                while(++i < length){
                    let el = this.el[i];
                    let q = el.querySelectorAll(selector);
                    q && (r = r.concat(q.toArra()));
                }
            }
            break;
        default:
            r = [];
    }
    return r;
};
$9571e813ac86dd6f$var$Piece.prototype.querySelector = function(selector) {
    let length = this.el.length;
    let r = [];
    switch(true){
        case length == 1:
            r = this.el[0].querySelector(selector);
            break;
        case length > 1:
            {
                let i = -1;
                while(++i < length){
                    let el = this.el[i];
                    let q = el.querySelector(selector);
                    if (q) r.push(q);
                }
            }
            break;
    }
    return r;
};
$9571e813ac86dd6f$var$Piece.prototype.querySelectorIncluded = function(selector, attr, val) {
    let length = this.el.length;
    let r = [];
    switch(true){
        case length == 1:
            r = this.el[0].querySelectorIncluded(selector, attr, val);
            break;
        case length > 1:
            {
                let i = -1;
                while(++i < length){
                    let el = this.el[i];
                    let q = el.querySelectorIncluded(selector, attr, val);
                    q && r.push(q);
                }
            }
            break;
    }
    return r;
};
$9571e813ac86dd6f$var$Piece.prototype.querySelectorAllIncluded = function(selector, attr, val) {
    let length = this.el.length;
    let r = [];
    switch(true){
        case length == 1:
            r = this.el[0].querySelectorAllIncluded(selector, attr, val);
            break;
        case length > 1:
            {
                let i = -1;
                while(++i < length){
                    let el = this.el[i];
                    let q = el.querySelectorAllIncluded(selector, attr, val);
                    q && (r = r.concat(q.toArra()));
                }
            }
            break;
    }
    return r;
};
$9571e813ac86dd6f$var$Piece.prototype.contains = function(el) {
    let length = this.el.length, test = false;
    switch(length == 1){
        case true:
            test = this.el[0].contains(el);
            break;
        case false:
            {
                let index = -1;
                while(++index < length){
                    let _el = this.el[index];
                    if (_el.contains(el)) {
                        test = true;
                        break;
                    }
                }
            }
            break;
    }
    return test;
};
$9571e813ac86dd6f$var$Piece.prototype.getElementsByDataset = function() {
    let arg, sel, i, a, el, query;
    arg = arguments;
    o = {};
    length = arg.length;
    i = -1;
    a = -1;
    while(++i < this.el.length){
        el = this.el[i];
        while(++a < length){
            sel = arg[a];
            if (el.getAttribute(`data-${sel}`)) o[sel] = [
                el
            ];
            else o[sel] = [];
            query = el.querySelectorAll(`[data-${sel}]`);
            if (query.length) o[sel] = o[sel].concat([
                ...query
            ]);
        }
    }
    return o;
};
$9571e813ac86dd6f$exports = $9571e813ac86dd6f$var$Piece;





const $c6f8b2a89233e536$var$getConfig = $e4927455ffbf6a15$export$44487a86467333c3;
const $c6f8b2a89233e536$var$updateConfig = $e4927455ffbf6a15$export$2eaf9172a83ee9e7;
const $c6f8b2a89233e536$var$extendConfig = $e4927455ffbf6a15$export$c1fdfb880e73617c;
$c6f8b2a89233e536$exports = async function(prop, newValue, prevValue, component1, html) {
    html = html || document;
    let st = this.storage.get(component1, "forUpdate");
    let configs = $c6f8b2a89233e536$var$getConfig(st, prop, newValue, prevValue, component1);
    if (!configs.length) return;
    let templating = new $a692d954b95d4bfb$exports($a6b6a4746468157c$exports("templating"));
    // console.log(configs)
    // console.log(206, prop, newValue, component);
    // console.log(23, this.sts);
    const attrPayload = [];
    for(let c = 0; c < configs.length; c++){
        // let {bind, sel, iter, ins, targets} = configs[c];
        let bind = configs[c].bind;
        let sel = configs[c].sel;
        let iter = configs[c].iter;
        let ins = configs[c].ins;
        let targets = configs[c].targets;
        // let index = -1;
        for(let o in newValue)if (newValue.hasOwnProperty(o)) {
            let targets = document.querySelectorAll(`[data-for-update-bind=${o}]`);
            // console.log(467, targets);
            // const row = newValue[o];
            // index += 1;
            for(let t = 0; t < targets.length; t++){
                let target = targets[t];
                let binded = target.dataset.forUpdateBind;
                // console.log({binded})
                // console.log({target})
                if (!target.dataset.forTemplate) target.remove();
                else {
                    let template = target.cloneNode(true);
                    template.style.removeProperty("display");
                    template.classList.remove("cake-template");
                    let dataForIteration = newValue[binded];
                    // console.log({dataForIteration})
                    let i = -1;
                    l = dataForIteration.length;
                    while(++i < l){
                        let item = dataForIteration[i];
                        let index = i;
                        for(let lt = 0; lt < this.logicalType.length; lt++){
                            let type = this.logicalType[lt];
                            const logicalHtml = new $9571e813ac86dd6f$exports(target).querySelectorAllIncluded(`[data-${type}]`);
                            for(let l = 0; l < logicalHtml.length; l++){
                                const hit = logicalHtml[l];
                                // console.log(550, hit, hit.dataset[type]);
                                if (hit.dataset[type]) {
                                    let sel = hit.dataset[type];
                                    let incrementedSel = `${sel}-${index}`;
                                    template.dataset[type] = incrementedSel;
                                    let bind = this.getWatchItemsBySel(component1, type, sel).bind;
                                    if (bind.includes(".")) {
                                        let split = bind.split(".");
                                        binded = split[0];
                                        for(let key in item){
                                            let value = item[key];
                                            let _key = `${binded}.${key}`;
                                            item[_key] = value;
                                        }
                                    }
                                    if (sel) attrPayload.push({
                                        _type: type,
                                        ...item,
                                        incrementedSel: incrementedSel,
                                        sel: sel,
                                        bind: bind,
                                        incrementId: index,
                                        component: component1
                                    });
                                }
                            }
                        }
                        let create = templating.createElement(item, template, false);
                        // console.log(create);
                        create.classList.remove("cake-template");
                        create.removeAttribute("data-for-template");
                        target.insertAdjacentElement("beforebegin", create);
                        if (target.parentElement.tagName == "SELECT") target.parentElement.selectedIndex = 0;
                    }
                }
            }
        }
    }
    newValue = null;
    // console.log(attrPayload);
    // console.log(185, attrPayload);
    return Promise.all(attrPayload.map((payload)=>{
        // const {bind, _type, component, incrementedSel, sel} = payload;
        const bind = payload.bind;
        const _type = payload._type;
        const component = payload.component;
        const incrementedSel = payload.incrementedSel;
        const sel = payload.sel;
        const name = `notify${_type.toProper()}`;
        // console.log(665, {incrementedSel});
        $c6f8b2a89233e536$var$updateConfig(_type, bind, payload, null, component, {
            incrementedSel: incrementedSel
        }, sel);
        return this[name](bind, payload, null, component);
    })).then(()=>{
    // console.log('finish setting attribute', component);
    });
};


var $7d7ca8b4136f1b9a$exports = {};
parcelRequire("apWp0");


var $3d502eb2350f1e24$exports = {};
const $3d502eb2350f1e24$var$storage = {};
function $3d502eb2350f1e24$var$subscribeExternal() {
    let component = $3d502eb2350f1e24$var$storage[name];
    if (component) {
        if (cb instanceof Function) {
            let name = cb.name;
            if (ctx) cb = cb.bind(ctx);
            cb.binded = "external";
            cb.original = name;
            cb.listenTo = component.name;
            component.Subscribe(cb);
        }
    }
}
window.ComponentStorage = $3d502eb2350f1e24$var$storage;
$3d502eb2350f1e24$exports = {
    subscribe (cb, ctx) {
        return new Promise((res, rej)=>{
            let lk = setInterval(()=>{
                if ($3d502eb2350f1e24$var$storage[name]) {
                    $3d502eb2350f1e24$var$subscribeExternal();
                    clearInterval(lk);
                    res();
                }
            });
        });
    },
    set (componentName, component) {
        $3d502eb2350f1e24$var$storage[componentName] = component;
        return true;
    },
    get (componentName) {
        return $3d502eb2350f1e24$var$storage[componentName];
    }
};



const $7d7ca8b4136f1b9a$var$getConfig = $e4927455ffbf6a15$export$44487a86467333c3;
const $7d7ca8b4136f1b9a$var$updateConfig = $e4927455ffbf6a15$export$2eaf9172a83ee9e7;
const $7d7ca8b4136f1b9a$var$extendConfig = $e4927455ffbf6a15$export$c1fdfb880e73617c;
$7d7ca8b4136f1b9a$exports = async function(prop, newValue, prevValue, component1, html) {
    // console.log(12, this.sts);
    let sts = this.storage.get(component1);
    // console.log(18, st);
    let templating = new $a692d954b95d4bfb$exports($a6b6a4746468157c$exports("templating"));
    return new Promise((res, rej)=>{
        try {
            let configs = $7d7ca8b4136f1b9a$var$getConfig(this.storage.get(component1, "for"), prop, newValue, prevValue, component1);
            let switchConfig = $7d7ca8b4136f1b9a$var$getConfig(this.storage.get(component1, "switch"), prop, newValue, prevValue, component1);
            // console.log(27, switchConfig);
            if (!configs.length) return;
            let data1 = newValue.reduce((accu, item)=>{
                accu.push(item);
                return accu;
            }, []);
            newValue = null;
            for(let c = 0; c < configs.length; c++){
                // let {bind, sel, iter, ins, component, cleaned} = configs[c];
                let bind1 = configs[c].bind;
                let sel1 = configs[c].sel;
                let iter = configs[c].iter;
                let ins = configs[c].ins;
                let component = configs[c].component;
                let cleaned = configs[c].cleaned;
                // html = Cake.Components[component].html;
                html = $3d502eb2350f1e24$exports.get(component).html;
                let target = html.querySelectorIncluded(`[data-for-template=${sel1}]`);
                let cloned = target.cloneNode(true);
                (()=>{
                    data1 = data1.map((item)=>{
                        for(let key in item)// console.log(64, key, item[key]);
                        if (item.hasOwnProperty(key)) item[`${iter}.${key}`] = item[key];
                        return item;
                    });
                })();
                let hasReplaced = [];
                (()=>{
                    let increment = 0;
                    Object.keys(sts).forEach((key1)=>{
                        if (![
                            "for",
                            "evt",
                            "animate",
                            "switch"
                        ].includes(key1)) {
                            let conf = sts[key1];
                            let temp = conf[0];
                            //    let {bind} = temp || {};
                            let bind = temp && temp.bind || undefined;
                            if (bind && bind.match(new RegExp(templating.lefttag), "g")) {
                                data1.forEach((item, index)=>{
                                    let o = {};
                                    o.bind = templating.replaceString(item, bind);
                                    o.sel = `${temp.sel}-${increment}`;
                                    o.rawsel = temp.sel;
                                    increment += 1;
                                    //data binding to the element selector;
                                    data1[index].__sel = o.sel;
                                    for(let key in temp){
                                        if (temp.hasOwnProperty(key)) {
                                            if (!o[key]) o[key] = temp[key];
                                        }
                                    }
                                    conf.push(o);
                                });
                                hasReplaced.push(key1);
                            }
                        }
                    });
                })();
                (()=>{
                    if (cleaned) {
                        let parent = target.parentElement;
                        parent.children.toArray().forEach((child)=>{
                            if (child.dataset.for && !child.classList.contains("cake-template")) child.remove();
                        });
                    }
                    let i = -1;
                    l = data1.length;
                    data1.forEach((item1, index)=>{
                        let template1 = target.cloneNode(true);
                        //switch;
                        (()=>{
                            if (switchConfig && !switchConfig.length) return;
                            // const [{bind, map, sel, cases}] = switchConfig;
                            let bind4 = switchConfig[0].bind;
                            let map = switchConfig[0].map;
                            let sel = switchConfig[0].sel;
                            let cases = switchConfig[0].cases;
                            const mapping = item1[map];
                            const switchElement = template1.querySelector(`[data-switch=${sel}]`);
                            let hitCase = cases.find((item2)=>{
                                let _id = item2._id;
                                let bind = item2.bind;
                                if (bind.includes("|")) return bind.split("|").map((item)=>item.trim()).some((item)=>item == mapping);
                                else return bind == mapping;
                            });
                            const find = cloned.querySelector(`[data-case=${sel}-${hitCase._id}]`);
                            find.classList.remove("cake-template");
                            switchElement.innerHTML = find.outerHTML;
                        // switchElement.parentNode.replaceChild(find, switchElement);
                        })();
                        let create1 = templating.createElement(item1, template1, false);
                        (()=>{
                            Object.keys(sts).forEach((key)=>{
                                if (hasReplaced.includes(key)) {
                                    let conf = sts[key];
                                    let cf1 = conf.find((cf)=>{
                                        return cf.sel == item1.__sel;
                                    });
                                    if (cf1) {
                                        let rawsel = cf1.rawsel;
                                        if (rawsel) {
                                            let get = create1.querySelector(`[data-${key}=${rawsel}]`);
                                            get.dataset[key] = cf1.sel;
                                        }
                                    }
                                }
                            });
                        })();
                        (()=>{
                            // create.style.display = 'block';
                            create1.style.removeProperty("display");
                            create1.classList.remove("cake-template");
                            create1.removeAttribute("data-for-template");
                            target.insertAdjacentElement("beforebegin", create1);
                        })();
                        (()=>{
                            const children = configs[0] && configs[0].children;
                            if (!children) return;
                            children.forEach((child)=>{
                                const forAutoElement = create1.querySelector(`[data-for=${child}]`);
                                if (forAutoElement) {
                                    const dataBindKey = forAutoElement.dataset.forAutoBindKey;
                                    const dataBindValue = forAutoElement.dataset.forAutoBindValue;
                                    const iteration = forAutoElement.dataset.forIter;
                                    const datas = item1[iteration];
                                    if (datas) for(let d = 0; d < datas.length; d++){
                                        let data = datas[d];
                                        let template = forAutoElement.cloneNode(true);
                                        let create = templating.createElement(data, template, false);
                                        create.style.removeProperty("display");
                                        create.classList.remove("cake-template");
                                        create.removeAttribute("data-for-template");
                                        forAutoElement.insertAdjacentElement("beforebegin", create);
                                    }
                                    const select = forAutoElement.closest("SELECT");
                                    if (select) select.selectedIndex = 0;
                                }
                            });
                        })();
                        create1.replaceDataSrc();
                    // let safeSrc = create.replaceDataSrc();
                    // if (safeSrc){
                    //     for (let s = 0; s < safeSrc.length; s++){
                    //         let el = safeSrc[s];
                    //         el.src = el.dataset.src;
                    //         el.removeAttribute('data-src');
                    //     };
                    // };
                    });
                    res();
                })();
            }
            data1 = null;
        } catch (err) {
            rej(err);
        }
    });
};


var $62c50da9ce37234f$exports = {};

var $apWp0 = parcelRequire("apWp0");

const $62c50da9ce37234f$var$getConfig = $e4927455ffbf6a15$export$44487a86467333c3;
const $62c50da9ce37234f$var$updateConfig = $e4927455ffbf6a15$export$2eaf9172a83ee9e7;
const $62c50da9ce37234f$var$extendConfig = $e4927455ffbf6a15$export$c1fdfb880e73617c;
$62c50da9ce37234f$exports = async function(prop, newValue, prevValue, component, html) {
    html = html || document;
    // console.log(605,prop, newValue);
    let st = this.storage.get(component, "if");
    let configs = $62c50da9ce37234f$var$getConfig(st, prop, newValue, prevValue, component);
    // console.log(603, configs);
    if (!configs.length) return;
    configs = $62c50da9ce37234f$var$extendConfig(configs);
    let cache = {};
    // console.log(610, configs);
    for(let c = 0; c < configs.length; c++){
        let config = configs[c];
        /**
         * the incremetedSel is not null when this is called within a loop or data-for;
         */ // let {attr, bind, sel, testval, _true, _false, ops, hasNegate, incrementedSel,incrementId} = config;
        let attr = config.attr;
        let bind = config.bind;
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
        if (prop == bind) {
            if (!cache[sel]) // console.log(incrementedSel, sel,`[data-if=${incrementedSel || sel}]:not(.cake-template)`);
            cache[sel] = html.querySelectorAll(`[data-if=${incrementedSel || sel}]:not(.cake-template)`); //just to convert iterable;
            let els = cache[sel];
            // console.log(624,els, newValue);
            for(let p = 0; p < els.length; p++){
                let el = els[p];
                let data = newValue; //it can accept, el with data-if-bind and none;
                let test;
                if (testval) test = $apWp0.logTest(testval, ops, data);
                else test = hasNegate ? !data : !!data;
                if (test) {
                    if (trueNotIgnore) {
                        if (attr == "class") {
                            let trueClasses = _true.split(" ");
                            if (falseNotIgnore) {
                                let falseClasses = _false.split(" ");
                                falseClasses.forEach((cls)=>{
                                    el.classList.remove(cls);
                                });
                                trueClasses.forEach((cls)=>{
                                    el.classList.add(cls);
                                });
                            } else trueClasses.forEach((cls)=>{
                                if (!el.classList.contains(cls)) el.classList.add(cls);
                            });
                        } else if (data[_true]) el.setAttribute(attr, data[_true]);
                    }
                } else if (falseNotIgnore) {
                    if (attr == "class") {
                        let falseClasses = _false.split(" ");
                        if (trueNotIgnore) {
                            let trueClasses = _true.split(" ");
                            trueClasses.forEach((cls)=>{
                                el.classList.remove(cls);
                            });
                            falseClasses.forEach((cls)=>{
                                el.classList.add(cls);
                            });
                        } else trueClasses.forEach((cls)=>{
                            if (!el.classList.contains(cls)) el.classList.add(cls);
                        });
                    } else el.setAttribute(attr, _false);
                }
            }
        }
    }
    newValue = null;
};


var $9dd442cb0165f7be$exports = {};
parcelRequire("apWp0");

const $9dd442cb0165f7be$var$getConfig = $e4927455ffbf6a15$export$44487a86467333c3;
const $9dd442cb0165f7be$var$updateConfig = $e4927455ffbf6a15$export$2eaf9172a83ee9e7;
const $9dd442cb0165f7be$var$extendConfig = $e4927455ffbf6a15$export$c1fdfb880e73617c;
$9dd442cb0165f7be$exports = async function(prop, newValue, prevValue, component, html) {
    html = html || document;
    let st = this.storage.get(component, "model");
    let configs = $9dd442cb0165f7be$var$getConfig(st, prop, newValue, prevValue, component);
    if (!configs.length) return;
    for(let c = 0; c < configs.length; c++){
        let config = configs[c];
        // let {attr, bind, sel} = config;
        let attr = config.attr;
        let bind = config.bind;
        let sel = config.sel;
        let attrHyphen = attr.toHyphen();
        if (prop == bind) {
            let els = html.querySelectorAll(`[data-model=${sel}]`);
            for(let p = 0; p < els.length; p++){
                let el = els[p];
                if (attr == "className") {
                    if (prevValue) {
                        if (newValue) el.classList.replace(prevValue, newValue);
                        else el.classList.remove(prevValue);
                    } else el.classList.add(newValue);
                } else {
                    el.setAttribute(attrHyphen, newValue);
                    el[attr] = newValue;
                }
            }
        }
    }
    newValue = null;
};


var $067bd08e61a8c974$exports = {};
parcelRequire("apWp0");

const $067bd08e61a8c974$var$getConfig = $e4927455ffbf6a15$export$44487a86467333c3;
const $067bd08e61a8c974$var$updateConfig = $e4927455ffbf6a15$export$2eaf9172a83ee9e7;
const $067bd08e61a8c974$var$extendConfig = $e4927455ffbf6a15$export$c1fdfb880e73617c;
$067bd08e61a8c974$exports = async function(prop, newValue, prevValue, component, html) {
    html = html || document;
    let st = this.storage.get(component, "toggle");
    // console.log(8, this.sts);
    let configs = $067bd08e61a8c974$var$getConfig(st, prop, newValue, prevValue);
    // if (!configs.length) return;
    if (!configs) return;
    configs = $067bd08e61a8c974$var$extendConfig(configs);
    html = html || document;
    for(let s = 0; s < configs.length; s++){
        let sub = configs[s];
        if (!sub) continue;
        // let {sel, bind, value, ops} = sub;
        let sel = sub.sel;
        let bind = sub.bind;
        let value = sub.value;
        let ops = sub.ops;
        let el = html.querySelector(`[data-toggle=${sel}]`);
        //TODO
        if (value == prevValue) el && el.classList.remove("is-active");
        if (value == newValue) {
            if (el) {
                if (el.classList.contains("is-active")) el.classList.remove("is-active");
                el && el.classList.add("is-active");
            }
        }
    }
    newValue = null;
};


var $d7ba9c411c9bd4e4$exports = {};
function $d7ba9c411c9bd4e4$var$storage() {
    this.store = {};
}
$d7ba9c411c9bd4e4$var$storage.prototype.set = function(f, s, obj) {
    let store = this.store;
    switch(true){
        case !store[f]:
            store[f] = {};
        case !store[f][s]:
            store[f][s] = [];
        default:
            store[f][s].push(obj);
            break;
    }
};
$d7ba9c411c9bd4e4$var$storage.prototype.get = function(component, attr) {
    let store = this.store;
    if (component && attr) return store[component] && store[component][attr] || [];
    if (component && !attr) return store[component] || {};
};
$d7ba9c411c9bd4e4$exports = $d7ba9c411c9bd4e4$var$storage;


// const notifyForAuto = require('./attrib/data-for-auto');
// const notifySwitch = require('./attrib/data-switch');
// const st = {};
// 
function $b1bfb376f83f0a2f$var$Attrib() {
    this.uiid = 0;
    this.notify = {};
    this.sts = {};
    this.storage = new $d7ba9c411c9bd4e4$exports();
    this.logicalType = [
        "if",
        "bind",
        "switch",
        "toggle",
        "class",
        "attr"
    ];
}
$b1bfb376f83f0a2f$var$Attrib.prototype.notifyFor = $7d7ca8b4136f1b9a$exports;
$b1bfb376f83f0a2f$var$Attrib.prototype.notifyForUpdate = $c6f8b2a89233e536$exports;
$b1bfb376f83f0a2f$var$Attrib.prototype.notifyClass = $56f13ca8aed86d3a$exports;
$b1bfb376f83f0a2f$var$Attrib.prototype.notifyBind = $eb8a75644e55ed44$exports;
$b1bfb376f83f0a2f$var$Attrib.prototype.notifyAttr = $b79f4a011f4a4e74$exports;
$b1bfb376f83f0a2f$var$Attrib.prototype.notifyIf = $62c50da9ce37234f$exports;
$b1bfb376f83f0a2f$var$Attrib.prototype.notifyModel = $9dd442cb0165f7be$exports;
$b1bfb376f83f0a2f$var$Attrib.prototype.notifyToggle = $067bd08e61a8c974$exports;
/*
    watch for the (name) which is registered to the scope
    get all attribute with that name,
    get all component holding that (name),
    and notify them;
*/ $b1bfb376f83f0a2f$var$Attrib.prototype.notifier = function(prop, newValue, prevValue, component) {
    // console.time('attr');
    // console.log(47, newValue);
    if (newValue == undefined) return Promise.resolve();
    let val1 = JSON.parse(JSON.stringify(newValue));
    // if(Utils.isObject(val)){
    //     val = JSON.parse(JSON.stringify(newValue));
    // };
    const equiv = {
        for: "For",
        forUpdate: "ForUpdate",
        // switch:'Switch',
        toggle: "Toggle",
        bind: "Bind",
        // model:'Model',
        if: "If",
        class: "Class",
        attr: "Attr"
    };
    let hits1 = Object.caching("AttribProp").get(prop) || (()=>{
        let hits = {};
        const actions = Object.keys(equiv);
        // const configs = this.sts[component];
        const configs = this.storage.get(component);
        if (!configs) return [];
        for(let a = 0; a < actions.length; a++){
            const action = actions[a];
            const vals = configs[action];
            if (vals) for(let v = 0; v < vals.length; v++){
                const val = vals[v];
                // const {bind} = val;
                const bind = val.bind;
                if (bind == prop) hits[action] = true;
            }
        }
        hits = Object.keys(hits);
        Object.caching("AttribProp").set(prop, hits);
        return hits;
    })();
    return new Promise((res, rej)=>{
        try {
            let l = hits1.length;
            let index = 0;
            const rec = ()=>{
                if (l > index) {
                    let attr = hits1[index];
                    const name = equiv[attr];
                    index += 1;
                    this[`notify${name}`](prop, val1, prevValue, component).then(()=>{
                        rec();
                    });
                } else res();
            };
            rec();
        } catch (err) {
            rej(err.message);
        }
    });
};
$b1bfb376f83f0a2f$var$Attrib.prototype.registerNotifier = function(component, fn) {
    if (!this.notify[component]) this.notify[component] = [];
    this.notify[component].push(fn);
};
$b1bfb376f83f0a2f$var$Attrib.prototype.getEventTarget = function(component) {
    let id = `${component}`;
    let target = Object.caching("getEventTarget").get(id);
    if (!target) {
        let cf = this.storage.get(component);
        target = cf && cf.evt ? cf.evt : [];
        Object.caching("getEventTarget").set(id, target);
    }
    return target;
};
$b1bfb376f83f0a2f$var$Attrib.prototype.getRouterTarget = function(component) {
    let id = `${component}`;
    let target = Object.caching("getRouterTarget").get(id);
    if (!target) {
        let cf = this.storage.get(component);
        target = cf && cf.router ? cf.router : [];
        Object.caching("getRouterTarget").set(id, target);
    }
    return target;
};
$b1bfb376f83f0a2f$var$Attrib.prototype.getWatchItems = function(component) {
    let id = `${component}`;
    let target = Object.caching("getWatchItems").get(id);
    if (!target) {
        let _st = this.storage.get(component);
        let wt = new Set;
        for(let type in _st)if (_st.hasOwnProperty(type)) {
            let tst = _st[type];
            for(let t = 0; t < tst.length; t++){
                let item = tst[t];
                // let {bind} = item;
                let bind = item.bind;
                if (bind) wt.add(bind);
                else continue;
            }
        }
        target = [
            ...wt
        ];
        Object.caching("getWatchItems").set(id, target);
    }
    return target;
};
$b1bfb376f83f0a2f$var$Attrib.prototype.getConfig = function(component) {
    return this.storage.get(component);
};
$b1bfb376f83f0a2f$var$Attrib.prototype.getWatchItemsByType = function(component, type) {
    let id = `${component}-${type}`;
    let target = Object.caching("getWatchItemsByType").get(id);
    if (!target) {
        let _st = this.storage.get(component);
        let tst = _st[type] || [];
        let wt = new Set();
        for(let t = 0; t < tst.length; t++){
            let item = tst[t];
            // let {bind} = item;
            let bind = item.bind;
            switch(!!bind){
                case true:
                    wt.add(bind);
                    break;
                default:
                    switch(true){
                        case type == "animate" || type == "toggle":
                            wt.constructor.name = "Set";
                            wt = [];
                            wt.push(item);
                    }
            }
        }
        target = [
            ...wt
        ];
        Object.caching("getWatchItemsByType").set(id, target);
    }
    return target;
};
$b1bfb376f83f0a2f$var$Attrib.prototype.getWatchItemsBySel = function(component, type, sel) {
    let id = `${component}-${type}-${sel}`;
    let target = Object.caching("watchItemsBySel").get(id);
    if (!target) {
        // let array = this.sts[component][type];
        let array = this.storage.get(component, type);
        let find = array.find((item)=>{
            return item.sel == sel;
        });
        target = find ? find : false;
        Object.caching("watchItemsBySel").set(id, target);
    }
    return target;
};
$b1bfb376f83f0a2f$var$Attrib.prototype._activateReactive = (component)=>{};
$b1bfb376f83f0a2f$var$Attrib.prototype._register = function(f, s, obj) {
    return this.storage.set(f, s, obj);
};
$b1bfb376f83f0a2f$var$Attrib.prototype._static = function(component) {
    return function(qs, isStatic) {
        let els = [];
        // console.log(component, qs, isStatic)
        for(let t = 0; t < qs.length; t++){
            let el = qs[t];
            // console.log(el);
            switch(isStatic){
                case false:
                    els.push(el);
                    break;
                case true:
                    {
                        let dComponent = el.closest("[data-component]");
                        // console.log(dComponent ,component);
                        dComponent = dComponent && dComponent.dataset.component;
                        switch(dComponent == component){
                            case true:
                                els.push(el);
                                break;
                        }
                    }
                    break;
                default:
                    continue;
            }
        }
        // console.log(els, component);
        return els;
    };
};
$b1bfb376f83f0a2f$var$Attrib.prototype._compileEvents = function(events, component, isStatic) {
    return new Promise((res)=>{
        // console.log(component, events,isStatic)
        if (!events.length) {
            res();
            return;
        }
        let els = this._static(component)(events, isStatic);
        // console.log(els,component);
        if (!els.length) {
            res();
            return;
        }
        for(let e = 0; e < els.length; e++){
            let id = `cke${this.uiid}`;
            let el = els[e];
            let splitted = el.dataset.event.removeSpace().split(",");
            for(let s = 0; s < splitted.length; s++){
                let _sp1 = splitted[s].split(":");
                let event = _sp1[0];
                let cb = _sp1[1];
                // let [event, cb] = splitted[s].split(':');
                this._register(component, "evt", {
                    event: event,
                    sel: id,
                    cb: cb
                });
                el.dataset.event = id;
                this.uiid++;
            }
        }
        res();
    });
};
$b1bfb376f83f0a2f$var$Attrib.prototype._compileToggle = function(toggles, component, isStatic) {
    return new Promise((res)=>{
        if (!toggles.length) {
            res();
            return;
        }
        let els = this._static(component)(toggles, isStatic);
        if (!els.length) {
            res();
            return;
        }
        let c = {};
        for(let t = 0; t < toggles.length; t++){
            let id = `ckt${this.uiid}`;
            let el = toggles[t];
            let ns = el.dataset.toggle;
            if (c[ns]) id = c[ns];
            this._register(component, "toggle", {
                sel: id,
                name: "ns-" + ns
            });
            el.dataset.toggle = id;
            this.uiid++;
            c[ns] = id;
        }
        c = {};
        res();
    });
};
$b1bfb376f83f0a2f$var$Attrib.prototype._compileFor = function(fors, component, isStatic, el1) {
    return new Promise((res)=>{
        let target = el1;
        if (!fors.length) {
            res();
            return;
        }
        let els = this._static(component)(fors, isStatic);
        // console.log(component, els)
        if (!els.length) {
            res();
            return;
        }
        let o = {};
        for(let f = 0; f < els.length; f++){
            let id = `ckf${this.uiid}`;
            o[id] = {};
            let el = els[f];
            let fr = el.dataset.for;
            let autoBind = el.dataset.forAutoBind;
            let isCleaned = el.dataset.forCleaned == undefined || el.dataset.forCleaned == "true";
            // let [a, b, c] = fr.split(" ");
            let _sp1 = fr.split(" ");
            let a = _sp1[0];
            let b = _sp1[1];
            let c = _sp1[2];
            if (autoBind) {
                let iteration = el.dataset.forIter;
                let split = autoBind.split(":");
                let autoBindKey = split[0] && split[0].trim();
                let autoBindValue = split[1] && split[1].trim();
                o[id] = {
                    iteration: iteration
                };
                // console.log(342, iter);
                el.dataset.forAutoBindKey = autoBindKey;
                el.dataset.forAutoBindValue = autoBindValue;
                el.removeAttribute("data-for-auto-bind");
            }
            el.style.display = "none";
            el.classList.add("cake-template");
            el.dataset.for = id;
            el.dataset.forTemplate = id;
            o[id] = Object.assign(o[id], {
                bind: c,
                sel: id,
                iter: a,
                ins: b,
                cleaned: isCleaned
            });
            ++this.uiid;
            if (f != 0) {
                let parent = el.parentElement && el.parentElement.closest("[data-for]");
                if (!parent) continue;
                let parentIsFor = !!parent.dataset.for;
                if (target.contains(parent) && parentIsFor) {
                    let parentId = parent.dataset.for;
                    let parentCf = o[parentId];
                    if (parentCf && !parentCf.children) parentCf.children = [
                        id
                    ];
                    else if (parentCf) parentCf.children.push(id);
                }
            }
        }
        for(let key in o)if (o.hasOwnProperty(key)) this._register(component, "for", o[key]);
        res();
    });
};
$b1bfb376f83f0a2f$var$Attrib.prototype._compileForUpdate = function(fors, component, isStatic) {
    return new Promise((res)=>{
        if (!fors.length) {
            res();
            return;
        }
        let els = this._static(component)(fors, isStatic);
        if (!els.length) {
            res();
            return;
        }
        for(let f = 0; f < els.length; f++){
            let id = `ckfu${this.uiid}`;
            let el = els[f];
            let fr = el.dataset.forUpdate;
            el.style.display = "none";
            el.classList.add("cake-template");
            el.dataset.forUpdate = id;
            if (!el.dataset.for) el.dataset.forTemplate = id;
            let _sp1 = fr.split(" ");
            let a = _sp1[0];
            let b = _sp1[1];
            let c = _sp1[2];
            // let [a, b, c] = fr.split(" ");
            this._register(component, "forUpdate", {
                bind: c,
                sel: id,
                iter: a,
                ins: b
            });
            this.uiid++;
        }
        res();
    });
};
$b1bfb376f83f0a2f$var$Attrib.prototype._compileSwitch = function(switchs, component, isStatic) {
    return new Promise((res)=>{
        if (!switchs.length) {
            res();
            return;
        }
        let els = this._static(component)(switchs, isStatic);
        if (!els.length) {
            res();
            return;
        }
        for(let s = 0; s < els.length; s++){
            let id = `cks${this.uiid}`;
            let el = els[s];
            let bind = el.dataset.switch, map = "def";
            if (bind.includes(".")) {
                const _sp1 = el.dataset.switch.split(".");
                bind = _sp1[0];
                map = _sp1[1];
            // var [f, ...rest] = el.dataset.switch.split('.');
            // bind = f;
            // map = rest[0];
            }
            el.dataset.switch = id;
            let cases = el.querySelectorAll("[data-case]");
            // console.log(cases);
            let casesId = [];
            for(let c = 0; c < cases.length; c++){
                let _case = cases[c];
                let closest = _case.closest(`[data-switch=${id}]`);
                _case.classList.add("cake-template");
                if (closest) {
                    let caseBind = _case.dataset.case;
                    let _id = `cksc${this.uiid}`;
                    _case.dataset.case = `${id}-${_id}`;
                    casesId.push({
                        _id: _id,
                        bind: caseBind
                    });
                    this.uiid++;
                }
            }
            this._register(component, "switch", {
                bind: bind,
                sel: id,
                map: map,
                cases: casesId
            });
            this.uiid++;
        }
        res();
    });
};
$b1bfb376f83f0a2f$var$Attrib.prototype._compileBind = function(elModels, component, isStatic) {
    return new Promise((res)=>{
        if (!elModels.length) {
            res();
            return;
        }
        let els = this._static(component)(elModels, isStatic);
        if (!els.length) {
            res();
            return;
        }
        for(let s = 0; s < els.length; s++){
            let id = `ckm${this.uiid}`;
            let el = els[s];
            let model = el.dataset.bind;
            let gr = model.split(",");
            for(let g = 0; g < gr.length; g++){
                let val = gr[g].split(" ").join("");
                if (val.includes(":")) {
                    const _sp1 = val.split(":");
                    var attr = _sp1[0];
                    var bind = _sp1[1];
                // var [attr, bind] = val.split(":");
                } else {
                    var bind = val;
                    var attr = "value";
                }
                this._register(component, "bind", {
                    attr: attr,
                    bind: bind,
                    sel: id
                });
            }
            this.uiid++;
            el.dataset.bind = id;
        }
        res();
    });
};
$b1bfb376f83f0a2f$var$Attrib.prototype._compileAnimate = function(anims1, component, isStatic) {
    return new Promise((res)=>{
        if (!anims1.length) {
            res();
            return;
        }
        // console.log(1403,component);
        let els = this._static(component)(anims1, isStatic);
        if (!els.length) {
            res();
            return;
        }
        for(let s = 0; s < els.length; s++){
            let id = `cka${this.uiid}`;
            let el = els[s];
            let anim = el.dataset.animate;
            anim = anim.split(" ").join("");
            //to handle multiple attr binding;
            //render:appead-slideInUp, remove:disappear
            let o = {};
            let split = anim.split(",");
            for(let a = 0; a < split.length; a++){
                let item = split[a];
                // let [ctx, anims] = item.split(':');
                let _sp1 = item.split(":");
                let ctx = _sp1[0];
                let anims = _sp1[1];
                if (ctx == "ns") {
                    o.ns = anims;
                    break;
                } else o[ctx] = {
                    keyframes: anims.split("-")
                };
            }
            o.selector = {
                attr: "data-animate",
                val: id
            };
            this._register(component, "animate", o);
            this.uiid++;
            el.dataset.animate = id;
        }
        res();
    });
};
$b1bfb376f83f0a2f$var$Attrib.prototype._compileIf = function(ifs, component, isStatic) {
    return new Promise((res)=>{
        if (!ifs.length) {
            res();
            return;
        }
        let els = this._static(component)(ifs, isStatic);
        if (!els.length) {
            res();
            return;
        }
        const regex = new RegExp("<|>|===|==|!==|!=");
        for(let s = 0; s < els.length; s++){
            let id = `ci${this.uiid}`;
            let el = els[s];
            let _if = el.dataset.if;
            let _ifBind = el.dataset.ifBind;
            let gr = _if.split(",");
            for(let g = 0; g < gr.length; g++){
                let val = gr[g];
                let attr = val.substring(0, val.indexOf("="));
                let exp = val.substring(val.indexOf("=") + 1, val.length);
                exp = exp.split(new RegExp("[()]")).join("");
                // let [test, r] = exp.split('?');
                let _sp2 = exp.split("?");
                let test = _sp2[0];
                let r = _sp2[1];
                let hasNegate = test[0] == "!";
                hasRegularLog = test.match(regex);
                let bind, testVal, ops;
                if (hasRegularLog) {
                    let splitted = test.split(regex);
                    bind = splitted[0].trim();
                    testVal = splitted[1].trim();
                    ops = hasRegularLog[0];
                } else bind = test;
                if (hasNegate) bind = bind.slice(1);
                let _sp1 = r.split(":");
                let _true = _sp1[0];
                let _false = _sp1[1];
                // let [_true, _false] = r.split(':');
                this._register(component, "if", {
                    hasNegate: hasNegate,
                    attr: attr,
                    ops: ops,
                    bind: bind,
                    testval: testVal || null,
                    _true: _true,
                    _false: _false,
                    sel: id,
                    ifBind: _ifBind
                });
            }
            this.uiid++;
            el.dataset.if = id;
        }
        res();
    });
};
$b1bfb376f83f0a2f$var$Attrib.prototype._compileClass = function(cls1, component, isStatic) {
    return new Promise((res)=>{
        if (!cls1.length) {
            res();
            return;
        }
        let els = this._static(component)(cls1, isStatic);
        if (!els.length) {
            res();
            return;
        }
        let regex = new RegExp("<|>|===|==|!==|!=");
        for(let s = 0; s < els.length; s++){
            let id, el, cl, hasRegularLog, hasNegate, bindVal, ops, testVal, hasNegateCount;
            id = `cc${this.uiid}`;
            el = els[s];
            cl = el.dataset.class;
            let cls = cl.split(",");
            for(let c = 0; c < cls.length; c++){
                let clItem = cls[c];
                let _sp1 = clItem.split("&&");
                // let [test, className] = clItem.split('&&');
                let test = _sp1[0];
                let className = _sp1[1];
                test = test.trim();
                className = className.trim();
                hasRegularLog = test.match(regex);
                if (test.substring(0, 2).includes("!")) {
                    hasNegate = true;
                    hasNegateCount = test.substring(0, 2) == "!!" ? 2 : test.substring(0, 1) == "!" ? 1 : 0;
                } else {
                    hasNegate = false;
                    hasNegateCount = 0;
                }
                if (hasRegularLog) {
                    let splitted = test.split(regex);
                    bindVal = splitted[0].trim();
                    testVal = splitted[1].trim();
                    ops = hasRegularLog[0].trim();
                } else {
                    !hasNegate && (bindVal = test);
                    if (hasNegate) {
                        bindVal = test.substring(hasNegateCount);
                        testVal = hasNegateCount == 2;
                    }
                }
                // if(component == 'header1'){
                //     console.log(1534, bindVal, test, testVal, hasNegateCount);
                // }
                this._register(component, "class", {
                    hasNegate: hasNegate,
                    bind: bindVal,
                    testVal: testVal,
                    className: className,
                    ops: ops,
                    sel: id
                });
            }
            this.uiid++;
            el.dataset.class = id;
        }
        res();
    });
};
$b1bfb376f83f0a2f$var$Attrib.prototype._compileAttr = function(attrs, component, isStatic) {
    return new Promise((res)=>{
        if (!attrs.length) {
            res();
            return;
        }
        let els = this._static(component)(attrs, isStatic);
        if (!els.length) {
            res();
            return;
        }
        let regex = new RegExp("<|>|===|==|!==|!=");
        for(let s = 0; s < els.length; s++){
            let id, el, cl, hasRegularLog, hasNegate, bindVal, ops, testVal;
            id = `cre${this.uiid}`;
            el = els[s];
            cl = el.dataset.attr;
            let _sp2 = cl.split("&&");
            // let [test, attrPair] = cl.split('&&');
            let test = _sp2[0];
            let attrPair = _sp2[1];
            attrPair = attrPair.trim();
            // let [attrkey, attrvalue] = attrPair.split('=');
            let _sp1 = attrPair.split("=");
            let attrkey = _sp1[0];
            let attrvalue = _sp1[1];
            test = test.trim();
            hasRegularLog = test.match(regex);
            hasNegate = test[0] == "!";
            if (hasRegularLog) {
                let splitted = test.split(regex);
                bind = splitted[0];
                testVal = splitted[1];
                ops = hasRegularLog[0];
            } else bind = test;
            if (hasNegate) hasNegate && (bind = bind.slice(1));
            this._register(component, "attr", {
                hasNegate: hasNegate,
                bind: bind,
                testVal: testVal,
                attrkey: attrkey,
                attrvalue: attrvalue,
                ops: ops,
                sel: id
            });
            this.uiid++;
            el.dataset.attr = id;
        }
        res();
    });
};
$b1bfb376f83f0a2f$var$Attrib.prototype._compileModel = function(elModels, component, isStatic) {
    return new Promise((res)=>{
        if (!elModels.length) {
            res();
            return;
        }
        let els = this._static(component)(elModels, isStatic);
        if (!els.length) {
            res();
            return;
        }
        for(let s = 0; s < els.length; s++){
            let id = `cknt${this.uiid}`;
            let el = els[s];
            let nodeType = el.tagName;
            let model = el.dataset.model;
            let gr = model.split(",");
            for(let g = 0; g < gr.length; g++){
                let val = gr[g].split(" ").join("");
                if (val.includes(":")) {
                    // var [attr, bind] = val.split(":");
                    var splitted = val.split(":");
                    var attr = splitted[0];
                    var bind = splitted[1];
                } else {
                    var bind = val;
                    var attr = "value";
                }
                this._register(component, "model", {
                    attr: attr,
                    bind: bind,
                    sel: id,
                    nodeType: nodeType
                });
            }
            this.uiid++;
            el.dataset.model = id;
        }
        res();
    });
};
$b1bfb376f83f0a2f$var$Attrib.prototype.inject = function(el, component, isStatic = false) {
    return new Promise((res)=>{
        // let query = el.getElementsByDataset('bind', 'for', 'for-update', 'switch', 'toggle', 'event', 'animate','if','class','model','attr');
        let query = el.getElementsByDataset("bind", "for", "for-update", "switch", "toggle", "event", "animate", "if", "class", "attr");
        // console.log(query, component);
        res(query);
    }).then((query)=>{
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
        for(let q in query){
            if (query.hasOwnProperty(q)) {
                if (query[q].length) r.push(map[q].apply(this, [
                    query[q],
                    component,
                    isStatic,
                    el
                ]));
            }
        }
        console.timeEnd(component);
        return Promise.all(r.length ? r : [
            r
        ]);
    }).then(()=>{
        // return this.store.createOrUpdate(component, this.st[component]);
        return Promise.resolve();
    });
};
$b1bfb376f83f0a2f$exports = $b1bfb376f83f0a2f$var$Attrib;



const $85cf733e32a19dfe$var$Scope = (parcelRequire("gNV9J"))();
var $d1cc28258f62f363$exports = {};
var $9f107ed999cecaee$exports = {};
$9f107ed999cecaee$exports = class {
    constructor(config = [], html){
        this.html = html || document;
        this.cf = config;
        this.duration = 300;
    }
    animate(moment) {
        this.config = this.parse(this.cf);
        return new Promise((res)=>{
            for(let i = 0; i < this.config.length; i++){
                let cf = this.config[i];
                // console.log(cf)
                let element = cf.element;
                //when there is no config for certain moment, render || remove
                //safekeep
                if (!cf[moment]) {
                    res();
                    break;
                }
                let config = cf[moment];
                if (!config.options && !(config.options && config.options.duration)) config.options = {
                    duration: this.duration
                };
                if (!config.keyframes && !element) continue;
                let keyframes = config.keyframes;
                let index = 0;
                let fr = [];
                for(let k = 0; k < keyframes.length; k++){
                    let kk = keyframes[k];
                    switch(true){
                        case typeof kk == "string":
                            fr.push(this.dic(kk));
                            break;
                        case kk instanceof Object:
                            {
                                //maybe the offset is declared along with the keyframes;
                                //name - refers to default animation
                                // let {name, offset} = kk;
                                let name = kk.name;
                                let offset = kk.offset;
                                if (name && offset) {
                                    //support for element.animation - offset, equivalent to 10%-100% css @keyframes;
                                    let def = this.dic(name);
                                    def[def.length - 1].offset = offset;
                                    fr.push(def);
                                } else fr.push(kk);
                            }
                    }
                }
                keyframes = fr;
                fr = null;
                //to series calls of animation, one after the another;
                // console.log(element, keyframes, config);
                let recurseCall = ()=>{
                    let kf = keyframes[index];
                    let animate = element.animate(kf, config.options || this.duration);
                    // console.log(animate);
                    if (animate.finished) animate.finished.then(()=>{
                        if (index < keyframes.length - 1) {
                            index += 1;
                            recurseCall();
                        } else {
                            keyframes = [];
                            // console.log(index, keyframes.length)
                            res();
                        }
                    });
                    else animate.onfinish = ()=>{
                        if (index < keyframes.length - 1) {
                            index += 1;
                            recurseCall();
                        } else {
                            keyframes = [];
                            // console.log(index, keyframes.length)
                            res();
                        }
                    };
                };
                recurseCall();
            }
        });
    }
    parse(config) {
        let configs = [], length = config.length, i = -1;
        // console.log(config);
        while(++i < length){
            let cf = config[i];
            let selector = cf.selector, el;
            switch(true){
                case !!(selector.val && selector.attr):
                    el = this.html.querySelectorIncluded(`[${selector.attr}=${selector.val}]`, selector.attr, selector.val);
                    break;
                case !!(selector.val && !selector.attr):
                    {
                        let attr = selector.val.match(new RegExp(`^[.]`)) ? "class" : selector.val.match(new RegExp(`^[#]`)) ? "id" : null;
                        let val = attr ? selector.val.slice(1) : null;
                        el = this.html.querySelectorIncluded(selector.val, attr, val);
                    }
                    break;
            }
            cf.element = el;
            configs.push(cf);
        }
        // console.log(configs);
        return configs;
    }
    dic(name) {
        let coll = {
            slideOutUp: [
                {
                    transform: "translate3d(0,0,0)",
                    visibility: "visible",
                    opacity: "1",
                    easing: "ease-out"
                },
                {
                    transform: "translate3d(0,100%,0)",
                    visibility: "hidden",
                    opacity: "0",
                    easing: "ease-out"
                }
            ],
            slideOutRight: [
                {
                    transform: "translate3d(0,0,0)",
                    visibility: "visible",
                    opacity: "1"
                },
                {
                    transform: "translate3d(100%,0,0)",
                    visibility: "hidden",
                    opacity: "0"
                }
            ],
            slideOutLeft: [
                {
                    transform: "translate3d(0,0,0)",
                    visibility: "visible",
                    opacity: "1"
                },
                {
                    transform: "translate3d(-100%,0,0)",
                    visibility: "hidden",
                    opacity: "0"
                }
            ],
            slideOutDown: [
                {
                    transform: "translate3d(0,0,0)",
                    visibility: "visible",
                    opacity: "1",
                    easing: "ease-out"
                },
                {
                    transform: "translate3d(0,-100%,0)",
                    visibility: "hidden",
                    opacity: "0",
                    easing: "ease-out"
                }
            ],
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
                }, 
            ],
            slideInRight: [
                {
                    transform: "translate3d(100%,0,0)",
                    visibility: "hidden",
                    opacity: "0"
                },
                {
                    transform: "translate3d(0,0,0)",
                    visibility: "visible",
                    opacity: "1"
                }
            ],
            slideInLeft: [
                {
                    transform: "translate3d(-100%,0,0)",
                    visibility: "hidden",
                    opacity: "0",
                    easing: "ease-out"
                },
                {
                    transform: "translate3d(0,0,0)",
                    visibility: "visible",
                    opacity: "1"
                }
            ],
            slideInDown: [
                {
                    transform: "translate3d(0,-100%,0)",
                    visibility: "hidden",
                    opacity: "0",
                    easing: "ease-out"
                },
                {
                    transform: "translate3d(0,0,0)",
                    visibility: "visible",
                    opacity: "1",
                    easing: "ease-out"
                }
            ],
            disappear: [
                {
                    opacity: "1"
                },
                {
                    opacity: "0"
                }
            ],
            appear: [
                {
                    opacity: "0"
                },
                {
                    opacity: "1"
                }
            ],
            flipInX: [
                ,
                {
                    offset: 0,
                    backfaceVisibility: "visible"
                },
                {
                    transform: "perspective(400px) rotate3d(1,0,0,90deg)",
                    opacity: "0",
                    offset: 0
                },
                {
                    transform: "perspective(400px) rotate3d(1,0,0,-20deg)",
                    offset: 0.4,
                    easing: "ease-in"
                },
                {
                    offset: 0.6,
                    opacity: "1",
                    transform: "perspective(400px) rotate3d(1,0,0,10deg)"
                },
                {
                    transform: "perspective(400px) rotate3d(1,0,0,-5deg)",
                    offset: 0.8
                },
                {
                    offset: 1,
                    backfaceVisibility: "visible",
                    transform: "perspective(400px) rotate3d(1,0,0,0)"
                }
            ]
        };
        return coll[name.trim()] || [];
    }
};




var $apWp0 = parcelRequire("apWp0");


// const {pushState} = require('./router')();
function $d1cc28258f62f363$var$Component(name, template, options) {
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
    this.scope = options.scope;
    this.formSelector = options.form;
    this.await = {}; //storage of async handlers
    this.state = options.state;
    this.originalState = {};
    this.utils = $apWp0;
    // options.data && options.data.bind(this.data)(this);
    (name == "app" || options.role == "app") && (()=>{
        this.staticComponent = options.static || [];
    })();
    // options.trigger && options.trigger.bind(this)();
    // options.utils && options.utils.bind(this.utils)(this);
    this.container = {};
    this.compile = new Promise((res)=>{
        this._bindHandlers();
        res();
    }).then(()=>{
        return this._bindSubscribe();
    }).then(()=>{
        return this.cloneState();
    }).then(()=>{
        switch(this.type == "view" && !!this.template){
            case true:
                return this.createElementAsync();
            default:
                this.isStatic = false;
                break;
        }
    });
}
$d1cc28258f62f363$var$Component.prototype.isStatic = false;
$d1cc28258f62f363$var$Component.prototype.hasEvent = false;
$d1cc28258f62f363$var$Component.prototype.isConnected = false;
$d1cc28258f62f363$var$Component.prototype.destroyed = false;
$d1cc28258f62f363$var$Component.prototype.isCreated = false;
$d1cc28258f62f363$var$Component.prototype.cloneState = function() {
    if (!this.state) return;
    for(let key in this.state)if (this.state.hasOwnProperty(key)) this.originalState[key] = this.state[key];
    this.$state = (()=>{
        return this.state;
    })();
};
$d1cc28258f62f363$var$Component.prototype.clearState = function() {
    if (!this.state) return;
    this.state = JSON.parse(JSON.stringify(this.originalState));
    this.$state = (()=>{
        return this.state;
    })();
};
$d1cc28258f62f363$var$Component.prototype.Subscribe = function(handler) {
    this.$observer.registerSubscribe({
        [handler.listenTo]: {
            [handler.original]: [
                handler
            ]
        }
    });
};
$d1cc28258f62f363$var$Component.prototype.Node = function(el) {
    const piece = new $9571e813ac86dd6f$exports(el);
    return piece;
};
$d1cc28258f62f363$var$Component.prototype._bindHandlers = function() {
    for(let key in this.handlers)if (this.handlers.hasOwnProperty(key)) {
        let fn = this.handlers[key];
        let originalName = fn.name;
        fn = fn.bind(this);
        fn.original = originalName;
        fn.binded = this.name;
        this.handlers[originalName] = fn;
        this.initAwaitHandlers(key);
    }
    if (!this.await.destroy) this.await.destroy = Promise.resolve();
    if (!this.await.animateRemove) this.await.animateRemove = Promise.resolve();
};
$d1cc28258f62f363$var$Component.prototype.initAwaitHandlers = function(handlerName) {
    //initializing awaits for handlers;
    this.await[handlerName] = Promise.resolve();
};
$d1cc28258f62f363$var$Component.prototype._bindSubscribe = function() {
    //binding the subscribe to component;
    let flattened = {};
    for(let component in this.subscribe)if (this.subscribe.hasOwnProperty(component)) {
        subscribe = this.subscribe[component];
        if (!!subscribe.components && !subscribe.handler) throw new Error(`there is no handler in format many of subscribe in event ${component}`);
        else if (!subscribe.components && !!subscribe.handler) throw new Error(`there is no components in format many of subscribe in event ${component}`);
        let isMany = !!subscribe.components && !!subscribe.handler;
        if (isMany) {
            /**
                 * multiple components triggering the same event;
                 * this component is listening to that one event;
                    event :{
                        components:[],
                        handler(){},
                    }
                 */ let event = component;
            // let {components, handler} = subscribe;
            let components = subscribe.components;
            let handler = subscribe.handler;
            handler = handler.bind(this);
            handler.binded = this.name;
            handler.original = event;
            for(let c = 0; c < components.length; c++){
                let component = components[c];
                if (!flattened[component]) flattened[component] = {};
                if (!flattened[component][event]) // flattened[component][event] = [];
                flattened[component][event] = {};
                handler.listenTo = component;
                // flattened[component][event].push(handler);
                flattened[component][event] = handler;
            }
        } else {
            if (!flattened[component]) flattened[component] = {};
            /**
                single event is triggerd by a component;
                    component:{
                        event:{
                            handler(){},
                        }
                    }
                 */ let fns = subscribe; //object
            for(let fn in fns)if (fns.hasOwnProperty(fn)) {
                let handler = fns[fn];
                let original = handler.name;
                // console.log(component, handler);
                try {
                    handler = handler.bind(this);
                } catch (err) {}
                handler.original = original;
                handler.binded = this.name;
                handler.listenTo = component;
                if (!flattened[component][original]) flattened[component][original] = {};
                // flattened[component][original].push(handler);
                flattened[component][original] = handler;
            }
        }
    }
    this.subscribe = flattened;
};
$d1cc28258f62f363$var$Component.prototype.doFor = function(prop, newValue) {
    // console.trace();
    const getHTML = ()=>{
        return this.html;
    };
    if (newValue == null) return;
    return this.$attrib.notifyFor(prop, newValue, null, this.name, getHTML());
};
$d1cc28258f62f363$var$Component.prototype.doToggle = function(prop, newValue) {
    this.$attrib.notifyToggle(prop, newValue, null, this.name, this.html);
};
$d1cc28258f62f363$var$Component.prototype.doSwitch = function(prop, newValue) {
    this.$attrib.notifySwitch(prop, newValue, null, this.name, this.html);
};
$d1cc28258f62f363$var$Component.prototype.doIf = function(prop, newValue) {
    this.$attrib.notifyIf(prop, newValue, null, this.name, this.html);
};
$d1cc28258f62f363$var$Component.prototype.$animate = function(moment) {
    //normalize the two sourse, attr, and component declaration;
    let ata = this.$attrib.getWatchItemsByType(this.name, "animate");
    let da = this.animateOptions;
    let arr = [];
    (()=>{
        if (!ata.length && !(ata instanceof Array) || !da) return;
        for(let a = 0; a < ata.length; a++){
            let at = ata[a];
            // let {ns:name, selector} = at;
            let name = at.ns;
            let selector = at.selector;
            //declare name space in html, mapped to component animation declaration
            if (at.ns) {
                if (da[name]) {
                    let ns = da[name];
                    Object.assign(at, da[name]);
                    delete da[name];
                }
            } else //declared animation in html, using animation name;
            arr.push(ata);
        }
    })();
    if (!ata.length) return false;
    (()=>{
        let obj = {};
        let selector = {};
        for(let key in da)if (da.hasOwnProperty(key)) {
            selector.val = key;
            obj.selector = selector;
            Object.assign(obj, da[key]);
            ata.push(obj);
            //reset;
            obj = {};
            selector = {};
        }
    })();
    // console.log(ata);
    return new $9f107ed999cecaee$exports(ata, this.html).animate(moment);
// return Promise.resolve();
};
$d1cc28258f62f363$var$Component.prototype.$templating = function(data, t, isConvert) {
    let template = t || this.template;
    return new $a692d954b95d4bfb$exports($a6b6a4746468157c$exports("templating")).createElement(data, template, isConvert);
};
$d1cc28258f62f363$var$Component.prototype.createElement = function() {
    let isSelector = this.template.substring(0, 1) == "#";
    if (!isSelector) return;
    let selector = this.template.substr(1);
    let query = document.getElementById(selector);
    let isTemplate = this.isTemplate = query && query.toString().includes("Template");
    if (!query) throw new Error(`the template for ${this.name} is not found with.`);
    return new Promise((res)=>{
        switch(isTemplate){
            //template html
            case true:
                {
                    // console.time(this.name)
                    let element = query.getContent(true);
                    if (!element) throw new Error(`it might be theres no template in component - ${this.name}`);
                    element.cake_component = this.name;
                    // console.timeEnd(this.name)
                    this.html = this.Node(element);
                    // console.log(274,this.html);
                    this._parseHTML(this.isStatic).then(()=>{
                        res();
                    });
                }
                break;
            case null:
                res();
                break;
            //static html
            default:
                {
                    let element = query;
                    if (!element) throw new Error(`it might be theres no template in component - ${this.name}`);
                    element.cake_component = this.name;
                    this.html = this.Node(element);
                    // console.log(290,this.html);
                    this.isStatic = true;
                    this._parseHTML(this.isStatic).then(()=>{
                        res();
                    });
                }
        }
    });
};
$d1cc28258f62f363$var$Component.prototype.createElementAsync = function() {
    return new Promise((res)=>{
        this.createElement().then(()=>{
            res();
        });
    }).then(()=>{
        // console.log(`${this.name} is rendered async`)
        this.isReady = true;
    });
// console.log(`${this.name} is creating async el`)
};
$d1cc28258f62f363$var$Component.prototype._isParsed = false;
$d1cc28258f62f363$var$Component.prototype._parseHTML = function(isStatic = false) {
    return this.$attrib.inject(this.html, this.name, isStatic).then(()=>{
        // console.log(this.html, this.name)
        this.original = this.html.cloneNode();
        this._isParsed = true;
    });
};
$d1cc28258f62f363$var$Component.prototype.render = function(options = {}) {
    if (this.isConnected) {
        console.error(`${this.name} is already rendered and connected to the DOM`);
        return Promise.resolve();
    }
    // let {root, cleaned, emit={}, data={}} = options || {};
    let root = options.root;
    let cleaned = options.cleaned;
    let emit = options.emit || {};
    let data = options.data || {};
    let multiple = this.options.multiple;
    let state = this.state || {};
    let payload = {
        emit: emit
    };
    const getValue = (item)=>{
        //get the initial value in state as it being cleared when the component is destroyed;
        //or in the data attribute upon render;
        return ({
            ...state,
            ...data
        })[item] || null;
    };
    return new Promise((res, rej)=>{
        !!root && (this.root = root);
        if (!this.isReady) this.createElement().then(()=>{
            // (hashed === true) && this.$hash.add(this.name);
            return !this.template && this.fire.isConnected && this.fire.isConnected(payload, true);
        }).then(()=>{
            this.isReady = true;
            res();
        });
        else res();
    }).then(()=>{
        return this.await.destroy.then(()=>{
            return this.await.animateRemove;
        }).then(()=>{
            return new Promise((res, rej)=>{
                //html restructure base on data;
                //by mutation;
                let forItems = this.$attrib.getWatchItemsByType(this.name, "for");
                // for (let i = 0; i < forItems.length; i++){
                //     let nv = getValue(forItems[i]);
                //     this.doFor(forItems[i], nv);
                // };
                // console.log(forItems);
                Promise.all(forItems.map((item)=>{
                    return this.doFor(item, getValue(item));
                })).then(()=>{
                    // console.log(405, this.name, this.html);
                    res(this.html);
                });
            }).then((element)=>{
                payload = {
                    element: element,
                    emit: emit
                };
                return new Promise((res, rej)=>{
                    try {
                        this.fire.beforeConnected && this.fire.beforeConnected(payload, true);
                        res(element);
                    } catch (err) {
                        rej(err);
                    }
                });
            }).then((element)=>{
                if (this.isStatic) ;
                else {
                    //replace the mustache here;
                    let prom = !data ? Promise.resolve() : (()=>{
                        return new Promise((res)=>{
                            let el = element.getElement();
                            el = this.$templating(data, el);
                            this.html = element = this.Node(el);
                            this.html.replaceDataSrc();
                            data = null;
                            res();
                        });
                    })();
                    return prom.then(()=>{
                        element.appendTo(this.root, cleaned);
                        this.isConnected = true;
                    });
                }
            }).// .then(()=>{
            //     return this.findRouterLink();
            // }).
            then(()=>{
            //switch
            // let switchItems = this.$attrib.getWatchItemsByType(this.name, 'switch');
            // for (let i = 0; i < switchItems.length; i++){
            //     this.doSwitch(switchItems[i], getValue(switchItems[i]));
            // };
            }).then(()=>{
                return this.findContainer();
            }).then(()=>{
                try {
                    // console.log('setting attributes', this.name);
                    return this.fire.isConnected && this.fire.isConnected(payload, true);
                } catch (err) {
                    console.log(440, err);
                }
            }).then(()=>{
                return this.findTarget();
            }).then(()=>{
                // console.log(this.container);
                // console.log('this containers must have el',this.name, this.container);
                // return this.addEvent(static, multiple);
                return this.addEvent();
            }).then(()=>{
                // console.log('start animation', this.name);
                return this.$animate("render");
            }).then(()=>{
                multiple && this._smoothReset();
                return new Promise((res, rej)=>{
                    setTimeout(()=>{
                        this._watchReactive();
                        res();
                    }, 100);
                });
            });
        });
    });
};
$d1cc28258f62f363$var$Component.prototype.renderAsync = function(options) {
    this.render(options).then(()=>{
        this.$persist.append(this.name);
    });
};
$d1cc28258f62f363$var$Component.prototype._smoothReset = function() {
    this.isConnected = false;
    this.html = this.original.cloneNode();
};
$d1cc28258f62f363$var$Component.prototype._hardReset = function(name) {
    this.isConnected = false;
    this.$persist.remove(name);
    //remove the element first;
    //clone the element;
    this.html = this.original.cloneNode();
    return true;
};
$d1cc28258f62f363$var$Component.prototype.reset = function() {
    let animate = this.$animate("remove");
    // console.log(this,this.html, animate);
    if (animate instanceof Promise) return this.await.animateRemove = new Promise((res)=>{
        animate.then(()=>{
            //it is very important to remove first the component
            //before hard reset;
            return this.html.remove();
        }).then(()=>{
            this.container = {};
        }).then(()=>{
            return this.clearState();
        }).then(()=>{
            return this._hardReset(this.name);
        }).then(()=>{
            res();
        });
    });
    else return new Promise((res)=>{
        this.html.remove(this.name);
        this.clearState();
        this.container = {};
        this._hardReset(this.name);
        res();
    });
};
$d1cc28258f62f363$var$Component.prototype.addEvent = function(static, multiple) {
    // let isStatic = !!static;
    // let isMultiple = !!multiple;
    // if (isMultiple && isStatic){
    //     return false;
    // };
    let component1 = this.name;
    function notify(event, component, isPreventDefault, isStopPropagation) {
        return function(e) {
            // console.log(512,e);
            // console.log(509,!isPreventDefault, component,event)
            if (!isPreventDefault) e.preventDefault();
            if (isStopPropagation) e.stopPropagation();
            Cake.Observer.notify(component, event, e);
        };
    }
    // this.name == 'product_list' && console.log(this.targets);
    // console.log(547,this.name, this.targets);
    if (!this.targets) return;
    for(let event1 in this.targets)if (this.targets.hasOwnProperty(event1)) {
        // let cf = JSON.parse(JSON.stringify(this.targets[event]));
        let cf = this.targets[event1];
        // if(this.name == 'sidebar'){
        //     console.log(527, cf);
        // };
        for (let item of cf){
            // let {sel, el, cb} = item;
            let sel = item.sel;
            let el = item.el;
            let cb = item.cb;
            let _event = event1;
            let place = event1.substring(0, 2);
            let isPreventDefault = place.includes("~"); //default to true;
            let isStopPropagation = place.includes("^"); //default to false;
            // console.log(542,isPreventDefault);
            if (isPreventDefault || isStopPropagation) {
                _event = event1.slice(1);
                cb = cb || _event;
            } else if (!cb) cb = event1;
            if (!el.Ref().get("__cake__events")) el.Ref().set("__cake__events", {});
            let store = el.Ref().get("__cake__events");
            if (!store[cb]) {
                el.addEventListener(_event, notify(cb, component1, isPreventDefault, isStopPropagation), true);
                store[cb] = true;
                el.Ref().set("__cake__events", store);
            } else continue;
        }
    }
};
$d1cc28258f62f363$var$Component.prototype.findTarget = function() {
    let q = this.$attrib.getEventTarget(this.name);
    return new Promise((res)=>{
        for (let item of q){
            let els = this.html.querySelectorAllIncluded(`[data-event=${item.sel}]`);
            for(let e = 0; e < els.length; e++){
                if (!this.targets[item.event]) this.targets[item.event] = [];
                this.targets[item.event].push({
                    el: els[e],
                    ...item
                });
            }
        }
        res();
    });
};
// Component.prototype.findRouterLink = function(){
//     let q = this.$attrib.getRouterTarget(this.name);
//     let e = JSON.parse(JSON.stringify(q));//deep cloning
//     for (let item of e){
//         item.el = document.querySelector(`[data-event=${item.sel}]`);
//         if (!item.el.__router){
//             // item.el.addEventListener('click',(e)=>{
//             //     e.preventDefault();
//             //     e.stopPropagation();
//             //     pushState(item.value, null, e.target.href);
//             // });
//             item.el.__router = 1;
//         };
//     };
// }; 
$d1cc28258f62f363$var$Component.prototype.toggler = function(_this1) {
    /*
        @params
        {basis} - comparison of elements;
        {cls} - class to toggle;
        {mode} - radio/ switch;
        {sel} - siblings selector;
        {persist} - bool;
    */ let attrToggle = this.$attrib.getWatchItemsByType(this.name, "toggle");
    let cl = class {
        constructor(bind, bases, html, _this){
            this.toggle = _this.toggle;
            this.bind = bind;
            this.bases = bases;
            this.cache = _this.$cache;
            this.html = html;
        }
        check(bind) {
            let config = this.toggle[bind];
            // console.log(this.toggle)
            if (!config) console.error(`${bind} is not found in toggle! choose from ${JSON.stringify(Object.keys(this.toggle))}`);
            else {
                if (attrToggle.length) {
                    // let {ns} = config;
                    let ns = config.ns;
                    //toggle is use only for namespacing;
                    let f = attrToggle.find((item)=>{
                        return item.name == `ns-${ns}`;
                    });
                    f && (config.sel = `[data-toggle=${f.sel}]`);
                }
                return config;
            }
        }
        _toggle() {
            let config = this.check(this.bind);
            if (!config) return;
            // let {basis='data-name', cls='is-active', mode='radio', sel, persist=true} = config;
            let basis = config.basis || "data-name";
            let cls1 = config.cls || "is-active";
            let mode = config.mode || "radio";
            let sel = config.sel;
            let persist = config.persist == undefined ? true : config.persist;
            let targets = this.html.querySelectorAll(sel);
            if (!targets.length) return;
            let prev, next;
            // console.log(targets);
            if (targets.length == 1) {
                let isbool = typeof this.bases == "boolean";
                let isforce1 = !!this.bases;
                let el1 = targets[0];
                // console.log(isbool, isforce)
                if (persist) {
                    const _forceState = function(el, cls, isforce) {
                        if (isforce) {
                            if (el.classList.contains(cls)) el.classList.remove(cls);
                        } else if (!el.classList.contains(cls)) el.classList.add(cls);
                    };
                    if (isbool) {
                        if (isforce1) {
                            this.cache.createOrUpdate(this.bind, true);
                            _forceState(el1, cls1, true);
                        } else {
                            this.cache.createOrUpdate(this.bind, false);
                            _forceState(el1, cls1, false);
                        }
                        el1.classList.toggle(cls1);
                    } else {
                        this.cache.createOrUpdate(this.bind, !el1.classList.contains(cls1));
                        el1.classList.toggle(cls1);
                    }
                }
            } else for(let t = 0; t < targets.length; t++){
                let el = targets[t];
                let has = el.classList.contains(cls1);
                let attr = el.getAttribute(basis);
                if (attr == this.bases) {
                    if (mode == "switch") el.classList.toggle(cls1);
                    else if (!has) el.classList.add(cls1);
                    if (persist) this.cache.createOrUpdate(this.bind, attr);
                    next = attr;
                } else if (has) {
                    el.classList.remove(cls1);
                    prev = el.getAttribute(basis);
                }
            }
            return {
                prev: prev,
                next: next
            };
        }
        _recall() {
            let config = this.check(this.bind);
            if (!config) return;
            // let {basis='data-name', cls='is-active',  sel} = config;
            let basis = config.basis || "data-name";
            let cls = config.cls || "is-active";
            let sel = config.sel;
            return this.cache.get(this.bind).then((result)=>{
                if (!result) return result;
                let bases = result;
                let targets = this.html.querySelectorAll(sel);
                if (!targets.length) return;
                if (targets.length == 1) {
                    let el = targets[0];
                    // console.log(bases, this.bind);
                    if (bases) el.classList.add(cls);
                } else for(let t = 0; t < targets.length; t++){
                    let el = targets[t];
                    let has = el.classList.contains(cls);
                    let attr = el.getAttribute(basis);
                    if (attr == bases) {
                        if (!has) el.classList.add(cls);
                    }
                }
                return bases;
            });
        }
    };
    let fn = (bind, bases)=>{
        return new cl(bind, bases, this.html, this)._toggle();
    };
    fn.recall = (bind)=>{
        return new cl(bind, false, this.html, this)._recall();
    };
    return fn;
};
$d1cc28258f62f363$var$Component.prototype.findContainer = function() {
    return new Promise((res)=>{
        let containers = this.html.getContainers();
        for(let c = 0; c < containers.length; c++){
            let el = containers[c];
            let name = el.dataset.container;
            if (name) this.container[name] = el;
        }
        res();
    });
// console.log('must trigger first',containers);
// console.log('must trigger first',this.container);
};
$d1cc28258f62f363$var$Component.prototype._validator = function(name, value) {
    if (this.options.validate) {
        this.validate = this.options.validate;
        const handler = this.validate[name];
        handler;
    }
};
/*
    this will watch the form input and validate the data,
    , set it to scope and state as formData;
*/ $d1cc28258f62f363$var$Component.prototype._watchReactive = function() {
    if (this.role == "form" && this.options.watch === true) {
        const validator = this.options.validate;
        const form = this.$form();
        if (form._reactive) return;
        if (this.state && !this.state.formData) this.state.formData = {};
        const component = this;
        const handler1 = (e)=>{
            const target = e.target;
            const name = target.name || target.id;
            const value = target.value;
            let handler = validator[name];
            if (handler) {
                handler = handler.bind(component);
                if (handler) {
                    let validated = handler(e);
                    if (validated) {
                        this.state && (this.state.formData[name] = value);
                        this.$scope.set(name, value);
                    }
                }
            } else {
                this.state && (this.state.formData[name] = value);
                this.$scope.set(name, value);
            }
        };
        form.addEventListener("change", (e)=>{
            if (!(e.target.tagName == "INPUT" || e.target.tagName == "TEXTAREA")) handler1(e);
        });
        form.addEventListener("input", (e)=>{
            if (e.target.tagName == "INPUT" || e.target.tagName == "TEXTAREA") handler1(e);
        });
        form._reactive = true;
    }
};
$d1cc28258f62f363$var$Component.prototype.observer = function(subscribe) {
    function callback(name) {
        return this.handler[name];
    }
    this.observer = new Observer(this, subscribe, callback.bind(this));
};
$d1cc28258f62f363$var$Component.prototype.variable = function(obj) {
    let vary = Object.keys(obj);
    let validate = {};
    let values = [];
    function invalid(name, test, type) {
        if (!test) validate[name] = `value is not '${type}'`;
    }
    for(let key in obj)if (obj.hasOwnProperty(key)) {
        let config = obj[key];
        // let {type, value} = config;
        let type = config.type;
        let value = config.value;
        let test;
        if ([
            "string",
            "number"
        ].includes(type)) test = typeof value == type;
        else if (value instanceof Array) test = type == "array";
        else test = type == "object";
        values.push(value);
        invalid(key, test, type);
    }
    if (Object.keys(validate).length) throw new Error(JSON.stringify(validate));
    else return values;
};
$d1cc28258f62f363$exports = $d1cc28258f62f363$var$Component;


var $e081299217297ab1$exports = {};

var $apWp0 = parcelRequire("apWp0");

const $e081299217297ab1$var$StorageKit = (parcelRequire("jUqKh"))();

const $e081299217297ab1$var$authCredential = new $e081299217297ab1$var$StorageKit({
    child: "object",
    storage: "local",
    name: `_cake_router_cf`
});
$e081299217297ab1$exports = function(components1, component1) {
    const hooks = [];
    return class {
        constructor(routes, options){
            this.unauthRoute = options && options["401"] || null;
            this.authRoute = {};
            this.route = this.compile(routes);
            this.prev = null;
            this.components = $3d502eb2350f1e24$exports;
            this.watch();
            this.persist();
            // this.navigate();
            // console.log(this.route);
            // console.log(12,routes);
            // console.log(13,this.route);
            // console.log(14,this.prev);
            Object.defineProperty(component1.prototype, "$router", {
                configurable: true,
                get: ()=>{
                    return {
                        goTo: this.goTo.bind(this),
                        goBack: this.goBack.bind(this),
                        auth: this.auth.bind(this),
                        logout: this.logout.bind(this),
                        ...this.prev
                    };
                },
                set (value) {
                    return;
                }
            });
        // this.authenticate();
        }
        authenticate(initialize) {
            if (this.unauthRoute) try {
                const config = $e081299217297ab1$var$authCredential.get("role", true);
                // console.log(52, this.authRoute);
                // console.log(53, config);
                if (config) {
                    if (initialize) {
                        // const {role, data} = config;
                        const role = config.role;
                        const data = config.data;
                        const route = this.authRoute[role];
                        // console.log(route);
                        if (route) {
                            // const {name} = route;
                            const name = route.name;
                            this.goTo(name);
                        }
                    }
                } else {
                    if (initialize) ;
                    else this.logout();
                }
            } catch (err) {
                if (initialize) ;
                else this.logout();
            }
        }
        auth(cred) {
            if (cred) {
                // let {role,token, data} = cred;
                let role = cred.role;
                let token = cred.token;
                let data = cred.data;
                $e081299217297ab1$var$authCredential.createOrUpdate("role", {
                    role: role,
                    token: token,
                    data: data
                });
            } else {
                const cred = $e081299217297ab1$var$authCredential.get("role", true);
                if (cred) {
                    let o = {};
                    if (cred) o = cred;
                    if (o.data) o = o.data;
                    if (o.user) o = o.user;
                    o.token = cred.token;
                    return o;
                } else return "token";
            }
        }
        logout() {
            try {
                $e081299217297ab1$var$authCredential.remove("role");
            } catch (err) {}
            this.goTo(this.unauthRoute, {
                replace: true
            });
        // sessionStorage.createOrUpdate('history',[]);
        }
        goTo(routeName, config) {
            try {
                let routes = this.route;
                // let {params={}, replace:isreplace} = config || {};
                let params = config.params || {};
                let isreplace = config.replace;
                let hash = null;
                const raw = Object.entries(routes);
                // console.log(108, routeName,config,isreplace, raw);
                for(let i = 0; i < raw.length; i++){
                    // const [route, config] = raw[i];
                    const route = raw[i][0];
                    const config = raw[i][1];
                    // const {name} = config;
                    const name = config.name;
                    if (name == routeName) {
                        hash = route;
                        break;
                    }
                }
                if (!hash) throw new Error(`${routeName} is not found in routes`);
                // console.log(131, hash);
                if (hash == "/") {
                    if (isreplace) location.replace(`${location.origin}${location.pathname}`);
                    else window.location = `${location.origin}${location.pathname}`;
                    return;
                }
                let path;
                hash = hash.slice(1);
                if (params.toString().includes("Object")) {
                    let p = "";
                    for(let key in params)p += `${key}=${params[key]}&`;
                    params = p;
                    path = `!/${hash}?${params}`;
                } else path = `!/${hash}`;
                if (hash == "/") path = "";
                // console.log(159, path);
                // console.log(123, isreplace);
                if (isreplace) {
                    let loc = `${location.origin}${location.pathname}#${path}`;
                    // console.log(180,loc, !Utils.isFirefox());
                    // console.log(!Utils.isFirefox());
                    $apWp0.isChrome() && !$apWp0.isFirefox() && history.replaceState(undefined, undefined, loc);
                    location.replace(loc);
                } else {
                    // console.log(128,path);
                    var a = document.createElement("a");
                    a.href = `#${path}`;
                    $apWp0.isChrome() && !$apWp0.isFirefox() && history.pushState(undefined, undefined, a.href);
                    a.click();
                // console.log(171,a.href);
                }
            } catch (err) {
                console.log(err);
            }
        }
        goBack() {
            // return storage.getAll().then(r=>{
            //     console.log(94, r);
            //     const l = r.length;
            //     if(l && l > 1){
            //         const prev = r[l-2];
            //         if(prev){
            //             this.goTo(prev);
            //         }
            //     };
            // });
            return new Promise((res, rej)=>{
                // const prev = this.history[this.history.length-2];
                // if(prev){
                //     this.goTo(prev, {replace:true});
                // };
                // console.log('hit back');
                // console.log(prev);
                window.history.back();
                res();
            });
        }
        persist() {
            if (!document.hasRouterPersist) {
                let event = "DOMContentLoaded";
                if ("deviceready" in document) event = "deviceready";
                document.addEventListener(event, (e)=>{
                    this.parse();
                    this.notify().then(()=>{
                        return this.navigate(true);
                    });
                });
                document.hasRouterPersist = true;
            }
        }
        watch() {
            if (!window.hasRouterPop) {
                // console.log('set pop state');
                window.addEventListener("popstate", (e)=>{
                    // console.log(236, e);
                    this.parse();
                    this.notify().then(()=>{
                        console.log("notified");
                        return this.clear().then(()=>{
                            console.log("cleared");
                            return this.navigate().then(()=>{
                                console.log("navigated");
                            });
                        });
                    });
                });
                window.hasRouterPop = true;
            } else this.parse();
        }
        compile(routes) {
            // console.log(167, this);
            let con = {};
            for(let key in routes){
                let config = routes[key];
                key = String(key);
                const len = key.length;
                let regex = key;
                if ([
                    "404"
                ].includes(key)) {
                    //http errors;
                    const callback = routes[key];
                    routes[key] = {
                        callback: callback,
                        name: key
                    };
                } else regex = regex.slice(1);
                regex = regex.split("/");
                regex = regex.map((item, index)=>{
                    let param = item.includes(":");
                    let a = "";
                    index == 0 ? a += "^/" : a += "/";
                    param ? a += "(([^/#?]+?))" : a += item;
                    index == len - 1 ? a += "/?$" : a += "";
                    if (param) {
                        const paramKey = item.replace(":", "");
                        if (!con[key]) con[key] = {};
                        con[key].params = {
                            [paramKey]: index
                        };
                    }
                    return a;
                });
                if (con[key] && con[key].params) con[key] = {
                    params: con[key].params,
                    regex: new RegExp(regex.join("")),
                    ...config
                };
                else con[key] = {
                    regex: new RegExp(regex.join("")),
                    ...config
                };
                // let {auth} = config;
                let auth = config.auth;
                // console.log(217,auth);
                // console.log(218,this);
                if (auth) {
                    if (this.authRoute[auth]) throw new Error(`auth ${auth} is found in other route`);
                    else this.authRoute[auth] = config;
                }
            }
            con.length = Object.keys(routes).length;
            con.keys = Object.keys(routes);
            // console.log(con);
            return con;
        }
        parse() {
            // console.log(330,this.route);
            let hash = window.location.hash, scheme, routeName;
            if (hash) {
                scheme = hash.includes("#!/") ? 2 : hash.includes("#/") ? 1 : null;
                hash = hash.slice(scheme);
            } else {
                hash = "/";
                scheme = true;
            }
            if (!scheme) return;
            const url = new URL(`http://localhost${hash}`);
            // const {search, pathname:path} = url;
            let search = url.search;
            let path = url.pathname;
            const keys = this.route.keys;
            const state = {};
            if (search) new URLSearchParams(search).forEach((value, key)=>{
                state[key] = value;
            });
            let has = false;
            for(let i = 0; i < keys.length; i++){
                const route = this.route[keys[i]];
                // const {regex, components, params, name, overlay,display,onrender} = route;
                const regex = route.regex;
                const components = route.components;
                const params = route.params;
                const name = route.name;
                const overlay = route.overlay;
                const display = route.display;
                const onrender = route.onrender;
                if (params) {
                    let _path = String(path);
                    _path = _path.slice(1);
                    _path = _path.split("/");
                    Object.entries(params).forEach((param)=>{
                        // const [key, value] = param;
                        const key = param[0];
                        const value = param[1];
                        if (_path[value]) state[key] = _path[value];
                    });
                }
                const test = regex.test(path);
                // console.log(160, test, route);
                if (test) {
                    routeName = name;
                    if (this.unauthRoute != name) this.authenticate();
                    else this.authenticate(true);
                    // console.log(381, route);
                    this.prev = {
                        components: components,
                        state: state,
                        path: path,
                        name: name,
                        prev: this.prev,
                        overlay: overlay,
                        display: display,
                        onrender: onrender
                    };
                    has = true;
                    break;
                }
            }
            if (!has) {
                if (this.route["404"]) {
                    let path = this.route["404"].callback();
                    // const {origin, pathname} = location;
                    let origin = location.origin;
                    let pathname = location.pathname;
                    if (this.route[path]) {
                        // console.log(1);
                        if (path == "/") path = `${origin}${pathname}`;
                        else if (pathname.slice(-1) == "/") path = `${origin}${pathname}#!${path}`;
                        else path = `${origin}${pathname}/#!${path}`;
                        location.replace(path);
                    } else if (!!path && !this.route[path]) {
                        if (origin.slice(-1) == "/") {
                            if (path[0] == "/") path = path.slice(1);
                        }
                        path = `${origin}${path}`;
                        location.replace(path);
                    }
                }
            }
        }
        navigate(ispersist) {
            // console.log('here', this.prev);
            if (this.prev) {
                // const {components, state, path, name, overlay, onrender={}} = this.prev;
                const components = this.prev.components;
                const state = this.prev.state;
                const path = this.prev.path;
                const name = this.prev.name;
                const overlay = this.prev.overlay;
                const onrender = this.prev.onrender || {};
                // if(overlay){
                //     storage.create(name);
                // };
                // console.log(425, components);
                try {
                    // console.log(hooks);
                    if (components.length) // return Promise.all(components.map(item=>{                        
                    //     return this.components[item].render({emit:{route:this.prev}});
                    // }));
                    return new Promise((res, rej)=>{
                        const l = components.length;
                        let i = 0;
                        if (l) {
                            const recur = ()=>{
                                let component = components[i];
                                if (components.length > i) {
                                    let componentName = component;
                                    // component = this.components[component];
                                    component = this.components.get(component);
                                    component.render({
                                        emit: {
                                            route: this.prev
                                        },
                                        ...onrender[componentName] || {}
                                    }).then(()=>{
                                        if (component.await.isConnected) component.await.isConnected && component.await.isConnected.then(()=>{
                                            recur();
                                        });
                                        else recur();
                                    }).catch((err)=>{
                                        throw err;
                                    });
                                    i += 1;
                                } else res();
                            };
                            recur();
                        } else res();
                    });
                } catch (err) {
                    console.log(err);
                    throw new Error(`some of the component in ${JSON.stringify(components)} in path ${path} of router is not found, make sure the it is created`);
                }
            }
        }
        static pushState(data, notused, path) {
            window.history.pushState(data, notused, path);
            let promise = Promise.resolve();
            if (this.prev) {
                // const {components:_components, state, path, name} = this.prev;
                const _components = this.prev.components;
                const state = this.prev.state;
                const path = this.prev.path;
                const name = this.prev.name;
                promise = new Promise((res, rej)=>{
                    const l = components1.length;
                    let i = 0;
                    if (l) {
                        const recur = ()=>{
                            let component = components1[i];
                            if (components1.length > i) {
                                // component = this.components[component];
                                component = this.components.get(component);
                                component.fire.destroy();
                                component.await.destroy.then(()=>{
                                    recur();
                                });
                            } else // rej(`${component} is not found`);
                            res();
                            i += 1;
                        };
                        recur();
                    } else res();
                });
            // promise = Promise.all(_components.map(item=>{
            //     return components[item].fire.destroy();
            // }));
            }
            return promise.then(()=>{
                return this.navigate();
            });
        }
        clear() {
            let promise = Promise.resolve();
            const overlay = this.prev && this.prev.overlay || undefined;
            //if overlay prevent in detroying current rendered component;
            if (overlay) return promise;
            // console.log('has cleared?', overlay);
            const recur = function(index, componentNames, sourceComponents, callback) {
                let component = componentNames[index];
                let componentName = component;
                let self = recur;
                try {
                    if (componentNames.length > index) {
                        // component = sourceComponents[component];
                        component = sourceComponents.get(component);
                        if (!component.fire.destroy) throw new Error(`${componentName} has no destroy handler!`);
                        component.fire.destroy();
                        component.await.destroy.then(()=>{
                            self(index, componentNames, sourceComponents, callback);
                        });
                    } else // rej(`${component} is not found`);
                    callback();
                    index += 1;
                } catch (err) {
                    throw err;
                }
            };
            // console.log(624, this.components);
            if (this.prev && this.prev.prev) {
                // const {components, state, path, name, overlay} = this.prev.prev;
                let components = this.prev.prev.components;
                let state = this.prev.prev.state;
                let path = this.prev.prev.path;
                let name = this.prev.prev.name;
                let overlay = this.prev.prev.overlay;
                let destroyPromise = Promise.resolve();
                // const components = this.prev.components;
                if (overlay) destroyPromise = new Promise((res, rej)=>{
                    const l = components.length;
                    let i = 0;
                    if (l) recur(i, components, this.components, res);
                    else res();
                });
                promise = new Promise((res, rej)=>{
                    const l = components.length;
                    // console.log(644, components, l);
                    let i = 0;
                    if (l) recur(i, components, this.components, res);
                    else res();
                });
                return destroyPromise.then(()=>{
                    return promise;
                });
            }
            return promise;
        }
        pushState(data, notused, path) {
            window.history.pushState(data, notused, path);
            let promise = Promise.resolve();
            this.clear();
            return promise.then(()=>{
                return this.navigate();
            });
        }
        static subscribe(fn) {
            if (fn && fn.constructor.name == "Function") hooks.push(fn);
        }
        notify() {
            return Promise.all(hooks.map((subscribe)=>{
                return subscribe();
            }));
        }
    };
};


var $b84740a89f2c0053$exports = {};

const $b84740a89f2c0053$var$StorageKit = (parcelRequire("jUqKh"))();

$b84740a89f2c0053$exports = class {
    constructor(){
        this.storage = new $b84740a89f2c0053$var$StorageKit({
            child: "array",
            storage: "session",
            name: "_cake_persistent"
        });
    }
    listen(components) {
        components = $3d502eb2350f1e24$exports;
        let event = "DOMContentLoaded";
        if ("deviceready" in document) event = "deviceready";
        window.addEventListener(event, (e)=>{
            setTimeout(()=>{
                this.storage.getAll().then((result)=>{
                    if (!(result && !result.length)) return;
                    for(let r = 0; r < result.length; r++){
                        let item = result[r];
                        let component = components.get(item);
                        component.isConnected = false;
                        if (component) // console.log(component, !component.isConnected);
                        !component.isConnected && component.render.bind(component)();
                        else console.error(`component ${component} is not found!`);
                    }
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



const $85cf733e32a19dfe$var$StorageKit = (parcelRequire("jUqKh"))();
var $3ae23dff16d36e2f$exports = {};
var $42cf45abb50e2aa1$exports = {};
var $d955905346e35f87$exports = {};
const $d955905346e35f87$var$stat = {
    handlers: {},
    subscribe: {}
};
window.Stat = $d955905346e35f87$var$stat;
function $d955905346e35f87$var$set(storage, component, fn) {
    if (storage[component] == undefined) storage[component] = {};
    if (storage[component][fn] == undefined) storage[component][fn] = 0;
    else storage[component][fn] += 1;
    return true;
}
$d955905346e35f87$exports = {
    handlers: {
        set: function(component, fn) {
            return $d955905346e35f87$var$set($d955905346e35f87$var$stat.handlers, component, fn);
        },
        get: function(component) {
            if ($d955905346e35f87$var$stat.handlers[component] != undefined) console.table($d955905346e35f87$var$stat.handlers[component]);
            else console.log(null);
        }
    },
    subscribe: {
        set: function(component, fn) {
            return $d955905346e35f87$var$set($d955905346e35f87$var$stat.subscribe, component, fn);
        },
        get: function(component) {
            if ($d955905346e35f87$var$stat.subscribe[component] != undefined) console.table($d955905346e35f87$var$stat.subscribe[component]);
            else console.log(null);
        }
    }
};


const $42cf45abb50e2aa1$var$subscriber = {};
window.Subscribe = $42cf45abb50e2aa1$var$subscriber;
$42cf45abb50e2aa1$exports = {
    set: function(subscribe) {
        return new Promise((res, rej)=>{
            for(component in subscribe)if (subscribe.hasOwnProperty(component)) {
                let events = subscribe[component];
                for(let event in events)if (events.hasOwnProperty(event)) {
                    let handler = events[event];
                    if (!$42cf45abb50e2aa1$var$subscriber[component]) $42cf45abb50e2aa1$var$subscriber[component] = {};
                    if (!$42cf45abb50e2aa1$var$subscriber[component][event]) $42cf45abb50e2aa1$var$subscriber[component][event] = [];
                    $42cf45abb50e2aa1$var$subscriber[component][event].push(handler);
                    $d955905346e35f87$exports.subscribe.set(component, handler.original);
                }
            }
            res();
        });
    },
    get: function(component, event) {
        return $42cf45abb50e2aa1$var$subscriber[component] && $42cf45abb50e2aa1$var$subscriber[component][event];
    }
};


var $076d448efd2055d6$exports = {};

const $076d448efd2055d6$var$handler = {};
window.Handler = $076d448efd2055d6$var$handler;
$076d448efd2055d6$exports = {
    set: function(handlers, component) {
        return new Promise((res)=>{
            for(let fn in handlers)if (handlers.hasOwnProperty(fn)) {
                let _handler = handlers[fn];
                // Handler[component][fn] = handler;
                if (!$076d448efd2055d6$var$handler[component]) $076d448efd2055d6$var$handler[component] = {};
                $076d448efd2055d6$var$handler[component][_handler.original] = _handler;
                $d955905346e35f87$exports.handlers.set(component, _handler.original);
            }
            res();
        });
    },
    get: function(component, event) {
        return $076d448efd2055d6$var$handler[component] && $076d448efd2055d6$var$handler[component][event];
    }
};



function $3ae23dff16d36e2f$var$Observer(logger) {
    this.logger = logger || false;
    this.results = {};
}
$3ae23dff16d36e2f$var$Observer.prototype.notify = function(component, /*handler- name/fn*/ event, e1 /*payload */ ) {
    /*
        calls by fire or DOM event;
        DOM Event - string;
        fire - string || fn;
    */ let _component = component;
    let _event = event;
    let _e = e1;
    let handler = $076d448efd2055d6$exports.get(_component, _event);
    if (!handler) {
        console.error(`no setup handler for the event ${_event} in ${_component} component`);
        return;
    }
    _component = handler.binded;
    //it is able to accept a promise from handlers;
    let prom = new Promise((res, rej)=>{
        let e = handler(_e);
        res(e);
    });
    $d955905346e35f87$exports.handlers.set(_component, handler.original);
    return prom.then((variable)=>{
        let execs = [];
        if (!this.results[_component]) this.results[_component] = {};
        let subscribe = $42cf45abb50e2aa1$exports.get(_component, _event);
        if (subscribe) for(let s = 0; s < subscribe.length; s++){
            let fn = subscribe[s];
            $d955905346e35f87$exports.subscribe.set(_component, fn.original);
            execs.push(new Promise((res, rej)=>{
                try {
                    let exec = (()=>{
                        return fn(variable);
                    })();
                    if (exec && exec.ObjectType == "Promise") exec.then((result)=>{
                        if (!this.results[_component]) this.results[_component] = {};
                        this.results[_component][_event] = result;
                        res(result);
                    }).catch((err)=>{
                        rej(err);
                    });
                    else {
                        this.results[_component][_event] = exec;
                        res(exec);
                    }
                } catch (e) {
                    console.log(e);
                    rej(e);
                }
            }));
        }
        else {
            if (this.logger) console.info(`no subscriber for (${_event}) event of (${_component}) component`);
            this.results[_component][_event] = variable;
        }
        return Promise.all(execs).then(()=>{
            variable = null;
            execs = [];
            return true;
        });
    });
};
$3ae23dff16d36e2f$exports = $3ae23dff16d36e2f$var$Observer;


var $1b1b4ba937462306$exports = {};
$1b1b4ba937462306$exports = function(component) {
    // let component = this;
    // console.log(component);
    // if (!component.await.$form){
    //     component.await.$form = {};
    // }
    class Options {
        constructor(type){
            this.type = type;
            this.storage = {};
        }
        store(formControl, data) {
            this.storage[formControl] = data;
        }
        get options() {
            if (this.type == "select" || this.type == "virtual") {
                let a = {};
                for(let key in this.storage){
                    let val = this.storage[key];
                    a[key] = val.options;
                }
                return a;
            }
            return false;
        }
        get value() {
            if (this.type == "input") {
                let a = "";
                for(let key in this.storage){
                    let val = this.storage[key];
                    a = val.options[0];
                }
                return a;
            }
            return false;
        }
        get query() {
            let a = {};
            for(let key in this.storage){
                let val = this.storage[key];
                a = val.query[0] || null;
            }
            return a;
        }
        get has() {
            let a = "";
            for(let key in this.storage){
                let val = this.storage[key];
                a = val.query[0] || null;
            }
            return a;
        }
    }
    const form = {};
    form.options = (obj)=>{
        // console.log(9, obj);
        // let {options, params} = obj;
        let options = obj.options;
        let params = obj.params;
        if (!options) options = [];
        // console.log(33, params);
        let isgroup = options.length > 1;
        let prom = Promise.all(options.map((item1)=>{
            // let {control, field, tbl, src, schema, type} = item;
            let control1 = item1.control;
            let field = item1.field;
            let tbl = item1.tbl;
            let src = item1.src;
            let schema = item1.schema;
            let type1 = item1.type;
            // console.log(schema)
            // console.log(15, item);
            // console.log(40,src, {tbl, field, params});
            // console.trace();
            return component.fire(src, {
                tbl: tbl,
                field: field,
                params: params
            }).then((opts)=>{
                // console.log(18, opts);
                opts = opts || [];
                item1.query = opts;
                // console.log(18, opts);
                opts = opts.map((item)=>{
                    // console.log(18, item);
                    return schema(item);
                });
                if (type1 != "input") {
                    /**appending empty option */ let scheme = schema({});
                    for(let key in scheme)if (scheme.hasOwnProperty(key)) scheme[key] = "";
                    opts.unshift(scheme);
                }
                /**end */ // console.log(opts);
                item1.options = opts;
                return item1;
            }).then((iter)=>{
                // console.log(51, iter);
                // let {type, control} = iter;
                let type = iter.type;
                let control = iter.control;
                if (!type) type = "others";
                const cls = new Options(type);
                if (isgroup) {
                    let o = {};
                    if (!o[control]) {
                        o[control] = cls;
                        o[control].store(control, iter);
                    }
                    return o;
                } else {
                    cls.store(control, iter);
                    return cls;
                }
            });
        })).then((res)=>{
            if (isgroup) return res.reduce((accu, iter)=>{
                Object.assign(accu, iter);
                return accu;
            }, {});
            else return res[0];
        }).catch((err)=>{
            console.error(err);
        });
        // component.await.$form.options = prom;
        return prom;
    };
    form.plot = (config)=>{
        // let {data, container} = config;
        let data = config.data;
        let container = config.container;
        if (!data && !container) return;
        const query = (root, selector, callback)=>{
            if (!root) {
                console.info("root is not provided!");
                return;
            }
            const els = root.querySelectorAll(`${selector}`);
            const len = els.length;
            if (!len) {
                callback(null, data);
                return; //exit;
            }
            for(let e = 0; e < len; e++){
                let el = els[e];
                let name = el.name;
                let value = data[name];
                let r = callback(el, value, e);
                if (r == "break") break;
                if (r == "continue") continue;
            }
        };
        query(container, "INPUT.input", function(el, value) {
            if (value != undefined) {
                if (el.type == "date") {
                    value = new Date(value) == "Invalid Date" ? "" : new Date(value).toJSON().split("T")[0];
                    el.value = value;
                } else el.value = value;
            }
        });
        setTimeout(()=>{
            query(container, "SELECT.input:not(.cake-template)", function(select, value) {
                // console.log(select);
                query(select, "OPTION:not(.cake-template)", function(option, _value, index) {
                    // console.log(option)
                    if (option) {
                        if (option.value == value) {
                            select.selectedIndex = index;
                            return "break";
                        }
                    } else // console.trace();
                    // console.log(_value);
                    console.log(option, _value, "provide schema");
                });
            });
        }, 500);
        return Promise.resolve();
    };
    return form;
};


parcelRequire("apWp0");





function $85cf733e32a19dfe$var$Cake(name) {
    this.componentName = name;
    this.components = {};
}
$85cf733e32a19dfe$var$Cake.app = function(config) {
    this.name = config.name || "";
};
$85cf733e32a19dfe$var$Cake.Components = function(name1) {
    return {
        subscribe (cb, ctx) {
            function subscribeExternal() {
                let component = $85cf733e32a19dfe$var$Cake.Components[name1];
                if (component) {
                    if (cb instanceof Function) {
                        let name = cb.name;
                        if (ctx) cb = cb.bind(ctx);
                        cb.binded = "external";
                        cb.original = name;
                        cb.listenTo = component.name;
                        component.Subscribe(cb);
                    }
                }
            }
            return new Promise((res, rej)=>{
                let lk = setInterval(()=>{
                    if ($85cf733e32a19dfe$var$Cake.Components[name1]) {
                        subscribeExternal();
                        clearInterval(lk);
                        res();
                    }
                });
            });
        }
    };
};
$85cf733e32a19dfe$var$Cake.Models = {};
$85cf733e32a19dfe$var$Cake.plugin = $a6b6a4746468157c$exports;
$85cf733e32a19dfe$var$Cake.Attributes = new $b1bfb376f83f0a2f$exports();
$85cf733e32a19dfe$var$Cake.Models.$loaded = function(name) {
    return new Promise((res, rej)=>{
        let mk = setInterval(()=>{
            if ($85cf733e32a19dfe$var$Cake.Models[name]) {
                clearInterval(mk);
                res($85cf733e32a19dfe$var$Cake.Models[name]);
            }
        });
        setTimeout(()=>{
            if (!$85cf733e32a19dfe$var$Cake.Models[name]) {
                clearInterval(mk);
                rej(name);
            }
        }, 10000);
    });
};
$85cf733e32a19dfe$var$Cake.MainMessageChannel = function() {
    let channel = new MessageChannel();
    return {
        send (data) {
            // console.log(data);
            channel.port2.postMessage(data);
        },
        receive (fn) {
            channel.port1.onmessage = function(payload) {
                // let {isTrusted, data} = payload || {isTrusted:false};
                let data = payload.data;
                let isTrusted = payload.isTrusted == undefined ? false : payload.isTrusted;
                if (isTrusted) fn({
                    status: 1,
                    data: data
                });
                else fn({
                    status: 0,
                    err: "not trusted!"
                });
            };
        }
    };
}();
$85cf733e32a19dfe$var$Cake.Utils = {
    scopeTrap (k) {
        return false;
    },
    scopeNotifier (m) {
        return m;
    }
};
$85cf733e32a19dfe$var$Cake.create = function(name, template, options) {
    let group = new $85cf733e32a19dfe$var$Cake(name, template, options);
    // console.log(group);
    group.create(name, template, options);
};
$85cf733e32a19dfe$var$Cake.init = function(name) {
    return new $d1cc28258f62f363$exports(name);
};
// Cake.Hasher = new Hasher(Cake.Components); 
// Cake.Hasher.listen();
$85cf733e32a19dfe$var$Cake.Router = $e081299217297ab1$exports($85cf733e32a19dfe$var$Cake.Components, $d1cc28258f62f363$exports);
$85cf733e32a19dfe$var$Cake.Persistent = new $b84740a89f2c0053$exports;
$85cf733e32a19dfe$var$Cake.Persistent.listen($85cf733e32a19dfe$var$Cake.Components);
$85cf733e32a19dfe$var$Cake.Cache = new $85cf733e32a19dfe$var$StorageKit({
    name: "cache",
    storage: "session",
    child: "object"
});
$85cf733e32a19dfe$var$Cake.getSubscriber = function(component, handler) {
    // let subscribe = Cake.Subscribe;
    let subscribe = $42cf45abb50e2aa1$exports;
    let obj = {};
    for(let c in subscribe)if (subscribe.hasOwnProperty(c)) {
        let handlers = subscribe[c];
        // console.log(handlers);
        for(let h in handlers)if (handlers.hasOwnProperty(h)) {
            let hs = handlers[h];
            for (let h1 of hs){
                let _handler = h1;
                let original = _handler.original;
                let binded = _handler.binded;
                let listenTo = _handler.listenTo;
                if (listenTo == component) {
                    // console.log(original, handler, original==handler);
                    if (original == handler) {
                        if (!obj[binded]) obj[binded] = handler;
                        else {
                            let v = obj[binded] instanceof Array ? obj[binded] : [
                                obj[binded]
                            ];
                            obj[binded] = v.concat(handler);
                        }
                    } else if (!handler) {
                        // console.log(h);
                        if (!obj[binded]) obj[binded] = original;
                        else {
                            let v = obj[binded] instanceof Array ? obj[binded] : [
                                obj[binded]
                            ];
                            obj[binded] = v.concat(original);
                        }
                    }
                }
            }
        }
    }
    return obj;
};
$85cf733e32a19dfe$var$Cake.Observer = new $3ae23dff16d36e2f$exports();
$85cf733e32a19dfe$var$Cake.prototype._defineProperty = function(component, prop, get, set) {
    Object.defineProperty(component, prop, {
        configurable: true,
        get () {
            return get();
        },
        set (value) {
            if (set) set(value);
        }
    });
};
$85cf733e32a19dfe$var$Cake.prototype._defineProperty($d1cc28258f62f363$exports.prototype, "$observer", function() {
    return $85cf733e32a19dfe$var$Cake.Observer;
});
//global scope
$85cf733e32a19dfe$var$Cake._globalScope = new $85cf733e32a19dfe$var$Scope("globalScope");
$85cf733e32a19dfe$var$Cake.prototype._defineProperty($d1cc28258f62f363$exports.prototype, "$globalScope", function() {
    const scope = $85cf733e32a19dfe$var$Cake._globalScope;
    return scope;
});
$85cf733e32a19dfe$var$Cake._universalScope = new $85cf733e32a19dfe$var$Scope("universalScope");
$85cf733e32a19dfe$var$Cake.$universalScope = function() {
    const scope = $85cf733e32a19dfe$var$Cake._universalScope;
    return scope;
};
//attributes
$85cf733e32a19dfe$var$Cake.prototype._defineProperty($d1cc28258f62f363$exports.prototype, "$attrib", function() {
    return $85cf733e32a19dfe$var$Cake.Attributes;
});
//persistent ui using sessionStorage
$85cf733e32a19dfe$var$Cake.prototype._defineProperty($d1cc28258f62f363$exports.prototype, "$persist", function() {
    return $85cf733e32a19dfe$var$Cake.Persistent;
});
//caching data;
$85cf733e32a19dfe$var$Cake.prototype._defineProperty($d1cc28258f62f363$exports.prototype, "$cache", function() {
    return $85cf733e32a19dfe$var$Cake.Cache;
});
//hash
$85cf733e32a19dfe$var$Cake.prototype._defineProperty($d1cc28258f62f363$exports.prototype, "$hash", function() {
    return $85cf733e32a19dfe$var$Cake.Hasher;
});
$85cf733e32a19dfe$var$Cake.prototype.create = function(name2, template, options) {
    // console.time(name);
    //observer
    console.time(name2);
    let component1 = new $d1cc28258f62f363$exports(name2, template, options);
    //after it has been pass to Cakem t ws assumed that the fn are binded to component holder;
    const scope = new $85cf733e32a19dfe$var$Scope(name2);
    component1.scope && (()=>{
        for(let _component in component1.scope)if (component1.scope.hasOwnProperty(_component)) {
            const handlers = component1.scope[_component];
            for(let key in handlers)if (handlers.hasOwnProperty(key)) {
                let handler = handlers[key];
                const bind = handler.name;
                handler = handler.bind(component1);
                scope.hook(_component, bind, handler);
            }
        }
    })();
    //register a notifier;
    scope.registerNotifier(function(prop, newValue, prevValue, component) {
        return $85cf733e32a19dfe$var$Cake.Attributes.notifier(prop, newValue, prevValue, component);
    });
    $85cf733e32a19dfe$var$Cake.Attributes.registerNotifier(name2, function(name, obj) {
        return scope.notifier(name, obj);
    });
    component1.compile.then(()=>{
        // let { subscribe, root, html, handlers, role, state} = component;
        let subscribe = component1.subscribe;
        let root = component1.root;
        let html = component1.html;
        let handlers = component1.handlers;
        let role = component1.role;
        let state = component1.state;
        // console.log(role == 'form');
        // console.log(284, component.name, subscribe);
        // return Cake.Observer.registerSubscribe(subscribe).then(()=>{
        //     return {root, handlers}
        // });
        return $42cf45abb50e2aa1$exports.set(subscribe).then(()=>{
            return {
                root: root,
                handlers: handlers
            };
        });
    //subscribe and handlers are binded to its componnt
    }).then((_obj)=>{
        // const {handlers,root}
        const handlers = _obj.handlers;
        const root = _obj.root;
        // Cake.Observer.registerHandlers(handlers, component.name);
        $076d448efd2055d6$exports.set(handlers, component1.name);
        this._defineProperty(component1, "root", function() {
            // console.log(281,component);
            if (component1._root) return component1._root;
            else {
                let selector = root || "#app";
                let query = document.querySelector(selector);
                if (query) return query;
            }
            throw new Error(`the selector '${root}' as container of component '${component1.name}' is not found!`);
        }, function(value) {
            Object.assign(component1, {
                _root: value
            });
        });
        //scope
        this._defineProperty(component1, "$scope", function() {
            return scope;
        });
        component1.role == "form" && (()=>{
            // console.log(component;
            const methods = $1b1b4ba937462306$exports(component1);
            // let has = !!component.root.querySelector('FORM');
            const form = ()=>{
                return component1.root.querySelector(component1.formSelector || "FORM");
            };
            for(let method in methods)if (methods.hasOwnProperty(method)) Object.defineProperty(form, method, {
                get () {
                    return methods[method];
                }
            });
            // console.log(this._defineProperty);
            this._defineProperty(component1, "$form", function() {
                return form;
            });
        })();
    }).then(()=>{
        component1.fire = function() {
            function fire1(name3, variable) {
                /**
                 * the static fn of fire are those declared in handlers;
                 * fire is also a function that accepts handler fn, that is not declared in handlers;
                 * these are commonly refers to quick functions;
                 * the usage of fire is to manually run the notify, it tells notify what handler has been fired;
                 * so that the notify will make a variable from it, to be feed to subscriber to that;
                 */ variable = !variable ? null : typeof variable == "function" ? variable.bind(component1)() : (function() {
                    return variable;
                }).bind(component1)();
                let o1 = {
                    [name3]: ()=>{
                        return variable;
                    }
                };
                fn = o1[name3].bind(component1);
                if (typeof fn == "function") {
                    fn.name = name3;
                    fn.original = name3;
                    fn.binded = component1.name;
                    $076d448efd2055d6$exports.set({
                        [name3]: fn
                    }, component1.name);
                    // const awaitNotify = Cake.Observer.notify(component.name, name, {});
                    // component.await[name] = awaitNotify;
                    // return awaitNotify;
                    let payload = variable;
                    // console.log(payload);
                    function getAttributes(element) {
                        let o = {};
                        if (!element) return o;
                        let attributes = element.attributes;
                        if (attributes) for(let i = 0; i < attributes.length; i++){
                            let attribute = attributes[i];
                            let name = attribute.name;
                            let value = attribute.value;
                            o[name] = value;
                        }
                        return o;
                    }
                    if (variable && (variable.element || variable.root || variable.container)) {
                        const element = getAttributes(variable.element);
                        const root = getAttributes(variable.root);
                        const container = getAttributes(variable.container);
                        payload = {
                            status: 0,
                            attributes: {
                                element: element,
                                root: root,
                                container: container
                            }
                        };
                    }
                    // console.log(392, {component:component.name, event:name, payload});
                    // Cake.MainMessageChannel.send({component:component.name, event:name, payload});
                    const notify = $85cf733e32a19dfe$var$Cake.Observer.notify(component1.name, name3, {}).then(()=>{
                        return $85cf733e32a19dfe$var$Cake.Observer.results[component1.name][name3];
                    });
                    component1.await[name3] = notify;
                    return component1.await[name3];
                }
                console.error(`the param in fire is not an instance of function`);
            }
            function addStaticMethod(fire, handlers) {
                for(let h in handlers)if (handlers.hasOwnProperty(h)) {
                    let handler = handlers[h];
                    let event = handler.original;
                    let fn = {
                        [event]: function(variable, isBroadcast) {
                            //automatic broadcast if the event is destroy;
                            if (isBroadcast != undefined) isBroadcast;
                            if (isBroadcast == undefined && event == "destroy") //force to broadcast is destroy event;
                            isBroadcast = true;
                            if (isBroadcast == undefined) isBroadcast = false;
                            // console.log(461, component.name, event, isBroadcast);
                            if (isBroadcast) {
                                /**
                                     * async
                                     */ component1.await[event] = new Promise((res)=>{
                                    //without setTimeout, there will be a problem;
                                    //i think setTimeout, helps the promise to call resolve;
                                    //as it commands the promise to resolve on the next clock tick;
                                    setTimeout(()=>{
                                        let payload = variable || {};
                                        $85cf733e32a19dfe$var$Cake.Observer.notify(component1.name, event, payload).then(()=>{
                                            return $85cf733e32a19dfe$var$Cake.Observer.results[component1.name][event];
                                        }).then((r)=>{
                                            res(r);
                                        }).catch((err)=>{
                                            console.log(448, component1.name, event, payload);
                                            console.trace();
                                            console.error(err);
                                        });
                                    });
                                });
                                return component1.await[event];
                            } else return handler(variable);
                        }
                    };
                    // console.log(412, event, fn);
                    fn[event] = fn[event].bind(component1);
                    fn[event].originalName = event;
                    fn[event].binded = component1.name;
                    fire[event] = fn[event];
                    fire.component = component1.name;
                }
            }
            addStaticMethod(fire1, component1.handlers);
            return fire1;
        }();
    }).then(()=>{
        if (component1.type == "view") {
            component1.toggler = component1.toggler(component1);
            // Cake.Components[name] = component;
            $3d502eb2350f1e24$exports.set(name2, component1);
        }
    }).then(()=>{
        //update the binding of data, trigger, and utils option of component;
        component1.options.router && $85cf733e32a19dfe$var$Cake.Router.subscribe(component1.options.router.bind(component1));
        component1.options.data && component1.options.data.bind(component1.data)(component1);
        component1.options.init && component1.options.init.bind(component1)();
        component1.options.utils && component1.options.utils.bind(component1.utils)(component1);
    }).then(()=>{
        if (component1.type == "model") $85cf733e32a19dfe$var$Cake.Models[name2] = component1;
        if (component1.isStatic && component1.type == "view") component1.render();
    });
};
$85cf733e32a19dfe$exports = $85cf733e32a19dfe$var$Cake;


window.Cake = $85cf733e32a19dfe$exports;


//# sourceMappingURL=cake.js.map
