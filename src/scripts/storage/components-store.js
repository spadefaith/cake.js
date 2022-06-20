const storage = {};

function subscribeExternal(){
    let component = storage[name];
    
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

window.ComponentStorage = storage;

module.exports = {
    subscribe(cb, ctx){

        return new Promise((res, rej)=>{

            let lk = setInterval(()=>{
                if (storage[name]){
                    
                    subscribeExternal();
                    clearInterval(lk);
                    res();
                };
            });
        })
    },
    set(componentName, component){
        storage[componentName] = component;
        return true;
    },
    get(componentName){
        return storage[componentName];
    }
};