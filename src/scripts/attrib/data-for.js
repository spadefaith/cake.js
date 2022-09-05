const Utils = require('../utils');
const Templating = require('../templating');
const Plugin = require('../plugin');
const ComponentStorage = require('../storage/components-store');
const RouterStorage = require('../storage/router-storage');
const _utils = require('./utils');
const getConfig =_utils.getConfig
const updateConfig =_utils.updateConfig
const extendConfig =_utils.extendConfig

module.exports = (async function(prop, newValue, prevValue, component, html){
        
    // console.log(12, this.sts);

    let sts = this.storage.get(component);
  


    let templating = new Templating(Plugin('templating'));
    return new Promise((res, rej)=>{
        try {
            let configs = getConfig(this.storage.get(component,'for'), prop, newValue, prevValue, component);
            let switchConfig = getConfig(this.storage.get(component,'switch'), prop, newValue, prevValue, component);
            
            
            if (!configs.length) return;

            let data = newValue.reduce((accu, item)=>{
                accu.push(item);
                return accu;
            }, []);

            newValue = null;




            for (let c = 0; c < configs.length; c++){
                // let {bind, sel, iter, ins, component, cleaned} = configs[c];

                let bind = configs[c].bind;
                let sel = configs[c].sel;
                let iter = configs[c].iter;
                let ins = configs[c].ins;
                let component = configs[c].component;
                let cleaned = configs[c].cleaned;
        
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
                        //    let {bind} = temp || {};


                           let bind = temp && temp.bind || undefined;

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
                            
                            };
                        };
                    });

                })();

                ;(()=>{
                    if (cleaned){
                        let parent = target.parentElement;
                        parent.children.toArray().forEach(child=>{
                            if(child.dataset.for && !child.classList.contains('cake-template')){
                                child.remove();
                            };
                        });
                    };

                    let i = -1; l = data.length;
                    let routeElements = [];
                    for (let d = 0; d < data.length; d++){
                        let item = data[d];
                        let index = d;

                        let template = target.cloneNode(true);
                        //switch;
                        (()=>{
                            if(switchConfig && !switchConfig.length)return;
                            // const [{bind, map, sel, cases}] = switchConfig;

                            let bind = switchConfig[0].bind;
                            let map = switchConfig[0].map;
                            let sel = switchConfig[0].sel;
                            let cases = switchConfig[0].cases;

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

                        //route;
                        (()=>{
                            let routeConfig = this.storage.get(component,'route');

                            if(routeConfig && !routeConfig.length)return;
                            
                            for (let r = 0; r < routeConfig.length; r++){
                                let rconfig = routeConfig[r];
                                let bind = rconfig.bind;
                                let sel = rconfig.sel;
                                let isFor = rconfig.for;
                                if(!isFor){
                                    continue;
                                };
                                const routeElement = create.querySelector(`[data-route=${sel}]`);
                                if(routeElement){
                                    const routes = RouterStorage.get(bind);

                                    if(routes){
                                        let href = routes.path;
                                        routeElement.href = `#!${href}`;
                                    };
                                } else {
                                    continue;
                                }
                            };

                        })();

                        create.replaceDataSrc();
                    };
                    

                    

                    res()
                })();
            };

            html.unRequired();
 
            data= null;
        } catch(err){
            rej(err);
        }
    });
});