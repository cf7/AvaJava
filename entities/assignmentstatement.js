"use strict";

var VariableReference = require('./variablereference');

var AssignmentStatement = (function() {
  function AssignmentStatement(op, target, source) {
    this.operator = op;
    this.target = target;
    this.source = source;
  }

  AssignmentStatement.prototype.getToken = function() {
    return this.operator;
  };
  AssignmentStatement.prototype.toString = function() {
    return "( " + this.operator.lexeme + " " + this.target + this.source + " )";
  };

  AssignmentStatement.prototype.analyze = function(context) {
    console.log("+++++ inside AssignmentStatement analyze +++++");

    this.target.analyze(context);
    this.source.analyze(context);

    return this;
  };

  AssignmentStatement.prototype.optimize = function() {
    console.log("inside AssignmentStatement optimize");
    this.target = this.target.optimize();
    this.source = this.source.optimize();
    if (this.source instanceof VariableReference && this.target.referent === this.source.referent) {
      console.log("leaving null AssignmentStatement optimize");
      return null;
    }
    console.log("leaving AssignmentStatement optimize");
    return this;
  };

  return AssignmentStatement;

})();

module.exports = AssignmentStatement;
