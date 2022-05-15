const Utils = require('./utils');
module.exports = function(){
    /**
     * this class is use to unified the use of storage, in
     * object for memory and storages for sessionStorage/localStorage;
     */
    // const Utils = dependency.Utils;
    // const appName = deoendenvy.appName;

    function typeOf(_obj){
        if(!_obj){
            return null;
        };
        return (_obj).constructor.name.toLowerCase();
    };
    function ObjectForEach (obj, fn){
        for (let key in obj){
            if (obj.hasOwnProperty(key)){
                
                fn(obj[key], key);
            };
        };
    };
    function ObjectMerge (obj, value, key){
        obj = Object.assign(obj, {[key]:value});
    };
    function isNull(d){
        return d === null;
    };
    function isUndefined(d){
        return d === undefined;
    };
    function isArray(_obj){
        return typeOf(_obj) == 'array';
    };
    function isObject(_obj){
        return typeOf(_obj) == 'object';
    };
    var hasInArray = function(src, id){
        var has = null;
        for (var i = 0; i < src.length; i++){
            var item = src[i];
            if (typeOf(id) == 'object'){
                var obj = id;
                var key = Object.keys(id)[0];
                var value = obj[key];
                if (typeOf(item) == 'object'){
                    var test = item[key] == value;
                    if (test){
                        has = i;
                        break;
                    };
                };
            } else if(typeOf(id) != 'array'){
                var test = id == item;
                if (test){
                    has = i;
                    break;
                };
            };
        };
        return has;
    };
    var hasInObject = function(src, id){
        var key = null;
        var type = typeOf(id); 
        if (type == 'object'){
            var _key = Object.keys(id)[0];
            if (src[key] != undefined && src[key] == id[_key]){
                key = _key;
            };
        } else if(type == 'string') {
            key = id;
        };
        return key;
    };
    var hasItem = function(src, id){
        var has = null;
        if (typeOf(src) == 'array'){
            has = hasInArray(src, id);
        } else if (typeOf(src) == 'object'){
            has = hasInObject(src, id);
        };
        return has;
    };
    var STORAGE = class{
        constructor(type, name, child){
            this.type = type;
            this.name = `${Utils.instanceID()}-${name}`;
            this.child = child;
            this.cache = {};
            if (typeOf(this.child) == 'string'){
                this.child = child=='array'?[]:child=='object'?{}:false;
            };
        }
        init(save){
            if (this[this.type]){
                this[this.type](save);
                return true;
            };
            return false;
        }
        open(){
            if (this.type == 'session'){
                var decoded = JSON.parse(sessionStorage[this.name]);
                // if (this.name == '_cake_persistent'){
                //     console.log(2503,decoded);
                // };
                return decoded[this.name];
            } else if(this.type == 'local'){
                var decoded = JSON.parse(localStorage[this.name]);
                return decoded[this.name];
            } else {
                // console.log(119,this.type,this.cache);
                return this.cache[this.name];
            };
        }
        close(storage){
            this.child = storage;
            this.recache();
            // console.log(94,this.name, storage);
            return this.init(true);
        }
        recache(){
            this.cache[this.name] = this.child;
        }
        create(){
            // console.log(93, this.name, this.cache);
            this.cache[this.name] = this.child;
            
        }
        array(){
            this.create();
        }
        object(issave){
            this.create();
            // console.log(120,this.type,this.cache);
            // console.trace();
        }
        session(save){
            if(!save){
                this.recache();
            };
            try{
                if (!sessionStorage[this.name] && !save){
                    sessionStorage.setItem(this.name, JSON.stringify(this.cache));
                } else if (save){
                    sessionStorage.setItem(this.name, JSON.stringify(this.cache));
                } else {

                };
            } catch(err){
                this.recache();
            };
        }
        local(save){
            // this.verifyLocalStorage();
            if(!save){
                this.recache();
            };
            try{
                if (!localStorage[this.name] && !save){
                    localStorage.setItem(this.name, JSON.stringify(this.cache));
                } else if (save){
                    localStorage.setItem(this.name, JSON.stringify(this.cache));
                } else {

                };
            } catch(err){
                this.recache();
            };
        }
        // verifyLocalStorage(){
        //     if(!sessionStorage.reset){
        //         sessionStorage.setItem('reset', false);
        //         localStorage.clear();
        //     };
        // }
    };
    var methods = {
        create:function(storage, data){

            if(isArray(storage)){
                let unique = new Set(storage);
                if (typeOf(data) == 'array'){
                    data.forEach(i=>{
                        unique.add(i);
                    });
                } else {
                    unique.add(data)
                };
                storage = Array.from(unique)
            } else if (isObject(storage)){
                if (isObject(data)){
                    ObjectForEach(data, function(value, key){
                        storage[key] = value;
                    });
                } else {
                    storage[data] = data;
                };
            };

            return storage;
        },
        createOrUpdate:function(storage, data){
            var has = hasItem(storage, data);
            if (typeOf(storage) == 'array'){
                if (!isNull(has)){
                    storage[has] = data;
                } else {
                   storage.includes(data);
                }
            } else if (typeOf(storage) == 'object'){
                if (isNull(has)){
                    if (isObject(data)){
                        ObjectForEach(data, function(value, key){
                            ObjectMerge(storage, value, key);
                        });
                    } else {
                        storage[data] = data;
                    };
                } else {
                    storage[has] = data;
                };
            };
            return storage;
        },
        remove:function(storage, id){
            if (typeOf(id) == 'string'){
                var has = hasItem(storage, id);
                if (typeOf(storage) == 'object'){
                    delete storage[has];
                } else if (typeOf(storage) == 'array'){
                    var arr = [];
                    for (var i = 0; i < storage.length; i++){
                        if (i != has){
                            arr.push(storage[i]);
                        } else {continue};
                    };
                    storage = arr;
                };
                return storage;
            } else if (typeOf(id) == 'object'){
                return Object.filter(storage, function(value, key){
                    var test = id[key] != undefined && id[key] == value;
                    return !test;
                });
            } else if (typeOf(id) == 'array'){
                return Object.filter(storage, function(value, key){
                    var test = id.contains(key);
                    return !test;
                });
            };
            if (isNull(has)){
                return false;
            };
        },
        get:function(storage,id){
            var type = typeOf(id);
            if (type == 'string'){
                var has = hasItem(storage, id);

                if (has == 0 || has){
                    return storage[has];
                };
            } else if (type == 'object'){
                return Object.filter(storage, function(value, key){
                    var test = !isUndefined(id[key]) && id[key] == value;
                    return test;
                });
            } else if (type == 'array'){
                return Object.filter(storage, function(value, key){
                    var test = id.contains(key);
                    return test;
                });
            }
            return null;
        },
        getNot:function(storage,id){
            var type = typeOf(id);
            if (type == 'string'){
                return Object.filter(storage, function(value, key){
                    var test = key != id;
                    return test;
                });
            } else if (type == 'object'){
                return Object.filter(storage, function(value, key){
                    return Object.some(id,function(_value, _key){
                        var test = _key == key && _value == value;

                        return !test;
                    })
                });
            } else if (type == 'array'){
                return Object.filter(storage, function(value, key){
                    var test = !id.contains(key);
                    return test;
                });
            }
            return null;
        },
        getAll:function(storage){
            return storage;
        },
    };
    var USB = class{
        constructor(_obj){
            this.name = _obj.name;
            this.storageType = _obj.storage;
            this.child = _obj.child || 'object';
            try {
                if (typeOf(this.child) == 'string'){
                    this.child = this.child == 'array'?[]:this.child=='object'?{}:null;
                };



            } catch(err){
                if (this.storageType == 'session'){
                    sessionStorage.clear();
                } else if (this.storageType == 'local'){
                    localStorage.clear();
                };

                if (typeOf(this.child) == 'string'){
                    this.child = this.child == 'array'?[]:this.child=='object'?{}:null;
                };

            };
            if (!['array', 'object'].includes(typeOf(this.child))){
                throw new Error('the child must be an object or array type.');
            };


            this.storage = new STORAGE(this.storageType, this.name, this.child);
            this.storage.init();
        }
        has(id){
            var storage = this.storage.open();
            var has = hasItem(storage, id);
            return isNull(has)?false:has;
        }
        get(id, quick){
            if(quick){
                var storage = this.storage.open();
                
                return methods.get(storage, id);
            } else {
                return new Promise((res, rej)=>{
                    setTimeout(()=>{
                        var storage = this.storage.open();
                        res(storage);
                    });
                }).then(storage=>{
                    // console.log(342, storage)
                    return methods.get(storage, id);
                });
            }
        }
        getNot(id){
            var storage = this.storage.open();
            return methods.getNot(storage, id);
        }
        getAll(){
            var storage = this.storage.open();
            return Promise.resolve(storage);
        }
        update(id, update){
            var storage = this.storage.open();
            var has = hasItem(storage, id);
            if (has == 0 || has){
                storage = methods.createOrUpdate(storage, data);
                return this.storage.close(storage);
            };
            return false;
        }
        createOrUpdate(data){
            if (arguments.length > 1){
                let key = arguments[0];
                let value = arguments[1];
                data = {[key]:value};
            };
            var storage = this.storage.open();
            storage = methods.createOrUpdate(storage, data);
            const close = this.storage.close(storage);
            // console.log(377, storage);

            return close;
        }
        create(data){
            var storage = this.storage.open();
            storage = methods.create(storage, data);


            return this.storage.close(storage);
        }
        remove(id){
            var storage = this.storage.open();
            storage = methods.remove(storage, id);
            return this.storage.close(storage);
        }
    };
    return USB;
};