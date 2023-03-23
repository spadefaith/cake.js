const Utils = require('../utils');
const _utils = require('./utils');
const getConfig =_utils.getConfig
const updateConfig =_utils.updateConfig
const extendConfig =_utils.extendConfig


module.exports = (async function(prop, newValue, prevValue, component, html){
    html = html || document;
    let st = this.storage.get(component, 'bind');
    let configs = getConfig(st,prop, newValue, prevValue, component);


    if (!configs.length) return;


    configs = extendConfig(configs);



    for (let c = 0; c < configs.length; c++){
        let config = configs[c], data;
        // let {attr, bind, sel, incrementedSel,incrementId, incrementedSels} = config;

        let attr = config.attr;
        let bind = config.bind;
        let sel = config.sel;
        let incrementedSel = config.incrementedSel;
        let incrementId = config.incrementId;
        let incrementedSels = config.incrementedSels;

        
        incrementedSel = newValue.incrementedSel || incrementedSel;

        


        if(!!newValue.incrementedSel){
            // console.log(229, newValue, bind);
            data = newValue[bind];
        } else {
            data = newValue;
        };
        let attrHyphen = attr.toHyphen();


        if (prop == bind){
            let els = html.querySelectorAll(`[data-bind=${incrementedSel || sel}]`);

            for (let p = 0; p < els.length; p++){
                let el = els[p];


                
                if (attr == 'class' || attr == 'className'){

                    if (el.classList.length){
                        // console.log(prevValue);
                        Utils.splitBySpace(prevValue, function(cls){
                            el.classList.remove(cls);
                        });
                        Utils.splitBySpace(data, function(cls){
                            el.classList.add(cls);
                        });
                    } else {
                        Utils.splitBySpace(data, function(cls){
                            el.classList.add(cls);
                        });
                    };

                } else {

                    // if(prop == 'current_balance'){
                    //     console.log(262, el, attrHyphen, data,)
                    //     console.log(263, config.incrementedSel, newValue.incrementedSel);
                    //     console.log(264, newValue, data);
                    // };


                    if(data != undefined || data != null){
                        
 

                        el.setAttribute(attrHyphen, data);
                        el[attr] = data;
                    };

                };
            };
        };
    };

    newValue = null;
});