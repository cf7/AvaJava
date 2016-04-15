"use strict";

var Type = require('./type.js');

var VariableDeclaration = (function() {
  function VariableDeclaration(id, exp) { // , type) {
    // this.exp causing a lot of problems
    // consider having a "generic" type or class
    // for undeclared variables
    console.log("VariableDeclaration constructor: " + id.lexeme);
    this.id = id;
    this.exp = exp; // keeping type contained within exp to facilitate type inference
    this.type = this.exp ? (this.exp.type ? this.exp.type : Type.ARBITRARY) : (Type.ARBITRARY);
   
    // this needs to receive a type from parser
    // implement type inference, literals parsed with types,
    // function's type-signatures determined by their args and return types
  }

  VariableDeclaration.prototype.getExp = function() {
    return this.exp;
  };
  
  VariableDeclaration.prototype.toString = function() {
    if (this.exp) {
      return "(var " + this.id.lexeme + " " + this.exp + " )"; // this.type + ")";
    } else {
      return "(var " + this.id.lexeme + " )";
    }
  };

  VariableDeclaration.prototype.analyze = function(context) {
    console.log("--------inside varDecl analyze-------");
    // need to account for if variable is a single number
    // a list of expressions
    // or a function

    // Type inference in here!!!
    // Swift: once type is inferred, type cannot change
    var results = [];
    if (this.exp) {
      if (this.exp instanceof Array) {
          console.log("........INSIDE THIS.EXP...... " + this.exp.length);
          for (var i = 0; i < this.exp.length; i++) {
            results.push(this.exp[i].analyze(context));
          }
      } else {
        results.push(this.exp.analyze(context));
      }
    }
    // need to analyze exps before adding variable to context
    // so that types have been inferred before they are stored
    context.variableMustNotBeAlreadyDeclared(this.id);
    context.addVariable(this.id.lexeme, this); // adds var to symbol table and returns symbol table
    
    return results;
  };

  VariableDeclaration.prototype.optimize = function() {
    return this;
  };

  return VariableDeclaration;

})();

VariableDeclaration.ARBITRARY = new VariableDeclaration('<arbitrary>', Type.ARBITRARY);

module.exports = VariableDeclaration;