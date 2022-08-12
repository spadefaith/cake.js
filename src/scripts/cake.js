const Attrib = require('./attributes');
const Scope = require('./scope')();
const Component = require('./component');
// const Hasher = require('./hash');
const Router = require('./router');
const Persistent = require('./persist');
const StorageKit = require('./storage')();
const Observer = require('./observer');
const Formy = require('./form');
const Utils = require('./utils');
const Templating = require('./templating');
const Plugin = require('./plugin');
const Subscriber = require('./storage/subscriber');
const Handler = require('./storage/handler');
const ComponentStorage = require('./storage/components-store');


function Cake(name){
    this.componentName = name;
    this.components = {};
};

Cake.app = function (config){
    this.name = config.name || "";
};

Cake.Components = function(name){
    return {
        subscribe(cb, ctx){
            function subscribeExternal(){
                let component = Cake.Components[name];
                
                if (component){
                    if (cb instanceof Function){
                        let name = cb.name;
                        if (ctx){
                            cb = cb.bind(ctx)
                        }
                        cb.binded = 'external';
                        cb.original = name;
                        cb.listenTo = component.name;
                        component.Subscribe(cb);
                    }
                } else {
                };
            };
            return new Promise((res, rej)=>{

                let lk = setInterval(()=>{
                    if (Cake.Components[name]){
                        
                        subscribeExternal();
                        clearInterval(lk);
                        res();
                    };
                });
            })
        },
    };
};

Cake.Models = {};

Cake.plugin = Plugin;

Cake.Attributes = new Attrib();

Cake.Models.$loaded = function(name){
    return new Promise((res, rej)=>{
        let mk = setInterval(()=>{
            if (Cake.Models[name]){
                clearInterval(mk);
                res(Cake.Models[name]);
            };
        });
        setTimeout(()=>{
            if(!Cake.Models[name]){
                clearInterval(mk);
                rej(name);
            }
        }, 10000);
    })
};

Cake.MainMessageChannel = (function(){
    let channel = new MessageChannel();
    return {
        send(data){
            // console.log(data);
            channel.port2.postMessage(data);
        },
        receive(fn){
            channel.port1.onmessage = function(payload){
                // let {isTrusted, data} = payload || {isTrusted:false};
                let data = payload.data;
                let isTrusted = payload.isTrusted == undefined?false:payload.isTrusted;


                if (isTrusted){
                    fn({status:1, data});
                } else {
                    fn({status:0, err:'not trusted!'});
                };
            };
        },
    };
})();

Cake.Utils = {
    scopeTrap(k){
        return false;
    },
    scopeNotifier(m){
        return m;
    },
};

Cake.create = function(name, template, options){
    let group = new Cake(name, template, options);
    // console.log(group);
    group.create(name, template, options);
};


Cake.init = function(name){
    return new Component(name);
};



// Cake.Hasher = new Hasher(Cake.Components); 
// Cake.Hasher.listen();


Cake.Router = Router(Cake.Models, Component);





Cake.Persistent = new Persistent;

Cake.Persistent.listen(Cake.Components);

Cake.Cache = new StorageKit({
    name:'cache',
    storage:'session',
    child:'object',
});

Cake.getSubscriber = function(component, handler){
    // let subscribe = Cake.Subscribe;
    let subscribe = Subscriber;
    let obj = {};
    for (let c in subscribe){
        if (subscribe.hasOwnProperty(c)){
            let handlers = subscribe[c];
            // console.log(handlers);
            for (let h in handlers){
                if (handlers.hasOwnProperty(h)){
                    let hs = handlers[h];
                
                    for (let h of hs){
                        let _handler = h;
                        let original = _handler.original;
                        let binded = _handler.binded;
                        let listenTo = _handler.listenTo;

                        if (listenTo == component){
                            // console.log(original, handler, original==handler);
                            if (original == handler){
                                if (!obj[binded]){
                                    obj[binded] = handler;
                                } else {
                                    let v = obj[binded] instanceof Array?obj[binded]:[obj[binded]];
                                    obj[binded] = v.concat(handler);
                                };
                            } else if(!handler) {
                                // console.log(h);
                                if (!obj[binded]){
                                    obj[binded] = original;
                                } else {
                                    let v = obj[binded] instanceof Array?obj[binded]:[obj[binded]];
                                    obj[binded] = v.concat(original);
                                };
                            }
                        };

                    };
                };
            };
        }
    };
    return obj;
};

Cake.Observer = new Observer();

