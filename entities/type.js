"use strict";

var error = require('../error');
var cache = {};

var Type = (function() {
  function Type(name1) {
    this.name = name1;
    cache[this.name] = this;
    this.mixTypeCache = {};
  }

  Type.BOOL = new Type('bool');

  Type.INT = new Type('int');

  Type.STRING = new Type('string');

  Type.FLOAT = new Type('float');

  Type.ITERABLE = new Type('iterable');

  Type.FUNCTION = new Type('function');

  // make sure to export after adding more types!!!

  Type.ARBITRARY = new Type('<arbitrary_type>');

  Type.prototype.toString = function() {
    return this.name;
  };

  Type.prototype.analyze = function(context) {
    // using this for undefined varDecl
  };

  Type.prototype.mustBeInteger = function(message, location) {
    return this.mustBeCompatibleWith(Type.INT, message);
  };

  Type.prototype.mustBeBoolean = function(message, location) {
    return this.mustBeCompatibleWith(Type.BOOL, message);
  };

  Type.prototype.mustBeCompatibleWith = function(otherType, message, location) {
    if (!this.isCompatibleWith(otherType)) {
      return error(message, location);
    }
  };

  Type.prototype.mustBeMutuallyCompatibleWith = function(otherType, message, location) {
    if (!(this.isCompatibleWith(otherType || otherType.isCompatibleWith(this)))) {
      return error(message, location);
    }
  };

  Type.prototype.isCompatibleWith = function(otherType) {
    return this === otherType || this === Type.ARBITRARY || otherType === Type.ARBITRARY;
  };

  Type.prototype.canBeCompatibleWith = function(otherType, operator) {
    // can be compatiblewith otherType given current operator
    this.mixTypeCache[this.name + otherType.name] = { operator: operator, type1: this, type2: otherType };
  };

  Type.prototype.isMixedCompatibleWith = function(otherType, operator, message, location) {
      var result = false;
      console.log(this);
      console.log(otherType);
      if (this.mixTypeCache[this.name + otherType.name]) {
        result = this.mixTypeCache[this.name + otherType.name].operator === operator;
      }

      // hardcoding result of string * int for now
      if (result) {
        if (this.name === 'int' && otherType.name === 'int') {
          return Type.INT;
        } else {
          return Type.STRING;
        }
      } else {
        return error(message, location);
      }

  };

  return Type;

})();

module.exports = {
  BOOL: Type.BOOL,
  INT: Type.INT,
  STRING: Type.STRING,
  FLOAT: Type.FLOAT,
  ITERABLE: Type.ITERABLE,
  FUNCTION: Type.FUNCTION,
  ARBITRARY: Type.ARBITRARY,
  forName: function(name) {
    return cache[name];
  }
};