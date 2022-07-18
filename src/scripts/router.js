const Utils = require('./utils');
const StorageKit = require('./storage')();
const ComponentStorage = require('./storage/components-store');
const RouterStore = new StorageKit({
    child:'object',
    storage:'local',
    name:`_cake_router_cf`,
});
module.exports = function(models, component){

    const hooks = [];
    return class {
        constructor(routes, options){
            this.options = options;
            this.unauthRoute = null;
            this.componentConf = null;
            this.authValidRoute = null;
            this.authConfig = (function(){
                if(!this.options){return;};
                const confAuth = this.options.auth;
                const confComponents = this.options.components;
                // console.log(29, confComponents);
                if(confComponents){
                    this.componentConf = confComponents;
                };
                if(confAuth && confAuth.verify){
                    const verify = confAuth.verify;
                    this.verifyComponent = verify[0];
                    this.verifyComponentHandler = verify[1];
                    this.unauthRoute = confAuth['401'];
                    return confAuth;
                };
                if(confAuth && confAuth.valid){
                    this.authValidRoute = confAuth.valid;
                };
                return null;
            }.bind(this))();
            this.authRedirectRoute = {};//route to redirect back when the token is still valid;
            this.route = this.compile(routes);
            this.prev = null;
            this.components = ComponentStorage;
            this.watch();
            this.persist();
            Object.defineProperty(component.prototype, '$router', {
                configurable:true,
                get:()=>{
                    return {
                        goTo:this.goTo.bind(this),
                        goBack:this.goBack.bind(this),
                        auth:this.auth.bind(this),
                        logout:this.logout.bind(this),
                        login:this.login.bind(this),
                        ...this.prev,
                    };
                },
                set(value){
                    return;
                },
            });
        }
        getComponent(name, path){
            if(this.componentConf && this.componentConf[name]){
                let rerender = this.componentConf[name].rerender;

                if(rerender){
                    name = rerender.includes(path)?name:null;
                };
            };
            return name ? this.components.get(name): null;
        }
        verifyAuth(token){
            return models.$loaded(this.verifyComponent).then(model=>{
                return model.fire[this.verifyComponentHandler](token);
            });
        }
        async authenticate(name){

            /*
                happens when the current page is in the unAuthRoute
                usually the login page,
                when still the token is valid,
                instead of redirect to unAuthRoute
                it will redirect to the route declared per role
                this happens in mobile app, when the app is minimized,
                the path is reset to '/';
            */

            const initialize = (this.unauthRoute == name);
            // const initialize = this.unauthRoute[name];


            if(this.unauthRoute){//has 401;
                try {


                    const config = RouterStore.get('role', true);

                    // console.log(config);

                    const token = config.token;
                    const isverified = await this.verifyAuth(token);
                    
                    if(isverified.status == 0){
                        this.logout();
                    };

                 

                    if(config){
                        if(initialize){
                            const role = config.role;
                            const data = config.data;

                            // console.log(99, this.authRedirectRoute, data, role);

                            const route = this.authRedirectRoute[role];//redirect back to a page;
                            if(route){
                                const name = route.name;
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
        login(cred){
            let role = cred.role;
            let token = cred.token;
            let data = cred.data;
            let created =RouterStore.createOrUpdate('role',{role,token, data});


            return created
        }
        auth(){
            const auth = RouterStore.get('role', true);
            if(!auth){
                // this.logout();
                return {};
            };
            return auth;
        }
        logout(){
            try {
                RouterStore.remove('role');
            } catch(err){};
            this.goTo(this.unauthRoute,{replace:true});
            // sessionStorage.createOrUpdate('history',[]);
        }
        goTo(routeName,config={}){
            try {
                let routes = this.route;
                // let {params={}, replace:isreplace} = config || {};

                let params = config.params || {};
                let isreplace = config.replace;


                let hash = null;
                const raw = Object.entries(routes);

                // console.log(108, routeName,config,isreplace, raw);

                if(!routeName){
                    const auth = RouterStore.get('role', true);
                    const role = auth.role;
                    const route = this.authRedirectRoute[role];//redirect back to a page;
                    if(route){
                        routeName = route.name;
                    };
                };

                if(!routeName){
                    throw new Error(`provide routename`);
                };

                for (let i = 0; i < raw.length; i++){
                    // const [route, config] = raw[i];
                    const route = raw[i][0];
                    const config = raw[i][1];
                    // const {name} = config;
                    const name = config.name;


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
                    // console.log(236, e);
                    this.parse();
                    this.notify().then(()=>{
                        console.log('notified');
                        return this.clear().then(()=>{
                            console.log('cleared');
                            return this.navigate().then(()=>{
                                console.log('navigated');
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
                // console.log(281, config);
                key = String(key);
                const len = key.length;
                let regex = key;
                if(['404'].includes(key)){
                    //http errors;
                    const callback = routes[key];//function
                    
                    config = {callback, name:key};
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
                // console.log(key, con[key],config);


                if(this.authValidRoute){
                    Utils.each(this.authValidRoute, function(obj, i){
                        let key = obj.key;
                        let value = obj.value;

                        if(value == config.name){
                            if(this.authRedirectRoute[value]){
                                throw new Error(`auth ${item} is found in other route`);
                            } else {
                                this.authRedirectRoute[value] = config;
                            };
                        };
                    });

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
            // const {search, pathname:path} = url;

            let search = url.search;
            let path = url.pathname;

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

                const regex = route.regex;
                const components = route.components;
                const params = route.params;
                const name = route.name;
                const auth = route.auth;
                const overlay = route.overlay;
                const display = route.display;
                const onrender = route.onrender;

                if (params){
                    let _path = String(path);
                    _path = _path.slice(1);
                    _path = _path.split('/');
                    Object.entries(params).forEach(param=>{
                        const key = param[0];
                        const value = param[1];

                        if (_path[value]){
                            state[key] = _path[value];
                        };
                    });
                };
                const test = regex.test(path);
                // console.log(test, path, regex);
                if (test){
                    routeName = name;
                    
                    if(auth == true){
                        this.authenticate(routeName);
                    };

                    this.prev = {components, state,path, name, prev:this.prev, overlay, display, onrender};
                    has = true;
                    break;
                };
            };

            console.log(430, has, hash);

            if(!has){
                // console.log(464, this.route, this.options);
                // console.log(465, this.route['404']);
                if(this.route['404']){
                    let path = this.route['404'].callback();
                    // const {origin, pathname} = location;

                    // console.log(470,path);

                    let origin = location.origin;
                    let pathname = location.pathname;

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
            // console.log('here', this.prev);
            if (this.prev){
                // const {components, state, path, name, overlay, onrender={}} = this.prev;

                const components = this.prev.components;
                const state = this.prev.state;
                const path = this.prev.path;
                const name = this.prev.name;
                const overlay = this.prev.overlay;
                const onrender = this.prev.onrender || {};


                // if(overlay){
                //     storage.create(name);
                // };


                // console.log(425, components);

                try {

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
                                        i += 1;
                                        let componentName = component;
                                        // component = this.components[component];
                                        
                                        let isunload = this.getComponent(component,path);
                                        component = this.components.get(component);

                                        if(component){
                                            if(component.isConnected && !isunload){
                                                if(component.fire.softReload){
                                                    component.fire.softReload();
                                                    component.await.softReload && component.await.softReload.then(()=>{
                                                        recur();
                                                    });
                                                } else {
                                                    recur();
                                                };
                                            } else {
                                                component.render({emit:{route:this.prev},...(onrender[componentName] || {})}).then(()=>{
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
                                            };
                                        }
                                        


                                        // if(component){

                                        // } else {
                                        //     recur();
                                        // }

                                        
                                        
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
            console.log(path);
            window.history.pushState(data, notused, path);
            let promise = Promise.resolve();
            if (this.prev){
                // const {components:_components, state, path, name} = this.prev;

                const _components = this.prev.components;
                const state = this.prev.state;
                const path = this.prev.path;
                const name = this.prev.name;

                promise = new Promise((res, rej)=>{
                    const l = components.length;
                    let i = 0;
                    if(l){
                        const recur = async ()=>{
                            let component = components[i];
                            if(components.length > i){
                                // component = this.components[component];
                                component = this.getComponent(component,path);

                                
                                if(component){
                                    component.fire.destroy();
                                    component.await.destroy.then(()=>{
                                        return recur();
                                    });
                                } else {
                                    await recur();
                                }
                            } else {
                                // rej(`${component} is not found`);
                                res()
                            };
                            
                            i += 1;
                        };
                        recur();
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
            
            

            const overlay = this.prev && this.prev.overlay || undefined;
            //if overlay prevent in detroying current rendered component;
            if(overlay){
                return promise;
            };

            // console.log('has cleared?', overlay);

            const recur = async function(index, componentNames, sourceComponents, callback){
                let component = componentNames[index];
                let componentName = component;
                let self = recur;               
                try {

                    if(componentNames.length > index){
                        index += 1;
                        // component = sourceComponents[component];

                        component = this.getComponent(component,this.prev.path);
               
                        

                        if(component){
                            if(!component.fire.destroy){
                                throw new Error(`${componentName} has no destroy handler!`);
                            };
    
                            component.fire.destroy();
                            component.await.destroy.then(()=>{
                                return self(index, componentNames, sourceComponents, callback);
                            });
                        } else {
                            await self(index, componentNames, sourceComponents, callback);
                        };

                    } else {
                        // rej(`${component} is not found`);
                        callback()
                    };
                    
                } catch(err){
                    throw (err);
                }
            }.bind(this);

            // console.log(624, this.components);

            if (this.prev && this.prev.prev){
                // const {components, state, path, name, overlay} = this.prev.prev;
                let components = this.prev.prev.components;
                let state = this.prev.prev.state;
                let path = this.prev.prev.path;
                let name = this.prev.prev.name;
                let overlay = this.prev.prev.overlay;
                let destroyPromise = Promise.resolve();
                // const components = this.prev.components;

                
                if(overlay){
                    destroyPromise = new Promise((res, rej)=>{
                        
                        const l = components.length;
                        
                        let i = 0;
                        if(l){
                            recur(i, components, this.components, res);
                        } else {
                            res();
                        };
                    });
                };

                promise = new Promise((res, rej)=>{
                    
                    const l = components.length;
                    // console.log(644, components, l);
                    let i = 0;
                    if(l){
                        recur(i, components, this.components, res);
                    } else {
                        res();
                    };
                });
                return destroyPromise.then(()=>{
                    return promise;
                });
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