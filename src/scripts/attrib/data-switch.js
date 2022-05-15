const Utils = require('../utils');
const Templating = require('../templating');
const {getConfig, updateConfig, extendConfig} = require('./utils');

module.exports = function({st, logicalType}){

    return (async function(prop, newValue, prevValue, component, html){
        html = html || document;
        let configs = getConfig(st,'switch', prop, newValue, prevValue, component);
        if (!configs.length) return;
    
        // console.log(prop, newValue, configs);
    
        let attrPayload = [];
    
        for (let c = 0; c < configs.length; c++){
            let config = configs[c];
            let {bind, sel, map, cases} = config;
    
    
            let parent = html.querySelectorAll(`[data-switch-slot=${sel}]`);
            // console.log(newValue);
            //it assumes that when the switch is within data-for and it is binded on the same bind of data-for
            //then parent and newValue has the same length;
    
    
            for (let n = 0; n < newValue.length; n++){
                let index = n;
                let row = newValue[n];
                let slot = parent[n];//map the parentelement by newValue index;
                let slotIndex = slot.dataset.index;
                
                let prop = row[map];
                if (prop != undefined){
                    let _case = null;
                    for (let c = 0; c < cases.length; c++){
                        // console.log(156, cases[c].bind.split('|'));
                        let test = cases[c].bind.split('|').includes(prop);
                        if (test){
                            _case = cases[c];
                            break;
                        };
                    };
                    if (_case){
                        let {_id, bind} = _case;
                        let hit = document.querySelector(`[data-case=${sel}-${_id}]`);
                        // console.log(hit);
    
                        if (hit && hit.toString().includes("Element")){
                            
                            hit = hit.cloneNode(true);
                            /**********link to data-for-auto=true**************** */
                            //tag the for children as active;
                            let forChildren = hit.querySelectorAll('[data-for-auto=true]');
                            for (let f = 0; f < forChildren.length; f++){
                                let ch = forChildren[f];
                                ch.dataset.for = `${ch.dataset.for}-active`;
                            };
                            /************************************************* */
                            
                            hit.removeAttribute('data-case');
                            
                            let template = new Templating(row, hit, false).createElement();
                            // console.log(slot)
    
    
                            for (let lt = 0; lt < logicalType.length; lt++){
                                let type = logicalType[lt];
                                if (hit.dataset[type]){
                                    let sel = hit.dataset[type];
                                    let incrementedSel = `${sel}-${index}`;
                                    template.dataset[type] = incrementedSel;
                                    let {bind} = this.getWatchItemsBySel(component,type,sel);
                                    if (sel){
                                        attrPayload.push({_type:type, ...row, incrementedSel,sel,component, bind, incrementId:index});
                                    };
                                };
                            };
    
                            template.classList.remove('cake-template');
                            slot.replaceWith(template);
                        }
                    }
                }
            };
        };
        // console.log(185, attrPayload);
    
    
        return Promise.all(attrPayload.map(payload=>{
            const {bind, _type, component, incrementedSel,sel} = payload;
            const name = `notify${_type.toProper()}`;
    
            // console.log(663, {incrementedSel});
            updateConfig(st,_type, bind, payload, null, component, {incrementedSel},sel);
            // console.log(664,this._getConfig(_type, bind, payload, null, component));
    
            return this[name](bind, payload);
        })).then(()=>{
            // console.log('finish setting attribute', component);
            let incrementedSels = attrPayload.reduce((accu, iter)=>{
                let {sel, incrementedSel, bind} = iter;
                if(!accu[sel]){
                    accu[sel] = {data:iter,incrementedSels:[]};
                };
                accu[sel].incrementedSels.push(incrementedSel);
                return accu;
            }, {});
    
            for (let key in incrementedSels){
                if(incrementedSels.hasOwnProperty(key)){
                    let val = incrementedSels[key];
                    let {data, incrementedSels:ic} = val;
                    let {_type, bind, component,sel} = data;
        
                    updateConfig(st,_type, bind, data, null, component, {incrementedSels:ic},sel);
                };
            };
    
        });
    
    });
};
