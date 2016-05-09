
var error = require('../error.js');
var Type = require('./type.js');

var VariableReference = (function() {
  function VariableReference(token) {
    this.token = token;
    this.referent = {};
  }

  VariableReference.prototype.getToken = function() {
    return this.token;
  };
  
  VariableReference.prototype.toString = function() {
    return '( ' + this.token.lexeme + ' )';
  };

  VariableReference.prototype.analyze = function(context) {
    console.log("inside VariableReference analyze");
    this.referent = context.lookupVariable(this.token);
    if (this.referent) {
      if (!this.referent.exp) {
        return error("Variable is undefined", this.referent);
      } else {
        return this.type = this.referent.type;
      }
    } else {
      return error("Variable has not been declared", this);
    }
  };

  VariableReference.prototype.optimize = function() {
    return this;
  };

  return VariableReference;

})();

module.exports = VariableReference;