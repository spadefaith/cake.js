const Subscriber = require('./storage/subscriber');
const Handler = require('./storage/handler');
const Stat = require('./storage/handler-stat');

function Observer(logger){

    this.logger = logger || false;
    this.results = {};

}
Observer.prototype.notify = function(component, /*handler- name/fn*/event, e/*payload */){
    /*
        calls by fire or DOM event;
        DOM Event - string;
        fire - string || fn;
    */
       



    let _component = component;
    let _event = event;
    let _e = e;

    let handler = Handler.get(_component, _event);  
    if (!handler) {
        console.error(`no setup handler for the event ${_event} in ${_component} component`);
        return;
    };

    _component = handler.binded;

    //it is able to accept a promise from handlers;
    let prom = new Promise((res,rej)=>{
        let e = handler(_e);
        res(e);
    });

    Stat.handlers.set( _component,handler.original);

    return prom.then(variable=>{
        let execs = []; 
        if (!this.results[_component]){
            this.results[_component] = {};
        };
        let subscribe = Subscriber.get(_component, _event);
        if (subscribe){
            for (let s = 0; s < subscribe.length; s++){
                let fn = subscribe[s];

                Stat.subscribe.set( _component,fn.original);

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
                                this.results[_component][_event] = result;
                                res(result);
                             }).catch(err=>{
                                rej(err);
                             });
                        } else {
                            this.results[_component][_event] = exec;
                            res(exec);
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
            execs = [];
            return true;
        });
    });

};

module.exports = Observer;