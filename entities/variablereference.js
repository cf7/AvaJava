
var VariableReference = (function() {
  function VariableReference(token) {
    console.log("varref token: " + token.lexeme);
    this.token = token;
  }

  VariableReference.prototype.getToken = function() {
    return this.token;
  };
  
  VariableReference.prototype.toString = function() {
    return '( ' + this.token.lexeme + ' )';
  };

  VariableReference.prototype.analyze = function(context) {
    this.referent = context.lookupVariable(this.token);
    console.log("REFERENT: " + this.referent.constructor);
    return this.type = this.referent.type;
  };

  // VariableReference.prototype.optimize = function() {
  //   return this;
  // };

  return VariableReference;

})();

module.exports = VariableReference;