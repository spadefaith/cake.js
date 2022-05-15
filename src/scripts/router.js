const Utils = require('./utils');
const StorageKit = require('./storage')();
const authCredential = new StorageKit({
    child:'object',
    storage:'local',
    name:`_cake_router_cf`,
});
module.exports = function(components, component){

    const hooks = [];
    return class {
        constructor(routes, options){
            
            this.unauthRoute = options && options['401'] || null;

            this.authRoute = {};
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
                        goTo:this.goTo.bind(this),
                        goBack:this.goBack.bind(this),
                        auth:this.auth.bind(this),
                        logout:this.logout.bind(this),
                        ...this.prev,
                    };
                },
                set(value){
                    return;
                },
            });

            // this.authenticate();

        }
        authenticate(initialize){
            if(this.unauthRoute){
                try {
                    const config = authCredential.get('role', true);
                    // console.log(52, this.authRoute);
                    // console.log(53, config);
                    if(config){
                        if(initialize){
                            const {role, data} = config;
                            const route = this.authRoute[role];
                            // console.log(route);
                            if(route){
                                const {name} = route;
                                this.goTo(name);
                            };
                        } else {
    
                        }
                    } else {
                        if(initialize){

                        } else {
                            this.logout();
                        }
                    };
                } catch(err){
                    if(initialize){
                    } else {
                        this.logout();

                    }
                };
            };
            
        }
        auth(cred){
            if(cred){
                let {role,token, data} = cred;
                authCredential.createOrUpdate('role',{role,token, data});
            } else {
                const cred = authCredential.get('role', true);
                if(cred){
                    let o = {};

                    if(cred){
                        o = cred;
                    }

                    if(o.data){
                        o = o.data;
                    };
                    if(o.user){
                        o = o.user;
                    };
                    o.token = cred.token;
                    return o;
                } else {
                    return "token";
                }
            };
        }
        logout(){
            try {
                authCredential.remove('role');
            } catch(err){};
            this.goTo(this.unauthRoute,{replace:true});
            // sessionStorage.createOrUpdate('history',[]);
        }
        goTo(routeName,config){
            try {
                let routes = this.route;
                let {params={}, replace:isreplace} = config || {};
                let hash = null;
                const raw = Object.entries(routes);

                // console.log(108, routeName,config,isreplace, raw);


                for (let i = 0; i < raw.length; i++){
                    const [route, config] = raw[i];
                    const {name} = config;
                    if(name == routeName){
                        hash = route;
                        break;
                    };
                };
                if(!hash){
                    throw new Error(`${routeName} is not found in routes`);
                };

                // console.log(131, hash);

                if(hash == '/'){
                    if(isreplace){
                        location.replace(`${location.origin}${location.pathname}`);
                    } else {
                        window.location = `${location.origin}${location.pathname}`;
                    }
                    return;
                };

                let path;
                hash = hash.slice(1);
                if(params.toString().includes('Object')){
                    let p = '';
                    for (let key in params){
                        p += `${key}=${params[key]}&`;
                    };
                    params = p;
                    path =`!/${hash}?${params}`;
                } else {

                    path = `!/${hash}`;
                }
                if(hash == '/'){
                    path = "";
                };

                // console.log(159, path);

                // console.log(123, isreplace);


                if(isreplace){
                    let loc = `${location.origin}${location.pathname}#${path}`;
                    // console.log(180,loc, !Utils.isFirefox());
                    // console.log(!Utils.isFirefox());
                    Utils.isChrome() && !Utils.isFirefox() && history.replaceState(undefined, undefined, loc);
                    location.replace(loc);
                } else {
                    // console.log(128,path);

                    var a = document.createElement('a');
                    a.href = `#${path}`;
                    Utils.isChrome() && !Utils.isFirefox() && history.pushState(undefined, undefined, a.href);
                    a.click();
                    // console.log(171,a.href);

                }
            } catch(err){
                console.log(err);
            }
        }
        goBack(){
            
            // return storage.getAll().then(r=>{
            //     console.log(94, r);
            //     const l = r.length;
            //     if(l && l > 1){
            //         const prev = r[l-2];
            //         if(prev){
            //             this.goTo(prev);
            //         }
            //     };
            // });
            return new Promise((res, rej)=>{
                // const prev = this.history[this.history.length-2];
            
                // if(prev){
                //     this.goTo(prev, {replace:true});
                // };
                // console.log('hit back');
                // console.log(prev);
                window.history.back();
                res();
            });
        }
        persist(){
            if (!document.hasRouterPersist){
                let event = 'DOMContentLoaded';
                if('deviceready' in document){
                    event = 'deviceready';
                };
                document.addEventListener(event, (e)=>{
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
                // console.log('set pop state');
                window.addEventListener('popstate',(e)=>{
                    // console.log(111, e);
                    this.parse();
                    this.notify().then(()=>{
                        // console.log('notified');
                        return this.clear().then(()=>{
                            // console.log('cleared');
                            return this.navigate().then(()=>{
                                // console.log('navigated');
                            });
                        });
                    })
                });

                window.hasRouterPop = true;
            } else {
                this.parse();
            };
        }
        compile(routes){
            // console.log(167, this);
            let con = {};
            for (let key in routes){
                let config = routes[key];
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
                        ...config,
                    }
                } else {
                    con[key] = {
                        regex:new RegExp(regex.join("")),
                        ...config,
                    }
                };

                let {auth} = config;

                // console.log(217,auth);
                // console.log(218,this);

                if(auth){
                    if(this.authRoute[auth]){
                        throw new Error(`auth ${auth} is found in other route`);
                    } else {
                        this.authRoute[auth] = config;
                    };
                };

            };
            con.length = Object.keys(routes).length;
            con.keys = Object.keys(routes);

            // console.log(con);
            return con;
        }
        parse(){
            // console.log(330,this.route);
            let hash = window.location.hash, scheme, routeName;
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

                const {regex, components, params, name, overlay,display} = route;
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

                // console.log(160, test, route);
                
                if (test){
                    routeName = name;
                    
                    if(this.unauthRoute != name){
                        this.authenticate();
                    } else {
                        this.authenticate(true);
                    };

                    // console.log(381, route);

                    this.prev = {components, state,path, name, prev:this.prev, overlay, display};
                    has = true;
                    break;
                };
            };


            if(!has){
                if(this.route['404']){
                    let path = this.route['404'].callback();
                    const {origin, pathname} = location;
                    if(this.route[path]){
                        // console.log(1);
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
            } else {
                // return await this.log(routeName);
            }
        }
        navigate(ispersist){
            if (this.prev){
                const {components, state, path, name, overlay} = this.prev;
                // if(overlay){
                //     storage.create(name);
                // };
                try {
                    // console.log(this.prev);
                    // console.log(hooks);
                    if(components.length){
                        // return Promise.all(components.map(item=>{                        
                        //     return this.components[item].render({emit:{route:this.prev}});
                        // }));
                        return new Promise((res, rej)=>{
                            const l = components.length;
                            let i = 0;
                            if(l){
                                const recur = ()=>{
                                    let component = components[i];
                                    if(components.length > i){
                                        component = this.components[component];
                                        component.render({emit:{route:this.prev}}).then(()=>{
                                            if(component.await.isConnected){
                                                component.await.isConnected && component.await.isConnected.then(()=>{
                                                    recur();
                                                });
                                            } else {
                                                recur();
                                            }
                                        }).catch(err=>{
                                            throw err;
                                        });
    
                                        i += 1;
                                    } else {
                                        res()
                                        // rej(`${component} is not found`);
                                    };
                                    
                                };recur();
                            } else {
                                res();
                            };
                        });
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

                promise = new Promise((res, rej)=>{
                    const l = components.length;
                    let i = 0;
                    if(l){
                        const recur = ()=>{
                            let component = components[i];
                            if(components.length > i){
                                component = this.components[component];
                                component.fire.destroy();
                                component.await.destroy.then(()=>{
                                    recur();
                                });
                            } else {
                                // rej(`${component} is not found`);
                                res()
                            };
                            
                            i += 1;
                        };recur();
                    } else {
                        res();
                    };
                });

                // promise = Promise.all(_components.map(item=>{
                //     return components[item].fire.destroy();
                // }));
            };
            return promise.then(()=>{
                return this.navigate();
            })
        }
        clear(){
            let promise = Promise.resolve();
            
            const {overlay} = this.prev || {};
            //if overlay prevent in detroying current rendered component;
            if(overlay){
                return promise;
            };

            // console.log('has cleared?', overlay);

            if (this.prev && this.prev.prev){
                const {components, state, path, name} = this.prev.prev;

                // console.log(530, components);

                promise = new Promise((res, rej)=>{
                    const l = components.length;
                    let i = 0;
                    if(l){
                        const recur = ()=>{
                            let component = components[i];
                            if(components.length > i){
                                component = this.components[component];
                                component.fire.destroy();
                                component.await.destroy.then(()=>{
                                    recur();
                                });
                            } else {
                                // rej(`${component} is not found`);
                                res()
                            };
                            
                            i += 1;
                        };recur();
                    } else {
                        res();
                    };
                });
                return promise;
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