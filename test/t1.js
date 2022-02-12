const Header = tag('h1', {
    text:'Hello World',
    event:{
        click:['headerClick'],
    },

});

const Template = [
    {
        header:{
            h1:{
                text:'Hello World',
                event:{
                    click:'headerClicked'
                },
                child:[
                    {
                        For:{

                            div:{
                                Switch:{
                                    condition:'name',
                                    case:{
                                        james:createElement('div',{name:'james'}, {If:{}}),
                                        carlo:createElement('div',{name:'carlo'}),
                                    }, 
                                },
                            }
                        }
                    }
                ]
            }
        }
    },
    {
        body:{

        }
    }
]



class El{
    constructor(){
        this.fragment = document.createDocumentFragment();
        this.id = 0;
    }
    create(tag, attrib){
        tag = document.createElement(tag);
        for (let key in attrib){
            tag.setAttribute(key, attrib[key]);
        };
        if (this.id == 0){

        }
    }
}

function createElement(tag, attrib, callback){
    tag = document.createElement(tag);
    for (let key in attrib){
        tag.setAttribute(key, attrib[key]);
    };
    callback(el)
};


