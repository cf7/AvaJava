"use strict";

var error = require('../error');
var cache = {};

var Type = (function() {
  function Type(name1) {
    this.name = name1;
    cache[this.name] = this;
    this.mixTypeCache = {};
    this.validTypeCache = {};
  }
    
  Type.BOOL = new Type('bool');

  Type.INT = new Type('int');

  Type.STRING = new Type('string');

  Type.FLOAT = new Type('float');

  Type.OBJECT = new Type('object');

  Type.SET = new Type('set');

  Type.LIST = new Type('list');

  Type.ITERABLE = new Type('iterable');

  Type.FUNCTION = new Type('function');
  
  Type.ARBITRARY = new Type('<arbitrary_type>');

  Type.prototype.toString = function() {
    return this.name;
  };

  Type.prototype.analyze = function(context) {
    return this;
  };

  Type.prototype.optimize = function() {
    return this;
  };
  
  Type.prototype.canBeIntOrBool = function(message, location) {
    if (!(this.isCompatibleWith(Type.INT) || this.isCompatibleWith(Type.BOOL))) {
      error(message, location);
    }
  };

  Type.prototype.canBeIntOrString = function(message, location) {
    if (!(this.isCompatibleWith(Type.INT) || this.isCompatibleWith(Type.STRING))) {
      error(message, location);
    }
  };

  Type.prototype.canBeListOrObj = function(message, location) {
    if (!(this.isCompatibleWith(Type.LIST) || this.isCompatibleWith(Type.OBJECT))) {
      error(message, location);
    }
  };

  Type.prototype.mustBeList = function(message, location) {
    if (!(this.isCompatibleWith(Type.LIST))) {
      error(message, location);
    }
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

  Type.prototype.addValidType = function(otherType, circumstance) {
    this.validTypeCache[otherType.name + circumstance] = { type: otherType };
  };

  Type.prototype.isValidType = function(circumstance, message, location) {
    if (!(this.validTypeCache[this.name + circumstance])) {
      error(message, location);
    }
  };

  Type.prototype.removeValidType = function(otherType, circumstance) {
    this.validTypeCache[otherType.name + circumstance] = { type: otherType };
  };

  Type.prototype.canBeCompatibleWith = function(otherType, operator) {
    this.mixTypeCache[this.name + otherType.name + operator] = { operator: operator, type1: this, type2: otherType };
  };

  Type.prototype.isMixedCompatibleWith = function(otherType, operator, message, location) {
      var result = false;

      if (this.mixTypeCache[this.name + otherType.name + operator]) {
        result = this.mixTypeCache[this.name + otherType.name + operator].operator === operator;
      }

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
  OBJECT: Type.OBJECT,
  SET: Type.SET,
  LIST: Type.LIST,
  ITERABLE: Type.ITERABLE,
  FUNCTION: Type.FUNCTION,
  ARBITRARY: Type.ARBITRARY,
  forName: function(name) {
    return cache[name];
  }
};