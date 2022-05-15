const Templating = require('../templating');
// const Utils = require('../utils');
// const {getConfig, updateConfig, extendConfig} = require('./utils');

// console.log(Templating);
module.exports = function(st){

    return (async function(obj){
    
        let {vItems, configs, newValue} = obj;
        /**************************************************************************** */
        /*
        it becomes possible in switch, that it marks the children of switch parent having [data-for] attrb by [data-for=?-active];
        */
        let childCf = [];
        for (let o = 0; o < configs.length; o++){
            let config = configs[o];
            let children = config.children;
            if (!children) continue;
            
            for (let c = 0; c < children.length; c++){
                let child = children[c];
    
                // console.log(392, newValue);
    
                if (!st[config.component]){
                    continue;
                }
                let cf = st[config.component].for.find(item=>{
                    return item.sel == child;
                });
                cf && childCf.push(new Promise((res)=>{
                    let {bind, sel, iter, ins} = cf;
                    setTimeout(()=>{
                        let targets = document.querySelectorAll(`[data-for=${sel}-active]`);
    
                        for (let t = 0; t < targets.length; t++){
                            let target = targets[t];
    
                            // console.log(516, target);
    
                            let prop = target.dataset.forAutoBindKey;
                            let value = target.dataset.forAutoBindValue;
                            let props = newValue.find(item=>{
                                return item[prop] == value;
                            });
                            let pr = bind.split('.')[bind.split('.').length - 1];
                            let datas = props[pr].length && props[pr].map(item=>{
                                if (item instanceof Object){
                                    return item;
                                } else {
                                    return {[iter]:item};
                                };
                            });
                            if (datas){
                                for (let d = 0; d < datas.length; d++){
                                    let data = datas[d];
                                    let template = target.cloneNode(true);
                                    let create = new Templating(data, template, false).createElement();
                                    create.style.removeProperty('display');
                                    create.classList.remove('cake-template');
                                    create.removeAttribute('data-for-template');
                                    target.insertAdjacentElement('beforebegin', create);
                                };
                            };
                            if (target.parentElement.tagName == 'SELECT'){
                                target.parentElement.selectedIndex = 0;
                            };
                        };
                        res();
                    })
                }));
            };
        };
        return Promise.all(childCf);
        /**************************************************************************** */
        
    });
}