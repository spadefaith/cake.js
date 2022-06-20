;(function(){
    customElements.define('sub-template',
  class extends HTMLElement {
    constructor() {
      super();
  	}
    connectedCallback(){
        this.replace(this);
    }
    replace(subTemplate){
        let ref = subTemplate.dataset.template;
        let refEl = document.getElementsByName(ref);
        
        
        if (refEl.length > 1){
            console.error(`template with name ${ref} has more than one reference.`)
            return ;
        };
        if (!refEl){
            subTemplate.remove();
            throw new Error(`${ref} is not found!`);

        };
        if (refEl[0]){
            let temp = refEl[0];
            if (temp.constructor.name == "HTMLTemplateElement"){
                temp = temp.content.cloneNode(true).firstElementChild;
                if (!temp) {return;};
                let attrs = subTemplate.attributes;
                for (let a = 0; a < attrs.length ;a++){
                    let attr = attrs[a];
                    if (attr.name != 'data-template'){
                        temp.setAttribute(attr.name, attr.value);
                    };
                };
                // console.log(temp);
                subTemplate.replaceWith(temp);
            } else {
                throw new Error(`${ref} is not referred to a Template Element!`);
            };
        };
    }
});
HTMLTemplateElement.prototype.replaceSubTemplate = function(el){
    let subTemplates = el.getElementsByTagName('sub-template');
    if (subTemplates){
        subTemplates = subTemplates.toArray();
        for (let s = 0; s < subTemplates.length; s++){
            let subTemplate = subTemplates[s];
            customElements.get('sub-template').prototype.replace(subTemplate);
        };
    };
}
HTMLTemplateElement.prototype.collectContent = function(){
    let template = this;
    let cf = null;
    let temp =template.cloneNode(true);
    let fr = document.createDocumentFragment();
    let styles = temp.content.querySelector('style');
    if (styles){
        fr.appendChild(styles);
    }
    let others = [];
    for (let o = 0; o < temp.content.children.length; o++){
        let el = temp.content.children[0];
        this.replaceSubTemplate(el);
        others.push(el);
    }
    cf = {style:fr.children[0], others}
    return cf; 
};
HTMLTemplateElement.prototype.parseStyle = function(style){
    if (!style) return false;
    var styles = style.textContent.trim();
    if (!styles.length) { return;}
    let obj = {};

    let sel = "";
    let splitted = styles.split("}");
    for (let sp = 0; sp < splitted.length; sp++){
        let item = splitted[sp];
        let [sel, style] = item.split("{");
        if(!!sel){
            obj[sel.trim()] = (()=>{
                let n = false;
                let s = "";
                let splitted = style.split("");
                for (let sp = 0; sp < splitted.length; sp++){
                    let item = splitted[sp];
                    if(item == "\n"){
                        n = true;
                    } else if (item == " "){
                        if(n){

                        } else {
                            s += item;
                        };
                    } else {
                        n = false;
                        s += item;
                    };
                };
                return s;
            })();
        };
    };


    return obj;
};

HTMLTemplateElement.prototype.parseHTML = function(others){
    if (others){
        var parent = document.createElement('HTML');
        for (let o = 0; o < others.length; o++){
            let other = others[o];
            parent.append(other);
        };
    };
    return parent || false;
};

HTMLTemplateElement.prototype.getContent = function(isConvert){
    let {style, others} = this.collectContent()
    let styles = this.parseStyle(style);
    let element = this.parseHTML(others);

    
    for (let selector in styles){
        if (styles.hasOwnProperty(selector)){
            // console.log(element.outerHTML)
            let query = element.querySelectorAll(selector);
            let css = styles[selector];
            for (let q= 0; q < query.length; q++){
                let item = query[q];
                // console.log(item, css)
                item.setAttribute('style', css);
                // console.log(item);
            };
        }
    };
    element = (isConvert)?element.children.toArray():element.innerHTML;
    return (element.length == 1)?element[0]:element;
};
})();