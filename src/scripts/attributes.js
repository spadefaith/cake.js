
const Templating = require('./templating');

const RouterStorage = require('./storage/router-storage');


const notifyAttr = require('./attrib/data-attr');
const notifyBind = require('./attrib/data-bind');
const notifyClass = require('./attrib/data-class');
const notifyForUpdate = require('./attrib/data-for-update');
const notifyFor = require('./attrib/data-for');
const notifyIf = require('./attrib/data-if');
const notifyModel = require('./attrib/data-model');
const notifyToggle = require('./attrib/data-toggle');
const notifyRoute = require('./attrib/data-route');
const AttribConfigStorage = require('./storage/AttribConfigStorage');
const UTILS = require('./utils');
// const notifyForAuto = require('./attrib/data-for-auto');
const notifySwitch = require('./attrib/data-switch');

// const st = {};
// 
function Attrib(){

    this.uiid = 0;
    this.notify = {};
    this.sts = {};
    this.storage = new AttribConfigStorage();
    this.logicalType = ['if', 'bind', 'switch', 'toggle', 'class', 'attr'];
};

Attrib.prototype.notifyFor = notifyFor;
Attrib.prototype.notifyForUpdate = notifyForUpdate;

Attrib.prototype.notifySwitch = notifySwitch;
Attrib.prototype.notifyClass = notifyClass;
Attrib.prototype.notifyBind = notifyBind;
Attrib.prototype.notifyAttr = notifyAttr;
Attrib.prototype.notifyIf = notifyIf;
Attrib.prototype.notifyModel = notifyModel;
Attrib.prototype.notifyToggle = notifyToggle;
Attrib.prototype.notifyRoute = notifyRoute;

/*
    watch for the (name) which is registered to the scope
    get all attribute with that name,
    get all component holding that (name),
    and notify them;
*/

Attrib.prototype.notifier = function(prop, newValue, prevValue, component){
    // console.time('attr');

    // console.log(47, newValue);

    if(newValue == undefined){
        return Promise.resolve();
    };

    let val = JSON.parse(JSON.stringify(newValue));
    // if(Utils.isObject(val)){
    //     val = JSON.parse(JSON.stringify(newValue));
    // };
    const equiv = {
        for:'For',
        forUpdate:'ForUpdate',
        switch:'Switch',
        // toggle:'Toggle',
        bind:'Bind',
        // model:'Model',
        if:'If',
        class:'Class',
        attr:'Attr',
        route:'Route',

        // disabled:'Disabled',
        // readonly:'Readonly',
        // checked:'Checked',
    };

    let hits = Object.caching('AttribProp').get(prop) || 
    (()=>{
        let hits = {};
        const actions = Object.keys(equiv);
        // const configs = this.sts[component];
        const configs = this.storage.get(component);
        if(!configs){
            return [];
        };
        for (let a = 0; a < actions.length; a++){
            const action = actions[a];
            const vals = configs[action];

            if(vals){

                for (let v = 0; v < vals.length; v++){
                    const val = vals[v];
                    // const {bind} = val;
                    const bind = val.bind;



                    if(bind == prop){
                        hits[action] = true;
                    };
                };
            };
        };
        hits = Object.keys(hits);

        Object.caching('AttribProp').set(prop, hits);
        return hits;
    })();

   

    return new Promise((res, rej)=>{
        try {
            let l = hits.length;
            let index = 0;
            const rec = (()=>{
                if(l > index){
                    let attr = hits[index];
                    const name = equiv[attr];

                  

                    index += 1;
                    this[`notify${name}`](prop, val, prevValue, component).then(()=>{
                        rec();
                    });
                } else {
                    res();
                };
            });rec();
        } catch(err){
            rej(err.message);
        };
    });
};

Attrib.prototype.registerNotifier = function(component, fn){

    if (!this.notify[component]){
        this.notify[component] = [];
    };
    this.notify[component].push(fn);
};

Attrib.prototype.getEventTarget = function(component){
    let id = `${component}`;
    let target = Object.caching('getEventTarget').get(id);
    if (!target){
        let cf = this.storage.get(component);
        target = (cf && cf.evt)?cf.evt:[];
        Object.caching('getEventTarget').set(id, target);
    };
    return target;
};

