"use strict";

var error = require('../error.js');
var VariableDeclaration = require('../entities/variabledeclaration.js');
var BuiltIns = require('../entities/builtins.js');

var AnalysisContext = (function() {
  function AnalysisContext(parent, symbolTable) {
    this.parent = parent;
    this.symbolTable = symbolTable || {};
    this.objectTable = {};
    this.insideFunction = false;
  }

  AnalysisContext.initialContext = function() {
    return new AnalysisContext(null, new BuiltIns().entities);
  };

  AnalysisContext.prototype.createChildContext = function() {
    return new AnalysisContext(this);
  };

  AnalysisContext.prototype.variableMustNotBeAlreadyDeclared = function(token) {
    if (this.symbolTable[token.lexeme]) {
      return error("Variable " + token.lexeme + " already declared", token);
    }
  };

  AnalysisContext.prototype.addVariable = function(name, entity) {
    console.log("inside addVariable");
    console.log("name of variable being added: " + name);
    console.log("entity being added: " + entity);
    return this.symbolTable[name] = entity;
  };

  AnalysisContext.prototype.addObject = function(name, entity) {
    return this.objectTable[name] = entity;
  };

  AnalysisContext.prototype.setInsideFunction = function(bool) {
    this.insideFunction = bool;
  };

  AnalysisContext.prototype.getInsideFunction = function() {
    return this.insideFunction;
  };
  
  AnalysisContext.prototype.setScope = function(fun) {
    console.log("inside AnalysisContext setScope");
    console.log(fun);
    this.symbolTable["scope"] = fun;
  };

  AnalysisContext.prototype.getScope = function() {
    if (this.symbolTable["scope"]) {
      return this.symbolTable["scope"];
    } else {
      return this.parent.getScope();
    }
  };

  AnalysisContext.prototype.assignValue = function(token, value) {
    this.symbolTable[token.lexeme] = value;
  };
  
  AnalysisContext.prototype.lookupVariable = function(token) {
    console.log("inside lookupVariable");
    console.log("Analyze lookupVariable: " + token.lexeme);
    var variable = this.symbolTable[token.lexeme];
    console.log("Variable after lookup: " + variable);
    if (variable) {
      return variable;
    } else if (!this.parent) {
      error("Variable " + token.lexeme + " not found", token);
      return VariableDeclaration.ARBITRARY;
    } else {
      console.log("lookup in parent context");
      return this.parent.lookupVariable(token);
    }
  };

  return AnalysisContext;

})();

exports.initialContext = AnalysisContext.initialContext;