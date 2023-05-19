
import {Observer, Keep} from '@cake/observer';

const App = new Cake({
    name:'Test App',
    observer: new Observer({}),
    storage: new Keep({type:'session'}),
});



const {Component, Model, Form, Observer, Storage, Define} = App;

Component.create('Button','#Button',{
    root:'.button-container',
    handlers:()=>Observer.handlers(()=>{


        return {
            
        }
    }),
    subscribe:()=>Observer.subscribe(()=>{
        
        return {
            destroy:{
                components:['Modal'],
                handler(e){
                    this.fire.destroy();
                }
            }
        }
    })
});