Attrib.prototype.getRouterTarget = function(component){
    let id = `${component}`;
    let target =  Object.caching('getRouterTarget').get(id);
    if(!target){
        let cf = this.storage.get(component);
        target = (cf && cf.route)?cf.route:[];
        Object.caching('getRouterTarget').set(id, target);
    };
    return target;
};

Attrib.prototype.getWatchItems = function(component){ 
    let id = `${component}`;
    let target =  Object.caching('getWatchItems').get(id);
    if(!target){
        let _st = this.storage.get(component);
        let red = UTILS.reduce(_st,{wt:[], forWt:[]}, function(obj, accu, index){
            let type = obj.key;
            let tst = obj.value;
            UTILS.each(tst, function(item, index){
                let bind = item.bind;
                if(bind){
                    if(type == 'for'){
                        accu.forWt.push(bind);
                    } else {
                        accu.wt.push(bind);
                    };
                };
            });
            return accu;
        });
        let wt = UTILS.unique(red.wt);
        let forWt = UTILS.unique(red.forWt);
        //make the for first;
        target = forWt.concat(wt);
        Object.caching('getWatchItems').set(id, target);
    };
    return target;
};

Attrib.prototype.getWatchItemsByType = function(component, type){
    let id = `${component}-${type}`;
    let target =  Object.caching('getWatchItemsByType').get(id);
    
    if (!target){
        let _st = this.storage.get(component);

        // console.log(219, component, _st);
  

        let tst = _st[type] || [];
        let wt = new Set();

        if(type == 'animate' || type == 'toggle'){
            wt = [];
        };

        for (let t = 0; t < tst.length; t++){

            let item = tst[t];
            // let {bind} = item;
            let bind = item.bind;
            


            if(type == 'animate' || type == 'toggle'){
                wt.push(item);
            } else {
                !!bind && wt.add(bind);
            };
        };
        target = [...wt];
        Object.caching('getWatchItemsByType').set(id, target);
    };

    return target;
};

Attrib.prototype.getWatchItemsBySel = function(component, type, sel){
    let id = `${component}-${type}-${sel}`
    let target =  Object.caching('watchItemsBySel').get(id);
    if (!target){
        // let array = this.sts[component][type];
        let array = this.storage.get(component, type);;
        let find = array.find(item=>{return item.sel == sel});
        target = (find)?find:false;
        Object.caching('watchItemsBySel').set(id, target);
    };
    return target;
};
Attrib.prototype.getConfig = function(component){
    return this.storage.get(component);
};

Attrib.prototype._activateReactive = (component)=>{

};

Attrib.prototype._register = function(f, s, obj){
    return this.storage.set(f, s, obj);
};

Attrib.prototype._static = function(component){
    return function(qs, isStatic){
        let els = [];

        // console.log(component, qs, isStatic)
        for(let t = 0; t < qs.length; t++){
            let el = qs[t];
            // console.log(el);
            switch(isStatic){
                case false:{
                    els.push(el);
                };
                break;
                case true:{
                    let dComponent = el.closest('[data-component]');
                    // console.log(dComponent ,component);
                    dComponent = dComponent && dComponent.dataset.component;
                    switch(dComponent == component){
                        case true:{
                            els.push(el);
                        } break;
                    };
                }
                break;
                default:{continue;}
            };
        };
        // console.log(els, component);
        return els;
    }
};

Attrib.prototype._loopElements = function(attr, els, component, isStatic,cb){
    if (!els.length) {return false;};
    els = this._static(component)(els, isStatic);

    if (!els.length){return false;};
    for (let i = 0; i < els.length; i++){
        let el = els[i];
        let id = `ckm${this.uiid}`;
        let target, gr;
        if(attr.includes(',')){
            let attrs = attr.split(',');
            target = {}, gr = {};
            for (let a = 0; a < attrs.length; a++){
                let attr = attrs[a];
                target[attr] = el.dataset[attr];
                gr[attr] = target.split(',');
            };
        } else {
            target = el.dataset[attr];
            gr = target.split(',');
        }
        cb(el, id, target, gr, i);
    };
    return true;
};

Attrib.prototype._compileEvents = function(events,component, isStatic){
    return new Promise((res)=>{

        this._loopElements('event',events, component, isStatic, (function(el, id, target, gr, index){
            let splitted = gr;
            for (let s = 0; s < splitted.length ; s++){
                let _sp1 = splitted[s].split(':');
                let event = _sp1[0];
                let cb = _sp1[1];
                event = event.trim();
                cb = cb ? cb.trim(): cb;
                this._register(component, 'evt', {event, sel:id, cb});
                el.dataset.event = id;
                this.uiid++;
            }
        }).bind(this));

        res();
    });
};

