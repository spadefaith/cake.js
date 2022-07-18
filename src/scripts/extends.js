(function(global){
    HTMLCollection.prototype.toArray = function(){
        let b = [];
        for (let a = 0; a < this.length ;a++){
            b[a] = this[a];
        }
    
        return b;
    };
    NodeList.prototype.toArray = function(){
        
        let b = [];
        let index = -1;
        let length = this.length;
        while(++index < length){
            b[index] = this[index];
        };
        // console.trace();
        // console.log(b);
        return b;
    };
    Object.cache = Object.create(null);

    Object.caching = (name)=>{
        const obj = Object.cache;
        if(!obj[name]){
            obj[name] = {};
        };

        return {
            set(key, value){
                obj[name][key] = value;
                return true;
            },
            get(key){
                return obj[name][key];
            },
        };
    };
    
    String.prototype.toHyphen = function(){
        let _StringCache = Object.cache;
        let cvt = null;
        let str = this;

        if (!_StringCache.toHyphen){
            _StringCache.toHyphen = {};
        };
        if (_StringCache[str]){
            cvt = _StringCache[str];
        };

        if (cvt != undefined){
            return cvt;
        };
        let splitted = str.split('');
        // console.log(splitted)
        let ss = "", i = -1;
        while (++i < splitted.length){
            let s = splitted[i];
            switch(i){
                case 0:{
                    ss += s.toLowerCase();
                } break;
                default:{
                    s.charCodeAt() < 91 && (ss += '-');
                    ss += s.toLowerCase();
                }
            }
        };
        _StringCache[str] = ss;
        cvt = ss;

        
        return cvt;
    };

    String.prototype.toProper = function(){
        let str = this;
        let cache = Object.caching('toProper').get(str);
        if(cache){
            return cache;
        } else {
            let first = str.substring(0,1);
            let rest = str.slice(1);
            let proper = `${first.toUpperCase()}${rest}`;
            Object.caching('toProper').set(str, proper);
            return proper;
        };
    };
    String.prototype.removeSpace = function(){
        return this.split(" ").join("");
    };
    
    String.prototype.toCamelCase = function(){
        let str = this.toLowerCase();
        let _StringCache = Object.cache;

        let cvt =null;

        if(!_StringCache.toCamel){
            _StringCache.toCamel = {};
        };
        _StringCache = _StringCache.toCamel;

        if(_StringCache[str]){
            return _StringCache[str];
        } else {
            let split = str.split('-');
            if (split.length == 1){
                return str;
            };
            let join = "";
            let i = -1;
            let length = split.length;
            while (++i < length){
                let str = split[i];
                switch(i){
                    case 0:{join += str};break
                    default:{
                        let first = str.substring(0,1).toUpperCase();;
                        let second = str.substring(1);
                        join += (first+second);
                    } break;
                }
            };
            _StringCache[str] = join;
            return join;
        };
    };
    
    HTMLElement.prototype.querySelectorIncluded = function(selector, attr, val){
        let q = this.querySelector(selector);
        return (q)?q:(()=>{
            switch (true){
                case !attr && !val:{
                    let qu = this.closest(selector);
                    if (qu == this){
                        q = qu;
                    };
                };
                break;
                case !!attr && !!val:{
                    
                    q = this.getAttribute(attr) == val?this:null;
                };
                break;
                case !!attr && !val:{
                    q = this.getAttribute(attr)?this:null;
                }
                break;
            };
            return q;
        })();
    };


    
    HTMLElement.prototype.querySelectorAllIncluded = function(selector, attr, val){
        let q;
        try {
            q = this.querySelectorAll(selector);
            q && (q = q.toArray());
        } catch(err){
            q = [];
        };

        if(selector){
            q = this.querySelectorAll(selector).toArray();
        } else if (attr && val){
            q = this.querySelectorAll(`[${attr}=${val}]`).toArray();
            if(this.dataset[attr] == val){
                q.push(this);
            };
        } else if (attr && !val){
            q = this.querySelectorAll(`[${attr}]`).toArray();
            if(!!this.dataset[attr]){
                q.push(this);
            };
        };

        switch (true){
            case !attr && !val:{
                let qu = this.closest(selector);
                qu == this && q.push(qu);
            };
            break;
            case attr && val:{
                // this.getAttribute(attr) == val && q.push(this);
            };
            break;
            case attr && !val:{
                
                // this.getAttribute(attr) && q.push(this);
            }
            break;
        };
        return q;
    };
    
    HTMLDocument.prototype.querySelectorIncluded = function(selector){
        return this.querySelector(selector);
    };
    
    HTMLDocument.prototype.querySelectorAllIncluded = function(selector){
        return this.querySelectorAll(selector);
    };
    
    
    
    Array.prototype.toggler = function(dataName, activeClass){
        for (let t = 0; t < this.length; t++){
            let node = this[t];
            let name = node.dataset.name;
            if (name == dataName){
                node.classList.toggle(activeClass);
            } else {
                if (node.classList.contains(activeClass)){
                    node.classList.toggle(activeClass);
                };
            };
        };
    };
    
    HTMLElement.prototype.Ref = function(){
        let n = '_cakes_storage';
        !this[n] && (this._cakes_storage = {})
        let storage = this[n];
        return {
            set(key, value){
                storage[key] = value;
            },
            get(key){
                return storage[key];
            },
            getAll(key){
                return storage;
            },
            remove(key){
                delete storage[key];
            }
        }
    };

    HTMLElement.prototype.replaceDataSrc = function(){
        let srcs = this.querySelectorAllIncluded(null, 'data-src',null);
        for (let s = 0; s < srcs.length; s++){
            let el = srcs[s];
            el.setAttribute('src', el.dataset.src);
            el.removeAttribute('data-src');
        };
    };


    Object.keep = function(path, data){
        let rawdirs = path.split(".");
        let dirs = rawdirs.slice(1);
        let isArray = data.constructor.name=='Array';
        let ins = isArray?[]:{};

        const has = function(obj, prop, value){
            if(!obj[prop]){
                obj[prop] = value==undefined?{}:value;
            };
            return obj[prop];
        };

        if(rawdirs[0]){
            has(Object.cache, rawdirs[0], (dirs.length)?{}:data);
        };

        let orig = Object.cache[rawdirs[0]];

        for (let i = 0; i < dirs.length; i++){
            let dir = dirs[i];
            let last = dirs.length -1 == i;
        
            if(last){
                orig = has(orig, dir, ins);
                if(isArray){
                    orig = orig.concat(data);
                } else {
                    orig = Object.assign(orig, data);
                };
            } else {
                orig = has(orig, dir, {});
            };
        };
        return Object.cache[rawdirs[0]];
    };
    
})(window);