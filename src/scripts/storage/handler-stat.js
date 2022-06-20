const stat = {
    handlers:{},
    subscribe:{},
};

window.Stat = stat;

function set(storage, component, fn){

    if(storage[component] == undefined){
        storage[component] = {};
    };
    if(storage[component][fn] == undefined){
        storage[component][fn] = 0;
    } else {
        storage[component][fn] += 1;
    };
    return true;
}

module.exports = {
    handlers:{
        set:function(component, fn){
            return set(stat.handlers,component, fn);

        },
        get:function(component){
            if(stat.handlers[component] != undefined){
                console.table(stat.handlers[component]);
            } else {
                console.log(null);
            };
        },
    },
    subscribe:{
        set:function(component, fn){
            return set(stat.subscribe,component, fn);
        },
        get:function(component){
            if(stat.subscribe[component] != undefined){
                console.table(stat.subscribe[component]);
            } else {
                console.log(null);
            };
        },
    },
}