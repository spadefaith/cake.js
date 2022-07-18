function ComponentAttribStorage(){
    this.store = {};

};

ComponentAttribStorage.prototype.set = function(component, type, obj){
    let store = this.store;
    switch(true){
        case (!store[component]):{store[component] = {}};
        case (!store[component][type]):{store[component][type] = []};
        default:{store[component][type].push(obj)};
        break;
    };
    return true;
};

ComponentAttribStorage.prototype.get = function(component, attr){
    let store = this.store;
    if(component && attr){
        return store[component] && store[component][attr] || [];
    };
    if(component && !attr){
        return store[component] || {};
    }
};




module.exports = ComponentAttribStorage;