const Stat = require('./handler-stat');
const handler = {};

window.Handler = handler;

module.exports = {
    set:function(handlers, component){

        return new Promise((res)=>{
            for (let fn in handlers){
                if (handlers.hasOwnProperty(fn)){
                    let _handler = handlers[fn];
                    // Handler[component][fn] = handler;
        

                    if(!handler[component]){
                        handler[component] = {};
                    };
            
                    handler[component][_handler.original] = _handler;
        
                    Stat.handlers.set( component,_handler.original);
                };
            };

            res();
        });
    },
    get:function(component, event){
        return handler[component] && handler[component][event];
    },
};