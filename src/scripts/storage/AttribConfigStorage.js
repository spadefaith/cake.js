function storage(){
    this.store = {};
};

storage.prototype.set = function(f, s, obj){
    let store = this.store;
    switch(true){
        case (!store[f]):{store[f] = {}};
        case (!store[f][s]):{store[f][s] = []};
        default:{store[f][s].push(obj)};
        break;
    };
};

storage.prototype.get = function(component, attr){
    let store = this.store;
    if(component && attr){
        return store[component] && store[component][attr] || [];
    };
    if(component && !attr){
        return store[component] || {};
    }
};

module.exports = storage;