const Utils = require('./utils');

const notifyAttr = require('./attrib/data-attr');
const notifyBind = require('./attrib/data-bind');
const notifyClass = require('./attrib/data-class');
const notifyForAuto = require('./attrib/data-for-auto');
const notifyForUpdate = require('./attrib/data-for-update');
const notifyFor = require('./attrib/data-for');
const notifyIf = require('./attrib/data-if');
const notifyInput = require('./attrib/data-input');
const notifySwitch = require('./attrib/data-switch');
const notifyToggle = require('./attrib/data-toggle');

const st = {};
const logicalType = ['if', 'bind', 'switch', 'toggle', 'class', 'attr'];

function Attrib(){
    this.uiid = 0;
    this.notify = {};
};

Attrib.prototype.notifyFor = notifyFor(st);
Attrib.prototype.notifySwitch = notifySwitch({st,logicalType});
Attrib.prototype.notifyForAuto = notifyForAuto(st);

Attrib.prototype.notifyForUpdate = notifyForUpdate({st,logicalType});

Attrib.prototype.notifyClass = notifyClass(st);
Attrib.prototype.notifyBind = notifyBind(st);
Attrib.prototype.notifyAttr = notifyAttr(st);
Attrib.prototype.notifyIf = notifyIf(st);
Attrib.prototype.notifyInput = notifyInput(st);
Attrib.prototype.notifyToggle = notifyToggle(st);

/*
    watch for the (name) which is registered to the scope
    get all attribute with that name,
    get all component holding that (name),
    and notify them;
*/

