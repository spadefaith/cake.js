const Utils = require('../utils');
const _utils = require('./utils');
const getConfig =_utils.getConfig
const updateConfig =_utils.updateConfig
const extendConfig =_utils.extendConfig
module.exports = (async function(prop, newValue, prevValue, component, html){
    html = html || document;
    let st = this.storage.get(component, 'attr');
    let configs = getConfig(st, prop, newValue, prevValue, component);
    if (!configs.length) return;

    // console.log(834, newValue);
    // if(!(newValue).toString().includes('Object')){
    //     console.log(852, configs);
    // };
    configs = extendConfig(configs);
    // if(!(newValue).toString().includes('Object')){
    //     console.table(854, configs);
    // };

    return Promise.all(configs.map(config=>{
        let  data;
        // let {hasNegate, bind, testVal,attr, ops, sel, attrkey, attrvalue, incrementedSel,incrementId} = config;

        let hasNegate = config.hasNegate;
        let bind = config.bind;
        let testVal = config.testVal;
        let attr = config.attr;
        let ops = config.ops;
        let sel = config.sel;
        let attrkey = config.attrkey;
        let attrvalue = config.attrvalue;
        let incrementedSel = config.incrementedSel;
        let incrementId = config.incrementId;

        bind = Utils.removeWhiteSpace(bind);
        attr = Utils.removeWhiteSpace(attr);

        incrementedSel = newValue.incrementedSel || incrementedSel;

        // console.log(850,incrementedSel);

        if(!!newValue.incrementedSel){
            // console.log(229, newValue, bind);
            data = newValue[bind];
        } else {
            data = newValue;
        };

        
        // console.log(39, data);
        
        if (prop == bind){

            let els = html.querySelectorAll(`[data-attr=${incrementedSel || sel}]:not(.cake-template)`);
            // console.log(839, els, `[data-attr=${incrementedSel || sel}]:not(.cake-template)`);
            // console.log(865,sel,incrementedSel,els);

            // console.log(572, prop, bind, data, sel, els);
            
            return Promise.all([...els].map(el=>{
                // console.log(869,el);
                
                let test = false;
                if (ops){
                    test = Utils.logTest(data, ops, testVal);
                    hasNegate && (test = !test);
                } else if (hasNegate){
                    test = !data;
                } else {
                    test = !!data;
                };

                // console.log(el, prop, data);
                

                
                if (test){
                    if(attrvalue){
                        el.setAttribute(attrkey, attrvalue);
                    } else {
                        el.setAttribute(attrkey);
                    };
                } else {
                    el.removeAttribute(attrkey);
                };
            }));
        };

        newValue = null;
    }));
});