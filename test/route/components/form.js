Cake.create('table-filter1','#table-filter1',{
    root:'#app',
    role:'form',
    data(){
        this.filterDate = 'all';
        this.filterCenter = 'all';

        this.filter = {};
    },
    router(){
        this.data.currentTable = this.$router.name;
    },
    handlers:{
        destroy(e){
            this.data.filter = {};
            this.reset();
        },
        async isConnected(e){
            let searchFields = [];
            searchFields.push({field: 'name', title: 'Name',  type:'text', search:'input'});
            searchFields.push({field: 'loan', title: 'Loan',  type:'text', search:'select-update'});
            searchFields.push({field: 'trans_date', title: 'Date',  type:'text', search:'select-update'});
            searchFields.unshift({field: 'center_id', title: 'Center',  type:'text', search:'select-update-center_id'});

            searchFields.forEach(item=>{
                this.data.filter[item.field] = 'all';
            });

            this.$scope.set('filterControls', searchFields).then(()=>{
                // console.log(searchFields);

            });

            setTimeout(()=>{
                this.$scope.set('is-disabled', true);
            },1000);
            



        },
        
    },
    subscribe:{
        app:{
            isConnected(){
                console.log('called isConnected')
                this.render();
            }
        }
    }
});