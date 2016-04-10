"use strict";

var Type = require('./type.js');

var VariableDeclaration = (function() {
  function VariableDeclaration(id, exp) {//, type) {
    this.id = id;
    this.exp = exp;
    // this.type = type;
  }

  VariableDeclaration.prototype.getExp = function() {
    return this.exp;
  };
  
  VariableDeclaration.prototype.toString = function() {
    return "(var " + this.id.lexeme + " " + this.exp + " )"; // this.type + ")";
  };

  VariableDeclaration.prototype.analyze = function(context) {
    // need to account for if variable is a single number
    // a list of expressions
    // or a function
    context.variableMustNotBeAlreadyDeclared(this.id);
    context.addVariable(this.id.lexeme, this); // adds var to symbol table and returns symbol table
    console.log("--------inside varDecl analyze-------");
    console.log("current variable: " + this.exp);
    var results = [];
    if (this.exp) {
        for (var i = 0; i < this.exp.length; i++) {
          results.push(this.exp[i].analyze(context));
        }
    }
    return results;
  };

  VariableDeclaration.prototype.optimize = function() {
    return this;
  };

  return VariableDeclaration;

})();

VariableDeclaration.ARBITRARY = new VariableDeclaration('<arbitrary>') //, Type.ARBITRARY);

module.exports = VariableDeclaration;