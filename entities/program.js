// baseline code from Iki
var initialContext = require('../analyzer/analyzer.js').initialContext;

class Program {

  constructor(block) {
    this.block = block;
  }

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

module.exports = function () {
  return Program;
}