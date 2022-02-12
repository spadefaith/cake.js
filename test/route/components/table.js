Cake.create('table','#table', {
    root:'#table-container',
    handlers:{
        destroy(){
            // console.log('table is destroyed');
            this.reset();
        },
        isConnected(e){
            // console.log('table is connected');
            // console.log(e);
        },
    },
    subscribe:{},
});