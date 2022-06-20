const Utils = require('../utils');
const Piece = require('../piece');
const Templating = require('../templating');
const Plugin = require('../plugin');

const {getConfig, updateConfig, extendConfig} = require('./utils');


module.exports = (async function(prop, newValue, prevValue, component, html){
    html = html || document;

    let st = this.storage.get(component, 'forUpdate');

    let configs = getConfig(st, prop, newValue, prevValue, component);
    if (!configs.length) return;

    let templating = new Templating(Plugin('templating'));
    // console.log(configs)

    // console.log(206, prop, newValue, component);


    // console.log(23, this.sts);

    const attrPayload = [];
    for (let c = 0; c < configs.length; c++){
        // let {bind, sel, iter, ins, targets} = configs[c];
        let bind = configs[c].bind;
        let sel = configs[c].sel;
        let iter = configs[c].iter;
        let ins = configs[c].ins;
        let targets = configs[c].targets;
        // let index = -1;
        for (let o in newValue){
            if (newValue.hasOwnProperty(o)){
                let targets = document.querySelectorAll(`[data-for-update-bind=${o}]`);
                // console.log(467, targets);
                // const row = newValue[o];
                // index += 1;

                for (let t = 0; t < targets.length; t++){
                    
                    let target = targets[t];
                    let binded = target.dataset.forUpdateBind;

                    

                    // console.log({binded})
                    // console.log({target})

                    if (!target.dataset.forTemplate){
                        target.remove();
                    } else {
                        let template = target.cloneNode(true);
                        template.style.removeProperty('display');
                        template.classList.remove('cake-template');
                        let dataForIteration = newValue[binded];

                        // console.log({dataForIteration})



                        let i = -1; l = dataForIteration.length;
                        while(++i < l){
                            let item = dataForIteration[i];
                            let index = i;

                            for (let lt = 0; lt < this.logicalType.length; lt++){
                                let type = this.logicalType[lt];
                                const logicalHtml = new Piece(target).querySelectorAllIncluded(`[data-${type}]`)
     
                                for (let l = 0; l < logicalHtml.length; l++){
                                    const hit = logicalHtml[l];
                                    // console.log(550, hit, hit.dataset[type]);
                                    if (hit.dataset[type]){
                                        let sel = hit.dataset[type];
                                        let incrementedSel = `${sel}-${index}`;
                                        template.dataset[type] = incrementedSel;
                                        let bind = this.getWatchItemsBySel(component,type,sel).bind;
                                        if (bind.includes('.')){
                                            let split = bind.split('.');
                                            binded = split[0];
                                            for (let key in item){
                                                let value = item[key];
                                                let _key = `${binded}.${key}`;
                                                item[_key] = value;
                                            };
                                        };
                                       
                                        
                                        
                                        if (sel){
                 
                                            
                                            attrPayload.push({_type:type, ...item, incrementedSel,sel, bind, incrementId:index, component});
                                        };
                                    };
                                };
                            };
    
                              
                            let create = templating.createElement(item, template, false);
                            // console.log(create);
                            create.classList.remove('cake-template');
                            create.removeAttribute('data-for-template');
                            target.insertAdjacentElement('beforebegin', create);
                            if (target.parentElement.tagName == 'SELECT'){
                                target.parentElement.selectedIndex = 0;
                            };
                        };
                    };
                };
            };
        };
    };

    newValue = null;

    // console.log(attrPayload);
    // console.log(185, attrPayload);
    return Promise.all(attrPayload.map(payload=>{
        // const {bind, _type, component, incrementedSel, sel} = payload;
        const bind = payload.bind;
        const _type = payload._type;
        const component = payload.component;
        const incrementedSel = payload.incrementedSel;
        const sel = payload.sel;
        const name = `notify${_type.toProper()}`;


        // console.log(665, {incrementedSel});
        updateConfig(_type, bind, payload, null, component, {incrementedSel}, sel);


        return this[name](bind, payload, null,component);
    })).then(()=>{
        // console.log('finish setting attribute', component);
    });
});