Attrib.prototype._compileToggle = function(toggles, component, isStatic){
    return new Promise((res)=>{
        let c = {};
        this._loopElements('toggle',toggles, component, isStatic, (function(el, id, target, gr, index){
            let ns = target;
            if (c[ns]){
                id = c[ns];
            };
            this._register(component, 'toggle', {sel:id, name:'ns-'+ns});
            el.dataset.toggle = id;
            this.uiid++;
            c[ns] = id;
        }).bind(this));
        c = {};
        res();
    });
};
Attrib.prototype._compileFor = function(fors, component, isStatic, el){
    return new Promise((res)=>{
        let target = el;
        if (!fors.length) {res();return;};
        let els = this._static(component)(fors, isStatic);
        if (!els.length){res();return;}

        let o = {};
        for (let f = 0; f < els.length; f++){
            let id = `ckf${this.uiid}`;

            o[id] = {};

            let el = els[f];
            let fr = el.dataset.for;
            let isCleaned = el.dataset.forCleaned==undefined || el.dataset.forCleaned=="true"; 
            // let [a, b, c] = fr.split(" ");
            let _sp1 = fr.split(" ");
            let a = _sp1[0];
            let b = _sp1[1];
            let c = _sp1[2];

            el.style.display  = 'none';
            el.classList.add('cake-template');
            el.dataset.for = id;
            el.dataset.forTemplate = id;


            o[id] = Object.assign(o[id], {bind:c, sel:id, iter:a, ins: b, cleaned:isCleaned});

            ++this.uiid;
            if (f != 0){
                let parent = el.parentElement && el.parentElement.closest('[data-for]');
                // console.log(409,parent);
                if (!parent) { continue}
                let parentIsFor = !!parent.dataset.for;
                if (target.contains(parent) && parentIsFor){
                    let parentId = parent.dataset.for;
                    let parentCf = o[parentId];
                    if (parentCf && !parentCf.children){
                        parentCf.children = [id];
                    } else if (parentCf){
                        parentCf.children.push(id);
                    };
                }
                
            };
        };
        for (let key in o){
            if (o.hasOwnProperty(key)){
                this._register(component, 'for', o[key]);
            };
        };
        res();
    });
};

Attrib.prototype._compileForUpdate = function(fors, component, isStatic){
    return new Promise((res)=>{
        this._loopElements('forUpdate',fors, component, isStatic, (function(el, id, target, gr, index){

            el.style.display  = 'none';
            el.classList.add('cake-template');
            el.dataset.forUpdate = id;

            if (!el.dataset.for){
                el.dataset.forTemplate = id;
            }
            let _sp1 = target.split(" ");
            let a = _sp1[0];
            let b = _sp1[1];
            let c = _sp1[2];

            this._register(component, 'forUpdate', {bind:c, sel:id, iter:a,ins: b});
            this.uiid++;
        }).bind(this));

        res();
    });
};

Attrib.prototype._compileSwitch = function(switchs, component, isStatic){
    return new Promise((res)=>{
        this._loopElements('switch',switchs, component, isStatic, (function(el, id, target, gr, index){
            let parentFor = el.closest('[data-for]');

            if(!parentFor){
                el.style.display  = 'none';
                el.classList.add('cake-template');
                console.log('compiling switch');
            }

            let bind = el.dataset.switch, map='def';
            if (bind.includes('.')){
                const _sp1 = el.dataset.switch.split('.');
                bind = _sp1[0];
                map = _sp1[1];
            };
            el.dataset.switch = id;
            let cases = el.querySelectorAll('[data-case]');
            let casesId = [];
            for (let c = 0; c < cases.length; c++){
                let _case = cases[c];
                let closest = _case.closest(`[data-switch=${id}]`);
                _case.classList.add('cake-template');
                if (closest){
                    let caseBind = _case.dataset.case;
                    let _id = `cksc${this.uiid}`
                    _case.dataset.case = `${id}-${_id}`;
                    casesId.push({_id, bind:caseBind});
                    this.uiid++;
                };
            };
            let cnf = {bind, sel:id, map, cases:casesId};
            if(!!parentFor){
                cnf.parentFor = !!parentFor;
                cnf.parentForSel = parentFor.dataset.for;
            };
            this._register(component, 'switch', cnf);
            this.uiid++;
        }).bind(this));
        res()
    });
};

