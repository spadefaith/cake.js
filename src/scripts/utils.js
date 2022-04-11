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
            if(!!value){
                value = this.sanitize(value);
            };
            if(options.json){
                if(options.trim){
                    if(!!value){
                        o[key] = value;
                    };
                } else {
                    o[key] = value;
                }; 
            } else {
                fd.append(key, value);
            }
        };
        if(options.json){
            return o;
        } else {
            return fd;
        };
    },
    loopStringSplitSpace:function(string, fn){
        if(string){
            string = string.split(" ");
            if(TYPES.isArray(string)){
                for (let i = 0; i < string.length; i++){
                    fn(string[i]);
                };
            };
        }
    },
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