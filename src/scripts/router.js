
module.exports = function(components, component){

    const hooks = [];
    return class {
        constructor(routes){
            this.route = this.compile(routes);
            this.prev = null;
            this.components = components;
            this.watch();
            this.persist();
            // this.navigate();

            // console.log(this.route);
            // console.log(12,routes);
            // console.log(13,this.route);
            // console.log(14,this.prev);

            Object.defineProperty(component.prototype, '$router', {
                configurable:true,
                get:()=>{
                    return {
                        goTo:this.goTo,
                        ...this.prev,
                    };
                },
                set(value){
                    return;
                },
            });
        }
        goTo(hash,params){
            if(params){
                let p = '';
                for (let key in params){
                    p += `${key}=${params[key]}&`;
                };
                params = p;
                window.location.hash = `!/${hash}?${params}`;
            } else {
                window.location.hash = `!/${hash}`;
            }

        }
        persist(){
            if (!document.hasRouterPersist){
                document.addEventListener('DOMContentLoaded', (e)=>{
                    this.parse();
                    this.notify().then(()=>{
                        return this.navigate(true);
                    });
                });
    
                document.hasRouterPersist = true;
            };
        }
        watch(){

            if (!window.hasRouterPop){
                window.onpopstate = (e)=>{
                    this.parse();
                    this.notify().then(()=>{
                        return this.clear().then(()=>{
                            this.navigate();
                        });
                    })
                };
                window.hasRouterPop = true;
            };
        }
        compile(routes){
            let con = {};
            for (let key in routes){
                key = String(key);
                const len = key.length;
                let regex = key;
                if(['404'].includes(key)){
                    //http errors;
                    const callback = routes[key];
                    routes[key] = {callback, name:key};
                } else {
                    regex = regex.slice(1);
                };
                
                regex = regex.split('/');
                regex = regex.map((item, index)=>{
                    let param = item.includes(':');
                    let a = "";
                    (index==0)?(a+="^/"):(a+='/');
                    (param?a+='(([^/#?]+?))':a+=item);
                    (index == len-1)?a+='/?$':a+="";
                    if (param){
                        const paramKey = item.replace(':',"");
                        if (!con[key]){
                            con[key] = {};
                        };
                        con[key].params = {
                            [paramKey]:index,
                        };
                    };
                    return a
                });
                if (con[key] && con[key].params){
                    con[key] = {
                        params:con[key].params,
                        regex:new RegExp(regex.join("")),
                        ...routes[key],
                    }
                } else {
                    con[key] = {
                        regex:new RegExp(regex.join("")),
                        ...routes[key],
                    }
                }
            };
            con.length = Object.keys(routes).length;
            con.keys = Object.keys(routes);
            return con;
        }
        parse(){
            let hash = window.location.hash, scheme;
            if(hash){
                scheme = hash.includes('#!/')?2:hash.includes('#/')?1:null;
                hash =  hash.slice(scheme);
            } else {
                hash = '/';
                scheme = true;
            };
            if (!scheme){
                return;
            };
            const url = new URL(`http://localhost${hash}`);
            const {search, pathname:path} = url;
            const keys = this.route.keys;
            const state = {};
            if (search){
                new URLSearchParams(search).forEach((value, key)=>{
                    state[key] = value;
                });
            };
            let has = false;
            for (let i = 0; i < keys.length; i++){
                const route = this.route[keys[i]];

                const {regex, components, params, name} = route;
                if (params){
                    let _path = String(path);
                    _path = _path.slice(1);
                    _path = _path.split('/');
                    Object.entries(params).forEach(param=>{
                        const [key, value] = param;
                        if (_path[value]){
                            state[key] = _path[value];
                        };
                    });
                };

                const test = regex.test(path);
                
                if (test){
                    this.prev = {components, state,path, name, prev:this.prev};
                    has = true;
                    break;
                };
            };
            if(!has){
                if(this.route['404']){
                    let path = this.route['404'].callback();
                    const {origin, pathname} = location;
                    if(this.route[path]){
                        console.log(1);
                        if(path == '/'){
                            path = `${origin}${pathname}`;
                        } else {
                            if(pathname.slice(-1) == '/'){
                                path = `${origin}${pathname}#!${path}`;
                            } else {
                                path = `${origin}${pathname}/#!${path}`;
                            };
                        };
                        location.replace(path);
                    } else if(!!path && !this.route[path]) {
                        if(origin.slice(-1)=='/'){
                            if(path[0] == '/'){
                                path = path.slice(1);
                            };
                        };
                        path = `${origin}${path}`;
                        location.replace(path);
                    };
                };
            }
        }
        navigate(ispersist){

    
            if (this.prev){
                const {components, state, path, name} = this.prev;
                // console.log(157, this.prev);
                try {
                    // console.log(this.prev);
                    // console.log(hooks);
                    if(components.length){
                        return Promise.all(components.map(item=>{                        
                            return this.components[item].render({emit:{route:this.prev}});
                        }));
                    }

                } catch(err) {
                    console.log(err);
                    throw new Error(`some of the component in ${JSON.stringify(components)} in path ${path} of router is not found, make sure the it is created`);
                }
            }
        }
        static pushState(data, notused, path){
            window.history.pushState(data, notused, path);
            let promise = Promise.resolve();
            if (this.prev){
                const {components:_components, state, path, name} = this.prev;
                promise = Promise.all(_components.map(item=>{
                    return components[item].fire.destroy();
                }));
            };
            return promise.then(()=>{
                return this.navigate();
            })
        }
        clear(){
            let promise = Promise.resolve();
            // console.log(this.prev);
            if (this.prev && this.prev.prev){
                const {components:_components, state, path, name} = this.prev.prev;

                promise = Promise.all(_components.map(item=>{
                    // console.log(components[item]);
                    if(components[item].fire.destroy){
                        return components[item].fire.destroy();
                    } else {
                        console.error(`there is no destroy handler in "${item}" component`);
                        return Promise.resolve()
                    }
                }));
            };

            return promise;
        }
        pushState(data, notused, path){
            window.history.pushState(data, notused, path);
            let promise = Promise.resolve();
            this.clear();
            return promise.then(()=>{
                return this.navigate();
            })
        }
        static subscribe(fn){
            if(fn && fn.constructor.name == 'Function'){
                hooks.push(fn);
            };
        }
        notify(){
            return Promise.all((false)?[Promise.resolve()]:hooks.map(subscribe=>{
                return subscribe();
            }))
        }
    }
};