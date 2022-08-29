const routerStorage = {};
module.exports = {
    set:function(path, config){
        let name = config.name;
        config.path = path;
        routerStorage[name] = config;

        return true;
    },
    get:function(name){

        return routerStorage[name];
    },
};