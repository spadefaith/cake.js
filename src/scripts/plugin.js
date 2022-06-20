
const Utils = require('./utils');
module.exports = (function(){
    Object.caching('plugins').set('plugin', {});
    return function(key, value){
        if(Utils.isObject(key) && !value){
            const plugins = Object.caching('plugins').get('plugin');
            Object.caching('plugins').set('plugin', Object.assign(plugins, key));
        } else if(Utils.isString(key) && value != undefined){
            const plugins = Object.caching('plugins').get('plugin');
            plugins[key] = value;
            Object.caching('plugins').set('plugin', plugins);
        } else if(Utils.isString(key) && value == undefined) {
            return Object.caching('plugins').get('plugin')[key] || {};
        };
    };
})();