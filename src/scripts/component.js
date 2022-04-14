module.exports = function(dependency){

    const Mo = dependency.Mo;
    const Templating = dependency.Templating;
    const Piece = dependency.Piece;
    const Utils = dependency.Utils;
    const pushState = dependency.pushState;


    function Component(name, template, options){
        this.name = name;
        this.template = template;
        this.options = options;
        this.handlers = options.handlers;
        this.subscribe = options.subscribe;
        this.data = {};
        this.root = options.root;
        this.items = false;
        this.type = options.type || 'view';
        this.toggle = options.toggle;
        this.targets = {};
        this.animateOptions = options.animate;
        this.role = options.role;
        this.isReady = false;
    
        this.await = {};//storage of async handlers
    
    
        this.utils = Utils;
    
    
        // options.data && options.data.bind(this.data)(this);
        ((name == 'app') || (options.role == 'app')) && (()=>{ this.staticComponent = options.static || [];})();
        // options.trigger && options.trigger.bind(this)();
        // options.utils && options.utils.bind(this.utils)(this);
    
        this.container = {};
    
    
        this.compile = new Promise((res)=>{
    
            this._bindHandlers();
            res();
        }).then(()=>{
    
            this._bindSubscribe();
        }).then(()=>{
            
            switch(this.type == 'view' && !!this.template){
                case true:
                    return this.createElementAsync();
                default:
                    this.isStatic = false;
                    break
            };
        })
    
    };
    
    Component.prototype.isStatic = false;
    Component.prototype.hasEvent = false;
    Component.prototype.isConnected = false;
    Component.prototype.destroyed = false;
    Component.prototype.isCreated = false;
    
    Component.prototype.Subscribe = function(handler){
        this.$observer.registerSubscribe({
            [handler.listenTo]:{
                [handler.original]:[handler],
            }
        })
    };
    
    Component.prototype.Node = function(el){
        const piece = new Piece(el);;
        return piece;
    };
    
    Component.prototype._bindHandlers = function(){
        for (let key in this.handlers){
            if (this.handlers.hasOwnProperty(key)){
                let fn = this.handlers[key];
                let originalName = fn.name;
                fn = fn.bind(this);
                fn.original = originalName;
                fn.binded = this.name;
                this.handlers[originalName] = fn;
        
                this.initAwaitHandlers(key);
            };
        };
        if (!this.await.destroy){
            this.await.destroy = Promise.resolve();
        }
        if (!this.await.animateRemove){
            this.await.animateRemove = Promise.resolve();
        }
    };
    
    Component.prototype.initAwaitHandlers = function(handlerName){
        //initializing awaits for handlers;
        this.await[handlerName] = Promise.resolve();
    };
    
    Component.prototype._bindSubscribe = function(){
        //binding the subscribe to component;
        let flattened = {};
        for (let component in this.subscribe){
            if (this.subscribe.hasOwnProperty(component)){
                subscribe = this.subscribe[component];

                if(component == 'alert'){
                    console.log(subscribe);
                }
                
                let isMany = !!subscribe.components && !!subscribe.handler;
                // console.log(component, subscribe);
                



                if (isMany){
        
                    /**
                     * multiple components triggering the same event;
                     * this component is listening to that one event;
                     * {
                     *     components:[],
                     *     handler(){},
                     * }
                     */
                    let event = component;
                    let {components, handler} = subscribe;
                    handler =  handler.bind(this);
                    handler.binded = this.name;
                    handler.original = event;
                    for (let c = 0; c < components.length; c++){
                        let component = components[c];
          
                        if (!flattened[component]){
                            flattened[component] = {};
                        };
                        if (!flattened[component][event]){
                            flattened[component][event] = [];
                        }
                        handler.listenTo = component;
                        flattened[component][event].push(handler);
                    };
        
                } else {
                    
                    if (!flattened[component]){
                        flattened[component] = {};
                    };
                    /**
                     * single event is triggerd by a component;
                     * {
                     *      event:{
                     *          handler(){},
                     *      }
                     * }
                     */
                     let fns = subscribe;//object
           
                     for (let fn in fns){
                        if (fns.hasOwnProperty(fn)){
                            let handler = fns[fn];
                            let original = handler.name;

                            // console.log(component, handler);
                            try{
                                handler = handler.bind(this);
                            } catch(err){}
                            handler.original = original;
                            handler.binded = this.name;
                            handler.listenTo = component;
           
                            if (!flattened[component][original]){
                               flattened[component][original] = [];
                            };
                            
                            flattened[component][original].push(handler);
                        };
        
                     };
                };
            };
        };
        this.subscribe = flattened;
    };
    
    Component.prototype.notifyStaticComponent = function(page, event, data){
    
        Cake.Observer.notify(page, event, data, this.staticComponent[page], true, this.name);
    
    };
    
    Component.prototype.doFor = function(prop, newValue){
        // console.trace();
        const getHTML = ()=>{
            return this.html;
        };
        if (newValue == null) return;
        this.$attrib._notifyFor(prop, newValue, null, this.name, getHTML());
    };
    
    Component.prototype.doToggle = function(prop, newValue){
        this.$attrib._notifyToggle(prop, newValue, null, this.name, this.html);
    };
    Component.prototype.doSwitch = function(prop, newValue){
        this.$attrib._notifySwitch(prop, newValue, null, this.name, this.html);
    };
    Component.prototype.doIf = function(prop, newValue){
        this.$attrib._notifyIf(prop, newValue, null, this.name, this.html);
    };
    Component.prototype.$animate = function(moment){
        //normalize the two sourse, attr, and component declaration;
        let ata = this.$attrib.getWatchItemsByType(this.name, 'animate');
        let da = this.animateOptions;
        let arr = [];
        
        ;(()=>{
            if ((!ata.length && !(ata instanceof Array)) || !da){return;}
            for (let a = 0; a < ata.length; a++){
                let at = ata[a];
                let {ns:name, selector} = at;
                //declare name space in html, mapped to component animation declaration
                if (at.ns){
                    if (da[name]){
                        let ns = da[name];
                        Object.assign(at, da[name]);
                        delete da[name];
                    };
                } else {
                    //declared animation in html, using animation name;
                    arr.push(ata);
                };
            };
        })();
        if (!ata.length) {return false}
        //tweak component declared animation;
        ;(()=>{
            let obj = {};
            let selector = {};
            for (let key in da){
                if (da.hasOwnProperty(key)){
                    selector.val = key;
                    obj.selector = selector;
                    Object.assign(obj, da[key]);
                    ata.push(obj);
                    //reset;
                    obj = {};
                    selector = {};
                };
            };
        })();
    
        // console.log(ata);
    
        
        return new Mo(ata, this.html).animate(moment);
        // return Promise.resolve();
    };
    
    Component.prototype.$templating = function(data, t, isConvert){
        let template = t || this.template;
        return new Templating(data, template, isConvert).createElement();
    };
    
    Component.prototype.createElement = function(){
        let isSelector = this.template.substring(0,1) == '#';
        if (!isSelector) return;
        let selector =  this.template.substr(1);
        let query = document.getElementById(selector);
        let isTemplate = this.isTemplate = query && query.toString().includes('Template');



        if (!query){
            throw new Error(`the template for ${this.name} is not found with.`);
        };

        return new Promise((res)=>{
            switch(isTemplate){
                //template html
                case true:{
                    // console.time(this.name)
                    let element = query.getContent(true);
                    if (!element){
                        throw new Error(`it might be theres no template in component - ${this.name}`);
                    }
                    element.cake_component = this.name;
                    // console.timeEnd(this.name)
                    this.html = this.Node(element);
                    // console.log(274,this.html);
                    this._parseHTML(this.isStatic).then(()=>{
                        this._watchBindedItems()//these are the binded data declared in html;
                        res();
                    })
                } break;
                case null:{
                    res();
                }
                break;
                //static html
                default:{
                    let element = query;
                    if (!element){
                        throw new Error(`it might be theres no template in component - ${this.name}`);
                    }
                    element.cake_component = this.name;
                    this.html = this.Node(element);
                    // console.log(290,this.html);
                    this.isStatic = true;
    
                    this._parseHTML(this.isStatic).then(()=>{
                        res();
                    })
                };
            };
        })
    };
    
    Component.prototype.createElementAsync = function(){
    
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
    
    Component.prototype._isParsed = false;
    
    Component.prototype._parseHTML = function(isStatic=false){
        return this.$attrib.inject(this.html, this.name, isStatic).then(()=>{
            // console.log(this.html, this.name)
            this.original = this.html.cloneNode();
            this._isParsed = true;
        });
    };
    
    Component.prototype.render = function(options){
        let {root, multiple, cleaned, emit, static, hashed, data} = options || {};
        let payload = {emit:emit || {}};;
        const getValue = (item)=>{
            return this.data[item] || this.$scope[item] || null;
        };
        return new Promise((res, rej)=>{

            (!!root) && (this.root = root);
            (multiple) && this._smoothReset();
            if (!this.isReady){
                this.createElement().then(()=>{
                    (hashed === true) && this.$hash.add(this.name);

                    return (!this.template) && this.fire.isConnected && this.fire.isConnected(payload, true);

                }).then(()=>{
                    this.isReady = true;
                    res();
                });
            } else {
                res();
            };
        }).then(()=>{
            return this.await.destroy.then(()=>{
                return this.await.animateRemove;
            }).then(()=>{
                return new Promise((res, rej)=>{
                    //html restructure base on data;
                    //by mutation;
        
                    let forItems = this.$attrib.getWatchItemsByType(this.name, 'for');
                    for (let i = 0; i < forItems.length; i++){
                        let nv = getValue(forItems[i]);
                        this.doFor(forItems[i], nv);
                    };
                    res(this.html);
                }).then((element)=>{
                    payload = {element, emit};
                    
                    return new Promise((res, rej)=>{
                        try {
                            this.fire.beforeConnected && this.fire.beforeConnected(payload, true);
                            res(element);
                        } catch(err){
                            rej(err);
                        };
                    });
                }).then((element)=>{
                    if (this.isStatic){
                        //static component, those already attached to DOM;
                    } else {
                        //replace the mustache here;
                        let prom = (!data)?Promise.resolve():(()=>{
                            return new Promise((res)=>{
                                let el = element.getElement();
                                el = this.$templating(data, el);
                                this.html = element = this.Node(el);
                                this.html.replaceDataSrc();
                                
                                data = null;
                                res();
                            })
                        })();
                        return prom.then(()=>{
                            
        
                            element.appendTo(this.root, cleaned);
                            this.isConnected = true;
                        });
                    }
                }).then(()=>{
                    return this.findTarget();
                }).then(()=>{
                    return this.findContainer();
                    
                }).
                // .then(()=>{
                //     return this.findRouterLink();
                // }).
                then(()=>{
                    //switch
                    let switchItems = this.$attrib.getWatchItemsByType(this.name, 'switch');
        
                    for (let i = 0; i < switchItems.length; i++){
                        this.doSwitch(switchItems[i], getValue(switchItems[i]));
                    };
                }).then(()=>{
                    // console.log('this containers must have el',this.name, this.container);
                    return this.addEvent(static, multiple);
                }).then(()=>{
                    try {
                        return  this.fire.isConnected && this.fire.isConnected(payload, true);
                    }catch(err){
                        console.log(440,err);
                    }
                }).then(()=>{
                    return this.$animate('render');
                }).then(()=>{
                    return new Promise((res, rej)=>{
                        Utils.timeOut(()=>{
                            this._watchReactive();
                            res();
                        },100);
                    });
                });
        
            })
        })
    };
    
    Component.prototype.renderAsync = function(options){
        this.render(options).then(()=>{
            this.$persist.append(this.name);
        });
    };
    
    Component.prototype._smoothReset = function(){
        this.isConnected = false;
        this.html = this.original.cloneNode();
    };
    
    Component.prototype._hardReset = function(name){
        this.isConnected = false;
        this.$persist.remove(name);
        //remove the element first;
        //clone the element;
        this.html = this.original.cloneNode();
        return true;
    };
    
    Component.prototype.reset = function(){
        let animate = this.$animate('remove');
        // console.log(this,this.html, animate);
        if (animate instanceof Promise){
            return this.await.animateRemove = new Promise((res)=>{
                animate.then(()=>{
                    //it is very important to remove first the component
                    //before hard reset;
                    return this.html.remove();
                }).then(()=>{
                    return this._hardReset(this.name);
                }).then(()=>{
                    res();
                });
            });
        } else {
            return new Promise((res)=>{
                this.html.remove(this.name);
                this._hardReset(this.name);
                res();
            });
        }
    };
    
    Component.prototype.addEvent = function (static, multiple){
        let isStatic = !!static;
        let isMultiple = !!multiple;
        if (isMultiple && isStatic){
            return false;
        };
        let component = this.name;
        function notify(event, component,  isPreventDefault, isStopPropagation){
            // console.log(509,!isPreventDefault, component)
            return function(e){ 
                // console.log(512,e);
                if (!isPreventDefault){
                    e.preventDefault();
                };
                if (isStopPropagation){
                    e.stopPropagation();
                };

                Cake.Observer.notify(component, event, e);
            };
        };
        if (!this.targets) return;
        for (let event in this.targets){
            if (this.targets.hasOwnProperty(event)){
                // let cf = JSON.parse(JSON.stringify(this.targets[event]));
                let cf = this.targets[event];
                // if(this.name == 'sidebar'){
                //     console.log(527, cf);
                // };
      
                for (let item of cf){
                    let {sel, el, cb} = item;
                    let _event = event;
                    
                    let place = event.substring(0,2);
                    let isPreventDefault = place.includes('~');//default to true;
                    let isStopPropagation = place.includes('^');//default to false;


                    if(isPreventDefault || isStopPropagation){
                        _event = event.slice(1);
                        cb = cb || _event;
                    } else {
                        if(!cb){
                            cb = event;
                        }
                    };

                    if (!el.Ref().get('__cake__events')){
                        el.Ref().set('__cake__events', {});
                    }; 
                    let store = el.Ref().get('__cake__events');
                    
                    if (!store[cb]){
 
                        // console.log(isPreventDefault, event);

                        // if(this.name == 'toolbar'){
                        //     console.log(513);
                        //     console.log('component',this.name);
                        //     console.log('place',place);
                        //     console.log('event',_event);
                        //     console.log('isPreventDefault',isPreventDefault);
                        //     console.log('isStopPropagation',isStopPropagation);
                        //     console.log('el',el);
                        //     console.log('cb',cb);
                        // }





                        el.addEventListener(_event, notify(cb, component, isPreventDefault, isStopPropagation), true);
                        store[cb] = true;
                        el.Ref().set('__cake__events', store);
                    } else {continue};
                };
            };
        };
    };
    
    Component.prototype.findTarget = function(){
        let q = this.$attrib.getEventTarget(this.name);
        let e = JSON.parse(JSON.stringify(q));//deep cloning


        for (let item of e){
            item.el = document.querySelector(`[data-event=${item.sel}]`);
            if (!this.targets[item.event]){
                this.targets[item.event] = [];
            };
            this.targets[item.event].push(item);
        };
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
    
    Component.prototype.toggler = function(_this){
        /*
            @params
            {basis} - comparison of elements;
            {cls} - class to toggle;
            {mode} - radio/ switch;
            {sel} - siblings selector;
            {persist} - bool;
        */
        let attrToggle = this.$attrib.getWatchItemsByType(this.name, 'toggle');
    
        let cl = class{
            constructor(bind, bases, html, _this){
                this.toggle = _this.toggle;
                this.bind = bind;
                this.bases = bases;
                this.cache = _this.$cache;
                this.html = html;
            }
            check(bind){
                let config = this.toggle[bind];
                // console.log(this.toggle)
    
                if (!config){ 
                    console.error(`${bind} is not found in toggle! choose from ${JSON.stringify(Object.keys(this.toggle))}`);
                } else {
                    if (attrToggle.length){
                        let {ns} = config;
                        //toggle is use only for namespacing;
                        let f = attrToggle.find(item=>{return item.name == `ns-${ns}`});
                        f && (config.sel = `[data-toggle=${f.sel}]`);
                    };
                    return config;
                };
            }
            _toggle(){
                let config = this.check(this.bind);
                if(!config){ return;}
                let {basis='data-name', cls='is-active', mode='radio', sel, persist=true} = config;
                let targets = this.html.querySelectorAll(sel);
                if (!targets.length) { return; };
    
                let prev, next;
    
                // console.log(targets);
    
                if (targets.length == 1){
                    let isbool = typeof this.bases == 'boolean'
                    let isforce =  !!this.bases;
                    let el =  targets[0];
                    // console.log(isbool, isforce)
                    if (persist){
                        const _forceState = function(el, cls, isforce){
                            if(isforce){
                                if (el.classList.contains(cls)){
                                    el.classList.remove(cls);
                                };
                            } else {
                                if (!el.classList.contains(cls)){
                                    el.classList.add(cls);
                                };
                            }
                        };
                        if (isbool){
                            if (isforce){
                                this.cache.createOrUpdate(this.bind, true);
                                _forceState(el, cls, true);                 
                            } else {
                                this.cache.createOrUpdate(this.bind,false);                          
                                _forceState(el, cls, false);                 
                            }
                            el.classList.toggle(cls);
                        } else {
                            this.cache.createOrUpdate(this.bind, !el.classList.contains(cls));
                            el.classList.toggle(cls);
                        };
                    };
                } else {
                    for (let t = 0; t < targets.length; t++){
                        let el = targets[t];
                        let has = el.classList.contains(cls);
                        let attr = el.getAttribute(basis);
                        
                        if (attr == this.bases){
                            if (mode == 'switch'){
                                el.classList.toggle(cls);
                            } else {
                                if (!has){ el.classList.add(cls) };
                            };
                            if (persist){
                                this.cache.createOrUpdate(this.bind, attr);
                            };
                            next = attr;
                        } else {
                            if(has){ 
                                el.classList.remove(cls)
                                prev = el.getAttribute(basis);
                            };
                        };
                    };
                }
                return {prev, next};
            }
            _recall(){
                let config = this.check(this.bind);
                if(!config){ return;}
                let {basis='data-name', cls='is-active',  sel} = config;
                return this.cache.get(this.bind).then(result=>{
                    if (!result){
                        return result;
                    };
                    let bases = result;                
                    let targets = this.html.querySelectorAll(sel);
                    if (!targets.length) { return ;};
                    if (targets.length == 1){
                        let el = targets[0];
                        // console.log(bases, this.bind);
                        if (bases){
                            el.classList.add(cls);
                        };
                    } else {
                        for (let t = 0; t < targets.length; t++){
                            let el = targets[t];
                            let has = el.classList.contains(cls);
                            let attr = el.getAttribute(basis);
                            if (attr == bases){
                                if (!has){ el.classList.add(cls) };
                            };
                        };
                    };
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
    
    Component.prototype.findContainer = function(){


        return new Promise((res)=>{
            let containers = this.html.getContainers();
    
            for (let c = 0; c < containers.length; c++){
                let el = containers[c];
                let name = el.dataset.container;
                if (name){
                    this.container[name] = el;
                };
            };
            res();
        });

        // console.log('must trigger first',containers);
        // console.log('must trigger first',this.container);
    };
    
    Component.prototype._watchBindedItems = function(){

    };

    Component.prototype._watchReactive = function(){
        if (!this.items.length){
            this.items = this.$attrib.getWatchItems(this.name);

            //this.items are the data-bind attribute declared in html;

            let name = this.name;
            let {input} = this.$attrib.st[name] || {input:false};
            let notify = this.$attrib.notify[name];
            

            if (input){
                input.forEach(item=>{
                    let {attr, bind, sel, nodeType} = item;
                    let el = document.querySelector(`[data-input=${sel}]`);
                    // console.log(737, el);
                    if (el && !el._reactive){
                        // setTimeout(()=>{
                        // }, 1000);
                        // console.log(738, el.getAttribute('value'));

                        // console.log(741, nodeType);
                        if(nodeType == 'INPUT' || nodeType == 'TEXTAREA'){
                            // console.log(738, el.getAttribute('value'));
                            // console.log(739, el.getAttribute('value'));
                            notify.forEach(n=>{
                                n(name, {value:el.value, bind});
                            });
    
                            el.addEventListener('input', (e)=>{
                                if (notify && notify.length){
                                    notify.forEach(n=>{
                                        n(name, {value:e.target.value, bind});
                                    });
                                };
                            });
                            el.addEventListener('change', (e)=>{
                                if (notify && notify.length){
                                    notify.forEach(n=>{
                                        n(name, {value:e.target.value, bind});
                                    });
                                };
                            });
                        } else if(nodeType == 'SELECT'){
                            (()=>{
                                const {selectedOptions} = input;
                                const selected = [];
                                for (let i = 0; i < selectedOptions.length; i++){
                                    const opt = selectedOptions[i];
                                    const text = opt.text;
                                    const value = opt.value;
                                    selected.push({text, value});
                                };

                                if (notify && notify.length){
                                    notify.forEach(n=>{
                                        n(name, {value:selected, bind, });
                                    });
                                };
                            })();
                            el.addEventListener('change', (e)=>{
                                const {selectedOptions} = e.target;
                                const selected = [];
                                for (let i = 0; i < selectedOptions.length; i++){
                                    const opt = selectedOptions[i];
                                    const text = opt.text;
                                    const value = opt.value;
                                    selected.push({text, value});
                                };

                                if (notify && notify.length){
                                    notify.forEach(n=>{
                                        n(name, {value:selected, bind, });
                                    });
                                };
                            });
                        };

                        el._reactive = true;
                    };
                });
            };


        };
    };
    
    
    Component.prototype.observer = function(subscribe){
        function callback(name){
            return this.handler[name]
        }
        this.observer = new Observer(this, subscribe, callback.bind(this));
    };
    
    Component.prototype.variable = function(obj){
        let vary = Object.keys(obj);
        let validate = {};
        let values = [];
        function invalid(name, test, type){
            if (!test){
                validate[name] = `value is not '${type}'`;
            };
        };
        for (let key in obj){
            if (obj.hasOwnProperty(key)){
                let config = obj[key];
                let {type, value} = config;
                let test;
                if (['string', 'number'].includes(type)){
                    test = typeof value == type;
                } else if (value instanceof Array){
                    test = type == 'array';
                } else {
                    test = type == 'object';
                }
                values.push(value);
                invalid(key, test, type);
            };
        };
        if (Object.keys(validate).length){
            throw new Error(JSON.stringify(validate));
        } else {
            return values;
        }
    };
    
    return Component;
}