Attrib.prototype.notifier = function(prop, newValue, prevValue, component){
    // console.time('attr');
    let val = newValue;
    if(Utils.isObject(val)){
        val = JSON.parse(JSON.stringify(newValue));
    };
    const equiv = {
        for:'For',
        forUpdate:'ForUpdate',
        switch:'Switch',
        toggle:'Toggle',
        bind:'Bind',
        input:'Input',
        if:'If',
        class:'Class',
        attr:'Attr',
    };
    let hits = Object.caching('AttribProp').get(prop) || 
    (()=>{
        let hits = {};
        const actions = Object.keys(equiv);
        const configs = st[component];
        if(!configs){
            return [];
        };
        for (let a = 0; a < actions.length; a++){
            const action = actions[a];
            const vals = configs[action];
            if(vals){
                for (let v = 0; v < vals.length; v++){
                    const val = vals[v];
                    const {bind} = val;
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
                    if(name == 'For'){
                        this[`notify${name}`](prop, val, prevValue, component);
                        rec();
                    } else {
                        this[`notify${name}`](prop, val, prevValue, component).then(()=>{
                            rec();
                        });
                    };
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
        let cf = st[component];
        target = (cf && cf.evt)?cf.evt:[];
        Object.caching('getEventTarget').set(id, target);
    };
    return target;
};

Attrib.prototype.getRouterTarget = function(component){
    let id = `${component}`;
    let target =  Object.caching('getRouterTarget').get(id);
    if(!target){
        let cf = st[component];
        target = (cf && cf.router)?cf.router:[];
        Object.caching('getRouterTarget').set(id, target);
    };
    return target;
};

Attrib.prototype.getWatchItems = function(component){ 
    let id = `${component}`;
    let target =  Object.caching('getWatchItems').get(id);
    if(!target){
        let _st = st[component] || {};
        let wt = new Set;
        for (let type in _st){
            if (_st.hasOwnProperty(type)){
                let tst = _st[type];
                for (let t = 0; t < tst.length; t++){
                    let item = tst[t];
                    let {bind} = item;
                    if (bind){
                        wt.add(bind);
                    } else {continue};
                };
            };
        };
        target = [...wt];
        Object.caching('getWatchItems').set(id, target);
    };
    return target;
};



Attrib.prototype.getWatchItemsByType = function(component, type){
    let id = `${component}-${type}`;
    let target =  Object.caching('getWatchItemsByType').get(id);
    if (!target){
        let _st = st[component] || {};
        let tst = _st[type] || [];
        let wt = new Set();
        for (let t = 0; t < tst.length; t++){
            let item = tst[t];
            let {bind} = item;
            switch(!!bind){
                case true:{
                    wt.add(bind);
                } break;
                default:{
                    switch(true){
                        case (type == 'animate' || type == 'toggle'):{
                            if (wt.constructor.name = "Set"){
                                wt = [];
                            };
                            wt.push(item);
                        }
                    };
                };
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
        let array = st[component][type];
        let find = array.find(item=>{return item.sel == sel});
        target = (find)?find:false;
        Object.caching('watchItemsBySel').set(id, target);
    };
    return target;
};

Attrib.prototype._activateReactive = (component)=>{

};

Attrib.prototype._register = function(store, f, s, obj){
    switch(true){
        case (!store[f]):{store[f] = {}};
        case (!store[f][s]):{store[f][s] = []};
        default:{store[f][s].push(obj)};
        break;
    };
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

Attrib.prototype._compileEvents = function(events,component, isStatic){
    return new Promise((res)=>{
        // console.log(component, events,isStatic)
        if (!events.length) {res();return;};
        let els = this._static(component)(events, isStatic)
        // console.log(els,component);
        if (!els.length){res();return;}
        for (let e = 0; e < els.length; e++){
            let id = `cke${this.uiid}`;
            let el = els[e];
            let splitted = el.dataset.event.split(" ").join("").split(',');
            for (let s = 0; s < splitted.length ; s++){
                let [event, cb] = splitted[s].split(':');
                // console.log( splitted[s].split(':'), event, cb);
                // cb = cb || event;
                this._register(st, component, 'evt', {event, sel:id, cb});
                el.dataset.event = id;
                this.uiid++;
            }
        };
        res();
    });
};

Attrib.prototype._compileToggle = function(toggles, component, isStatic){
    return new Promise((res)=>{
        if (!toggles.length){res();return;}
        let els = this._static(component)(toggles, isStatic);
        if (!els.length){res();return;}
        let c = {};
        for(let t = 0; t < toggles.length; t++){
            let id = `ckt${this.uiid}`;
            let el = toggles[t];
            let ns = el.dataset.toggle;
            

            if (c[ns]){
                id = c[ns];
            };
            this._register(st, component, 'toggle', {sel:id, name:'ns-'+ns});
            el.dataset.toggle = id;
            this.uiid++;
            c[ns] = id;
        };
        c = {};
        res();
    });
};
Attrib.prototype._compileFor = function(fors, component, isStatic, el){
    return new Promise((res)=>{
        let target = el;
        if (!fors.length) {res();return;};
        let els = this._static(component)(fors, isStatic);
        // console.log(component, els)
        if (!els.length){res();return;}

        let o = {};
        for (let f = 0; f < els.length; f++){
            let id = `ckf${this.uiid}`;
            let el = els[f];
            let fr = el.dataset.for;
            let autoBind = el.dataset.forAutoBind;
            let isCleaned = el.dataset.forCleaned=="true"; 
            let [a, b, c] = fr.split(" ");

            if(autoBind){
                let split = autoBind.split(':');
                let autoBindKey = split[0] && split[0].trim();
                let autoBindValue = split[1] && split[1].trim();

                el.dataset.forAutoBindKey = autoBindKey;
                el.dataset.forAutoBindValue = autoBindValue;
                el.removeAttribute('data-for-auto-bind');
            }
            
            el.style.display  = 'none';
            el.classList.add('cake-template');
            el.dataset.for = id;
            el.dataset.forTemplate = id;


            o[id] = {bind:c, sel:id, iter:a, ins: b, cleaned:isCleaned};
            ++this.uiid;
            if (f != 0){
                let parent = el.parentElement && el.parentElement.closest('[data-for]');
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
                this._register(st, component, 'for', o[key]);
            };
        };
        res();
    });
};

Attrib.prototype._compileForUpdate = function(fors, component, isStatic){
    return new Promise((res)=>{
        if (!fors.length) {res();return;};
        let els = this._static(component)(fors, isStatic);
        if (!els.length){res();return;}
        for (let f = 0; f < els.length; f++){
            let id = `ckfu${this.uiid}`;
            let el = els[f];
            let fr = el.dataset.forUpdate;
            el.style.display  = 'none';
            el.classList.add('cake-template');
            el.dataset.forUpdate = id;

            if (!el.dataset.for){
                el.dataset.forTemplate = id;
            }

            let [a, b, c] = fr.split(" ");
            this._register(st, component, 'forUpdate', {bind:c, sel:id, iter:a,ins: b});
            this.uiid++;
        };
        res();
    });
};

Attrib.prototype._compileSwitch = function(switchs, component, isStatic){
    return new Promise((res)=>{
        if (!switchs.length) {res();return;};
        let els = this._static(component)(switchs, isStatic);
        if (!els.length){res();return;}
        for (let s = 0; s < els.length; s++){
            let id = `cks${this.uiid}`;
            let el = els[s];

            let bind = el.dataset.switch, map='def';
            if (bind.includes('.')){
                var [f, ...rest] = el.dataset.switch.split('.');
                bind = f;
                map = rest[0];
            };
            el.dataset.switch = id;
            let cases = el.querySelectorAll('[data-case]');
            // console.log(cases);
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
            this._register(st, component, 'switch', {bind, sel:id, map, cases:casesId});
            this.uiid++;
        };
        res()
    });
};

Attrib.prototype._compileBind = function(elModels, component, isStatic){
    return new Promise((res)=>{

        if (!elModels.length) {res();return;};
        let els = this._static(component)(elModels, isStatic);
        if (!els.length){res();return;}
        for (let s = 0; s < els.length; s++){
            let id = `ckm${this.uiid}`;
            let el = els[s];
            let model = el.dataset.bind;
            let gr = model.split(',');
            for (let g = 0; g < gr.length; g++){
                let val = gr[g].split(" ").join("");
                if (val.includes(':')){
                    var [attr, bind] = val.split(":");
                } else {
                    var bind = val;
                    var attr = 'value';
                };
                this._register(st, component, 'bind', {attr, bind, sel:id});
            }
            this.uiid++;
            el.dataset.bind = id;
        };
        res();
    });
};

Attrib.prototype._compileAnimate = function(anims, component, isStatic){
    return new Promise((res)=>{
        if (!anims.length) {res();return;};

        // console.log(1403,component);

        let els = this._static(component)(anims, isStatic);
        if (!els.length){res();return;}

        
        for (let s = 0; s < els.length; s++){
            let id = `cka${this.uiid}`;
            let el = els[s];
            let anim = el.dataset.animate;
            anim = anim.split(" ").join("");
            //to handle multiple attr binding;
            //render:appead-slideInUp, remove:disappear
            let o = {};
            let split = anim.split(',');
            for (let a = 0; a < split.length; a++){
                let item = split[a];
                let [ctx, anims] = item.split(':');
                if (ctx == 'ns'){
                    o.ns = anims;
                    break;
                } else {
                    o[ctx] = {keyframes:anims.split('-')};
                };
            };
            o.selector = {attr:'data-animate', val:id};
            this._register(st, component, 'animate', o);
            this.uiid++;
            el.dataset.animate = id;
        };
        res();
    });
};

Attrib.prototype._compileIf = function(ifs, component, isStatic){
    return new Promise((res)=>{
        if (!ifs.length) {res();return;};
        let els = this._static(component)(ifs, isStatic);
        if (!els.length){res();return;}
        const regex = new RegExp('<|>|===|==|!==|!=');
        for (let s = 0; s < els.length; s++){
            let id = `ci${this.uiid}`;
            let el = els[s];
            let _if = el.dataset.if;
            let _ifBind = el.dataset.ifBind;
            let gr = _if.split(',');
            for (let g = 0; g < gr.length; g++){
                let val = gr[g];

                let attr = val.substring(0,val.indexOf('='));
                let exp = val.substring(val.indexOf('=')+1, val.length);


                exp = exp.split(new RegExp('[()]')).join("");
                
                let [test, r] = exp.split('?');


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
                

                let [_true, _false] = r.split(':');


                this._register(st, component, 'if', {hasNegate, attr, ops, bind, testval:testVal || null, _true, _false, sel:id, ifBind:_ifBind});

                
            }
            this.uiid++;
            el.dataset.if = id;
        };
        res();
    });
};

Attrib.prototype._compileClass = function(cls, component, isStatic){
    return new Promise((res)=>{
        
        if (!cls.length) {res();return;};
        let els = this._static(component)(cls, isStatic);
        if (!els.length){res();return;}


        let regex = new RegExp('<|>|===|==|!==|!=');

        for (let s = 0; s < els.length; s++){

            let id, el, cl, hasRegularLog, hasNegate, bindVal, ops, testVal, hasNegateCount;

            id = `cc${this.uiid}`;
            el = els[s];
            cl = el.dataset.class;
            let [test, className] = cl.split('&&');
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

            this._register(st, component, 'class', {hasNegate, bind:bindVal, testVal,className, ops, sel:id});
            this.uiid++;
            el.dataset.class = id;
        };
        res();
    });
};

Attrib.prototype._compileAttr = function(attrs, component, isStatic){
    return new Promise((res)=>{
        if (!attrs.length) {res();return;};
        let els = this._static(component)(attrs, isStatic);
        if (!els.length){res();return;}
        let regex = new RegExp('<|>|===|==|!==|!=');
        for (let s = 0; s < els.length; s++){
            let id, el, cl, hasRegularLog, hasNegate, bindVal, ops, testVal;
            id = `cre${this.uiid}`;
            el = els[s];
            cl = el.dataset.attr;
            let [test, attrPair] = cl.split('&&');
            attrPair = attrPair.trim();
        
            let [attrkey, attrvalue] = attrPair.split('=');
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

            this._register(st, component, 'attr', {hasNegate, bind, testVal,attrkey, attrvalue, ops, sel:id});
            this.uiid++;
            el.dataset.attr = id;
        };
        res();
    });
};

Attrib.prototype._compileRouter = function(router, component, isStatic){
    return new Promise((res)=>{

        if (!router.length) {res();return;};
        let els = this._static(component)(router, isStatic);
        if (!els.length){res();return;}
        for (let s = 0; s < els.length; s++){
            let id = `rt${this.uiid}`;
            let el = els[s];
            let value = el.dataset.routerLink;
            this._register(st, component, 'router', {value, sel:id});
            this.uiid++;
            el.dataset.routerLink = id;
        };
        res();
    });
}

Attrib.prototype._compileInput = function(elModels, component, isStatic){
    return new Promise((res)=>{

        if (!elModels.length) {res();return;};
        let els = this._static(component)(elModels, isStatic);
        if (!els.length){res();return;}
        for (let s = 0; s < els.length; s++){
            let id = `cknt${this.uiid}`;
            let el = els[s];
            let nodeType = el.tagName;
            let model = el.dataset.input;
            //data-input='username:'
            let gr = model.split(',');

            for (let g = 0; g < gr.length; g++){
                let val = gr[g].split(" ").join("");
                if (val.includes(':')){
                    var [attr, bind] = val.split(":");
                } else {
                    var bind = val;
                    var attr = 'value';
                };
                this._register(st, component, 'input', {attr, bind, sel:id,nodeType});
            };
            this.uiid++;
            el.dataset.input = id;
        };
        res();
    });
}

Attrib.prototype.inject = function(el, component, isStatic=false){
    // console.trace()
    // console.time(`inject ${component}`)
    // this.st.component = new RAM('for', new RAM());

    return new Promise((res)=>{
        let query = el.getElementsByDataset('bind', 'for', 'for-update', 'switch', 'toggle', 'event', 'animate','if','class','input','attr');
        // console.log(query, component);
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
            'input':this._compileInput,
        };

        for (let q in query){
            if (query.hasOwnProperty(q)){
                if (query[q].length){
                    r.push(map[q].apply(this, [query[q], component, isStatic, el]));
                };
            };
        };
        
        console.timeEnd(component);
        return (r.length)?Promise.all(r):Promise.resolve();
    }).then(()=>{

        
        // return this.store.createOrUpdate(component, this.st[component]);
        return Promise.resolve();
    });
    
};


module.exports = Attrib;