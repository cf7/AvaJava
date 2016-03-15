"use strict";
var Type = require('./type.js');

class VariableDeclaration {

  constructor(id, type) {
    this.id = id;
    this.type = type;
  }

  toString() {
    return "(Var :" + this.id.lexeme + " " + this.type + ")";
  };

  analyze(context) {
    context.variableMustNotBeAlreadyDeclared(this.id);
    return context.addVariable(this.id.lexeme, this);
  };

  optimize() {
    return this;
  };

}

VariableDeclaration.ARBITRARY = new VariableDeclaration('<arbitrary>', Type.ARBITRARY);

module.exports = VariableDeclaration;