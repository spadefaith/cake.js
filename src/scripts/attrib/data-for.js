const Utils = require('../utils');
const Templating = require('../templating');
const Plugin = require('../plugin');
const ComponentStorage = require('../storage/components-store');

const {getConfig, updateConfig, extendConfig} = require('./utils');

module.exports = (async function(prop, newValue, prevValue, component, html){
        
    // console.log(12, this.sts);

    let sts = this.storage.get(component);
  

    // console.log(18, st);

    let templating = new Templating(Plugin('templating'));
    return new Promise((res, rej)=>{
        try {
            let configs = getConfig(this.storage.get(component,'for'), prop, newValue, prevValue, component);
            
            let switchConfig = getConfig(this.storage.get(component,'switch'), prop, newValue, prevValue, component);

            // console.log(27, switchConfig);
            
           
            
            if (!configs.length) return;

            let data = newValue.reduce((accu, item)=>{
                accu.push(item);
                return accu;
            }, []);

            newValue = null;



            for (let c = 0; c < configs.length; c++){
                let {bind, sel, iter, ins, component, cleaned} = configs[c];
        
                // html = Cake.Components[component].html;
                html = ComponentStorage.get(component).html;
                
                let target = html.querySelectorIncluded(`[data-for-template=${sel}]`);
                let cloned = target.cloneNode(true);



                //manipulate data;
                ;(()=>{
                    data = data.map(item=>{
                        for (let key in item){


                            // console.log(64, key, item[key]);

                            if (item.hasOwnProperty(key)){
                                item[`${iter}.${key}`] = item[key];
                            };
                        };
                        return item;
                    });
                })();


                let hasReplaced = [];
                //update other
                ;(()=>{
                    let increment = 0;
                    Object.keys(sts).forEach(key=>{
                        if(!['for','evt','animate','switch'].includes(key)){
                           let conf = sts[key];
                           let temp = conf[0];
                           let {bind} = temp || {};

                           if(bind && bind.match(new RegExp(templating.lefttag),'g')){
                                data.forEach((item, index)=>{
                                    let o = {};
                                    o.bind =  templating.replaceString(item, bind);
                                    o.sel = `${temp.sel}-${increment}`;
                                    o.rawsel = temp.sel;
                                    increment += 1;

                                    //data binding to the element selector;
                                    data[index].__sel = o.sel;
                                    
                                    for (let key in temp){
                                        if (temp.hasOwnProperty(key)){
                                            if(!o[key]){
                                                o[key] = temp[key];
                                            };
                                        };
                                    };

                                    conf.push(o);

                                });
                                hasReplaced.push(key);
                            } else {

                            };
                        };
                    });

                })();

                ;(()=>{
                    if (cleaned){
                        let parent = target.parentElement;
                        parent.innerHTML = "";
                        parent.appendChild(target);
                    };

                    let i = -1; l = data.length;
        
                    
                    data.forEach((item, index)=>{
                        let template = target.cloneNode(true);
                        //switch;
                        (()=>{
                            if(switchConfig && !switchConfig.length)return;
                            const [{bind, map, sel, cases}] = switchConfig;
                            const mapping = item[map];
                            const switchElement = template.querySelector(`[data-switch=${sel}]`);
                            let hitCase = cases.find(item=>{

                                let _id = item._id;
                                let bind = item.bind;
                                
                                if(bind.includes('|')){
                                    return bind.split('|').map(item=>item.trim()).some(item=>item==mapping);
                                } else {
                                    return bind == mapping
                                };
                            });

                            const find = cloned.querySelector(`[data-case=${sel}-${hitCase._id}]`);

                            find.classList.remove('cake-template');
                            switchElement.innerHTML = find.outerHTML;

                            // switchElement.parentNode.replaceChild(find, switchElement);
                        })();

                        let create = templating.createElement(item, template, false);
                        
                        //replace the templated data-*;
                        ;(()=>{
                            Object.keys(sts).forEach(key=>{
                                if(hasReplaced.includes(key)){
                                    let conf = sts[key];
                                    let cf = conf.find(cf=>{
                                        return cf.sel == item.__sel;
                                    });
                                    if(cf){
                                        let rawsel = cf.rawsel;
                                        if(rawsel){
                                            let get = create.querySelector(`[data-${key}=${rawsel}]`);
                                            get.dataset[key] = cf.sel;
                                        };
                                    }
                                };
                            });
    
                        })();

                        //for
                        ;(()=>{
                            // create.style.display = 'block';
                            create.style.removeProperty('display');
                            create.classList.remove('cake-template');
                            create.removeAttribute('data-for-template');
                            target.insertAdjacentElement('beforebegin', create);
                        })();

                        //auto
                        ;(()=>{
                            const children = configs[0] && configs[0].children;
                            if(!children) return;

                            
        
                            children.forEach(child=>{
                                const forAutoElement = create.querySelector(`[data-for=${child}]`);

                                if(forAutoElement){
                                    const dataBindKey = forAutoElement.dataset.forAutoBindKey;
                                    const dataBindValue = forAutoElement.dataset.forAutoBindValue;
                                    const iteration = forAutoElement.dataset.forIter;

                                    const datas = item[iteration];

                                    if(datas){
                                        for (let d = 0; d < datas.length; d++){
                                            let data = datas[d];
                                            let template = forAutoElement.cloneNode(true);

                                            let create = templating.createElement(data, template, false);
                                            create.style.removeProperty('display');
                                            create.classList.remove('cake-template');
                                            create.removeAttribute('data-for-template');
                                            forAutoElement.insertAdjacentElement('beforebegin', create);
                                        };
                                    };

                                    const select = forAutoElement.closest('SELECT');
                                    if (select){
                                        select.selectedIndex = 0;
                                    };
                                };
                            });
                        })();
                        
                        let safeSrc = create.querySelectorAll('[data-src]');
                        if (safeSrc){
        
                            for (let s = 0; s < safeSrc.length; s++){
                                let el = safeSrc[s];
                                el.src = el.dataset.src;
                                el.removeAttribute('data-src');
        
                            };
                        };
                    });



                    res()
                })();
            };
            data= null;
        } catch(err){
            rej(err);
        }
    });
});