var global = {};
const TYPES = {
    typeof: function(ctx){
        switch(true){
            case typeof ctx == 'string': return 'string';
            case typeof ctx == 'number': return 'number';
            case ctx instanceof Array: return 'array';
            case ctx instanceof Function: return 'function';
            case ctx instanceof HTMLCollection: return 'htmlcollection';
            case ctx instanceof NodeList: return 'htmlnodelist';
            case ctx instanceof Element: return 'domlement';
            case ctx instanceof Object: return 'object';
        };
    },
    isArray:function(ctx){
        return this.typeof(ctx) == 'array';
    },
    isObject:function(ctx){
        return this.typeof(ctx) == 'object';
    },
    isNumber:function(ctx){
        return this.typeof(ctx) == 'number';
    },
    isString:function(ctx){
        return this.typeof(ctx) == 'string';
    },
    isHTMLCollection:function(ctx){
        return this.typeof(ctx) == 'htmlcollection';
    },
    isNodeList:function(ctx){
        return this.typeof(ctx) == 'htmlnodelist';
    },
    isElement:function(ctx){
        return this.typeof(ctx) == 'domlement';
    },
    isFunction:function(ctx){
        return this.typeof(ctx) == 'function';
    },
};

const LOOP = {
    _each:function(ctx, fn, type){
        
        if (type == 'object'){
            var i = 0;
            for (var key in ctx){
                if (ctx.hasOwnProperty(key)){
                    fn({key, value:ctx[key]}, i);
                    i = i + 1;
                };
            };
        } else {
            for (var a = 0; a < ctx.length; a++){
                fn(ctx[a], a);
            }
        };
    },
    each:function(ctx, fn){
        var type = TYPES.isArray(ctx) || ctx.length ? 'array': 'object';
        this._each(ctx,  function(obj, index){
            fn(obj, index);
        },type);
    },
    map:function(ctx, fn){
        var type = TYPES.isArray(ctx) || ctx.length ? 'array': 'object';
        var st = ctx.length &&  type == 'array'?[]:{};
        this._each(ctx, function(obj, index){
            var r = fn(obj, index);
            if (type == 'object'){
                st[r.key] = r.value;
            } else {
                st.push(r)
            };
        }, type);
        return st;
    },
    reduce: function(ctx, accu, fn){
        var type = TYPES.typeof(ctx);
        this._each(ctx, function(obj, index){
            accu = fn(obj,accu, index);
        }, type);
        return accu;
    },
    filter:function(ctx, fn){
        var type = TYPES.isArray(ctx) || ctx.length ? 'array': 'object';
        var st = ctx.length && type == 'array'?[]:{};
        this._each(ctx, function(obj, index){
            var r = fn(obj, index);
            if (r){
                if (type == 'object'){
                    st[obj.key] = obj.value;
                } else {
                    st.push(obj.value);
                };
            };
        },type);
        return st;
    },
};

const OBJECT = {
    dictionary:function(obj,path){
        if(path){
            path = path.split('.');
        };
        for (let p = 0; p < path.length; p++){
            let _p = path[p];
            if(obj[_p]){
                obj = obj[_p];
            } else{
                obj = null;
                break;
            };
        };
        return obj;
    }
};

const STRING = {
    removeWhiteSpace(str){
        return String(str).split(" ").join("");
    },
}

function _log(){
    console.log(...arguments);
}
_log.if = function(condition){
    return condition ? function(){console.log(...arguments)} : ()=>{};
}

