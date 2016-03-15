// baseline code from Iki
"use strict";
var initialContext = require('../analyzer/analyzer.js').initialContext;

class Program {

  constructor(block) {
    this.block = block;
  }

  // the toString in each entity outputs the abstract syntax tree
  toString() {
    return "(Program " + this.block + ")";
  };

  analyze() {
    return this.block.analyze(initialContext());
  };

  optimize() {
    this.block = this.block.optimize();
    return this;
  };

}

module.exports = Program;