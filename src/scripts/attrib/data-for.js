const Utils = require('../utils');
const Templating = require('../templating');

const {getConfig, updateConfig, extendConfig} = require('./utils');

module.exports = function(st){
    // console.log(2,this);
    return (async function(prop, newValue, prevValue, component, html){
        // console.log(3,this, st);
        return new Promise((res, rej)=>{
            try {
                let configs = getConfig(st,'for', prop, newValue, prevValue, component);
    
                if (!configs.length) return;
                // console.trace();
                // console.log(16, component);
            
                let vItems = [];
                for (let c = 0; c < configs.length; c++){
                    let {bind, sel, iter, ins, component, cleaned} = configs[c];
            
                    // html = html || document;
            
                    html = Cake.Components[component].html;
            
                    // console.log(`[data-for-template=${sel}]`);
                    let target = html.querySelectorIncluded(`[data-for-template=${sel}]`);
            
                    // console.log(target);
            
                        // console.log(target.parentElement);
                    let cloned = target.cloneNode(true);

                    // console.log(35, cloned.innerHTML);

                    /****************remove the switch******************** */
                    ;(()=>{
                        let switchs = cloned && cloned.querySelectorAll(`[data-switch]`);
                        if (switchs && switchs.length){
                            let l = switchs.length, i = -1;
                            while (++i < l){
                                let sw = switchs[i];
                                let parent = sw.parentElement;
                                let div = document.createElement('div');
                                div.dataset.switchSlot = sw.dataset.switch;
                                parent.replaceChild(div, sw);
                            };
                            switchs = null;
                        };
                    })();
                    /*******************************************************/
                    ;(()=>{
                        let template = cloned;
                        let i = -1; l = newValue.length;
            
                        newValue = newValue.map(item=>{
                            for (let key in item){
                                if (item.hasOwnProperty(key)){
                                    item[`${iter}.${key}`] = item[key];
                                };
                            };
                            return item;
                        });
            
                        
            
                        newValue.forEach((item, index)=>{
                            let create = new Templating(item, template, false).createElement();
                            // create.style.display = 'block';
                            create.style.removeProperty('display');
                            create.classList.remove('cake-template');
                            create.removeAttribute('data-for-template');
            
                            //trap the create if it has data-if;
                            target.insertAdjacentElement('beforebegin', create);
            
                            //TODO
                            //asign index to switch
                            //for the data-for-update reference;
                            // const slot = create.querySelectorAll('[data-switch-slot]');
                            // if(slot && slot.length){
                            //     for (let s = 0; s < slot.length; s++){
                            //         slot[s].dataset.index = `${index}_${s}`;
            
                            //     };
                            // };
                            
                            let safeSrc = create.querySelectorAll('[data-src]');
                            if (safeSrc){
            
                                for (let s = 0; s < safeSrc.length; s++){
                                    let el = safeSrc[s];
                                    el.src = el.dataset.src;
                                    el.removeAttribute('data-src');
            
                                };
                            };
            
                        });
                        if (cleaned){
                            target.remove()
                        };
            
                    })();
            
                };
                console.log('actual for is finished');
                // console.log(106, this);
                return this.notifyForAuto({ configs, newValue}).then(()=>{
                    console.log('for and forauto is finished');
                    res();
                }).catch(err=>{
                    rej(err);
                });
            } catch(err){
                rej(err);
            }
        });
    });
}