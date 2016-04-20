var BooleanLiteral, Type;

Type = require('./type');

BooleanLiteral = (function() {
  function BooleanLiteral(name) {
    this.token = name;
    this.name = name.lexeme;
  }

  BooleanLiteral.prototype.getToken = function() {
    return this.token;
  };
  
  BooleanLiteral.prototype.value = function() {
    return this.name === 'true';
  };

  BooleanLiteral.prototype.toString = function() {
    return this.name;
  };

  BooleanLiteral.prototype.analyze = function(context) {
    return this.type = Type.BOOL;
  };

  BooleanLiteral.prototype.optimize = function() {
    return this;
  };

  return BooleanLiteral;

})();

module.exports = BooleanLiteral;