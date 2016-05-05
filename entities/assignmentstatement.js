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
    // implement destructuring and pattern matching here!!!

    this.target.analyze(context);
    this.source.analyze(context);

    // console.log("target and source");
    // console.log(this.target);
    // console.log(this.source);
    
    // if (this.source instanceof VariableReference) {
    //   context.assignValue(this.target.token, this.source.referent);
    // } else {
    //   context.assignValue(this.target.token, this.source);
    // }
    //this.target = context.lookupVariable(this.target.token);
    // console.log("looking up variable");
    // console.log(" = = = = = ")
    // console.log(this.target);
    // console.log("should be different from what is above");
    // console.log(context.lookupVariable(this.target.token));
    // want type to be changeable later on
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
