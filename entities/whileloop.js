// baseline Iki code

var BooleanLiteral = require('./booleanliteral');

var WhileLoop = (function() {
  function WhileLoop(condition, body) {
    this.condition = condition;
    this.body = body;
  }

  WhileLoop.prototype.toString = function() {
    return "(While " + this.condition + " " + this.body + ")";
  };

  WhileLoop.prototype.analyze = function(context) {
    this.condition.analyze(context);
    this.condition.type.mustBeBoolean('Condition in "while" statement must be boolean');
    return this.body.analyze(context);
  };

  WhileLoop.prototype.optimize = function() {
    this.condition = this.condition.optimize();
    this.body = this.body.optimize();
    if (this.condition instanceof BooleanLiteral && this.condition.value() === false) {
      return null;
    }
    return this;
  };

  return WhileLoop;

})();

module.exports = WhileLoop;