Cake.prototype._defineProperty = function(component, prop, get, set){
    Object.defineProperty(component, prop, {
        configurable:true,
        get(){
            return get();
        },
        set(value){
            if (set){
                set(value);
            } else {
                // throw new Error(`unable to set property in (${prop})`);
            }
        },
    });
};

Cake.prototype._defineProperty(Component.prototype, '$observer', function(){
    return Cake.Observer;
});

//global scope
Cake._globalScope = new Scope('globalScope');
Cake.prototype._defineProperty(Component.prototype, '$globalScope', function(){
    const scope = Cake._globalScope;
    return scope;
});
Cake._universalScope = new Scope('universalScope');

Cake.$universalScope = (function(){
    const scope = Cake._universalScope;
    return scope;
});

//attributes
Cake.prototype._defineProperty(Component.prototype, '$attrib', function(){
    return Cake.Attributes;
});
//persistent ui using sessionStorage
Cake.prototype._defineProperty(Component.prototype, '$persist', function(){
    return Cake.Persistent;
});
//caching data;
Cake.prototype._defineProperty(Component.prototype, '$cache', function(){
    return Cake.Cache;
});
//hash
Cake.prototype._defineProperty(Component.prototype, '$hash', function(){
    return Cake.Hasher;
});

Cake.prototype.create = function(name, template, options){
    // console.time(name);
    //observer
    // console.time(name);
    let component = new Component(name, template, options);
    //after it has been pass to Cakem t ws assumed that the fn are binded to component holder;
    const scope = new Scope(name);
    component.scope && (()=>{
    
        for (let _component in component.scope){


            if(component.scope.hasOwnProperty(_component)){
                const handlers = component.scope[_component];
                for(let key in handlers){
                    if(handlers.hasOwnProperty(key)){
                        let handler = handlers[key];
                        const bind = handler.name;
                        handler = handler.bind(component);
                        scope.hook(_component, bind, handler);
                    };
                };
            };
        };
    })();

    //register a notifier;
    scope.registerNotifier(function(prop, newValue, prevValue, component){
        return Cake.Attributes.notifier(prop, newValue, prevValue, component);
    });

    Cake.Attributes.registerNotifier(name, function(name, obj){
        return scope.notifier(name, obj);
    });


    component.compile.then(()=>{
        // let { subscribe, root, html, handlers, role, state} = component;

        let subscribe = component.subscribe;
        let root = component.root;
        let html = component.html;
        let handlers = component.handlers;
        let role = component.role;
        let state = component.state;



        // console.log(role == 'form');

        // console.log(284, component.name, subscribe);
        // return Cake.Observer.registerSubscribe(subscribe).then(()=>{
        //     return {root, handlers}
        // });
        return Subscriber.set(subscribe).then(()=>{
            return {root, handlers};
        });

        //subscribe and handlers are binded to its componnt
        
    }).then((_obj)=>{
        // const {handlers,root}
        const handlers = _obj.handlers;
        const root = _obj.root;
        // Cake.Observer.registerHandlers(handlers, component.name);

 
        Handler.set(handlers, component.name);


        this._defineProperty(component, 'root', function(){
            // console.log(281,component);
            if (component._root){
                return component._root;
            }else {
                let selector = root || '#app';
                let query = document.querySelectorAll(selector);
                if (query){
                    return query;
                }
            };
            throw new Error(`the selector '${root}' as container of component '${component.name}' is not found!`);
        },function(value){
            Object.assign(component, {_root:value})
        });

        //scope
        this._defineProperty(component, '$scope', function(){
            return scope;
        });


        component.role == 'form' && (()=>{
            // console.log(component;
            const methods = Formy(component);

            // let has = !!component.root.querySelector('FORM');
            const form = ()=>{
                if(component.root.length){
                    let root = component.root[0];

                    let sel = `${(component.formSelector || 'FORM')}:not(.cake-template)`;
                    return root.querySelector(sel);
                };
                return null;
            };

            for (let method in methods){
                if(methods.hasOwnProperty(method)){
                    Object.defineProperty(form, method, {
                        get(){
                            return methods[method];
                        }
                    })
                };
            };

            // console.log(this._defineProperty);
            this._defineProperty(component, '$form', function(){
                return form;
            });

        })();

    }).then(()=>{
        component.fire = (function(){
            function fire(name, variable){
                /**
                 * the static fn of fire are those declared in handlers;
                 * fire is also a function that accepts handler fn, that is not declared in handlers;
                 * these are commonly refers to quick functions;
                 * the usage of fire is to manually run the notify, it tells notify what handler has been fired;
                 * so that the notify will make a variable from it, to be feed to subscriber to that;
                 */



                variable = !variable?null:typeof variable == 'function'?variable.bind(component)():(function(){return variable}).bind(component)();

                let o = {
                    [name]:()=>{
                        return variable;
                    }
                };
                fn = o[name].bind(component);
                if (typeof fn == 'function'){
                    fn.name = name;
                    fn.original = name;
                    fn.binded = component.name;

                    Handler.set({[name]: fn}, component.name);

                    // const awaitNotify = Cake.Observer.notify(component.name, name, {});
                    // component.await[name] = awaitNotify;
                    // return awaitNotify;

                    let payload = variable;
                    // console.log(payload);

                    function getAttributes(element){
                        let o = {};
                        if (!element){
                            return o;
                        };
                        let attributes = element.attributes;
                        if (attributes){
                            for (let i = 0; i < attributes.length; i++){
                                let attribute = attributes[i];
                                let name = attribute.name;
                                let value = attribute.value;
                                o[name] = value;
                            };
                        };
                        return o;
                    };


                    if (variable && (variable.element || variable.root || variable.container)){
                        const element = getAttributes(variable.element);
                        const root = getAttributes(variable.root);
                        const container = getAttributes(variable.container);
                        payload = {status:0, attributes:{element, root, container}};
                    };

                    // console.log(392, {component:component.name, event:name, payload});

                    // Cake.MainMessageChannel.send({component:component.name, event:name, payload});

                    const notify = Cake.Observer.notify(component.name, name, {}).then(()=>{
                        return Cake.Observer.results[component.name][name];
                    });
                    component.await[name] = notify;

                    return component.await[name];
                };
                console.error(`the param in fire is not an instance of function`);
            };
            
            function addStaticMethod(fire, handlers){
                for (let h in handlers){
                    if (handlers.hasOwnProperty(h)){
                        let handler = handlers[h];

                        let event = handler.original;
                        let fn = {
                            [event]:function (variable, isBroadcast){
                                //automatic broadcast if the event is destroy;
                                if (isBroadcast != undefined){
                                    isBroadcast = isBroadcast;
                                };


                                if (isBroadcast == undefined && event == 'destroy'){
                                    //force to broadcast is destroy event;
                                    isBroadcast = true;
                                };

                                if (isBroadcast == undefined){
                                    isBroadcast = false;
                                };

                                // console.log(461, component.name, event, isBroadcast);

                                if (isBroadcast){
                                    /**
                                     * async
                                     */
                                    component.await[event] = new Promise((res)=>{
                                        //without setTimeout, there will be a problem;
                                        //i think setTimeout, helps the promise to call resolve;
                                        //as it commands the promise to resolve on the next clock tick;
                                        setTimeout(()=>{
                                            let payload = variable || {};

                                            Cake.Observer.notify(component.name, event, payload).then(()=>{
                                                return Cake.Observer.results[component.name][event];
                                            }).then(r=>{
                                                res(r);
                                            }).catch(err=>{
                                                console.log(448, component.name, event, payload);
                                                console.trace();
                                                console.error(err);
                                            });
                                            
                                        });
                                    });
                                    return component.await[event];
                                } else {
                                    return handler(variable);
                                };
                            }
                        };
                        // console.log(412, event, fn);
                        fn[event] = fn[event].bind(component);
                        fn[event].originalName = event;
                        fn[event].binded = component.name;

                        fire[event] = fn[event];
                        fire.component = component.name;
                    };
                };
            }
            addStaticMethod(fire, component.handlers);

            return fire;
        })()
    }).then(()=>{

        if (component.type == 'view'){
            component.toggler = component.toggler(component);
            // Cake.Components[name] = component;
            ComponentStorage.set(name, component);
        };
    }).then(()=>{
        //update the binding of data, trigger, and utils option of component;
        component.options.router && Cake.Router.subscribe(component.options.router.bind(component));
        component.options.data && component.options.data.bind(component.data)(component);
        component.options.init && component.options.init.bind(component)();
        component.options.utils && component.options.utils.bind(component.utils)(component);

    }).then(()=>{

        if (component.type == 'model'){
            Cake.Models[name] = component;
        }
        if (component.isStatic && component.type == 'view'){
            component.render();
        } else {
            
        };
    });
};





module.exports = Cake;