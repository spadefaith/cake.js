const Utils = require('../utils');
const _utils = require('./utils');
const getConfig =_utils.getConfig
const updateConfig =_utils.updateConfig
const extendConfig =_utils.extendConfig


module.exports = (async function(prop, newValue, prevValue, component, html){
    html = html || document;
    let st = this.storage.get(component, 'switch');
    let configs = getConfig(st,prop, newValue, prevValue, component);


    if (!configs.length) return;



    for (let c = 0; c < configs.length; c++){
        let config = configs[c], data;
        // let {attr, bind, sel, incrementedSel,incrementId, incrementedSels} = config;

        let parentFor = config.parentFor;

        if(parentFor){return;};

        if(!!newValue.incrementedSel){
            data = newValue[bind];
        } else {
            data = newValue;
        };

        let bind = config.bind;
        let sel = config.sel;
        let cases = config.cases;
        const mapping = data;

        if (prop != bind){return};

        let els = html.querySelectorAll(`[data-switch=${sel}]`);

        for (let p = 0; p < els.length; p++){
            let switchElement = els[p];

            let hitCase = cases.find(item=>{
                let _id = item._id;
                let caseBind = item.bind;

                if(caseBind.includes('|')){
                    return caseBind.split('|').map(item=>item.trim()).some(item=>item==mapping);
                } else {
                    return caseBind == mapping
                };
            });

            if(!hitCase){return};

            const find = switchElement.querySelector(`[data-case=${sel}-${hitCase._id}]`);
            find.classList.remove('cake-template');
            
            switchElement.style.removeProperty('display');
            switchElement.classList.remove('cake-template');

            switchElement.innerHTML = find.outerHTML;
        };
    };

    newValue = null;
});