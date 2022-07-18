const UTILS = require('./utils');
const self = window || {};
module.exports = {
  Set:function(data){
    if(self.Set){
      return new Set(data);
    } else {
      return UTILS.unique(data);
    };
  }
}