const OTHERS = {
    perf:function(fn){
        console.time('test');
        fn();
        console.timeEnd('test');
    },
    logTest:function(a, ops, b){
        try { a = JSON.parse(a)}catch(err){}
        try { b = JSON.parse(b)}catch(err){}
        switch (ops) {
            case '==':{
                return a == b;
            };
            case '!=':{
                return a != b;
            };
            case '<':{
                return a < b;
            };
            case '>':{
                return a > b;
            };
            case '>=':{
                return a >= b;
            };
            case '<=':{
                return a <= b;
            };
        }
    },
    toUrlSearchParams:function(obj,istrim=true){
        let searchParams = "";
        for(let key in obj){
            if(obj.hasOwnProperty(key)){
                let val = obj[key];
                if(val.toString().includes('Object')){
                    val = JSON.stringify(val);
                };
                if(istrim && val){
                    searchParams += `${encodeURI(key)}=${encodeURI(val)}&`;
                } else {
                    searchParams += `${encodeURI(key)}=${encodeURI(val)}&`;
                };
            };
        };
        return searchParams.slice(0, searchParams.length - 1);
    },
    sanitize:function(string, exclude=[]){
        if(typeof string != 'string'){
            return string;
        };
        // let map = {
        //     '&': '&amp;',
        //     '<': '&lt;',
        //     '>': '&gt;',
        //     '"': '&quot;',
        //     "'": '&#x27;',
        //     "/": '&#x2F;',
        // };
        // map = Object.keys(map).reduce((accu, key)=>{
        //     if(!exclude.includes(key)){
        //         accu[key] = map[key];
        //     };
        //     return accu;
        // },{});
   
        // const reg = /[&<>"'/]/ig;
        // return string.replace(reg, (match)=>{
        //     return map[match] || match;
        // });
        // return decodeURIComponent(string.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,""));
        return decodeURIComponent(string.replace(/<.*>/, ""));
    },
    toFormData:function(form, options={}){
        //trim, json, skipsanitize, sanitize = boolean

        const controls = [];
        const textareas = form.querySelectorAll('TEXTAREA');
        const inputs = form.querySelectorAll('INPUT');
        const selects = form.querySelectorAll('SELECT');
        

        function loop(arr, cont, sort){
            let files = [];
            for (let i = 0; i < arr.length; i++){
                let test = true;
                
                try {
                    test = arr[i].closest('.cake-template');
                } catch(err){};
                try {
                    if(!test){
                        test = arr[i].classList.includes('cake-template');
                    };
                } catch(err){};
                if(test){} else {
                    if(arr[i].getAttribute('type') == 'file'){
                        files.push(arr[i]);
                    } else {
                        cont.push(arr[i]);
                    }
                };
            };
            if(files.length){
                files.forEach(item=>{
                    cont.push(item);
                });
                files = [];
            };
        };

        loop(textareas, controls);
        loop(selects, controls);
        loop(inputs, controls, true);

        let o = {};

        for (let i = 0; i < controls.length; i++){
            let control = controls[i];
            let key = control.name || control.id;


            if(key && ["{{","((","[[","<<","%%","&&"].includes(key)){

            } else {
                let type;
                let element = form[key];

                
                if(element){

                    if(element.nodeType){

                    } else if(element.length){
                        for (let i = 0; i < element.length; i++){
                            let el =  element[i];
                            if(el.nodeType == 1){
                                let test = el.closest('.cake-template');
                                if(test){

                                } else {
                                    element = el;
                                    break;
                                };
                            };
                        };     
                    };

                    const tag = element.tagName;
                    
                    if (tag == 'SELECT'){
                        value = element.value
                    }  else if(tag == 'INPUT' && element.getAttribute('type') == 'checkbox'){
                        value = element.checked;
                    } else if(tag == 'INPUT' && element.getAttribute('type') == 'file'){
                        value = element.files;
                    } else {
                        if(options.sanitize == false){
                            value = element.value;
                        } else {
                            value = this.sanitize(element.value,options.skipsanitize);
                        }
                    };
                    
                    if(options.json){
                        if(options.trim){
                            if(value != ""){
                                o[key] = value;
                            };
                        } else {
                            o[key] = value;
                        }; 
                    } else {
                        o[key] = value;
                    }
    
                };
            };
        };
        

        if(options.json){
            return o;
        } else {
            let fd = new FormData();
            for (let key in o){
                if (o.hasOwnProperty(key)){
                    let value = o[key];
                    
                    if(value.constructor.name == "FileList"){
                        LOOP.each(value, function(item, index){
                            fd.append(key, item, item.name);
                        });
                    } else {
                        fd.append(key, value);
                    };
                };
            };
            return fd;
        };
    },
    splitBySpace:function(string, fn){
        if(string){
            string = string.split(" ");
            for (let i = 0; i < string.length; i++){
                fn(string[i]);
            };
        }
    },
    toArray(arrayLike){
        let a = [];
        if(!arrayLike.length){
            return a;
        };
        for (let i = 0; i < arrayLike.length; i++){
            a.push(arrayLike[i]);
        };
        return a;
    },
    timeOut(fn, time=1){
        setTimeout(()=>{
            fn();
        }, time);
    },
    instanceID(){
        //to have unique identifier every web app using this, in sessionStorage or localStorage;
        return location.origin;
    },
    recurse(array, callback){
        return new Promise((res, rej)=>{
            try {
                let l = array.length;
                let index = 0;
                const rec = (()=>{
                    if(l > index){
                        callback(array[index]);
                        index += 1;
                        rec();
                    } else {
                        res();
                    };
                });rec();
            } catch(err){
                rej(err.message);
            };
        });
    },
    browser(){
        // Return cached result if avalible, else get result then cache it.


        if (window._browser)
        return window._browser;
        // Opera 8.0+
        var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
        // Firefox 1.0+
        var isFirefox = typeof InstallTrigger !== 'undefined';
        // Safari 3.0+ "[object HTMLElementConstructor]" 
        var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification);
        // Internet Explorer 6-11
        var isIE = /*@cc_on!@*/false || !!document.documentMode;
        // Edge 20+
        var isEdge = !isIE && !!window.StyleMedia;
        // Chrome 1+
        var isChrome = !!window.chrome  || !!window.cordova;
        // Blink engine detection
        var isBlink = (isChrome || isOpera) && !!window.CSS;

        console.log(394,isChrome);

        return window._browser =
            isOpera ? 'Opera' :
            isFirefox ? 'Firefox' :
            isSafari ? 'Safari' :
            isChrome ? 'Chrome' :
            isIE ? 'IE' :
            isEdge ? 'Edge' :
            isBlink ? 'Blink' :
            "Don't know";
    },
    isOpera(){
        return this.browser() == 'Opera';
    },
    isFirefox(){
        return this.browser() == 'Firefox';
    },
    isSafari(){
        return this.browser() == 'Safari';
    },
    isChrome(){
        return this.browser() == 'Chrome';
    },
    isIE(){
        return this.browser() == 'IE';
    },
    isEdge(){
        return this.browser() == 'Edge';
    },
    isBlink(){
        return this.browser() == 'Blink';
    },
    device(){
        if(navigator.userAgent.includes('Android')){
            return 'android';
        } else if(/iPhone|iPad|iPod/i.test(navigator.userAgent)){
            return 'IOS'
        } else {
            return 'desktop';
        };
    },
    isAndroid(){
        return this.device() == 'android';
    },
    isIOS(){
        return this.device() == 'ios';
    },
    isDesktop(){
        return this.device() == 'desktop';
    },
    escapeRegExp(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    },
    log:_log,
};

const ARRAY = {
    unique:function(arr, prop){
        if(Set && TYPES.isArray(arr)){
            return [...new Set(arr)];
        } else {
            let a = {};
            Loop.each(arr, function(item, index){
                if(prop && TYPES.isObject(item)){
                    let p = OBJECT.dictionary(item, prop);
                    if(p){
                        a[p] = true;
                    };
                } else {
                    a[item] = true;
                };
            });
            return Object.keys(a);
        };
    }
}

try {
    global.UTILS = {...LOOP, ...TYPES, ...OTHERS, ...STRING,...ARRAY};
} catch (err){
    global.UTILS = {};

    var iter = LOOP.each;
    iter(LOOP, function(key, value){
        global.UTILS[key] = value;
    });
    iter(TYPES, function(key, value){
        global.UTILS[key] = value;
    });
    iter(OTHERS, function(key, value){
        global.UTILS[key] = value;
    });
    iter(STRING, function(key, value){
        global.UTILS[key] = value;
    });
};

module.exports = global.UTILS;