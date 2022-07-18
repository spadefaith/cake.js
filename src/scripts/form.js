module.exports =  function (component){
    // let component = this;
    // console.log(component);
    // if (!component.await.$form){
    //     component.await.$form = {};
    // }


    class Options{
        constructor(type){
            this.type = type;
            this.storage = {};
        }
        store(formControl,data){
            this.storage[formControl] = data;
        }
        get options(){
            if(this.type == 'select' || this.type == 'virtual'){
                let a = {};
                for (let key in this.storage){
                    let val = this.storage[key];
                    a[key] = val.options;
                };
                return a;
            };
            return false;
        }
        get value(){
            if(this.type == 'input'){
                let a = "";
                for (let key in this.storage){
                    let val = this.storage[key];
                    a = val.options[0];
                };
                return a;
            };
            return false;
        }

        get query(){
            let a = {};
            for (let key in this.storage){
                let val = this.storage[key];
                a = val.query[0] || null;
            };
            return a;
        }

        get has(){
            let a = "";
            for (let key in this.storage){
                let val = this.storage[key];
                a = val.query[0] || null;
            };
            return a;
        }
    };

    const form = {};

    form.options = (obj)=>{
        // console.log(9, obj);
        // let {options, params} = obj;
        let options = obj.options;
        let params = obj.params;
        
        if (!options) { options = [] };

        // console.log(33, params);
        let isgroup = options.length > 1;

        let prom = Promise.all(options.map(item=>{
            // let {control, field, tbl, src, schema, type} = item;

            let control = item.control;
            let field = item.field;
            let tbl = item.tbl;
            let src = item.src;
            let schema = item.schema;
            let type = item.type;

            // console.log(schema)
            // console.log(15, item);

            // console.log(40,src, {tbl, field, params});
            // console.trace();
            return component.fire(src, {tbl, field, params}).then((opts)=>{
                // console.log(18, opts);
            

                opts = opts || [];
                item.query = opts;
                // console.log(18, opts);
                opts = opts.map(item=>{
                    // console.log(18, item);
                    return schema(item);
                });

                if(type != 'input'){
                    /**appending empty option */
                    let scheme = schema({});
                    for (let key in scheme){
                        if (scheme.hasOwnProperty(key)){
                            scheme[key] = "";
                        };
                    };
                    opts.unshift(scheme);
                }
                /**end */

                // console.log(opts);
                item.options = opts;
                return item;
            }).then((iter)=>{
                // console.log(51, iter);
                // let {type, control} = iter;
                let type = iter.type;
                let control = iter.control;
                if (!type){
                    type = 'others';
                };
                const cls = new Options(type);
                if (isgroup){
                    let o = {};
                    if (!o[control]){
                        o[control] = cls;
                        o[control].store(control, iter);
                    };
                    return o;
                } else {
                    cls.store(control, iter);
                    return cls;
                };
            });
        })).then(res=>{
            if(isgroup){
                return res.reduce((accu, iter)=>{
                    Object.assign(accu, iter);
                    return accu;
                },{});
            } else {
                return res[0];
            }
        }).catch(err=>{
            console.error(err);
        });

        // component.await.$form.options = prom;
        return prom;
    };
    form.plot = (config)=>{
        // let {data, container} = config;

        let data = config.data;
        let container = config.container;

        if (!data && !container) { return };
        const query = (root, selector, callback)=>{
            if (!root){
                console.info('root is not provided!');    
                return ;
            }
            const els = root.querySelectorAll(`${selector}`);
            const len = els.length;
            if (!len){
                callback(null, data);
                return;//exit;
            }
            for (let e = 0; e < len; e++){
                let el = els[e];
                let name = el.name;
                let value = data[name];

                let r = callback(el, value, e);
                if (r == 'break'){break; };
                if (r == 'continue'){ continue; };
            };
        };



        query(container, 'INPUT.input', function(el, value){
            if (value != undefined){
                if (el.type == 'date'){
                    value = new Date(value) == 'Invalid Date'?"":new Date(value).toJSON().split('T')[0];
                    el.value = value;
                } else {
                    el.value = value;
                }
            };
        })

        setTimeout(()=>{
            query(container, 'SELECT.input:not(.cake-template)', function(select, value){
                // console.log(select);
                query(select, 'OPTION:not(.cake-template)', function(option, _value, index){
                    // console.log(option)
                    if (option){
                        if (option.value == value){
                            select.selectedIndex = index;
                            return 'break';
                        };
                    } else {
                        // console.trace();
                        // console.log(_value);
                        console.log(option, _value, 'provide schema')
                        //provide schema
                    }
                });
            });
        }, 500);

        return Promise.resolve();

    };

    return form;
};