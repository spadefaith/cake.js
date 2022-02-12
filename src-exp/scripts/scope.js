module.exports = function(){

    function Scope(parent, options){
        this.pKey = options.pKey || '$scope';
        this.temp = {};
        this.trap = options.trap;
        this.notify = [];
        this.parent = parent;
        this._clone = {};
        this._cloneAsync = {};
        this.whitelist = ['extend', 'set', 'get'];

        this.install();
    };
    
    Scope.prototype.registerNotifier = function(fn){
        this.notify.push(fn);
    };
    
    Scope.prototype.notifier = function(obj){
        // console.log(obj);
        Cake.$scope[obj.bind] = obj.value;
    };

    Scope.prototype.method = function(){
        let temp = this.temp;
        let trap = this.trap;
        let notify = this.notify;
        let _this = this.parent;
        let whitelist = this.whitelist;
        let cloneAsync = this._cloneAsync;
        
        return {
            update(keys, fn){
                if (!keys.length) return;
                for (let k = 0; k < keys.length; k++){
                    let key = keys[k];
                    fn(key);
                };
            },
            defineProperty(key, cloned){
                Object.defineProperty(temp, key, {
                    configurable:true,
                    get(){
                        let t = trap.bind(_this)(key) || false;
                        if (t){
                            return t;
                        };
                        return cloned[key];
                    },
                    set(newValue){
                        if (whitelist.includes(key) || cloneAsync[key]){
                        } else {
                            let prevValue = this[key];
                            for (let n = 0; n < notify.length; n++){
                                let fn = notify[n];
                                fn(key, newValue, prevValue);
                            };
                            cloned[key] = newValue;
                        }
                    },
                });
            }
        };
    };

    Scope.prototype.install = function(){
        let {update, defineProperty} = this.method();
        let temp = this.temp;
        let cloned = this._clone;
        let clonedAsync = this._cloneAsync;
        Object.defineProperty(this.parent, this.pKey, {
            configurable:true,
            get(){
                cloned = Object.assign(cloned, temp);
                cloned = Object.assign(cloned, clonedAsync);

                let keys = Object.keys(temp);
                update(keys, function(key){
                    defineProperty(key, cloned);
                });
                return temp;
            },
        });
    };
    
    Scope.prototype.watch = function(array){
        // console.log(array)
        // console.trace();
        if (!array) return;
        let {update, defineProperty} = this.method();
        let cloned = this._clone;
        update(array, function(key){
            defineProperty(key, cloned);
        });
        return true;
    };

    Scope.prototype.set = function(key, value, cloned){
        // console.log(96,key, value);
        if (this.whitelist.includes(key)){
            return;
        };

        // console.log(102,this._clone);

        let notify = this.notify || [];
        let prevValue = cloned[key];
        cloned[key] = value;

        Object.assign(this.temp, cloned);

        // console.log(109,notify);

        return Promise.all(notify.map(cb=>{
            return cb(key, value, prevValue);
        }));
    };
    
    return Scope;

}