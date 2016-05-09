"use strict";

var Type = require('./type.js');
var error = require('../error.js');

var VariableDeclaration = (function() {
  function VariableDeclaration(id, exp) {
    this.id = id;
    this.exp = exp;
    this.type = this.exp ? (this.exp.type ? this.exp.type : Type.ARBITRARY) : (Type.ARBITRARY);
  }

  VariableDeclaration.prototype.getToken = function() {
    return this.id;
  };
  
  VariableDeclaration.prototype.getExp = function() {
    return this.exp;
  };
  
  VariableDeclaration.prototype.toString = function() {
    if (this.exp) {
      return "(var " + this.id.lexeme + " " + this.exp + " )";
    } else {
      return "(var " + this.id.lexeme + " )";
    }
  };

  VariableDeclaration.prototype.analyze = function(context) {
    context.variableMustNotAlreadyBeDeclared(this.id);
    context.addVariable(this.id.lexeme, this);
    var results = [];
    if (this.exp) {
      if (this.exp instanceof Array) {
          console.log(this.exp.length);
          for (var i = 0; i < this.exp.length; i++) {
            results.push(this.exp[i].analyze(context));
          }
      } else {
        results.push(this.exp.analyze(context));
      }
    }
    return results;
  };

  VariableDeclaration.prototype.optimize = function() {
    this.exp = this.exp.optimize();
    return this;
  };

  return VariableDeclaration;

})();

VariableDeclaration.ARBITRARY = new VariableDeclaration('<arbitrary>', Type.ARBITRARY);

module.exports = VariableDeclaration;