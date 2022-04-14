module.exports = function(dependency){
    const StorageKit = dependency.StorageKit;
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
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#x27;',
                    "/": '&#x2F;',
                };
                const reg = /[&<>"'/]/ig;
                if (typeof data == 'string'){
                    return data.replace(reg, (match)=>(map[match] || ""));
                } else {
                    return data;
                };
            };
        }
        registerNotifier(fn){
            this.notify.push(fn);
        }
        install(){
            this.session = new StorageKit({
                child:'object',
                storage:'session',
                name:`_cake_${this.name}_cf`,
            });
            // console.log(this.name, this.session);
            // this.memory = new StorageKit({
            //     child:'object',
            //     storage:'object',
            //     name:`_cake_${this.name}_cf`,
            // });
        }
        notifier(component, obj){
            //called by usually form input;
            //reactive input;
            const {value, bind} = obj;
            if (!this.reactiveData[component]){
                this.reactiveData[component] = {};
            };
            this.reactiveData[component][bind] = value;

            return this.set(bind, value);

            // console.log(this.reactiveData[component]);
        }


        getInputData(type='json', _component){
            let component = _component || this.name;

            // console.log(this.reactiveData);

            let data = JSON.parse(JSON.stringify(this.reactiveData[component]));
            //reset the reactiveData when after get;

            for (let key in data){
                let value = data[key];
                data[key] = this.sanitize(value);
            };

            if (type == 'json'){
                return data;
            } else if (type == 'formdata'){
                const formData = new FormData;
                for (let key in data){
                    let value = data[key];

                    formData.append(key, value);
                };
                return formData;
            };
        }
        //a change to get notified when the data of other component is changed;
        hook(component, bind, callback){

            
            if (!_hooks[component]){
                _hooks[component] = {};
            };
            if (!_hooks[component][bind]){
                //callbacks;
                _hooks[component][bind] = []
            };
            _hooks[component][bind].push(callback);


            // console.log(component, bind, callback, _hooks);
        }
        get(key, quick=false){

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
            if (quick){
                return this.session.get(key, true);
            } else {
                return this.session.get(key);
            };
        }

        set(key, value){
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
                if (key != 'password'){
                    this.session.createOrUpdate(key, value);
                };
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
                const hooks = _hooks[this.name];

                if (hooks){
                    const callbacks = hooks[key];

                    if (callbacks){
                        callbacks.forEach(cb=>{
                            cb(value);
                        });
                    };
                };

                //callback for html attributes;
                return Promise.all(notify.map(cb=>{
                    return cb(key, value, prevValue, name);
                }));
            });
        }
    }
    
    return Scope;

}


// module.exports = function(dependency){
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