Attrib.prototype._compileBind = function(elModels, component, isStatic){
    return new Promise((res)=>{
        this._loopElements('bind',elModels, component, isStatic, (function(el, id, target, gr, index){
            for (let g = 0; g < gr.length; g++){
                let val = gr[g].split(" ").join("");
                if (val.includes(':')){
                    const _sp1 = val.split(":");
                    var attr = _sp1[0];
                    var bind = _sp1[1];
                } else {
                    var bind = val;
                    var attr = el.value == undefined?'textContent':'value';
                };
                this._register(component, 'bind', {attr, bind, sel:id});
            }
            this.uiid++;
            el.dataset.bind = id;
        }).bind(this));
        res();
    });
};

Attrib.prototype._compileAnimate = function(anims, component, isStatic){
    return new Promise((res)=>{
        this._loopElements('animate',anims, component, isStatic,(function(el, id, target, gr, index){
            let o = {};
            for (let a = 0; a < gr.length; a++){
                let item = gr[a];
                let _sp1 = item.split(':');
                let ctx = _sp1[0];
                let anims = _sp1[1];
                if (ctx == 'ns'){
                    o.ns = anims;
                    break;
                } else {
                    o[ctx] = {keyframes:anims.split('-')};
                };
            };
            o.selector = {attr:'data-animate', val:id};
            this._register(component, 'animate', o);
            this.uiid++;
            el.dataset.animate = id;
        }).bind(this));
        res();
    });
};


Attrib.prototype._compileIf = function(ifs, component, isStatic){
    return new Promise((res)=>{
        const regex = new RegExp('<|>|===|==|!==|!=');
        this._loopElements('if,ifBind',ifs, component, isStatic,(function(el, id, target, gr, index){
            let _if = target['if'];
            let _ifBind = target['ifBind'];
            let _gr = gr['if'];
            
            for (let g = 0; g < _gr.length; g++){
                let val = gr[g];
                let attr = val.substring(0,val.indexOf('='));
                let exp = val.substring(val.indexOf('=')+1, val.length);
                exp = exp.split(new RegExp('[()]')).join("");
                let _sp2 = exp.split('?');
                let test = _sp2[0];
                let r = _sp2[1];

                let hasNegate = test[0] == '!';
                hasRegularLog = test.match(regex);

                let bind, testVal, ops;
                if(hasRegularLog){
                    let splitted = test.split(regex);
                    bind = splitted[0].trim();
                    testVal = splitted[1].trim();
                    ops = hasRegularLog[0];
                } else {
                    bind = test;
                };

                if(hasNegate){
                    bind = bind.slice(1);
                };
                
                let _sp1 = r.split(':');
                let _true = _sp1[0];
                let _false = _sp1[1];
                this._register(component, 'if', {hasNegate, attr, ops, bind, testval:testVal || null, _true, _false, sel:id, ifBind:_ifBind});
            }
            this.uiid++;
            el.dataset.if = id;

        }).bind(this));

        res();
    });
};

Attrib.prototype._compileClass = function(cls, component, isStatic){
    return new Promise((res)=>{
        let regex = new RegExp('<|>|===|==|!==|!=');
        this._loopElements('class',cls, component, isStatic, (function(el, id, target, gr, index){
            let hasRegularLog, hasNegate, bindVal, ops, testVal, hasNegateCount;
            let cls = gr;
            for (let c = 0; c < cls.length; c++){
                let clItem = cls[c];
                let _sp1 = clItem.split('&&');
                // let [test, className] = clItem.split('&&');
                let test = _sp1[0];
                let className = _sp1[1];

                test = test.trim();
                className = className.trim();
    
                
    
                hasRegularLog = test.match(regex);
    
    
                if(test.substring(0,2).includes('!')){
                    hasNegate = true;
                    hasNegateCount = (test.substring(0,2) == '!!')?2:(test.substring(0,1)=='!')?1:0;
                } else {
                    hasNegate = false;
                    hasNegateCount = 0;
                };
    
                
                if(hasRegularLog){
                    let splitted = test.split(regex);
                
                    bindVal = splitted[0].trim();
                    testVal = splitted[1].trim();
                    ops = hasRegularLog[0].trim();
                } else {
                    
                    !hasNegate && (bindVal = test);
                    if(hasNegate){
                        bindVal = test.substring(hasNegateCount);
                        testVal = hasNegateCount == 2;
                    };
                };
    
                
                // if(component == 'header1'){
                //     console.log(1534, bindVal, test, testVal, hasNegateCount);
                // }
    
                this._register(component, 'class', {hasNegate, bind:bindVal, testVal,className, ops, sel:id});
            }



            this.uiid++;
            el.dataset.class = id;
        }).bind(this));

        res();
    });
};

