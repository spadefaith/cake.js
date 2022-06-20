const Utils = require('../utils');
const {getConfig, updateConfig, extendConfig} = require('./utils');

module.exports = (async function(prop, newValue, prevValue, component, html){

    // console.log(477,prop, newValue, component);

    let st = this.storage.get(component, 'class');
    html = html || document;
    let configs = getConfig(st,prop, newValue, prevValue, component);

    // console.log(478, configs);

    if (!configs.length) return;

    let cache = {};

    configs = extendConfig(configs);

    // console.log(731, configs);

    for (let c = 0; c < configs.length; c++){
        let config = configs[c], data;
        let {hasNegate, bind, testVal,className, ops, sel,  incrementedSel,incrementId} = config;

        bind = Utils.removeWhiteSpace(bind);

        incrementedSel = newValue.incrementedSel || incrementedSel;

        if(!!newValue.incrementedSel){
            // console.log(229, newValue, bind);
            data = newValue[bind];
        } else {
            data = newValue;
        };
        
        if (prop == bind){
            if (!cache[incrementedSel || sel]){
                cache[incrementedSel || sel] = html.querySelectorAll(`[data-class=${incrementedSel || sel}]:not(.cake-template)`);//just to convert iterable;
            }
            let els = cache[incrementedSel || sel];

            // component == 'header1' && console.log(759, data,  component);

            for (let p = 0; p < els.length; p++){
                let el = els[p];
                let test = false;
                if (ops){
                    test = Utils.logTest(data, ops, testVal);
                    hasNegate && (test = !test);
                } else if (hasNegate){
                    // test = !data;
                    test = data == testVal;
                } else {
                    test = !!data;
                };

                // component == 'header1' && console.log(503, {data}, {testVal}, {test}, {el}, {className});

                if (test){
                    // console.log('add ',className);
                    Utils.splitBySpace(className, function(cls){
                        // console.log(519, data,  ops, testVal, test);
                        const classList = Utils.toArray(el.classList);
                        if (!classList.includes(cls)){
                           setTimeout(()=>{
                                el.classList.add(cls);
                           });
                        };
                    });
                } else {
                    // console.log('remove ',className);
                    Utils.splitBySpace(className, function(cls){
                        const classList = Utils.toArray(el.classList);

                        if (classList.includes(cls)){
                            setTimeout(()=>{
                                el.classList.remove(cls);
                            });
                        };
                    });

                };
            };
        };
    };

    newValue = null;
});