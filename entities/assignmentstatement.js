"use strict";

var VariableReference = require('./variablereference.js');

class AssignmentStatement {
 constructor(target, source) {
    this.target = target;
    this.source = source;
  }

 toString() {
    return "(= " + this.target + " " + this.source + ")";
  };

  analyze(context) {
    this.target.analyze(context);
    this.source.analyze(context);
    return this.source.type.mustBeCompatibleWith(this.target.type, 'Type mismatch in assignment');
  };

  optimize() {
    this.target = this.target.optimize();
    this.source = this.source.optimize();
    if (this.source instanceof VariableReference && this.target.referent === this.source.referent) {
      null;
    }
    return this;
  };

}

module.exports = AssignmentStatement;