Attrib.prototype._compileAttr = function(attrs, component, isStatic){
    return new Promise((res)=>{
        let regex = new RegExp('<|>|===|==|!==|!=');
        this._loopElements('attr',attrs, component, isStatic, (function(el, id, target, gr, index){
            let hasRegularLog, hasNegate, bindVal, ops, testVal;
            let _sp2 = target.split('&&');
            let test = _sp2[0];
            let attrPair = _sp2[1];
            attrPair = attrPair.trim();
        
            let _sp1 = attrPair.split('=');
            let attrkey = _sp1[0];
            let attrvalue = _sp1[1];

            test = test.trim();
            
            hasRegularLog = test.match(regex);
            hasNegate = test[0] == '!';
            if(hasRegularLog){
                let splitted = test.split(regex);
            
                bind = splitted[0];
                testVal = splitted[1];
                ops = hasRegularLog[0];
            } else {
                bind = test;
            };

            if(hasNegate){
                hasNegate && (bind = bind.slice(1));
            };

            this._register(component, 'attr', {hasNegate, bind, testVal,attrkey, attrvalue, ops, sel:id});
            this.uiid++;
            el.dataset.attr = id;
        }).bind(this));

        res();
    });
};

Attrib.prototype._compileModel = function(elModels, component, isStatic){
    return new Promise((res)=>{

        this._loopElements('model',elModels, component, isStatic, (function(el, id, target, gr, index){
            let nodeType = el.tagName;

            for (let g = 0; g < gr.length; g++){
                let val = gr[g].split(" ").join("");
                if (val.includes(':')){
                    // var [attr, bind] = val.split(":");
                    var splitted = val.split(':');
                    var attr = splitted[0];
                    var bind = splitted[1];

                } else {
                    var bind = val;
                    var attr = 'value';
                };
                this._register(component, 'model', {attr, bind, sel:id,nodeType});
            };
            this.uiid++;
            el.dataset.model = id;
        }).bind(this));

        res();
    });
}

Attrib.prototype._compileRoute = function(elRoutes, component, isStatic){
    return new Promise((res)=>{

        this._loopElements('route',elRoutes, component, isStatic, (function(el, id, target, gr, index){
            for (let g = 0; g < gr.length; g++){
                let val = gr[g].split(" ").join("");
                let isFromFor = el.closest('[data-for]');


                this._register(component, 'route', {bind:val,sel:id,for:!!isFromFor});
            };
            this.uiid++;
            el.dataset.route = id;
        }).bind(this));

        res();
    });
};

Attrib.prototype.inject = function(el, component, isStatic=false){
    return new Promise((res)=>{
        let query = el.getElementsByDataset('bind', 'for', 'for-update', 'switch', 'toggle', 'event', 'animate','if','class','attr','route');
        res(query);
    }).then((query)=>{
        let r = [];
        let map = {
            'bind':this._compileBind,//logical
            'switch':this._compileSwitch,//logical
            'toggle':this._compileToggle,//logical
            'if':this._compileIf,//logical
            'class':this._compileClass,//logical
            'attr':this._compileAttr,//logical
            'for':this._compileFor,
            'for-update':this._compileForUpdate,
            'event':this._compileEvents,
            'animate':this._compileAnimate,
            'route':this._compileRoute,
            // 'model':this._compileModel,

            // 'model':"",
            // 'validator':"",
        };

        for (let q in query){
            if (query.hasOwnProperty(q)){
                if (query[q].length){
                    r.push(map[q].apply(this, [query[q], component, isStatic, el]));
                };
            };
        };
        
        // console.timeEnd(component);
        
        return Promise.all(r.length?r:[r]);
    }).then(()=>{
        
        // return this.store.createOrUpdate(component, this.st[component]);
        return Promise.resolve();
    });
    
};


module.exports = Attrib;