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

const OBJECT = {
    dictionary:function(obj,path){
        if(path){
            path = path.split('.');
        };
        for (let p = 0; p < path.length; p++){
            if(obj[p]){
                obj = obj[p];
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
        let map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            "/": '&#x2F;',
        };
        map = Object.keys(map).reduce((accu, key)=>{
            if(!exclude.includes(key)){
                accu[key] = map[key];
            };
            return accu;
        },{});
   
        const reg = /[&<>"'/]/ig;
        return string.replace(reg, (match)=>{
            return map[match] || match;
        });
    },
    toFormData:function(form, options={}){
        const controls = [];
        const textareas = form.querySelectorAll('TEXTAREA');
        const inputs = form.querySelectorAll('INPUT');
        const selects = form.querySelectorAll('SELECT');
        

        function loop(arr, cont){
            for (let i = 0; i < arr.length; i++){
                cont.push(arr[i]);
            };
        };

        loop(textareas, controls);
        loop(inputs, controls);
        loop(selects, controls);


        let o = {};

        for (let i = 0; i < controls.length; i++){
            let control = controls[i];
            let key = control.name || control.id;

            if(key && ["{{","((","[[","<<","%%","&&"].includes(key)){

            } else {
                let type;
                const element = form[key];

                
                if(element){

                    if(element.closest && !element.closest('.cake-template')){
                        const tag = element.tagName;
                        
                        if(tag == 'INPUT' && element.getAttribute('type') == 'checkbox'){
                            value = element.checked;
                        } else {
                            value = this.sanitize(element.value,options.sanitize);
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
        };
        

        if(options.json){
            return o;
        } else {
            let fd = new FormData();
            for (let key in o){
                if (o.hasOwnProperty(key)){
                    fd.append(key, o[key]);
                };
            };
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
    },
    escapeRegExp(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }
};

try {
    global.UTILS = {...LOOP, ...TYPES, ...OTHERS, ...STRING};
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