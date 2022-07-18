exports.getConfig = function(st, prop, newValue, prevValue, component){
    /*
        newValue is null, when emptying the scope;
    */
    if (newValue == null) {return []};
    if (newValue == prevValue && type != 'bind'){ return [];};
    return (()=>{
        let ctx = [];
        let s = st;
        if (s && s.length){
            for (let i = 0; i < s.length; i++){
                let item = s[i];
                // console.log(item.bind, prop, item);
                if (item.bind == prop){
                    // console.log(type, item);
                    ctx.push({...item, component});
                };
            };
        };
        return ctx;
    })();
};

exports.updateConfig = function(st, type, prop, newValue, prevValue, component, update,sel){
    if (newValue == null) {return };
    if (newValue == prevValue && type != 'bind'){ return };
    // if(update.incrementedSels){
    //     console.debug(121,sel, update);
    // };
    var st = (()=>{
        let config = (st[component] && st[component][type]);
        if(config && config.length){
            let ctx = [];
            for (let i = 0; i < config.length; i++){
                let item = config[i];
                let test = item.bind == prop && ((sel)?item.sel == sel:true);
                if(test){
                    Object.assign(item, update);
                } else {

                };
            };
            return ctx;
        } else {
            return [];
        };
    })();
    return st;
};



exports.extendConfig = function(configs){
    /**
     * add config dynanucakky since
     * every element has unique identifier.
     * everytime it is created either in swith or forUpdate;
     */
    const cloned = [];

    for (let i = 0; i < configs.length; i++){
        const cl = {};
        const item = configs[i];
        for (let key in item){
            cl[key] = item[key];
        };
        cloned.push(cl);
    };

    return cloned.reduce((accu, iter)=>{
        // let {incrementedSels} = iter;
        let incrementedSels = iter.incrementedSels;
        if(incrementedSels && incrementedSels.length){
            incrementedSels.forEach(ic=>{
                let cloned = {...iter};
                cloned.incrementedSel = ic;

                accu.push(cloned);
            });
        } else {
            accu.push(iter);
        };
        return accu;
    }, []);
};