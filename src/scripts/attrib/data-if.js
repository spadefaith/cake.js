const Utils = require('../utils');

const {getConfig, updateConfig, extendConfig} = require('./utils');

module.exports = function(st){
    return (async function(prop, newValue, prevValue, component, html){
        html = html || document;
        // console.log(605,prop, newValue);
        let configs = getConfig(st,'if', prop, newValue, prevValue, component);
        // console.log(603, configs);
    
        if (!configs.length) return;
    
        configs = extendConfig(configs);
    
        let cache = {};
    
        // console.log(610, configs);
        for (let c = 0; c < configs.length; c++){
            let config = configs[c];
            /**
             * the incremetedSel is not null when this is called within a loop or data-for;
             */
            let {attr, bind, sel, testval, _true, _false, ops, hasNegate, incrementedSel,incrementId} = config;
            let attrHyphen = attr.toHyphen();
            let trueNotIgnore = _true != 'null';
            let falseNotIgnore = _false != 'null';
    
            if (prop == bind){
                if (!cache[sel]){
                    // console.log(incrementedSel, sel,`[data-if=${incrementedSel || sel}]:not(.cake-template)`);
                    cache[sel] = html.querySelectorAll(`[data-if=${incrementedSel || sel}]:not(.cake-template)`);//just to convert iterable;
                }
                let els = cache[sel];
                // console.log(624,els, newValue);
    
                for (let p = 0; p < els.length; p++){
                    let el = els[p];
    
                    let data = newValue; //it can accept, el with data-if-bind and none;
    
                    let test;
                    if(testval){
                        test = Utils.logTest(testval, ops, data);
                    } else {
                        test = (hasNegate)?!data:!!data;
                    };
    
                    if(test){
                        if(trueNotIgnore){
                            if(attr == 'class'){
                                let trueClasses = _true.split(' ');
                                if(falseNotIgnore){
                                    let falseClasses = _false.split(' ');
                                    falseClasses.forEach(cls=>{
                                        el.classList.remove(cls);
                                    });
                                    trueClasses.forEach(cls=>{
                                        el.classList.add(cls);
                                    });
                                } else {
                                    trueClasses.forEach(cls=>{
                                        if(!el.classList.contains(cls)){
                                            el.classList.add(cls);
                                        };
                                    });
                                };
                                
                            } else {
                                if(data[_true]){
                                    el.setAttribute(attr, data[_true]);
                                }
                            };
                        }
                    } else {
                        if(falseNotIgnore){
                            if(attr == 'class'){
                                let falseClasses = _false.split(' ');
                                if(trueNotIgnore){
                                    let trueClasses = _true.split(' ');
                                    trueClasses.forEach(cls=>{
                                        el.classList.remove(cls);
                                    });
                                    falseClasses.forEach(cls=>{
                                        el.classList.add(cls);
                                    });
                                } else {
                                    trueClasses.forEach(cls=>{
                                        if(!el.classList.contains(cls)){
                                            el.classList.add(cls);
                                        };
                                    });
                                };
                                
                            } else {
                                el.setAttribute(attr, _false);
                            };
                        }
                    };
                };
            };
        };
    });
};