"use strict";

var VariableReference;

class VariableReference {
  constructor(token) {
    this.token = token;
  }

  toString() {
    return this.token.lexeme;
  };

  analyze(context) {
    this.referent = context.lookupVariable(this.token);
    return this.type = this.referent.type;
  };

  optimize() {
    return this;
  };


}

module.exports = VariableReference;