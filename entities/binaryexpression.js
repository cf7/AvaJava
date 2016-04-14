var Type = require('./type.js');
var IntegerLiteral = require('./integerliteral.js');
var BooleanLiteral = require('./booleanliteral.js');
var VariableReference = require('./variablereference.js');

var BinaryExpression = (function () {

    function BinaryExpression (op, left, right) {
        console.log(op.lexeme);
        this.operator = op;
        this.left = left;
        console.log("CONSTRUCTOR: " + this.left);
        this.right = right;
    }
    
    BinaryExpression.prototype.toString = function() {
        return `( ${this.operator.lexeme} ${this.left} ${this.right} )`;
    };
    
    BinaryExpression.prototype.analyze = function(context) {
        console.log("LEFT: " + this.left.constructor);
        this.left.analyze(context);
        console.log("LEFT: " + this.left.constructor);

        console.log("After analyze###########: " + this.left.type);
        this.right.analyze(context);
        var operator = this.operator.lexeme;
        switch (operator) {
          case '<':
          case '<=':
          case '>=':
          case '>':
            this.mustHaveIntegerOperands();
            return this.type = Type.BOOL;
          case '==':
          case '!=':
            this.mustHaveCompatibleOperands();
            return this.type = Type.BOOL;
          case 'and':
          case 'or':
            this.mustHaveBooleanOperands();
            return this.type = Type.BOOL;
          default:
            this.mustHaveIntegerOperands();
            return this.type = Type.INT;
        }
    };
    
    BinaryExpression.prototype.mustHaveIntegerOperands = function() {
        var error = this.operator.lexeme + " must have integer operands";
        console.log("inside mustHaveIntegerOperands: " + this.left.type);
        this.left.type.mustBeCompatibleWith(Type.INT, error, this.operator);
        return this.right.type.mustBeCompatibleWith(Type.INT, error, this.operator);
    }

    BinaryExpression.prototype.mustHaveBooleanOperands = function() {
        var error = this.operator.lexeme + " must have boolean operands";
        this.left.type.mustBeCompatibleWith(Type.BOOL, error, this.operator);
        return this.right.type.mustBeCompatibleWith(Type.BOOL, error, this.operator);
    }

    BinaryExpression.prototype.mustHaveCompatibleOperands = function() {
        var error = this.operator.lexeme + " must have mutually compatible operands";
        return this.left.type.mustBeMutuallyCompatibleWith(this.right.type, error, this.operator);
    }

    return BinaryExpression;
})();

module.exports = BinaryExpression;