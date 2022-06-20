const Utils = require('../utils');
const {getConfig, updateConfig, extendConfig} = require('./utils');

module.exports = (async function(prop, newValue, prevValue, component, html){
    html = html || document;
    let st = this.storage.get(component, 'toggle');
    // console.log(8, this.sts);
    let configs = getConfig(st,prop, newValue, prevValue);
    // if (!configs.length) return;
    if (!configs){return ;};

    configs = extendConfig(configs);

    html = html || document;
    for (let s = 0; s < configs.length; s++){
        let sub = configs[s];
        if (!sub) continue;
        let {sel, bind, value, ops} = sub;
        let el = html.querySelector(`[data-toggle=${sel}]`);


        //TODO
        if (value == prevValue){
            el && el.classList.remove('is-active');
        }  
        if (value == newValue){
            if (el){
                if (el.classList.contains('is-active')){
                    el.classList.remove('is-active');
                };
                el && el.classList.add('is-active');
            };
        };
    };

    newValue = null;
});