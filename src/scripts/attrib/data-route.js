const Utils = require('../utils');
const _utils = require('./utils');
const getConfig =_utils.getConfig
const updateConfig =_utils.updateConfig
const extendConfig =_utils.extendConfig

module.exports = (async function(prop, newValue, prevValue, component, html){
    html = html || document;
    let st = this.storage.get(component, 'route');
    // console.log(8, this.sts);
    let configs = getConfig(st,prop, newValue, prevValue);
    // if (!configs.length) return;
    if (!configs){return ;};

    configs = extendConfig(configs);

    html = html || document;
    for (let s = 0; s < configs.length; s++){
        let sub = configs[s];
        if (!sub) continue;
        // let {sel, bind, value, ops} = sub;

        let sel = sub.sel;
        let bind = sub.bind;
        let value = sub.value;
        let ops = sub.ops;

        let el = html.querySelector(`[data-route=${sel}]`);


        console.log(31, el);
    };

    newValue = null;
});