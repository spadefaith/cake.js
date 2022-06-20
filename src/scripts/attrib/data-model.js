const Utils = require('../utils');

const {getConfig, updateConfig, extendConfig} = require('./utils');

module.exports = (async function(prop, newValue, prevValue, component, html){
    html = html || document;


    let st =this.storage.get(component, 'model');

    let configs = getConfig(st,  prop, newValue, prevValue, component);
    if (!configs.length) return;
    for (let c = 0; c < configs.length; c++){
        let config = configs[c];
        let {attr, bind, sel} = config;
        let attrHyphen = attr.toHyphen();
        if (prop == bind){
            let els = html.querySelectorAll(`[data-model=${sel}]`);
            for (let p = 0; p < els.length; p++){
                let el = els[p];
                if (attr == 'className'){
                    if (prevValue){
                        if (newValue){
                            el.classList.replace(prevValue, newValue);
                        } else {
                            el.classList.remove(prevValue);
                        };
                    } else {
                        el.classList.add(newValue);
                    };
                } else {
                    el.setAttribute(attrHyphen, newValue);
                    el[attr] = newValue;
                };
            };
        };
    };

    newValue = null;
});