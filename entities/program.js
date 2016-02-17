class Program {

  constructor(block) {
    this.block = block;
  }

  var toString = function() {
    return "(Program " + this.block + ")";
  };

  var analyze = function() {
    return this.block.analyze(initialContext());
  };

  var optimize = function() {
    this.block = this.block.optimize();
    return this;
  };

}

module.exports = function () {
  return Program;
}