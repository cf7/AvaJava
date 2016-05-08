
var error = require('../error.js');
var Type = require('./type.js');

var VariableReference = (function() {
  function VariableReference(token) {
    console.log("varref token: " + token.lexeme);
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
    console.log("inside VariableReference analyzer");
    this.referent = context.lookupVariable(this.token);
    // this is returning TypeVariableDeclaration, which is not
    // referring to anything
    // because even though param was passed in syntactically
    // was not passed in semantically
    // console.log("REFERENT: " + this.referent.constructor);
    if (this.referent) {
      // every declared variable needs to have an exp, and that exp must have a type
      // including function parameters
      if (!this.referent.exp) {
        return error("Variable is undefined", this.referent);
      // if the referent (likely a VarDecl) has an exp,
      // then analyze its exp
      // make sure variable is not undefined!!!!
      } else {
        return this.type = this.referent.type;
      }
    } else {
      console.log("should be an error");
      return error("Variable has not been declared", this);
    }
  };

  VariableReference.prototype.optimize = function() {
    return this;
  };

  return VariableReference;

})();

module.exports = VariableReference;