
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
    // if the referent (likely a VarDecl) has an exp,
    // then analyze its exp
    console.log("REFERENT: " + this.referent.exp.type);
    return this.type = this.referent.exp.type;
  };

  // VariableReference.prototype.optimize = function() {
  //   return this;
  // };

  return VariableReference;

})();

module.exports = VariableReference;