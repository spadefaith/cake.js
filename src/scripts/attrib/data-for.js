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
            let switchConfig = this.storage.get(component,'switch');

            // console.log(141,sts);
            // console.log(141,this.storage.get(component,'switch'), prop, newValue, prevValue, component);
            
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
                const children = configs[c].children;
        
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
                    Object.keys(sts).forEach((key,index)=>{
                        if(!['for','evt','animate','switch'].includes(key)){
                           let conf = sts[key];
                           let temp = conf[0];
                        //    let {bind} = temp || {};


                           let bind = temp && temp.bind || undefined;

                           if(bind && bind.match(new RegExp(templating.lefttag),'g')){


                                data.forEach((item, index)=>{
                                    let o = {};
                                    o.bind =  templating.replaceString(item, bind);
                                    o.sel = `${temp.sel}-${increment}-${new Date().getTime()}-${Math.ceil(Math.random()*10)}`;
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
    
                            if(!(switchConfig && switchConfig.length)){return};
             
                            let config = switchConfig.find(item=>{
                                return item.parentForSel == sel;
                            });

                            if(!config){return};
                            
   
                            // const [{bind, map, sel, cases}] = switchConfig;

                            let bind = config.bind;
                            let ssel = config.sel;
                            let cases = config.cases;

                            const mapping = item[bind];


                            

                            const switchElement = template.querySelector(`[data-switch=${ssel}]`);
                            let hitCase = cases.find(item=>{
                                let _id = item._id;
                                let caseBind = item.bind;
                                if(caseBind.includes('|')){
                                    return caseBind.split('|').map(item=>item.trim()).some(item=>item==mapping);
                                } else {
                                    return caseBind == mapping;
                                };
                            });

                            if(hitCase){

                                const find = cloned.querySelector(`[data-case=${ssel}-${hitCase._id}]`);
                                find.classList.remove('cake-template');
                                switchElement.parentNode.innerHTML = find.outerHTML.replace('<script',"");

                                // find && switchElement.parentNode.replaceChild(find,switchElement);

                            } else {
                                switchElement.remove();
                            };

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
                                            get && (get.dataset[key] = cf.sel);
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
                            
                            if(!children) return;

                            children.forEach(child=>{

                                let config = (sts && sts.for || []).find(item=>item.sel == child);
                                // console.log(228,config);
                                const forAutoElement = create.querySelector(`[data-for=${child}]`);

                                if(forAutoElement){

                                    // const iteration = forAutoElement.dataset.forIter;
                                    // const splitted = forAutoElement.dataset.for.split(" ");
                                    // const iter = splitted[1];
                                    // const iteration = splitted[2];

                                    // console.log(242,children);
                                    // console.log(239,item);
                                    let datas = item[config.bind];

                                    if(datas){
                                        //manipulate data;
                                        ;(()=>{
                                            datas = datas.map(item=>{
                                                for (let key in item){

                                                    if (item.hasOwnProperty(key)){
                                                        item[`${config.iter}.${key}`] = item[key];
                                                    };
                                                };
                                                return item;
                                            });
                                        })();

                                        for (let d = 0; d < datas.length; d++){
                                            let data = datas[d];
                                            // console.log(261,data);

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