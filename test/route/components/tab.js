Cake.create('tab','#tab',{
    root:'#tab-container',
    handlers:{
        destroy(){
            // console.log('tab is destroyed');
            this.reset();
        },
        isConnected(e){
            // console.log('tab is connected');
            // console.log(e);
        },
    },
    subscribe:{},
});