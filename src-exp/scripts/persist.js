module.exports = function(dependency){
    const StorageKit = dependency.StorageKit;

    return class {
        constructor(){
            this.storage = new StorageKit({
                child:'array',
                storage:'session',
                name:'_cake_persistent',
            });
        }
        listen(components){
            let event = 'DOMContentLoaded';
            if('deviceready' in document){
                event = 'deviceready';
            };
            window.addEventListener(event, (e)=>{
                setTimeout(()=>{
                    this.storage.getAll().then(result=>{
                        if (result && !result.length) return;
                        for (let r = 0; r < result.length; r++){
                            let item = result[r];
                            let component = components[item];
                            component.isConnected = false;
    
    
                            
                            if (component){
                                // console.log(component, !component.isConnected);
                                !component.isConnected && component.render.bind(component)();
                            } else {
                                console.error(`component ${component} is not found!`)
                            }
                        };
                    })
                })
            });
        }
        append(name){
            this.storage.create(name);
        }
        remove(name){
            this.storage.remove(name);
        }
    };
}