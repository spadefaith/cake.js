function Observer(subscribe, handlers, logger){
    this.subscribe = subscribe;
    this.handlers = handlers;
    this.logger = logger || false;
    // this.subscribe = {};

    this.stat = {
        handlers:{},
        subscribe:{},
    };
    this.results = {};

    this.wm = new WeakMap();
}
Observer.prototype.notify = function(component, /*handler- name/fn*/event, e/*payload */, filter, ispage, appName){
    /*
        calls by fire or DOM event;
        DOM Event - string;
        fire - string || fn;
    */
        // console.log(Cake.MainMessageChannel.port2.onmessage);
        // Cake.MainMessageChannel.receive(console.log.bind(this));
       

    function engrave(){
        return {
            _component:component, _event:event, _e:e,
        }
    };

    function ret(handler){return handler};

    let {_component, _event, _e} = engrave();

    let handler = this.handlers[_component] && this.handlers[_component][_event];
    if (handler == undefined && ispage){
        let o = {
            [_event]:function(){
                return _e;
            }
        };
        o[_event].binded = _component;
        o[_event].listenTo = appName;
        handler = o[_event];
    };


    // if(_component == 'toolbar'){
    //     console.log(54, _event, handler);
    // }

    _component = handler.binded;


    handler = ret(handler);    



    if (!handler) {
        console.error(`no setup handler for the event ${_event} in ${_component} component`);
        return;
    };
    // if (_component == 'main-section'){
    //     console.log(_event, _component);
    // }
    //it is able to accept a promise from handlers;


    
    let prom = new Promise((res,rej)=>{
        let e = handler(_e);
        res(e);
    });

    this.stat.handlers[handler.original] += 1;

    return prom.then(variable=>{
        // console.log(variable, _component);
        let execs = []; 

        if (!this.results[_component]){
            this.results[_component] = {};
        };

        

        if (this.subscribe[_component] && this.subscribe[_component][_event]){
            let subscribe = this.subscribe[_component][_event];


            // console.log(86, _component, _event, subscribe);

            filter = !filter?true:(()=>{
                subscribe = subscribe.filter(fn=>{
                    let binded = fn.binded;
                    return filter.includes(binded)
                });
            })();

            for (let s = 0; s < subscribe.length; s++){
                let fn = subscribe[s];
                // console.log(_component, fn.original)


                // if (_component == 'header'){
                //     console.log(fn)
                // }
                this.stat.subscribe[fn.original] += 1;
                
                execs.push(new Promise((res, rej)=>{
                    try{
                        let exec = (()=>{
                            return fn(variable)
                        })();


                        
                        if (exec && exec.ObjectType == 'Promise'){
                             exec.then(result=>{

                                if (!this.results[_component]){
                                    this.results[_component] = {};
                                };
                                this.results[_component][_event] = exec;
                       
                                res();

                             }).catch(err=>{
                                //  console.log(exec, fn.original);
                                 rej(err);
                                //  res(err.message)
                             });
                        } else {
                            // console.log(exec);

                            this.results[_component][_event] = exec;
                            res();
                        }
                    } catch(e){
                        console.log(e);
                        rej(e);
                    };
                }));
            };
        } else {
            if (this.logger) {
                console.info(`no subscriber for (${_event}) event of (${_component}) component`);
            };
            
            this.results[_component][_event] = variable;

        };
        
        return Promise.all(execs).then(()=>{
            variable = null;
        });
    });

};
Observer.prototype.registerSubscribe = function(subscribe){
    // console.log(subscribe)
    return new Promise((res, rej)=>{
        for(component in subscribe){
            if (subscribe.hasOwnProperty(component)){
                if (!this.subscribe[component]){
                    this.subscribe[component] = {};
                } else { continue};
            };
        };
        res();
    }).then(()=>{
        let obj = {};
        for(component in subscribe){
            if (subscribe.hasOwnProperty(component)){
                let events = subscribe[component];
                for (let name in events){
                    if (events.hasOwnProperty(name)){
                        let arr = events[name];
                        for (let f = 0; f < arr.length; f++){
                            let handler = arr[f]
                            if (!obj[component]){
                                obj[component] = {};
                            };
                            if (!obj[component][handler.original]){
                                obj[component][handler.original] = [];
                            };
                            obj[component][handler.original].push(handler);
                            this.stat.subscribe[handler.original] = 0;
                        };
                    };
                };
            };
        };
        return obj;
    }).then((obj)=>{
        for (let component in obj){
            if (obj.hasOwnProperty(component)){
                if (!this.subscribe[component]){
                    this.subscribe[component] = {};
                };
                for (let event in obj[component]){
                    if (obj[component].hasOwnProperty(event)){
                        for (let handler of obj[component][event]){
                            if (!this.subscribe[component][handler.original]){
                                this.subscribe[component][handler.original] = [];
                            };
                            this.subscribe[component][handler.original].push(handler);
                        };
                    };
                };
            };
        };
        obj = {};
    });
};

Observer.prototype.registerHandlers = function(handlers, component){
    if (!this.handlers[component]){
        this.handlers[component] = {};
    };
    for (let fn in handlers){
        if (handlers.hasOwnProperty(fn)){
            let handler = handlers[fn];
            this.handlers[component][fn] = handler;
            this.stat.handlers[handler.original] = 0;
        };
    };
};
module.exports = Observer;