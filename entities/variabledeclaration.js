"use strict";

var Type = require('./type.js');

var VariableDeclaration = (function() {
  function VariableDeclaration(id, exp) {//, type) {
    this.id = id;
    this.exp = exp;
    // this.type = type;
  }

  VariableDeclaration.prototype.toString = function() {
    return "(var " + this.id.lexeme + " " + this.exp + " )"; // this.type + ")";
  };

  VariableDeclaration.prototype.analyze = function(context) {
    context.variableMustNotBeAlreadyDeclared(this.id);
    context.addVariable(this.id.lexeme, this); // adds var to symbol table and returns symbol table
    console.log("--------inside varDecl analyze-------");
    return this.exp.analyze(context);
  };

  VariableDeclaration.prototype.optimize = function() {
    return this;
  };

  return VariableDeclaration;

})();

VariableDeclaration.ARBITRARY = new VariableDeclaration('<arbitrary>') //, Type.ARBITRARY);

module.exports = VariableDeclaration;