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
    each:function(ctx, fn, type){
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
    map:function(ctx, fn){
        var type = TYPES.isArray(ctx) || ctx.length ? 'array': 'object';
        var st = ctx.length &&  type == 'array'?[]:{};
        this.each(ctx, function(obj, index){
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
        this.each(ctx, function(obj, index){
            accu = fn(obj,accu, index);
        }, type);
        return accu;
    },
    filter:function(ctx, fn){
        var type = TYPES.isArray(ctx) || ctx.length ? 'array': 'object';
        var st = ctx.length && type == 'array'?[]:{};
        this.each(ctx, function(obj, index){
            var r = fn(obj, index);
            if (r){
                if (type == 'object'){
                    st[obj.key] = obj.value;
                } else {
                    st.push(obj.value);
                };
            };
        }, type);
        return st;
    },
};

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
                if(istrim && val){
                    searchParams += `${encodeURI(key)}=${encodeURI(val)}&`;
                } else {
                    searchParams += `${encodeURI(key)}=${encodeURI(val)}&`;
                };
            };
        };
        return searchParams;
    },
    sanitize:function(string){
        if(typeof string != 'string'){
            return string;
        };
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            "/": '&#x2F;',
        };
        const reg = /[&<>"'/]/ig;
        return string.replace(reg, (match)=>(map[match]));
    },
    toFormData:function(form, options={}){
        
        let formData = new FormData(form);
        let o = {};
        let fd = new FormData();
        for (let [key, value] of formData.entries()){
            let type;
            if(form[key]){
                const element = form[key];
                // console.log(element, element.parentElement, element.closest('.cake-template'));
                if(element.closest && !element.closest('.cake-template')){
                    const tag = element.tagName;
                    if(tag == 'INPUT' && element.getAttribute('type') == 'checkbox'){
                        value = element.checked;
                    } else {
                        if(options.sanitize == undefined || !!options.sanitize){
                            value = this.sanitize(value);
                        };
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
                        fd.append(key, value);
                    }
                };

            };


        };
        if(options.json){
            return o;
        } else {
            return fd;
        };
    },
    splitBySpace:function(string, fn){
        if(string){
            string = string.split(" ");
            if(TYPES.isArray(string)){
                for (let i = 0; i < string.length; i++){
                    fn(string[i]);
                };
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
    removeWhiteSpace(str){
        return String(str).split(" ").join("");
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
        var isChrome = !!window.chrome && !!window.chrome.webstore;
        // Blink engine detection
        var isBlink = (isChrome || isOpera) && !!window.CSS;
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
        return this.browser == 'Opera';
    },
    isFirefox(){
        return this.browser() == 'Firefox';
    },
    isSafari(){
        return this.browser == 'Safari';
    },
    isChrome(){
        return this.browser == 'Chrome';
    },
    isIE(){
        return this.browser == 'IE';
    },
    isEdge(){
        return this.browser == 'Edge';
    },
    isBlink(){
        return this.browser == 'Blink';
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
    }
}

try {
    global.UTILS = {...LOOP, ...TYPES, ...OTHERS};
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
};

module.exports = global.UTILS;