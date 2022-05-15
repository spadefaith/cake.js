const Utils = require('../utils');
const {getConfig, updateConfig, extendConfig} = require('./utils');
module.exports = function(st){
    return (async function(prop, newValue, prevValue, component, html){
        html = html || document;
        let configs = getConfig(st,'attr', prop, newValue, prevValue, component);
        if (!configs.length) return;
    
        // console.log(834, newValue);
        // if(!(newValue).toString().includes('Object')){
        //     console.log(852, configs);
        // };
        configs = extendConfig(configs);
        // if(!(newValue).toString().includes('Object')){
        //     console.table(854, configs);
        // };
    
        // console.dir(840,configs);
    
        return Promise.all(configs.map(config=>{
            let  data;
            let {hasNegate, bind, testVal,attr, ops, sel, attrkey, attrvalue, incrementedSel,incrementId} = config;
    
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
    
            // console.log(572, prop, bind, prop);
            
            if (prop == bind){
    
                let els = html.querySelectorAll(`[data-attr=${incrementedSel || sel}]:not(.cake-template)`);
                // console.log(839, els, `[data-attr=${incrementedSel || sel}]:not(.cake-template)`);
                // console.log(865,sel,incrementedSel,els);
                // console.log(867,els);
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
                    
    
                    // console.log(784, prop, data, test);
    
                    if (test){
                        return new Promise((res, rej)=>{
                            Utils.timeOut(()=>{
                                if(attrvalue){
                                    el.setAttribute(attrkey, true);
                                } else {
                                    el.setAttribute(attrkey);
                                };
                                res();
                            },100);
     
                        })
                    } else {
                        return new Promise((res, rej)=>{
                            if(el.hasAttribute(attrkey)){
    
                                Utils.timeOut(()=>{
                                    el.removeAttribute(attrkey);
                                    res();
                                },100);
                            } else {
                                res();
                            };
                        });
                    };
                }));
            };
        }));
    });
}