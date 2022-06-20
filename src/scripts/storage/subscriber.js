const Stat = require('./handler-stat');
const subscriber = {};

window.Subscribe = subscriber;
module.exports = {
    set:function(subscribe){
        return new Promise((res, rej)=>{
            for(component in subscribe){
                if (subscribe.hasOwnProperty(component)){

                    let events = subscribe[component];
                    for (let event in events){
                        if (events.hasOwnProperty(event)){
                            let handler = events[event];
    
                            if(!subscriber[component]){
                                subscriber[component] = {};
                            };
                            if(!subscriber[component][event]){
                                subscriber[component][event] = [];
                            };
                            subscriber[component][event].push(handler);

                            Stat.subscribe.set( component,handler.original);
                        };
                    };
                };
            };
            res();
        });
    },
    get:function(component, event){
        return subscriber[component] && subscriber[component][event];
    },
};